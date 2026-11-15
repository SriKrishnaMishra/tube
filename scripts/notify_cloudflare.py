#!/usr/bin/env python3
"""Cloudflare Real-Time Notification Dispatcher.

Sends instant real-time alerts through Cloudflare Worker global edge to all
connected web and mobile clients (via SSE, WebSockets, or Web Push).

Usage:
    # Send from CLI:
    python scripts/notify_cloudflare.py --title "Link Due" --message "Row 12 needs verification" --type warning

    # Import in Python:
    from notify_cloudflare import notify_event
    notify_event(title="New Video Added", message="Krish Naik AI Masterclass", type="video")
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request
from typing import Any, Dict, Optional


def get_notification_endpoints() -> tuple[str, Optional[str]]:
    """Determines active notification URL and auth token from environment or defaults."""
    # 1. Check Cloudflare Worker URL in env
    cf_url = os.environ.get("CLOUDFLARE_WORKER_URL") or os.environ.get("VITE_CLOUDFLARE_NOTIFY_URL")
    secret = os.environ.get("CF_NOTIFY_SECRET", "rectracker_secret_token_2026")

    if cf_url:
        target = cf_url.rstrip("/") + "/notify"
        return target, secret

    # 2. Local FastAPI Fallback (so it works out-of-the-box before deploying to Cloudflare)
    return "http://127.0.0.1:8000/api/notifications/broadcast", None


def notify_event(
    title: str,
    message: str,
    notification_type: str = "info",
    url: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Dispatches a real-time event to Cloudflare Worker / local notification hub."""
    endpoint, secret = get_notification_endpoints()

    payload = {
        "title": title,
        "message": message,
        "type": notification_type,
        "url": url,
        "metadata": metadata or {},
        "timestamp": int(os.environ.get("CURRENT_TIMESTAMP", 0)) or None,
    }

    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(endpoint, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    if secret:
        req.add_header("Authorization", f"Bearer {secret}")

    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return {"success": True, "endpoint": endpoint, "response": res_data}
    except Exception as exc:
        print(f"[notify_cloudflare] Warning: failed to send alert to {endpoint}: {exc}", file=sys.stderr)
        return {"success": False, "endpoint": endpoint, "error": str(exc)}


def main() -> int:
    parser = argparse.ArgumentParser(description="Send real-time notification via Cloudflare")
    parser.add_argument("--title", required=True, help="Notification title")
    parser.add_argument("--message", required=True, help="Notification body message")
    parser.add_argument(
        "--type",
        default="info",
        choices=["info", "success", "warning", "alert", "video"],
        help="Notification severity/type",
    )
    parser.add_argument("--url", default=None, help="Target URL or tab on click")
    args = parser.parse_args()

    result = notify_event(
        title=args.title,
        message=args.message,
        notification_type=args.type,
        url=args.url,
    )

    if result.get("success"):
        print(f"✅ Notification sent successfully via {result.get('endpoint')}")
        return 0
    else:
        print(f"❌ Failed to deliver notification: {result.get('error')}")
        return 1


if __name__ == "__main__":
    sys.exit(main())

