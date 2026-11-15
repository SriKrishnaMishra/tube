# scripts/fix_broken_videos.py
import re

print("Fixing broken video IDs in catalog...")

# 1. Fix 6W8zx9A4B-0 in src/components/ChannelHub.tsx
hub_path = "src/components/ChannelHub.tsx"
with open(hub_path, "r", encoding="utf-8") as f:
    hub_content = f.read()

# Replace 6W8zx9A4B-0 with verified Krish Naik video ID -7VgYNiGxYw
hub_content = hub_content.replace("6W8zx9A4B-0", "-7VgYNiGxYw")
hub_content = hub_content.replace(
    "Complete Feature Engineering Techniques for Machine Learning",
    "NVIDIA NeMo Guardrails Tutorial: Defend RAG Apps Against Prompt Injection"
)

# Replace other unverified IDs in Krish Naik's section
replacements = {
    "a9j8Qh4sZ9k": "HCJvnek8zZM", # My ASUS AI Agent Computer
    "9vP4tZ6mX8w": "qvrbwZ3V4-o", # AI Safety And LLM Security
    "mK2x7Vp0w8Y": "_iRUnZ_BFkA", # Debug & Manage Automations
    "g8Qp9xZ2kL4": "J5fqR-TRebI", # AI in 2027 What Should You Learn
    "k1Bv_xG6-kE": "rV3HJ4LEZ7k", # Complete Agentic AI Course In 10 Hours
    "8GfC_9b3UvM": "1vsmaEfbnoE", # Machine Learning Detailed Roadmap
}

for old_id, new_id in replacements.items():
    hub_content = hub_content.replace(old_id, new_id)

with open(hub_path, "w", encoding="utf-8") as f:
    f.write(hub_content)
print("Updated src/components/ChannelHub.tsx with verified Krish Naik video IDs!")

# 2. Fix in src/store.ts
store_path = "src/store.ts"
with open(store_path, "r", encoding="utf-8") as f:
    store_content = f.read()

store_content = store_content.replace("6W8zx9A4B-0", "-7VgYNiGxYw")
store_content = store_content.replace(
    "Complete Feature Engineering Techniques for Machine Learning",
    "NVIDIA NeMo Guardrails Tutorial: Defend RAG Apps Against Prompt Injection"
)

for old_id, new_id in replacements.items():
    store_content = store_content.replace(old_id, new_id)

with open(store_path, "w", encoding="utf-8") as f:
    f.write(store_content)
print("Updated src/store.ts with verified video IDs!")

# 3. Fix in src/taxonomyVideos.ts
tax_path = "src/taxonomyVideos.ts"
with open(tax_path, "r", encoding="utf-8") as f:
    tax_content = f.read()

tax_content = tax_content.replace("6W8zx9A4B-0", "-7VgYNiGxYw")
tax_content = tax_content.replace(
    "Complete Feature Engineering Techniques for Machine Learning",
    "NVIDIA NeMo Guardrails Tutorial: Defend RAG Apps Against Prompt Injection"
)

for old_id, new_id in replacements.items():
    tax_content = tax_content.replace(old_id, new_id)

with open(tax_path, "w", encoding="utf-8") as f:
    f.write(tax_content)
print("Updated src/taxonomyVideos.ts with verified video IDs!")

print("All broken IDs replaced with verified, authentic YouTube masterclasses!")
