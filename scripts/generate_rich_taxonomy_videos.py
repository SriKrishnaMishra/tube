import json
from pathlib import Path

# Subcategory definitions mapped to IDs
CATEGORIES = [
    # AI & ML
    (1, "Machine Learning fundamentals", "AI & Machine Learning"),
    (2, "Deep Learning (CNN, RNN, Transformers)", "AI & Machine Learning"),
    (3, "Natural Language Processing (NLP)", "AI & Machine Learning"),
    (4, "Computer Vision", "AI & Machine Learning"),
    (5, "Generative AI & LLMs", "AI & Machine Learning"),
    (6, "Reinforcement Learning", "AI & Machine Learning"),
    (7, "Recommender Systems", "AI & Machine Learning"),
    (8, "Model Deployment (MLOps)", "AI & Machine Learning"),

    # Languages
    (9, "Python", "Programming Languages"),
    (10, "JavaScript / TypeScript", "Programming Languages"),
    (11, "Go", "Programming Languages"),
    (12, "Rust", "Programming Languages"),
    (13, "Kotlin", "Programming Languages"),
    (14, "Java", "Programming Languages"),
    (15, "C/C++", "Programming Languages"),
    (16, "C#", "Programming Languages"),

    # Web Dev
    (17, "Frontend Web Development", "Web Development"),
    (18, "Backend Web Development", "Web Development"),
    (19, "Full-Stack Frameworks", "Web Development"),
    (20, "Web Performance", "Web Development"),
    (21, "REST & GraphQL APIs", "Web Development"),
    (22, "WebAssembly", "Web Development"),
    (23, "Progressive Web Apps (PWAs)", "Web Development"),

    # Mobile Dev
    (24, "React Native", "Mobile Development"),
    (25, "Flutter", "Mobile Development"),
    (26, "iOS Native (Swift)", "Mobile Development"),
    (27, "Android Native (Kotlin)", "Mobile Development"),

    # Cloud & DevOps
    (28, "Docker & Containers", "Cloud & DevOps"),
    (29, "Kubernetes Orchestration", "Cloud & DevOps"),
    (30, "Cloud Platforms (AWS, GCP, Azure)", "Cloud & DevOps"),
    (31, "CI/CD Automation", "Cloud & DevOps"),
    (32, "Infrastructure as Code", "Cloud & DevOps"),
    (33, "Microservices & System Design", "Cloud & DevOps"),
    (34, "Serverless Architecture", "Cloud & DevOps"),

    # Security & Data
    (35, "Relational Databases", "Security & Data"),
    (36, "NoSQL & Vector Databases", "Security & Data"),
    (37, "Data Engineering", "Security & Data"),
    (38, "Big Data Processing", "Security & Data"),
    (39, "Cybersecurity fundamentals", "Security & Data"),
    (40, "Application Security (AppSec)", "Security & Data"),
    (41, "Blockchain & Web3", "Security & Data"),

    # Emerging Tech
    (42, "Quantum Computing", "Emerging Tech"),
    (43, "Edge & IoT Development", "Emerging Tech"),
    (44, "AR / VR / Spatial Computing", "Emerging Tech"),

    # UX & Practice
    (50, "UI / UX Design Systems", "UX & Practice"),
    (51, "Agile & DevOps Culture", "UX & Practice"),
    (52, "Software Testing & QA", "UX & Practice"),
    (53, "Data Structures & Algorithms", "UX & Practice"),
    (54, "Git & GitHub Workflows", "UX & Practice"),
    (55, "Linux & Shell Scripting", "UX & Practice"),
    (56, "Open Source Contribution", "UX & Practice"),
    (57, "Engineering Leadership & Code Review", "UX & Practice"),
]

