import json
import re

print("Generating 55 Top Software Development Channels for ChannelHub.tsx...")

CHANNELS_DATA = [
    # Core Creators
    {
        "id": "krish-naik",
        "name": "Krish Naik",
        "handle": "@krishnaik06",
        "domain": "AI & Machine Learning",
        "category": "Machine Learning fundamentals",
        "subcategoryId": 1,
        "subscriberCount": "890K subscribers",
        "description": "Pioneer in Machine Learning, Deep Learning, Generative AI, LangChain, and end-to-end Data Science masterclasses.",
        "videoCount": 26,
        "tags": ["krish naik", "machine learning", "deep learning", "generative ai", "mlops", "python", "data science", "langchain"]
    },
    {
        "id": "piyush-garg",
        "name": "Piyush Garg",
        "handle": "@piyushgargdev",
        "domain": "Security & Data",
        "category": "Cybersecurity fundamentals",
        "subcategoryId": 39,
        "subscriberCount": "280K subscribers",
        "description": "Full stack development, system architecture, SSO, authentication, Docker, and backend engineering deep dives.",
        "videoCount": 18,
        "tags": ["piyush garg", "sso", "backend", "system design", "auth", "node", "fullstack", "docker"]
    },
    {
        "id": "chai-aur-code",
        "name": "Chai aur Code",
        "handle": "@chaiaurcode",
        "domain": "Web Development",
        "category": "Frontend frameworks (React, Vue, Svelte)",
        "subcategoryId": 17,
        "subscriberCount": "580K subscribers",
        "description": "Practical programming in Hindi with chai! Complete React 19, JavaScript in-depth, Docker, and full-stack master series by Hitesh Choudhary.",
        "videoCount": 22,
        "tags": ["chai aur code", "hitesh choudhary", "react", "javascript", "docker", "frontend"]
    },
    {
        "id": "code-with-harry",
        "name": "CodeWithHarry",
        "handle": "@CodeWithHarry",
        "domain": "Programming Languages",
        "category": "Python",
        "subcategoryId": 9,
        "subscriberCount": "5.2M subscribers",
        "description": "Learn programming with complete projects and handwritten notes. Full courses on Python, Web Development, C++, and DSA.",
        "videoCount": 28,
        "tags": ["codewithharry", "python", "web dev", "c++", "javascript", "notes"]
    },

    # AI Engineering, Machine Learning & Data Science (15 Channels)
    {
        "id": "andrej-karpathy",
        "name": "Andrej Karpathy",
        "handle": "@AndrejKarpathy",
        "domain": "AI & Machine Learning",
        "category": "Deep Learning (CNN, RNN, Transformers)",
        "subcategoryId": 2,
        "subscriberCount": "800K subscribers",
        "description": "Former Director of AI at Tesla and OpenAI founding team. Coding GPT from scratch and the Neural Networks: Zero to Hero series.",
        "videoCount": 10,
        "tags": ["andrej karpathy", "micrograd", "makemore", "gpt", "deep learning", "zero to hero"]
    },
    {
        "id": "dave-ebbelaar",
        "name": "Dave Ebbelaar",
        "handle": "@daveebbelaar",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "subscriberCount": "95K subscribers",
        "description": "Building and deploying real-world AI applications, autonomous agents, LangChain pipelines, and production AI automation.",
        "videoCount": 16,
        "tags": ["dave ebbelaar", "ai agents", "langchain", "rag", "automation", "python"]
    },
    {
        "id": "prompt-engineering",
        "name": "Prompt Engineering",
        "handle": "@PromptEngineering",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "subscriberCount": "140K subscribers",
        "description": "Cutting-edge LLMs, RAG pipelines, fine-tuning open source models, and autonomous agentic workflows.",
        "videoCount": 20,
        "tags": ["prompt engineering", "llm", "rag", "ollama", "local llm", "agentic"]
    },
    {
        "id": "nicholas-renotte",
        "name": "Nicholas Renotte",
        "handle": "@NicholasRenotte",
        "domain": "AI & Machine Learning",
        "category": "Machine Learning fundamentals",
        "subcategoryId": 1,
        "subscriberCount": "420K subscribers",
        "description": "Hands-on Python AI projects, computer vision with OpenCV, custom neural network training, and reinforcement learning.",
        "videoCount": 24,
        "tags": ["nicholas renotte", "opencv", "computer vision", "reinforcement learning", "python ai"]
    },
    {
        "id": "sam-witteveen",
        "name": "Sam Witteveen",
        "handle": "@samwitteveenai",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "subscriberCount": "110K subscribers",
        "description": "Deep architectural dives into LangChain, LlamaIndex, vector databases, and modern enterprise LLM tooling.",
        "videoCount": 18,
        "tags": ["sam witteveen", "langchain", "llamaindex", "vector database", "llm tooling"]
    },
    {
        "id": "cole-medin",
        "name": "Cole Medin",
        "handle": "@ColeMedin",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "subscriberCount": "75K subscribers",
        "description": "Building Python AI agents, CrewAI, AutoGen, and modern open-source multi-agent LLM systems.",
        "videoCount": 15,
        "tags": ["cole medin", "ai agents", "crewai", "autogen", "langchain", "python"]
    },
    {
        "id": "3blue1brown",
        "name": "3Blue1Brown",
        "handle": "@3blue1brown",
        "domain": "AI & Machine Learning",
        "category": "Deep Learning (CNN, RNN, Transformers)",
        "subcategoryId": 2,
        "subscriberCount": "6.4M subscribers",
        "description": "Visualizing neural networks, linear algebra, calculus, and the mathematics that power machine learning.",
        "videoCount": 20,
        "tags": ["3blue1brown", "grant sanderson", "math", "linear algebra", "calculus", "neural networks"]
    },
    {
        "id": "statquest",
        "name": "StatQuest with Josh Starmer",
        "handle": "@statquest",
        "domain": "AI & Machine Learning",
        "category": "Machine Learning fundamentals",
        "subcategoryId": 1,
        "subscriberCount": "1.2M subscribers",
        "description": "BAM! Making machine learning, neural networks, PCA, logistic regression, and statistics crystal clear.",
        "videoCount": 22,
        "tags": ["statquest", "josh starmer", "machine learning", "statistics", "neural networks", "pca"]
    },
    {
        "id": "deeplearning-ai",
        "name": "DeepLearning.AI",
        "handle": "@DeepLearningAI",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "subscriberCount": "410K subscribers",
        "description": "Andrew Ng's official channel for expert talks, deep learning specializations, and generative AI short courses.",
        "videoCount": 30,
        "tags": ["deeplearning.ai", "andrew ng", "ai specialization", "machine learning", "genai"]
    },
    {
        "id": "yannic-kilcher",
        "name": "Yannic Kilcher",
        "handle": "@YannicKilcher",
        "domain": "AI & Machine Learning",
        "category": "Deep Learning (CNN, RNN, Transformers)",
        "subcategoryId": 2,
        "subscriberCount": "250K subscribers",
        "description": "Detailed walkthroughs of cutting-edge AI research papers, transformer architectures, and ML breakthroughs.",
        "videoCount": 18,
        "tags": ["yannic kilcher", "paper review", "deep learning", "transformers", "ai research"]
    },
    {
        "id": "ai-explained",
        "name": "AI Explained",
        "handle": "@AIExplained",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "subscriberCount": "320K subscribers",
        "description": "Hype-free, evidence-based breakdowns of major frontier model releases, benchmark testing, and AI safety.",
        "videoCount": 16,
        "tags": ["ai explained", "frontier models", "gpt-5", "claude", "gemini", "ai safety"]
    },
    {
        "id": "ai-coffee-break",
        "name": "AI Coffee Break with Letitia",
        "handle": "@AICoffeeBreak",
        "domain": "AI & Machine Learning",
        "category": "Machine Learning fundamentals",
        "subcategoryId": 1,
        "subscriberCount": "110K subscribers",
        "description": "Visual summaries of machine learning concepts, NLP research papers, and open-source AI code.",
        "videoCount": 14,
        "tags": ["ai coffee break", "letitia", "nlp", "transformers", "machine learning"]
    },
    {
        "id": "sentdex",
        "name": "sentdex",
        "handle": "@sentdex",
        "domain": "Programming Languages",
        "category": "Python",
        "subcategoryId": 9,
        "subscriberCount": "1.3M subscribers",
        "description": "Python programming from scratch, neural networks from pure code, machine learning with PyTorch, and robotics.",
        "videoCount": 35,
        "tags": ["sentdex", "harrison kinsley", "python", "machine learning", "pytorch", "neural networks"]
    },
    {
        "id": "codebasics",
        "name": "Codebasics",
        "handle": "@codebasics",
        "domain": "AI & Machine Learning",
        "category": "Machine Learning fundamentals",
        "subcategoryId": 1,
        "subscriberCount": "1.1M subscribers",
        "description": "Practical data science, machine learning portfolio projects, SQL, PowerBI, and data analytics roadmaps by Dhaval Patel.",
        "videoCount": 26,
        "tags": ["codebasics", "data science", "machine learning", "python", "sql", "data analytics"]
    },
    {
        "id": "ai-epiphany",
        "name": "Aleksa Gordić - The AI Epiphany",
        "handle": "@TheAIEpiphany",
        "domain": "AI & Machine Learning",
        "category": "Deep Learning (CNN, RNN, Transformers)",
        "subcategoryId": 2,
        "subscriberCount": "70K subscribers",
        "description": "Deep code walkthroughs of famous transformer architectures, PyTorch implementations, and diffusion models.",
        "videoCount": 12,
        "tags": ["ai epiphany", "aleksa gordic", "pytorch", "transformers", "deep learning"]
    },

    # Quick Tech News, Trends & Overviews (6 Channels)
    {
        "id": "fireship",
        "name": "Fireship",
        "handle": "@Fireship",
        "domain": "Cloud & DevOps",
        "category": "Kubernetes & containerization",
        "subcategoryId": 30,
        "subscriberCount": "3.1M subscribers",
        "description": "High-intensity code tutorials to help you build apps faster. Famous for 'in 100 Seconds' format.",
        "videoCount": 24,
        "tags": ["fireship", "docker", "100s", "cloud", "javascript", "rust"]
    },
    {
        "id": "two-minute-papers",
        "name": "Two Minute Papers",
        "handle": "@TwoMinutePapers",
        "domain": "AI & Machine Learning",
        "category": "Computer Vision",
        "subcategoryId": 4,
        "subscriberCount": "1.6M subscribers",
        "description": "What a time to be alive! Bite-sized summaries of cutting-edge AI, neural rendering, and computer graphics research.",
        "videoCount": 28,
        "tags": ["two minute papers", "karoly zsolnai-feher", "computer graphics", "ai research", "physics simulation"]
    },
    {
        "id": "theo-t3",
        "name": "Theo - t3․gg",
        "handle": "@t3dotgg",
        "domain": "Web Development",
        "category": "Full-Stack Frameworks",
        "subcategoryId": 19,
        "subscriberCount": "320K subscribers",
        "description": "Modern TypeScript, Next.js, React 19 server actions, TailwindCSS, and candid full-stack web architecture insights.",
        "videoCount": 18,
        "tags": ["theo", "t3.gg", "next.js", "react 19", "typescript", "fullstack", "architecture"]
    },
    {
        "id": "theprimeagen",
        "name": "ThePrimeagen",
        "handle": "@ThePrimeagen",
        "domain": "Software Engineering Practice",
        "category": "Clean code & refactoring",
        "subcategoryId": 56,
        "subscriberCount": "720K subscribers",
        "description": "Performance thinking, editor workflows, algorithms, Rust, and unapologetic software engineering opinions.",
        "videoCount": 24,
        "tags": ["theprimeagen", "primeagen", "algorithms", "rust", "neovim", "performance", "clean code"]
    },
    {
        "id": "the-primetime",
        "name": "The PrimeTime",
        "handle": "@ThePrimeTimeagen",
        "domain": "Software Engineering Practice",
        "category": "Software Engineering Practice",
        "subcategoryId": 53,
        "subscriberCount": "410K subscribers",
        "description": "Casual tech discussions, coding reactions, software industry debates, and developer culture.",
        "videoCount": 22,
        "tags": ["the primetime", "primeagen", "tech debates", "developer news", "reactions"]
    },
    {
        "id": "neetcode",
        "name": "NeetCode",
        "handle": "@NeetCode",
        "domain": "Software Engineering Practice",
        "category": "Interview preparation & coding challenges",
        "subcategoryId": 55,
        "subscriberCount": "850K subscribers",
        "description": "Data Structures, Algorithms, Blind 75 LeetCode solutions, and System Design interview preparation.",
        "videoCount": 20,
        "tags": ["neetcode", "dsa", "leetcode", "algorithms", "blind 75", "system design"]
    },

    # Full Courses & Structured Learning (9 Channels)
    {
        "id": "freecodecamp",
        "name": "freeCodeCamp.org",
        "handle": "@freecodecamp",
        "domain": "AI & Machine Learning",
        "category": "Computer Vision",
        "subcategoryId": 4,
        "subscriberCount": "9.8M subscribers",
        "description": "Learn to code for free with complete video courses on Python, AI, Machine Learning, and Web Development.",
        "videoCount": 42,
        "tags": ["freecodecamp", "python", "courses", "computer vision", "opencv", "git"]
    },
    {
        "id": "the-net-ninja",
        "name": "The Net Ninja",
        "handle": "@NetNinja",
        "domain": "Web Development",
        "category": "Frontend frameworks (React, Vue, Svelte)",
        "subcategoryId": 17,
        "subscriberCount": "1.3M subscribers",
        "description": "Black-belt step-by-step masterclasses on React, Node.js, TypeScript, Next.js, and modern full-stack web development.",
        "videoCount": 35,
        "tags": ["net ninja", "react", "typescript", "node.js", "vue", "frontend", "javascript"]
    },
    {
        "id": "traversy-media",
        "name": "Traversy Media",
        "handle": "@TraversyMedia",
        "domain": "Web Development",
        "category": "Frontend frameworks (React, Vue, Svelte)",
        "subcategoryId": 17,
        "subscriberCount": "2.2M subscribers",
        "description": "Practical, project-based web development and programming tutorials from HTML/CSS to React and Node.",
        "videoCount": 20,
        "tags": ["traversy", "react", "frontend", "javascript", "web dev"]
    },
    {
        "id": "programming-with-mosh",
        "name": "Programming with Mosh",
        "handle": "@programmingwithmosh",
        "domain": "Programming Languages",
        "category": "Python",
        "subcategoryId": 9,
        "subscriberCount": "3.8M subscribers",
        "description": "Clear, concise tutorials on Python, JavaScript, React, C#, SQL, and fundamental software engineering practices.",
        "videoCount": 30,
        "tags": ["mosh hamedani", "programming with mosh", "python", "javascript", "c#", "sql"]
    },
    {
        "id": "academind",
        "name": "Academind",
        "handle": "@academind",
        "domain": "Web Development",
        "category": "Frontend frameworks (React, Vue, Svelte)",
        "subcategoryId": 17,
        "subscriberCount": "920K subscribers",
        "description": "Comprehensive web development tutorials on React, Angular, Vue, Flutter, Next.js, and Node by Maximilian Schwarzmüller.",
        "videoCount": 25,
        "tags": ["academind", "maximilian schwarzmuller", "react", "flutter", "vue", "web dev"]
    },
    {
        "id": "bro-code",
        "name": "Bro Code",
        "handle": "@BroCodez",
        "domain": "Programming Languages",
        "category": "C / C++",
        "subcategoryId": 14,
        "subscriberCount": "2.1M subscribers",
        "description": "Comprehensive 12-hour programming masterclasses on Python, Java, C++, C#, HTML/CSS, and JavaScript.",
        "videoCount": 22,
        "tags": ["bro code", "c++", "java", "python", "full course", "beginners"]
    },
    {
        "id": "programming-knowledge",
        "name": "ProgrammingKnowledge",
        "handle": "@ProgrammingKnowledge",
        "domain": "Programming Languages",
        "category": "Java",
        "subcategoryId": 13,
        "subscriberCount": "1.7M subscribers",
        "description": "Step-by-step tutorials on Java, Android development, Python, C++, Linux command line, and database administration.",
        "videoCount": 30,
        "tags": ["programmingknowledge", "java", "android", "python", "linux", "c++"]
    },
    {
        "id": "edureka",
        "name": "Edureka!",
        "handle": "@edurekaIN",
        "domain": "Cloud & DevOps",
        "category": "DevOps & SRE principles",
        "subcategoryId": 29,
        "subscriberCount": "4.1M subscribers",
        "description": "Live bootcamps and comprehensive tutorials on DevOps, Cloud Computing, Big Data, Machine Learning, and AWS/Azure.",
        "videoCount": 35,
        "tags": ["edureka", "devops", "cloud", "aws", "azure", "docker", "kubernetes"]
    },
    {
        "id": "simplilearn",
        "name": "Simplilearn",
        "handle": "@SimplilearnOfficial",
        "domain": "Cloud & DevOps",
        "category": "Cloud Computing Infrastructure",
        "subcategoryId": 31,
        "subscriberCount": "3.9M subscribers",
        "description": "Full certification courses on Cyber Security, Cloud Computing, Full Stack Web Development, and AI Engineering.",
        "videoCount": 32,
        "tags": ["simplilearn", "cyber security", "cloud computing", "full stack", "certifications"]
    },

    # Frontend & Web Development (10 Channels)
    {
        "id": "web-dev-simplified",
        "name": "Web Dev Simplified",
        "handle": "@WebDevSimplified",
        "domain": "Web Development",
        "category": "Frontend frameworks (React, Vue, Svelte)",
        "subcategoryId": 17,
        "subscriberCount": "1.6M subscribers",
        "description": "Crystal-clear explanations of tricky JavaScript concepts, React hooks (useEffect, useState), Fetch API, and frontend system architecture.",
        "videoCount": 28,
        "tags": ["web dev simplified", "react", "useeffect", "usestate", "javascript", "frontend", "hooks"]
    },
    {
        "id": "kevin-powell",
        "name": "Kevin Powell",
        "handle": "@KevinPowell",
        "domain": "Web Development",
        "category": "CSS, animations & design systems",
        "subcategoryId": 21,
        "subscriberCount": "950K subscribers",
        "description": "The King of CSS. Expert-level responsive layouts, CSS Grid, Flexbox, custom properties, animations, and modern design systems.",
        "videoCount": 25,
        "tags": ["kevin powell", "css", "css grid", "flexbox", "responsive design", "animations", "tailwind"]
    },
    {
        "id": "javascript-mastery",
        "name": "JavaScript Mastery",
        "handle": "@javascriptmastery",
        "domain": "Web Development",
        "category": "Full-Stack Frameworks",
        "subcategoryId": 19,
        "subscriberCount": "980K subscribers",
        "description": "Build high-end, production-ready full-stack applications with Next.js, React, TailwindCSS, TypeScript, and Three.js.",
        "videoCount": 22,
        "tags": ["javascript mastery", "adrian hajdin", "nextjs", "react", "threejs", "fullstack"]
    },
    {
        "id": "design-course",
        "name": "DesignCourse",
        "handle": "@DesignCourse",
        "domain": "Web Development",
        "category": "CSS, animations & design systems",
        "subcategoryId": 21,
        "subscriberCount": "1.1M subscribers",
        "description": "Gary Simon's UI/UX design masterclasses, Figma to code tutorials, frontend animations, and typography discipline.",
        "videoCount": 24,
        "tags": ["designcourse", "gary simon", "ui ux", "figma", "css", "web design", "frontend"]
    },
    {
        "id": "codevolution",
        "name": "Codevolution",
        "handle": "@Codevolution",
        "domain": "Web Development",
        "category": "Frontend frameworks (React, Vue, Svelte)",
        "subcategoryId": 17,
        "subscriberCount": "540K subscribers",
        "description": "Structured frontend series on React, Vue, Next.js, GraphQL, React Query, and TypeScript by Vishwas.",
        "videoCount": 30,
        "tags": ["codevolution", "react", "vue", "nextjs", "graphql", "react query"]
    },
    {
        "id": "lama-dev",
        "name": "Lama Dev",
        "handle": "@LamaDev",
        "domain": "Web Development",
        "category": "Full-Stack Frameworks",
        "subcategoryId": 19,
        "subscriberCount": "410K subscribers",
        "description": "Full-stack web application clones (E-commerce, Social Media, Real Estate) built with React, Node.js, MongoDB, and Next.js.",
        "videoCount": 20,
        "tags": ["lama dev", "fullstack clone", "mern stack", "react", "nextjs", "mongodb"]
    },
    {
        "id": "coder-coder",
        "name": "Coder Coder",
        "handle": "@TheCoderCoder",
        "domain": "Web Development",
        "category": "CSS, animations & design systems",
        "subcategoryId": 21,
        "subscriberCount": "490K subscribers",
        "description": "Practical web development tips, responsive CSS layouts, HTML semantics, and beginner frontend roadmaps by Jessica Chan.",
        "videoCount": 18,
        "tags": ["coder coder", "jessica chan", "css", "html", "responsive", "frontend"]
    },
    {
        "id": "developedbyed",
        "name": "DevelopedByEd",
        "handle": "@DevelopedByEd",
        "domain": "Web Development",
        "category": "Frontend frameworks (React, Vue, Svelte)",
        "subcategoryId": 17,
        "subscriberCount": "890K subscribers",
        "description": "Creative coding tutorials on React, full-stack JavaScript, CSS animations, Three.js, and modern creative web design.",
        "videoCount": 20,
        "tags": ["developedbyed", "creative web dev", "react", "animations", "threejs", "javascript"]
    },
    {
        "id": "ania-kubow",
        "name": "Ania Kubów",
        "handle": "@AniaKubow",
        "domain": "Web Development",
        "category": "Frontend frameworks (React, Vue, Svelte)",
        "subcategoryId": 17,
        "subscriberCount": "380K subscribers",
        "description": "Learn JavaScript and React by coding famous retro games (Pacman, Tetris, Space Invaders) and web3 apps.",
        "videoCount": 18,
        "tags": ["ania kubow", "javascript games", "react", "web3", "beginner projects"]
    },
    {
        "id": "florin-pop",
        "name": "Florin Pop",
        "handle": "@FlorinPop",
        "domain": "Web Development",
        "category": "Frontend frameworks (React, Vue, Svelte)",
        "subcategoryId": 17,
        "subscriberCount": "220K subscribers",
        "description": "100 Days 100 Projects, rapid frontend coding challenges, JavaScript algorithms, and interactive web tools.",
        "videoCount": 20,
        "tags": ["florin pop", "coding challenge", "100 projects", "javascript", "css"]
    },

    # Backend, System Design & DevOps (11 Channels)
    {
        "id": "bytebytego",
        "name": "ByteByteGo (Alex Xu)",
        "handle": "@ByteByteGo",
        "domain": "Cloud & DevOps",
        "category": "Distributed systems & consensus",
        "subcategoryId": 34,
        "subscriberCount": "1.2M subscribers",
        "description": "Visualized system design, large scale distributed systems, microservices, and FAANG technical interview architecture.",
        "videoCount": 15,
        "tags": ["bytebytego", "alex xu", "system design", "architecture", "scalability", "microservices"]
    },
    {
        "id": "hussein-nasser",
        "name": "Hussein Nasser",
        "handle": "@hnasr",
        "domain": "Security & Data",
        "category": "Relational databases (PostgreSQL, MySQL)",
        "subcategoryId": 23,
        "subscriberCount": "410K subscribers",
        "description": "Deep engineering dives into backend internals, networking protocols (HTTP/3, TCP, QUIC), database indexing, B-Trees, and WAL.",
        "videoCount": 22,
        "tags": ["hussein nasser", "database", "backend", "networking", "http/3", "indexing", "b-trees", "postgres"]
    },
    {
        "id": "gaurav-sen",
        "name": "Gaurav Sen",
        "handle": "@gkcs",
        "domain": "Cloud & DevOps",
        "category": "Distributed systems & consensus",
        "subcategoryId": 34,
        "subscriberCount": "520K subscribers",
        "description": "System design problem-solving, Bloom filters, caching architectures, distributed consensus, and tech interview deep dives.",
        "videoCount": 20,
        "tags": ["gaurav sen", "system design", "bloom filters", "distributed systems", "caching", "architecture"]
    },
    {
        "id": "continuous-delivery",
        "name": "Continuous Delivery",
        "handle": "@ContinuousDelivery",
        "domain": "Cloud & DevOps",
        "category": "CI/CD pipelines & automation",
        "subcategoryId": 32,
        "subscriberCount": "290K subscribers",
        "description": "Dave Farley (co-author of the Continuous Delivery book) on modern software engineering, automated testing, TDD, and CI/CD discipline.",
        "videoCount": 20,
        "tags": ["continuous delivery", "dave farley", "ci/cd", "tdd", "testing", "devops", "software engineering"]
    },
    {
        "id": "networkchuck",
        "name": "NetworkChuck",
        "handle": "@NetworkChuck",
        "domain": "Cloud & DevOps",
        "category": "Networking & DNS infrastructure",
        "subcategoryId": 35,
        "subscriberCount": "4.1M subscribers",
        "description": "Networking protocols, Linux command line, Docker containers, Wireshark, cloud servers, and cyber security with high coffee energy.",
        "videoCount": 28,
        "tags": ["networkchuck", "networking", "linux", "docker", "wireshark", "cloud", "servers"]
    },
    {
        "id": "techworld-with-nana",
        "name": "TechWorld with Nana",
        "handle": "@TechWorldwithNana",
        "domain": "Cloud & DevOps",
        "category": "Kubernetes & containerization",
        "subcategoryId": 30,
        "subscriberCount": "1.1M subscribers",
        "description": "DevOps, Docker, Kubernetes, Prometheus, Terraform, GitLab CI, and cloud engineering simplified with crystal-clear animations.",
        "videoCount": 25,
        "tags": ["techworld with nana", "devops", "kubernetes", "docker", "terraform", "ci/cd"]
    },
    {
        "id": "jeff-geerling",
        "name": "Jeff Geerling",
        "handle": "@JeffGeerling",
        "domain": "Cloud & DevOps",
        "category": "DevOps & SRE principles",
        "subcategoryId": 29,
        "subscriberCount": "720K subscribers",
        "description": "Ansible automation, Kubernetes on bare metal, homelab infrastructure, Raspberry Pi clusters, and networking hardware.",
        "videoCount": 22,
        "tags": ["jeff geerling", "ansible", "kubernetes", "homelab", "raspberry pi", "infrastructure"]
    },
    {
        "id": "stephane-maarek",
        "name": "Stéphane Maarek",
        "handle": "@StephaneMaarek",
        "domain": "Cloud & DevOps",
        "category": "Cloud Computing Infrastructure",
        "subcategoryId": 31,
        "subscriberCount": "190K subscribers",
        "description": "World-renowned AWS Certified Solutions Architect training, Apache Kafka distributed messaging, and cloud system designs.",
        "videoCount": 20,
        "tags": ["stephane maarek", "aws", "cloud architecture", "kafka", "distributed streaming"]
    },
    {
        "id": "kunal-kushwaha",
        "name": "Kunal Kushwaha",
        "handle": "@KunalKushwaha",
        "domain": "Cloud & DevOps",
        "category": "Kubernetes & containerization",
        "subcategoryId": 30,
        "subscriberCount": "550K subscribers",
        "description": "Complete DevOps Bootcamp, Git/GitHub, open-source contributions, Docker, Kubernetes, and DSA interview roadmaps.",
        "videoCount": 25,
        "tags": ["kunal kushwaha", "devops", "open source", "kubernetes", "git", "dsa bootcamp"]
    },
    {
        "id": "ibm-technology",
        "name": "IBM Technology",
        "handle": "@IBMTechnology",
        "domain": "Cloud & DevOps",
        "category": "Cloud Computing Infrastructure",
        "subcategoryId": 31,
        "subscriberCount": "1.8M subscribers",
        "description": "Clear whiteboard explainers by IBM Fellows on cloud architectures, containers, quantum computing, generative AI, and enterprise tech.",
        "videoCount": 35,
        "tags": ["ibm technology", "whiteboard", "cloud", "containers", "quantum", "enterprise"]
    },
    {
        "id": "ddd-europe",
        "name": "Domain-Driven Design Europe",
        "handle": "@DddEurope",
        "domain": "Software Engineering Practice",
        "category": "System Design Interview (High & Low Level)",
        "subcategoryId": 53,
        "subscriberCount": "45K subscribers",
        "description": "The premier conference on software architecture, Domain-Driven Design (DDD), bounded contexts, event sourcing, and legacy refactoring.",
        "videoCount": 16,
        "tags": ["ddd europe", "domain driven design", "software architecture", "event sourcing", "microservices"]
    }
]

print(f"Total channels in list: {len(CHANNELS_DATA)}")

# Format JavaScript code
channels_js = "export const DEFAULT_CURATED_CHANNELS: TrackedChannel[] = [\n"
for ch in CHANNELS_DATA:
    channels_js += f"""  {{
    id: '{ch["id"]}',
    name: '{ch["name"]}',
    handle: '{ch["handle"]}',
    avatarUrl: 'https://unavatar.io/youtube/{ch["handle"]}',
    domain: '{ch["domain"]}',
    category: '{ch["category"]}',
    subcategoryId: {ch["subcategoryId"]},
    subscriberCount: '{ch["subscriberCount"]}',
    description: '{ch["description"]}',
    videoCount: {ch["videoCount"]},
    addedAt: Date.now() - 15 * 86400000,
    tags: {json.dumps(ch["tags"])},
  }},\n"""
channels_js += "];\n"

with open("src/components/curatedChannels.ts", "w", encoding="utf-8") as f:
    f.write(f"// 55 Premier Software Engineering, System Design, AI and Coding Channels\nimport {{ TrackedChannel }} from '../types';\n\n{channels_js}")

print("Saved src/components/curatedChannels.ts successfully!")
