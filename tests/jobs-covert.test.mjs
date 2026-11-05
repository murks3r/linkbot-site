/* The covert yes on a real posting (src/jobs/interest.ts, the shape J2-5 plans) and its stand-in
   (src/jobs/interest-stub.ts): only a signed-in, checked person says yes, once per posting; the yes goes to the
   catalogue's party "<source>:<board>", taken as delivered, and only on a posting with a party and an evidenced
   employer domain (catalogue 0.1.1-draft; otherwise no yes and no button, T-J2d FUND 13); withdrawing takes it off the
   person's list and out of every count; a block covers the confirmed domain and its subdomains and applies at the
   claim, before any count. The words say who is seen, and when. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { SIGNED_OUT, canSay, claimableParty, countFor, covers, mine, sayYes, withdraw } from '../src/jobs/interest.ts';
import { MADE_UP_PERSON, stub } from '../src/jobs/interest-stub.ts';
import { RECORDED } from '../src/jobs/recorded.ts';
import { jobsBoard } from '../src/drafts/jobs-board.ts';
import { jobsMine } from '../src/drafts/jobs-mine.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const ats = RECORDED.find(p => p.source === 'greenhouse');
const other = RECORDED.find(p => p.source === 'personio');
const memory = () => { const m = new Map(); return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }; };

test('the yes goes to the catalogue\'s party, as delivered; without a party or an evidenced domain, no yes', () => {
  assert.equal(claimableParty(ats), 'greenhouse:fabrikamroboticsexample');
  assert.equal(claimableParty(other), 'personio:northwind-analytics-example');
  for (const p of RECORDED) {
    assert.match(p.party, new RegExp(`^${p.source}:[^\\s:]+$`), `${p.id}: the contract's party pattern`);
    assert.ok(!p.party.includes(new URL(p.original_url).hostname), `${p.id}: never the host of the original`);
    assert.equal(claimableParty(p), p.employer_domain === null ? null : p.party, p.id);
  }
  const lever = RECORDED.filter(p => p.source === 'lever').map(p => p.party);
  assert.equal(new Set(lever).size, lever.length, 'two employers on one application system are two parties');
  const unproven = RECORDED.filter(p => p.employer_domain === null);
  assert.deepEqual(unproven.map(p => p.id), ['lever-proseware-support-22'], 'one recorded posting without a domain');
  assert.equal(claimableParty({ ...ats, party: 'greenhouse:somethingelse' }), 'greenhouse:somethingelse', 'the key is taken, not rebuilt');
  const s = { person: MADE_UP_PERSON, interests: [] };
  for (const p of [unproven[0], { ...ats, party: null }, { ...ats, employer_domain: null }]) {
    assert.equal(claimableParty(p), null);
    assert.deepEqual(sayYes(s, p, '2026-11-05T10:00:00Z'), s, 'unclaimable, no yes');
  }
  assert.equal(sayYes(s, ats, '2026-11-05T10:00:00Z').interests[0].party, 'greenhouse:fabrikamroboticsexample');
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

test('a block applies at the claim, against the domain the company confirmed, before any count', () => {
  assert.ok(covers('www.Northwind.example', 'jobs.northwind.example'));
  assert.ok(!covers('wind.example', 'northwind.example'));
  const party = 'greenhouse:fabrikamroboticsexample';
  const claim = { party, domain: 'fabrikam.example' };
  const yes = (blocked, state = 'covert', on = party) => ({ person: { ...MADE_UP_PERSON, blocked }, interest: { posting_id: 'x', party: on, at: '', state } });
  assert.equal(countFor([
    yes([]),
    yes(['fabrikam.example']),
    yes(['www.fabrikam.example']),
    yes([], 'withdrawn'),
    yes(['other.example']),
    yes([], 'covert', 'greenhouse:someoneelse'),
  ], claim), 2, 'blocked people, withdrawn yeses and other parties are left out');
  assert.equal(countFor([yes(['fabrikam.example'])], { party, domain: 'careers.fabrikam.example' }), 0, 'a block covers the confirmed domain’s subdomains');
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
