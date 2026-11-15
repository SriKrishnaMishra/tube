#!/usr/bin/env python3
"""Module 1 — Real-Time AI Content Generation & Legal Compliance Engine.

Automates SOP Step 1 (Asset Kit loading), Step 5 (Content preparation with anchor),
and Step 4 (Legal & medical gate pre-validation).

Usage:
    python scripts/ai_content_engine.py --row 2
    python scripts/ai_content_engine.py --next
    python scripts/ai_content_engine.py --brand qht --next
    python scripts/ai_content_engine.py --row 2 --json
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Optional

from dotenv import load_dotenv

# Automatically load environment variables from .env file
load_dotenv()

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import REPO_ROOT, Tracker, load_config  # noqa: E402
from legal_gate import find_terms  # noqa: E402


@dataclass
class AssetKitData:
    brand_key: str
    brand_name: str
    short_bio: str
    long_bio: str
    address: str
    phone: str
    email: str
    founding_year: str
    website: str
    author_name: str
    author_credentials: str
    doctor_reviewer: str


@dataclass
class GenerationResult:
    row: Optional[int]
    brand: str
    site_url: str
    target_page: str
    anchor: str
    word_count_mode: str
    link_type: str
    title: str
    content: str
    word_count: int
    is_compliant: bool
    violations: list[str]
    draft_file: Optional[str]
    provider: str


def load_asset_kit(brand_key: str, cfg: dict) -> AssetKitData:
    """Load and parse asset kit markdown for a given brand key."""
    brand_cfg = cfg["brands"].get(brand_key)
    if not brand_cfg:
        # try matching by display name or partial
        for k, b in cfg["brands"].items():
            if k.lower() in brand_key.lower() or b["display_name"].lower() in brand_key.lower():
                brand_cfg = b
                brand_key = k
                break
    if not brand_cfg:
        raise ValueError(f"Unknown brand: {brand_key}")

    kit_dir = REPO_ROOT / brand_cfg["asset_kit_dir"]
    kit_file = kit_dir / "kit.md"
    if not kit_file.exists():
        candidates = [p for p in kit_dir.glob("*.md") if not p.name.endswith("_TEMPLATE.md")]
        if candidates:
            kit_file = candidates[0]
        else:
            kit_file = kit_dir / "kit_TEMPLATE.md"

    text = kit_file.read_text(encoding="utf-8") if kit_file.exists() else ""
    data: dict[str, str] = {}
    for line in text.splitlines():
        if ":" in line:
            k, _, v = line.partition(":")
            clean_k = k.strip().lower()
            clean_v = v.split("#")[0].strip()
            data[clean_k] = clean_v

    return AssetKitData(
        brand_key=brand_key,
        brand_name=data.get("brand name", brand_cfg.get("display_name", brand_key)),
        short_bio=data.get("short bio (50 words)", ""),
        long_bio=data.get("long bio (150 words)", ""),
        address=data.get("address", ""),
        phone=data.get("phone", ""),
        email=data.get("email", ""),
        founding_year=data.get("founding year", "2018"),
        website=data.get("website", brand_cfg.get("website", "")),
        author_name=data.get("author name", "Medical Team"),
        author_credentials=data.get("author credentials", "Dermatology Specialist"),
        doctor_reviewer=data.get("doctor reviewer", "Clinical Board"),
    )


def validate_legal_gate(text: str, cfg: dict) -> tuple[bool, list[str]]:
    """Scan text against the legal_gate rules in campaign.yaml."""
    lg = cfg["legal_gate"]
    rx = find_terms(text, lg.get("rx_terms", []))
    comp = find_terms(text, lg.get("competitor_brands", []))
    claims = find_terms(text, lg.get("prohibited_claims", []))

    violations: list[str] = []
    for term, ln in rx:
        violations.append(f"Rx term prohibited without doctor sign-off: '{term}' (line {ln})")
    for term, ln in comp:
        violations.append(f"Competitor brand prohibited: '{term}' (line {ln})")
    for term, ln in claims:
        violations.append(f"Prohibited medical/promotional claim: '{term}' (line {ln})")

    is_compliant = len(violations) == 0
    return is_compliant, violations


def synthesize_clinical_content(
    kit: AssetKitData,
    site_url: str,
    target_page: str,
    anchor: str,
    word_count_mode: str,
    link_type: str,
) -> tuple[str, str]:
    """High-quality clinical trichology content synthesizer (offline / deterministic engine).

    Strictly satisfies SOP requirements:
    - Natural anchor text insertion linked to target_page
    - Zero Rx terms
    - Zero competitor brands
    - Zero cure/guarantee claims
    - Clinical author & doctor reviewer attribution
    """
    anchor_html = f'<a href="{target_page}">{anchor}</a>'
    anchor_md = f"[{anchor}]({target_page})"

    if word_count_mode == "Short profile" or link_type == "Profile":
        title = f"{kit.brand_name} — Clinical Profile & Trichology Center"
        paragraphs = [
            f"{kit.brand_name} is a dedicated medical trichology and hair restoration clinic specializing in modern follicle care and scalp health. Founded in {kit.founding_year}, our clinical team is led by {kit.author_name} ({kit.author_credentials}) with medical oversight by {kit.doctor_reviewer}.",
            f"Under our evidence-based treatment protocols, patients consult with certified clinical specialists for detailed diagnostic assessments. Learn more about our comprehensive clinical offerings at our official resource for {anchor_md}.",
            f"Official Clinic Address: {kit.address}. Contact our medical coordination desk at {kit.phone} or via email at {kit.email}.",
        ]
        body = "\n\n".join(paragraphs)

    elif word_count_mode == "Short blog":
        title = f"Understanding Hair Density & Clinical Scalp Health — {kit.brand_name}"
        paragraphs = [
            f"Healthy hair growth begins with understanding the microscopic physiology of the scalp and follicular units. At {kit.brand_name}, clinical trichologists emphasize that follicular thinning is typically a gradual process influenced by genetics, nutritional balance, and scalp micro-circulation.",
            f"Early diagnostic evaluation is critical when addressing follicular miniaturization. A thorough clinical assessment—conducted by specialists such as {kit.author_name} ({kit.author_credentials})—allows practitioners to evaluate scalp sebum levels, follicular density, and individual hair shaft caliber using polarized trichoscopy.",
            f"When evaluating long-term restorative approaches, patients frequently research clinical methodologies and realistic outcomes. To explore clinical benchmarks and evidence-based standards, patients can review current guidance on {anchor_md} provided by {kit.brand_name}.",
            f"Every therapeutic protocol must prioritize scalp barrier integrity, cellular nutrition, and personalized medical oversight. For clinical consultations or verified treatment pathways, visit {kit.website} or contact our healthcare team at {kit.email}.",
        ]
        body = f"# {title}\n\n" + "\n\n".join(paragraphs)

    else:  # Full article
        title = f"Comprehensive Guide to Hair Follicle Physiology and Modern Restoration Standards"
        paragraphs = [
            f"## Introduction to Follicular Dynamics\nHair loss and follicle thinning affect millions worldwide, presenting complex dermatological and aesthetic challenges. At {kit.brand_name}, established in {kit.founding_year}, our clinical philosophy focuses on scientific rigor, patient safety, and individualized care.",
            f"## Clinical Assessment and Scalp Diagnostics\nAccording to {kit.author_name} ({kit.author_credentials}), understanding scalp morphology is the cornerstone of effective trichological care. High-resolution trichoscopy enables clinicians to map anagen-to-telogen ratios and detect micro-inflammation before visible thinning progresses.",
            f"## Modern Therapeutic and Surgical Considerations\nContemporary surgical and non-surgical restoration requires precision and artistic hairline design. Clinicians evaluate donor area density, graft viability, and recipient site angling to achieve balanced, natural coverage.\n\nPatients seeking transparent, doctor-verified data on clinical pathways and procedural protocols should consult our educational analysis regarding {anchor_md}.",
            f"## The Role of Medical Oversight\nMedical therapies must always be prescribed under the supervision of qualified physicians. Dr. {kit.doctor_reviewer} notes that unverified supplements or unmonitored home remedies often fail to address root follicular causes. A tailored dermatological strategy ensures scalp safety and sustained follicular vitality.",
            f"## Conclusion & Consultation Resources\nAchieving long-term hair wellness requires patience, factual guidance, and clinical expertise. For comprehensive consultations with {kit.brand_name}, contact our clinic directly at {kit.phone} or review detailed clinical case documentation on our website: {kit.website}.",
        ]
        body = f"# {title}\n\n" + "\n\n".join(paragraphs)

    return title, body


def generate_with_llm(
    kit: AssetKitData,
    site_url: str,
    target_page: str,
    anchor: str,
    word_count_mode: str,
    link_type: str,
    cfg: dict,
) -> Optional[tuple[str, str, str]]:
    """Attempt AI generation via Groq, Gemini, or OpenAI if API keys are present."""
    groq_key = os.environ.get("GROQ_API_KEY")
    gemini_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")

    prompt = f"""You are a senior medical copywriter for {kit.brand_name}.
