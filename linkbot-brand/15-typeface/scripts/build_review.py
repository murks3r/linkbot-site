#!/usr/bin/env python3
"""Linkbot Type — the review gallery, and a real round-dot alternative.

Writes review/gallery.html: one browser-accessible page for the demanding typography
review, with viewport panels driven by CONTAINER queries (so 320 px and 1440 px can be
inspected side by side on one screen), a light/dark switch, a glyph spotlight on the
characters that decide whether a face works (@ & # % * numerals punctuation), realistic
job listings, a full job description, navigation and form controls, salary figures and
dates, German and English paragraphs, labelled alternatives, explicit limitations, and
the A/B/C experiences evaluated together as one brand.

It also builds fonts/alternatives/LinkbotSans-RoundDots.woff2 — the same family with the
one switch flipped — so "alternative" is a rendered artifact rather than a paragraph.

The alternative face is deliberately NOT part of the seven validated faces: it is not in
the coverage claim, not in the asset registry, and not referenced by any experience.

Run: <venv>/bin/python scripts/build_review.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT.parent
SHARED = BRAND / "14-experiences" / "00-shared"
REVIEW = ROOT / "review"
ALT = ROOT / "fonts" / "alternatives"
VERSION = "0.2.0"

sys.path.insert(0, str(ROOT / "scripts"))

EXPERIENCES = [
    ("A", "A-talent", "Talent / Jobsite", "Notarial", "paper ground, seal accent"),
    ("B", "B-developer", "Developer Platform", "Protocol", "ink ground, phosphor accent"),
    ("C", "C-employer", "Employer / Agency", "Commons", "neutral light, ocean accent"),
]


# --------------------------------------------------------------- alternative face


def build_alternative() -> str | None:
    """The same family with round dots instead of square ones."""
    try:
        import glyphset
        import glyphset_extra
        from build_sources import build
        from glyphset import SANS
    except Exception as e:  # noqa: BLE001
        print(f"  alternative face skipped: {e}")
        return None

    glyphset.DOT_SHAPE = "round"
    ufo = build("LinkbotSans-Regular", SANS)

    from fontTools.ttLib import TTFont
    from ufo2ft import compileTTF

    ttf: TTFont = compileTTF(ufo, removeOverlaps=False, convertCubics=True,
                             flattenComponents=True, autoUseMyMetrics=False)
    from build_fonts import _fixed_epoch

    ttf.recalcTimestamp = False
    ttf["head"].created = _fixed_epoch()
    ttf["head"].modified = _fixed_epoch()
    ALT.mkdir(parents=True, exist_ok=True)
    ttf.save(ALT / "LinkbotSans-RoundDots.ttf")
    ttf.flavor = "woff2"
    ttf.save(ALT / "LinkbotSans-RoundDots.woff2")
    glyphset.DOT_SHAPE = "square"
    print(f"  wrote fonts/alternatives/LinkbotSans-RoundDots.woff2 "
          f"({(ALT / 'LinkbotSans-RoundDots.woff2').stat().st_size} bytes)")
    return "LinkbotSans-RoundDots"


# ------------------------------------------------------ experience role mapping


def kebab(s: str) -> str:
    return "".join("-" + c.lower() if c.isupper() else c for c in s)


def experience_role_css() -> str:
    """Map each experience's roles for BOTH modes, scoped to a panel.

    The Stage 1 token CSS scopes only the dark overrides, so three experiences cannot
    share one page in light mode from its stylesheet alone. The mapping is generated
    here from the emitted token JSON, which is also why it cannot drift from it.
    """
    out = []
    for letter, slug, _aud, _reg, _note in EXPERIENCES:
        tj = SHARED / f"experience-{slug}.tokens.json"
        if not tj.exists():
            continue
        data = json.loads(tj.read_text(encoding="utf-8"))
        for mode in ("light", "dark"):
            decls = []
            for key, tok in data["semantic"].items():
                m, role = key.split(".", 1)
                if m != mode:
                    continue
                prim = tok.get("$extensions", {}).get("linkbot.primitive")
                if prim:
                    decls.append(f"  --lb-{role}: var(--lb-{letter.lower()}-{kebab(prim)});")
            out.append(f'[data-exp="{letter}"][data-mode="{mode}"] {{\n' + "\n".join(decls) + "\n}")
    return "\n".join(out)


# ------------------------------------------------------------------------- content

JOBS = [
    ("Senior Backend Engineer", "Nordwind Systems", "Berlin, DE · Hybrid", "90 days", "€78,000–€94,000", "external"),
    ("Staff Engineer, Platform", "Halden Robotics", "Munich, DE · On-site", "30 days", "€95,000–€115,000", "external"),
    ("Product Engineer", "Kestrel Labs", "Remote, EU", "60 days", "€72,000–€88,000", "linkbot"),
    ("Data Engineer", "Aalborg Analytics", "Copenhagen, DK · Hybrid", "120 days", "€68,000–€82,000", "external"),
    ("Site Reliability Engineer", "Fjordline Cloud", "Oslo, NO · Remote", "45 days", "€80,000–€98,000", "external"),
    ("Frontend Engineer, Design Systems", "Meridian Health", "Amsterdam, NL · Hybrid", "75 days", "€70,000–€86,000", "linkbot"),
    ("Machine Learning Engineer", "Vantage Robotics", "Zurich, CH · On-site", "60 days", "CHF 120,000–CHF 145,000", "external"),
    ("Platform Engineer, Kubernetes", "Bluewave Logistics", "Hamburg, DE · Hybrid", "90 days", "€76,000–€92,000", "external"),
    ("Engineering Manager, Payments", "Sundström Finans", "Stockholm, SE · Hybrid", "120 days", "SEK 850,000–SEK 980,000", "external"),
    ("Backend Engineer, Go", "Tessera Systems", "Lisbon, PT · Remote", "30 days", "€58,000–€72,000", "linkbot"),
    ("Security Engineer", "Northgate Digital", "Dublin, IE · Hybrid", "45 days", "€82,000–€96,000", "external"),
    ("iOS Engineer", "Kestrel Labs", "Remote, EU", "60 days", "€74,000–€90,000", "external"),
    ("Database Engineer, PostgreSQL", "Aalborg Analytics", "Copenhagen, DK · On-site", "90 days", "DKK 620,000–DKK 720,000", "external"),
    ("Developer Advocate", "Protocol Labs EU", "Remote, EU", "30 days", "€65,000–€80,000", "linkbot"),
    ("Infrastructure Engineer, Terraform", "Fjordline Cloud", "Oslo, NO · Hybrid", "75 days", "NOK 780,000–NOK 900,000", "external"),
    ("Principal Engineer, Architecture", "Meridian Health", "Amsterdam, NL · Hybrid", "120 days", "€105,000–€125,000", "external"),
    ("QA Engineer, Automation", "Bluewave Logistics", "Hamburg, DE · Hybrid", "45 days", "€62,000–€74,000", "external"),
    ("Technical Writer, API", "Tessera Systems", "Remote, EU", "60 days", "€55,000–€68,000", "linkbot"),
    ("Solutions Engineer", "Northgate Digital", "Dublin, IE · Hybrid", "90 days", "€70,000–€84,000", "external"),
    ("Engineering Manager, Core", "Sundström Finans", "Stockholm, SE · Hybrid", "120 days", "SEK 900,000–SEK 1,050,000", "external"),
]

DESCRIPTION = """
Two paragraphs of the kind of prose a job description actually contains — nothing
written for a type specimen, because a specimen that only shows flattering text flatters
the typeface.
""".strip()

EN_PARA = """Linkbot is a permissioned matching layer for recruiting. The holder keeps a
private, versioned record; an employer requests one bounded signal; the holder decides;
the disclosure is receipted and revocable for future use. Nothing is published, nothing
is scraped, and there is no public profile URL. Requirements render as met, unknown or
unmet — an unknown requirement is shortlisted for verification and is never displayed as
verified. Employer access is membership- and role-bound, with its own workspace and its
own receipts."""

DE_PARA = """Linkbot ist eine einwilligungsbasierte Vermittlungsschicht für die
Personalbeschaffung. Der Inhaber führt einen privaten, versionierten Datensatz; ein
Arbeitgeber fragt ein begrenztes Signal an; der Inhaber entscheidet; die Offenlegung wird
belegt und ist für die künftige Nutzung widerrufbar. Nichts wird veröffentlicht, nichts
wird ausgelesen, und es gibt keine öffentliche Profil-URL. Anforderungen erscheinen als
erfüllt, unbekannt oder nicht erfüllt — eine unbekannte Anforderung wird zur Prüfung
vorgemerkt und nie als geprüft dargestellt. Der Arbeitgeberzugang ist mitgliedschafts-
und rollengebunden, mit eigenem Arbeitsbereich und eigenen Belegen. Größe, Prüfung,
Änderung, Übung, Straße."""

SALARIES = [
    ("Senior Backend Engineer", "€78,000 – €94,000", "90 days", "2026-10-09", "v3", "4.53:1"),
    ("Staff Engineer, Platform", "€95,000 – €115,000", "30 days", "2026-09-28", "v3", "12.50 €"),
    ("Data Engineer", "DKK 620,000 – 720,000", "120 days", "2026-08-14", "v1", "0,25 %"),
    ("Engineering Manager", "SEK 900,000 – 1,050,000", "75 days", "2026-07-01", "v2", "−0,10 %"),
]


def job_rows() -> str:
    out = []
    for i, (title, employer, place, avail, pay, kind) in enumerate(JOBS, 1):
        src = ('<span class="tag tag-linkbot">Linkbot listing</span>' if kind == "linkbot"
               else '<span class="tag">External listing</span>')
        out.append(f"""      <li class="jobitem">
        <p class="rank mono">{i:02d}</p>
        <div class="jobmain">
          <p class="jobtitle">{title}</p>
          <p class="jobmeta"><span>{employer}</span><span>{place}</span>
            <span>available in {avail}</span></p>
        </div>
        <div class="jobright"><p class="pay mono tnum">{pay}</p>{src}</div>
      </li>""")
    return "\n".join(out)


def role_table() -> str:
    rows = []
    for letter, slug, aud, reg, note in EXPERIENCES:
        tj = SHARED / f"experience-{slug}.tokens.json"
        if not tj.exists():
            continue
        data = json.loads(tj.read_text(encoding="utf-8"))
        pal = {k: v["$value"] for k, v in data["color"]["palette"].items()}
        ov = {k: v["$value"] for k, v in data["color"]["override-keys"].items()}
        swatches = "".join(
            f'<span class="sw" style="background:{v}" title="{k} {v}"></span>' for k, v in ov.items()
        )
        rows.append(f"""      <tr>
        <td><b>{letter}</b> — {aud}<div class="note">{reg}: {note}</div></td>
        <td class="mono">{"".join(k + " " + v + "<br>" for k, v in list(ov.items())[:3])}</td>
        <td><div class="sw-row">{swatches}</div><div class="note">{len(ov)} override values</div></td>
      </tr>""")
    return "\n".join(rows)


CSS = """
*,*::before,*::after{box-sizing:border-box}
:root{
  --lb-canvas:var(--lb-a-paper); --lb-surface:var(--lb-a-porcelain);
  --lb-surface-sunken:var(--lb-a-paper-deep); --lb-text:var(--lb-a-ink);
  --lb-text-muted:var(--lb-a-slate); --lb-brand:var(--lb-a-seal);
  --lb-brand-contrast:var(--lb-a-paper); --lb-link:var(--lb-a-seal);
  --lb-border-subtle:var(--lb-a-rule); --lb-border-control:var(--lb-a-control-light);
  --lb-status-granted:var(--lb-a-granted-light); --lb-status-pending:var(--lb-a-pending-light);
  --lb-status-denied:var(--lb-a-denied-light); --lb-status-unknown:var(--lb-a-unknown-light);
  --lb-marker:var(--lb-a-mint); --lb-marker-contrast:var(--lb-a-ink);
}
[data-mode="dark"]{
  --lb-canvas:var(--lb-a-midnight); --lb-surface:var(--lb-a-midnight-raised);
  --lb-surface-sunken:var(--lb-a-midnight-sunken); --lb-text:var(--lb-a-moon-text);
  --lb-text-muted:var(--lb-a-moon-dim); --lb-brand:var(--lb-a-seal-bright);
  --lb-brand-contrast:var(--lb-a-midnight); --lb-link:var(--lb-a-seal-bright);
  --lb-border-subtle:var(--lb-a-midnight-line); --lb-border-control:var(--lb-a-midnight-control);
  --lb-status-granted:var(--lb-a-granted-dark); --lb-status-pending:var(--lb-a-pending-dark);
  --lb-status-denied:var(--lb-a-denied-dark); --lb-status-unknown:var(--lb-a-unknown-dark);
  --lb-marker:var(--lb-a-mint); --lb-marker-contrast:var(--lb-a-ink);
}
body{margin:0;background:var(--lb-canvas);color:var(--lb-text);
  font-family:var(--lb-font-sans);line-height:1.55}
