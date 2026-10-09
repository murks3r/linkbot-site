# Changelog — Linkbot Brand Experiences

All notable changes to `14-experiences/`. Versioning follows the classes in
`../12-governance/GOVERNANCE.md` §2. **No identity or theme in this folder is APPROVED.**

---

## [0.1.0] — 2026-10-09

Branch `parallel/brand-experiences-v1`, based on Linkbot Brand OS v0.1.0
(`parallel/brand-os-v1`). New work is confined to `14-experiences/` and `15-typeface/`;
no Brand OS file is modified and no runtime file is touched.

### Added — the shared layer

- `00-shared/tokens.shared.json` / `.css` — 27 identity-invariant primitives, the exact
  semantic role set (18 roles), one type scale and family set, one spacing scale, one
  radius scale, one motion set and one focus treatment.
- `00-shared/experience-{A-talent,B-developer,C-employer}.tokens.{json,css}` — the three
  themes. Overrides are ground, accent and density only; the gate fails if an override
  introduces an undeclared key or changes a shared value.
- `00-shared/fonts.css` — the one type system. Declares the tested OFL fallback stack
  only; the original faces are built in `15-typeface/`.
- `00-shared/app.css` — the shared component layer the five screens use.

### Added — the suggested colours

- `#ABABA1` admitted as shared `border-decorative-strong` (decorative; not text on light
  grounds — 2.05:1 on paper, 7.82:1 on ink).
- `#ABEBA1` admitted as shared `marker` (decorative highlight; 1.23:1 on paper, 13.05:1 on
  ink, ink on it 13.05:1).
- `mintDeep` `#567651` **derived** by darkening `#ABEBA1` until it clears 4.5:1 on every
  light ground (worst case 4.53:1 on paper) — the light-mode-safe sibling.
- Neither colour replaces an existing decision; Experience B keeps its phosphor accent
  with the alternative documented (`PROPOSED.md` X-03).

### Added — the shared logo system

- `logo/` — 14 files. Direction A mark geometry carried over **unchanged** from
  `04-logo/A-notarial/`, plus the variants the experiences actually need: inverse
  (paper-on-ink), a measured `mark-compact` for 16–20px where the inscribed square
  degrades to texture, favicon, app plate and its inverse, social avatar, lockups with
  mark stroke matched to wordmark stroke, a clearspace diagram, a construction guide and
  a misuse sheet.
- One set of files for all three experiences; per-experience logo variants are forbidden.

### Added — five responsive specimens

- `01-talent-jobsite/` — job search and job detail. External listings carry no native
  apply button (T9); the Linkbot listing offers a bounded signal request with the request
  visible before the answer.
- `02-private-job-agent/` — four-step onboarding with skippable context, proposed vs
  confirmed states, a bounded versioned standing mandate, and the revocation wording.
- `03-developer-platform/` — API documentation and MCP integration; scopes, endpoints,
  tools, and a fail-closed refusal example. Opens dark.
- `04-employer-dashboard/` — role-bound membership, the request table with its recorded
  states, an ordering that explains itself, and the authorised-read history.
- `05-agency-mandate/` — mandate record, met/unknown/unmet requirement matrix, shortlist,
  and the explicit "unknown shortlists for verification" rule.
- Every screen: light and dark, EN and DE, four states carried by colour + glyph + word,
  a visible focus ring, reduced-motion handling, and a provenance strip on the page.
- `index.html` — entry point listing all five with the shared logo assets rendered.

### Added — evidence and reproducibility

- `validation/contrast-report.md` — **96 required pairs** (17 pairs × 3 experiences × 2
  modes, plus the suggested-colour matrix and the derived-neighbour table), all computed,
  all passing.
- `validation/shared-vs-override.md` — the exact shared key set and the override table.
- `scripts/gen_experience_tokens.py`, `gen_logo.py`, `gen_screens.py`,
  `validate_experiences.py`, `build.sh` — standard library only, no install, no build.

### Verified

- 14 SVGs pass the asset gate (parse, `viewBox`, no script/image/remote, unique ids).
- 96/96 contrast pairs pass; recomputed by the gate from the **emitted** JSON, not from
  the generator's memory.
- The shared layer holds: 27 shared keys byte-identical across all three experience files,
  the role set is exact, and no override invents a key.
- 5/5 specimens present, all local references resolve, copy rules (no native apply for an
  external listing, no "match" for a one-sided result) hold.
- No horizontal overflow at 320px on any screen; verified in a browser.
- The write boundary holds: nothing outside `14-experiences/` and `15-typeface/`.

### Fixed during the build

- The light-mode `border-control` was initially the decorative `ruleStrong` `#ABA391`,
  which measures **2.44:1** on the porcelain surface — below the 3:1 non-text target. It is
  now a derived token, `#8B8B8B`, walked toward black until it clears 3:1 on every light
  surface (white, porcelain, paper, cool canvas). A decorative rule and a control border
  are separate tokens on purpose.

### Not done, by design

- No direction chosen on the owner's behalf; the direction choice is not re-opened.
- No runtime file, deployment, CI configuration or product surface changed.
- No production logo master produced; the wordmark is still the interim monoline concept
  until the type-derived master exists in `15-typeface/wordmark/`.
- No native-speaker German review, no trademark search.
