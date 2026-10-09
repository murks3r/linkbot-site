# Changelog — Linkbot Type

All notable changes to `15-typeface/`. **No face in this folder is APPROVED.**

---

## [0.2.0] — 2026-10-09

Stage 3: independent verification and a demanding visual review. Corrections to drawing and
metrics are a MINOR bump while the family is pre-adoption; MAJOR is reserved for adoption.

### Fixed — defects found by auditing the binaries and looking at renders

- **The build was not byte-reproducible.** `head.created`/`modified` were stamped with the
  current time, and pinning them was insufficient because fontTools re-stamps `modified` at
  save time unless `recalcTimestamp` is off. Two consecutive builds now hash identically.
- **Every round letter was one half-stroke too large.** `o` measured 610 units against a
  declared x-height of 500 (88% of cap height instead of 71%). The authored radii were being
  placed on the intended extremes, but stroking pushes the outline half a stroke further out.
  Corrected by treating authored numbers as OUTER extents and subtracting half the stroke
  width in the geometry helpers. `o` is now −11…511, `n` 0…511, `0` −11…711.
- **`C`, `c` and `G` opened on the wrong side** — the arc swept through 0°, leaving a mirrored
  C. Now a 38°→322° sweep.
- **`@` was two concentric rings (a bullseye)**; rebuilt as a ring with an open inner bowl and
  a right-hand bar. **`?` was a flat hook**; rebuilt with a rounder bowl and a near-vertical
  tail. **The comma** was a long heavy bar; now a dot with a light tail.
- **`bullet` and `questiondown` carried a zero-area contour**, an invalid outline from stroking
  a ring until the inner radius clamped to zero. `bullet` is a single-contour disc now.
- **`hash`, `percent` and `asterisk` were claimed in the character map but never drawn**, and
  **`Ÿ` (U+0178) was missing**. Both were found by the gates, not by inspection.

### Added — independent verification

- `scripts/audit_binaries.py` — an audit that shares no code path with the gates: the expected
  character set is written out by hand, every measurement is taken from the compiled binaries,
  GPOS pairs are counted out of the GPOS table, contour areas are computed from raw point data,
  and reproducibility is checked by rebuilding and re-hashing. Writes
  `validation/independent-audit.md`.
- `validation/typography-review.md` — the demanding visual review, with findings tagged
  `[Fact]`/`[Hypothesis]`, the remaining weaknesses, and eight recommended changes before use.

### Added — the review gallery and a rendered alternative

- `scripts/build_review.py` → `review/gallery.html`: a browser-accessible gallery covering the
  glyph spotlight, the size ladder, a 20-row job listing, a full job description, navigation and
  forms, salary figures and dates, German and English, 320/390/1440 px panels driven by
  container queries, light and dark, labelled alternatives, explicit limitations, and the A/B/C
  experiences evaluated together as one brand.
- `fonts/alternatives/LinkbotSans-RoundDots.woff2` — the same family with the dot switch
  flipped, so "alternative" is a rendered artifact. Deliberately NOT part of the seven validated
  faces: not in the coverage claim, not in the asset registry, not referenced by any experience.
- The dot shape is now a single switch (`glyphset.DOT_SHAPE`) governing the dot of i and j, the
  period, comma, colon, semicolon, exclamation, ellipsis, divide and every diacritic dot.

### Verified in this revision

- 204 codepoints on 7 faces; 209 glyph slots each; 39 kern pairs on the proportional faces and
  none on the monospaced; monospaced advance fixed at 600.
- Artefacts byte-reproducible across consecutive builds.
- Rendered and inspected at 12/13/15/16/17/19/24/30/38/48/60/76/118/130/150 px, light and dark,
  320/390/1400 px, German and English.

## [0.1.0] — 2026-10-09

Stage 2 of `parallel/brand-experiences-v1`. New work is confined to `14-experiences/`
and `15-typeface/`; one Stage 1 file (`14-experiences/00-shared/fonts.css`) was
regenerated to declare the new faces, which is the integration the two stages exist for.
No Brand OS file and no runtime file is touched.

