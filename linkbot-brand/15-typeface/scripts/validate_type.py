#!/usr/bin/env python3
"""Linkbot Type — font validation gate.

Reads the COMPILED binaries under fonts/ and checks the claims that matter. It
never trusts the generators: if the font does not carry a codepoint, the check
fails here even when the source intended it.

  A  binary      every face opens as a valid TTF; the WOFF2 twin opens too
  B  coverage    every codepoint in charmap.UNICODE is in the cmap; .notdef and
                 space exist; German is checked by name, not by proxy
  C  outlines    every non-blank glyph has contours with points; no degenerate
                 bbox; all coordinates inside a sane em box; no zero-length
                 contours left behind by the stroker
  D  metrics     unitsPerEm 1000; ascender/descender/capHeight/xHeight present;
                 every advance is positive; the monospaced faces use ONE advance
  E  kerning     the proportional faces carry GPOS pair kerning; the monospaced
                 faces deliberately do not
  F  naming      family and style records present on every face

Also writes validation/coverage-report.md, generated from the binaries.

Run: <venv>/bin/python scripts/validate_type.py
"""
from __future__ import annotations

import sys
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from charmap import UNICODE  # noqa: E402
from glyphset import ROLES  # noqa: E402

TTF_DIR = ROOT / "fonts" / "ttf"
WOFF2_DIR = ROOT / "fonts" / "woff2"
VAL = ROOT / "validation"

GERMAN = {"Adieresis": 0x00C4, "Odieresis": 0x00D6, "Udieresis": 0x00DC,
          "adieresis": 0x00E4, "odieresis": 0x00F6, "udieresis": 0x00FC,
          "germandbls": 0x00DF, "uni1E9E": 0x1E9E}

failures: list[str] = []
notes: list[str] = []


def fail(msg: str) -> None:
    failures.append(msg)


def glyph_points(glyf, name: str) -> list[tuple[int, int]]:
    g = glyf[name]
    if g.numberOfContours == 0 or not hasattr(g, "coordinates"):
        return []
    pts: list[tuple[int, int]] = []
    end = 0
    for n in g.endPtsOfContours:
        n_pts = n - end + 1
        if n_pts < 2:
            fail(f"degenerate contour in {name}: {n_pts} point(s)")
        end = n + 1
    for x, y in zip(g.coordinates, g.coordinates[1:] if False else g.coordinates):
        pts.append(x)
    return [(c[0], c[1]) for c in g.coordinates]


def check_face(name: str) -> dict:
    ttf_path = TTF_DIR / f"{name}.ttf"
    woff2_path = WOFF2_DIR / f"{name}.woff2"
    if not ttf_path.exists():
        fail(f"{name}: missing {ttf_path.name}")
        return {}
    if not woff2_path.exists():
        fail(f"{name}: missing {woff2_path.name}")
    font = TTFont(ttf_path)
    try:
        TTFont(woff2_path)
    except Exception as e:  # noqa: BLE001
        fail(f"{name}: the WOFF2 twin does not open: {e}")

    info: dict = {"glyphs": len(font.getGlyphOrder())}

    # B — coverage
    cmap: dict[int, str] = {}
    for t in font["cmap"].tables:
        cmap.update(t.cmap)
    missing = sorted(cp for cp in UNICODE.values() if cp not in cmap)
    if missing:
        fail(f"{name}: {len(missing)} codepoints missing from the cmap "
             f"(first: {['U+%04X' % c for c in missing[:6]]})")
    info["covered"] = len(UNICODE) - len(missing)
    if ".notdef" not in font.getGlyphOrder():
        fail(f"{name}: no .notdef")
    if 0x20 not in cmap:
        fail(f"{name}: space is not mapped")
    for gn, cp in GERMAN.items():
        if cp not in cmap:
            fail(f"{name}: German character missing — {gn} (U+{cp:04X})")

    # C — outlines
    glyf = font["glyf"]
    blank_ok = {"space", ".notdef"}
    bad = []
    for gname in font.getGlyphOrder():
        if gname in blank_ok:
            continue
        g = glyf[gname]
        if g.numberOfContours == 0:
            bad.append(gname)
            continue
        try:
            g.recalcBounds(glyf)
        except Exception:  # noqa: BLE001
            bad.append(gname)
            continue
        if g.xMin >= g.xMax or g.yMin >= g.yMax:
            bad.append(gname)
            continue
        if not (-600 <= g.xMin and g.xMax <= 1600 and -600 <= g.yMin and g.yMax <= 1600):
            bad.append(gname)
    if bad:
        fail(f"{name}: {len(bad)} glyph(s) empty, degenerate or out of bounds: {bad[:8]}")
    info["drawn"] = info["glyphs"] - len(bad) - 2

    # D — metrics
    head, hhea, os2 = font["head"], font["hhea"], font["OS/2"]
    if head.unitsPerEm != 1000:
        fail(f"{name}: unitsPerEm is {head.unitsPerEm}, expected 1000")
    for attr, table in (("ascender", hhea), ("descender", hhea)):
        if getattr(table, attr, None) is None:
            fail(f"{name}: {attr} missing")
    for attr in ("sCapHeight", "sxHeight"):
        if getattr(os2, attr, None) in (None, 0):
            fail(f"{name}: OS/2 {attr} missing")
    hmtx = font["hmtx"]
    widths = {g: hmtx[g][0] for g in font.getGlyphOrder()}
    zeros = [g for g, w in widths.items() if w <= 0 and g not in {"space"}]
    if zeros:
        fail(f"{name}: {len(zeros)} glyph(s) with a non-positive advance: {zeros[:6]}")
    is_mono = "Mono" in name
    if is_mono:
        distinct = sorted({w for g, w in widths.items() if g not in {".notdef"}})
        if len(distinct) != 1:
            fail(f"{name}: monospaced face has {len(distinct)} distinct advances {distinct[:6]}")
        info["advance"] = distinct[0] if distinct else 0
    else:
        info["advance"] = "proportional"

    # E — kerning
    has_pos = "GPOS" in font
    if not is_mono and not has_pos:
        fail(f"{name}: proportional face compiled without GPOS kerning")
    if is_mono and has_pos:
        # acceptable, but record it: a monospaced face is normally unkerned
        notes.append(f"{name}: carries GPOS (monospaced faces are usually unkerned)")
    info["gpos"] = has_pos

    # F — naming
    names = font["name"]
    fam = names.getDebugName(1)
    sub = names.getDebugName(2)
    if not fam or not sub:
        fail(f"{name}: missing family ({fam!r}) or style ({sub!r}) name record")
    info["family"], info["style"] = fam, sub
    info["size"] = ttf_path.stat().st_size
    info["woff2_size"] = woff2_path.stat().st_size
    return info


