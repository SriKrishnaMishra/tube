#!/usr/bin/env python3
"""Unified Real-Time AI Backlink Pipeline Runner.

Orchestrates the entire SOP lifecycle from preflight checks to AI content generation,
compliance enforcement, real-time submission, and 7-day link verification.

Usage:
    python scripts/pipeline_runner.py --status         # view campaign & queue status
    python scripts/pipeline_runner.py --run-next       # pick, generate AI content, and post 1 row
    python scripts/pipeline_runner.py --run-all        # process all eligible queue rows
    python scripts/pipeline_runner.py --verify-all     # verify all live rows
    python scripts/pipeline_runner.py --report         # show SEO weekly performance report
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from ai_content_engine import generate_content_for_row  # noqa: E402
from auto_poster import execute_auto_post  # noqa: E402
from auto_verify_worker import run_verification  # noqa: E402
from checklist import check_kit, check_placeholders, check_tracker_columns, check_rows  # noqa: E402
from common import Tracker, load_config, parse_date, today  # noqa: E402
from weekly_review import compute_metrics  # noqa: E402


def show_status(tr: Tracker, cfg: dict):
    print("=" * 65)
    print("BACKLINK CAMPAIGN & AI PIPELINE STATUS")
    print("=" * 65)
    brands = list(cfg.get("brands", {}).keys())
    print(f"Active Brands  : {', '.join(brands)}")
    print(f"Tracker Path   : {cfg['tracker']['path']}")

    rows = list(tr.data_rows())
    statuses = {}
    for r in rows:
        st = str(tr.get(r, "Status") or "Not started")
        statuses[st] = statuses.get(st, 0) + 1

    print(f"Total Rows     : {len(rows)}")
    for st, count in sorted(statuses.items()):
        print(f"  - {st:<13}: {count}")

    unverified = [r for r in rows if str(tr.get(r, "Status")) == "Live" and not parse_date(tr.get(r, "Verified date"))]
    print(f"Pending Verify : {len(unverified)}")
    print("=" * 65)


def run_next_row(tr: Tracker, cfg: dict, dry_run: bool = False):
    from pick_next import BLOCKED_STATUSES
    target_row = None
    for r in tr.data_rows():
        st = str(tr.get(r, "Status") or "Not started")
        dec = str(tr.get(r, "Decision") or "")
        if dec in ("Hold", "Skip") or st in BLOCKED_STATUSES:
            continue
        if st in ("Not started", "In progress"):
            target_row = r
            break

    if not target_row:
        print("[!] No eligible rows waiting in queue.")
        return 0

    brand = str(tr.get(target_row, "Brand") or "")
    site = str(tr.get(target_row, "Site / URL") or "")
    print(f"\n>>> Processing Queue Row #{target_row} ({brand} -> {site})")
    res = execute_auto_post(target_row, tr, cfg, executor="AI-Agent", dry_run=dry_run)
    return 0 if res.success else 1


def run_all_queue(tr: Tracker, cfg: dict, dry_run: bool = False):
    from pick_next import BLOCKED_STATUSES
    targets = []
    for r in tr.data_rows():
        st = str(tr.get(r, "Status") or "Not started")
        dec = str(tr.get(r, "Decision") or "")
        if dec in ("Hold", "Skip") or st in BLOCKED_STATUSES:
            continue
        if st in ("Not started", "In progress"):
            targets.append(r)

    if not targets:
        print("[!] No rows waiting in queue.")
        return 0

    print(f"\nProcessing {len(targets)} queued row(s) end-to-end...")
    for r in targets:
        execute_auto_post(r, tr, cfg, executor="AI-Agent", dry_run=dry_run)
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--status", action="store_true", help="show queue and campaign status")
    ap.add_argument("--run-next", action="store_true", help="process next eligible row")
    ap.add_argument("--run-all", action="store_true", help="process all eligible rows in queue")
    ap.add_argument("--verify-all", action="store_true", help="verify all live links")
    ap.add_argument("--report", action="store_true", help="print weekly SEO performance report")
    ap.add_argument("--dry-run", action="store_true", help="simulate without writing to tracker")
    args = ap.parse_args()

    cfg = load_config()
    tr = Tracker(cfg=cfg)

    if args.status or not any([args.run_next, args.run_all, args.verify_all, args.report]):
        show_status(tr, cfg)
        return 0

    if args.run_next:
        return run_next_row(tr, cfg, dry_run=args.dry_run)

    if args.run_all:
        return run_all_queue(tr, cfg, dry_run=args.dry_run)

    if args.verify_all:
        from auto_verify_worker import run_verification
        live_rows = [r for r in tr.data_rows() if str(tr.get(r, "Status")) == "Live"]
        print(f"Verifying {len(live_rows)} live row(s)...")
        for r in live_rows:
            run_verification(r, tr, cfg, simulate=True)
        return 0

    if args.report:
        import subprocess
        subprocess.run(["python", str(Path(__file__).parent / "weekly_review.py")])
        return 0

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
