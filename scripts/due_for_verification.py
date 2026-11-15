
          #!/usr/bin/env python3
"""Step 8 — list rows due for the 7-day re-check (Verify on date reached, not yet verified).

Usage:
    python scripts/due_for_verification.py            # due today or overdue
    python scripts/due_for_verification.py --days 3   # also show what's due in the next 3 days
Exit code 1 if anything is overdue (usable in cron/CI alerts).
"""
from __future__ import annotations
import argparse, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import Tracker, load_config, parse_date, today  # noqa: E402


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--days", type=int, default=0, help="look-ahead window (upcoming, not overdue)")
    ap.add_argument("--notify", action="store_true", help="Send real-time alert via Cloudflare/notification stream if items are due")
    args = ap.parse_args()

    cfg = load_config()
    tr = Tracker(cfg=cfg)
    now = today()
    overdue, upcoming = [], []
    for r in tr.data_rows():
        status = str(tr.get(r, "Status") or "")
        if status not in ("Live", "Submitted"):
            continue
        if parse_date(tr.get(r, "Verified date")):
            continue  # already checked
        v = parse_date(tr.get(r, "Verify on"))
        if not v:
            overdue.append((None, r, "MISSING Verify on date — fix via record.py"))
            continue
        line = f"row {r:>4}  verify-on {v.isoformat()}  [{status:<9}] {str(tr.get(r,'Brand')):<11} {tr.get(r,'Live URL')}"
        if v <= now:
            overdue.append((v, r, line))
        elif (v - now).days <= args.days:
            upcoming.append(line)

    print(f"Due for verification (as of {now.isoformat()}):")
    if not overdue and not upcoming:
        print("  nothing due. Nice.")
        return 0
    for _, _, line in sorted(overdue, key=lambda x: (x[0] is None, x[0] or now)):
        print(f"  DUE   {line}")
    for line in upcoming:
        print(f"  soon  {line}")
    if overdue:
        if args.notify:
            try:
                from notify_cloudflare import notify_event
                notify_event(
                    title="⚠️ Link Verification Due",
                    message=f"{len(overdue)} backlink row(s) are due for 7-day re-check!",
                    notification_type="warning",
                    url="/tracking",
                )
            except Exception as e:
                print(f"[warning] could not send real-time notification: {e}")

        print("\nAction per row (SOP Step 8):")
        print("  python scripts/verify_link.py --row N              # automated check")
        print("  then fill Verified date (--mark-verified) or mark Removed.")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
