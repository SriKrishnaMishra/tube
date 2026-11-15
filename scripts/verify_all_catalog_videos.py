# scripts/verify_all_catalog_videos.py
import urllib.request
import json
import re
import sys

print("Extracting all video IDs from catalog...")

# 1. From src/store.ts
with open("src/store.ts", "r", encoding="utf-8") as f:
    store_text = f.read()

# 2. From src/taxonomyVideos.ts
with open("src/taxonomyVideos.ts", "r", encoding="utf-8") as f:
    tax_text = f.read()

# 3. From src/components/ChannelHub.tsx
with open("src/components/ChannelHub.tsx", "r", encoding="utf-8") as f:
    hub_text = f.read()

store_vids = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", store_text)
tax_vids = re.findall(r"videoId:\s*['\"]([^'\"]+)['\"]", tax_text)
hub_vids = re.findall(r"videoId:\s*['\"]([^'\"]+)['\"]", hub_text)

all_ids = set()
for v in store_vids + tax_vids + hub_vids:
    # Filter only 11-char YouTube IDs
    if len(v) == 11 and not v.startswith("tax-") and not v.startswith("pl-"):
        all_ids.add(v)

print(f"Total unique YouTube video IDs found: {len(all_ids)}")

invalid_ids = []
valid_count = 0

for idx, vid in enumerate(all_ids):
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=4) as response:
            if response.status == 200:
                valid_count += 1
    except urllib.error.HTTPError as e:
        print(f"[INVALID] {vid} -> HTTP {e.code}")
        invalid_ids.append((vid, e.code))
    except Exception as e:
        print(f"[TIMEOUT/ERROR] {vid} -> {e}")

print(f"\nVerification Results:")
print(f"Valid videos: {valid_count}")
print(f"Invalid videos: {len(invalid_ids)}")
print("Invalid IDs list:", invalid_ids)
