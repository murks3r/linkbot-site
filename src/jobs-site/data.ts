/* The jobs site's switches and its board, read once per build. Every value comes from the environment, so one build
   command makes the site (SITE_TARGET=jobs, astro.config.mjs):
   - PUBLIC_NAME: the name the public reads (header, titles, footer). No name is chosen yet (the owner's), so the
     default is the plain word "Jobs".
   - SITE_URL: the origin (astro.config.mjs; the default is the .invalid placeholder, which never resolves).
   - JOBS_PUBLISHED=1: the owner's publication go. Until then every page is noindex, robots.txt refuses every crawler
     and the build writes no sitemap.
   - JOBS_CATALOGUE_URL: the catalogue's read API (its base, ending in /jobs-catalogue). Unset or failing, the board
     falls back to the snapshot.
   - JOBS_SNAPSHOT: where the last good read is kept (default .cache/jobs-snapshot.json); a good read rewrites it.
   The board's rules are src/jobs/feed.ts. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { chooseBoard, parseSnapshot, readCatalogue, type BoardState, type Snapshot } from '../jobs/feed.ts';

export const JOBS_NAME = process.env.PUBLIC_NAME?.trim() || 'Jobs';
export const PUBLISHED = process.env.JOBS_PUBLISHED === '1';
export const JOBS_LANGS = ['en', 'de'] as const;
export type JobsLang = typeof JOBS_LANGS[number];

/** The party keys of participating employers (JL-11's read, not served yet): none, so every listing is sourced. */
export const PARTICIPATING: ReadonlySet<string> = new Set();

const SNAPSHOT = process.env.JOBS_SNAPSHOT || '.cache/jobs-snapshot.json';

const load = async (): Promise<BoardState> => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  let read: Snapshot | null = null;
  const base = process.env.JOBS_CATALOGUE_URL;
  if (base) {
    try { read = await readCatalogue(base, fetch, now); } catch (error) { console.warn(`[jobs] catalogue not read: ${(error as Error).message}`); }
  }
  const stored = parseSnapshot(await readFile(SNAPSHOT, 'utf8').catch(() => null));
  const state = chooseBoard(read, stored, today);
  if (state.kind === 'listings' && state.from === 'catalogue' && read) {
    await mkdir(dirname(SNAPSHOT), { recursive: true });
    await writeFile(SNAPSHOT, JSON.stringify(read));
  }
  return state;
};

let board: Promise<BoardState> | undefined;
/** The board's state for this build; every page asks the same promise, so the catalogue is read once. */
export const boardState = (): Promise<BoardState> => (board ??= load());
