# Front-page preview A: "Watch a need meet an offer"

Branch `vision/front-a-verdict`, from `build/vision` at `cc8fe9b` (2026-10-24). A preview for the owner's pick (GEO-188: three
directions, previews only, nothing merged). English only; `/de`, `/es`, `/it` and `/fr` keep the catalogue's home until a
direction is picked and its words are translated. The page: `src/components/front/Front.astro`; the words:
`src/front/a-copy.ts`; the pair: `src/front/a-match.ts`; the ground in light and dark: `src/front/theme.css`.

## The idea, in two sentences

Instead of describing matching, the page plays one synthetic pair from the first criterion to the server's introduction: a
ledger that fills in verdict by verdict, then the gate, the approval, both yes and the receipt. Everything on it is fixed
text written for the page, and the page says so three times.

## Why a platform operator would want to plug Linkbot in

They see, on the first screen, exactly the artefacts their users and their team will see: a verdict per criterion with the
rule that decided it, soft criteria that only show, "unknown" that is never a fit, a gate a named person records, an approval
that discloses nothing, both yes, a receipt. Nothing is hidden behind a score or a promise. The snippet further down shows
the whole integration is one script and one element.

## What makes it memorable a day later

The verdict ledger filling in like a typewriter, and the two moments the product refuses something: the dashed square that
stays "unknown" because the offer did not state packaging, and the stitch between the two sides that is drawn only after
both have said yes.

## What is taken from which sites, and why

- **Stripe (docs and pricing pages):** show the artefact, not an illustration of it; tabular precision, hairlines, numerals
  that line up. The ledger is set like a Stripe table, not like a hero graphic.
- **Linear (homepage):** one filled action, large type at its heaviest weight, everything else in two inks; motion that
  reveals content in place instead of moving it around.
- **Vercel (deploy sequences):** a process shown as a short, legible sequence with a visible "done" state and a replay.
- **Teenage Engineering (manuals):** the page reads as a document a careful person wrote; the caption names what is
  synthetic before anything else.

## The canvas, challenged

- **No Venn hero.** Two overlapping circles say "the overlap is the match". Linkbot's matching is a verdict per criterion and
  no score, so the picture would promise a quantity the product refuses to compute. The pair is shown as a ledger instead.
- **No WebGL atmosphere.** A8's living light moved on its own and cost idle CPU for no meaning; the ground is paper in the
  light and near-black in the dark, and the only thing that moves is the content being revealed.
- **Archivo 900** for the headline, as the canvas suggests; Figtree for everything else; no serif on this direction.
- **#F4F4F1 / #2346D0 / #FF7A1A:** kept as the ground, the "meets" colour and the "conflicts" colour, the orange cut to
  #a84a08 where it is text (5.2:1 on the paper; the full orange is 2.4:1 and reads only in marks). The pink primary of A8 is
  not on this page: the one filled action is ink on paper, paper on ink in the dark.
- **The eye logo:** not used here; the brand mark is the owner's decision, and this direction carries the wordmark only.

## The reaching action

The primary action reaches for the pointer (`src/components/front/Reach.astro`, the owner's reference of 2026-10-24): an
ink-drawn arm grows out of the button towards a pointer within 240 px, its hand follows and closes a little as the cursor
comes near, and it withdraws when the pointer leaves. It is decoration: aria-hidden, no pointer events, no layout, drawn only
for a fine pointer with motion allowed, one animation frame at a time while a pointer is near. The link works without it.

## True today

Every sentence has a row in `docs/truth-check.md` under "Front-page preview A". The pair's values are synthetic and fixed
(`src/front/a-match.ts`), in the vocabulary of the Connect lane's sample pack, which is itself synthetic; each verdict
follows the rule the Space API contract names for its control. The page matches nothing and says so in the ledger's
caption, in "Where it stands" and in the legend. The sample build is not used.

## Light and dark, phone, access

`src/front/theme.css` defines the front's tokens once with `light-dark()`; the system's scheme decides, and the preview
accepts `?theme=dark` or `?theme=light`. Only the home carries the dark tokens (`body[data-front]`); the other pages keep
A8's light look until a direction is picked. The ledger is a table of ARIA rows that stacks on phones; nothing moves under
reduced motion and the complete figure stands without scripts. Checks: `npm run typecheck`, `npm test`
(`tests/front.test.mjs` scans the front's words with the catalogue's rules), `npm run build`, and the browser acceptance
(`npm run test:browser`, the app's WCAG audit on every page in five languages).
