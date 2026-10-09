#!/usr/bin/env python3
"""Linkbot Brand Experiences — the five responsive experience specimens.

Writes 14-experiences/00-shared/app.css and one self-contained responsive page per
screen, plus an index:

  01-talent-jobsite/          A  Talent / Jobsite      — job search + job detail
  02-private-job-agent/       A  Talent / Jobsite      — private job-agent onboarding
  03-developer-platform/      B  Developer Platform    — API documentation + MCP
  04-employer-dashboard/      C  Employer             — hiring dashboard
  05-agency-mandate/          C  Agency               — recruiting mandate + shortlist

Every page: one shared logo, one shared type system, the shared token layer plus its
own experience theme, light and dark, EN and DE, a four-state vocabulary carried by a
colour AND a glyph AND a word, a visible focus ring, reduced-motion handling, and a
provenance strip. Copy is checked against 00-audit/product-truths.md: no apply button
for an external listing (T9), no "match" for a one-sided result (T1), unknown never
rendered as satisfied (T4), no predictive hiring score (C6), no trust badges (C3).

No product screen is claimed; each page says so on itself.

Stdlib only. Run: python3 scripts/gen_screens.py
"""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHARED = ROOT / "00-shared"
LOGO = ROOT / "logo"
VERSION = "0.1.0"

# --------------------------------------------------------------------------- css

APP_CSS = r"""
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--lb-canvas);color:var(--lb-text);
  font-family:var(--lb-font-sans);font-size:16px;line-height:1.6;
  -webkit-font-smoothing:antialiased}
svg{max-width:100%;height:auto}
img{max-width:100%}
a{color:var(--lb-link);text-decoration-thickness:1px;text-underline-offset:3px}
h1,h2,h3,h4{font-family:var(--lb-font-display);font-weight:400;letter-spacing:-.02em;
  line-height:1.1;margin:0}
h1{font-size:clamp(1.7rem,4vw,2.6rem)}
h2{font-size:clamp(1.25rem,2.2vw,1.7rem)}
h3{font-size:1.05rem}
p{margin:0 0 1em}
.mono{font-family:var(--lb-font-mono)}
.tnum{font-variant-numeric:tabular-nums}
:focus-visible{outline:var(--lb-focus-width) solid var(--lb-focus);outline-offset:var(--lb-focus-offset)}
.wrap{max-width:1180px;margin:0 auto;padding:0 var(--lb-space-md)}
.skip{position:absolute;left:-9999px}
.skip:focus{left:8px;top:8px;z-index:20;background:var(--lb-surface);padding:8px 12px;border-radius:var(--lb-radius-xs)}

/* topbar ------------------------------------------------------------- */
.topbar{position:sticky;top:0;z-index:10;background:var(--lb-canvas);
  border-bottom:1px solid var(--lb-border-subtle);
  display:flex;align-items:center;gap:var(--lb-space-sm);justify-content:space-between;
  padding:12px var(--lb-space-md);flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:14px;min-width:0}
.brand .lockup svg{height:24px;width:auto;display:block;color:var(--lb-text)}
.brand .who{font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--lb-text-muted);white-space:nowrap}
.ctrls{display:flex;gap:8px;flex-wrap:wrap}
.seg{display:flex;gap:4px}
.seg button{font:inherit;font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.08em;
  text-transform:uppercase;padding:6px 10px;border:1px solid var(--lb-border-control);
  border-radius:var(--lb-radius-xs);background:transparent;color:var(--lb-text);cursor:pointer}
.seg button[aria-pressed="true"]{background:var(--lb-brand);color:var(--lb-brand-contrast);
  border-color:var(--lb-brand)}

/* layout ------------------------------------------------------------- */
main{padding:var(--lb-space-xl) 0}
section{padding:var(--lb-space-lg) 0}
section+section{border-top:1px solid var(--lb-border-subtle)}
.kicker{font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.18em;
  text-transform:uppercase;color:var(--lb-text-muted);margin:0 0 10px}
.lede{font-size:1.05rem;color:var(--lb-text-muted);max-width:var(--lb-measure)}
.cols{display:grid;gap:var(--lb-space-md);grid-template-columns:280px 1fr}
.cols-wide{display:grid;gap:var(--lb-space-md);grid-template-columns:200px 1fr}
@media(max-width:900px){.cols,.cols-wide{grid-template-columns:1fr}}
.grid{display:grid;gap:var(--lb-space-md);grid-template-columns:repeat(auto-fit,minmax(230px,1fr))}
.grid-2{display:grid;gap:var(--lb-space-md);grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}

/* surfaces ----------------------------------------------------------- */
.card{background:var(--lb-surface);border:1px solid var(--lb-border-subtle);
  border-radius:var(--lb-radius-sm);padding:var(--lb-space-md)}
.card.sunken{background:var(--lb-surface-sunken)}
.card.flat{border-radius:0}
.card h3{margin-bottom:6px}
.rule{border:0;border-top:1px solid var(--lb-border-subtle);margin:var(--lb-space-md) 0}
.rule-strong{border:0;border-top:1px solid var(--lb-border-decorative-strong);
  margin:var(--lb-space-md) 0}

/* actions ------------------------------------------------------------ */
.btn{font:inherit;font-size:.94rem;font-weight:500;padding:10px 16px;cursor:pointer;
  border:1px solid transparent;border-radius:var(--lb-radius-sm);
  display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--lb-text)}
.btn.primary{background:var(--lb-brand);color:var(--lb-brand-contrast)}
.btn.secondary{border-color:var(--lb-border-control)}
.btn.quiet{color:var(--lb-link);text-decoration:underline;padding:10px 4px}
.btn[disabled]{opacity:1;color:var(--lb-text-muted);cursor:not-allowed;
  border-color:var(--lb-border-subtle)}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.stack{display:flex;flex-direction:column;gap:10px}

/* fields ------------------------------------------------------------- */
.field{display:block;margin-bottom:var(--lb-space-sm)}
.field>span{display:block;font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--lb-text-muted);margin-bottom:5px}
.field input,.field select,.field textarea{font:inherit;width:100%;padding:10px 12px;
  background:var(--lb-surface);color:var(--lb-text);
  border:1px solid var(--lb-border-control);border-radius:var(--lb-radius-xs)}
.check{display:flex;gap:9px;align-items:flex-start;font-size:.9rem;
  color:var(--lb-text-muted);margin:0 0 10px}
.check input{width:18px;height:18px;flex:0 0 18px;margin-top:2px;accent-color:var(--lb-brand)}

/* lists and tables ---------------------------------------------------- */
.list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.item{background:var(--lb-surface);border:1px solid var(--lb-border-subtle);
  border-radius:var(--lb-radius-sm);padding:14px;display:block;text-decoration:none;color:inherit}
.item[aria-current="true"]{border-color:var(--lb-brand);border-left-width:3px}
.item .top{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:baseline}
.item .meta{font-family:var(--lb-font-mono);font-size:12px;color:var(--lb-text-muted);
  display:flex;gap:12px;flex-wrap:wrap;margin-top:6px}
.item strong{font-weight:600}
.tbl{width:100%;border-collapse:collapse;font-size:.93rem}
.tbl caption{text-align:left;font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--lb-text-muted);padding-bottom:8px}
.tbl th,.tbl td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--lb-border-subtle);
  vertical-align:top}
.tbl th{font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--lb-text-muted);font-weight:400}
.tbl td.num{font-family:var(--lb-font-mono);font-variant-numeric:tabular-nums}
.scrollx{overflow-x:auto}

/* state vocabulary — colour + glyph + word --------------------------------- */
.state{display:inline-flex;align-items:center;gap:8px;font-size:.88rem}
.state .g{width:16px;height:16px;flex:0 0 16px;display:grid;place-items:center}
.sq{width:11px;height:11px;border:2px solid currentColor;display:block}
.tri{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;
  border-bottom:10px solid currentColor;display:block}
.ring{width:12px;height:12px;border-radius:50%;border:2px solid currentColor;display:block}
.dot{width:9px;height:9px;border-radius:50%;background:currentColor;display:block}
.s-granted{color:var(--lb-status-granted)}
.s-pending{color:var(--lb-status-pending)}
.s-denied{color:var(--lb-status-denied)}
.s-unknown{color:var(--lb-status-unknown)}
.state-table td:first-child{width:1%}
.tag{font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;
  border:1px solid var(--lb-border-decorative-strong);border-radius:var(--lb-radius-xs);
  padding:2px 7px;color:var(--lb-text-muted)}
.tag.mark{background:var(--lb-marker);color:var(--lb-marker-contrast);
  border-color:var(--lb-marker)}

/* receipt / evidence -------------------------------------------------- */
.receipt{border:1px solid var(--lb-border-subtle);border-left:3px solid var(--lb-brand);
  background:var(--lb-surface);border-radius:var(--lb-radius-sm);padding:14px;
  font-family:var(--lb-font-mono);font-size:12px;line-height:1.7}
.receipt dl{margin:0;display:grid;grid-template-columns:130px 1fr;gap:2px 12px}
.receipt dt{color:var(--lb-text-muted)}
.receipt dd{margin:0}

/* code ---------------------------------------------------------------- */
.code{background:var(--lb-surface-sunken);border:1px solid var(--lb-border-subtle);
  border-radius:var(--lb-radius-sm);padding:14px;overflow-x:auto}
.code pre{margin:0;font-family:var(--lb-font-mono);font-size:12.5px;line-height:1.6}
.code .k{color:var(--lb-brand)}
.code .c{color:var(--lb-text-muted)}

/* steps --------------------------------------------------------------- */
.steps{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 var(--lb-space-md);padding:0;list-style:none}
.steps li{font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;
  border:1px solid var(--lb-border-control);border-radius:var(--lb-radius-xs);
  padding:5px 9px;color:var(--lb-text-muted)}
.steps li[aria-current="step"]{background:var(--lb-brand);color:var(--lb-brand-contrast);
  border-color:var(--lb-brand)}

/* notes and banners ---------------------------------------------------- */
.note{font-size:.86rem;color:var(--lb-text-muted)}
.note.xs{font-size:.82rem}
.banner{border:1px solid var(--lb-border-subtle);border-left:3px solid var(--lb-status-pending);
  background:var(--lb-surface);border-radius:var(--lb-radius-sm);padding:12px 14px;
  font-size:.9rem}
.banner.granted{border-left-color:var(--lb-status-granted)}
.banner.denied{border-left-color:var(--lb-status-denied)}
.banner.unknown{border-left-color:var(--lb-status-unknown)}
.prov{border:0;border-top:1px solid var(--lb-border-subtle);padding:var(--lb-space-md) 0 0;
  font-size:.8rem;color:var(--lb-text-muted)}
.stamp{display:inline-block;border:1px dashed var(--lb-brand);color:var(--lb-brand);
  font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.16em;padding:5px 10px;
  border-radius:var(--lb-radius-xs);text-transform:uppercase}
.svgrow{display:flex;gap:16px;align-items:flex-end;flex-wrap:wrap}
.svgrow figure{margin:0;text-align:center}
.svgrow figcaption{font-family:var(--lb-font-mono);font-size:10px;color:var(--lb-text-muted);
  margin-top:4px}
.lockupdemo svg{color:var(--lb-text)}

/* language toggle ------------------------------------------------------ */
html[data-lang="en"] [data-de]{display:none !important}
html[data-lang="de"] [data-en]{display:none !important}

/* motion --------------------------------------------------------------- */
.pulse{transition:transform var(--lb-duration-base) var(--lb-ease-standard),
  box-shadow var(--lb-duration-base) var(--lb-ease-standard)}
.pulse.on{transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,0,0,.28)}
@media (prefers-reduced-motion: reduce){
  *{transition-duration:.001ms !important;animation-duration:.001ms !important}
  .pulse.on{transform:none;box-shadow:none;outline:2px solid var(--lb-focus)}
}
@media(max-width:560px){
  .topbar{padding:10px 12px}
  .brand .who{display:none}
  .seg button{padding:6px 8px}
  main{padding:var(--lb-space-lg) 0}
}
"""

