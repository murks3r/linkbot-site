#!/usr/bin/env python3
"""Linkbot Brand OS — inspectable specimens.

One self-contained HTML specimen per candidate direction plus the PROPOSED
direction. Each specimen demonstrates, on the same page:
  * light and dark rendering (toggle, plus prefers-color-scheme default)
  * logo at 16 / 24 / 32 / 48 px, monochrome, horizontal and stacked lockups
  * palette with hex values, typography hierarchy, status + evidence vocabulary
  * components: actions, fields, focus ring, receipts, evidence rows
  * motion with a reduced-motion fallback
  * the same product presented to Talent, Employer/HR and Agency
  * a logo misuse sheet for the proposed direction

No runtime file is touched. Open the HTML directly; it works offline with
font fallbacks and fully with the network available.

Run: python3 scripts/gen_specimens.py
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gen_logos import MARKS, STYLES, wordmark  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SPEC = ROOT / "11-templates" / "specimens"
LOGO = ROOT / "04-logo"
VERSION = (ROOT / "VERSION").read_text(encoding="utf-8").strip()

FONT_LINK = (
    "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700"
    "&family=Inter:wght@300..700&family=JetBrains+Mono:wght@400;500"
    "&family=Space+Grotesk:wght@400..700&family=Public+Sans:wght@300..800"
    "&family=IBM+Plex+Mono:wght@400;500&display=swap"
)

# direction -> role palette + typography
D = {
    "A-notarial": {
        "name": "Notarial",
        "thesis": "Editorial authority. Linkbot keeps the record; the record is the brand.",
        "light": {
            "canvas": "#F4F1EA", "surface": "#FDFCF9", "alt": "#EAE4D8", "text": "#14161A",
            "muted": "#565C63", "brand": "#1D5B45", "onbrand": "#F4F1EA", "link": "#1D5B45",
            "border": "#D9D3C5", "control": "#90897A", "granted": "#1D5B45",
            "pending": "#8A5B00", "denied": "#8E2F2F", "unknown": "#565C63", "focus": "#1D5B45",
        },
        "dark": {
            "canvas": "#0E1013", "surface": "#181B1F", "alt": "#111417", "text": "#E9E4D8",
            "muted": "#A9A395", "brand": "#4FBE92", "onbrand": "#0E1013", "link": "#4FBE92",
            "border": "#2A2E33", "control": "#65686C", "granted": "#4FBE92",
            "pending": "#D9A93F", "denied": "#E08880", "unknown": "#A9A395", "focus": "#4FBE92",
        },
        "fontDisplay": '"Fraunces", "Iowan Old Style", Georgia, serif',
        "fontText": '"Inter", ui-sans-serif, system-ui, sans-serif',
        "fontMono": '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
        "radius": "2px",
        "rule": "1px solid",
        "measure": "34rem",
    },
    "B-protocol": {
        "name": "Protocol",
        "thesis": "Infrastructure honesty. The state is the interface; UNKNOWN is never rounded up.",
        "light": {
            "canvas": "#F7F9FA", "surface": "#FFFFFF", "alt": "#EDF1F3", "text": "#0B0F12",
            "muted": "#5A6A74", "brand": "#0A6B41", "onbrand": "#FFFFFF", "link": "#0D5B77",
            "border": "#C9D3D9", "control": "#899094", "granted": "#0A6B41",
            "pending": "#7A5400", "denied": "#A32A2A", "unknown": "#5A6A74", "focus": "#0D5B77",
        },
        "dark": {
            "canvas": "#06080B", "surface": "#0C1014", "alt": "#131A20", "text": "#D6E0E6",
            "muted": "#86959F", "brand": "#3BE08C", "onbrand": "#06080B", "link": "#59C8F5",
            "border": "#22303A", "control": "#506472", "granted": "#3BE08C",
            "pending": "#F0B429", "denied": "#FF7A7A", "unknown": "#86959F", "focus": "#59C8F5",
        },
        "fontDisplay": '"Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif',
        "fontText": '"Inter", ui-sans-serif, system-ui, sans-serif',
        "fontMono": '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
        "radius": "0px",
        "rule": "1px solid",
        "measure": "36rem",
    },
    "C-commons": {
        "name": "Commons",
        "thesis": "Plain public utility. Every state readable without colour, at any size.",
        "light": {
            "canvas": "#F6F8F9", "surface": "#FFFFFF", "alt": "#EDF2F4", "text": "#172125",
            "muted": "#4E5C64", "brand": "#245C73", "onbrand": "#FFFFFF", "link": "#245C73",
            "border": "#DCE3E6", "control": "#87959D", "granted": "#146B4A",
            "pending": "#8A5B00", "denied": "#A3352B", "unknown": "#5A6B73", "focus": "#1B4658",
        },
        "dark": {
            "canvas": "#0F1417", "surface": "#161C20", "alt": "#1B2226", "text": "#E7EDEF",
            "muted": "#9BAAB2", "brand": "#7FC4DC", "onbrand": "#0F1417", "link": "#7FC4DC",
            "border": "#2A343A", "control": "#5E6E77", "granted": "#5FC79B",
            "pending": "#E0B054", "denied": "#F0928A", "unknown": "#9BAAB2", "focus": "#7FC4DC",
        },
        "fontDisplay": '"Public Sans", "Inter", ui-sans-serif, system-ui, sans-serif',
        "fontText": '"Public Sans", "Inter", ui-sans-serif, system-ui, sans-serif',
        "fontMono": '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace',
        "radius": "4px",
        "rule": "1px solid",
        "measure": "38rem",
    },
}

# Role demonstrations — same product truths, different voice per direction.
ROLES = {
    "A-notarial": {
        "talent": (
            "The record you keep",
            "You hold a private, versioned record of who you are. An employer asks for one bounded "
            "signal — eligible for senior engineering, willing to relocate to Berlin, available in 90 "
            "days. You answer yes, no, or not now. Nothing is broadcast. No public URL exists to be "
            "indexed.",
            ["Your context stays private until you confirm it", "One request, one decision, one receipt"],
        ),
        "employer": (
            "The request you make",
            "You may request a bounded signal from a person who has declared it. You cannot browse a "
            "pool. An Opportunity is not a Match. A disclosure is not an application. Your membership "
            "is role-bound, and your workspace shows only what was authorised for you.",
            ["No aggregator. No scraped inventory.", "Every read you make is recorded"],
        ),
        "agency": (
            "The mandate you serve",
            "Run Linkbot alongside your existing ATS and CRM. One mandate, several bounded "
            "introductions. Requirements render as met, unknown or unmet. A hard unmet requirement "
            "blocks the action; an unknown requirement is shortlisted for verification — never shown "
            "as verified.",
            ["Unknown is never presented as satisfied", "No predictive hiring score is implied"],
        ),
    },
    "B-protocol": {
        "talent": (
            "PRIVATE_STATE — subject",
            "Rows: claims, evidence, intents, authorities, receipts. Authority for one bounded field "
            "set, one recipient, one purpose, one version. Absent stays absent. Null stays null. "
            "UNKNOWN stays UNKNOWN.",
            ["claims[] confirmed only when reviewed or edited", "unresolved stays proposed"],
        ),
        "employer": (
            "EVALUATION — bounded batch",
            "You hold computation authority for one leased evaluation, not for a pool. The projection "
            "carries only allowlisted fields. A descriptor is never accepted as proof of "
            "authorisation.",
            ["purpose: recruiting_opportunity_evaluation", "denied: unknown evaluator or domain"],
        ),
        "agency": (
            "MANDATE — introduction set",
            "One mandate, several independent introductions. Each candidate carries met / unknown / "
            "unmet per requirement. Ordering comes from hard failures, unresolved requirements and "
            "preferred evidence — not from a predictive score.",
            ["hard failure blocks", "unknown shortlists for verification only"],
        ),
    },
    "C-commons": {
        "talent": (
            "You decide who sees what",
            "Your record is private. When someone asks to see a specific signal, you see who is asking, "
            "what they asked for, and for how long. You can say yes, say no, or ask to see the request "
            "in more detail before answering.",
            ["Nothing is published, scraped or quietly indexed", "You can revoke future access at any time"],
        ),
        "employer": (
            "You ask, the person decides",
            "You describe the signal you need. The person decides whether to release it. You cannot "
            "browse a pool or contact anyone who has not answered. An opportunity is not a match; a "
            "shared signal is not an application.",
            ["Role-bound access, never a shared login", "Every access is written to your history"],
        ),
        "agency": (
            "Your process, plus permission",
            "Linkbot sits alongside the ATS and CRM you already run. Take one mandate and work it with "
            "introductions that carry their own evidence. Requirements show as met, unknown or unmet. "
            "Unknown means it still needs checking — it is never presented as verified.",
            ["One mandate at a time, in writing", "No predictive hiring score is implied"],
        ),
    },
}


def inline_svg(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def css(direction: str) -> str:
    d = D[direction]
    return f"""
