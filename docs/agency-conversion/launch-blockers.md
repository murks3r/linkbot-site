# Remaining launch blockers

Status of `/for-agencies` after this pass: an honest, tested *demonstration* page.
It is not yet a production acquisition surface. Each blocker below states what is
missing, why it matters and what would close it.

None of these are fixed in this branch: every one needs either a decision from
Linkbot outside this task's authority, a change to a file outside the authorised
write surface, or a privacy review.

---

## BL-1 — No instrumentation, so nothing is measurable

**What is missing.** The page ships zero analytics, zero event tracking and no
endpoint. Static Astro output, no tag manager.
**Why it matters.** The conversion hypotheses in `conversion-hypothesis.md`
cannot be confirmed or rejected. Any "the page improved conversion" statement
would be unfounded.
**To close.** A privacy-reviewed measurement decision (self-hosted, cookieless,
or none at all with moderated research only). This is a product/privacy call, not
an engineering one.

## BL-2 — The enquiry handoff is a `mailto:` draft, not a submission

**What is missing.** No backend. The visitor's mail client is the transport.
**What this branch guarantees.** The UI never claims a submission. It states that
nothing was received or stored, offers a copyable plain-text fallback for devices
without a mail client, and a browser test asserts that a full run produces exactly
one `mailto:` handoff and no other outbound request.
**Why it still matters.** Enquiries can be lost silently (no mail client, no send,
typo in the visitor's own address), and there is no receipt, no deduplication and
no record of interest. This caps the volume and the quality of the pipeline.
**To close.** The design in `enquiry-backend-proposal.md`, after privacy review.
Explicitly **not** implemented here and not authorised by this task.

## BL-3 — No mailbox or enquiry handling process

**What is missing.** The page promises "we read your message and reply to arrange
a short scoping conversation" and "no automated follow-up sequence". No triage
rota, no SLA, no owner and no template exist behind that sentence.
**Why it matters.** It is currently a claim about a process that has not been
defined. The page deliberately avoids any timing promise, but the sentence is
still an obligation.
**To close.** Name an owner and a first-response target internally; keep the page
copy free of any number until that is met in practice.

## BL-4 — No moderated usability sessions

**What is missing.** All QA in this pass is automated (unit + browser). No agency
recruiter has used the page.
**Why it matters.** The claims-discipline and labelling work is a hypothesis about
comprehension. Automated tests prove the labels are present, not that they are
understood.
**To close.** 3–5 moderated sessions before any instrumentation work (see
`conversion-hypothesis.md` §5).

## BL-5 — `npm ci` fails on the repository baseline

**What is missing.** `package-lock.json` at the repository root is a 20-byte
placeholder (`__PLACEHOLDER_LOCK__`), not a lockfile. `npm ci` therefore aborts
with `EUSAGE`; CI and Vercel both fall back to `npm install`.
**Evidence.** `npm ci` → `The npm ci command can only install with an existing
package-lock.json … with lockfileVersion >= 1`.
**Why it matters.** Installs are not reproducible; a transitive update can change
the build without any commit. The acceptance criterion "`npm ci` and
build/tests" cannot be satisfied while this is true.
**Why it is not fixed here.** The lockfile is outside the authorised write surface
for this task, and regenerating it would add a ~320 KB unrelated diff to an
acquisition-copy PR.
**To close.** A dedicated repository-hygiene change: generate a real lockfile
(`npm install --package-lock-only`), commit it, and switch CI to `npm ci`.

## BL-6 — CI coverage of the agency tests is path-filtered and single-file

**What is missing.** `.github/workflows/agency-acquisition.yml` runs only
`tests/agency-demo.test.mjs` and triggers on a fixed path list, and its `push`
trigger targets `velocity/agency-acquisition` only. It is outside this task's
authorised write surface, so it is unchanged.
**Consequence.** The new unit assertions added to `tests/agency-demo.test.mjs`
*are* covered (the file is in the path list and in the test command), but any
future additional test file would not run until the workflow is extended.
**To close.** Widen the workflow's `push` branch list to the parallel branches and
run `node --experimental-strip-types --test "tests/agency-*.test.mjs"` once a
second agency test file exists.

## BL-7 — Node version dependency in the test command

**What is missing.** Unit tests run through `--experimental-strip-types`, pinned
to Node 22 in CI. On this machine (Node 26.5) the flag is accepted and the same
suite passes with the flag omitted, because type stripping is now the default
there.
**Why it matters (and what is *not* claimed).** No failure or warning was observed
on either version. The risk is forward-looking: the flag is experimental, and its
stripping rules have changed across Node releases, so a Node bump could alter
what these `.mjs` fixture tests accept.
**To close.** Keep fixture tests free of TS-only runtime syntax and drop the flag
when the CI Node baseline reaches a release where stripping is the default.

## BL-8 — Accessibility has not been audited by a third party

**What is done.** Semantic regions and headings, a labelled `radiogroup` with
roving tabindex and arrow/Home/End keys, focus moved into the candidate-side
preview and returned to its trigger, polite live-region announcements, visible
focus styles from the global stylesheet, 40px/44px minimum tap targets, and a
`<noscript>` path on every interactive section.
**What is missing.** No automated axe-core run, no screen-reader walkthrough, no
zoom/reflow or high-contrast verification. `axe-core` was not added because it
would introduce a new dependency outside the authorised scope.
**To close.** An axe-core pass plus one VoiceOver/NVDA walkthrough; then decide
whether the new dev dependency is acceptable in the workflow.

## BL-9 — Screenshot/OG metadata for the new page

**What is missing.** `/for-agencies` uses the shared `og.svg`. There is no
page-specific OG image.
**Why it matters.** Social and link previews of an acquisition page are a real
entry point.
**To close.** A page-specific OG asset — requires touching shared SEO config,
which is explicitly out of scope here.

## BL-10 — Vercel interaction with the placeholder lockfile

**What is observed in PR #1.** Vercel logs a lockfile parse warning and continues
with `npm install`. Unchanged by this branch.
**To close.** Same change as BL-5, then confirm the warning disappears on a
preview deployment.
