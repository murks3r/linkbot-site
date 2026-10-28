# Templates and specimens

Status: **PROPOSED / CANDIDATE.** Nothing here is a product screen and nothing here claims a
capability.

**[Gap] Resource note:** no PDF, InDesign or Figma source exists in these repositories, and
none is manufactured here. Every template is HTML or SVG so that it stays inspectable, diffable
and reproducible from a script. A future slide or print template should be added the same way.

---

## 1. Specimens

| File | What it demonstrates |
| --- | --- |
| `specimens/index.html` | Index of the three specimens |
| `specimens/specimen-A-notarial.html` | Direction A, light + dark |
| `specimens/specimen-B-protocol.html` | Direction B, light + dark |
| `specimens/specimen-C-commons.html` | Direction C, light + dark |

Each specimen contains, on one page:

1. **Audience demonstration** — the same identity applied to **Talent**, **Employer/HR** and
   **Agency**, using claim-checked copy.
2. **Logo system** — 16/24/32/48px small-size checks, mark, monoline wordmark, horizontal and
   stacked lockups, single-colour use on paper and on ink, ink and inverse app plates.
3. **Colour system** — live swatches read from the computed CSS custom properties, with the
   token name and resolved value printed under each chip.
4. **Typography** — the hierarchy at display, headline, body, label and tabular-figure sizes.
5. **State vocabulary** — the four states, each with colour, a distinct glyph **and** the state
   word, plus a receipt component and a met/unknown/unmet requirement table.
6. **Components** — primary, secondary and quiet actions, a field, and an explicit focus-ring
   demonstration.
7. **Motion** — the one deliberate moment, with a `prefers-reduced-motion` fallback that
   replaces movement with a visible outline rather than removing feedback.
8. **Status statement** — the direction is named as a candidate, and the absence of approval is
   stated on the page rather than only in a document.

They open directly from disk. The Google Fonts request is optional scaffolding: with no network
the specimens render in the declared fallback stacks, which is itself the fallback the
production system specifies.

## 2. Open Graph templates

`og-A-notarial.svg`, `og-B-protocol.svg`, `og-C-commons.svg` — 1200×630, the direction's
ground, the wordmark, a headline, a rule and a kicker line. Each declares an explicit font
stack with fallbacks.

**[Gap] These are SVG and therefore not usable as `og:image` as they stand.** Facebook,
LinkedIn and X do not render SVG Open Graph images. The incumbent site already has this defect
(`public/og.svg`). Any adopted template must be rasterised to PNG or JPEG before use, and the
meta tag updated.

## 3. Logo misuse sheet

`../04-logo/A-notarial/misuse.svg` — a rendered reference showing stretch, recolour and
effects failures plus the correct lockup, with the full prohibition list in
`../04-logo/README.md`.

## 4. Regenerating

```bash
python3 scripts/gen_specimens.py     # specimens + misuse sheet + index
python3 scripts/gen_assets.py        # icons, fields, OG templates
python3 scripts/validate_brand.py    # gate
```

Editing a specimen by hand will be overwritten. Change the generator.