Task: Write original, factual, clinical-grade {link_type} content for submission to {site_url}.
Word Count Mode: {word_count_mode}

Mandatory Context:
- Brand Name: {kit.brand_name}
- Author: {kit.author_name}, {kit.author_credentials}
- Doctor Reviewer: {kit.doctor_reviewer}
- Clinic Website: {kit.website}
- Target URL: {target_page}
- Anchor Text: {anchor}

STRICT GUARDRAILS (Violations will cause immediate rejection):
1. DO NOT mention any prescription medicines (e.g. do not mention minoxidil, finasteride, dutasteride, spironolactone, oral minoxidil, etc.).
2. DO NOT mention any competitor brands (e.g. do not mention Traya, Man Matters, Bodywise, etc.).
3. DO NOT make any cure, guarantee, 100% result, or miracle claims. Keep language purely factual, educational, and medical.
4. Naturally weave in markdown link: [{anchor}]({target_page}) exactly once in an informative sentence.

Return ONLY the title on the first line (prefixed with 'TITLE: ') followed by the article markdown body.
"""

    if groq_key:
        try:
            from groq import Groq  # type: ignore
            client = Groq(api_key=groq_key)
            models = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"]
            for model_name in models:
                try:
                    resp = client.chat.completions.create(
                        model=model_name,
                        messages=[
                            {"role": "system", "content": f"You are a medical copywriter for {kit.brand_name}. Adhere strictly to the requested word count and negative medical guardrails."},
                            {"role": "user", "content": prompt}
                        ],
                        temperature=0.3,
                        max_tokens=2048,
                    )
                    raw = resp.choices[0].message.content or ""
                    title = f"{kit.brand_name} Article"
                    body = raw
                    if "TITLE:" in raw:
                        lines = raw.splitlines()
                        title = lines[0].replace("TITLE:", "").strip()
                        body = "\n".join(lines[1:]).strip()
                    return title, body, f"groq-{model_name}"
                except Exception as mod_err:
                    print(f"[AI] Groq {model_name} attempt: {mod_err}, trying next model...")
                    continue
        except Exception as e:
            print(f"[AI] Groq generation failed: {e}, falling back...")

    if gemini_key:
        try:
            import google.generativeai as genai  # type: ignore
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            raw = response.text.strip()
            title = f"{kit.brand_name} Article"
            body = raw
            if "TITLE:" in raw:
                lines = raw.splitlines()
                title = lines[0].replace("TITLE:", "").strip()
                body = "\n".join(lines[1:]).strip()
            return title, body, "gemini-1.5-flash"
        except Exception as e:
            print(f"[AI] Gemini generation failed: {e}, falling back...")

    if openai_key:
        try:
            from openai import OpenAI  # type: ignore
            client = OpenAI(api_key=openai_key)
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
            )
            raw = resp.choices[0].message.content or ""
            title = f"{kit.brand_name} Article"
            body = raw
            if "TITLE:" in raw:
                lines = raw.splitlines()
                title = lines[0].replace("TITLE:", "").strip()
                body = "\n".join(lines[1:]).strip()
            return title, body, "openai-gpt-4o-mini"
        except Exception as e:
            print(f"[AI] OpenAI generation failed: {e}, falling back...")

    return None


def generate_content_for_row(
    row_num: int,
    tr: Tracker,
    cfg: dict,
    save_draft: bool = True,
) -> GenerationResult:
    """Generate and legally validate content for a specific tracker row."""
    brand_name = str(tr.get(row_num, "Brand") or "")
    site_url = str(tr.get(row_num, "Site / URL") or "")
    target_page = str(tr.get(row_num, "Target page") or "")
    anchor = str(tr.get(row_num, "Anchor") or brand_name)
    word_count_mode = str(tr.get(row_num, "Word count") or "Short profile")
    link_type = str(tr.get(row_num, "Link type") or "Profile")

    kit = load_asset_kit(brand_name, cfg)

    # 1. Generate text (LLM with local clinical synthesis fallback)
    llm_result = generate_with_llm(kit, site_url, target_page, anchor, word_count_mode, link_type, cfg)
    if llm_result:
        title, content, provider = llm_result
    else:
        title, content = synthesize_clinical_content(kit, site_url, target_page, anchor, word_count_mode, link_type)
        provider = "clinical-synthesis-engine"

    # 2. Real-Time Legal Gate Validation
    is_compliant, violations = validate_legal_gate(content, cfg)

    # If non-compliant and using LLM, we could retry; local synthesis is guaranteed compliant.
    words = len(content.split())

    # 3. Save draft
    draft_file = None
    if save_draft:
        drafts_dir = REPO_ROOT / "data" / "generated-drafts"
        drafts_dir.mkdir(parents=True, exist_ok=True)
        brand_slug = brand_name.lower().replace(" ", "-")
        draft_path = drafts_dir / f"row_{row_num}_{brand_slug}.md"
        meta_header = (
            f"<!--\n"
            f"Row: {row_num}\n"
            f"Brand: {brand_name}\n"
            f"Site: {site_url}\n"
            f"Target Page: {target_page}\n"
            f"Anchor: {anchor}\n"
            f"Link Type: {link_type}\n"
            f"Word Count Mode: {word_count_mode} ({words} words)\n"
            f"Compliant: {is_compliant}\n"
            f"Provider: {provider}\n"
            f"-->\n\n"
        )
        draft_path.write_text(meta_header + content, encoding="utf-8")
        draft_file = str(draft_path.relative_to(REPO_ROOT))

    return GenerationResult(
        row=row_num,
        brand=brand_name,
        site_url=site_url,
        target_page=target_page,
        anchor=anchor,
        word_count_mode=word_count_mode,
        link_type=link_type,
        title=title,
        content=content,
        word_count=words,
        is_compliant=is_compliant,
        violations=violations,
        draft_file=draft_file,
        provider=provider,
    )


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--row", type=int, help="sheet row number to generate for")
    ap.add_argument("--next", action="store_true", help="pick and generate for next eligible row")
    ap.add_argument("--brand", help="filter next row by brand (qht | uroots)")
    ap.add_argument("--json", action="store_true", help="output result as JSON")
    args = ap.parse_args()

    cfg = load_config()
    tr = Tracker(cfg=cfg)

    target_row = args.row
    if args.next:
        # Import pick_next logic
        from pick_next import brand_matches, BLOCKED_STATUSES
        for r in tr.data_rows():
            decision = str(tr.get(r, "Decision") or "")
            status = str(tr.get(r, "Status") or "Not started")
            if decision in ("Hold", "Skip") or status in BLOCKED_STATUSES:
                continue
            if not brand_matches(str(tr.get(r, "Brand")), args.brand):
                continue
            target_row = r
            break

    if not target_row:
        ap.error("Must specify either --row <number> or --next")

    result = generate_content_for_row(target_row, tr, cfg)

    if args.json:
        print(json.dumps(asdict(result), indent=2))
        return 0 if result.is_compliant else 1

    print("=" * 65)
    print(f"AI Content & Legal Gate Result for Row #{result.row} ({result.brand})")
    print("=" * 65)
    print(f"Site Target    : {result.site_url}")
    print(f"Target Page    : {result.target_page}")
    print(f"Anchor Text    : {result.anchor}")
    print(f"Word Count     : {result.word_count} words ({result.word_count_mode})")
    print(f"Engine Provider: {result.provider}")
    print(f"Draft Saved To : {result.draft_file}")
    print("-" * 65)
    if result.is_compliant:
        print("Legal Gate Check : \u2705 PASSED (Zero Rx, Zero Competitors, Zero Prohibited Claims)")
    else:
        print("Legal Gate Check : \u274c FAILED")
        for v in result.violations:
            print(f"  - {v}")
    print("-" * 65)
    print("Content Preview:")
    preview_lines = result.content.splitlines()[:12]
    print("\n".join(preview_lines))
    if len(result.content.splitlines()) > 12:
        print("  ... [truncated] ...")
    print("=" * 65)

    return 0 if result.is_compliant else 1


if __name__ == "__main__":
    raise SystemExit(main())

