# Metrics, spacing and kerning

Status: **PROPOSED.** Every number here is a parameter in `scripts/glyphset.py` or a
result read back from the compiled binaries.

---

## 1. Vertical metrics

| | Display | Sans | Mono |
| --- | --- | --- | --- |
| unitsPerEm | 1000 | 1000 | 1000 |
| Cap height | 700 | 700 | 700 |
| x-height | 466 | 500 | 520 |
| Ascender | 726 | 730 | 740 |
| Descender | −206 / −210 | −214 / −216 | −214 / −216 |
| Overshoot (round extremes) | 13 / 15 | 11–14 | 11 / 13 |

x-height / cap-height: Display **0.666**, Sans **0.714**, Mono **0.743**. That ordering
is deliberate — Display can afford a small x-height because it is set large; Mono needs
the largest because it is set smallest.

## 2. Horizontal metrics

**Proportional roles.** Each glyph's advance is authored: the ink is placed against a
sidebearing and the advance is the ink plus both sidebearings. Straight-sided letters use
a larger sidebearing than round ones, which is the usual compensation for the optical
weight a curve adds at the stem.

| | Display | Sans | Mono |
| --- | --- | --- | --- |
| Sidebearing, straight-sided | 58–62 | 72–78 | — |
| Sidebearing, round-sided | 44–48 | 54–60 | — |
| n | 600 | 566 | 600 |
| o | 632 | 596 | 600 |
| H | 712 | 672 | 600 |
| m | 886 | 836 | 600 |

**Monospaced role.** Every glyph has advance **600** and its ink is centred in that
advance. The gate asserts exactly one distinct advance in the monospaced binaries; a
font that is only *mostly* monospaced is a bug, not a style.

**Figures.** Digit advances are equal within a face (600 units in Sans), so a column of
versions, dates and amounts aligns without enabling `tnum`. `font-variant-numeric:
tabular-nums` therefore has nothing to change — which is the honest position: the
specimens still set it, because a fallback font does need it.

## 3. Kerning

39 authored pairs on each proportional face, compiled to GPOS by ufo2ft from the UFO's
`kerning.plist`. The full list is in `scripting` terms in
`scripts/build_sources.py::KERN_PAIRS`; the rationale is in `letterforms.md` §5.

Verified in the binaries: the proportional faces carry a GPOS table, the monospaced faces
do not.

## 4. Text-setting rules the specimens follow

| Rule | Reason |
| --- | --- |
| Body text at 16 px or above, leading 1.5–1.6 | The scale the product already uses |
| Display at 24 px or above | Its thin strokes lose definition below that |
| Uppercase labels: ≤4 words, ≥12 px, `+0.14em` tracking | Uppercase removes word-shape cues |
| Figures always `tabular-nums` | A fallback font needs it even when the brand face does not |
| Line length 60–75 characters | Reading comfort |
| Never negative tracking below 24 px | Tight tracking at body size harms low-vision reading |

These are the Brand OS rules, unchanged; the typeface was designed to satisfy them rather
than the other way round.

## 5. Small sizes, measured

Inspected in a browser at 12, 13, 16 and 34 px:

- **16 px** — comfortable in all three roles. The square dots read as squares.
- **13 px** — Sans and Mono hold. The octagonal apexes of `A`, `V`, `W` still read as
  flats rather than closing up.
- **12 px** — Mono stays legible; Sans holds at its Regular weight. This is the floor:
  below 12 px the square dot is the first thing to degrade into a speck, and the governed
  answer is to stop going smaller rather than to thicken the dot.

## 6. Reproduce the numbers

```bash
<venv>/bin/python scripts/build_sources.py
<venv>/bin/python scripts/build_fonts.py
<venv>/bin/python scripts/validate_type.py     # reads the numbers back from the binaries
```