.wrap{max-width:1240px;margin:0 auto;padding:0 20px}
section{padding:40px 0;border-bottom:1px solid var(--lb-border-subtle)}
h1,h2,h3{font-family:var(--lb-font-display);font-weight:400;letter-spacing:-.02em;line-height:1.08;margin:0 0 12px}
h1{font-size:clamp(1.9rem,4vw,2.8rem)}
h2{font-size:clamp(1.3rem,2.2vw,1.8rem)}
.k{font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--lb-text-muted);margin:0 0 10px}
.mono{font-family:var(--lb-font-mono)}.tnum{font-variant-numeric:tabular-nums}
.note{font-size:.86rem;color:var(--lb-text-muted);margin:6px 0 0;max-width:60ch}
.bar{position:sticky;top:0;z-index:9;background:var(--lb-canvas);
  border-bottom:1px solid var(--lb-border-subtle);display:flex;gap:14px;align-items:center;
  justify-content:space-between;padding:12px 20px;flex-wrap:wrap}
.bar svg{height:24px;width:auto;color:var(--lb-text);display:block}
.seg{display:flex;gap:6px;flex-wrap:wrap}
.seg button{font:inherit;font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.08em;
  text-transform:uppercase;padding:6px 10px;border:1px solid var(--lb-border-control);
  border-radius:2px;background:transparent;color:var(--lb-text);cursor:pointer}
