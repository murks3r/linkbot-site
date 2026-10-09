# Colour system

Status: **PROPOSED / CANDIDATE.** Machine-readable values live in `../10-tokens/`. The
computed evidence lives in `../validation/contrast-report.md`.

---

## 1. How the system is structured

Three layers, and only the top one may appear in application code.

```
1  PRIMITIVES    raw values, named after what they are        paper, ink, seal, ember, oxblood
2  SEMANTIC      role names, aliasing primitives              canvas, surface, text, text-muted,
                                                              brand, link, border-control, status-*
3  COMPONENT     only where a component needs its own value   (not yet defined; see §6)
```

A component may never reference a primitive. A primitive may never be used as a role name.

## 2. The public API of the palette (semantic roles)

Every direction exposes the same role names, so a surface can be re-themed without renaming
anything. This is what makes three directions comparable at all.

| Role | Meaning | Must satisfy |
| --- | --- | --- |
| `canvas` | The page ground | — |
| `surface` | A card or panel above the ground | distinguishable from `canvas` |
| `surface-sunken` | A recessed area | — |
| `text` | Primary text | ≥4.5:1 on `canvas` and `surface` |
| `text-muted` | Secondary text, labels, helper copy **(content, not decoration)** | ≥4.5:1 on `canvas` and `surface` |
| `brand` | The brand carrier and the primary-action fill | ≥4.5:1 against `canvas` as text; ≥4.5:1 against `brand-contrast` as a fill |
| `brand-contrast` | Text on `brand` | as above |
| `link` | Interactive text | ≥4.5:1 on `canvas` and `surface` |
| `border-subtle` | Decorative rule, divider, panel edge | none (exempt from 1.4.11) |
| `border-control` | An input border, a checkbox, a focusable control edge | **≥3:1** on its surface |
| `status-granted` / `-pending` / `-denied` / `-unknown` | The four product states | ≥4.5:1 as text |
| `focus` | The focus ring | ≥3:1 on any adjacent colour |

`border-subtle` and `border-control` are **separate tokens on purpose.** The incumbent site
uses one border value for both, which is how a decorative 1.22:1 hairline ends up around an
input that legally needs 3:1.

## 3. The four status colours, and why they are not enough

| State | A — Notarial | B — Protocol | C — Commons |
| --- | --- | --- | --- |
| granted / confirmed | `#1D5B45` | `#3BE08C` | `#146B4A` |
| pending / proposed | `#8A5B00` | `#F0B429` | `#8A5B00` |
| denied | `#8E2F2F` | `#FF7A7A` | `#A3352B` |
| unknown | `#565C63` | `#86959F` | `#5A6B73` |

Three observations that shaped the choice:

1. **Unknown is the dimmest, least saturated value in every direction.** Unknown is not an
   alarm and must not look like one — but it must be *visible*. Rendering it as grey text that
   is still ≥4.5:1 (rather than pale grey) is the design decision that encodes T4.
2. **The four colours are distinguishable in greyscale**, from the luminance ordering
   granted < pending < denied < unknown... which is why the luminance values were *not* relied
   on: they are close, and the glyph plus the label carry the meaning (§4).
3. **No direction uses red for "unknown" or green for a non-confirmed state.** Colour drift
   here would break T4 more effectively than any copy change.

## 4. Colour is never the only carrier (WCAG 1.4.1)

Every status in every artifact in this folder renders as:

```
[ colour ]  +  [ distinct glyph shape ]  +  [ the state word, in text ]
```

The four glyph carriers are deliberately different in silhouette, not just tint:

| State | Glyph | Silhouette |
| --- | --- | --- |
| confirmed | closed square, solid stroke | angular, closed |
| proposed | triangle | angular, pointed |
| unknown | hollow ring | round, open |
| denied | solid dot | round, filled |

A colour-blind reader sees four different shapes. A greyscale print shows four different
shapes. A screen reader hears four different words. See `../08-iconography/README.md` for the
full icon vocabulary, which extends the same principle to objects rather than states.

## 5. Modes

Every direction defines light and dark, and the specimens honour `prefers-color-scheme` with a
manual override. The light/dark mapping is a token swap, not a second design.

| | A | B | C |
| --- | --- | --- | --- |
| Accent values needed | 1 (light) / 1 (dark, brightened) | **2 genuinely different hues** | 1 / 1 |
| Works as the product's base | Paper or ink | Ink | **Light** (matches shipped) |

**B's two-hue accent is a real cost.** A phosphor green that reads at 11.67:1 on near-black
drops to roughly 1.6:1 on white, so B needs `#0A6B41` in light mode. Two values for one role
means two chances to drift. A and C both brighten the same hue, which is a mechanical
transformation rather than a design decision.

## 6. Component tokens (deliberately deferred)

Component-level tokens (`button-primary-background`, `field-border`, and so on) are **not**
defined here. They should be derived once a surface exists, and the first surface to define
them should be the product, not a marketing page — otherwise the tokens encode a marketing
layout. This is recorded as decision D-09.

## 7. Governance rules

1. **Add a primitive only with a demonstrated role.** A colour with no semantic role is
   decoration.
2. **Never apply opacity to a text colour to create a muted variant.** That is exactly how the
   incumbent 3.51:1 failure happened (`text-bone-200/50`). Use the muted token, which is
   computed.
3. **Never use a status colour as a brand accent**, or vice versa. It makes the state
   vocabulary ambiguous.
4. **Changing any primitive requires re-running `scripts/gen_tokens.py`.** The script exits
   non-zero if a required pair drops below its target, so the check cannot be skipped silently.
5. **Contrast targets are minimums, not goals.** Where a value can pass AAA without cost, prefer it.