# ------------------------------------------------------------------ components


def T(en: str, de: str) -> str:
    return f'<span data-en>{en}</span><span data-de>{de}</span>'


def glyph(state: str) -> str:
    shape = {"granted": "sq", "pending": "tri", "unknown": "ring", "denied": "dot"}[state]
    return f'<span class="g"><span class="{shape}"></span></span>'


def state_inline(state: str, en: str, de: str) -> str:
    return f'<span class="state s-{state}">{glyph(state)}{T(en, de)}</span>'


STATE_WORDS = {
    "granted": ("Confirmed", "Bestätigt"),
    "pending": ("Proposed", "Vorgeschlagen"),
    "unknown": ("Unknown", "Unbekannt"),
    "denied": ("Denied", "Abgelehnt"),
}


def state_table(caption_en: str, caption_de: str, notes: dict[str, tuple[str, str]]) -> str:
    rows = ""
    for st in ("granted", "pending", "unknown", "denied"):
        rows += (
            f'<tr><td>{state_inline(st, *STATE_WORDS[st])}</td>'
            f"<td>{T(*notes[st])}</td></tr>"
        )
    return (
        '<div class="scrollx"><table class="tbl state-table">'
        f"<caption>{T(caption_en, caption_de)}</caption>"
        f'<tr><th>{T("State", "Zustand")}</th><th>{T("What it means", "Was er bedeutet")}</th></tr>'
        f"{rows}</table></div>"
    )


def lockup() -> str:
    return (LOGO / "lockup-horizontal.svg").read_text(encoding="utf-8")


def svg_file(name: str) -> str:
    return (LOGO / name).read_text(encoding="utf-8")


def page(screen_id: str, experience: str, letter: str, title_en: str, title_de: str,
         audience_en: str, audience_de: str, default_mode: str, body: str) -> str:
    return f"""<!doctype html>
<html lang="en" data-experience="{letter}" data-mode="{default_mode}" data-lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title_en} — Linkbot experience {letter} specimen (candidate)</title>
<meta name="color-scheme" content="light dark">
<meta name="description" content="Linkbot Brand Experiences v{VERSION} — candidate specimen, not an approved identity and not a product screen.">
<link rel="stylesheet" href="../00-shared/tokens.shared.css">
<link rel="stylesheet" href="../00-shared/experience-{experience}.tokens.css">
<link rel="stylesheet" href="../00-shared/fonts.css">
<link rel="stylesheet" href="../00-shared/app.css">
</head>
<body>
<a class="skip" href="#main">{T("Skip to content", "Zum Inhalt springen")}</a>
<header class="topbar">
  <div class="brand">
    <span class="lockup" aria-label="Linkbot">{lockup()}</span>
    <span class="who">{T(audience_en, audience_de)} · {T("Experience", "Erlebnis")} {letter}</span>
  </div>
  <div class="ctrls">
    <div class="seg" role="group" aria-label="Colour mode">
      <button type="button" data-mode-btn="light" aria-pressed="{"true" if default_mode == "light" else "false"}">{T("Light", "Hell")}</button>
      <button type="button" data-mode-btn="dark" aria-pressed="{"true" if default_mode == "dark" else "false"}">{T("Dark", "Dunkel")}</button>
    </div>
    <div class="seg" role="group" aria-label="Language">
      <button type="button" data-lang-btn="en" aria-pressed="true">EN</button>
      <button type="button" data-lang-btn="de" aria-pressed="false">DE</button>
    </div>
  </div>
</header>
<main id="main" class="wrap">
{body}
  <hr class="prov">
  <p class="prov">
    <span class="stamp">{T("Candidate · not approved", "Entwurf · nicht freigegeben")}</span><br>
    {T(
      "Linkbot Brand Experiences v" + VERSION + ". This is an illustrative composition built from the "
      "real shared brand assets — one logo, one type system, one token layer. It is not a product "
      "screen, it states no new capability, and it carries no pilot, scale or commercial figure. "
      "An Opportunity is not a Match, a disclosure is not an application, and Unknown is never "
      "rendered as satisfied.",
      "Linkbot Brand Experiences v" + VERSION + ". Dies ist eine illustrative Komposition aus den "
      "echten gemeinsamen Marken-Assets — ein Logo, ein Schriftsystem, eine Token-Schicht. Es ist "
      "kein Produktbildschirm, nennt keine neue Fähigkeit und enthält keine Pilot-, Skalierungs- "
      "oder Umsatzzahl. Eine Gelegenheit ist kein Match, eine Offenlegung ist keine Bewerbung, "
      "und Unbekannt wird nie als erfüllt dargestellt.")}
  </p>
</main>
<script>
(function(){{
  var root=document.documentElement;
  function applyMode(m){{
    root.setAttribute('data-mode', m==='dark'?'dark':'light');
    root.querySelectorAll('[data-mode-btn]').forEach(function(b){{b.setAttribute('aria-pressed',String(b.dataset.modeBtn===m));}});
  }}
  root.querySelectorAll('[data-mode-btn]').forEach(function(b){{
    b.addEventListener('click',function(){{applyMode(b.dataset.modeBtn);}});
  }});
  function applyLang(l){{
    root.setAttribute('data-lang',l);
    root.setAttribute('lang',l);
    root.querySelectorAll('[data-lang-btn]').forEach(function(b){{b.setAttribute('aria-pressed',String(b.dataset.langBtn===l));}});
  }}
  root.querySelectorAll('[data-lang-btn]').forEach(function(b){{
    b.addEventListener('click',function(){{applyLang(b.dataset.langBtn);}});
  }});
  var pb=document.getElementById('pulseBtn');
  if(pb){{pb.addEventListener('click',function(){{pb.classList.add('on');setTimeout(function(){{pb.classList.remove('on');}},260);}});}}
  applyMode('{default_mode}');applyLang('en');
}})();
</script>
</body>
</html>
"""


