/**
 * Unit tests for the synthetic agency fixture set, the fail-closed review model
 * and the mailto-only pilot enquiry draft.
 *
 * These tests are documentation of intent: they fail if the fixtures, the
 * eligibility rules or the enquiry copy drift towards claims the product
 * cannot support yet.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  evaluateCandidate,
  mandates,
  rankCandidates,
  summariseCandidates,
  summarisePool,
  unknownRequirements,
  unmetRequirements,
} from '../src/lib/agency-demo.ts';
import {
  ENQUIRY_RECIPIENT,
  buildEnquiryBody,
  buildEnquiryDraft,
  directEnquiryUrl,
  emptyEnquiryFields,
  validateEnquiry,
} from '../src/components/agency/enquiry.ts';

const validFields = {
  name: 'Example visitor',
  agency: 'Example agency',
  email: 'visitor@example.test',
  focus: 'Data and AI',
  context: 'One senior data engineering mandate.',
};

test('every example mandate has readable required and preferred criteria', () => {
  assert.equal(mandates.length, 4);
  assert.equal(new Set(mandates.map((m) => m.id)).size, mandates.length);
  for (const mandate of mandates) {
    assert.ok(mandate.brief.length > 40);
    assert.ok(mandate.requirements.some((r) => r.kind === 'required'));
    assert.ok(mandate.requirements.some((r) => r.kind === 'preferred'));
    assert.ok(mandate.candidates.length >= 2);
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

test('fixtures stay synthetic: no contact details, URLs or real identifiers', () => {
  const serialised = JSON.stringify(mandates);
  assert.equal(/[\w.+-]+@[\w-]+\.[\w.]+/.test(serialised), false, 'fixture set contains an email-like string');
  assert.equal(/https?:\/\//.test(serialised), false, 'fixture set contains a URL');
  assert.equal(/(?:\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(serialised), false, 'fixture set contains a phone-like string');
  for (const mandate of mandates) {
    for (const candidate of mandate.candidates) {
      // Identifiers are opaque pool codes, never plausible real names.
      assert.match(candidate.id, /^[A-Z]-\d{3}$/, `unexpected fixture id: ${candidate.id}`);
      assert.equal(candidate.availability, 'Not confirmed');
    }
  }
});

test('the eligibility contract per example mandate is explicit', () => {
  const expected = {
    // id: [ready, needsVerification, excluded]
    platform: [1, 1, 1],
    design: [1, 1, 1],
    data: [1, 1, 1],
    // A deliberately thin pool: nobody meets every stated hard requirement.
    security: [0, 0, 2],
  };
  for (const mandate of mandates) {
    const summary = summarisePool(mandate);
    assert.deepEqual(
      [summary.ready.length, summary.needsVerification.length, summary.excluded.length],
      expected[mandate.id],
      `unexpected eligibility split for ${mandate.id}`,
    );
    assert.equal(summary.eligible, summary.ready.length + summary.needsVerification.length);
    for (const entry of summary.excluded) {
      assert.ok(entry.reasons.length > 0, `exclusion without a reason: ${entry.candidate.id}`);
      for (const reason of entry.reasons) assert.ok(reason.label && reason.detail);
    }
  }
});

test('ranking is stable and never puts hard failures ahead of qualifying profiles', () => {
  for (const mandate of mandates) {
    const ranked = rankCandidates(mandate);
    assert.equal(ranked.length, mandate.candidates.length);
    assert.deepEqual(rankCandidates(mandate).map((c) => c.id), ranked.map((c) => c.id));
    const summary = summarisePool(mandate);
    if (summary.eligible > 0) {
      assert.equal(evaluateCandidate(mandate, ranked[0]).classification, 'Required criteria met');
      assert.equal(ranked[0].id, summary.ready.length ? summary.ready[0].id : summary.needsVerification[0].id);
    }
    assert.equal(evaluateCandidate(mandate, ranked[ranked.length - 1]).classification, 'Does not meet requirement');
    for (let i = 1; i < ranked.length; i++) {
      const before = evaluateCandidate(mandate, ranked[i - 1]);
      const after = evaluateCandidate(mandate, ranked[i]);
      assert.ok(before.failed <= after.failed);
      if (before.failed === after.failed) assert.ok(before.unresolved <= after.unresolved);
      if (before.failed === after.failed && before.unresolved === after.unresolved) {
        assert.ok(before.preferredMet >= after.preferredMet);
      }
    }
  }
});

test('unverified hard requirements are not treated as verified or excluded', () => {
  let checked = 0;
  for (const mandate of mandates) {
    for (const candidate of mandate.candidates) {
      if (unmetRequirements(mandate, candidate).length) continue;
      if (!unknownRequirements(mandate, candidate).length) continue;
      checked += 1;
      const result = evaluateCandidate(mandate, candidate);
      assert.equal(result.failed, 0);
      assert.ok(result.unresolved > 0);
      assert.equal(result.classification, 'Needs verification');
      assert.equal(result.shortListable, true);
      assert.ok(summarisePool(mandate).needsVerification.some((c) => c.id === candidate.id));
    }
  }
  assert.ok(checked >= 3, 'expected several profiles with unverified hard requirements');
});

test('a known failed hard requirement blocks shortlisting even with preferred evidence', () => {
  for (const mandate of mandates) {
    const rejected = mandate.candidates.filter((c) => unmetRequirements(mandate, c).length);
    assert.ok(rejected.length, `no excluded profile in ${mandate.id}`);
    for (const candidate of rejected) {
      const fit = evaluateCandidate(mandate, candidate);
      assert.ok(fit.failed > 0);
      assert.equal(fit.shortListable, false);
      assert.equal(fit.classification, 'Does not meet requirement');
    }
  }
});

test('an unknown requirement never rescues a profile that also fails a hard requirement', () => {
  const security = mandates.find((m) => m.id === 'security');
  assert.ok(security);
  const blocked = security.candidates.find((c) => c.id === 'S-011');
  assert.ok(blocked);
  assert.ok(unknownRequirements(security, blocked).length > 0);
  assert.ok(unmetRequirements(security, blocked).length > 0);
  assert.equal(evaluateCandidate(security, blocked).classification, 'Does not meet requirement');
  assert.equal(summarisePool(security).needsVerification.length, 0);
});

test('a thin pool produces no eligible candidate instead of a relaxed shortlist', () => {
  const security = mandates.find((m) => m.id === 'security');
  assert.ok(security);
  const summary = summarisePool(security);
  assert.equal(summary.eligible, 0);
  assert.equal(summary.ready.length, 0);
  assert.equal(summary.needsVerification.length, 0);
  assert.equal(summary.excluded.length, security.candidates.length);
  assert.equal(rankCandidates(security).filter((c) => evaluateCandidate(security, c).shortListable).length, 0);
});

test('summarising an arbitrary shortlist mirrors per-candidate eligibility', () => {
  const mandate = mandates[0];
  const ids = [mandate.candidates[0].id, mandate.candidates[2].id];
  const summary = summariseCandidates(mandate, mandate.candidates.filter((c) => ids.includes(c.id)));
  assert.equal(summary.eligible + summary.excluded.length, ids.length);
  for (const entry of summary.excluded) {
    assert.equal(evaluateCandidate(mandate, entry.candidate).shortListable, false);
  }
});

test('ranking does not mutate fixture order when changing mandates', () => {
  for (const mandate of mandates) {
    const orderBefore = mandate.candidates.map((c) => c.id);
    rankCandidates(mandate);
    summarisePool(mandate);
    assert.deepEqual(mandate.candidates.map((c) => c.id), orderBefore);
  }
});

test('enquiry validation rejects blanks, stray whitespace and unusable addresses', () => {
  assert.deepEqual(validateEnquiry(validFields), {});
  assert.deepEqual(validateEnquiry(emptyEnquiryFields()), {
    name: 'Enter the name we should reply to.',
    agency: 'Enter your recruiting firm.',
    email: 'Enter a reply email address.',
    focus: 'Choose what your agency recruits for.',
  });
  const blank = validateEnquiry({ ...validFields, name: '   ' });
  assert.ok(blank.name, 'whitespace-only name must not be accepted');
  assert.ok(validateEnquiry({ ...validFields, email: 'not-an-email' }).email);
  assert.ok(validateEnquiry({ ...validFields, email: 'a@b.com,c@d.com' }).email, 'multiple addresses must be rejected');
  assert.ok(validateEnquiry({ ...validFields, focus: '' }).focus);
  // The optional context field is genuinely optional.
  assert.deepEqual(validateEnquiry({ ...validFields, context: '' }), {});
});

test('an invalid enquiry produces no mailto handoff at all', () => {
  const draft = buildEnquiryDraft({ ...validFields, name: '' });
  assert.equal(draft.ok, false);
  assert.equal(draft.mailtoUrl, '');
  assert.ok(draft.fieldErrors.name);
});

test('a valid enquiry builds an editable mailto draft and never claims a submission', () => {
  const draft = buildEnquiryDraft(validFields);
  assert.equal(draft.ok, true);
  assert.equal(draft.recipient, ENQUIRY_RECIPIENT);
  assert.ok(draft.mailtoUrl.startsWith(`mailto:${ENQUIRY_RECIPIENT}?subject=`));
  const [subject, body] = draft.mailtoUrl.split('?subject=')[1].split('&body=');
  assert.equal(decodeURIComponent(subject), 'Linkbot — agency pilot enquiry');
  assert.equal(decodeURIComponent(body), draft.body);
  assert.equal(draft.body, buildEnquiryBody(validFields));

  for (const value of Object.values(validFields)) assert.ok(draft.body.includes(value));
  // Honesty guards: the draft is a message from the visitor, not a submission receipt.
  assert.equal(/submitted|successfully sent|we have received|thank you for your (application|submission)/i.test(draft.body), false);
  assert.equal(/https?:\/\//.test(draft.body), false);
});

test('enquiry fields are trimmed and bounded before they reach the draft', () => {
  const draft = buildEnquiryDraft({
    name: `  ${'n'.repeat(400)}  `,
    agency: '  Example agency  ',
    email: '  visitor@example.test  ',
    focus: 'Data and AI',
    context: 'c'.repeat(5000),
  });
  assert.equal(draft.ok, true);
  assert.ok(draft.body.includes('Agency: Example agency'));
  assert.ok(draft.body.includes('Reply email: visitor@example.test'));
  const nameLine = draft.body.split('\n').find((line) => line.startsWith('Name: '));
  assert.equal(nameLine.length, 'Name: '.length + 120);
  const contextLine = draft.body.split('\n').find((line) => line.startsWith('cccc'));
  assert.equal(contextLine.length, 1500);
});

test('the no-JavaScript fallback points at the same mailbox', () => {
  assert.ok(directEnquiryUrl().startsWith(`mailto:${ENQUIRY_RECIPIENT}?subject=`));
});
