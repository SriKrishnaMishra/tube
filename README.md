# Backlink Upload Process — QHT Clinic & URoots

Operational home for the bulk backlink campaigns: the SOP, the tracker workbook, brand
asset kits, and small Python tools that **enforce the SOP** so nothing relies on memory.

📖 Full process: **[docs/SOP.md](docs/SOP.md)** — this repo mirrors it step-for-step.

## What's here

| Path | Purpose |
| --- | --- |
| `docs/SOP.md` | The step-by-step instructions (Steps 1–9, outreach, status codes, do/don't, when to stop) |
| `config/campaign.yaml` | Machine-readable rules: Rx list, competitor list, banned claims, anchor-mix target, verification window. Search `[SEO lead to set:` for open decisions |
| `tracker/backlinks_tracker.xlsx` | The working tracker (all Section-3 columns, dropdowns, colour-coded statuses) |
| `asset-kit/<brand>/` | Approved bios, NAP details, logo, author — copy from here, never retype |
| `templates/` | Tracker CSV template + outreach email template (**drafts only**) |
| `scripts/` | The tools below |
| `data/` | Prospect imports, weekly review log, outreach drafts |

## Setup (once)

```bash
pip install -r requirements.txt
python scripts/make_tracker.py                    # creates tracker/backlinks_tracker.xlsx
# fill config/campaign.yaml placeholders + asset kits (Step 1), then:
python scripts/checklist.py preflight             # must be CLEAR before any submission
```

## Daily loop (executors)

```bash
python scripts/pick_next.py --claim --executor "YourName"   # Step 2
python scripts/legal_gate.py --file draft.txt               # Step 4 (before publishing!)
python scripts/record.py --row N --status Live \
    --live-url https://site.com/post --executor "YourName"  # Step 7 (same day)
```

## Weekly loop

```bash
python scripts/due_for_verification.py            # Step 8 — what to re-check
python scripts/verify_link.py --row N --mark-verified
python scripts/weekly_review.py --save            # Step 9 — SEO lead report
```

## Guardrails built in

- No **Live/Submitted** row can be saved without a real Live URL (+ Verify-on auto-computed at +7 days).
- **Hold/Skip/Removed** rows must carry a reason in Notes.
- Legal gate exits non-zero on Rx names, competitor names or cure/guarantee/before-after claims → row goes Hold.
- Tracker validation flags credential-looking text in Account login/Notes (passwords live only in the vault).
- Outreach tooling **never sends email**; drafts need SEO lead approval.
- One brand, one account per site is checked in the weekly review.

## Safety notes

- Publishing accounts/profiles stays manual; these scripts check, record and report — they don't post.
- Keep this repo free of credentials; commit the tracker regularly (it's your audit trail), but move it
  out of the repo if the sheet will ever hold anything sensitive.
