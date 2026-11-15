#!/usr/bin/env python3
"""Module 5 — Real-Time AI Backlink Posting & Verification API Server.

Provides a live REST & Server-Sent Events (SSE) interface to orchestrate:
- Real-time AI content generation (SOP Step 5)
- Automated medical & legal gate validation (SOP Step 4)
- Live submission dispatch & URL recording (SOP Steps 6 & 7)
- 7-day post verification (SOP Step 8)
- Real-time queue event streaming

Run server:
    python scripts/realtime_server.py
"""
from __future__ import annotations

import asyncio
import json
import os
import sys
import urllib.parse
from dataclasses import asdict
from pathlib import Path
from typing import Any, AsyncGenerator, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, RedirectResponse
from pydantic import BaseModel

sys.path.insert(0, str(Path(__file__).resolve().parent))
from ai_content_engine import generate_content_for_row, load_asset_kit  # noqa: E402
from auto_poster import execute_auto_post  # noqa: E402
from auto_verify_worker import run_verification  # noqa: E402
from common import Tracker, load_config, parse_date, today, validate_row  # noqa: E402
from weekly_review import compute_metrics  # noqa: E402
from taxonomy import get_taxonomy  # noqa: E402

app = FastAPI(
    title="Real-Time AI Backlink Engine API",
    version="1.0.0",
    description="Automated AI posting and tracking pipeline adhering to QHT Clinic & URoots SOP",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    row: int
    save_draft: bool = True


class PostRequest(BaseModel):
    row: int
    executor: str = "AI-Agent"
    dry_run: bool = False
    live_url: Optional[str] = None


class VerifyRequest(BaseModel):
    row: int
    simulate: bool = False


class QuickGenerateRequest(BaseModel):
    brand: str = "QHT Clinic"
    site_url: str = "https://example-medical-directory.org"
    target_page: str = "https://qhtclinic.com/treatments/hair-transplant"
    anchor: str = "QHT Clinic"
    word_count_mode: str = "Short profile"
    link_type: str = "Profile"


class BatchPostRequest(BaseModel):
    doc_content: str
    brand: str = "QHT Clinic"
    sites: list[str]
    target_page: str = ""
    anchor: str = ""
    link_type: str = "Guest post"
    dry_run: bool = False


class AddRowRequest(BaseModel):
    brand: str
    site_url: str
    target_page: str
    anchor: str
    word_count: str = "Short blog"
    link_type: str = "Directory"


class LegalScanRequest(BaseModel):
    text: str


@app.get("/")
def get_root():
    cfg = load_config()
    return {
        "service": "Real-Time AI Backlink Engine",
        "status": "online",
        "brands": list(cfg.get("brands", {}).keys()),
        "endpoints": [
            "/api/tracker/rows",
            "/api/ai/generate",
            "/api/ai/post",
            "/api/ai/verify",
            "/api/ai/stream-queue",
            "/api/weekly-report",
        ],
    }


@app.get("/api/tracker/rows")
def get_tracker_rows():
    """Retrieve all rows from the Excel tracker."""
    cfg = load_config()
    tr = Tracker(cfg=cfg)
    rows = []
    for r in tr.data_rows():
        row_dict = {"row": r}
        for col in tr.headers:
            val = tr.get(r, col)
            row_dict[col] = val.isoformat() if hasattr(val, "isoformat") else val
        rows.append(row_dict)
    return {"total": len(rows), "rows": rows}


@app.post("/api/ai/generate")
def api_generate_content(req: GenerateRequest):
    """Generate compliant AI content and run legal gate for a given row."""
    cfg = load_config()
    tr = Tracker(cfg=cfg)
    if req.row not in tr.data_rows():
        raise HTTPException(status_code=404, detail=f"Row {req.row} not found in tracker")

    res = generate_content_for_row(req.row, tr, cfg, save_draft=req.save_draft)
    return asdict(res)


@app.post("/api/ai/post")
def api_execute_post(req: PostRequest):
    """Generate content, dispatch submission, and atomically record live URL."""
    cfg = load_config()
    tr = Tracker(cfg=cfg)
    if req.row not in tr.data_rows():
        raise HTTPException(status_code=404, detail=f"Row {req.row} not found in tracker")

    res = execute_auto_post(
        row_num=req.row,
        tr=tr,
        cfg=cfg,
        executor=req.executor,
        dry_run=req.dry_run,
        override_live_url=req.live_url,
    )
    return asdict(res)


@app.post("/api/ai/verify")
def api_verify_row(req: VerifyRequest):
    """Run real-time link verification for a live row."""
    cfg = load_config()
    tr = Tracker(cfg=cfg)
    if req.row not in tr.data_rows():
        raise HTTPException(status_code=404, detail=f"Row {req.row} not found in tracker")

    res = run_verification(req.row, tr, cfg, simulate=req.simulate)
    return res


@app.get("/api/weekly-report")
def api_weekly_report():
    """Get weekly performance metrics and anchor-mix analysis."""
    cfg = load_config()
    tr = Tracker(cfg=cfg)
    metrics = compute_metrics(tr, cfg)
    return metrics


@app.post("/api/ai/quick-generate")
def api_quick_generate(req: QuickGenerateRequest):
    """Generate compliant content directly using Groq/local synthesizer."""
    cfg = load_config()
    kit = load_asset_kit(req.brand, cfg)
    from ai_content_engine import generate_with_llm, synthesize_clinical_content, validate_legal_gate
    llm_res = generate_with_llm(kit, req.site_url, req.target_page, req.anchor, req.word_count_mode, req.link_type, cfg)
    if llm_res:
        title, content, provider = llm_res
    else:
        title, content = synthesize_clinical_content(kit, req.site_url, req.target_page, req.anchor, req.word_count_mode, req.link_type)
        provider = "clinical-synthesis-engine"

    is_compliant, violations = validate_legal_gate(content, cfg)
    words = len(content.split())
    return {
        "brand": req.brand,
        "site_url": req.site_url,
        "title": title,
        "content": content,
        "word_count": words,
        "provider": provider,
        "is_compliant": is_compliant,
        "violations": violations,
    }


@app.post("/api/legal-gate/scan")
def api_scan_legal(req: LegalScanRequest):
    """Real-time legal gate scanner for arbitrary text."""
    cfg = load_config()
    from ai_content_engine import validate_legal_gate
    is_compliant, violations = validate_legal_gate(req.text, cfg)
    return {
        "text_length": len(req.text),
        "word_count": len(req.text.split()),
        "is_compliant": is_compliant,
        "violations": violations,
    }


@app.post("/api/tracker/add-row")
def api_add_row(req: AddRowRequest):
    """Append a new prospect row to the Excel tracker."""
    cfg = load_config()
    tr = Tracker(cfg=cfg)
    new_prospect = {
        "Brand": req.brand,
        "Site / URL": req.site_url,
        "Decision": "Do first",
        "Week order": 1,
        "Target page": req.target_page,
        "Anchor": req.anchor,
        "Anchor type": "brand" if req.anchor.lower() == req.brand.lower() else "partial_keyword",
        "Word count": req.word_count,
        "Link type": req.link_type,
        "Dofollow / Nofollow": "Dofollow",
        "Status": "Not started",
        "Notes": "Added via Web Dashboard",
    }
    row_num = tr.append(new_prospect)
    tr.save()
    return {"success": True, "row": row_num, "prospect": new_prospect}


@app.post("/api/batch-post")
def api_batch_post(req: BatchPostRequest):
    """Batch post a document to multiple websites."""
    cfg = load_config()
    tr = Tracker(cfg=cfg)
    from batch_poster import extract_title_and_body, post_doc_to_site
    from ai_content_engine import validate_legal_gate
    title, body = extract_title_and_body(req.doc_content)
    is_compliant, violations = validate_legal_gate(body, cfg)
    if not is_compliant:
        return {"success": False, "violations": violations, "message": "Document blocked by Legal Gate"}

    results = []
    for site in req.sites:
        res = post_doc_to_site(
            site_url=site,
            brand_name=req.brand,
            title=title,
            content=body,
            target_page=req.target_page or "https://qhtclinic.com",
            anchor=req.anchor or req.brand,
            link_type=req.link_type,
            tr=tr,
            cfg=cfg,
            executor="Web-Dashboard",
            dry_run=req.dry_run,
        )
        results.append(res)
    return {"success": True, "total_posted": len(results), "results": results}


@app.get("/api/apify/items")
def api_get_apify_items(dataset_id: Optional[str] = None, limit: int = 50):
    """Fetch real scraped YouTube video items from Apify dataset."""
    from apify_service import get_dataset_items
    items = get_dataset_items(dataset_id=dataset_id, limit=limit)
    return {"total": len(items), "items": items}


@app.get("/api/apify/run")
def api_get_apify_run(run_id: Optional[str] = None):
    """Get Apify actor run status and details."""
    from apify_service import get_run
    return get_run(run_id)


@app.get("/api/apify/log")
def api_get_apify_log(run_id: Optional[str] = None):
    """Get Apify actor run text logs."""
    from apify_service import get_log
    return {"log": get_log(run_id)}


@app.post("/api/apify/abort")
def api_abort_apify_run(run_id: Optional[str] = None):
    """Abort current Apify actor run."""
    from apify_service import abort_run
    return abort_run(run_id)


@app.post("/api/apify/resurrect")
def api_resurrect_apify_run(run_id: Optional[str] = None):
    """Resurrect Apify actor run."""
    from apify_service import resurrect_run
    return resurrect_run(run_id)


@app.get("/api/ai/stream-queue")
async def stream_queue(dry_run: bool = False, executor: str = "AI-Agent"):
    """Server-Sent Events stream: sequentially processes queued rows in real time."""
    async def event_generator() -> AsyncGenerator[str, None]:
        cfg = load_config()
        tr = Tracker(cfg=cfg)
        queued_rows = [
            r for r in tr.data_rows()
            if str(tr.get(r, "Status") or "") in ("Not started", "In progress")
            and str(tr.get(r, "Decision") or "") not in ("Hold", "Skip")
        ]

        yield f"data: {json.dumps({'event': 'start', 'queued_count': len(queued_rows)})}\n\n"
        await asyncio.sleep(0.1)

        for r in queued_rows:
            brand = str(tr.get(r, "Brand") or "")
            site = str(tr.get(r, "Site / URL") or "")
            yield f"data: {json.dumps({'event': 'processing_row', 'row': r, 'brand': brand, 'site': site})}\n\n"
            await asyncio.sleep(0.4)

            # Step 1: AI Generation & Legal Gate
            gen_res = generate_content_for_row(r, tr, cfg, save_draft=True)
            yield f"data: {json.dumps({'event': 'ai_generated', 'row': r, 'compliant': gen_res.is_compliant, 'words': gen_res.word_count})}\n\n"
            await asyncio.sleep(0.4)

            # Step 2: Posting & Recording
            post_res = execute_auto_post(r, tr, cfg, executor=executor, dry_run=dry_run)
            yield f"data: {json.dumps({'event': 'posted_and_recorded', 'row': r, 'status': post_res.status, 'live_url': post_res.live_url})}\n\n"
            await asyncio.sleep(0.4)

        yield f"data: {json.dumps({'event': 'complete', 'message': 'All queued rows processed.'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/api/taxonomy")
