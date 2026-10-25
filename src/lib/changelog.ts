/* What's new: one dated entry per product step a customer can notice, read at build time from docs/changelog.yml, the
   one source for /changelog. Every entry names its sources (a repository of murks3r and a PR number each), says honestly where
   it stands, and has its sentence in every language; an entry that lacks any of it throws, so the build stops. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { LANGS, type Lang } from '../i18n/locales.ts';

export const ENTRY_STATES = ['on staging', 'built'] as const;
export type EntryState = (typeof ENTRY_STATES)[number];
export interface Source { repo: string; pr: number }
export interface Entry { date: string; state: EntryState; sources: Source[]; text: Record<Lang, string> }

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isState = (value: unknown): value is EntryState => (ENTRY_STATES as readonly unknown[]).includes(value);

const entry = (raw: unknown, index: number): Entry => {
  const at = `docs/changelog.yml, entry ${index + 1}`;
  if (!isRecord(raw)) throw new Error(`${at}: not a mapping`);
  const { date, state, sources, text } = raw;
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) throw new Error(`${at}: no date (YYYY-MM-DD, quoted)`);
  if (!isState(state)) throw new Error(`${at}: the state “${String(state)}” is not one of ${ENTRY_STATES.join(', ')}`);
  if (!Array.isArray(sources) || sources.length === 0) throw new Error(`${at}: no source`);
  for (const source of sources) {
    if (!isRecord(source) || typeof source.repo !== 'string' || !/^murks3r\/[a-z0-9-]+$/.test(source.repo)) throw new Error(`${at}: a source without a repository (murks3r/<name>)`);
    if (!Number.isInteger(source.pr) || (source.pr as number) < 1) throw new Error(`${at}: a source without a PR number`);
  }
  if (!isRecord(text)) throw new Error(`${at}: no text`);
  for (const lang of LANGS) if (typeof text[lang] !== 'string' || !(text[lang] as string).trim()) throw new Error(`${at}: no text in ${lang}`);
  const extra = Object.keys(text).filter(key => !(LANGS as readonly string[]).includes(key));
  if (extra.length) throw new Error(`${at}: text in a language the site does not offer (${extra.join(', ')})`);
  return { date, state, sources: sources.map(({ repo, pr }) => ({ repo, pr })), text: text as Record<Lang, string> };
};

/** The entries of a changelog, newest first; throws on any malformed entry, so a bad edit stops the build. */
export const parseChangelog = (source: string): Entry[] => {
  const data: unknown = parse(source);
  if (!isRecord(data) || !Array.isArray(data.entries) || data.entries.length === 0) throw new Error('docs/changelog.yml: no entries');
  return data.entries.map(entry).sort((a, b) => b.date.localeCompare(a.date));
};

/** The changelog of this repository. Run from the repository's root, as the build and the tests are. */
export const loadChangelog = (): Entry[] => parseChangelog(readFileSync(join(process.cwd(), 'docs/changelog.yml'), 'utf8'));

/** The entries grouped by day, newest day first, in the order the file gives within a day. */
export const byDay = (entries: Entry[]): [string, Entry[]][] => {
  const days = new Map<string, Entry[]>();
  for (const item of entries) days.set(item.date, [...(days.get(item.date) ?? []), item]);
  return [...days];
};
