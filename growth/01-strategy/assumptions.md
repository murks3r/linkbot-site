# Assumptions & Proof Ledger

Every load-bearing belief in this system, with its proof status. If a claim here is wrong, the attached decision changes. Update this file when evidence arrives; never let a `[Hypothesis]` silently become a `[Fact]`.

## A. Facts we can stand on (dated)

| ID | Claim | Status | Evidence |
|---|---|---|---|
| F1 | The product's Talent first value comes from **guest access to explained public listings**, before login. | `[Repo fact]` | murks3r/linkbot m5.2 pilot protocol §2 (shipped `guestEntry`/`guestOpportunities`; guest candidates explicitly not confirmed fit) |
| F2 | Saving/persistence is Talent-owned; saving is *not* sharing; disclosure is a separate explicit step; UNKNOWN never becomes fulfilled. | `[Repo fact]` | m5.2 protocol §2, §4; ADR-011 private intent |
| F3 | The agency tier (mandate→pool→shortlist→draft) works on the agency's own pool; imports refuse contact columns; nothing is read from the Talent Network; interest is never inferred; approval is not sending. | `[Repo fact]` | AGENCY_PILOT.md; sql/agency/040; tests (24) |
| F4 | On the current synthetic benchmark, a Boolean keyword baseline outperforms the matcher on top-10 relevance (3.67 vs 2.67 relevant in top 10), while the matcher provides full explanation coverage (1.0 vs 0.0) with zero unsupported inferences. | `[Repo fact]` | evaluation/agency-eval.json, linkbot-velocity @ `0eaa83b`; commit `d6d44ff` |
| F5 | No real participant has completed the Talent pilot; zero participants completed as of the M5.2 plan (approved protocol, execution prepared). | `[Repo fact]` | m5.2-pilot-plan.md header |
| F6 | No analytics infrastructure was added by the product; no traction/funnel numbers exist. | `[Repo fact]` | m5.2 protocol §13 ("no analytics infrastructure added") |
| F7 | DACH market context: German Personalberatung market shrank to ~2.7 bn € in 2025 (−4.7 %), 1,975 companies (−200), ~14,225 staff; 2026 expectation +3.0 % to ~2.77 bn €; smaller firms (<1 m €) under the most pressure; Executive Search ≈ 79 % share; 75,000 placements in 2024; average fee 27.5 % of target income (2024); 3 of 4 firms expect platform-based search models to gain ground; AI Act seen as a regulatory driver. | `[Fact]` | BDU press releases 17.04.2026 and 27.08.2025 [1][2] |
| F8 | Product Hunt: homepage ranks by *points*, not raw upvotes; one upvote ≠ one point; featuring is curated (live, usable digital products; waitlists/services excluded); asking for or incentivizing upvotes is prohibited and can demote/delist a launch; company accounts cannot post. | `[Provider claim]` | PH help pages [3][4][5][6]; PH launch guide [7] |
| F9 | r/jobs prohibits job posts and self-promotion of any kind — including "services" and "ads" — and permits articles only as links prefixed [Article] (snapshot 2025-08-13). r/recruiting is a professionals' sub; job-seeker posts belong in a weekly megathread; articles allowed *with discussion content* (snapshot 2026-02-16). r/recruitinghell bans "addicles" and AI-service promotion, one-strike spam ban (snapshot 2025-08-01). | `[Fact]` (archived snapshots; live re-check required) | Wayback sidebars [8][9][10] |
| F10 | Public job-supply seams differ: Greenhouse/Lever/Ashby/Personio XML endpoints answered credentialless on 2026-10-07; SmartRecruiters' "public" GET returned empty without a key (API-key gated); Teamtailor is auth-gated; Workday `/wday/cxs` and Oracle ORC career endpoints are employer-controlled public endpoints, undocumented as APIs; none promises a deletion/closure stream. | `[Repo fact]` | docs/research/global-supply-provider-landscape.md @ commit `fd03988` (live probes 2026-10-07) |

## B. Unknowns (declared, not hidden)

| ID | Unknown | Why it matters | How it gets resolved |
|---|---|---|---|
| U1 | Whether any Talent can reach unaided first value (guest or saved) | The entire Talent flywheel | M5.2 protocol run (execution needs owner authorization) |
| U2 | Talent segment/language/geo fit; launch geography is explicitly unsettled | Content targeting, SEO language | M5.2/M3 evidence; not from this repo |
| U3 | Whether agencies will pay anything for the review loop, and at what price (€149 / €390 proposals are both **unvalidated**) | Agency flywheel revenue | `10-validation` discovery calls; decision D1 |
| U4 | The contents of the existing commercial inputs (20 DACH prospects, 5 letters, both price packets) — not accessible in this environment | Outreach start state | Founder merges originals; README dependency #1 |
| U5 | Whether the interactive agency demo converts (no conversion data exists) | Channel priorities | First 4 weeks of measured traffic |
| U6 | Effects of the upcoming AI Act obligations on HR tooling claims and vendor positioning | Trust/compliance content, sales objections | Legal review; BDU already flags it as a market driver [1] |
| U7 | Whether Reddit/LinkedIn rules have changed since the archived snapshots | Participation compliance | Live rule re-check before ANY post/comment (publish gate) |

## C. Hypotheses we are choosing to test (disposable)

| ID | Hypothesis | Tested by | Decision if false |
|---|---|---|---|
| H1 | Founder-led LinkedIn + original blog content produces qualified visitors (people who start a real search) within 8 weeks | UTM + guest_start rates per channel | Deprioritize content volume; shift to community + outbound |
| H2 | The honest-benchmark story (F4) is a trust asset for agency conversations, not a liability | Reply rates; conversation notes; article engagement (qualitative) | Reframe: keep disclosure in the pilot, drop it from acquisition content |
| H3 | Agencies tolerate a one-mandate bounded pilot on their own pool without integration friction | Pilot #1–2 delivery | Narrow to "run on 1 sample mandate in a live call" as the first step |
| H4 | A target price exists in the 3-digit € range per mandate for the review/evidence layer; €149 vs €390 is a real decision, not a rounding error | 10 discovery calls with price probes; first paid conversion | Reposition toward per-seat or free-with-case-study model |
| H5 | The agency who pilots will refer a peer agency if asked at the right moment | `agency_referral_intros` | Drop referral loop; rely on content + outbound |

## D. What this system refuses to claim (standing rules)

1. No customer traction, uplift, matching superiority or outcome numbers that we cannot reproduce. `[Fact: guardrail from dispatch #3]`
2. No conversion-rate or "expected reply" benchmarks presented as fact — all targets are `[Hypothesis]` until measured.
3. No unlicensed content: blog/linked marketing never republishes provider job texts, candidate data, or scraped profile data; aggregates only where the right to observe exists, and nothing that could identify a person. (`05-blog/editorial-architecture.md` § rights)
4. No "scraping private data for marketing", no bought lists, no engagement pods, no auto-DMs, no vote solicitation.
5. Agency candidate data never becomes network supply — not "anonymized", not "aggregated", not "by default no". Never. `[Repo fact: tier-040 isolation]`
