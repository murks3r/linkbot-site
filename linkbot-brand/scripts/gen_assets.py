#!/usr/bin/env python3
"""Linkbot Brand OS — iconography, abstract imagery fields, OG templates.

Every icon is a real editable SVG on a 24x24 grid, colour inherited via
currentColor, no raster, no external reference, no embedded script.

Run: python3 scripts/gen_assets.py
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gen_logos import STYLES, wordmark  # noqa: E402  (sibling generator, same package)

ROOT = Path(__file__).resolve().parent.parent
ICON_DIR = ROOT / "08-iconography" / "icons"
IMAGERY = ROOT / "07-imagery"
TPL = ROOT / "11-templates"
VERSION = (ROOT / "VERSION").read_text(encoding="utf-8").strip()

# ----------------------------------------------------------------------------
# Icon set — semantic vocabulary of the product truths, not decoration.
# name -> (extra attrs for the group, inner markup, human title)
# ----------------------------------------------------------------------------

DASH = ' stroke-dasharray="2.5 2.5"'

ICONS: dict[str, tuple[str, str, str]] = {
    "claim-statement": (
        "",
        '<path d="M4 5 H20 V19 H4 Z" /><path d="M7.5 9.5 H16.5" /><path d="M7.5 13.5 H12.5" />',
        "A typed statement held by the subject",
    ),
    "evidence-source": (
        "",
        '<path d="M4 4.5 H13 L18.5 10 V19.5 H4 Z" /><path d="M13 4.5 V10 H18.5" />'
        '<path d="M7.5 14 H15" /><path d="M7.5 17 H11.5" />',
        "Provenance of a statement",
    ),
    "confirmed": (
        "",
        '<path d="M4 4 H20 V20 H4 Z" /><path d="M8 12.2 L11 15.2 L16 9.2" />',
        "Explicitly confirmed by the holder",
    ),
    "proposed": (
        DASH,
        '<path d="M4 4 H20 V20 H4 Z" /><circle cx="12" cy="12" r="2.6" />',
        "Proposed, not confirmed",
    ),
    "unresolved-unknown": (
        "",
        '<path d="M12 4 A8 8 0 1 1 5.4 9.5" />'
        '<path d="M12 4 A8 8 0 0 0 5.4 9.5"' + DASH + " />"
        '<circle cx="12" cy="12" r="2.4" />',
        "UNKNOWN — never rendered as satisfied",
    ),
    "authority-grant": (
        "",
        '<path d="M9 3.5 V20.5" /><path d="M3 12 H15" /><path d="M15 12 L11.8 8.8" />'
        '<path d="M15 12 L11.8 15.2" />',
        "Disclosure authority proceeds across a boundary",
    ),
    "authority-revoke": (
        "",
        '<path d="M9 3.5 V20.5" /><path d="M3 12 H13.5" /><path d="M13.5 7.5 V16.5" />',
        "Future access stops; nothing claimed erased",
    ),
    "receipt": (
        "",
        '<path d="M6 3 H18 V21 L15.8 19 L13.6 21 L11.4 19 L9.2 21 L7 19 L6 20.4 Z" />'
        '<path d="M9 10.5 L11 12.5 L15 7.8" />',
        "Immutable availability receipt",
    ),
    "disclosure": (
        "",
        '<path d="M4 4 H15 V20 H4 Z" /><path d="M12 12 H21" />'
        '<path d="M21 12 L17.8 8.8" /><path d="M21 12 L17.8 15.2" />',
        "One bounded disclosure leaving the private store",
    ),
    "intent-direction": (
        "",
        '<path d="M3.5 20 C8 20 7.5 8 12 8 S20 8 20.5 4" />'
        '<circle cx="12" cy="8" r="1.8" fill="currentColor" stroke="none" />',
        "Declared direction, versioned and owned",
    ),
    "opportunity": (
        "",
        '<circle cx="6" cy="12" r="2.6" fill="currentColor" stroke="none" />'
        '<path d="M10 12 H14" stroke-dasharray="2 2" /><circle cx="18.5" cy="12" r="3" />',
        "Opportunity — unilateral, not a Match",
    ),
    "match-bilateral": (
        "",
        '<circle cx="5.5" cy="12" r="2.4" fill="currentColor" stroke="none" />'
        '<circle cx="18.5" cy="12" r="2.4" fill="currentColor" stroke="none" />'
        '<path d="M8.5 12 H15.5" /><path d="M10.5 9.8 L8.3 12 L10.5 14.2" />'
        '<path d="M13.5 9.8 L15.7 12 L13.5 14.2" />',
        "Bilateral Match — both sides confirmed",
    ),
    "employer-party": (
        "",
        '<path d="M3 5 H21 V19 H3 Z" /><circle cx="9" cy="12" r="2" />'
        '<circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />',
        "Counterparty organisation",
    ),
    "agency-mandate": (
        "",
        '<path d="M5.5 4 V20" /><path d="M5.5 7 H15" /><path d="M5.5 12 H15" />'
        '<path d="M5.5 17 H15" /><circle cx="18" cy="7" r="2" /><circle cx="18" cy="12" r="2" />'
        '<circle cx="18" cy="17" r="2" fill="currentColor" stroke="none" />',
        "One mandate, several bounded introductions",
    ),
    "expiry": (
        "",
        '<circle cx="12" cy="12" r="8" /><path d="M12 7 V12 L15.2 14" />',
        "Expiry and review-due bounds",
    ),
    "version": (
        "",
        '<path d="M12 3 L20.5 7.6 L12 12.2 L3.5 7.6 Z" /><path d="M3.5 12 L12 16.6 L20.5 12" />'
        '<path d="M3.5 16.4 L12 21 L20.5 16.4" />',
        "Versioned authority, never silently replaced",
    ),
    "audit-history": (
        "",
        '<path d="M6 6.5 H20" /><path d="M6 12 H20" /><path d="M6 17.5 H20" />'
        '<circle cx="3.6" cy="6.5" r="1.2" fill="currentColor" stroke="none" />'
        '<circle cx="3.6" cy="12" r="1.2" fill="currentColor" stroke="none" />'
        '<circle cx="3.6" cy="17.5" r="1.2" fill="currentColor" stroke="none" />',
        "Who saw what, as recorded",
    ),
    "private-store": (
        "",
        '<path d="M4 4.5 H20 V19.5 H4 Z" /><circle cx="12" cy="12" r="2.6" />'
        '<path d="M12 4.5 V9.4" /><path d="M12 14.6 V19.5" />',
        "Holder-owned private state",
    ),
    "external-source": (
        "",
        '<path d="M4 5 H12 V19.5 H4 Z" /><path d="M15 12 H21.5" />'
        '<path d="M21.5 12 L18.3 8.8" /><path d="M21.5 12 L18.3 15.2" />',
        "External listing stays at its source",
    ),
    "attention": (
        "",
        '<path d="M12 6.5 L17.5 12 L12 17.5 L6.5 12 Z" />'
        '<path d="M12 1.5 V3.5" /><path d="M12 20.5 V22.5" /><path d="M1.5 12 H3.5" />'
        '<path d="M20.5 12 H22.5" />',
        "Requires the holder's attention now",
    ),
}


def gen_icons() -> None:
    print("icons")
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    for name, (extra, inner, title) in ICONS.items():
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" '
            f'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" '
            f'stroke-linejoin="round" role="img" aria-label="{title}">'
            f"<title>{title}</title>"
            f'<!-- Linkbot Brand OS v{VERSION} — iconography. Colour inherited. -->'
            f"<g{extra}>{inner}</g></svg>\n"
        )
        (ICON_DIR / f"{name}.svg").write_text(svg, encoding="utf-8")
    print(f"  wrote {len(ICONS)} icons")  # noqa


# ----------------------------------------------------------------------------
# Abstract imagery fields (generative, non-photographic, honest)
# ----------------------------------------------------------------------------

FIELDS = {
    "A-notarial": (
        "ledger",
        "Ruled ledger field: records in order, no imagery of people as data.",
        "#1D5B45",
        lambda: (
            "".join(
                f'<path d="M40 {48 + i * 32} H1160" stroke-width="1" opacity="{0.5 - i * 0.03:.2f}"/>'
                for i in range(11)
            )
            + "".join(
                f'<path d="M120 {32 + i * 32} V368" stroke-width="1" opacity="0.12"/>' for i in range(6)
            )
            + '<rect x="120" y="144" width="320" height="64" rx="2" fill="currentColor" opacity="0.06"/>'
            + '<circle cx="1040" cy="176" r="9" fill="currentColor" opacity="0.9"/>'
        ),
    ),
    "B-protocol": (
        "lattice",
        "Point lattice with bounded edges: computed, partial, explicitly incomplete.",
        "#3BE08C",
        lambda: (
            "".join(
                f'<circle cx="{80 + (i % 14) * 80}" cy="{60 + (i // 14) * 60}" r="2" opacity="0.55"/>'
                for i in range(42)
            )
            + '<path d="M400 180 L560 120 L720 180 L720 300 L560 360" stroke-width="2" opacity="0.9"/>'
            + '<path d="M400 180 L560 300 L720 300" stroke-width="2" opacity="0.5" '
            'stroke-dasharray="6 6"/>'
            + '<circle cx="560" cy="120" r="6" fill="currentColor" opacity="0.95"/>'
            + '<circle cx="720" cy="300" r="6" fill="currentColor" opacity="0.35"/>'
        ),
    ),
    "C-commons": (
        "threshold",
        "Vertical rules with one open gate: the boundary is visible and passable.",
        "#245C73",
        lambda: (
            "".join(
                f'<path d="M{120 + i * 96} 40 V360" stroke-width="1" opacity="0.28"/>' for i in range(11)
            )
            + '<g opacity="0.9"><path d="M600 40 V160" stroke-width="2"/>'
            '<path d="M600 240 V360" stroke-width="2"/><path d="M470 200 H730" stroke-width="2"/></g>'
            + '<circle cx="470" cy="200" r="10" fill="none" stroke-width="2"/>'
            + '<circle cx="730" cy="200" r="10" fill="currentColor"/>'
        ),
    ),
}


def gen_fields() -> None:
    print("imagery fields")
    IMAGERY.mkdir(parents=True, exist_ok=True)
    for direction, (slug, desc, accent, body) in FIELDS.items():
        svg = (
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400" '
            'preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" role="img" '
            f'aria-label="{desc}">'
            f"<title>{desc}</title>"
            f"<!-- Linkbot Brand OS v{VERSION} — abstract field, generated. Not photography. -->"
            f'<g fill="none" stroke="currentColor">{body()}</g></svg>\n'
        )
        (IMAGERY / f"field-{direction}.svg").write_text(svg, encoding="utf-8")
        (IMAGERY / f"field-{direction}.md").write_text(
            f"# Abstract field — {direction}\n\n"
            f"- **Slug:** `{slug}`\n- **Accent used in the sample render:** `{accent}` (the SVG itself "
            "inherits colour via `currentColor`).\n"
            f"- **Intent:** {desc}\n"
            "- **Provenance:** generated geometry from `scripts/gen_assets.py`. Not a photograph, not a "
            "stock image, no recognisable person, no fabricated dashboard.\n"
            "- **Licence:** the generated file is original work owned by Linkbot OÜ; no third-party "
            "rights attach.\n",
            encoding="utf-8",
        )
    print(f"  wrote {len(FIELDS)} fields")


# ----------------------------------------------------------------------------
# OG / social templates
# ----------------------------------------------------------------------------

OG = {
    "A-notarial": ("#F4F1EA", "#14161A", "#1D5B45", "Private eligibility, not public exposure.",
                   "LINKBOT — THE RECORD YOU HOLD"),
    "B-protocol": ("#06080B", "#D6E0E6", "#3BE08C", "Unknown stays unknown until you confirm it.",
                   "LINKBOT — PERMISSIONED BY CONSTRUCTION"),
    "C-commons": ("#F6F8F9", "#172125", "#245C73", "Not every employer should see you.",
                  "LINKBOT — ASK FIRST, THEN DISCLOSE"),
}


def gen_og() -> None:
    print("og templates")
    TPL.mkdir(parents=True, exist_ok=True)
    for direction, (bg, fg, accent, headline, kicker) in OG.items():
        wm_body, wm_w, wm_h, px, py = wordmark(direction)
        ws = 0.52
        wm = (
            f'<g transform="translate(80 62) scale({ws})" fill="none" stroke="{fg}" '
            f'stroke-width="{STYLES[direction]["stroke"]}" '
            f'stroke-linecap="{STYLES[direction]["cap"]}" stroke-linejoin="{STYLES[direction]["join"]}">'
            + "".join(
                ln.strip()
                for ln in wm_body.splitlines()
                if "<path" in ln
            )
            + "</g>"
        )
        parts = headline.split(" ")
        half = max(1, len(parts) // 2)
        line1 = " ".join(parts[:half])
        line2 = " ".join(parts[half:])
        svg = (
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" '
            f'role="img" aria-label="{headline}">'
            f"<title>{headline}</title>"
            f'<!-- Linkbot Brand OS v{VERSION} — Open Graph template, {direction}. Concept, not approved. -->'
            f'<rect width="1200" height="630" fill="{bg}"/>'
            f"{wm}"
            f'<g transform="translate(80 300)">'
            f'<text x="0" y="0" font-family="Georgia, \'Times New Roman\', serif" font-size="62" '
            f'font-weight="400" fill="{fg}" letter-spacing="-1.5">{line1}</text>'
            f'<text x="0" y="78" font-family="Georgia, \'Times New Roman\', serif" font-size="62" '
            f'font-weight="400" fill="{accent}" letter-spacing="-1.5">{line2}</text>'
            f"</g>"
            f'<g transform="translate(80 545)">'
            f'<text x="0" y="0" font-family="Helvetica, Arial, sans-serif" font-size="18" '
            f'fill="{fg}" opacity="0.65" letter-spacing="4">{kicker}</text>'
            f"</g>"
            f'<path d="M80 500 H1120" stroke="{fg}" stroke-width="1" opacity="0.22"/>'
            f"</svg>\n"
        )
        (TPL / f"og-{direction}.svg").write_text(svg, encoding="utf-8")
    print(f"  wrote {len(OG)} OG templates")


if __name__ == "__main__":
    gen_icons()
    gen_fields()
    gen_og()
    print("done")
