"""Shared helpers for the backlink campaign scripts (QHT Clinic & URoots).

All scripts read config/campaign.yaml and operate on the tracker workbook
(tracker/backlinks_tracker.xlsx by default). Keep this module dependency-light:
openpyxl + PyYAML only (stdlib otherwise).
"""
from __future__ import annotations

import datetime as _dt
import re
import sys
from pathlib import Path
from typing import Iterable, Optional

# Ensure standard output can handle Unicode symbols on Windows
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
if sys.stderr and hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

import yaml
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

REPO_ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = REPO_ROOT / "config" / "campaign.yaml"


# --------------------------------------------------------------------------- config
def load_config(path: Optional[Path] = None) -> dict:
    p = path or CONFIG_PATH
    with open(p, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def placeholders(cfg: dict, prefix: str = "[SEO lead to set") -> list[str]:
    """Return every config value still awaiting an SEO-lead decision."""
    hits: list[str] = []

    def walk(node, keypath):
        if isinstance(node, dict):
            for k, v in node.items():
                walk(v, f"{keypath}.{k}" if keypath else str(k))
        elif isinstance(node, list):
            for i, v in enumerate(node):
                walk(v, f"{keypath}[{i}]")
        elif isinstance(node, str) and prefix in node:
            hits.append(f"{keypath}: {node}")

    walk(cfg, "")
    return hits


# --------------------------------------------------------------------------- dates
def today() -> _dt.date:
    return _dt.date.today()


def parse_date(value) -> Optional[_dt.date]:
    """Accept date/datetime cells and ISO-ish strings."""
    if value is None or value == "":
        return None
    if isinstance(value, _dt.datetime):
        return value.date()
    if isinstance(value, _dt.date):
        return value
    s = str(value).strip()
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%Y/%m/%d"):
        try:
            return _dt.datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    return None


# --------------------------------------------------------------------------- tracker
def norm_header(h) -> str:
    return re.sub(r"\s+", " ", str(h or "").strip())


class Tracker:
    """Thin wrapper over the xlsx tracker. Row numbers are 1-based sheet rows;
    row 1 is the header, data starts at row 2."""

    def __init__(self, path: Optional[Path] = None, cfg: Optional[dict] = None, create=False):
        self.cfg = cfg or load_config()
        rel = self.cfg["tracker"]["path"]
        self.path = path or (REPO_ROOT / rel)
        self.columns: list[str] = [norm_header(c) for c in self.cfg["tracker"]["required_columns"]]
        if create:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            wb = Workbook()
            ws = wb.active
            ws.title = self.cfg["tracker"]["sheet"]
            ws.append(self.columns)
            wb.save(self.path)
        self.wb = load_workbook(self.path)
        self.ws = self.wb[self.cfg["tracker"]["sheet"]]
        self.headers = [norm_header(c.value) for c in self.ws[1]]

    # -- structure ----------------------------------------------------------
    def missing_columns(self) -> list[str]:
        return [c for c in self.columns if c not in self.headers]

    def col(self, name: str) -> int:
        n = norm_header(name)
        if n not in self.headers:
            raise KeyError(f"Column {n!r} missing from tracker. Add it before working (Section 3).")
        return self.headers.index(n) + 1

    # -- rows ---------------------------------------------------------------
    def data_rows(self) -> Iterable[int]:
        for r in range(2, self.ws.max_row + 1):
            if any(self.ws.cell(row=r, column=c).value not in (None, "") for c in range(1, len(self.headers) + 1)):
                yield r

    def get(self, row: int, name: str):
        v = self.ws.cell(row=row, column=self.col(name)).value
        return v.strip() if isinstance(v, str) else v

    def set(self, row: int, name: str, value):
        self.ws.cell(row=row, column=self.col(name)).value = value

    def append(self, values: dict) -> int:
        # ws.max_row can over-report after styling (blank styled rows), which
        # would leave a gap; scan for the true last data row instead.
        r = 1
        for rr in range(2, self.ws.max_row + 1):
            if any(self.ws.cell(row=rr, column=c).value not in (None, "")
                   for c in range(1, len(self.headers) + 1)):
                r = rr
        r += 1
        for k, v in values.items():
            self.set(r, k, v)
        return r

    def save(self):
        self.wb.save(self.path)

    # -- domain helpers -----------------------------------------------------
    @staticmethod
    def domain(url) -> str:
        if not url:
            return ""
        m = re.search(r"https?://([^/\s]+)", str(url))
        d = m.group(1) if m else str(url).strip()
        return d.lower().removeprefix("www.")


# --------------------------------------------------------------------------- anchors
_GENERIC_ANCHORS = {
    "click here", "read more", "learn more", "visit this site", "website", "link",
    "here", "more", "details", "source",
}


def classify_anchor(anchor: str, brand_names: Iterable[str]) -> str:
    """brand | plain_url | generic | partial_keyword (Step 5 mix buckets)."""
    a = (anchor or "").strip().lower()
    if not a:
        return "unknown"
    if a.startswith(("http://", "https://", "www.")) or re.match(r"^[\w.-]+\.(com|in|org|net)\b", a):
        return "plain_url"
    if a in _GENERIC_ANCHORS:
        return "generic"
    for b in brand_names:
        if b and b.lower().strip() in a:
            return "brand"
    return "partial_keyword"


# --------------------------------------------------------------------------- validation
def validate_row(tr: "Tracker", row: int) -> list[str]:
    """SOP-compliance issues for one row. Returns human-readable strings."""
    issues: list[str] = []
    cfg = tr.cfg
    status = str(tr.get(row, "Status") or "Not started")
    decision = str(tr.get(row, "Decision") or "")
    live_url = tr.get(row, "Live URL")
    target = tr.get(row, "Target page")

    if decision and decision not in cfg["decisions"]:
        issues.append(f"Decision {decision!r} not one of {cfg['decisions']}")
    if status and status not in cfg["statuses"]:
        issues.append(f"Status {status!r} not one of {cfg['statuses']}")
    lt = tr.get(row, "Link type")
    if lt and lt not in cfg["link_types"]:
        issues.append(f"Link type {lt!r} not one of {cfg['link_types']}")
    attr = tr.get(row, "Dofollow / Nofollow")
    if attr and attr not in cfg["link_attributes"]:
        issues.append(f"Link attribute {attr!r} not one of {cfg['link_attributes']}")

    if status in ("Live", "Submitted") and not live_url:
        issues.append("Status Live/Submitted requires the exact Live URL (Step 7)")
    if live_url and not str(live_url).startswith(("http://", "https://")):
        issues.append("Live URL must be a real page address starting with http(s)://")
    if live_url and "docs.google.com" in str(live_url):
        issues.append("Live URL points at a sheet, not the published page (Step 7)")

    posted = parse_date(tr.get(row, "Date posted"))
    verify_on = parse_date(tr.get(row, "Verify on"))
    if status in ("Live", "Submitted") and posted:
        expected = posted + _dt.timedelta(days=cfg["campaign"]["verification_days"])
        if verify_on != expected:
            issues.append(f"Verify on should be {expected.isoformat()} (posted + {cfg['campaign']['verification_days']}d)")
    if status == "Live" and not verify_on:
        issues.append("Live row missing Verify on date")
    verified = parse_date(tr.get(row, "Verified date"))
    if verified and status not in ("Live", "Removed"):
        issues.append("Verified date filled but status is not Live/Removed")

    if status in ("Hold", "Skip") and not tr.get(row, "Notes"):
        issues.append(f"{status} row needs a reason in Notes (Steps 3/4/7)")

    # security: never store credentials in the tracker
    banned = [w.lower() for w in cfg["security"]["forbidden_in_tracker"]]
    login = str(tr.get(row, "Account login") or "").lower()
    if "=" in login or ":" in login and "/" not in login:
        issues.append("Account login looks like a credential, not a password-manager pointer")
    for cell_name in ("Account login", "Notes"):
        text = str(tr.get(row, cell_name) or "").lower()
        for w in banned:
            if w in text and "password manager" not in text:
                issues.append(f"{cell_name} mentions {w!r} — store logins only in the shared vault")
                break
    return issues


# --------------------------------------------------------------------------- styling
HEADER_FILL = PatternFill("solid", fgColor="1F4E79")
STATUS_COLORS = {
    "Not started": "F2F2F2", "In progress": "FFF2CC", "Submitted": "DDEBF7",
    "Live": "E2EFDA", "Hold": "FCE4D6", "Skip": "F8CBAD", "Removed": "FFC7CE",
}


def style_sheet(tr: "Tracker"):
    ws = tr.ws
    for c in range(1, len(tr.headers) + 1):
        cell = ws.cell(row=1, column=c)
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = HEADER_FILL
        cell.alignment = Alignment(vertical="center", wrap_text=True)
        ws.column_dimensions[get_column_letter(c)].width = max(14, min(30, len(str(cell.value)) + 4))
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:{get_column_letter(len(tr.headers))}{max(ws.max_row, 2)}"

    # dropdowns keep humans inside the SOP vocabulary
    defs = [("Decision", tr.cfg["decisions"]), ("Status", tr.cfg["statuses"]),
            ("Link type", tr.cfg["link_types"]), ("Dofollow / Nofollow", tr.cfg["link_attributes"]),
            ("Word count", list(tr.cfg["word_count_modes"].keys()))]
    last = max(ws.max_row, 500)
    for name, options in defs:
        if name in tr.headers:
            dv = DataValidation(type="list", formula1='"' + ",".join(options) + '"', allow_blank=True)
            dv.error = "Use only the SOP values (docs/SOP.md)."
            dv.showErrorMessage = True
            ws.add_data_validation(dv)
            dv.add(f"{get_column_letter(tr.headers.index(name) + 1)}2:{get_column_letter(tr.headers.index(name) + 1)}{last}")

    # conditional colouring on Status
    from openpyxl.formatting.rule import CellIsRule
    if "Status" in tr.headers:
        letter = get_column_letter(tr.headers.index("Status") + 1)
        for status, color in STATUS_COLORS.items():
            ws.conditional_formatting.add(
                f"{letter}2:{letter}{last}",
                CellIsRule(operator="equal", formula=[f'"{status}"'], fill=PatternFill("solid", fgColor=color)),
            )
