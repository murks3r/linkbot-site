# Three directions compared

All three are **CANDIDATE**. None is approved. Recommendation: `PROPOSED.md`.

---

## 1. The comparison

| | **A — Notarial** | **B — Protocol** | **C — Commons** |
| --- | --- | --- | --- |
| Core idea | The record is the brand | The state is the interface | A public utility |
| Register | Editorial, institutional | Infrastructure, technical | Plain, civic |
| Ground | Paper `#F4F1EA`, ink type | Near-black `#06080B` | Light `#F6F8F9` |
| Accent | Deep bottle green `#1D5B45` | Phosphor `#3BE08C` | Ocean `#245C73` |
| Display face | Fraunces (serif, OFL) | Space Grotesk (OFL) | Public Sans (OFL) |
| Families | 3 | 3 | **2** |
| Mark concept | Impression in an octagon | Aperture in an open boundary | A gate crossed by a link |
| Mark at 16px | Frame survives | Collapses to a disc | Collapses to a "+" |
| Distance from shipped product | **Far** | Medium | **Near** |
| Distinctiveness vs category | **High** | Medium (risks the security cliché) | Low |

## 2. Scored against the brief's optimisation targets

Scores are 1–5, assigned by this folder's author and explained below. They are a decision aid,
not evidence.

| Criterion | A | B | C | Reasoning |
| --- | --- | --- | --- | --- |
| Distinctiveness | **5** | 3 | 2 | A is a register no recruiting brand uses. B is the closest to the category's dark-neon default. C is intentionally plain. |
| Coherent brand architecture | 5 | 4 | 4 | All three reuse one mark + one wordmark across three audiences. A's two modes (Record/Workspace) map most cleanly onto the audience split. |
| Accessibility | 4 | 3 | **5** | Computed: A 16/16 pairs, B 14/14, C 16/16. B loses a point for the two-value accent and monospace body risk; A loses one for the serif ≥24px rule it needs. |
| Maintainability | 4 | 3 | **5** | C = 2 families, 1 accent value per mode, fewest moving parts. B = 2 accent values, 3 families, small-size mark defect. A = 3 families plus a display-size rule to police. |
| Reuse across web / product / marketing | 4 | 4 | 5 | C's light-first system is closest to the shipped workspace. A requires an explicit second mode for the workspace. |
| Honesty / claim-safety | **5** | 4 | **5** | A and C give UNKNOWN a natural, quiet home. B's register invites security claims the product cannot make (C1, C3). |
| Adoption risk (lower is better) | 3 | 4 | **5** | A asks the product to accept a serif on marketing surfaces and warm paper. B asks for two accent values. C asks for almost nothing. |
| **Total (35 possible)** | **30** | **25** | **31** | |

The scores are deliberately close between A and C, and they fail in opposite directions: **A
is more distinctive and harder to adopt; C is easier to adopt and less distinctive.** That is
the real decision, and it belongs to the founder.

## 3. Accessibility risk register

| Risk | Severity | Direction | Mitigation in this folder |
| --- | --- | --- | --- |
| Uppercase `bone-200/50` labels at 3.51:1 | **High** | Current site | Replaced by a computed ≥4.5:1 muted token in all three directions |
| Serif display used below 24px | Medium | A | Hard rule in `06-typography/typography.md`; token set reserves Fraunces for display only |
| Monospace body text | Medium | B | Governance rule: body copy stays Inter; mono restricted to values/labels/states |
| Mark illegible below 16px | Medium | B, C | `favicon.svg` thickens the stroke; below 24px the app plate is the governed fallback |
| Colour as the only state carrier | **High** | All | Every state carries a glyph **and** a text label; four distinct shapes in the specimen (`06-typography`, `08-iconography`) |
| `alarm-500` dot at 4.30:1 | Low | Current site | Kept non-textual; never carries meaning alone |
| Dark-only rendering | Medium | Current site | All directions define both modes and honour `prefers-color-scheme` in the specimens |
| Two accent values (light/dark) | Low | B | Documented; both values ship as tokens rather than as an inline decision |

Full computed ratios: `../validation/contrast-report.md` — 116 pairs across the token
files and the specimen palettes.

## 4. Licensing comparison

| Direction | Face | Licence | Self-host | Commercial web | Modification | Cost |
| --- | --- | --- | --- | --- | --- | --- |
| A | Fraunces | SIL OFL 1.1 | Yes | Yes | Yes, with reserved-name change | €0 |
| A | Inter | SIL OFL 1.1 | Yes | Yes | Yes | €0 |
| A | JetBrains Mono | SIL OFL 1.1 | Yes | Yes | Yes | €0 |
| B | Space Grotesk | SIL OFL 1.1 | Yes | Yes | Yes | €0 |
| B | Inter | SIL OFL 1.1 | Yes | Yes | Yes | €0 |
| B | JetBrains Mono | SIL OFL 1.1 | Yes | Yes | Yes | €0 |
| C | Public Sans | SIL OFL 1.1 | Yes | Yes | Yes | €0 |
| C | IBM Plex Mono | SIL OFL 1.1 | Yes | Yes | Yes | €0 |
| *(incumbent product)* | Helvetica Neue / Arial | **Proprietary** | **No** | Only with a licence | No | Per-foundry licence |
| *(incumbent site)* | Fraunces / Inter / JetBrains Mono | OFL 1.1 | Yes — but loaded remotely | Yes | Yes | €0 |

**Every direction removes the proprietary Helvetica dependence for any self-hosted surface.**
Source URLs and the reserved-font-name obligation are in `06-typography/licenses.md`.

**[Fact]** OFL 1.1 does not permit selling the fonts by themselves, requires the licence text
to travel with redistributed font files, and forbids using a reserved font name for a
modified version. None of that constrains Linkbot's use; it constrains what may be committed.

## 5. What all three share (the parts that are already decided)

These are common to every direction because they follow from the product truths rather than
from aesthetics. They are still PROPOSED, but a founder choosing a direction is not choosing
about these:

1. One master brand, three message profiles — never three logos.
2. Real vector brand assets: an editable mark, an editable monoline wordmark, lockups at
   matched optical weight, favicon and app plate.
3. Self-hostable OFL type. No remote font request required.
4. Four product states, each with a colour **and** a glyph **and** a label.
5. WCAG 2.1 AA computed for every text and control pair, light and dark.
6. Semantic DTCG tokens with a CSS export; no runtime file consumes either yet.
7. No trust badges, padlocks, shields, scores, counters or simulated activity.
8. Non-applied: this folder changes no runtime file.

## 6. Directions considered and rejected before these three

| Rejected | Reason |
| --- | --- |
| **"Dark cyber-security v2"** — evolve the current dark site with a stronger accent | Occupies the convention the audit identified as dangerous; invites C1/C3 claims; keeps the dark-only accessibility defect |
| **"Verified badge" identity** — a shield/check as the master mark | Directly asserts verification the system cannot perform (C3) and was explicitly rejected in the product design documents |
| **"Human warmth"** — photography of people, soft illustration, warm gradients | Puts recognisable people into a product that promises not to expose people; contradicts the product's rejection of imagery-as-filler |
| **"Data visualisation"** — charts and ranked lists as the visual language | Implies scoring and ranking the agency specification explicitly disclaims (C6) |
| **Second wordmark per audience** — three sub-brands | A Talent and an employer must recognise the same company; the consent story depends on it |