.seg button[aria-pressed="true"]{background:var(--lb-brand);color:var(--lb-brand-contrast);
  border-color:var(--lb-brand)}
:focus-visible{outline:2px solid var(--lb-brand);outline-offset:2px}

/* glyph spotlight */
.spot{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}
.spot figure{margin:0;background:var(--lb-surface);border:1px solid var(--lb-border-subtle);
  border-radius:2px;padding:10px 12px 6px;text-align:center;overflow:hidden}
.spot .glyph{font-size:118px;line-height:1.02;display:block;font-family:var(--lb-font-sans)}
.spot .glyph.d{font-family:var(--lb-font-display)}
.spot .mono-glyph{font-family:var(--lb-font-mono);font-size:118px;line-height:1.02;display:block}
.spot figcaption{font-family:var(--lb-font-mono);font-size:10.5px;letter-spacing:.1em;
  text-transform:uppercase;color:var(--lb-text-muted);padding-top:6px}

/* type sizes */
.spec{border-bottom:1px solid var(--lb-border-subtle);padding:12px 0;
  display:grid;grid-template-columns:150px 1fr;gap:16px;align-items:baseline}
.spec .lbl{font-family:var(--lb-font-mono);font-size:11px;color:var(--lb-text-muted)}
@media(max-width:640px){.spec{grid-template-columns:1fr;gap:4px}}
.d76{font-family:var(--lb-font-display);font-size:76px;line-height:1.02;letter-spacing:-.03em;font-weight:400}
.d60{font-family:var(--lb-font-display);font-size:60px;line-height:1.03;letter-spacing:-.03em}
.d48{font-family:var(--lb-font-display);font-size:48px;line-height:1.05;letter-spacing:-.025em}
.d38{font-family:var(--lb-font-display);font-size:38px;line-height:1.08;letter-spacing:-.02em}
.d30{font-family:var(--lb-font-display);font-size:30px;line-height:1.14;letter-spacing:-.02em}
.d24{font-family:var(--lb-font-display);font-size:24px;line-height:1.2}
.s20{font-size:20px}.s18{font-size:18px}.s16{font-size:16px}.s14{font-size:14px}.s13{font-size:13px}
.s12{font-family:var(--lb-font-mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase}
@media(max-width:520px){.d76{font-size:40px}.d60{font-size:34px}.d48{font-size:30px}}

/* job listing */
.list{list-style:none;margin:0;padding:0}
.jobitem{display:grid;grid-template-columns:44px 1fr auto;gap:16px;align-items:baseline;
  padding:12px 0;border-bottom:1px solid var(--lb-border-subtle)}
.rank{margin:0;color:var(--lb-text-muted);font-size:12px}
.jobtitle{margin:0;font-size:17px;font-weight:500}
.jobmeta{margin:4px 0 0;display:flex;gap:14px;flex-wrap:wrap;
  font-family:var(--lb-font-mono);font-size:12px;color:var(--lb-text-muted)}
.jobright{margin:0;text-align:right}
.pay{margin:0;font-size:14px}
.tag{display:inline-block;font-family:var(--lb-font-mono);font-size:10.5px;letter-spacing:.1em;
  text-transform:uppercase;border:1px solid var(--lb-border-subtle);border-radius:2px;
  padding:2px 7px;color:var(--lb-text-muted);margin-top:6px}
.tag-linkbot{background:var(--lb-marker);color:var(--lb-marker-contrast);border-color:var(--lb-marker)}
@container (max-width:420px){
  .jobitem{grid-template-columns:1fr;gap:6px}
  .rank{display:none}
  .jobright{text-align:left}
  .jobmeta{flex-direction:column;gap:2px}
}

/* surfaces / controls */
.card{background:var(--lb-surface);border:1px solid var(--lb-border-subtle);
  border-radius:2px;padding:16px}
.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(270px,1fr))}
.field{display:block;margin-bottom:12px}
.field span{display:block;font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--lb-text-muted);margin-bottom:5px}
.field input,.field select{font:inherit;width:100%;padding:9px 12px;background:var(--lb-surface);
  color:var(--lb-text);border:1px solid var(--lb-border-control);border-radius:2px}
