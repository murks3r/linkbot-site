#!/usr/bin/env python3
"""Linkbot Type — font compiler.

UFO source -> TTF (quadratic outlines, via ufo2ft) -> WOFF2. Writes both into
fonts/. Every file is regenerated from sources/ufo on each run.

Nothing here claims a font is complete: run validate_type.py afterwards, which
checks the compiled binaries (glyph coverage, cmap, outlines, metrics, kerning,
name records) and fails if the claim does not hold.

Run: <venv>/bin/python scripts/build_fonts.py
"""
from __future__ import annotations

import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from ufoLib2 import Font

sys.path.insert(0, str(Path(__file__).resolve().parent))
from glyphset import ROLES  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
UFO_DIR = ROOT / "sources" / "ufo"
TTF_DIR = ROOT / "fonts" / "ttf"
WOFF2_DIR = ROOT / "fonts" / "woff2"

# head.created/modified are stamped with the current time by ufo2ft, which made
# every build produce different binaries — reproducible builds were impossible.
# They are pinned to the state date instead, so the same sources produce the same
# bytes and the asset registry hashes are meaningful.
BUILD_DATE = "2026-10-09"
_EPOCH_1904_TO_1970 = 2082844800


def _fixed_epoch() -> int:
    from datetime import datetime, timezone

    return (int(datetime.strptime(BUILD_DATE, "%Y-%m-%d")
                .replace(tzinfo=timezone.utc).timestamp()) + _EPOCH_1904_TO_1970)


def compile_one(name: str) -> tuple[Path, Path, int]:
    from ufo2ft import compileTTF

    src = UFO_DIR / f"{name}.ufo"
    if not src.exists():
        raise SystemExit(f"missing source {src} — run build_sources.py first")
    ufo: Font = Font.open(src)

    # Compile to TTF. ufo2ft converts the cubic outlines to quadratic and builds
    # cmap, hmtx, GPOS (from kerning.plist), name and OS/2 from font info.
    ttf: TTFont = compileTTF(
        ufo,
        removeOverlaps=False,      # the constructions are intentionally overlapping
        convertCubics=True,
        flattenComponents=True,
        autoUseMyMetrics=False,
    )

    # Pin the timestamps so the build is byte-reproducible. Setting head.modified
    # is not enough: fontTools re-stamps it at save time unless recalcTimestamp is
    # switched off, which is what made two identical builds differ.
    stamp = _fixed_epoch()
    ttf.recalcTimestamp = False
    ttf["head"].created = stamp
    ttf["head"].modified = stamp

    TTF_DIR.mkdir(parents=True, exist_ok=True)
    WOFF2_DIR.mkdir(parents=True, exist_ok=True)
    ttf_path = TTF_DIR / f"{name}.ttf"
    ttf.save(ttf_path)

    ttf.flavor = "woff2"
    woff2_path = WOFF2_DIR / f"{name}.woff2"
    ttf.save(woff2_path)

    return ttf_path, woff2_path, len(ttf.getGlyphOrder())


def main() -> int:
    total = 0
    for name in ROLES:
        ttf, woff2, n = compile_one(name)
        total += n
        print(f"  {name:26s} glyphs={n:3d}  {ttf.stat().st_size:>7d} B ttf  "
              f"{woff2.stat().st_size:>7d} B woff2")
    print(f"  compiled {len(ROLES)} faces, {total} glyph slots total")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
