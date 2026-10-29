---
type: note
title: Landing page in the widget design, page plan for the owner's approval
created: 2026-10-28
updated: 2026-10-29
tags:
  - front
  - design
  - plan
related:
  - '[[redesign-2026-10-24]]'
  - '[[truth-check]]'
---

# Landing page in the widget design: page plan

**State: a plan, waiting for the owner's approval. Nothing is built from it yet; the build starts after V1.** Written
2026-10-28 by the Site lane on `build/vision` at `c119b24`; revised 2026-10-29 at `bddbdef` with the owner's page
principles of 2026-10-29 (a visitor understands in three seconds what is offered and what to do).

## For the owner: the six sections in two or three lines each

1. **Opening.** One headline for the platform that visits ("Your platform connects buyers and sellers. Linkbot finds
   who fits."), one subline, one button into the demo. No second button, no paragraph under the headline.
2. **Three cards.** Intake, Watch, Introductions: one fact each that runs on the staging space today, a status label
   on the card, one button to that step of the demo. They replace the story, the proposal card and the reasons list.
3. **Demo stage.** The recorded walkthrough with the switch "As a buyer" / "As a supplier", one role at a time, three
   steps each; the fictional data is named on the stage. Unchanged from the first plan.
4. **Who sees what.** The stage list (board, match, introduction, operator) in the widget's progress style, one link
   to the full page. Unchanged from the first plan.
5. **For platforms.** The shortest embed snippet verbatim from Connect's docs, one button to `/for-platforms`.
6. **Bottom.** "Not your market yet? Tell us what you connect." with one button to `/request-a-demo`, under it the
   synthetic-data line and the status date; the old status section lives on as the cards' labels.

Across the site: no filter walls. Where a page lists things (`/verticals`, `/platforms`), one tab bar and one search
field; where a thing stands is a label on its card, never a filter.

**What it does.** It turns the home (`/`) into the landing page and carries the widget's design onto the whole site,
so that the site and the widget read as one product. The design source is the widget design spec v1 of 2026-10-28,
approved by the owner as the base (the workspace's `plan/design/linkbot-widget-design/DESIGN-SPEC.md`: tokens §5, type
Schibsted Grotesk, language §7). The frontend inventory of 2026-10-28 proposes this repository as the website's home.
Geoprocure's own product-page items (its grades and its list of origins) stay on geoprocure.com and are not copied
here.

**Rules that hold for every section.**
- Every sentence is true on the staging space on the day it is built, and has its row in `docs/truth-check.md`. The
  forbidden words stay forbidden (`tests/forbidden.mjs`). The spec's own word for principle 7 (a proposal that names
  neither side) is one of them, so the site says "verdicts, never who".
- No live widget on the site until a demo space exists (`CLAUDE.md`); the proof is the recorded walkthrough of the real
  widget. The static screens in the spec's `screens/` folder are design references, never shown as the product.
- "Linkbot Jobs" is a reference for the shell's second use only. It does not appear on any page.
- Five languages as today; German in the Sie form (it already is); sentence case, no capital-letter labels (§7: the
  `.eyebrow`'s `text-transform: uppercase` goes).
- One call to action per section; a second one only as a plain text link where a section says so.
- Status labels use the site's existing three states (`src/components/State.astro`, words in `site.status`): on the
  staging space, built but not on the staging space, not built. A label is set from the row it cites and dated with
  `STATUS_CHECKED`; it never filters anything.

## 1. The page, section by section

Each section: the core message (one sentence, the English source), the proof it shows, the call to action, and what it
replaces on today's home (`src/components/front/Front.astro`, sections 1 to 6).

### 1.1 Opening

- **Headline:** "Your platform connects buyers and sellers. Linkbot finds who fits."
  **Subline:** "Its widget asks each side what it needs; Linkbot shows a verdict for each criterion and introduces
  the two sides only after both say yes." Truth rows `home.lede`, `home.flow`, `platforms.embed`.
- **Proof:** none beyond the two lines; the demo is one click away. The ask line of today's home (answered in the
  browser, the synthetic sample pack) moves to the intake card's step on `/demo` or goes; it does not stay above the
  fold.
- **Call to action:** one main button into the demo, `/demo#path`. Its label is "Try it" only once `/demo` holds a live
  widget on a demo space; until then it says what it does: "See it step by step" (the recorded walkthrough cannot be
  tried). Decision 5.
- **Replaces:** section 1 (B hero with the Venn, the text button and the lede). The Venn and its pause control go.

### 1.2 Three cards: Intake, Watch, Introductions

Three cards side by side (stacked on a phone), each with a name, one fact, a status label and one button. No story, no
figure.

| Card | The one fact (English source) | Truth rows | Label today | Button |
| -- | -- | -- | -- | -- |
| Intake | "Each side describes its need or offer in the pack's form or in one line; nothing is stored until it confirms." | `how.describe (form)`, `how.describe (text)`, `how.confirm`, `home.rules` | on the staging space | "See the request" → `/demo#step-1` |
| Watch | "If nothing fits yet, a watch keeps the request open and tells only its owner when something new fits." | `how.describe (watch)` | on the staging space; the card's small print says its email goes to a test mailbox there | "See a watch" → `/demo#watch` |
| Introductions | "Two sides are introduced only after a named operator approves and both say yes." | `how.approval`, `how.yes`, `how.introduction, how.sees` | on the staging space (operator mode) | "See the introduction" → `/demo#step-6` |

