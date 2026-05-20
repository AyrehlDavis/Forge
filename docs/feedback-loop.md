# V3 review feedback loop

Closes the gap between Chris reviewing the V3 preview and the designer
receiving a structured, dispatch-ready feedback item — no Slack screenshots,
no manual parsing.

## Flow

```
Chris drops a comment via the Vercel Toolbar on the V3 preview
            │
            ▼
Vercel-for-Slack integration posts the comment as a thread
in the subscribed Slack channel (real-time, bidirectional)
            │
            ▼
Slack Events API POSTs message.channels event (bot message)
to /api/feedback with X-Slack-Signature
            │
            ▼
Route verifies Slack signature + replay-window, parses event
payload, extracts comment text + author + page URL + thread URL
            │
            ▼
Claude Opus 4.7 text-only call (adaptive thinking, structured output)
            │
            ▼
Structured JSON: classification / urgency / summary / suggested_action / affected_files
            │
            ├── Written to _bmad-output/feedback-log/{ISO}-{slackEventId}.md
            └── atrium agent message → Ayrehl's pane (if ATRIUM_AYREHL_PANE_ID set)
```

## Components

| Piece | Location |
|---|---|
| Webhook receiver + parser + notify | `app/api/feedback/route.ts` |
| Persisted feedback (output) | `_bmad-output/feedback-log/*.md` |
| Parked FeedbackWidget (Azure-fallback) | `app/tools/broker-decision-v3/_components/FeedbackWidget.tsx` |
| V3 layout that mounts the parked widget | `app/tools/broker-decision-v3/layout.tsx` |

`FeedbackWidget.tsx` + `layout.tsx` were built before the pivot to Vercel
Comments. They're kept in place as a fallback for the eventual Azure migration
(when Vercel Comments stops working) — gated to `null` unless both
`NEXT_PUBLIC_FEEDBACK_ENABLED === 'true'` and a destination ID are set, so
they ship with zero overhead in the current setup.

## Env vars

See `.env.example` for the full list. Server-side vars:

- `SLACK_SIGNING_SECRET` (required) — signing secret from your Slack app's
  Basic Information page; used to HMAC-verify `X-Slack-Signature`
- `ANTHROPIC_API_KEY` (required) — Claude Opus 4.7 access
- `ATRIUM_AYREHL_PANE_ID` (optional) — destination pane for atrium notify; if
  unset, the route warns and skips notify but still writes the log
- `ATRIUM_CLI_PATH` (optional) — overrides the default atrium CLI binary path

## Claude call shape