.btn{font:inherit;font-size:.94rem;font-weight:500;padding:10px 16px;border-radius:2px;
  cursor:pointer;border:1px solid transparent;display:inline-flex;gap:8px;align-items:center;
  background:transparent;color:var(--lb-text)}
.btn.primary{background:var(--lb-brand);color:var(--lb-brand-contrast)}
.btn.secondary{border-color:var(--lb-border-control)}
.btn.quiet{color:var(--lb-link);text-decoration:underline}
nav.crumbs{display:flex;gap:14px;flex-wrap:wrap;font-size:14px}
nav.crumbs a{color:var(--lb-link)}
table.tbl{border-collapse:collapse;width:100%;font-size:.93rem}
table.tbl th,table.tbl td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--lb-border-subtle)}
table.tbl th{font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--lb-text-muted);font-weight:400}
ul.reqs{margin:0;padding-left:20px}ul.reqs li{margin:6px 0}
.de,.en{max-width:64ch}

/* viewport panels */
.vps{display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap}
.vp{container-type:inline-size;border:1px solid var(--lb-border-control);border-radius:4px;
  background:var(--lb-canvas);overflow:hidden;flex:0 0 auto}
.vp-320{width:320px}.vp-390{width:390px}.vp-1440{width:100%;max-width:1440px}
.vp-head{font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--lb-text-muted);padding:8px 12px;border-bottom:1px solid var(--lb-border-subtle)}
.vp-body{padding:16px}

