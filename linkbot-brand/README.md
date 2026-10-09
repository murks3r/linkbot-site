# Linkbot Brand Operating System

Version **0.1.0** · branch `parallel/brand-os-v1` · owner: Brand Strategy & Design Systems.

This folder is a **versioned, non-applied brand system**: it describes, evidences and
proposes an identity. It does not change a runtime file, it does not ship an approved
brand, and it does not create a production master that has not been validated.

```
linkbot-brand/
  00-audit/          factual audit of today's identity + the product truths brand may not break
  01-strategy/       positioning, brand architecture, messaging house
  02-directions/     three candidate identities + comparison + PROPOSED recommendation
  03-verbal/         EN and DE verbal identity, terminology, claim rules
  04-logo/           editable SVG marks, monoline wordmarks, lockups, misuse sheet
  05-colour/         palette specification and contrast evidence
  06-typography/     type system, font evaluation, licence accounting
  07-imagery/        imagery rules + generated abstract fields
  08-iconography/    a 20-icon semantic set (real SVG sources)
  09-motion/         motion tokens, CSS and demo
  10-tokens/         DTCG token JSON + CSS export + DESIGN.md for the proposed direction
  11-templates/      inspectable HTML specimens, OG templates
  12-governance/     governance, versioning, asset registry
  13-approval/       founder decision sheet and approval checklist
  validation/        computed contrast report, validation log
  scripts/           the generators and the validator that produced everything above
```

## Status of every artifact in this folder

| Label | Meaning |
| --- | --- |
| **FACT** | Verified from source in this repository or a sibling Linkbot repository. |
| **PROPOSED** | A recommendation. **Not approved.** Nothing may be shipped from it. |
| **CANDIDATE** | One of three explored directions. Not approved, not recommended. |
| **REJECTED** | Explored and set aside, with the reason recorded. |

**No identity in this folder is APPROVED.** The only artifact carrying a recommendation is
`02-directions/PROPOSED.md`, and it is marked PROPOSED throughout.

## How to inspect it

Everything is static. No install, no build, no server:

```bash
open 11-templates/specimens/index.html      # specimens for all three directions
```

Each specimen shows light and dark rendering, the logo at 16/24/32/48 px, the palette,
typography, the four-state vocabulary, components, motion with a reduced-motion fallback,
and the identity applied to **Talent, Employer/HR and Agency**.

## How to reproduce it

Everything is generated and self-checking. Requires only Python 3.10+ (standard library):

```bash
cd linkbot-brand
python3 scripts/gen_logos.py       # marks, wordmarks, lockups, favicons, app icons
python3 scripts/gen_assets.py      # icons, abstract fields, OG templates
python3 scripts/gen_tokens.py      # token JSON + CSS + WCAG contrast report (exits 1 on failure)
python3 scripts/gen_specimens.py   # the HTML specimens
python3 scripts/gen_registry.py    # the asset registry with content hashes
python3 scripts/validate_brand.py  # the gate: SVG integrity, token parity, write boundary
```

`validate_brand.py` is the gate. It fails on a malformed SVG, a forbidden `<script>`/
`<image>`/remote reference, a duplicate id, an unresolved token reference, a CSS/JSON
mismatch, or a write anywhere outside `linkbot-brand/`.

## What is deliberately not here

- No approved logo, no approved palette, no approved typeface.
- No production logo master: the marks and wordmarks are **editable concepts** built from
  real geometry. A production master requires outlining in a licensed typeface or a
  commissioned face, plus trademark review.
- No new product claim, no capability, no commercial result. See `00-audit/product-truths.md`.

## Governance

Read `12-governance/GOVERNANCE.md` before changing anything in this folder. Changing a
token, a mark or a claim requires the version bump and the approval route recorded there.
