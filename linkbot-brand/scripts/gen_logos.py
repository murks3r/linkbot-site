#!/usr/bin/env python3
"""Linkbot Brand OS — editable vector masters generator (no runtime deps).

Emits real, editable SVG sources (marks, monoline wordmarks, lockups, favicons,
app icons, social avatars) for the three candidate directions plus construction
guides for the PROPOSED direction.

Run:  python3 scripts/gen_logos.py
Idempotent: rewrites every file it owns.
"""
from __future__ import annotations

import math
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOGO = ROOT / "04-logo"

# ----------------------------------------------------------------------------
# Mark geometry (32x32 artboard, stroke centred, currentColor)
# ----------------------------------------------------------------------------


def octagon(cx: float, cy: float, r: float, phase: float = 22.5) -> str:
    pts = []
    for k in range(8):
        a = math.radians(phase + 45 * k)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in pts) + " Z"


def arc(cx: float, cy: float, r: float, a0: float, a1: float) -> str:
    """Open arc from a0 to a1 degrees (0 = +x, clockwise in SVG y-down)."""
    x0 = cx + r * math.cos(math.radians(a0))
    y0 = cy + r * math.sin(math.radians(a0))
    x1 = cx + r * math.cos(math.radians(a1))
    y1 = cy + r * math.sin(math.radians(a1))
    delta = (a1 - a0) % 360
    large = 1 if delta > 180 else 0
    return f"M{x0:.2f} {y0:.2f} A{r:.2f} {r:.2f} 0 {large} 1 {x1:.2f} {y1:.2f}"


def mark_a(stroke: float = 1.6) -> str:
    """A — Notarial: impressed seal. Octagon frame + inscribed square + core."""
    return (
        f'  <g fill="none" stroke="currentColor" stroke-width="{stroke}" '
        'stroke-linejoin="miter">\n'
        f'    <path d="{octagon(16, 16, 14.4)}" />\n'
        '    <path d="M9 9 H23 V23 H9 Z" />\n'
        "  </g>\n"
        '  <circle cx="16" cy="16" r="2.6" fill="currentColor" />'
    )


def mark_b(stroke: float = 1.6) -> str:
    """B — Protocol: aperture in an open boundary. Bounded, gapped, centred."""
    return (
        f'  <g fill="none" stroke="currentColor" stroke-width="{stroke}" '
        'stroke-linecap="round">\n'
        '    <path d="M27.5 11 V27.5 H4.5 V4.5 H21" />\n'
        f'    <path d="{arc(16, 16, 10.5, 205, 520)}" />\n'
        f'    <path d="{arc(16, 16, 6, 205, 520)}" />\n'
        "  </g>\n"
        '  <circle cx="16" cy="16" r="1.8" fill="currentColor" />'
    )


def mark_c(stroke: float = 1.6) -> str:
    """C — Commons: a permissioned link crossing a boundary gate."""
    return (
        f'  <g fill="none" stroke="currentColor" stroke-width="{stroke}" '
        'stroke-linecap="round">\n'
        '    <path d="M16 4 V11 M16 21 V28" />\n'
        '    <path d="M5 16 H27" />\n'
        "  </g>\n"
        '  <circle cx="5" cy="16" r="2.4" fill="none" stroke="currentColor" '
        f'stroke-width="{stroke}" />\n'
        '  <circle cx="27" cy="16" r="2.4" fill="currentColor" />'
    )


MARKS = {"A-notarial": mark_a, "B-protocol": mark_b, "C-commons": mark_c}

# ----------------------------------------------------------------------------
# Monoline geometric wordmark ("LINKBOT"), cap height 100, font-independent
# ----------------------------------------------------------------------------

# letter -> (path d, advance)
STRAIGHT = {
    "L": ("M0 0 V100 H60", 72.0),
    "I": ("M0 0 V100", 10.0),
    "N": ("M0 100 V0 M0 0 L72 100 M72 100 V0", 84.0),
    "T": ("M0 0 H68 M34 0 V100", 76.0),
}
K_TIGHT = ("M0 0 V100 M0 54 L58 0 M0 54 L58 100", 70.0)
K_OPEN = ("M0 0 V100 M7 52 L60 0 M7 52 L60 100", 72.0)
B_BOWL = (
    "M0 0 V100 M0 0 H33 A25 25 0 0 1 33 50 H0 M0 50 H38 A25 25 0 0 1 38 100 H0",
    78.0,
)
O_ROUND = ("M0 50 a33 50 0 1 0 66 0 a33 50 0 1 0 -66 0", 78.0)
O_SQUARE = (
    "M0 30 A30 30 0 0 1 30 0 H36 A30 30 0 0 1 66 30 V70 "
    "A30 30 0 0 1 36 100 H30 A30 30 0 0 1 0 70 Z",
    78.0,
)