# ------------------------------------------------------------------- screen 01


def screen_01() -> str:
    jobs = [
        ("Senior Backend Engineer", "Senior Backend Engineer", "Nordwind Systems",
         "Berlin, DE · Hybrid", "90 days", "external",
         "Stated stack: Go, Postgres, Kubernetes. The listing lives at its original source.",
         "Angegebener Stack: Go, Postgres, Kubernetes. Das Inserat bleibt bei der Quelle."),
        ("Staff Engineer, Platform", "Staff Engineer, Platform", "Halden Robotics",
         "Munich, DE · On-site", "30 days", "external",
         "Robotics platform team. Application path stays with the employer.",
         "Robotik-Plattformteam. Der Bewerbungsweg bleibt beim Arbeitgeber."),
        ("Product Engineer", "Product Engineer", "Kestrel Labs",
         "Remote, EU", "60 days", "linkbot",
         "Eligible for a bounded signal: seniority, employment country, availability.",
         "Geeignet für ein begrenztes Signal: Seniorität, Beschäftigungsland, Verfügbarkeit."),
        ("Data Engineer", "Data Engineer", "Aalborg Analytics",
         "Copenhagen, DK · Hybrid", "120 days", "external",
         "Requirements render as met, unknown or unmet — never as a score.",
         "Anforderungen erscheinen als erfüllt, unbekannt oder nicht erfüllt — nie als Punktzahl."),
    ]
    items = ""
    for i, (t_en, t_de, employer, place, avail, kind, d_en, d_de) in enumerate(jobs):
        if kind == "linkbot":
            action = (
                f'<div class="row" style="margin-top:10px">'
                f'<button class="btn primary" type="button">{T("Request one signal", "Ein Signal anfragen")}</button>'
                f'<button class="btn quiet" type="button">{T("See the request first", "Erst die Anfrage ansehen")}</button>'
                f"</div>"
            )
            src = f'<span class="tag mark">{T("Linkbot listing", "Linkbot-Inserat")}</span>'
        else:
            action = (
                f'<div class="row" style="margin-top:10px">'
                f'<a class="btn secondary" href="#source">{T("Open at the source (external)", "Bei der Quelle öffnen (extern)")}</a>'
                f"</div>"
            )
            src = f'<span class="tag">{T("External listing", "Externes Inserat")}</span>'
        items += (
            f'<li><a class="item" href="#job-{i}" aria-current="{"true" if i == 2 else "false"}">'
            f'<div class="top"><strong>{T(t_en, t_de)}</strong>{src}</div>'
            f'<div class="meta"><span>{employer}</span><span>{place}</span>'
            f'<span>{T("available in", "verfügbar in")} {avail}</span></div>'
            f'<p class="note" style="margin:8px 0 0">{T(d_en, d_de)}</p>{action}</a></li>'
        )

    return f"""
<section>
  <p class="kicker">{T("Talent / Jobsite · experience A", "Talent / Jobbörse · Erlebnis A")}</p>
  <h1>{T("Find work on your terms", "Arbeit finden zu eigenen Bedingungen")}</h1>
  <p class="lede">{T(
    "Search, read the full description, and decide. Where the listing lives somewhere else, you "
    "apply where it lives — Linkbot does not stand between you and the employer. Where it is a "
    "Linkbot listing, you share one bounded signal and you can see the request before you answer.",
    "Suchen, die vollständige Beschreibung lesen und entscheiden. Liegt das Inserat woanders, "
    "bewirbst du dich dort — Linkbot steht nicht zwischen dir und dem Arbeitgeber. Ist es ein "
    "Linkbot-Inserat, teilst du ein begrenztes Signal und siehst die Anfrage, bevor du antwortest.")}</p>
  {state_table("The four states you will see", "Die vier Zustände, die du siehst", {
    "granted": ("Reviewed or edited by you.", "Von dir geprüft oder bearbeitet."),
    "pending": ("A proposed interpretation. Not a fact yet.", "Eine vorgeschlagene Deutung. Noch keine Tatsache."),
    "unknown": ("Nobody has said. Never rendered as satisfied.", "Niemand hat es gesagt. Nie als erfüllt dargestellt."),
    "denied": ("An explicit negative you stated.", "Ein ausdrückliches Nein von dir."),
  })}
</section>

<section>
  <div class="cols">
    <div>
      <div class="card sunken">
        <p class="kicker">{T("Filters", "Filter")}</p>
        <label class="field"><span>{T("Role or skill", "Rolle oder Fähigkeit")}</span>
          <input value="backend engineer" readonly></label>
        <label class="field"><span>{T("Location", "Ort")}</span>
          <input value="Berlin / Remote EU" readonly></label>
        <label class="field"><span>{T("Available within", "Verfügbar innerhalb")}</span>
          <select aria-label="{T('Available within', 'Verfügbar innerhalb')}"><option>90 days</option></select></label>
        <label class="check"><input type="checkbox" checked>
          <span>{T("Hide listings whose source is not stated", "Inserate ohne genannte Quelle ausblenden")}</span></label>
        <label class="check"><input type="checkbox">
          <span>{T("Only listings I can answer privately", "Nur Inserate, die ich privat beantworten kann")}</span></label>
        <hr class="rule-strong">
        <p class="note">{T(
          "Filters are yours. No filter is applied on an employer's behalf, and no filter reveals who is looking.",
          "Filter gehören dir. Kein Filter wird im Auftrag eines Arbeitgebers gesetzt, und kein Filter verrät, wer sucht.")}</p>
      </div>
    </div>
    <div>
      <p class="kicker">{T("Results", "Ergebnisse")} · <span class="tnum mono">4</span></p>
      <ul class="list">{items}</ul>
      <p class="note" style="margin-top:14px">{T(
        "Ordering is by stated availability and by how completely a listing describes itself. It is not a "
        "ranking of you, it is not a score, and it is not a prediction of who would be hired.",
        "Die Reihenfolge richtet sich nach der angegebenen Verfügbarkeit und danach, wie vollständig "
        "ein Inserat sich beschreibt. Sie ist kein Ranking von dir, keine Punktzahl und keine Prognose, "
        "wer eingestellt würde.")}</p>
    </div>
  </div>
</section>

<section>
  <p class="kicker">{T("Job detail", "Stellendetail")}</p>
  <h2>{T("Product Engineer — Kestrel Labs", "Product Engineer — Kestrel Labs")}</h2>
  <div class="grid-2" style="margin-top:var(--lb-space-md)">
    <div class="card">
      <h3>{T("What the employer asked for", "Was der Arbeitgeber angefragt hat")}</h3>
      <div class="scrollx"><table class="tbl">
        <caption>{T("Requirements, as stated", "Anforderungen, wie angegeben")}</caption>
        <tr><th>{T("Requirement", "Anforderung")}</th><th>{T("State", "Zustand")}</th></tr>
        <tr><td>{T("Senior product engineering", "Senior Produktentwicklung")}</td>
            <td>{state_inline("granted", "Confirmed", "Bestätigt")}</td></tr>
        <tr><td>{T("Work authorisation in the EU", "Arbeitserlaubnis in der EU")}</td>
            <td>{state_inline("unknown", "Unknown → verify", "Unbekannt → prüfen")}</td></tr>
        <tr><td>{T("Willing to travel quarterly", "Bereit zu vierteljährlichen Reisen")}</td>
            <td>{state_inline("pending", "Proposed", "Vorgeschlagen")}</td></tr>
      </table></div>
      <p class="note">{T(
        "A hard unmet requirement blocks the action. An unknown requirement is shortlisted for "
        "verification — it is never displayed as verified.",
        "Eine nicht erfüllte harte Anforderung blockiert die Aktion. Eine unbekannte Anforderung wird "
        "zur Prüfung vorgemerkt — sie wird nie als geprüft dargestellt.")}</p>
    </div>
    <div>
      <div class="card">
        <h3>{T("What you would disclose", "Was du offenlegen würdest")}</h3>
        <p class="note">{T(
          "One bounded signal, one recipient, one purpose, one policy version, one expiry. Nothing is "
          "published, nothing is scraped, and no public profile URL exists.",
          "Ein begrenztes Signal, ein Empfänger, ein Zweck, eine Richtlinienversion, ein Ablauf. Nichts "
          "wird veröffentlicht, nichts wird ausgelesen, es gibt keine öffentliche Profil-URL.")}</p>
        <div class="code"><pre><span class="c">// the request, before you answer</span>
{{
  <span class="k">"fields"</span>: ["seniority", "employment_country", "availability"],
  <span class="k">"recipient"</span>: "employer_membership:P7H2",
  <span class="k">"purpose"</span>: "recruiting_opportunity_evaluation",
  <span class="k">"policy_version"</span>: "v3",
  <span class="k">"expires"</span>: "2026-12-09"
}}</pre></div>
        <div class="row" style="margin-top:12px">
          <button class="btn primary" type="button">{T("Answer the request", "Anfrage beantworten")}</button>
          <button class="btn quiet" type="button">{T("Not now", "Jetzt nicht")}</button>
        </div>
      </div>
      <div class="receipt" style="margin-top:var(--lb-space-md)">
        <dl>
          <dt>RECEIPT</dt><dd>disclosure #A14</dd>
          <dt>{T("recipient", "Empfänger")}</dt><dd>employer_membership:P7H2</dd>
          <dt>{T("fields", "Felder")}</dt><dd>seniority, employment_country, availability</dd>
          <dt>{T("policy", "Richtlinie")}</dt><dd>standing v3</dd>
          <dt>{T("recorded", "verzeichnet")}</dt><dd class="tnum">2026-10-09T09:14Z</dd>
          <dt>{T("revocation", "Widerruf")}</dt>
          <dd>{T("stops future access; delivered copies are not claimed to be erased",
                 "stoppt künftigen Zugriff; bereits gelieferte Kopien gelten nicht als gelöscht")}</dd>
        </dl>
      </div>
    </div>
  </div>
</section>

<section>
  <p class="kicker">{T("Where you apply", "Wo du dich bewirbst")}</p>
  <div class="banner">
    <strong>{T("External listing", "Externes Inserat")}</strong> —
    {T("application happens at the original source. Linkbot shows no native apply button for a "
       "listing it does not control.",
       "die Bewerbung erfolgt bei der Originalquelle. Linkbot zeigt keinen eigenen "
       "Bewerben-Knopf für ein Inserat, das es nicht kontrolliert.")}
  </div>
  <div class="banner granted" style="margin-top:10px" id="source">
    <strong>{T("Linkbot listing", "Linkbot-Inserat")}</strong> —
    {T("an interest you express is not a Match, does not open contact, and is not an application. "
       "You can withdraw before an employer answers.",
       "ein von dir geäußertes Interesse ist kein Match, öffnet keinen Kontakt und ist keine Bewerbung. "
       "Du kannst zurückziehen, bevor ein Arbeitgeber antwortet.")}
  </div>
</section>
"""


