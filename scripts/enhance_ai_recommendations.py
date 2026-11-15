# scripts/enhance_ai_recommendations.py
import re

rec_path = "src/components/AIRecommendations.tsx"
with open(rec_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's check imports
print("Current AIRecommendations.tsx length:", len(content))

