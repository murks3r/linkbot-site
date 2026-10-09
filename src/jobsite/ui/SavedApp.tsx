import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { JOBS_ROUTES } from '../config.ts';
import { EMPTY_SAVED, createSavedStore } from '../lib/saved.ts';
import { formatDate } from '../lib/format.ts';
import { Glyph } from './Glyph.tsx';

/**
 * The visitor's own list: saved opportunities, watched searches and locally
 * expressed interests. Everything here lives in this browser; there is no
 * server-side list and no account.
 */
export function SavedApp() {
  const store = useMemo(() => createSavedStore(), []);
  const state = useSyncExternalStore(store.subscribe, store.getState, () => EMPTY_SAVED);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <p className="lbj-filter-note" role="status">
        Reading the items saved in this browser…
      </p>
    );
  }

  const isEmpty =
    state.jobs.length === 0 && state.watches.length === 0 && state.interests.length === 0;

  return (
    <div>
      {isEmpty ? (
        <div className="lbj-state">
          <h2 className="lbj-state__title j-display">Nothing saved yet.</h2>
          <p className="lbj-state__text">
            Saving an opportunity, watching a search and expressing interest all happen on this
            device only. Nothing is sent anywhere, and no account is required.
          </p>
          <div className="lbj-state__actions">
            <a className="lbj-btn" href={JOBS_ROUTES.index}>
              Browse opportunities
            </a>
          </div>
        </div>
      ) : null}

      {state.watches.length > 0 ? (
        <section className="lbj-saved-group" aria-labelledby="lbj-saved-searches">
          <h2 className="lbj-saved-group__title" id="lbj-saved-searches">
            Search watches ({state.watches.length})
          </h2>
          <p className="lbj-filter-note">
            A watch records the query. In the product the private job agent would look for new
            postings that match it; in this preview it is only stored here.
          </p>
          <ul className="lbj-saved-list">
            {state.watches.map((watch) => (
              <li key={watch.query}>
                <span>{watch.label}</span>
                <span className="lbj-saved-list__when j-num">
                  added {formatDate(watch.createdAt) ?? 'unknown date'}
                </span>
                <a href={`${JOBS_ROUTES.index}?${watch.query}`}>Run search</a>
                <button
                  type="button"
                  className="lbj-btn lbj-btn--link"
                  aria-label={`Remove search watch: ${watch.label}`}
                  onClick={() => store.removeWatch(watch.query)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {state.jobs.length > 0 ? (
        <section className="lbj-saved-group" aria-labelledby="lbj-saved-jobs">
          <h2 className="lbj-saved-group__title" id="lbj-saved-jobs">
            Saved opportunities ({state.jobs.length})
          </h2>
          <ul className="lbj-saved-list">
            {state.jobs.map((job) => (
              <li key={job.id}>
                <a href={JOBS_ROUTES.detail(job.id)}>{job.title}</a>
                <span className="j-muted">{job.employer}</span>
                <span className="lbj-saved-list__when j-num">
                  saved {formatDate(job.savedAt) ?? 'unknown date'}
                </span>
                <button
                  type="button"
                  className="lbj-btn lbj-btn--link"
                  aria-label={`Remove saved opportunity: ${job.title}`}
                  onClick={() => store.removeJob(job.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {state.interests.length > 0 ? (
        <section className="lbj-saved-group" aria-labelledby="lbj-saved-interests">
          <h2 className="lbj-saved-group__title" id="lbj-saved-interests">
            Expressed interest ({state.interests.length})
          </h2>
          <p className="lbj-filter-note">
            Interest is one-sided: it is not a match, and it is not an application. In the product
            it would ask the private job agent to prepare a bounded disclosure request; here it is
            a local marker only.
          </p>
          <ul className="lbj-saved-list">
            {state.interests.map((interest) => (
              <li key={interest.id}>
                <a href={JOBS_ROUTES.detail(interest.id)}>{interest.title}</a>
                <span className="j-muted">{interest.employer}</span>
                <span className="lbj-saved-list__when j-num">
                  expressed {formatDate(interest.expressedAt) ?? 'unknown date'}
                </span>
                <button
                  type="button"
                  className="lbj-btn lbj-btn--link"
                  aria-label={`Withdraw expressed interest: ${interest.title}`}
                  onClick={() => store.removeInterest(interest.id)}
                >
                  Withdraw
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!isEmpty ? (
        <div className="lbj-state__actions">
          <button type="button" className="lbj-btn lbj-btn--quiet" onClick={() => store.clear()}>
            <Glyph name="ledger" size={12} />
            Clear everything stored here
          </button>
          <a className="lbj-btn lbj-btn--link" href={JOBS_ROUTES.index}>
            Back to search
          </a>
        </div>
      ) : null}
    </div>
  );
}
