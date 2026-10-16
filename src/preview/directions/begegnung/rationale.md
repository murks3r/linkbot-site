<!-- Copied for the A9 comparison overview (/__preview/directions) from ~/Desktop/linkbot-design-evidence/concept-a9/w4/rationale.md
     on 2026-10-16, verbatim except: its title line is dropped (the overview's card names it) and its
     section headings are one level lower; one bracketed integration note marks the claims correction (b). -->

### Why this metaphor tells "matching built on privacy"

Most privacy pictures show a barrier: a lock, a shield, a vault. Linkbot's idea is not a barrier but an order of
events: you are compared before you are known, you are known only after you act, and only as far as you choose. An
encounter is the everyday scene with exactly that order. Two people can be in one room, something can fit, and
neither knows the other's name; a handshake is the moment it becomes personal, and it takes your own hand.

So the home tells it with a person and objects, not with listings: you stand veiled in your own place with your words
as lanterns, and a role stands far off as an empty chair (S1); a company's open hand comes to the role and waits, and
only then do the lanterns light where the listing states your words, the unstated one stays open, and the hand does
not stir (S2); it never reaches first, only your hand takes it (S3); you raise your own hand to the veil and draw it
off, and only then does colour bloom on what you put on, while the sweater you kept stays folded (S4); you draw the veil
back, the thin line of access to the other hand is cut, and the hand draws back keeping what it was given (S5). The
pictures guard against the claims we must not make: the veil hides you from employers, and the words say exactly
that; a fit never summons the company (its hand is there before any lantern lights); the handshake, the unveiling and
the revoking of an introduction carry "In development, not live" in the scene, and a label stands in the picture
throughout; nothing handed over comes back; the open questions (your data only on your side, where the conversation
continues, deleting your account and your data [integration note: this phrase follows the claims correction of S5.6; the rationale’s original wording is in its evidence folder]) are drawn and written as questions.

### Why painterly, and why the colour blooms

The founder asked for a white-grey ground with colour only where the story needs it. In watercolour that is
literally how the medium works: an unpainted pencil figure is "not yet anyone", and paint blooming into it is someone
arriving. Colour is the statement, not decoration: first warm light in two lanterns, then pink exactly where two hands
meet, then the person; the page's own atmosphere follows (W1's `--air-reveal`, capped at .55). The paper grain under
the page and the granulation of the paint are one material, so the drawing belongs to the page.

### What it does for the brand

- **Warmth without sweetness.** Linkbot's voice is plain and exact; a small, quiet figure gives it a face and adds no promise.
- **The palette gets meaning.** Pink, already the action colour, becomes your yes; green and dawn are you when you
  choose to be seen; the company is a forest-green sleeve.
- **One character for the whole product.** The same figure greets you in Search Jobs (built: the S1 picture at the
  start, static, under the app's strict CSP) and could mark empty states, the privacy page or onboarding: a mascot
  without a logo symbol, because it is a person.
- **Distinct:** none of the job-site clichés (cards, magnifiers), the security clichés (padlocks, shields) or the SaaS
  ones (orbs, feature grids).

### What it costs to build and maintain

- **Built in one working session** on W1's checkpoint, then corrected in a second after independent verification (the
  order in S2–S3, the lift as a gesture, S5's label), on W1's part-2 heads: drawing and bake pipeline, the story (one
  choreography file drives the pinned stage, the vignettes, reduced motion, no-script pictures and the fallback), the
  app moment, checks.
- **Bytes:** 38 baked layers, 210 KB on a phone (1×), 389 KB on a dense wide screen (1.5×), all loaded after the largest
  paint; A8's story image was 82 KB. Home LCP on the deployed previews below A8's (mobile 868 vs 1328 ms, desktop 412 vs
  560 ms, 3 runs, indicative); idle cost and scroll frames were within A8's range in round 1 (not re-measured).
- **Upkeep:** a character must stay consistent (pose, proportions, palette); every new use is drawing work. The SVG
  source plus `bake.mjs` is the single truth: change the drawing, rebake (≈ 70 s), and the page follows; change the
  timing in `scene.ts`, and pinned, vignette, reduced-motion and fallback states follow together.
- **Engines:** continuous motion needs CSS scroll timelines (Chromium, Safari 26); elsewhere the stage steps between the
  finished pictures. The statement is the same.

### Risks

- **Claim pressure.** The two strongest pictures, the handshake and the unveiling, show features that are in
  development (and whose engine failed an independent audit on exactly these guards). They carry their labels now; if
  private matching slips, S3 and S4 keep their labels longer and may need a softer title.
- **Misreadings:** a ghost under a sheet, romance (encounter, clasp, pink), the veil as a religious or bridal garment,
  skin tone. Each is answered in the drawing (paint not cloth, a sleeve not a person, an abstract bloom, the palette's
  dawn); S5's arm is now drawn in its sleeve, but the glazed figure can still read as a ghost, and a fresh-eyes review
  (not available to me in this round) should confirm the rest.
- **The lift is a sketch-level gesture:** a straight arm turning about the shoulder, foreshortened on the way, with the
  veil following its hand; it reads as an act, but a hand-drawn sequence would be more graceful.
- **Softness on phones:** the 1× set is slightly soft on 3× screens; a 1.5× phone set would cost about +190 KB.

**In one sentence:** you are compared before you are known, known only when you act, and only as far as you choose;
an encounter shows that order, and watercolour lets a person's colour arrive at exactly that moment.
