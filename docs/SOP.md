# Backlink Upload Process — SOP (QHT Clinic & URoots)

Step-by-step instructions for the QHT Clinic and URoots bulk backlink campaigns.
Follow the steps in order for **every row in the tracker**.

> **Machine-readable rules:** the thresholds, keyword lists and anchor-mix targets in this
> document are encoded in [`config/campaign.yaml`](../config/campaign.yaml). The scripts in
> [`scripts/`](../scripts/) enforce them automatically. Search that file for
> `[SEO lead to set:` to see every value that still needs a decision.

---

## 1. Key terms

| Term | Meaning |
| --- | --- |
| **Do first / Do short** | Priority labels in the tracker's Decision column. *Do first* rows are done first. *Do short* rows need only a short profile or short post. |
| **Rx** | Prescription medicine (for example minoxidil, finasteride, dutasteride). Any text that names one needs sign-off. |
| **Spun / bulk AI text** | Text rewritten by a tool or generated in bulk without human editing. Not allowed. |
| **Dofollow / nofollow** | Whether the link passes SEO value. Profile and directory links are usually nofollow, which is fine. |
| **Anchor** | The clickable text of the link. |

---

## 2. The process at a glance

| Stage | What happens | Output | Rule |
| --- | --- | --- | --- |
| **Prepare** | Fill and approve the asset kit (bios, address, phone, logo, author) | One approved kit for every submission | No submission starts without it |
| **Select** | Pick the next row marked Do first or Do short | Row chosen | Skip rows marked Hold or Skip |
| **Check** | Check the site (Step 3), then the legal gate (Step 4) | Go, Hold or Skip | Rx, competitor and paid rows need sign-off |
| **Write** | Prepare text with the recommended word count and anchor | Draft ready | No spun or copied text |
| **Post** | Create account or submit, then publish | Live link | Use official brand details only |
| **Record** | Update the tracker the same day | Status, Live URL and date saved | Not recorded means not done |
| **Verify** | Re-check the link after 7 days | Verified, Removed or Nofollow noted | Report removals immediately |
| **Review** | Weekly review of counts, anchor mix and new referring domains | Scale / drop decisions | Done every week by the SEO lead |

---

## 3. Tracker columns (required)

The tracker sheet must have these columns. Add any that are missing before starting.
The canonical template is [`templates/tracker_template.csv`](../templates/tracker_template.csv);
`python scripts/make_tracker.py` creates `tracker/backlinks_tracker.xlsx` from it and validates
the headers. `python scripts/checklist.py validate` re-checks any live tracker against this list.

| Column | Purpose |
| --- | --- |
| Brand | QHT Clinic or URoots |
| Site / URL | Website being submitted to |
| Decision | Do first, Do short, Hold, Skip |
| Week order | Order of work |
| Target page | Page on our site the link points to |
| Anchor | Suggested anchor text |
| Word count | Short profile, short blog or full article |
| Link type | Profile, directory, guest post or citation |
| Dofollow / Nofollow | Link attribute |
| Status | See Section 6 |
| **Live URL** | Exact URL of the published page (own column, not Notes) |
| Date posted | Date and executor name |
| **Verify on** | Posted date + 7 days |
| **Verified date** | Date the link was checked and confirmed |
| Account login | Pointer to the password manager entry (never the password) |
| Notes | Reasons for Hold or Skip, other remarks |

---

## 4. Step-by-step flow

### Step 1: Prepare the asset kit (once per brand)

**Owner:** SEO lead (approver: SEO lead, with doctor sign-off for health content)

- Collect the brand name, short bio (50 and 150 words), address, phone, email, founding year, website and logo.
- Name the author and credentials for any health content. Doctor review for medical claims.
- Keep the kit in one shared folder. Copy from it every time, never retype details.
- Store all site logins in the shared password manager. Never keep passwords in the tracker or in chat.

**In this repo:** fill in `asset-kit/qht-clinic/` and `asset-kit/uroots/` (start from the
`*_TEMPLATE.md` files). `python scripts/checklist.py kit` reports what is still missing;
submissions for a brand must not start until its kit is complete and approved.

### Step 2: Pick the next row from the tracker

**Owner:** Executor

- Open the tracker and filter Decision = Do first, then Do short, then Week order.
- Do not touch rows marked Hold or Skip unless the SEO lead changes them.
- Mark the row **In progress** before starting so nobody duplicates it.

**Command:** `python scripts/pick_next.py --brand qht` prints the next eligible row.

### Step 3: Check the website

**Owner:** Executor

- Open the site and confirm it is live, relevant to hair care or health, and free of spam, casino or adult content.
- Confirm the minimum quality bar: the site is indexed in Google, has real recent content, and meets the SEO lead's threshold (`[SEO lead to set: for example minimum DR/DA or traffic]`).
- Read the posting rules: is a link allowed, is it free, and is a product link permitted?
- Note whether the link will be dofollow or nofollow.
- **Spam or irrelevant site:** mark **Skip** and write the reason in Notes.
- **Site asks for payment, ID or bank details:** mark **Hold** and tell the SEO lead. Do not pay or share details. Only the SEO lead can approve a paid placement.

