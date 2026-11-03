# Front-page preview B: "Say what you need. See what Linkbot asks back."

Branch `vision/front-b-ask`, from `build/vision` at `cc8fe9b` (2026-10-24). A preview for the owner's pick (GEO-188: three
directions, previews only, nothing merged). English only; `/de`, `/es`, `/it` and `/fr` keep the catalogue's home until a
direction is picked and its words are translated. The page: `src/components/front/Front.astro` with
`src/components/front/Question.astro`; the words: `src/front/b-copy.ts`; the questions: `src/front/b-pack.ts`; the behaviour:
`src/front/ask.ts`; the ground in light and dark: `src/front/theme.css`.

## The idea, in two sentences

The page is the first minute of using Linkbot, played honestly: you write a need in one line and the page answers with the
questions a pack asks back, keeps your line as written, and shows what a confirm would store. The surprise is the inversion:
you expect to be read, and you are asked.

## Why a platform operator would want to plug Linkbot in

They feel the discipline their users would get on their own pages: nothing pre-selected, no nearest-option guessing, "don't
know" and "any" as real answers, a number two conventions read differently refused with a question. That is the trust story a
B2B platform needs before it lets a third party near its users, told by the form itself rather than by a claim.

## What makes it memorable a day later

Typing "25.000" and being asked "Is this 25 or 25,000?"; picking "Other / not listed" and reading that your words are kept as
you wrote them; the record beside the questions filling with sources and importances instead of a score.

## What is taken from which sites, and why

- **Raycast and Arc (input-first pages):** the product's own field as the hero, in the page's first second; the page is used
  before it is read.
- **Linear (settings and forms):** numbered, calm questions; pill answers that are real controls; one accent for focus.
- **Stripe (the "what is stored" side panel of its docs):** a plain record beside the thing you edit, so cause and effect
  sit on one screen.
- **GOV.UK (one thing per page, honest validation):** error text that asks a question in plain words, next to the field.

## The canvas, challenged

- **No Venn hero, no WebGL.** The hero is a field; the only motion is the result unfolding, and under reduced motion nothing
  moves at all.
- **Archivo at 600 and 112 % width** for the headline, Figtree for everything else; no serif on this direction.
- **#F4F4F1 / #2346D0 / #FF7A1A:** the paper, the blue for focus and the question numbers, the orange only where the form
  refuses to guess (the ambiguous number, the kept words), in its text-safe cut. The pink primary of A8 is not on this page.
- **The eye logo:** not used; the wordmark only.

## The reaching action

"Ask me" is a submit button that reaches for the pointer (`src/components/front/Reach.astro`): decoration, aria-hidden, no
pointer events, fine pointers with motion allowed only. The form works without it, and without scripts the questions stand
on the page.

## True today

- The text path is in the contract and off until a reading policy is approved, so the page reads nothing into answers and says
  so where the line is echoed. What runs on the staging space is the form, generated from the pack.
- The questions are the Connect lane's sample pack for industrial minerals (synthetic, "not Geoprocure's pack"), with the
  widget's own words for the special answers and the importances, and the shape of Connect ADR 0004: required criteria first,
  the rest behind "More details", nothing pre-selected, a suggested importance marked as such.
- The ambiguous-number question is ADR 0004's rule and the widget's own line. The show-when of the phosphate criteria is the
  pack's.
- Nothing is sent and nothing is stored, not even for the tab (checked in the browser: no request leaves, sessionStorage and
  localStorage stay empty). The English privacy fact that said "no form" now says that the fields on the home page work in the
  browser only; the four other languages keep "no form", true for their own home.
- Every sentence has a row in `docs/truth-check.md` under "Front-page preview B". The sample build is not used.

## Light and dark, phone, access

As in the shared ground (`src/front/theme.css`, `?theme=dark` for the preview). The questions are real inputs: every pill is a
native radio or checkbox that fills its pill, so the target is the pill and the keyboard, the screen reader and the form see
plain controls. Checks: `npm run typecheck`, `npm test` (the front's words scanned), `npm run build`, `npm run test:browser`.
