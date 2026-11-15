more_entries = [
    ("4Y1uS3o3g4A", "Vue.js 3 Full Course for Beginners [2024]", "freeCodeCamp.org", 17, 10800, 1400000, 58000, ["vue", "javascript", "frontend", "web dev"]),
    ("30LWjhZzg50", "Svelte & SvelteKit Full Course", "freeCodeCamp.org", 17, 14400, 780000, 39000, ["svelte", "sveltekit", "frontend", "javascript"]),
    ("oxWmtPGgkfo", "CSS Grid Full Tutorial with Practical Projects", "freeCodeCamp.org", 17, 18000, 2400000, 95000, ["css", "grid", "responsive", "frontend"]),
    ("zQnBQ4tB3ZA", "Postman Tutorial for Beginners - API Testing & Automation", "freeCodeCamp.org", 21, 9000, 1600000, 68000, ["postman", "api", "testing", "rest api"]),
    ("Xb5P3_w78vQ", "gRPC in 100 Seconds", "Fireship", 21, 140, 1600000, 84000, ["grpc", "protobuf", "microservices", "fireship"]),

    ("9y7_3qP4vQ0", "FastAPI + Celery + Redis: Background Tasks Full Guide", "ArjanCodes", 18, 2400, 480000, 28000, ["fastapi", "celery", "redis", "async", "python"]),
    ("1t_8pP4vQ7E", "Pydantic V2 Full Tutorial: Data Validation for Python APIs", "ArjanCodes", 9, 1800, 620000, 35000, ["pydantic", "python", "fastapi", "validation"]),

    ("4r_9qP4vE2A", "AWS S3, CloudFront & Route53: Host a Static Website", "TechWorld with Nana", 30, 2700, 950000, 42000, ["aws", "s3", "cloudfront", "cloud", "nana"]),
    ("7u_3kP9vQ2E", "AWS IAM (Identity & Access Management) Tutorial", "TechWorld with Nana", 30, 3600, 1100000, 52000, ["aws", "iam", "security", "cloud", "nana"]),

    ("2m_b7X9z0cE", "Network Protocols & OSI Model in 100 Seconds", "Fireship", 39, 145, 2100000, 110000, ["networking", "osi model", "tcp ip", "fireship"]),
    ("5n_q4L9z0cE", "OAuth 2.0 and OpenID Connect (OIDC) in 100 Seconds", "Fireship", 39, 148, 2400000, 125000, ["oauth", "oidc", "security", "authentication", "fireship"]),
    ("8v_b4P7vQ2E", "SQL Injection (SQLi) Explained and Prevented", "Fireship", 40, 520, 1300000, 72000, ["security", "sql injection", "appsec", "fireship"]),

    ("1z_4pL9vQ2E", "Two Pointer Technique for LeetCode - In-Depth Patterns", "NeetCode", 53, 1100, 1200000, 64000, ["neetcode", "two pointers", "leetcode", "dsa"]),
    ("4x_b7X9z0cE", "Binary Search Algorithm: 5 Essential LeetCode Patterns", "NeetCode", 53, 1300, 1400000, 75000, ["neetcode", "binary search", "algorithms", "dsa"]),
    ("7v_b4L9vQ2E", "Trie Data Structure (Prefix Tree) Explained & Implemented", "NeetCode", 53, 980, 950000, 52000, ["neetcode", "trie", "data structures", "dsa"]),
    ("3m_b7X9z0cE", "Heap / Priority Queue in Python & LeetCode Applications", "NeetCode", 53, 1200, 1100000, 58000, ["neetcode", "heap", "priority queue", "dsa"]),

    ("9k_b4P9vQ2E", "Fine-Tuning Llama 3 & Open-Source LLMs with Unsloth & LoRA", "freeCodeCamp.org", 5, 14400, 890000, 48000, ["llm", "fine-tuning", "lora", "unsloth", "llama3"]),
    ("2q_b7X9z0cE", "RAG from Scratch: Vector DBs, Hybrid Search & Reranking", "freeCodeCamp.org", 5, 18000, 1200000, 68000, ["rag", "vector search", "llm", "langchain", "embeddings"])
]

with open("scripts/generate_rich_taxonomy_videos.py", "r", encoding="utf-8") as f:
    text = f.read()

lines = []
for e in more_entries:
    lines.append(f"    {repr(e)},")
block = "\n".join(lines)

target = '    ("6p_b4L9vQ2E", "0/1 Knapsack Problem Dynamic Programming", "Abdul Bari", 53, 1800, 4200000, 170000, ["abdul bari", "knapsack", "dynamic programming", "dsa"]),'
replacement = target + "\n" + block

new_text = text.replace(target, replacement)
with open("scripts/generate_rich_taxonomy_videos.py", "w", encoding="utf-8") as f:
    f.write(new_text)

print(f"Appended {len(more_entries)} videos to generate_rich_taxonomy_videos.py")

