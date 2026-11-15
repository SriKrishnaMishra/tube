#!/usr/bin/env python3
"""Step 9 — weekly review pack for the SEO lead.

Prints: links live this week (by brand and type), removed links, anchor mix vs the
40/30/20/10 target with drift flags, nofollow share, duplicate-account check
(one brand, one account per site), and rows still overdue for verification.

Usage:
    python scripts/weekly_review.py                 # ISO week = current week
    python scripts/weekly_review.py --week 2026-45  # specific ISO week
    python scripts/weekly_review.py --save          # also write data/weekly-review-log.md entry
"""
from __future__ import annotations
import argparse, datetime as dt, sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import REPO_ROOT, Tracker, classify_anchor, load_config, parse_date, today  # noqa: E402


def week_bounds(arg: str | None) -> tuple[dt.date, dt.date, str]:
    if arg:
        y, w = map(int, arg.split("-"))
        start = dt.date.fromisocalendar(y, w, 1)
    else:
        iso = today().isocalendar()
        y, w = iso.year, iso.week
        start = dt.date.fromisocalendar(y, w, 1)
    return start, start + dt.timedelta(days=6), f"{y}-W{w:02d}"


def posted_date(tr, r):
    v = tr.get(r, "Date posted")
    return parse_date(str(v).split()[0]) if v else None