### Added — the geometry engine

- `scripts/glyphlib.py` — centrelines (lines, elliptical arcs, rings) expanded into
  outlines. Arcs offset **exactly**, by moving their radii, rather than by the usual
  "push the control points along the normal" approximation; joins and terminals are
  emitted as real arcs. The engine is what makes the outlines curves rather than
  sampled polygons, and what makes the roles interchangeable.
- `union()` assembles a glyph from several connected strokes and forces consistent
  winding, so overlapping constructions render as a union instead of punching holes in
  each other. Its absence was the first build's failure: an H joined into one path drew
  a connector where the letter should have none.

### Added — the letterforms

- `scripts/glyphset.py` — A–Z, a–z, 0–9, one construction for three roles. Metric
  parameters per role: Display `xh 466 / contrast 0.34`, Sans `xh 500 / contrast 0.05`,
  Mono `xh 520 / advance 600`.
- `scripts/glyphset_extra.py` — punctuation, symbols, the German characters, and
  accented composites built as base contours plus an independent diacritic.
- `scripts/charmap.py` — the single statement of what the fonts claim, reading 203
  codepoints, with the not-covered set recorded rather than implied.
- Two defects the gates caught and that are worth recording: three glyphs
  (hash, percent, asterisk) were claimed in the character map but never drawn, and the
  first ampersand, at, euro, dollar and pound constructions were malformed. The coverage
  gate found the first; looking at the render found the second.

### Added — the build

- `scripts/build_sources.py` — 7 UFO 3 sources under `sources/ufo/`, one per face, with
  font info, kerning and per-glyph placement (proportional advance, or one centred
  advance for the monospaced faces).
- `scripts/build_fonts.py` — UFO → TTF via ufo2ft (cubic→quadratic conversion, cmap,
  hmtx, name, OS/2, GPOS from kerning.plist) → WOFF2 via brotli.
- `scripts/build_wordmark.py` — the wordmark, outlined from Linkbot Display with the
  font's own kerning, in mixed case, all caps, inverse, and two lockups whose mark
  stroke is matched to the wordmark stem after both scale factors.
- `scripts/build_specimen.py` — the specimen page.
- `scripts/validate_type.py` — **the gate**, reading the compiled binaries.

### Added — evidence

- `validation/coverage-report.md` — generated from the binaries.
- `validation/font-validation-log.txt` — the gate's own output.
- `validation/asset-registry.json` — every typeface file with size and SHA-256.
- `design/type-system.md`, `design/letterforms.md`, `design/metrics-spacing-kerning.md`,
  `design/licensing-and-originality.md`.

### Verified

- All 7 faces compile; all 7 WOFF2 twins open.
- **203/203 codepoints** present in the cmap of every face, including the German set
  checked by name (Ä Ö Ü ä ö ü ß ẞ) rather than by proxy.
- Every non-blank glyph has contours with points, a non-degenerate bounding box, and
  coordinates inside a sane em box; no zero-length contours survive the stroker.
- `unitsPerEm` 1000; ascender, descender, cap height and x-height recorded on every face.
- The monospaced faces have **exactly one advance (600)**; the proportional faces carry
  GPOS pair kerning and the monospaced faces do not.
- Rendered and inspected in a browser at 12, 13, 16, 34 and 96 px, in all three roles,
  in light and dark, with the German set, the accented set, punctuation, symbols, the
  currency signs, the figures and the wordmark.
- The experience specimens load the real faces: verified in the browser that
  `Linkbot Sans`, `Linkbot Mono` and `Linkbot Display` all report `loaded`.

### Not done, by design

- No hinting, no print proof, no review by a type designer.
- No variable font. The roles share topology, so a `wght` axis is feasible; it was not
  attempted rather than attempted and shipped unvalidated.
- No italic, no small caps, no optical sizes beyond the two display weights.
- Ampersand and at are first-pass approximations; caret, pipe, ligatures, Greek,
  Cyrillic and CJK are not covered and fall back to OFL faces.
- No runtime file consumes the fonts; no Brand OS file was modified.