def fetch_taxonomy():
    """Returns the 8 software development domains and 57 categories with affinity graph."""
    return get_taxonomy()


KNOWN_SERVER_CATALOG = [
    {
        "id": "known-fNk_zzaMoSs",
        "videoId": "fNk_zzaMoSs",
        "url": "https://www.youtube.com/watch?v=fNk_zzaMoSs",
        "thumbnailUrl": "https://i.ytimg.com/vi/fNk_zzaMoSs/hqdefault.jpg",
        "title": "Linear algebra for ML - Complete Masterclass",
        "channel": "3Blue1Brown",
        "domain": "AI & Machine Learning",
        "category": "Machine Learning fundamentals",
        "subcategoryId": 1,
        "duration": 940,
        "tags": ["linear algebra", "matrices", "vectors", "ml", "3blue1brown", "math"],
    },
    {
        "id": "known-WUvTyaaNkzM",
        "videoId": "WUvTyaaNkzM",
        "url": "https://www.youtube.com/watch?v=WUvTyaaNkzM",
        "thumbnailUrl": "https://i.ytimg.com/vi/WUvTyaaNkzM/hqdefault.jpg",
        "title": "The essence of calculus",
        "channel": "3Blue1Brown",
        "domain": "AI & Machine Learning",
        "category": "Machine Learning fundamentals",
        "subcategoryId": 1,
        "duration": 1025,
        "tags": ["math", "calculus", "derivatives", "3blue1brown", "visualization"],
    },
    {
        "id": "known-aircAruvnKk",
        "videoId": "aircAruvnKk",
        "url": "https://www.youtube.com/watch?v=aircAruvnKk",
        "thumbnailUrl": "https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg",
        "title": "Neural networks visualized - Deep Learning from Scratch",
        "channel": "3Blue1Brown",
        "domain": "AI & Machine Learning",
        "category": "Deep Learning (CNN, RNN, Transformers)",
        "subcategoryId": 2,
        "duration": 1140,
        "tags": ["neural networks", "deep learning", "backpropagation", "ai", "3blue1brown"],
    },
    {
        "id": "known-JxgmHe2NyeY",
        "videoId": "JxgmHe2NyeY",
        "url": "https://www.youtube.com/watch?v=JxgmHe2NyeY",
        "thumbnailUrl": "https://i.ytimg.com/vi/JxgmHe2NyeY/hqdefault.jpg",
        "title": "Complete Machine Learning Course in 6 Hours [Full Course]",
        "channel": "Krish Naik",
        "domain": "AI & Machine Learning",
        "category": "Machine Learning fundamentals",
        "subcategoryId": 1,
        "duration": 21600,
        "tags": ["krish naik", "machine learning", "ml", "python", "data science", "ai"],
    },
    {
        "id": "known-rV3HJ4LEZ7k",
        "videoId": "rV3HJ4LEZ7k",
        "url": "https://www.youtube.com/watch?v=rV3HJ4LEZ7k",
        "thumbnailUrl": "https://i.ytimg.com/vi/rV3HJ4LEZ7k/hqdefault.jpg",
        "title": "Complete Agentic AI Course In 10 Hours - LangChain, LangGraph, RAG",
        "channel": "Krish Naik",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "duration": 36000,
        "tags": ["krish naik", "generative ai", "langchain", "llm", "openai", "python", "rag", "langgraph"],
    },
    {
        "id": "known-VMj-3S1tku0",
        "videoId": "VMj-3S1tku0",
        "url": "https://www.youtube.com/watch?v=VMj-3S1tku0",
        "thumbnailUrl": "https://i.ytimg.com/vi/VMj-3S1tku0/hqdefault.jpg",
        "title": "The Spelled-Out Intro to Neural Networks & Backprop: Building micrograd",
        "channel": "Andrej Karpathy",
        "domain": "AI & Machine Learning",
        "category": "Deep Learning (CNN, RNN, Transformers)",
        "subcategoryId": 2,
        "duration": 8100,
        "tags": ["andrej karpathy", "micrograd", "neural networks", "backprop", "zero to hero"],
    },
    {
        "id": "known-kCc8FmEb1nY",
        "videoId": "kCc8FmEb1nY",
        "url": "https://www.youtube.com/watch?v=kCc8FmEb1nY",
        "thumbnailUrl": "https://i.ytimg.com/vi/kCc8FmEb1nY/hqdefault.jpg",
        "title": "Let's build GPT: from scratch, in code, spelled out",
        "channel": "Andrej Karpathy",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "duration": 7500,
        "tags": ["andrej karpathy", "gpt", "llm", "transformers", "from scratch"],
    },
    {
        "id": "known-y4z8n_aKq3w",
        "videoId": "y4z8n_aKq3w",
        "url": "https://www.youtube.com/watch?v=y4z8n_aKq3w",
        "thumbnailUrl": "https://i.ytimg.com/vi/y4z8n_aKq3w/hqdefault.jpg",
        "title": "[1hr Talk] Intro to Large Language Models (Busy Person's Intro to AI)",
        "channel": "Andrej Karpathy",
        "domain": "AI & Machine Learning",
        "category": "Generative AI & LLMs",
        "subcategoryId": 5,
        "duration": 3600,
        "tags": ["andrej karpathy", "llm", "chatgpt", "ai", "intro to large language models"],
    },
    {
        "id": "known-Gjnup-PuquQ",
        "videoId": "Gjnup-PuquQ",
        "url": "https://www.youtube.com/watch?v=Gjnup-PuquQ",
        "thumbnailUrl": "https://i.ytimg.com/vi/Gjnup-PuquQ/hqdefault.jpg",
        "title": "Docker in 100s",
        "channel": "Fireship",
        "domain": "Cloud & DevOps",
        "category": "Kubernetes & containerization",
        "subcategoryId": 30,
        "duration": 135,
        "tags": ["docker", "containers", "devops", "kubernetes", "cloud", "100s", "docker in 100s"],
    },
    {
        "id": "known-1aocCdimOo8",
        "videoId": "1aocCdimOo8",
        "url": "https://www.youtube.com/watch?v=1aocCdimOo8",
        "thumbnailUrl": "https://i.ytimg.com/vi/1aocCdimOo8/hqdefault.jpg",
        "title": "Build Your Own SSO | What is SSO | SSO Explained",
        "channel": "Piyush Garg",
        "domain": "Security & Data",
        "category": "Cybersecurity fundamentals",
        "subcategoryId": 39,
        "duration": 1140,
        "tags": ["sso", "single sign on", "authentication", "security", "piyush garg", "backend", "system design"],
    },
    {
        "id": "known-JuyaVIK-kGQ",
        "videoId": "JuyaVIK-kGQ",
        "url": "https://www.youtube.com/watch?v=JuyaVIK-kGQ",
        "thumbnailUrl": "https://i.ytimg.com/vi/JuyaVIK-kGQ/hqdefault.jpg",
        "title": "Full Stack Development & System Design Deep Dive",
        "channel": "ByteByteGo",
        "domain": "Web Development",
        "category": "Backend frameworks (Node.js, Django, Spring)",
        "subcategoryId": 18,
        "duration": 840,
        "tags": ["fullstack", "system design", "backend", "web", "bytebytego"],
    },
]


