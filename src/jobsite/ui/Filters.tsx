import type { ChangeEvent } from 'react';
import type { JobSearchFacets, JobSearchQuery } from '../adapter.ts';
import {
  EMPLOYMENT_TYPES,
  EMPLOYMENT_TYPE_LABELS,
  WORK_MODES,
  WORK_MODE_LABELS,
  type EmploymentType,
  type WorkMode,
} from '../types.ts';
import { toggleValue } from '../lib/url-state.ts';
import { Glyph } from './Glyph.tsx';

export interface FilterOption {
  value: string;
  label: string;
}

interface FiltersProps {
  query: JobSearchQuery;
  /** Apply a patch. The parent resets the cursor and re-runs the search. */
  onChange: (patch: Partial<JobSearchQuery>) => void;
  occupations: FilterOption[];
  countries: FilterOption[];
  facets?: JobSearchFacets;
  onReset: () => void;
  /** Mobile disclosure state. */
  open: boolean;
}

const RECENCY_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Any time' },
  { value: '1', label: 'Last 24 hours' },
  { value: '3', label: 'Last 3 days' },
  { value: '7', label: 'Last 7 days' },
  { value: '14', label: 'Last 14 days' },
  { value: '30', label: 'Last 30 days' },
];

const CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF', 'PLN', 'SEK', 'DKK'];

export function Filters({
  query,
  onChange,
  occupations,
  countries,
  facets,
  onReset,
  open,
}: FiltersProps) {
  const workModes = query.workModes ?? [];
  const employmentTypes = query.employmentTypes ?? [];
  const countryValue = query.countryCodes?.[0] ?? '';
  const occupationValue = query.occupationIds?.[0] ?? '';

  const workModeCount = (mode: WorkMode): number | undefined => facets?.workMode?.[mode];
  const employmentCount = (type: EmploymentType): number | undefined =>
    facets?.employmentType?.[type];

  return (
    <div
      className={`lbj-filters__panel${open ? '' : ' is-collapsed'}`}
      id="jobsite-filters"
    >

      <fieldset className="lbj-filter-group">
        <legend>Occupation</legend>
        <select
          className="lbj-select"
          id="jobsite-occupation"
          aria-label="Occupation"
          value={occupationValue}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onChange({ occupationIds: e.target.value ? [e.target.value] : [] })
          }
        >
          <option value="">Any occupation</option>
          {occupations.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset className="lbj-filter-group">
        <legend>Country</legend>
        <select
          className="lbj-select"
          id="jobsite-country"
          aria-label="Country"
          value={countryValue}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onChange({ countryCodes: e.target.value ? [e.target.value] : [] })
          }
        >
          <option value="">Any country</option>
          {countries.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
          <option value="unknown">Country not stated</option>
        </select>
      </fieldset>

      <fieldset className="lbj-filter-group">
        <legend>Location</legend>
        <input
          className="lbj-input"
          id="jobsite-location"
          type="text"
          inputMode="search"
          autoComplete="off"
          placeholder="City or region"
          aria-label="Location"
          value={query.locationText ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange({ locationText: e.target.value || undefined })
          }
        />
      </fieldset>

      <fieldset className="lbj-filter-group">
        <legend>Work mode</legend>
        <div className="lbj-checks">
          {WORK_MODES.map((mode) => (
            <label className="lbj-check" key={mode}>
              <input
                type="checkbox"
                checked={workModes.includes(mode)}
                onChange={() => onChange({ workModes: toggleValue(workModes, mode) })}
              />
              <span>{WORK_MODE_LABELS[mode]}</span>
              {workModeCount(mode) !== undefined ? (
                <span className="lbj-check__count j-num">{workModeCount(mode)}</span>
              ) : null}
            </label>
          ))}
        </div>
        <p className="lbj-filter-note">
          “Unknown” selects postings whose work mode the source did not state. Leaving every box
          clear returns all modes, including unknown.
        </p>
      </fieldset>

      <fieldset className="lbj-filter-group">
        <legend>Employment type</legend>
        <div className="lbj-checks">
          {EMPLOYMENT_TYPES.map((type) => (
            <label className="lbj-check" key={type}>
              <input
                type="checkbox"
                checked={employmentTypes.includes(type)}
                onChange={() => onChange({ employmentTypes: toggleValue(employmentTypes, type) })}
              />
              <span>{EMPLOYMENT_TYPE_LABELS[type]}</span>
              {employmentCount(type) !== undefined ? (
                <span className="lbj-check__count j-num">{employmentCount(type)}</span>
              ) : null}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="lbj-filter-group">
        <legend>Minimum stated compensation</legend>
        <div className="lbj-row">
          <input
            className="lbj-input"
            id="jobsite-salary"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            placeholder="e.g. 60000"
            aria-label="Minimum stated compensation"
            value={query.salaryMin ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange({ salaryMin: e.target.value === '' ? null : Number(e.target.value) })
            }
          />
          <select
            className="lbj-select"
            aria-label="Compensation currency"
            value={query.salaryCurrency ?? 'EUR'}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onChange({ salaryCurrency: e.target.value })
            }
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <p className="lbj-filter-note">
          Only postings with a stated amount in the chosen currency can match, and the amount is
          compared exactly as posted — pay periods are not converted. Postings with no stated
          compensation are excluded while this filter is set.
        </p>
      </fieldset>

      <fieldset className="lbj-filter-group">
        <legend>Recency</legend>
        <select
          className="lbj-select"
          id="jobsite-recency"
          aria-label="Recency"
          value={query.postedWithinDays != null ? String(query.postedWithinDays) : ''}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onChange({ postedWithinDays: e.target.value === '' ? null : Number(e.target.value) })
          }
        >
          {RECENCY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="lbj-filter-note">
          Applied to the source’s publication date. Postings with no publication date cannot prove
          freshness and are excluded while this filter is set.
        </p>
      </fieldset>

      <fieldset className="lbj-filter-group">
        <legend>Validity</legend>
        <label className="lbj-check">
          <input
            type="checkbox"
            checked={query.includeClosed === true}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange({ includeClosed: e.target.checked })
            }
          />
          <span>Include withdrawn and expired postings</span>
        </label>
      </fieldset>

      <button type="button" className="lbj-btn lbj-btn--quiet lbj-btn--sm" onClick={onReset}>
        <Glyph name="ledger" size={12} />
        Reset filters
      </button>
    </div>
  );
}
