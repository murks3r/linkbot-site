# Typography

Status: **PROPOSED / CANDIDATE.** Licence accounting: `licenses.md`. Face comparison:
`font-evaluation.md`.

---

## 1. The scale

One scale, shared by all three directions: `12 13 14 16 18 20 24 30 38 48 60 76` px. The steps
are not decorative — each one has a job.

| Token | px | Role | Weight | Leading | Tracking |
| --- | --- | --- | --- | --- | --- |
| `text-76` | 76 | Record-mode hero, one per page maximum | display | 1.05 | −0.03em |
| `text-60` | 60 | Record-mode section opener | display | 1.05 | −0.03em |
| `text-48` | 48 | Page title | display | 1.05 | −0.03em |
| `text-38` | 38 | Section headline | display | 1.08 | −0.02em |
| `text-30` | 30 | Sub-headline | display | 1.15 | −0.02em |
| `text-24` | 24 | Card title · **minimum for any display face** | display | 1.2 | −0.015em |
| `text-20` | 20 | Lead paragraph | text | 1.5 | 0 |
| `text-18` | 18 | Large body | text | 1.55 | 0 |
| `text-16` | 16 | **Body default.** Never smaller for running text | text | 1.6 | 0 |
| `text-14` | 14 | Dense UI, table cells | text | 1.5 | 0 |
| `text-13` | 13 | Secondary UI | text | 1.45 | 0 |
| `text-12` | 12 | Utility labels at ≥14px uppercase, or never | mono | 1.4 | +0.14em (uppercase only) |

**Rules**

1. Body text is never below **16px**. 14px is for dense tabular UI only.
2. A display face is never used below **24px**. Below that it is a text face.
3. Uppercase tracking of `+0.14em` is applied **only** to labels of ≤4 words.
4. Numbers in tables, receipts, versions, counts and dates always use
   `font-variant-numeric: tabular-nums`.
5. Line length is capped: 60–75 characters for running prose. The specimens use
   `34–38rem` as the measure.

## 2. The three type sets

| | A — Notarial | B — Protocol | C — Commons |
| --- | --- | --- | --- |
| Display | Fraunces | Space Grotesk | Public Sans |
| Text | Inter | Inter | Public Sans |
| Utility | JetBrains Mono | JetBrains Mono | IBM Plex Mono |
| Families | 3 | 3 | **2** |
| Character | Optical-size serif, editorial | Geometric grotesk, technical | Institutional neutral |
| Hierarchy mechanism | **Contrast between families** | Weight and case | Weight, size and spacing |

## 3. Why each direction pairs what it pairs

**A — Fraunces + Inter + JetBrains Mono.** The serif/​grotesk/​mono triple is the standard
editorial separation: a display face that is unmistakably a *voice*, a text face optimised for
screen reading, and a mono face for facts (versions, fields, receipts, states). All three are
OFL and self-hostable. Fraunces carries an optical-size axis, which means the display face can
be tuned to render correctly at 24px and at 76px from one file.

**B — Space Grotesk + Inter + JetBrains Mono.** Space Grotesk is derived from Space Mono, so
the display face and the mono face share a lineage; that reads as one engineered system rather
than three fonts. Inter carries the body, because Space Grotesk is poor for long text.

**C — Public Sans + IBM Plex Mono.** Two families only, both neutral, both designed for
government- and enterprise-scale legibility. Public Sans descends from Libre Franklin. The
system gives up typographic contrast as a hierarchy tool and leans on weight, size and
spacing — cheaper to maintain, harder to make distinctive.

## 4. Fallback stacks

Declared so a font failure degrades in the same shape, and so the metric difference is
visible rather than silent.

```css
/* A */
--f-display: "Fraunces", "Iowan Old Style", Georgia, serif;
--f-text:    "Inter", ui-sans-serif, system-ui, sans-serif;
--f-mono:    "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
/* B */
--f-display: "Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif;
--f-text:    "Inter", ui-sans-serif, system-ui, sans-serif;
--f-mono:    "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
/* C */
--f-display: "Public Sans", "Inter", ui-sans-serif, system-ui, sans-serif;
--f-text:    "Public Sans", "Inter", ui-sans-serif, system-ui, sans-serif;
--f-mono:    "IBM Plex Mono", ui-monospace, SFMono-Regular, monospace;
```

A fallback must never be a proprietary face that cannot be self-hosted. That is why A uses
`Iowan Old Style, Georgia, serif` rather than a licensed serif: it is a graceful degradation,
not a substitute.

## 5. Self-hosting

**[Fact]** The product frontend currently declares `"Helvetica Neue", Helvetica, Arial` and
makes no font request. Helvetica Neue and Arial are proprietary; they cannot be self-hosted or
served as webfonts without a licence, and the reference works only when the viewer's OS happens
to have the face. That stack renders differently on macOS, Windows, Linux and Android.

**All three directions replace this with OFL faces** that can be self-hosted as WOFF2 with a
`@font-face` block and a `font-display: swap` (or `optional` for the display face). Benefits:
one rendering on every platform, no per-pageview cost, no third-party request on a page that
claims privacy, and a licence file that can be committed.

**Licence obligations that affect implementation** (full detail in `licenses.md`):

1. The OFL text must accompany distributed font files.
2. A modified font may not carry the reserved font name.
3. Do not sell the fonts as fonts.
4. Attribution is not required in the UI, but the licence file must ship.

## 6. Accessibility rules that are not negotiable

| Rule | Reason |
| --- | --- |
| Body text ≥16px, ≥1.5 leading | Legibility for low vision and dyslexia |
| Display faces ≥24px | Thin strokes and high contrast fail below that |
| Uppercase labels: ≤4 words, ≥12px, `+0.14em` tracking, and never a sentence | Uppercase removes word-shape cues |
| Text must survive 200% zoom and 320px reflow | Verified in the specimens at 320px |
| Text colour is never set with `opacity` | Produced the incumbent's 3.51:1 failure |
| No text inside an image asset, except the OG templates (which declare a fallback stack) | Screen readers and localisation |
| `letter-spacing` never negative below 24px | Tight tracking at body size harms low-vision reading |
