#!/usr/bin/env python3
"""Step 8 — verify a live link: page still up? target still linked? Then record the result.

Checks done automatically:
  * HTTP status of the Live URL (2xx/3xx ok; 404/410 => removed; other => unreachable)
  * the Target page slug/domain still appears in the page HTML (link present)
  * rel="nofollow" detected on the page anchors => notes it (allowed, but tracked)

Usage:
    python scripts/verify_link.py --row 2                    # check only, report
    python scripts/verify_link.py --row 2 --mark-verified    # check + fill Verified date
    python scripts/verify_link.py --row 2 --removed          # force-mark Removed (manual call)
    python scripts/verify_link.py --all                      # every due row (no marking)
"""
from __future__ import annotations
import argparse, datetime as dt, re, sys
from pathlib import Path
from urllib import request as _rq
from urllib.error import URLError, HTTPError

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import Tracker, load_config, parse_date, today  # noqa: E402

UA = {"User-Agent": "Mozilla/5.0 (compatible; backlink-verifier/1.0; SEO lead approved tool)"}


def fetch(url: str, timeout: int = 20):
    req = _rq.Request(url, headers=UA)
    try:
        with _rq.urlopen(req, timeout=timeout) as resp:
            body = resp.read(600_000).decode("utf-8", "replace")
            return resp.status, body
    except HTTPError as e:
        return e.code, ""
    except (URLError, TimeoutError, OSError):
        return None, ""


def check_row(tr: Tracker, r: int) -> dict:
    live = str(tr.get(r, "Live URL") or "")
    target = str(tr.get(r, "Target page") or "")
    res = {"row": r, "live_url": live, "status_code": None, "link_present": None,
           "nofollow_seen": False, "verdict": "BROKEN", "detail": "no Live URL recorded"}
    if not live.startswith("http"):
        return res
    code, html = fetch(live)
    res["status_code"] = code
    if code is None:
        res["detail"] = "unreachable (network/DNS/timeout) — retry once before calling it Removed"
        return res
    if code in (404, 410) or code >= 500:
        res["detail"] = f"HTTP {code} — page gone"
        res["verdict"] = "REMOVED"
        return res
    if code >= 400:
        res["detail"] = f"HTTP {code} — blocked/error"
        return res
    res["nofollow_seen"] = bool(re.search(r'rel=["\'][^"\']*nofollow', html, re.I))
    m = re.search(r"https?://([^/\s]+)(/[^\s\"'<>]*)?", target or "")
    if m:
        domain, path = m.group(1), (m.group(2) or "/").strip("/")
        needle = path.split("/")[0] if path else ""
        present = domain.lower() in html.lower() and (not needle or needle.lower() in html.lower())
        res["link_present"] = present
    else:
        res["link_present"] = None
        res["detail"] = "Target page column empty — cannot confirm link points to right page"
        return res
    if res["link_present"]:
        res["verdict"] = "OK"
        res["detail"] = "page up, target linked" + (", nofollow noted" if res["nofollow_seen"] else "")
    else:
        res["verdict"] = "CHANGED"
        res["detail"] = "page up but target link not found — treat as Removed per SOP"
    return res


def apply_result(tr: Tracker, res: dict, mark_verified: bool, force_removed: bool, cfg: dict) -> None:
    r = res["row"]
    old = str(tr.get(r, "Notes") or "").strip()
    stamp = today().isoformat()
    if force_removed or res["verdict"] in ("REMOVED", "CHANGED"):
        tr.set(r, "Status", "Removed")
        tr.set(r, "Notes", (old + " | " if old else "") + f"{stamp}: REMOVED — {res['detail']} — SEO lead informed")
        print(f"  row {r}: marked Removed. TELL THE SEO LEAD TODAY (SOP §2/Step 8).")
    elif mark_verified and res["verdict"] == "OK":
        tr.set(r, "Verified date", stamp)
        extra = " (nofollow noted)" if res["nofollow_seen"] else ""
        tr.set(r, "Notes", (old + " | " if old else "") + f"{stamp}: verified{extra}")
        print(f"  row {r}: Verified date filled{extra}.")
    else:
        print(f"  row {r}: {res['verdict']} — {res['detail']}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--row", type=int)
    ap.add_argument("--all", action="store_true", help="check all Live/Submitted rows not yet verified")
    ap.add_argument("--mark-verified", action="store_true", help="fill Verified date when OK")
    ap.add_argument("--removed", action="store_true", help="force this row to Removed")
    args = ap.parse_args()
    if not args.row and not args.all:
        ap.error("give --row N or --all")

    cfg = load_config()
    tr = Tracker(cfg=cfg)
    rows = [args.row] if args.row else [
        r for r in tr.data_rows()
        if str(tr.get(r, "Status")) in ("Live", "Submitted") and not parse_date(tr.get(r, "Verified date"))
    ]
    failures = 0
    for r in rows:
        res = check_row(tr, r)
        print(f"[row {r}] {res['live_url'] or '-'} -> HTTP {res['status_code']} :: {res['detail']}")
        apply_result(tr, res, args.mark_verified and not args.removed, args.removed, cfg)
        if res["verdict"] != "OK":
            failures += 1
    if rows:
        tr.save()
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
