#!/bin/bash
# Pull Chris's V3 comments from Slack #forge into _bmad-output/chris-feedback-current.md
# Usage: SLACK_BOT_TOKEN=xoxb-... ./scripts/pull-feedback.sh
# Or: set SLACK_BOT_TOKEN in your shell profile and just run ./scripts/pull-feedback.sh

set -e
TOKEN="${SLACK_BOT_TOKEN:?Set SLACK_BOT_TOKEN env var}"
CHANNEL="C0B5YLKULEL"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

curl -s "https://slack.com/api/conversations.history?channel=$CHANNEL&limit=200" \
  -H "Authorization: Bearer $TOKEN" > "/tmp/forge-history.json"

python3 - <<'PY' > "$ROOT/_bmad-output/chris-feedback-current.md"
import json
from datetime import datetime
with open('/tmp/forge-history.json') as f:
    d = json.load(f)
VERCEL_BOT_ID = "B0B54S3CK9S"
comments = []
for m in d.get('messages', []):
    if m.get('bot_id') != VERCEL_BOT_ID: continue
    text = m.get('text', '')
    if 'deployed successfully' in text or 'promoted to' in text: continue
    if 'New thread on' not in text and 'New reply on' not in text: continue
    comments.append(m)
comments.sort(key=lambda m: float(m.get('ts', 0)))

print('# V3 feedback from Slack #forge')
print()
print(f'Pulled {datetime.now().strftime("%Y-%m-%d %H:%M")}. {len(comments)} comment(s).')
print('Re-pull: `./scripts/pull-feedback.sh`')
print()
print('---\n')
for i, m in enumerate(comments, 1):
    when = datetime.fromtimestamp(float(m['ts'])).strftime('%a %H:%M')
    parts = []
    for a in m.get('attachments', []) or []:
        for k in ('pretext','text','fallback'):
            v = a.get(k)
            if isinstance(v, str) and v.strip() and v.strip() not in parts:
                parts.append(v.strip())
    body = parts[0] if parts else '(no body)'
    author = next((a.get('author_name') for a in m.get('attachments', []) or [] if a.get('author_name')), 'unknown')
    print(f'## {i}. {when} — {author}')
    print()
    print(f'> {body}')
    print()
    print('---\n')
PY
echo "wrote $ROOT/_bmad-output/chris-feedback-current.md"
wc -l "$ROOT/_bmad-output/chris-feedback-current.md"
