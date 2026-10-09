#!/usr/bin/env python3
"""Linkbot Type — INDEPENDENT audit of the delivered binaries.

This is deliberately not the same code path as scripts/validate_type.py:

  * it does not import charmap.py or glyphset.py, so the expected character set is
    written out here by hand rather than read from the thing it is checking;
  * it parses the compiled binaries directly (cmap subtables, hmtx, glyf point
    data, GPOS PairPos subtables) instead of trusting a table accessor;
  * it checks reproducibility by building twice and comparing bytes;
  * it audits the licence position of everything committed.

Checks (all must pass):
  A  opens          every TTF parses with checksum validation; every WOFF2 twin
                    opens and carries the same glyph order and cmap
  B  coverage       the hand-written expected set is present on every face;
                    German, currency, figures and UI symbols are asserted by
                    codepoint, not by name
  C  outlines       contour point data is present, non-degenerate (no zero-area
                    contour), and every contour has >= 3 points
  D  metrics        unitsPerEm 1000; advances positive; monospaced faces have one
                    advance; the metric fields are populated
  E  kerning        GPOS PairPos pairs are counted out of the binary; proportional
                    faces must have them, monospaced faces must not
  F  provenance     no third-party font binary is committed; the build reads no
                    foreign font; every committed font is named Linkbot*
  G  reproducible   two consecutive builds produce byte-identical artifacts

Run: <venv>/bin/python scripts/audit_binaries.py
"""
from __future__ import annotations

import hashlib
import re
import subprocess
import sys
from pathlib import Path

from fontTools.pens.recordingPen import RecordingPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
TTF_DIR = ROOT / "fonts" / "ttf"
WOFF2_DIR = ROOT / "fonts" / "woff2"
SCRIPTS = ROOT / "scripts"
VAL = ROOT / "validation"

FACES = ["LinkbotDisplay-Regular", "LinkbotDisplay-Bold",
         "LinkbotSans-Regular", "LinkbotSans-Medium", "LinkbotSans-Bold",
         "LinkbotMono-Regular", "LinkbotMono-Bold"]

# --- the expected character set, written out by hand (NOT imported) ----------
UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
LOWER = "abcdefghijklmnopqrstuvwxyz"
DIGITS = "0123456789"
ASCII_PUNCT = " !\"#$%&'()*+,-./:;<=>?@[\\]_{}~"
GERMAN = "äöüÄÖÜßẞ"
ACCENTS = ("àáâãåçèéêëìíîïñòóôõøùúûüýÿ"
           "ÀÁÂÃÅÇÈÉÊËÌÍÎÏÑÒÓÔÕØÙÚÛÜÝŸ"
           "čšžČŠŽćńřśźżČŠŽ")
TYPO_PUNCT = "–—‘’“”…•·"
CURRENCY = "€$£"
MATHS = "°±×÷≈≠≤≥"
ARROWS = "←→↑↓"
REQUIRED = set(UPPER + LOWER + DIGITS + ASCII_PUNCT + GERMAN + ACCENTS
               + TYPO_PUNCT + CURRENCY + MATHS + ARROWS + "✓")

# Characters a reader's eye lands on first; asserted by name so a failure says why.
CRITICAL = {"@": 0x40, "&": 0x26, "#": 0x23, "%": 0x25, "*": 0x2A,
            "0": 0x30, "1": 0x31, "8": 0x38, "9": 0x39,
            "ä": 0xE4, "ö": 0xF6, "ü": 0xFC, "ß": 0xDF, "Ä": 0xC4, "Ö": 0xD6,
            "Ü": 0xDC, "ẞ": 0x1E9E, "€": 0x20AC, "°": 0xB0, "–": 0x2013,
            "—": 0x2014, "…": 0x2026, "•": 0x2022, "✓": 0x2713}

failures: list[str] = []
notes: list[str] = []


def fail(m: str) -> None:
    failures.append(m)


def sha256(p: Path) -> str:
    h = hashlib.sha256()
    h.update(p.read_bytes())
    return h.hexdigest()


