# Direction B — **Protocol**

**Candidate. Not approved.**

Specimen: `../../11-templates/specimens/specimen-B-protocol.html`
Assets: `../../04-logo/B-protocol/` · Tokens: `../../10-tokens/B-protocol.tokens.{json,css}`

---

## 1. Strategic idea

**The state is the interface.** Linkbot's most unusual property is that it renders uncertainty
honestly: absent ≠ null ≠ false ≠ zero, denied skills are explicit negatives, and UNKNOWN is
never satisfied through absence. Direction B takes that property and makes it the visual
language: a protocol readout, where values are labelled, states are named, and nothing is
rounded up.

The register is infrastructure, not security theatre: schemas, version numbers, bounded
authority, explicit refusal. **No padlocks, no shields, no threat imagery** — those would
claim C1/C3 capabilities the product does not have.

## 2. Mark: the aperture

`04-logo/B-protocol/mark.svg` — a square boundary with one open corner, two concentric
205°–160° arcs inside, and a core dot.

- **Meaning:** a bounded container that is knowingly incomplete, read through a single
  aperture. The gap is drawn, not implied.
- The two arcs are produced by a real arc function (`arc(16,16,10.5,205,520)`), so the gap
  angle is a parameter, not a manual guess.
- **Accessibility risk (measured):** at 16px the concentric arcs merge into a solid disc and
  the open corner is lost. The favicon variant raises the stroke to `2.4`, but this mark is
  genuinely the weakest of the three at small sizes. If B is chosen, the mark needs a
  simplified small-size variant — recorded as a required follow-up, not glossed.
- Lockups add a filled node at the K junction for the technical register.

## 3. Wordmark

`04-logo/B-protocol/wordmark-monoline.svg` — heavy monoline (`11`), **square terminals**,
mitred joins, tight tracking (`8`), and a **rounded-square O** rather than an ellipse. The
letterforms read as machined rather than drawn. Font-independent path geometry; concept, not
a production master.

## 4. Colour

Dark-led with a light mode. The accent is phosphor green, close to a terminal.

| Role | Dark | Light | Notes |
| --- | --- | --- | --- |
| Canvas | `#06080B` void | `#F7F9FA` | |
| Surface | `#0C1014` panel | `#FFFFFF` | |
| Text | `#D6E0E6` | `#0B0F12` | |
| Secondary | `#86959F` | `#5A6A74` | |
| **Brand** | `#3BE08C` phosphor | `#0A6B41` deep | Two values, one role |
| Link / info | `#59C8F5` cyan | `#0D5B77` | |
| Proposed | `#F0B429` amber | `#7A5400` | |
| Denied | `#FF7A7A` | `#A32A2A` | |
| Control border | `#506472` | `#899094` | Computed to clear 3:1 |

All 14 required pairs pass. Note that the light-mode accent (`#0A6B41`) is a **different hue
value from the dark-mode accent** — the dark phosphor is unusable on white at 4.5:1. That
two-value accent is a real maintenance cost and is recorded as such.

## 5. Typography

| Role | Family | Licence |
| --- | --- | --- |
| Display | **Space Grotesk** | SIL OFL 1.1 |
| Text | **Inter** | SIL OFL 1.1 |
| Utility, values, states | **JetBrains Mono** | SIL OFL 1.1 |

**Accessibility risk:** monospace-forward layouts are genuinely harder to read at length —
monospaced text has more strokes per unit area and a larger effective word-shape ambiguity.
The system therefore restricts JetBrains Mono to values, labels and states, and keeps body
copy in Inter. If a future maintainer inverts that ratio, readability degrades; the token
file cannot enforce it, so it is a governance rule.

## 6. Motion

State transitions, not decoration: a 160ms `linear` step when a value changes state, and a
240ms `ease.standard` for a boundary crossing. Deliberately mechanical — B is the only
direction where a linear easing is appropriate.

## 7. Imagery

`../../07-imagery/field-B-protocol.svg` — a 42-point lattice with one solid edge path, one
**dashed** path and one dimmed node. The dashed line and the dim node are load-bearing: they
are how "some of what is known, some of what is not" is drawn.

## 8. Voice in one paragraph

*"Authority for one bounded field set, one recipient, one purpose, one version."* Nouns and
scopes. Named states. Explicit refusals. Where A says "someone asked for one part of it",
B writes `purpose: recruiting_opportunity_evaluation`.

## 9. Where it is applied

| Surface | Application |
| --- | --- |
| Marketing site | Dark-led Record mode; the darkest of the three, with the state vocabulary visible on the page |
| Talent onboarding | Workspace mode; claims/evidence/intents/authorities as labelled groups |
| Employer workspace | Computation-authority framing; bounded batch language |
| Agency mandate view | The met / unknown / unmet table in monospace is the strongest single case for B |
| Social / OG | `../../11-templates/og-B-protocol.svg` |

## 10. Known weaknesses (stated, not hidden)

1. **It is the closest to the convention the audit flagged as dangerous.** A dark surface with
   a neon green accent reads as security tooling, which invites the C1/C3 claims the product
   cannot make. [Hypothesis] This is B's principal strategic risk.
2. **Weakest small-size mark** of the three (measured above).
3. **Two accent values** for light and dark — more tokens, more drift risk.
4. **Energised and slightly cold.** It optimises for engineering credibility and gives up the
   human register that a career decision deserves.
5. Most likely to be read as "developer tooling" by a non-technical HR buyer.
