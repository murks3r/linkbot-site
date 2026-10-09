# Integration handoff — Supply engineer

**Goal:** turn the fixture-backed preview into live supply without touching the
UI. The seam already exists; this is what needs to land on the other side of it.

## The change to make it live

```bash
# .env (Vercel project env for the preview/branch deployment)
PUBLIC_SUPPLY_API_ORIGIN=https://<supply-host>
```

`create-adapter.ts` then constructs `HttpSearchAdapter` instead of the fixture
adapter. No UI file changes. Verify with `/jobs?review_fixture=1`, which forces
the fixtures back on for comparison.

## What the endpoint must provide

Full shapes and rules: [`api-contract.md`](./api-contract.md). The minimum:

1. `GET /v1/opportunities` with the query parameters in §5 of the contract
   (`q`, `occupation`, `location`, `country`, `work_mode`, `employment_type`,
   `salary_min`, `salary_currency`, `posted_within_days`, `include_closed`,
   `sort`, `limit`, `cursor`).
2. `GET /v1/opportunities/{id}` — resolves a local id **or** a canonical id and
   returns `404` when there is none.
3. Response envelope `{ data, page: { next_cursor, prev_cursor, total }, meta: { generated_at } }`.
4. Unknown values as `null`. Unrecognised enum values as `"unknown"` — never a
   plausible guess.
5. Failures as non-2xx. Do not signal an error with an empty `data` array; the
   UI has separate empty and error states and depends on the difference.

## Definition of done

- [ ] `PUBLIC_SUPPLY_API_ORIGIN` set for the branch preview; the notice bar
      switches from "Preview — sample data" to "Live supply".
- [ ] `/jobs` returns real opportunities with `total`, and `Next`/`Previous`
      walk the whole set using the opaque cursor.
- [ ] Every record carries provenance (`source.name`, `source.retrieved_at`) and
      a `canonical_id`; the card's source line and the detail provenance panel
      render real values.
- [ ] `GET /v1/opportunities/{canonical_id}` resolves (see the open item below).
- [ ] `work_mode`/`employment_type`/`status` come back as enum tokens, not
      prose. A posting whose arrangement is unknown returns `"unknown"`.
- [ ] `retrieved_at` is a real ISO-8601 UTC timestamp, not the time the response
      was serialised.
- [ ] Withdrawn and expired postings are excluded by default and returned when
      `include_closed=true`.
- [ ] `npm test` still passes (the mapping tests use a synthetic payload and
      must not need internet).

## Open items that need a decision, not just code

1. **Detail route.** `/jobs/<id>` is statically generated at build time, which
   only works for a bounded fixture set. With live supply it must either become
   on-demand (Astro SSR/`output: 'server'` or an edge function) or fetch the
   record client-side by `canonicalId`. This is the one structural change the
   integration forces on the frontend, and it needs a call on hosting first.
   Until then, live mode keeps a working list and a detail page that 404s for
   records outside the built set.
2. **Total counts.** `total` may be `null` and the UI will say "count
   unavailable". If counting is expensive, returning `null` is supported and
   preferable to a made-up number.
3. **`suggest`.** Optional. Without it the search box simply has no typeahead.
4. **Facet counts.** `facets` is optional and currently only the fixture adapter
   populates it. The filter controls render counts when present.
5. **Occupation and country vocabularies.** Today the filter option lists come
   from `src/jobsite/fixtures/opportunities.ts` (`OCCUPATIONS`,
   `COUNTRY_NAMES`) and are passed into the island as props. Canonical
   vocabularies should come from supply (e.g. `/v1/vocabularies`) rather than
   being hardcoded; the props already make that a swap at the page level.
6. **Freshness expectations.** `staleAfterMs` defaults to 5 minutes. If the
   supply refreshes hourly, raise it, or the stale banner will fire constantly.
7. **Terms of use for original application links.** The UI presents `applyUrl`
   as the original posting and hands the person off. Confirm that is the
   intended relationship with each source before enabling it for that source.

## Anything that must NOT happen

- Do not add a second jobs database or an independent scraper behind this
  contract. One adapter, one supply.
- Do not put a secret in a `PUBLIC_` variable: those are inlined into the client
  bundle. Any token needed for the supply call must be brokered server-side.
- Do not let the UI present fixture data as live. `kind`, `label` and `notice`
  are part of the adapter interface precisely so the notice bar cannot drift
  from the truth.
