# Front-page preview C: "Who sees what, and when."

Branch `vision/front-c-stages`, from `build/vision` at `cc8fe9b` (2026-10-24). A preview for the owner's pick (GEO-188: three
directions, previews only, nothing merged). English only; `/de`, `/es`, `/it` and `/fr` keep the catalogue's home until a
direction is picked and its words are translated. The page: `src/components/front/Front.astro`; the words:
`src/front/c-copy.ts`; the offer by stage: `src/front/c-stages.ts`; the ground in light and dark: `src/front/theme.css`; the
headline face: Source Serif 4, self-hosted (`@fontsource-variable/source-serif-4`).

## The idea, in two sentences

The page is organised around the one question a platform's lawyer, operator and user all ask before they let a third party
near their market: who sees what, and when. One synthetic offer travels through the four stages of its pack, and the page
shows what each stage shows and what it withholds, down to the receipt that bounds every later read.

## Why a platform operator would want to plug Linkbot in

Because the diligence questions are answered before they are asked: a space is its own instance and nothing leaves it; the
board never shows who posted; a possible fit shows verdicts, no name and no sign of the other side's answer; the introduction
goes to the platform's team in operator mode; identity details stay with the team and every access is recorded; deletion is
explicit about what goes and what stays. The platform keeps its pages, its keys and its team.

## What makes it memorable a day later

A quantity turning into a band of 5,000 t as it reaches the board; the eyes closing stage by stage; the receipt, set like a
receipt, that lists field keys and times and never values.

## What is taken from which sites, and why

- **Stripe and Plaid (trust and privacy pages):** disclosure explained as a sequence of concrete states, not as adjectives.
- **The Browser Company and Teenage Engineering (editorial type):** a serif headline that reads as a sentence, generous
  measure, one idea per screen.
- **Apple (privacy pages):** one object per stage, large and plain, and the hidden things named as plainly as the shown.
- **GOV.UK (receipts and records):** a receipt is a list of what happened, in order, in the small size.

## The canvas, challenged

- **Source Serif 4** for the headlines, as the canvas suggests, with Figtree for everything else; the serif is self-hosted
  and reads in light and dark.
- **The eye:** used as a drawn glyph of visibility beside each stage (three eyes wide open on the board, one half-closed for
  the team), in the same ink line as the reaching arm; not as a logo. The brand mark stays the owner's decision.
- **No Venn hero, no WebGL.** The hero is the question; the stages are a table of four columns under one rule.
- **#F4F4F1 / #2346D0 / #FF7A1A:** the paper, the blue for "who sees it" and "meets", the orange ink for "not at this stage"
  and "conflicts". The pink primary of A8 is not on this page.

## The reaching action

The primary action reaches for the pointer (`src/components/front/Reach.astro`): decoration, aria-hidden, no pointer events,
fine pointers with motion allowed only. The link works without it.

## True today

Every sentence has a row in `docs/truth-check.md` under "Front-page preview C". The offer's values are synthetic and fixed
(`src/front/c-stages.ts`), in the vocabulary of the Connect lane's synthetic sample pack; the stage of each criterion and the
board's coarsening of the quantity are that pack's; what each stage shows is the Space API contract's (the disclosure stages,
the board, the match, the introduction modes, the receipt and its reads). Nothing is matched or introduced on the page and the
caption says so. The sample build is not used.

## Light and dark, phone, access

As in the shared ground (`src/front/theme.css`, `?theme=dark` for the preview). The four stages stack to two columns and then
one; the receipt keeps its width. Nothing moves under reduced motion. Checks: `npm run typecheck`, `npm test` (the front's words
scanned), `npm run build`, `npm run test:browser`.
