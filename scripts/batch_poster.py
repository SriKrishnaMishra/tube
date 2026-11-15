#!/usr/bin/env python3
"""Multi-Website Document Batch Posting Engine.

Takes a content document (markdown, text, or AI draft) and publishes it across
multiple target websites in real-time, enforcing legal gate compliance and
atomically updating backlinks_tracker.xlsx for every site.

Usage:
    # Post a document to specific sites:
    python scripts/batch_poster.py --doc data/generated-drafts/row_2_qht-clinic.md \
        --brand "QHT Clinic" \
        --sites "https://medical-blog-a.com,https://health-directory-b.org"

    # Post an AI-generated draft to all pending tracker rows:
    python scripts/batch_poster.py --doc data/generated-drafts/row_2_qht-clinic.md --pending-tracker

    # Dry-run test (simulation without writing to tracker):
    python scripts/batch_poster.py --doc my_article.md --brand "URoots" --sites "https://site.com" --dry-run
"""
from __future__ import annotations

import argparse
import datetime as dt
import os
import re
import sys
import time
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
load_dotenv()

sys.path.insert(0, str(Path(__file__).resolve().parent))
from ai_content_engine import load_asset_kit, validate_legal_gate  # noqa: E402
from auto_poster import simulate_or_post_submission  # noqa: E402
from common import REPO_ROOT, Tracker, load_config, validate_row  # noqa: E402


def extract_title_and_body(text: str) -> tuple[str, str]:
    """Extract clean title and body from markdown or text document."""
    lines = text.strip().splitlines()
    title = "Clinical Article"
    clean_lines = []

    for i, line in enumerate(lines):
        line_str = line.strip()
        if line_str.startswith("# "):
            title = line_str[2:].strip()
        elif line_str.startswith("TITLE:"):
            title = line_str.replace("TITLE:", "").strip()
        elif line_str.startswith("<!--") or line_str.startswith("-->"):
            continue
        elif line_str.startswith("Row:") or line_str.startswith("Brand:") or line_str.startswith("Site:"):
            continue
        else:
            clean_lines.append(line)

    body = "\n".join(clean_lines).strip()
    return title, body


