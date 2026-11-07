#!/usr/bin/env python3
"""Create/refresh the backlink tracker workbook from templates/tracker_template.csv.

Usage:
    python scripts/make_tracker.py                 # create + style + seed example rows (--no-seed to skip)
    python scripts/make_tracker.py --seed data/site_prospects.csv   # import a prospect list
Exit 0 on success; prints where the file was written.
"""
from __future__ import annotations
import argparse, csv, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import REPO_ROOT, Tracker, load_config, style_sheet, norm_header  # noqa: E402

EXAMPLE_ROWS = [
    {
        "Brand": "QHT Clinic", "Site / URL": "https://example-health-forum.com",
        "Decision": "Do first", "Week order": 1,
        "Target page": "[set real target page]", "Anchor": "QHT Clinic", "Anchor type": "brand",
        "Word count": "Short profile", "Link type": "Profile", "Dofollow / Nofollow": "Nofollow",
        "Status": "Not started", "Account login": "vault: qht/example-health-forum",
        "Notes": "EXAMPLE ROW - replace or delete before real work.",
    },
    {
        "Brand": "URoots", "Site / URL": "https://example-hair-blog.com",
        "Decision": "Do short", "Week order": 2,
        "Target page": "[set real target page]", "Anchor": "hair transplant costs", "Anchor type": "partial_keyword",
        "Word count": "Short blog", "Link type": "Guest post", "Dofollow / Nofollow": "Unknown",
        "Status": "Not started", "Notes": "EXAMPLE ROW - needs outreach draft (Section 5).",
    },
]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--force", action="store_true", help="overwrite an existing tracker")
    ap.add_argument("--no-seed", action="store_true", help="create empty tracker (headers only)")
    ap.add_argument("--seed", metavar="CSV", help="import prospects from a CSV instead of examples")
    args = ap.parse_args()

    cfg = load_config()
    path = REPO_ROOT / cfg["tracker"]["path"]
    if path.exists() and not args.force:
        print(f"EXISTS  {path} (use --force to rebuild; --force discards all recorded data!)")
        return 1

    tr = Tracker(path=path, cfg=cfg, create=True)
    missing = tr.missing_columns()
    if missing:
        print("FATAL: template is missing required columns:", missing)
        return 1

    if args.seed:
        with open(args.seed, newline="", encoding="utf-8") as f:
            for rec in csv.DictReader(f):
                values = {norm_header(k): v for k, v in rec.items() if norm_header(k) in tr.headers}
                values.setdefault("Status", "Not started")
                tr.append(values)
        print(f"Imported rows from {args.seed}")
    elif not args.no_seed:
        for ex in EXAMPLE_ROWS:
            tr.append(ex)
        print("Seeded 2 example rows (delete them before real work).")

    style_sheet(tr)
    tr.save()
    print(f"OK      tracker ready at {path.relative_to(REPO_ROOT)}")
    print("Next: fill config/campaign.yaml placeholders, complete asset kits, then run:")
    print("  python scripts/checklist.py preflight")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