# ------------------------------------------------------------------- screen 02


def screen_02() -> str:
    return f"""
<section>
  <p class="kicker">{T("Talent / Jobsite · experience A", "Talent / Jobbörse · Erlebnis A")}</p>
  <h1>{T("Set up a private job agent", "Einen privaten Job-Agenten einrichten")}</h1>
  <p class="lede">{T(
    "Four short steps. Two of them are optional, every step is skippable, and nothing leaves your "
    "record until you confirm it. The agent answers requests inside the boundaries you set — it "
    "never applies, never contacts anyone, and never posts a profile.",
    "Vier kurze Schritte. Zwei davon sind optional, jeder Schritt ist überspringbar, und nichts "
    "verlässt deinen Datensatz, bis du es bestätigst. Der Agent beantwortet Anfragen innerhalb der "
    "von dir gesetzten Grenzen — er bewirbt sich nie, kontaktiert niemanden und veröffentlicht kein Profil.")}</p>
  <ol class="steps">
    <li>{T("1 Who you are", "1 Wer du bist")}</li>
    <li aria-current="step">{T("2 Context", "2 Kontext")}</li>
    <li>{T("3 Boundaries", "3 Grenzen")}</li>
    <li>{T("4 Confirm", "4 Bestätigen")}</li>
  </ol>
</section>

<section>
  <div class="grid-2">
    <div class="card">
      <h3>{T("Step 2 — context, and it is optional", "Schritt 2 — Kontext, und er ist optional")}</h3>
      <p class="note">{T(
        "Anything the agent suggests here is a proposal, not a fact. It stays proposed until you "
        "confirm it, and confirming it does not publish anything, does not authenticate you and "
        "does not create sharing authority.",
        "Alles, was der Agent hier vorschlägt, ist ein Vorschlag, keine Tatsache. Es bleibt "
        "vorgeschlagen, bis du es bestätigst, und die Bestätigung veröffentlicht nichts, "
        "authentifiziert dich nicht und schafft keine Weitergabevollmacht.")}</p>
      <ul class="list" style="margin-top:10px">
        <li><div class="item"><div class="top">
          <strong>{T("Seniority: senior", "Seniorität: Senior")}</strong>
          {state_inline("pending", "Proposed from your CV", "Aus deinem Lebenslauf vorgeschlagen")}
        </div>
        <div class="row" style="margin-top:8px">
          <button class="btn secondary" type="button">{T("Confirm", "Bestätigen")}</button>
          <button class="btn quiet" type="button">{T("Edit", "Bearbeiten")}</button>
          <button class="btn quiet" type="button">{T("Skip", "Überspringen")}</button>
        </div></div></li>
        <li><div class="item"><div class="top">
          <strong>{T("Availability: 90 days", "Verfügbarkeit: 90 Tage")}</strong>
          {state_inline("pending", "Proposed", "Vorgeschlagen")}
        </div>
        <div class="row" style="margin-top:8px">
          <button class="btn secondary" type="button">{T("Confirm", "Bestätigen")}</button>
          <button class="btn quiet" type="button">{T("Change", "Ändern")}</button>
        </div></div></li>
        <li><div class="item"><div class="top">
          <strong>{T("Work authorisation", "Arbeitserlaubnis")}</strong>
          {state_inline("unknown", "Not stated", "Nicht angegeben")}
        </div>
        <p class="note" style="margin:8px 0 0">{T(
          "Left unknown on purpose. An unresolved item is never upgraded to a satisfied one.",
          "Absichtlich unbekannt gelassen. Ein ungeklärter Punkt wird nie zu einem erfüllten hochgestuft.")}</p>
        </div></li>
      </ul>
    </div>

    <div>
      <div class="card">
        <h3>{T("Step 3 — the boundaries you set", "Schritt 3 — die Grenzen, die du setzt")}</h3>
        <label class="field"><span>{T("Purpose", "Zweck")}</span>
          <input value="recruiting_opportunity_evaluation" readonly></label>
        <label class="field"><span>{T("Fields the agent may confirm", "Felder, die der Agent bestätigen darf")}</span>
          <input value="seniority, employment_country, availability" readonly></label>
        <label class="field"><span>{T("Standing mandate", "Dauerhafte Vollmacht")}</span>
          <input value="bounded · versioned · v3 · expires 2026-12-09" readonly></label>
        <label class="check"><input type="checkbox" checked>
          <span>{T("The agent may confirm a field only; it may never apply, contact or accept on my behalf.",
                  "Der Agent darf nur ein Feld bestätigen; er darf nie in meinem Namen bewerben, kontaktieren oder annehmen.")}</span></label>
        <label class="check"><input type="checkbox" checked>
          <span>{T("Show me every request before it is answered.", "Zeige mir jede Anfrage, bevor sie beantwortet wird.")}</span></label>
        <hr class="rule-strong">
        <p class="note">{T(
          "A standing mandate authorises disclosure only. It never means an application, employer "
          "interest, contact permission or a Match.",
          "Eine dauerhafte Vollmacht erlaubt ausschließlich offenzulegen. Sie bedeutet nie eine "
          "Bewerbung, Arbeitgeberinteresse, Kontakterlaubnis oder einen Match.")}</p>
      </div>
      <div class="receipt" style="margin-top:var(--lb-space-md)">
        <dl>
          <dt>MANDATE</dt><dd>standing v3</dd>
          <dt>{T("scope", "Umfang")}</dt><dd>{T("disclosure only", "nur Offenlegung")}</dd>
          <dt>{T("recipients", "Empfänger")}</dt><dd>{T("proof-verified domain allowlist, per request", "Domain-Allowlist, pro Anfrage")}</dd>
          <dt>{T("fail-closed", "fail-closed")}</dt><dd>{T("unknown version, purpose, evaluator or domain is denied", "unbekannte Version, Zweck, Prüfer oder Domain wird abgelehnt")}</dd>
          <dt>{T("revoke", "widerrufen")}</dt><dd>{T("any time; stops future access", "jederzeit; stoppt künftigen Zugriff")}</dd>
        </dl>
      </div>
    </div>
  </div>
</section>

<section>
  <p class="kicker">{T("Step 4 — what you are agreeing to", "Schritt 4 — wozu du zustimmst")}</p>
  <div class="grid">
    <div class="card"><h3>{T("Not a profile", "Kein Profil")}</h3>
      <p class="note">{T("No public URL, no indexable page, no browsing by employers.",
                         "Keine öffentliche URL, keine indexierbare Seite, kein Durchsuchen durch Arbeitgeber.")}</p></div>
    <div class="card"><h3>{T("Not automatic", "Nicht automatisch")}</h3>
      <p class="note">{T("No batch apply, no bulk outreach, no automatic contact.",
                         "Kein Sammelbewerben, kein Massenanschreiben, kein automatischer Kontakt.")}</p></div>
    <div class="card"><h3>{T("Revocable", "Widerrufbar")}</h3>
      <p class="note">{T("Revoking stops future access. It does not claim delivered copies were erased.",
                         "Der Widerruf stoppt künftigen Zugriff. Er behauptet nicht, gelieferte Kopien seien gelöscht.")}</p></div>
    <div class="card"><h3>{T("Yours to export", "Dein Export")}</h3>
      <p class="note">{T("A portable export of your private state exists. It is not a server backup and not an encrypted vault.",
                         "Ein portabler Export deines privaten Zustands existiert. Er ist kein Server-Backup und kein verschlüsselter Tresor.")}</p></div>
  </div>
  <div class="row" style="margin-top:var(--lb-space-md)">
    <button class="btn primary pulse" id="pulseBtn" type="button">{T("Activate the agent", "Agent aktivieren")}</button>
    <button class="btn quiet" type="button">{T("Save and finish later", "Speichern und später fortsetzen")}</button>
  </div>
  <p class="note" style="margin-top:10px">{T(
    "The highlight above is the one expressive motion in the system; under prefers-reduced-motion it "
    "becomes a plain focus outline rather than disappearing.",
    "Die Hervorhebung oben ist die einzige expressive Bewegung im System; bei prefers-reduced-motion "
    "wird sie zu einem schlichten Fokusrahmen statt zu verschwinden.")}</p>
</section>
"""


