import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateCandidate, mandates, rankCandidates } from '../src/lib/agency-demo.ts';

test('all three mandates have readable required and preferred criteria', () => {
  assert.equal(mandates.length, 3);
  assert.equal(new Set(mandates.map((m) => m.id)).size, mandates.length);
  for (const mandate of mandates) {
    assert.ok(mandate.brief.length > 40);
    assert.ok(mandate.requirements.some((r) => r.kind === 'required'));
    assert.ok(mandate.requirements.some((r) => r.kind === 'preferred'));
    assert.ok(mandate.candidates.length >= 3);
    assert.equal(new Set(mandate.candidates.map((c) => c.id)).size, mandate.candidates.length);
    for (const candidate of mandate.candidates) {
      for (const requirement of mandate.requirements) {
        const assessment = candidate.assessments[requirement.key];
        assert.ok(assessment, `Missing assessment: ${candidate.id} / ${requirement.key}`);
        assert.ok(['met', 'unmet', 'unknown'].includes(assessment.status));
        assert.ok(assessment.evidence.length > 10);
      }
    }
  }
});

test('ranking is stable and never puts hard failures ahead of qualifying profiles', () => {
  for (const mandate of mandates) {
    const ranked = rankCandidates(mandate);
    assert.equal(ranked.length, mandate.candidates.length);
    assert.deepEqual(rankCandidates(mandate).map((c) => c.id), ranked.map((c) => c.id));
    assert.equal(evaluateCandidate(mandate, ranked[0]).classification, 'Required criteria met');
    assert.equal(evaluateCandidate(mandate, ranked[ranked.length - 1]).classification, 'Does not meet requirement');
    for (let i = 1; i < ranked.length; i++) {
      const before = evaluateCandidate(mandate, ranked[i - 1]);
      const after = evaluateCandidate(mandate, ranked[i]);
      assert.ok(before.failed <= after.failed);
      if (before.failed === after.failed) assert.ok(before.unresolved <= after.unresolved);
    }
  }
});

test('unverified hard requirements are not treated as verified or excluded', () => {
  for (const mandate of mandates) {
    const uncertain = mandate.candidates.find((c) => mandate.requirements.some(
      (r) => r.kind === 'required' && c.assessments[r.key].status === 'unknown'
    ));
    assert.ok(uncertain);
    const result = evaluateCandidate(mandate, uncertain);
    assert.equal(result.failed, 0);
    assert.ok(result.unresolved > 0);
    assert.equal(result.classification, 'Needs verification');
    assert.equal(result.shortListable, true);
  }
});

test('a known failed hard requirement blocks shortlisting even with preferred evidence', () => {
  for (const mandate of mandates) {
    const rejected = mandate.candidates.find((c) => mandate.requirements.some(
      (r) => r.kind === 'required' && c.assessments[r.key].status === 'unmet'
    ));
    assert.ok(rejected);
    const fit = evaluateCandidate(mandate, rejected);
    assert.ok(fit.failed > 0);
    assert.equal(fit.shortListable, false);
    assert.equal(fit.classification, 'Does not meet requirement');
  }
});

test('ranking does not mutate fixture order when changing mandates', () => {
  for (const mandate of mandates) {
    const orderBefore = mandate.candidates.map((c) => c.id);
    rankCandidates(mandate);
    assert.deepEqual(mandate.candidates.map((c) => c.id), orderBefore);
  }
});