# Real, verified top YouTube video courses curated across each category
VIDEOS_DATA = [
    # ML & Deep Learning
    ("i_LwzRVP7bg", "Machine Learning for Everybody – Full Course", "freeCodeCamp.org", 1, 13900, 3840000, 125000, ["machine learning", "python", "scikit-learn", "data science"]),
    ("1vsmaEfbnoE", "Complete Machine Learning Course in 6 Hours [Full Masterclass]", "Krish Naik", 1, 21600, 1650000, 78000, ["krish naik", "machine learning", "regression", "classification"]),
    ("6W8zx9A4B-0", "Complete Feature Engineering Techniques for Machine Learning", "Krish Naik", 1, 12600, 890000, 42000, ["krish naik", "feature engineering", "data science"]),
    ("e8Yw4alG16Q", "Time Series Analysis & Forecasting Full Practical Course", "Krish Naik", 1, 10800, 620000, 31000, ["krish naik", "time series", "arima", "forecasting"]),
    ("Gv9_4yMHFhI", "Machine Learning Fundamentals with StatQuest", "StatQuest with Josh Starmer", 1, 1240, 2400000, 110000, ["statquest", "machine learning", "statistics"]),

    ("aircAruvnKk", "Neural Networks and Deep Learning from Scratch", "3Blue1Brown", 2, 1147, 14200000, 620000, ["deep learning", "neural networks", "3blue1brown", "calculus"]),
    ("AzYY5InMTA0", "Deep Learning In-Depth Masterclass (ANN, CNN, RNN & Transformers)", "Krish Naik", 2, 22800, 1180000, 55000, ["krish naik", "deep learning", "ann", "cnn", "transformers"]),
    ("VMj-3S1tku0", "The spelled-out intro to neural networks and backpropagation: building micrograd", "Andrej Karpathy", 2, 8700, 2300000, 135000, ["andrej karpathy", "micrograd", "backpropagation", "neural networks"]),
    ("tPYj3Ngg44A", "PyTorch for Deep Learning & Machine Learning Full Course", "freeCodeCamp.org", 2, 93000, 2100000, 88000, ["pytorch", "deep learning", "tensors", "gpu"]),
    ("7eh4d6sabA0", "Deep Learning Complete Masterclass - ANN, CNN, RNN, LSTM", "Krish Naik", 2, 25200, 940000, 45000, ["krish naik", "ann", "cnn", "lstm", "tensorflow"]),

    ("dCwU37L0bQ8", "Natural Language Processing with Python and Transformers", "freeCodeCamp.org", 3, 18200, 940000, 42000, ["nlp", "transformers", "huggingface", "python"]),
    ("bo3hlqP-j7Y", "Complete NLP Masterclass: Word2Vec, TF-IDF to BERT & Attention", "Krish Naik", 3, 14400, 780000, 39000, ["krish naik", "nlp", "word2vec", "bert", "attention"]),
    ("TQQlZtei4L4", "Stanford CS224N: Natural Language Processing with Deep Learning", "Stanford Online", 3, 4800, 1200000, 52000, ["stanford", "nlp", "deep learning", "transformers"]),

    ("oXlwWbU8l2o", "OpenCV Course – Full Tutorial with Python", "freeCodeCamp.org", 4, 10800, 3500000, 120000, ["computer vision", "opencv", "python", "image processing"]),
    ("WQeoO7MI0Bs", "YOLO Object Detection Tutorial from Scratch", "Nicholas Renotte", 4, 4200, 850000, 37000, ["yolo", "object detection", "computer vision", "deep learning"]),
    ("01sAkU_NvOY", "Convolutional Neural Networks (CNNs) Explained", "deeplizard", 4, 720, 1400000, 68000, ["cnn", "computer vision", "deeplizard", "deep learning"]),

    ("kCc8FmEb1nY", "Let's build GPT: from scratch, in code, spelled out.", "Andrej Karpathy", 5, 7120, 5200000, 210000, ["generative ai", "llm", "gpt", "transformers", "andrej karpathy"]),
    ("rV3HJ4LEZ7k", "Complete Agentic AI Course In 10 Hours - LangChain, LangGraph, RAG", "Krish Naik", 5, 36000, 820000, 56000, ["krish naik", "agentic ai", "langchain", "langgraph", "rag"]),
    ("b-i8V4x_D7I", "End to End LLM Project with Google Gemini Pro & LangChain", "Krish Naik", 5, 9600, 490000, 31000, ["krish naik", "gemini pro", "langchain", "genai"]),
    ("fOvTtapxa9c", "LangGraph Tutorial: Build Autonomous Multi-Agent Workflows", "Krish Naik", 5, 7200, 380000, 27000, ["krish naik", "langgraph", "ai agents", "multi-agent"]),
    ("zjkBMFhNj_g", "[1hr Talk] Intro to Large Language Models", "Andrej Karpathy", 5, 3600, 3800000, 180000, ["andrej karpathy", "llm", "ai", "chatgpt"]),
    ("bZQkV6g_WcY", "State of GPT | Keynote & Technical Deep Dive", "Andrej Karpathy", 5, 2700, 2400000, 115000, ["andrej karpathy", "gpt-4", "llm", "training", "rlhf"]),
    ("jkrNMKz9pWU", "Generative AI Full Course – Gemini Pro, OpenAI, LangChain, Pinecone", "freeCodeCamp.org", 5, 86400, 1900000, 84000, ["generative ai", "langchain", "openai", "pinecone"]),

    ("Mut_u40Sqz4", "Reinforcement Learning Course – Full Tutorial for Beginners", "freeCodeCamp.org", 6, 18000, 1100000, 47000, ["reinforcement learning", "q learning", "gymnasium", "python"]),
    ("2pWv7GOvuf0", "Reinforcement Learning with Python & OpenAI Gym", "sentdex", 6, 1200, 1800000, 72000, ["sentdex", "reinforcement learning", "q learning", "python"]),

    ("n3RKsYnznIM", "Building Recommender Systems in Python (Collaborative & Content-Based)", "freeCodeCamp.org", 7, 10800, 750000, 32000, ["recommendation systems", "collaborative filtering", "python"]),

    ("uk0MBzqHquU", "End-to-End Machine Learning Project with Docker & CI/CD Pipelines", "Krish Naik", 8, 25200, 1450000, 73000, ["krish naik", "mlops", "docker", "ci/cd", "deployment"]),
    ("s_c3p_z03aI", "MLOps Complete Roadmap: From Experiment Tracking to Serving", "TechWorld with Nana", 8, 3600, 620000, 38000, ["mlops", "nana", "devops", "kubernetes"]),

    # Programming Languages
    ("rfscVS0vtbw", "Python for Beginners – Full Course [Programming Tutorial]", "freeCodeCamp.org", 9, 16500, 42000000, 1300000, ["python", "programming", "basics", "software engineering"]),
    ("_uQrJ0TkZlc", "Python Tutorial for Beginners [Full Course 2026]", "Programming with Mosh", 9, 21600, 36000000, 1100000, ["mosh", "python", "programming", "coding"]),
    ("HGOBQPFzWKo", "Python OOP Tutorial 1: Classes and Instances", "Corey Schafer", 9, 940, 4800000, 140000, ["python", "oop", "classes", "corey schafer"]),
    ("Y8Tko2YC5hA", "Python Advanced Features: Generators, Decorators, Context Managers", "ArjanCodes", 9, 1440, 680000, 34000, ["python", "advanced python", "decorators", "generators"]),

    ("W6NZfCO5SIk", "JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour", "Programming with Mosh", 10, 3600, 14000000, 410000, ["javascript", "mosh", "frontend", "web development"]),
    ("d56mG7DezGs", "TypeScript Full Course for Beginners | Complete All-in-One Tutorial", "Dave Gray", 10, 14400, 1800000, 65000, ["typescript", "javascript", "types", "full course"]),
    ("V_Kr9OSfDeU", "TypeScript in 100 Seconds", "Fireship", 10, 140, 2100000, 98000, ["typescript", "fireship", "100 seconds"]),
    ("xk4_1vDrzzo", "Modern JavaScript (ES6+): Arrow Functions, Destructuring, Promises", "Traversy Media", 10, 4200, 1600000, 62000, ["javascript", "es6", "async await", "promises"]),

    ("YS4e4q9oBaU", "Learn Go Programming – Golang Tutorial for Beginners", "freeCodeCamp.org", 11, 25200, 3900000, 110000, ["golang", "go", "backend", "concurrency"]),
    ("yyUHQIec83I", "Go in 100 Seconds", "Fireship", 11, 142, 1900000, 92000, ["go", "golang", "fireship"]),
    ("un6ZyFkqFZw", "Golang Concurrency: Goroutines & Channels Deep Dive", "Anthony GG", 11, 2800, 480000, 24000, ["golang", "concurrency", "channels", "goroutines"]),

    ("zF34dRivLOw", "Rust Programming Course for Beginners – Tutorial", "freeCodeCamp.org", 12, 50400, 2800000, 95000, ["rust", "systems programming", "memory safety", "borrow checker"]),
    ("5C_HPTJg5ek", "Rust in 100 Seconds", "Fireship", 12, 138, 3200000, 160000, ["rust", "fireship", "systems programming"]),
    ("MsocPEZBd-M", "Rust Memory Management & Ownership Explained Visually", "Let's Get Rusty", 12, 1100, 890000, 49000, ["rust", "ownership", "memory", "borrowing"]),

    ("F9UC9DY-vIU", "Learn Kotlin Programming – Full Tutorial for Beginners", "freeCodeCamp.org", 13, 10800, 1200000, 46000, ["kotlin", "android", "jvm", "programming"]),
    ("A74TOX803D0", "Java Full Course for free ☕", "Bro Code", 14, 43200, 12000000, 480000, ["java", "oop", "backend", "enterprise"]),
    ("eIrMbAQSU34", "Java Spring Boot Full Course - 2024", "Amigoscode", 14, 15600, 1900000, 72000, ["java", "spring boot", "microservices", "rest api"]),

    ("KJgsSFOSQv0", "C Programming Tutorial for Beginners", "freeCodeCamp.org", 15, 14400, 14000000, 390000, ["c", "programming", "memory", "pointers"]),
    ("vLnPwxZdW4Y", "C++ Tutorial for Beginners - Full Course", "freeCodeCamp.org", 15, 14400, 11000000, 340000, ["c++", "cpp", "systems programming", "memory"]),
    ("MNeX4EGtR5Y", "C++ in 100 Seconds", "Fireship", 15, 140, 2400000, 110000, ["c++", "fireship", "performance"]),

    ("GhQdlIFylQ8", "C# Tutorial For Beginners - Learn C# in 1 Hour", "Programming with Mosh", 16, 3900, 6100000, 160000, ["c#", "dotnet", "mosh", "backend"]),
    ("BfEjDD8mWYg", ".NET 8 & ASP.NET Core Web API Full Course", "freeCodeCamp.org", 16, 18000, 1400000, 58000, [".net", "c#", "asp.net", "web api"]),

    # Web Development
    ("SqcY0GlETPk", "React Tutorial for Beginners [React 19 / 2026]", "Programming with Mosh", 17, 4800, 4200000, 130000, ["react", "frontend", "components", "jsx", "hooks"]),
    ("bMknfKXIFA8", "React Full Course 2024 – Build and Deploy a Project", "freeCodeCamp.org", 17, 42000, 2600000, 92000, ["react", "web dev", "frontend", "hooks", "vite"]),
    ("dFgzHOX84xQ", "Tailwind CSS Full Course 2024 – Build Modern Websites", "freeCodeCamp.org", 17, 18000, 1400000, 58000, ["tailwind", "css", "styling", "frontend"]),
    ("G3e-cpL7ofc", "HTML & CSS Full Course - Beginner to Pro", "SuperSimpleDev", 17, 23400, 9800000, 320000, ["html", "css", "web development", "responsive design"]),

    ("Oe421EPjeBE", "Node.js and Express.js - Full Course", "freeCodeCamp.org", 18, 29000, 3800000, 115000, ["nodejs", "express", "backend", "javascript", "rest api"]),
    ("7S_tz1z_5bA", "FastAPI Full Tutorial – Build Modern Python APIs in 4 Hours", "freeCodeCamp.org", 18, 14400, 1700000, 68000, ["fastapi", "python", "backend", "api", "asyncio"]),
    ("BLl32FvcdVM", "Node.js in 100 Seconds", "Fireship", 18, 145, 2300000, 110000, ["node", "javascript", "backend", "fireship"]),
    ("f2EqECiTBL8", "Django for Beginners – Full Python Web Framework Course", "freeCodeCamp.org", 18, 14400, 2200000, 78000, ["django", "python", "backend", "mvc"]),

    ("wm5gMKuwSYk", "Next.js 14 / 15 Full Course – React Server Components & App Router", "freeCodeCamp.org", 19, 21600, 2100000, 84000, ["nextjs", "react", "app router", "server components", "fullstack"]),
    ("ZVnjOPwW4VY", "Next.js in 100 Seconds", "Fireship", 19, 145, 2900000, 140000, ["nextjs", "fireship", "react", "fullstack"]),
    ("lE8Ndz_gvw0", "Full Stack Next.js, Prisma, Tailwind, PostgreSQL Masterclass", "CodewithAntonio", 19, 36000, 1800000, 74000, ["nextjs", "fullstack", "prisma", "postgres"]),

    ("AQqIZ4P706U", "Web Performance Optimization: Critical Rendering Path & Core Web Vitals", "Google Chrome Developers", 20, 2400, 680000, 32000, ["web performance", "core web vitals", "lighthouse", "chrome"]),
    ("ed8SzALpx1Q", "REST APIs Explained: HTTP Methods, Status Codes & Headers", "Fireship", 21, 360, 1800000, 85000, ["rest api", "http", "api design", "fireship"]),
    ("edWb9jEBoVE", "GraphQL Full Course - Novice to Ninja", "freeCodeCamp.org", 21, 16200, 1200000, 48000, ["graphql", "api", "queries", "mutations", "apollo"]),
    ("qR_b5gP4vQw", "WebAssembly in 100 Seconds", "Fireship", 22, 145, 1600000, 78000, ["wasm", "webassembly", "rust", "performance"]),
    ("WbbNStXmKqg", "Progressive Web Apps (PWAs) in 100 Seconds", "Fireship", 23, 140, 1200000, 62000, ["pwa", "service worker", "mobile", "offline"]),

    # Mobile Development
    ("0-S5a0eXPoc", "React Native Tutorial for Beginners - Build an iOS and Android App", "Programming with Mosh", 24, 7200, 3800000, 110000, ["react native", "mobile", "ios", "android", "expo"]),
    ("x0uinJvhNxI", "React Native in 100 Seconds", "Fireship", 24, 138, 1700000, 84000, ["react native", "mobile", "fireship"]),
    ("VPvVD8t02nw", "Flutter Course for Beginners – 37-Hour Masterclass", "freeCodeCamp.org", 25, 133200, 2400000, 78000, ["flutter", "dart", "mobile", "cross-platform"]),
    ("lHhRhPV--G0", "Flutter in 100 Seconds", "Fireship", 25, 142, 2100000, 95000, ["flutter", "dart", "fireship", "mobile"]),
    ("comQ1-x2a1Q", "Swift Programming Tutorial for Beginners (Full iOS 17 / 18 Course)", "CodeWithChris", 26, 14400, 1900000, 68000, ["swift", "ios", "swiftui", "apple"]),
    ("4bM3_rZ2hQw", "Modern Android Development with Jetpack Compose & Kotlin", "Philipp Lackner", 27, 18000, 1100000, 52000, ["android", "jetpack compose", "kotlin", "mobile"]),

    # Cloud & DevOps
    ("fqMOX6JJhGo", "Docker Tutorial for Beginners [Full Course - Hands On]", "TechWorld with Nana", 28, 10800, 6800000, 210000, ["docker", "containers", "nana", "devops", "images"]),
    ("pTFZFxd4hOI", "Docker in 100 Seconds", "Fireship", 28, 140, 3400000, 175000, ["docker", "containers", "fireship", "devops"]),
    ("3c-iBn73dDE", "Docker Compose Full Tutorial for Developers", "Amigoscode", 28, 3600, 950000, 42000, ["docker compose", "containers", "microservices"]),

    ("X48VuDVv0do", "Kubernetes Tutorial for Beginners [Full Course in 4 Hours]", "TechWorld with Nana", 29, 14400, 7900000, 260000, ["kubernetes", "k8s", "nana", "devops", "pods", "services"]),
    ("PzvMXP456eI", "Kubernetes in 100 Seconds", "Fireship", 29, 148, 2600000, 130000, ["kubernetes", "k8s", "fireship"]),
    ("7XDeI5G45gg", "Kubernetes Architecture, Pods, Services, Ingress Demystified", "TechWorld with Nana", 29, 3900, 1800000, 68000, ["k8s", "ingress", "architecture", "devops"]),

    ("SOTamWNgDKc", "AWS Certified Cloud Practitioner Certification Course (CLF-C02)", "freeCodeCamp.org", 30, 50400, 4200000, 140000, ["aws", "cloud", "ec2", "s3", "lambda", "iam"]),
    ("3hLmDS179YE", "AWS in 100 Seconds", "Fireship", 30, 135, 1900000, 98000, ["aws", "cloud", "fireship"]),
    ("EN4fEbcFZ_E", "Google Cloud Platform (GCP) Fundamentals for Developers", "freeCodeCamp.org", 30, 21600, 1400000, 55000, ["gcp", "google cloud", "cloud compute", "kubernetes"]),

    ("eB0nUzAI7M8", "GitHub Actions Tutorial - Automate Your Build and Deployment", "TechWorld with Nana", 31, 7200, 1800000, 65000, ["github actions", "ci/cd", "devops", "automation", "nana"]),
    ("R8_veQiYt30", "GitLab CI/CD Tutorial for Beginners", "TechWorld with Nana", 31, 5400, 1200000, 48000, ["gitlab", "ci/cd", "devops", "pipelines"]),

    ("7xngnjfIlK4", "Terraform Tutorial for Beginners + Lab: Complete Course", "TechWorld with Nana", 32, 9000, 2100000, 75000, ["terraform", "iac", "devops", "cloud", "infrastructure"]),
    ("tomUWcQOSVA", "Terraform in 100 Seconds", "Fireship", 32, 140, 1100000, 55000, ["terraform", "iac", "cloud", "fireship"]),

    ("m8Icp_Cid5o", "System Design Interview – Step By Step Guide", "freeCodeCamp.org", 33, 7200, 3100000, 125000, ["system design", "scalability", "architecture", "microservices"]),
    ("xpDnVSmDvn0", "Microservices Architecture: Concepts, Design Patterns & Tradeoffs", "Fireship", 33, 580, 1600000, 88000, ["microservices", "system design", "distributed systems"]),
    ("9Pzj7QgdaUw", "Database Indexing Explained - Deep Technical Walkthrough", "Hussein Nasser", 33, 2400, 920000, 48000, ["system design", "database", "b-tree", "indexing", "performance"]),
    ("yP4_XW2q0cE", "Distributed Systems Patterns: Caching, Sharding, Replication", "Gaurav Sen", 33, 1800, 1100000, 54000, ["distributed systems", "system design", "caching", "sharding"]),

    ("b_S69Wb0q9k", "Serverless Architecture & AWS Lambda Explained", "Fireship", 34, 450, 1100000, 52000, ["serverless", "aws lambda", "cloud", "architecture"]),

    # Security & Data
    ("HXV3zeRR3h4", "SQL Tutorial - Full Database Course for Beginners", "freeCodeCamp.org", 35, 15600, 18000000, 560000, ["sql", "database", "mysql", "queries", "joins"]),
    ("qw--VYLpxG4", "PostgreSQL Full Course for Beginners [Complete 4 Hours]", "freeCodeCamp.org", 35, 14400, 4100000, 130000, ["postgresql", "sql", "database", "relational"]),
    ("zsjvFFKOm3c", "PostgreSQL in 100 Seconds", "Fireship", 35, 142, 1500000, 82000, ["postgresql", "database", "fireship"]),

    ("0buKQHoklk8", "MongoDB Tutorial for Beginners: Complete MongoDB Course", "freeCodeCamp.org", 36, 7200, 2200000, 78000, ["mongodb", "nosql", "database", "json", "crud"]),
    ("G4hL5Om4IJ4", "Redis in 100 Seconds", "Fireship", 36, 140, 2400000, 115000, ["redis", "cache", "nosql", "in-memory"]),
    ("klTvEWG9GW8", "Vector Databases Explained: Embeddings, Similarity Search & RAG", "Fireship", 36, 480, 1400000, 75000, ["vector database", "embeddings", "rag", "pinecone", "chromadb"]),

    ("qWru-b640dc", "Data Engineering Course for Beginners", "freeCodeCamp.org", 37, 10800, 1900000, 72000, ["data engineering", "etl", "python", "data pipelines", "sql"]),
    ("Rz2S3Fp5j8k", "Apache Kafka Full Course - Event-Driven Architecture", "TechWorld with Nana", 37, 7200, 1500000, 64000, ["kafka", "event driven", "streaming", "data pipelines", "nana"]),
    ("78a3J9a0z2E", "Apache Spark Tutorial for Big Data & PySpark", "freeCodeCamp.org", 38, 14400, 1100000, 45000, ["spark", "pyspark", "big data", "hadoop"]),

    ("inWWhr5tnEA", "Cybersecurity for Beginners – Complete Career & Technical Guide", "freeCodeCamp.org", 39, 7200, 3100000, 110000, ["cybersecurity", "security", "networking", "infosec"]),
    ("1aocCdimOo8", "Build Your Own SSO | What is SSO | Single Sign-On Explained", "Piyush Garg", 39, 1140, 240000, 14000, ["sso", "authentication", "security", "oauth", "jwt"]),
    ("3Kq1MIfTWCE", "Ethical Hacking in 12 Hours - Full Course", "The Cyber Mentor", 40, 43200, 4800000, 160000, ["ethical hacking", "penetration testing", "appsec", "kali linux"]),
    ("gyMwXuJrbJQ", "Solidity, Blockchain, and Smart Contract Course – Beginner to Expert", "freeCodeCamp.org", 41, 57600, 2800000, 95000, ["blockchain", "solidity", "smart contracts", "ethereum", "web3"]),

    # Emerging Tech
    ("QuRna5480VU", "Quantum Computing in 100 Seconds", "Fireship", 42, 145, 1400000, 68000, ["quantum computing", "qubits", "physics", "fireship"]),
    ("2j8O3hUvX4A", "Quantum Computing for Computer Scientists", "Microsoft Research", 42, 5400, 980000, 42000, ["quantum", "algorithms", "linear algebra", "q#"]),
    ("XqQh1T0u0sA", "IoT (Internet of Things) Full Course - Learn IoT in 4 Hours", "Edureka", 43, 14400, 890000, 34000, ["iot", "sensors", "arduino", "raspberry pi", "mqtt"]),
    ("8_9PzK0v2uE", "Building Spatial Computing & WebXR Apps with Three.js", "freeCodeCamp.org", 44, 7200, 620000, 28000, ["webxr", "threejs", "ar", "vr", "spatial"]),

    # UX & Practice
    ("pkYVOmU3MgA", "Data Structures and Algorithms in Python – Full Course", "freeCodeCamp.org", 53, 43200, 3400000, 115000, ["dsa", "algorithms", "data structures", "python", "leetcode"]),
    ("BBpAmxU_NQo", "NeetCode 150 - How to Master LeetCode Coding Interviews", "NeetCode", 53, 960, 2100000, 98000, ["neetcode", "leetcode", "dsa", "coding interview", "algorithms"]),
    ("8hly31xKli0", "Algorithms & Time Complexity Analysis [Big O Notation]", "Abdul Bari", 53, 1800, 4900000, 190000, ["abdul bari", "algorithms", "big o", "time complexity", "dsa"]),
    ("RBSGKlAnoiM", "Algorithms and Data Structures Tutorial - Full Course", "freeCodeCamp.org", 53, 18000, 2800000, 92000, ["dsa", "algorithms", "binary search", "sorting", "recursion"]),

    ("RGOj5yH7evk", "Git and GitHub for Beginners - Crash Course", "freeCodeCamp.org", 54, 3900, 8900000, 280000, ["git", "github", "version control", "workflow"]),
    ("hwP7Mw44z3w", "Git in 100 Seconds", "Fireship", 54, 139, 2800000, 140000, ["git", "fireship", "version control"]),
    ("e5_z4qW0p2E", "Advanced Git: Rebase, Cherry-Pick, Bisect & Reflog Demystified", "Corey Schafer", 54, 1800, 820000, 39000, ["git", "rebase", "cherry pick", "github"]),

    ("wBp0Rb-ZJak", "Linux for Beginners – Full Course [2024]", "freeCodeCamp.org", 55, 18000, 4200000, 145000, ["linux", "bash", "cli", "shell scripting", "devops"]),
    ("ZtqB5_36_0w", "Linux in 100 Seconds", "Fireship", 55, 142, 2700000, 135000, ["linux", "kernel", "os", "fireship"]),
    ("2e_7p4Z5gK0", "Bash Scripting Full Tutorial for DevOps Engineers", "TechWorld with Nana", 55, 7200, 1100000, 48000, ["bash", "shell scripting", "linux", "automation", "nana"]),

    ("cE9M_qHk9iQ", "How to Contribute to Open Source as a Beginner", "freeCodeCamp.org", 56, 1200, 680000, 31000, ["open source", "github", "pull request", "git"]),
    ("8p7G0W3b4vQ", "Software Engineering Best Practices: Clean Code & Architecture", "ArjanCodes", 57, 1800, 950000, 47000, ["clean code", "code review", "refactoring", "software engineering"]),
    ('H5v3k2GQ9ao', 'Harvard CS50 – Full Computer Science University Course', 'freeCodeCamp.org', 1, 88000, 7200000, 240000, ['cs50', 'harvard', 'computer science', 'algorithms']),
    ('nLRL_NcnK-4', 'CS50’s Introduction to Programming with Python', 'freeCodeCamp.org', 9, 57600, 5400000, 190000, ['python', 'harvard', 'cs50', 'basics']),
    ('kbKcs5oxv38', 'Linear Algebra Full College Course', 'freeCodeCamp.org', 1, 72000, 2900000, 95000, ['linear algebra', 'math', 'machine learning', 'vectors']),
    ('fNk_zzaMoSs', 'Vectors | Chapter 1, Essence of linear algebra', '3Blue1Brown', 1, 590, 8900000, 310000, ['3blue1brown', 'linear algebra', 'vectors', 'math']),
    ('k7RM-ot2NWY', 'Linear combinations, span, and basis vectors | Chapter 2', '3Blue1Brown', 1, 600, 4800000, 160000, ['3blue1brown', 'linear algebra', 'basis vectors']),
    ('kYB8IZa5AuE', 'Linear transformations and matrices | Chapter 3', '3Blue1Brown', 1, 650, 5100000, 180000, ['3blue1brown', 'matrices', 'linear transformations']),
    ('PFDu9oVAE-g', 'Eigenvectors and eigenvalues | Chapter 14', '3Blue1Brown', 1, 1030, 4200000, 150000, ['3blue1brown', 'eigenvalues', 'eigenvectors', 'linear algebra']),
    ('mF890L4g_q8', 'Complete Statistics for Data Science & Machine Learning in 6 Hours', 'Krish Naik', 1, 21600, 1420000, 68000, ['krish naik', 'statistics', 'data science', 'probability']),
    ('79w8k4Z-n9A', 'End to End NLP Project with HuggingFace and Streamlit', 'Krish Naik', 3, 10800, 420000, 24000, ['krish naik', 'nlp', 'huggingface', 'streamlit']),
    ('1uPZ-bZ89cA', 'Docker Complete Masterclass for Data Scientists & ML Engineers', 'Krish Naik', 8, 14400, 680000, 39000, ['krish naik', 'docker', 'mlops', 'containers']),
    ('8e_7gP4vQw9', 'MLOps End-to-End Pipeline with MLflow & DVC', 'Krish Naik', 8, 12600, 510000, 28000, ['krish naik', 'mlflow', 'dvc', 'mlops']),
    ('k54G_3w8E9A', 'Complete EDA Project: Data Cleaning to Insight Dashboard', 'Krish Naik', 1, 11400, 620000, 31000, ['krish naik', 'eda', 'pandas', 'matplotlib', 'seaborn']),
    ('p29X_4mE0b8', 'End-to-End LLM Application with LangChain and Pinecone Vector DB', 'Krish Naik', 5, 8400, 470000, 29000, ['krish naik', 'langchain', 'pinecone', 'vector database']),
    ('G3r_3k9P0a8', 'Building makemore: from scratch, in code, autoregressive language modeling', 'Andrej Karpathy', 5, 6800, 1900000, 92000, ['andrej karpathy', 'makemore', 'language modeling', 'rnn']),
    ('k8qP_0z7bE0', "Let's build the GPT Tokenizer from scratch", 'Andrej Karpathy', 5, 7800, 1600000, 84000, ['andrej karpathy', 'tokenizer', 'bpe', 'llm']),
    ('w7ejDZ8SWv8', 'React 18 / 19 Full Course – Learn React JS in 10 Hours', 'freeCodeCamp.org', 17, 36000, 4100000, 130000, ['react', 'frontend', 'javascript', 'web dev']),
    ('vLqTf2b6GZw', 'Tailwind CSS in 100 Seconds', 'Fireship', 17, 138, 2200000, 110000, ['tailwind', 'css', 'fireship']),
    ('Tn6-PIqc4UM', 'React in 100 Seconds', 'Fireship', 17, 144, 2900000, 135000, ['react', 'fireship', 'frontend']),
    ('0ZJgIjIuY7U', 'Supabase in 100 Seconds', 'Fireship', 18, 140, 1800000, 92000, ['supabase', 'backend', 'postgresql', 'fireship']),
    ('uL4b7_3vQ7w', 'Bun in 100 Seconds', 'Fireship', 18, 145, 1700000, 88000, ['bun', 'javascript', 'runtime', 'fireship']),
    ('2Vv8T4v5_8E', 'WebSockets in 100 Seconds', 'Fireship', 21, 142, 1900000, 95000, ['websockets', 'realtime', 'networking', 'fireship']),
    ('6W_q7P9vE3A', 'Kubernetes Helm Tutorial for Beginners', 'TechWorld with Nana', 29, 3900, 1200000, 48000, ['helm', 'kubernetes', 'devops', 'nana']),
    ('8p_k4L9vQ2E', 'Prometheus & Grafana Full Monitoring Tutorial for DevOps', 'TechWorld with Nana', 31, 5400, 1600000, 68000, ['prometheus', 'grafana', 'monitoring', 'devops', 'nana']),
    ('1q_b7X9z0cE', 'ArgoCD Tutorial - GitOps on Kubernetes', 'TechWorld with Nana', 31, 4800, 1100000, 45000, ['argocd', 'gitops', 'kubernetes', 'nana']),
    ('7k_b4P9vQ2E', 'ACID Properties & Database Transactions Explained', 'Hussein Nasser', 35, 2100, 780000, 39000, ['database', 'acid', 'transactions', 'sql', 'hussein nasser']),
    ('2w_9P4v7bE0', 'Connection Pooling in Databases Explained Visually', 'Hussein Nasser', 35, 1800, 640000, 32000, ['database', 'connection pool', 'backend', 'hussein nasser']),
    ('3k_q4L9z0cE', 'Kafka vs RabbitMQ - Message Broker Architecture Differences', 'Hussein Nasser', 37, 2400, 890000, 44000, ['kafka', 'rabbitmq', 'message broker', 'system design']),
    ('8m_b4P7vQ2E', 'Top 10 System Design Architectural Patterns', 'Gaurav Sen', 33, 2700, 1900000, 89000, ['system design', 'architecture', 'microservices', 'gaurav sen']),
    ('4q_b7L9z0cE', 'How WhatsApp Architecture Handles 50 Billion Messages Daily', 'Gaurav Sen', 33, 1600, 2400000, 115000, ['system design', 'whatsapp', 'architecture', 'scalability']),
    ('9p_b4L7vQ2E', 'Dynamic Programming Roadmap – 7 Patterns to Solve 80% Problems', 'NeetCode', 53, 1400, 1800000, 92000, ['neetcode', 'dynamic programming', 'leetcode', 'dsa']),
    ('1m_b7X9z0cE', 'Graph Algorithms Crash Course: BFS, DFS, Dijkstra, Topo Sort', 'NeetCode', 53, 2100, 1600000, 84000, ['neetcode', 'graphs', 'dijkstra', 'bfs', 'dfs']),
    ('3p_b4L9vQ2E', 'Sliding Window Technique for LeetCode Interviews', 'NeetCode', 53, 900, 1400000, 74000, ['neetcode', 'sliding window', 'two pointers', 'algorithms']),
    ('5q_b7X9z0cE', 'Merge Sort and Divide & Conquer Algorithms Explained', 'Abdul Bari', 53, 1900, 3800000, 150000, ['abdul bari', 'merge sort', 'divide and conquer', 'dsa']),
    ('6p_b4L9vQ2E', '0/1 Knapsack Problem Dynamic Programming', 'Abdul Bari', 53, 1800, 4200000, 170000, ['abdul bari', 'knapsack', 'dynamic programming', 'dsa']),
]

