#!/usr/bin/env python3
"""Linkbot Brand Experiences — the ONE shared logo system.

Direction A is the owner's chosen direction, so its mark geometry is carried over
UNCHANGED from `04-logo/A-notarial/` (octagon r=14.4, inscribed square 9→23, core
r=2.6, stroke 1.6). Nothing here redraws the mark. What this folder adds is what
the three experiences actually need and the Brand OS did not ship:

  * an explicit inverse (paper-on-ink) variant for the dark grounds the
    Developer and Employer experiences use;
  * a measured small-size refinement: at 16 px the inscribed square of the
    Direction A mark degrades to texture, so `mark-compact.svg` drops it and
    thickens the stroke instead of shipping an unreadable detail;
  * one set of lockups whose mark stroke is matched to the wordmark stroke
    after their scale factors, so no experience gets a hairline mark beside a
    heavy wordmark;
  * a clearspace diagram proving the minimum clearspace rule.

Every experience loads these same files. A logo variant per experience is
forbidden (GOVERNANCE §4 and the brand architecture).

The wordmark here is the INTERIM monoline concept from the Brand OS. It is
replaced by the type-derived outlined master in `15-typeface/wordmark/` once the
original typeface is built; `logo.md` records which one is current.

Stdlib only. Run: python3 scripts/gen_logo.py
"""
from __future__ import annotations

import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOGO = ROOT / "logo"
VERSION = "0.1.0"

INK = "#14161A"
PAPER = "#F4F1EA"

# ---------------------------------------------------------------------------
# Direction A mark geometry — unchanged
# ---------------------------------------------------------------------------


def octagon(cx: float, cy: float, r: float, phase: float = 22.5) -> str:
    pts = []
    for k in range(8):
        a = math.radians(phase + 45 * k)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in pts) + " Z"


def seal_body(stroke: float = 1.6, core: float = 2.6, inner_square: bool = True) -> str:
    parts = [
        f'  <g fill="none" stroke="currentColor" stroke-width="{stroke:g}" stroke-linejoin="miter">',
        f'    <path d="{octagon(16, 16, 14.4)}" />',
    ]
    if inner_square:
        parts.append('    <path d="M9 9 H23 V23 H9 Z" />')
    parts.append("  </g>")
    if core:
        parts.append(f'  <circle cx="16" cy="16" r="{core:g}" fill="currentColor" />')
    return "\n".join(parts)


# ---------------------------------------------------------------------------
# Interim monoline wordmark (concept; superseded by the type-derived master)
# ---------------------------------------------------------------------------

WM_STROKE = 7.0
WM_SPACING = 22.0
WM_LETTERS = {
    "L": ("M0 0 V100 H60", 72.0),
    "I": ("M0 0 V100", 10.0),
    "N": ("M0 100 V0 M0 0 L72 100 M72 100 V0", 84.0),
    "K": ("M0 0 V100 M0 54 L58 0 M0 54 L58 100", 70.0),
    "B": ("M0 0 V100 M0 0 H33 A25 25 0 0 1 33 50 H0 M0 50 H38 A25 25 0 0 1 38 100 H0", 78.0),
    "O": ("M0 50 a33 50 0 1 0 66 0 a33 50 0 1 0 -66 0", 78.0),
    "T": ("M0 0 H68 M34 0 V100", 76.0),
}


def wordmark(word: str = "LINKBOT") -> tuple[str, float, float, float, float]:
    x = 0.0
    parts: list[str] = []
    for ch in word:
        d, adv = WM_LETTERS[ch]
        parts.append(f'    <path transform="translate({x:.2f} 0)" d="{d}" />')
        x += adv + WM_SPACING
    width = x - WM_SPACING + WM_STROKE
    height = 100 + WM_STROKE
    pad = WM_STROKE / 2 + 2
    body = (
        f'  <g fill="none" stroke="currentColor" stroke-width="{WM_STROKE:g}" '
        'stroke-linecap="round" stroke-linejoin="round">\n'
        + "\n".join(parts)
        + "\n  </g>"
    )
    return body, width + pad * 2, height + pad * 2, pad, pad


# ---------------------------------------------------------------------------
# SVG assembly
# ---------------------------------------------------------------------------


def svg(w: float, h: float, body: str, label: str, title: str, note: str) -> str:
    return (
        f"<!-- {note} -->\n"
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" '
        f'width="{w:g}" height="{h:g}" role="img" aria-label="{label}">'
        f"<title>{title}</title>\n{body}\n</svg>\n"
    )


NOTE = (
    "Linkbot Brand Experiences v" + VERSION + " — shared logo asset. PROPOSED, NOT APPROVED. "
    "Direction A geometry, carried over unchanged. Editable vector source."
)


def write(rel: str, content: str, manifest: list, category: str, status: str) -> None:
    p = LOGO / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    manifest.append(
        {
            "path": f"logo/{rel}",
            "category": category,
            "status": status,
            "licence": "Original geometry authored in this repository; not a registered trademark",
            "bytes": len(content.encode("utf-8")),
        }
    )
    print(f"  wrote logo/{rel} ({len(content)} bytes)")


