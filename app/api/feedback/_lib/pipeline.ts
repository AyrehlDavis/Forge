// Shared feedback-pipeline helpers used by both the Slack Events API webhook
// route (/api/feedback) and the cron polling route (/api/feedback/poll).
//
// The Slack Events API doesn't relay messages between apps reliably — Vercel-
// for-Slack posts comments via incoming webhook integration, and other apps
// (our Demo App) don't receive `message.groups` events for those posts. The
// polling route works around it by reading #forge history directly.

import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import Anthropic from "@anthropic-ai/sdk";

const execFileAsync = promisify(execFile);

export const FEEDBACK_LOG_DIR = path.join(
  process.cwd(),
  "_bmad-output",
  "feedback-log",
);

export const ATRIUM_CLI_PATH =
  process.env.ATRIUM_CLI_PATH || "/Users/ayrehldavis/.atrium/bin/atrium";

const V3_CONTEXT = `You are parsing design-review feedback Chris (the product owner)
leaves on a Next.js prototype of the Arise Energy "Should I use an energy broker?"
decision tool. Each comment arrives as text mirrored from a Vercel Comments
thread into Slack — comment body, author, deployment page URL, and a link back
to the Vercel comment thread. No screenshot is attached; reason about the
comment text and the page URL alone.

The prototype lives at \`app/tools/broker-decision-v3/\` in a Next.js 16 App
Router codebase. Sections in order: SiteHeader, Hero, StatStrip,
BrokerDecisionV3 (the interactive tool — uses SmartForm, SelectionCard,
Interstitial, ResultCard, BillBreakdownCard, RenewalWindowCard, OutcomePaths,
SupplierBidStack, LeadMagnet, StateMap), WhyThisMatters, HowToVet, SocialProof,
FaqSection, CtaBand, Footer. Component files live under
\`app/tools/broker-decision-v3/_components/<Name>.tsx\`. Recommendation logic is
in \`_lib/recommend.ts\`. Design tokens use Tailwind \`arise-*\` palette.

Chris is the product owner. He's pragmatic, sometimes terse. His comments are
usually short and target-implied — "the heading feels too marketing-speak"
without naming which heading; "the bid stack is cluttered" without specifying
which card. Use the page URL to scope which section's components are plausibly
in play.

Classifications:
- copy — wording, headline tone, microcopy, voice, marketing-speak, claims
- layout — spacing, alignment, hierarchy, section order, responsive
- color — palette, contrast, brand-fidelity, accent usage
- behavior — interaction logic, form behavior, click handlers, state, validation
- question — Chris is asking something, not directing a change
- praise — he likes it, no change needed

Urgency:
- blocking — must be fixed before next review pass; factual errors, broken
  interaction, illegible contrast, anything that breaks the demo
- iteration — should be addressed in the next design cycle but doesn't block
  the current review. Most feedback lands here.
- nice-to-have — polish, taste; skip if time-constrained

Produce JSON with: classification, urgency, summary (terse, design-language-
fluent, no marketing words like "delightful"/"intuitive"/"engaging"),
suggested_action (concrete imperative — for questions, "Answer the question —
<restate it>"; for praise, "no action; surface to team in next standup"),
affected_files (optional; file paths under app/tools/broker-decision-v3/ you
can confidently infer from the page URL + comment wording).

Be terse. The designer reads many of these in a row.`;

const feedbackSchema = {
  type: "object",
  properties: {
    classification: {
      type: "string",
      enum: ["copy", "layout", "color", "behavior", "question", "praise"],
    },
    urgency: {
      type: "string",
      enum: ["blocking", "iteration", "nice-to-have"],
    },
    summary: { type: "string" },
    suggested_action: { type: "string" },
    affected_files: { type: "array", items: { type: "string" } },
  },
  required: ["classification", "urgency", "summary", "suggested_action"],
  additionalProperties: false,
} as const;

export interface ParsedFeedback {
  classification:
    | "copy"
    | "layout"
    | "color"
    | "behavior"
    | "question"
    | "praise";
  urgency: "blocking" | "iteration" | "nice-to-have";
  summary: string;
  suggested_action: string;
  affected_files?: string[];
}

export interface SlackMessage {
  type?: string;
  subtype?: string;
  text?: string;
  blocks?: unknown[];
  attachments?: unknown[];
  ts?: string;
  username?: string;
  bot_id?: string;
  channel?: string;
  user?: string;
}

export interface ExtractedComment {
  text: string;
  author: string;
  pageUrl: string;
  commentUrl: string;
}

const SLACK_TIMESTAMP_MAX_AGE_SEC = 60 * 5;

export type SigVerifyResult =
  | { ok: true; reason?: undefined }
  | { ok: false; reason: string };