/* alternatives */
.alt{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
.altbox{background:var(--lb-surface);border:1px solid var(--lb-border-subtle);border-radius:2px;padding:14px}
.altbox h3{font-family:var(--lb-font-display);font-size:1.05rem;margin-bottom:8px}
.big{font-size:56px;line-height:1.1;margin:0 0 6px}
.rounded{font-family:"LBRoundDots",var(--lb-font-sans)}

/* one brand */
.brandrow{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
.bpanel{border:1px solid var(--lb-border-control);border-radius:3px;overflow:hidden;background:var(--lb-canvas)}
.bhead{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 14px;
  border-bottom:1px solid var(--lb-border-subtle)}
.bhead svg{height:20px;width:auto;color:var(--lb-text)}
.bhead .who{font-family:var(--lb-font-mono);font-size:10.5px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--lb-text-muted)}
.bbody{padding:14px;color:var(--lb-text)}
.sw-row{display:flex;gap:4px;margin-top:4px}
.sw{width:22px;height:22px;border-radius:2px;border:1px solid var(--lb-border-subtle);display:block}
.stamp{display:inline-block;border:1px dashed var(--lb-brand);color:var(--lb-brand);
  font-family:var(--lb-font-mono);font-size:11px;letter-spacing:.16em;padding:5px 10px;
  border-radius:2px;text-transform:uppercase}
.lim li{margin:8px 0;max-width:78ch}
"""

JS = """
(function(){
  var root=document.documentElement;
  var m=document.querySelectorAll('[data-mode-btn]');
  function mode(v){root.setAttribute('data-mode',v);
    root.querySelectorAll('[data-exp]').forEach(function(p){p.setAttribute('data-mode',v);});
    m.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.modeBtn===v));});}
  m.forEach(function(b){b.addEventListener('click',function(){mode(b.dataset.modeBtn);});});
  var s=document.querySelectorAll('[data-scale-btn]');
  function scale(px){root.style.setProperty('--review-scale',px);
    document.querySelectorAll('.jobtitle').forEach(function(e){e.style.fontSize=px+'px';});}
  s.forEach(function(b){b.addEventListener('click',function(){
    scale(b.dataset.scaleBtn);
    s.forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});});});
  mode('light');
})();
"""


def gallery() -> str:
    jobitems = job_rows()
    shared_lockup = (BRAND / "14-experiences" / "logo" / "lockup-horizontal.svg").read_text(encoding="utf-8")
    type_lockup = (BRAND / "15-typeface" / "wordmark" / "lockup-horizontal.svg").read_text(encoding="utf-8")
    specs = [
        ("display 76", f'<p class="d76">The record is the brand</p>'),
        ("display 60", '<p class="d60">Permissioned, not published</p>'),
        ("display 48", '<p class="d48">One bounded signal, one decision</p>'),
        ("display 38", '<p class="d38">Employer workspace and agency mandate</p>'),
        ("display 30", '<p class="d30">Revocable for future use</p>'),
        ("display 24", '<p class="d24">Receipts, versions and expiry</p>'),
        ("sans 20", '<p class="s20">An employer asks for one bounded signal.</p>'),
        ("sans 16", '<p class="s16">You decide whether to release it. Revoking stops future access; '
                    'it does not claim that delivered copies were erased.</p>'),
        ("sans 14", '<p class="s14">Dense UI: table cells, filters, metadata rows, tokenised values.</p>'),
        ("mono 12", '<p class="s12">policy v3 · 2026-10-09T09:14Z · 4.53:1</p>'),
    ]
    spec_html = "\n".join(
        f'<div class="spec"><span class="lbl">{lbl}</span>{body}</div>' for lbl, body in specs
    )
    spot = "".join(
        f'<figure><span class="{cls}">{ch}</span><figcaption>{cap}</figcaption></figure>'
        for ch, cls, cap in [
            ("@", "glyph", "@ U+0040 sans"), ("&", "glyph", "& U+0026 sans"),
            ("@", "glyph d", "@ U+0040 display"), ("&", "glyph d", "& U+0026 display"),
            ("0123456789", "glyph tnum", "figures"), ("#%*", "glyph", "# % *"),
            ("?!.,;:", "glyph", "punctuation"), ("ä ö ü ß ẞ", "glyph", "german"),
            ("€ $ £", "glyph", "currency"), ("gjy1lI0O", "glyph", "ambiguity"),
            ("@", "mono-glyph", "@ mono"), ("&", "mono-glyph", "& mono"),
        ])
    sal_rows = "".join(
        f'<tr><td>{r}</td><td class="mono tnum">{p}</td><td class="mono tnum">{a}</td>'
        f'<td class="mono tnum">{d}</td><td class="mono">{v}</td></tr>'
        for r, p, a, d, v, _x in SALARIES)

    return f"""<!doctype html>
<html lang="en" data-mode="light">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Linkbot Type {VERSION} — typography review gallery</title>
<meta name="description" content="Typography review gallery for Linkbot Type — PROPOSED, not approved. Includes labelled alternatives and limitations.">
<link rel="stylesheet" href="../../14-experiences/00-shared/tokens.shared.css">
<link rel="stylesheet" href="../../14-experiences/00-shared/experience-A-talent.tokens.css">
<link rel="stylesheet" href="../../14-experiences/00-shared/experience-B-developer.tokens.css">
<link rel="stylesheet" href="../../14-experiences/00-shared/experience-C-employer.tokens.css">
<link rel="stylesheet" href="../../14-experiences/00-shared/fonts.css">
<style>
@font-face{{font-family:"LBRoundDots";src:url("../fonts/alternatives/LinkbotSans-RoundDots.woff2") format("woff2");font-weight:400;font-display:swap}}
{experience_role_css()}
{CSS}
</style></head>
<body>
<header class="bar">
  <div style="color:var(--lb-text)">{shared_lockup}</div>
  <div class="seg" role="group" aria-label="Theme">
    <button type="button" data-mode-btn="light" aria-pressed="true">Light</button>
    <button type="button" data-mode-btn="dark" aria-pressed="false">Dark</button>
  </div>
  <div class="seg" role="group" aria-label="Listing density">
    <button type="button" data-scale-btn="17" aria-pressed="true">Listing 17px</button>
    <button type="button" data-scale-btn="15" aria-pressed="false">15px</button>
    <button type="button" data-scale-btn="19" aria-pressed="false">19px</button>
  </div>
</header>
<div class="wrap">

