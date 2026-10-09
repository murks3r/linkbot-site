#!/usr/bin/env python3
"""Linkbot Type — the specimen.

Writes specimen/type-specimen.html: one self-contained page that puts the three
roles next to each other, shows the weights, the German set, punctuation and
symbols, the figures, small UI sizes, the kerning pairs, the wordmark outlined
from the typeface, and a fallback comparison.

It also labels honestly what it is: a type-design prototype under validation, not
an approved brand font. The status block is generated from the same data the gate
reads, so the page cannot claim more coverage than the binaries have.

Run: <venv>/bin/python scripts/build_specimen.py
"""
from __future__ import annotations

import sys
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from charmap import UNICODE  # noqa: E402
from glyphset import ROLES  # noqa: E402

SPEC = ROOT / "specimen"
TTF_DIR = ROOT / "fonts" / "ttf"
WOFF2 = "fonts/woff2"
VERSION = "0.1.0"

FACE_CSS = "\n".join(
    f'@font-face{{font-family:"LB{name.split("-")[0][7:]}";'
    f'src:url("../fonts/woff2/{name}.woff2") format("woff2");'
    f'font-weight:{ {"Regular":400,"Medium":500,"Bold":700}[name.split("-")[1]] };'
    f'font-display:swap}}'
    for name in ROLES
)

GERMAN = "Größe · Straße · Prüfung · Änderung · Übungsbüro · Öl · ẞ · Größenänderung"
PUNCT = ". , ; : ! ? ' \" ( ) [ ] { } — – - … • · / \\ @ & # % *"
SYMBOLS = "€ $ £ + = < > ~ ° ± × ÷ ≈ ≠ ≤ ≥ ← → ↑ ↓ ✓"
ACCENTS = "àáâãäå ç èéêë ìíîï ñ òóôõ ø ö ùúûü ýÿ Čč Šš Žž"
KERN = "AV TA Wo f. LY P, r, V. — AUTOR · Wörter · Yosemite"
FIGURES = "0,00 € · 1.234,56 € · 2026-10-09 · v3 · 4,53:1 · 90 Tage"

CSS = """
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:#F4F1EA;color:#14161A;font-family:"LBSans",system-ui;line-height:1.55}
.wrap{max-width:1180px;margin:0 auto;padding:0 20px}
section{padding:34px 0;border-bottom:1px solid #D9D3C5}
h1{font-family:"LBDisplay",Georgia,serif;font-size:clamp(1.9rem,4.4vw,3rem);line-height:1.06;
  letter-spacing:-.02em;margin:0 0 10px;font-weight:400}
h2{font-family:"LBDisplay",Georgia,serif;font-weight:400;font-size:1.5rem;margin:0 0 12px}
.k{font-family:"LBMono",ui-monospace,monospace;font-size:11px;letter-spacing:.16em;
  text-transform:uppercase;color:#565C63;margin:0 0 8px}
p{margin:0 0 .8em;max-width:38rem}
.lede{color:#565C63;font-size:1.04rem}
.row{font-size:clamp(1.4rem,3.2vw,2.4rem);line-height:1.3;margin:0 0 6px;overflow-wrap:anywhere}
.sm{font-size:16px}.xs{font-size:13px}.xxs{font-size:12px}
.mono{font-family:"LBMono",ui-monospace,monospace}
.disp{font-family:"LBDisplay",Georgia,serif}
.tnum{font-variant-numeric:tabular-nums}
table{border-collapse:collapse;width:100%;font-size:.92rem}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #D9D3C5;vertical-align:top}
th{font-family:"LBMono",ui-monospace,monospace;font-size:11px;letter-spacing:.1em;
  text-transform:uppercase;color:#565C63;font-weight:400}
.card{background:#FDFCF9;border:1px solid #D9D3C5;border-radius:2px;padding:16px;margin:0 0 14px}
.grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.svgbox{background:#FDFCF9;border:1px solid #D9D3C5;border-radius:2px;padding:20px;
  display:grid;place-items:center;color:#14161A}
.svgbox.dark{background:#0E1013;color:#F4F1EA}
.svgbox svg{max-width:100%;height:auto}
.fb{color:#565C63;font-family:"Inter","Helvetica Neue",Arial,sans-serif}
.stamp{display:inline-block;border:1px dashed #1D5B45;color:#1D5B45;
  font-family:"LBMono",ui-monospace,monospace;font-size:11px;letter-spacing:.16em;
  padding:5px 10px;border-radius:2px;text-transform:uppercase}
.notes{font-size:.86rem;color:#565C63}
.w{font-weight:400}.w5{font-weight:500}.w7{font-weight:700}
"""