# ------------------------------------------------------------------- screen 03


def screen_03() -> str:
    return f"""
<section>
  <p class="kicker">{T("Developer Platform · experience B", "Entwicklerplattform · Erlebnis B")}</p>
  <h1>{T("The consent layer is the API", "Die Einwilligungsschicht ist die API")}</h1>
  <p class="lede">{T(
    "Every endpoint is bounded by the same authority model as the product. Unknown version, purpose, "
    "evaluator or domain fails closed. There is no endpoint that bypasses the consent layer, and none "
    "is planned for private testing either.",
    "Jeder Endpunkt ist an dasselbe Berechtigungsmodell gebunden wie das Produkt. Unbekannte Version, "
    "Zweck, Prüfer oder Domain werden abgelehnt. Es gibt keinen Endpunkt, der die Einwilligungsschicht "
    "umgeht — auch nicht im privaten Testbetrieb.")}</p>
  {state_table("Response states", "Antwortzustände", {
    "granted": ("The holder confirmed this field.", "Der Inhaber hat dieses Feld bestätigt."),
    "pending": ("Reviewed as proposed, not confirmed.", "Als vorgeschlagen geprüft, nicht bestätigt."),
    "unknown": ("Not stated. Returned as UNKNOWN, never omitted.", "Nicht angegeben. Als UNBekannt zurückgegeben, nie weggelassen."),
    "denied": ("Explicitly refused, or an unknown evaluator.", "Ausdrücklich abgelehnt oder unbekannter Prüfer."),
  })}
</section>

<section>
  <div class="cols-wide">
    <nav class="card sunken" aria-label="{T('Documentation', 'Dokumentation')}">
      <p class="kicker">{T("Docs", "Doku")}</p>
      <ul class="list" style="gap:2px">
        <li><a href="#quickstart">{T("Quickstart", "Schnellstart")}</a></li>
        <li><a href="#auth">{T("Authority model", "Berechtigungsmodell")}</a></li>
        <li><a href="#endpoints">{T("Endpoints", "Endpunkte")}</a></li>
        <li><a href="#mcp">{T("MCP integration", "MCP-Integration")}</a></li>
        <li><a href="#errors">{T("Errors and denial", "Fehler und Ablehnung")}</a></li>
      </ul>
    </nav>
    <div>
      <div id="quickstart">
        <h2>{T("Quickstart", "Schnellstart")}</h2>
        <p class="note">{T("Credentials are scoped to a purpose and a policy version. There is no global key that widens authority.",
                           "Zugangsdaten sind an einen Zweck und eine Richtlinienversion gebunden. Es gibt keinen globalen Schlüssel, der die Vollmacht erweitert.")}</p>
        <div class="code"><pre><span class="c"># one bounded disclosure request</span>
curl -sS https://api.linkbot.example/v1/disclosures \\
  -H <span class="k">"authorization: Bearer $LINKBOT_TOKEN"</span> \\
  -H <span class="k">"idempotency-key: $UUID"</span> \\
  -d '{{
    "subject": "person:9f21",
    "purpose": "recruiting_opportunity_evaluation",
    "fields": ["seniority", "employment_country", "availability"],
    "policy_version": "v3"
  }}'</pre></div>
      </div>

      <div id="auth" style="margin-top:var(--lb-space-lg)">
        <h2>{T("Authority model", "Berechtigungsmodell")}</h2>
        <div class="scrollx"><table class="tbl">
          <caption>{T("Scopes — each one narrow on purpose", "Scopes — jeder absichtlich eng")}</caption>
          <tr><th>Scope</th><th>{T("Grants", "Gewährt")}</th><th>{T("Does not grant", "Gewährt nicht")}</th></tr>
          <tr><td class="mono">signal:read</td><td>{T("a bounded field set the holder confirmed", "ein begrenztes, bestätigtes Feldset")}</td>
              <td>{T("contact, application, or a Match", "Kontakt, Bewerbung oder einen Match")}</td></tr>
          <tr><td class="mono">request:create</td><td>{T("one request to one holder", "eine Anfrage an einen Inhaber")}</td>
              <td>{T("enumeration or bulk requests", "Aufzählung oder Massenanfragen")}</td></tr>
          <tr><td class="mono">receipt:read</td><td>{T("the history recorded for your membership", "die für deine Mitgliedschaft verzeichnete Historie")}</td>
              <td>{T("another party's history", "die Historie einer anderen Partei")}</td></tr>
        </table></div>
      </div>

      <div id="endpoints" style="margin-top:var(--lb-space-lg)">
        <h2>{T("Endpoints", "Endpunkte")}</h2>
        <div class="scrollx"><table class="tbl">
          <caption>{T("Private testing surface", "Private Test-Oberfläche")}</caption>
          <tr><th>{T("Method", "Methode")}</th><th>Path</th><th>{T("Notes", "Hinweise")}</th></tr>
          <tr><td class="mono">POST</td><td class="mono">/v1/disclosures</td>
              <td>{T("requires purpose, fields and policy_version", "erfordert Zweck, Felder und policy_version")}</td></tr>
          <tr><td class="mono">GET</td><td class="mono">/v1/disclosures/{{id}}</td>
              <td>{T("returns the receipt and the current state", "liefert den Beleg und den aktuellen Zustand")}</td></tr>
          <tr><td class="mono">POST</td><td class="mono">/v1/disclosures/{{id}}/revoke</td>
              <td>{T("revokes future access; delivered copies are not claimed erased", "widerruft künftigen Zugriff; gelieferte Kopien gelten nicht als gelöscht")}</td></tr>
          <tr><td class="mono">GET</td><td class="mono">/me/private-state/export</td>
              <td>{T("portable owner export; not a backup, not a vault", "portabler Eigentümer-Export; kein Backup, kein Tresor")}</td></tr>
        </table></div>
      </div>

      <div id="mcp" style="margin-top:var(--lb-space-lg)">
        <h2>{T("MCP integration", "MCP-Integration")}</h2>
        <p class="note">{T(
          "The MCP server exposes the same tools as the HTTP surface, with the same authority checks and "
          "the same refusal behaviour. A tool call that cannot name its purpose and policy version is refused "
          "before it reaches a record.",
          "Der MCP-Server stellt dieselben Werkzeuge bereit wie die HTTP-Oberfläche, mit denselben "
          "Berechtigungsprüfungen und demselben Ablehnungsverhalten. Ein Werkzeugaufruf, der Zweck und "
          "Richtlinienversion nicht nennen kann, wird abgelehnt, bevor er einen Datensatz erreicht.")}</p>
        <div class="code"><pre>{{
  <span class="k">"mcpServers"</span>: {{
    <span class="k">"linkbot"</span>: {{
      <span class="k">"command"</span>: "npx",
      <span class="k">"args"</span>: ["-y", "@linkbot/mcp-server"],
      <span class="k">"env"</span>: {{ <span class="k">"LINKBOT_PURPOSE"</span>: "recruiting_opportunity_evaluation",
                <span class="k">"LINKBOT_POLICY_VERSION"</span>: "v3" }}
    }}
  }}
}}</pre></div>
        <div class="scrollx" style="margin-top:var(--lb-space-md)"><table class="tbl">
          <caption>{T("Tools", "Werkzeuge")}</caption>
          <tr><th>{T("Tool", "Werkzeug")}</th><th>{T("Behaviour", "Verhalten")}</th></tr>
          <tr><td class="mono">request_disclosure</td><td>{T("one subject, one bounded field set", "ein Subjekt, ein begrenztes Feldset")}</td></tr>
          <tr><td class="mono">read_receipt</td><td>{T("returns the recorded state, including UNKNOWN", "liefert den verzeichneten Zustand, inklusive UNBEKANNT")}</td></tr>
          <tr><td class="mono">revoke</td><td>{T("stops future access", "stoppt künftigen Zugriff")}</td></tr>
        </table></div>
      </div>

      <div id="errors" style="margin-top:var(--lb-space-lg)">
        <h2>{T("Errors and denial", "Fehler und Ablehnung")}</h2>
        <div class="code"><pre><span class="c">// HTTP 451 — fail closed, and say which check refused it</span>
{{
  <span class="k">"error"</span>: "authority_refused",
  <span class="k">"check"</span>: "policy_version_unknown",
  <span class="k">"state"</span>: "denied",
  <span class="k">"detail"</span>: "policy_version v1 has no configured authority for this purpose"
}}</pre></div>
        <div class="banner denied" style="margin-top:12px">
          {T("The API returns a refusal, not an empty object. A caller must be able to render refused and empty as different states.",
             "Die API liefert eine Ablehnung, kein leeres Objekt. Ein Aufrufer muss abgelehnt und leer als verschiedene Zustände darstellen können.")}
        </div>
      </div>
    </div>
  </div>
</section>
"""


