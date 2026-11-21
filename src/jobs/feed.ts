/* Where the jobs site's board gets its listings, and what it shows when it gets none. The board is never empty and never
   invented: a build reads the catalogue (its read API, contract 0.1.1-draft, CONTRACT in ./catalogue.ts: GET
   /postings, newest first, paged by next_cursor); when that read fails or returns no live listing, it shows the last
   good snapshot with that snapshot's date; without one, a plain state that the listings are being refreshed, with the
   search off. No made-up posting ever reaches this board (src/jobs/recorded.ts belongs to the drafts only).
   Pure apart from readCatalogue, which takes its fetch; the build's IO is src/jobs-site/data.ts. */
import { SOURCES, WORK_MODES, isLive, type Posting, type Salary, type Source, type WorkMode } from './catalogue.ts';

/** One item of the catalogue's list (contract 0.1.1-draft, PostingSummary), as far as the board reads it. */
export interface CatalogueItem {
  id: string;
  source: string;
  fetched_at: string;
  original_url: string;
  title: string | null;
  employer: { name: string | null; board: string | null; domain?: string | null };
  location: { text: string | null; country: string | null };
  work_mode: string;
  employment_type: string | null;
  salary: { min: number | null; max: number | null; currency: string | null; period: string | null } | null;
  posted_at: string | null;
  valid_through: string | null;
  party?: string | null;
}

const PERIODS = ['year', 'month', 'hour'] as const;
const https = (url: string) => { try { return new URL(url).protocol === 'https:'; } catch { return false; } };

/** The board's posting for a catalogue item, or null when the board cannot show it honestly: a source the board does
    not name (the catalogue may add sources, and some it names are not allowed here), no title, no employer name, no
    country, or an original that is not an https address. Nothing is filled in: a missing place stays empty, a
    salary without currency or period is left out, work mode "unknown" is no work mode. */
export const fromCatalogue = (item: CatalogueItem): Posting | null => {
  if (!(SOURCES as readonly string[]).includes(item.source)) return null;
  if (!item.title || !item.employer?.name || !item.location?.country || !https(item.original_url)) return null;
  const s = item.salary;
  const salary: Salary | null = s && s.currency && s.period && (PERIODS as readonly string[]).includes(s.period) && (s.min !== null || s.max !== null)
    ? { min: s.min, max: s.max, currency: s.currency, period: s.period as Salary['period'] } : null;
  return {
    id: item.id,
    title: item.title,
    employer: item.employer.name,
    location: { place: item.location.text ?? '', country: item.location.country },
    work_mode: (WORK_MODES as readonly string[]).includes(item.work_mode) ? item.work_mode as WorkMode : null,
    employment_type: item.employment_type,
    salary,
    source: item.source as Source,
    fetched_at: item.fetched_at,
    original_url: item.original_url,
    posted_at: item.posted_at,
    valid_through: item.valid_through,
    party: item.party ?? null,
    employer_domain: item.employer.domain ?? null,
  };
};

/** What a build read: the listings and when. */
export interface Snapshot { taken_at: string; postings: Posting[] }

/** Reads every page of the catalogue's list (at most maxPages of 100). Throws when a page does not answer 200 with a
    page of items; the caller then falls back to the snapshot. */
export const readCatalogue = async (base: string, fetchPage: typeof fetch, now: Date, maxPages = 200): Promise<Snapshot> => {
  const postings: Posting[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < maxPages; page++) {
    const url = new URL(`${base.replace(/\/$/, '')}/postings`);
    url.searchParams.set('limit', '100');
    if (cursor) url.searchParams.set('cursor', cursor);
    const response = await fetchPage(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`catalogue answered ${response.status}`);
    const body = await response.json() as { items?: CatalogueItem[]; next_cursor?: string | null };
    if (!Array.isArray(body.items)) throw new Error('catalogue page without items');
    for (const item of body.items) { const p = fromCatalogue(item); if (p) postings.push(p); }
    cursor = body.next_cursor ?? null;
    if (!cursor) break;
  }
  return { taken_at: now.toISOString(), postings };
};

/** A stored snapshot, or null when the text is not one (unreadable, wrong shape, no date). */
export const parseSnapshot = (text: string | null): Snapshot | null => {
  if (!text) return null;
  try {
    const value = JSON.parse(text) as Partial<Snapshot>;
    if (typeof value.taken_at !== 'string' || Number.isNaN(Date.parse(value.taken_at)) || !Array.isArray(value.postings)) return null;
    return { taken_at: value.taken_at, postings: value.postings };
  } catch {
    return null;
  }
};

export type BoardState =
  | { kind: 'listings'; postings: Posting[]; asOf: string; from: 'catalogue' | 'snapshot' }
  | { kind: 'refreshing' };

/** The board's state: the catalogue's read when it holds a live listing, else the snapshot when it does, else
    refreshing. A read or a snapshot without a live listing counts as none: the board never shows an empty list. */
export const chooseBoard = (read: Snapshot | null, snapshot: Snapshot | null, today: string): BoardState => {
  for (const [taken, from] of [[read, 'catalogue'], [snapshot, 'snapshot']] as const) {
    const live = taken?.postings.filter(p => isLive(p, today)) ?? [];
    if (taken && live.length > 0) return { kind: 'listings', postings: live, asOf: taken.taken_at, from };
  }
  return { kind: 'refreshing' };
};

/** How a listing is labelled: sourced, unless its employer claimed its listings and takes part. participating holds the
    party keys the engine names as participating (JL-11's read; until it is served the set is empty, so every listing
    is sourced). */
export type ListingLabel = 'sourced' | 'participating';
export const labelOf = (p: Posting, participating: ReadonlySet<string>): ListingLabel =>
  p.party !== null && participating.has(p.party) ? 'participating' : 'sourced';