*,*::before,*::after{{box-sizing:border-box}}
:root{{
  --canvas:{d['light']['canvas']};--surface:{d['light']['surface']};--alt:{d['light']['alt']};
  --text:{d['light']['text']};--muted:{d['light']['muted']};--brand:{d['light']['brand']};
  --onbrand:{d['light']['onbrand']};--link:{d['light']['link']};--border:{d['light']['border']};
  --control:{d['light']['control']};--granted:{d['light']['granted']};--pending:{d['light']['pending']};
  --denied:{d['light']['denied']};--unknown:{d['light']['unknown']};--focus:{d['light']['focus']};
  --radius:{d['radius']};
  --f-display:{d['fontDisplay']};--f-text:{d['fontText']};--f-mono:{d['fontMono']};
  color-scheme:light;
}}
[data-mode="dark"]{{
  --canvas:{d['dark']['canvas']};--surface:{d['dark']['surface']};--alt:{d['dark']['alt']};
  --text:{d['dark']['text']};--muted:{d['dark']['muted']};--brand:{d['dark']['brand']};
  --onbrand:{d['dark']['onbrand']};--link:{d['dark']['link']};--border:{d['dark']['border']};
  --control:{d['dark']['control']};--granted:{d['dark']['granted']};--pending:{d['dark']['pending']};
  --denied:{d['dark']['denied']};--unknown:{d['dark']['unknown']};--focus:{d['dark']['focus']};
  color-scheme:dark;
}}
html,body{{margin:0;padding:0}}
body{{background:var(--canvas);color:var(--text);font-family:var(--f-text);line-height:1.6;
  -webkit-font-smoothing:antialiased}}
