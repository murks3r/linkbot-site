# QA evidence — jobsite

Everything below was actually run on 2026-10-09 against the built output
(`npm run build`, served by `astro preview` on `127.0.0.1:4321`), driven through
a real browser at 1440×1500 and 390×844.

## Commands

```
$ npm run typecheck
Result (43 files): 0 errors, 0 warnings, 0 hints

$ npm test
ℹ tests 57
ℹ pass 57
ℹ fail 0

$ npm run build
[build] 47 page(s) built in 2.84s
[build] Complete!
```

47 pages = the marketing home + 3 jobsite routes + 42 fixture detail pages.

## Automated assertions of the requirements

| Requirement | Where it is proved |
| --- | --- |
| UNKNOWN is a first-class filter value, not an absence | `tests/jobsite-adapter.test.mjs` — *work mode: unset means any (including unknown); unknown is selectable*, *country filter honours the explicit unknown token* |
| Unknown values are distinct in the UI and never blanks | browser: the unknown-only filter returns one card whose meta row reads `Location unknown`, `Work mode unknown`, `Compensation not stated`, each with a ring glyph |
| Filters with explicit UNKNOWN behaviour (salary, recency) | `tests/jobsite-adapter.test.mjs` — *a salary filter excludes unstated compensation and foreign currencies*, *a recency filter excludes postings with no publication date* |
| Result counts, sorting, pagination | browser: `41 opportunities`, `Showing 1–10 of 41 · page 1`, `salary_desc` ordering, `page 2` via cursor, `Previous` restores page 1; unit: *cursor pagination walks the whole result set exactly once* (no duplicates, no omissions) |
| Stable ids, canonical identity | unit: *the fixture dataset is a labelled, internally consistent fixture set*, *two sources of one posting share a canonical id but not a local id*, *getById resolves a local id and a canonical id* |
| Provenance and observed/published dates | browser detail page: Source, Source kind, Source URL, Observed, Published, Last modified, Canonical id, Local id, Observed via |
| Validity/withdrawal status | unit: *closed postings are excluded by default and included on request*, *an unknown status is not treated as closed* |
| Original application links | browser: every apply link is `target="_blank" rel="noopener noreferrer nofollow"`; 0 external links missing `rel` |
| Empty / loading / error / stale states | browser: see the state table below |
| Keyboard navigation and focus | browser: 14-stop tab order recorded; a filter checkbox focusable and toggled with `Space`; focus ring `rgb(29, 91, 69)` |
| Mobile layout | browser at 390px: no horizontal overflow, filters collapsed behind a disclosure, search box 501px from the top of an 844px viewport |
| Accessible labelling | browser audit: 0 unlabelled controls, 8 fieldset/legend groups, 1 `<h1>`, `role="status" aria-live="polite"` result announcer, `aria-controls` resolves, skip link, `main` landmark |
| noindex / no production dependency | `/jobs` and `/jobs/<id>` carry `noindex, nofollow, noarchive, nosnippet`; the sitemap contains 0 `/jobs` URLs; `robots.txt` disallows `/jobs` |

## States, as observed in the browser

| State | Trigger | Observed |
| --- | --- | --- |
| Loading | any query change | skeleton rows on first paint; "Updating results…" while a previous page stays visible |
| Empty | `?q=zzzz-nothing-matches&wm=onsite` | `0 opportunities`, "No opportunities matched.", actions: Reset all filters / Watch this search instead / See saved searches, plus both filter chips |
| Error | `?review_fail=1` | `role="alert"`, "The search could not be completed", the adapter message, "Try again", 0 cards |
| Stale | `?review_stale=1` | `role="status"`, "This result may be stale", "Last retrieved 360 seconds ago (source: fixture-v1)", "Check again", 10 cards still rendered |
| Fixture notice | always, in fixture mode | "Proposed direction — Notarial (not approved)" + "Preview — sample data" + "Preview fixture data. Sample data for preview only. …" |

## Interaction trace (desktop)

- Filter Work mode → Unknown ⇒ `?wm=unknown`, count `1 opportunity`, card = *Operations Coordinator (arrangements not stated)*.
- Sort → Compensation high→low ⇒ `?sort=salary_desc`, top bands `CHF 95,000–130,000`, `€110,000–130,000`, and the `SEK …/month (as posted)` band present with its period labelled as posted.
- Next ⇒ `?sort=salary_desc&cursor=fx1.bzoxMA%3D%3D&page=2`, `Showing 11–20 of 41 · page 2`, `Previous` enabled; `Previous` ⇒ back to `Showing 1–10 of 41`, `Previous` disabled.
- Save on the first card ⇒ `aria-pressed="true"`, persists across reload, appears as "Saved opportunities (1)" on `/jobs/saved`.
- Express private interest on a detail page ⇒ `aria-pressed="true"`, "Interest expressed privately", the private-agent explainer panel appears, and `/jobs/saved` lists it under "Expressed interest (1)" separately from saved jobs.
- Keyboard: `Tab` order = skip link → brand → Discover → Saved → Request private access → search input → Search → 4 example buttons → occupation → country → location → … ; `Space` on the Remote checkbox ⇒ `checked=true`, `?wm=remote`, count `10 opportunities`.

## Known limitations found during review (and fixed)

- The external-link glyph wrapped onto its own line (Tailwind preflight sets
  `svg { display: block }`). Fixed in `jobsite.css` and re-verified.
- The header CTA's white label was repainted by the generic body-link colour.
  Fixed by scoping the link colour to anchors without a jobsite component class.
- A city-state rendered as `Berlin, Berlin, Germany`. Fixed in the fixture
  builder, with a regression assertion in the dataset test.

## Known limitations that are *not* fixed, and are not hidden

- `/jobs/<id>` is statically generated, so it only serves the fixture set. Live
  supply needs an on-demand route (see the handoff).
- The `HttpSearchAdapter` has never spoken to a live endpoint; its mapping is
  tested against a synthetic payload only.
- Client-side rendering only: the first page is rendered at build time and then
  refreshed on mount. A production deployment should server-render the first
  page (the adapter is already isomorphic).
- Fonts are still loaded from Google Fonts. Brand Direction A prefers
  self-hosted OFL files; that is a follow-up for whichever direction is
  approved.