<section>
  <p class="k">Linkbot Type {VERSION} · typography review · candidate, not approved</p>
  <h1>Typography review gallery</h1>
  <p class="note" style="max-width:74ch">This page exists to be argued with. It renders the
  type in the contexts it will actually meet — long descriptions, dense listings, forms,
  figures, two languages, three viewports, two themes — and it labels what is wrong as
  clearly as what works. <b>A passing technical gate is not design approval.</b> The
  owner has rejected the current website's typography, spacing and colour; nothing here
  should be read as a claim that this replaces that judgement.</p>
  <p class="note"><b>How to review the viewports:</b> the two panels below are real
  320 px and 390 px containers, driven by CSS container queries, so they reflow
  independently of this window. Resize this window for 1440 px. Switch theme with the
  header control; switch listing density to see whether the face survives 15 px.</p>
  <p><span class="stamp">Proposed · not approved</span></p>
</section>

<section>
  <p class="k">1 · Glyph spotlight — the characters that decide it</p>
  <h2>@ &amp; numerals, punctuation, ambiguity</h2>
  <div class="spot">{spot}</div>
  <p class="note">Read this section first. Two of the three flagged glyphs were redrawn in
  this revision: <b>@</b> was two concentric rings — a bullseye — and is now a ring with an
  open inner bowl and a right-hand bar; <b>?</b> was a flat hook and is now a round bowl with
  a near-vertical tail. <b>&amp;</b> is recognizable at display sizes but idiosyncratic — at
  12–14 px it can read as a figure eight, and it is the one glyph this review still
  recommends redrawing. The <b>ambiguity</b> card is what matters for a recruiting product
  full of codes and versions: <span class="mono">1 l I</span> separate by width and by
  context, <span class="mono">0 O</span> by proportion.</p>
</section>

<section>
  <p class="k">2 · Headings, large and small</p>
  <h2>Display sizes</h2>
  {spec_html}
  <p class="note">Above 48 px the Display face carries real editorial authority; at 24 px
  it is already thinning and should not be pushed lower. Display is not a text face and
  the tokens say so.</p>
</section>

<section>
  <p class="k">3 · Dense job-result listing — 20 rows, real figures</p>
  <h2>Listing</h2>
  <ul class="list">
{jobitems}
  </ul>
  <p class="note">The mixer is deliberate: five currencies, five date formats, both
  listing kinds. Figures share one width, so salary columns align without a feature.
  At 15 px (header control) the listing still holds; the metadata row is the first thing
  to become crowded.</p>
</section>

<section>
  <p class="k">4 · Full job description — the long-text test</p>
  <h2>Senior Backend Engineer</h2>
  <div class="grid">
    <div class="card">
      <h3>About the role</h3>
      <p class="s16">{EN_PARA}</p>
      <p class="s16">The team runs the request path end to end. You will work on the
      disclosure service, the receipt ledger and the policy-version checks that decide
      whether a request is authorised at all. Expect to read more specifications than
      tickets, and to write the specification when one is missing.</p>
      <h3 style="margin-top:18px">Requirements</h3>
      <ul class="reqs s16">
        <li>Five or more years building backend services in Go, Java or Rust</li>
        <li>Comfortable with PostgreSQL: indexes, query plans, migrations at scale</li>
        <li>Experience with Kubernetes in production, not only in a training cluster</li>
        <li>Written English at specification level; German is useful, not required</li>
      </ul>
    </div>
    <div>
      <div class="card">
        <h3>Requirement view</h3>
        <table class="tbl">
          <tr><th>Requirement</th><th>State</th></tr>
          <tr><td>Senior backend, 5y+</td><td>met</td></tr>
          <tr><td>EU work authorisation</td><td>unknown → verify</td></tr>
          <tr><td>Willing to relocate</td><td>unmet → blocked</td></tr>
        </table>
      </div>
      <div class="card" style="margin-top:16px">
        <h3>Compensation</h3>
        <p class="pay mono tnum" style="font-size:20px">€78,000 – €94,000</p>
        <p class="note">Stated range, employer-provided. Linkbot does not calculate,
        normalise or rank this figure.</p>
      </div>
    </div>
  </div>
</section>

<section>
  <p class="k">5 · Navigation, forms and search filters</p>
  <h2>Controls</h2>
  <nav class="crumbs"><a href="#">Jobs</a><a href="#">Your record</a><a href="#">Requests</a>
    <a href="#">Receipts</a><a href="#">Settings</a></nav>
  <div class="grid" style="margin-top:16px">
    <div class="card">
      <h3>Search filters</h3>
      <label class="field"><span>Role or skill</span><input value="backend engineer"></label>
      <label class="field"><span>Location</span><input value="Berlin / Remote EU"></label>
      <label class="field"><span>Available within</span><select><option>90 days</option></select></label>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn primary" type="button">Search</button>
        <button class="btn secondary" type="button">Reset</button>
        <button class="btn quiet" type="button">Save this search</button>
      </div>
    </div>
    <div class="card">
      <h3>Focus and disabled states</h3>
      <p class="note">Tab through the controls; the focus ring is a token and is never
      removed.</p>
      <label class="field"><span>Signal requested</span><input value="eligible for senior engineering"></label>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
        <button class="btn secondary" type="button">See the request</button>
        <button class="btn" type="button" disabled style="color:var(--lb-text-muted);border-color:var(--lb-border-subtle)">Not available</button>
      </div>
    </div>
  </div>
</section>

