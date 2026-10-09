# Linkbot Type

Version **0.2.0** · branch `parallel/brand-experiences-v1` · stage 2 of the Brand Experiences work.

**Original type designs for Linkbot.** Three roles, one construction:

| Role | Use | Faces |
| --- | --- | --- |
| **Linkbot Display** | branding and editorial headings | Regular, Bold |
| **Linkbot Sans** | jobs, descriptions, filters, product UI | Regular, Medium, Bold |
| **Linkbot Mono** | code, structured evidence, developer documentation | Regular, Bold |

Everything here is **original work authored in this repository**. It is not a renamed
existing typeface, it is not derived from any proprietary outline, and no glyph was
traced from another font. The letterforms are generated from centrelines by
`scripts/glyphlib.py` — a stroker that offsets lines and elliptical arcs exactly — and
compiled to real binaries by ufo2ft.

**Status: a validated prototype, PROPOSED and not approved.** It is not hinted, not
reviewed by a type designer, not print-proofed, and not wired into any runtime file.
Read `PROPOSED.md` before using anything from this folder.

```
15-typeface/
  README.md              this file
  PROPOSED.md            what is proposed, what is not, and what would change it
  CHANGELOG.md
  design/
    type-system.md               the three roles, the contrast axis, why they cohere
    letterforms.md               every design decision, glyph by glyph
    metrics-spacing-kerning.md   UPM, x-height, sidebearings, advances, kerning
    licensing-and-originality.md originality evidence and licence position
  sources/ufo/           7 editable UFO 3 sources — open them in any font editor
  fonts/ttf/             compiled static TTFs
  fonts/woff2/           compiled WOFF2 (what a web page would load)
  wordmark/              the wordmark, outlined from Linkbot Display
  specimen/              the type specimen (open the HTML directly)
  review/gallery.html    the typography review gallery: contexts, alternatives, limitations
  fonts/alternatives/    the round-dot alternative face (outside the validated set)
  validation/            coverage report, font gate log, asset registry
  scripts/               the geometry engine, the glyphs, the build, the gates
```

## Inspect it

```bash
open specimen/type-specimen.html      # the specimen: roles, weights, German, symbols
open review/gallery.html              # the review gallery: contexts, alternatives, limitations
open wordmark/lockup-horizontal.svg   # the wordmark derived from the typeface
open validation/typography-review.md  # the findings, tagged, including what is still wrong
open validation/independent-audit.md  # the binary audit, taken from the compiled files
```

`review/gallery.html` drives its 320 px and 390 px panels with CSS container queries, so
both mobile widths can be inspected on one desktop screen; resize the window for 1440 px.

## Reproduce it

The build needs `fontTools`, `ufoLib2`, `ufo2ft` and `brotli`. The repository keeps
them in a sibling virtualenv so the brand folder itself stays dependency-free:

```bash
python3 -m venv ../../../.venv-type
../../../.venv-type/bin/pip install fonttools ufoLib2 ufo2ft brotli typing_extensions

cd 15-typeface
../../../.venv-type/bin/python scripts/build_sources.py   # glyphs -> 7 UFO sources
../../../.venv-type/bin/python scripts/build_fonts.py     # UFO -> TTF + WOFF2
../../../.venv-type/bin/python scripts/validate_type.py   # the font gate, reads the binaries
../../../.venv-type/bin/python scripts/build_wordmark.py  # wordmark outlined from Display
../../../.venv-type/bin/python scripts/build_specimen.py  # the specimen page
```

`bash scripts/build.sh` runs the whole chain and tees a log to
`validation/build-log.txt`.

## What the fonts actually contain

Measured by `scripts/validate_type.py` from the compiled binaries, not asserted:

- **204 codepoints** on all seven faces — Latin upper and lower, figures, German
  (ä ö ü Ä Ö Ü ß ẞ), a Western/Central European accented set, ASCII punctuation,
  typographic punctuation, currency, maths, arrows and a check mark.
- 209 glyph slots per face including `.notdef` and `space`.
- Artefacts are **byte-reproducible**: two consecutive builds hash identically.
- Monospaced faces: **one advance, 600 units**, for every glyph.
- Proportional faces: GPOS pair kerning from 39 authored pairs.
- Full table: `validation/coverage-report.md`.

## What it does not contain

Caret, pipe, standalone grave, section, pilcrow, dagger, daggerdbl, copyright,
registered, trademark, per-mille, guillemets, OE/oe and AE/ae ligatures, Greek,
Cyrillic and CJK. Those fall back to a licensed OFL face; the fallback stack is
declared in every consumer and is tested in the specimen.

**Ampersand** is the one glyph still flagged as idiosyncratic: recognizable at display
sizes, ambiguous at 12–14 px, and recommended for redrawing. `at` and `question mark` were
rebuilt in v0.2.0 after the review found them malformed.

## Where it plugs in

`14-experiences/00-shared/fonts.css` declares these faces with `@font-face` and keeps
the OFL stack behind them, so the five experience specimens already render in the real
typeface with a graceful degradation path. No runtime file in `murks3r/linkbot-site` or
`murks3r/linkbot` imports anything here.
