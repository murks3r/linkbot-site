/**
 * Saved-state tests. Everything here is local to a browser, so the storage
 * layer must be defensive: corrupt or partial data must degrade to empty, never
 * throw, and never promote a marker into something it is not (an interest is
 * not an application, and a watch is not a subscription).
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EMPTY_SAVED,
  SAVED_STORAGE_KEY,
  createSavedStore,
  describeQuery,
  loadSaved,
  persistSaved,
  toggleInterest,
  toggleSavedJob,
  toggleSavedSearch,
} from '../src/jobsite/lib/saved.ts';
import { buildFixtureOpportunities } from '../src/jobsite/fixtures/opportunities.ts';

const NOW_ISO = '2026-10-09T12:00:00.000Z';
const job = buildFixtureOpportunities(Date.parse(NOW_ISO))[0];

function memoryStorage(seed) {
  const map = new Map(Object.entries(seed ?? {}));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    dump: () => Object.fromEntries(map),
  };
}

test('saving an opportunity is reversible and stores only card-level facts', () => {
  const saved = toggleSavedJob(EMPTY_SAVED, job, NOW_ISO);
  assert.equal(saved.jobs.length, 1);
  assert.equal(saved.jobs[0].id, job.id);
  assert.equal(saved.jobs[0].canonicalId, job.canonicalId);
  assert.equal(saved.jobs[0].savedAt, NOW_ISO);
  assert.deepEqual(Object.keys(saved.jobs[0]).sort(), [
    'canonicalId',
    'employer',
    'id',
    'savedAt',
    'title',
  ]);
  assert.equal(toggleSavedJob(saved, job, NOW_ISO).jobs.length, 0);
});

test('a saved search is identified by the serialised query', () => {
  const query = { text: 'backend', workModes: ['remote'], sort: 'newest' };
  const once = toggleSavedSearch(EMPTY_SAVED, query, NOW_ISO);
  assert.equal(once.watches.length, 1);
  assert.equal(once.watches[0].query, 'q=backend&wm=remote&sort=newest');
  assert.match(once.watches[0].label, /backend/);

  // Same filters expressed differently must still be the same watch.
  const twice = toggleSavedSearch(once, { sort: 'newest', workModes: ['remote'], text: 'backend' }, NOW_ISO);
  assert.equal(twice.watches.length, 0);
});

test('an expressed interest is one-sided and separately tracked', () => {
  const interested = toggleInterest(EMPTY_SAVED, job, NOW_ISO);
  assert.equal(interested.interests.length, 1);
  assert.equal(interested.jobs.length, 0, 'interest must not silently save the job');
  assert.equal(interested.watches.length, 0, 'interest must not create a watch');
  assert.equal(toggleInterest(interested, job, NOW_ISO).interests.length, 0);
});

test('watch labels read as a human sentence', () => {
  assert.equal(describeQuery({}), 'All opportunities');
  assert.equal(
    describeQuery({ text: 'backend', workModes: ['remote', 'unknown'], countryCodes: ['DE'] }),
    'backend · Remote / Unknown · DE',
  );
  assert.match(describeQuery({ salaryMin: 60000, salaryCurrency: 'EUR' }), /≥ 60000 EUR/);
  assert.match(describeQuery({ includeClosed: true }), /incl\. closed/);
});

test('storage round-trips, and corrupt storage degrades to empty', () => {
  const storage = memoryStorage();
  persistSaved(storage, toggleSavedJob(EMPTY_SAVED, job, NOW_ISO));
  assert.equal(loadSaved(storage).jobs.length, 1);

  const corrupt = memoryStorage({ [SAVED_STORAGE_KEY]: '{not json' });
  assert.deepEqual(loadSaved(corrupt), EMPTY_SAVED);

  const partial = memoryStorage({
    [SAVED_STORAGE_KEY]: JSON.stringify({ jobs: [{ id: 'x' }, { nope: true }], watches: 'nope' }),
  });
  assert.deepEqual(loadSaved(partial), {
    jobs: [],
    watches: [],
    interests: [],
  });
});

test('a missing storage silently disables persistence instead of throwing', () => {
  assert.deepEqual(loadSaved(null), EMPTY_SAVED);
  assert.doesNotThrow(() => persistSaved(null, EMPTY_SAVED));
});

test('the store notifies subscribers and keeps its snapshot stable', () => {
  const storage = memoryStorage();
  const store = createSavedStore(storage, () => new Date(NOW_ISO));
  const seen = [];
  const unsubscribe = store.subscribe((state) => seen.push(state));

  const before = store.getState();
  assert.equal(store.getState(), before, 'the snapshot is stable until a change');

  store.toggleJob(job);
  assert.equal(store.getState() === before, false);
  assert.equal(seen.length, 1);
  assert.equal(store.getState().jobs.length, 1);
  assert.equal(loadSaved(storage).jobs.length, 1, 'changes are persisted');

  unsubscribe();
  store.clear();
  assert.deepEqual(store.getState(), EMPTY_SAVED);
  assert.equal(seen.length, 1, 'an unsubscribed listener is not called');
});
