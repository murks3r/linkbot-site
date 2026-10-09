import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { EMPTY_SAVED, createSavedStore, isInterestExpressed, isJobSaved } from '../lib/saved.ts';
import type { JobOpportunity } from '../types.ts';
import { Glyph } from './Glyph.tsx';

/**
 * The three-way distinction, made explicit and physical:
 *
 *   View  — reading this page. Tells nobody anything.
 *   Save  — a bookmark in this browser. Local, no account, no transfer.
 *   Interest — a one-sided signal. Not a match, not an application. In the
 *              product this is what the private job agent would carry.
 *
 * Applying is deliberately NOT here: it is a separate, externally authorised
 * action that leaves Linkbot, and it lives next to the original posting link.
 */
export function DetailActions({ job }: { job: JobOpportunity }) {
  const store = useMemo(() => createSavedStore(), []);
  const state = useSyncExternalStore(store.subscribe, store.getState, () => EMPTY_SAVED);
  const [mounted, setMounted] = useState(false);
  const [showInterestDetail, setShowInterestDetail] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const saved = mounted && isJobSaved(state, job.id);
  const interested = mounted && isInterestExpressed(state, job.id);

  return (
    <div className="lbj-actions">
      <button
        type="button"
        className="lbj-btn lbj-btn--quiet"
        aria-pressed={saved}
        onClick={() => store.toggleJob(job)}
      >
        <Glyph name={saved ? 'bookmarkFilled' : 'bookmark'} size={13} />
        {saved ? 'Saved in this browser' : 'Save for later'}
      </button>
      <p className="lbj-actions__note">
        Saving is local to this browser. No account, no server list, nothing shared.
      </p>

      <div className="lbj-divider" />

      <button
        type="button"
        className="lbj-btn"
        aria-pressed={interested}
        aria-expanded={showInterestDetail}
        onClick={() => {
          setShowInterestDetail(true);
          store.toggleInterest(job);
        }}
      >
        <Glyph name="shield" size={13} />
        {interested ? 'Interest expressed privately' : 'Express private interest'}
      </button>
      <p className="lbj-actions__note">
        Expressing interest is one-sided. It is an <em>opportunity</em>, not a match: the employer
        has not confirmed anything. It is not an application either.
      </p>

      {showInterestDetail || interested ? (
        <div className="lbj-panel" role="note">
          <p className="lbj-panel__title">What the private job agent would do next</p>
          <p className="lbj-actions__note">
            In the product, your interest would authorise a bounded disclosure — the specific
            fields an employer asked for, for a named purpose, at a named version — and produce a
            receipt you can revoke. In this preview nothing leaves this browser: the interest is a
            local marker only, and this deployment is a fixture-backed preview.
          </p>
          {interested ? (
            <button
              type="button"
              className="lbj-btn lbj-btn--link"
              onClick={() => store.removeInterest(job.id)}
            >
              Withdraw interest
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
