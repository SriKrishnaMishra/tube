import json
import re

print("Loading verified videos...")
with open("scripts/valid_videos.json", "r", encoding="utf-8") as f:
    valid_videos = json.load(f)

print(f"Total valid videos available: {len(valid_videos)}")

# Load taxonomyVideos.ts
with open("src/taxonomyVideos.ts", "r", encoding="utf-8") as f:
    tax_content = f.read()

# Load store.ts
with open("src/store.ts", "r", encoding="utf-8") as f:
    store_content = f.read()

# Load ChannelHub.tsx
with open("src/components/ChannelHub.tsx", "r", encoding="utf-8") as f:
    hub_content = f.read()

# Find all invalid IDs
with open("scripts/invalid_videos.json", "r", encoding="utf-8") as f:
    invalid_videos = json.load(f)

# Pool of valid replacement IDs
valid_keys = list(valid_videos.keys())
print(f"Pool of valid keys: {len(valid_keys)}")

# Let's inspect how many occurrences of invalid IDs exist in each file
replaced_tax = 0
replaced_store = 0
replaced_hub = 0

idx = 0
for inv_id in invalid_videos:
    if inv_id in tax_content:
        replacement_id = valid_keys[idx % len(valid_keys)]
        rep_meta = valid_videos[replacement_id]
        tax_content = tax_content.replace(f"'{inv_id}'", f"'{replacement_id}'")
        tax_content = tax_content.replace(f'"{inv_id}"', f'"{replacement_id}"')
        replaced_tax += 1
        idx += 1

for inv_id in invalid_videos:
    if inv_id in store_content:
        replacement_id = valid_keys[idx % len(valid_keys)]
        store_content = store_content.replace(f"'{inv_id}'", f"'{replacement_id}'")
        store_content = store_content.replace(f'"{inv_id}"', f'"{replacement_id}"')
        replaced_store += 1
        idx += 1

for inv_id in invalid_videos:
    if inv_id in hub_content:
        replacement_id = valid_keys[idx % len(valid_keys)]
        hub_content = hub_content.replace(f"'{inv_id}'", f"'{replacement_id}'")
        hub_content = hub_content.replace(f'"{inv_id}"', f'"{replacement_id}"')
        replaced_hub += 1
        idx += 1

print(f"Replaced in taxonomyVideos.ts: {replaced_tax}")
print(f"Replaced in store.ts: {replaced_store}")
print(f"Replaced in ChannelHub.tsx: {replaced_hub}")

with open("src/taxonomyVideos.ts", "w", encoding="utf-8") as f:
    f.write(tax_content)

with open("src/store.ts", "w", encoding="utf-8") as f:
    f.write(store_content)

with open("src/components/ChannelHub.tsx", "w", encoding="utf-8") as f:
    f.write(hub_content)

print("Saved updated files!")
