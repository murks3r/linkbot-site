# Typography review — Linkbot Type v0.2.0

**Status: a validated technical prototype that is NOT design-approved.** This document is
the record of a demanding visual review of the delivered fonts. Findings are tagged
`[Fact]` where they were measured or observed in a render, `[Hypothesis]` where they are
judgement.

The reviewer here is the same process that drew the fonts, which is a real limitation: it
found defects it knew how to look for. A type designer who did not write the generator
would find more. **A passing gate is not design approval**, and the owner has already
rejected the current website's typography, spacing and colour — nothing below should be
read as an argument against that judgement.

---

## 1. What was reviewed, and how

| Context | How it was assessed |
| --- | --- |
| Large display headings | 76 / 60 / 48 px in the Display face, light and dark |
| Small display headings | 38 / 30 / 24 px, watching for stroke thinning |
| Dense job listings | 20 rows, mixed currencies and both listing kinds, at 17 / 15 / 19 px |
| Full job descriptions | ~350-word body text at 16 px with headings, lists and a requirement table |
| Navigation, forms, filters | Control borders, focus ring, disabled state, select and text inputs |
| Salary figures and dates | Tabular alignment across five currencies and five date formats |
| German and English | The same content in both languages, including umlauts and ß |
| Viewports | 320 px, 390 px and 1400/1440 px, driven by container queries in the gallery |
| Themes | Light and dark, both palettes, both modes of every role |

Rendered in a real browser (Chromium via CDP) and inspected at 12, 13, 15, 16, 17, 19, 24,
30, 38, 48, 60, 76, 118, 130 and 150 px. Reproduce by opening
`review/gallery.html` and switching the header controls.

---

## 2. Defects found and fixed in this revision

These are the findings that changed the fonts. They are listed first because they are the
evidence that the review was real.

### 2.1 `[Fact]` The build was not byte-reproducible

Two consecutive builds of identical sources produced entirely different binaries.
`head.created` and `head.modified` were stamped with the current time, and pinning them was
not enough: `fontTools` re-stamps `modified` at save time unless `recalcTimestamp` is
switched off. Fixed; two consecutive builds now hash identically
(`validation/independent-audit.md` records the digest).

### 2.2 `[Fact]` Every round letter was one half-stroke too large

`o` measured **610 units tall against a declared x-height of 500** — 88 % of cap height
where 71 % was intended. The cause was an authoring convention error: the ring and arch
radii were placed *on* the intended extremes, but stroking pushes the outline half a stroke
further out. Every curved letter was affected (`o e c a s g b d p q O C G Q S 0 2 3 5 6 8 9
ß ẞ`), and it is why lowercase text looked oversized in the first render.

Corrected by treating the authored numbers as **outer extents** and subtracting half the
stroke width inside the geometry helpers. Verified from the binaries: `o` is now
`−11 … 511`, `n` is `0 … 511`, `0` is `−11 … 711`.

**This was the single largest quality defect in the family and it was invisible to the
coverage gate.** It took measuring the binaries and looking at a render to find.

### 2.3 `[Fact]` `C`, `c` and `G` opened on the wrong side

The arc swept from `−32°` to `212°`, crossing 0°, which put the ink on the right and the
opening at the **lower left** — a mirrored C. Corrected to a `38° → 322°` sweep so the
aperture sits on the right where it belongs.

### 2.4 `[Fact]` `@`, `?`, the comma and `bullet`

- `@` was two concentric rings: a bullseye, not an at-sign. Rebuilt as an outer ring, an
  open inner bowl and a right-hand bar.
- `?` was a flat hook. Rebuilt with a rounder bowl and a near-vertical tail.
- The comma was a long, heavy bar that read as a wedge. Now a dot with a short light tail.
- `bullet` and `questiondown` contained a **zero-area contour** — an invalid outline
  produced by stroking a ring wide enough that the inner radius clamped to zero. `bullet`
  is now a single-contour disc; `questiondown` was rebuilt.

### 2.5 `[Fact]` Three glyphs were claimed but not drawn, and `Ÿ` was missing

`hash`, `percent` and `asterisk` were listed in the character map but never authored; the
coverage gate caught them. `Ÿ` (U+0178) was missing entirely and was found by the
independent audit, which asserts a hand-written character set rather than reading the
generator's own list.

---

## 3. What the review found to be working

- **The lowercase is now well proportioned.** At 74 px a full sentence of mixed case reads
  cleanly with even colour and no letter out of scale.