@app.get("/api/search")
def api_search_videos(q: str = "", redirect: bool = False, limit: int = 12):
    """Real-time fuzzy video search with ranked token scoring and optional instant YouTube HTTP redirect."""
    import urllib.parse
    from apify_service import get_dataset_items
    apify_items = get_dataset_items() or []

    # Combine known catalog items with apify dataset
    seen_ids = set()
    all_items = []
    for item in KNOWN_SERVER_CATALOG + apify_items:
        vid = item.get("videoId") or item.get("id")
        if vid and vid not in seen_ids:
            seen_ids.add(vid)
            all_items.append(item)

    clean_q = q.strip().lower()
    terms = clean_q.split() if clean_q else []
    matches = []

    for it in all_items:
        score = 0
        title = (it.get("title") or "").lower()
        cat = (it.get("category") or "").lower()
        channel = (it.get("channel") or "").lower()
        domain = (it.get("domain") or "").lower()
        tags = " ".join(it.get("tags") or []).lower()
        text = f"{title} {channel} {cat} {domain} {tags}"

        if clean_q:
            if clean_q in text:
                score += 120
                if title.startswith(clean_q) or channel.startswith(clean_q):
                    score += 50
            if clean_q in title:
                score += 80
            if clean_q in channel:
                score += 60

            matched_terms = sum(1 for t in terms if t in text)
            if terms and matched_terms == len(terms):
                score += 90
            elif matched_terms > 0:
                score += matched_terms * 25
        else:
            score = 10

        if score > 0:
            matches.append({"score": score, **it})

    matches.sort(key=lambda x: x["score"], reverse=True)
    top = matches[:limit]

    if redirect:
        if top and top[0].get("url"):
            return RedirectResponse(url=top[0]["url"], status_code=307)
        encoded = urllib.parse.quote(q)
        return RedirectResponse(url=f"https://www.youtube.com/results?search_query={encoded}", status_code=307)

    return {"query": q, "total": len(top), "matches": top}


