# Jobsite — public job discovery (preview)

A fast, accessible public job-discovery experience at **`/jobs`**, intended as
the future main entry point to Linkbot. It makes the product useful before
registration and introduces the private job agent without exposing anything.

- **Route under review:** `/jobs`
- **Related routes:** `/jobs/<opportunity-id>` (detail), `/jobs/saved` (local list)
- **Supply in this preview:** labelled local fixtures, not a live catalogue
- **Branch:** `parallel/jobsite-web-v1` (draft PR only; no merge, no deploy)

## What is real, what is fixture, what is blocked

| Area | Status |
| --- | --- |
| Discovery UI (search, filters, sort, cursor paging, all states, a11y) | **Real.** Working code, exercised in a browser. |
| Search adapter contract (`JobSearchAdapter`) | **Real** and typed. Two implementations. |
| Canonical/Universal Supply adapter | **Real code, unexercised.** Written and unit-tested against a fixture payload; it has never spoken to a live endpoint. |
| Job records on the page | **Fixture.** 44 synthetic records; every employer, posting and URL is invented and on the reserved `example.com` domain. Labelled in the UI, not just in the code. |
| Saved jobs, search watches, expressed interest | **Real behaviour, local only.** `localStorage` for this origin. No server list, no account. |
| Live job supply | **Blocked** on the canonical Universal Supply API. See `supply-integration-handoff.md`. |
| Brand Direction A (Notarial) | **Proposed, not approved.** Applied only to the jobsite, scoped to `.lbj`. See `brand-usage.md`. |
| Detail pages for live supply | **Blocked.** `/jobs/<id>` is statically generated, which only works for the fixture set. It must become an on-demand route once supply is live. |

## Run it locally

```bash
npm install
npm run dev          # http://localhost:4321/jobs
# or the built output
npm run build && npm run preview
```

Verification commands:

```bash
npm run typecheck    # astro check — 0 errors, 0 warnings (43 files)
npm test             # node:test — 57 tests
npm run build        # 47 pages
```

The preview does not depend on `linkbot.org`. Set `PUBLIC_SITE_ORIGIN` to the
preview origin to emit canonical/og URLs; if it is unset, no canonical is
emitted at all rather than one pointing at a domain the preview does not own.
Every jobsite page is `noindex`, excluded from the sitemap, and `robots.txt`
disallows `/jobs`.

## Review controls

These URL switches exist only to make the states reviewable. They are not part
of a normal visitor flow.

| URL | Shows |
| --- | --- |
| `/jobs?review_stale=1` | The stale-data state (the page's `fetchedAt` is backdated past its staleness window). |
| `/jobs?review_fail=1` | The error state (the adapter is forced to reject). |
| `/jobs?review_fixture=1` | Forces fixtures even when a supply origin is configured. |
| `/jobs?review_latency=1500` | Slows the adapter so the loading state is visible. |

## A suggested 5-minute review walkthrough

1. `/jobs` — the list, the result count, the density of a card, the source line
   on each card. Note the two chips at the top: the direction is labelled
   *proposed* and the supply is labelled *sample data*.
2. Type `backend` and submit. Then tick **Work mode → Unknown**. Note that
   Unknown is a selectable value, not an absence, and the card shows a ring
   glyph plus the word — never a dash or a blank.
3. Set **Minimum stated compensation** to `80000` / `EUR` and read the note under
   the control: postings with no stated amount are excluded, and amounts are
   compared as posted, not converted.
4. Search for `zzzz` to see the empty state, then `?review_fail=1` and
   `?review_stale=1` for the error and stale states.
5. Open any card. Check the three separated actions (View / Save / Express
   private interest) and that **Apply** opens the original posting in a new tab
   with `rel="noopener noreferrer nofollow"`.
6. Save an opportunity and express interest, then visit `/jobs/saved`. Reload —
   it persists. It is in this browser only, and the page says so.
7. Resize to 390px wide. Filters collapse behind a `Filters` disclosure; there
   is no horizontal overflow; the search box stays above the fold.

## Screenshots

`docs/jobsite/screenshots/` — captured from the built output at 1440px and
390px:

`desktop-final.png` (results), `desktop-unknown-workmode.png` (the Unknown
state), `desktop-salary-desc.png` (sorting), `desktop-empty.png`,
`desktop-error.png`, `desktop-stale.png`, `desktop-detail.png`,
`desktop-detail-unknowns.png`, `desktop-detail-interest.png`,
`desktop-saved.png`, `desktop-saved-interest.png`, `mobile-fold.png`,
`mobile-filters-open.png`, `mobile-filtered-remote.png`.

## What was deliberately not done

- No second jobs database and no scraper. Supply arrives through one adapter.
- No rewrite of the marketing home, the agency page, `global.css`, `SEO.astro`
  or any application backend. The jobsite is a new, isolated subtree
  (`src/jobsite/**`, `src/pages/jobs/**`) with its own layout and stylesheet.
- No global rebrand. The Notarial tokens are local to `.lbj`.
- No fabricated live data, and no `JobPosting` structured data: marking fixture
  records up as job postings would present them to search engines as a real
  catalogue.
