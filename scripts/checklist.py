#!/usr/bin/env python3
"""Pre-flight & housekeeping checks against the SOP.

Subcommands:
    preflight   everything needed before ANY submission (kit, config placeholders, tracker columns)
    kit         asset-kit completeness per brand (Step 1)
    validate    every tracker row checked against Section 3/6/7 rules
    rows        same as validate but exit 0 even with issues (report only)

Exit codes: 0 = clear, 1 = problems found.
"""
from __future__ import annotations
import argparse, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import REPO_ROOT, Tracker, load_config, placeholders, validate_row  # noqa: E402

KIT_FIELDS = ["Brand name", "Short bio (50 words)", "Long bio (150 words)", "Address",
              "Phone", "Email", "Founding year", "Website", "Logo file",
              "Author name", "Author credentials", "Doctor reviewer", "Kit approved by", "Approval date"]


def check_kit(cfg) -> bool:
    ok = True
    for key, brand in cfg["brands"].items():
        d = REPO_ROOT / brand["asset_kit_dir"]
        md = sorted(d.glob("*.md"))
        text = "\n".join(p.read_text(encoding="utf-8") for p in md) if md else ""
        missing = [f for f in KIT_FIELDS if not re.search(re.escape(f) + r"\s*[:=]", text)]
        unfilled = [f for f in KIT_FIELDS if re.search(re.escape(f) + r"\s*[:=]\s*(TBD|\[|\{\{|>)", text)]
        status = "APPROVED" if brand.get("kit_approved") else "NOT APPROVED"
        print(f"[kit] {brand['display_name']:<12} dir={brand['asset_kit_dir']}  kit_approved={status}")
        if not md:
            print("      ❌ no kit files — copy *_TEMPLATE.md and fill it (Step 1)")
            ok = False
        if missing:
            print("      ❌ fields missing:", ", ".join(missing)); ok = False
        if unfilled:
            print("      ⚠ fields left as TBD:", ", ".join(unfilled)); ok = False
        if not brand.get("kit_approved"):
            print("      ⚠ config brands.%s.kit_approved=false — no submissions until SEO lead signs off" % key)
            ok = False
    return ok


def check_placeholders(cfg) -> bool:
    ph = placeholders(cfg)
    if not ph:
        print("[config] no open '[SEO lead to set:' placeholders ✅")
        return True
    print(f"[config] {len(ph)} decisions still open:")
    for p in ph:
        print("   -", p)
    return False


def check_tracker_columns(tr) -> bool:
    missing = tr.missing_columns()
    if missing:
        print("[tracker] ❌ missing required columns (add before starting, Section 3):", missing)
        return False
    print(f"[tracker] all {len(tr.columns)} required columns present ✅  ({tr.path.name}, sheet '{tr.ws.title}')")
    return True


def check_rows(tr) -> bool:
    clean = True
    n = 0
    for r in tr.data_rows():
        n += 1
        issues = validate_row(tr, r)
        if issues:
            clean = False
            print(f"[row {r}] {tr.get(r,'Site / URL') or '-'}")
            for i in issues:
                print("     ❌", i)
    print(f"[rows] {n} data rows checked — {'all compliant ✅' if clean else 'issues above ❌'}")
    return clean


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cmd", choices=["preflight", "kit", "validate", "rows"])
    args = ap.parse_args()

    cfg = load_config()
    results = []
    if args.cmd in ("preflight", "kit"):
        results.append(check_kit(cfg))
    if args.cmd == "preflight":
        results.append(check_placeholders(cfg))
    if args.cmd in ("preflight", "validate", "rows"):
        try:
            tr = Tracker(cfg=cfg)
        except FileNotFoundError:
            print("[tracker] ❌ not found — run: python scripts/make_tracker.py")
            return 1
        cols_ok = check_tracker_columns(tr)
        results.append(cols_ok)
        if cols_ok:
            rows_ok = check_rows(tr)
            results.append(rows_ok if args.cmd != "rows" else True)

    ok = all(results)
    print("\nPREFLIGHT RESULT:", "CLEAR — you may start Step 2 ✅" if ok else "BLOCKED — fix items above first ❌")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
