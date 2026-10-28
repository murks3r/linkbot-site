# Product Hunt Launch Package (complete, frozen until gate green)

Status: **DRAFT — not submitted, not scheduled.** Do not create the PH submission while `launch-readiness-gate.md` is red. This package exists so launch day is execution-only once the gate passes.

Rules baked in (all dated sources in `research/sources.md`): launch from a personal account [7]; never ask for upvotes [4]; ranking is points-based with comments weighing in [5][6]; featuring requires a live, immediately usable product (no waitlist) [3]; no vote services, ever.

---

## 1. Listing

**Name:** Linkbot

**Taglines (pick one; all ≤60 chars):**
1. `Private-first job search — start as a guest` (45)
2. `Job search without building a public profile` (46)
3. `Find out, without being findable.` (35) — punchier, riskier; test with 2–3 people first

**Description (260-char limit; current draft ≈257):**
> Most job tools ask for a profile first. Linkbot starts as a guest: describe a real search and get current, explained opportunities — why each was shown, what's known, what's still unknown. Save privately, share only if you choose. No public profile, no auto-apply.

**Topics (PH categories):** Hiring / Privacy / Career — choose the best current set at submission (categories evolve; verify live).

**Links:** product URL submitted clean (no UTM on the PH submission's product link — tracking tags belong on the links *we* share to PH from our channels; third-party guides report PH rejects tracked submission URLs `[Provider claim — third-party]`).

**Assets checklist (G8):** logo 240×240 · ≥2 gallery images 1270×760 (final count: 5 planned) · optional 60 s video · all with the synthetic-data label inside any product screenshot.

## 2. Maker first comment (posted at launch, from the founder's profile)

> Hi Product Hunt 👋
>
> I built Linkbot because I watched job search become a visibility contest. Every tool pushes you toward a bigger public profile — and public profiles became data surfaces: scraped, indexed, sold into matching engines you never agreed to.
>
> Linkbot is the opposite bet: you start as a guest. Describe a real search; get current opportunities with their reasoning attached — what's known, what's inferred, what's still **unknown**. Nothing creates a public profile. Saving is private. Sharing is a separate, explicit decision, and "apply on source" hands you back to the original employer flow rather than pretending we submitted anything.
>
> What's honest about today's version: the interface is still mostly German (we're a small European team — an English path is coming), the supply comes from public job feeds with all their limits, and we deliberately show *fewer*, more explainable results instead of a wall of "matches".
>
> I'd love your toughest feedback: where does "explain every result + keep the unknown visible" break for you? And: what would you want a truly private job search to do that it doesn't?
>
> Try a search (no account): [link]

*(No upvote asks anywhere. If asked how to support: "tell me what breaks — that's worth more than a vote.")*

## 3. Gallery / storyboard (5 frames @1270×760)

| # | Visual | Overlay text (DE/EN awareness: EN for PH) |
|---|---|---|
| 1 | Hero: the problem — a stylised "profile = dataset" motif (brand direction pending from Agent A) | "Your job search shouldn't build a public profile of you." |
| 2 | Actual guest entry screen (real product, real UI) | "Start as a guest. One real search." |
| 3 | An explained result — reason / known / **UNKNOWN** annotated (real UI, synthetic example data, label visible) | "Every result explains itself. Gaps stay visible." |
| 4 | Save/private state screen (real UI) | "Save privately. Nothing is shared until you decide." |
| 5 | Apply-on-source / next-step screen + honest limits note | "No auto-apply. No fake submissions." |

Rules: real screenshots only (no fabricated UI), synthetic data labelled inside the image, no fake "numbers" on any frame, no comparative claims. Brand compliance review via Agent A before final assets.

## 4. FAQ (handle in comments + site FAQ parity)

1. **Is there a public profile?** No. There is no public Talent profile; your search stays private until you take an explicit sharing action.
2. **Is it free?** Searching is free; later paid surfaces (agency/employer tooling) are separate and marked. `[Adjust to actual plan before launch]`
3. **Where does the job data come from?** Public job sources with the limits we document publicly (see the field-report article). We don't scrape logged-in platforms.
4. **German UI?** Yes, for now — an English path is being prepared. (If this is still true at launch, it's in the maker comment too.)
5. **How do you make money?** Not from selling candidate data. Business tooling for agencies/employers funds the Talent side. (Confirm exact wording before launch.)
6. **Why "unknown" everywhere?** Because missing data isn't a fit signal. The interface refuses to convert gaps into confidence.

## 5. Launch-day runbook (the day the gate is green)

Source of truth for rules: re-read PH help pages the same week [3][4][5][6].

| Time (PT / CET) | Action |
|---|---|
| 00:01 PT / 09:01 CET | Founder posts from personal account (self-hunt) — pick timing with the audience awake: for a Europe-heavy support team, a 00:01 PT post plus a morning CET comment block is the standard compromise; decide explicitly and note it |
| +0–30 min | Post the maker comment; verify page on desktop + mobile; check all links |
| 09:00–12:00 CET | One honest message to the opt-in list ("we're live, here's what to try, tell us what breaks") — never "please upvote"; answer every comment within minutes |
| 12:00–18:00 | Send second-wave note to EU contacts; post on LinkedIn (utm_source=producthunt? No — LinkedIn post links to PH page; PH page link is clean); reply to everything |
| 18:00–24:00 CET | Keep replies flowing (co-founder if exists); afternoon update post ("what we're hearing") with something new — a question from the comments, not a vote count |
| 00:00 PT | Day ends: final thank-you comment; no celebrations of rank |

**Never during launch day:** vote requests of any kind; comparison shaming of other launches; arguing with criticism; DMing commenters about Linkbot beyond the thread; paid boost (PH ads allowed by PH for PH ads only — not our plan).

## 6. First week after launch (follow-up)

| Day | Action |
|---|---|
| D+1 | Recap comment with honest numbers available (comments, feedback themes, what we fixed already); thank-you to genuine contributors |
| D+2 | Publish a short "launch learnings" LinkedIn post (Talent EN) — what PH taught us, including criticism |
| D+3–5 | Ship one small fix directly traceable to a comment; tell that commenter |
| D+7 | Newsletter to list: "what changed after launch"; capture PH visitors who subscribed into the normal onboarding |

## 7. Post-launch learning metrics (not vanity)

- PH → site visits (via clean PH link + site referrer), PH → guest-search starts, PH → first-value reached (manual survey/notes if necessary).
- Comment themes table (positive/negative/feature asks), fixes shipped, support load (hours), and one honest sentence: "would we launch again here?" `[Hypothesis to validate: PH works for a privacy-first European product]`

## 8. Freeze & sign-off

- This package is frozen on approval; edits after freeze require a date-stamped changelog entry at the bottom.
- Sign-off for submission readiness: ____________________ (owner, date)
- Re-verify before submitting: PH help pages [3][4][5][6][7] + featuring status of the live product.

Changelog: 2026-10-09 — initial draft (growth agent).