- The anchors `#step-1` to `#step-6` and `#watch` do not exist on `/demo` yet; the build adds them with the role switch
  (step 4 of the order of work).
- **Replaces:** section 2 (Story and the folded Ledger; the Ledger moves to `/how-it-works`), section 3 ("Why it asks
  instead of guessing") and the first plan's proposal card. The verdict per criterion is shown on the demo stage and
  on `/how-it-works#matching`, not as a fourth card.

### 1.3 Demo stage: two roles, one after the other

- **Message:** "A request and an offer are introduced only after a named operator approves and both sides say yes."
  Truth rows `home.flow`, `how.approval`, `how.yes`.
- **Proof:** the recorded walkthrough that `/demo` shows today (`public/material/demo/<lang>/`, recorded from Connect's
  demo stage with synthetic data), with the switch the spec's §9 asks for on top: "As a buyer" / "As a supplier", one
  role at a time, never side by side. Three steps per role on the landing page; the full six steps and the watch stay
  on `/demo`. The stage says it shows fictional data (truth row `site.synthetic`). The pictures are re-recorded once
  the widget itself carries the spec's design (Connect's work in `packages/embed`); until then they show the widget as
  staging serves it, and the stage frame around them is the only part in the new design.
- **Call to action:** "Walk through all six steps" → `/demo`.
- **Replaces:** nothing on today's home; new as a section (today it is a link).

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
  built yet). Its label: on the staging space (the instance serves the widget from a pinned release, row
  `how.today (now)`); the packages are not published (row `how.today (later)`), said in one line under the snippet.
- **Call to action:** "For platforms" → `/for-platforms`; "For developers" → `/developers` only as a plain text link.
- **Replaces:** section 5 (the two cards). The verticals card goes; `/verticals` stays, linked from `/for-platforms`
  and the footer.

### 1.6 Bottom call to action

- **Message:** "Not your market yet? Tell us what you connect." Truth rows `verticals.first`, `verticals.next` (one
  market's pack today, a second planned), `site.synthetic`.
- **Proof:** none; under the button one line: everything on the page runs on Geoprocure's synthetic staging space,
  checked on the `STATUS_CHECKED` date, and a plain text link "The full status" → `/status`.
- **Call to action:** one button → `/request-a-demo`. That page says how to reach Linkbot (`CONTACT_EMAIL` in
  `src/lib/contact.ts`), which is "being prepared" until the owner names the mailbox; until then the button's line
  says so in words rather than promising a reply. Decision 6.
- **Replaces:** section 6. Its status list goes; where each part stands is now the label on the cards (§1.2, §1.5).

Header and footer keep their links and the legal column as today.

## 2. Pages: replaced, kept, removed

| Page | After the plan |
| -- | -- |
| `/` | replaced by section 1 above |
| `/demo` | kept; gets the role switch (§9), an anchor per step (`#step-1` to `#step-6`) and `#watch` for the cards' buttons, and the new tokens; steps and pictures unchanged until re-recorded |
| `/how-it-works` | kept; takes the Ledger (the full synthetic pair) from the home |
| `/verticals`, `/platforms` | kept; each list becomes one tab bar plus one search field (packs on `/verticals`, the six integration pages on `/platforms`), each entry a card with its status label; no filter by status, no filter wall (decision 7) |
| `/who-sees-what`, `/for-platforms`, `/developers`, the six `/platforms/*` pages | kept, restyled by the tokens only |
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
1. Renew the status first. On 2026-10-29 at 12:17 UTC staging's `/health` reports contract 0.2.18 and widget
   `0.5.1-v1` (as on 2026-10-28); the site's status sentences still name 0.2.16 and 0.5.0-v1 (checked 2026-10-26).
   Without this the cards' labels and section 1.6 would start untrue.
2. `tokens.css` and the font, the old palette and fonts removed, every page restyled (no copy change).
3. The new home, sections 1.1 to 1.6, five languages, truth-check rows dated.
4. `/demo`'s role switch and its step anchors (the cards' buttons point at them); the re-recording waits for Connect's
   widget in the new design.
5. The tab bar and search field on `/verticals` and `/platforms`, status as labels on the cards.

## 5. Decisions for the owner

1. Approve this page plan (the six sections in the order of 2026-10-29, their messages and calls to action).
2. Remove the brand board, the variant switcher and the A8 stylesheets, which the spec replaces.
3. Remove the review switches and the parts they switch (Venn, quotation-mark logo, F-I21 icon choice, reaching arm,
   dark scheme). The site is then light only, as the spec is.
4. Keep `/verticals` as a page linked from `/for-platforms` and the footer, not from the home.
5. The opening's button says "See it step by step" until `/demo` holds a live widget on a demo space, then "Try it".
   Recommendation: yes; a recorded walkthrough cannot be tried, and the site says nothing that is not true today.
6. The bottom's "Tell us what you connect" needs a mailbox Linkbot owns. Until the owner names it, `/request-a-demo`
   says the address is being prepared. Recommendation: ship the section with that line rather than leave it out.
7. Search field on `/verticals` and `/platforms`: with one pack and six integration pages, the tab bar alone shows
   everything. Recommendation: build the search field with the tab bar as asked, a plain filter on the entries' names
   in the browser, so it is in place when the lists grow.
