# Brand audit — Linkbot as it is today

Scope: the marketing site in this repository (`murks3r/linkbot-site` @ `59b63ea`) and the
product frontend in `murks3r/linkbot` (read from the sibling integration worktree). Every
statement below is traceable to a file. Nothing here is inferred from a screenshot.

Tags: **[Fact]** read from source · **[Gap]** a verified inconsistency · **[Claim]** a
public assertion that does not match the documented product · **[Unknown]** not determinable
from the files available to this task.

---

## 1. What exists today: two unrelated identities

### 1.1 The marketing site (`src/`, `public/`, `tailwind.config.mjs`)

| Attribute | Value | Evidence |
| --- | --- | --- |
| Surface | Single dark landing page, dark **only** | `global.css` → `:root { color-scheme: dark }`, `body` background `linear-gradient(180deg,#05060a,#07090f,#05060a)` |
| Palette | `ink` 950 `#05060a` / 900 `#0a0c12` / 800 `#10131c` / 700 `#181c28`; `bone` 50 `#f5f4ef` / 100 `#e8e6dc` / 200 `#c8c5b8`; `signal` 400 `#7be0a8` / 500 `#3fc487` / 600 `#1ea56b`; `alarm` 400 `#e07b7b` / 500 `#c44b4b` | `tailwind.config.mjs` |
| Type | **Three** families: Fraunces (display serif), Inter (sans), JetBrains Mono (mono) | `tailwind.config.mjs` + `BaseLayout.astro` `fonts.googleapis.com` stylesheet |
| Font delivery | Remote Google Fonts request on every page load | `BaseLayout.astro:27-29` |
| Logo | An inline 22×22 diamond glyph (rotated square + centre dot), copy-pasted in the header and the footer; not a file | `index.astro:15-18`, `index.astro:185-187` |
| Favicon | Same diamond on a `#05060a` rounded rect | `public/favicon.svg` |
| Social image | `/og.svg` — an **SVG** at 1200×630 | `public/og.svg`, `SEO.astro:10` |
| Shape language | `rounded-full` pills and buttons, `rounded-2xl` bordered panel, `rounded-md` inputs, a 56px grid background, a top gradient hairline | `index.astro:9,21,36,94,142`; `global.css:19-21,27-32` |
| Headline position | "Your career should not be a public attack surface." → "private eligibility instead of public exposure" | `index.astro:27,32-33` |
| Standing claims | "Identity is verified · Eligibility is private · Matching is permissioned" | `index.astro:47-49` |

### 1.2 The shipped product frontend (`frontend/src/styles.css`)

| Attribute | Value | Evidence |
| --- | --- | --- |
| Palette | **Pure monochrome.** `--ink:#000000; --paper:#FFFFFF; --slate:#000000; --ocean:#000000; --line:#000000` | `frontend/src/styles.css:4-8` |
| Type | **One** stack for everything: `--display: "Helvetica Neue", Helvetica, Arial, sans-serif`; `--body` and `--utility` both alias it | `frontend/src/styles.css:10-12` |
| Font delivery | None. System stack only, no remote request | same |
| Wordmark | Typeset text, not an asset: `.wordmark { font-size:1.5rem; font-weight:700; letter-spacing:-.06em; text-transform:uppercase }`, rendered as the literal string "Linkbot" | `frontend/src/styles.css:50`; `AppShell.tsx:95` |
| Structure | `--section-rule: 1px dashed rgb(0 0 0 / .55)` — dashed 1px rules are the only structural separator | `frontend/src/styles.css:9` |
| Shape | No radii, no shadows, no gradients (a deliberate, documented rule) | `docs/launch-mvp/talent-visual-system.md` |
| Logo mark | **None.** No logo, mark or wordmark image file exists in the product frontend | `frontend/src/components/ui/brand.tsx` contains only `Arrow` and `PrivateLabel` |

### 1.3 The product documents that describe a different palette again

`docs/launch-mvp/coherent-product-design.md` specifies Ink `#172125`, Paper `#F6F8F9`,
Slate `#57666E`, Ocean `#245C73`, Line `#DCE3E6` and 12–20px radii. **[Gap]** The shipped
stylesheet collapsed all of that to pure black and white with no radii. The design document
and the shipped product no longer agree, and neither is versioned as brand.

---

## 2. Where the two identities actually conflict

| # | Conflict | Marketing site | Shipped product | Consequence |
| --- | --- | --- | --- | --- |
| 1 | **Colour mode** | Dark only | Light, `#FFFFFF` paper | A Talent who arrives from the site and then signs in crosses into the opposite world |
| 2 | **Type system** | Fraunces + Inter + JetBrains Mono, remote | Helvetica Neue / Arial, system | Two typographic voices for one company; the product's stack is font-family-name dependent and cannot be self-hosted |
| 3 | **Shape** | rounded-full, 2xl panels, md inputs, gradients, grid | no radii, no gradients, dashed rules only | The marketing site contradicts a documented product rule |
| 4 | **Brand anchor** | A page-local inline diamond, no file | No mark at all | There is **no canonical Linkbot logo asset in either repository** |
| 5 | **Wordmark** | Lowercase "Linkbot" in a UI sans | UPPERCASE "Linkbot", weight 700, −0.06em tracking | Two different wordmarks, neither specified |
| 6 | **Accent** | `signal` green `#3fc487` | none (monochrome) | "Granted / authority" has no consistent colour carrier |

