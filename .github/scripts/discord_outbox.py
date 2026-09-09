#!/usr/bin/env python3
"""Post any due entries in schedule/queue.json to the Discord webhook."""
import json, os, sys, urllib.request, datetime, pathlib

QUEUE = pathlib.Path("schedule/queue.json")
hook = os.environ.get("DISCORD_WEBHOOK", "").strip()
if not hook:
    print("No DISCORD_WEBHOOK secret set; nothing to do.")
    sys.exit(0)

data = json.loads(QUEUE.read_text()) if QUEUE.exists() else []
now = datetime.datetime.now(datetime.timezone.utc)
changed = False
for item in data:
    if item.get("sent"):
        continue
    try:
        due = datetime.datetime.fromisoformat(item["sendAtUTC"].replace("Z", "+00:00"))
    except Exception as e:
        print("bad sendAtUTC on", item.get("id"), e)
        continue
    if due <= now:
        payload = {"content": item["content"], "allowed_mentions": {"parse": ["everyone"]}}
        req = urllib.request.Request(hook, data=json.dumps(payload).encode(),
                                     headers={"Content-Type": "application/json", "User-Agent": "astro-club-scheduler (github-actions)"})
        try:
            urllib.request.urlopen(req, timeout=30)
            item["sent"] = True
            item["sentAt"] = now.isoformat()
            changed = True
            print("posted", item.get("id"))
        except Exception as e:
            print("post FAILED for", item.get("id"), e)
if changed:
    QUEUE.write_text(json.dumps(data, indent=2) + "\n")
    print("queue updated")
else:
    print("nothing due")