@app.get("/api/network-info")
def api_network_info():
    """Returns local network IPv4 addresses and connection URL for mobile QR code scanning."""
    import socket
    hostname = socket.gethostname()
    candidate_ips = []
    try:
        _, _, ips = socket.gethostbyname_ex(hostname)
        for ip in ips:
            if not ip.startswith("127.") and not ip.startswith("169.254."):
                candidate_ips.append(ip)
    except Exception:
        pass

    # Detect primary active non-loopback IP
    if not candidate_ips:
        candidate_ips = ["10.251.69.204"]

    primary_ip = candidate_ips[0]

    # Detect active Cloudflare tunnel if running
    cloudflare_url = None
    try:
        import glob, re
        task_logs = glob.glob(r"C:\Users\srikr\.gemini\antigravity\brain\*\.system_generated\tasks\*.log")
        for f in sorted(task_logs, reverse=True):
            try:
                with open(f, "r", encoding="utf-8", errors="ignore") as fp:
                    content = fp.read()
                    matches = re.findall(r"https://[a-zA-Z0-9\-]+\.trycloudflare\.com", content)
                    if matches:
                        cloudflare_url = matches[-1]
                        break
            except Exception:
                continue
    except Exception:
        pass

    return {
        "hostname": hostname,
        "primaryIp": primary_ip,
        "allIps": candidate_ips,
        "port": 3000,
        "mobileUrl": cloudflare_url or f"http://{primary_ip}:3000",
        "localWifiUrl": f"http://{primary_ip}:3000",
        "cloudflareUrl": cloudflare_url,
    }


