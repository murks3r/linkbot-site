# Linkbot Brand Experiences

Version **0.1.0** · branch `parallel/brand-experiences-v1` · based on Linkbot Brand OS
v0.1.0 (`parallel/brand-os-v1`, PR #8).

**One master identity, three interface experiences.** This folder is a **non-applied**
artifact set: it describes, evidences and proposes. It changes no runtime file, ships no
approved brand, and contains no production master.

```
14-experiences/
  00-shared/         the identity-invariant token layer + the one type system + app.css
  logo/              the ONE shared logo system (Direction A mark, variants, lockups)
  01-talent-jobsite/          A  Talent        — job search and job detail
  02-private-job-agent/       A  Talent        — private job-agent onboarding
  03-developer-platform/      B  Developer     — API documentation and MCP
  04-employer-dashboard/      C  Employer      — hiring dashboard
  05-agency-mandate/          C  Agency        — recruiting mandate and shortlist
  validation/        computed contrast report; the shared-vs-override contract
  scripts/           generators and the gate
  index.html         entry point for all five specimens
```

## The three experiences

| | A — Talent / Jobsite | B — Developer Platform | C — Employer / Agency |
| --- | --- | --- | --- |
| Register | Notarial: editorial, permissive | Protocol: infrastructure, bounded | Commons: plain, public-utility |
| Ground | warm paper `#F4F1EA` | ink `#06080B` (opens dark) | neutral light `#F6F8F9` |
| Accent | seal `#1D5B45` | phosphor `#3BE08C` | ocean `#245C73` |
| Screens | job search + detail, agent onboarding | API docs + MCP | hiring dashboard, agency mandate |

Only the ground, the accent and the density change. Everything else is shared, and the
gate enforces that rather than asserting it (see `validation/shared-vs-override.md`).

## The suggested colours

Both owner-supplied candidates are **evaluated, admitted to a decorative role, and
refused the roles the computation does not support**. Full table:
`validation/contrast-report.md` §1.

- **`#ABABA1` muted warm neutral** → shared `border-decorative-strong`. [Fact] 2.05:1 on
  paper and 2.31:1 on white, so it is **decorative only**; 7.82:1 on ink and 8.23:1 on
  midnight, so it is admissible as secondary text **on the dark grounds only**.
- **`#ABEBA1` fresh light green** → shared `marker` (a short underlay behind ink text).
  [Fact] 1.23:1 on paper and 1.39:1 on white — it cannot carry text there — but 13.05:1
  on ink and 13.73:1 on midnight, and ink on it is 13.05:1, so as a filled marker it is
  safe. Its light-mode sibling `mintDeep` `#567651` is **derived**, not hand-picked, by
  darkening the colour until it clears 4.5:1 on every light ground (4.53:1 worst case).
- Neither replaces an existing decision. B keeps its phosphor accent; `#ABEBA1` is left
  as a documented alternative with the evidence attached, for the owner to choose.

## How to inspect it

Everything is static — no install, no build, no server required:

```bash
open index.html                       # entry point for all five specimens
open 01-talent-jobsite/index.html     # one screen directly
```

Each screen: light and dark, EN and DE, the four-state vocabulary carried by a colour
**and** a distinct glyph **and** the state word, a visible focus ring, reduced-motion
handling, and a provenance strip on the page itself.

## How to reproduce it

Requires only Python 3.10+ (standard library):

```bash
cd 14-experiences
python3 scripts/gen_experience_tokens.py   # tokens, CSS, contrast report, shared-vs-override
python3 scripts/gen_logo.py                # the shared logo system
python3 scripts/gen_screens.py             # app.css + the five specimens
python3 scripts/validate_experiences.py    # the gate — exits non-zero on any failure
```

## Status of every artifact

| Label | Meaning |
| --- | --- |
| **PROPOSED** | A recommendation. **Not approved.** Nothing may ship from it. |
| **CANDIDATE** | Explored, not recommended. |
| **FACT** | Computed or read from a source in this repository, with the source named. |
| **HYPOTHESIS** | Reasoned, not evidenced. |

**No experience theme and no identity here is APPROVED.** The five screens are
illustrative compositions built from real brand assets — each page says so on itself.

## What is deliberately not here

- No approved logo, palette or typeface; no production logo master.
- No runtime file, deployment, CI configuration or product surface changed.
- No new product claim, capability, pilot figure or commercial result.
- No per-experience logo variant — one shared logo system, by governance rule.

## Known gaps carried into Stage 2

1. The wordmark in `logo/` is the **interim** monoline concept from the Brand OS. It is
   replaced by a type-derived outlined master in `15-typeface/wordmark/`.
2. `00-shared/fonts.css` declares the **tested OFL fallback stack only**. The original
   Linkbot Display / Sans / Mono faces are built and validated in `15-typeface/`; until
   then nothing here claims to ship a font.
3. No native-speaker German review, no trademark search. Both remain open.
