#!/usr/bin/env python3
"""Step 4 — legal gate. Scan draft text for Rx names, competitor brands and prohibited claims.

Rule from the SOP: any hit means HOLD until doctor/legal sign-off. Exit code 1 = blocked,
so you can wire it into CI or a pre-publish check.

Usage:
    python scripts/legal_gate.py --file draft.txt
    python scripts/legal_gate.py --text "Minoxidil cures hair loss…"
    echo "draft…" | python scripts/legal_gate.py -
"""
from __future__ import annotations
import argparse, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import load_config  # noqa: E402


def find_terms(text: str, terms: list[str]) -> list[tuple[str, int]]:
    """Return (term, line_no) for each term found (word-boundary match)."""
    hits = []
    lines = text.splitlines() or [text]
    for term in terms:
        pat = re.compile(r"(?<![\w-])" + re.escape(term) + r"(?![\w-])", re.IGNORECASE)
        for i, line in enumerate(lines, 1):
            if pat.search(line):
                hits.append((term, i))
                break  # one report per term is enough
    return hits


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--file", help="draft text file")
    ap.add_argument("--text", help="draft text inline")
    ap.add_argument("-", dest="stdin", action="store_true", help="read draft from stdin")
    args = ap.parse_args()

    if args.file:
        text = Path(args.file).read_text(encoding="utf-8")
    elif args.text:
        text = args.text
    elif args.stdin or (not sys.stdin.isatty() and not args.file and not args.text):
        text = sys.stdin.read()
    else:
        ap.error("give --file, --text or -")

    cfg = load_config()
    lg = cfg["legal_gate"]
    rx = find_terms(text, lg["rx_terms"])
    comp = find_terms(text, lg["competitor_brands"])
    claims = find_terms(text, lg["prohibited_claims"])

    print(f"Legal gate — {len(text.split())} words scanned\n")
    for label, hits, advice in (
        ("Rx / prescription medicines", rx, "HOLD: needs doctor + legal sign-off before publishing."),
        ("Competitor brands", comp, "HOLD: needs legal review."),
        ("Prohibited claims", claims, "BLOCKED outright: rewrite with factual language (no cure/guarantee/before-after)."),
    ):
        if hits:
            print(f"[HIT ] {label}:")
            for term, ln in hits:
                print(f"        - {term!r} (line {ln})")
            print(f"       → {advice}\n")
        else:
            print(f"[ OK ] {label}: none found")

    blocked = bool(rx or comp or claims)
    if blocked:
        print("RESULT: HOLD — set Status=Hold, add the reason to Notes, and ask the SEO lead (SOP §7).")
        return 1
    print("RESULT: PASS — continue to Step 5/6.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