# In-memory real-time SSE notification subscriber queues
notification_subscribers: list[asyncio.Queue] = []


class BroadcastNotificationRequest(BaseModel):
    title: str
    message: str
    type: str = "info"
    url: Optional[str] = None
    metadata: Optional[dict] = None


@app.post("/api/notifications/broadcast")
async def api_broadcast_notification(req: BroadcastNotificationRequest):
    """Broadcast real-time notification to all connected web and mobile clients."""
    import time
    notif = {
        "id": f"notif_{int(time.time() * 1000)}",
        "title": req.title,
        "message": req.message,
        "type": req.type,
        "url": req.url,
        "metadata": req.metadata or {},
        "timestamp": int(time.time() * 1000),
    }
    dead = []
    for q in notification_subscribers:
        try:
            await q.put(notif)
        except Exception:
            dead.append(q)
    for q in dead:
        if q in notification_subscribers:
            notification_subscribers.remove(q)
    return {"success": True, "delivered": len(notification_subscribers), "notification": notif}


@app.get("/api/notifications/stream")
async def api_notifications_stream():
    """SSE stream delivering instant notifications to browser and mobile apps."""
    import time
    q: asyncio.Queue = asyncio.Queue()
    notification_subscribers.append(q)

    async def event_generator():
        yield f"event: connected\ndata: {json.dumps({'message': 'Connected to Real-Time Notification Stream'})}\n\n"
        try:
            while True:
                try:
                    notif = await asyncio.wait_for(q.get(), timeout=20.0)
                    yield f"event: notification\ndata: {json.dumps(notif)}\n\n"
                except asyncio.TimeoutError:
                    yield f"event: ping\ndata: {int(time.time())}\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            if q in notification_subscribers:
                notification_subscribers.remove(q)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        },
    )


