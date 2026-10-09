# Direction C — **Commons**

**Candidate. Not approved.**

Specimen: `../../11-templates/specimens/specimen-C-commons.html`
Assets: `../../04-logo/C-commons/` · Tokens: `../../10-tokens/C-commons.tokens.{json,css}`

---

## 1. Strategic idea

**A public utility for the labour market.** Direction C takes the most radical position
available: Linkbot is infrastructure that people are entitled to understand. Nothing is
decorative, nothing is dark-patterned, and every state is readable at any size, on any
surface, in any light.

This is the direction that refuses the category's two defaults — it is neither exciting nor
ominous. It is plain. The bet is that plainness, sustained consistently, reads as trustworthy
to a person deciding whether to hand over their career history.

## 2. Mark: the gate

`04-logo/C-commons/mark.svg` — a boundary line broken by a gate, crossed by a one-directional
link, with a hollow node on the inner side and a solid node on the outer side.

- **Meaning:** a boundary that is real and passable, crossed by something a person released.
  The hollow/solid distinction is the permission state, encoded in shape as well as colour.
- Chosen after rejecting an earlier construction (a rectangle with a full-width bar) that read
  as a table, not a threshold. The current geometry is documented in `scripts/gen_logos.py`.
- **Accessibility risk (measured):** at 16px the gate gap and both nodes collapse — the mark
  reads as a small "+". `favicon.svg` raises the stroke to `2.4`; below 24px the app plate
  should be used instead of the bare mark. Recorded as a real constraint.
- Lockups use an **open-aperture K** (arm detached from the stem) for the plain register.

## 3. Wordmark

`04-logo/C-commons/wordmark-monoline.svg` — the heaviest of the three (`14`), round terminals,
moderate tracking (`12`), open apertures. The letterforms are the most neutral: no terminal
flourish, no machined edge, nothing to interpret. Font-independent geometry; concept, not a
production master.

## 4. Colour

Light-first, with a deep teal as the single brand carrier.

| Role | Light | Dark | Notes |
| --- | --- | --- | --- |
| Canvas | `#F6F8F9` | `#0F1417` | |
| Surface | `#FFFFFF` | `#161C20` | |
| Text | `#172125` | `#E7EDEF` | Matches the documented product ink |
| Secondary | `#4E5C64` | `#9BAAB2` | |
| **Brand / action** | `#245C73` ocean | `#7FC4DC` | The documented product `--ocean`, restored |
| Confirmed | `#146B4A` | `#5FC79B` | |
| Proposed | `#8A5B00` | `#E0B054` | |
| Denied | `#A3352B` | `#F0928A` | |
| Unknown | `#5A6B73` | `#9BAAB2` | |
| Control border | `#87959D` | `#5E6E77` | Computed to clear 3:1 |

All 16 required pairs pass — the strongest accessibility result of the three, because a
light-first system gives more usable headroom above 4.5:1 than a near-black one.

**Note:** `#245C73` is the `--ocean` value specified in `coherent-product-design.md` and then
dropped from the shipped stylesheet. C is the only direction that is a *restoration* of a
documented product decision rather than a new proposal.

## 5. Typography

| Role | Family | Licence |
| --- | --- | --- |
| Display / UI | **Public Sans** | SIL OFL 1.1 |
| Utility, labels | **IBM Plex Mono** | SIL OFL 1.1 |

Only two families, both OFL, both self-hostable, both with full German and Latin Extended
coverage. **No serif and no third family**, which makes C the cheapest system to maintain and
the least likely to be misused. Public Sans is derived from Libre Franklin and was designed
for a government-facing service — the register matches the position.

## 6. Motion

The most restrained of the three: 160ms `ease.standard`, and a single 400ms `ease.entrance`
for a gate opening. Everything degrades to 0ms under `prefers-reduced-motion`, replaced by a
visible outline rather than by nothing.

## 7. Imagery

`../../07-imagery/field-C-commons.svg` — eleven vertical rules interrupted by exactly one open
gate crossed by a horizontal link with a hollow and a solid node. The composition is the
mark's logic writ large, so brand imagery and brand mark cannot drift apart.

## 8. Voice in one paragraph

*"You decide who sees what."* Plain verbs, ordinary nouns, no jargon, no metaphor. Where B
writes a schema field, C writes the sentence a person would say out loud.

## 9. Where it is applied

| Surface | Application |
| --- | --- |
| Marketing site | Light-first Record mode; the least change of the three from the shipped product |
| Talent onboarding | Workspace mode; effectively an evolution of the current product shell |
| Employer workspace | Workspace mode; role-bound notices and recorded reads |
| Agency mandate view | met / unknown / unmet table, three glyph carriers, plain wording |
| Social / OG | `../../11-templates/og-C-commons.svg` |

## 10. Known weaknesses (stated, not hidden)

1. **Lowest distinctiveness.** It is the safest and the most forgettable; a competitor could
   occupy the same space without anyone noticing. This is the honest trade.
2. **Least differentiation from the existing product**, which is a strength for integration
   and a weakness for a rebrand that is supposed to change perception.
3. **A public-utility register can read as bureaucratic** in a market that expects warmth.
4. Two type families means fewer tools for hierarchy; the system leans on weight and spacing,
   which is harder to use well than contrast between families.
