# Governance

Status: **PROPOSED.** This document governs changes to the folder it lives in.

---

## 1. The rule that outranks the others

> **No artifact in this folder may be described as approved, final, official or a production
> master unless the approval checklist has been signed by the founder and recorded here.**

Three directions exist. Two carry no recommendation at all. The recommended one is marked
**PROPOSED** in its filename, in its heading and on the specimen page it renders. That
redundancy is deliberate.

## 2. Change classes and who may approve them

| Class | Examples | Approval required | Version effect |
| --- | --- | --- | --- |
| **PATCH** | Typo, comment, doc clarification, icon regeneration with identical geometry | Author of the change | `0.1.0 → 0.1.1` |
| **MINOR** | New icon, new specimen, new direction added, new template, PATCH-level token value inside an existing pair target | Brand owner | `0.1.0 → 0.2.0` |
| **MAJOR** | Adopting a direction, adding or removing a semantic role, changing a primitive that any surface consumes, changing the mark or the wordmark geometry, changing a licence | **Founder** | `0.1.0 → 1.0.0` on adoption |

An **adopted** direction is the only thing that moves this folder out of the `0.x` line, and it
is the only thing that makes any asset a production master.

## 3. Versioning

- `VERSION` holds a single semantic version.
- `CHANGELOG.md` records every MINOR and MAJOR change with the reason, the date and the
  decision entry it implements.
- Tokens carry the version in their `$description`, so a consumer can tell which brand version
  it is reading without checking a second file.
- The asset registry records a content hash per file. A hash change on a file whose generator
  did not change means the file was hand-edited — which is a governance violation, not a
  curiosity.

## 4. Adding a direction

A fourth direction is admissible only if it differs from the existing three on **at least
three** of: ground colour strategy, type system, mark concept, shape language, state
encoding. A recolour of an existing direction is not a direction; it is a theme, and themes
belong in `10-tokens/`.

Every new direction must ship all of: a mark, a monoline wordmark, both lockups, a favicon, a
passing token file with 100% of required contrast pairs, and a specimen covering all three
audiences.

## 5. Changing a token

1. Change the primitive or the semantic alias in `scripts/gen_tokens.py`. **Never edit generated
   output.**
2. Re-run `python3 scripts/gen_tokens.py`. It exits non-zero if any required pair fails.
3. Re-run `python3 scripts/validate_brand.py`. It checks CSS/JSON parity and reference
   resolution.
4. Re-run `python3 scripts/gen_registry.py` and commit the registry.
5. If the change affects a semantic **role** (not just a value), it is MAJOR and needs the
   founder.

## 6. Changing the logo

1. Change the geometry in `scripts/gen_logos.py`. Never hand-edit an SVG.
2. Re-run `gen_logos.py`, `gen_specimens.py`, `gen_registry.py` and `validate_brand.py`.
3. Re-check small sizes by eye in `11-templates/specimens/` at 16px. This is a manual step; the
   validator cannot see legibility.
4. Any change to the mark or wordmark geometry is MAJOR and requires the founder **and** a
   trademark re-check (D-07), because the previous search no longer applies.

## 7. Claims governance

`00-audit/product-truths.md` is normative. A brand change that requires a copy change falls
into one of the four claim tiers in `01-strategy/messaging-house.md` §3. Tier C (any number)
and tier D (prohibited) require the founder and evidence. A contributor may not add a
quantitative claim to a specimen, template or document.

## 8. Accessibility gate

A change may not be merged if any of the following is true:

- a required contrast pair falls below its target in the generated report;
- a new state is introduced that is distinguishable by colour alone;
- a new text style is introduced below 16px for running text, or below 24px for a display face;
- a new motion is introduced without a `prefers-reduced-motion` behaviour that preserves feedback;
- a new SVG fails the asset gate (missing `viewBox`, a script, an image, a remote reference);

## 9. Language governance

Both `03-verbal/verbal-identity-en.md` and `…-de.md` are normative. The German file is *not* a
translation of the English one; where they diverge deliberately (the "attack surface" metaphor,
which is not translated), the divergence is documented in the German file §2. A change to one
language must be considered against the other.

## 10. Provenance and honesty rules

1. Every asset states what it is: generated geometry, concept, or production master.
2. Two independent paths must be able to regenerate every generated file; if a file cannot be
   regenerated, it must be labelled hand-authored.
3. An asset whose licence is not recorded may not be added. Fonts additionally require the
   licence text to be committed alongside the font file.
4. Evidence must be reproducible: contrast ratios are computed by a committed script, not
   typed into a table.
5. **Unknowns are recorded as unknowns.** `00-audit/brand-audit.md` §6 exists for that purpose
   and is not an apology — it is the boundary of what this folder claims to know.

## 11. Retention of superseded work

When a direction is adopted, the other two move to `02-directions/superseded/` with their
assets and specimens, and their registry entries change status to `SUPERSEDED`. Nothing is
deleted: the reasoning is the record.