### Step 4: Legal gate (medical and competitor check)

**Owner:** SEO lead, with doctor and legal sign-off

- Any text that names a prescription medicine (for example minoxidil, finasteride, dutasteride, or any other Rx) goes to doctor and legal sign-off first. Mark it **Hold** until approved.
- Any text that names a competitor brand (for example Traya, Man Matters, Bodywise) needs legal review. **Hold** until cleared.
- No cure, guaranteed result or before and after claims. Keep language factual.

**Command:** `python scripts/legal_gate.py --file draft.txt` flags Rx names, competitor names
and prohibited claim phrases automatically (lists live in `config/campaign.yaml`).

### Step 5: Prepare the content

**Owner:** Executor / writer

- Use the word count in the tracker: short profile, short blog or full article.
- Write original text. No copied, spun or bulk AI text.
- Use the anchor suggested in the tracker. The overall mix is about 40% brand, 30% partial keyword, 20% plain URL, 10% generic.
- Link to the target page listed for that row, not always the home page.

### Step 6: Create the account or submit

**Owner:** Executor

- Use the official brand email and the details from the asset kit.
- Fill every profile field: logo, bio, website link, location.
- Save the login in the shared password manager.
- Publish. If it needs editor approval, submit and note the date.
- Do not create several accounts on one site. One brand, one account.

### Step 7: Record in the tracker (same day)

**Owner:** Executor

- Set Status to **Live** (published) or **Submitted** (waiting for approval).
- Paste the exact live URL into the **Live URL** column. Use the real page address, not a link to the tracker sheet.
- Fill the link type (profile, directory, guest post or citation) and dofollow or nofollow.
- Write the date posted, your name and the **Verify on** date (posted date + 7 days).

**Command:** `python scripts/record.py --row 12 --status Live --live-url "https://…" --executor "Asha"`
does all of this atomically, computes Verify-on (+7 days), and refuses to save if the Live URL
column would be left empty.

### Step 8: Verify after 7 days

**Owner:** Executor

- On the Verify on date, open the live URL. Confirm the page is still up and the link points to the right target.
- If it is correct, fill the **Verified date**.
- If it is removed or changed, mark **Removed** and tell the SEO lead the same day.
- Save a screenshot for guest posts and any approved paid placements.

**Commands:** `python scripts/due_for_verification.py` lists rows whose Verify-on date has passed.
`python scripts/verify_link.py --row 12` fetches the live URL and checks the target page is still
linked; add `--mark-verified` on success or record `--removed` and it notifies via the Notes column.

### Step 9: Weekly review

**Owner:** SEO lead

- Count links live this week, by type and by brand.
- Review the list of removed links reported during the week.
- Check the anchor mix against the target and fix drift in the next week's rows.
- Check Search Console for new referring domains. Decide what to scale and what to drop.

**Command:** `python scripts/weekly_review.py` prints all of the above (anchor-mix drift vs. the
40/30/20/10 target included). Log decisions in `data/weekly-review-log.md`.

---

## 5. Outreach (guest posts and link requests)

**Owner:** Executor drafts, SEO lead approves

- Write the outreach email as a **draft** only. Never send it without SEO lead approval.
- Use the official brand email and the asset kit details.
- Log the site, contact, date sent and reply in the tracker Notes.
- Once the site agrees, continue from Step 5.

**In this repo:** copy `templates/outreach_email_TEMPLATE.md`, save drafts under
`data/outreach-drafts/` (drafts only — sending is manual and outside this tooling).

---

## 6. Status codes for the tracker

| Status | Meaning |
| --- | --- |
| **Not started** | Row is queued |
| **In progress** | Someone is working on it now |
| **Submitted** | Sent, waiting for editor or approval |
| **Live** | Published. Link works but is not yet re-checked (verified date is empty) |
| **Hold** | Waiting for legal, doctor, payment decision or brand details |
| **Skip** | Site rejected (spam, irrelevant) |
| **Removed** | Link was live and later removed |

A Live row becomes **verified** when the Verified date column is filled (Step 8).

---

## 6a. Do and don't

| Do | Don't |
| --- | --- |
| Use relevant, real sites that a patient could actually read | Buy bulk packages, use link farms or private blog networks |
| Keep brand details identical everywhere (name, address, phone) | Change the clinic name or phone between sites |
| Write original, factual, doctor-reviewed health text | Make cure, guarantee or before and after claims |
| Log every link on the same day | Leave links unrecorded or only in chat |
| Send outreach emails as drafts for the SEO lead to approve | Send outreach emails without approval |
| Store logins in the shared password manager | Keep passwords in the tracker or in chat |

---

## 7. When to stop and ask

Stop, mark the row **Hold**, and ask the SEO lead if:

- The site asks for payment, ID or a bank detail.
- The post needs a medical claim you cannot source.
- A competitor name or a prescription medicine appears in the text.
- The account needs a phone or email you do not have.
- The site rejects the link twice.
- You are unsure about anything. Ask first, publish later.