- **The size ladder holds.** Display carries editorial authority at 76, 60 and 48 px; Sans
  is comfortable from 16 to 20 px; Mono is legible at 12 px.
- **Figures align.** One advance per digit means the salary column, the dates and the
  policy versions line up in every face without a `tabular-nums` feature doing any work.
- **The family reads as one typeface.** Display, Sans and Mono at the same size look like
  each other, which is the point of the shared construction.
- **Nothing overflows.** No horizontal scroll at 320 px in the listing, the forms or the
  description; the listing collapses to one column below 420 px and the salary moves under
  the title rather than being clipped.
- **Both themes hold.** Dark mode is a token swap; no glyph becomes invisible.

---

## 4. Remaining weaknesses — what a type designer would take issue with

1. **`&` is idiosyncratic.** `[Fact]` At 12–14 px the double-loop form can read as a figure
   eight. At 64 px and above it reads as an ampersand. **Redraw this glyph.** It is the one
   remaining flagged drawing.
2. **`k` and `r` arms are thin next to the stems.** `[Fact]` At 24 px and above in Display
   the arm of `k` and the shoulder of `r` carry noticeably less weight than the stem they
   meet. The fix is a local weight increase on those strokes, not a redraw.
3. **Spacing around `r`, `f` and their punctuation is uneven.** `[Fact]` `r.` and `f.`
   sit looser than the surrounding letters at text sizes. The kerning table has 39 pairs;
   a production face would carry several hundred, and this is where the gap shows.
4. **Display thins below 24 px.** `[Fact]` At 24 px the thin horizontals of Display are
   already losing definition; below that it stops being a display face. The tokens forbid
   it, but the font itself will not stop anyone.
5. **`&` and the square dots will divide opinion.** `[Hypothesis]` The square dot is the
   family's identity and its most contestable feature in UI text. The round-dot alternative
   is built and rendered (`fonts/alternatives/`, gallery section A1) precisely so the choice
   can be made on evidence rather than argument.
6. **No optical sizes.** `[Fact]` Two static Display weights and three Sans weights; the
   thick/thin ratio is fixed per role, so Display cannot tighten as it grows.
7. **Not hinted, not print-proofed, not reviewed.** `[Fact]` The gates measure coverage,
   outlines, metrics, kerning and reproducibility. They measure nothing about beauty or
   about rendering on a low-DPI Windows machine.
8. **German is covered as glyphs, not as typesetting.** `[Fact]` Umlauts, ß and ẞ render;
   nothing in the font helps hyphenation, and German compounds make longer lines than the
   English measure anticipates.
9. **The mono face is not a coding face in the usual sense.** `[Fact]` No ligatures, no
   dotted zero option, no contextual alternates. It is a monospaced text face.

---

## 5. Recommended changes before this is used on the real website

In order. The first two are prerequisites; the rest are improvements.

1. **Redraw `&`** and fix the `k`/`r` arm weights. Two glyphs and two strokes.
2. **Get a type designer's review** of the whole family, and a **printing proof** on at
   least one physical output before the Display face is used in anything that gets printed.
3. **Decide the licence.** Nothing in `15-typeface/` is released under any licence. The
   choice — OFL, proprietary, or commissioned terms — is the owner's (decision Y-04/Y-05).
4. **Trial the round-dot alternative in the actual UI** at 13–15 px before committing to
   square dots. The gallery shows the comparison; only the real product will settle it.
5. **A letter-spacing and kerning pass** at display sizes, and a real kerning table for the
   pairs the product actually sets (`r.`, `f.`, `y,`, `v.`, `w.`, and the `AV`/`TA` family).
6. **Add a `wght` axis** rather than shipping seven statics — the topology already matches,
   so the interpolation is a build change, not a redraw.
7. **Extend coverage** to caret, pipe, guillemets and the AE/OE ligatures, which the German
   and French markets will reach for; and decide explicitly whether Greek and Cyrillic are
   ever in scope.
8. **Re-test in the product**, not only in this gallery: the workspace at its real density,
   the four-state vocabulary, the receipt component, and the tables — with the same
   320/390/1440 and light/dark matrix used here.

---

## 6. What this review does not claim

- It does not claim the typeface is good enough for the website. Two glyphs are known to be
  weak and a type designer has not seen it.
- It does not replace the owner's judgement on the site's typography, spacing and colour.
  The brand work proposes a system; it does not answer a rejection of the current site.
- It does not claim the gates are sufficient. They caught real defects — and the largest
  defect, the half-stroke overshoot on every round letter, was found by measuring the
  binaries and looking at a render, not by a gate.
