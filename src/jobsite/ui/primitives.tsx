import type { ReactNode } from 'react';
import { Glyph } from './Glyph.tsx';
import {
  EMPLOYMENT_TYPE_LABELS,
  OPPORTUNITY_STATUS_LABELS,
  WORK_MODE_LABELS,
  type EmploymentType,
  type OpportunityStatus,
  type SalaryInfo,
  type WorkMode,
} from '../types.ts';
import {
  FRESHNESS_LABELS,
  formatSalary,
  hostOf,
  type Freshness,
} from '../lib/format.ts';

/**
 * The Unknown state. Brand rule: an unknown value is rendered as a real,
 * legible value — never as a dash, a zero, an empty gap or a green tick.
 * Colour + glyph + word, always together.
 */
export function Unknown({ children = 'Unknown' }: { children?: ReactNode }) {
  return (
    <span className="lbj-unknown">
      <Glyph name="ring" size={11} />
      <span>{children}</span>
    </span>
  );
}

/** Validity/withdrawal status: colour + glyph + word. */
export function StatusMark({ status }: { status: OpportunityStatus }) {
  const glyph = status === 'active' ? 'square' : status === 'unknown' ? 'ring' : 'dot';
  const modifier =
    status === 'active'
      ? 'lbj-mark--active'
      : status === 'unknown'
        ? 'lbj-mark--unknown'
        : status === 'withdrawn'
          ? 'lbj-mark--withdrawn'
          : 'lbj-mark--expired';
  return (
    <span className={`lbj-mark ${modifier}`}>
      <Glyph name={glyph} size={10} />
      {OPPORTUNITY_STATUS_LABELS[status]}
    </span>
  );
}

export function WorkModeMark({ mode }: { mode: WorkMode }) {
  if (mode === 'unknown') return <Unknown>Work mode unknown</Unknown>;
  return <span className="lbj-mark lbj-mark--workmode">{WORK_MODE_LABELS[mode]}</span>;
}

export function EmploymentTypeMark({ type }: { type: EmploymentType }) {
  if (type === 'unknown') return <Unknown>Engagement unknown</Unknown>;
  return <span className="lbj-mark lbj-mark--workmode">{EMPLOYMENT_TYPE_LABELS[type]}</span>;
}

export function FreshnessMark({ freshness }: { freshness: Freshness }) {
  if (freshness.bucket === 'unknown') return <Unknown>Freshness unknown</Unknown>;
  const modifier =
    freshness.bucket === 'fresh'
      ? 'lbj-mark--fresh'
      : freshness.bucket === 'recent'
        ? 'lbj-mark--fresh-recent'
        : 'lbj-mark--fresh-older';
  return (
    <span className={`lbj-mark ${modifier}`}>
      <Glyph name="clock" size={10} />
      {FRESHNESS_LABELS[freshness.bucket]}
      {freshness.relative ? <span className="j-num">· {freshness.relative}</span> : null}
    </span>
  );
}

/** Compensation, or the Unknown state. Never a placeholder amount. */
export function SalaryValue({ salary }: { salary: SalaryInfo }) {
  const text = formatSalary(salary);
  if (!text) return <Unknown>Compensation not stated</Unknown>;
  return (
    <span className="lbj-card__salary">
      <span className="j-num">{text}</span>
      {salary.note ? <span className="j-muted"> · {salary.note}</span> : null}
    </span>
  );
}

/**
 * A link that leaves Linkbot for the original posting. Never opened in the
 * same context: the visitor must be able to tell an application apart from
 * viewing inside Linkbot.
 */
export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const host = hostOf(href);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={['lbj-ext', className].filter(Boolean).join(' ')}
    >
      {children}
      {host ? <span className="j-sr"> (opens {host} in a new tab)</span> : null}
      <Glyph name="external" size={11} />
    </a>
  );
}