# ------------------------------------------------------------------- screen 04


def screen_04() -> str:
    return f"""
<section>
  <p class="kicker">{T("Employer · experience C", "Arbeitgeber · Erlebnis C")}</p>
  <h1>{T("You request. The person decides.", "Du fragst an. Die Person entscheidet.")}</h1>
  <p class="lede">{T(
    "This workspace shows only what was authorised for this membership, for this purpose, at this "
    "policy version. There is no pool to browse and no unsolicited contact.",
    "Dieser Arbeitsbereich zeigt nur, was für diese Mitgliedschaft, für diesen Zweck, zu dieser "
    "Richtlinienversion autorisiert wurde. Es gibt keinen Pool zum Durchsuchen und keinen "
    "unaufgeforderten Kontakt.")}</p>
  <div class="banner unknown">
    <strong>{T("Membership", "Mitgliedschaft")}</strong> · employer_membership:P7H2 ·
    {T("role-bound, not a shared login. Every authorised read is written to this side's history.",
       "rollengebunden, kein gemeinsamer Login. Jeder autorisierte Zugriff wird in der Historie "
       "dieser Seite verzeichnet.")}
  </div>
</section>

<section>
  <p class="kicker">{T("Requests you have made", "Von dir gestellte Anfragen")}</p>
  <div class="scrollx"><table class="tbl">
    <caption>{T("Bounded requests, with their recorded state", "Begrenzte Anfragen mit verzeichnetem Zustand")}</caption>
    <tr><th>{T("Role", "Rolle")}</th><th>{T("Fields requested", "Angefragte Felder")}</th>
        <th>{T("Policy", "Richtlinie")}</th><th>{T("State", "Zustand")}</th>
        <th>{T("Recorded", "Verzeichnet")}</th></tr>
    <tr><td>Senior Backend Engineer</td><td class="mono">seniority, availability</td>
        <td class="mono">v3</td><td>{state_inline("granted", "Confirmed", "Bestätigt")}</td>
        <td class="num">2026-10-02</td></tr>
    <tr><td>Product Engineer</td><td class="mono">seniority, employment_country</td>
        <td class="mono">v3</td><td>{state_inline("pending", "Awaiting the holder", "Wartet auf den Inhaber")}</td>
        <td class="num">2026-10-05</td></tr>
    <tr><td>Data Engineer</td><td class="mono">availability</td>
        <td class="mono">v3</td><td>{state_inline("unknown", "No answer yet", "Noch keine Antwort")}</td>
        <td class="num">2026-10-06</td></tr>
    <tr><td>Staff Engineer</td><td class="mono">seniority</td>
        <td class="mono">v1</td><td>{state_inline("denied", "Refused — policy version", "Abgelehnt — Richtlinienversion")}</td>
        <td class="num">2026-10-07</td></tr>
  </table></div>
  <p class="note" style="margin-top:12px">{T(
    "An unconfirmed request is not a result. Nothing here is a score, a ranking or a prediction of who "
    "would be hired, and no candidate is ordered by one.",
    "Eine unbestätigte Anfrage ist kein Ergebnis. Nichts hier ist eine Punktzahl, ein Ranking oder eine "
    "Prognose, wer eingestellt würde, und kein Kandidat wird danach sortiert.")}</p>
</section>

<section>
  <div class="grid-2">
    <div class="card">
      <h3>{T("Order the workspace explains, not hides", "Eine Reihenfolge, die erklärt statt verbirgt")}</h3>
      <div class="scrollx"><table class="tbl">
        <caption>{T("Why this order", "Warum diese Reihenfolge")}</caption>
        <tr><th>{T("Signal", "Signal")}</th><th>{T("Effect on order", "Wirkung auf die Reihenfolge")}</th></tr>
        <tr><td>{T("Hard unmet requirement", "Nicht erfüllte harte Anforderung")}</td>
            <td>{T("blocks the action", "blockiert die Aktion")}</td></tr>
        <tr><td>{T("Unresolved requirement", "Ungeklärte Anforderung")}</td>
            <td>{T("shortlists for verification", "vormerken zur Prüfung")}</td></tr>
        <tr><td>{T("Confirmed evidence", "Bestätigter Nachweis")}</td>
            <td>{T("raises position", "hebt die Position")}</td></tr>
        <tr><td>{T("Predicted fit", "Prognostizierte Passung")}</td>
            <td>{T("does not exist in this system", "existiert in diesem System nicht")}</td></tr>
      </table></div>
    </div>
    <div>
      <div class="card">
        <h3>{T("History", "Historie")}</h3>
        <ul class="list" style="gap:8px">
          <li><div class="item"><div class="top"><strong>{T("Read authorised", "Zugriff autorisiert")}</strong>
            <span class="mono note tnum">2026-10-02T11:20Z</span></div>
            <p class="note" style="margin:6px 0 0">{T("membership:P7H2 · purpose recruiting_opportunity_evaluation · policy v3",
              "membership:P7H2 · Zweck recruiting_opportunity_evaluation · Richtlinie v3")}</p></div></li>
          <li><div class="item"><div class="top"><strong>{T("Refusal recorded", "Ablehnung verzeichnet")}</strong>
            <span class="mono note tnum">2026-10-07T15:02Z</span></div>
            <p class="note" style="margin:6px 0 0">{T("policy_version_unknown — the request was never delivered",
              "policy_version_unknown — die Anfrage wurde nie zugestellt")}</p></div></li>
          <li><div class="item"><div class="top"><strong>{T("Revocation (by holder)", "Widerruf (durch Inhaber)")}</strong>
            <span class="mono note tnum">2026-10-08T08:41Z</span></div>
            <p class="note" style="margin:6px 0 0">{T("future access stopped; previously delivered copies are not claimed erased",
              "künftiger Zugriff gestoppt; zuvor gelieferte Kopien gelten nicht als gelöscht")}</p></div></li>
        </ul>
      </div>
      <div class="receipt" style="margin-top:var(--lb-space-md)">
        <dl>
          <dt>RECEIPT</dt><dd>disclosure #A14</dd>
          <dt>{T("fields", "Felder")}</dt><dd>seniority, employment_country</dd>
          <dt>{T("delivered", "geliefert")}</dt><dd class="tnum">2026-10-02T11:20Z</dd>
          <dt>{T("expires", "läuft ab")}</dt><dd class="tnum">2026-12-09</dd>
          <dt>{T("payload", "Nutzlast")}</dt>
          <dd>{T("excludes email, phone, raw CV, provider claims and inferred qualification",
                "enthält keine E-Mail, kein Telefon, keinen Roh-Lebenslauf, keine Anbieteransprüche und keine abgeleitete Qualifikation")}</dd>
        </dl>
      </div>
    </div>
  </div>
</section>

<section>
  <p class="kicker">{T("What this workspace cannot do", "Was dieser Arbeitsbereich nicht kann")}</p>
  <div class="grid">
    <div class="card"><h3>{T("No full-profile browsing", "Kein Durchsuchen vollständiger Profile")}</h3>
      <p class="note">{T("Access is role-bound and bounded by the shared payload.", "Der Zugriff ist rollengebunden und auf die gemeinsame Nutzlast begrenzt.")}</p></div>
    <div class="card"><h3>{T("No aggregated public data", "Keine aggregierten öffentlichen Daten")}</h3>
      <p class="note">{T("There is no party-enumeration route and no resale of profile data.", "Es gibt keine Aufzählungsroute und keinen Weiterverkauf von Profildaten.")}</p></div>
    <div class="card"><h3>{T("No silence as consent", "Kein Schweigen als Zustimmung")}</h3>
      <p class="note">{T("An unanswerable request stays unknown; it is never counted as a yes.", "Eine unbeantwortbare Anfrage bleibt unbekannt; sie zählt nie als Ja.")}</p></div>
  </div>
</section>
"""


