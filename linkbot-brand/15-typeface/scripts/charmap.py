#!/usr/bin/env python3
"""Linkbot Type — the character set the fonts actually claim.

This is the single source of truth for coverage. validate_type.py reads it, the
coverage report is generated from it, and anything absent here is honest about
being absent: those characters fall back to a licensed OFL face in CSS.

Deliberately NOT covered (they need bespoke drawings and are left for the next
revision rather than shipped as guesses): caret (^), bar/pipe (|), grave accent
as a standalone (U+0060), section (S), paragraph (Pilcrow), dagger, daggerdbl,
copyright, registered, trademark, numero, per-mille, guillemets, OE/oe ligature,
AE/ae ligature, Greek, Cyrillic.

Stdlib only.
"""
from __future__ import annotations

from glyphset_extra import LOWER_COMPOSITES, UPPER_COMPOSITES

UNICODE: dict[str, int] = {"space": 0x20}

# ASCII letters and digits
for i, ch in enumerate("ABCDEFGHIJKLMNOPQRSTUVWXYZ"):
    UNICODE[ch] = 0x41 + i
for i, ch in enumerate("abcdefghijklmnopqrstuvwxyz"):
    UNICODE[ch] = 0x61 + i
for i, ch in enumerate("0123456789"):
    UNICODE[ch] = 0x30 + i

# ASCII punctuation and symbols
UNICODE.update({
    "exclam": 0x21, "quotedbl": 0x22, "numbersign": 0x23, "dollar": 0x24,
    "percent": 0x25, "ampersand": 0x26, "quotesingle": 0x27,
    "parenleft": 0x28, "parenright": 0x29, "asterisk": 0x2A, "plus": 0x2B,
    "comma": 0x2C, "hyphen": 0x2D, "period": 0x2E, "slash": 0x2F,
    "colon": 0x3A, "semicolon": 0x3B, "less": 0x3C, "equal": 0x3D,
    "greater": 0x3E, "question": 0x3F, "at": 0x40,
    "bracketleft": 0x5B, "backslash": 0x5C, "bracketright": 0x5D,
    "underscore": 0x5F, "braceleft": 0x7B, "braceright": 0x7D,
    "asciitilde": 0x7E,
})

# Latin-1 and the typographic set the UI actually uses
UNICODE.update({
    "degree": 0x00B0, "plusminus": 0x00B1, "sterling": 0x00A3,
    "middot": 0x00B7,   # periodcentered is the same glyph, left unmapped
    "multiply": 0x00D7, "divide": 0x00F7,
    "endash": 0x2013, "emdash": 0x2014,
    "quoteleft": 0x2018, "quoteright": 0x2019,
    "quotedblleft": 0x201C, "quotedblright": 0x201D,
    "bullet": 0x2022, "ellipsis": 0x2026, "euro": 0x20AC,
    "arrowleft": 0x2190, "arrowup": 0x2191, "arrowright": 0x2192, "arrowdown": 0x2193,
    "approxequal": 0x2248, "notequal": 0x2260,
    "lessequal": 0x2264, "greaterequal": 0x2265, "check": 0x2713,
})

# German
UNICODE.update({
    "adieresis": 0x00E4, "odieresis": 0x00F6, "udieresis": 0x00FC,
    "Adieresis": 0x00C4, "Odieresis": 0x00D6, "Udieresis": 0x00DC,
    "germandbls": 0x00DF, "uni1E9E": 0x1E9E,
})

# Accented Latin, from the composite definitions so the two cannot drift
_ACCENTS = {
    "adieresis": 0x00E4, "odieresis": 0x00F6, "udieresis": 0x00FC, "edieresis": 0x00EB,
    "idieresis": 0x00EF, "ydieresis": 0x00FF, "aacute": 0x00E1, "eacute": 0x00E9,
    "iacute": 0x00ED, "oacute": 0x00F3, "uacute": 0x00FA, "yacute": 0x00FD,
    "agrave": 0x00E0, "egrave": 0x00E8, "igrave": 0x00EC, "ograve": 0x00F2,
    "ugrave": 0x00F9, "acircumflex": 0x00E2, "ecircumflex": 0x00EA,
    "icircumflex": 0x00EE, "ocircumflex": 0x00F4, "ucircumflex": 0x00FB,
    "atilde": 0x00E3, "ntilde": 0x00F1, "otilde": 0x00F5, "aring": 0x00E5,
    "ccaron": 0x010D, "scaron": 0x0161, "zcaron": 0x017E, "sacute": 0x015B,
    "zacute": 0x017A, "cacute": 0x0107, "nacute": 0x0144, "ecaron": 0x011B,
    "rcaron": 0x0159, "amacron": 0x0101, "emacron": 0x0113, "omacron": 0x014D,
    "uogonek": 0x0173, "aogonek": 0x0105, "zdotaccent": 0x017C,
    "Adieresis": 0x00C4, "Odieresis": 0x00D6, "Udieresis": 0x00DC,
    "Edieresis": 0x00CB, "Idieresis": 0x00CF, "Aacute": 0x00C1, "Eacute": 0x00C9,
    "Iacute": 0x00CD, "Oacute": 0x00D3, "Uacute": 0x00DA, "Yacute": 0x00DD,
    "Agrave": 0x00C0, "Egrave": 0x00C8, "Igrave": 0x00CC, "Ograve": 0x00D2,
    "Ugrave": 0x00D9, "Acircumflex": 0x00C2, "Ecircumflex": 0x00CA,
    "Icircumflex": 0x00CE, "Ocircumflex": 0x00D4, "Ucircumflex": 0x00DB,
    "Atilde": 0x00C3, "Ntilde": 0x00D1, "Otilde": 0x00D5, "Aring": 0x00C5,
    "Ccaron": 0x010C, "Scaron": 0x0160, "Zcaron": 0x017D, "Cacute": 0x0106,
    "Sacute": 0x015A, "Zacute": 0x0179, "Nacute": 0x0143, "Ecaron": 0x011A,
    "Rcaron": 0x0158, "Amacron": 0x0100, "Emacron": 0x0112, "Omacron": 0x014C,
    "Zdotaccent": 0x017B,
    "ccedilla": 0x00E7, "Ccedilla": 0x00C7, "scedilla": 0x015F, "Scedilla": 0x015E,
    "Oslash": 0x00D8, "oslash": 0x00F8,
}
for _base, _acc, _name in LOWER_COMPOSITES + UPPER_COMPOSITES:
    if _name in _ACCENTS:
        UNICODE[_name] = _ACCENTS[_name]
for _n, _cp in (("ccedilla", 0x00E7), ("Ccedilla", 0x00C7), ("scedilla", 0x015F),
                ("Scedilla", 0x015E), ("Oslash", 0x00D8), ("oslash", 0x00F8)):
    UNICODE[_n] = _cp

# Anything added to a composite list but not given a codepoint above is a bug.
MISSING_CODEPOINTS = [n for _, _, n in LOWER_COMPOSITES + UPPER_COMPOSITES if n not in UNICODE]
