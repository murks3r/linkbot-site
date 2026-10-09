# The type system

Status: **PROPOSED.** Three roles, one construction. Read `letterforms.md` for the
design decisions and `metrics-spacing-kerning.md` for the numbers.

---

## 1. One construction, three parameter sets

Every glyph in every role is the same set of centrelines — the same arches, bowls,
counters and diagonals — evaluated at different parameters. Display, Sans and Mono are
therefore not three typefaces that share a mood; they are one typeface that has been
measured three times.

| Parameter | Display | Sans | Mono |
| --- | --- | --- | --- |
| Cap height | 700 | 700 | 700 |
| x-height | 466 | 500 | 520 |
| Ascender | 726 | 730 | 740 |
| Descender | −206 / −210 | −214 / −216 | −214 / −216 |
| Stem (Regular) | 104 | 88 | 86 |
| Horizontal / vertical stroke ratio | **0.60** | 0.95 | 1.00 |
| Curve / vertical ratio | 0.83 | 1.00 | 1.00 |
| Horizontal proportion | 1.06 | 1.00 | 1.00 |
| Advance | proportional | proportional | **fixed 600** |

`unitsPerEm` is 1000 on all three.

## 2. The contrast axis is what separates the roles

The single parameter that makes Display read as editorial and Sans read as UI is the
ratio between horizontal and vertical stroke weight:

- **Display, 0.60.** Real thick/thin contrast, the way an editorial serif has it, but
  drawn on geometric skeletons. This is what makes the wordmark and headings carry
  authority without a second family.
- **Sans, 0.95.** Essentially monoline. A UI face earns its keep by being boring at
  13 px: uniform stems, open apertures, no modulation to smudge at small sizes.
- **Mono, 1.00.** Perfectly monoline, which is what a code face should be.

Because the axis is a number rather than a redraw, the Display contrast can be pushed or
pulled without touching a single glyph.

## 3. Shared anatomy — the four things that never change

1. **The stroke.** Ends are cut flat, never rounded. That single decision is most of why
   the family reads as precise rather than friendly.
2. **The square.** The dot of i and j, the period, the comma, the colon, the exclamation
   dot, the ellipsis and the diacritic dots are all squares. This is the mark's inscribed
   square carried into the type, and it is the family's loudest identifying feature.
3. **The skeleton.** Single-storey a and g; the same arch construction in n, h, m, u;
   the same radius logic in every bowl.
4. **The joints.** An arc that terminates on a stem is swept past the junction so its ink
   overlaps the stem's. Without this a butt cap leaves a notch exactly where the curve
   meets the stem, on B, D, P, R, a, b, d, g, p and q.

## 4. What each role is for, and why it is that role

**Display** is for branding and editorial headings. It is narrower in the x-height and
higher in contrast so that a heading has a voice at 40 px and above. It is not a text
face: at 16 px its thin strokes lose definition, and the specimen shows that.

**Sans** is for jobs, descriptions, filters and product UI. It has the largest x-height
of the three (relative to its cap height), the least modulation, and unambiguous shapes:
`1` carries a flag and no foot serif, `l` is a bare stem, `I` is a bare stem, and the
three are distinguishable by width and by context. Figures share one width, so a column
of versions, dates or amounts aligns without enabling a feature.

**Mono** is for code, structured evidence and developer documentation. One advance
(600 units) for every glyph, ink centred in it, and a slightly larger x-height than Sans
so that 12 px code stays readable. It carries no kerning, because kerning a fixed
advance breaks the grid that makes it a code face.

## 5. What is shared with the experience layer

`14-experiences/00-shared/fonts.css` declares all seven faces with `@font-face`,
self-hosted from `fonts/woff2/`, and keeps the tested OFL stack behind them:

```css
--lb-font-display: "Linkbot Display", "Iowan Old Style", Georgia, serif;
--lb-font-sans:    "Linkbot Sans", "Inter", ui-sans-serif, system-ui, sans-serif;
--lb-font-mono:    "Linkbot Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
```

The three roles map onto the three experiences without a fourth font: Display carries
Experience A's editorial register, Sans carries all three, Mono carries Experience B's
console and every experience's receipts.

## 6. Weights

| Face | Weights | Why |
| --- | --- | --- |
| Linkbot Display | Regular, Bold | Headings need a pair, not a ramp |
| Linkbot Sans | Regular, Medium, Bold | UI needs a body, an emphasis and a heading weight |
| Linkbot Mono | Regular, Bold | Code needs a body and an emphasis weight |

No italics, no small caps, no variable font. The roles share topology, so a `wght` axis
is feasible; it was not attempted rather than attempted and shipped unvalidated.
