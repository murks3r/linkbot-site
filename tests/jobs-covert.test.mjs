/* The covert yes on a real posting (src/jobs/interest.ts, the shape J2-5 plans) and its stand-in
   (src/jobs/interest-stub.ts): only a signed-in, checked person says yes, once per posting; the yes goes to the
   source and the employer's board there (a stub until J2-5); withdrawing takes it off the person's list and out of every count; a
   block covers the domain and its subdomains and applies before counting. The words say who is seen, and when. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { SIGNED_OUT, canSay, countFor, covers, mine, partyOf, sayYes, withdraw } from '../src/jobs/interest.ts';
import { MADE_UP_PERSON, stub } from '../src/jobs/interest-stub.ts';
import { RECORDED } from '../src/jobs/recorded.ts';
import { jobsBoard } from '../src/drafts/jobs-board.ts';
import { jobsMine } from '../src/drafts/jobs-mine.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const ats = RECORDED.find(p => p.source === 'greenhouse');
const other = RECORDED.find(p => p.source === 'personio');
const memory = () => { const m = new Map(); return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }; };

test('the yes goes to the source and the employer’s board there, never to the application system’s host', () => {
  assert.equal(partyOf(ats), 'greenhouse:fabrikamroboticsexample');
  assert.equal(partyOf(other), 'personio:northwind-analytics-example');
  assert.equal(partyOf({ id: 'x', source: 'lever', original_url: 'https://jobs.lever.co/Acme/123' }), 'lever:acme');
  assert.equal(partyOf({ id: 'x', source: 'recruitee', original_url: 'https://acme.recruitee.com/o/role' }), 'recruitee:acme');
  const twoOnOneSystem = RECORDED.filter(p => p.source === 'personio').map(partyOf);
  assert.equal(new Set(twoOnOneSystem).size, twoOnOneSystem.length, 'two employers on one system are two parties');
});

test('only a signed-in, checked person says yes, once; withdraw takes it off the list', () => {
  assert.equal(canSay(SIGNED_OUT, ats.id), false);
  assert.deepEqual(sayYes(SIGNED_OUT, ats, '2026-11-04T10:00:00Z'), SIGNED_OUT);
  const unchecked = { person: { ...MADE_UP_PERSON, checks: [] }, interests: [] };
  assert.equal(canSay(unchecked, ats.id), false);
  let s = { person: MADE_UP_PERSON, interests: [] };
  s = sayYes(s, ats, '2026-11-04T10:00:00Z');
  assert.equal(sayYes(s, ats, '2026-11-04T11:00:00Z'), s, 'once per posting');
  s = sayYes(s, other, '2026-11-04T12:00:00Z');
  assert.deepEqual(mine(s).map(i => i.posting_id), [other.id, ats.id], 'newest first');
  s = withdraw(s, ats.id);
  assert.deepEqual(mine(s).map(i => i.posting_id), [other.id]);
  assert.equal(s.interests.find(i => i.posting_id === ats.id).state, 'withdrawn', 'kept for the person, never counted');
  assert.equal(canSay(s, ats.id), true, 'a withdrawn yes can be said again');
});

test('a block covers the domain and its subdomains and applies before counting', () => {
  assert.ok(covers('www.Northwind.example', 'jobs.northwind.example'));
  assert.ok(!covers('wind.example', 'northwind.example'));
  assert.ok(!covers('northwind.example', 'personio:northwind'), 'a board id is never covered until J2-5 ties it to a domain');
  const party = 'northwind.example';
  const yes = (blocked, state = 'covert') => ({ person: { ...MADE_UP_PERSON, blocked }, interest: { posting_id: 'x', party, at: '', state } });
  assert.equal(countFor([yes([]), yes(['northwind.example']), yes([], 'withdrawn'), yes(['other.example'])], party), 2);
});

test('the stand-in keeps the session in its storage and sends nothing', () => {
  const api = stub(memory(), () => '2026-11-04T10:00:00Z');
  assert.equal(api.read().person, null);
  assert.equal(mine(api.say(ats)).length, 0, 'signed out, no yes');
  assert.deepEqual(api.signIn().person, MADE_UP_PERSON);
  assert.equal(mine(api.say(ats)).length, 1);
  assert.equal(mine(api.read()).length, 1, 'read back');
  assert.equal(mine(api.withdraw(ats.id)).length, 0);
  assert.equal(api.signOut().person, null);
});

test('the covert yes says who is seen and when, in both languages, with no forbidden claim', () => {
  for (const lang of ['en', 'de']) {
    for (const words of [jobsBoard[lang].posting.covert, jobsMine[lang].covert]) for (const text of Object.values(words).flatMap(v => typeof v === 'string' ? [v] : Object.values(v))) {
      assert.doesNotMatch(text, FORBIDDEN[lang], `${lang}: forbidden word in “${text}”`);
      assert.doesNotMatch(text, PRIVATE, `${lang}: private detail in “${text}”`);
    }
  }
  assert.equal(jobsBoard.en.posting.covert.line, 'Nobody sees who you are until the company unlocks you. Your employer and companies you blocked never see it.');
  assert.equal(jobsBoard.de.posting.covert.line, 'Niemand sieht, wer Sie sind, bis die Firma Sie freischaltet. Ihr Arbeitgeber und Firmen, die Sie gesperrt haben, sehen es nie.');
  assert.deepEqual(Object.keys(jobsMine.de.covert), Object.keys(jobsMine.en.covert));
});
