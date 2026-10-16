<!-- Copied for the A9 comparison overview (/__preview/directions) from ~/Desktop/linkbot-design-evidence/concept-a9/w5/rationale.md
     on 2026-10-16, verbatim except: its title line is dropped (the overview's card names it) and its
     section headings are one level lower. -->

**In one line.** A fit is a matter of shape, not of who you are. Your words shape your piece, a company's
role is an opening, Linkbot compares the shapes, and only you move the piece, turn it over, or stop access.

### Why this metaphor tells "matching built on privacy"

Most privacy pictures show a barrier: a lock, a vault, a veil. They say "kept away" but not "found".
Linkbot's claim needs both halves at once: a fit can be found, and employers aren't told you're looking.
A jigsaw piece carries both halves.

- **Shape is the fit, the picture is the person.** A piece fits by its outline alone, so the fit is found
  while the piece lies picture side down: "Compared with your words, not with you" (S2.1). The picture
  names who compares ("Linkbot compares your words with the listing"), so it never claims a blind or
  anonymous evaluator (S2.3, S2.5).
- **The role is an opening.** It is a job opening in the literal sense. The company's side is in place first
  (its role), and nothing crosses until the person's own tag, "Your yes", appears. The interlocking edge is
  the handshake as an object; the word is never used (S3.7).
- **Turning it over is consent made visible.** Colour (glaze) appears only on the side the person turns
  over, by their own act ("You add what you choose"), and only where it was dipped (S4.5).
- **Going back works from now on.** In S5 the piece never leaves the company's opening. The person cuts the
  thread on their own side, the line beyond the cut is gone, and the piece turns matte. A faint print of
  what was already seen stays: nothing comes back. Because the drawn act revokes an introduction to a
  company's role, it carries "In development, not live" (S5.5); the tested revoking of a rule or access
  (S5.3) is a plate beside it, not the picture.
- **An opening, not a puzzle to finish.** The company's board is a porcelain slab with one opening, cut
  only to the edges the listing states. The edge it doesn't state (on-call) has no socket at all, only an
  open bay with a dashed rim, wider and deeper than any tab, so even seated, your piece's tab touches
  nothing there: the unknown is never drawn as met. There is no jigsaw grid around the opening (it made
  the seated piece read as "the missing piece"), and the company's answer is an empty place with a "?".
  Each open question (data only on your side, the conversation, deletion) is an unmade piece with its
  question as text.

### Why this style (bisque and glaze)

- **It fits the new ground.** The objects are matte white porcelain on the white-grey grain, modelled only by
  light and shadow, with no outlines. Smooth on grain makes them tactile, and the page stays calm.
- **The material carries the meaning.** Unglazed means private. Glaze, which brings colour and gloss, means
  chosen and shown. The page's own colour reveal is capped (S4 at 0.35), so the glaze stays the strongest
  colour on screen.
- **Warmth without cliché.** The charm is in the craft: a dish with uneven, hand-thrown sides and throwing
  rings, a slow glint on the glaze, a pink thread, and the cut made by the person's hand. There are no
  faces, sparkles or bounce, and none of the puzzle phrases.
- **It differs from W2–W4.** There are no contour lines (W2), no paper or collage (W3) and no paint (W4).

### What it does for the brand

It **explains, and it reassures**: this is the one direction whose central object shows *how* matching works
without exposure. That serves recruiting first, because candidates and companies read the same picture.
Its vocabulary is small and extends to the rest of the product: piece, opening, dish, thread, glaze, unmade
piece. It already continues in Search Jobs, where a blank piece in your dish takes its edges as the desk
reads your words.

### What it costs to build and maintain

- **Built:** about 950 lines with comments, in one folder. A build-time SVG generator (no drawing code
  ships), CSS keyframes on a scroll timeline, and a script of 1.5 KB minified (0.75 KB gzip) that decides
  "live or static" and drives the fallback. The app moment is 130 lines. There are no images, no new dependencies and no Lottie.
- **Weight and speed (measured, indicative):** the home's HTML is lighter than A8's (9.7 against 12.0 KB gzip). The 14
  porcelain SVG files add 10.7 KB gzip, loaded lazily (A8's story image alone was 82 KB). CSS + JS is 17.2 against 16.1 KB.
  LCP and CLS match A8, and scrolling holds 60 fps (p95 16.7 ms). The price is idle work: while a station rests in view
  about twice A8's main-thread time at CPU 4× (the verifier reproduced 82.7 against 40.9 ms/s), because the living
  atmosphere makes the browser re-composite the station's layers 30 times a second, and at the very top a little more than
  A8 too (ranges overlap). It is 0.2 under reduced motion. Drawing the objects as images already halved the excess; the
  close-phase figures and the next options are in the README.
- **Maintenance:** the compositions are coordinates in piece units, one table for wide screens and one for
  phones. A new station or a copy change means re-placing a few numbers and re-running
  `checks/puzzle_checks.cjs`, which checks overlap, end states, contrast and reversibility. That is
  precise work; it is not free.

### Risks

- **Over-reading.** Each picture can say more than its row allows: a travelling outline as "sent to the
  employer", a seated piece as "accepted" or as meeting an edge nobody stated, a cut thread as "recalled",
  a second piece in the dish as "my piece came back". The build designs each of these out (the last two
  only after the verification), and the checker's and the verifier's findings are mapped in the README.
  Any new frame needs the same review.
- **Status density.** S3–S5 carry several labels (tested, in development, not built), because what is drawn
  touches the private-matching draft, which is in development and failed its audit. That is honest, but
  heavier to read than the earlier stations.
- **Cliché.** A jigsaw is a common recruiting stock image. The board without a grid, the open bay, the
  open answer, the matte return and the absence of a "perfect fit" moment are the defence; a first-visitor
  read should still be asked about "missing piece" and "you're the one" directly.
- **Craft.** The porcelain shading is hand-tuned SVG. It needs care at new sizes; phones below a 40 px piece
  fall back to the static end states.
