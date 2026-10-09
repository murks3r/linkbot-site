import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { FormEvent } from 'react';
import {
  DEFAULT_PAGE_SIZE,
  SORT_LABELS,
  type JobSearchPage,
  type JobSearchQuery,
  type SearchSort,
} from '../adapter.ts';
import { selectJobSearchAdapter } from '../create-adapter.ts';
import { JOBS_ROUTES } from '../config.ts';
import { compactNumber } from '../lib/format.ts';
import {
  EMPTY_SAVED,
  createSavedStore,
  isJobSaved,
  isSearchWatched,
} from '../lib/saved.ts';
import {
  EMPTY_REVIEW_FLAGS,
  countActiveFilters,
  parseReviewFlags,
  parseSearchQuery,
  toSearchParams,
  type ReviewFlags,
} from '../lib/url-state.ts';
import type { JobOpportunity } from '../types.ts';
import { Filters, type FilterOption } from './Filters.tsx';
import { Glyph } from './Glyph.tsx';
import { JobCard } from './JobCard.tsx';

const SEARCH_EXAMPLES = [
  'senior backend engineer',
  'remote data',
  'product designer Berlin',
  'nurse',
];

type Status = 'idle' | 'loading' | 'ready' | 'error';

export interface JobSearchAppProps {
  /** State used for the server-rendered first paint. */
  initialQuery: JobSearchQuery;
  /** First page, server-rendered when supply is available at build time. */
  initialPage: JobSearchPage | null;
  occupations: FilterOption[];
  countries: FilterOption[];
  adapterId: string;
  adapterKind: 'fixture' | 'live';
}

function pageIndexFromParams(params: URLSearchParams): number {
  const raw = Number(params.get('page'));
  return Number.isFinite(raw) && raw >= 1 ? Math.trunc(raw) : 1;
}

/**
 * The discovery experience. One island so that the URL, the filter state, the
 * result page and the saved state can never disagree with each other.
 *
 * The URL is the source of truth: every state change writes it (replaceState)
 * and `popstate` restores from it, so any result set is shareable and the back
 * button behaves.
 */
