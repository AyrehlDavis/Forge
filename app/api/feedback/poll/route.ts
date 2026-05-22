// /api/feedback/poll — runs every minute via Vercel cron (see vercel.json).
//
// Reads recent messages from the configured Slack channel using
// conversations.history, filters to Vercel-bot posts we haven't processed yet,
// runs each through the Claude pipeline. This works around the Slack Events
// API limitation that doesn't relay messages between apps (Vercel-for-Slack
// posts via incoming webhook integration; other apps subscribed to
// message.groups don't receive those events).
//
// Dedup is per-instance using /tmp. Vercel keeps a function instance warm for
// minutes between invocations so most cron firings dedupe cleanly. Cold-start
// resets the dedup state, which means at most one re-process per cold start
// for messages within the lookback window. Acceptable: same Slack ts → same
// log filename (overwrite), only the atrium-notify duplicates.

import { promises as fs } from "node:fs";
import {
  processSlackMessage,
  type SlackMessage,
} from "../_lib/pipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATE_FILE = "/tmp/feedback-poll-state.json";
const LOOKBACK_SEC = 60 * 10; // initial-cold-start lookback (10 min)

interface PollState {
  lastProcessedTs: string; // Slack ts (string of "1234567890.123456")
}

async function readState(): Promise<PollState> {
  try {
    const text = await fs.readFile(STATE_FILE, "utf-8");
    return JSON.parse(text) as PollState;
  } catch {
    const initial = (Math.floor(Date.now() / 1000) - LOOKBACK_SEC).toString();
    return { lastProcessedTs: initial };
  }
}

async function writeState(state: PollState): Promise<void> {
  try {
    await fs.writeFile(STATE_FILE, JSON.stringify(state), "utf-8");
  } catch (err) {
    console.warn("[poll] writeState failed:", err);
  }
}

interface ConversationsHistoryResponse {
  ok: boolean;
  messages?: SlackMessage[];
  has_more?: boolean;
  error?: string;
}

export async function GET(request: Request) {
  // Vercel cron requests include this header automatically when CRON_SECRET
  // env var is set. Reject other callers in that case.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return Response.json({ ok: false, code: "unauthorized" }, { status: 401 });
    }
  }

  const channelId = process.env.SLACK_CHANNEL_ID;
  const botToken = process.env.SLACK_BOT_TOKEN;
  if (!channelId || !botToken) {
    return Response.json(
      { ok: false, code: "not_configured" },
      { status: 500 },
    );
  }

  const state = await readState();

  // Fetch messages newer than lastProcessedTs (exclusive via oldest+1us)
  const oldest = state.lastProcessedTs;
  const url = new URL("https://slack.com/api/conversations.history");
  url.searchParams.set("channel", channelId);
  url.searchParams.set("oldest", oldest);
  url.searchParams.set("inclusive", "false");
  url.searchParams.set("limit", "20");

  let data: ConversationsHistoryResponse;
  try {
    const resp = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${botToken}` },
    });
    data = (await resp.json()) as ConversationsHistoryResponse;
  } catch (err) {
    console.error("[poll] slack fetch failed:", err);
    return Response.json({ ok: false, code: "fetch_failed" }, { status: 502 });
  }

  if (!data.ok) {
    console.error("[poll] slack api error:", data.error);
    return Response.json(
      { ok: false, code: "slack_error", error: data.error },
      { status: 502 },
    );
  }

  const messages = data.messages || [];
  // Slack returns newest-first. Process oldest-first so state.lastProcessedTs
  // advances monotonically even if Claude fails mid-batch.
  const ordered = [...messages].sort((a, b) =>
    (a.ts || "").localeCompare(b.ts || ""),
  );

  const botMessages = ordered.filter(
    (m) => m.subtype === "bot_message" || Boolean(m.bot_id),
  );

  const results: Array<{
    ts: string;
    classification?: string;
    urgency?: string;
    error?: string;
  }> = [];

  let maxTs = state.lastProcessedTs;

  for (const msg of botMessages) {
    const ts = msg.ts || "";
    try {
      const result = await processSlackMessage(msg, "slack-poll");
      if (result) {
        results.push({
          ts,
          classification: result.parsed.classification,
          urgency: result.parsed.urgency,
        });
      } else {
        results.push({ ts, error: "no_comment_text" });
      }
    } catch (err) {
      console.error("[poll] processSlackMessage failed for ts", ts, err);
      results.push({ ts, error: String(err).slice(0, 200) });
    }
    if (ts.localeCompare(maxTs) > 0) maxTs = ts;
  }

  // Advance state even when no bot messages — still bumps lookahead so we
  // don't keep re-scanning the same window.
  if (ordered.length > 0) {
    const newestTs = ordered[ordered.length - 1].ts || maxTs;
    if (newestTs.localeCompare(maxTs) > 0) maxTs = newestTs;
  }
  await writeState({ lastProcessedTs: maxTs });

  return Response.json({
    ok: true,
    scanned: ordered.length,
    bot_messages: botMessages.length,
    processed: results.length,
    last_processed_ts: maxTs,
    results,
  });
}
