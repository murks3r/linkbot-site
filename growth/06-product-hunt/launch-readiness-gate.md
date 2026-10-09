# Product Hunt Launch-Readiness Gate

Status: **DRAFT — gate not passed; do not submit, schedule or announce anything.** This document defines what "ready" means, per current Product Hunt rules/norms (sources dated below), and records the reasoning for launch order.

## 0. Framing

Product Hunt is a **one-shot credibility event**, not a growth channel you can re-run monthly (relaunch needs a significant update and PH review for close repeats `[Provider claim: PH norms, third-party guides referencing PH pages]`). A launch into an unready product converts the platform's attention into nothing and wastes the moment. Therefore: everything gets prepared now (`launch-package.md`), nothing gets submitted until every gate item below is green, dated, and signed.

## 1. PH-specific requirements (verified against current help pages)

| # | Requirement | Source |
|---|---|---|
| R1 | Launch from a **personal account** (company accounts cannot post/vote/comment as makers), with complete profile | PH launch guide [7]; platform norms |
| R2 | New personal accounts need **≥1 week** before posting products; participation beforehand is both required-by-aging and good practice | third-party guides citing PH pages `[Provider claim]` |
| R3 | **Do not ask for upvotes** — ask people to visit, try, comment; asking/incentivizing can demote or delist | PH help [4]; launch guide [7] |
| R4 | Ranking is by **points** (engagement-weighted), not raw upvotes; comments and genuine discussion matter | PH help [5][6] |
| R5 | **Featuring is curated**: live, usable, useful/novel/high-craft/creative digital products. Waitlisted products, services, reports, templates, courses are *not* featured | PH featuring guidelines [3] |
| R6 | Company accounts cannot manipulate; vote services/rings are sanctioned — never attempt | PH help [4]; community guidelines (referenced) |
| R7 | Launch day runs 24 h from 00:01 PT; schedule up to ~a month ahead; you may self-hunt | PH launch guide [7] |

## 2. Product-readiness gates (the real blockers)

| # | Gate | Current state (2026-10-09) | What flips it green |
|---|---|---|---|
| G1 | **Immediate access without invitation** — PH excludes waitlisted products [3]; the site currently says "Private beta" / "by invitation" | ❌ RED | Public guest entry live for the launch segment; no invite code on the first-value path |
| G2 | **First value reachable unaided** — guest search → explained result, no German required for the first minutes | ⚠️ UNKNOWN | Run the internal protocol (`m5.2-pilot-plan`) with ≥3 real users; unaided first value observed. UI-language caveat honest |
| G3 | **English first-run path** — PH's audience is overwhelmingly English; the product UI is predominantly German today | ❌ RED | An EN onboarding path (even a thin, honest one), or accept a German-only niche launch with realistically lower engagement — decide explicitly |
| G4 | **Support availability** — a named human answering comments for the full day + email support for the week | ⚠️ PENDING | Founder commits the day + backup contact |
| G5 | **Accurate claims** — listing, site and demo pass the claims review (no "better", no invented traction; synthetic demo labelled) | ⚠️ PENDING | Claims review of launch copy + `/for-agencies` merge (Agent D) |
| G6 | **Analytics & measurement** — at least UTM capture + the manual first-value counts; decide D4 | ⚠️ PENDING | D4 decision + registry; PH visit counting at minimum |
| G7 | **Mobile QA** — gallery, site and product on 375 px; no dead ends | ⚠️ PENDING | QA pass (Agent C/D territory; interface only) |
| G8 | **Visuals** — logo, ≥2 gallery images 1270×760, 240×240 thumbnail, optional 60 s video/GIF, all brand-compliant | ⚠️ NOT CREATED | Asset production via Agent A's brand direction once approved; storyboard exists in `launch-package.md` |
| G9 | **Sharing list** — real people who genuinely opted into updates (no bought lists, no cold blasts) | ❌ RED | Newsletter/interest list ≥50 real contacts |
| G10 | **PH profile aged + community participation** (R2) | ❌ RED (not yet created) | Create profiles now; participate genuinely for weeks before any launch |

**Gate verdict: RED (4 red, 3 pending, 2 unknown, 0 green).** Expected earliest realistic window: after G1/G3/G7 are resolved — this is an owner/product decision, not a growth-side task.

## 3. Launch order decision (required by dispatch): Talent experience first — when green

**Recommendation: launch the Talent experience, not the agency pilot.**

| Option | Arguments | Verdict |
|---|---|---|
| Agency pilot | Service-like → excluded from featuring [3]; audience (DACH agency principals) isn't on PH buying recruiting tools; confidential pilot mechanics make a boring public story | ❌ |
| Talent experience | Consumer-facing, judge-able in minutes; novel story (private-first job search); guest entry gives "immediate access" shape needed for featuring | ✅ when G1–G10 green |
| Both | Guarantees neither is ready | ❌ |

**Consequences of launching Talent first, planned deliberately:** (1) G1 & G3 are the crux — no launch while access is invite-only or the first run requires German; (2) the launch copy (package below) is Talent-focused; agency messaging continues through direct outreach in parallel, unaffected; (3) expectations: PH traffic for a privacy-first product will be modest and quality-seeking `[Hypothesis]` — measure *first-value* among PH visitors, not signups.

## 4. Alternatives while the gate is red (do these instead)

- Ship the blog/LinkedIn engine (this folder) — compounding, no gate needed.
- Directory/roundup presence where editorially accepted (DACH recruiting-tool comparisons; approach as a submission, never pay for placement) `[Hypothesis: some accept substantive tool submissions; needs per-directory verification]`.
- Community participation (Reddit etc.) building the honest story early.
- Prepare and **freeze** the launch package so the eventual day is execution-only.

## 5. Gate review protocol

Re-run this checklist every Friday from W5 (`03-plan/eight-week-plan.md`), recording date + item states in a log row below. A launch is scheduled only when: all G-items green **and** R-items confirmed on a fresh read of PH pages the same week **and** the owner signs the sign-off line.

| Review date | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 | Reviewer |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-10-09 | ❌ | ? | ❌ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✖ | ❌ | ❌ | growth agent |

Sign-off for scheduling: ______________________ (owner, date)
