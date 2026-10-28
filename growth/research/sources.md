# Master Source Index

External sources used across this growth system, with retrieval dates. Rendered from the citation ledger on 2026-10-09 (URLs copied from retrieval output, not retyped). Additional repo-internal evidence is referenced by path/commit inline in each document and summarised here.

## External sources

## Sources

[1] https://www.bdu.de/news/vorsichtige-trendwende-im-personalberatungsmarkt — BDU — Vorsichtige Trendwende im Personalberatungsmarkt (17.04.2026)
[2] https://www.bdu.de/news/personalberatungsbranche-in-deutschland-marktteilnehmer-prognostizieren-leichten-umsatzrueckgang-auf-278-milliarden-euro-in-2025 — BDU — Personalberatungsmarkt-Studie (Pressemitteilung 27.08.2025)
[3] https://help.producthunt.com/en/articles/9883485-product-hunt-featuring-guidelines — Product Hunt — Featuring Guidelines
[4] https://help.producthunt.com/en/articles/484935-can-i-ask-my-community-friends-family-to-upvote-a-product — Product Hunt — Upvote-Ask Policy
[5] https://help.producthunt.com/en/articles/484938-how-is-the-homepage-ranked — Product Hunt — Homepage Ranking
[6] https://help.producthunt.com/en/articles/10275873-what-are-points — Product Hunt — What are points
[7] https://www.producthunt.com/launch — Product Hunt — Launch Guide
[8] https://web.archive.org/web/20260216173800/https://old.reddit.com/r/recruiting — r/recruiting sidebar + rules (Wayback 2026-02-16)
[9] https://web.archive.org/web/20250813095239/https://old.reddit.com/r/jobs — r/jobs sidebar + rules (Wayback 2025-08-13)
[10] https://web.archive.org/web/20250801141453/https://old.reddit.com/r/recruitinghell — r/recruitinghell sidebar + rules (Wayback 2025-08-01)
[11] https://web.archive.org/web/20250707135415/https://old.reddit.com/r/humanresources — r/humanresources sidebar (Wayback 2025-07-07)
[12] https://web.archive.org/web/20250810044903/https://old.reddit.com/r/cscareerquestions — r/cscareerquestions sidebar (Wayback 2025-08-10)
[13] https://www.linkedin.com/legal/user-agreement — LinkedIn User Agreement (effective 2025-11-03)
[14] https://schema.org/JobPosting — schema.org JobPosting (usage stat Aug 2026)

## Retrieval notes & caveats

- [1][2] fetched 2026-10-09 (live pages). BDU figures are industry-survey results; quoted as facts about the study's findings, not independently audited. Licence: cite + paraphrase; do not reproduce their tables.
- [3]–[7] fetched 2026-10-09 (live pages; help-article dates noted on-page — e.g. ranking article Feb 21, 2025; points article Oct 1, 2025). Platform rules change; re-verify before submitting anything (gate in `06-product-hunt/`).
- [8]–[12] are **archived snapshots** (Wayback Machine), fetched 2026-10-09. Reddit blocked live automated access from this environment on 2026-10-09. Scheduled/partial rule lists; live re-verification is mandatory before any participation (`07-reddit/community-research.md` gate).
- [13] fetched 2026-10-09 (live; effective 2025-11-03).
- [14] fetched 2026-10-09 (live); the "100K–1M domains (Google, August 2026)" figure is a provider-published usage statistic.

## Repo-internal evidence (primary, most load-bearing)

| Document | Where | What it supports |
|---|---|---|
| m5.2 pilot protocol (Talent first-value definitions, guest/save/sharing semantics) | murks3r/linkbot, `docs/launch-mvp/m5.2-pilot-plan.md` (reviewed at commit `eb37ebc`, branch launch-mvp; 2026-10-09) | Flywheel 1 semantics; a1; event definitions |
| Agency slice docs + boundary rules | murks3r/linkbot, `AGENCY_PILOT.md` (branch velocity/supply-matching @ `0eaa83b`) | Flywheel 2; guardrails; copy claims |
| Agency benchmark raw results | `local-reports/agency/agency-eval.json` @ `0eaa83b`; design commit `d6d44ff` | a2 (all numbers); P4; experiment E12 context |
| Supply-provider landscape research (live probes 2026-10-07) | `docs/research/global-supply-provider-landscape.md` @ commit `fd03988` (branch velocity/supply-matching) | a3; assumptions F10 |

Note: these repositories are private; before publishing anything derived from them outside the team, the publication review gate decides what becomes public and in what form (see each article's review checklist).
