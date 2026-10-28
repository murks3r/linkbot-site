# a3 — What public job feeds can and cannot tell you: a field report (2026-10-07)

```yaml
title: "What public job feeds can and cannot tell you: a field report"
pillar: Market/Transparency
language: EN (DE key-points box at the end for the DACH audience)
status: DRAFT — not published; evidence-check + owner review required
date: 2026-10-09
target keyword family: public job feeds · ATS job API · job posting freshness · job data licensing
derivatives: P5 (LinkedIn EN), N2 (newsletter item), builder-community discussion (rules permitting)
```

---

Every job tool — board, aggregator, agent, "AI recruiter" — makes one implicit promise: *what I show you is current.* We spent a day testing what public job feeds actually guarantee, watching raw endpoints answer. The honest summary: **some feeds are remarkable, almost none give you deletion, and "public" is at least four different things.** Anyone building or buying in this category should know where the floor is.

## Method (so you can discount accordingly)

Single HTTP requests to public endpoints from one machine on **2026-10-07 (UTC)**, with an identifying User-Agent, **no credentials of any kind**, plus the providers' own current documentation. Not a load test, not legal advice, not a per-provider audit — a floor check. Full record: `docs/research/global-supply-provider-landscape.md` (repo `murks3r/linkbot`, commit `fd03988`). `[Repo fact]`

## Finding 1 — "Public" is (at least) four different things

The day's probes split cleanly into categories that products habitually blur:

- **Documented public APIs.** Greenhouse's board API answered (`/v1/boards/gitlab/jobs` → 200 JSON); so did Lever (`/v0/postings/leverdemo` → 200), Ashby (public posting API, ~2 MB board payload), and Personio's XML careers feed (`acme.jobs.personio.de/xml` → 200, `workzag-jobs` schema).
- **Employer-controlled public endpoints** — the internal JSON that powers an employer's own career site, *not* documented as an API. Workday answered exactly like that: a POST to `nvidia.wd5.myworkdayjobs.com/wday/cxs/...` returned JSON with `total=2000`. Oracle Recruiting's career endpoint did too (a US health system's site: `TotalJobsCount=2840`).
- **Gated "public" endpoints that return empty without a key.** SmartRecruiters' credentialless GET returned 200 with `totalFound=0` and an empty list for several large public identifiers — consistent with API-key gating, not an empty market. Teamtailor answered nothing without a token.
- **Government/portal surfaces** with their own rules (e.g., an EU portal whose search GET returned 500 because the endpoint expects a POST body; a US federal API that requires a registered key).

**Consequence:** if a product says "we ingest 10,000 sources", ask *which category* each source is in. The categories differ in stability, terms, and completeness — a tool that treats them as equal is either lucky or sloppy.

## Finding 2 — Almost nothing tells you a job was deleted

Postings disappear for a hundred legitimate reasons, and only some feeds have a way to signal it. Most of the public seams we tested have **no deletion event and no closure guarantee**. What does that leave? Inference from absence — which is only sound under strict conditions: a *complete* board roster, fetched *atomically*, relative to an *authoritative* source. Lever's public API pages with offsets; a filtered window can never prove employer-wide absence; Workday's public endpoint exposes "Posted 30+ days ago" rather than exact dates.

**Consequence:** any tool showing "current openings" is using some heuristic for expiry. Ask what it is. "We refresh daily" answers *how often*, not *how correctly*. The only tool claiming perfect currentness is one that hasn't measured it.

## Finding 3 — Freshness has a seam, and the seam is licensing

One more distinction the industry skips: technical access is not permission. An endpoint answering your request says nothing about whether its terms allow you to store, re-publish or display the content — and the providers' public positions differ (career-site integration guidance vs. blanket grants that mostly don't exist to be found). Our standing internal rule, written before we built anything on top: **technical accessibility is never permission**, and every source is recorded with its authority class and its terms status. `[Repo fact: same document, §0]`

## Finding 4 — Structured data is everywhere; currency is nowhere

Schema.org's `JobPosting` markup is pervasive — Google's own index counts it on the order of 100K–1M domains (Google, August 2026) `[Provider claim]`. It carries fields for salary, location, posting date — and `validThrough`, which is *often absent*. Markup tells you a page was built to be found, not that its content is true today. Missing markup is never proof a job closed; present markup is never proof it's open.

## What we do with all this (in our product)

- Closure by absence is allowed **only** when the source is complete and authoritative for a full fetch — never from a partial crawl. `[Repo fact: S2 constraints in the same document, §0.3]`
- Sources are typed by authority class (documented API → employer structured publication → career page → licensed feed), and preference is explicit.
- Stale or unknown data surfaces as **UNKNOWN**, not as a silently lowered rank.
- LinkedIn/Indeed are deliberately **not** dependencies — their data is not ours to build on.

## Your checklist, if you're evaluating job tooling

1. For each claimed source: documented API, employer-controlled endpoint, licensed feed, or wrapper? 
2. How is job closure detected — deletion signal, absence in a complete fetch, or "we redraw the list"? 
3. When a posting's salary/status is missing, does the tool show a gap or invent a score? 
4. Does it claim a *currentness guarantee* it cannot actually make?

We keep finding that honest answers here are rarer — and more differentiating — than shiny ones.

---

### DE key points (for a DACH summary box)

Vier Kernaussagen: (1) „Öffentliche“ Job-Feeds sind mindestens vier verschiedene Dinge — dokumentierte APIs, vom Arbeitgeber betriebene Endpunkte, geschlüsselte „öffentliche“ Endpunkte, Regierungsportale. (2) Fast kein Feed meldet gelöschte Stellen; Aktualität ist meist Inferenz aus Abwesenheit — und nur bei vollständigen, autoritativen Quellen zulässig. (3) Technische Erreichbarkeit ist keine Erlaubnis zur Nutzung oder Weitergabe. (4) schema.org/JobPosting ist weit verbreitet, sagt aber nichts über Aktualität; `validThrough` fehlt oft. Wer Job-Tools bewertet, sollte genau diese vier Fragen stellen.

## Sources & provenance

- All probe results: `docs/research/global-supply-provider-landscape.md` @ `fd03988`, probes dated 2026-10-07 (repository fact; re-verbatim-checked 2026-10-09).
- Schema.org usage figure: schema.org/JobPosting page, "Google — August 2026" `[Provider claim]` [14].
- Provider documentation referenced by the repo record (Greenhouse job board docs, Lever postings API, Ashby posting API, Personio retrieval docs, Workday/Oracle/other provider docs) — URLs maintained in the repo document's per-record `sources` fields.
- No third-party statistics beyond the above; no personal or candidate data anywhere in this piece.

## Review gates before publication

- [ ] Decide whether to re-run the probes at publication time or keep it explicitly dated as a "field report (2026-10-07)" — recommend keeping the date and stating it in the title/first line (current draft does).
- [ ] Legal read of Finding 3 (keep it descriptive; no legal conclusions about any provider).
- [ ] Confirm no provider's terms text is reproduced beyond short factual description.
- [ ] Owner sign-off logged.
