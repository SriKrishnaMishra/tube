#!/usr/bin/env python3
"""Apify Scraper Integration Service.

Connects to Apify's API to fetch real scraped YouTube recommendations,
actor run states, logs, and dataset items.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import re
import time
import urllib.error
import urllib.request
from typing import Any, Optional

from dotenv import load_dotenv

load_dotenv()

APIFY_TOKEN = os.environ.get("APIFY_API_TOKEN", "")
DEFAULT_DATASET_ID = os.environ.get("APIFY_DATASET_ID", "")
DEFAULT_RUN_ID = os.environ.get("APIFY_ACTOR_RUN_ID", "")
DEFAULT_STORE_ID = os.environ.get("APIFY_STORE_ID", "")
DEFAULT_QUEUE_ID = os.environ.get("APIFY_QUEUE_ID", "")

UA = {"User-Agent": "RecTracker-Apify/1.0"}

# In-memory high-speed cache for instant sub-millisecond responses
_DATASET_CACHE: dict[str, Any] = {"items": [], "cached_at": 0}
CACHE_TTL_SECONDS = 300  # 5 minutes cache


def _api_get(url: str, token: Optional[str] = None) -> Any:
    tok = token or APIFY_TOKEN
    full_url = f"{url}?token={tok}" if "?" not in url else f"{url}&token={tok}"
    req = urllib.request.Request(full_url, headers=UA)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def _api_post(url: str, token: Optional[str] = None) -> Any:
    tok = token or APIFY_TOKEN
    full_url = f"{url}?token={tok}" if "?" not in url else f"{url}&token={tok}"
    req = urllib.request.Request(full_url, data=b"", headers=UA, method="POST")
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def get_dataset_items(dataset_id: Optional[str] = None, limit: int = 100, force_refresh: bool = False) -> list[dict[str, Any]]:
    """Fetch scraped video items from Apify dataset with high-speed memory caching."""
    global _DATASET_CACHE

    did = dataset_id or DEFAULT_DATASET_ID
    # Return from memory cache instantly if fresh
    if not force_refresh and _DATASET_CACHE["items"] and (time.time() - _DATASET_CACHE["cached_at"] < CACHE_TTL_SECONDS):
        return _DATASET_CACHE["items"]

    url = f"https://api.apify.com/v2/datasets/{did}/items?limit={limit}"
    try:
        raw_items = _api_get(url)
    except Exception as e:
        print(f"[Apify] Error fetching dataset items: {e}")
        # Return stale cache if available rather than failing
        return _DATASET_CACHE["items"] if _DATASET_CACHE["items"] else []

    records = []
    now = int(dt.datetime.now().timestamp() * 1000)
    for it in raw_items:
        vid_id = it.get("id") or ""
        url_link = it.get("url") or (f"https://www.youtube.com/watch?v={vid_id}" if vid_id else "")
        thumb = it.get("thumbnailUrl") or (f"https://i.ytimg.com/vi/{vid_id}/hqdefault.jpg" if vid_id else "")
        
        # Parse duration (e.g., '14:20' -> seconds)
        raw_dur = str(it.get("duration") or "")
        dur_sec = 600
        if ":" in raw_dur:
            parts = [int(p) for p in raw_dur.split(":") if p.isdigit()]
            if len(parts) == 2:
                dur_sec = parts[0] * 60 + parts[1]
            elif len(parts) == 3:
                dur_sec = parts[0] * 3600 + parts[1] * 60 + parts[2]

        # Parse date
        raw_date = it.get("date")
        timestamp = now
        if raw_date:
            try:
                timestamp = int(dt.datetime.fromisoformat(raw_date.replace("Z", "+00:00")).timestamp() * 1000)
            except Exception:
                timestamp = now

        # Infer category
        title = it.get("title") or "YouTube Video"
        category = "Technology"
        title_lower = title.lower()
        if any(w in title_lower for w in ["scraper", "crawler", "python", "javascript", "code", "dev"]):
            category = "Technology"
        elif any(w in title_lower for w in ["game", "gaming", "rush"]):
            category = "Gaming"
        elif any(w in title_lower for w in ["tutorial", "explain", "vs", "differences"]):
            category = "Education"

        records.append({
            "id": vid_id or str(hash(title)),
            "videoId": vid_id,
            "title": title,
            "channel": it.get("channelName") or it.get("channelUsername") or "YouTube Channel",
            "category": category,
            "timestamp": timestamp,
            "source": "search" if it.get("input") else "home",
            "duration": dur_sec,
            "url": url_link,
            "thumbnailUrl": thumb,
            "viewCount": it.get("viewCount") or 0,
            "likes": it.get("likes") or 0,
        })

    _DATASET_CACHE["items"] = records
    _DATASET_CACHE["cached_at"] = time.time()
    return records


def get_run(run_id: Optional[str] = None) -> dict[str, Any]:
    """Get actor run details."""
    rid = run_id or DEFAULT_RUN_ID
    url = f"https://api.apify.com/v2/actor-runs/{rid}"
    return _api_get(url)


def get_input(store_id: Optional[str] = None) -> Any:
    """Get run input from key-value store."""
    sid = store_id or DEFAULT_STORE_ID
    url = f"https://api.apify.com/v2/key-value-stores/{sid}/records/INPUT"
    return _api_get(url)


def get_queue_head(queue_id: Optional[str] = None) -> Any:
    """Get request queue head."""
    qid = queue_id or DEFAULT_QUEUE_ID
    url = f"https://api.apify.com/v2/request-queues/{qid}/head"
    return _api_get(url)


def get_log(run_id: Optional[str] = None) -> str:
    """Get run text log."""
    rid = run_id or DEFAULT_RUN_ID
    url = f"https://api.apify.com/v2/logs/{rid}?token={APIFY_TOKEN}"
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode("utf-8", "replace")


def abort_run(run_id: Optional[str] = None) -> Any:
    """Abort actor run."""
    rid = run_id or DEFAULT_RUN_ID
    url = f"https://api.apify.com/v2/actor-runs/{rid}/abort"
    return _api_post(url)


def resurrect_run(run_id: Optional[str] = None) -> Any:
    """Resurrect actor run."""
    rid = run_id or DEFAULT_RUN_ID
    url = f"https://api.apify.com/v2/actor-runs/{rid}/resurrect"
    return _api_post(url)


if __name__ == "__main__":
    print("Testing Apify connection...")
    items = get_dataset_items()
    print(f"Retrieved {len(items)} items from Apify dataset:")
    for i, it in enumerate(items[:3], 1):
        print(f" {i}. [{it['channel']}] {it['title']} -> {it['url']}")
        print(f"    Thumb: {it['thumbnailUrl']}")

