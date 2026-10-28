---
type: note
title: Landing page in the widget design, page plan for the owner's approval
created: 2026-10-28
tags:
  - front
  - design
  - plan
related:
  - '[[redesign-2026-10-24]]'
  - '[[truth-check]]'
---

# Landing page in the widget design: page plan

**State: a plan, waiting for the owner's approval. Nothing is built from it yet.** Written 2026-10-28 by the Site lane
on `build/vision` at `c119b24`.

**What it does.** It turns the home (`/`) into the landing page and carries the widget's design onto the whole site,
so that the site and the widget read as one product. The design source is the widget design spec v1 of 2026-10-28,
approved by the owner as the base (the workspace's `plan/design/linkbot-widget-design/DESIGN-SPEC.md`: tokens §5, type
Schibsted Grotesk, language §7). The frontend inventory of 2026-10-28 proposes this repository as the website's home.

**Rules that hold for every section.**
- Every sentence is true on the staging space on the day it is built, and has its row in `docs/truth-check.md`. The
  forbidden words stay forbidden (`tests/forbidden.mjs`). The spec's own word for principle 7 (a proposal that names
  neither side) is one of them, so the site says "verdicts, never who".
- No live widget on the site until a demo space exists (`CLAUDE.md`); the proof is the recorded walkthrough of the real
  widget. The static screens in the spec's `screens/` folder are design references, never shown as the product.
- "Linkbot Jobs" is a reference for the shell's second use only. It does not appear on any page.
- Five languages as today; German in the Sie form (it already is); sentence case, no capital-letter labels (§7: the
  `.eyebrow`'s `text-transform: uppercase` goes).

## 1. The page, section by section

Each section: the core message (one sentence, the English source), the proof it shows, the call to action, and what it
replaces on today's home (`src/components/front/Front.astro`, sections 1 to 6).

### 1.1 Opening: the first screen of the widget

- **Message:** "Say what you need. The other side learns nothing about you before both of you say yes."
  Truth rows `home.rules`, `how.yes` (no introduction without gates, approval and both yeses; the other side learns
  nothing before both yes).
- **Proof:** the home's existing ask line (`method="dialog"`, the synthetic sample pack, answered in the browser only),
  redrawn as the widget's first screen: brand line on top, one question as the heading ("What are you looking for?"),
  one field with an icon, the trust sentence under it (spec §2.6), the main button saying what it does. The result
  (the pack's questions, what would be stored) stays as today, in the spec's building blocks (§6: question with
  subtitle, chips, selection rows). The privacy line under the field stays word for word.
- **Call to action:** main button "See the whole path" → `/demo`; text button "For platforms" → `/for-platforms`.
- **Replaces:** section 1 (B hero with the Venn). The Venn and its pause control go.

### 1.2 The demo stage: two roles, one after the other

- **Message:** "A request and an offer are introduced only after a named operator approves and both sides say yes."
  Truth rows `home.flow`, `how.approval`, `how.yes`.
- **Proof:** the recorded walkthrough that `/demo` shows today (`public/material/demo/<lang>/`, recorded from Connect's
  demo stage with synthetic data), with the switch the spec's §9 asks for on top: "As a buyer" / "As a supplier", one
  role at a time, never side by side. Three steps per role on the landing page; the full six steps and the watch stay
  on `/demo`. The stage says it shows fictional data (truth row `site.synthetic`). The pictures are re-recorded once
  the widget itself carries the spec's design (Connect's work in `packages/embed`); until then they show the widget as
  staging serves it, and the stage frame around them is the only part in the new design.
- **Call to action:** "Walk through all six steps" → `/demo`.
- **Replaces:** section 2 (Story and the folded Ledger) as the second section; the Ledger moves to `/how-it-works`.

### 1.3 A proposal, criterion by criterion

- **Message:** "Linkbot shows a verdict for each criterion, never a score; what is unknown stays open."
  Truth rows `home.lede`, `how.matching`, `home.pillars[1]`.
- **Proof:** one proposal card in the spec's form (§6 "proposal card with criteria list"): a tick per criterion that
  fits, open points marked open, no names. Drawn from the synthetic pair the home already uses (`src/front/a-match.ts`),
  so no new data.
- **Call to action:** "How matching works" → `/how-it-works#describe`.
- **Replaces:** section 3 ("Why it asks instead of guessing"); its four points shrink into the card's caption.

### 1.4 Who sees what

- **Message:** "Each stage shows only what that stage allows; introduction-stage details go out only after both yeses."
  Truth rows `how.introduction, how.sees`, the `/who-sees-what` rows.
- **Proof:** the stage list as today (`c-stages.ts`), in the spec's progress style (the active step in `marker`).
- **Call to action:** "Who sees what, step by step" → `/who-sees-what`.
- **Replaces:** section 4, kept, restyled.

### 1.5 For platforms

- **Message:** "One script and one element on your page; the questions come from your market's pack."
  Truth rows `platforms.embed`, `platforms.keys`, `how.pack`.
- **Proof:** the shortest embed, verbatim from Connect's repository as `/developers` shows it today
  (`src/lib/connect-docs.ts`). Nothing about a per-space brand in the widget until the widget has it (spec §3 is not
  built yet).
- **Call to action:** "For platforms" → `/for-platforms`; text button "For developers" → `/developers`.
- **Replaces:** section 5 (the two cards). The verticals card goes; `/verticals` stays, linked from `/for-platforms`
  and the footer.

### 1.6 Where it stands

- **Message:** "Everything here runs on Geoprocure's synthetic staging space; nothing is published yet."
  Truth rows `site.synthetic, how.today`, `how.today (now)`, `how.today (later)`.
- **Proof:** the status list from `/status` (built from the table at the end of `docs/truth-check.md`), three lines:
  on staging, built, not built; dated with `STATUS_CHECKED`.
- **Call to action:** "The full status" → `/status`; "Request a demo" → `/request-a-demo`.
- **Replaces:** section 6, kept, with the status list added.

Header and footer keep their links and the legal column as today.

## 2. Pages: replaced, kept, removed

| Page | After the plan |
| -- | -- |
| `/` | replaced by section 1 above |
| `/demo` | kept; gets the role switch (§9) and the new tokens; steps and pictures unchanged until re-recorded |
| `/how-it-works` | kept; takes the Ledger (the full synthetic pair) from the home |
| `/who-sees-what`, `/for-platforms`, `/developers`, `/platforms` and its six pages, `/verticals` | kept, restyled by the tokens only |
| `/status`, `/changelog`, `/request-a-demo`, `/contact`, `/imprint`, `/privacy`, `/one-page` and its PDFs | kept, restyled by the tokens only |
| the intermediaries draft | kept as a draft, out of production as today |
| `/__preview/brand` and the variant switcher (`Variants.astro`, `src/lib/variants.ts`), `brand-a8.css`, `type-a8.css`, `palette.css` | removed: the spec replaces the brand board's palette and type (needs the owner's yes, decision 2) |
| review switches `?venn=2`, `?logo=quote`, `?icon=match`, `?arm=pointer`, `?theme=dark` | removed with the parts they switch (decision 3) |