STYLES = {
    "A-notarial": dict(
        stroke=7.0, cap="round", join="round", spacing=22.0, o=O_ROUND, k=K_TIGHT, node=False
    ),
    "B-protocol": dict(
        stroke=11.0, cap="square", join="miter", spacing=8.0, o=O_SQUARE, k=K_TIGHT, node=True
    ),
    "C-commons": dict(
        stroke=14.0, cap="round", join="round", spacing=12.0, o=O_ROUND, k=K_OPEN, node=False
    ),
}


def wordmark(direction: str, word: str = "LINKBOT"):
    s = STYLES[direction]
    letters = dict(STRAIGHT)
    letters["K"] = s["k"]
    letters["B"] = B_BOWL
    letters["O"] = s["o"]

    x = 0.0
    parts: list[str] = []
    nodes: list[tuple[float, float]] = []
    for ch in word:
        d, adv = letters[ch]
        parts.append(f'    <path transform="translate({x:.2f} 0)" d="{d}" />')
        if s["node"] and ch == "K":
            nodes.append((x, 54.0))
        x += adv + s["spacing"]
    width = x - s["spacing"] + s["stroke"] + s["spacing"]
    height = 100 + s["stroke"]
    pad = s["stroke"] / 2 + 2

    node_svg = "".join(
        f'\n    <circle cx="{nx:.2f}" cy="{ny}" r="{s["stroke"] * 0.85:.2f}" fill="currentColor" />'
        for nx, ny in nodes
    )
    body = (
        f'  <g fill="none" stroke="currentColor" stroke-width="{s["stroke"]}" '
        f'stroke-linecap="{s["cap"]}" stroke-linejoin="{s["join"]}">\n'
        + "\n".join(parts)
        + "\n  </g>"
        + node_svg
    )
    return body, width + pad * 2, height + pad * 2, pad, pad


# ----------------------------------------------------------------------------
# SVG writers
# ----------------------------------------------------------------------------

HEADER = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
    'width="{w}" height="{h}" role="img" aria-label="{label}">{title}'
)
NOTE = "<!-- Linkbot Brand OS {v} — editable vector source. Colour is inherited (currentColor). -->\n"


def wrap(w: float, h: float, body: str, label: str, title: str, note: bool = True) -> str:
    head = NOTE if note else ""
    head += HEADER.format(w=f"{w:g}", h=f"{h:g}", label=label, title=title)
    return head + "\n" + body + "\n</svg>\n"


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"  wrote {path.relative_to(ROOT)}  ({len(content)} bytes)")


VERSION = (ROOT / "VERSION").read_text(encoding="utf-8").strip() if (ROOT / "VERSION").exists() else "0.1.0"
NOTE = NOTE.replace("{v}", f"v{VERSION}")

TITLES = {
    "A-notarial": "<title>Linkbot — Notarial mark</title>",
    "B-protocol": "<title>Linkbot — Protocol mark</title>",
    "C-commons": "<title>Linkbot — Commons mark</title>",
}

