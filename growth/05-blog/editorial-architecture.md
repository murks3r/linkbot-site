# Blog / Editorial SEO Architecture

Principle: **original, verifiable information — never mass-generated pages.** Every page must be worth publishing on its own; if an article would exist on 500 other sites, we don't write it. Our unique material: our own reproducible measurements, our supply-infrastructure field work, and honest method explainers about privacy-first recruiting.

Status: drafts only. No page is published; site placement decisions belong to the site workstreams (Agents C/D) and owner.

## 1. Content pillars (audience-first)

| Pillar | Audience | Language | Purpose | Example clusters |
|---|---|---|---|---|
| **Talent** | Job seekers (EN first; DE when relevant) | EN (DE where DACH-specific) | Utility + trust: how to search with private intent | private job search, evidence & UNKNOWN, first-value evaluation, application handoff ("Apply on source") |
| **Agency** | DACH recruiting agencies | DE (EN for method) | Practitioner credibility: evidence-led shortlists, mandate work | mandate intake, shortlist honesty, benchmark transparency, AI/regulatory (post legal review) |
| **Market/Transparency** | Both + builders | EN + DE | Demonstrate how recruiting data actually behaves; build authority | public job feed mechanics, supply currentness, licensing ≠ accessibility, what "match" should mean |

**No Employer/HR pillar yet** — until employer-side product evidence exists, employer content would be speculative; it becomes pillar 4 after the agency pilot proof. `[Hypothesis]`

## 2. Topic clusters & the "unique evidence requirement"

SEO clusters are built around keyword *families* (we do not claim search volumes — no reliable source was consulted `[Unknown]`). The gate for writing any article:

> **Unique evidence requirement:** an article ships only if it contains **at least one of**: (a) a first-party measurement we ran (with method + date + repo reference), (b) an aggregation of public data with our own methodology, or (c) a synthesis of ≥3 attributable public sources that adds a non-obvious structure. Plus: at least one **actionable** takeaway for the reader.

Planned cluster map (families, not promises):

| Cluster | Pillar | Flagship | Supporting pieces (planned) | Internal links (product actions) |
|---|---|---|---|---|
| First value / honest job search | Talent | **a1** "The first-15-minutes test" | "What 'Apply on source' means", "Why we won't fake a submission" | Guest search start; save/intent |
| Evidence & UNKNOWN | Talent + Agency | **a2** (benchmark honesty, DE) | "UNKNOWN: a field guide for recruiters" | Agency pilot inquiry; demo |
| Public job feeds / supply mechanics | Market | **a3** "Field report" | "How we test feeds (and what breaks)", "Closure by absence: why job counts lie on Mondays" | About page; agency page |
| Privacy-first recruiting practice | Talent + Agency | (post-W8) | "AI-VO für Personalberatungen" (legal review gate) | Product overview |

## 3. Provenance rules (research → publication)

1. **Every external claim** carries an inline source with retrieval date, and each article ends with a `Sources` block (URLs + titles + dates). Use `research/sources.md` as the master index.
2. **Own measurements** cite the repository, path, commit, date and reproduction command where one exists.
3. **Label states:** `[Repo fact] / [Fact] / [Provider claim] / [Hypothesis] / [Unknown]` — the same convention as the rest of this folder. Marketing prose may read smoother, but the labels stay in review copies; published versions keep at least the "what we don't claim" box.
4. **Rights — usable vs restricted:**
   - ✅ **Usable:** our own measurements; counts/aggregates we computed from public sources *as observations about those sources* (with method); quotes from public reports (short, attributed); facts from laws/specifications.
   - ❌ **Restricted:** republishing provider job-posting text or images; republishing candidate/profile data; using scraped personal data at all; lifting whole tables from licensed studies (BDU figures → cite + short paraphrase only, never reproduce their tables); anything under a license that prohibits redistribution.
   - Boundary case: ATS/feed data. We may describe what a feed *does* (mechanics, availability); we may not redistribute its content. Any aggregate use requires the rights review listed in the review gate below.
5. **No AI-generated filler.** Drafts are AI-assisted but the review gate requires the named human to verify each claim, edit voice, and own the piece. An unpublished page is better than a thin one.

## 4. On-page technical plan (proposals for Agent C's component — no edits here)

- **Schema:** `BlogPosting` (+ `author`, `datePublished`, `dateModified`, `inLanguage`) on articles; `Organization` site-wide (already being corrected by Agent C); `FAQPage` only where a real FAQ block exists.
- **Canonicals:** self-canonical per language; `hreflang` pairs `de-DE ↔ en` for bilingual twins (only when both versions actually exist — no ghost alternates).
- **Internal linking:** each article links: 1 pillar hub + 1 sibling article + 1 product action (guest search / pilot inquiry / about). No orphan pages; no cross-pillar link dumping.
- **Meta:** title ≤ 60 chars where possible; description = the article's own summary line; OG image per article (brand-compliant assets come from Agent A).
- **Indexing hygiene:** noindex drafts; sitemap inclusion only after publish; robots/llms.txt handled by Agent C's scope.
- **Performance:** static output, no new runtime dependencies; images compressed; no embeds that require JS for reading. (Site already static-first.)

## 5. Bilingual strategy

- **Primary language per pillar** (see table). A German agency article gets an EN "method box" only if the method is the point (as in a2's summary), not a full translation by default.
- **Translation rule:** full DE↔EN twins only for articles that serve both audiences *and* have distribution for both; otherwise a clearly-labelled summary in the other language with a link. Machine translation is never published unreviewed.
- **URL pattern proposal:** `/en/blog/<slug>` and `/blog/<slug>` (DE default), or a single `/blog` with language field — decide with Agent C; consistency beats cleverness.

## 6. Publishing & refresh workflow

```
draft (this folder) → evidence check (sources resolve; numbers reproduce) → claim review
(proof labels; no superiority claims) → rights review (X postings/candidates/licensed content?)
→ voice edit (owner) → site pipeline (Agent C/D interface) → publish (owner go)
→ derivative plan executed (LinkedIn + newsletter + Reddit-contextual)
→ 7-day check (was it actually read? any corrections?) → quarterly refresh
```

**Refresh policy:** every article stores an "as of" date per dated fact; quarterly pass re-checks; benchmarks re-run when the underlying code moves; corrections are visible ("Update, 2026-01: …") — never silent edits.

**Kill rule:** an article that after 2 quarters has neither traffic nor a distribution role (referenced by sales conversations, newsletters, or pilots) gets archived with a redirect — the blog is a working surface, not a graveyard.

## 7. Derivative map (every article → ≥1 derivative)

| Article | LinkedIn | Newsletter | Reddit (contextual, rules permitting) |
|---|---|---|---|
| a1 | P1/P2 (EN) | N1 section | r/arbeitsleben-type community question (no link unless allowed) |
| a2 | P4 (DE) | N1 main item | r/recruiting method answer |
| a3 | P5 (EN) | N2 item | builder-adjacent subs where allowed |

## 8. Review gates (article-level, no exceptions)

Before publish: (1) unique-evidence requirement met ✅; (2) all sources resolve & quotes match; (3) numbers ≥2× re-checked against source file; (4) rights review for every quoted line; (5) no comparative/superlative claims unless directly sourced; (6) CTA link works + UTM; (7) owner sign-off recorded in `distribution-checklist.md` log.