Opus 4.7 with text-only input (no multimodal — the Slack mirror of a Vercel
comment carries text + author + URLs but not the comment's attached image).

- `thinking: { type: "adaptive" }` — Opus 4.7 ships adaptive thinking off by
  default; we turn it on explicitly. Helps when the comment is terse or the
  target is implied.
- `output_config.effort: "high"` — minimum effort for intelligence-sensitive
  work per the claude-api skill standards.
- `output_config.format: json_schema` — schema-enforced JSON. No regex parsing
  of free text.
- `cache_control: { type: "ephemeral" }` on the V3 context system block — the
  V3 architecture description doesn't change across requests; only the comment
  varies. Cache reads pay ~0.1× the input rate after the first request.

The schema enforces this shape:

```ts
{
  classification: 'copy' | 'layout' | 'color' | 'behavior' | 'question' | 'praise',
  urgency: 'blocking' | 'iteration' | 'nice-to-have',
  summary: string,
  suggested_action: string,
  affected_files?: string[]
}
```

## Fallback path: Copy for Agents

If text-only Claude classification turns out to be lossy in practice (e.g.
Chris consistently pins comments where the visual context matters more than
the words), the manual fallback is the Vercel Toolbar's **Copy for Agents**
button. From any open comment thread, Chris (or anyone) clicks it to copy a
structured payload — URL, viewport, node path, React component tree, comment
text — to the clipboard. That payload can be pasted directly into the agent
context where multimodal grounding is needed.

This isn't wired automatically; it's a manual escape hatch. Don't reach for it
until the loop is running and a real recall problem shows up.

## Setting up the Vercel-for-Slack bridge

Two integrations need installing — one on the Vercel side, one on Slack:

1. **Vercel-for-Slack app.** From the Vercel dashboard, go to **Integrations →
   Marketplace → Slack** and install. OAuth into the Slack workspace. After
   install, in the target Slack channel run `/vercel subscribe` and pick the
   `lp1-v3-5` project. Optionally scope to specific pages/branches.
   - **Note:** Private channels require inviting `@Vercel` first via
     `/invite @Vercel` in the channel.

2. **Custom Slack app for the Events API webhook.** This is the piece that
   POSTs to `/api/feedback` when the Vercel bot drops a new comment in the
   subscribed channel.
   - Go to `api.slack.com/apps` → **Create New App** → From Scratch. Pick the
     same Slack workspace.
   - **Basic Information → App Credentials → Signing Secret**: copy into
     `SLACK_SIGNING_SECRET` in the Vercel project env.
   - **Event Subscriptions → Enable Events**: paste the production URL
     `https://<deployment>.vercel.app/api/feedback`. Slack will POST a
     `url_verification` challenge; the route handles it automatically and
     responds with the challenge value. Verification turns green.
   - **Subscribe to bot events**: add `message.channels`. Save changes.
   - **OAuth & Permissions**: under Bot Token Scopes, add `channels:history`
     (so the bot can read the channel where Vercel posts comments). Install
     the app to the workspace.
   - **In Slack**, invite the new app's bot to the same channel where Vercel
     comments are mirrored: `/invite @<your-app-name>`. Without this, the
     Events API doesn't fire for that channel.

The atrium pane ID (`ATRIUM_AYREHL_PANE_ID`) can be discovered from any
atrium pane:

```bash
"$ATRIUM_CLI_PATH" pane list --json | \
  jq -r '.[] | select(.room == "Review cycle" and .adapter == "claude-code") | .id'
```

## Testing locally

```bash
# 1. Set SLACK_SIGNING_SECRET + ANTHROPIC_API_KEY in .env.local (do NOT commit)
# 2. Run dev server
npm run dev

# 3. Hand-fire a Slack-shaped event with a valid signature
SECRET="$SLACK_SIGNING_SECRET"
TS=$(date +%s)
BODY='{"type":"event_callback","event_id":"Ev-test-1","event":{"type":"message","subtype":"bot_message","bot_id":"B0VERCEL","username":"Vercel","text":"New comment from @chris on <https://lp1-v3-5.vercel.app/tools/broker-decision-v3|the V3 preview>: the hero heading feels like marketing speak — make it more direct. <https://vercel.com/ayrehl-davis-projects/lp1-v3-5/deployments/abc/comments/xyz|View thread>"}}'
BASE="v0:${TS}:${BODY}"
SIG="v0=$(printf '%s' "$BASE" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')"
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -H "X-Slack-Request-Timestamp: $TS" \
  -H "X-Slack-Signature: $SIG" \
  -d "$BODY"
```

Successful response:

```json
{
  "status": "ok",
  "classification": "copy",
  "urgency": "iteration",
  "logged": "_bmad-output/feedback-log/2026-05-20T03-17-30-000Z-Ev-test-1.md"
}
```

For the Slack URL verification handshake, Slack POSTs:

```json
{ "type": "url_verification", "challenge": "<random>" }
```

The route detects this `type` BEFORE signature verification (because the secret
on Slack's side isn't bound to your endpoint yet at handshake time) and echoes
the challenge back. After that, normal Events API requests go through the full
signature + replay check.

## Out of scope (V1)

- **Auto-PR generation** — manual dispatch to the V3 build pane is fine for now.
- **Comment-to-Jira sync** — defer. Vercel Comments support a "Convert to
  Issue" manual action for Linear/Jira/GitHub if you want it later.
- **Multi-user routing** — assumes Chris is the only reviewer.
- **Async-mode handler with `after()`** — current handler runs Claude
  synchronously, which can take 3–8s. Slack retries on >3s timeouts; we accept
  occasional dupes (idempotency via `slack_event_id` in the log filename
  means re-writes overwrite the same file; atrium notify may dupe). If retry
  noise becomes a real problem, wrap the Claude call in Next.js 16's `after()`.
- **Image attachments to comments** — Vercel Comments support pinning with
  images, but the Slack mirror loses them. The route is text-only. See the
  **Fallback path: Copy for Agents** section above for the manual escape hatch.
- **Production hardening** — no rate limits, dead-letter queue, observability
  beyond `console.error`. Acceptable for a prototype-phase feedback loop;
  revisit if the loop survives past the V3 review cycle.

## Migration note: when LP1 eventually moves to Azure

Vercel Comments only works on Vercel-hosted previews. When LP1 deploys to
Azure, the Slack mirror dries up — there's no Comments → Slack pipeline.
The `/api/feedback` route survives the move (no Vercel-specific dependencies
in the handler itself), but the *source* of events needs to change. Two
likely replacements at that point:

1. **Re-enable the parked `FeedbackWidget`** with a third-party tool (Marker.io,
   FasterFixes, BugHerd) that works on any URL. The widget already exists,
   gated behind env vars — flip them on, point at the new tool's destination.
2. **Bring back the Slack-screenshot workflow** but automated: a Slack bot
   that watches a `#design-review` channel for screenshots+text from Chris and
   forwards each as a message-event payload to `/api/feedback`. Same route
   handler, swap the trigger.
