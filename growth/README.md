# Linkbot Growth System — `growth/`

Status: **DRAFT SYSTEM — nothing in this folder is sent, published, scheduled, submitted or spent.** Every asset waits for explicit owner approval. No outreach, post, newsletter, Product Hunt submission or payment has occurred.

Owner: founder/operator (Octavio). Built by the parallel growth agent (branch `parallel/growth-flywheel-v1`) under issue dispatch #3.

## What this is

An operational growth system for Linkbot's three audiences, in priority order:

1. **Talent** (job seekers) — initial acquisition engine. Works *before* Linkbot has a large Talent network: the mechanisms (content, community, guest-first search) do not depend on network effects.
2. **Agency** (recruiting agencies, DACH-first) — paying-pilot engine. Works entirely on the agency's **own** pool and mandates; it never needs the Linkbot Talent network.
3. **Employer/HR** — future audience. Only an inbound capture seed exists here; no engine is planned for it in the first eight weeks. [Hypothesis: employer demand will be validated after agency pilots prove the review loop.]

## How to use this folder

- **Start with** `01-strategy/flywheels.md` (the two mechanism maps) and `01-strategy/decisions.md` (what you must decide before execution).
- **Then** `02-channels/channel-matrix.md` (what to run where, with stop rules) and `03-plan/eight-week-plan.md` (weekly outputs).
- **Draft assets** live in `04-linkedin/`, `05-blog/`, `06-product-hunt/`, `07-reddit/`, `08-outreach/`, `copy/`.
- **Measurement and learning**: `09-measurement/`, `10-validation/`.
- **Provenance**: every outside fact carries a source; the master list is `research/sources.md`.

## Proof-status labels (used everywhere)

| Label | Meaning |
|---|---|
| `[Repo fact]` | Verifiable in the Linkbot repositories at the given path/commit. |
| `[Fact]` | Externally verifiable; the source is linked (see `research/sources.md`). |
| `[Provider claim]` | Asserted by a platform/provider (e.g. a product page or policy page); not independently verified beyond retrieval. |
| `[Hypothesis]` | Our unproven assumption, plan or guess. Treat as disposable. |
| `[Unknown]` | Explicitly unresolved; do not paper over. |

Rules of the system: **no invented traction, no invented performance figures, no comparative "matching superiority" claims, no unlicensed content.** All numbers are either sourced, repo-verifiable, or labelled `[Hypothesis]`.

## Product guardrails this system respects

- **Public-job first value**: a Talent's first value comes from explained public listings (guest access), not from a network. `[Repo fact: murks3r/linkbot m5.2 pilot protocol §2]`
- **Private saved intent**: saving and persistence are Talent-owned; saving is *not* sharing authority. `[Repo fact: same]`
- **Voluntary sharing only**: disclosure/interest steps are explicit, separate, revocable. `[Repo fact: same]`
- **Agency-owned pools stay agency-owned**: the agency tier never reads from the Linkbot Talent Network, and agency candidate data is **never** converted into network supply by assumption. `[Repo fact: AGENCY_PILOT.md, tier 040]`
- **No scraping of private data for marketing; no cross-tenant data**; no fake supply, receipts or employer interest. `[Repo fact: dispatch #3 guardrails + product docs]`

## Open dependencies (read before executing)

1. **Existing commercial inputs not accessible in this environment.** The dispatch references: launch research with **20 DACH prospects**, **5 draft outreach letters (none sent)**, a product packet proposing a **€149 30-day pilot**, and a commercial packet proposing a **€390 one-mandate Evidence Sprint**. Those documents were not present in this workspace or reachable repositories; this system encodes their *described constraints* (conflicting price proposals; letters unsent) but does not reproduce them. **Merge action:** reconcile `08-outreach/agency-segmentation.md` (tracker), `08-outreach/sequences-email.md` and `10-validation/first-customer-validation.md` with the originals before any send. `[Unknown: contents of those packets]`
2. **Pricing decision required** — see `01-strategy/decisions.md` D1. Never present €149 or €390 as validated.
3. **Draft PR #1 (agency page) and Agent D's conversion fixes** are still open; agency copy drafts in `copy/` assume review at merge time.
4. **No analytics infrastructure exists yet** (product deliberately added none). `09-measurement/` is an instrumentation *plan* plus manual interim measurement; nothing is installed without owner + privacy review.

## Maintenance rhythm (low-touch)

- **Weekly** (60 min): pipeline numbers + content queue — `03-plan/engagement-runbook.md`.
- **Monthly** (2 h): metrics review, experiment decisions, refresh the sources that carry dates.
- **Quarterly**: re-verify platform rules (Reddit/LinkedIn/Product Hunt), refresh dated market facts, prune stale drafts.
- **Validator**: `node tools/validate-growth.mjs` — checks required files, draft banners, link integrity and banned placeholder tokens.

## Directory index

```
01-strategy/   flywheels.md, assumptions.md, decisions.md
02-channels/   channel-matrix.md, channel-prioritisation.md, distribution-checklist.md, referral-mechanism.md
03-plan/       eight-week-plan.md, editorial-calendar.md, engagement-runbook.md
04-linkedin/   playbook.md, posts-weeks-1-4.md
05-blog/       editorial-architecture.md, articles/a1..a3
06-product-hunt/ launch-readiness-gate.md, launch-package.md
07-reddit/     community-research.md, participation-plan.md
08-outreach/   sequences-email.md, sequences-linkedin.md, newsletter-templates.md, case-study-templates.md, agency-segmentation.md
09-measurement/ utm-conventions.md, event-taxonomy.md, dashboards.md, experiment-backlog.md
10-validation/ first-customer-validation.md
copy/          landing-talent-de-en.md, landing-agency-de-en.md
research/      sources.md
tools/         validate-growth.mjs
```

## Scope boundaries

- This folder writes **nothing** outside `growth/**`; it does not touch site runtime (`src/**`, `public/**`), brand assets (`linkbot-brand/**`, Agent A) or the application repo.
- Interfaces to the other parallel agents: Agent A (brand) — copy drafts are pre-brand-review; Agent C (site hardening) — SEO fields in `05-blog/editorial-architecture.md` are proposals for their component; Agent D (agency page conversion) — `copy/landing-agency-de-en.md` overlaps their surface by design and should be reconciled, not duplicated.
