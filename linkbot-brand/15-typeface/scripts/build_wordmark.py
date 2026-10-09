#!/usr/bin/env python3
"""Linkbot Type — the wordmark, outlined from the typeface.

This is the step the Brand OS could not take: its wordmark was monoline geometry
because no typeface existed to outline from. Linkbot Display does now, and the
project owns it, so a wordmark derived from it is a legitimate master rather than
a concept.

What is emitted, into 15-typeface/wordmark/:
  wordmark-lower.svg   "Linkbot"  — the brand wordmark, mixed case
  wordmark-caps.svg    "LINKBOT"  — the all-caps form for small and formal use
  lockup-horizontal.svg / lockup-stacked.svg  — the mark with the wordmark, mark
                          stroke matched to the wordmark's stem
  wordmark-inverse.svg  the lowercase wordmark in the inverse colour
  wordmark-construction.svg  cap-height and tracking guides, for review only

Glyphs are converted to SVG paths with fontTools; the letters are NOT live text,
so the wordmark cannot break when a webfont fails. Kerning is taken from the UFO's
kerning.plist, i.e. the same data the compiled GPOS carries.

Run: <venv>/bin/python scripts/build_wordmark.py
"""
from __future__ import annotations

import sys
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from ufoLib2 import Font as UfoFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "wordmark"
TTF = ROOT / "fonts" / "ttf" / "LinkbotDisplay-Bold.ttf"
UFO = ROOT / "sources" / "ufo" / "LinkbotDisplay-Bold.ufo"
VERSION = "0.2.0"
NOTE = (f"Linkbot Type {VERSION} — wordmark outlined from Linkbot Display Bold. "
        "PROPOSED, NOT APPROVED. Original work; not a registered trademark.")

INK = "#14161A"
PAPER = "#F4F1EA"


def octagon(cx: float, cy: float, r: float, phase: float = 22.5) -> str:
    import math

    pts = []
    for k in range(8):
        a = math.radians(phase + 45 * k)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in pts) + " Z"


def word_paths(word: str, tracking: float = 0.0) -> tuple[str, float, float, float]:
    """Return (path data, total advance, ascender, descender)."""
    font = TTFont(TTF)
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    ufo = UfoFont.open(UFO)
    kern = ufo.kerning

    hhea = font["hhea"]
    asc, desc = hhea.ascender, hhea.descender

    parts: list[str] = []
    x = 0.0
    prev = None
    for ch in word:
        gname = cmap[ord(ch)]
        if prev is not None:
            x += kern.get((prev, gname), 0.0) + tracking
        pen = SVGPathPen(gs)
        gs[gname].draw(pen)
        d = pen.getCommands()
        if d:
            parts.append(f'  <path transform="translate({x:.2f} 0)" d="{d}" />')
        x += font["hmtx"][gname][0]
        prev = gname
    return "\n".join(parts), x, asc, desc