a{{color:var(--link)}}
svg{{max-width:100%;height:auto}}
:focus-visible{{outline:var(--lb-fw,2px) solid var(--focus);outline-offset:2px}}
.wrap{{max-width:1120px;margin:0 auto;padding:0 24px}}
.bar{{position:sticky;top:0;z-index:5;background:var(--canvas);border-bottom:{d['rule']} var(--border);
  display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 24px}}
.bar .lockup svg{{height:26px;width:auto;display:block;color:var(--text)}}
.modes{{display:flex;gap:6px}}
.modes button{{font:inherit;font-size:11px;letter-spacing:.1em;text-transform:uppercase;
  padding:7px 12px;border:{d['rule']} var(--control);border-radius:var(--radius);background:transparent;
  color:var(--text);cursor:pointer}}
.modes button[aria-pressed="true"]{{background:var(--brand);color:var(--onbrand);border-color:var(--brand)}}
section{{padding:56px 0;border-bottom:{d['rule']} var(--border)}}
h1,h2,h3{{font-family:var(--f-display);font-weight:400;letter-spacing:-.02em;line-height:1.08;margin:0}}
h1{{font-size:clamp(2rem,4.4vw,3.1rem)}}
h2{{font-size:clamp(1.4rem,2.4vw,2rem)}}
h3{{font-size:1.15rem}}
.eyebrow{{font-family:var(--f-mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--muted);margin:0 0 12px}}
.lede{{font-size:1.08rem;color:var(--muted);max-width:{d['measure']}}}
.roles{{display:grid;gap:1px;background:var(--border);border:{d['rule']} var(--border);
  border-radius:var(--radius);overflow:hidden;grid-template-columns:repeat(3,1fr)}}