class GroqCurateRequest(BaseModel):
    role: str = "AI/ML Engineer & Software Developer"
    level: str = "Intermediate"
    goal: str = "Master LLMs, Agentic AI, and Full-Stack Engineering"
    videos: list[dict[str, Any]] = []
    likedVideoIds: list[str] = []
    limit: int = 6


@app.post("/api/recommendations/groq-curate")
async def api_groq_curate_recommendations(req: GroqCurateRequest):
    """Use Groq LLM (qwen/qwen3.8-27b) to generate real-time personalized recommendations

    for software developers and AI/ML roles with curriculum reasoning.
    """
    groq_key = os.environ.get("GROQ_API_KEY")
    candidates = req.videos[:30] if req.videos else []

    if groq_key and candidates:
        try:
            from groq import Groq
            client = Groq(api_key=groq_key, timeout=25.0)

            video_summaries = [
                {
                    "videoId": v.get("videoId") or v.get("id"),
                    "title": v.get("title"),
                    "channel": v.get("channel"),
                    "category": v.get("category"),
                    "domain": v.get("domain", "")
                }
                for v in candidates
            ]

            prompt = f"""You are the Chief Developer Recommendation Engine for a platform specialized in Software Engineering and AI/ML.
User Persona:
- Professional Role: {req.role}
- Experience Level: {req.level}
- Target Learning Goal: {req.goal}
- User Liked IDs: {req.likedVideoIds}

Candidate Video Catalog:
{json.dumps(video_summaries, indent=1)}

Select the best {req.limit} videos that build a coherent learning journey for this role.
Rank them from 1 to {req.limit}.
Return ONLY valid JSON matching this schema:
{{
  "personaSummary": "1-2 sentences explaining why this path achieves their goal",
  "topRoleSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  "recommendations": [
    {{
      "videoId": "...",
      "rank": 1,
      "relevanceScore": 95,
      "badge": "Must-Watch / Foundational / Advanced",
      "reason": "Clear explanation of how this video advances their specific role and goal",
      "curriculumStep": "Step 1: Core Foundation"
    }}
  ]
}}"""

            loop = asyncio.get_event_loop()
            res = await loop.run_in_executor(
                None,
                lambda: client.chat.completions.create(
                    model="qwen/qwen3.8-27b",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a precise JSON-only recommendation engine API. Always output pure valid JSON without markdown fences."
                        },
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.2,
                    max_tokens=900
                )
            )

            raw_text = res.choices[0].message.content.strip()
            if raw_text.startswith("```"):
                lines = raw_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                raw_text = "\n".join(lines).strip()

            parsed = json.loads(raw_text)
            return {
                "success": True,
                "engine": "groq-qwen3.8-27b",
                "personaSummary": parsed.get("personaSummary", ""),
                "topRoleSkills": parsed.get("topRoleSkills", []),
                "recommendations": parsed.get("recommendations", []),
                "cached": False
            }
        except Exception as e:
            print(f"[Groq Recommendation Error]: {e}, falling back to intelligent heuristic ranking...")

    # Fallback to intelligent deterministic ranking if Groq is unavailable or timed out
    keywords = [k.lower() for k in (req.role + " " + req.goal).split() if len(k) > 2]
    scored = []
    for v in candidates:
        vid_id = v.get("videoId") or v.get("id")
        title = (v.get("title") or "").lower()
        cat = (v.get("category") or "").lower()
        score = 50
        for kw in keywords:
            if kw in title:
                score += 15
            if kw in cat:
                score += 10
        if vid_id in req.likedVideoIds:
            score += 20
        scored.append((score, v))

    scored.sort(key=lambda x: x[0], reverse=True)
    fallback_recs = []
    for idx, (sc, v) in enumerate(scored[:req.limit]):
        vid_id = v.get("videoId") or v.get("id")
        fallback_recs.append({
            "videoId": vid_id,
            "rank": idx + 1,
            "relevanceScore": min(98, sc),
            "badge": "Top Recommended" if idx == 0 else "Curated Match",
            "reason": f"Matches {req.role} path with focus on {v.get('category', 'technical mastery')}.",
            "curriculumStep": f"Step {idx + 1}: Practical Application"
        })

    return {
        "success": True,
        "engine": "local-fallback-engine",
        "personaSummary": f"Curated high-impact courses for {req.role} focusing on {req.goal}.",
        "topRoleSkills": ["Full-Stack Engineering", "AI/ML Systems", "Python & JavaScript", "Production Architecture"],
        "recommendations": fallback_recs,
        "cached": False
    }


if __name__ == "__main__":
    import uvicorn
    print("Starting Real-Time AI Backlink Engine API on http://127.0.0.1:8000 ...")
    uvicorn.run(app, host="127.0.0.1", port=8000)

