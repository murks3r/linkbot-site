# Two Growth Flywheels (Talent first, Agency second) + the Cross-Channel Content Loop

Status: DRAFT. All targets are `[Hypothesis]`; no baseline data exists yet (no analytics installed, no funnel history).

Reading the arrows: each arrow has **mechanism → metric → dependency → failure mode**. Metric names match `09-measurement/`.

---

## Flywheel 1 — Talent (initial acquisition priority)

**Why it can turn before Linkbot has a network:** every arrow below works with *public job supply + content + community*. No arrow requires other Talents to be present. Network effects appear only in the optional referral loop (arrow 6), which is not load-bearing for the first eight weeks. `[Repo fact: guest entry precedes sign-in; guest candidates come from current public listings — m5.2 protocol §2]`

```
(1) Discover            (2) Try guest search        (3) Save private intent      (4) Return
 content/community  →    explained public result →    persistence, not sharing →   24–72h, updated
 LinkedIn/blog/          no account needed            OIDC optional                state
 Reddit/newsletter                                                                    ↓
        ↑                                                                       (5) Meaningful action
        |                                                                       open source listing /
 (6) Voluntary share ←  feedback + trust content                                  interest / preview
 share own result / invite (consent-first)                                            ↓
        ↑                                                                       (7) Revenue dependency
        └─────────────────────────── content loop ←──────────────────────────── Talent is free; agency
                                                                               pilots fund the engine
```

| # | Mechanism | Metric | Dependency | Failure mode & stop |
|---|---|---|---|---|
| 1 | Founder LinkedIn content, blog/SEO, Reddit answers, newsletter — all DE/EN | `landing_view` with `utm_source`; qualified sessions | Editorial engine (see 05-blog); founder time ~3 h/week | Content gets no qualified traffic after 6 published pieces → review message-market fit before scaling output |
| 2 | **Guest first value**: search from a real intent → reach one explained public opportunity (reason shown + one unresolved condition) without guidance | `guest_search_started` → `guest_value_reached` (GV) rate; time-to-GV (target < 15 min `[Hypothesis]`) | Public supply freshness in the launch segment; German UI / English listings reality | GV rate near zero with genuine intent → supply/segment problem, not a content problem; pause acquisition spend on content until supply check (`10-validation` gate G0) |
| 3 | **Save = persistence, not sharing**: account creation is optional and never a condition of first value | `intent_saved` rate from GV sessions | OIDC works for new identities | Save framed as gate → violates guardrail; fix copy, not funnel |
| 4 | **Return to saved state**: D7/D28 return cohorts | `return_d7`, `return_d28` (cohort by first-save week) | Worker timing; saved-state restore quality | Return < threshold after 4 weeks → interview returning users (5–8) before any product change request |
| 5 | **Meaningful action**: opening the source listing for a real reason; interest/decline with a reason; native preview where legitimately available | `action_taken` (type: `source_open`, `interest`, `decline`, `native_preview`) | Honest "Apply on source" semantics; no auto-apply claims | Actions concentrated in test sessions, not real users → the session protocol is contaminating measurement; re-check identity of testers |
| 6 | **Voluntary share / referral**: share one's *own* result (opt-in), invite a friend who explicitly opts in | `referral_share`, `referral_invite_sent` (double consent), `referral_arrival` (UTM `referral`) | Consent-safe referral mechanism (`02-channels/referral-mechanism.md`) | Any attempt to convert someone's data without their explicit action → mechanism must not ship |
| 7 | **Revenue dependency (explicit)**: the Talent side does not directly monetize; agency pilots fund the engine, employer rail comes later | Pilot revenue vs engine cost (founder hours + tooling) | Agency flywheel below turning | If agency pilots fail to convert by week 8, the Talent engine continues on zero-budget mode (organic only) rather than paid acquisition |

**Guardrail reminders:** no public Talent profiles by default; no claim that Linkbot finds more/better jobs than alternatives. `[Repo fact: claim boundaries in product marketing notes]`

---

## Flywheel 2 — Agency (paying-pilot priority)

**Why it works without the Linkbot Talent network:** the pilot operates on the **agency's own authorized pool** and its own mandates; the matching/evidence layer needs no network liquidity. `[Repo fact: tier 040 import refuses contact columns and never reads the Talent Network — AGENCY_PILOT.md]`

```
(1) Reach                 (2) Try                      (3) Pilot                    (4) Value proof
 founder-led segment  →    interactive example +    →    one mandate on THEIR   →     their own numbers:
 outreach + /for-         a scoped pilot call           pool; evidence-backed        time-to-shortlist,
 agencies + referrals                                   shortlist; their call        explanation coverage,
        ↑                                                                             fewer false "fit"
        |                                                                                ↓
 (7) Revenue ← (6) Repeat / refer ← ─────────── (5) Case evidence + permission
 paid conversion    second mandate; peer-agency        anonymized or named,
 (pricing dec. D1)  referral (consent-based)           approved by them
```

