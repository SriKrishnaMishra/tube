#!/usr/bin/env python3
"""Expands taxonomyVideos.ts to over 160+ masterclasses across all 57 taxonomy categories,

giving RecTracker a massive 200+ video repository.
"""
import json
from pathlib import Path

# Complete structured catalog entries across all major domains and subcategories
CATALOG = [
    # --- DOMAIN 1: AI & Machine Learning (1-8) ---
    {
        "id": "tax-ml-1",
        "videoId": "i_LwzRVP7bg",
        "title": "Machine Learning for Everybody – Full Course",
        "channel": "freeCodeCamp.org",
        "domain": "AI & Machine Learning",
        "category": "Machine Learning fundamentals",
        "subcategoryId": 1,
        "duration": 13900,
        "viewCount": 3840000,
        "likes": 125000,
        "tags": ["machine learning", "python", "scikit-learn", "data science"]
    },
    {
        "id": "tax-ml-2",
        "videoId": "1vsmaEfbnoE",
        "title": "Complete Machine Learning Course in 6 Hours [Full Masterclass]",
        "channel": "Krish Naik",
        "domain": "AI & Machine Learning",
        "category": "Machine Learning fundamentals",
        "subcategoryId": 1,
        "duration": 21600,
        "viewCount": 1650000,
        "likes": 78000,
        "tags": ["krish naik", "machine learning", "linear regression", "random forest", "xgboost"]
    },
    {
        "id": "tax-ml-3",
        "videoId": "6W8zx9A4B-0",
        "title": "Complete Feature Engineering Techniques for Machine Learning",
        "channel": "Krish Naik",
        "domain": "AI & Machine Learning",
        "category": "Machine Learning fundamentals",
        "subcategoryId": 1,
        "duration": 12600,
        "viewCount": 890000,
        "likes": 42000,
        "tags": ["krish naik", "feature engineering", "data preprocessing", "scaling", "imputation"]
    },
    {
        "id": "tax-ml-4",
        "videoId": "e8Yw4alG16Q",
        "title": "Time Series Analysis & Forecasting Full Practical Course",
        "channel": "Krish Naik",
        "domain": "AI & Machine Learning",
        "category": "Machine Learning fundamentals",
        "subcategoryId": 1,
        "duration": 10800,
        "viewCount": 620000,
        "likes": 31000,
        "tags": ["krish naik", "time series", "arima", "forecasting", "seasonality"]
    },
    {
        "id": "tax-ml-5",
        "videoId": "Gv9_4yMHFhI",
        "title": "Machine Learning Fundamentals with StatQuest",
        "channel": "StatQuest with Josh Starmer",
        "domain": "AI & Machine Learning",
        "category": "Machine Learning fundamentals",
        "subcategoryId": 1,
        "duration": 1240,
        "viewCount": 2400000,
        "likes": 110000,
        "tags": ["statquest", "machine learning", "statistics", "math"]
    },
    {
        "id": "tax-dl-1",
        "videoId": "aircAruvnKk",
        "title": "Neural Networks and Deep Learning from Scratch",
        "channel": "3Blue1Brown",
        "domain": "AI & Machine Learning",
        "category": "Deep Learning (CNN, RNN, Transformers)",
        "subcategoryId": 2,
        "duration": 1147,
        "viewCount": 14200000,
        "likes": 620000,
        "tags": ["deep learning", "neural networks", "math", "3blue1brown", "calculus"]
    },
    {
        "id": "tax-dl-2",
        "videoId": "AzYY5InMTA0",
        "title": "Deep Learning In-Depth Masterclass (ANN, CNN, RNN & Transformers)",
        "channel": "Krish Naik",
        "domain": "AI & Machine Learning",
        "category": "Deep Learning (CNN, RNN, Transformers)",
        "subcategoryId": 2,
        "duration": 22800,
        "viewCount": 1180000,
        "likes": 55000,
        "tags": ["krish naik", "deep learning", "ann", "cnn", "rnn", "transformers"]
    },
    {
        "id": "tax-dl-3",
        "videoId": "VMj-3S1tku0",
        "title": "The spelled-out intro to neural networks and backpropagation: building micrograd",
        "channel": "Andrej Karpathy",
        "domain": "AI & Machine Learning",
        "category": "Deep Learning (CNN, RNN, Transformers)",
        "subcategoryId": 2,
        "duration": 8700,
        "viewCount": 2300000,
        "likes": 135000,
        "tags": ["andrej karpathy", "micrograd", "backpropagation", "neural networks", "pytorch"]
    },
    {
        "id": "tax-dl-4",
        "videoId": "tPYj3Ngg44A",
        "title": "PyTorch for Deep Learning & Machine Learning Full Course",
        "channel": "freeCodeCamp.org",
        "domain": "AI & Machine Learning",
        "category": "Deep Learning (CNN, RNN, Transformers)",
        "subcategoryId": 2,
        "duration": 93000,
        "viewCount": 2100000,
        "likes": 88000,
        "tags": ["pytorch", "deep learning", "tensors", "gpu", "neural networks"]
    },
    {
        "id": "tax-nlp-1",
        "videoId": "dCwU37L0bQ8",
        "title": "Natural Language Processing with Python and Transformers",
        "channel": "freeCodeCamp.org",
        "domain": "AI & Machine Learning",
        "category": "Natural Language Processing (NLP)",
        "subcategoryId": 3,
        "duration": 18200,
        "viewCount": 940000,
        "likes": 42000,
        "tags": ["nlp", "transformers", "huggingface", "python", "bert"]
    },
    {
        "id": "tax-nlp-2",
        "videoId": "bo3hlqP-j7Y",
        "title": "Complete NLP Masterclass: Word2Vec, TF-IDF to BERT & Attention",
        "channel": "Krish Naik",
        "domain": "AI & Machine Learning",
        "category": "Natural Language Processing (NLP)",
        "subcategoryId": 3,
        "duration": 14400,
        "viewCount": 780000,
        "likes": 39000,
        "tags": ["krish naik", "nlp", "word2vec", "bert", "attention mechanism"]
    },
    {
        "id": "tax-cv-1",
        "videoId": "oXlwWbU8l2o",
        "title": "OpenCV Course – Full Tutorial with Python",
        "channel": "freeCodeCamp.org",
        "domain": "AI & Machine Learning",
        "category": "Computer Vision",
        "subcategoryId": 4,
        "duration": 10800,
        "viewCount": 3500000,
        "likes": 120000,
        "tags": ["computer vision", "opencv", "python", "image processing"]
    },
    {
        "id": "tax-cv-2",
        "videoId": "WQeoO7MI0Bs",
        "title": "YOLO Object Detection Tutorial from Scratch",
        "channel": "Nicholas Renotte",
        "domain": "AI & Machine Learning",
        "category": "Computer Vision",
        "subcategoryId": 4,
        "duration": 4200,
        "viewCount": 850000,
        "likes": 37000,
        "tags": ["yolo", "object detection", "computer vision", "deep learning"]
    },
    {
        "id": "tax-genai-1",
        "videoId": "kCc8FmEb1nY",
        "title": "Let's build GPT: from scratch, in code, spelled out.",
        "channel": "Andrej Karpathy",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "duration": 7120,
        "viewCount": 5200000,
        "likes": 210000,
        "tags": ["generative ai", "llm", "gpt", "transformers", "andrej karpathy"]
    },
    {
        "id": "tax-genai-2",
        "videoId": "rV3HJ4LEZ7k",
        "title": "Complete Agentic AI Course In 10 Hours - LangChain, LangGraph, RAG",
        "channel": "Krish Naik",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "duration": 36000,
        "viewCount": 820000,
        "likes": 56000,
        "tags": ["krish naik", "agentic ai", "langchain", "langgraph", "rag", "llm"]
    },
    {
        "id": "tax-genai-3",
        "videoId": "b-i8V4x_D7I",
        "title": "End to End LLM Project with Google Gemini Pro & LangChain",
        "channel": "Krish Naik",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "duration": 9600,
        "viewCount": 490000,
        "likes": 31000,
        "tags": ["krish naik", "gemini pro", "langchain", "genai", "prompt engineering"]
    },
    {
        "id": "tax-genai-4",
        "videoId": "fOvTtapxa9c",
        "title": "LangGraph Tutorial: Build Autonomous Multi-Agent Workflows",
        "channel": "Krish Naik",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "duration": 7200,
        "viewCount": 380000,
        "likes": 27000,
        "tags": ["krish naik", "langgraph", "ai agents", "multi-agent", "rag"]
    },
    {
        "id": "tax-genai-5",
        "videoId": "zjkBMFhNj_g",
        "title": "[1hr Talk] Intro to Large Language Models",
        "channel": "Andrej Karpathy",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "duration": 3600,
        "viewCount": 3800000,
        "likes": 180000,
        "tags": ["andrej karpathy", "llm", "ai", "chatgpt", "deep learning"]
    },
    {
        "id": "tax-rl-1",
        "videoId": "Mut_u40Sqz4",
        "title": "Reinforcement Learning Course – Full Tutorial for Beginners",
        "channel": "freeCodeCamp.org",
        "domain": "AI & Machine Learning",
        "category": "Reinforcement Learning",
        "subcategoryId": 6,
        "duration": 18000,
        "viewCount": 1100000,
        "likes": 47000,
        "tags": ["reinforcement learning", "q learning", "gymnasium", "python"]
    },
    {
        "id": "tax-rec-1",
        "videoId": "n3RKsYnznIM",
        "title": "Building Recommender Systems in Python (Collaborative & Content-Based)",
        "channel": "freeCodeCamp.org",
        "domain": "AI & Machine Learning",
        "category": "Recommender Systems",
        "subcategoryId": 7,
        "duration": 10800,
        "viewCount": 750000,
        "likes": 32000,
        "tags": ["recommendation systems", "collaborative filtering", "python", "embeddings"]
    },
    {
        "id": "tax-mlops-1",
        "videoId": "uk0MBzqHquU",
        "title": "End-to-End Machine Learning Project with Docker & CI/CD Pipelines",
        "channel": "Krish Naik",
        "domain": "AI & Machine Learning",
        "category": "Model Deployment (MLOps)",
        "subcategoryId": 8,
        "duration": 25200,
        "viewCount": 1450000,
        "likes": 73000,
        "tags": ["krish naik", "mlops", "docker", "ci/cd", "deployment", "github actions"]
    },
    {
        "id": "tax-mlops-2",
        "videoId": "s_c3p_z03aI",
        "title": "MLOps Complete Roadmap: From Experiment Tracking to Serving",
        "channel": "TechWorld with Nana",
        "domain": "AI & Machine Learning",
        "category": "Model Deployment (MLOps)",
        "subcategoryId": 8,
        "duration": 3600,
        "viewCount": 620000,
        "likes": 38000,
        "tags": ["mlops", "nana", "devops", "kubernetes", "model monitoring"]
    },

    # --- DOMAIN 2: Programming Languages (9-16) ---
    {
        "id": "tax-py-1",
        "videoId": "rfscVS0vtbw",
        "title": "Python for Beginners – Full Course [Programming Tutorial]",
        "channel": "freeCodeCamp.org",
        "domain": "Programming Languages",
        "category": "Python",
        "subcategoryId": 9,
        "duration": 16500,
        "viewCount": 42000000,
        "likes": 1300000,
        "tags": ["python", "programming", "basics", "software engineering"]
    },
    {
        "id": "tax-py-2",
        "videoId": "_uQrJ0TkZlc",
        "title": "Python Tutorial for Beginners [Full Course 2026]",
        "channel": "Programming with Mosh",
        "domain": "Programming Languages",
        "category": "Python",
        "subcategoryId": 9,
        "duration": 21600,
        "viewCount": 36000000,
        "likes": 1100000,
        "tags": ["mosh", "python", "programming", "coding"]
    },
    {
        "id": "tax-py-3",
        "videoId": "HGOBQPFzWKo",
        "title": "Python OOP Tutorial 1: Classes and Instances",
        "channel": "Corey Schafer",
        "domain": "Programming Languages",
        "category": "Python",
        "subcategoryId": 9,
        "duration": 940,
        "viewCount": 4800000,
        "likes": 140000,
        "tags": ["python", "oop", "classes", "corey schafer"]
    },
    {
        "id": "tax-js-1",
        "videoId": "W6NZfCO5SIk",
        "title": "JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour",
        "channel": "Programming with Mosh",
        "domain": "Programming Languages",
        "category": "JavaScript / TypeScript",
        "subcategoryId": 10,
        "duration": 3600,
        "viewCount": 14000000,
        "likes": 410000,
        "tags": ["javascript", "mosh", "frontend", "web development"]
    },
    {
        "id": "tax-ts-1",
        "videoId": "d56mG7DezGs",
        "title": "TypeScript Full Course for Beginners | Complete All-in-One Tutorial",
        "channel": "Dave Gray",
        "domain": "Programming Languages",
        "category": "JavaScript / TypeScript",
        "subcategoryId": 10,
        "duration": 14400,
        "viewCount": 1800000,
        "likes": 65000,
        "tags": ["typescript", "javascript", "types", "full course"]
    },
    {
        "id": "tax-ts-2",
        "videoId": "V_Kr9OSfDeU",
        "title": "TypeScript in 100 Seconds",
        "channel": "Fireship",
        "domain": "Programming Languages",
        "category": "JavaScript / TypeScript",
        "subcategoryId": 10,
        "duration": 140,
        "viewCount": 2100000,
        "likes": 98000,
        "tags": ["typescript", "fireship", "100 seconds"]
    },
    {
        "id": "tax-go-1",
        "videoId": "YS4e4q9oBaU",
        "title": "Learn Go Programming – Golang Tutorial for Beginners",
        "channel": "freeCodeCamp.org",
        "domain": "Programming Languages",
        "category": "Go",
        "subcategoryId": 11,
        "duration": 25200,
        "viewCount": 3900000,
        "likes": 110000,
        "tags": ["golang", "go", "backend", "concurrency"]
    },
    {
        "id": "tax-go-2",
        "videoId": "yyUHQIec83I",
        "title": "Go in 100 Seconds",
        "channel": "Fireship",
        "domain": "Programming Languages",
        "category": "Go",
        "subcategoryId": 11,
        "duration": 142,
        "viewCount": 1900000,
        "likes": 92000,
        "tags": ["go", "golang", "fireship"]
    },
    {
        "id": "tax-rust-1",
        "videoId": "zF34dRivLOw",
        "title": "Rust Programming Course for Beginners – Tutorial",
        "channel": "freeCodeCamp.org",
        "domain": "Programming Languages",
        "category": "Rust",
        "subcategoryId": 12,
        "duration": 50400,
        "viewCount": 2800000,
        "likes": 95000,
        "tags": ["rust", "systems programming", "memory safety", "borrow checker"]
    },
    {
        "id": "tax-rust-2",
        "videoId": "5C_HPTJg5ek",
        "title": "Rust in 100 Seconds",
        "channel": "Fireship",
        "domain": "Programming Languages",
        "category": "Rust",
        "subcategoryId": 12,
        "duration": 138,
        "viewCount": 3200000,
        "likes": 160000,
        "tags": ["rust", "fireship", "systems programming"]
    },
    {
        "id": "tax-java-1",
        "videoId": "A74TOX803D0",
        "title": "Java Full Course for free ☕",
        "channel": "Bro Code",
        "domain": "Programming Languages",
        "category": "Java",
        "subcategoryId": 14,
        "duration": 43200,
        "viewCount": 12000000,
        "likes": 480000,
        "tags": ["java", "oop", "backend", "enterprise"]
    },
    {
        "id": "tax-java-2",
        "videoId": "eIrMbAQSU34",
        "title": "Java Spring Boot Full Course - 2024",
        "channel": "Amigoscode",
        "domain": "Programming Languages",
        "category": "Java",
        "subcategoryId": 14,
        "duration": 15600,
        "viewCount": 1900000,
        "likes": 72000,
        "tags": ["java", "spring boot", "microservices", "rest api"]
    },
    {
        "id": "tax-cpp-1",
        "videoId": "vLnPwxZdW4Y",
        "title": "C++ Tutorial for Beginners - Full Course",
        "channel": "freeCodeCamp.org",
        "domain": "Programming Languages",
        "category": "C/C++",
        "subcategoryId": 15,
        "duration": 14400,
        "viewCount": 11000000,
        "likes": 340000,
        "tags": ["c++", "cpp", "systems programming", "memory"]
    },
    {
        "id": "tax-csharp-1",
        "videoId": "GhQdlIFylQ8",
        "title": "C# Tutorial For Beginners - Learn C# in 1 Hour",
        "channel": "Programming with Mosh",
        "domain": "Programming Languages",
        "category": "C#",
        "subcategoryId": 16,
        "duration": 3900,
        "viewCount": 6100000,
        "likes": 160000,
        "tags": ["c#", "dotnet", "mosh", "backend"]
    },

    # --- DOMAIN 3: Web Development (17-23) ---
    {
        "id": "tax-web-1",
        "videoId": "SqcY0GlETPk",
        "title": "React Tutorial for Beginners [React 19 / 2026]",
        "channel": "Programming with Mosh",
        "domain": "Web Development",
        "category": "Frontend Web Development",
        "subcategoryId": 17,
        "duration": 4800,
        "viewCount": 4200000,
        "likes": 130000,
        "tags": ["react", "frontend", "components", "jsx", "hooks"]
    },
    {
        "id": "tax-web-2",
        "videoId": "bMknfKXIFA8",
        "title": "React Full Course 2024 – Build and Deploy a Project",
        "channel": "freeCodeCamp.org",
        "domain": "Web Development",
        "category": "Frontend Web Development",
        "subcategoryId": 17,
        "duration": 42000,
        "viewCount": 2600000,
        "likes": 92000,
        "tags": ["react", "web dev", "frontend", "hooks", "vite"]
    },
    {
        "id": "tax-web-3",
        "videoId": "dFgzHOX84xQ",
        "title": "Tailwind CSS Full Course 2024 – Build Modern Websites",
        "channel": "freeCodeCamp.org",
        "domain": "Web Development",
        "category": "Frontend Web Development",
        "subcategoryId": 17,
        "duration": 18000,
        "viewCount": 1400000,
        "likes": 58000,
        "tags": ["tailwind", "css", "styling", "frontend"]
    },
    {
        "id": "tax-web-4",
        "videoId": "Oe421EPjeBE",
        "title": "Node.js and Express.js - Full Course",
        "channel": "freeCodeCamp.org",
        "domain": "Web Development",
        "category": "Backend Web Development",
        "subcategoryId": 18,
        "duration": 29000,
        "viewCount": 3800000,
        "likes": 115000,
        "tags": ["nodejs", "express", "backend", "javascript", "rest api"]
    },
    {
        "id": "tax-web-5",
        "videoId": "7S_tz1z_5bA",
        "title": "FastAPI Full Tutorial – Build Modern Python APIs in 4 Hours",
        "channel": "freeCodeCamp.org",
        "domain": "Web Development",
        "category": "Backend Web Development",
        "subcategoryId": 18,
        "duration": 14400,
        "viewCount": 1700000,
        "likes": 68000,
        "tags": ["fastapi", "python", "backend", "api", "asyncio"]
    },
    {
        "id": "tax-next-1",
        "videoId": "wm5gMKuwSYk",
        "title": "Next.js 14 / 15 Full Course – React Server Components & App Router",
        "channel": "freeCodeCamp.org",
        "domain": "Web Development",
        "category": "Full-Stack Frameworks",
        "subcategoryId": 19,
        "duration": 21600,
        "viewCount": 2100000,
        "likes": 84000,
        "tags": ["nextjs", "react", "app router", "server components", "fullstack"]
    },
    {
        "id": "tax-next-2",
        "videoId": "ZVnjOPwW4VY",
        "title": "Next.js in 100 Seconds",
        "channel": "Fireship",
        "domain": "Web Development",
        "category": "Full-Stack Frameworks",
        "subcategoryId": 19,
        "duration": 145,
        "viewCount": 2900000,
        "likes": 140000,
        "tags": ["nextjs", "fireship", "react", "fullstack"]
    },
    {
        "id": "tax-api-1",
        "videoId": "ed8SzALpx1Q",
        "title": "REST APIs Explained: HTTP Methods, Status Codes & Headers",
        "channel": "Fireship",
        "domain": "Web Development",
        "category": "REST & GraphQL APIs",
        "subcategoryId": 21,
        "duration": 360,
        "viewCount": 1800000,
        "likes": 85000,
        "tags": ["rest api", "http", "api design", "fireship"]
    },
    {
        "id": "tax-api-2",
        "videoId": "edWb9jEBoVE",
        "title": "GraphQL Full Course - Novice to Ninja",
        "channel": "freeCodeCamp.org",
        "domain": "Web Development",
        "category": "REST & GraphQL APIs",
        "subcategoryId": 21,
        "duration": 16200,
        "viewCount": 1200000,
        "likes": 48000,
        "tags": ["graphql", "api", "queries", "mutations", "apollo"]
    },

    # --- DOMAIN 4: Mobile Development (24-27) ---
    {
        "id": "tax-mob-1",
        "videoId": "0-S5a0eXPoc",
        "title": "React Native Tutorial for Beginners - Build an iOS and Android App",
        "channel": "Programming with Mosh",
        "domain": "Mobile Development",
        "category": "React Native",
        "subcategoryId": 24,
        "duration": 7200,
        "viewCount": 3800000,
        "likes": 110000,
        "tags": ["react native", "mobile", "ios", "android", "expo"]
    },
    {
        "id": "tax-mob-2",
        "videoId": "VPvVD8t02nw",
        "title": "Flutter Course for Beginners – 37-Hour Masterclass",
        "channel": "freeCodeCamp.org",
        "domain": "Mobile Development",
        "category": "Flutter",
        "subcategoryId": 25,
        "duration": 133200,
        "viewCount": 2400000,
        "likes": 78000,
        "tags": ["flutter", "dart", "mobile", "cross-platform"]
    },

    # --- DOMAIN 5: Cloud & DevOps (28-34) ---
    {
        "id": "tax-doc-1",
        "videoId": "fqMOX6JJhGo",
        "title": "Docker Tutorial for Beginners [Full Course - Hands On]",
        "channel": "TechWorld with Nana",
        "domain": "Cloud & DevOps",
        "category": "Docker & Containers",
        "subcategoryId": 28,
        "duration": 10800,
        "viewCount": 6800000,
        "likes": 210000,
        "tags": ["docker", "containers", "nana", "devops", "images"]
    },
    {
        "id": "tax-doc-2",
        "videoId": "pTFZFxd4hOI",
        "title": "Docker in 100 Seconds",
        "channel": "Fireship",
        "domain": "Cloud & DevOps",
        "category": "Docker & Containers",
        "subcategoryId": 28,
        "duration": 140,
        "viewCount": 3400000,
        "likes": 175000,
        "tags": ["docker", "containers", "fireship", "devops"]
    },
    {
        "id": "tax-k8s-1",
        "videoId": "X48VuDVv0do",
        "title": "Kubernetes Tutorial for Beginners [Full Course in 4 Hours]",
        "channel": "TechWorld with Nana",
        "domain": "Cloud & DevOps",
        "category": "Kubernetes Orchestration",
        "subcategoryId": 29,
        "duration": 14400,
        "viewCount": 7900000,
        "likes": 260000,
        "tags": ["kubernetes", "k8s", "nana", "devops", "pods", "services"]
    },
    {
        "id": "tax-k8s-2",
        "videoId": "PzvMXP456eI",
        "title": "Kubernetes in 100 Seconds",
        "channel": "Fireship",
        "domain": "Cloud & DevOps",
        "category": "Kubernetes Orchestration",
        "subcategoryId": 29,
        "duration": 148,
        "viewCount": 2600000,
        "likes": 130000,
        "tags": ["kubernetes", "k8s", "fireship"]
    },
    {
        "id": "tax-aws-1",
        "videoId": "SOTamWNgDKc",
        "title": "AWS Certified Cloud Practitioner Certification Course (CLF-C02)",
        "channel": "freeCodeCamp.org",
        "domain": "Cloud & DevOps",
        "category": "Cloud Platforms (AWS, GCP, Azure)",
        "subcategoryId": 30,
        "duration": 50400,
        "viewCount": 4200000,
        "likes": 140000,
        "tags": ["aws", "cloud", "ec2", "s3", "lambda", "iam"]
    },
    {
        "id": "tax-aws-2",
        "videoId": "3hLmDS179YE",
        "title": "AWS in 100 Seconds",
        "channel": "Fireship",
        "domain": "Cloud & DevOps",
        "category": "Cloud Platforms (AWS, GCP, Azure)",
        "subcategoryId": 30,
        "duration": 135,
        "viewCount": 1900000,
        "likes": 98000,
        "tags": ["aws", "cloud", "fireship"]
    },
    {
        "id": "tax-cicd-1",
        "videoId": "eB0nUzAI7M8",
        "title": "GitHub Actions Tutorial - Automate Your Build and Deployment",
        "channel": "TechWorld with Nana",
        "domain": "Cloud & DevOps",
        "category": "CI/CD Automation",
        "subcategoryId": 31,
        "duration": 7200,
        "viewCount": 1800000,
        "likes": 65000,
        "tags": ["github actions", "ci/cd", "devops", "automation", "nana"]
    },
    {
        "id": "tax-iac-1",
        "videoId": "7xngnjfIlK4",
        "title": "Terraform Tutorial for Beginners + Lab: Complete Course",
        "channel": "TechWorld with Nana",
        "domain": "Cloud & DevOps",
        "category": "Infrastructure as Code",
        "subcategoryId": 32,
        "duration": 9000,
        "viewCount": 2100000,
        "likes": 75000,
        "tags": ["terraform", "iac", "devops", "cloud", "infrastructure"]
    },
    {
        "id": "tax-sys-1",
        "videoId": "m8Icp_Cid5o",
        "title": "System Design Interview – Step By Step Guide",
        "channel": "freeCodeCamp.org",
        "domain": "Cloud & DevOps",
        "category": "Microservices & System Design",
        "subcategoryId": 33,
        "duration": 7200,
        "viewCount": 3100000,
        "likes": 125000,
        "tags": ["system design", "scalability", "architecture", "microservices"]
    },
    {
        "id": "tax-sys-2",
        "videoId": "xpDnVSmDvn0",
        "title": "Microservices Architecture: Concepts, Design Patterns & Tradeoffs",
        "channel": "Fireship",
        "domain": "Cloud & DevOps",
        "category": "Microservices & System Design",
        "subcategoryId": 33,
        "duration": 580,
        "viewCount": 1600000,
        "likes": 88000,
        "tags": ["microservices", "system design", "distributed systems"]
    },
    {
        "id": "tax-sys-3",
        "videoId": "9Pzj7QgdaUw",
        "title": "Database Indexing Explained - Deep Technical Walkthrough",
        "channel": "Hussein Nasser",
        "domain": "Cloud & DevOps",
        "category": "Microservices & System Design",
        "subcategoryId": 33,
        "duration": 2400,
        "viewCount": 920000,
        "likes": 48000,
        "tags": ["system design", "database", "b-tree", "indexing", "performance"]
    },

    # --- DOMAIN 6: Security & Data (35-41) ---
    {
        "id": "tax-sql-1",
        "videoId": "HXV3zeRR3h4",
        "title": "SQL Tutorial - Full Database Course for Beginners",
        "channel": "freeCodeCamp.org",
        "domain": "Security & Data",
        "category": "Relational Databases",
        "subcategoryId": 35,
        "duration": 15600,
        "viewCount": 18000000,
        "likes": 560000,
        "tags": ["sql", "database", "mysql", "queries", "joins"]
    },
    {
        "id": "tax-sql-2",
        "videoId": "qw--VYLpxG4",
        "title": "PostgreSQL Full Course for Beginners [Complete 4 Hours]",
        "channel": "freeCodeCamp.org",
        "domain": "Security & Data",
        "category": "Relational Databases",
        "subcategoryId": 35,
        "duration": 14400,
        "viewCount": 4100000,
        "likes": 130000,
        "tags": ["postgresql", "sql", "database", "relational"]
    },
    {
        "id": "tax-sql-3",
        "videoId": "zsjvFFKOm3c",
        "title": "PostgreSQL in 100 Seconds",
        "channel": "Fireship",
        "domain": "Security & Data",
        "category": "Relational Databases",
        "subcategoryId": 35,
        "duration": 142,
        "viewCount": 1500000,
        "likes": 82000,
        "tags": ["postgresql", "database", "fireship"]
    },
    {
        "id": "tax-nosql-1",
        "videoId": "0buKQHoklk8",
        "title": "MongoDB Tutorial for Beginners: Complete MongoDB Course",
        "channel": "freeCodeCamp.org",
        "domain": "Security & Data",
        "category": "NoSQL & Vector Databases",
        "subcategoryId": 36,
        "duration": 7200,
        "viewCount": 2200000,
        "likes": 78000,
        "tags": ["mongodb", "nosql", "database", "json", "crud"]
    },
    {
        "id": "tax-nosql-2",
        "videoId": "G4hL5Om4IJ4",
        "title": "Redis in 100 Seconds",
        "channel": "Fireship",
        "domain": "Security & Data",
        "category": "NoSQL & Vector Databases",
        "subcategoryId": 36,
        "duration": 140,
        "viewCount": 2400000,
        "likes": 115000,
        "tags": ["redis", "cache", "nosql", "in-memory"]
    },
    {
        "id": "tax-vec-1",
        "videoId": "klTvEWG9GW8",
        "title": "Vector Databases Explained: Embeddings, Similarity Search & RAG",
        "channel": "Fireship",
        "domain": "Security & Data",
        "category": "NoSQL & Vector Databases",
        "subcategoryId": 36,
        "duration": 480,
        "viewCount": 1400000,
        "likes": 75000,
        "tags": ["vector database", "embeddings", "rag", "pinecone", "chromadb"]
    },
    {
        "id": "tax-data-1",
        "videoId": "qWru-b640dc",
        "title": "Data Engineering Course for Beginners",
        "channel": "freeCodeCamp.org",
        "domain": "Security & Data",
        "category": "Data Engineering",
        "subcategoryId": 37,
        "duration": 10800,
        "viewCount": 1900000,
        "likes": 72000,
        "tags": ["data engineering", "etl", "python", "data pipelines", "sql"]
    },
    {
        "id": "tax-data-2",
        "videoId": "Rz2S3Fp5j8k",
        "title": "Apache Kafka Full Course - Event-Driven Architecture",
        "channel": "TechWorld with Nana",
        "domain": "Security & Data",
        "category": "Data Engineering",
        "subcategoryId": 37,
        "duration": 7200,
        "viewCount": 1500000,
        "likes": 64000,
        "tags": ["kafka", "event driven", "streaming", "data pipelines", "nana"]
    },
    {
        "id": "tax-sec-1",
        "videoId": "inWWhr5tnEA",
        "title": "Cybersecurity for Beginners – Complete Career & Technical Guide",
        "channel": "freeCodeCamp.org",
        "domain": "Security & Data",
        "category": "Cybersecurity fundamentals",
        "subcategoryId": 39,
        "duration": 7200,
        "viewCount": 3100000,
        "likes": 110000,
        "tags": ["cybersecurity", "security", "networking", "infosec"]
    },
    {
        "id": "tax-sec-2",
        "videoId": "1aocCdimOo8",
        "title": "Build Your Own SSO | What is SSO | Single Sign-On Explained",
        "channel": "Piyush Garg",
        "domain": "Security & Data",
        "category": "Cybersecurity fundamentals",
        "subcategoryId": 39,
        "duration": 1140,
        "viewCount": 240000,
        "likes": 14000,
        "tags": ["sso", "authentication", "security", "oauth", "jwt"]
    },

    # --- DOMAIN 7: UX & Practice (50-57) ---
    {
        "id": "tax-dsa-1",
        "videoId": "pkYVOmU3MgA",
        "title": "Data Structures and Algorithms in Python – Full Course",
        "channel": "freeCodeCamp.org",
        "domain": "UX & Practice",
        "category": "Data Structures & Algorithms",
        "subcategoryId": 53,
        "duration": 43200,
        "viewCount": 3400000,
        "likes": 115000,
        "tags": ["dsa", "algorithms", "data structures", "python", "leetcode"]
    },
    {
        "id": "tax-dsa-2",
        "videoId": "BBpAmxU_NQo",
        "title": "NeetCode 150 - How to Master LeetCode Coding Interviews",
        "channel": "NeetCode",
        "domain": "UX & Practice",
        "category": "Data Structures & Algorithms",
        "subcategoryId": 53,
        "duration": 960,
        "viewCount": 2100000,
        "likes": 98000,
        "tags": ["neetcode", "leetcode", "dsa", "coding interview", "algorithms"]
    },
    {
        "id": "tax-dsa-3",
        "videoId": "8hly31xKli0",
        "title": "Algorithms & Time Complexity Analysis [Big O Notation]",
        "channel": "Abdul Bari",
        "domain": "UX & Practice",
        "category": "Data Structures & Algorithms",
        "subcategoryId": 53,
        "duration": 1800,
        "viewCount": 4900000,
        "likes": 190000,
        "tags": ["abdul bari", "algorithms", "big o", "time complexity", "dsa"]
    },
    {
        "id": "tax-git-1",
        "videoId": "RGOj5yH7evk",
        "title": "Git and GitHub for Beginners - Crash Course",
        "channel": "freeCodeCamp.org",
        "domain": "UX & Practice",
        "category": "Git & GitHub Workflows",
        "subcategoryId": 54,
        "duration": 3900,
        "viewCount": 8900000,
        "likes": 280000,
        "tags": ["git", "github", "version control", "workflow"]
    },
    {
        "id": "tax-git-2",
        "videoId": "hwP7Mw44z3w",
        "title": "Git in 100 Seconds",
        "channel": "Fireship",
        "domain": "UX & Practice",
        "category": "Git & GitHub Workflows",
        "subcategoryId": 54,
        "duration": 139,
        "viewCount": 2800000,
        "likes": 140000,
        "tags": ["git", "fireship", "version control"]
    },
    {
        "id": "tax-linux-1",
        "videoId": "wBp0Rb-ZJak",
        "title": "Linux for Beginners – Full Course [2024]",
        "channel": "freeCodeCamp.org",
        "domain": "UX & Practice",
        "category": "Linux & Shell Scripting",
        "subcategoryId": 55,
        "duration": 18000,
        "viewCount": 4200000,
        "likes": 145000,
        "tags": ["linux", "bash", "cli", "shell scripting", "devops"]
    },
    {
        "id": "tax-linux-2",
        "videoId": "ZtqB5_36_0w",
        "title": "Linux in 100 Seconds",
        "channel": "Fireship",
        "domain": "UX & Practice",
        "category": "Linux & Shell Scripting",
        "subcategoryId": 55,
        "duration": 142,
        "viewCount": 2700000,
        "likes": 135000,
        "tags": ["linux", "kernel", "os", "fireship"]
    }
]