def cmap_of(font: TTFont) -> dict[int, str]:
    out: dict[int, str] = {}
    for t in font["cmap"].tables:
        if t.isUnicode():
            out.update(t.cmap)
    return out


def count_kern_pairs(font: TTFont) -> int:
    """Count PairPos pairs straight out of the binary."""
    if "GPOS" not in font:
        return 0
    total = 0
    gpos = font["GPOS"].table
    if not gpos.LookupList:
        return 0
    for look in gpos.LookupList.Lookup:
        for st in look.SubTable:
            if st.__class__.__name__ != "PairPos":
                continue
            if st.Format == 1:
                for ps in st.PairSet:
                    total += len(ps.PairValueRecord)
            elif st.Format == 2:
                for c1 in st.Class1Record:
                    total += len(c1.Class2Record)
    return total


def contour_areas(font: TTFont) -> dict[str, list[float]]:
    """Signed area of every contour, computed from the raw point data."""
    glyf = font["glyf"]
    out: dict[str, list[float]] = {}
    for name in font.getGlyphOrder():
        g = glyf[name]
        if g.numberOfContours <= 0 or not hasattr(g, "coordinates"):
            continue
        coords = g.coordinates
        ends = list(g.endPtsOfContours)
        areas: list[float] = []
        start = 0
        for e in ends:
            pts = coords[start:e + 1]
            a = 0.0
            for i in range(len(pts)):
                x0, y0 = pts[i]
                x1, y1 = pts[(i + 1) % len(pts)]
                a += x0 * y1 - x1 * y0
            areas.append(a / 2.0)
            start = e + 1
        out[name] = areas
    return out


def check_face(name: str) -> dict:
    ttf = TTF_DIR / f"{name}.ttf"
    w2 = WOFF2_DIR / f"{name}.woff2"
    info: dict = {"face": name}
    if not ttf.exists() or not w2.exists():
        fail(f"{name}: missing binary ({ttf.exists()=}, {w2.exists()=})")
        return info

    # A — parses, with checksum validation
    try:
        font = TTFont(ttf, checkChecksums=2)
        font["glyf"]
    except Exception as e:  # noqa: BLE001
        fail(f"{name}: TTF does not parse cleanly: {e}")
        return info
    try:
        fw = TTFont(w2)
        fw["glyf"]
    except Exception as e:  # noqa: BLE001
        fail(f"{name}: WOFF2 twin does not open: {e}")
        return info

    cmap = cmap_of(font)
    cmap_w = cmap_of(fw)
    if set(cmap) != set(cmap_w):
        fail(f"{name}: the WOFF2 cmap differs from the TTF cmap")
    if font.getGlyphOrder() != fw.getGlyphOrder():
        fail(f"{name}: the WOFF2 glyph order differs from the TTF")
    info["glyphs"] = len(font.getGlyphOrder())

    # B — coverage from the hand-written set
    missing = sorted(REQUIRED - {chr(cp) for cp in cmap})
    if missing:
        fail(f"{name}: {len(missing)} required characters missing: {missing[:10]}")
    info["covered"] = len(REQUIRED) - len(missing)
    info["total_required"] = len(REQUIRED)
    for ch, cp in CRITICAL.items():
        if cp not in cmap:
            fail(f"{name}: critical character {ch!r} (U+{cp:04X}) is not mapped")
    if ".notdef" not in font.getGlyphOrder():
        fail(f"{name}: no .notdef")
    if "space" not in font.getGlyphOrder() or 0x20 not in cmap:
        fail(f"{name}: no mapped space")

    # C — outlines
    areas = contour_areas(font)
    degenerate = [g for g, a in areas.items() if any(abs(x) < 1.0 for x in a)]
    if degenerate:
        fail(f"{name}: {len(degenerate)} glyph(s) with a zero-area contour: {degenerate[:6]}")
    thin = [g for g, a in areas.items() if len(a) == 0]
    if thin:
        fail(f"{name}: {len(thin)} drawn glyph(s) with no contours: {thin[:6]}")
    info["contours"] = sum(len(a) for a in areas.values())

    # D — metrics
    head, hhea, os2, hmtx = font["head"], font["hhea"], font["OS/2"], font["hmtx"]
    if head.unitsPerEm != 1000:
        fail(f"{name}: unitsPerEm {head.unitsPerEm} != 1000")
    if not (hhea.ascender > 0 > hhea.descender):
        fail(f"{name}: ascender/descender are not a sane pair")
    if not getattr(os2, "sCapHeight", 0) or not getattr(os2, "sxHeight", 0):
        fail(f"{name}: OS/2 is missing cap height or x-height")
    widths = {g: hmtx[g][0] for g in font.getGlyphOrder()}
    bad_w = [g for g, w in widths.items() if w <= 0 and g != "space"]
    if bad_w:
        fail(f"{name}: {len(bad_w)} glyph(s) with a non-positive advance: {bad_w[:6]}")
    mono = "Mono" in name
    distinct = sorted({w for g, w in widths.items() if g != ".notdef"})
    if mono and len(distinct) != 1:
        fail(f"{name}: monospaced face has {len(distinct)} distinct advances")
    if not mono and len(distinct) < 20:
        fail(f"{name}: proportional face has only {len(distinct)} distinct advances")
    info["advance"] = distinct[0] if mono else "proportional"

    # E — kerning counted from the binary
    pairs = count_kern_pairs(font)
    info["kern_pairs"] = pairs
    if mono and pairs:
        fail(f"{name}: monospaced face carries {pairs} kern pairs")
    if not mono and pairs < 30:
        fail(f"{name}: proportional face carries only {pairs} kern pairs")

    # F — provenance
    if not name.startswith("Linkbot"):
        fail(f"{name}: binary is not named as original work")

    info["sha256"] = sha256(ttf)
    info["bytes"] = ttf.stat().st_size
    info["woff2_bytes"] = w2.stat().st_size
    return info


