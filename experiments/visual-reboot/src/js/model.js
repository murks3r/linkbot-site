// @ts-nocheck
/**
 * Pure logic: provenance, query state, search, facets and formatting.
 * No DOM here, so it can be reasoned about (and tested) on its own.
 *
 * Carried over from the PR #12 workflow (not its visual design):
 *   - the URL is the source of truth for a search
 *   - parsing is total: unknown or malformed values are dropped, never guessed
 *   - "Unknown" is a real, selectable value, never an absence
 *   - sorts: relevance / newest / oldest / pay high→low / pay low→high
 */
import { COUNTRIES, DAY, JOBS, NOW, OCCUPATIONS } from './data.js';

/* ------------------------------------------------------------------ labels */

export const WORK_MODES = ['remote', 'hybrid', 'onsite', 'unknown'];
export const WORK_MODE_LABELS = { remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site', unknown: 'Unknown' };
export const TYPES = ['full_time', 'part_time', 'contract', 'internship', 'unknown'];
export const TYPE_LABELS = { full_time: 'Full-time', part_time: 'Part-time', contract: 'Contract', internship: 'Internship', unknown: 'Unknown' };
export const PROV = ['verified', 'sourced', 'stale', 'unknown'];
export const SORTS = { relevance: 'Most relevant', newest: 'Newest first', oldest: 'Oldest first', pay_desc: 'Pay: high to low', pay_asc: 'Pay: low to high' };
export const SINCE = [
  { v: 1, label: 'Last 24 hours' },
  { v: 7, label: 'Last 7 days' },
  { v: 30, label: 'Last 30 days' },
];
export const CURRENCIES = ['EUR', 'GBP', 'USD', 'CHF'];

/* -------------------------------------------------------------- provenance */

const PROV_RANK = { verified: 0, sourced: 1, stale: 2, unknown: 3 };

export const SEAL_RULES = {
  verified: 'Observed on the employer’s own page or applicant system and re-checked within 72 hours.',
  sourced: 'Attributed to a named third-party source and seen within 7 days; not re-checked at the employer.',
  stale: 'Last observed more than 7 days ago. It may have closed — confirm at the source before acting.',
  unknown: 'We cannot say where this was published. Shown honestly rather than hidden, and never guessed.',
};

/** State is derived, never stored, so it moves with the prototype clock. */
export function provenanceOf(job) {
  if (!job.source || job.obs.length === 0) {
    return { state: 'unknown', lastSeen: null, firstSeen: null, count: 0, why: 'No source could be attributed to this posting.' };
  }
  const lastSeen = Math.min(...job.obs);
  const firstSeen = Math.max(...job.obs);
  const direct = ['ats', 'employer_site'].includes(job.source.kind);
  let state = 'sourced';
  if (lastSeen > 7) state = 'stale';
  else if (direct && lastSeen <= 3) state = 'verified';
  const where = `${job.source.name} (${job.source.kindLabel.toLowerCase()})`;
  const why = {
    verified: `Read from ${where} ${rel(lastSeen)} and re-checked at the source within 72 hours.`,
    sourced: `Attributed to ${where}, last seen ${rel(lastSeen)}. Not re-checked at the employer.`,
    stale: `Last seen on ${where} ${rel(lastSeen)}. It may have closed since.`,
  }[state];
  return { state, lastSeen, firstSeen, count: job.obs.length, why };
}

/* -------------------------------------------------------------- formatting */

const nf = new Intl.NumberFormat('en-GB');
const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const timeFmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
const SYMBOL = { EUR: '€', GBP: '£', USD: '$', CAD: 'C$' };

export const fmtDate = (daysAgo) => dateFmt.format(new Date(NOW - daysAgo * DAY));
export const fmtDateMs = (ms) => dateFmt.format(new Date(ms));
export const fmtDateTimeMs = (ms) => `${dateFmt.format(new Date(ms))}, ${timeFmt.format(new Date(ms))} UTC`;
export const fmtFuture = (days) => dateFmt.format(new Date(NOW + days * DAY));

export function rel(days) {
  if (days <= 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 14) return `${days} days ago`;
  const weeks = Math.round(days / 7);
  return weeks < 9 ? `${weeks} weeks ago` : `${Math.round(days / 30)} months ago`;
}

const PER = { year: '/ year', month: '/ month', day: '/ day', hour: '/ hour' };

/** "€85,000–105,000 / year"; `null` pay is handled by the caller as UNKNOWN. */
export function fmtPay(pay) {
  if (!pay) return null;
  const sym = SYMBOL[pay.cur] || `${pay.cur} `;
  const a = nf.format(pay.min);
  const b = pay.max && pay.max !== pay.min ? `–${nf.format(pay.max)}` : '';
  return `${sym}${a}${b} ${PER[pay.per] || ''}`.trim();
}

export function fmtLoc(job) {
  if (!job.loc) return null;
  return job.loc.raw;
}

/* ---------------------------------------------------- unknowns (the honest part) */

/** Everything the source did not state, as plain language. Drives the "What nobody said" block. */
export function unknownsOf(job) {
  const out = [];
  if (!job.loc || !job.loc.country) out.push({ key: 'location', label: 'Location', text: job.loc ? 'Only a region was stated, not a country.' : 'No location was stated.' });
  if (job.mode === 'unknown') out.push({ key: 'mode', label: 'Work mode', text: 'Remote, hybrid or on-site was not stated.' });
  if (job.type === 'unknown') out.push({ key: 'type', label: 'Employment type', text: 'Full-time, part-time or contract was not stated.' });
  if (!job.pay) out.push({ key: 'pay', label: 'Pay', text: 'No pay or band was stated. We will not estimate one.' });
  if (job.posted === null) out.push({ key: 'posted', label: 'Published', text: 'The source gave no publication date.' });
  if (job.valid === null && job.status === 'active') out.push({ key: 'valid', label: 'Closing date', text: 'No closing date was stated; it may be open-ended.' });
  if (!job.source) out.push({ key: 'source', label: 'Source', text: 'We cannot attribute this posting to a source.' });
  if (!job.applyUrl) out.push({ key: 'apply', label: 'Application link', text: 'No original application link was stated.' });
  if (!job.employer.url) out.push({ key: 'employer', label: 'Employer site', text: 'No employer website was stated.' });
  return out;
}

/** The record as structured data (shown in the Developers register). */
export function recordJson(job) {
  const p = provenanceOf(job);
  return {
    id: job.id,
    canonicalId: job.canonicalId,
    synthetic: true,
    title: job.title,
    employer: { name: job.employer.name, url: job.employer.url },
    location: job.loc ? { city: job.loc.city, country: job.loc.cc, raw: job.loc.raw } : null,
    workMode: job.mode === 'unknown' ? null : job.mode,
    employmentType: job.type === 'unknown' ? null : job.type,
    pay: job.pay ? { min: job.pay.min, max: job.pay.max, currency: job.pay.cur, period: job.pay.per, note: job.pay.note } : null,
    publishedAt: job.posted === null ? null : new Date(NOW - job.posted * DAY).toISOString().slice(0, 10),
    validThrough: job.valid === null ? null : new Date(NOW + job.valid * DAY).toISOString().slice(0, 10),
    status: job.status,
    language: job.lang,
    applyUrl: job.applyUrl,
    provenance: {
      seal: p.state,
      source: job.source ? { name: job.source.name, kind: job.source.kind } : null,
      firstObservedAt: p.firstSeen === null ? null : new Date(NOW - p.firstSeen * DAY).toISOString().slice(0, 10),
      lastObservedAt: p.lastSeen === null ? null : new Date(NOW - p.lastSeen * DAY).toISOString().slice(0, 10),
      observations: p.count,
    },
  };
}

/* -------------------------------------------------------------------- query */

export const EMPTY_QUERY = Object.freeze({ q: '', loc: '', wm: [], et: [], cc: '', occ: '', sal: null, cur: 'EUR', since: null, prov: [], closed: false, sort: 'relevance' });

const list = (v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);
const only = (values, allowed) => values.filter((v) => allowed.includes(v));
const num = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : null;
};