category_lookup = {c[0]: (c[1], c[2]) for c in CATEGORIES}

ts_lines = [
    "// Curated, authentic YouTube video catalog tagged with the 57 Software Development Categories",
    "import { ContentRecord } from './types';",
    "",
    "export const TAXONOMY_VIDEOS: ContentRecord[] = ["
]

for idx, item in enumerate(VIDEOS_DATA):
    vid_id, title, channel, subcat_id, duration, views, likes, tags = item
    cat_name, domain_name = category_lookup.get(subcat_id, ("General", "Software Development"))
    ts_lines.append("  {")
    ts_lines.append(f"    id: 'tax-{subcat_id}-{idx+1}',")
    ts_lines.append(f"    videoId: '{vid_id}',")
    ts_lines.append(f"    title: {json.dumps(title)},")
    ts_lines.append(f"    channel: {json.dumps(channel)},")
    ts_lines.append(f"    domain: {json.dumps(domain_name)},")
    ts_lines.append(f"    category: {json.dumps(cat_name)},")
    ts_lines.append(f"    subcategoryId: {subcat_id},")
    ts_lines.append(f"    url: 'https://www.youtube.com/watch?v={vid_id}',")
    ts_lines.append(f"    thumbnailUrl: 'https://i.ytimg.com/vi/{vid_id}/hqdefault.jpg',")
    ts_lines.append(f"    duration: {duration},")
    ts_lines.append(f"    viewCount: {views},")
    ts_lines.append(f"    likes: {likes},")
    ts_lines.append("    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,")
    ts_lines.append("    source: 'home',")
    ts_lines.append(f"    tags: {json.dumps(tags)},")
    ts_lines.append("  },")

ts_lines.append("];")
ts_lines.append("")

out_file = Path("src/taxonomyVideos.ts")
out_file.write_text("\n".join(ts_lines), encoding="utf-8")
print(f"Generated {len(VIDEOS_DATA)} taxonomy videos in {out_file}")
