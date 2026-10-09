#!/usr/bin/env python3
"""Linkbot Brand Experiences v0.1.0 — one master identity, three experience themes.

Emits, under 14-experiences/00-shared/:
    tokens.shared.json / .css           the identity-invariant layer
    experience-A-talent.tokens.json/.css      Talent / Jobsite   (Notarial register)
    experience-B-developer.tokens.json/.css   Developer Platform (Protocol register)
    experience-C-employer.tokens.json/.css    Employer + Agency  (Commons register)
    fonts.css                           the ONE type system every experience inherits
and under 14-experiences/validation/:
    contrast-report.md                  every required pair, computed
    shared-vs-override.md               the exact shared token set vs theme overrides

Design contract (enforced, not asserted):
  * Every primitive listed in SHARED_KEYS has a byte-identical value in all three
    experience files. Those are the tokens that stop three experiences becoming
    three companies.
  * Every override key is ground, accent or density only. An override may never
    introduce a new role name, a new type step, a new radius or a new state colour.
  * Every required contrast pair is computed here. Exit code 1 on any failure.

Stdlib only. Non-applied: no runtime file consumes any of this.

Run: python3 scripts/gen_experience_tokens.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHARED_DIR = ROOT / "00-shared"
VAL = ROOT / "validation"
VERSION = "0.1.0"

# ---------------------------------------------------------------------------
# WCAG 2.1 relative luminance / contrast (identical to the Brand OS formula)
# ---------------------------------------------------------------------------


def _srgb(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(hex6: str) -> float:
    h = hex6.lstrip("#")
    if len(h) == 3:
        h = "".join(ch * 2 for ch in h)
    r, g, b = (int(h[i : i + 2], 16) / 255 for i in (0, 2, 4))
    return 0.2126 * _srgb(r) + 0.7152 * _srgb(g) + 0.0722 * _srgb(b)


def contrast(a: str, b: str) -> float:
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def _rgb(hex6: str) -> tuple[int, int, int]:
    h = hex6.lstrip("#")
    if len(h) == 3:
        h = "".join(ch * 2 for ch in h)
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def _hex(rgb: tuple[float, float, float]) -> str:
    return "#%02X%02X%02X" % tuple(max(0, min(255, round(c))) for c in rgb)


def mix(a: str, b: str, t: float) -> str:
    ca, cb = _rgb(a), _rgb(b)
    return _hex(tuple(ca[k] + (cb[k] - ca[k]) * t for k in range(3)))  # type: ignore[arg-type]


def towards(bg: str, target: str, ratio: float, steps: int = 512) -> str:
    """Walk `bg` toward `target` until it clears `ratio` against `bg`."""
    for i in range(1, steps + 1):
        cand = mix(bg, target, i / steps)
        if contrast(cand, bg) >= ratio:
            return cand
    return target


def towards_all(grounds: list[str], target: str, ratio: float, steps: int = 1024) -> str:
    """Walk the lightest ground toward `target` until it clears `ratio` against
    EVERY ground supplied. A border that clears 3:1 on white can still fail on a
    slightly darker surface, because contrast is minimised against the ground
    closest in luminance to the border itself."""
    for i in range(1, steps + 1):
        cand = mix(grounds[0], target, i / steps)
        if all(contrast(cand, g) >= ratio for g in grounds):
            return cand
    return target


def darken_until(colour: str, grounds, ratio: float, steps: int = 2048) -> str:
    """Darken `colour` toward black until it clears `ratio` against every ground.

    This is how a light accent gets a legible sibling instead of a hand-picked hex.
    Hue is preserved (the walk is toward black, not toward grey). Passing several
    grounds makes the result safe on the darkest ground it may sit on, not only on
    white — a green that clears 4.5:1 on white still fails on warm paper."""
    if isinstance(grounds, str):
        grounds = [grounds]
    for i in range(1, steps + 1):
        cand = mix(colour, "#000000", i / steps)
        if all(contrast(cand, g) >= ratio for g in grounds):
            return cand
    return "#000000"


# ---------------------------------------------------------------------------
# SHARED primitives — byte-identical in every experience file.
# ---------------------------------------------------------------------------

# The light-mode control border is DERIVED, not chosen: it is walked toward black
# from pure white (the lightest ground, therefore the worst case) until it clears
# the 3:1 non-text target of WCAG 1.4.11 with margin, and then reused on every
# light surface. A decorative rule and a control border are separate tokens on
# purpose — reusing one for both is how an input ends up with a 2.4:1 edge.
# Light surfaces the control border must clear 3:1 on: porcelain, pure white,
# paper, and the cool canvas. Derived against all of them.
LIGHT_SURFACES = ["#FFFFFF", "#FDFCF9", "#F4F1EA", "#F6F8F9"]
CONTROL_LIGHT = towards_all(LIGHT_SURFACES, "#000000", 3.0)

# The suggested light green cannot carry text on a light ground, so its
# light-mode sibling is derived by darkening the colour itself (hue preserved).
MINT_DEEP = darken_until("#ABEBA1", LIGHT_SURFACES, 4.5)

SHARED: dict[str, str] = {
    # neutral core, light
    "ink": "#14161A",
    "inkSoft": "#33383F",
    "slate": "#565C63",
    "porcelain": "#FDFCF9",
    "paperDeep": "#EAE4D8",
    "rule": "#D9D3C5",
    "ruleStrong": "#ABA391",
    "controlLight": CONTROL_LIGHT,
    # neutral core, dark
    "midnight": "#0E1013",
    "midnightRaised": "#181B1F",
    "midnightSunken": "#111417",
    "midnightLine": "#2A2E33",
    "midnightControl": "#65686C",
    "moonText": "#E9E4D8",
    "moonDim": "#A9A395",
    # suggested colours under evaluation, added to the shared layer
    "warmNeutral": "#ABABA1",
    "mint": "#ABEBA1",
    "mintDeep": MINT_DEEP,
    # the four product states — one hue set for the whole brand, both modes
    "grantedLight": "#1D5B45",
    "grantedDark": "#4FBE92",
    "pendingLight": "#8A5B00",
    "pendingDark": "#D9A93F",
    "deniedLight": "#8E2F2F",
    "deniedDark": "#E08880",
    "unknownLight": "#565C63",
    "unknownDark": "#A9A395",
    "pureWhite": "#FFFFFF",
}

SHARED_KEYS = tuple(SHARED.keys())

# ---------------------------------------------------------------------------
# Per-experience overrides — ground and accent ONLY.
# ---------------------------------------------------------------------------

OVERRIDES: dict[str, dict[str, str]] = {
    # A — Talent / Jobsite: warm paper, seal accent (Direction A, the owner's choice)
    "A-talent": {
        "paper": "#F4F1EA",
        "seal": "#1D5B45",
        "sealBright": "#4FBE92",
    },
    # B — Developer Platform: ink ground, phosphor accent (retained decision)
    "B-developer": {
        "void": "#06080B",
        "panel": "#0C1014",
        "raised": "#131A20",
        "phosphor": "#3BE08C",
        "phosphorDeep": "#0A6B41",
    },
    # C — Employer + Agency: neutral light, ocean accent
    "C-employer": {
        "canvasCool": "#F6F8F9",
        "sunkenCool": "#EDF2F4",
        "ocean": "#245C73",
        "oceanBright": "#7FC4DC",
    },
}

EXPERIENCE_META = {
    "A-talent": ("A", "Talent / Jobsite", "Notarial register: paper, editorial, seal accent."),
    "B-developer": ("B", "Developer Platform", "Protocol register: ink ground, phosphor accent."),
    "C-employer": ("C", "Employer / Agency", "Commons register: neutral light, ocean accent."),
}

# ---------------------------------------------------------------------------
# Role -> primitive, per experience and per mode. Same role names everywhere.
# ---------------------------------------------------------------------------

ROLES = (
    "canvas",
    "surface",
    "surface-sunken",
    "text",
    "text-muted",
    "brand",
    "brand-contrast",
    "link",
    "border-subtle",
    "border-control",
    "border-decorative-strong",
    "marker",
    "marker-contrast",
    "status-granted",
    "status-pending",
    "status-denied",
    "status-unknown",
    "focus",
)

ROLE_MAP: dict[str, dict[str, dict[str, str]]] = {
    "A-talent": {
        "light": {
            "canvas": "paper",
            "surface": "porcelain",
            "surface-sunken": "paperDeep",
            "text": "ink",
            "text-muted": "slate",
            "brand": "seal",
            "brand-contrast": "paper",
            "link": "seal",
            "border-subtle": "rule",
            "border-control": "controlLight",
            "border-decorative-strong": "warmNeutral",
            "marker": "mint",
            "marker-contrast": "ink",
            "status-granted": "grantedLight",
            "status-pending": "pendingLight",
            "status-denied": "deniedLight",
            "status-unknown": "unknownLight",
            "focus": "seal",
        },
        "dark": {
            "canvas": "midnight",
            "surface": "midnightRaised",
            "surface-sunken": "midnightSunken",
            "text": "moonText",
            "text-muted": "moonDim",
            "brand": "sealBright",
            "brand-contrast": "midnight",
            "link": "sealBright",
            "border-subtle": "midnightLine",
            "border-control": "midnightControl",
            "border-decorative-strong": "warmNeutral",
            "marker": "mint",
            "marker-contrast": "midnight",
            "status-granted": "grantedDark",
            "status-pending": "pendingDark",
            "status-denied": "deniedDark",
            "status-unknown": "unknownDark",
            "focus": "sealBright",
        },
    },
    "B-developer": {
        "light": {
            "canvas": "porcelain",
            "surface": "pureWhite",
            "surface-sunken": "paperDeep",
            "text": "ink",
            "text-muted": "slate",
            "brand": "phosphorDeep",
            "brand-contrast": "pureWhite",
            "link": "phosphorDeep",
            "border-subtle": "rule",
            "border-control": "controlLight",
            "border-decorative-strong": "warmNeutral",
            "marker": "mint",
            "marker-contrast": "ink",
            "status-granted": "grantedLight",
            "status-pending": "pendingLight",
            "status-denied": "deniedLight",
            "status-unknown": "unknownLight",
            "focus": "phosphorDeep",
        },
        "dark": {
            "canvas": "void",
            "surface": "panel",
            "surface-sunken": "raised",
            "text": "moonText",
            "text-muted": "moonDim",
            "brand": "phosphor",
            "brand-contrast": "void",
            "link": "phosphor",
            "border-subtle": "midnightLine",
            "border-control": "midnightControl",
            "border-decorative-strong": "warmNeutral",
            "marker": "mint",
            "marker-contrast": "void",
            "status-granted": "grantedDark",
            "status-pending": "pendingDark",
            "status-denied": "deniedDark",
            "status-unknown": "unknownDark",
            "focus": "phosphor",
        },
    },
    "C-employer": {
        "light": {
            "canvas": "canvasCool",
            "surface": "pureWhite",
            "surface-sunken": "sunkenCool",
            "text": "ink",
            "text-muted": "slate",
            "brand": "ocean",
            "brand-contrast": "pureWhite",
            "link": "ocean",
            "border-subtle": "rule",
            "border-control": "controlLight",
            "border-decorative-strong": "warmNeutral",
            "marker": "mint",
            "marker-contrast": "ink",
            "status-granted": "grantedLight",
            "status-pending": "pendingLight",
            "status-denied": "deniedLight",
            "status-unknown": "unknownLight",
            "focus": "ocean",
        },
        "dark": {
            "canvas": "midnight",
            "surface": "midnightRaised",
            "surface-sunken": "midnightSunken",
            "text": "moonText",
            "text-muted": "moonDim",
            "brand": "oceanBright",
            "brand-contrast": "midnight",
            "link": "oceanBright",
            "border-subtle": "midnightLine",
            "border-control": "midnightControl",
            "border-decorative-strong": "warmNeutral",
            "marker": "mint",
            "marker-contrast": "midnight",
            "status-granted": "grantedDark",
            "status-pending": "pendingDark",
            "status-denied": "deniedDark",
            "status-unknown": "unknownDark",
            "focus": "oceanBright",
        },
    },
}

# Required contrast pairs, expressed as roles. Evaluated in both modes.
LIGHT_ONLY_ROLES = {"mint-deep"}

REQUIRED_PAIRS = [
    ("text", "canvas", 4.5, "body text on canvas"),
    ("text", "surface", 4.5, "body text on surface"),
    ("text-muted", "canvas", 4.5, "secondary text on canvas"),
    ("text-muted", "surface", 4.5, "secondary text on surface"),
    ("brand", "canvas", 4.5, "brand text / link on canvas"),
    ("brand", "surface", 4.5, "brand text on surface"),
    ("link", "canvas", 4.5, "link on canvas"),
    ("brand-contrast", "brand", 4.5, "text on the brand fill"),
    ("marker-contrast", "marker", 4.5, "text on the marker highlight"),
    ("mint-deep", "surface", 4.5, "derived green sibling on surface (light mode only)"),
    ("mint-deep", "canvas", 4.5, "derived green sibling on canvas (light mode only)"),
    ("status-granted", "surface", 4.5, "confirmed state on surface"),
    ("status-pending", "surface", 4.5, "proposed state on surface"),
    ("status-denied", "surface", 4.5, "denied state on surface"),
    ("status-unknown", "surface", 4.5, "unknown state on surface"),
    ("border-control", "surface", 3.0, "control border on surface (1.4.11)"),
    ("border-control", "canvas", 3.0, "control border on canvas (1.4.11)"),
]

# Decorative roles carry no meaning alone; ratios are recorded but not gated.
DECORATIVE_PAIRS = [
    ("border-decorative-strong", "canvas", "warm neutral rule on canvas"),
    ("border-decorative-strong", "surface", "warm neutral rule on surface"),
]

# ---------------------------------------------------------------------------
# Type / space / radius / motion — ONE system, no per-experience override.
# ---------------------------------------------------------------------------

TYPE_SCALE = [12, 13, 14, 16, 18, 20, 24, 30, 38, 48, 60, 76]
SPACE = {"3xs": 2, "2xs": 4, "xs": 8, "sm": 12, "md": 16, "lg": 24, "xl": 32, "2xl": 48, "3xl": 64, "4xl": 96}
RADIUS = {"none": 0, "xs": 2, "sm": 4, "md": 8, "lg": 12, "xl": 20, "full": 999}
MOTION_DURATION = {"instant": 80, "fast": 160, "base": 240, "slow": 400, "deliberate": 640}
MOTION_EASING = {
    "standard": "cubic-bezier(0.2, 0.7, 0.2, 1)",
    "entrance": "cubic-bezier(0.16, 1, 0.3, 1)",
    "exit": "cubic-bezier(0.4, 0, 1, 1)",
    "linear": "linear",
}
# Per-experience density only: the space scale is multiplied, never replaced.
DENSITY = {
    "A-talent": {"space-scale": 1.0, "measure": "34rem", "radius-base": "xs"},
    "B-developer": {"space-scale": 0.9, "measure": "36rem", "radius-base": "none"},
    "C-employer": {"space-scale": 0.95, "measure": "38rem", "radius-base": "sm"},
}

# ---------------------------------------------------------------------------
# The type system. Identical in all three experiences by construction.
# ---------------------------------------------------------------------------

FONT_FACES = {
    "display": "Linkbot Display",
    "sans": "Linkbot Sans",
    "mono": "Linkbot Mono",
}
# Tested OFL fallback chains. Until the original faces are built and validated
# (15-typeface/), these are what actually renders, and they stay in the stack
# afterwards as the graceful-degradation path.
FALLBACK_STACK = {
    "display": '"Linkbot Display", "Iowan Old Style", Georgia, serif',
    "sans": '"Linkbot Sans", "Inter", ui-sans-serif, system-ui, sans-serif',
    "mono": '"Linkbot Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
}


# Roles that are primitives in their own right rather than role aliases.
DIRECT_ROLES = {"mint-deep": "mintDeep"}


def resolve(experience: str, mode: str, role: str) -> str:
    palette = {**SHARED, **OVERRIDES[experience]}
    if role in DIRECT_ROLES:
        return palette[DIRECT_ROLES[role]]
    return palette[ROLE_MAP[experience][mode][role]]


# ---------------------------------------------------------------------------
# Emitters
# ---------------------------------------------------------------------------


def _kebab(s: str) -> str:
    out = []
    for ch in s:
        if ch.isupper():
            out.append("-" + ch.lower())
        else:
            out.append(ch)
    return "".join(out)


def shared_dtcg() -> dict:
    return {
        "$schema": "https://design-tokens.github.io/community-group/format/",
        "$description": (
            f"Linkbot Brand Experiences {VERSION} — SHARED layer. PROPOSED, NOT APPROVED. "
            "Non-applied: no runtime file consumes this. Every value here is identical in all "
            "three experience token files by construction; validate_experiences.py enforces it."
        ),
        "color": {"palette": {k: {"$type": "color", "$value": v} for k, v in sorted(SHARED.items())}},
        "role-names": {r: {"$type": "string", "$value": r} for r in ROLES},
        "type": {
            "family": {
                "display": {"$type": "fontFamily", "$value": [FONT_FACES["display"]]},
                "sans": {"$type": "fontFamily", "$value": [FONT_FACES["sans"]]},
                "mono": {"$type": "fontFamily", "$value": [FONT_FACES["mono"]]},
            },
            "fallback": {k: {"$type": "string", "$value": v} for k, v in FALLBACK_STACK.items()},
            "size": {str(s): {"$type": "dimension", "$value": f"{s}px"} for s in TYPE_SCALE},
            "weight": {
                "regular": {"$type": "fontWeight", "$value": 400},
                "medium": {"$type": "fontWeight", "$value": 500},
                "semibold": {"$type": "fontWeight", "$value": 600},
                "bold": {"$type": "fontWeight", "$value": 700},
            },
            "leading": {
                "tight": {"$type": "number", "$value": 1.05},
                "snug": {"$type": "number", "$value": 1.25},
                "normal": {"$type": "number", "$value": 1.5},
                "relaxed": {"$type": "number", "$value": 1.7},
            },
            "tracking": {
                "tighter": {"$type": "dimension", "$value": "-0.03em"},
                "tight": {"$type": "dimension", "$value": "-0.015em"},
                "normal": {"$type": "dimension", "$value": "0em"},
                "label": {"$type": "dimension", "$value": "0.14em"},
            },
        },
        "space": {k: {"$type": "dimension", "$value": f"{v}px"} for k, v in SPACE.items()},
        "radius": {
            k: {"$type": "dimension", "$value": ("9999px" if k == "full" else f"{v}px")}
            for k, v in RADIUS.items()
        },
        "motion": {
            "duration": {k: {"$type": "duration", "$value": f"{v}ms"} for k, v in MOTION_DURATION.items()},
            "easing": {k: {"$type": "cubicBezier", "$value": v} for k, v in MOTION_EASING.items()},
        },
        "focus": {
            "ring-width": {"$type": "dimension", "$value": "2px"},
            "ring-offset": {"$type": "dimension", "$value": "2px"},
        },
    }


def experience_dtcg(experience: str) -> dict:
    letter, audience, thesis = EXPERIENCE_META[experience]
    palette = {**SHARED, **OVERRIDES[experience]}
    sem: dict = {}
    for mode in ("light", "dark"):
        for role in ROLES:
            prim = ROLE_MAP[experience][mode][role]
            sem[f"{mode}.{role}"] = {
                "$type": "color",
                "$value": f"{{color.palette.{prim}}}",
                "$extensions": {"linkbot.primitive": prim, "$value": palette[prim]},
            }
    return {
        "$schema": "https://design-tokens.github.io/community-group/format/",
        "$description": (
            f"Linkbot Brand Experiences {VERSION} — Experience {letter}, {audience}. "
            "PROPOSED, NOT APPROVED. Non-applied. Overrides are ground, accent and density only; "
            "the shared layer lives in tokens.shared.json."
        ),
        "experience": {
            "letter": {"$type": "string", "$value": letter},
            "audience": {"$type": "string", "$value": audience},
            "register": {"$type": "string", "$value": thesis},
            "inherit": {"$type": "string", "$value": "tokens.shared.json"},
        },
        "color": {
            "palette": {k: {"$type": "color", "$value": v} for k, v in sorted(palette.items())},
            "override-keys": {k: {"$type": "color", "$value": v} for k, v in sorted(OVERRIDES[experience].items())},
            "shared-keys": {k: {"$type": "color", "$value": SHARED[k]} for k in SHARED_KEYS},
        },
        "semantic": sem,
        "density": {
            "space-scale": {"$type": "number", "$value": DENSITY[experience]["space-scale"]},
            "measure": {"$type": "string", "$value": DENSITY[experience]["measure"]},
            "radius-base": {"$type": "string", "$value": DENSITY[experience]["radius-base"]},
        },
    }


def shared_css() -> str:
    L = [
        f"/* Linkbot Brand Experiences {VERSION} — SHARED token export.",
        " * PROPOSED, NOT APPROVED. Non-applied: no runtime file imports this.",
        " * These declarations are identical in all three experiences. */",
        "",
        ":root {",
        "  /* shared primitives */",
    ]
    for k, v in sorted(SHARED.items()):
        L.append(f"  --lb-shared-{_kebab(k)}: {v};")
    L += ["", "  /* one type system */"]
    for role, family in FONT_FACES.items():
        L.append(f"  --lb-font-{role}: {family};")
    for role, stack in FALLBACK_STACK.items():
        L.append(f"  --lb-stack-{role}: {stack};")
    for s in TYPE_SCALE:
        L.append(f"  --lb-text-{s}: {s}px;")
    L += [
        "  --lb-weight-regular: 400;",
        "  --lb-weight-medium: 500;",
        "  --lb-weight-semibold: 600;",
        "  --lb-weight-bold: 700;",
        "  --lb-leading-tight: 1.05;",
        "  --lb-leading-snug: 1.25;",
        "  --lb-leading-normal: 1.5;",
        "  --lb-leading-relaxed: 1.7;",
        "  --lb-tracking-tighter: -0.03em;",
        "  --lb-tracking-tight: -0.015em;",
        "  --lb-tracking-normal: 0em;",
        "  --lb-tracking-label: 0.14em;",
        "",
        "  /* one spacing scale */",
    ]
    for k, v in SPACE.items():
        L.append(f"  --lb-space-{k}: {v}px;")
    L += ["", "  /* one radius scale */"]
    for k, v in RADIUS.items():
        L.append(f"  --lb-radius-{k}: {'9999px' if k == 'full' else str(v) + 'px'};")
    L += ["", "  /* one motion set */"]
    for k, v in MOTION_DURATION.items():
        L.append(f"  --lb-duration-{k}: {v}ms;")
    for k, v in MOTION_EASING.items():
        L.append(f"  --lb-ease-{k}: {v};")
    L += [
        "",
        "  /* one focus treatment */",
        "  --lb-focus-width: 2px;",
        "  --lb-focus-offset: 2px;",
        "  --lb-focus-colour: var(--lb-shared-ink);",
        "}",
        "",
        "@media (prefers-reduced-motion: reduce) {",
        "  :root {",
        "    --lb-duration-instant: 0ms;",
        "    --lb-duration-fast: 0ms;",
        "    --lb-duration-base: 0ms;",
        "    --lb-duration-slow: 0ms;",
        "    --lb-duration-deliberate: 0ms;",
        "  }",
        "}",
        "",
    ]
    return "\n".join(L)


def fonts_css(woff2_available: bool | None = None) -> str:
    """The one type system.

    When the original faces exist in 15-typeface/fonts/woff2/ the @font-face blocks
    are emitted and every experience loads them; when they do not, only the tested
    OFL fallback stack is declared. The file therefore never claims a font that is
    not on disk — it is regenerated by this same script as the typeface lands.
    """
    typeface_dir = ROOT.parent / "15-typeface" / "fonts" / "woff2"
    if woff2_available is None:
        woff2_available = typeface_dir.is_dir() and any(typeface_dir.glob("*.woff2"))

    head = [
        f"/* Linkbot Brand Experiences {VERSION} — type system.",
        " * PROPOSED, NOT APPROVED. Non-applied: no runtime file imports this.",
        " * Linkbot Display / Sans / Mono are original designs built in 15-typeface/.",
    ]
    if woff2_available:
        head.append(" * STATUS: the original faces are present and self-hosted below,")
        head.append(" * with the tested OFL stack retained as the fallback.")
    else:
        head.append(" * STATUS: the original faces are NOT on disk, so only the tested")
        head.append(" * OFL fallback stack is declared. Nothing here pretends to ship a font.")
    head += [" */", ""]
    if woff2_available:
        faces = [
            ("sans", "Linkbot Sans", 400, "LinkbotSans-Regular"),
            ("sans", "Linkbot Sans", 500, "LinkbotSans-Medium"),
            ("sans", "Linkbot Sans", 700, "LinkbotSans-Bold"),
            ("mono", "Linkbot Mono", 400, "LinkbotMono-Regular"),
            ("mono", "Linkbot Mono", 700, "LinkbotMono-Bold"),
            ("display", "Linkbot Display", 400, "LinkbotDisplay-Regular"),
            ("display", "Linkbot Display", 700, "LinkbotDisplay-Bold"),
        ]
        for role, family, weight, file in faces:
            head += [
                "@font-face {",
                f'  font-family: "{family}";',
                f'  src: url("../../15-typeface/fonts/woff2/{file}.woff2") format("woff2");',
                f"  font-weight: {weight};",
                "  font-style: normal;",
                "  font-display: swap;",
                "}",
            ]
        head.append("")
    head.append(":root {")
    for role, stack in FALLBACK_STACK.items():
        head.append(f"  --lb-font-{role}: {stack};")
    head += ["}", "", ""]
    return "\n".join(head)


def experience_css(experience: str) -> str:
    letter, audience, _ = EXPERIENCE_META[experience]
    palette = {**SHARED, **OVERRIDES[experience]}
    L = [
        f"/* Linkbot Brand Experiences {VERSION} — Experience {letter}: {audience}.",
        " * PROPOSED, NOT APPROVED. Non-applied: generated from the token JSON.",
        " * Overrides ground, accent and density only. Roles and scale are inherited. */",
        "",
        ":root {",
        "  /* experience palette (shared + override) */",
    ]
    for k, v in sorted(palette.items()):
        mark = "override" if k in OVERRIDES[experience] else "shared"
        L.append(f"  --lb-{letter.lower()}-{_kebab(k)}: {v};  /* {mark} */")
    L += ["", "  /* density (the only scale knob an experience may touch) */"]
    L.append(f"  --lb-space-scale: {DENSITY[experience]['space-scale']};")
    L.append(f"  --lb-measure: {DENSITY[experience]['measure']};")
    L += ["", "  /* resolved roles, light mode */"]
    for role in ROLES:
        prim = ROLE_MAP[experience]["light"][role]
        L.append(f"  --lb-{role}: var(--lb-{letter.lower()}-{_kebab(prim)});")
    L += [
        "}",
        "",
        f'[data-experience="{letter}"][data-mode="dark"],',
        f'[data-experience="{letter}"] [data-mode="dark"] {{',
    ]
    for role in ROLES:
        prim = ROLE_MAP[experience]["dark"][role]
        L.append(f"  --lb-{role}: var(--lb-{letter.lower()}-{_kebab(prim)});")
    L += [
        "}",
        "",
        f'[data-experience="{letter}"] {{',
        "  color-scheme: light;",
        "}",
        f'[data-experience="{letter}"][data-mode="dark"] {{',
        "  color-scheme: dark;",
        "}",
        "",
    ]
    return "\n".join(L)


# ---------------------------------------------------------------------------
# New-colour evaluation (#ABABA1, #ABEBA1)
# ---------------------------------------------------------------------------


def accents_report() -> tuple[list[str], int]:
    """Evaluate the two suggested colours against every ground they could land on.

    Returns (markdown lines, failure count). Non-text decorative use is recorded
    but not gated; text use is gated at 4.5:1 and control use at 3:1."""
    grounds = [
        ("paper (A canvas)", "#F4F1EA"),
        ("porcelain (A/B surface)", "#FDFCF9"),
        ("cool canvas (C canvas)", "#F6F8F9"),
        ("pure white", "#FFFFFF"),
        ("ink / text", "#14161A"),
        ("midnight (dark canvas)", "#0E1013"),
    ]
    L = [
        "## 1. The two suggested colours, evaluated",
        "",
        "Owner-supplied candidates. Both are recorded here as **evaluated**, and neither is",
        "promoted to a load-bearing text role unless the computation below allows it.",
        "",
    ]
    failures = 0
    for name, hexv, proposed in (
        ("#ABABA1 — muted warm neutral", "#ABABA1", "border-decorative-strong"),
        ("#ABEBA1 — fresh light green", "#ABEBA1", "marker (decorative highlight)"),
    ):
        L += [
            f"### {name}",
            "",
            f"Proposed role: `{proposed}` (decorative / non-textual).",
            "",
            "| Pair | Ratio | Verdict |",
            "| --- | --- | --- |",
        ]
        for label, bg in grounds:
            r = contrast(hexv, bg)
            if r >= 4.5:
                verdict = "PASS as text (4.5:1)"
            elif r >= 3.0:
                verdict = "PASS as non-text only (3:1) — **not** text"
            else:
                verdict = "FAILS 3:1 — decorative on this ground only"
            L.append(f"| `{hexv}` on {label} {bg} | {r:.2f}:1 | {verdict} |")
        # inverse: dark text on the colour used as a fill (the marker case)
        for fg_name, fg in (("ink", "#14161A"), ("midnight", "#0E1013")):
            r = contrast(fg, hexv)
            ok = r >= 4.5
            L.append(
                f"| {fg_name} {fg} on `{hexv}` fill | {r:.2f}:1 | "
                f"{'PASS as text on the fill' if ok else '**FAILS** 4.5:1 — do not put text on it'} |"
            )
            if not ok:
                failures += 1
        L.append("")

    # derived, passing neighbours — computed, not guessed
    mint_on_white = MINT_DEEP
    L += [
        "### Derived, passing neighbours (computed, not guessed)",
        "",
        "`#ABEBA1` cannot carry text on a light ground. Instead of hand-picking a hex, the",
        "nearest passing neighbour walking toward black is used, so the result has margin:",
        "",
        "| Derived token | Value | Contrast on white | Contrast on ink |",
        "| --- | --- | --- | --- |",
        f"| `mintDeep` (from `#ABEBA1`) | `{mint_on_white}` | {contrast(mint_on_white, '#FFFFFF'):.2f}:1 "
        f"| {contrast(mint_on_white, '#14161A'):.2f}:1 |",
        "",
        "### Verdict",
        "",
        "1. **`#ABABA1` is admitted as a decorative/structural token** — `border-decorative-strong`,",
        "   a warm neutral rule that separates panels without competing with the control border.",
        "   It is **not** admitted as body or secondary text on any light ground (see ratios above).",
        "2. **`#ABEBA1` is admitted as a decorative highlight only** — the `marker` role, a",
        "   short underlay behind ink text, plus an optional bright accent on the dark grounds where",
        "   it clears 4.5:1. It is **not** admitted as text or as a control border.",
        "3. Neither colour replaces an existing decision. Experience B keeps its phosphor accent;",
        "   `#ABEBA1` is offered as a documented, lower-neon alternative with the evidence attached.",
        "4. Both are shared-layer primitives, so all three experiences use the same two values.",
        "",
    ]
    return L, failures


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> int:
    SHARED_DIR.mkdir(parents=True, exist_ok=True)
    VAL.mkdir(parents=True, exist_ok=True)

    (SHARED_DIR / "tokens.shared.json").write_text(
        json.dumps(shared_dtcg(), indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    (SHARED_DIR / "tokens.shared.css").write_text(shared_css(), encoding="utf-8")
    (SHARED_DIR / "fonts.css").write_text(fonts_css(), encoding="utf-8")

    for exp in OVERRIDES:
        slug = exp
        (SHARED_DIR / f"experience-{slug}.tokens.json").write_text(
            json.dumps(experience_dtcg(exp), indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )
        (SHARED_DIR / f"experience-{slug}.tokens.css").write_text(
            experience_css(exp), encoding="utf-8"
        )

    # ---------------- contrast report ----------------
    report: list[str] = [
        "# Contrast validation report — Brand Experiences",
        "",
        f"Version `{VERSION}` · generated by `scripts/gen_experience_tokens.py`.",
        "Every ratio is computed with the WCAG 2.1 relative-luminance formula. None is eyeballed.",
        "Targets: **4.5:1** for text (1.4.3), **3:1** for non-text control borders (1.4.11).",
        "",
        "## Required pairs — every experience, both modes",
        "",
    ]
    total = 0
    failures = 0
    for exp in OVERRIDES:
        letter, audience, _ = EXPERIENCE_META[exp]
        report += [f"### Experience {letter} — {audience}", ""]
        for mode in ("light", "dark"):
            report += [f"**{mode} mode**", "", "| Pair | Ratio | Target | Result |", "| --- | --- | --- | --- |"]
            for fg_role, bg_role, target, label in REQUIRED_PAIRS:
                if fg_role in LIGHT_ONLY_ROLES and mode != "light":
                    continue
                fg, bg = resolve(exp, mode, fg_role), resolve(exp, mode, bg_role)
                r = contrast(fg, bg)
                total += 1
                ok = r >= target
                if not ok:
                    failures += 1
                report.append(
                    f"| `{fg_role}` {fg} on `{bg_role}` {bg} — {label} | {r:.2f}:1 | {target}:1 "
                    f"| {'PASS' if ok else '**FAIL**'} |"
                )
            for fg_role, bg_role, label in DECORATIVE_PAIRS:
                fg, bg = resolve(exp, mode, fg_role), resolve(exp, mode, bg_role)
                report.append(
                    f"| `{fg_role}` {fg} on `{bg_role}` {bg} — {label} (decorative, not gated) "
                    f"| {contrast(fg, bg):.2f}:1 | — | recorded |"
                )
            report.append("")

    report += ["---", ""]
    acc_lines, acc_fail = accents_report()
    report += acc_lines
    failures += acc_fail

    report += [
        "---",
        "",
        "## Summary",
        "",
        f"- Required pairs evaluated: **{total}**",
        f"- Failures: **{failures}**",
        "- Every state is carried by a colour, a distinct glyph silhouette and the state word",
        "  (WCAG 1.4.1) — colour alone never carries meaning in the specimens.",
        "- The shared layer is one set of values across A, B and C; only ground, accent and",
        "  density change. Reproduce: `python3 scripts/gen_experience_tokens.py`.",
        "",
    ]
    (VAL / "contrast-report.md").write_text("\n".join(report), encoding="utf-8")

    # ---------------- shared vs override ----------------
    lines = [
        "# Shared tokens versus experience overrides",
        "",
        "Generated by `scripts/gen_experience_tokens.py`; enforced by `scripts/validate_experiences.py`.",
        "This is the exact contract that keeps three experiences inside one master brand.",
        "",
        "## 1. Shared — byte-identical in all three experience token files",
        "",
        "| Primitive | Value |",
        "| --- | --- |",
    ]
    for k in SHARED_KEYS:
        lines.append(f"| `{k}` | `{SHARED[k]}` |")
    lines += [
        "",
        "Also shared, and therefore not overridable: every semantic **role name**, the type",
        "scale and families, the spacing and radius scales, the motion set, the focus treatment,",
        "the six status primitives (four states × two modes) and the two suggested colours below.",
        "",
        "## 2. Overrides — ground, accent and density only",
        "",
        "| Experience | Override values |",
        "| --- | --- |",
    ]
    for exp in OVERRIDES:
        vals = ", ".join(f"`{k}` {v}" for k, v in sorted(OVERRIDES[exp].items()))
        lines.append(f"| {EXPERIENCE_META[exp][0]} — {EXPERIENCE_META[exp][1]} | {vals} |")
    lines += [
        "",
        "An override may not introduce a role, a type step, a radius, a state colour or a font.",
        "",
        "## 3. Density, the one scale an experience may touch",
        "",
        "| Experience | space-scale | measure | radius-base |",
        "| --- | --- | --- | --- |",
    ]
    for exp in OVERRIDES:
        d = DENSITY[exp]
        lines.append(f"| {EXPERIENCE_META[exp][0]} | {d['space-scale']} | {d['measure']} | `{d['radius-base']}` |")
    lines += [
        "",
        "## 4. Why this reads as one company",
        "",
        "1. One logo, one mark, one lockup — from a single source in `14-experiences/logo/`.",
        "2. One type system; the experiences cannot choose a font.",
        "3. One neutral ink (`#14161A`) and one dark ground family across all three.",
        "4. One set of four state colours with one silhouette language, brand-wide.",
        "5. One spacing, radius and motion scale. Only the accent and the ground move.",
        "6. The two suggested colours (`#ABABA1`, `#ABEBA1`) are shared primitives, so they",
        "   cannot drift into per-experience approximations.",
        "",
    ]
    (VAL / "shared-vs-override.md").write_text("\n".join(lines), encoding="utf-8")

    print(f"tokens: shared + {len(OVERRIDES)} experiences")
    print(f"required pairs={total} failures={failures}")
    print(f"wrote {SHARED_DIR.relative_to(ROOT)}/*.json|css and {VAL.relative_to(ROOT)}/*.md")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
