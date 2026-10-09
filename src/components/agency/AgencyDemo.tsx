import { useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { evaluateCandidate, mandates, rankCandidates, summarisePool, unknownRequirements, unmetRequirements } from '../../lib/agency-demo';
import type { ExampleCandidate, Mandate, RequirementStatus } from '../../lib/agency-demo';

const stateStyle: Record<RequirementStatus, string> = {
  met: 'border-signal-400/30 bg-signal-400/10 text-signal-400',
  unknown: 'border-amber-200/25 bg-amber-200/10 text-amber-100',
  unmet: 'border-alarm-400/30 bg-alarm-400/10 text-alarm-400',
};

const stateLabel: Record<RequirementStatus, string> = {
  met: 'Evidence present',
  unknown: 'Not verified',
  unmet: 'Requirement not met',
};

const stage = 'font-mono text-xs uppercase tracking-[0.18em] text-signal-400';

function classifyTone(failed: number, unresolved: number) {
  if (failed) return 'text-alarm-400';
  if (unresolved) return 'text-amber-100';
  return 'text-signal-400';
}

function CandidateCard({
  mandate, candidate, selected, shortlisted, onInspect, onShortlist,
}: {
  mandate: Mandate;
  candidate: ExampleCandidate;
  selected: boolean;
  shortlisted: boolean;
  onInspect: () => void;
  onShortlist: () => void;
}) {
  const fit = evaluateCandidate(mandate, candidate);
  const reasonId = `agency-reason-${candidate.id}`;
  const unmet = unmetRequirements(mandate, candidate);
  return (
    <article
      aria-label={`${candidate.id} synthetic profile`}
      className={`rounded-xl border p-4 transition-colors sm:p-5 ${selected ? 'border-signal-400/60 bg-ink-800' : 'border-bone-50/10 bg-ink-900 hover:border-bone-50/25'}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="font-mono text-[11px] tracking-[0.12em] text-bone-200/55">{candidate.id} · SYNTHETIC PROFILE</span>
          <h4 className="mt-2 text-base font-medium text-bone-50">{candidate.role}</h4>
          <p className="mt-1 text-xs text-bone-200/55">{candidate.context} · {candidate.location}</p>
          <p className="mt-1 text-xs text-bone-200/55">Availability: {candidate.availability.toLowerCase()}</p>
        </div>
        <span className={`text-xs font-medium ${classifyTone(fit.failed, fit.unresolved)}`}>{fit.classification}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Example skills">
        {candidate.strengths.slice(0, 3).map((strength) => (
          <span key={strength} className="rounded-full border border-bone-50/10 px-2.5 py-1 text-xs text-bone-200/70">{strength}</span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button" aria-pressed={selected} onClick={onInspect}
          className="min-h-11 rounded-md border border-bone-50/25 px-3 py-2 text-sm font-medium text-bone-50 hover:border-signal-400 focus-visible:outline-offset-2"
        >
          {selected ? 'Inspecting evidence' : `Inspect ${candidate.id} evidence`}
        </button>
        <button
          type="button" aria-pressed={shortlisted}
          aria-label={shortlisted ? `Remove ${candidate.id} from shortlist` : `Add ${candidate.id} to shortlist`}
          aria-describedby={!fit.shortListable ? reasonId : undefined}
          onClick={onShortlist} disabled={!fit.shortListable}
          title={!fit.shortListable ? 'A stated hard requirement is not met' : undefined}
          className="min-h-11 rounded-md bg-bone-50 px-3 py-2 text-sm font-medium text-ink-950 hover:bg-signal-400 disabled:cursor-not-allowed disabled:bg-bone-50/10 disabled:text-bone-200/40"
        >
          {shortlisted ? 'Remove from shortlist' : 'Shortlist'}
        </button>
      </div>
      {!fit.shortListable && (
        <p id={reasonId} className="mt-2 text-xs text-alarm-400">
          Not shortlistable — hard requirement not met: {unmet.map((reason) => `${reason.label} (${reason.detail})`).join('; ') || 'at least one required criterion is not met.'}
        </p>
      )}
      {fit.shortListable && fit.unresolved > 0 && <p className="mt-2 text-xs text-amber-100">Shortlist for review only — verification still required.</p>}
    </article>
  );
}

export default function AgencyDemo() {
  const [mandateId, setMandateId] = useState(mandates[0].id);
  const [inspectedId, setInspectedId] = useState(mandates[0].candidates[0].id);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [interest, setInterest] = useState<'interested' | 'not-now' | 'more-information' | null>(null);
  const [consent, setConsent] = useState<'allow' | 'decline' | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const mandateRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const previewRef = useRef<HTMLElement | null>(null);
  const previewTriggerRef = useRef<HTMLButtonElement | null>(null);

  const mandate = mandates.find((m) => m.id === mandateId) ?? mandates[0];
  const ranked = useMemo(() => rankCandidates(mandate), [mandate]);
  const pooled = useMemo(() => summarisePool(mandate), [mandate]);
  const reviewed = useMemo(
    () => ranked.filter((candidate) => shortlist.includes(candidate.id)),
    [ranked, shortlist],
  );
  const openVerification = useMemo(
    () => reviewed.filter((candidate) => evaluateCandidate(mandate, candidate).unresolved > 0),
    [mandate, reviewed],
  );
  const inspected = ranked.find((c) => c.id === inspectedId) ?? ranked[0];
  const previewCandidate = ranked.find((c) => c.id === previewId);
  const required = mandate.requirements.filter((r) => r.kind === 'required');
  const preferred = mandate.requirements.filter((r) => r.kind === 'preferred');
  const shortlistable = ranked.filter((c) => evaluateCandidate(mandate, c).shortListable);

  function resetPreview() {
    setPreviewId(null);
    setInterest(null);
    setConsent(null);
  }

  function changeMandate(id: string) {
    const next = mandates.find((m) => m.id === id);
    if (!next) return;
    setMandateId(next.id);
    setInspectedId(next.candidates[0].id);
    setShortlist([]);
    resetPreview();
    setAnnouncement(`${next.label} selected. ${next.candidates.length} synthetic profiles in this example pool.`);
  }

  function toggleShortlist(id: string) {
    const removing = shortlist.includes(id);
    const next = removing ? shortlist.filter((item) => item !== id) : [...shortlist, id];
    setShortlist(next);
    setAnnouncement(`${id} ${removing ? 'removed from' : 'added to'} the shortlist. ${next.length} of ${shortlistable.length} eligible profiles selected.`);
    if (id === previewId) resetPreview();
  }

  function inspect(id: string) {
    setInspectedId(id);
    setAnnouncement(`Showing evidence for ${id}.`);
  }

  function startPreview() {
    if (!shortlist.length) return;
    setPreviewId(shortlist[0]);
    setInterest(null);
    setConsent(null);
    setAnnouncement('Candidate-side interest preview opened.');
    window.requestAnimationFrame(() => previewRef.current?.focus());
  }

  function closePreview() {
    resetPreview();
    setAnnouncement('Candidate-side interest preview closed.');
    window.requestAnimationFrame(() => previewTriggerRef.current?.focus());
  }

  function onMandateKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const usable = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!usable.includes(event.key)) return;
    event.preventDefault();
    const index = mandates.findIndex((m) => m.id === mandateId);
    let nextIndex = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % mandates.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + mandates.length) % mandates.length;
    else if (event.key === 'Home') nextIndex = 0;
    else nextIndex = mandates.length - 1;
    const target = mandates[nextIndex];
    changeMandate(target.id);
    mandateRefs.current[target.id]?.focus();
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-bone-50/15 bg-ink-950 shadow-2xl shadow-black/40" aria-label="Interactive example recruiting workspace">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bone-50/10 bg-ink-900 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="flex gap-1" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-bone-50/20" /><span className="h-2 w-2 rounded-full bg-bone-50/20" /><span className="h-2 w-2 rounded-full bg-signal-400" /></span>
          <span className="font-mono text-xs tracking-[0.08em] text-bone-200/70">LINKBOT / MANDATE WORKSPACE</span>
        </div>
        <span className="rounded-full border border-amber-200/25 bg-amber-200/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-100">Interactive example · synthetic data</span>
      </div>

      <p className="sr-only" role="status">{announcement}</p>

      <div className="border-b border-bone-50/10 bg-amber-200/[0.06] px-5 py-4 text-xs leading-5 text-amber-100 sm:px-7">
        Every mandate, profile, evidence statement and ranking below is written for this page. There is no live matching engine, no candidate contact and no data leaves your browser. Nothing here describes validated product performance.
      </div>

      <div className="border-b border-bone-50/10 px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className={stage}>01 / Select an example mandate</p><h3 className="mt-2 font-display text-2xl font-light">Start with the role. Not a keyword list.</h3></div>
          <button
            type="button" onClick={() => { changeMandate(mandates[0].id); setAnnouncement('Demonstration reset to the first example mandate.'); }}
            className="min-h-11 text-xs text-bone-200/60 underline underline-offset-4 hover:text-bone-50"
          >
            Reset demonstration
          </button>
        </div>
        <div
          role="radiogroup" aria-label="Example recruiting mandates" onKeyDown={onMandateKeyDown}
          className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
        >
          {mandates.map((option) => (
            <button
              type="button" key={option.id} role="radio" aria-checked={mandateId === option.id}
              tabIndex={mandateId === option.id ? 0 : -1}
              ref={(node) => { mandateRefs.current[option.id] = node; }}
              onClick={() => changeMandate(option.id)}
              className={`min-h-11 rounded-lg border p-4 text-left transition-colors focus-visible:outline-offset-2 ${mandateId === option.id ? 'border-signal-400 bg-signal-400/10' : 'border-bone-50/15 bg-ink-900 hover:border-bone-50/40'}`}
            >
              <span className="block font-medium text-bone-50">{option.label}</span>
              <span className="mt-1 block text-xs text-bone-200/60">{option.workMode}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-bone-200/55">Use the arrow keys to move between example mandates. Each represents a different agency-owned pool, not a search across the market.</p>
      </div>

      <div className="grid border-b border-bone-50/10 lg:grid-cols-12">
        <div className="border-b border-bone-50/10 p-5 sm:p-7 lg:col-span-5 lg:border-b-0 lg:border-r">
          <p className={stage}>02 / Structured interpretation</p>
          <h3 className="mt-2 font-display text-2xl font-light">{mandate.label}</h3>
          <p className="mt-3 text-sm leading-6 text-bone-200/75">{mandate.brief}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 rounded-lg bg-ink-900 p-4 text-sm">
            <div><dt className="text-xs text-bone-200/50">Seniority</dt><dd className="mt-1">{mandate.level}</dd></div>
            <div><dt className="text-xs text-bone-200/50">Work mode</dt><dd className="mt-1">{mandate.workMode}</dd></div>
            <div><dt className="text-xs text-bone-200/50">Location</dt><dd className="mt-1">{mandate.location}</dd></div>
            <div><dt className="text-xs text-bone-200/50">Source context</dt><dd className="mt-1">{mandate.pool}</dd></div>
          </dl>
          <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-bone-200/65">Hard requirements</h4>
          <p className="mt-2 text-xs leading-5 text-bone-200/55">A stated hard requirement that is not met removes a profile from consideration. It is never quietly relaxed.</p>
          <ul className="mt-3 space-y-3">{required.map((req) => <li key={req.key} className="border-l-2 border-signal-400/60 pl-3"><span className="block text-sm font-medium">{req.label}</span><span className="text-xs leading-5 text-bone-200/60">{req.interpretation}</span></li>)}</ul>
          <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-bone-200/65">Preferred signals</h4>
          <p className="mt-2 text-xs leading-5 text-bone-200/55">Preferences order eligible profiles. They never override a hard requirement.</p>
          <ul className="mt-3 space-y-3">{preferred.map((req) => <li key={req.key} className="border-l-2 border-bone-50/20 pl-3"><span className="block text-sm font-medium">{req.label}</span><span className="text-xs leading-5 text-bone-200/60">{req.interpretation}</span></li>)}</ul>
          <p className="mt-6 text-xs leading-5 text-bone-200/55">In a pilot, the agency reviews and corrects this interpretation before matching. These criteria are prewritten for this demonstration.</p>
        </div>
        <div className="p-5 sm:p-7 lg:col-span-7">
          <p className={stage}>03 / Evidence-led shortlist</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h3 className="font-display text-2xl font-light">Example candidate ranking</h3>
            <span className="font-mono text-xs text-bone-200/50">{ranked.length} synthetic profiles</span>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-bone-200/70">Ordered by hard requirements, then missing evidence, then preferred signals. Ranking is a fixed rule written for this page — not an AI score, a probability, or a claim about Linkbot's matching quality.</p>
          <div className="mt-5 space-y-3">
            {ranked.length === 0
              ? <p role="status" className="rounded-lg border border-bone-50/15 p-5 text-sm text-bone-200/70">No synthetic profiles are defined for this example mandate.</p>
              : ranked.map((candidate) => (
                <CandidateCard
                  key={candidate.id} mandate={mandate} candidate={candidate}
                  selected={inspected.id === candidate.id} shortlisted={shortlist.includes(candidate.id)}
                  onInspect={() => inspect(candidate.id)} onShortlist={() => toggleShortlist(candidate.id)}
                />
              ))}
          </div>
        </div>
      </div>

      <section aria-labelledby="evidence-heading" className="border-b border-bone-50/10 bg-ink-900/60 px-5 py-7 sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className={stage}>04 / Explain the recommendation</p><h3 id="evidence-heading" className="mt-2 font-display text-2xl font-light">Evidence for {inspected.id}</h3></div>
          <span className="rounded-full border border-bone-50/15 px-3 py-1 text-xs text-bone-200/60">Interest &amp; availability: unconfirmed</span>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-bone-200/70">Each criterion is answered separately so a recruiter can see what is supported, what is missing and what fails. A profile is never summarised into a single undisclosed number.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {mandate.requirements.map((req) => {
            const assessment = inspected.assessments[req.key] ?? { status: 'unknown' as const, evidence: 'No evidence supplied' };
            return (
              <div key={req.key} className="rounded-lg border border-bone-50/10 bg-ink-950 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2"><div><span className="block text-xs uppercase tracking-widest text-bone-200/45">{req.kind}</span><h4 className="mt-1 text-sm font-medium">{req.label}</h4></div><span className={`rounded-full border px-2 py-1 text-[11px] ${stateStyle[assessment.status]}`}>{stateLabel[assessment.status]}</span></div>
                <p className="mt-3 text-xs leading-5 text-bone-200/65">{assessment.evidence}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs leading-5 text-bone-200/50">All evidence statements are constructed examples, not verified candidate credentials. An unknown requirement stays unknown.</p>
      </section>

      <section aria-labelledby="review-heading" className="border-b border-bone-50/10 px-5 py-7 sm:px-7">
        <p className={stage}>05 / Recruiter review</p>
        <h3 id="review-heading" className="mt-2 font-display text-2xl font-light">What the recruiter reviews before anyone is contacted.</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-bone-200/70">Excluded profiles stay visible with the reason they were excluded, so the agency can challenge the criteria instead of losing the reasoning. Linkbot does not decide who is approached.</p>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <div className="rounded-lg border border-signal-400/25 bg-signal-400/[0.07] p-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-signal-400">Required criteria met ({pooled.ready.length})</h4>
            {pooled.ready.length
              ? <ul className="mt-3 space-y-1 text-sm text-bone-50">{pooled.ready.map((c) => <li key={c.id}>{c.id} · {c.role}</li>)}</ul>
              : <p className="mt-3 text-sm text-bone-200/70">None in this example pool.</p>}
          </div>
          <div className="rounded-lg border border-amber-200/25 bg-amber-200/[0.07] p-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-100">Needs verification first ({pooled.needsVerification.length})</h4>
            {pooled.needsVerification.length
              ? <ul className="mt-3 space-y-2 text-sm text-bone-50">{pooled.needsVerification.map((c) => (
                <li key={c.id}>{c.id} · {c.role}
                  <span className="mt-1 block text-xs leading-5 text-bone-200/70">Open: {unknownRequirements(mandate, c).map((r) => r.label).join(', ')}</span>
                </li>
              ))}</ul>
              : <p className="mt-3 text-sm text-bone-200/70">None in this example pool.</p>}
          </div>
          <div className="rounded-lg border border-alarm-400/25 bg-alarm-400/[0.07] p-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-alarm-400">Not eligible ({pooled.excluded.length})</h4>
            {pooled.excluded.length
              ? <ul className="mt-3 space-y-2 text-sm text-bone-50">{pooled.excluded.map(({ candidate, reasons }) => (
                <li key={candidate.id}>{candidate.id} · {candidate.role}
                  {reasons.map((reason) => <span key={reason.label} className="mt-1 block text-xs leading-5 text-bone-200/70">{reason.label}: {reason.detail}</span>)}
                </li>
              ))}</ul>
              : <p className="mt-3 text-sm text-bone-200/70">Every synthetic profile in this pool meets the stated hard requirements.</p>}
          </div>
        </div>

        {pooled.eligible === 0 && (
          <p role="status" className="mt-4 rounded-lg border border-dashed border-amber-200/30 p-4 text-sm leading-6 text-bone-200/80">
            No synthetic profile in this example pool meets every hard requirement, so there is nothing to shortlist. The example does not lower the bar to produce a list: the recruiter would widen the authorised pool or revisit the mandate criteria with the client. Either way, the decision and the exclusions stay visible.
          </p>
        )}

        <p className="mt-4 text-xs leading-5 text-bone-200/55">
          In a pilot, this review happens with the agency's own authorised pool. Overrides, additions and rejections are the recruiter's to make, and the reasoning is recorded alongside the list.
        </p>
      </section>

      <section aria-labelledby="shortlist-heading" className="px-5 py-7 sm:px-7">
        <p className={stage}>06 / The agency decides</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h3 id="shortlist-heading" className="font-display text-2xl font-light">Your working shortlist <span className="text-bone-200/45">({shortlist.length})</span></h3>
          {shortlist.length > 0 && <button type="button" onClick={() => { setShortlist([]); resetPreview(); setAnnouncement('Shortlist cleared.'); }} className="min-h-11 text-xs text-bone-200/60 underline underline-offset-4 hover:text-bone-50">Clear shortlist</button>}
        </div>
        {shortlist.length ? <ul className="mt-4 flex flex-wrap gap-2" aria-label="Shortlisted synthetic candidates">{shortlist.map((id) => <li key={id} className="inline-flex min-h-11 items-center gap-1 rounded-full border border-signal-400/30 bg-signal-400/10 px-3 py-2 text-xs text-signal-400">{id} <button type="button" aria-label={`Remove ${id}`} onClick={() => toggleShortlist(id)} className="ml-1 inline-flex min-h-11 items-center px-1 underline underline-offset-2">Remove</button></li>)}</ul>
          : <p role="status" className="mt-4 rounded-lg border border-dashed border-bone-50/20 p-4 text-sm text-bone-200/60">
            {pooled.eligible === 0
              ? 'No synthetic profile in this pool is eligible, so no shortlist can be built here. Pick another example mandate to continue.'
              : 'No candidates shortlisted yet. Inspect the evidence and shortlist a profile above to continue.'}
          </p>}
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button" ref={previewTriggerRef} disabled={shortlist.length === 0} onClick={startPreview}
            className="btn-primary min-h-11 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Preview candidate interest request <span aria-hidden="true">↗</span>
          </button>
          <p className="max-w-sm text-xs leading-5 text-bone-200/55">Shortlisting is internal. It does not contact candidates or disclose any data.</p>
        </div>

        {reviewed.length > 0 && (
          <p className="mt-4 text-xs leading-5 text-bone-200/55">
            {openVerification.length
              ? `Verification still open before any approach: ${openVerification.map((c) => c.id).join(', ')}.`
              : 'Every shortlisted profile meets the stated hard requirements in this example. Whether they are interested is still unconfirmed.'}
          </p>
        )}

        {previewCandidate && (
          <section ref={previewRef} tabIndex={-1} aria-label="Candidate-side interest preview" className="mt-7 overflow-hidden rounded-xl border border-signal-400/30 bg-ink-900 focus:outline-none">
            <div className="flex flex-wrap justify-between gap-3 border-b border-bone-50/10 px-5 py-4">
              <div><p className="font-mono text-xs uppercase tracking-[0.15em] text-signal-400">07 / Candidate-side simulation</p><h4 className="mt-2 font-display text-xl font-light">Would you like to explore this opportunity?</h4></div>
              <button type="button" onClick={closePreview} className="min-h-11 self-start rounded-md border border-bone-50/20 px-3 py-2 text-xs text-bone-200/70 hover:text-bone-50">Close preview</button>
            </div>
            <div className="p-5">
              <label className="block text-xs font-medium text-bone-200/65" htmlFor="agency-preview-profile">Preview as a fictional shortlisted profile</label>
              <select id="agency-preview-profile" value={previewCandidate.id} onChange={(e) => { setPreviewId(e.target.value); setInterest(null); setConsent(null); }} className="mt-2 min-h-11 w-full rounded-md border border-bone-50/25 bg-ink-950 px-3 py-3 text-sm text-bone-50 sm:max-w-sm">
                {shortlist.map((id) => <option key={id} value={id}>{id} · example profile</option>)}
              </select>
              <div className="mt-5 rounded-lg border border-bone-50/10 bg-ink-950 p-5">
                <p className="text-xs uppercase tracking-widest text-bone-200/50">Private opportunity · example</p>
                <h5 className="mt-2 text-lg font-medium">{mandate.label}</h5>
                <p className="mt-2 text-sm text-bone-200/70">{mandate.workMode} · {mandate.location}</p>
                <p className="mt-4 text-sm leading-6 text-bone-200/75">An agency you already know would like to check whether this mandate is of interest. Your contact details and identity have not been shared with the hiring company.</p>
                <fieldset className="mt-5">
                  <legend className="text-sm font-medium">Your interest response (simulation)</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {([['interested', 'I’m interested'], ['more-information', 'Need more context'], ['not-now', 'Not now']] as const).map(([value, label]) => (
                      <button key={value} type="button" aria-pressed={interest === value} onClick={() => { setInterest(value); setConsent(null); }} className={`min-h-11 rounded-md border px-3 py-2 text-sm ${interest === value ? 'border-signal-400 bg-signal-400/15 text-signal-400' : 'border-bone-50/25 text-bone-50 hover:border-bone-50/50'}`}>{label}</button>
                    ))}
                  </div>
                </fieldset>
                {interest === 'interested' && <div role="status" className="mt-5 border-l-2 border-signal-400 pl-4">
                  <p className="text-sm font-medium text-signal-400">Interest indicated — disclosure remains separate.</p>
                  <p className="mt-2 text-xs leading-5 text-bone-200/70">A real candidate would review the specific recipient and fields before an introduction. In this preview, the next step is illustrative only.</p>
                  <p className="mt-4 text-sm font-medium">Example disclosure request</p>
                  <p className="mt-1 text-xs leading-5 text-bone-200/70">Recipient: hiring team for this mandate. Scope: professional profile and reply channel. No automatic sharing.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => setConsent('allow')} className="min-h-11 rounded-md bg-bone-50 px-3 py-2 text-sm text-ink-950 hover:bg-signal-400">Simulate permission</button>
                    <button type="button" onClick={() => setConsent('decline')} className="min-h-11 rounded-md border border-bone-50/25 px-3 py-2 text-sm text-bone-50">Decline disclosure</button>
                  </div>
                  {consent && <p role="status" className="mt-3 text-xs font-medium text-signal-400">{consent === 'allow' ? 'Example outcome: permission would enable an introduction after the real consent checks.' : 'Example outcome: no introduction or data disclosure.'} No action was taken.</p>}
                </div>}
                {interest === 'more-information' && <p role="status" className="mt-4 text-sm text-amber-100">Example response: ask the agency for more role context before proceeding. No introduction.</p>}
                {interest === 'not-now' && <p role="status" className="mt-4 text-sm text-bone-200/70">Example response: the opportunity is declined. No introduction.</p>}
              </div>
              <p className="mt-4 text-xs leading-5 text-bone-200/55">Preview only. No messages sent, real interest captured, personal details accessed, or consent recorded.</p>
            </div>
          </section>
        )}
      </section>

      <div className="border-t border-bone-50/10 bg-ink-900 px-5 py-5 sm:px-7">
        <p className="text-xs leading-5 text-bone-200/60">
          This workspace illustrates the intended workflow with synthetic data only. A pilot runs the same steps against a bounded, authorised sample of your own pool, with your recruiters making every decision.
        </p>
        <a href="#pilot" className="mt-2 inline-flex min-h-11 items-center text-xs font-medium text-signal-400 underline underline-offset-4">
          Request a scoped pilot <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