def svg_from(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def stats() -> list[tuple[str, int, str, str]]:
    rows = []
    for name in ROLES:
        f = TTFont(TTF_DIR / f"{name}.ttf")
        cmap: dict[int, str] = {}
        for t in f["cmap"].tables:
            cmap.update(t.cmap)
        covered = sum(1 for cp in UNICODE.values() if cp in cmap)
        is_mono = "Mono" in name
        adv = sorted({f["hmtx"][g][0] for g in f.getGlyphOrder() if g != ".notdef"})
        rows.append((name, len(f.getGlyphOrder()), f"{covered}/{len(UNICODE)}",
                     str(adv[0]) if is_mono and len(adv) == 1 else "proportional"))
    return rows


def main() -> int:
    SPEC.mkdir(parents=True, exist_ok=True)
    rows = stats()
    table = "".join(
        f"<tr><td class='mono'>{n}</td><td class='mono tnum'>{g}</td>"
        f"<td class='mono tnum'>{c}</td><td class='mono'>{a}</td></tr>"
        for n, g, c, a in rows
    )
    html = f"""<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Linkbot Type {VERSION} — specimen (type-design prototype)</title>
<meta name="description" content="Linkbot Display / Sans / Mono — original type-design prototype, PROPOSED and not approved.">
<style>{FACE_CSS}
{CSS}</style></head>
<body><div class="wrap">

<section>
  <p class="k">Linkbot Type {VERSION} · original designs · prototype under validation</p>
  <h1>One family, three roles</h1>
  <p class="lede">Linkbot Display, Linkbot Sans and Linkbot Mono are one construction evaluated at
  three sets of parameters: the same skeletons, one contrast axis, one terminal language. They are
  original work drawn from centrelines in this repository — not a renamed existing typeface, and not
  derived from any proprietary outline.</p>
  <p><span class="stamp">Proposed · not approved</span></p>
</section>

<section>
  <p class="k">Display — editorial headings</p>
  <p class="row disp">The record is the brand</p>
  <p class="row disp" style="font-size:1.4rem">Permissioned, not published · Größe · 2026</p>
  <p class="k">Sans — jobs, descriptions, filters, product UI</p>
  <p class="row">Find work on your terms — Handwerk &amp; Ordnung</p>
  <p class="sm">An employer asks for one bounded signal. You decide whether to release it. Revoking
  stops future access; it does not claim that delivered copies were erased.</p>
  <p class="k">Mono — code, structured evidence, developer documentation</p>
  <p class="row mono" style="font-size:1.15rem">policy_version: v3 · 2026-10-09T09:14Z</p>
  <p class="sm mono">POST /v1/disclosures/{{id}}/revoke · recruiting_opportunity_evaluation</p>
</section>

<section>
  <p class="k">Weights</p>
  <div class="grid">
    <div class="card"><p class="k">Sans 400</p><p class="row w" style="font-size:1.6rem">Größe 90 Tage</p></div>
    <div class="card"><p class="k">Sans 500</p><p class="row w5" style="font-size:1.6rem">Größe 90 Tage</p></div>
    <div class="card"><p class="k">Sans 700</p><p class="row w7" style="font-size:1.6rem">Größe 90 Tage</p></div>
    <div class="card"><p class="k">Display 400</p><p class="row disp" style="font-size:1.6rem">Größe 90 Tage</p></div>
    <div class="card"><p class="k">Display 700</p><p class="row disp w7" style="font-size:1.6rem">Größe 90 Tage</p></div>
    <div class="card"><p class="k">Mono 400 / 700</p>
      <p class="row mono" style="font-size:1.3rem">v3 0123</p>
      <p class="row mono w7" style="font-size:1.3rem">v3 0123</p></div>
  </div>
</section>

<section>
  <p class="k">German — the characters that decide whether a face is usable here</p>
  <p class="row">{GERMAN}</p>
  <p class="notes">Umlauts and the dot of i and j are SQUARE — the mark's inscribed square, carried
  into the type. That is the family's most visible identifying decision.</p>
  <p class="k">Accented Latin — covered</p>
  <p class="row" style="font-size:1.5rem">{ACCENTS}</p>
  <p class="notes">Not covered, and rendered below by the fallback on purpose so the difference is
  visible: <span class="fb">Ąą Ęę Ūū Łł Ææ Œœ ^ | § © ® ™ „“” « » · 中文 · Привет</span></p>
</section>

<section>
  <p class="k">Punctuation</p>
  <p class="row" style="font-size:1.6rem">{PUNCT}</p>
  <p class="k">Symbols and UI marks</p>
  <p class="row" style="font-size:1.6rem">{SYMBOLS}</p>
  <p class="notes">Coverage is stated exactly, not implied: the gate checks every codepoint the fonts
  claim. Characters outside the set — caret, pipe, section, copyright, guillemets, ligatures, Greek,
  Cyrillic, CJK — are listed in <span class="mono">validation/coverage-report.md</span> as not
  covered and fall back to a licensed OFL face.</p>
</section>

<section>
  <p class="k">Figures — one width everywhere, so tabular alignment needs no feature</p>
  <p class="row tnum" style="font-size:1.6rem">{FIGURES}</p>
  <p class="row mono tnum" style="font-size:1.05rem">0000 1111 8888 · 12,50 € · −0,25 %</p>
</section>

<section>
  <p class="k">Small sizes — the sizes the product actually uses</p>
  <p class="sm">16 px · An employer asks for one bounded signal. Größe: 90 Tage, Prüfung ausstehend.</p>
  <p class="xs">13 px · Dense UI, table cells, filters · 4,53:1 · abgelehnt · unbekannt</p>
  <p class="xxs">12 px · Utility labels and dense evidence rows · policy v3 · 2026-10-09</p>
  <p class="xxs mono">12 px mono · disclosures/{{id}}/revoke · 09:14Z</p>
</section>

<section>
  <p class="k">Kerning — explicit pairs, compiled to GPOS</p>
  <p class="row" style="font-size:1.9rem">{KERN}</p>
  <p class="notes">The proportional faces carry 39 authored pairs. The monospaced faces carry none,
  which is correct: a fixed advance cannot be kerned without breaking the grid.</p>
</section>

<section>
  <p class="k">The wordmark, outlined from Linkbot Display</p>
  <div class="svgbox">{svg_from(ROOT / 'wordmark' / 'lockup-horizontal.svg')}</div>
  <div class="grid" style="margin-top:14px">
    <div class="svgbox">{svg_from(ROOT / 'wordmark' / 'wordmark-lower.svg')}</div>
    <div class="svgbox">{svg_from(ROOT / 'wordmark' / 'wordmark-caps.svg')}</div>
    <div class="svgbox dark">{svg_from(ROOT / 'wordmark' / 'wordmark-inverse.svg')}</div>
  </div>
  <p class="notes">Outlines, not live text, so the wordmark cannot break when a webfont fails. Because
  the project owns the typeface, this is a legitimate master rather than the concept outline the
  Brand OS had to settle for.</p>
</section>

<section>
  <p class="k">Fallback comparison — what renders if the fonts do not arrive</p>
  <p class="row fb" style="font-size:1.5rem">Größe 90 Tage · Find work on your terms</p>
  <p class="notes">The declared stack is <span class="mono">"Linkbot Sans", "Inter",
  ui-sans-serif, system-ui, sans-serif</span>. Inter, JetBrains Mono and the display fallback are
  SIL OFL 1.1, self-hostable and committed-ready; the fallback is a graceful degradation, never a
  substitute for the brand face.</p>
</section>

<section style="border-bottom:0">
  <p class="k">Status of these fonts</p>
  <h2>A validated prototype, not an approved brand font</h2>
  <table>
    <tr><th>Face</th><th>Glyphs</th><th>Codepoints</th><th>Advance</th></tr>
    {table}
  </table>
  <p class="notes" style="margin-top:12px">Everything here is <b>PROPOSED</b>. The fonts compile from
  editable UFO sources and pass the font gate in
  <span class="mono">scripts/validate_type.py</span>; they are not yet reviewed by a type designer,
  not hinted, not tested on a physical print proof, and not approved for production. Two glyphs —
  ampersand and at — are first-pass approximations and are flagged as such in the design notes.
  No runtime file consumes these fonts: the experience specimens declare them with an OFL fallback
  and no page is wired to a build pipeline yet.</p>
</section>

</div></body></html>
"""
    (SPEC / "type-specimen.html").write_text(html, encoding="utf-8")
    print(f"  wrote specimen/type-specimen.html ({len(html)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