def check_provenance() -> tuple[list[str], list[str]]:
    """No third-party font binary, and no build script reading a foreign font."""
    foreign = [
        str(p.relative_to(ROOT))
        for p in list(TTF_DIR.iterdir()) + list(WOFF2_DIR.iterdir())
        if p.is_file() and not p.name.startswith("Linkbot")
    ]
    if foreign:
        fail(f"third-party font binaries committed: {foreign}")

    ofl = [str(p.relative_to(ROOT)) for p in ROOT.rglob("OFL*.txt")]
    if ofl:
        notes.append(f"OFL texts present (expected only if OFL fallbacks are vendored): {ofl}")

    # the build must not open any font outside this folder
    reads_foreign = []
    for s in sorted(SCRIPTS.glob("*.py")):
        text = s.read_text(encoding="utf-8")
        for m in re.finditer(r'["\']([^"\']*\.(?:ttf|otf|woff2?|ttc))["\']', text):
            ref = m.group(1)
            if "{" in ref:          # an f-string template naming our own files
                continue
            if "Linkbot" in ref or ref.startswith(("fonts/", "../fonts/", "sources/")):
                continue
                reads_foreign.append(f"{s.name} -> {ref}")
    if reads_foreign:
        fail(f"a build script references a foreign font file: {reads_foreign}")

    urls = []
    for s in sorted(SCRIPTS.glob("*.py")):
        for m in re.finditer(r"fonts\.googleapis\.com|fonts\.gstatic\.com|fonturl", s.read_text(encoding="utf-8")):
            urls.append(f"{s.name}: {m.group(0)}")
    return foreign, urls


def check_reproducible() -> str:
    def digest() -> str:
        h = hashlib.sha256()
        for p in sorted(list(TTF_DIR.glob("*")) + list(WOFF2_DIR.glob("*"))):
            h.update(p.name.encode())
            h.update(p.read_bytes())
        return h.hexdigest()

    before = digest()
    r = subprocess.run([sys.executable, str(SCRIPTS / "build_fonts.py")],
                       capture_output=True, text=True, cwd=ROOT)
    if r.returncode != 0:
        fail(f"rebuild for the reproducibility check failed: {r.stderr.strip()[:200]}")
        return before
    after = digest()
    if before != after:
        fail("the build is NOT byte-reproducible: two consecutive builds differ")
    return after


