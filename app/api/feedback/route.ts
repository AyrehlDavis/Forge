// POST /api/feedback — Slack Events API webhook target.
//
// NOTE: Slack's Events API doesn't reliably relay messages between apps. The
// Vercel-for-Slack app posts comment notifications via incoming webhook
// integration, and other apps subscribed to `message.groups`/`message.channels`
// don't receive those events. This route still handles the URL verification
// handshake + any user-posted messages that DO fire events, but the primary
// path for catching Vercel comments is the cron at /api/feedback/poll.

import { NextResponse } from "next/server";
import {
  processSlackMessage,
  verifySlackSignature,
  type SlackMessage,
} from "./_lib/pipeline";

export const runtime = "nodejs";

interface SlackEventPayload {
  type?: string;
  challenge?: string;
  event_id?: string;
  event?: SlackMessage;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const secret = process.env.SLACK_SIGNING_SECRET;
  if (!secret) {
    console.error("[feedback] SLACK_SIGNING_SECRET not configured");
    return NextResponse.json(
      { status: "error", code: "not_configured" },
      { status: 500 },
    );
  }

  // URL-verification handshake — must happen BEFORE signature verification at
  // setup time (the configured secret may not yet match what Slack is using).
  let payload: SlackEventPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { status: "error", code: "bad_json" },
      { status: 400 },
    );
  }
  if (payload.type === "url_verification" && payload.challenge) {
    return NextResponse.json({ challenge: payload.challenge }, { status: 200 });
  }

  const verify = verifySlackSignature(
    rawBody,
    request.headers.get("x-slack-signature"),
    request.headers.get("x-slack-request-timestamp"),
    secret,
  );
  if (!verify.ok) {
    return NextResponse.json(
      { status: "error", code: "bad_signature", reason: verify.reason },
      { status: 401 },
    );
  }

  const ev = payload.event;
  if (!ev || ev.type !== "message") {
    return NextResponse.json(
      { status: "ignored", code: "not_message" },
      { status: 200 },
    );
  }

  // Note: we accept ALL message types here (user OR bot). User messages are
  // typically test/debug noise; bot messages are the real signal. In practice
  // Vercel-bot posts don't trigger this route (Slack quirk) — the poll route
  // catches them instead. Keeping this endpoint live as a defense-in-depth
  // path in case Slack ever fixes the bot-to-bot relay.
  const isBot = ev.subtype === "bot_message" || Boolean(ev.bot_id);
  if (!isBot) {
    return NextResponse.json(
      { status: "ignored", code: "not_bot" },
      { status: 200 },
    );
  }

  try {
    const result = await processSlackMessage(ev, "slack-events");
    if (!result) {
      return NextResponse.json(
        { status: "error", code: "no_comment_text" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        status: "ok",
        classification: result.parsed.classification,
        urgency: result.parsed.urgency,
        logged: result.logPath,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[feedback] processSlackMessage failed:", err);
    return NextResponse.json(
      { status: "error", code: "parse_failed" },
      { status: 502 },
    );
  }
}