# ------------------------------------------------------------------- screen 05


def screen_05() -> str:
    def req_row(req_en, req_de, st, why_en, why_de):
        return (f"<tr><td>{T(req_en, req_de)}</td><td>{state_inline(st, *STATE_WORDS[st])}</td>"
                f"<td class='note'>{T(why_en, why_de)}</td></tr>")

    return f"""
<section>
  <p class="kicker">{T("Agency · experience C", "Agentur · Erlebnis C")}</p>
  <h1>{T("One mandate, several bounded introductions", "Ein Mandat, mehrere begrenzte Vorstellungen")}</h1>
  <p class="lede">{T(
    "Linkbot sits alongside the ATS and CRM you already run. It is not an ATS adapter, not a pool "
    "import, not a matching-engine replacement and not a messaging service. Requirements render as "
    "met, unknown or unmet. A hard unmet blocks the action; an unknown is shortlisted for "
    "verification and never shown as verified.",
    "Linkbot läuft neben dem ATS und CRM, das du bereits nutzt. Es ist kein ATS-Adapter, kein "
    "Pool-Import, kein Ersatz für eine Matching-Engine und kein Nachrichtendienst. Anforderungen "
    "erscheinen als erfüllt, unbekannt oder nicht erfüllt. Ein hartes Nicht-Erfüllt blockiert die "
    "Aktion; ein Unbekanntes wird zur Prüfung vorgemerkt und nie als geprüft dargestellt.")}</p>
  <div class="banner">
    <strong>{T("Illustrative content", "Illustrative Inhalte")}</strong> —
    {T("the mandate below is demonstration content, labelled as such. Pilot scope, timings, terms and "
       "authorised data sources are proposed and not agreed.",
       "das folgende Mandat ist Demonstrationsinhalt und als solcher gekennzeichnet. Pilotumfang, "
       "Zeitplan, Konditionen und autorisierte Datenquellen sind vorgeschlagen und nicht vereinbart.")}
  </div>
</section>

<section>
  <div class="grid-2">
    <div class="card">
      <h3>{T("Mandate", "Mandat")}</h3>
      <div class="scrollx"><table class="tbl">
        <tr><th>{T("Client", "Kunde")}</th><td>{T("(illustrative) Nordwind Systems", "(illustrativ) Nordwind Systems")}</td></tr>
        <tr><th>{T("Role", "Rolle")}</th><td>{T("Senior Backend Engineer", "Senior Backend Engineer")}</td></tr>
        <tr><th>{T("Mandate", "Mandat")}</th><td class="mono">{T("1 mandate → bounded introductions", "1 Mandat → begrenzte Vorstellungen")}</td></tr>
        <tr><th>{T("Authorised sources", "Autorisierte Quellen")}</th><td>{T("proposed, not agreed", "vorgeschlagen, nicht vereinbart")}</td></tr>
        <tr><th>{T("Ordering", "Reihenfolge")}</th>
            <td>{T("hard failures, unresolved requirements, preferred evidence — not a predictive hiring score",
                  "harte Ausschlüsse, ungeklärte Anforderungen, bevorzugte Nachweise — keine prädiktive Einstellungsbewertung")}</td></tr>
      </table></div>
    </div>
    <div class="card">
      <h3>{T("Requirement matrix", "Anforderungsmatrix")}</h3>
      <div class="scrollx"><table class="tbl">
        <caption>{T("Met · unknown · unmet", "Erfüllt · unbekannt · nicht erfüllt")}</caption>
        <tr><th>{T("Requirement", "Anforderung")}</th><th>{T("State", "Zustand")}</th><th>{T("Consequence", "Folge")}</th></tr>
        {req_row("Senior backend, 5y+", "Senior Backend, 5 J.+", "granted",
                 "evidence present", "Nachweis vorhanden")}
        {req_row("EU work authorisation", "Arbeitserlaubnis EU", "unknown",
                 "shortlisted for verification", "zur Prüfung vorgemerkt")}
        {req_row("Willing to relocate", "Bereit umzuziehen", "denied",
                 "hard unmet — action blocked", "hart nicht erfüllt — Aktion blockiert")}
        {req_row("On-call rotation", "Bereitschaftsdienst", "pending",
                 "stated preference, not confirmed", "angegebene Präferenz, nicht bestätigt")}
      </table></div>
      <p class="note">{T("An unknown is never displayed as verified, and a preference is never displayed as a fact.",
                         "Ein Unbekanntes wird nie als geprüft dargestellt, und eine Präferenz nie als Tatsache.")}</p>
    </div>
  </div>
</section>

<section>
  <p class="kicker">{T("Shortlist", "Auswahlliste")}</p>
  <div class="scrollx"><table class="tbl">
    <caption>{T("Introductions for this mandate", "Vorstellungen für dieses Mandat")}</caption>
    <tr><th>{T("Introduction", "Vorstellung")}</th><th>{T("Senior backend", "Senior Backend")}</th>
        <th>{T("EU authorisation", "EU-Erlaubnis")}</th><th>{T("Relocation", "Umzug")}</th>
        <th>{T("Next step", "Nächster Schritt")}</th></tr>
    <tr><td class="mono">intro_01</td><td>{state_inline("granted", "Met", "Erfüllt")}</td>
        <td>{state_inline("granted", "Met", "Erfüllt")}</td><td>{state_inline("pending", "Proposed", "Vorgeschlagen")}</td>
        <td>{T("proceed", "fortfahren")}</td></tr>
    <tr><td class="mono">intro_02</td><td>{state_inline("granted", "Met", "Erfüllt")}</td>
        <td>{state_inline("unknown", "Verify", "Prüfen")}</td><td>{state_inline("unknown", "Verify", "Prüfen")}</td>
        <td>{T("verify two items first", "zuerst zwei Punkte prüfen")}</td></tr>
    <tr><td class="mono">intro_03</td><td>{state_inline("granted", "Met", "Erfüllt")}</td>
        <td>{state_inline("granted", "Met", "Erfüllt")}</td><td>{state_inline("denied", "Unmet", "Nicht erfüllt")}</td>
        <td>{T("blocked", "blockiert")}</td></tr>
  </table></div>
  <div class="row" style="margin-top:var(--lb-space-md)">
    <button class="btn primary" type="button">{T("Request verification for intro_02", "Prüfung für intro_02 anfragen")}</button>
    <button class="btn secondary" type="button">{T("Export the mandate record", "Mandatsakte exportieren")}</button>
    <button class="btn quiet" type="button">{T("Close the mandate", "Mandat schließen")}</button>
  </div>
</section>

<section>
  <p class="kicker">{T("Record", "Akte")}</p>
  <div class="receipt">
    <dl>
      <dt>MANDATE</dt><dd>mandate:M3K7 · {T("open", "offen")}</dd>
      <dt>{T("introductions", "Vorstellungen")}</dt><dd class="tnum">3</dd>
      <dt>{T("blocked", "blockiert")}</dt><dd class="tnum">1</dd>
      <dt>{T("awaiting verification", "warten auf Prüfung")}</dt><dd class="tnum">2</dd>
      <dt>{T("recorded", "verzeichnet")}</dt><dd class="tnum">2026-10-09T09:14Z</dd>
      <dt>{T("note", "Hinweis")}</dt>
      <dd>{T("counts describe this record only; they are not a performance or conversion claim",
            "Zahlen beschreiben nur diese Akte; sie sind keine Leistungs- oder Konversionsaussage")}</dd>
    </dl>
  </div>
</section>
"""


