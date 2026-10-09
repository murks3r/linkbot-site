#!/usr/bin/env python3
"""Linkbot Brand OS — semantic design tokens + WCAG validation.

Emits, for each candidate direction and for the PROPOSED direction:
  10-tokens/<dir>.tokens.json     W3C DTCG-style token file
  10-tokens/<dir>.tokens.css      CSS custom-property export (non-applied artifact)
  10-tokens/proposed.DESIGN.md    Google DESIGN.md spec for the proposed direction

and a computed contrast report at validation/contrast-report.md.

Run: python3 scripts/gen_tokens.py
Exit code 1 if any REQUIRED pair fails its WCAG target.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOK = ROOT / "10-tokens"
VAL = ROOT / "validation"
VERSION = (ROOT / "VERSION").read_text(encoding="utf-8").strip()

# ----------------------------------------------------------------------------
# WCAG 2.1 relative luminance + contrast ratio
# ----------------------------------------------------------------------------


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


# ----------------------------------------------------------------------------
# Palettes (primitives). Every value is a candidate, not an approved asset.
# ----------------------------------------------------------------------------

PALETTES: dict[str, dict[str, str]] = {
    "A-notarial": {
        "paper": "#F4F1EA",
        "paperDeep": "#EAE4D8",
        "porcelain": "#FDFCF9",
        "ink": "#14161A",
        "inkSoft": "#33383F",
        "slate": "#565C63",
        "rule": "#D9D3C5",
        "ruleStrong": "#ABA391",
        "controlRule": "#90897A",
        "seal": "#1D5B45",
        "sealBright": "#4FBE92",
        "sealDeep": "#14402F",
        "ember": "#8A5B00",
        "oxblood": "#8E2F2F",
        "midnight": "#0E1013",
        "midnightRaised": "#181B1F",
        "midnightLine": "#2A2E33",
        "midnightControl": "#65686C",
        "moonText": "#E9E4D8",
        "moonDim": "#A9A395",
    },
    "B-protocol": {
        "void": "#06080B",
        "panel": "#0C1014",
        "raised": "#131A20",
        "line": "#22303A",
        "lineStrong": "#425867",
        "lineControl": "#506472",
        "text": "#D6E0E6",
        "dim": "#86959F",
        "phosphor": "#3BE08C",
        "phosphorDeep": "#0A6B41",
        "cyan": "#59C8F5",
        "amber": "#F0B429",
        "red": "#FF7A7A",
        "white": "#F7F9FA",
        "ink": "#0B0F12",
        "lightLine": "#C9D3D9",
        "lightControl": "#899094",
        "lightDim": "#5A6A74",
    },
    "C-commons": {
        "white": "#FFFFFF",
        "canvas": "#F6F8F9",
        "ink": "#172125",
        "slate": "#4E5C64",
        "line": "#DCE3E6",
        "controlLine": "#87959D",
        "ocean": "#245C73",
        "oceanDeep": "#1B4658",
        "granted": "#146B4A",
        "pending": "#8A5B00",
        "denied": "#A3352B",
        "unknown": "#5A6B73",
        "darkCanvas": "#0F1417",
        "darkSurface": "#161C20",
        "darkLine": "#2A343A",
        "darkControlLine": "#5E6E77",
        "darkText": "#E7EDEF",
        "darkDim": "#9BAAB2",
        "oceanBright": "#7FC4DC",
    },
}

# For each direction: (foreground token, background token, required ratio, label)
REQUIRED: dict[str, list[tuple[str, str, float, str]]] = {
    "A-notarial": [
        ("ink", "paper", 4.5, "body text on paper"),
        ("ink", "porcelain", 4.5, "body text on porcelain"),
        ("slate", "paper", 4.5, "secondary text on paper"),
        ("seal", "paper", 4.5, "brand text/link on paper"),
        ("seal", "porcelain", 4.5, "brand text on porcelain"),
        ("ember", "paper", 4.5, "pending status text on paper"),
        ("oxblood", "paper", 4.5, "denied status text on paper"),
        ("paper", "seal", 4.5, "paper text on seal button"),
        ("moonText", "midnight", 4.5, "body text on midnight"),
        ("moonDim", "midnight", 4.5, "secondary text on midnight"),
        ("sealBright", "midnight", 4.5, "accent on midnight"),
        ("midnight", "sealBright", 4.5, "midnight text on accent fill (dark mode CTA)"),
        ("controlRule", "paper", 3.0, "control border on paper (1.4.11)"),
        ("midnightControl", "midnight", 3.0, "control border on midnight (1.4.11)"),
    ],
    "B-protocol": [
        ("text", "void", 4.5, "body text on void"),
        ("text", "panel", 4.5, "body text on panel"),
        ("dim", "void", 4.5, "secondary text on void"),
        ("phosphor", "void", 4.5, "brand accent on void"),
        ("cyan", "void", 4.5, "info status on void"),
        ("amber", "void", 4.5, "pending status on void"),
        ("red", "void", 4.5, "denied status on void"),
        ("void", "phosphor", 4.5, "void text on phosphor fill"),
        ("void", "cyan", 4.5, "void text on cyan fill"),
        ("ink", "white", 4.5, "body text on light surface"),
        ("phosphorDeep", "white", 4.5, "brand accent on light surface"),
        ("lightDim", "white", 4.5, "secondary text on light surface"),
        ("lineControl", "void", 3.0, "control border on void (1.4.11)"),
        ("lightControl", "white", 3.0, "control border on light surface (1.4.11)"),
    ],
    "C-commons": [
        ("ink", "white", 4.5, "body text on white"),
        ("ink", "canvas", 4.5, "body text on canvas"),
        ("slate", "white", 4.5, "secondary text on white"),
        ("ocean", "white", 4.5, "brand text/link on white"),
        ("ocean", "canvas", 4.5, "brand text on canvas"),
        ("granted", "white", 4.5, "granted status on white"),
        ("pending", "white", 4.5, "pending status on white"),
        ("denied", "white", 4.5, "denied status on white"),
        ("unknown", "white", 4.5, "unknown status on white"),
        ("white", "ocean", 4.5, "white text on ocean button"),
        ("darkText", "darkCanvas", 4.5, "body text on dark canvas"),
        ("darkDim", "darkCanvas", 4.5, "secondary text on dark canvas"),
        ("oceanBright", "darkCanvas", 4.5, "brand accent on dark canvas"),
        ("darkCanvas", "oceanBright", 4.5, "dark text on bright accent fill"),
        ("controlLine", "white", 3.0, "control border on white (1.4.11)"),
        ("darkControlLine", "darkCanvas", 3.0, "control border on dark canvas (1.4.11)"),
    ],
}

# ----------------------------------------------------------------------------
# Semantic layer: which primitive plays which role.
# ----------------------------------------------------------------------------
SEMANTIC: dict[str, dict[str, str]] = {
    "A-notarial": {
        "canvas": "paper",
        "surface": "porcelain",
        "surface-sunken": "paperDeep",
        "text": "ink",
        "text-muted": "slate",
        "text-on-dark": "moonText",
        "brand": "seal",
        "brand-contrast": "paper",
        "link": "seal",
        "border-subtle": "rule",
        "border-control": "ruleStrong",
        "status-granted": "seal",
        "status-pending": "ember",
        "status-denied": "oxblood",
        "status-unknown": "slate",
        "focus": "seal",
    },
    "B-protocol": {
        "canvas": "void",
        "surface": "panel",
        "surface-raised": "raised",
        "text": "text",
        "text-muted": "dim",
        "brand": "phosphor",
        "brand-contrast": "void",
        "link": "cyan",
        "border-subtle": "line",
        "border-control": "lineStrong",
        "status-granted": "phosphor",
        "status-pending": "amber",
        "status-denied": "red",
        "status-unknown": "dim",
        "focus": "cyan",
    },
    "C-commons": {
        "canvas": "canvas",
        "surface": "white",
        "text": "ink",
        "text-muted": "slate",
        "brand": "ocean",
        "brand-contrast": "white",
        "link": "ocean",
        "border-subtle": "line",
        "border-control": "controlLine",
        "status-granted": "granted",
        "status-pending": "pending",
        "status-denied": "denied",
        "status-unknown": "unknown",
        "focus": "oceanDeep",
    },
}

TYPE_SCALE = [12, 13, 14, 16, 18, 20, 24, 30, 38, 48, 60, 76]
SPACE = {"3xs": 2, "2xs": 4, "xs": 8, "sm": 12, "md": 16, "lg": 24, "xl": 32, "2xl": 48, "3xl": 64, "4xl": 96}
RADIUS = {"none": 0, "xs": 2, "sm": 4, "md": 8, "lg": 12, "xl": 20, "full": 999}
MOTION = {
    "duration": {"instant": 80, "fast": 160, "base": 240, "slow": 400, "deliberate": 640},
    "easing": {
        "standard": "cubic-bezier(0.2, 0.7, 0.2, 1)",
        "entrance": "cubic-bezier(0.16, 1, 0.3, 1)",
        "exit": "cubic-bezier(0.4, 0, 1, 1)",
        "linear": "linear",
    },
}

DIRECTION_META = {
    "A-notarial": ("Notarial", "Editorial authority — the record, the receipt, the seal."),
    "B-protocol": ("Protocol", "Infrastructure honesty — the schema, the state, the boundary."),
    "C-commons": ("Commons", "Plain public utility — legibility, permission, no dark patterns."),
}


# ----------------------------------------------------------------------------
# Emitters
# ----------------------------------------------------------------------------


def dtcg(direction: str) -> dict:
    pal = PALETTES[direction]
    sem = SEMANTIC[direction]
    name, desc = DIRECTION_META[direction]

    def primitive(v: str) -> dict:
        return {"$type": "color", "$value": v}

    tokens: dict = {
        "$schema": "https://design-tokens.github.io/community-group/format/",
        "$description": (
            f"Linkbot Brand OS {VERSION} — {name} candidate direction. "
            "NOT APPROVED. Non-applied artifact: no runtime file consumes this."
        ),
        "color": {"palette": {k: primitive(v) for k, v in pal.items()}},
        "semantic": {},
        "type": {
            "family": {},
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
            "duration": {k: {"$type": "duration", "$value": f"{v}ms"} for k, v in MOTION["duration"].items()},
            "easing": {k: {"$type": "cubicBezier", "$value": v} for k, v in MOTION["easing"].items()},
        },
        "focus": {
            "ring-width": {"$type": "dimension", "$value": "2px"},
            "ring-offset": {"$type": "dimension", "$value": "2px"},
        },
    }

    for role, prim in sem.items():
        tokens["semantic"][role] = {
            "$type": "color",
            "$value": f"{{color.palette.{prim}}}",
            "$extensions": {"linkbot.primitive": prim, "$value": pal[prim]},
        }
    # focus ring colour resolves to a primitive of this direction
    focus_prim = sem["focus"]
    tokens["semantic"]["focus-ring"] = {
        "$type": "color",
        "$value": f"{{color.palette.{focus_prim}}}",
        "$extensions": {"linkbot.primitive": focus_prim, "$value": pal[focus_prim]},
    }
    return tokens


def css(direction: str, tokens: dict) -> str:
    name, _ = DIRECTION_META[direction]
    pal = PALETTES[direction]
    lines = [
        "/* Linkbot Brand OS %s — %s candidate direction." % (VERSION, name),
        " * NOT APPROVED. Non-applied artifact: generated from %s.tokens.json." % direction,
        " * No runtime file imports this file. */",
        "",
        ":root {",
        "  /* primitives */",
    ]
    for k, v in pal.items():
        lines.append(f"  --lb-{direction[0].lower()}-{_kebab(k)}: {v};")
    lines.append("")
    lines.append("  /* semantic */")
    sem = SEMANTIC[direction]
    for role, prim in list(sem.items()) + [("focus-ring", sem["focus"])]:
        lines.append(f"  --lb-{role}: var(--lb-{direction[0].lower()}-{_kebab(prim)});")
    lines.append("")
    lines.append("  /* type */")
    for s in TYPE_SCALE:
        lines.append(f"  --lb-text-{s}: {s}px;")
    lines += [
        "  --lb-leading-tight: 1.05;",
        "  --lb-leading-snug: 1.25;",
        "  --lb-leading-normal: 1.5;",
        "  --lb-tracking-tighter: -0.03em;",
        "  --lb-tracking-tight: -0.015em;",
        "  --lb-tracking-label: 0.14em;",
        "",
        "  /* space */",
    ]
    for k, v in SPACE.items():
        lines.append(f"  --lb-space-{k}: {v}px;")
    lines.append("")
    lines.append("  /* radius */")
    for k, v in RADIUS.items():
        lines.append(f"  --lb-radius-{k}: {'9999px' if k == 'full' else str(v) + 'px'};")
    lines.append("")
    lines.append("  /* motion */")
    for k, v in MOTION["duration"].items():
        lines.append(f"  --lb-duration-{k}: {v}ms;")
    for k, v in MOTION["easing"].items():
        lines.append(f"  --lb-ease-{k}: {v};")
    lines += [
        "",
        "  /* focus */",
        "  --lb-focus-width: 2px;",
        "  --lb-focus-offset: 2px;",
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
    return "\n".join(lines)


def _kebab(s: str) -> str:
    out = []
    for ch in s:
        if ch.isupper():
            out.append("-" + ch.lower())
        else:
            out.append(ch)
    return "".join(out)


# ----------------------------------------------------------------------------
# The specimens carry their own light/dark role values (D in gen_specimens.py).
# Those are part of the claim too, so they are validated here rather than
# assumed. Imported lazily so gen_tokens stays runnable on its own.
# ----------------------------------------------------------------------------

SPECIMEN_ROLE_PAIRS = [
    ("text", "canvas", 4.5, "body text on canvas"),
    ("text", "surface", 4.5, "body text on surface"),
    ("muted", "canvas", 4.5, "secondary text on canvas"),
    ("muted", "surface", 4.5, "secondary text on surface"),
    ("brand", "canvas", 4.5, "brand text on canvas"),
    ("link", "canvas", 4.5, "link on canvas"),
    ("granted", "surface", 4.5, "confirmed state on surface"),
    ("pending", "surface", 4.5, "proposed state on surface"),
    ("denied", "surface", 4.5, "denied state on surface"),
    ("unknown", "surface", 4.5, "unknown state on surface"),
    ("onbrand", "brand", 4.5, "text on the brand fill"),
    ("control", "surface", 3.0, "control border on surface (1.4.11)"),
]


def check_specimen_palettes(report: list[str]) -> int:
    try:
        sys.path.insert(0, str(Path(__file__).resolve().parent))
        from gen_specimens import D  # type: ignore
    except Exception as e:  # noqa: BLE001
        report.append(f"> Specimen palette check skipped: {e}")
        return 0
    failures = 0
    total = 0
    for direction, meta in D.items():
        for mode in ("light", "dark"):
            pal = meta[mode]
            report += [f"### {direction} — specimen {mode} mode", "",
                       "| Pair | Ratio | Target | Result |", "| --- | --- | --- | --- |"]
            for fg, bg, target, label in SPECIMEN_ROLE_PAIRS:
                r = contrast(pal[fg], pal[bg])
                total += 1
                ok = r >= target
                if not ok:
                    failures += 1
                report.append(
                    f"| `{fg}` {pal[fg]} on `{bg}` {pal[bg]} — {label} | {r:.2f}:1 "
                    f"| {target}:1 | {'PASS' if ok else '**FAIL**'} |"
                )
            report.append("")
    return total, failures  # type: ignore[return-value]


def main() -> int:
    TOK.mkdir(parents=True, exist_ok=True)
    VAL.mkdir(parents=True, exist_ok=True)

    report: list[str] = [
        "# Contrast validation report",
        "",
        f"Brand OS version: `{VERSION}` · generated by `scripts/gen_tokens.py`.",
        "All ratios are computed with the WCAG 2.1 relative-luminance formula; none are eyeballed.",
        "Body/status text target **4.5:1** (WCAG 2.1 AA, 1.4.3). Non-text control borders target",
        "**3:1** (WCAG 2.1 AA, 1.4.11).",
        "",
    ]
    failures = 0
    total = 0

    for direction in PALETTES:
        pal = PALETTES[direction]
        t = dtcg(direction)
        (TOK / f"{direction}.tokens.json").write_text(
            json.dumps(t, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )
        (TOK / f"{direction}.tokens.css").write_text(css(direction, t), encoding="utf-8")
        name, _ = DIRECTION_META[direction]
        report += [f"## {direction} — {name}", "", "| Pair | Ratio | Target | Result |", "| --- | --- | --- | --- |"]
        for fg, bg, target, label in REQUIRED[direction]:
            r = contrast(pal[fg], pal[bg])
            total += 1
            ok = r >= target
            if not ok:
                failures += 1
            report.append(
                f"| `{fg}` #{pal[fg].lstrip('#')} on `{bg}` #{pal[bg].lstrip('#')} — {label} "
                f"| {r:.2f}:1 | {target}:1 | {'PASS' if ok else '**FAIL**'} |"
            )
        report.append("")

    report += [
        "## Specimen role palettes (light and dark)",
        "",
        "The specimens define their own light/dark role values. They are part of the",
        "accessibility claim, so they are validated here rather than assumed.",
        "The `border` role is decorative and is exempt from 1.4.11; `control` is not.",
        "",
    ]
    sp_total, sp_fail = check_specimen_palettes(report)
    total += sp_total
    failures += sp_fail
    report += [
        "## Summary",
        "",
        f"- Pairs evaluated: **{total}** (token system + specimen role palettes)",
        f"- Failures: **{failures}**",
        "- Status colours are never the only carrier of meaning in the specimens: every status also",
        "  carries a text label and a distinct glyph shape (WCAG 1.4.1).",
        "- Ratios are computed from hex literals in this repository; re-run `python3 scripts/gen_tokens.py`",
        "  to reproduce.",
        "",
    ]
    (VAL / "contrast-report.md").write_text("\n".join(report), encoding="utf-8")
    print(f"tokens written for {len(PALETTES)} directions; pairs={total} failures={failures}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
