#!/usr/bin/env python3
"""Step 2 — pick the next row: Decision = Do first, then Do short, then Week order.

Rows marked Hold/Skip are never offered. Rows already In progress by someone else
are shown but not offered (duplicate-work guard).

Usage:
    python scripts/pick_next.py                     # next row across both brands
    python scripts/pick_next.py --brand uroots      # filter by brand
    python scripts/pick_next.py --claim             # set Status=In progress + claimer name
    python scripts/pick_next.py --claim --executor "Asha"
    python scripts/pick_next.py --list              # show the whole queue, don't claim
"""
from __future__ import annotations
import argparse, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import Tracker, load_config  # noqa: E402

BLOCKED_STATUSES = {"Hold", "Skip", "Removed"}


def brand_matches(row_brand: str, wanted: str | None) -> bool:
    if not wanted:
        return True
    w = wanted.lower().replace("-", " ").replace("_", " ")
    rb = str(row_brand or "").lower()
    # accept "qht", "qht clinic", "uroots"
    return w in rb or rb.startswith(w.split()[0])


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--brand", help="qht | uroots (default: both)")
    ap.add_argument("--claim", action="store_true", help="mark the chosen row In progress")
    ap.add_argument("--executor", default="", help="claimer name stored with In progress")
    ap.add_argument("--list", action="store_true", help="print the full queue without claiming")
    args = ap.parse_args()

    cfg = load_config()
    tr = Tracker(cfg=cfg)
    missing = tr.missing_columns()
    if missing:
        print("FATAL: tracker missing required columns (add them before starting, Section 3):", missing)
        return 1

    priority = {d: i for i, d in enumerate(cfg["decisions"])}  # Do first < Do short < ...
    candidates, taken = [], []
    for r in tr.data_rows():
        decision = str(tr.get(r, "Decision") or "")
        status = str(tr.get(r, "Status") or "Not started")
        if decision in ("Hold", "Skip") or status in BLOCKED_STATUSES:
            continue
        if not brand_matches(str(tr.get(r, "Brand")), args.brand):
            continue
        try:
            week = int(tr.get(r, "Week order") or 10_000)
        except ValueError:
            week = 10_000
        item = (priority.get(decision, 99), week, r, decision, status)
        (taken if status == "In progress" else candidates).append(item)

    candidates.sort()
    taken.sort()

    if args.list:
        if not candidates and not taken:
            print("Queue empty. Add rows or reopen Holds with the SEO lead.")
            return 0
        print("PICKABLE (Do first → Do short → Week order):")
        for _, wk, r, dec, st in candidates:
            print(f"  row {r:>4}  [{dec:<9}] week {wk:<4} {str(tr.get(r,'Brand')):<11} {tr.get(r,'Site / URL')}")
        if taken:
            print("IN PROGRESS by someone else (do not duplicate):")
            for _, wk, r, dec, st in taken:
                print(f"  row {r:>4}  [{st:<11}] {tr.get(r,'Site / URL')}")
        return 0

    if not candidates:
        print("No eligible row. Everything is done, held, skipped or in progress.")
        return 0

    _, _, row, decision, _ = candidates[0]
    print(f"NEXT ROW: #{row}  ({decision})")
    for col in ("Brand", "Site / URL", "Target page", "Anchor", "Word count", "Link type", "Notes"):
        print(f"  {col:<12}: {tr.get(row, col) or '-'}")
    print("\nNow follow SOP Steps 3→7: check site → legal gate → write → post → record same day.")
    print("  python scripts/legal_gate.py --file draft.txt")
    print(f"  python scripts/record.py --row {row} --status Live --live-url <URL> --executor <name>")

    if args.claim:
        who = args.executor or "unnamed executor"
        tr.set(row, "Status", "In progress")
        note = str(tr.get(row, "Notes") or "").strip()
        tr.set(row, "Notes", (note + " | " if note else "") + f"claimed {who} {Tracker.__module__ and ''}{__import__('datetime').date.today().isoformat()}")
        tr.save()
        print(f"\nRow {row} marked In progress for {who}.")
    elif not args.list:
        print("\n(tip: add --claim --executor \"YourName\" so nobody duplicates this row)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