# ------------------------------------------------------------------- index

# Each experience opens in the mode that expresses its register: A on warm paper,
# B on ink (the Protocol register lives in dark), C on neutral light.
SCREENS = [
    ("01-talent-jobsite", "A-talent", "A", "Talent / Jobsite — job search and detail",
     "Talent / Jobbörse — Suche und Detail", "light", screen_01),
    ("02-private-job-agent", "A-talent", "A", "Talent / Jobsite — private job-agent onboarding",
     "Talent / Jobbörse — Onboarding des Job-Agenten", "light", screen_02),
    ("03-developer-platform", "B-developer", "B", "Developer Platform — API documentation and MCP",
     "Entwicklerplattform — API-Doku und MCP", "dark", screen_03),
    ("04-employer-dashboard", "C-employer", "C", "Employer — hiring dashboard",
     "Arbeitgeber — Einstellungs-Dashboard", "light", screen_04),
    ("05-agency-mandate", "C-employer", "C", "Agency — mandate and shortlist",
     "Agentur — Mandat und Auswahlliste", "light", screen_05),
]


def write_index() -> None:
    rows = ""
    for slug, exp, letter, t_en, t_de, _mode, _ in SCREENS:
        rows += (f'<li><a href="{slug}/index.html">{T(t_en, t_de)}</a> '
                 f'<span class="mono note">experience {letter} · {exp}</span></li>')
    html = f"""<!doctype html>
<html lang="en" data-experience="A" data-mode="light" data-lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Linkbot Brand Experiences v{VERSION} — experience specimens</title>
<link rel="stylesheet" href="00-shared/tokens.shared.css">
<link rel="stylesheet" href="00-shared/experience-A-talent.tokens.css">
<link rel="stylesheet" href="00-shared/fonts.css">
<link rel="stylesheet" href="00-shared/app.css"></head>
<body><main class="wrap">
<p class="kicker">{T("Linkbot Brand Experiences v" + VERSION, "Linkbot Brand Experiences v" + VERSION)}</p>
<h1>{T("One master identity, three experiences", "Eine Master-Identität, drei Erlebnisse")}</h1>
<p class="lede">{T(
  "Five responsive specimens. A is the Talent jobsite and its private job agent, B is the developer "
  "platform, C covers the employer workspace and the agency mandate. All five load the same logo files "
  "and the same type system; only the ground, the accent and the density differ.",
  "Fünf responsive Vorlagen. A ist die Talent-Jobbörse mit ihrem privaten Job-Agenten, B die "
  "Entwicklerplattform, C umfasst den Arbeitgeber-Arbeitsbereich und das Agentur-Mandat. Alle fünf "
  "laden dieselben Logo-Dateien und dasselbe Schriftsystem; nur Grund, Akzent und Dichte unterscheiden sich.")}</p>
<ul class="list">{rows}</ul>
<hr class="rule-strong">
<p class="kicker">{T("Shared assets", "Gemeinsame Assets")}</p>
<div class="svgrow">
  <figure>{svg_file('lockup-horizontal.svg')}<figcaption>{T("lockup-horizontal", "lockup-horizontal")}</figcaption></figure>
  <figure>{svg_file('lockup-stacked.svg')}<figcaption>{T("lockup-stacked", "lockup-stacked")}</figcaption></figure>
  <figure style="color:var(--lb-text)">{svg_file('mark.svg')}<figcaption>{T("mark", "mark")}</figcaption></figure>
  <figure>{svg_file('favicon.svg')}<figcaption>{T("favicon", "favicon")}</figcaption></figure>
</div>
<hr class="prov">
<p class="prov"><span class="stamp">{T("Candidate · not approved", "Entwurf · nicht freigegeben")}</span><br>
{T("Every experience here is PROPOSED and NO identity is approved. No runtime file, deployment or "
   "product surface is changed. Contrast evidence: validation/contrast-report.md. "
   "Shared versus override contract: validation/shared-vs-override.md.",
   "Jedes Erlebnis hier ist VORGESCHLAGEN und KEINE Identität ist freigegeben. Keine Laufzeitdatei, "
   "kein Deployment und keine Produktoberfläche wird geändert. Kontrastnachweis: "
   "validation/contrast-report.md. Vertrag shared vs. Override: validation/shared-vs-override.md.")}</p>
</main></body></html>
"""
    (ROOT / "index.html").write_text(html, encoding="utf-8")
    print("  wrote index.html")


def main() -> int:
    SHARED.mkdir(parents=True, exist_ok=True)
    (SHARED / "app.css").write_text(APP_CSS, encoding="utf-8")
    print(f"  wrote 00-shared/app.css ({len(APP_CSS)} bytes)")
    for slug, exp, letter, t_en, t_de, mode, fn in SCREENS:
        d = ROOT / slug
        d.mkdir(parents=True, exist_ok=True)
        html = page(slug, exp, letter, t_en, t_de, t_en, t_de, mode, fn())
        (d / "index.html").write_text(html, encoding="utf-8")
        print(f"  wrote {slug}/index.html ({len(html)} bytes)")
    write_index()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