## 3. Tokens and type: one file, no second palette

- **One token file:** `src/styles/tokens.css`, the only place a colour, a radius or a type size of the site is written.
  It holds the spec's §5 values under the spec's names (`--lb-ground: #F2F4F1`, `--lb-surface`, `--lb-ink`,
  `--lb-slate`, `--lb-line`, `--lb-line-quiet: #E3E8E6`, `--lb-track`, `--lb-accent: #2B4FA3`, `--lb-accent-soft`,
  `--lb-accent-soft-2: #C9D5EE`, `--lb-marker: #F6DC7E`), the type roles of §5 and the sizes (fields 56 px radius 12,
  main button 56 px radius 14, chips 44 px, targets 44 px, focus 3 px accent at 2 px offset).
- **No second palette:** `site.css`'s token block (`--paper`, `--ink`, `--blue`, `--orange` and the rest) is deleted;
  every rule that used one of them uses the `--lb-*` name directly (one mechanical pass, then the old names are gone).
  The orange mark and the dust go: the spec allows no colour beyond its tokens and no texture.
- **The widget on the site** (the demo stage, and later a live embed) gets the same values through its documented
  variables, set once in `tokens.css` on `linkbot-embed`: `--linkbot-accent: var(--lb-accent)`,
  `--linkbot-text: var(--lb-ink)`, `--linkbot-muted: var(--lb-slate)`, `--linkbot-line: var(--lb-line)`,
  `--linkbot-surface: var(--lb-surface)`, `--linkbot-radius: 12px` (Connect's `docs/reference/embed.md`, "Design").
- **Shared with the widget:** Connect owns the spec's implementation in `packages/embed`. When it has its own token
  file, the site's `tokens.css` is brought in line with it value for value and names the source commit in its header;
  until then it is written from the spec's §5. A cheap test (`tests/tokens.test.mjs`) checks that `tokens.css` holds
  exactly the spec's values and that no other stylesheet in `src/` writes a hex colour.
- **Type:** Schibsted Grotesk 400, 500, 600, 700, self-hosted as WOFF2 under `public/fonts/schibsted-grotesk/` with its
  SIL OFL 1.1 licence, subset for the five languages as the current fonts are; nothing loaded from Google or any third
  party (`tests/contact.test.mjs` keeps refusing foreign hosts). Fallback `system-ui, sans-serif`; numerals
  `tabular-nums`. It replaces LB Display Sans and Atkinson Hyperlegible Next, whose files go. The share images and the
  one-page PDF draw with the same font files (`src/integrations/share-images.ts`, `src/lib/sheet-pdf.ts`); a character
  Schibsted lacks (subscript digits, arrows) is checked when the subset is cut, and the PDF build stops on a missing
  glyph as it does today.
- **Light only:** the spec has no dark tokens, so the site has none; `?theme=dark` and the dark values go.

## 4. Order of work after the approval

Each step one PR into `build/vision`, gates as `CLAUDE.md` says.
1. Renew the status first. On 2026-10-28 at 21:23 UTC staging's `/health` reports contract 0.2.18 and widget
   `0.5.1-v1`; the site's status sentences still name 0.2.16 and 0.5.0-v1 (checked 2026-10-26). Without this the
   landing page's section 1.6 would start untrue.
2. `tokens.css` and the font, the old palette and fonts removed, every page restyled (no copy change).
3. The new home, sections 1.1 to 1.6, five languages, truth-check rows dated.
4. `/demo`'s role switch; the re-recording waits for Connect's widget in the new design.

## 5. Decisions for the owner

1. Approve this page plan (the six sections, their messages and calls to action).
2. Remove the brand board, the variant switcher and the A8 stylesheets, which the spec replaces.
3. Remove the review switches and the parts they switch (Venn, quotation-mark logo, F-I21 icon choice, reaching arm,
   dark scheme). The site is then light only, as the spec is.
4. Keep `/verticals` as a page linked from `/for-platforms` and the footer, not from the home.
