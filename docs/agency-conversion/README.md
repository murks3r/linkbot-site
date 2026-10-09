# Agency conversion work (parallel track)

Scope: the `/for-agencies` acquisition experience on `murks3r/linkbot-site`.
Branch: `parallel/agency-conversion-v1`, stacked on `velocity/agency-acquisition`
(PR #1 head `b5883004d6513b02acd43fb032bf1d3bd30418e0`).

This directory documents the honesty, conversion and QA pass performed on top of
PR #1. The original implementation notes from PR #1 remain in
[`docs/agency-acquisition.md`](../agency-acquisition.md) and are not modified.

## Contents

| File | Purpose |
| --- | --- |
| [`conversion-hypothesis.md`](conversion-hypothesis.md) | Before/after conversion hypotheses, the claims register and the experiment plan. |
| [`launch-blockers.md`](launch-blockers.md) | What is still missing before this page can be treated as a production acquisition surface. |
| [`enquiry-backend-proposal.md`](enquiry-backend-proposal.md) | Design-only proposal for a real enquiry pipeline. **Not implemented, not authorised.** |
| [`qa-evidence.md`](qa-evidence.md) | Exactly what was executed and what it proved. |

## Authorised write surface

Only these paths were touched:

- `src/pages/for-agencies.astro`
- `src/components/agency/**` (including the new `enquiry.ts` module)
- `src/lib/agency-demo.ts`
- `tests/agency-*`
- `docs/agency-conversion/**`

Untouched: global styles (`src/styles/global.css`), the homepage
(`src/pages/index.astro`), `src/components/SEO.astro` (called with props only),
`src/layouts/BaseLayout.astro`, the main Linkbot application, any `.github`
workflow, and PR #1's own branch.

## What this pass changed

1. **Demo labelling.** The navigation item and section are now "Interactive
   example"; the workspace badge reads "Interactive example · synthetic data";
   a persistent banner states that every mandate, profile, evidence statement
   and ranking is written for the page, that there is no live matching engine
   and that no data leaves the browser. The hero diagram is labelled
   "ILLUSTRATION … Diagram, not a screenshot".
2. **Workflow explanation.** Five numbered steps (interpret → verify → review →
   confirm → introduce) plus an explicit "Who does what" split between Linkbot,
   the agency's recruiters and the candidate. The interactive workspace now has a
   dedicated `05 / Recruiter review` stage that groups the pool into required
   criteria met / needs verification / not eligible, with each exclusion reason
   attached.
3. **Fail-closed demonstration.** A fourth example mandate (Staff Security
   Engineer) has a deliberately thin pool where no profile meets every hard
   requirement. The workspace shows zero eligible profiles and explains that the
   bar is not lowered to produce a list.
4. **Claims removed.** "Better shortlists", "Live demo", "Find evidence, not just
   keywords" and similar comparative/superiority framings are gone. The ranking
   is described as a fixed rule written for the page, not a score or a claim
   about matching quality. A browser test asserts that a banned-phrase list never
   reappears.
5. **CTA hierarchy.** The pilot enquiry is the single primary action (navigation,
   hero, post-demo band). The interactive example is secondary. A new CTA band
   closes the demo section, which previously dead-ended.
6. **Keyboard and screen-reader access.** Mandate selection is a `radiogroup`
   with roving tabindex and arrow/Home/End keys; the candidate-side preview moves
   focus into the opened region and returns it to the trigger on close; shortlist
   changes are announced through a polite live region; disabled shortlist buttons
   are described by the visible reason.
7. **Enquiry honesty.** Draft construction moved into the testable
   `src/components/agency/enquiry.ts` module. Validation errors are now visible
   and focused instead of silently ignored; the prepared state says explicitly
   that nothing was received or submitted, offers "open the draft again",
   "copy the message text", a plain-text review of the exact draft, and a direct
   mailbox fallback. A browser test asserts that a whole run produces exactly one
   `mailto:` handoff and no other outbound request.
8. **Mobile.** Minimum 40px tap targets for every interactive control inside the
   workspace and 44px for the primary CTAs and the submit button; no horizontal
   overflow at 375px.
