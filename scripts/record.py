#!/usr/bin/env python3
"""Step 7 — record the outcome in the tracker, same day. One atomic command.

Sets Status, Live URL, link type/attribute, Date posted (+executor name) and Verify on
(posted + 7 days, from config). Refuses inconsistent saves (e.g. Live without a real URL).

Usage:
    python scripts/record.py --row 2 --status Live --live-url https://site.com/post/123 \
        --executor Asha [--link-type Profile --nofollow] [--note "editor approved fast"]
    python scripts/record.py --row 3 --status Submitted --live-url https://site.com/p/9 --executor Asha
    python scripts/record.py --row 4 --status Hold --note "asked payment — escalated to SEO lead"
    python scripts/record.py --row 5 --status Skip --note "casino content, irrelevant"
"""
from __future__ import annotations
import argparse, datetime as dt, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import Tracker, load_config, validate_row  # noqa: E402


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--row", type=int, required=True, help="sheet row number (header=row 1)")
    ap.add_argument("--status", required=True, choices=["Not started", "In progress", "Submitted", "Live", "Hold", "Skip", "Removed"])
    ap.add_argument("--live-url", default=None)
    ap.add_argument("--executor", default="", help="your name; stored with Date posted")
    ap.add_argument("--date", default=None, help="override posted date YYYY-MM-DD (default: today)")
    ap.add_argument("--link-type", choices=["Profile", "Directory", "Guest post", "Citation"])
    ap.add_argument("--dofollow", action="store_true")
    ap.add_argument("--nofollow", action="store_true")
    ap.add_argument("--note", default="", help="appended to Notes (required for Hold/Skip/Removed)")
    args = ap.parse_args()

    cfg = load_config()
    tr = Tracker(cfg=cfg)
    if args.row < 2 or args.row > tr.ws.max_row:
        print(f"FATAL: row {args.row} out of range (2..{tr.ws.max_row}).")
        return 1

    # --- hard rules ---------------------------------------------------------
    if args.status in ("Live", "Submitted"):
        if not args.live_url:
            print("FATAL: Live/Submitted requires --live-url with the exact published page URL (Step 7).")
            return 1
        if not args.live_url.startswith(("http://", "https://")):
            print("FATAL: --live-url must be a full http(s) address of the real page.")
            return 1
        if not args.executor:
            print("FATAL: --executor (your name) is required when recording a publication.")
            return 1
    if args.status in ("Hold", "Skip", "Removed") and not args.note:
        print(f"FATAL: {args.status} requires --note with the reason (SOP §7 / Step 8).")
        return 1
    if args.dofollow and args.nofollow:
        print("FATAL: pick either --dofollow or --nofollow.")
        return 1

    # --- apply --------------------------------------------------------------
    tr.set(args.row, "Status", args.status)
    if args.live_url:
        tr.set(args.row, "Live URL", args.live_url)

    if args.status in ("Live", "Submitted"):
        posted = dt.date.fromisoformat(args.date) if args.date else dt.date.today()
        tr.set(args.row, "Date posted", f"{posted.isoformat()} {args.executor}")
        tr.set(args.row, "Verify on", (posted + dt.timedelta(days=cfg["campaign"]["verification_days"])).isoformat())

    if args.link_type:
        tr.set(args.row, "Link type", args.link_type)
    if args.dofollow:
        tr.set(args.row, "Dofollow / Nofollow", "Dofollow")
    if args.nofollow:
        tr.set(args.row, "Dofollow / Nofollow", "Nofollow")

    if args.note:
        old = str(tr.get(args.row, "Notes") or "").strip()
        stamp = dt.date.today().isoformat()
        tr.set(args.row, "Notes", (old + " | " if old else "") + f"{stamp}: {args.note}")

    issues = validate_row(tr, args.row)
    if issues:
        print("FATAL: save would leave the row non-compliant:")
        for i in issues:
            print("  -", i)
        return 1

    tr.save()
    print(f"OK row {args.row}: Status={args.status}"
          + (f" Live URL={args.live_url}" if args.live_url else "")
          + (f" Verify on={tr.get(args.row, 'Verify on')}" if tr.get(args.row, "Verify on") else ""))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
