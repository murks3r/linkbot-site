# Logo system

Status: **PROPOSED / CANDIDATE.** Three marks and three wordmarks exist, one per direction.
None is approved. All are **editable concepts**, not production masters.

Files are real vector sources. Every file is a standalone SVG that parses, carries a
`viewBox`, inlines all colour, references nothing external, contains no script and no image,
and inherits colour through `currentColor` unless it is an intentional fixed-colour asset.
Verified by `../scripts/validate_brand.py` on every run.

---

## 1. What each file is for

| File | Purpose | Colour |
| --- | --- | --- |
| `mark.svg` | The mark alone, 32-unit artboard | `currentColor` — set with CSS `color` |
| `mark-construction.svg` | The mark over an 8/16/24-unit guide grid, for review only | guide lines fixed grey, mark `currentColor` |
| `mark-monochrome.svg` | Single-colour use: engraving, stamp, low-quality print, fax-grade surfaces | fixed `#14161A` |
| `favicon.svg` | 16–32px browser/tab use; stroke thickened from 1.6 to 2.4 so the frame survives | `currentColor` |
| `app-icon.svg` | Square app plate, ink ground (`#14161A`), light mark | fixed |
| `app-icon-inverse.svg` | Same plate on a light ground (`#F4F1EA`), ink mark — for light-mode launchers | fixed |
| `social-avatar.svg` | 512×512 plate, 112 corner radius, mark at 4× with clearspace | fixed |
| `lockup-horizontal.svg` | Primary lockup: mark + wordmark | `currentColor` |
| `lockup-stacked.svg` | Stacked lockup for square and narrow placements | `currentColor` |
| `wordmark-monoline.svg` | The wordmark alone | `currentColor` |
| `misuse.svg` | Reference sheet of wrong usage (proposed direction only) | fixed |

## 2. Construction, and why it is font-independent

The wordmark is **not typeset text**. It is monoline geometry on a cap-height-100 grid: each
letter is a real path, and one number — the stroke — controls the weight. This means

- the wordmark cannot break when a webfont fails, is blocked, or is replaced;
- the mark's optical weight is matched to the wordmark automatically
  (`scripts/gen_logos.py`: `mark_stroke = wordmark_stroke / mark_scale`);
- the whole system is reproducible from two scripts with no design tool and no font file.

**Honest limitation:** a monoline construction is a *concept*. A production master should be
either outlined from the licensed display face or commissioned as drawn artwork. Until then,
do not print the wordmark large, do not use it as a trademark filing specimen, and do not
describe it as the final logo.

## 3. The three marks

| Direction | Concept | Geometry | Small-size behaviour (measured) |
| --- | --- | --- | --- |
| A — Notarial | Impression in a walled boundary | regular octagon `r=14.4` + inscribed 14×14 square + core dot `r=2.6` | Frame survives at 16px; inner square softens to texture |
| B — Protocol | Aperture in an openly incomplete boundary | square with one open corner + arcs at `10.5` and `6` spanning 205°→160° + core | **Fails**: the two arcs merge into a disc at 16px |
| C — Commons | A gate crossed by a released link | broken boundary line + crossing link + hollow and solid nodes | **Degrades**: nodes and gap collapse; reads as a "+" at 16px |

Measured, not assumed: this was checked by rendering each `favicon.svg` at 16px in the
specimens (`11-templates/specimens/`) and inspecting the result.

## 4. Clearspace

Clearspace is defined from the mark, so it works for every lockup and every direction.

**Minimum clearspace = 0.5 × the mark's optical diameter on all four sides.**

The mark's optical diameter is 28.8 units on the 32-unit artboard (octagon `r=14.4`, square
side 28.8). So:

- at a 32px rendered mark, clearspace is **16px** on each side;
- at a 24px mark, **12px**;
- for `lockup-horizontal.svg`, apply half the mark's rendered height as clearspace around the
  whole lockup.

Nothing may enter that area: no rule, no border, no photograph edge, no other logo, no text.

## 5. Minimum sizes

| Asset | Minimum rendered width | Rationale |
| --- | --- | --- |
| `mark.svg` (bare) | **24px** | Below 24px the inner geometry of B and C is not distinguishable |
| `favicon.svg` | **16px** | Purpose-built for it: thickened stroke, no fine detail |
| `app-icon.svg` | **32px** (plate), 16px favicon equivalent | A plate is always more legible than a bare mark at the same size |
| `lockup-horizontal.svg` | **110px** at 1× (≈ 96px at high DPI is acceptable with the mark dropped) | Below that, use the stacked lockup, then the mark alone |
| `lockup-stacked.svg` | **64px** | Below that, use the mark alone |
| `wordmark-monoline.svg` | **96px** | Below that, use the mark alone |

Below 24px, the governed order of preference is: `favicon.svg` → `app-icon.svg` → `mark.svg`.

## 6. Colour rules

- On any surface, the mark and wordmark take the surface's text colour. There is no
  "brand-coloured logo" except as a deliberate state.
- **Permitted:** pure ink on paper; pure paper on ink; a single brand accent in a context where
  the accent already means "authority granted".
- **Prohibited:** gradients, two-tone treatments, tints, opacity below 100%, drop shadows,
  outlines, strokes added in layout, or placing the mark on a mid-tone where contrast drops
  below 3:1 against its background.
- **Contrast rule:** the mark is a non-text graphic; it must hold **≥3:1** against its
  background. Check with `../scripts/gen_tokens.py` → `contrast()`.

## 7. Misuse

See `A-notarial/misuse.svg` for the rendered reference. Prohibited in all directions:

1. Stretching, condensing, skewing or rotating.
2. Recolouring outside the permitted set (including "brand-ish" approximations).
3. Adding effects: shadow, glow, bevel, outline or texture.
4. Rebuilding the mark from memory or from a screenshot; always use the file.
5. Changing the lockup proportions, the gap, or the mark-to-wordmark size relationship.
6. Placing the lockup on a busy area of imagery without a solid or blurred field behind it.
7. Replacing the wordmark with typeset "Linkbot" in another face, weight or case.
8. Combining the mark with another company's mark without a governed co-branding lockup.
9. Using the concept files as if they were the registered trademark.

## 8. Co-branding (agency and partner surfaces)

Not yet defined, and deliberately so: co-branding requires the partner's own lockup rules.
The rule for now is a **vertical stack with a rule**: Linkbot lockup, a 1px rule at 50% of the
lockup width, then the partner lockup, with clearspace between. No interlocking marks, no
combined glyph. This must be reviewed per partner.

## 9. File hygiene

- One `<svg>` per file, one root `viewBox`, no `width`/`height` reliance for layout (always
  constrain in CSS so the lockup scales).
- All ids unique within a file (validator-enforced).
- No `<script>`, no `<image>`, no `<foreignObject>`, no remote `href` (validator-enforced).
- Text is never live text inside a mark or lockup asset, except in the OG templates, where a
  font stack is declared with explicit fallbacks.
