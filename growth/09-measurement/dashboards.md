# Dashboards — Talent D7/D28 Cohorts · Agency Pilot Conversion

Status: **templates — no data exists yet** (no analytics, no sessions, no pilots). Fill weekly; leave `n/a` where the number doesn't exist rather than estimating. Every target is `[Hypothesis]` until week 4 of the plan.

## 1. Talent funnel & cohort dashboard

### 1a. Weekly funnel (fill from UTM registry + manual counts + product aggregates the owner approves)

| Week | Qualified sessions* | Guest starts | Scope confirmed | GV reached† | Saves | Returns (any) | Meaningful actions | Notes |
|---|---|---|---|---|---|---|---|---|
| W1 | | | | | | | | |
| … | | | | | | | | |

*Qualified session = arrived via one of our UTM'd links **or** performed a search after arriving untagged. Untagged searchless bounces don't count.
†GV definition (manual, until instrumented): user confirmed a truthful scope and understood one current candidate as a candidate with a reason to investigate. Written definitions: m5.2 protocol §9 (`[Repo fact]`).

### 1b. D7 / D28 cohort table (the retention view — the only one that matters)

| First-save week (cohort) | Saved users | Returned D1–7 | Returned D8–28 | Returned 29+ | Return definition |
|---|---|---|---|---|---|
| W2 cohort | n/a | n/a | n/a | n/a | "Signed-in session that recovered saved state and viewed current results" |
| … | | | | | |

**Formulas:** `D7 return rate = returned(1–7d) / cohort size`; `D28 = returned(1–28d) / cohort size` (cumulative). Report absolute counts beside every rate (denominators are small; a rate on n=3 is a story, not a statistic).
**Void conditions:** returns prompted by research sessions (protocol) don't count as organic returns — record them separately.

### 1c. Targets — provisional, disposable

| Metric | Provisional target `[Hypothesis]` | Recalibrated when |
|---|---|---|
| Qualified sessions / week (all channels) | ≥40 by W4 | W4 review |
| Guest start rate (of qualified sessions) | ≥30 % | W4 |
| GV rate (of guest starts) | ≥25 % | piloted, not before (U1) |
| D7 return rate (saved cohort) | ≥20 % | first 2 cohorts |
| D28 return rate | ≥10 % | first 4 cohorts |

If GV rate is ~0 with genuine intent: stop acquisition, check supply (G0), then product — in that order. Never "stimulate" the funnel.

## 2. Agency pipeline & pilot conversion dashboard

### 2a. Weekly pipeline (manual sheet; one row per agency)

| Agency | Segment (size/discipline) | Fit score | Last step | Next step | Next date | Status | Notes (real quotes only) |
|---|---|---|---|---|---|---|---|
| … | | | E1 sent 10-12 | call? | | cold/warm/call/pilot | |

### 2b. Weekly totals

| Week | E1 sent (cum.) | Replies | Reply rate | Calls done | Qual. conversations* | Pilots agreed | Pilots delivered | Second mandates |
|---|---|---|---|---|---|---|---|---|
| W2 | 5 | | | | | | | |
| … | | | | | | | | |

*Qualified conversation = the agency describes their shortlist process in concrete terms (not just politeness). Count separately from "calls".

### 2c. Pilot-unit dashboard (per pilot, the numbers the case study will need)

| Pilot | Mandate type | Days: agree→delivered | Lines w/ evidence / total | UNKNOWNs surfaced | Recruiter verdict (their words) | What didn't work | Verdict criteria defined in writing? | Second mandate? |
|---|---|---|---|---|---|---|---|---|
| P1 | | | | | | | Y/N | |

### 2d. Conversion targets — provisional `[Hypothesis]`

| Stage | Provisional target | Kill/stop rule |
|---|---|---|
| E1 → reply | ≥15 % (DACH B2B, personal, low volume) | <5 % after 20 → rewrite offer/list, not volume |
| Reply → call | ≥50 % of replies | — |
| Call → pilot agreed | ≥20 % of qualified conversations | 0/10 qualified calls → reposition (H4 review) |
| Pilot → second mandate | ≥40 % of delivered pilots | 0/2 delivered → value retro before more outreach |
| Pilot → paid conversion | price still an open question (D1/Q3) | 0 willingness across 10 calls → model change (H4) |

## 3. Definitions glossary (use these exact meanings in every report)

- **Qualified session** — arrival from our link or a search performed; not raw visits.
- **GV / FV** — guest value / first value per protocol §9 (unaided vs assisted flagged separately).
- **Return (Dx)** — verified signed-in recovery of saved state within the window; not "opened an email".
- **Qualified conversation** — see 2b footnote.
- **Reply rate** — human replies ÷ sends; auto-replies/bounces excluded (log exclusions).
- **Pilot** — an agency-authored mandate run through the review layer with written success criteria.

## 4. Reporting ritual (weekly, 15 min; see runbook)

Write the week's numbers into the sheet **before** reading any conclusion into them. Then one line: "what changed vs last week, and what we'll do differently". If nothing changed: say nothing changed. Dashboards serve decisions, not appearances.

## 5. Anti-patterns

Do not: merge research-session activity into funnels · count synthetic demo interactions as sessions · count newsletter opens as engagement · report rates without denominators · compare weeks with different definitions · use vanity metrics in stakeholder updates ("30 likes!") when the pipeline is empty.