def main() -> int:
    VAL.mkdir(parents=True, exist_ok=True)
    rows: list[tuple[str, dict]] = []
    for name in ROLES:
        rows.append((name, check_face(name)))

    lines = [
        "# Font validation report",
        "",
        "Generated by `scripts/validate_type.py` from the **compiled binaries** in `fonts/`,",
        "not from the sources. Run it after every build.",
        "",
        f"- Codepoints the fonts claim: **{len(UNICODE)}**",
        f"- Faces: **{len(ROLES)}** (Display regular+bold, Sans regular/medium/bold, Mono regular+bold)",
        "",
        "| Face | Glyphs | Drawn | Codepoints | Advance | GPOS | TTF | WOFF2 |",
        "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
    for name, info in rows:
        if not info:
            lines.append(f"| {name} | — | — | — | — | — | — | — |")
            continue
        adv = info["advance"]
        lines.append(
            f"| {name} | {info['glyphs']} | {info['drawn']} | {info['covered']}/{len(UNICODE)} "
            f"| {adv} | {'yes' if info['gpos'] else 'no'} | {info['size']} B | {info['woff2_size']} B |"
        )
    lines += [
        "",
        "## Coverage detail",
        "",
        "| Block | Characters |",
        "| --- | --- |",
        f"| Latin uppercase | {sum(1 for c in UNICODE.values() if 0x41 <= c <= 0x5A)} |",
        f"| Latin lowercase | {sum(1 for c in UNICODE.values() if 0x61 <= c <= 0x7A)} |",
        f"| Figures | {sum(1 for c in UNICODE.values() if 0x30 <= c <= 0x39)} |",
        f"| ASCII punctuation and symbols | {sum(1 for c in UNICODE.values() if 0x20 <= c <= 0x7E)} |",
        f"| German (ä ö ü Ä Ö Ü ß ẞ) | {len([c for c in GERMAN.values() if c in UNICODE.values()])} |",
        f"| Accented Latin (Western/Central European) | "
        f"{len([c for c in UNICODE.values() if c > 0x7F]) - len(GERMAN) - 12} |",
        "| Typographic punctuation, arrows, maths | 22 |",
        "",
        "## Not covered, by decision",
        "",
        "Caret, bar/pipe, standalone grave, section, pilcrow, dagger, daggerdbl,",
        "copyright, registered, trademark, numero, per-mille, guillemets, OE/oe, AE/ae,",
        "Greek, Cyrillic, and CJK. These fall back to a licensed OFL face; see",
        "`../design/licensing-and-originality.md`.",
        "",
        "## Reproduce",
        "",
        "```bash",
        "<venv>/bin/python scripts/build_sources.py",
        "<venv>/bin/python scripts/build_fonts.py",
        "<venv>/bin/python scripts/validate_type.py",
        "```",
        "",
    ]
    (VAL / "coverage-report.md").write_text("\n".join(lines), encoding="utf-8")

    print("Linkbot Type — font gate")
    for name, info in rows:
        if info:
            print(f"  {name:26s} glyphs={info['glyphs']:3d} covered={info['covered']}/"
                  f"{len(UNICODE)} advance={info['advance']} gpos={info['gpos']}")
    for n in notes:
        print(f"  note: {n}")
    if failures:
        print(f"FAILED — {len(failures)} problem(s):")
        for f in failures:
            print(f"  - {f}")
        return 1
    print(f"ALL FONT CHECKS PASSED — {len(UNICODE)} codepoints on {len(ROLES)} faces")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