export function verifySlackSignature(
  rawBody: string,
  signatureHeader: string | null,
  timestampHeader: string | null,
  secret: string,
): SigVerifyResult {
  if (!signatureHeader || !timestampHeader) {
    return { ok: false, reason: "missing_signature_headers" };
  }
  const timestamp = parseInt(timestampHeader, 10);
  if (!Number.isFinite(timestamp)) {
    return { ok: false, reason: "invalid_timestamp" };
  }
  const ageSec = Math.abs(Math.floor(Date.now() / 1000) - timestamp);
  if (ageSec > SLACK_TIMESTAMP_MAX_AGE_SEC) {
    return { ok: false, reason: "timestamp_too_old" };
  }
  const base = `v0:${timestampHeader}:${rawBody}`;
  const expected =
    "v0=" + crypto.createHmac("sha256", secret).update(base).digest("hex");
  const a = Buffer.from(signatureHeader);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return { ok: false, reason: "length_mismatch" };
  return crypto.timingSafeEqual(a, b)
    ? { ok: true }
    : { ok: false, reason: "signature_mismatch" };
}

// Walk Block Kit blocks + legacy attachments for any text content.
export function flattenBlockText(input: unknown): string {
  if (!input) return "";
  const parts: string[] = [];
  const walk = (node: unknown) => {
    if (node == null) return;
    if (typeof node === "string") {
      parts.push(node);
      return;
    }
    if (Array.isArray(node)) {
      for (const child of node) walk(child);
      return;
    }
    if (typeof node === "object") {
      const obj = node as Record<string, unknown>;
      for (const key of [
        "text",
        "pretext",
        "fallback",
        "title",
        "author_name",
        "value",
        "elements",
        "fields",
        "blocks",
      ]) {
        if (obj[key] !== undefined) walk(obj[key]);
      }
    }
  };
  walk(input);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function extractCommentFromSlack(ev: SlackMessage): ExtractedComment {
  const blockText = flattenBlockText(ev.blocks);
  const attachmentText = flattenBlockText(ev.attachments);
  const combinedText = [ev.text || "", blockText, attachmentText]
    .filter(Boolean)
    .join("\n")
    .trim();

  const allLinks = [
    ...combinedText.matchAll(/<(https?:\/\/[^|>\s]+)(?:\|[^>]*)?>/g),
  ].map((m) => m[1]);
  const bareLinks = [...combinedText.matchAll(/https?:\/\/[^\s<>"]+/g)].map(
    (m) => m[0],
  );
  const urls = [...new Set([...allLinks, ...bareLinks])];

  const commentUrl =
    urls.find((u) => u.includes("vercel.com/") && /comment|thread/i.test(u)) ||
    urls.find((u) => u.includes("vercel.com/")) ||
    urls.find((u) => u.includes("vercel.live/")) ||
    "";
  const pageUrl =
    urls.find((u) => /\.vercel\.app(\/|$)/.test(u)) ||
    urls.find((u) => !u.includes("vercel.com/") && !u.includes("vercel.live/")) ||
    "";

  const authorMatch =
    combinedText.match(/(?:by|from)\s+@?([A-Za-z][\w.-]{1,40})/i) ||
    combinedText.match(/@([A-Za-z][\w.-]{1,40})/);
  const author = authorMatch ? authorMatch[1] : ev.username || "Unknown";

  return { text: combinedText, author, pageUrl, commentUrl };
}

export async function parseFeedbackWithClaude(input: {
  commentText: string;
  pageUrl: string;
  commentUrl: string;
  author: string;
}): Promise<ParsedFeedback> {
  const client = new Anthropic();

  const userText = [
    `Comment from ${input.author}`,
    input.pageUrl ? `on ${input.pageUrl}` : "",
    input.commentUrl ? `(Vercel thread: ${input.commentUrl})` : "",
    "",
    `"${input.commentText}"`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: { type: "json_schema", schema: feedbackSchema },
    },
    system: [
      {
        type: "text",
        text: V3_CONTEXT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: userText }],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude response had no text block");
  }
  return JSON.parse(textBlock.text) as ParsedFeedback;
}

function sanitizeForFilename(s: string): string {
  return s.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 64);
}

export async function writeFeedbackLog(
  parsed: ParsedFeedback,
  meta: {
    slackMessageId: string;
    commentText: string;
    pageUrl: string;
    commentUrl: string;
    author: string;
    source: string;
  },
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${timestamp}-${sanitizeForFilename(meta.slackMessageId)}.md`;
  const onVercel = !!process.env.VERCEL;
  const logDir = onVercel ? "/tmp/feedback-log" : FEEDBACK_LOG_DIR;
  const filepath = path.join(logDir, filename);

  await fs.mkdir(logDir, { recursive: true });

  const affectedLine =
    parsed.affected_files && parsed.affected_files.length
      ? `**Affected files:** ${parsed.affected_files.join(", ")}\n\n`
      : "";

  const body = `---
source: ${meta.source}
slack_message_id: ${meta.slackMessageId}
classification: ${parsed.classification}
urgency: ${parsed.urgency}
author: ${meta.author}
page: ${meta.pageUrl}
vercel_thread: ${meta.commentUrl}
---

## Comment

${meta.commentText}

## Parsed

**Summary:** ${parsed.summary}

**Suggested action:** ${parsed.suggested_action}

${affectedLine}`;

  await fs.writeFile(filepath, body, "utf-8");
  return filepath;
}

export async function notifyAtrium(
  parsed: ParsedFeedback,
  logRelPath: string,
): Promise<void> {
  const targetPaneId = process.env.ATRIUM_AYREHL_PANE_ID;
  if (!targetPaneId) {
    console.warn(
      "[feedback] ATRIUM_AYREHL_PANE_ID unset — skipping atrium notification",
    );
    return;
  }

  const message = [
    `💬 Chris feedback — ${parsed.classification} (${parsed.urgency})`,
    parsed.summary,
    `Proposed: ${parsed.suggested_action}`,
    `See: ${logRelPath}`,
  ].join("\n");

  try {
    await execFileAsync(ATRIUM_CLI_PATH, [
      "agent",
      "message",
      targetPaneId,
      message,
    ]);
  } catch (err) {
    console.warn("[feedback] atrium notify failed (expected on Vercel):", err);
  }
}

// Post a threaded reply in Slack with the parsed classification. Requires the
// bot to have `chat:write` scope (added in a follow-up reinstall). Falls back
// silently if the scope is missing or the token is unset — the parse result
// still lives in console.log.
const URGENCY_EMOJI: Record<ParsedFeedback["urgency"], string> = {
  blocking: "🔴",
  iteration: "🟡",
  "nice-to-have": "🟢",
};
const CLASS_EMOJI: Record<ParsedFeedback["classification"], string> = {
  copy: "✏️",
  layout: "📐",
  color: "🎨",
  behavior: "⚙️",
  question: "❓",
  praise: "🎉",
};

export async function postSlackReply(
  channelId: string,
  threadTs: string,
  parsed: ParsedFeedback,
): Promise<void> {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    console.warn("[feedback] SLACK_BOT_TOKEN unset — skipping Slack reply");
    return;
  }

  const cEmoji = CLASS_EMOJI[parsed.classification] || "";
  const uEmoji = URGENCY_EMOJI[parsed.urgency] || "";
  const affected = parsed.affected_files?.length
    ? `\n*Likely affected:* \`${parsed.affected_files.join("`, `")}\``
    : "";

  const text =
    `${cEmoji} *${parsed.classification}* · ${uEmoji} *${parsed.urgency}*\n` +
    `*Summary:* ${parsed.summary}\n` +
    `*Suggested action:* ${parsed.suggested_action}${affected}\n` +
    `_— Arise Feedback (Claude Opus 4.7)_`;

  try {
    const resp = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        channel: channelId,
        thread_ts: threadTs,
        text,
        unfurl_links: false,
        unfurl_media: false,
      }),
    });
    const result = (await resp.json()) as { ok: boolean; error?: string };
    if (!result.ok) {
      console.warn(
        "[feedback] postSlackReply failed:",
        result.error,
        "— if 'missing_scope', the bot needs `chat:write` reinstalled.",
      );
    }
  } catch (err) {
    console.warn("[feedback] postSlackReply error:", err);
  }
}