<section>
  <p class="k">6 · Salary figures and dates</p>
  <h2>Tabular alignment</h2>
  <table class="tbl">
    <tr><th>Role</th><th>Stated range</th><th>Available</th><th>Recorded</th><th>Policy</th></tr>
    {sal_rows}
  </table>
  <p class="note">One advance per digit, so columns align in every face including the
  monospaced one. The negative percentage uses U+2212 MINUS, not a hyphen — at 12 px the
  difference is visible and the hyphen is the wrong glyph for it.</p>
</section>

<section>
  <p class="k">7 · German and English</p>
  <h2>Two languages, one voice</h2>
  <div class="grid">
    <div class="card"><h3>English</h3><p class="en s16">{EN_PARA}</p></div>
    <div class="card"><h3>Deutsch</h3><p class="de s16">{DE_PARA}</p></div>
  </div>
  <p class="note">German is longer, uses more capitals and carries the umlauts and ß.
  Watch the line endings and the hyphenation breaks, not only the glyphs.</p>
</section>

<section>
  <p class="k">8 · Viewports — 320 px, 390 px, and 1440 px</p>
  <h2>Reflow</h2>
  <div class="vps">
    <div class="vp vp-320">
      <div class="vp-head">320 px</div>
      <div class="vp-body">
        <p class="s18" style="margin:0 0 10px"><b>Junior Backend Engineer</b></p>
        <ul class="list">
          <li class="jobitem"><p class="rank mono">01</p>
            <div class="jobmain"><p class="jobtitle">Senior Backend Engineer</p>
              <p class="jobmeta"><span>Nordwind Systems</span><span>Berlin, DE · Hybrid</span></p></div>
            <div class="jobright"><p class="pay mono tnum">€78,000 – €94,000</p>
              <span class="tag tag-linkbot">Linkbot listing</span></div></li>
          <li class="jobitem"><p class="rank mono">02</p>
            <div class="jobmain"><p class="jobtitle">Data Engineer</p>
              <p class="jobmeta"><span>Aalborg Analytics</span><span>Copenhagen, DK</span></p></div>
            <div class="jobright"><p class="pay mono tnum">DKK 620,000 – 720,000</p>
              <span class="tag">External listing</span></div></li>
        </ul>
      </div>
    </div>
    <div class="vp vp-390">
      <div class="vp-head">390 px</div>
      <div class="vp-body">
        <p class="s18" style="margin:0 0 10px"><b>Junior Backend Engineer</b></p>
        <ul class="list">
          <li class="jobitem"><p class="rank mono">01</p>
            <div class="jobmain"><p class="jobtitle">Senior Backend Engineer</p>
              <p class="jobmeta"><span>Nordwind Systems</span><span>Berlin, DE · Hybrid</span></p></div>
            <div class="jobright"><p class="pay mono tnum">€78,000 – €94,000</p>
              <span class="tag tag-linkbot">Linkbot listing</span></div></li>
        </ul>
      </div>
    </div>
  </div>
  <p class="note">Below 420 px the listing drops to one column, hides the rank gutter and
  stacks the metadata. Nothing overflows and nothing is truncated; the salary moves under
  the title rather than being clipped.</p>
</section>

<section>
  <p class="k">9 · Labelled alternatives</p>
  <h2>Three decisions, and what each one costs</h2>
  <div class="alt">
    <div class="altbox">
      <h3>A1 · Dots — square (current) vs round</h3>
      <p class="big">ij öü · ! ? : ;</p>
      <p class="big rounded">ij öü · ! ? : ;</p>
      <p class="note"><b>Current:</b> square dots, the mark's inscribed square, built by one
      helper. <b>Alternative, rendered above:</b> the same family with the switch flipped
      (<span class="mono">glyphset.DOT_SHAPE = "round"</span>), built to
      <span class="mono">fonts/alternatives/</span>. Cost of changing: one line, and the
      family loses its loudest identifying feature — which is the whole argument for
      keeping it.</p>
    </div>
    <div class="altbox">
      <h3>A2 · Display contrast — 0.60 (current) vs 0.95</h3>
      <p class="d38">Notarial Record</p>
      <p class="note">Current horizontal/vertical stroke ratio is 0.60: real thick-thin
      contrast. Setting it to 0.95 would make Display a wide Sans at heading sizes —
      cheaper to space, and it would stop Display being a separate role at all. Not built:
      it is a one-parameter change and building it would imply the decision was open.</p>
    </div>
    <div class="altbox">
      <h3>A3 · Mono x-height — 0.743 vs 0.714</h3>
      <p class="mono" style="font-size:22px">policy_version: v3 → 09:14Z</p>
      <p class="note">Mono's x-height is deliberately larger than Sans's so 12 px code
      stays readable. Matching Sans instead would make the two roles more obviously
      related and slightly harder to read in small code. Not built, for the same reason
      as A2.</p>
    </div>
    <div class="altbox">
      <h3>A4 · &amp; — redraw it</h3>
      <p class="glyph" style="font-size:64px">&amp;</p>
      <p class="note"><b>Current:</b> a double-loop form that holds at display sizes and
      gets ambiguous at 12–14 px. <b>Recommended:</b> redraw this one glyph. @ and ? were
      already redrawn in this revision, which is why they are no longer listed here.</p>
    </div>
  </div>
</section>

