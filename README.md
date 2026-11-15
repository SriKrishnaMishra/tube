# 🎬 DevTube (RecTracker) - The Developer Video Platform

> A distraction-free, ad-free YouTube video streaming portal and personalized recommendation system built exclusively for the global software developer community across **8 Tech Domains and 57 Granular Categories**.


---

## 🌟 Key Features

* **🛡️ 100% In-Portal Ad-Free Streaming**: All masterclasses stream directly in the website's modal player with zero redirection to YouTube.
* **🗺️ 8 Domains & 57 Developer Categories**: Covers AI & ML, Programming Languages, Web Dev, Mobile, Cloud & DevOps, Security & Data, Emerging Tech, and Software Engineering Practice.
* **🧠 4-Layer Dynamic Recommendation Engine**:
  * Hybrid AI Engine (Content + Affinity + Recency)
  * Category Affinity Knowledge Graph
  * User Interaction Signals (Likes, Bookmarks, Views)
  * Real-Time Groq AI Career Curation (`qwen/qwen3.8-27b`)
* **📺 Curated Creator Hubs**: Dedicated tracking for top technical educators (Krish Naik, Piyush Garg, Andrej Karpathy, Fireship, ByteByteGo, Chai aur Code, CodeWithHarry, NeetCode, freeCodeCamp).
* **🌐 Universal YouTube Engine**: Paste ANY YouTube video link or search ANY query to stream ad-free directly inside the platform.
* **📱 Progressive Web App (PWA)**: Installable on Android, iOS, and Windows with a quick camera QR code scanner.
* **⚡ Real-Time Cloudflare Tunnel & SSE**: Accessible globally over secure HTTPS without port forwarding.

---

## 🚀 Quick Start

### 1. Run the Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Start the Real-Time FastAPI Backend
```bash
python scripts/realtime_server.py
```
Backend runs on [http://127.0.0.1:8000](http://127.0.0.1:8000).

### 3. Start the Cloudflare HTTPS Tunnel
```bash
.\cloudflared.exe tunnel --url http://127.0.0.1:3000 --http-host-header localhost:3000
```

---

## 📖 Project Documentation

* 🎯 **[Project Goal & Master Vision](./PROJECT_GOAL.md)**: Deep dive into the mission, developer pain points, and product roadmap.
* 🏗️ **[Technical Architecture](./ARCHITECTURE.md)**: System topology, component tree, sandbox security, and Universal YouTube proxy architecture.
* 📚 **[57-Category Developer Taxonomy](./TAXONOMY_57_DOMAINS.md)**: Full breakdown of all 8 tech domains and 57 granular software categories.
* 🧠 **[Recommendation Engine Specification](./RECOMMENDATION_SYSTEM.md)**: Algorithmic formula, affinity scoring, and Groq LLM curation logic.
* 🤖 **[Antigravity Agent Rules](./GEMINI.md)**: Rules and context enforcement for AI coding assistants.