// Process a Slack message through the full pipeline. Used by both the Events
// API webhook route and the polling cron. Returns parsed result or null if
// skipped (e.g. no comment body).
export async function processSlackMessage(
  msg: SlackMessage,
  source: "slack-events" | "slack-poll",
  opts?: { channelId?: string; replyInThread?: boolean },
): Promise<{ parsed: ParsedFeedback; logPath: string } | null> {
  const extracted = extractCommentFromSlack(msg);
  if (!extracted.text) return null;

  const slackMessageId = msg.ts || `nots-${Date.now()}`;
  const parsed = await parseFeedbackWithClaude({
    commentText: extracted.text,
    pageUrl: extracted.pageUrl,
    commentUrl: extracted.commentUrl,
    author: extracted.author,
  });

  console.log(
    `[feedback] parsed via ${source}:`,
    JSON.stringify({
      slack_message_id: slackMessageId,
      author: extracted.author,
      page: extracted.pageUrl,
      comment: extracted.text.slice(0, 200),
      classification: parsed.classification,
      urgency: parsed.urgency,
      summary: parsed.summary,
      suggested_action: parsed.suggested_action,
      affected_files: parsed.affected_files,
    }),
  );

  let logPath = "(unwritten)";
  try {
    logPath = await writeFeedbackLog(parsed, {
      slackMessageId,
      commentText: extracted.text,
      pageUrl: extracted.pageUrl,
      commentUrl: extracted.commentUrl,
      author: extracted.author,
      source,
    });
  } catch (err) {
    console.warn("[feedback] writeFeedbackLog failed:", err);
  }

  const logRelPath = process.env.VERCEL
    ? logPath
    : path.relative(process.cwd(), logPath);
  await notifyAtrium(parsed, logRelPath);

  // Reply in the Slack thread so reviewers see the classification inline,
  // not buried in Vercel logs. Best-effort — fails silently if chat:write
  // scope hasn't been granted yet.
  const channelId = opts?.channelId || process.env.SLACK_CHANNEL_ID;
  if ((opts?.replyInThread ?? true) && channelId && msg.ts) {
    await postSlackReply(channelId, msg.ts, parsed);
  }

  return { parsed, logPath };
}
