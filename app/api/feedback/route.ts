import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

const FEEDBACK_LOG_DIR = path.join(
  process.cwd(),
  "_bmad-output",
  "feedback-log",
);

const ATRIUM_CLI_PATH =
  process.env.ATRIUM_CLI_PATH || "/Users/ayrehldavis/.atrium/bin/atrium";

const SLACK_TIMESTAMP_MAX_AGE_SEC = 60 * 5;

// Stable context the model uses to ground its interpretation of Chris's
// comments. Cached in the system prefix; only the per-request comment varies.
const V3_CONTEXT = `You are parsing design-review feedback Chris (the product owner)
leaves on a Next.js prototype of the Arise Energy "Should I use an energy broker?"
decision tool. Each comment arrives as text mirrored from a Vercel Comments
thread into Slack — comment body, author, deployment page URL, and a link back
to the Vercel comment thread. No screenshot is attached; reason about the
comment text and the page URL alone.

## What you are looking at
The prototype lives at \`app/tools/broker-decision-v3/\` in a Next.js 16 App
Router codebase (React 19, Tailwind v4, non-strict TypeScript). It composes a
landing-page-style flow with these sections in order:

1. \`SiteHeader\` — top nav.
2. \`Hero\` — value prop + lead.
3. \`StatStrip\` — single-row statistic band.
4. \`BrokerDecisionV3\` — the interactive decision tool itself (the main thing).
   Internally uses \`SmartForm\`, \`SelectionCard\`, \`Interstitial\`, \`ResultCard\`,
   \`BillBreakdownCard\`, \`RenewalWindowCard\`, \`OutcomePaths\`, \`SupplierBidStack\`,
   \`LeadMagnet\`, \`StateMap\`.
5. \`WhyThisMatters\` — why-this-tool exists section.
6. \`HowToVet\` — supplier vetting guidance.
7. \`SocialProof\` — testimonials/logos.
8. \`FaqSection\` — FAQ accordion.
9. \`CtaBand\` — closing CTA.
10. \`Footer\`.

Component files are at \`app/tools/broker-decision-v3/_components/<Name>.tsx\`.
Logic for recommendation lives in \`_lib/recommend.ts\`; types in \`_lib/types.ts\`.

## Visual system
Design tokens: the Arise palette uses Tailwind utilities like \`arise-50\`,
\`arise-300\`, \`arise-50/60\` (the green-leaning brand color), and a
\`v1-orb-drift\` ambient background motif. Text color is \`#0A1F1F\` (near-black).
The hero uses a gradient \`bg-gradient-to-b from-arise-50 via-white to-arise-50/60\`.

## How Chris reviews
Chris is the product owner. He's pragmatic, sometimes terse. He flags problems
mainly along these axes:
- **copy** — wording, headline tone, microcopy, voice, marketing-speak he wants
  removed, claims that overpromise.
- **layout** — spacing, alignment, hierarchy, where a section sits in the page,
  responsive behavior, the visual order of cards.
- **color** — palette choices, contrast, brand-fidelity, accent usage.
- **behavior** — interaction logic, form behavior, what happens on click, state
  flow, validation, error handling.
- **question** — he's asking something or unsure, not directing a change.
- **praise** — he likes it; no change needed.

His comments are typically short and target-implied — "the heading feels too
marketing-speak" without naming which heading; "the bid stack is cluttered"
without specifying which card. Use the page URL to scope which section's
components are plausibly in play.

## Urgency
- **blocking** — must be fixed before the next review pass. Examples: factual
  errors in copy that misrepresent the product, broken interaction, illegible
  contrast, anything that breaks the demo.
- **iteration** — should be addressed in the next design cycle, but doesn't
  block the current review. Most feedback lands here.
- **nice-to-have** — polish, taste, would-be-nice. Skip if time-constrained.

## What you produce
A JSON object with these fields exactly (the schema is enforced):
- \`classification\`: one of \`copy | layout | color | behavior | question | praise\`.
- \`urgency\`: one of \`blocking | iteration | nice-to-have\`.
- \`summary\`: one sentence, terse, design-language-fluent. No marketing words
  ("delightful", "intuitive", "engaging" — banned). What is being said, plainly.
- \`suggested_action\`: a concrete next step a designer can act on without
  re-reading the comment. Imperative verb. If the comment is a question, the
  action is "answer the question — <restate it>". If praise, action is
  "no action; surface to team in next standup".
- \`affected_files\` (optional): file paths under \`app/tools/broker-decision-v3/\`
  that you can confidently infer from the page URL and the comment's wording.
  Best-effort; omit if you're guessing.

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
    affected_files: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["classification", "urgency", "summary", "suggested_action"],
  additionalProperties: false,
} as const;

interface ParsedFeedback {
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

interface SlackEventPayload {
  type?: string;
  challenge?: string;
  event_id?: string;
  event?: {
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
  };
}

interface ExtractedComment {
  text: string;
  author: string;
  pageUrl: string;
  commentUrl: string;
}

type SigVerifyResult =
  | { ok: true; reason?: undefined }
  | { ok: false; reason: string };

function verifySlackSignature(
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

// Walk Block Kit blocks + legacy attachments for any text content. Vercel-for-Slack
// posts the actual comment body inside an `event.attachments[]` block (legacy
// Slack attachment format), not inside `event.blocks`. We walk both shapes.
function flattenBlockText(input: unknown): string {
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
      // Text-carrying keys across Block Kit AND legacy attachments
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

function extractCommentFromSlack(
  ev: NonNullable<SlackEventPayload["event"]>,
): ExtractedComment {
  const blockText = flattenBlockText(ev.blocks);
  const attachmentText = flattenBlockText(ev.attachments);
  const combinedText = [ev.text || "", blockText, attachmentText]
    .filter(Boolean)
    .join("\n")
    .trim();

  // Slack mrkdwn link form: <https://...|label>  OR  plain https://... URLs
  const allLinks = [
    ...combinedText.matchAll(/<(https?:\/\/[^|>\s]+)(?:\|[^>]*)?>/g),
  ].map((m) => m[1]);
  const bareLinks = [
    ...combinedText.matchAll(/https?:\/\/[^\s<>"]+/g),
  ].map((m) => m[0]);
  const urls = [...new Set([...allLinks, ...bareLinks])];

  const commentUrl =
    urls.find((u) => u.includes("vercel.com/") && /comment|thread/i.test(u)) ||
    urls.find((u) => u.includes("vercel.com/")) ||
    "";
  const pageUrl =
    urls.find((u) => /\.vercel\.app(\/|$)/.test(u)) ||
    urls.find((u) => !u.includes("vercel.com/")) ||
    "";

  // Author: try a "by @name" / "from @name" pattern in the message; fall back
  // to the bot username (typically "Vercel"). The actual comment author is
  // mentioned inside the bot's message, not as the message sender.
  const authorMatch =
    combinedText.match(/(?:by|from)\s+@?([A-Za-z][\w.-]{1,40})/i) ||
    combinedText.match(/@([A-Za-z][\w.-]{1,40})/);
  const author = authorMatch ? authorMatch[1] : ev.username || "Unknown";

  return {
    text: combinedText,
    author,
    pageUrl,
    commentUrl,
  };
}

async function parseFeedbackWithClaude(input: {
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

async function writeFeedbackLog(
  parsed: ParsedFeedback,
  meta: {
    slackEventId: string;
    commentText: string;
    pageUrl: string;
    commentUrl: string;
    author: string;
  },
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${timestamp}-${sanitizeForFilename(meta.slackEventId)}.md`;
  // Vercel serverless funcs only have /tmp as writable. Fall back to /tmp when
  // process.cwd()-rooted path is read-only (Vercel) or when running in any
  // managed env. Local dev still uses _bmad-output/feedback-log/.
  const onVercel = !!process.env.VERCEL;
  const logDir = onVercel ? "/tmp/feedback-log" : FEEDBACK_LOG_DIR;
  const filepath = path.join(logDir, filename);

  await fs.mkdir(logDir, { recursive: true });

  const affectedLine =
    parsed.affected_files && parsed.affected_files.length
      ? `**Affected files:** ${parsed.affected_files.join(", ")}\n\n`
      : "";

  const body = `---
source: vercel-comments-via-slack
slack_event_id: ${meta.slackEventId}
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

async function notifyAtrium(
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
    console.error("[feedback] atrium notify failed:", err);
  }
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

  // Slack URL verification handshake (one-time, on Events API endpoint setup).
  // Slack POSTs { type: "url_verification", challenge: "..." } and expects the
  // challenge echoed back. This must happen BEFORE signature verification — at
  // setup time the configured secret may not yet match what Slack is using.
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
    return NextResponse.json({ status: "ignored", code: "not_message" }, { status: 200 });
  }

  // Only react to Vercel bot messages. Subtype "bot_message" is the standard
  // Slack flag for messages posted by an integration. (Other bot subtypes
  // exist; we accept anything with a bot_id or the bot_message subtype.)
  const isBot = ev.subtype === "bot_message" || Boolean(ev.bot_id);
  if (!isBot) {
    return NextResponse.json({ status: "ignored", code: "not_bot" }, { status: 200 });
  }

  const extracted = extractCommentFromSlack(ev);
  if (!extracted.text) {
    return NextResponse.json(
      { status: "error", code: "no_comment_text" },
      { status: 400 },
    );
  }

  const slackEventId = payload.event_id || `noeid-${Date.now()}`;

  let parsed: ParsedFeedback;
  try {
    parsed = await parseFeedbackWithClaude({
      commentText: extracted.text,
      pageUrl: extracted.pageUrl,
      commentUrl: extracted.commentUrl,
      author: extracted.author,
    });
  } catch (err) {
    console.error("[feedback] Claude parsing failed:", err);
    return NextResponse.json(
      { status: "error", code: "parse_failed" },
      { status: 502 },
    );
  }

  // Always console.log the parsed result — this is the V1 output channel for
  // Vercel deployment (visible in Vercel function logs). fs write + atrium
  // notify are best-effort below.
  console.log(
    "[feedback] parsed:",
    JSON.stringify({
      slack_event_id: slackEventId,
      author: extracted.author,
      page: extracted.pageUrl,
      comment: extracted.text,
      classification: parsed.classification,
      urgency: parsed.urgency,
      summary: parsed.summary,
      suggested_action: parsed.suggested_action,
      affected_files: parsed.affected_files,
    }),
  );

  let logRelPath = "(unwritten)";
  try {
    const logPath = await writeFeedbackLog(parsed, {
      slackEventId,
      commentText: extracted.text,
      pageUrl: extracted.pageUrl,
      commentUrl: extracted.commentUrl,
      author: extracted.author,
    });
    logRelPath = process.env.VERCEL
      ? logPath
      : path.relative(process.cwd(), logPath);
  } catch (err) {
    console.warn("[feedback] writeFeedbackLog failed:", err);
  }

  // notifyAtrium already swallows errors internally; safe to call from Vercel
  // (the execFile will simply fail when the local atrium CLI path doesn't
  // exist on the serverless host — logged as a warning, doesn't 5xx).
  await notifyAtrium(parsed, logRelPath);

  return NextResponse.json(
    {
      status: "ok",
      classification: parsed.classification,
      urgency: parsed.urgency,
      logged: logRelPath,
    },
    { status: 200 },
  );
}
