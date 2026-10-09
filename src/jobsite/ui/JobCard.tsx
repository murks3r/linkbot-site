import { Glyph } from './Glyph.tsx';
import {
  EmploymentTypeMark,
  ExternalLink,
  FreshnessMark,
  SalaryValue,
  StatusMark,
  Unknown,
  WorkModeMark,
} from './primitives.tsx';
import type { JobOpportunity } from '../types.ts';
import { freshness, hostOf, primaryLocation, relativeFromNow } from '../lib/format.ts';

interface JobCardProps {
  job: JobOpportunity;
  /** Injected clock so freshness is deterministic in tests/snapshots. */
  nowMs: number;
  saved: boolean;
  onToggleSave: (job: JobOpportunity) => void;
  detailHref: string;
}

/**
 * One result. Optimised for scanning: title, employer, one dense meta line,
 * compensation, then the three distinct affordances — view, save, apply.
 * Viewing and saving are one-sided; only "Apply" leaves Linkbot.
 */
export function JobCard({ job, nowMs, saved, onToggleSave, detailHref }: JobCardProps) {
  const location = primaryLocation(job);
  const fresh = freshness(job.publishedAt, nowMs);
  const applyHost = hostOf(job.applyUrl);
  const observed = relativeFromNow(job.source.retrievedAt, nowMs);

  return (
    <li className="lbj-card" data-job-id={job.id} data-canonical-id={job.canonicalId}>
      <div className="lbj-card__head">
        <h3 className="lbj-card__title">
          <a href={detailHref}>{job.title}</a>
        </h3>
        {job.status !== 'active' ? <StatusMark status={job.status} /> : null}
      </div>

      <p className="lbj-card__employer">
        {job.employer.url ? (
          <ExternalLink href={job.employer.url}>{job.employer.name}</ExternalLink>
        ) : (
          job.employer.name
        )}
      </p>

      <div className="lbj-card__meta">
        {location ? (
          <span className="lbj-inline">
            <Glyph name="pin" size={11} /> {location}
          </span>
        ) : (
          <Unknown>Location unknown</Unknown>
        )}
        <WorkModeMark mode={job.workMode} />
        <EmploymentTypeMark type={job.employmentType} />
        <FreshnessMark freshness={fresh} />
      </div>

      {job.summary ? <p className="lbj-card__summary">{job.summary}</p> : null}

      <div className="lbj-card__meta">
        <SalaryValue salary={job.salary} />
      </div>

      <div className="lbj-card__actions">
        <a className="lbj-btn lbj-btn--link" href={detailHref}>
          View details
        </a>

        <button
          type="button"
          className="lbj-btn lbj-btn--link lbj-card__save"
          aria-pressed={saved}
          aria-label={`${saved ? 'Remove from saved' : 'Save'}: ${job.title}`}
          onClick={() => onToggleSave(job)}
        >
          <Glyph name={saved ? 'bookmarkFilled' : 'bookmark'} size={12} />
          {saved ? 'Saved' : 'Save'}
        </button>

        {job.applyUrl ? (
          <ExternalLink href={job.applyUrl} className="lbj-btn lbj-btn--quiet lbj-btn--sm">
            Apply on {applyHost ?? 'the original posting'}
          </ExternalLink>
        ) : (
          <Unknown>Original application link not provided</Unknown>
        )}
      </div>

      <p className="lbj-card__source">
        Source: {job.source.name}
        {observed ? ` · observed ${observed}` : ''}
        {job.canonicalId ? ` · ref ${job.canonicalId}` : ''}
      </p>
    </li>
  );
}
