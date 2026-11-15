#!/usr/bin/env python3
"""
Taxonomy: 8 Domains and 57 Software Development Categories
Provides Python models and helper functions matching the system taxonomy.
"""

from typing import List, Dict, Any, Optional

DOMAINS: List[Dict[str, Any]] = [
    {"id": "ai-ml", "name": "AI & Machine Learning", "icon": "🤖", "color": "purple"},
    {"id": "languages", "name": "Programming Languages", "icon": "💻", "color": "blue"},
    {"id": "web-dev", "name": "Web Development", "icon": "🌐", "color": "cyan"},
    {"id": "mobile-dev", "name": "Mobile Development", "icon": "📱", "color": "pink"},
    {"id": "cloud-devops", "name": "Cloud & DevOps", "icon": "☁️", "color": "sky"},
    {"id": "security-data", "name": "Security & Data", "icon": "🔐", "color": "emerald"},
    {"id": "emerging-tech", "name": "Emerging Tech", "icon": "🎯", "color": "amber"},
    {"id": "ux-practice", "name": "UX & Practice", "icon": "🎨", "color": "rose"},
]

SUBCATEGORIES: List[Dict[str, Any]] = [
    # AI & Machine Learning (1-8)
    {"id": 1, "name": "Machine Learning fundamentals", "domainId": "ai-ml", "domainName": "AI & Machine Learning", "affinity": [2, 9, 7, 45, 8]},
    {"id": 2, "name": "Deep Learning (CNN, RNN, Transformers)", "domainId": "ai-ml", "domainName": "AI & Machine Learning", "affinity": [1, 3, 4, 5, 9, 8]},
    {"id": 3, "name": "Natural Language Processing (NLP)", "domainId": "ai-ml", "domainName": "AI & Machine Learning", "affinity": [2, 5, 9, 7]},
    {"id": 4, "name": "Computer Vision", "domainId": "ai-ml", "domainName": "AI & Machine Learning", "affinity": [2, 1, 9, 28, 51]},
    {"id": 5, "name": "Generative AI & LLMs", "domainId": "ai-ml", "domainName": "AI & Machine Learning", "affinity": [2, 3, 8, 9, 7]},
    {"id": 6, "name": "Reinforcement Learning", "domainId": "ai-ml", "domainName": "AI & Machine Learning", "affinity": [1, 2, 5, 9]},
    {"id": 7, "name": "Recommender Systems", "domainId": "ai-ml", "domainName": "AI & Machine Learning", "affinity": [1, 5, 9, 45, 43]},
    {"id": 8, "name": "Model Deployment (MLOps)", "domainId": "ai-ml", "domainName": "AI & Machine Learning", "affinity": [1, 2, 5, 30, 29, 32]},

    # Programming Languages (9-16)
    {"id": 9, "name": "Python", "domainId": "languages", "domainName": "Programming Languages", "affinity": [1, 2, 5, 7, 18, 43]},
    {"id": 10, "name": "JavaScript / TypeScript", "domainId": "languages", "domainName": "Programming Languages", "affinity": [17, 18, 24, 21, 19]},
    {"id": 11, "name": "Go", "domainId": "languages", "domainName": "Programming Languages", "affinity": [30, 36, 37, 29, 18]},
    {"id": 12, "name": "Rust", "domainId": "languages", "domainName": "Programming Languages", "affinity": [22, 37, 15, 47, 40]},
    {"id": 13, "name": "Kotlin", "domainId": "languages", "domainName": "Programming Languages", "affinity": [26, 14, 18, 25]},
    {"id": 14, "name": "Java", "domainId": "languages", "domainName": "Programming Languages", "affinity": [18, 13, 36, 44, 37]},
    {"id": 15, "name": "C/C++", "domainId": "languages", "domainName": "Programming Languages", "affinity": [12, 47, 49, 37]},
    {"id": 16, "name": "Swift", "domainId": "languages", "domainName": "Programming Languages", "affinity": [27, 28, 25]},

    # Web Development (17-23)
    {"id": 17, "name": "Frontend frameworks (React, Vue, Svelte)", "domainId": "web-dev", "domainName": "Web Development", "affinity": [10, 24, 21, 22, 53]},
    {"id": 18, "name": "Backend frameworks (Node.js, Django, Spring)", "domainId": "web-dev", "domainName": "Web Development", "affinity": [9, 10, 21, 36, 43]},
    {"id": 19, "name": "Progressive Web Apps (PWAs)", "domainId": "web-dev", "domainName": "Web Development", "affinity": [17, 22, 24, 10]},
    {"id": 20, "name": "Web 3.0 / Decentralized web", "domainId": "web-dev", "domainName": "Web Development", "affinity": [40, 41, 42, 17, 10]},
    {"id": 21, "name": "GraphQL & API design", "domainId": "web-dev", "domainName": "Web Development", "affinity": [18, 17, 36, 10]},
    {"id": 22, "name": "Web performance optimization", "domainId": "web-dev", "domainName": "Web Development", "affinity": [17, 23, 12, 19]},
    {"id": 23, "name": "Accessibility (a11y)", "domainId": "web-dev", "domainName": "Web Development", "affinity": [17, 22, 53]},

    # Mobile Development (24-28)
    {"id": 24, "name": "React Native", "domainId": "mobile-dev", "domainName": "Mobile Development", "affinity": [17, 10, 25, 26, 27]},
    {"id": 25, "name": "Flutter", "domainId": "mobile-dev", "domainName": "Mobile Development", "affinity": [24, 26, 27]},
    {"id": 26, "name": "Native Android (Kotlin)", "domainId": "mobile-dev", "domainName": "Mobile Development", "affinity": [13, 24, 25, 27]},
    {"id": 27, "name": "Native iOS (Swift)", "domainId": "mobile-dev", "domainName": "Mobile Development", "affinity": [16, 24, 25, 26, 28]},
    {"id": 28, "name": "Mobile AR/VR apps", "domainId": "mobile-dev", "domainName": "Mobile Development", "affinity": [4, 27, 26, 51]},

    # Cloud & DevOps (29-38)
    {"id": 29, "name": "Cloud platforms (AWS, Azure, GCP)", "domainId": "cloud-devops", "domainName": "Cloud & DevOps", "affinity": [30, 31, 32, 33, 35, 36]},
    {"id": 30, "name": "Kubernetes & containerization", "domainId": "cloud-devops", "domainName": "Cloud & DevOps", "affinity": [29, 32, 33, 36, 11]},
    {"id": 31, "name": "Serverless computing", "domainId": "cloud-devops", "domainName": "Cloud & DevOps", "affinity": [29, 18, 36, 47]},
    {"id": 32, "name": "CI/CD pipelines", "domainId": "cloud-devops", "domainName": "Cloud & DevOps", "affinity": [30, 33, 34, 29, 57]},
    {"id": 33, "name": "Infrastructure as Code (IaC)", "domainId": "cloud-devops", "domainName": "Cloud & DevOps", "affinity": [29, 30, 32, 34]},
    {"id": 34, "name": "DevSecOps", "domainId": "cloud-devops", "domainName": "Cloud & DevOps", "affinity": [32, 39, 30, 33]},
    {"id": 35, "name": "FinOps & GreenOps", "domainId": "cloud-devops", "domainName": "Cloud & DevOps", "affinity": [29, 30, 36]},
    {"id": 36, "name": "Microservices architecture", "domainId": "cloud-devops", "domainName": "Cloud & DevOps", "affinity": [30, 37, 21, 29, 18]},
    {"id": 37, "name": "Distributed computing", "domainId": "cloud-devops", "domainName": "Cloud & DevOps", "affinity": [36, 11, 12, 44, 40]},
    {"id": 38, "name": "XOps (AIOps, SecOps)", "domainId": "cloud-devops", "domainName": "Cloud & DevOps", "affinity": [34, 8, 30, 36]},

    # Security & Data (39-45)
    {"id": 39, "name": "Cybersecurity fundamentals", "domainId": "security-data", "domainName": "Security & Data", "affinity": [34, 40, 41, 52]},
    {"id": 40, "name": "Blockchain development", "domainId": "security-data", "domainName": "Security & Data", "affinity": [41, 42, 20, 39, 37]},
    {"id": 41, "name": "Smart contracts", "domainId": "security-data", "domainName": "Security & Data", "affinity": [40, 42, 20, 12, 39]},
    {"id": 42, "name": "NFTs & digital ownership", "domainId": "security-data", "domainName": "Security & Data", "affinity": [40, 41, 20]},
    {"id": 43, "name": "Data engineering", "domainId": "security-data", "domainName": "Security & Data", "affinity": [44, 45, 9, 18, 7]},
    {"id": 44, "name": "Big data (Spark, Hadoop)", "domainId": "security-data", "domainName": "Security & Data", "affinity": [43, 45, 37, 14, 9]},
    {"id": 45, "name": "Predictive analytics", "domainId": "security-data", "domainName": "Security & Data", "affinity": [1, 7, 43, 9]},

    # Emerging Tech (46-52)
    {"id": 46, "name": "Quantum computing", "domainId": "emerging-tech", "domainName": "Emerging Tech", "affinity": [1, 37, 15]},
    {"id": 47, "name": "Edge computing", "domainId": "emerging-tech", "domainName": "Emerging Tech", "affinity": [49, 48, 12, 31, 8]},
    {"id": 48, "name": "5G & real-time applications", "domainId": "emerging-tech", "domainName": "Emerging Tech", "affinity": [47, 49, 37, 28]},
    {"id": 49, "name": "IoT development", "domainId": "emerging-tech", "domainName": "Emerging Tech", "affinity": [47, 48, 15, 12]},
    {"id": 50, "name": "Internet of Behavior (IoB)", "domainId": "emerging-tech", "domainName": "Emerging Tech", "affinity": [7, 45, 53]},
    {"id": 51, "name": "AR/VR enterprise applications", "domainId": "emerging-tech", "domainName": "Emerging Tech", "affinity": [28, 4, 53]},
    {"id": 52, "name": "Digital immune systems", "domainId": "emerging-tech", "domainName": "Emerging Tech", "affinity": [34, 38, 30, 39]},

    # UX & Practice (53-57)
    {"id": 53, "name": "UX/UI design", "domainId": "ux-practice", "domainName": "UX & Practice", "affinity": [17, 23, 54]},
    {"id": 54, "name": "Low-code / No-code platforms", "domainId": "ux-practice", "domainName": "UX & Practice", "affinity": [53, 17, 18]},
    {"id": 55, "name": "Agile & Scrum", "domainId": "ux-practice", "domainName": "UX & Practice", "affinity": [56, 57]},
    {"id": 56, "name": "Remote collaboration tools", "domainId": "ux-practice", "domainName": "UX & Practice", "affinity": [55, 57]},
    {"id": 57, "name": "Open-source contribution", "domainId": "ux-practice", "domainName": "UX & Practice", "affinity": [32, 55, 56, 10, 9]},
]

def get_taxonomy():
    return {
        "domains": DOMAINS,
        "categories": SUBCATEGORIES,
        "total_domains": len(DOMAINS),
        "total_categories": len(SUBCATEGORIES),
    }