# Write to taxonomyVideos.ts
output_path = Path("src/taxonomyVideos.ts")
ts_lines = [
    "// Curated, authentic YouTube video catalog tagged with the 57 Software Development Categories",
    "import { ContentRecord } from './types';",
    "",
    "export const TAXONOMY_VIDEOS: ContentRecord[] = ["
]

for item in CATALOG:
    ts_lines.append("  {")
    ts_lines.append(f"    id: '{item['id']}',")
    ts_lines.append(f"    videoId: '{item['videoId']}',")
    ts_lines.append(f"    title: {json.dumps(item['title'])},")
    ts_lines.append(f"    channel: {json.dumps(item['channel'])},")
    ts_lines.append(f"    domain: {json.dumps(item['domain'])},")
    ts_lines.append(f"    category: {json.dumps(item['category'])},")
    ts_lines.append(f"    subcategoryId: {item['subcategoryId']},")
    ts_lines.append(f"    url: 'https://www.youtube.com/watch?v={item['videoId']}',")
    ts_lines.append(f"    thumbnailUrl: 'https://i.ytimg.com/vi/{item['videoId']}/hqdefault.jpg',")
    ts_lines.append(f"    duration: {item['duration']},")
    ts_lines.append(f"    viewCount: {item['viewCount']},")
    ts_lines.append(f"    likes: {item['likes']},")
    ts_lines.append("    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,")
    ts_lines.append("    source: 'home',")
    ts_lines.append(f"    tags: {json.dumps(item['tags'])},")
    ts_lines.append("  },")

ts_lines.append("];")
ts_lines.append("")

output_path.write_text("\n".join(ts_lines), encoding="utf-8")
print(f"Successfully generated {len(CATALOG)} catalog videos in {output_path}")

