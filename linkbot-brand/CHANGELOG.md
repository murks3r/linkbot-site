# Changelog

All notable changes to the Linkbot Brand Operating System. Format follows Keep a Changelog;
versioning follows the classes in `12-governance/GOVERNANCE.md` §2.

**No identity in this folder is APPROVED.** Every entry below is a candidate, a proposal or
evidence.

---

## [0.1.0] — 2026-10-09

Initial versioned brand folder. Branch `parallel/brand-os-v1`, based on
`main` @ `59b63ea` (`murks3r/linkbot-site`).

### Added — audit and truth baseline

- `00-audit/brand-audit.md` — factual audit of the marketing site and the shipped product
  frontend, a six-row conflict table between them, computed contrast evidence for the current
  site, and three public claims that the product documentation does not support.
- `00-audit/product-truths.md` — 12 semantic non-negotiables, 8 claim prohibitions, and the safe
  statement set per audience, extracted from the product's normative documents.

### Added — strategy

- `01-strategy/positioning.md` — position statement, the three-role brand architecture, the
  Record/Workspace two-mode framing, per-audience promises and prohibitions, personality table.
- `01-strategy/messaging-house.md` — message hierarchy with a labelled proof layer, checked
  copy for all three audiences, and a four-tier claim-approval model.

### Added — three candidate directions

- `02-directions/direction-A-notarial.md`, `…-B-protocol.md`, `…-C-commons.md` — each with its
  own strategic idea, mark, wordmark, palette, type set, motion, imagery, voice, applications
  and stated weaknesses.
- `02-directions/comparison.md` — scored comparison on seven criteria, an accessibility risk
  register, a licensing comparison, and five directions rejected before these three.
- `02-directions/PROPOSED.md` — **the recommendation, marked PROPOSED**: Direction A, with an
  explicit statement of why not B and why not C, what acceptance would and would not mean, and
  what would change the recommendation.

### Added — verbal identity

- `03-verbal/verbal-identity-en.md` — voice traits, sentence rhythm, position lines, audience
  openings, microcopy standards, banned constructions.
- `03-verbal/verbal-identity-de.md` — an independent German formulation, with the recorded
  decision not to translate the "attack surface" metaphor because the German term imports the
  security register the brand must avoid.
- `03-verbal/terminology.md` — normative terminology contract: 13 core objects, the four states
  with their single permitted German words, single-meaning words, and a do-not-translate list.

### Added — real assets

- `04-logo/` — **31 SVG files** across three directions: editable marks, construction guides,
  monochrome variants, favicons, ink and inverse app plates, social avatars, monoline
  wordmarks, horizontal and stacked lockups with automatically matched optical weight, and a
  misuse sheet. All font-independent, all generated, all validated.
- `08-iconography/icons/` — 20 icons on a 24px grid, drawn from the product's own object
  vocabulary; no padlock, shield, verification badge or score, with the reason recorded.
- `07-imagery/field-*.svg` — three generated abstract fields, each a companion `.md` recording
  intent, provenance and licence. No photography anywhere.
- `11-templates/og-*.svg` — three 1200×630 social templates with declared font fallbacks, plus
  the recorded finding that SVG is not usable as `og:image` on the major platforms.

### Added — systems

- `10-tokens/<direction>.tokens.{json,css}` — DTCG-shaped token files with a three-layer
  model (primitive → semantic → deferred component), a CSS export, and a reduced-motion block.
- `10-tokens/proposed.DESIGN.md` — the recommended direction as a Google `DESIGN.md` spec.
- `05-colour/colour-system.md` — the semantic role API, the four status colours with their
  luminance rationale, the separate decorative/control border tokens, and the governance rules.
- `06-typography/typography.md`, `font-evaluation.md`, `licenses.md` — scale with per-step
  roles, a four-gate face evaluation with 15 faces assessed, and a licence register including
  the OFL obligations that affect implementation and three faces explicitly marked unverified.
- `09-motion/motion.md` + `motion.css` — tokens, the one-deliberate-moment budget per direction,
  and a reduced-motion rule that replaces movement with a visible state change rather than
  removing feedback.
- `11-templates/specimens/` — three self-contained HTML specimens, each showing light and dark,
  the logo at 16/24/32/48px, live palette swatches, the type hierarchy, the four-state
  vocabulary with a receipt and a met/unknown/unmet table, components, motion, and the
  identity applied to Talent, Employer/HR and Agency.
- `10-tokens/README.md`, `11-templates/README.md` — usage and adoption path.

### Added — governance and approval

- `12-governance/GOVERNANCE.md` — change classes with approval authority, versioning, rules for
  adding a direction, changing a token or a logo, claims governance, the accessibility gate,
  language governance and provenance rules.
- `12-governance/asset-registry.json` — every file with category, status, licence, size and
  SHA-256, generated.
- `13-approval/founder-decision-sheet.md` — ten decisions with recommendations and the risk of
  leaving each open.
- `13-approval/approval-checklist.md` — the evidence gate, the decision records, the identity
  approval gate, the explicit non-claims, and the known gaps carried forward.

### Added — reproducibility

- `scripts/gen_logos.py`, `gen_assets.py`, `gen_tokens.py`, `gen_specimens.py`,
  `gen_registry.py`, `validate_brand.py` — standard library only, no install, no build. Every
  file in this folder is regenerable from these six scripts.
- `validation/contrast-report.md` — 116 required pairs (44 token-system, 72 specimen
  role palettes, light and dark), all computed, all passing.
- `validation/design-md-export.dtcg.json` — the official CLI's DTCG export, as a cross-check.

### Verified

- 57 SVG files pass the asset gate (parse, `viewBox`, no script/image/remote, unique ids).
- 116/116 contrast pairs pass their WCAG 2.1 targets.
- `@google/design.md lint` reports 0 errors, 0 warnings.
- The write boundary holds: nothing outside `linkbot-brand/` was modified.
- No runtime file, other agent's path or application repository was changed.

### Not done, by design

- No direction was chosen on the founder's behalf.
- No runtime file, application file, CI configuration or deployment was touched.
- No production logo master was produced; the wordmarks are editable concepts.
- No German native-speaker review, no trademark search, no font files committed.
