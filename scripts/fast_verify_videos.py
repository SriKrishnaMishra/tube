# scripts/fast_verify_videos.py
import urllib.request
import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

with open("src/store.ts", "r", encoding="utf-8") as f:
    store_text = f.read()
with open("src/taxonomyVideos.ts", "r", encoding="utf-8") as f:
    tax_text = f.read()
with open("src/components/ChannelHub.tsx", "r", encoding="utf-8") as f:
    hub_text = f.read()

all_ids = set()
for text in [store_text, tax_text, hub_text]:
    matches = re.findall(r"['\"]([a-zA-Z0-9_\-]{11})['\"]", text)
    for m in matches:
        if not m.startswith("tax-") and not m.startswith("sub-") and not m.startswith("pl-"):
            all_ids.add(m)

print(f"Total potential video IDs to verify: {len(all_ids)}")

def check_video(vid):
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            if r.status == 200:
                data = json.loads(r.read())
                return (vid, True, data.get("title", ""), data.get("author_name", ""))
    except urllib.error.HTTPError as e:
        return (vid, False, f"HTTP {e.code}", "")
    except Exception as e:
        return (vid, False, str(e), "")

valid_map = {}
invalid_map = {}

with ThreadPoolExecutor(max_workers=20) as executor:
    futures = {executor.submit(check_video, vid): vid for vid in all_ids}
    for future in as_completed(futures):
        vid, ok, title, author = future.result()
        if ok:
            valid_map[vid] = {"title": title, "author": author}
        else:
            invalid_map[vid] = title

print(f"\nChecked {len(all_ids)} videos:")
print(f"  Valid: {len(valid_map)}")
print(f"  Invalid / 404: {len(invalid_map)}")

with open("scripts/valid_videos.json", "w", encoding="utf-8") as f:
    json.dump(valid_map, f, indent=2)

with open("scripts/invalid_videos.json", "w", encoding="utf-8") as f:
    json.dump(invalid_map, f, indent=2)

print("Saved valid to scripts/valid_videos.json and invalid to scripts/invalid_videos.json")
