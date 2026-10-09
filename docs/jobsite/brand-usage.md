# Brand usage — Direction A "Notarial", as a *proposed* talent-facing direction

**Status: PROPOSED, NOT APPROVED.** Nothing here is Linkbot's accepted identity,
and this branch does not rebrand anything.

## Governance, honoured

The Brand OS states that no runtime file may consume the Notarial direction
while it is unapproved (`linkbot-brand/02-directions/PROPOSED.md`). This jobsite
respects that boundary in a specific, checkable way:

- The token file `linkbot-brand/10-tokens/A-notarial.tokens.css` is **not
  imported**. Its values are vendored into `src/jobsite/jobsite.css` with the
  names kept aligned (`--lb-a-*` primitives, `--lb-*` semantic), so that
  importing the real token file is a deletion, not a rewrite, once approved.
- Every rule in that stylesheet is scoped to `.lbj`. There is no `:root` change,
  no edit to `src/styles/global.css`, and no change to `tailwind.config.mjs`.
  Token scope = the jobsite subtree, so the marketing home and the agency page
  are byte-for-byte untouched by this direction.
- The page itself says so, in the notice bar, on every jobsite route:
  *"Proposed direction — Notarial (not approved)"*. A reviewer cannot mistake
  the preview for an approved rebrand.
- The mark is the Notarial octagon with an inscribed square and core, drawn from
  the Brand OS geometry (`04-logo/A-notarial/mark.svg`), rendered from shared
  path data (`src/jobsite/ui/glyphs.ts`) rather than copied as a static file, so
  it stays `currentColor` and cannot drift from the source geometry.

## Register: Workspace mode, applied to talent

The direction defines two modes. Job *discovery* is talent-facing, and the brief
asks for an exceptionally clean, dense, scannable list, so most of the surface
uses **Workspace mode** — with Record mode's paper ground carrying the frame.

| Mode | Where it is used here |
| --- | --- |
| Workspace (product discipline) | the filter rail, result cards, marks, pagination, the saved list: monochrome ground, 1px rules instead of shadows, radii of 0–4px, uppercase mono labels, tabular figures |
| Record (editorial) | the page frame: paper ground, seal accent, a Fraunces headline at ≥24px, one rule per section instead of containers |

## The rules that were followed, and why they matter to the product

- **Fraunces display only, never below 24px.** Body and UI text is Inter at
  ≥16px; labels, dates, counts and figures are JetBrains Mono with
  `font-variant-numeric: tabular-nums`, so a column of salaries lines up.
- **Colour is never the only carrier of meaning.** Every state is colour +
  glyph + word: `active` is a solid square, `withdrawn`/`expired` a dot,
  `unknown` a hollow ring, and the word is always present in uppercase mono.
- **Unknown is the quietest state, not a blank.** It is rendered with the ring
  glyph and the words "… unknown" / "… not stated" in the muted slate token —
  never a dash, a zero or an empty gap. This is the design expression of the
  product rule that `null`, `false` and `0` must stay distinguishable.
- **No shadows, no hover lift, no pill radius, no padlock/shield-verification
  badges, no score, no counter.** Structure does the separating. The one
  dashed border in the system marks something *proposed* rather than confirmed —
  used for the direction chip and for an unknown status mark.
- **Muted text is a token, not an opacity.** `--lb-text-muted` is the computed
  6:1 value, so the accessibility defect the audit found in the incumbent
  surface cannot reappear by accident.

## One deliberate divergence, stated

The Brand OS requires self-hosted OFL fonts (no remote font request). This
jobsite still loads Fraunces / Inter / JetBrains Mono from the same Google Fonts
stylesheet the existing site already uses, because self-hosting is a
site-wide decision that belongs with the direction's approval, not with an
unapproved preview branch. It is listed as a follow-up in `qa-evidence.md`.

## If the direction is rejected

Nothing structural needs undoing: the stylesheet is one file behind one class,
the glyph set is one object, and no other surface consumes either. Replacing
`jobsite.css` with the accepted token file is the whole change.
