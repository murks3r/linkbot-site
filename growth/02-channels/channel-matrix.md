# Channel Execution Matrix

One row per channel, then per-channel detail. Effort is founder-hours per week at steady state. Every "metric" is defined in `09-measurement/`. Status column: what must be true *before* the channel runs.

**Required columns:** audience · stage · needed product evidence · owner · frequency · effort · CTA · metric · stop/pivot rule · compliance. ✓

| # | Channel | Audience | Stage | Needed product evidence | Owner | Frequency | Effort/wk | CTA | Metric | Stop / pivot rule | Compliance |
|---|---|---|---|---|---|---|---|---|---|---|---|
| C1 | Founder LinkedIn (publishing) | Talent (EN), Agency (DE) | Now (beta) | Guest search usable; honest demo labels | Founder | 3 posts/wk | 2–3 h | "Try the guest search / ask me about the pilot" | Qualified sessions by UTM; profile→site rate | 6 weeks, <100 qualified sessions (provisional [Hypothesis], recalibrate after 2 weeks of data) → test new formats before increasing volume | No fabricated traction; synthetic demos labelled; no pods/auto-DM; LinkedIn UA §8 |
| C2 | Founder LinkedIn (engagement incl. company page + commenting) | Mixed | Now | none beyond honesty | Founder | Daily 15 min | 1.5 h | Comment, then profile | Conversations started; referral-free inbound | Reply rate flat after 4 weeks → change targets, not volume | No unsolicited mass DMs; connection notes without pitch |
| C3 | Blog / original editorial (site) | Talent (EN), Agency (DE), Market | Now (drafts) | Repo-verifiable facts ready (a2, a3) | Founder + agent drafts | 1–2 articles/mo | 3 h | In-article product action links (guest search / pilot) | Article→guest_start; organic entries (quarterly) | No qualified traffic by article #6 → rework topics per `05-blog` refresh gate | Rights: no republishing provider texts; own measurements + attributed public facts only; schema/canonical via Agent C interface |
| C4 | Newsletter ("Signal") | Existing contacts, agencies, early Talents | After first capture | Working signup w/ double opt-in | Founder | Monthly | 1.5 h | One action per issue (try / reply / read) | Open proxy via replies; click→visit; list growth | <15 % of signups actioning after 3 issues → change format or pause | GDPR: double opt-in; no bought lists; easy unsubscribe |
| C5 | Product Hunt | PH community (makers, early adopters) | After release gate | Public non-invite access; EN first-run; support live; analytics | Founder | One launch (gate) | 20–30 h one-off | Visit, comment, try | PH→signups; comments; qualitative feedback | Gate fails → do not launch (see `06-`) | No upvote asks; personal account; no scheduling before gate; no vote services [3][4][7] |
| C6 | Reddit participation | Practitioners (recruiting), some Talent | Beta/now (comments only) | None; honesty + time | Founder | 2–3 contributions/wk | 1–2 h | Answer first; links only where rules allow | Helpful replies; qualitative insight; (declared) referral traffic | Any subreddit warning/removal → stop that sub immediately; re-read rules | Rules per sub (dated evidence in `07-reddit/community-research.md`); disclose affiliation; no bots/astroturf/vote games; live re-check before posting |
| C7 | Agency direct outreach (email/LinkedIn, founder) | DACH agency principals | Now | Reconciled list; honest pilot scope; pricing stance (D1) | Founder | Batches of 5–10/week | 2–3 h | 20-min call: "is the evidence problem worth a single mandate test?" | Reply rate; qualified conversations | 20 contacts, 0 conversations → rewrite ICP/offer | DE legal review for cold outreach (UWG §7 sensitivity); manual only; no bulk tools; opt-out in every message |
| C8 | Agency referrals | Agency peers | After 1st delivered pilot | Delivered pilot + honest retro | Founder | As earned | 0.5 h | "Who else has this shortlist problem?" | Intro count; intro→call | No intros after 2 asks → drop loop | Consent-based; no naming clients without permission |
| C9 | Agency pilot page `/for-agencies` (site, existing PR#1) | DACH agencies | Beta | Demo honesty fixes (Agent D) | Agent D interface | Static | 0 | "Discuss an agency pilot" | demo→mailto/CTA; pilot conversations | CTA confusion persists → simplify to one action | No comparative "better" claims (PR review focus) |
| C10 | Talent referral loop | Existing Talents | After D7 evidence | Return behavior + consent-safe design | Founder | Quarterly test | 0.5 h | "Share your result / invite a friend (opt-in)" | referral flows; double opt-in integrity | Abuse or ignored → drop (D6) | No incentives initially; no data about a friend beyond what they explicitly submit |

## Per-channel essentials (condensed)

**C1/C2 LinkedIn.** Separate roles: *company page* = product/brand updates + curated industry links (low frequency, high craft); *founder personal* = the engine (DE for agency/DACH topics, EN for Talent/method topics). Formats rotate: insight post (text), evidence explainer (text+image card), build-in-public numbers, one-question discussion, and a raw "what we don't know yet". Commenting is manual, specific, and never mentions Linkbot unless directly asked. Details + 8 drafted posts: `04-linkedin/`.

**C3 Blog.** No empty pages, no mass pages: every article must carry ≥1 primary measurement or ≥3 attributable sources; ship with a Sources block and date stamps. Distribution derivatives mandatory (LinkedIn + newsletter + Reddit-contextual). Architecture: `05-blog/editorial-architecture.md`; flagships: `articles/a1–a3`.

**C4 Newsletter.** Only after the first 25–50 real contacts exist; until then it is a template. "One insight, one usefulness, one question" cadence.

**C5 Product Hunt.** One-shot event; gate first. Draft everything now (`06-product-hunt/`), schedule nothing. "Launch alternatives while gate fails": ship the blog + LinkedIn loop, list in niche directories that allow it (e.g., relevant DACH recruiting-tool roundups — approach editorially, no paid placement), and keep PH cold.

**C6 Reddit.** Participation-first: answer useful questions; disclose ("I work on Linkbot, a private-first job search tool"); link only when it directly answers and the sub's rules permit links; otherwise no link. Five drafted contributions: `07-reddit/participation-plan.md`. r/jobs: **no self-promotion of any kind** — comments must genuinely help and never promote; the safest contribution there is knowledge, not product [9].

**C7 Agency outreach.** Manual, personal, small batches; every message references something real and specific about the agency (their niche, their postings) — never a merge-field-only blast. Sequence drafts: `08-outreach/sequences-email.md` (DE primary).

**C8/C10 Referrals.** Design and permission flows: `02-channels/referral-mechanism.md`.

**Not run in the first 8 weeks (deliberately):** paid ads, influencer/affiliate deals, mass cold email tooling in the Talent segment, Discord/Slack community building, conference sponsorships. Revisit after the first pilot proof. `[Hypothesis: the first proof is worth more than early reach.]`
