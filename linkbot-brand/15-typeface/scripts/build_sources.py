#!/usr/bin/env python3
"""Linkbot Type — editable source builder.

Writes one UFO 3 source per role/weight into sources/ufo/. The UFO is the
industry-standard editable glyph format: any designer can open these in
Glyphs/robofab/FontForge, and every generator here rebuilds them from scratch.

Placement rules:
  * proportional roles: the advance is authored per glyph; the outline is placed
    so nothing sits left of the origin;
  * the monospaced role: ONE advance for every glyph and the ink centred in it,
    which is what makes Linkbot Mono monospaced rather than merely wide.

Kerning is authored as explicit pairs, not guessed from bounding boxes, and is
written to kerning.plist so ufo2ft compiles it into GPOS.

Run: <venv>/bin/python scripts/build_sources.py
"""
from __future__ import annotations

import sys
from pathlib import Path

from ufoLib2.objects import Contour, Font, Point

sys.path.insert(0, str(Path(__file__).resolve().parent))
from glyphlib import segments_bbox  # noqa: E402
from glyphset import ROLES, Style, glyphs_for  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
UFO_DIR = ROOT / "sources" / "ufo"

WEIGHT_CLASS = {"Regular": 400, "Medium": 500, "Bold": 700}
FAMILY_OF = {
    "LinkbotSans": ("Linkbot Sans", "5"),
    "LinkbotMono": ("Linkbot Mono", "5"),
    "LinkbotDisplay": ("Linkbot Display", "5"),
}

# Explicit kerning, in font units. Pairs are the usual suspects for a geometric
# family plus the ones this family specifically needs (the flat-cut A/V/W apexes
# and the single-storey a/g). Only the proportional roles are kerned.
KERN_PAIRS: list[tuple[str, str, float]] = [
    ("A", "V", -64), ("A", "W", -58), ("A", "T", -62), ("A", "Y", -72),
    ("V", "A", -64), ("V", "v", -26), ("W", "A", -58), ("Y", "A", -72),
    ("T", "A", -62), ("T", "a", -48), ("T", "o", -44), ("T", "e", -44),
    ("T", ".", -84), ("T", ",", -84), ("T", "u", -40), ("T", "r", -30),
    ("Y", "a", -46), ("Y", "o", -44), ("Y", "e", -44), ("Y", ".", -84),
    ("L", "T", -58), ("L", "V", -58), ("L", "Y", -72), ("L", "W", -52),
    ("P", "A", -46), ("P", ".", -72), ("P", ",", -72),
    ("F", "A", -52), ("F", ".", -72), ("F", ",", -72),
    ("r", ".", -44), ("r", ",", -44), ("v", ".", -40), ("w", ".", -36),
    ("o", "v", -18), ("o", "w", -14), ("y", ".", -40),
    ("A", "v", -30), ("A", "w", -26), ("A", "y", -30),
    ("K", "a", -22), ("K", "o", -22), ("V", "e", -24), ("W", "e", -20),
    ("b", "v", -14), ("h", "v", -12), ("n", "v", -12),
    ("f", "a", -12), ("f", "o", -10), ("t", "o", -10), ("t", "a", -12),
]

from charmap import MISSING_CODEPOINTS, UNICODE  # noqa: E402

if MISSING_CODEPOINTS:
    raise SystemExit(f"composites without a codepoint: {MISSING_CODEPOINTS}")


def glyph_conts(contours: list[list]) -> list[Contour]:
    out: list[Contour] = []
    for segs in contours:
        pts: list[Point] = []
        from glyphlib import contour_points

        for x, y, t, sm in contour_points(segs):
            pts.append(Point(x, y, type=t, smooth=sm))
        if len(pts) >= 2:
            out.append(Contour(points=pts))
    return out


def build(name: str, st: Style) -> Font:
    base = name.split("-")[0]
    style = name.split("-")[1]
    family, width_class = FAMILY_OF[base]

    f = Font()
    f.info.unitsPerEm = 1000
    f.info.ascender = st.asc
    f.info.descender = st.desc
    f.info.capHeight = st.cap
    f.info.xHeight = st.xh
    f.info.familyName = family
    f.info.styleName = style
    f.info.openTypeOS2WeightClass = WEIGHT_CLASS[style]
    f.info.openTypeOS2WidthClass = int(width_class)
    f.info.versionMajor = 1
    f.info.versionMinor = 0
    f.info.copyright = ("Linkbot Type — original designs by the Linkbot Brand "
                        "Experiences working group. Not a derivative of any existing typeface.")
    f.info.openTypeNameLicense = ("Original work, released by the project for Linkbot use. "
                                  "PROPOSED — not approved for distribution.")
    f.info.openTypeNameDesigner = "Linkbot Brand Experiences working group"

    glyphs = glyphs_for(st)
    ink: dict[str, tuple[float, float]] = {}
    for gname, (contours, adv) in glyphs.items():
        if contours:
            x0, y0, x1, y1 = segments_bbox(contours)
        else:
            x0 = y0 = x1 = y1 = 0.0
        ink[gname] = (x0, x1)
        width = st.mono if st.mono else adv
        if st.mono:
            dx = width / 2.0 - (x0 + x1) / 2.0
        else:
            dx = -x0 if x0 < 0 else 0.0
        gl = f.newGlyph(gname)
        gl.width = round(width, 2)
        if contours:
            placed = [[_shift(seg, dx) for seg in c] for c in contours]
            gl.contours.extend(glyph_conts(placed))
        if gname in UNICODE:
            gl.unicodes = [UNICODE[gname]]

    # .notdef — a plain outlined box, which is what a missing glyph should look like
    nd = f.newGlyph(".notdef")
    nd.width = 600.0
    from glyphlib import Line, stroke

    nd.contours.extend(glyph_conts(stroke(
        [Line((100, 0), (500, 0)), Line((500, 0), (500, 700)),
         Line((500, 700), (100, 700)), Line((100, 700), (100, 0))], 40.0)))

    if st.mono is None:
        for left, right, value in KERN_PAIRS:
            if left in glyphs and right in glyphs:
                f.kerning[(left, right)] = float(value)

    # A name record and a style-linked family so Regular/Medium/Bold group.
    f.features.text = (
        "# Linkbot Type — no GSUB/GPOS is authored beyond the compiled kerning.\n"
        "# Figures are the same width in every glyph, so tabular alignment needs no\n"
        "# 'tnum' feature; it is the default behaviour.\n"
    )
    return f


def _shift(seg: tuple, dx: float) -> tuple:
    if seg[0] == "line":
        return ("line", (seg[1][0] + dx, seg[1][1]), (seg[2][0] + dx, seg[2][1]))
    return ("curve", (seg[1][0] + dx, seg[1][1]), (seg[2][0] + dx, seg[2][1]),
            (seg[3][0] + dx, seg[3][1]), (seg[4][0] + dx, seg[4][1]))


def main() -> int:
    UFO_DIR.mkdir(parents=True, exist_ok=True)
    for name, st in ROLES.items():
        f = build(name, st)
        out = UFO_DIR / f"{name}.ufo"
        if out.exists():
            import shutil

            shutil.rmtree(out)
        f.save(out, overwrite=True)
        n_contours = sum(len(g.contours) for g in f)
        print(f"  {name:26s} glyphs={len(f):3d} contours={n_contours:4d} kerning={len(f.kerning):3d} -> {out.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