/** Total: never throws; malformed or unknown values are dropped, not reinterpreted. */
export function parseQuery(search) {
  const p = new URLSearchParams(search || '');
  const cc = (p.get('cc') || '').toUpperCase();
  const sort = p.get('sort');
  const since = num(p.get('since'));
  return {
    q: (p.get('q') || '').trim(),
    loc: (p.get('loc') || '').trim(),
    wm: only(list(p.get('wm')), WORK_MODES),
    et: only(list(p.get('et')), TYPES),
    cc: COUNTRIES[cc] ? cc : '',
    occ: OCCUPATIONS[p.get('occ')] ? p.get('occ') : '',
    sal: num(p.get('sal')),
    cur: CURRENCIES.includes((p.get('cur') || '').toUpperCase()) ? p.get('cur').toUpperCase() : 'EUR',
    since: SINCE.some((s) => s.v === since) ? since : null,
    prov: only(list(p.get('prov')), PROV),
    closed: p.get('closed') === '1',
    sort: Object.keys(SORTS).includes(sort) ? sort : 'relevance',
  };
}

/** Defaults are omitted so links stay short. */
export function serializeQuery(q) {
  const p = new URLSearchParams();
  if (q.q) p.set('q', q.q);
  if (q.loc) p.set('loc', q.loc);
  if (q.wm.length) p.set('wm', q.wm.join(','));
  if (q.et.length) p.set('et', q.et.join(','));
  if (q.cc) p.set('cc', q.cc);
  if (q.occ) p.set('occ', q.occ);
  if (q.sal) {
    p.set('sal', String(q.sal));
    p.set('cur', q.cur);
  }
  if (q.since) p.set('since', String(q.since));
  if (q.prov.length) p.set('prov', q.prov.join(','));
  if (q.closed) p.set('closed', '1');
  if (q.sort !== 'relevance') p.set('sort', q.sort);
  return p.toString();
}

