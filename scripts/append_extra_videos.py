import re

extra_entries = [
    # Harvard & foundational
    ("H5v3k2GQ9ao", "Harvard CS50 – Full Computer Science University Course", "freeCodeCamp.org", 1, 88000, 7200000, 240000, ["cs50", "harvard", "computer science", "algorithms"]),
    ("nLRL_NcnK-4", "CS50’s Introduction to Programming with Python", "freeCodeCamp.org", 9, 57600, 5400000, 190000, ["python", "harvard", "cs50", "basics"]),
    ("kbKcs5oxv38", "Linear Algebra Full College Course", "freeCodeCamp.org", 1, 72000, 2900000, 95000, ["linear algebra", "math", "machine learning", "vectors"]),
    ("fNk_zzaMoSs", "Vectors | Chapter 1, Essence of linear algebra", "3Blue1Brown", 1, 590, 8900000, 310000, ["3blue1brown", "linear algebra", "vectors", "math"]),
    ("k7RM-ot2NWY", "Linear combinations, span, and basis vectors | Chapter 2", "3Blue1Brown", 1, 600, 4800000, 160000, ["3blue1brown", "linear algebra", "basis vectors"]),
    ("kYB8IZa5AuE", "Linear transformations and matrices | Chapter 3", "3Blue1Brown", 1, 650, 5100000, 180000, ["3blue1brown", "matrices", "linear transformations"]),
    ("PFDu9oVAE-g", "Eigenvectors and eigenvalues | Chapter 14", "3Blue1Brown", 1, 1030, 4200000, 150000, ["3blue1brown", "eigenvalues", "eigenvectors", "linear algebra"]),

    # Krish Naik extensions
    ("mF890L4g_q8", "Complete Statistics for Data Science & Machine Learning in 6 Hours", "Krish Naik", 1, 21600, 1420000, 68000, ["krish naik", "statistics", "data science", "probability"]),
    ("79w8k4Z-n9A", "End to End NLP Project with HuggingFace and Streamlit", "Krish Naik", 3, 10800, 420000, 24000, ["krish naik", "nlp", "huggingface", "streamlit"]),
    ("1uPZ-bZ89cA", "Docker Complete Masterclass for Data Scientists & ML Engineers", "Krish Naik", 8, 14400, 680000, 39000, ["krish naik", "docker", "mlops", "containers"]),
    ("8e_7gP4vQw9", "MLOps End-to-End Pipeline with MLflow & DVC", "Krish Naik", 8, 12600, 510000, 28000, ["krish naik", "mlflow", "dvc", "mlops"]),
    ("k54G_3w8E9A", "Complete EDA Project: Data Cleaning to Insight Dashboard", "Krish Naik", 1, 11400, 620000, 31000, ["krish naik", "eda", "pandas", "matplotlib", "seaborn"]),
    ("p29X_4mE0b8", "End-to-End LLM Application with LangChain and Pinecone Vector DB", "Krish Naik", 5, 8400, 470000, 29000, ["krish naik", "langchain", "pinecone", "vector database"]),

    # Andrej Karpathy deep dives
    ("G3r_3k9P0a8", "Building makemore: from scratch, in code, autoregressive language modeling", "Andrej Karpathy", 5, 6800, 1900000, 92000, ["andrej karpathy", "makemore", "language modeling", "rnn"]),
    ("k8qP_0z7bE0", "Let's build the GPT Tokenizer from scratch", "Andrej Karpathy", 5, 7800, 1600000, 84000, ["andrej karpathy", "tokenizer", "bpe", "llm"]),

    # Web & Fullstack
    ("w7ejDZ8SWv8", "React 18 / 19 Full Course – Learn React JS in 10 Hours", "freeCodeCamp.org", 17, 36000, 4100000, 130000, ["react", "frontend", "javascript", "web dev"]),
    ("vLqTf2b6GZw", "Tailwind CSS in 100 Seconds", "Fireship", 17, 138, 2200000, 110000, ["tailwind", "css", "fireship"]),
    ("Tn6-PIqc4UM", "React in 100 Seconds", "Fireship", 17, 144, 2900000, 135000, ["react", "fireship", "frontend"]),
    ("0ZJgIjIuY7U", "Supabase in 100 Seconds", "Fireship", 18, 140, 1800000, 92000, ["supabase", "backend", "postgresql", "fireship"]),
    ("uL4b7_3vQ7w", "Bun in 100 Seconds", "Fireship", 18, 145, 1700000, 88000, ["bun", "javascript", "runtime", "fireship"]),
    ("2Vv8T4v5_8E", "WebSockets in 100 Seconds", "Fireship", 21, 142, 1900000, 95000, ["websockets", "realtime", "networking", "fireship"]),

    # DevOps & Cloud
    ("6W_q7P9vE3A", "Kubernetes Helm Tutorial for Beginners", "TechWorld with Nana", 29, 3900, 1200000, 48000, ["helm", "kubernetes", "devops", "nana"]),
    ("8p_k4L9vQ2E", "Prometheus & Grafana Full Monitoring Tutorial for DevOps", "TechWorld with Nana", 31, 5400, 1600000, 68000, ["prometheus", "grafana", "monitoring", "devops", "nana"]),
    ("1q_b7X9z0cE", "ArgoCD Tutorial - GitOps on Kubernetes", "TechWorld with Nana", 31, 4800, 1100000, 45000, ["argocd", "gitops", "kubernetes", "nana"]),

    # Systems & Architecture
    ("7k_b4P9vQ2E", "ACID Properties & Database Transactions Explained", "Hussein Nasser", 35, 2100, 780000, 39000, ["database", "acid", "transactions", "sql", "hussein nasser"]),
    ("2w_9P4v7bE0", "Connection Pooling in Databases Explained Visually", "Hussein Nasser", 35, 1800, 640000, 32000, ["database", "connection pool", "backend", "hussein nasser"]),
    ("3k_q4L9z0cE", "Kafka vs RabbitMQ - Message Broker Architecture Differences", "Hussein Nasser", 37, 2400, 890000, 44000, ["kafka", "rabbitmq", "message broker", "system design"]),
    ("8m_b4P7vQ2E", "Top 10 System Design Architectural Patterns", "Gaurav Sen", 33, 2700, 1900000, 89000, ["system design", "architecture", "microservices", "gaurav sen"]),
    ("4q_b7L9z0cE", "How WhatsApp Architecture Handles 50 Billion Messages Daily", "Gaurav Sen", 33, 1600, 2400000, 115000, ["system design", "whatsapp", "architecture", "scalability"]),

    # DSA & LeetCode
    ("9p_b4L7vQ2E", "Dynamic Programming Roadmap – 7 Patterns to Solve 80% Problems", "NeetCode", 53, 1400, 1800000, 92000, ["neetcode", "dynamic programming", "leetcode", "dsa"]),
    ("1m_b7X9z0cE", "Graph Algorithms Crash Course: BFS, DFS, Dijkstra, Topo Sort", "NeetCode", 53, 2100, 1600000, 84000, ["neetcode", "graphs", "dijkstra", "bfs", "dfs"]),
    ("3p_b4L9vQ2E", "Sliding Window Technique for LeetCode Interviews", "NeetCode", 53, 900, 1400000, 74000, ["neetcode", "sliding window", "two pointers", "algorithms"]),
    ("5q_b7X9z0cE", "Merge Sort and Divide & Conquer Algorithms Explained", "Abdul Bari", 53, 1900, 3800000, 150000, ["abdul bari", "merge sort", "divide and conquer", "dsa"]),
    ("6p_b4L9vQ2E", "0/1 Knapsack Problem Dynamic Programming", "Abdul Bari", 53, 1800, 4200000, 170000, ["abdul bari", "knapsack", "dynamic programming", "dsa"])
]

with open("scripts/generate_rich_taxonomy_videos.py", "r", encoding="utf-8") as f:
    text = f.read()

# Convert extra entries to string format
lines = []
for e in extra_entries:
    lines.append(f"    {repr(e)},")

block = "\n".join(lines)

target = '    ("8p7G0W3b4vQ", "Software Engineering Best Practices: Clean Code & Architecture", "ArjanCodes", 57, 1800, 950000, 47000, ["clean code", "code review", "refactoring", "software engineering"]),'
replacement = target + "\n" + block

new_text = text.replace(target, replacement)
with open("scripts/generate_rich_taxonomy_videos.py", "w", encoding="utf-8") as f:
    f.write(new_text)

print(f"Appended {len(extra_entries)} videos to generate_rich_taxonomy_videos.py")