def post_doc_to_site(
    site_url: str,
    brand_name: str,
    title: str,
    content: str,
    target_page: str,
    anchor: str,
    link_type: str,
    tr: Tracker,
    cfg: dict,
    executor: str = "AI-Agent",
    dry_run: bool = False,
) -> dict:
    """Post document to a single site and record in tracker."""
    print(f"\n>>> Dispatching to: {site_url} ({link_type})")
    kit = load_asset_kit(brand_name, cfg)

    # Check for duplicate site submission per SOP rule
    existing_domains = [
        Tracker.domain(tr.get(r, "Site / URL"))
        for r in tr.data_rows()
        if str(tr.get(r, "Brand")) == brand_name and str(tr.get(r, "Status")) in ("Live", "Submitted")
    ]
    target_domain = Tracker.domain(site_url)
    if target_domain and target_domain in existing_domains:
        print(f"[\u26a0 DUPLICATE WARNING] Brand '{brand_name}' already has an active account/post on {target_domain}.")
        print("   SOP Rule §6a: 'One brand, one account per site.'")

    # Dispatch publication
    success, live_url, message = simulate_or_post_submission(
        site_url=site_url,
        brand_key=brand_name,
        title=title,
        content=content,
        asset_kit=kit,
        link_type=link_type,
    )

    today_str = dt.date.today().isoformat()
    verify_days = cfg.get("campaign", {}).get("verification_days", 7)
    verify_on = (dt.date.today() + dt.timedelta(days=verify_days)).isoformat()

    row_recorded = None
    if success and not dry_run:
        # Check if site is already in tracker, else append
        matched_row = None
        for r in tr.data_rows():
            if str(tr.get(r, "Site / URL")).strip().lower() == site_url.strip().lower() and str(tr.get(r, "Brand")) == brand_name:
                matched_row = r
                break

        if matched_row:
            row_recorded = matched_row
            tr.set(matched_row, "Status", "Live")
            tr.set(matched_row, "Live URL", live_url)
            tr.set(matched_row, "Date posted", f"{today_str} {executor}")
            tr.set(matched_row, "Verify on", verify_on)
        else:
            new_row = {
                "Brand": brand_name,
                "Site / URL": site_url,
                "Decision": "Do first",
                "Week order": 1,
                "Target page": target_page,
                "Anchor": anchor,
                "Anchor type": "brand" if anchor.lower() == brand_name.lower() else "partial_keyword",
                "Word count": "Short blog",
                "Link type": link_type,
                "Dofollow / Nofollow": "Dofollow",
                "Status": "Live",
                "Live URL": live_url,
                "Date posted": f"{today_str} {executor}",
                "Verify on": verify_on,
                "Notes": f"Batch posted via {executor}",
            }
            row_recorded = tr.append(new_row)

        tr.save()
        print(f"[\u2705 RECORDED] Row #{row_recorded}: Live URL -> {live_url} (Verify on: {verify_on})")
    elif dry_run:
        print(f"[DRY-RUN] Would record Live URL: {live_url}")

    return {
        "site": site_url,
        "live_url": live_url,
        "success": success,
        "row": row_recorded,
        "verify_on": verify_on,
        "message": message,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--doc", required=True, help="path to document file (.md or .txt)")
    ap.add_argument("--brand", default="QHT Clinic", help="brand name (QHT Clinic or URoots)")
    ap.add_argument("--sites", help="comma-separated list of target website URLs")
    ap.add_argument("--pending-tracker", action="store_true", help="post to all pending rows in tracker")
    ap.add_argument("--target-page", default="", help="target URL for the backlink")
    ap.add_argument("--anchor", default="", help="anchor text")
    ap.add_argument("--link-type", default="Guest post", choices=["Profile", "Directory", "Guest post", "Citation"])
    ap.add_argument("--executor", default="AI-Batch-Poster")
    ap.add_argument("--dry-run", action="store_true", help="simulate posting without modifying tracker")
    args = ap.parse_args()

    doc_path = Path(args.doc)
    if not doc_path.exists():
        print(f"FATAL: Document not found: {args.doc}")
        return 1

    cfg = load_config()
    tr = Tracker(cfg=cfg)

    doc_raw = doc_path.read_text(encoding="utf-8")
    title, body = extract_title_and_body(doc_raw)

    print("=" * 70)
    print("MULTI-WEBSITE DOCUMENT BATCH POSTER")
    print("=" * 70)
    print(f"Document File : {args.doc} ({len(body.split())} words)")
    print(f"Document Title: {title}")
    print(f"Brand Name    : {args.brand}")
    print("-" * 70)

    # 1. Real-Time Legal Gate Check on the document
    print("[1/2] Scanning document against Pre-Post Legal Gate...")
    is_compliant, violations = validate_legal_gate(body, cfg)
    if not is_compliant:
        print("\u274c DOCUMENT REJECTED BY LEGAL GATE:")
        for v in violations:
            print(f"  - {v}")
        print("\nSOP Rule §4: Banned prescription drugs, competitor mentions, or cure claims detected.")
        print("Please edit the document or re-generate with AI before batch posting.")
        return 1
    print("\u2705 Legal Gate Check: PASSED (Zero Rx, Zero Competitors, Zero Prohibited Claims)")

    # 2. Gather target websites
    target_sites = []
    if args.sites:
        target_sites = [s.strip() for s in args.sites.split(",") if s.strip()]
    elif args.pending_tracker:
        for r in tr.data_rows():
            st = str(tr.get(r, "Status") or "")
            if st in ("Not started", "In progress"):
                site = str(tr.get(r, "Site / URL") or "")
                if site and site.startswith("http"):
                    target_sites.append(site)

    if not target_sites:
        print("FATAL: No target sites specified. Provide --sites 'url1,url2' or --pending-tracker.")
        return 1

    print(f"\n[2/2] Publishing to {len(target_sites)} target website(s)...")
    brand_cfg = cfg["brands"].get("qht-clinic" if "qht" in args.brand.lower() else "uroots", {})
    target_page = args.target_page or brand_cfg.get("website", "https://qhtclinic.com")
    anchor = args.anchor or args.brand

    results = []
    for site in target_sites:
        res = post_doc_to_site(
            site_url=site,
            brand_name=args.brand,
            title=title,
            content=body,
            target_page=target_page,
            anchor=anchor,
            link_type=args.link_type,
            tr=tr,
            cfg=cfg,
            executor=args.executor,
            dry_run=args.dry_run,
        )
        results.append(res)

    print("\n" + "=" * 70)
    print("BATCH POSTING SUMMARY")
    print("=" * 70)
    for r in results:
        status_icon = "\u2705" if r["success"] else "\u274c"
        print(f"{status_icon} Site: {r['site']:<35} -> Live URL: {r['live_url']}")
    print("=" * 70)
    print(f"All published links recorded in tracker/backlinks_tracker.xlsx")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

