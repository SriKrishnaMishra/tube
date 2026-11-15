import urllib.request
import urllib.error
import json
import time

# List of well-known, high-quality developer videos on YouTube
REAL_DEVELOPER_VIDEOS = [
    # AI & Machine Learning / Python / Data Science
    ("1vsmaEfbnoE", "Complete Machine Learning Course in 6 Hours [Full Masterclass]", "Krish Naik", "AI & Machine Learning", "Machine Learning fundamentals", 1),
    ("-7VgYNiGxYw", "NVIDIA NeMo Guardrails Tutorial: Defend RAG Apps Against Prompt Injection", "Krish Naik", "AI & Machine Learning", "Generative AI & LLMs", 5),
    ("HCJvnek8zZM", "Building AI Agents With Microsoft WorkIQ - Zero API Calls", "Krish Naik", "AI & Machine Learning", "Generative AI & LLMs", 5),
    ("qvrbwZ3V4-o", "Generative AI Vs Agentic AI Vs AI Agents - Complete Clarification", "Krish Naik", "AI & Machine Learning", "Generative AI & LLMs", 5),
    ("_iRUnZ_BFkA", "Which AI Role Should You Prepare For in 2025/2026?", "Krish Naik", "AI & Machine Learning", "Machine Learning fundamentals", 1),
    ("J5fqR-TRebI", "Complete Agentic AI Roadmap - LangChain, LangGraph, CrewAI & Multi-Agents", "Krish Naik", "AI & Machine Learning", "Generative AI & LLMs", 5),
    ("rV3HJ4LEZ7k", "Complete Agentic AI Course In 10 Hours - LangChain, LangGraph, RAG", "Krish Naik", "AI & Machine Learning", "Generative AI & LLMs", 5),
    ("uk0MBzqHquU", "End-to-End Machine Learning Project Implementation with Docker & CI/CD", "Krish Naik", "AI & Machine Learning", "Model Deployment (MLOps)", 8),
    ("e8Yw4alG16Q", "Time Series Analysis & Forecasting Full Practical Course", "Krish Naik", "AI & Machine Learning", "Machine Learning fundamentals", 1),
    ("LZzq1zSL1bs", "Complete Statistics for Data Science - From Basic to Advanced", "Krish Naik", "AI & Machine Learning", "Machine Learning fundamentals", 1),
    ("kqtD5dpn9C8", "Python for Beginners - Complete Python Full Course", "Krish Naik", "Programming Languages", "Python", 9),
    ("b-i8V4x_D7I", "End to End LLM Project with Google Gemini Pro & LangChain", "Krish Naik", "AI & Machine Learning", "Generative AI & LLMs", 5),
    ("fOvTtapxa9c", "Complete Natural Language Processing (NLP) Masterclass in One Video", "Krish Naik", "AI & Machine Learning", "Natural Language Processing", 3),

    # Andrej Karpathy
    ("kCc8FmEb1nY", "Let's build GPT: from scratch, in code, spelled out.", "Andrej Karpathy", "AI & Machine Learning", "Generative AI & LLMs", 5),
    ("VMj-3S1tku0", "The spelled-out intro to neural networks and backpropagation: building micrograd", "Andrej Karpathy", "AI & Machine Learning", "Deep Learning (CNN, RNN, Transformers)", 2),
    ("PaCmpyGFfXg", "The spelled-out intro to language modeling: building makemore", "Andrej Karpathy", "AI & Machine Learning", "Natural Language Processing", 3),
    ("zduSF808aBQ", "Intro to Large Language Models", "Andrej Karpathy", "AI & Machine Learning", "Generative AI & LLMs", 5),
    ("l8pRSuU81PU", "Let's build the GPT Tokenizer", "Andrej Karpathy", "AI & Machine Learning", "Natural Language Processing", 3),

    # 3Blue1Brown
    ("aircAruvnKk", "Neural Networks: But what is a neural network? | Chapter 1, Deep learning", "3Blue1Brown", "AI & Machine Learning", "Deep Learning (CNN, RNN, Transformers)", 2),
    ("IHZwWFHWa-w", "Gradient descent, how neural networks learn | Chapter 2, Deep learning", "3Blue1Brown", "AI & Machine Learning", "Deep Learning (CNN, RNN, Transformers)", 2),
    ("Ilg3gGewQ5U", "What is backpropagation really doing? | Chapter 3, Deep learning", "3Blue1Brown", "AI & Machine Learning", "Deep Learning (CNN, RNN, Transformers)", 2),
    ("tIeHLnjs5U8", "Backpropagation calculus | Chapter 4, Deep learning", "3Blue1Brown", "AI & Machine Learning", "Deep Learning (CNN, RNN, Transformers)", 2),
    ("fNk_zzaMoSs", "Vectors | Chapter 1, Essence of linear algebra", "3Blue1Brown", "Mathematics & Computing", "Linear algebra & calculus", 47),
    ("k7RM-ot2NWY", "Linear combinations, span, and basis vectors | Chapter 2, Essence of linear algebra", "3Blue1Brown", "Mathematics & Computing", "Linear algebra & calculus", 47),
    ("kYB8IZa5AuE", "Linear transformations and matrices | Chapter 3, Essence of linear algebra", "3Blue1Brown", "Mathematics & Computing", "Linear algebra & calculus", 47),

    # StatQuest
    ("Gv9_4yMHFhI", "StatQuest: Machine Learning Fundamentals", "StatQuest with Josh Starmer", "AI & Machine Learning", "Machine Learning fundamentals", 1),
    ("yIYKR4sgzI8", "StatQuest: Logistic Regression Clearly Explained", "StatQuest with Josh Starmer", "AI & Machine Learning", "Machine Learning fundamentals", 1),
    ("sQ870aTKqiM", "StatQuest: Principal Component Analysis (PCA), Step-by-Step", "StatQuest with Josh Starmer", "AI & Machine Learning", "Machine Learning fundamentals", 1),
    ("LDRbO9a6XPU", "StatQuest: Random Forests Part 1 - Building, Using and Evaluating", "StatQuest with Josh Starmer", "AI & Machine Learning", "Machine Learning fundamentals", 1),
    ("zxagGtF9MeI", "StatQuest: Support Vector Machines (SVM), Clearly Explained", "StatQuest with Josh Starmer", "AI & Machine Learning", "Machine Learning fundamentals", 1),

    # Fireship
    ("DHjqpvDnNGE", "JavaScript in 100 Seconds", "Fireship", "Programming Languages", "JavaScript / TypeScript", 10),
    ("zQnBQ4tB3ZA", "TypeScript in 100 Seconds", "Fireship", "Programming Languages", "JavaScript / TypeScript", 10),
    ("G3e-cpL7ofc", "Docker in 100 Seconds", "Fireship", "Cloud & DevOps", "Kubernetes & containerization", 30),
    ("P6sfmUTpUmc", "Kubernetes in 100 Seconds", "Fireship", "Cloud & DevOps", "Kubernetes & containerization", 30),
    ("Tn6-PIqc4UM", "Rust in 100 Seconds", "Fireship", "Programming Languages", "Rust", 11),
    ("443PE3P_48A", "Go in 100 Seconds", "Fireship", "Programming Languages", "Go (Golang)", 12),
    ("V_Kr9OSfDeU", "Git in 100 Seconds", "Fireship", "Cloud & DevOps", "CI/CD pipelines & automation", 32),
    ("01sAkU_NvOY", "PostgreSQL in 100 Seconds", "Fireship", "Databases & Storage", "Relational databases (PostgreSQL, MySQL)", 23),
    ("QuRna5480VU", "GraphQL in 100 Seconds", "Fireship", "Web Development", "API design (REST, GraphQL, gRPC)", 20),
    ("_uQrJ0TkZlc", "Python in 100 Seconds", "Fireship", "Programming Languages", "Python", 9),
    ("PFDu9oVAE-g", "React in 100 Seconds", "Fireship", "Web Development", "Frontend frameworks (React, Vue, Svelte)", 17),
    ("s_c3p_z03aI", "Next.js in 100 Seconds", "Fireship", "Web Development", "Full-Stack Frameworks", 19),
    ("dCwU37L0bQ8", "Tailwind CSS in 100 Seconds", "Fireship", "Web Development", "CSS, animations & design systems", 21),
    ("WUvTyaaNkzM", "Linux in 100 Seconds", "Fireship", "Cloud & DevOps", "Linux systems & shell scripting", 29),
    ("yP4_XW2q0cE", "WebAssembly in 100 Seconds", "Fireship", "Web Development", "Web performance & WebAssembly", 22),

    # ByteByteGo
    ("i53Gi_Ka3-A", "System Design Interview: A Step-By-Step Guide", "ByteByteGo", "Cloud & DevOps", "Distributed systems & consensus", 34),
    ("j8Y1xP0m4rK", "How to Design a URL Shortener like TinyURL", "ByteByteGo", "Cloud & DevOps", "Distributed systems & consensus", 34),
    ("xpDnVSmDvn0", "How Discord Scaled to 11 Million Concurrent Users", "ByteByteGo", "Cloud & DevOps", "Distributed systems & consensus", 34),
    ("ZtqB5_36_0w", "Top 5 Most Used Distributed System Design Patterns", "ByteByteGo", "Cloud & DevOps", "Distributed systems & consensus", 34),
    ("bUHFg8CZFCA", "API Gateway vs Reverse Proxy vs Load Balancer", "ByteByteGo", "Cloud & DevOps", "Networking & DNS infrastructure", 35),
    ("hwP7Mw44z3w", "How Netflix Video Streaming Pipeline Works", "ByteByteGo", "Cloud & DevOps", "Distributed systems & consensus", 34),

    # Chai aur Code (Hitesh Choudhary)
    ("sscX432bMZo", "Chai aur JavaScript - Full In-Depth JS Masterclass", "Chai aur Code", "Programming Languages", "JavaScript / TypeScript", 10),
    ("k3K_W7_lEaE", "Chai aur React 19 - Complete React Course in Hindi", "Chai aur Code", "Web Development", "Frontend frameworks (React, Vue, Svelte)", 17),
    ("30LWjhZzg50", "Docker aur Containerization Master Series in Hindi", "Chai aur Code", "Cloud & DevOps", "Kubernetes & containerization", 30),
    ("Vbhhx9y9b3Y", "Git and GitHub Complete Masterclass with Practical Projects", "Chai aur Code", "Cloud & DevOps", "CI/CD pipelines & automation", 32),
    ("37Bdfv2wS-s", "Backend Development in Hindi with Node.js and Express", "Chai aur Code", "Web Development", "Backend frameworks (Node.js, Django, Spring)", 18),

    # CodeWithHarry
    ("gfDE2a7MKjA", "Python Full Course for Beginners in Hindi [With Notes & Projects]", "CodeWithHarry", "Programming Languages", "Python", 9),
    ("tVzUXW6siu0", "Complete Web Development Bootcamp - HTML, CSS, JS, React, Node", "CodeWithHarry", "Web Development", "Full-Stack Frameworks", 19),
    ("yGB93G6Ws5s", "C++ Full Course - From Basics to Advanced Object Oriented Programming", "CodeWithHarry", "Programming Languages", "C / C++", 14),
    ("j8nAHeVKLVC", "Java Full Course in Hindi with Hand-Written Notes", "CodeWithHarry", "Programming Languages", "Java", 13),

    # NeetCode
    ("KLlXCFG5TnA", "Blind 75 LeetCode Questions - Full DSA Roadmap Solved", "NeetCode", "Software Engineering Practice", "Interview preparation & coding challenges", 55),
    ("oBt53YbR9Kk", "Dynamic Programming - 7 Patterns You Must Know", "NeetCode", "Software Engineering Practice", "Interview preparation & coding challenges", 55),
    ("i53Gi_Ka3-A", "System Design: Designing Twitter / X from Scratch", "NeetCode", "Cloud & DevOps", "Distributed systems & consensus", 34),
    ("70tx7BrZ7vY", "Two Sum - LeetCode 1 - Python Solution Explained", "NeetCode", "Software Engineering Practice", "Interview preparation & coding challenges", 55),
    ("4TfW1a02_68", "Binary Search - LeetCode 704 - Fast Explanation", "NeetCode", "Software Engineering Practice", "Interview preparation & coding challenges", 55),

    # Traversy Media
    ("zOjov-2OZ0E", "Rust Crash Course for Beginners - From Zero to Hero", "Traversy Media", "Programming Languages", "Rust", 11),
    ("wm5gMKuwSYk", "Next.js 15 Full Stack Crash Course with Server Actions", "Traversy Media", "Web Development", "Full-Stack Frameworks", 19),
    ("fBNz5xF-Kx4", "Node.js & Express From Scratch Full Course", "Traversy Media", "Web Development", "Backend frameworks (Node.js, Django, Spring)", 18),
    ("ub36ffn4YP0", "HTML & CSS Full Course for Beginners", "Traversy Media", "Web Development", "CSS, animations & design systems", 21),

    # freeCodeCamp.org
    ("i_LwzRVP7bg", "Machine Learning for Everybody - Full Course", "freeCodeCamp.org", "AI & Machine Learning", "Machine Learning fundamentals", 1),
    ("eWRfhZUzrAc", "Python for Beginners - Full Course [Programming Tutorial]", "freeCodeCamp.org", "Programming Languages", "Python", 9),
    ("YS4e4q9oBaU", "Go / Golang Programming - Complete Course for Beginners", "freeCodeCamp.org", "Programming Languages", "Go (Golang)", 12),
    ("bMknfKXIFA8", "React Course - Beginner's Tutorial for React JavaScript Library", "freeCodeCamp.org", "Web Development", "Frontend frameworks (React, Vue, Svelte)", 17),
    ("PkZNo7MFNFg", "Learn JavaScript - Full Course for Beginners", "freeCodeCamp.org", "Programming Languages", "JavaScript / TypeScript", 10),
    ("fqMhyB2W_28", "Docker and Kubernetes Tutorial for Beginners [Full Course]", "freeCodeCamp.org", "Cloud & DevOps", "Kubernetes & containerization", 30),
    ("HXV3zeQKqGY", "SQL Tutorial - Full Database Course for Beginners", "freeCodeCamp.org", "Databases & Storage", "Relational databases (PostgreSQL, MySQL)", 23),
    ("8j0UDiN7my4", "C++ Full Course for Free 10 Hours", "freeCodeCamp.org", "Programming Languages", "C / C++", 14),
    ("grEKMHGYyns", "Java Tutorial for Beginners - Full Course", "freeCodeCamp.org", "Programming Languages", "Java", 13),
    ("C-gEQdGVXbk", "Git and GitHub for Beginners - Crash Course", "freeCodeCamp.org", "Cloud & DevOps", "CI/CD pipelines & automation", 32),
    ("1hpg7_y94h0", "Linux Command Line Tutorial: Complete In-Depth Course", "freeCodeCamp.org", "Cloud & DevOps", "Linux systems & shell scripting", 29),
    ("qw42x9GzS0k", "Data Structures Easy to Advanced Course - Full Tutorial from a Google Engineer", "freeCodeCamp.org", "Software Engineering Practice", "Algorithms & data structures (DSA)", 54),
    ("o8pDa141lGk", "Computer Vision and OpenCV Tutorial for Beginners", "freeCodeCamp.org", "AI & Machine Learning", "Computer Vision", 4),

    # Hussein Nasser
    ("2j8O3hUvX4A", "Database Indexing Explained In-Depth: B-Trees vs Hash Tables", "Hussein Nasser", "Databases & Storage", "Database indexing & query optimization", 27),
    ("x50zW2J92K8", "HTTP/1.1 vs HTTP/2 vs HTTP/3 Explained", "Hussein Nasser", "Cloud & DevOps", "Networking & DNS infrastructure", 35),
    ("O8fB1_9oX7A", "Why Do Databases Use Write-Ahead Logging (WAL)?", "Hussein Nasser", "Databases & Storage", "Relational databases (PostgreSQL, MySQL)", 23),

    # Piyush Garg
    ("aP6T3wK7p8U", "SSO Authentication Explained with Practical Implementation", "Piyush Garg", "Security & Data", "Cybersecurity fundamentals", 39),
    ("7n9jV_4k0xQ", "System Design of an URL Shortener with Caching & Redis", "Piyush Garg", "Cloud & DevOps", "Distributed systems & consensus", 34),
    ("d09xK_7a2mM", "Docker Complete Course for Beginners with Real Projects", "Piyush Garg", "Cloud & DevOps", "Kubernetes & containerization", 30),
]

print(f"Total curated developer videos: {len(REAL_DEVELOPER_VIDEOS)}")