def ind(g: str, n: int = 2) -> str:
    return "\n".join((" " * n + ln) if ln.strip() else ln for ln in g.splitlines())


def main() -> int:
    LOGO.mkdir(parents=True, exist_ok=True)
    manifest: list[dict] = []

    # ---- mark family -------------------------------------------------------
    write("mark.svg", svg(32, 32, seal_body(), "Linkbot mark",
                          "Linkbot — mark", NOTE), manifest, "mark", "PROPOSED")
    write("mark-monochrome.svg", svg(32, 32, seal_body().replace("currentColor", INK),
                                     "Linkbot mark, monochrome", "Linkbot — mark, monochrome", NOTE),
          manifest, "mark", "PROPOSED")
    write("mark-inverse.svg", svg(32, 32, seal_body().replace("currentColor", PAPER),
                                  "Linkbot mark, inverse", "Linkbot — mark, inverse", NOTE),
          manifest, "mark", "PROPOSED")
    # measured small-size refinement: the inner square is dropped below 20px
    write("mark-compact.svg", svg(32, 32, seal_body(stroke=2.8, core=3.0, inner_square=False),
                                  "Linkbot mark, compact", "Linkbot — mark, compact (16-20px)",
                                  NOTE + " Compact variant: inner square dropped, stroke 2.8."),
          manifest, "mark", "PROPOSED")
    write("favicon.svg", svg(32, 32, seal_body(stroke=2.4, core=2.8, inner_square=False),
                             "Linkbot favicon", "Linkbot — favicon",
                             NOTE + " Favicon variant, optimised for 16-32px."),
          manifest, "favicon", "PROPOSED")

    # ---- plates ------------------------------------------------------------
    plate = (
        f'  <rect width="64" height="64" rx="14" fill="{INK}" />\n'
        '  <g transform="translate(16 16)" color="' + PAPER + '">\n'
        + ind(seal_body(), 4) + "\n  </g>"
    )
    write("app-icon.svg", svg(64, 64, plate, "Linkbot app icon", "Linkbot — app icon", NOTE),
          manifest, "app-icon", "PROPOSED")
    plate_inv = plate.replace(f'rx="14" fill="{INK}"', f'rx="14" fill="{PAPER}"').replace(
        f'color="{PAPER}"', f'color="{INK}"')
    write("app-icon-inverse.svg", svg(64, 64, plate_inv, "Linkbot app icon, inverse",
                                      "Linkbot — app icon, inverse", NOTE),
          manifest, "app-icon", "PROPOSED")
    avatar = (
        f'  <rect width="512" height="512" rx="112" fill="{INK}" />\n'
        '  <g transform="translate(192 192) scale(4)" color="' + PAPER + '">\n'
        + ind(seal_body(), 4) + "\n  </g>"
    )
    write("social-avatar.svg", svg(512, 512, avatar, "Linkbot social avatar",
                                   "Linkbot — social avatar", NOTE), manifest, "social", "PROPOSED")

    # ---- wordmark (interim) and lockups ------------------------------------
    wm_body, wm_w, wm_h, px, py = wordmark()
    wm = f'  <g transform="translate({px:.2f} {py:.2f})">\n{ind(wm_body)}\n  </g>'
    write("wordmark.svg", svg(wm_w, wm_h, wm, "Linkbot wordmark", "Linkbot — wordmark",
                              NOTE + " INTERIM monoline concept; the type-derived master is "
                              "in 15-typeface/wordmark/."),
          manifest, "wordmark", "PROPOSED (interim)")

    ws = 0.22
    cap = 100 * ws
    ms = cap / 28.8
    box = 32 * ms
    gap = round(cap * 0.5, 2)
    mark_stroke = round(WM_STROKE * ws / ms, 3)
    m_body = seal_body(stroke=mark_stroke)

    def mark_g(x: float, y: float) -> str:
        return (f'  <g transform="translate({x:.2f} {y:.2f}) scale({ms:.4f})">\n'
                + ind(m_body) + "\n  </g>")

    def wm_g(x: float, y: float) -> str:
        return (f'  <g transform="translate({x:.2f} {y:.2f}) scale({ws})">\n'
                + ind(wm_body) + "\n  </g>")

    stack_w = round(max(wm_w * ws, box), 2)
    stack_h = round(box + gap + wm_h * ws, 2)
    write("lockup-stacked.svg",
          svg(stack_w, stack_h, mark_g((stack_w - box) / 2, 0) + "\n" + wm_g((stack_w - wm_w * ws) / 2, box + gap),
              "Linkbot stacked lockup", "Linkbot — stacked lockup", NOTE),
          manifest, "lockup", "PROPOSED")

    hor_w = round(box + gap + wm_w * ws, 2)
    hor_h = round(max(box, wm_h * ws), 2)
    write("lockup-horizontal.svg",
          svg(hor_w, hor_h, mark_g(0, (hor_h - box) / 2) + "\n" + wm_g(box + gap, (hor_h - wm_h * ws) / 2),
              "Linkbot horizontal lockup", "Linkbot — horizontal lockup", NOTE),
          manifest, "lockup", "PROPOSED")

    # ---- clearspace diagram ------------------------------------------------
    cs = 32
    clear = 14.4
    total = cs + 2 * clear
    diag = (
        f'  <rect x="0" y="0" width="{total:g}" height="{total:g}" fill="{PAPER}" />\n'
        f'  <rect x="{clear:g}" y="{clear:g}" width="{cs:g}" height="{cs:g}" '
        f'fill="none" stroke="#ABABA1" stroke-width="0.4" stroke-dasharray="2 2" />\n'
        f'  <g transform="translate({clear:g} {clear:g})" color="{INK}">\n'
        + ind(seal_body(), 4) + "\n  </g>\n"
        f'  <g stroke="{INK}" stroke-width="0.4" marker-start="url(#d1)" marker-end="url(#d1)">\n'
        f'    <path d="M{clear:g} {clear + cs / 2:g} H0" />\n'
        f'  </g>\n'
        f'  <defs>\n    <marker id="d1" viewBox="0 0 10 10" refX="5" refY="5" '
        f'markerWidth="4" markerHeight="4" orient="auto-start-reverse">\n'
        f'      <path d="M0 5 L10 5" stroke="{INK}" stroke-width="1" />\n    </marker>\n  </defs>\n'
        f'  <text x="{clear:g}" y="{total - 3:g}" font-family="ui-monospace, monospace" '
        f'font-size="4" fill="{INK}">clearspace = 0.5 x mark optical diameter</text>'
    )
    write("clearspace.svg", svg(total, total, diag, "Linkbot clearspace diagram",
                                "Linkbot — clearspace", NOTE),
          manifest, "construction", "PROPOSED")

    # ---- construction guide ------------------------------------------------
    grid = (
        '  <g stroke="#ABABA1" stroke-width="0.25" opacity="0.7">\n'
        '    <path d="M0 8 H32 M0 16 H32 M0 24 H32 M8 0 V32 M16 0 V32 M24 0 V32" />\n'
        "  </g>\n" + seal_body()
    )
    write("construction.svg", svg(32, 32, grid, "Linkbot mark construction",
                                  "Linkbot — construction", NOTE),
          manifest, "construction", "PROPOSED")

    # ---- misuse sheet ------------------------------------------------------
    good = (f'<g color="{INK}">' + seal_body() + "</g>")
    misuse = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 400" width="720" height="400" '
        'role="img" aria-label="Logo misuse examples"><title>Linkbot logo misuse sheet</title>\n'
        '  <rect width="720" height="400" fill="#F4F1EA" />\n'
        '  <g font-family="ui-monospace, monospace" font-size="11" letter-spacing="1.2">\n'
        '    <text x="40" y="40" fill="#1D5B45">CORRECT</text>\n'
        f'    <g transform="translate(40 60) scale(0.9)">{good}</g>\n'
        '    <text x="40" y="150" fill="#565C63">Fixed lockup, surface colour, nothing added.</text>\n'
        '    <text x="380" y="40" fill="#8E2F2F">STRETCH</text>\n'
        f'    <g transform="translate(380 60) scale(1.7 0.7)">{good}</g>\n'
        '    <text x="40" y="230" fill="#8E2F2F">RECOLOUR</text>\n'
        f'    <g transform="translate(40 250) scale(0.9)" color="#B4004E">{good}</g>\n'
        '    <text x="380" y="230" fill="#8E2F2F">EFFECTS</text>\n'
        f'    <g transform="translate(380 250) scale(0.9)" filter="url(#sh)">{good}</g>\n'
        '    <defs><filter id="sh"><feDropShadow dx="2" dy="3" stdDeviation="2" flood-opacity="0.6" />'
        "</filter></defs>\n"
        '    <text x="40" y="372" fill="#565C63">Also prohibited: rotating, outlining, placing on busy\n'
        "      imagery, redrawing the mark, cropping clearspace, per-experience variants.</text>\n"
        "  </g>\n</svg>\n"
    )
    write("misuse.svg", misuse, manifest, "misuse", "PROPOSED")

    (LOGO / "logo-manifest.json").write_text(
        json.dumps(
            {
                "$description": (
                    f"Linkbot Brand Experiences {VERSION} — shared logo assets. PROPOSED, NOT APPROVED. "
                    "One set of files for all three experiences; per-experience logo variants are forbidden."
                ),
                "direction": "A — Notarial (mark geometry carried over unchanged from 04-logo/A-notarial/)",
                "wordmark": "interim monoline concept; type-derived master in 15-typeface/wordmark/",
                "files": manifest,
            },
            indent=2,
        ) + "\n",
        encoding="utf-8",
    )
    print(f"  wrote logo/logo-manifest.json ({len(manifest)} files)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