@media(max-width:820px){{.roles{{grid-template-columns:1fr}}}}
.role{{background:var(--surface);padding:28px}}
.role .tag{{font-family:var(--f-mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--brand)}}
.role ul{{margin:14px 0 0;padding-left:18px;font-size:.92rem;color:var(--muted)}}
.role p{{font-size:.95rem;color:var(--text);opacity:.9}}
.grid{{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(210px,1fr))}}
.card{{background:var(--surface);border:{d['rule']} var(--border);border-radius:var(--radius);padding:20px}}
.logo{{display:flex;align-items:center;gap:6px;color:var(--text)}}
.logo svg{{display:block;color:inherit}}
.swatch{{border:{d['rule']} var(--border);border-radius:var(--radius);overflow:hidden;background:var(--surface)}}
.swatch .chip{{height:64px}}
.swatch .meta{{padding:10px 12px;font-family:var(--f-mono);font-size:11px;line-height:1.5}}
.swatch .meta b{{display:block;font-family:var(--f-text);font-size:12px;letter-spacing:.02em}}
.type-row{{display:grid;grid-template-columns:150px 1fr;gap:16px;align-items:baseline;
  padding:14px 0;border-bottom:{d['rule']} var(--border)}}
.type-row .spec{{font-family:var(--f-mono);font-size:11px;color:var(--muted)}}
.mono{{font-family:var(--f-mono)}}
.tnum{{font-variant-numeric:tabular-nums}}
.status{{display:flex;align-items:center;gap:10px;padding:12px 14px;border:{d['rule']} var(--border);
  border-radius:var(--radius);background:var(--surface);font-size:.92rem}}
.glyph{{width:20px;height:20px;flex:0 0 20px;display:grid;place-items:center}}
.dot{{width:10px;height:10px;border-radius:50%}}
.ring{{width:14px;height:14px;border-radius:50%;border:2px solid currentColor}}
.sq{{width:13px;height:13px;border:2px solid currentColor}}
.tri{{width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;
  border-bottom:11px solid currentColor}}
.btn{{font:inherit;font-size:.92rem;font-weight:500;padding:11px 18px;border-radius:var(--radius);
  cursor:pointer;border:1px solid transparent;display:inline-flex;align-items:center;gap:8px}}
.btn.primary{{background:var(--brand);color:var(--onbrand)}}
.btn.secondary{{background:transparent;color:var(--text);border-color:var(--control)}}
.btn.quiet{{background:transparent;color:var(--link);text-decoration:underline;text-underline-offset:3px}}
.field{{display:block;margin-top:14px}}
.field span{{display:block;font-family:var(--f-mono);font-size:11px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--muted);margin-bottom:6px}}
.field input{{font:inherit;width:100%;padding:12px 14px;background:var(--surface);color:var(--text);
  border:{d['rule']} var(--control);border-radius:var(--radius)}}
.receipt{{border:{d['rule']} var(--border);border-left:3px solid var(--brand);
  background:var(--surface);border-radius:var(--radius);padding:16px;font-family:var(--f-mono);font-size:12px}}
.tbl{{width:100%;border-collapse:collapse;font-size:.92rem}}
.tbl th,.tbl td{{text-align:left;padding:10px 12px;border-bottom:{d['rule']} var(--border)}}
.tbl th{{font-family:var(--f-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--muted)}}
.pulse{{transition:transform var(--lb-dur,240ms) cubic-bezier(.2,.7,.2,1),
  box-shadow var(--lb-dur,240ms) cubic-bezier(.2,.7,.2,1)}}