def gen_marks() -> None:
    print("marks + wordmarks + lockups")
    for direction, fn in MARKS.items():
        d = LOGO / direction
        body = fn()
        # 1. bare mark, colour inherited
        write(d / "mark.svg", wrap(32, 32, body, "Linkbot mark", TITLES[direction]))
        # 2. construction grid (recommended direction only, but cheap for all)
        grid = (
            '  <g stroke="#9aa4ad" stroke-width="0.25" opacity="0.6">\n'
            '    <path d="M0 8 H32 M0 16 H32 M0 24 H32 M8 0 V32 M16 0 V32 M24 0 V32" />\n'
            "  </g>\n"
            + body
        )
        write(
            d / "mark-construction.svg",
            wrap(
                32,
                32,
                grid,
                "Linkbot mark construction",
                TITLES[direction],
            ),
        )
        # 3. monochrome (single fixed ink, print/single-colour use)
        mono = body.replace("currentColor", "#14161A")
        write(d / "mark-monochrome.svg", wrap(32, 32, mono, "Linkbot mark, monochrome", TITLES[direction]))
        # 4. app icon (rounded square plate + reversed mark)
        plate = (
            '  <rect width="64" height="64" rx="14" fill="#14161A" />\n'
            '  <g transform="translate(16 16) scale(1)" color="#F4F1EA">\n'
            + "\n".join("    " + ln for ln in body.splitlines())
            + "\n  </g>"
        )
        write(d / "app-icon.svg", wrap(64, 64, plate, "Linkbot app icon", TITLES[direction]))
        # 4b. inverse app icon (paper plate + ink mark) for light-on-dark contexts
        plate_inv = plate.replace('rx="14" fill="#14161A"', 'rx="14" fill="#F4F1EA"').replace(
            'color="#F4F1EA"', 'color="#14161A"'
        )
        write(
            d / "app-icon-inverse.svg",
            wrap(64, 64, plate_inv, "Linkbot app icon, inverse", TITLES[direction]),
        )
        # 5. social avatar (square plate, mark centred, generous clearspace)
        write(d / "social-avatar.svg", wrap(512, 512, plate.replace('width="64" height="64" rx="14"',
              'width="512" height="512" rx="112"').replace("translate(16 16)", "translate(192 192) scale(4)"),
              "Linkbot social avatar", TITLES[direction]))
        # 6. wordmark
        wm_body, wm_w, wm_h, px, py = wordmark(direction)
        wm = f'  <g transform="translate({px:.2f} {py:.2f})">\n{wm_body}\n  </g>'
        write(
            d / "wordmark-monoline.svg",
            wrap(wm_w, wm_h, wm, "Linkbot wordmark", TITLES[direction].replace("mark", "wordmark")),
        )
        # 7. lockups: mark is scaled to the wordmark cap height and centred
        ws = 0.22                       # wordmark scale
        cap = 100 * ws                  # optical cap height in final units
        ms = cap / 28.8                 # mark's optical diameter (r=14.4) -> cap
        box = 32 * ms                   # mark artboard in final units
        gap = round(cap * 0.5, 2)
        # optical weight match: final mark stroke == final wordmark stroke
        mark_stroke = round(STYLES[direction]["stroke"] * ws / ms, 3)
        body_w = fn(stroke=mark_stroke)
        body = body_w

        def mark_g(x: float, y: float) -> str:
            return (
                f'  <g transform="translate({x:.2f} {y:.2f}) scale({ms:.4f})">\n'
                + "\n".join("    " + ln for ln in body.splitlines())
                + "\n  </g>"
            )

        def wm_g(x: float, y: float) -> str:
            return (
                f'  <g transform="translate({x:.2f} {y:.2f}) scale({ws})">\n'
                + "\n".join("    " + ln for ln in wm.splitlines() if ln.strip())
                + "\n  </g>"
            )

        stack_w = round(max(wm_w * ws, box), 2)
        stack_h = round(box + gap + wm_h * ws, 2)
        stack = (
            mark_g((stack_w - box) / 2, 0)
            + "\n"
            + wm_g((stack_w - wm_w * ws) / 2, box + gap)
        )
        write(
            d / "lockup-stacked.svg",
            wrap(stack_w, stack_h, stack, "Linkbot stacked lockup", TITLES[direction]),
        )

        hor_w = round(box + gap + wm_w * ws, 2)
        hor_h = round(max(box, wm_h * ws), 2)
        hor = (
            mark_g(0, (hor_h - box) / 2)
            + "\n"
            + wm_g(box + gap, (hor_h - wm_h * ws) / 2)
        )
        write(
            d / "lockup-horizontal.svg",
            wrap(hor_w, hor_h, hor, "Linkbot horizontal lockup", TITLES[direction]),
        )
        # 8. favicon 16 optimised (thicker stroke, no fine detail below 16px)
        fav_body = MARKS[direction](stroke=2.4)
        write(d / "favicon.svg", wrap(32, 32, fav_body, "Linkbot favicon", TITLES[direction]))


# ----------------------------------------------------------------------------
# Type specimens for the wordmark are HTML (specimens/wordmark-*.html), built
# by gen_specimens.py. Nothing here touches runtime paths.
# ----------------------------------------------------------------------------

if __name__ == "__main__":
    gen_marks()
    print("done")