**[Fact]** There is no versioned brand folder, no token file, no licence register and no
approval record anywhere in either repository. This folder is the first.

---

## 3. Accessibility findings in the current marketing site

Computed with the WCAG 2.1 relative-luminance formula against the `ink-950` page base
(`#05060a`). Reproduce with `scripts/gen_tokens.py` (`contrast()`).

| Element | Value | Ratio | Assessment |
| --- | --- | --- | --- |
| Body copy | `bone-50` `#f5f4ef` on `ink-950` | 18.39:1 | Passes AA/AAA |
| Accent text | `signal-400` `#7be0a8` on `ink-950` | 12.60:1 | Passes |
| Focus ring | `signal-500` `#3fc487` on `ink-950` | 9.12:1 | Passes (non-text needs 3:1) |
| `alarm-500` status dot | `#c44b4b` on `ink-950` | **4.30:1** | Passes 3:1 as a non-text indicator, **fails 4.5:1** — it must never be the only carrier of meaning |
| Uppercase section labels | `bone-200` `#c8c5b8` at **50%** opacity on `ink-950` → effective `#666661` | **3.51:1** | **Fails AA (1.4.3)** for normal text at any size used on the page |
| Secondary copy | `bone-200` at 60% → `#7a7972` | 4.63:1 | Marginal pass; fails AAA |

**[Fact]** `text-bone-200/50` is used for the hero footer strip, every section's `dt` label,
the footer text and the "we do not share your information" notice
(`index.astro:46,67,71,75,119,123,127,158,184,191,192`). Those are content, not decoration.

Other observations:

- **[Gap]** `public/og.svg` is an **SVG** referenced from `og:image`. Facebook, LinkedIn and
  X do not render SVG Open Graph images; the shared card would fall back to nothing. This is
  a live defect independent of brand direction.
- **[Gap]** `robots.txt` disallows `/access`, but the access request is a `mailto:` form
  inside the single `/` document (`index.astro:134-161`); the directive has no effect.
- **[Fact]** Dark-only rendering means the site cannot honour a user's light-mode
  preference, and there is no `prefers-color-scheme` support.

---

## 4. Claims on the site that the product does not support

The product's own normative documents are explicit about authority, evidence and UNKNOWN.
Three public statements do not survive contact with them.

**4.1 "Identity is verified"** — `index.astro:47`.

**[Fact]** `docs/adr/011-private-intent-foundation.md` states a Claim carries authority
`proposed | confirmed | externally_verified`; `externally_verified` requires a
`CredentialAdapter.verify` that must check issuer, validity, revocation and provenance —
and "**There is no configured adapter and the exporter currently returns an empty credential
list.**" Confirmed records today are `user_attestation`, explicitly "**not externally
verified**". A flat headline "Identity is verified" asserts external verification the system
cannot currently produce.

**4.2 "We onboard in groups of roughly 20"** — `index.astro:175`.

**[Claim]** The documented pilot is "3–5 real Talents" (M5.2) and "1–2 real
employers/recruiters" (M5.3), with a recorded status of zero participants
(`docs/launch-mvp/m5-product-contract.md`, `docs/adr/011` §Canonical inputs). A cohort size
of ~20 has no source.

**4.3 Nothing is indexed / we do not aggregate** — `index.astro:172`.

**[Fact]** Supported: `docs/contracts/private-state-v1.md` and ADR 011 both state there is
"no `/people`, `/persons`, `/profiles` or private Party enumeration route", no public
identifier, and each owner sees only their own state. This claim is safe to keep.

**4.4 Claims the site correctly avoids** (worth preserving deliberately):
**[Fact]** ADR 011 says "Do not claim E2EE, anonymous or zero-knowledge matching", and
"no blockchain, token, DID registry, wallet UX, seed phrase or custom cryptography". The
current site makes none of those claims. No artifact in this folder introduces one.

---

## 5. What the audit implies for a brand system

1. **The gap is architectural, not cosmetic.** Two identities exist; neither is specified,
   versioned or licensed. Fixing colour alone would leave it unspecified.
2. **A brand asset base has to be created, not restyled.** There is no logo file, no token
   file and no licence register to inherit. `04-logo/`, `10-tokens/` and `06-typography/`
   exist because these are genuinely missing, not to replace something that works.
3. **The product's monochrome discipline is a real asset and should be preserved.** Pure
   black/white, dashed structural rules and uppercase utility labels are a strong, unusual
   and accessibility-cheap product language. A brand direction that fights it will be
   abandoned during integration.
4. **Distinctiveness must be earned where the market looks** — positioning copy, long-form,
   social, the marketing surface — not by redecorating the workspace.
5. **Three claims and one OG defect need founder attention** before any rebrand ships
   (see `13-approval/founder-decision-sheet.md`, items D-01 to D-05).

---

## 6. Unknowns recorded honestly

- **[Unknown]** Which mark, if any, the product intends to adopt. `coherent-product-design.md`
  refers to "Linkbot's small interlocking mark", but no such asset exists in the repository.
- **[Unknown]** Whether `Linkbot OÜ` has any registered or pending trademark, and in which
  classes. No evidence available in these repositories.
- **[Unknown]** The founder's existing font licences, if any (e.g. a desktop Helvetica Neue
  licence that would permit outlined wordmark artwork).
- **[Unknown]** `foundingDate: '2024'` in `SEO.astro:37` matches nothing in the repositories
  read; it needs founder confirmation rather than replication.