export function activeFilterCount(q) {
  return [q.wm.length, q.et.length, q.cc, q.occ, q.sal, q.since, q.prov.length, q.closed].filter(Boolean).length;
}

/** One removable chip per active filter, with the query that results from removing it. */
export function activeChips(q) {
  const chips = [];
  const without = (patch) => ({ ...q, ...patch });
  if (q.q) chips.push({ label: `“${q.q}”`, next: without({ q: '' }) });
  if (q.loc) chips.push({ label: `Where: ${q.loc}`, next: without({ loc: '' }) });
  q.wm.forEach((v) => chips.push({ label: WORK_MODE_LABELS[v], next: without({ wm: q.wm.filter((x) => x !== v) }) }));
  q.et.forEach((v) => chips.push({ label: TYPE_LABELS[v], next: without({ et: q.et.filter((x) => x !== v) }) }));
  if (q.cc) chips.push({ label: COUNTRIES[q.cc], next: without({ cc: '' }) });
  if (q.occ) chips.push({ label: OCCUPATIONS[q.occ].label, next: without({ occ: '' }) });
  if (q.sal) chips.push({ label: `≥ ${nf.format(q.sal)} ${q.cur} / yr`, next: without({ sal: null }) });
  if (q.since) chips.push({ label: SINCE.find((s) => s.v === q.since).label, next: without({ since: null }) });
  q.prov.forEach((v) => chips.push({ label: `Seal: ${v}`, next: without({ prov: q.prov.filter((x) => x !== v) }) }));
  if (q.closed) chips.push({ label: 'Incl. closed', next: without({ closed: false }) });
  return chips;
}

