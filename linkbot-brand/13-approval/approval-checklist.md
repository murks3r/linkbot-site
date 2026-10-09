# Approval checklist

## STATUS: NOT APPROVED

> No identity in `linkbot-brand/` is approved. Three directions are **CANDIDATE**; one is
> **PROPOSED**. Nothing may be published as Linkbot's brand, and no asset here is a production
> master, until every required row below is signed.

Signatures collected in this table only. An approval given in a chat message or a meeting is
not an approval until it is written here with a date.

---

## A. Evidence that the folder is sound (required before any review)

| # | Check | Evidence | Status |
| --- | --- | --- | --- |
| A1 | Every SVG parses, has a `viewBox`, and contains no script, image, foreignObject or remote reference | `python3 scripts/validate_brand.py` → 57 files checked, OK | ✅ PASS |
| A2 | No duplicate ids within any SVG | same gate | ✅ PASS |
| A3 | Every token file is valid JSON with `$type`+`$value` on every leaf and no unresolved reference | same gate | ✅ PASS |
| A4 | The CSS export and the JSON export agree on every primitive and alias | same gate | ✅ PASS |
| A5 | Every required contrast pair meets its WCAG 2.1 target, computed not eyeballed | `python3 scripts/gen_tokens.py` → 116/116 pass | ✅ PASS |
| A6 | The recommended direction lints clean against the official DESIGN.md CLI | `npx @google/design.md lint` → 0 errors, 0 warnings | ✅ PASS |
| A7 | The folder writes nothing outside `linkbot-brand/` | `scripts/validate_brand.py` boundary check | ✅ PASS |
| A8 | No runtime file, other agent's path or application file was modified | `git diff --stat origin/main...HEAD` | ✅ PASS |
| A9 | Every asset has a registry entry with a content hash | `12-governance/asset-registry.json` | ✅ PASS |
| A10 | All three specimens cover Talent, Employer/HR and Agency, light and dark, at 16px logo size | `11-templates/specimens/` | ✅ PASS |

## B. Founder decisions (see `founder-decision-sheet.md`)

| # | Decision | Answer | Date |
| --- | --- | --- | --- |
| B1 | D-01 Adopt a direction (A PROPOSED / B / C / none) | ☐ | |
| B2 | D-02 "Identity is verified" claim | ☐ | |
| B3 | D-03 Pilot cohort figure | ☐ | |
| B4 | D-04 Founding date | ☐ | |
| B5 | D-05 OG image rasterised | ☐ | |
| B6 | D-06 Paper ground accepted (if A) | ☐ | |
| B7 | D-07 Trademark search commissioned | ☐ | |
| B8 | D-08 OFL fonts accepted | ☐ | |
| B9 | D-09 Component tokens: product-first | ☐ | |
| B10 | D-10 Scroll narrative retained or retired | ☐ | |

## C. Identity approval (required before any external use)

| # | Item | Approver | Status |
| --- | --- | --- | --- |
| C1 | Direction adopted, recorded in `12-governance/GOVERNANCE.md` | Founder | ☐ NOT APPROVED |
| C2 | Mark geometry frozen | Founder | ☐ NOT APPROVED |
| C3 | Wordmark **production master** produced (outlined or commissioned) and the concept file marked superseded | Founder + designer | ☐ NOT PRODUCED |
| C4 | Trademark search completed with a written result, before public use | Founder + counsel | ☐ NOT DONE |
| C5 | Palette frozen and the contrast report re-run on the frozen values | Brand owner | ☐ NOT APPROVED |
| C6 | Typefaces licensed, licence texts committed with the font files | Brand owner | ☐ NOT DONE |
| C7 | Both linguistic versions reviewed by a native German speaker | Founder | ☐ NOT REVIEWED |
| C8 | Claim review passed against `00-audit/product-truths.md` §2 | Founder | ☐ NOT REVIEWED |
| C9 | Accessibility review: keyboard, focus, 200% zoom, 320px reflow, reduced motion, and no meaning by colour alone | Brand owner | ⚠ PASS in specimens, NOT REVIEWED in a product surface |
| C10 | Product and marketing surfaces both checked in a real browser after implementation | Eng + brand | ☐ NOT DONE (nothing implemented) |

## D. Explicitly not claimed by this branch

| # | Statement |
| --- | --- |
| D1 | No identity is approved. |
| D2 | No asset here is a production master. |
| D3 | No runtime file, deployment, CI configuration or application repository was changed. |
| D4 | No new product capability, commercial result or pilot number is asserted. |
| D5 | The brand was not published, deployed or merged. A draft pull request exists for review only. |
| D6 | The three marketing claims identified in the audit are unresolved and are the founder's to decide. |

## E. Review route

1. Read `../00-audit/brand-audit.md` §2 (the conflict table) and §4 (the three claims) — ten
   minutes.
2. Open `../11-templates/specimens/index.html` and look at all three, light **and** dark,
   including the 16px logo row — fifteen minutes.
3. Read `../02-directions/PROPOSED.md` §3 (why not B or C) — five minutes.
4. Answer the ten decisions in `founder-decision-sheet.md`.
5. Anything adopted is recorded in section B and C above, and the version moves to `1.0.0`.

## F. Known gaps carried forward

These are limitations of this branch, stated so they are not mistaken for completed work:

1. **The wordmark is a concept**, not a production master. Outlining or commissioning is a
   separate, funded step (C3).
2. **No product surface was restyled.** The Workspace mode of the proposed direction is
   specified but not demonstrated in the real product.
3. **Three font licences are marked ⚠ unverified** in `06-typography/licenses.md` — Space
   Grotesk, Public Sans and IBM Plex Mono. Open each `OFL.txt` before committing font files.
4. **The OG card is still SVG** in the incumbent site (D-05).
5. **No native-speaker German review** has been done (C7).
6. **No trademark search** has been done (C4, D-07).
7. `specimens/_logo-check.html` is a development scratch page kept for reproducibility; it is
   not a deliverable.