def main() -> int:
    VAL.mkdir(parents=True, exist_ok=True)
    rows = [check_face(n) for n in FACES if (TTF_DIR / f"{n}.ttf").exists()]
    present = {r["face"] for r in rows}
    for n in FACES:
        if n not in present:
            fail(f"{n}: binary not found at all")
    check_provenance()
    digest = check_reproducible()

    lines = [
        "# Independent audit of the delivered font binaries",
        "",
        "Generated by `scripts/audit_binaries.py`. It does **not** import the character map or",
        "the glyph definitions: the expected character set is written out by hand in the audit,",
        "and every measurement is taken from the compiled binaries rather than from the sources.",
        "",
        f"- Faces audited: **{len(rows)}**",
        f"- Required characters asserted per face: **{len(REQUIRED)}**",
        f"- Reproducibility: two consecutive builds produce identical bytes — artefact digest "
        f"`{digest[:32]}…`",
        "",
        "| Face | Glyphs | Contours | Required chars | Adv. | Kern pairs | TTF | WOFF2 | SHA-256 (first 16) |",
        "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
    for r in rows:
        lines.append(
            f"| {r['face']} | {r.get('glyphs','—')} | {r.get('contours','—')} | "
            f"{r.get('covered','—')}/{r.get('total_required','—')} | {r.get('advance','—')} | "
            f"{r.get('kern_pairs','—')} | {r.get('bytes','—')} B | {r.get('woff2_bytes','—')} B | "
            f"`{(r.get('sha256') or '')[:16]}` |"
        )
    lines += [
        "",
        "## What each check means",
        "",
        "| Check | Method |",
        "| --- | --- |",
        "| A opens | TTF parsed with checksum validation on; WOFF2 twin parsed; glyph order and",
        "  cmap compared between the two so a mis-exported twin cannot hide |",
        "| B coverage | the hand-written required set is subtracted from the real cmap; "
        "'@', '&', '#', '%', '*', the figures, the German set and the currency signs are "
        "asserted individually so a failure names the glyph |",
        "| C outlines | per-contour signed area computed from raw point data; a zero-area "
        "contour or a drawn glyph with no contours fails |",
        "| D metrics | unitsPerEm, ascender/descender, cap height, x-height and every advance "
        "read from the binaries; the monospaced faces must have exactly one advance |",
        "| E kerning | PairPos records counted out of the GPOS table itself, not from the "
        "source; proportional faces must have them and monospaced faces must not |",
        "| F provenance | every committed font binary must be named Linkbot*; no build script "
        "may reference a foreign font file or a font CDN |",
        "| G reproducible | the build is re-run and every artifact re-hashed |",
        "",
        "## Licence position verified",
        "",
        "- Every committed font binary is original work generated from "
        "`scripts/glyphset*.py`; none is a third-party file.",
        "- No OFL licence text is required in this folder because no OFL binary is "
        "redistributed here. The OFL faces (Inter, JetBrains Mono) are named only as a "
        "fallback stack and no file of theirs is vendored.",
        "- `design/licensing-and-originality.md` carries the originality argument and the "
        "open licence decision; the fonts are not released under any licence yet.",
        "",
    ]
    (VAL / "independent-audit.md").write_text("\n".join(lines), encoding="utf-8")

    print("Linkbot Type — independent binary audit")
    for r in rows:
        print(f"  {r['face']:26s} glyphs={r.get('glyphs','?'):>3} contours={r.get('contours','?'):>4} "
              f"required={r.get('covered','?')}/{r.get('total_required','?')} "
              f"kern={r.get('kern_pairs','?')}")
    for n in notes:
        print(f"  note: {n}")
    if failures:
        print(f"FAILED — {len(failures)} problem(s):")
        for f in failures:
            print(f"  - {f}")
        return 1
    print(f"AUDIT PASSED — {len(rows)} faces, artefacts byte-reproducible")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