/** "senior backend · Remote · Germany" — used as a rule label by the Job Agent. */
export function describeQuery(q) {
  const parts = [];
  if (q.q) parts.push(q.q);
  if (q.loc) parts.push(q.loc);
  if (q.wm.length) parts.push(q.wm.map((v) => WORK_MODE_LABELS[v]).join(' / '));
  if (q.et.length) parts.push(q.et.map((v) => TYPE_LABELS[v]).join(' / '));
  if (q.cc) parts.push(COUNTRIES[q.cc]);
  if (q.occ) parts.push(OCCUPATIONS[q.occ].label);
  if (q.sal) parts.push(`≥ ${nf.format(q.sal)} ${q.cur}`);
  if (q.since) parts.push(SINCE.find((s) => s.v === q.since).label.toLowerCase());
  if (q.prov.length) parts.push(`seal: ${q.prov.join(' / ')}`);
  return parts.length ? parts.join(' · ') : 'All jobs';
}

/* ------------------------------------------------------------------- search */

/* A few honest synonyms so "dev", "pm" or "ux" behave the way people type. */
const SYNONYMS = {
  dev: ['engineer', 'developer'], developer: ['engineer'], swe: ['engineer'], ux: ['design', 'researcher'], pm: ['product manager'],
  sre: ['reliability'], ml: ['machine learning'], ai: ['machine learning'], devops: ['platform'], 'front-end': ['frontend'], 'back-end': ['backend'],
  nurse: ['nurse'], remote: ['remote'],
};