def svg(w: float, h: float, body: str, label: str, extra: str = "") -> str:
    return (f"<!-- {NOTE} -->\n"
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" '
            f'width="{w:.2f}" height="{h:.2f}" role="img" aria-label="{label}">'
            f"<title>{label}</title>\n{body}\n</svg>\n{extra}")


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"  wrote wordmark/{path.name} ({len(content)} bytes)")


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)

    # ---- the two wordmark forms
    for fname, word, track in (("wordmark-lower.svg", "Linkbot", -4.0),
                               ("wordmark-caps.svg", "LINKBOT", 10.0)):
        d, w, asc, desc = word_paths(word, track)
        h = asc - desc
        body = (f'  <g fill="currentColor" transform="translate(0 {asc}) scale(1 -1)">\n'
                f"{d}\n  </g>")
        write(OUT / fname, svg(w, h, body, f"Linkbot wordmark ({word})"))

    # ---- inverse
    d, w, asc, desc = word_paths("Linkbot", -4.0)
    h = asc - desc
    body = (f'  <g fill="{PAPER}" transform="translate(0 {asc}) scale(1 -1)">\n{d}\n  </g>')
    write(OUT / "wordmark-inverse.svg",
          svg(w, h, body, "Linkbot wordmark, inverse").replace('fill="currentColor"', f'fill="{PAPER}"'))

    # ---- lockups: the mark is scaled to the wordmark's cap height and its stroke
    #      is matched to the wordmark's stem after both scale factors
    cap = 700.0                    # Linkbot Display cap height, font units
    target_cap = 100.0             # the lockup's own unit
    s = target_cap / cap           # wordmark scale
    d, w, asc, desc = word_paths("Linkbot", -4.0)
    wm_w = w * s
    wm_h = (asc - desc) * s
    baseline_off = desc * s        # distance from the top of the em to the baseline
    mark_units = 32.0
    mark_scale = target_cap / 28.8 * 1.0     # mark optical diameter (r=14.4) -> cap
    box = mark_units * mark_scale
    gap = target_cap * 0.46
    # Linkbot Display Bold's stem is 150 units; after the wordmark scale it is
    # 150*s in lockup units, so that is the mark's required final stroke.
    mark_stroke = round(150.0 * s / mark_scale, 3)

    mark_body = (
        f'    <g fill="none" stroke="currentColor" stroke-width="{mark_stroke:g}" '
        'stroke-linejoin="miter">\n'
        f'      <path d="{octagon(16, 16, 14.4)}" />\n'
        '      <path d="M9 9 H23 V23 H9 Z" />\n'
        "    </g>\n"
        '    <circle cx="16" cy="16" r="2.6" fill="currentColor" />'
    )

    def mark_g(x: float, y: float) -> str:
        return (f'  <g transform="translate({x:.2f} {y:.2f}) scale({mark_scale:.4f})">\n'
                f"{mark_body}\n  </g>")

    def wm_g(x: float, y: float) -> str:
        return (f'  <g transform="translate({x:.2f} {y:.2f}) scale({s:.6f})">\n'
                f'    <g fill="currentColor" transform="translate(0 {asc}) scale(1 -1)">\n{d}\n'
                "    </g>\n  </g>")

    hor_w = box + gap + wm_w
    hor_h = max(box, wm_h)
    hor = mark_g(0.0, (hor_h - box) / 2.0) + "\n" + wm_g(box + gap, (hor_h - wm_h) / 2.0)
    write(OUT / "lockup-horizontal.svg",
          svg(hor_w, hor_h, hor, "Linkbot horizontal lockup"))

    stack_w = max(box, wm_w)
    stack_h = box + gap * 0.8 + wm_h
    stack = (mark_g((stack_w - box) / 2.0, 0.0) + "\n"
             + wm_g((stack_w - wm_w) / 2.0, box + gap * 0.8))
    write(OUT / "lockup-stacked.svg", svg(stack_w, stack_h, stack, "Linkbot stacked lockup"))

    # ---- construction guide: cap height, baseline, tracking centres
    guides = []
    for i in range(0, 11):
        x = wm_w * i / 10.0
        guides.append(f'    <path d="M{x:.2f} 0 V{wm_h:.2f}" stroke="#ABABA1" stroke-width="0.25" />')
    guide_body = (
        '  <g stroke="#ABABA1" stroke-width="0.25">\n'
        f'    <path d="M0 {-baseline_off:.2f} H{wm_w:.2f}" />\n'
        "  </g>\n"
        '  <g opacity="0.7">\n' + "\n".join(guides) + "\n  </g>\n"
        + wm_g(0.0, 0.0)
    )
    write(OUT / "wordmark-construction.svg",
          svg(wm_w, wm_h, guide_body, "Linkbot wordmark construction"))

    print(f"  cap scale {s:.6f}, mark scale {mark_scale:.4f}, matched mark stroke {mark_stroke}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
