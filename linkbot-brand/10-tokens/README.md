# Semantic design tokens

Status: **PROPOSED / CANDIDATE, non-applied.** No runtime file in `murks3r/linkbot-site` or
`murks3r/linkbot` imports anything in this directory. Two decisions are required before it
could be (D-09).

---

## 1. Files

| File | What it is |
| --- | --- |
| `<direction>.tokens.json` | W3C DTCG-shaped token file: primitives, a semantic layer, type, space, radius, motion, focus |
| `<direction>.tokens.css` | CSS custom-property export of the same values, with a reduced-motion block |
| `proposed.DESIGN.md` | The recommended direction as a Google `DESIGN.md` spec (machine-lintable) |
| `../validation/design-md-export.dtcg.json` | The official CLI's DTCG export of `proposed.DESIGN.md`, for cross-checking |
| `../validation/contrast-report.md` | Every required pair, computed |

## 2. Structure

```jsonc
{
  "color":   { "palette": { "paper": { "$type": "color", "$value": "#F4F1EA" }, ... } },
  "semantic":{ "text":    { "$type": "color", "$value": "{color.palette.ink}",
                            "$extensions": { "linkbot.primitive": "ink", "$value": "#14161A" } }, ... },
  "type":    { "family": {...}, "size": {...}, "weight": {...}, "leading": {...}, "tracking": {...} },
  "space":   { "md": { "$type": "dimension", "$value": "16px" }, ... },
  "radius":  { "xs": { "$type": "dimension", "$value": "2px" }, ... },
  "motion":  { "duration": {...}, "easing": {...} },
  "focus":   { "ring-width": {...}, "ring-offset": {...} }
}
```

Three deliberate choices:

1. **The semantic layer aliases primitives by DTCG reference**, so a re-theme is a change to the
   primitive, not to every call site. The resolved value is *also* written into
   `$extensions` — that is what lets `scripts/validate_brand.py` prove the CSS export and the
   JSON agree, instead of trusting both to be regenerated together.
2. **`border-subtle` and `border-control` are separate roles.** WCAG 1.4.11 applies to the
   second and not the first. Collapsing them is how accessible systems regress.
3. **Motion lives in the token file**, so `prefers-reduced-motion` is a token change rather
   than a stylesheet override applied in some places and forgotten in others.

## 3. What is deliberately absent

- **Component tokens.** No `button-primary-background`. Component tokens should be derived from
  a real surface, and the first real surface is the product — deriving them from a marketing
  specimen would bake a marketing layout into the system (D-09).
- **Elevation tokens.** There is essentially no elevation in any direction. If a future surface
  needs one, it gets a token then, with a reason.
- **A dark-mode duplicate file.** Modes are a swap of primitive values under a selector, not a
  second token file.

## 4. Validation

Two independent checks, both reproducible with no dependencies:

```bash
python3 scripts/gen_tokens.py       # recomputes contrast; exits 1 on any failing pair
python3 scripts/validate_brand.py   # JSON validity, $type/$value presence, reference
                                    # resolution, CSS/JSON parity, write boundary
```

Plus an external check with the official Google CLI (network required):

```bash
npx -y @google/design.md lint proposed.DESIGN.md
# -> {"summary":{"errors":0,"warnings":0,"infos":1}}
npx -y @google/design.md export --format dtcg proposed.DESIGN.md > out.json
```

Current results: **116/116 contrast pairs pass** (44 in the token files,
72 in the specimen role palettes), `validate_brand.py` reports OK,
`design.md lint` reports 0 errors and 0 warnings.

## 5. Adoption path (when and if approved)

The safest first step is a **no-visual-change** proof:

1. Map the product's current literals onto tokens: `--ink: #000000` becomes
   `var(--lb-text)` with the primitive still set to `#000000`. Nothing renders differently.
2. Run the product's existing test suites unchanged. Any diff is a token-mapping bug.
3. Only then change a primitive.

This is deliberately *not* performed by this branch.