const tokenize = (s) => s.toLowerCase().split(/[^a-z0-9+#&./-]+/).filter(Boolean);

const indexCache = new Map();
function indexOf(job) {
  if (!indexCache.has(job.id)) {
    const modeWords = job.mode === 'remote' ? 'remote' : job.mode === 'hybrid' ? 'hybrid' : job.mode === 'onsite' ? 'onsite on-site' : '';
    indexCache.set(job.id, {
      title: job.title.toLowerCase(),
      occ: job.occLabel.toLowerCase(),
      skills: job.skills.join(' ').toLowerCase(),
      employer: job.employer.name.toLowerCase(),
      place: `${job.loc ? job.loc.raw : ''} ${job.loc?.cc || ''} ${modeWords}`.toLowerCase(),
      other: `${job.summary} ${job.description.about}`.toLowerCase(),
    });
  }
  return indexCache.get(job.id);
}

/** Score for one token (or any of its synonyms); 0 = no match. */
function tokenScore(ix, token) {
  const alts = [token, ...(SYNONYMS[token] || [])];
  let best = 0;
  for (const alt of alts) {
    if (ix.title.includes(alt)) best = Math.max(best, 5);
    else if (ix.skills.includes(alt) || ix.employer.includes(alt) || ix.occ.includes(alt)) best = Math.max(best, 3);
    else if (ix.place.includes(alt)) best = Math.max(best, 2);
    else if (ix.other.includes(alt)) best = Math.max(best, 1);
  }
  return best;
}

function textScore(job, text, fields) {
  const tokens = tokenize(text);
  if (tokens.length === 0) return 1;
  const ix = indexOf(job);
  const scoped = fields ? { title: '', occ: '', skills: '', employer: '', other: '', place: ix.place } : ix;
  let total = 0;
  for (const t of tokens) {
    const s = tokenScore(scoped, t);
    if (s === 0) return 0; // every word must match
    total += s;
  }
  return total;
}

const ANNUAL = { year: 1, month: 12 };
const annualOf = (pay) => (pay && ANNUAL[pay.per] ? { min: pay.min * ANNUAL[pay.per], max: (pay.max || pay.min) * ANNUAL[pay.per] } : null);

/* Rounded reference rates, used ONLY to order the "Pay" sorts. Amounts are always shown as posted. */
const FX = { EUR: 1, GBP: 1.15, USD: 0.92, CHF: 1.05, SEK: 0.09, PLN: 0.23, DKK: 0.134, CAD: 0.67 };
const PERIOD = { year: 1, month: 12, day: 220, hour: 1650 };
const sortPay = (job) => (job.pay ? ((job.pay.min + (job.pay.max || job.pay.min)) / 2) * (PERIOD[job.pay.per] || 1) * (FX[job.pay.cur] || 1) : null);

/** `skip` leaves one facet out, so its own counts reflect "what if I chose this?". */
export function filterJobs(q, skip = null) {
  const out = [];
  for (const job of JOBS) {
    if (!q.closed && job.status === 'closed') continue;
    const prov = provenanceOf(job).state;
    if (skip !== 'wm' && q.wm.length && !q.wm.includes(job.mode)) continue;
    if (skip !== 'et' && q.et.length && !q.et.includes(job.type)) continue;
    if (skip !== 'cc' && q.cc && job.loc?.cc !== q.cc) continue;
    if (skip !== 'occ' && q.occ && job.occ !== q.occ) continue;
    if (skip !== 'prov' && q.prov.length && !q.prov.includes(prov)) continue;
    if (skip !== 'since' && q.since && (job.posted === null || job.posted > q.since)) continue;
    if (skip !== 'sal' && q.sal) {
      const a = annualOf(job.pay);
      if (!a || job.pay.cur !== q.cur || a.max < q.sal) continue;
    }
    let score = 1;
    if (q.q) {
      score = textScore(job, q.q);
      if (!score) continue;
    }
    if (q.loc) {
      const wantsRemote = /remote/i.test(q.loc);
      const s = textScore(job, q.loc, 'place');
      if (!s && !(wantsRemote && job.mode === 'remote')) continue;
    }
    out.push({ job, score, prov });
  }
  return out;
}

export function search(q) {
  const rows = filterJobs(q);
  const recency = (j) => (j.posted === null ? 1e9 : j.posted);
  const byRecency = (a, b) => recency(a.job) - recency(b.job);
  const cmp = {
    relevance: (a, b) => b.score - a.score || PROV_RANK[a.prov] - PROV_RANK[b.prov] || byRecency(a, b),
    newest: byRecency,
    oldest: (a, b) => (a.job.posted === null) - (b.job.posted === null) || (b.job.posted ?? 0) - (a.job.posted ?? 0),
    pay_desc: (a, b) => (sortPay(b.job) ?? -1) - (sortPay(a.job) ?? -1) || byRecency(a, b),
    pay_asc: (a, b) => (sortPay(a.job) ?? 1e12) - (sortPay(b.job) ?? 1e12) || byRecency(a, b),
  }[q.sort];
  rows.sort(cmp);
  return rows.map((r) => ({ ...r.job, seal: r.prov }));
}

/** Counts per facet value, each ignoring its own filter. */
export function facets(q) {
  const count = (skip, pick) => {
    const counts = {};
    for (const { job, prov } of filterJobs(q, skip)) {
      const key = pick(job, prov);
      if (key !== null && key !== undefined) counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  };
  const closedHidden = q.closed ? 0 : JOBS.filter((j) => j.status === 'closed').length;
  return {
    wm: count('wm', (j) => j.mode),
    et: count('et', (j) => j.type),
    prov: count('prov', (j, p) => p),
    cc: count('cc', (j) => j.loc?.cc ?? null),
    occ: count('occ', (j) => j.occ),
    closedHidden,
  };
}

/** Open listings published after `sinceMs` that match a saved rule. */
export function matchesSince(q, sinceMs) {
  return search({ ...q, sort: 'newest' }).filter((j) => j.posted !== null && NOW - j.posted * DAY > sinceMs);
}

export function sealCounts() {
  const counts = { verified: 0, sourced: 0, stale: 0, unknown: 0 };
  for (const job of JOBS) if (job.status !== 'closed') counts[provenanceOf(job).state] += 1;
  return counts;
}

export const openJobCount = () => JOBS.filter((j) => j.status !== 'closed').length;
export const countryCount = () => new Set(JOBS.filter((j) => j.loc?.cc).map((j) => j.loc.cc)).size;
export const employerCount = () => new Set(JOBS.map((j) => j.employer.name)).size;