export function JobSearchApp({
  initialQuery,
  initialPage,
  occupations,
  countries,
  adapterId,
  adapterKind,
}: JobSearchAppProps) {
  const [mounted, setMounted] = useState(false);
  const [flags, setFlags] = useState<ReviewFlags>(EMPTY_REVIEW_FLAGS);
  const [query, setQuery] = useState<JobSearchQuery>(initialQuery);
  const [draft, setDraft] = useState(initialQuery.text ?? '');
  const [page, setPage] = useState<JobSearchPage | null>(initialPage);
  const [pageIndex, setPageIndex] = useState(1);
  const [status, setStatus] = useState<Status>(initialPage ? 'ready' : 'loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [reloadNonce, setReloadNonce] = useState(0);

  const requestId = useRef(0);
  const adapter = useMemo(() => selectJobSearchAdapter({ review: flags }), [flags]);
  /** Identity of the current query — object identity changes must not refetch. */
  const queryKey = useMemo(() => toSearchParams(query).toString(), [query]);
  const savedStore = useMemo(() => createSavedStore(), []);
  const savedState = useSyncExternalStore(
    savedStore.subscribe,
    savedStore.getState,
    () => EMPTY_SAVED,
  );

  /* ---- one-time: read the real URL, adopt review flags ------------------ */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = parseSearchQuery(params);
    const nextFlags = parseReviewFlags(params);
    setFlags(nextFlags);
    setQuery(fromUrl);
    setDraft(fromUrl.text ?? '');
    setPageIndex(pageIndexFromParams(params));
    setMounted(true);
  }, []);

  /* ---- ticking clock: freshness labels and the stale state --------------- */
  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const runSearch = useCallback(
    async (nextQuery: JobSearchQuery) => {
      const id = ++requestId.current;
      setStatus('loading');
      try {
        const result = await adapter.search(nextQuery);
        if (id !== requestId.current) return; // a newer request superseded this one
        setPage(result);
        setErrorMessage(null);
        setStatus('ready');
        setNowMs(Date.now());
      } catch (error) {
        if (id !== requestId.current) return;
        setErrorMessage(error instanceof Error ? error.message : String(error));
        setStatus('error');
      }
    },
    [adapter],
  );

  /* ---- fetch whenever the query changes (after hydration) ----------------
   * The server-rendered page is a build-time sample, not a live observation,
   * so one refresh always runs after mount: it gives the page a real
   * `fetchedAt` (which drives the stale-data state) without a flash of
   * "updating" before the first paint.
   */
  useEffect(() => {
    if (!mounted) return;
    void runSearch(query);
  }, [mounted, queryKey, reloadNonce, runSearch]);

  /* ---- persist the query into the URL ----------------------------------- */
  useEffect(() => {
    if (!mounted) return;
    const params = toSearchParams(query);
    if (pageIndex > 1) params.set('page', String(pageIndex));
    // Preserve review-only switches so a reload keeps the same review state.
    const current = new URLSearchParams(window.location.search);
    for (const key of ['review_stale', 'review_fail', 'review_fixture', 'review_latency']) {
      const value = current.get(key);
      if (value !== null) params.set(key, value);
    }
    const next = `${window.location.pathname}?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (next !== currentUrl) window.history.replaceState(null, '', next);
  }, [mounted, query, pageIndex]);

  /* ---- back/forward ------------------------------------------------------ */
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(parseSearchQuery(params));
      setPageIndex(pageIndexFromParams(params));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const applyPatch = useCallback((patch: Partial<JobSearchQuery>) => {
    setQuery((previous) => ({ ...previous, ...patch, cursor: null }));
    setPageIndex(1);
  }, []);

  const onSubmitSearch = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      applyPatch({ text: draft.trim() || undefined });
    },
    [applyPatch, draft],
  );

  const runExample = useCallback(
    (example: string) => {
      setDraft(example);
      applyPatch({ text: example });
    },
    [applyPatch],
  );

  const resetAll = useCallback(() => {
    setDraft('');
    setQuery({ sort: 'relevance' });
    setPageIndex(1);
  }, []);

  const onToggleSave = useCallback(
    (job: JobOpportunity) => savedStore.toggleJob(job),
    [savedStore],
  );

  const activeFilterCount = countActiveFilters(query);
  const items = page?.items ?? [];
  const total = page?.total ?? null;
  const isStale =
    status === 'ready' && page !== null && nowMs - Date.parse(page.fetchedAt) > page.staleAfterMs;
  const watched = isSearchWatched(savedState, query);
  const offset = (pageIndex - 1) * DEFAULT_PAGE_SIZE;

  const announcement =
    status === 'loading'
      ? 'Updating results'
      : status === 'error'
        ? 'Search failed'
        : `${compactNumber(total)} ${
            total === 1 ? 'opportunity' : 'opportunities'
          } matched` + (items.length === 0 ? '. No results to show' : '');

  return (
    <div>

      {/* ---------------- search ---------------- */}
      <form className="lbj-search" role="search" onSubmit={onSubmitSearch}>
        <div className="lbj-search__field">
          <label className="j-sr" htmlFor="jobsite-q">
            Search opportunities by title, employer, skill or location
          </label>
          <input
            id="jobsite-q"
            className="lbj-search__input"
            type="search"
            name="q"
            autoComplete="off"
            placeholder="Try “senior backend engineer remote Europe”, or a skill, employer or city"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </div>
        <div className="lbj-search__field">
          <button type="submit" className="lbj-btn lbj-btn--block">
            <Glyph name="search" size={14} />
            Search
          </button>
        </div>
        <p className="lbj-search__hint">
          {draft.trim() || query.text ? (
            <button type="button" onClick={() => { setDraft(''); applyPatch({ text: undefined }); }}>
              Clear search text
            </button>
          ) : (
            <>
              Try:{' '}
              {SEARCH_EXAMPLES.map((example, i) => (
                <span key={example}>
                  {i > 0 ? ' · ' : ''}
                  <button type="button" onClick={() => runExample(example)}>
                    {example}
                  </button>
                </span>
              ))}
            </>
          )}
        </p>
      </form>

      {/* ---------------- filters + results ---------------- */}
      <div className="lbj-layout">
        <div className="lbj-filters">
          <div className="lbj-filters__bar">
            <button
              type="button"
              className="lbj-btn lbj-btn--quiet lbj-filters__toggle"
              aria-expanded={filtersOpen}
              aria-controls="jobsite-filters"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              <Glyph name={filtersOpen ? 'chevronLeft' : 'chevronRight'} size={12} />
            </button>
            <a className="lbj-btn lbj-btn--quiet lbj-btn--sm" href={JOBS_ROUTES.saved}>
              Saved{savedState.jobs.length > 0 ? ` (${savedState.jobs.length})` : ''}
            </a>
          </div>

          <Filters
            query={query}
            onChange={applyPatch}
            occupations={occupations}
            countries={countries}
            facets={page?.facets}
            onReset={resetAll}
            open={filtersOpen}
          />
        </div>

        <section className="lbj-results" aria-labelledby="jobsite-results-heading">
          <h2 id="jobsite-results-heading" className="j-sr">
            Opportunities
          </h2>

          <div className="lbj-results__bar">
            <p className="lbj-count">
              {status === 'error' ? (
                <span>Search failed</span>
              ) : (
                <>
                  <strong>{total === null ? '—' : compactNumber(total)}</strong>{' '}
                  {total === 1 ? 'opportunity' : 'opportunities'}
                  {total === null ? <span className="j-muted"> (count unavailable)</span> : null}
                </>
              )}
            </p>
            <div className="lbj-results__tools">
              <label htmlFor="jobsite-sort">Sort</label>
              <select
                id="jobsite-sort"
                className="lbj-select"
                value={query.sort ?? 'relevance'}
                onChange={(event) => applyPatch({ sort: event.target.value as SearchSort })}
              >
                {(Object.keys(SORT_LABELS) as SearchSort[]).map((sort) => (
                  <option key={sort} value={sort}>
                    {SORT_LABELS[sort]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="lbj-btn lbj-btn--quiet lbj-btn--sm"
                aria-pressed={watched}
                onClick={() => savedStore.toggleSearch(query)}
              >
                <Glyph name={watched ? 'check' : 'bookmark'} size={12} />
                {watched ? 'Watching this search' : 'Watch this search'}
              </button>
            </div>
          </div>

          <p className="j-sr" role="status" aria-live="polite">
            {announcement}
          </p>

          {activeFilterCount > 0 ? (
            <div className="lbj-active-filters">
              {query.text ? (
                <span className="lbj-chip">
                  “{query.text}”
                  <button
                    type="button"
                    className="lbj-chip__x"
                    aria-label={`Remove filter: search text ${query.text}`}
                    onClick={() => { setDraft(''); applyPatch({ text: undefined }); }}
                  >
                    ×
                  </button>
                </span>
              ) : null}
              {query.occupationIds?.map((id) => (
                <span className="lbj-chip" key={`occ-${id}`}>
                  {occupations.find((o) => o.value === id)?.label ?? id}
                  <button
                    type="button"
                    className="lbj-chip__x"
                    aria-label={`Remove filter: occupation ${id}`}
                    onClick={() => applyPatch({ occupationIds: [] })}
                  >
                    ×
                  </button>
                </span>
              ))}
              {query.countryCodes?.map((code) => (
                <span className="lbj-chip" key={`country-${code}`}>
                  {code === 'unknown'
                    ? 'Country not stated'
                    : countries.find((c) => c.value === code)?.label ?? code}
                  <button
                    type="button"
                    className="lbj-chip__x"
                    aria-label={`Remove filter: country ${code}`}
                    onClick={() => applyPatch({ countryCodes: [] })}
                  >
                    ×
                  </button>
                </span>
              ))}
              {query.locationText ? (
                <span className="lbj-chip">
                  Location: {query.locationText}
                  <button
                    type="button"
                    className="lbj-chip__x"
                    aria-label="Remove filter: location"
                    onClick={() => applyPatch({ locationText: undefined })}
                  >
                    ×
                  </button>
                </span>
              ) : null}
              {query.workModes?.map((mode) => (
                <span className="lbj-chip" key={`wm-${mode}`}>
                  Work mode: {mode === 'unknown' ? 'Unknown' : mode}
                  <button
                    type="button"
                    className="lbj-chip__x"
                    aria-label={`Remove filter: work mode ${mode}`}
                    onClick={() =>
                      applyPatch({ workModes: (query.workModes ?? []).filter((m) => m !== mode) })
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
              {query.employmentTypes?.map((type) => (
                <span className="lbj-chip" key={`et-${type}`}>
                  Type: {type === 'unknown' ? 'Unknown' : type.replace('_', '-')}
                  <button
                    type="button"
                    className="lbj-chip__x"
                    aria-label={`Remove filter: employment type ${type}`}
                    onClick={() =>
                      applyPatch({
                        employmentTypes: (query.employmentTypes ?? []).filter((t) => t !== type),
                      })
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
              {query.salaryMin != null ? (
                <span className="lbj-chip">
                  <span className="j-num">
                    ≥ {compactNumber(query.salaryMin)} {query.salaryCurrency ?? ''}
                  </span>{' '}
                  stated
                  <button
                    type="button"
                    className="lbj-chip__x"
                    aria-label="Remove filter: minimum stated compensation"
                    onClick={() => applyPatch({ salaryMin: null })}
                  >
                    ×
                  </button>
                </span>
              ) : null}
              {query.postedWithinDays != null ? (
                <span className="lbj-chip">
                  Last {query.postedWithinDays} day{query.postedWithinDays === 1 ? '' : 's'}
                  <button
                    type="button"
                    className="lbj-chip__x"
                    aria-label="Remove filter: recency"
                    onClick={() => applyPatch({ postedWithinDays: null })}
                  >
                    ×
                  </button>
                </span>
              ) : null}
              {query.includeClosed ? (
                <span className="lbj-chip">
                  Includes closed postings
                  <button
                    type="button"
                    className="lbj-chip__x"
                    aria-label="Remove filter: include closed postings"
                    onClick={() => applyPatch({ includeClosed: false })}
                  >
                    ×
                  </button>
                </span>
              ) : null}
            </div>
          ) : null}

          {isStale ? (
            <div className="lbj-alert lbj-alert--stale" role="status">
              <Glyph name="alert" size={16} />
              <div className="lbj-alert__body">
                <p className="lbj-alert__title">This result may be stale</p>
                <p className="lbj-alert__text">
                  Last retrieved {page ? compactNumber(Math.round((nowMs - Date.parse(page.fetchedAt)) / 1000)) : '?'}{' '}
                  seconds ago (source: {adapterId}). Postings can close between observations —
                  always confirm on the original posting.
                </p>
                <button
                  type="button"
                  className="lbj-btn lbj-btn--quiet lbj-btn--sm"
                  onClick={() => setReloadNonce((n) => n + 1)}
                >
                  Check again
                </button>
              </div>
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="lbj-alert lbj-alert--error" role="alert">
              <Glyph name="error" size={16} />
              <div className="lbj-alert__body">
                <p className="lbj-alert__title">The search could not be completed</p>
                <p className="lbj-alert__text">
                  {errorMessage ?? 'Unknown error.'} Nothing was changed; your filters are intact.
                </p>
                <button
                  type="button"
                  className="lbj-btn lbj-btn--quiet lbj-btn--sm"
                  onClick={() => setReloadNonce((n) => n + 1)}
                >
                  Try again
                </button>
              </div>
            </div>
          ) : null}

          <div aria-busy={status === 'loading'}>
            {status === 'loading' && page === null ? (
              <ul className="lbj-list" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <li className="lbj-skeleton" key={i}>
                    <div className="lbj-skeleton__line lbj-skeleton__line--title" />
                    <div className="lbj-skeleton__line lbj-skeleton__line--meta" />
                    <div className="lbj-skeleton__line lbj-skeleton__line--short" />
                  </li>
                ))}
              </ul>
            ) : null}

            {status === 'loading' && page !== null ? (
              <p className="lbj-filter-note lbj-note-pad">
                Updating results…
              </p>
            ) : null}

            {status !== 'error' && page !== null && items.length > 0 ? (
              <ul className="lbj-list">
                {items.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    nowMs={nowMs}
                    saved={isJobSaved(savedState, job.id)}
                    onToggleSave={onToggleSave}
                    detailHref={JOBS_ROUTES.detail(job.id)}
                  />
                ))}
              </ul>
            ) : null}

            {status === 'ready' && items.length === 0 ? (
              <div className="lbj-state">
                <h3 className="lbj-state__title j-display">No opportunities matched.</h3>
                <p className="lbj-state__text">
                  {activeFilterCount > 0
                    ? 'Nothing in the current supply satisfies every filter. Narrowing fewer dimensions usually helps more than widening one.'
                    : 'The current supply returned no opportunities at all.'}
                </p>
                <div className="lbj-state__actions">
                  {activeFilterCount > 0 ? (
                    <button type="button" className="lbj-btn lbj-btn--quiet" onClick={resetAll}>
                      Reset all filters
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="lbj-btn lbj-btn--quiet"
                    aria-pressed={watched}
                    onClick={() => savedStore.toggleSearch(query)}
                  >
                    <Glyph name={watched ? 'check' : 'bookmark'} size={12} />
                    {watched ? 'Watching this search' : 'Watch this search instead'}
                  </button>
                  <a className="lbj-btn lbj-btn--link" href={JOBS_ROUTES.saved}>
                    See saved searches
                  </a>
                </div>
                <p className="lbj-filter-note">
                  A search watch records the query and, in the product, asks the private job agent
                  to look for new postings that match it. In this preview it is stored in this
                  browser only.
                </p>
              </div>
            ) : null}
          </div>

          {page !== null && items.length > 0 ? (
            <nav className="lbj-pagination" aria-label="Result pages">
              <span className="lbj-pagination__status">
                {total === null ? (
                  <>
                    Showing {compactNumber(items.length)} result{items.length === 1 ? '' : 's'} on
                    page <span className="j-num">{compactNumber(pageIndex)}</span>
                  </>
                ) : (
                  <>
                    Showing <span className="j-num">{compactNumber(offset + 1)}</span>–
                    <span className="j-num">{compactNumber(offset + items.length)}</span> of{' '}
                    <span className="j-num">{compactNumber(total)}</span>
                    {' · page '}
                    <span className="j-num">{compactNumber(pageIndex)}</span>
                  </>
                )}
              </span>
              <button
                type="button"
                className="lbj-btn lbj-btn--quiet lbj-btn--sm"
                disabled={!page.prevCursor}
                onClick={() => {
                  if (!page.prevCursor) return;
                  setQuery((q) => ({ ...q, cursor: page.prevCursor }));
                  setPageIndex((i) => Math.max(1, i - 1));
                }}
              >
                <Glyph name="chevronLeft" size={12} />
                Previous
              </button>
              <button
                type="button"
                className="lbj-btn lbj-btn--quiet lbj-btn--sm"
                disabled={!page.nextCursor}
                onClick={() => {
                  if (!page.nextCursor) return;
                  setQuery((q) => ({ ...q, cursor: page.nextCursor }));
                  setPageIndex((i) => i + 1);
                }}
              >
                Next
                <Glyph name="chevronRight" size={12} />
              </button>
            </nav>
          ) : null}

          {page !== null ? (
            <p className="lbj-filter-note lbj-note-pad-lg">
              {adapterKind === 'fixture' ? (
                <>
                  Fixture supply · <span className="j-num">{adapterId}</span>. These are not live
                  postings. Each card names the source it was observed from.
                </>
              ) : (
                <>
                  Live supply · <span className="j-num">{adapterId}</span>. Freshness reflects the
                  last observation, not a guarantee that the posting is still open.
                </>
              )}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