.pulse.on{{transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,0,0,.28)}}
.note{{font-size:.85rem;color:var(--muted)}}
.chipset{{display:flex;gap:10px;align-items:center;margin-top:12px;flex-wrap:wrap}}
.chip{{display:inline-grid;place-items:center;width:56px;height:56px;border-radius:var(--radius)}}
.chip-paper{{background:#F4F1EA;color:#14161A}}
.chip-ink{{background:#14161A;color:#F4F1EA}}
.chip-loose{{background:#F4F1EA;color:#14161A}}
.proposed{{display:inline-flex;gap:8px;align-items:center;border:2px dashed var(--brand);
  color:var(--brand);font-family:var(--f-mono);font-size:11px;letter-spacing:.18em;padding:6px 12px;
  border-radius:var(--radius)}}
@media (prefers-reduced-motion: reduce){{
  *{{transition-duration:.001ms !important;animation-duration:.001ms !important}}
  .pulse.on{{transform:none;box-shadow:none;outline:2px solid var(--focus)}}
}}
"""


def body_html(direction: str) -> str:
    d = D[direction]
    mark = inline_svg(LOGO / direction / "mark.svg")
    favicon = inline_svg(LOGO / direction / "favicon.svg")
    horiz = inline_svg(LOGO / direction / "lockup-horizontal.svg")
    stack = inline_svg(LOGO / direction / "lockup-stacked.svg")
    words = inline_svg(LOGO / direction / "wordmark-monoline.svg")
    mono = inline_svg(LOGO / direction / "mark-monochrome.svg")
    appicon = inline_svg(LOGO / direction / "app-icon.svg")
    appicon_inv = inline_svg(LOGO / direction / "app-icon-inverse.svg")
    r = ROLES[direction]
    proposed = (
        '<p style="margin-top:18px"><span class="proposed">PROPOSED · NOT APPROVED</span></p>'
        if direction == "A-notarial"
        else ""
    )
    return f"""
<header class="bar">
  <div class="lockup" aria-label="Linkbot lockup">{horiz}</div>
  <div class="modes" role="group" aria-label="Colour mode">
    <button type="button" data-mode-btn="light" aria-pressed="true">Light</button>
    <button type="button" data-mode-btn="dark" aria-pressed="false">Dark</button>
    <button type="button" data-mode-btn="system" aria-pressed="false">System</button>
  </div>
</header>

<main class="wrap">

  <section>
    <p class="eyebrow">Direction {direction[0]} — {d['name']} · Linkbot Brand OS v{VERSION} · candidate, not approved</p>
    <h1>{d['thesis']}</h1>
    <p class="lede">One platform, three experiences. The same identity is shown below as Talent,
      Employer/HR and Agency see it. Copy preserves the product's actual semantics: an Opportunity is
      not a Match, a disclosure is not an application, and UNKNOWN is never rounded up.</p>
    {proposed}
  </section>

  <section aria-labelledby="roles-h">
    <p class="eyebrow">Audience demonstration</p>
    <h2 id="roles-h">Talent · Employer/HR · Agency</h2>
    <div class="roles">
      <article class="role"><p class="tag">Talent</p><h3>{r['talent'][0]}</h3>
        <p>{r['talent'][1]}</p><ul>{''.join(f'<li>{x}</li>' for x in r['talent'][2])}</ul></article>
      <article class="role"><p class="tag">Employer / HR</p><h3>{r['employer'][0]}</h3>
        <p>{r['employer'][1]}</p><ul>{''.join(f'<li>{x}</li>' for x in r['employer'][2])}</ul></article>
      <article class="role"><p class="tag">Agency</p><h3>{r['agency'][0]}</h3>
        <p>{r['agency'][1]}</p><ul>{''.join(f'<li>{x}</li>' for x in r['agency'][2])}</ul></article>
    </div>
    <p class="note" style="margin-top:14px">Illustrative compositions using real brand assets. Nothing
      here is a product screen and no capability is claimed beyond the documented product truths.</p>
  </section>

  <section aria-labelledby="logo-h">
    <p class="eyebrow">Logo system</p>
    <h2 id="logo-h">Small sizes and lockups</h2>
    <div class="grid">
      <div class="card"><p class="mono note">16 px · 24 px · 32 px · 48 px</p>
        <div class="logo" style="gap:16px;margin-top:12px">
          <span style="width:16px;height:16px">{favicon.replace('width="32" height="32"','width="16" height="16"')}</span>
          <span style="width:24px;height:24px">{favicon.replace('width="32" height="32"','width="24" height="24"')}</span>
          <span style="width:32px;height:32px">{favicon.replace('width="32" height="32"','width="32" height="32"')}</span>
          <span style="width:48px;height:48px">{mark.replace('width="32" height="32"','width="48" height="48"')}</span>
        </div></div>
      <div class="card"><p class="mono note">Mark · wordmark</p>
        <div style="margin-top:12px">{mark.replace('width="32" height="32"','width="40" height="40"')}</div>
        <div style="margin-top:16px">{words}</div></div>
      <div class="card"><p class="mono note">Horizontal lockup</p><div style="margin-top:12px">{horiz}</div></div>
      <div class="card"><p class="mono note">Stacked lockup</p><div style="margin-top:12px">{stack}</div></div>
      <div class="card"><p class="mono note">Single colour on paper and on ink</p>
        <div class="chipset">
          <span class="chip chip-paper">{mark.replace('width="32" height="32"','width="28" height="28"')}</span>
          <span class="chip chip-ink">{mark.replace('width="32" height="32"','width="28" height="28"')}</span>
          <span class="chip chip-paper chip-loose">{mono.replace('width="32" height="32"','width="24" height="24"')}</span>
        </div></div>
      <div class="card"><p class="mono note">App plate, ink and inverse</p>
        <div class="chipset">
          <span style="width:56px;height:56px">{appicon.replace('width="64" height="64"','width="56" height="56"')}</span>
          <span style="width:56px;height:56px">{appicon_inv.replace('width="64" height="64"','width="56" height="56"')}</span>
        </div></div>
    </div>
  </section>

  <section aria-labelledby="colour-h">
    <p class="eyebrow">Colour system</p>
    <h2 id="colour-h">Semantic palette, {d['name']}</h2>
    <div class="grid" id="swatches"></div>
    <p class="note" style="margin-top:14px">Every text and control pair in this system is computed
      against WCAG 2.1 — see <span class="mono">validation/contrast-report.md</span> in this folder for
      the exact ratios. Status is never carried by colour alone.</p>
  </section>

  <section aria-labelledby="type-h">
    <p class="eyebrow">Typography</p>
    <h2 id="type-h">Hierarchy</h2>
    <div class="type-row"><span class="spec mono">display / 40</span>
      <span style="font-family:var(--f-display);font-size:40px;line-height:1.05;letter-spacing:-.03em">Private by default</span></div>
    <div class="type-row"><span class="spec mono">headline / 28</span>
      <span style="font-family:var(--f-display);font-size:28px;line-height:1.1">Permissioned, not published</span></div>
    <div class="type-row"><span class="spec mono">body / 17</span>
      <span style="max-width:38rem">An employer asks for one bounded signal. You decide whether to
        release it. Revoking stops future access; it does not claim that delivered copies were erased.</span></div>
    <div class="type-row"><span class="spec mono">label / 11 mono</span>
      <span class="mono" style="letter-spacing:.16em;text-transform:uppercase">Claims · Evidence · Authority · Receipts</span></div>
    <div class="type-row"><span class="spec mono">numeric / tabular</span>
      <span class="mono tnum">0123456789 · 90 days · v3 · 4.5:1</span></div>
  </section>

  <section aria-labelledby="state-h">
    <p class="eyebrow">State vocabulary</p>
    <h2 id="state-h">Four states, four carriers</h2>
    <div class="grid">
      <div class="status"><span class="glyph" style="color:var(--granted)"><span class="sq"></span></span>
        <span><b>Confirmed</b> · reviewed by the holder</span></div>
      <div class="status"><span class="glyph" style="color:var(--pending)"><span class="tri"></span></span>
        <span><b>Proposed</b> · not yet confirmed</span></div>
      <div class="status"><span class="glyph" style="color:var(--unknown)"><span class="ring"></span></span>
        <span><b>Unknown</b> · never rendered as satisfied</span></div>
      <div class="status"><span class="glyph" style="color:var(--denied)"><span class="dot"></span></span>
        <span><b>Denied</b> · explicit negative</span></div>
    </div>
    <div class="grid" style="margin-top:20px">
      <div class="receipt">RECEIPT · disclosure #A14<br>recipient: verified employer<br>
        fields: seniority, employment_country, availability<br>policy: standing v3 · condition: native job<br>
        recorded: 2026-10-09T09:14Z · revocable for future use</div>
      <div class="card"><table class="tbl">
        <caption class="note" style="text-align:left;padding-bottom:8px">Requirement view (agency mandate)</caption>
        <tr><th>Requirement</th><th>State</th></tr>
        <tr><td>Senior backend, 5y+</td><td>met</td></tr>
        <tr><td>EU work authorisation</td><td>unknown → verify</td></tr>
        <tr><td>Willing to relocate</td><td>unmet → blocked</td></tr>
      </table></div>
    </div>
  </section>

  <section aria-labelledby="comp-h">
    <p class="eyebrow">Components</p>
    <h2 id="comp-h">Actions and inputs</h2>
    <div class="grid">
      <div class="card"><div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn primary" type="button">Request one signal</button>
        <button class="btn secondary" type="button">See the request</button>
        <button class="btn quiet" type="button">Not now</button></div>
        <p class="note" style="margin-top:12px">One primary action per task. Destructive and
          restart actions are quiet.</p></div>
      <div class="card"><label class="field"><span>Signal requested</span>
        <input value="eligible for senior engineering" readonly /></label>
        <p class="note" style="margin-top:10px">Control borders meet 3:1 against their surface.</p></div>
      <div class="card"><p class="note">Keyboard focus</p>
        <button class="btn secondary" type="button" style="margin-top:10px">Focus me</button>
        <p class="note" style="margin-top:10px">Focus ring is a token; it is never removed.</p></div>
    </div>
  </section>

  <section aria-labelledby="motion-h">
    <p class="eyebrow">Motion</p>
    <h2 id="motion-h">One expressive moment</h2>
    <div class="card"><button class="btn primary pulse" type="button" id="pulseBtn">Trigger the transition</button>
      <p class="note" style="margin-top:12px">240 ms standard easing, reduced to 0 ms and replaced by a
        focus outline under <span class="mono">prefers-reduced-motion</span>. No ambient loops, no
        simulated processing.</p></div>
  </section>

  <section style="border-bottom:none">
    <p class="eyebrow">Status of this artifact</p>
    <h2>Candidate direction, not an approved identity</h2>
    <p class="lede">{d['name']} is one of three candidate directions in Linkbot Brand OS v{VERSION}.
      Nothing in this folder changes a runtime file, and no direction has been approved. The
      recommendation, with its reasoning and the decisions it leaves open, is in
      <span class="mono">02-directions/PROPOSED.md</span>.</p>
  </section>

</main>

<script>
(function(){{
  var root=document.documentElement;
  var btns=document.querySelectorAll('[data-mode-btn]');
  function apply(mode){{
    var dark = mode==='dark' || (mode==='system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.setAttribute('data-mode', dark?'dark':'light');
    btns.forEach(function(b){{ b.setAttribute('aria-pressed', String(b.dataset.modeBtn===mode)); }});
  }}
  btns.forEach(function(b){{ b.addEventListener('click', function(){{ apply(b.dataset.modeBtn); }}); }});
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(){{ 
    var cur=document.querySelector('[data-mode-btn][aria-pressed="true"]');
    if(cur && cur.dataset.modeBtn==='system') apply('system');
  }});
  apply('light');

  var swatches=[['canvas','Page background'],['surface','Card surface'],['text','Body text'],
    ['muted','Secondary text'],['brand','Brand / primary action'],['link','Link'],
    ['border','Decorative rule'],['control','Control border'],['granted','Confirmed'],
    ['pending','Proposed'],['denied','Denied'],['unknown','Unknown']];
  var host=document.getElementById('swatches');
  function paint(){{
    var cs=getComputedStyle(root);
    host.innerHTML='';
    swatches.forEach(function(p){{
      var v=cs.getPropertyValue('--'+p[0]).trim();
      var el=document.createElement('div'); el.className='swatch';
      el.innerHTML='<div class="chip" style="background:'+v+'"></div>'+
        '<div class="meta"><b>'+p[1]+'</b>--'+p[0]+'<br>'+v+'</div>';
      host.appendChild(el);
    }});
  }}
  btns.forEach(function(b){{ b.addEventListener('click', paint); }});
  paint();

  var pb=document.getElementById('pulseBtn');
  pb.addEventListener('click', function(){{
    pb.classList.add('on');
    setTimeout(function(){{ pb.classList.remove('on'); }}, 260);
  }});
}})();
</script>
"""


MISUSE = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 400" width="720" height="400"
  role="img" aria-label="Logo misuse examples"><title>Linkbot logo misuse sheet</title>
  <!-- Linkbot Brand OS v{v} — misuse sheet for the PROPOSED direction. -->
  <style>
    .lbl{{font-family:monospace;font-size:11px;letter-spacing:.12em;fill:#8E2F2F;text-transform:uppercase}}
    .ok{{font-family:monospace;font-size:11px;letter-spacing:.12em;fill:#1D5B45;text-transform:uppercase}}
    .cap{{font-family:monospace;font-size:11px;letter-spacing:.12em;fill:#565C63}}
  </style>
  <rect width="720" height="400" fill="#F4F1EA"/>
  <g transform="translate(40 40)">
    <g transform="translate(0 26) scale(0.9)">{good}</g>
    <text class="ok" x="0" y="0">correct</text>
    <text class="cap" x="0" y="140">Fixed lockup, product colour, nothing added.</text>
  </g>
  <g transform="translate(380 40)">
    <text class="lbl" x="0" y="0">stretch</text>
    <g transform="translate(0 26) scale(1.7 0.7)">{good}</g>
  </g>
  <g transform="translate(40 210)">
    <text class="lbl" x="0" y="0">recolour</text>
    <g transform="translate(0 26) scale(0.9)" color="#B4004E">{good}</g>
  </g>
  <g transform="translate(380 210)">
    <text class="lbl" x="0" y="0">effects</text>
    <g transform="translate(0 26) scale(0.9)" filter="url(#sh)">{good}</g>
  </g>
  <defs><filter id="sh"><feDropShadow dx="2" dy="3" stdDeviation="2" flood-opacity="0.6"/></filter></defs>
  <text class="cap" x="40" y="372">Also prohibited: rotating, outlining, adding shadows, placing on
    busy imagery, redrawing the mark, cropping clearspace.</text>
</svg>
"""


def write_specimen(direction: str, filename: str) -> None:
    html = (
        '<!doctype html>\n<html lang="en" data-mode="light">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f"<title>Linkbot — {D[direction]['name']} specimen (candidate)</title>\n"
        '<meta name="color-scheme" content="light dark">\n'
        f'<link rel="preconnect" href="https://fonts.googleapis.com">\n'
        f'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        f'<link rel="stylesheet" href="{FONT_LINK}">\n'
        f"<!-- Specimens work offline with local font fallbacks. No runtime asset is loaded. -->\n"
        f"<style>{css(direction)}</style>\n</head>\n<body>\n{body_html(direction)}\n</body>\n</html>\n"
    )
    (SPEC / filename).write_text(html, encoding="utf-8")
    print(f"  wrote {filename} ({len(html)} bytes)")


def write_misuse() -> None:
    body = MARKS["A-notarial"]()
    scale = 0.9
    ms = 1.0
    good = (
        f'<g transform="scale({ms})" color="#14161A">'
        + "".join(ln for ln in body.splitlines())
        + "</g>"
        f'<g transform="translate(40 8) scale(0.28)" fill="none" stroke="#14161A" stroke-width="7" '
        'stroke-linecap="round" stroke-linejoin="round">'
        + "".join(
            ln.strip()
            for ln in wordmark("A-notarial")[0].splitlines()
            if "<path" in ln
        )
        + "</g>"
    )
    out = MISUSE.replace("{v}", VERSION).replace("{good}", good)
    (LOGO / "A-notarial" / "misuse.svg").write_text(out, encoding="utf-8")
    print("  wrote 04-logo/A-notarial/misuse.svg")


def write_index() -> None:
    rows = ""
    for k in D:
        flag = " <b>(PROPOSED recommendation)</b>" if k == "A-notarial" else ""
        rows += f'<li><a href="specimen-{k}.html">{D[k]["name"]} — specimen</a>{flag}</li>'
    html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Linkbot Brand OS v{VERSION} — specimen index</title>
<style>body{{font:16px/1.6 -apple-system,system-ui,sans-serif;max-width:44rem;margin:5rem auto;padding:0 1.5rem}}
code{{background:#eee;padding:2px 5px;border-radius:3px}}h1{{font-size:1.5rem}}</style></head><body>
<h1>Linkbot Brand OS v{VERSION} — specimens</h1>
<p>Three candidate directions, none approved. Open any file directly; no build step and no server is
required. Each specimen includes light/dark modes, small-size logo checks, palette, typography, state
vocabulary, components, motion and the Talent / Employer / Agency demonstrations.</p>
<ul>{rows}</ul>
<p>Source of the recommendation: <code>02-directions/PROPOSED.md</code>. Decisions required from the
founder: <code>13-approval/founder-decision-sheet.md</code>.</p>
</body></html>
"""
    (SPEC / "index.html").write_text(html, encoding="utf-8")
    print("  wrote index.html")


if __name__ == "__main__":
    SPEC.mkdir(parents=True, exist_ok=True)
    for key in D:
        write_specimen(key, f"specimen-{key}.html")
    write_misuse()
    write_index()
    print("done")