<section>
  <p class="k">10 · One brand, three experiences</p>
  <h2>A, B and C together</h2>
  <p class="note" style="max-width:74ch">The same lockup, the same type and the same
  components in all three panels. Only the ground, the accent and the density change —
  the overrides are the <b>swatch columns</b> below and nothing else. If a panel looks
  like a different company, the architecture has failed, not the palette.</p>
  <div class="brandrow">
    <div class="bpanel" data-exp="A" data-mode="light">
      <div class="bhead">
        {type_lockup}
        <span class="who">A · Talent</span></div>
      <div class="bbody">
        <p class="d24" style="margin:0 0 8px">The record you keep</p>
        <p class="s16">You hold a private, versioned record. An employer asks for one
        bounded signal; you answer yes, no, or not now.</p>
        <p class="pay mono tnum" style="margin-top:12px">€78,000 – €94,000 · v3 · 90 days</p>
        <p style="margin-top:10px"><span class="tag tag-linkbot">Linkbot listing</span></p>
      </div>
    </div>
    <div class="bpanel" data-exp="B" data-mode="light">
      <div class="bhead">
        {type_lockup}
        <span class="who">B · Developer</span></div>
      <div class="bbody">
        <p class="d24" style="margin:0 0 8px">The consent layer is the API</p>
        <p class="s16">Every endpoint is bounded by the same authority model. Unknown
        version, purpose, evaluator or domain fails closed.</p>
        <p class="mono" style="font-size:12.5px;margin-top:12px">POST /v1/disclosures/{{id}}/revoke</p>
        <p style="margin-top:10px"><span class="tag">fail-closed</span></p>
      </div>
    </div>
    <div class="bpanel" data-exp="C" data-mode="light">
      <div class="bhead">
        {type_lockup}
        <span class="who">C · Employer / Agency</span></div>
      <div class="bbody">
        <p class="d24" style="margin:0 0 8px">You request. The person decides.</p>
        <p class="s16">This workspace shows only what was authorised for this membership,
        for this purpose, at this policy version.</p>
        <p class="pay mono tnum" style="margin-top:12px">3 requests · 1 blocked · 2 awaiting verification</p>
        <p style="margin-top:10px"><span class="tag">role-bound</span></p>
      </div>
    </div>
  </div>
  <h3 style="margin-top:22px">What actually differs — the override values</h3>
  <table class="tbl">
    <tr><th>Experience</th><th>Override values</th><th>Swatches</th></tr>
{role_table()}
  </table>
  <p class="note">Everything else — 27 shared primitives, 18 role names, the type, the
  spacing, the radii, the motion, the four state colours — is byte-identical across the
  three, and the Stage 1 gate fails the build if that stops being true. Full experience
  screens: <span class="mono">../../14-experiences/index.html</span>.</p>
</section>

<section>
  <p class="k">11 · Limitations — stated, not buried</p>
  <h2>What is not good enough yet</h2>
  <ul class="lim">
    <li><b>&amp; is still idiosyncratic.</b> Observable at 12–14 px in section 1. It is one
    glyph; it should be redrawn before the face is used at small UI sizes. (@ and ? were
    redrawn in this revision.)</li>
    <li><b>No hinting, no print proof, no type-designer review.</b> The fonts pass the
    gates; the gates measure coverage, outlines, metrics and kerning, not beauty.</li>
    <li><b>The square dot is a decision, not a detail.</b> It is the family's identity and
    the most likely thing to be rejected in UI text. The alternative is built and rendered
    in A1 so the choice can be made on evidence.</li>
    <li><b>Not a variable font.</b> Three roles × 7 static faces. A <span class="mono">wght</span>
    axis is feasible because the topology matches, and was not attempted rather than
    attempted and shipped unvalidated.</li>
    <li><b>Coverage stops at 204 codepoints.</b> No caret, pipe, ligatures, Greek, Cyrillic
    or CJK; those fall back to a licensed OFL face. The fallback is a degradation and it is
    visible when it happens.</li>
    <li><b>Tracking and spacing are first-pass.</b> The specimen shows occasional uneven
    space around <span class="mono">r</span>, <span class="mono">r.</span> and
    <span class="mono">f</span> sequences; the kerning table covers 39 pairs, not the
    hundreds a production face would carry.</li>
    <li><b>The mobile panels are container-driven, the product is not.</b> Reflow below
    420 px is specified here and in the experience specimens; no product surface has been
    restyled to prove it.</li>
    <li><b>Fourteen of the letters are geometric-by-construction.</b> That is the family's
    premise; a reader who wants movement, modulation or history in the letterforms will
    not find it here.</li>
  </ul>
</section>

<section style="border-bottom:0">
  <p class="k">12 · Status</p>
  <h2>Not approved, and not a substitute for the owner's judgement</h2>
  <p class="note" style="max-width:74ch">Every face in this gallery is <b>PROPOSED</b>. The
  technical gates pass — coverage, outlines, metrics, kerning and byte-reproducibility are
  all verified against the compiled binaries — and that is precisely the point: <b>a
  passing gate is not design approval</b>. The owner rejected the current website's
  typography, spacing and colour. Nothing here has been accepted in place of that
  judgement, and no production surface has been restyled with it.</p>
</section>

</div>
<script>{JS}</script>
</body></html>
"""


def main() -> int:
    REVIEW.mkdir(parents=True, exist_ok=True)
    build_alternative()
    html = gallery()
    (REVIEW / "gallery.html").write_text(html, encoding="utf-8")
    print(f"  wrote review/gallery.html ({len(html)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