def compute_metrics(tr: Tracker, cfg: dict, week_arg: str | None = None) -> dict:
    """Compute structured metrics for API and reporting."""
    start, end, label = week_bounds(week_arg)
    brands = [b["display_name"] for b in cfg["brands"].values()]
    live_rows = [r for r in tr.data_rows() if str(tr.get(r, "Status")) == "Live"]
    all_active = [r for r in tr.data_rows() if str(tr.get(r, "Status")) in ("Live", "Submitted")]
    this_week = [r for r in live_rows if posted_date(tr, r) and start <= posted_date(tr, r) <= end]

    by_brand = dict(Counter(str(tr.get(r, "Brand")) for r in this_week))
    by_type = dict(Counter(str(tr.get(r, "Link type") or "?") for r in this_week))
    total_live_by_brand = {b: sum(1 for r in live_rows if str(tr.get(r, "Brand")) == b) for b in brands}

    removed = [r for r in tr.data_rows() if str(tr.get(r, "Status")) == "Removed"]
    cats = Counter(classify_anchor(str(tr.get(r, "Anchor") or ""), brands) for r in all_active)
    total_anchors = sum(cats.values()) or 1
    anchor_mix = {k: round(cats.get(k, 0) / total_anchors, 2) for k in ("brand", "partial_keyword", "plain_url", "generic")}

    return {
        "week_label": label,
        "week_start": start.isoformat(),
        "week_end": end.isoformat(),
        "live_this_week_count": len(this_week),
        "live_this_week_by_brand": by_brand,
        "live_this_week_by_type": by_type,
        "total_live": len(live_rows),
        "total_live_by_brand": total_live_by_brand,
        "removed_count": len(removed),
        "anchor_mix_actual": anchor_mix,
        "anchor_mix_target": cfg.get("anchor_mix_target", {}),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--week", help="ISO week like 2026-45 (default: current)")
    ap.add_argument("--save", action="store_true", help="append report to data/weekly-review-log.md")
    args = ap.parse_args()

    cfg = load_config()
    tr = Tracker(cfg=cfg)
    start, end, label = week_bounds(args.week)
    brands = [b["display_name"] for b in cfg["brands"].values()]
    lines: list[str] = []
    out = lines.append

    out(f"# Weekly backlink review — {label} ({start.isoformat()} → {end.isoformat()})\n")

    live_rows = [r for r in tr.data_rows() if str(tr.get(r, "Status")) == "Live"]
    all_active = [r for r in tr.data_rows() if str(tr.get(r, "Status")) in ("Live", "Submitted")]

    # 1. counts this week -----------------------------------------------------
    this_week = [r for r in live_rows if posted_date(tr, r) and start <= posted_date(tr, r) <= end]
    out("## Links live this week")
    by_brand = Counter(str(tr.get(r, "Brand")) for r in this_week)
    by_type = Counter(str(tr.get(r, "Link type") or "?") for r in this_week)
    out("| Brand | Live this week | Total live |")
    out("|---|---|---|")
    for b in brands + sorted({str(tr.get(r, 'Brand')) for r in this_week} - set(brands)):
        out(f"| {b or '(blank)'} | {by_brand.get(b, 0)} | {sum(1 for r in live_rows if str(tr.get(r,'Brand'))==b)} |")
    out("\nBy link type: " + (", ".join(f"{k}: {v}" for k, v in by_type.items()) or "none"))

    # 2. removals -------------------------------------------------------------
    removed = [r for r in tr.data_rows() if str(tr.get(r, "Status")) == "Removed"]
    rem_week = [r for r in removed if any(k in str(tr.get(r, "Notes") or "") for k in ()) or True]
    out("\n## Removed links")
    if not removed:
        out("None recorded. ✅")
    for r in removed:
        out(f"- row {r}: {tr.get(r,'Live URL')} — {tr.get(r,'Notes')}")
    _ = rem_week

    # 3. anchor mix vs target --------------------------------------------------
    out("\n## Anchor mix (target: brand 40% / partial 30% / plain URL 20% / generic 10%)")
    cats = Counter(classify_anchor(str(tr.get(r, "Anchor") or ""), brands) for r in all_active)
    total = sum(cats.values()) or 1
    tol = cfg["drift_tolerance_pp"] / 100.0
    tgt = cfg["anchor_mix_target"]
    out("| Bucket | Actual | Target | Drift | Flag |")
    out("|---|---|---|---|---|")
    for key in ("brand", "partial_keyword", "plain_url", "generic"):
        actual = cats.get(key, 0) / total
        t = tgt[key]
        flag = "⚠ fix next week's rows" if abs(actual - t) > tol else ""
        out(f"| {key} | {actual:.0%} | {t:.0%} | {(actual-t):+.0%} | {flag} |")
    if cats.get("unknown"):
        out(f"\n({cats['unknown']} rows have no anchor yet — fill them from the tracker plan)")

    # 4. nofollow share ---------------------------------------------------------
    attrs = Counter(str(tr.get(r, "Dofollow / Nofollow") or "Unknown") for r in live_rows)
    out("\n## Link attributes (live rows)")
    out(", ".join(f"{k}: {v}" for k, v in attrs.items()) or "no live rows")
    out("(Nofollow on profiles/directories is fine — don't chase dofollow at the cost of relevance.)")

    # 5. hygiene checks ----------------------------------------------------------
    out("\n## Hygiene")
    dom_by_brand: dict[tuple, list] = {}
    for r in tr.data_rows():
        d = Tracker.domain(tr.get(r, "Site / URL"))
        if d:
            dom_by_brand.setdefault((str(tr.get(r, "Brand")), d), []).append(r)
    dupes = {k: v for k, v in dom_by_brand.items() if len(v) > 1}
    out("- One brand / one account per site: " + ("OK ✅" if not dupes else f"CHECK rows {dupes}"))
    missing_live = [r for r in live_rows if not str(tr.get(r, "Live URL") or "").startswith("http")]
    out("- Live rows without a real Live URL: " + ("none ✅" if not missing_live else f"rows {missing_live} ❌"))
    unverified = [r for r in live_rows if not parse_date(tr.get(r, "Verified date"))]
    overdue = [r for r in unverified if (parse_date(tr.get(r, "Verify on")) or dt.date.max) <= today()]
    out(f"- Not yet verified: {len(unverified)} live rows; overdue past Verify-on: {len(overdue)}"
        + (f" → run due_for_verification.py (rows {overdue})" if overdue else " ✅"))

    out("\n## Decisions (SEO lead fills in)")
    out("- Scale: ")
    out("- Drop: ")
    out("- Search Console new referring domains: ")

    report = "\n".join(lines) + "\n"
    print(report)
    if args.save:
        logp = REPO_ROOT / "data" / "weekly-review-log.md"
        with open(logp, "a", encoding="utf-8") as f:
            f.write(report + "\n---\n\n")
        print(f"(saved to {logp.relative_to(REPO_ROOT)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
