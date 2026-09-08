# Scheduled Discord outbox

`queue.json` is a list of messages to post to the club Discord automatically.
The `Discord Scheduler` GitHub Action checks it on a cron and posts anything
whose `sendAtUTC` has passed, then flips `sent` to true. No laptop needed.

Each entry:
```json
{
  "id": "2627-1-recap",
  "sendAtUTC": "2026-09-09T20:35:00Z",
  "sent": false,
  "content": "@everyone ..."
}
```
- `sendAtUTC`: ISO 8601 in UTC. 1:35 PM Pacific is 20:35 UTC (summer) or 21:35 UTC (winter).
- `content`: the exact message. A webhook cannot attach files, so link the notes/QR instead of saying "attached".
- The `/astro-meeting` pipeline appends the recap entry each meeting.

Requires a repo secret `DISCORD_WEBHOOK` (Settings > Secrets and variables > Actions).
