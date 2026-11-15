import os
import json
from dotenv import load_dotenv

load_dotenv()
from groq import Groq

client = Groq(api_key=os.environ.get('GROQ_API_KEY'), timeout=60.0)

sample_videos = [
    {'videoId': '6W8zx9A4B-0', 'title': 'Complete Feature Engineering Techniques for Machine Learning', 'channel': 'Krish Naik', 'category': 'Machine Learning fundamentals'},
    {'videoId': 'L_Guz73e6fw', 'title': 'Complete Agentic AI Course In 10 Hours - LangChain, LangGraph, RAG', 'channel': 'Krish Naik', 'category': 'Generative AI & LLMs'},
    {'videoId': 'aircAruvnKk', 'title': 'Neural Networks from Scratch - P.1 Intro and Neuron Code', 'channel': 'sentdex', 'category': 'Deep Learning (CNN, RNN, Transformers)'},
    {'videoId': 'fNxaJsNG3-s', 'title': 'Docker in 100 Seconds', 'channel': 'Fireship', 'category': 'DevOps & Containers'},
    {'videoId': 'SqcY0GlETPk', 'title': 'React Tutorial for Beginners [React 19 / 2026]', 'channel': 'Programming with Mosh', 'category': 'Frontend Web Development'}
]

prompt = f"""You are the Chief AI Recommendation Architect for a developer learning platform.
A user has specified their focus:
Role: AI/ML Engineer & Software Developer
Goal: Master Generative AI, LLMs, and Python Backend Development

Here is a list of candidate YouTube videos:
{json.dumps(sample_videos, indent=2)}

Select and rank the top 3 most relevant videos for this user.
Return ONLY valid JSON matching this schema:
{{
  "personaSummary": "Short sentence summarizing why these match their learning path",
  "topRoleSkills": ["Skill1", "Skill2", "Skill3"],
  "recommendations": [
    {{
      "videoId": "...",
      "rank": 1,
      "relevanceScore": 98,
      "badge": "Must-Watch First",
      "reason": "...",
      "curriculumStep": "Step 1: Foundational / Practical"
    }}
  ]
}}
"""

res = client.chat.completions.create(
    model="qwen/qwen3.8-27b",
    messages=[
        {"role": "system", "content": "You are a precise JSON-only recommendation engine API. Always output pure valid JSON without markdown fences."},
        {"role": "user", "content": prompt}
    ],
    temperature=0.2,
    max_tokens=800
)

print("GROQ RAW OUTPUT:")
print(res.choices[0].message.content)
