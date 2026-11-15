# GEMINI.md - Antigravity Agent Core Project Instructions

> [!IMPORTANT]
> **CRITICAL PROJECT IDENTITY & GOAL: DEV-TUBE / RECTRACKER**
> **THIS IS NOT A BACKLINK BUILDER OR SEO CAMPAIGN REPOSITORY.**
> Under NO circumstances should any agent treat this project as a backlink builder or hair clinic SEO tracker. Any legacy references to backlinks or SEO spreadsheets are completely deprecated and must be ignored.

---

## 🎯 What is This Project?
**DevTube (RecTracker)** is an ad-free, high-performance **YouTube-like video platform and recommendation engine built exclusively for the software developer world**.

It covers **8 Tech Domains and 57 Granular Categories** spanning the entire spectrum of software engineering, artificial intelligence, machine learning, systems architecture, DevOps, and technical career preparation.

---

## 🏛️ Core Architectural Pillars

### 1. 100% In-Portal Ad-Free Streaming (Zero YouTube Redirections)
* All videos must play inside the website's modal player (`VideoPlayerModal.tsx`).
* The player uses an `iframe` with `sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"` (omitting `allow-top-navigation`) to prevent YouTube's end-screens or overlays from redirecting the parent browser window.
* Every video card across the entire portal must feature a direct **"▶ Play on Website"** action that opens the in-portal modal.
* The modal includes an in-modal **"🎬 Related Masterclasses & Next Up"** carousel for sequential curriculum streaming.

### 2. Universal YouTube Engine (800M+ Videos)
* The platform is not limited to a static list. It acts as a universal frontend client for YouTube (similar to Invidious / Piped):
  * **Direct URL / ID Resolver**: Users can paste ANY YouTube video URL, shorts URL, or 11-char ID to stream immediately on the website.
  * **Live Search Proxy**: Users can query the entire live YouTube database via API / proxy.
  * **Creator Channel Hubs**: Complete multi-episode playlists and channel uploads for top creators (Krish Naik, Piyush Garg, Andrej Karpathy, Fireship, ByteByteGo, Chai aur Code, CodeWithHarry, NeetCode, freeCodeCamp).

### 3. Topic-Wise 4-Layer Recommendation Engine
* **Layer 1: Category Affinity Knowledge Graph**: Discovers correlated categories (e.g., LangChain → Vector DBs → MLOps).
* **Layer 2: User Interaction Learning**: Tracks Likes, Bookmarks, and Views in local state.
* **Layer 3: Temporal Recency & Freshness Tuning**: Configurable decay weights across Today (<24h), Past 7 Days, Past 30 Days, and This Quarter.
* **Layer 4: Real-Time Groq AI Curation**: Calls `POST /api/recommendations/groq-curate` powered by Groq's `qwen/qwen3.8-27b` model to generate tailored curricula with rationale for any developer role.

### 4. 8 Tech Domains & 57 Categories
1. **AI & Machine Learning** (ML Foundations, Deep Learning, NLP, Computer Vision, Generative AI & LLMs, RL, Robotics, MLOps)
2. **Programming Languages** (Python, JavaScript/TypeScript, Rust, Go, Java, C/C++, C#, Kotlin/Swift)
3. **Web Development** (Frontend, Backend, Full-Stack Next.js/React 19, CSS/Tailwind, REST/GraphQL, WebAssembly)
4. **Mobile Development** (React Native, Flutter, iOS Swift, Android Kotlin)
5. **Cloud & DevOps** (DevOps & SRE, Docker Containerization, Kubernetes, CI/CD Actions, Terraform IaC, System Design)
6. **Security & Data** (Cybersecurity, SSO & Auth, Cryptography, SQL, NoSQL, Data Engineering, Vector Databases)
7. **Emerging Tech** (Web3, AR/VR, Quantum Computing, Edge Computing, IoT)
8. **Software Engineering Practice** (System Design Interview, Blind 75 LeetCode DSA, Clean Code, Testing/QA)

---

## ⚡ Technical Stack
* **Frontend**: React 19, TypeScript, TailwindCSS, Vite, Lucide Icons, Recharts, Canvas Confetti.
* **Backend**: FastAPI (`scripts/realtime_server.py`), Uvicorn, Server-Sent Events (SSE) notification stream, Groq LLM integration.
* **Tunnels**: Cloudflare Quick Tunnels (`cloudflared.exe`) for global HTTPS access.
* **PWA & Mobile**: Offline caching, service workers, standalone mobile installation, QR code scanner.

---

## 🚫 Strictly Forbidden Behaviors
1. **NEVER** convert this project back to a backlink or SEO campaign tool.
2. **NEVER** add `target="_blank"` links to `youtube.com` on video cards; all videos must play in the website's modal player.
3. **NEVER** insert unverified/random YouTube video IDs that return "Video unavailable". Always verify playable IDs.
4. **NEVER** remove the PWA / Mobile capability or break the ad-free in-portal streaming experience.