| # | Mechanism | Metric | Dependency | Failure mode & stop |
|---|---|---|---|---|
| 1 | Direct outreach to segmented DACH agencies (founder, manual, DE); `/for-agencies` page; founder LinkedIn; agency peer referrals | `outreach_sent`, `reply_rate`, `qualified_conversation` | Reconciled prospect list (see dependency in README); honest demo (Agent D merge) | 20 qualified contacts, 0 conversations → rewrite offer/ICP, not volume |
| 2 | **Interactive example** (synthetic, labelled) + pilot call | `demo_start`→`demo_complete`; `pilot_conversation` booked | Demo is conspicuously synthetic; no unproven claims in copy | Confusion demo = product → fix labels first (Agent D scope) |
| 3 | **One-mandate pilot**: brief → structured mandate → evidence-labelled shortlist on their pool; recruiter keeps the decision | `pilot_started`, `mandate_intake_done`, `shortlist_delivered` | Agency provides a real mandate + authorized pool export; legal basis for processing confirmed by agency | Agency cannot/won't provide a bounded mandate → offer "watch it run on sample in the call" instead; never demand data |
| 4 | Value proof in *their* terms: did the shortlist help; was every claim traceable; what stayed UNKNOWN | `pilot_success_criteria_met` (per agreed criteria), explanation coverage, time-to-shortlist | Honest reporting incl. the keyword-baseline loss on synthetic pools (we publish this — a strength, not a bug) | No second mandate interest + interview says "nice but redundant" → re-examine value hypothesis, pause outbound |
| 5 | Case evidence with written permission (redacted or named — their choice) | `case_study_approved`, then reuse in LinkedIn/blog/newsletter | Explicit consent artifact; no candidate identities ever | No approval → use internal lessons without data; never a "composite fake case" |
| 6 | Repeat: second mandate; referral intro to a peer agency | `second_mandate_rate`, `agency_referral_intros` | Delivered first mandate + honest retro | One pilot converted, second stalls → problem is onboarding/support capacity, cap active pilots at 2 |
| 7 | Revenue: paid continuation (pricing undecided — see D1) | `paid_conversion` after pilot; `pilot_fee` (if charged) | Decision D1; invoicing capability; legal setup | Zero willingness-to-pay across 10 discovery calls → reposition as free research partnership with case-study value only |

**Hard rules:** agency candidate data is never converted into network supply; interest is never inferred; approval is not sending; matched candidates are not warm leads. `[Repo fact: AGENCY_PILOT.md "What the boundary actually enforces"]`

---

## Flywheel 3 (seed only) — Employer/HR

Not built now. Capture inbound only: a `/for-employers` waitlist note in copy (no page yet), and treat employer-side questions in calls as signal. `[Hypothesis: agencies operate the review loop first; employers follow once native applications and receipts are proven.]`

---

## Cross-channel content flywheel — one insight, six surfaces (worked example)

The required demonstration that one proven insight propagates without copy-paste spam:

1. **Insight (source)**: from the agency pilot benchmark we learned — measured, repo-verifiable — that the explanation layer (every claim traceable, UNKNOWN stays UNKNOWN) is the differentiator, while raw top-10 relevance was *worse* than a keyword baseline on the synthetic pool. `[Repo fact: evaluation/agency-eval.json, linkbot-velocity @ 0eaa83b]`
2. **Blog article (DE, agency pillar)**: "Wir haben unseren Matcher gegen Stichwortsuche gemessen — sie hat gewonnen. Was wir daraus gelernt haben." Full numbers, method, caveats. → `05-blog/articles/a2-*.md` (draft exists).
3. **LinkedIn post (DE, founder)**: the honest headline + one number + link with `utm_source=linkedin&utm_medium=organic-social&utm_campaign=2026-10-benchmark`. → `04-linkedin/posts-weeks-1-4.md` draft #4.
4. **Reddit contribution (contextual, not copy-paste)**: in r/recruiting, answer a relevant thread about sourcing quality with the *method* (how to measure a shortlist honestly), disclose affiliation, link only if rules permit and it directly helps — otherwise no link. → `07-reddit/participation-plan.md` draft R1.
5. **Newsletter**: the story as the "one measurement" section + what we're doing next. → `08-outreach/newsletter-templates.md` issue 1.
6. **Product feedback → next insight**: pilot conversations test whether the explanation layer is worth paying for (D1); their answers refine the next benchmark (real briefs, less keyword-literal pools).

**Consent-safe measurement of the loop:** every link carries its UTM; we compare *qualified* sessions and first-value rates per channel — never raw impressions. Any channel without a measurable conversion point gets a manual weekly count instead. Content review/refresh gates: `03-plan/engagement-runbook.md` (publish gate) + quarterly refresh (`05-blog/editorial-architecture.md`).

**Language strategy inside the loop:** DE for Agency + market/regulatory content; EN for Talent + methodology content; each flagship gets the other-language treatment only where the audience exists (see `05-blog/editorial-architecture.md` § bilingual).
