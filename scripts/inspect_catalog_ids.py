import json
import re

with open("src/taxonomyVideos.ts", "r", encoding="utf-8") as f:
    tax_content = f.read()

with open("src/store.ts", "r", encoding="utf-8") as f:
    store_content = f.read()

tax_matches = re.findall(r"videoId:\s*['\"]([^'\"]+)['\"]", tax_content)
store_matches = re.findall(r"id:\s*['\"]([A-Za-z0-9_-]{5,20})['\"]", store_content)

print(f"Taxonomy video IDs count: {len(tax_matches)}")
print(f"Store video IDs count: {len(store_matches)}")

all_ids = set(tax_matches + store_matches)
print(f"Total unique IDs across project: {len(all_ids)}")

with open("scripts/invalid_videos.json", "r", encoding="utf-8") as f:
    invalid_data = json.load(f)

invalid_ids = set(invalid_data.keys())
print(f"Known invalid IDs in json: {len(invalid_ids)}")

found_invalid_in_tax = [vid for vid in set(tax_matches) if vid in invalid_ids]
print(f"Invalid in taxonomyVideos: {len(found_invalid_in_tax)}")

found_invalid_in_store = [vid for vid in set(store_matches) if vid in invalid_ids]
print(f"Invalid in store: {len(found_invalid_in_store)}")
