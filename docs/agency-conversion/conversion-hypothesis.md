# Conversion hypothesis and claims register

Page under test: `/for-agencies`. Date: 2026-10-09. Base: PR #1 head `b588300`.

## 1. Assumption being tested

Agency decision-makers will only start a pilot conversation with a pre-production
product if the page (a) demonstrates the review workflow concretely, (b) is
unambiguous that the demonstration is synthetic, and (c) makes no performance
claims they cannot check. Credibility, not enthusiasm, is the conversion lever.

[Fact] There is no production integration for the agency workflow: no ATS
adapter, no candidate pool, no matching service, no backend endpoint.
[Fact] The only measurable conversion action available today is a visitor
choosing to send an email draft from their own mail client.
[Hypothesis] Visitors who complete the interactive workspace (through the
recruiter-review stage) are more likely to prepare a pilot enquiry than visitors
who only read the narrative, because the ask is only credible after the review
workflow is legible.

## 2. Before / after conversion hypotheses

### Before (PR #1 as merged)

[Hypothesis] "Better shortlists. Your candidates. Your call." plus a "Live demo"
navigation label would attract clicks but set a product expectation the site
cannot meet. The suspected failure mode was a visitor arriving at a pilot form
with an untested assumption that live candidate matching already exists, then
disengaging when the pilot turned out to be a discovery exercise.

### After (this branch)

[Hypothesis] Leading with "Explainable shortlists" and labelling every synthetic
surface explicitly trades a slightly lower demo click-through for a materially
higher rate of *qualified* enquiries — visitors who arrive at the form already
understanding that the pilot is scoped, that no candidate data is needed to
start, and that no accuracy figures exist yet.

[Provider claim] None. No third-party benchmark, case study or vendor claim is
used anywhere on the page.

### What would falsify these hypotheses

- Enquiry starts do not move, or move down, while demo completion also falls:
  the explicit synthetic labelling would be costing attention without buying
  qualification.
- Enquiries arrive that ask for capabilities the page explicitly disclaims
  ("can you import our ATS?"): qualification is not working, and the demo's
  promise level needs to come down further, not up.

## 3. Claims register

Every promise-bearing sentence on the page, classified.

| Claim on the page | Status | Evidence / basis |
| --- | --- | --- |
| "Turn a mandate into clear requirements you can review" | [Hypothesis] | Demonstrated in the workspace with synthetic fixtures; not yet validated on a real mandate. |
| "See why each candidate is on the list — and why the others are not" | [Fact] about the demonstration | Implemented: per-criterion `met`/`unknown`/`unmet` plus a named exclusion reason per profile. |
| "Ranking is a fixed rule … not an AI score, a probability, or a claim about Linkbot's matching quality" | [Fact] | `rankCandidates` in `src/lib/agency-demo.ts` is a deterministic three-key sort; no model is invoked. |
| "All mandates, profiles, evidence and results are synthetic" | [Fact] | Fixtures are static and fictional; a unit test asserts the fixture set contains no email, URL or phone-like string. |
| "Nothing here describes validated product performance" | [Fact] | No performance data exists to describe. |
| "No published accuracy, time-saving or placement figures" | [Fact] | Absence claim, verifiable by reading the page and this repository. |
| "A first conversation needs no candidate data at all" | [Fact] about process | The enquiry form collects only name, agency, work email, hiring focus and optional context. |
| "We read your message and reply to arrange a short scoping conversation" | [Hypothesis] | Intended handling of enquiries. **No mailbox automation, SLA or triage process exists yet** — see `launch-blockers.md` BL-3. |
| "Pilot data access, retention and candidate-contact boundaries would be agreed before any real agency data is used" | [Hypothesis] | Intent. No signed DPA, retention schedule or review process exists yet. |
| "No automated candidate outreach or database access" | [Fact] about the page | No such capability is wired or claimed. |
| Any statement about match quality, speed, hours saved or placement rate | **Removed** | These were present in PR #1 framing ("Better shortlists") and are now absent; a browser test enforces the ban list. |

## 4. Instrumentation — the honest gap

[Fact] The page has **no analytics, no event tracking and no server-side
endpoint**. It is a static Astro build with no tag manager. Nothing about this
work can be attributed today.

The primary metric therefore cannot yet be measured on the live site. The
following proxies are available and are what the interactive workspace was
designed to expose:

| Funnel stage | Proxy available today | Blocked by |
| --- | --- | --- |
| Page arrival | Vercel/host access logs only | No on-page instrumentation (BL-1) |
| Demo engagement | Must be observed manually in a usability session | No events (BL-1) |
| Recruiter-review comprehension | Moderated session task: "say which profiles you would approach and why" | Needs a session (BL-4) |
| Enquiry start | Not observable (mailto handoff leaves no trace on the site) | BL-1, BL-2 |
| Enquiry received | Manual inbox reading | BL-3 |

Sequencing: run 3–5 moderated sessions against the local build *before* adding
any analytics, so the first instrumentation reflects a flow that testers can
actually complete. Adding measurement to an unvalidated flow would only produce
numbers nobody can interpret.

## 5. Planned experiment (not started)

1. **Qualitative first (BL-4).** 3–5 moderated sessions with agency recruiters on
   a local build. Tasks: pick a mandate, say which profiles you would approach
   and why, find the exclusion reason for the rejected profile, and decide what
   you would do with a thin pool. Success = they can articulate the workflow and
   the fail-closed behaviour without prompting.
2. **Copy variant.** If sessions show the synthetic framing is being skimmed,
   test a compressed version of the banner (one sentence, pinned above the
   workspace) against the current two.
3. **CTA order.** Test hero-primary = "Request a scoped pilot" (current) against
   hero-primary = "See the interactive example". Same hypothesis as §2, and the
   only clean way to find out whether the current order is leaving enquiries on
   the table.
4. **Activation threshold definition.** Before adding measurement, pre-register
   what counts as success: demo completion (reaching the recruiter-review stage),
   enquiry-start rate, and the share of enquiries that name a specific mandate.
   Any privacy-reviewed instrumentation must be agreed before it ships (BL-1).
