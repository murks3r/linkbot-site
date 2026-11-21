/* The person's own page in Jobs (the draft /jobs/mine): the demo's states (src/front/mine.ts, pure logic), what its
   export holds, and the rules its words follow (src/drafts/jobs-mine.ts): no identity of the person, no score, the
   promise of the block list no stronger than the Jobs spec's, every role verdict one of the four. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { start, story, reduce, holds, exportOf } from '../src/front/mine.ts';
import { CRITERIA, jobsMine } from '../src/drafts/jobs-mine.ts';

const first = start(['a', 'b'], ['employer'], ['employer', 'other']);
const go = (...actions) => actions.reduce((s, action) => reduce(s, action, first), first);
const signedIn = go({ type: 'sign-in' });

test('nothing changes before signing in; the story is the signed-in page', () => {
  assert.equal(holds('signed:out deletion:none', first), true);
  for (const action of [{ type: 'pause' }, { type: 'answer', role: 'a', answer: 'interested' }, { type: 'block', company: 'other', on: true }, { type: 'delete' }]) {
    assert.deepEqual(reduce(first, action, first), first, action.type);
  }
  assert.equal(holds('signed:in block-employer:on block-other:off role-a:open', story(first)), true);
});

test('an answer: interested, not for me or later; later records nothing and stays answerable; an answer can be reopened', () => {
  assert.equal(go({ type: 'sign-in' }, { type: 'answer', role: 'a', answer: 'interested' }).answers.a, 'interested');
  assert.equal(go({ type: 'sign-in' }, { type: 'answer', role: 'a', answer: 'later' }, { type: 'answer', role: 'a', answer: 'declined' }).answers.a, 'declined');
  const yes = go({ type: 'sign-in' }, { type: 'answer', role: 'a', answer: 'interested' });
  assert.equal(reduce(yes, { type: 'answer', role: 'a', answer: 'declined' }, first).answers.a, 'interested', 'reopen first');
  assert.equal(reduce(yes, { type: 'answer', role: 'a', answer: 'open' }, first).answers.a, 'open');
  assert.equal(reduce(signedIn, { type: 'answer', role: 'x', answer: 'interested' }, first), signedIn, 'unknown role');
});

test('paused: no answer is taken until the search resumes', () => {
  const paused = reduce(signedIn, { type: 'pause' }, first);
  assert.equal(reduce(paused, { type: 'answer', role: 'a', answer: 'interested' }, first).answers.a, 'open');
  assert.equal(go({ type: 'sign-in' }, { type: 'pause' }, { type: 'resume' }, { type: 'answer', role: 'a', answer: 'interested' }).answers.a, 'interested');
});

test('the block list: the current employer is on it first; a company can be added and removed; an unknown one is refused', () => {
  assert.equal(first.blocked.employer, true);
  assert.equal(go({ type: 'sign-in' }, { type: 'block', company: 'other', on: true }).blocked.other, true);
  assert.equal(go({ type: 'sign-in' }, { type: 'block', company: 'employer', on: false }).blocked.employer, false);
  assert.ok(!('x' in go({ type: 'sign-in' }, { type: 'block', company: 'x', on: true }).blocked));
});

test('delete asks first; keep undoes the ask; once deleted nothing changes and no one signs in until the demo restarts', () => {
  const asked = reduce(signedIn, { type: 'delete' }, first);
  assert.equal(asked.deletion, 'asked');
  assert.equal(reduce(asked, { type: 'keep' }, first).deletion, 'none');
  assert.equal(reduce(signedIn, { type: 'confirm-delete' }, first).deletion, 'none', 'no delete without the ask');
  const done = reduce(asked, { type: 'confirm-delete' }, first);
  assert.equal(holds('deletion:done', done), true);
  assert.deepEqual(reduce(done, { type: 'sign-in' }, first), done);
  assert.deepEqual(reduce(done, { type: 'pause' }, first), done);
  assert.deepEqual(reduce(done, { type: 'reset' }, first), first);
});

test('the export holds the person’s own criteria, answers, list and history; no later, no open answer, nothing of a company but the listed domains', () => {
  const s = go({ type: 'sign-in' }, { type: 'answer', role: 'a', answer: 'interested' }, { type: 'answer', role: 'b', answer: 'later' }, { type: 'block', company: 'other', on: true });
  const out = exportOf(s, {
    note: 'n', history: ['h'], criteria: [{ criterion: 'Role', value: 'Data', importance: 'Musts' }],
    roles: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }], companies: [{ id: 'employer', domain: 'e.example' }, { id: 'other', domain: 'o.example' }],
  });
  assert.deepEqual(out, { note: 'n', paused: false, criteria: [{ criterion: 'Role', value: 'Data', importance: 'Musts' }], answers: [{ role: 'A', answer: 'interested' }], blockList: ['e.example', 'o.example'], history: ['h'] });
});

for (const [lang, d] of Object.entries(jobsMine)) {
  test(`${lang}: the words follow the Jobs rules`, () => {
    const D = d.demo;
    for (const c of CRITERIA) assert.ok(D.criteria.labels[c] && D.criteria.values[c], `${lang}: ${c}`);
    for (const role of D.roles.list) for (const v of Object.values(role.verdicts)) assert.ok(v in D.roles.verdicts, `${lang}: ${role.id} ${v}`);
    // A hidden role is one with a conflict on a must, and it is not on the page.
    for (const role of D.roles.list.filter(r => r.hidden)) assert.ok(Object.entries(role.verdicts).some(([c, v]) => v === 'conflicts' && D.criteria.musts.includes(c)));
    // No role shown has a conflict on a must.
    for (const role of D.roles.list.filter(r => !r.hidden)) for (const c of D.criteria.musts) assert.notEqual(role.verdicts[c], 'conflicts', `${lang}: ${role.id} ${c}`);
    // Every company is fictional, under a domain reserved for examples (RFC 2606/6761).
    for (const c of D.block.companies) assert.match(c.domain, /\.example$/);
    // The same roles, companies and musts in both languages.
    assert.deepEqual(D.roles.list.map(r => [r.id, r.verdicts, !!r.hidden]), jobsMine.en.demo.roles.list.map(r => [r.id, r.verdicts, !!r.hidden]));
    assert.deepEqual(D.block.companies.map(c => c.domain), jobsMine.en.demo.block.companies.map(c => c.domain));
    assert.deepEqual(D.criteria.musts, jobsMine.en.demo.criteria.musts);
  });
}

test('no score, no ranking, no stronger block promise than the spec’s', () => {
  const words = JSON.stringify(jobsMine);
  assert.doesNotMatch(words, /\d\s?%|(?<!no )\b(score|ranking)|(?<!kein(e|en)? )\b(Punktwert|Rangliste)/i, 'a score or a ranking only as “no …”');
  assert.match(jobsMine.en.demo.block.promise, /while they use the domain they confirmed with/);
  assert.match(jobsMine.de.demo.block.promise, /solange sie die Domain nutzen, die sie bei .+ bestätigt haben/);
});
