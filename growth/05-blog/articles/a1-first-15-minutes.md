# a1 — The first 15 minutes: what a job-search tool owes you before it asks for anything

```yaml
title: "The first 15 minutes: what a job-search tool owes you before it asks for anything"
pillar: Talent
language: EN (DE summary planned for the DACH Talent audience)
status: DRAFT — not published; evidence-check + owner review required
date: 2026-10-09
target keyword family: honest job search · private job search · job search without profile · first value
derivatives: P1/P2 (LinkedIn EN), N1 (newsletter), community question (Reddit, rules permitting)
```

---

Most job-search products measure one thing about your first session: how fast you create an account. Very few can tell you what you got for it.

We build a job-search tool, so this is partly a self-critique. Here is the standard we think any tool in this category — including ours — should be held to, and the checklist you can apply to all of them.

## The 15-minute test

Take a tool you are considering. Give it fifteen minutes and one real search — not a demo persona, not "software engineer, Berlin" as an exercise, but a search you would actually run for yourself. Then check:

**1. Did it let you start before it asked for your identity?**
A useful tool can show you something based on a search intent alone. If the first screen is a signup form, or a "public profile" builder, the product has inverted the relationship: you pay first, value later. A profile is a liability you carry forever; it should be optional, constructed from evidence you actually chose to give, or absent entirely.

**2. Was the first result explained — with its sources and its gaps?**
"87 % match" is not an explanation. An honest result answers three questions in plain language:
- **Why was this shown to me?** ("It matches the role family, location, and work mode you confirmed.")
- **What is actually known?** ("The posting states X; the location field says Y.")
- **What is still unknown?** ("Compensation is not stated. The start date is not stated.")

That third bullet is the one almost nobody ships, and it is the most important. A tool that converts missing data into confidence is lying to you *by arithmetic*: absence of evidence becomes a score, the score becomes a shortlist, the shortlist becomes an expectation.

**3. Did it keep your interest to itself until you decided otherwise?**
Saving a search, flagging a role, expressing interest — these are decisions you make, and each one has different consequences. Especially: interest is not an application, an application is not an employer's interest, and a "match" is not an offer. A tool should keep those distinctions visible, because your actions depend on them. If a product's language blurs them (it usually does, in the direction of making you click), that's a design decision — against you.

**4. Can you leave and come back to the same state?**
Persistence is the feature everyone notices only when it's missing. Your constraints (the ones you confirmed as true for you) should survive a closed tab. Re-entering your whole intent every session is how tools quietly turn into chores.

## What this costs a product (and why most skip it)

Meeting the test means giving up some very effective growth mechanics: you can't count a profile as activation; you can't turn intent into "supply"; you can't score someone's silence. It also means showing results that are *useful but incomplete* — the honest state of every job search — instead of decorating them into certainty.

We're building Linkbot on the test above: a search starts without an account; results come from current public listings with their reasons attached; saving is a private step that does not disclose anything; sharing is a separate, deliberate act. Where facts are missing, the interface says **UNKNOWN** rather than filling the gap. None of that makes the product "better at matching" — we have no evidence to claim that, and you should distrust anyone who opens with it. It makes it *answerable*: every line of output can be traced to something.

*(Where this article shows a concrete example, it uses explicitly synthetic data — including in our own product's demo, where that label stays visible in the interface.)*

## Your checklist, for any tool (including ours)

1. What can I see before I create an account or a profile?
2. Does every shown result explain itself — reason, known facts, unknowns?
3. Are "match", "interest", "share", "apply" kept as separate, understandable steps?
4. Does my state persist, and can I retract what I shared?
5. What does the tool promise that it cannot prove? (If the answer is "nothing", you may be looking at an honest product.)

Fifteen minutes, one real search, five questions. That is enough to tell the difference between a tool that works for you and a funnel that works on you.

---

## Sources & provenance

- Method definitions (guest value, first value, the role of UNKNOWN, save-is-not-sharing) follow the internal M5.2 pilot protocol: murks3r/linkbot, `docs/launch-mvp/m5.2-pilot-plan.md` §2/§9 (repository fact, reviewed 2026-10-09).
- Product claim boundaries ("instructor" list of what not to claim) follow the product marketing notes: murks3r/linkbot — claim boundaries section (repository fact).
- No external statistics are used; no performance claims are made. All concrete example data in this piece is synthetic by construction.

## Review gates before publication

- [ ] Re-read for any accidental comparative claim ("better than") — none allowed.
- [ ] Confirm the guest-start flow behaves as described on the public site at publish time (re-check by actually running it).
- [ ] DE summary written and reviewed (DACH Talent audience) — summary links to this article; no machine-translated full twin unless someone owns the translation.
- [ ] Owner sign-off logged.
