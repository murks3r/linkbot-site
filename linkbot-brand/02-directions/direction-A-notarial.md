# Direction A — **Notarial**

**Candidate. Not approved.** Recommended by this folder — the recommendation and its open
questions live in `PROPOSED.md`; this file describes the direction itself.

Specimen: `../../11-templates/specimens/specimen-A-notarial.html`
Assets: `../../04-logo/A-notarial/` · Tokens: `../../10-tokens/A-notarial.tokens.{json,css}`

---

## 1. Strategic idea

**The record is the brand.** Linkbot's differentiator is not speed, volume or intelligence —
it is that a decision was made, bounded, recorded and can be inspected later. So the identity
is built out of the artefacts of accountable record-keeping: ruled paper, a seal impression,
tabular figures, a document's quiet hierarchy.

The register is editorial and institutional, in the way a standards body or a notary is
editorial: unhurried, exact, confident because it is precise rather than because it is loud.

**Why it is strategically justified**

- The product's own rejected list (score cards, trust badges, simulated activity, dashboard
  tiles) rules out the conventional recruiting visual grammar. What remains is documentary.
- The competitive set does not use it: [Hypothesis] no significant recruiting brand presents
  as a record rather than as a tool.
- It gives the four product states (confirmed / proposed / unknown / denied) a natural home —
  a document's marginalia already works this way.
- It survives the monochrome product discipline: an editorial system is already most of the
  way to black-on-white.

## 2. Mark: the seal

`04-logo/A-notarial/mark.svg` — an octagon frame with an inscribed square and a solid core.

- **Meaning:** an impression struck into a boundary. Octagon = a walled record; square = the
  held value; core = the subject.
- Built from six real coordinates (`octagon(16,16,14.4)` plus one rectangle and one circle),
  stroke `1.6` on a 32-unit artboard, `currentColor`, no fills other than the core.
- Reads at 16px: the frame survives, the inner square softens to a texture. `favicon.svg`
  increases the stroke to `2.4` for the small case.
- Lockups match the mark's optical weight to the wordmark stroke automatically
  (`scripts/gen_logos.py`: `mark_stroke = wordmark_stroke / mark_scale`).
- Misuse sheet: `04-logo/A-notarial/misuse.svg`.

## 3. Wordmark

`04-logo/A-notarial/wordmark-monoline.svg` — a monoline geometric wordmark, cap height 100,
hairline stroke `7`, wide tracking `22`, round terminals, elliptical O.

Font-independent: it is real path geometry, not typeset text, so it cannot break when a webfont
fails to load. **It is a concept, not a production master.** A production master should be
either (a) outlined from a licensed face, or (b) a commissioned drawing based on this
construction.

## 4. Colour

Paper-led. The accent is a **deep bottle green** — deliberately adjacent to the incumbent
`signal` green so the change does not read as a repudiation of the existing brand.

| Role | Light | Dark | Notes |
| --- | --- | --- | --- |
| Canvas | `#F4F1EA` paper | `#0E1013` midnight | Warm paper, not clinical white |
| Surface | `#FDFCF9` porcelain | `#181B1F` raised | |
| Text | `#14161A` ink | `#E9E4D8` moon | |
| Secondary text | `#565C63` slate | `#A9A395` | |
| **Brand** | `#1D5B45` seal | `#4FBE92` seal-bright | |
| Link | seal | seal-bright | Same token as brand |
| Confirmed | seal | seal-bright | |
| Proposed | `#8A5B00` ember | `#D9A93F` | |
| Denied | `#8E2F2F` oxblood | `#E08880` | |
| Unknown | slate | moon-dim | Deliberately the *dimmest* state |
| Control border | `#90897A` | `#65686C` | Computed to clear 3:1 |

All 16 required pairs pass; see `../../validation/contrast-report.md`.

## 5. Typography

| Role | Family | Licence |
| --- | --- | --- |
| Display | **Fraunces** (variable, optical size + weight) | SIL OFL 1.1 |
| Text / UI | **Inter** | SIL OFL 1.1 |
| Utility, figures, receipts | **JetBrains Mono** | SIL OFL 1.1 |

Self-hostable, no remote font request required, no per-pageview cost, and all three support
German (umlauts, ß) plus the Latin Extended range. Fraunces carries an optical-size axis, so
the display face can be tuned per size rather than swapped.

**Accessibility risk:** a high-contrast serif at small sizes loses thin strokes. Mitigation is
a hard rule in the token set: **Fraunces is display-only, minimum 24px**; body text is always
Inter at ≥16px with 1.5 leading.

## 6. Motion

One expressive moment — the seal impression: a 240ms scale-and-settle with `ease.entrance`.
Everything else is 160ms local feedback. No ambient loops, no simulated processing.

## 7. Imagery

`../../07-imagery/field-A-notarial.svg` — a ruled ledger field: horizontal rules at
decreasing opacity, vertical column ticks, one filled emphasis rectangle, one solid node.
Generated geometry, no photography, no recognisable person, no fabricated dashboard.

## 8. Voice in one paragraph

*"You hold the record. Someone asks for one part of it. You decide, and the decision is
written down."* Short declaratives. Verbs over adjectives. Numbers where a number exists,
a named gap where it does not.

## 9. Where it is applied

| Surface | Application |
| --- | --- |
| Marketing site | Record mode: paper ground, editorial serif headline, seal accent for the position statement |
| Talent onboarding | Workspace mode: ink/paper, the mark in the header (which the product does not have today) |
| Employer workspace | Workspace mode + a receipt component with the seal accent for the granted state |
| Agency mandate view | Workspace mode + a met/unknown/unmet table with three distinct glyph carriers |
| Social / OG | `../../11-templates/og-A-notarial.svg` — paper ground, serif headline, kicker line |

## 10. Known weaknesses (stated, not hidden)

1. **Warm paper diverges from the shipped product's pure white.** A founder decision, not an
   implementation detail — see decision D-06.
2. **A serif display face is the least conventional choice for a recruiting tool.** It is the
   source of the distinctiveness and also its largest adoption risk.
3. **Fraunces needs discipline.** Without the ≥24px rule it will be used badly within a month.
4. The warm palette is harder to reproduce in a low-quality print or a fax-grade screenshot
   than a pure monochrome; the governed fallback is the monochrome mark and ink/paper only.
