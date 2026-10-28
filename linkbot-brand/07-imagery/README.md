# Imagery

Status: **PROPOSED.** Rules plus three generated fields. No photography is used anywhere in
this folder, and that is a decision, not a limitation.

---

## 1. The rule

> **Linkbot never shows a person as data, and never shows a picture where an artefact would
> do.**

The product's promise is that a career history is not a dataset on the open web. A homepage
illustration of a stylised professional whose "profile" is being scanned would contradict the
position in the same viewport that states it. The same logic rules out the category's other
familiar images: the padlock, the shield, the fingerprint, the glowing network globe.

Three further prohibitions, all traceable:

| Prohibited | Source |
| --- | --- |
| Trust badges, verification ticks, shield marks | `0-audit/product-truths.md` C3; the product design documents explicitly rejected "green trust badges" |
| Fabricated dashboards, counters, charts or activity feeds | Idem: rejected "generic score cards, fabricated counters" |
| Photography of identifiable people as decoration | Puts a face on a product that promises not to expose people |

## 2. What is permitted

| Category | Guidance |
| --- | --- |
| **Structural fields** | Rules, grids, gates, columns. The visual grammar of a record. |
| **Records** | Real receipts, real state tables, real version strings — rendered as UI, not as illustration |
| **The mark's logic** | A composition that reuses the mark's geometry (A's octagon field, B's lattice, C's gate) |
| **Documents, photographed honestly** | Only if a real document is being shown and it is legible; never a blurred prop standing in for "data" |
| **Empty space** | Whitespace is a legitimate image choice in a brand whose subject is restraint |

## 3. The three generated fields

Each is real, scalable SVG geometry — not a raster, not a stock image, not a texture download.

| File | Composition | What it says |
| --- | --- | --- |
| `field-A-notarial.svg` | Eleven horizontal rules at decreasing opacity, six column ticks, one low-opacity emphasis rectangle, one solid node | A ledger: records in order, one thing marked |
| `field-B-protocol.svg` | A 42-point lattice, one solid edge path, one dashed path, one solid node and one dimmed node | Some of what is known, some of what is not — drawn, not implied |
| `field-C-commons.svg` | Eleven vertical rules interrupted by exactly one open gate crossed by a link with a hollow and a solid node | The boundary is visible and passable |

All three inherit colour through `currentColor`, so they take the surface's text colour and
never introduce a second palette. Each has a companion `.md` recording slug, intent,
provenance and licence.

## 4. Technical rules

- `viewBox` present, `preserveAspectRatio="xMidYMid slice"` for fields used as backgrounds.
- No `<image>`, no base64 payload, no remote reference (validator-enforced).
- No text baked into an image asset.
- Decorative fields take `aria-hidden="true"`; a field carrying meaning needs a text
  alternative.
- Maximum 2 composition layers; if a field needs three it has become an illustration and must
  be justified as one.

## 5. The Open Graph card

`../11-templates/og-<direction>.svg` — 1200×630, the direction's ground, the wordmark, a
headline, a rule and a kicker line.

**[Gap] Critical implementation note.** The incumbent site references `public/og.svg` from
`og:image`. Facebook, LinkedIn and X do not render SVG Open Graph images; the shared card
would fall back to nothing. **Whatever direction is chosen, the OG card must be exported to a
raster (PNG or JPEG) and the meta tag updated to point at it.** This is a live defect today,
independent of the rebrand.

## 6. Sourcing rules for any future image

1. Every image gets a registry entry in `../12-governance/asset-registry.json` with licence,
   source and retrieval date — before it is used.
2. Prefer generated geometry, then commissioned illustration, then licensed photography.
3. Never a stock photo of an identifiable person without a model release on file.
4. Never an image whose licence prohibits commercial use, modification, or use in
   AI-training-adjacent contexts without a written position.
