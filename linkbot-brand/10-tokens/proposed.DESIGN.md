---
version: alpha
name: Notarial
description: PROPOSED Linkbot direction — editorial authority, paper ground, seal accent, record-shaped.
colors:
  primary: "#1D5B45"
  secondary: "#565C63"
  tertiary: "#8A5B00"
  neutral: "#F4F1EA"
typography:
  display-xl:
    fontFamily: Fraunces
    fontSize: 76px
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  display-lg:
    fontFamily: Fraunces
    fontSize: 48px
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: Fraunces
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 8px
spacing:
  "2xs": 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  "2xl": 48px
  "3xl": 64px
  "4xl": 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "#14402F"
    textColor: "{colors.neutral}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 12px
  button-secondary:
    backgroundColor: "{colors.neutral}"
    textColor: "#14161A"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 12px
  field:
    backgroundColor: "#FDFCF9"
    textColor: "#14161A"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 12px
  status-confirmed:
    backgroundColor: "#FDFCF9"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.xs}"
    padding: 12px
  status-proposed:
    backgroundColor: "#FDFCF9"
    textColor: "{colors.tertiary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.xs}"
    padding: 12px
  status-denied:
    backgroundColor: "#FDFCF9"
    textColor: "#8E2F2F"
    typography: "{typography.label-sm}"
    rounded: "{rounded.xs}"
    padding: 12px
  status-unknown:
    backgroundColor: "#FDFCF9"
    textColor: "{colors.secondary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.xs}"
    padding: 12px
---

## Overview

**PROPOSED — NOT APPROVED.** This is the recommended candidate direction for Linkbot, one of
three in `../02-directions/`. Nothing may be shipped from this file, and no runtime file
consumes it.

Notarial treats Linkbot's differentiator as a *documentary* property: decisions are bounded,
versioned, receipted and revocable. So the identity is built from record-keeping artefacts —
ruled structure, tabular figures, an impression as the mark — rather than from the category's
tool metaphors.

Two modes, one identity. **Record mode** (marketing, long-form, social, documents) is
paper-led and editorial. **Workspace mode** (talent onboarding, employer workspace, agency
mandate view) keeps the shipped product's discipline: monochrome ground, 1px dashed
structural rules, no radii beyond `2px`, uppercase utility labels. The wordmark and the mark
are identical in both modes; only the register changes.

## Colors

- **Primary (#1D5B45 "Seal"):** the brand carrier and the primary-action fill. Deliberately
  adjacent to the incumbent `signal` green so the change reads as a refinement rather than a
  repudiation. Computed at 7.07:1 on paper.
- **Secondary (#565C63 "Slate"):** secondary text and the *unknown* state. Chosen as the
  dimmest status value so uncertainty is visible but never alarming. 5.99:1 on paper.
- **Tertiary (#8A5B00 "Ember"):** the *proposed* state. 5.20:1 on paper.
- **Neutral (#F4F1EA "Paper"):** the page ground. Warm, because a cold white reads as a
  spreadsheet and the subject is a person's career.
- **Denied (#8E2F2F "Oxblood"):** the denied state. Deliberately a different hue from Ember so
  "proposed" and "denied" never blur at a glance.

Control borders use `#90897A`, computed to clear 3:1 on paper (WCAG 1.4.11). Decorative rules
use `#D9D3C5` and are exempt. The two are separate tokens because using one value for both is
how a 1.22:1 hairline ends up around an input.

## Typography

Fraunces carries display only, never below 24px — a high-contrast serif loses its thin strokes
below that. Inter carries all body and UI text at 16px minimum with 1.5–1.6 leading. JetBrains
Mono carries utility labels, versions, field names, dates and every number in a table, always
with `font-variant-numeric: tabular-nums`.

Uppercase is reserved for labels of four words or fewer, at 12px minimum, with `+0.14em`
tracking. All three faces are SIL OFL 1.1 and self-hostable; the identity never requires a
remote font request.

## Layout

A `1120px` frame with `24px` gutters. Running prose is capped at a `34rem` measure. Spacing
follows the `4/8/12/16/24/32/48/64/96px` sequence; nothing between the steps is permitted.
Vertical rhythm between sections is `64px` at mobile and `96px` at desktop.

Structural separation is a `1px` rule, not a shadow or a raised card. The one exception is the
`2px` dashed boundary used to mark something that is proposed rather than confirmed.

## Elevation & Depth

There is almost none, by design. The system separates surfaces with a `1px` rule and a single
step of background luminance. No drop shadows, no blurs except behind a modal backdrop, and no
hover lift — a hover changes colour and border only. Depth is expressed by *structure*, which
is the point.

## Shapes

Radii of `0px` (default), `2px` (the primary radius), `4px` (fields and controls) and `8px`
(cards, used sparingly). A pill radius is not part of this system. The mark's geometry is an
octagon with an inscribed square; no shape in the layout should compete with it, which is why
radii stay small and consistent.

## Components

`button-primary` is the only high-emphasis action on a page; `button-secondary` and the quiet
text action are progressively less eager. Status is never a coloured dot: it is a bordered
surface carrying a colour, a distinct glyph and the state word — colour alone would fail both
WCAG 1.4.1 and the product's requirement that the four states remain distinguishable.

## Do's and Don'ts

- **Do** keep the workspace monochrome and let Record mode carry the colour.
- **Do** render *unknown* as a real, legible state rather than as a blank or a dash.
- **Do** set every state with colour, glyph and word together.
- **Don't** use Fraunces below 24px, or Inter below 16px for running text.
- **Don't** create a muted colour with `opacity`; use the muted token, which is computed.
- **Don't** use a padlock, shield, verification badge, score or counter anywhere.
- **Don't** call a one-sided result a "match", or a revocation a "deletion".
