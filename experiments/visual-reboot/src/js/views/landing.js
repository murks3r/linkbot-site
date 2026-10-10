// @ts-nocheck
/** Screen 1 — public landing page with prominent job search. */
import { h, icon, seal, sealGlyph, unknown, jsonView } from '../dom.js';
import { JOB_BY_ID } from '../data.js';
import { COPY, QUICK_SEARCHES, REGISTERS } from '../copy.js';
import { SEAL_RULES, countryCount, employerCount, fmtDate, fmtLoc, fmtPay, openJobCount, provenanceOf, recordJson, rel, sealCounts, serializeQuery, EMPTY_QUERY, WORK_MODE_LABELS } from '../model.js';
import { getState, setAgentEnabled, setAudience, subscribe } from '../store.js';

const SPECIMEN_ID = 'j20'; // verified, with an honestly unknown pay band

function searchBar(copy, n) {
  const go = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const qs = serializeQuery({ ...EMPTY_QUERY, q: String(f.get('q') || '').trim(), loc: String(f.get('loc') || '').trim() });
    location.hash = `#/jobs${qs ? `?${qs}` : ''}`;
  };
  return h(
    'form',
    { class: 'searchbar regmarks', role: 'search', 'aria-label': 'Search jobs', novalidate: true, onSubmit: go },
    h('div', { class: 'searchbar__cell' }, h('label', { class: 'searchbar__label', for: 'hero-q' }, 'What'), h('input', { class: 'searchbar__input', id: 'hero-q', name: 'q', type: 'search', placeholder: copy.what, autocomplete: 'off', enterkeyhint: 'search' })),
    h('div', { class: 'searchbar__cell' }, h('label', { class: 'searchbar__label', for: 'hero-loc' }, 'Where'), h('input', { class: 'searchbar__input', id: 'hero-loc', name: 'loc', type: 'text', placeholder: 'City or remote', autocomplete: 'off' })),
    h('button', { class: 'btn btn--primary btn--lg searchbar__go', type: 'submit' }, copy.cta(n), icon('arrow-right')),
  );
}

function specimen(register, copy) {
  const job = JOB_BY_ID[SPECIMEN_ID];
  const p = provenanceOf(job);
  if (register === 'developers') {
    return h(
      'aside',
      { class: 'spec regmarks', 'aria-label': 'Specimen record as JSON' },
      h('div', { class: 'spec__top' }, h('span', { class: 't-label' }, copy.specimenKicker), h('span', { class: 'tag tag--solid' }, 'Synthetic')),
      h('pre', { class: 'code spec__code', tabindex: '0', 'aria-label': 'JSON for the specimen record' }, h('code', {}, ...jsonView(recordJson(job)))),
      h('a', { class: 'spec__link', href: `#/jobs/${job.id}` }, 'Open this record ', icon('arrow-right', { size: 16 })),
    );
  }
  const row = (k, v) => h('div', { class: 'spec__row' }, h('dt', { class: 't-label' }, k), h('dd', {}, v));
  return h(
    'aside',
    { class: 'spec regmarks', 'aria-label': 'Specimen record' },
    h('div', { class: 'spec__top' }, seal(p.state, { large: true }), h('span', { class: 'tag tag--solid' }, 'Synthetic')),
    h('p', { class: 't-label muted' }, copy.specimenKicker),
    h('h2', { class: 'spec__title t-title' }, job.title),
    h('p', { class: 'spec__employer' }, job.employer.name, ' · ', fmtLoc(job)),
    h(
      'dl',
      { class: 'spec__facts' },
      row('Work mode', WORK_MODE_LABELS[job.mode]),
      row('Pay', job.pay ? fmtPay(job.pay) : unknown()),
      row('Published', job.posted === null ? unknown() : fmtDate(job.posted)),
      row('Source', `${job.source.name} · ${job.source.kindLabel.toLowerCase()}`),
      row('Last seen', rel(p.lastSeen)),
    ),
    register === 'employers' && h('p', { class: 'spec__note t-small' }, 'Employers: this is exactly what a candidate sees. Keep the dates, pay and apply link current at your own page and the seal stays verified.'),
    h('a', { class: 'spec__link', href: `#/jobs/${job.id}` }, 'Open the full record ', icon('arrow-right', { size: 16 })),
  );
}

function sealLegend() {
  const counts = sealCounts();
  return h(
    'section',
    { class: 'section wrap', 'aria-labelledby': 'seal-h' },
    h('div', { class: 'rulehead' }, h('h2', { class: 't-label', id: 'seal-h' }, 'The seal'), h('span', { class: 't-label muted' }, 'Provenance on every listing')),
    h('p', { class: 'section__lead t-d3' }, 'Every listing wears one of four seals. Colour never works alone: each is a shape and a word.'),
    h(
      'ol',
      { class: 'plain seal-legend' },
      ...['verified', 'sourced', 'stale', 'unknown'].map((state) =>
        h(
          'li',
          { class: 'seal-legend__item' },
          h('div', { class: `seal-legend__glyph seal--${state}` }, sealGlyph(state, 56)),
          h('h3', { class: 'seal-legend__word t-label' }, state),
          h('p', { class: 't-small' }, SEAL_RULES[state]),
          h('a', { class: 'seal-legend__count', href: `#/jobs?prov=${state}` }, h('span', { class: 'tnum' }, String(counts[state])), ` listing${counts[state] === 1 ? '' : 's'}`, icon('arrow-right', { size: 16 })),
        ),
      ),
    ),
  );
}

function howItWorks() {
  const steps = [
    ['01', 'Search without signing up', 'Every listing we can read is searchable, free, with no account and nothing to install. Filters are plain: work mode, type, country, pay, and how recently it was posted.'],
    ['02', 'Read the record, not the pitch', 'Each listing carries its source, when we last saw it and a seal. What the employer did not say is shown as UNKNOWN, never filled in with a guess.'],
    ['03', 'Optionally, keep a private agent', 'Watch the searches you care about. The agent runs on your device, tells employers nothing, and writes down everything it does.'],
  ];
  return h(
    'section',
    { class: 'section wrap', 'aria-labelledby': 'how-h' },
    h('div', { class: 'rulehead' }, h('h2', { class: 't-label', id: 'how-h' }, 'How it works'), h('span', { class: 't-label muted' }, 'Three steps, one optional')),
    h('ol', { class: 'plain how' }, ...steps.map(([n, title, text], i) => h('li', { class: `how__item${i === 2 ? ' how__item--optional' : ''}` }, h('span', { class: 'how__n' }, n), h('h3', { class: 't-title' }, title), h('p', {}, text), i === 2 && h('span', { class: 'tag' }, 'Optional')))),
  );
}

function agentBand(copy) {
  const mini = h('div', { class: 'agent-mini regmarks' });
  const paint = () => {
    const s = getState();
    const on = s.agent.enabled;
    const sw = h(
      'button',
      { class: 'switch', type: 'button', role: 'switch', 'aria-checked': String(on), onClick: () => setAgentEnabled(!on) },
      h('span', { class: 'switch__track' }, h('span', { class: 'switch__thumb' })),
      h('span', { class: 'switch__state' }),
      h('span', { class: 't-title' }, copy.agent),
    );
    mini.replaceChildren(
      sw,
      h('p', { class: 'agent-mini__status' }, on ? `On. Watching ${s.agent.rules.length} search${s.agent.rules.length === 1 ? '' : 'es'} on this device.` : 'Off. Nothing is watching, and nothing is stored about you.'),
      h(
        'dl',
        { class: 'agent-mini__facts' },
        h('div', {}, h('dt', { class: 't-label' }, 'Runs on'), h('dd', {}, 'This device only')),
        h('div', {}, h('dt', { class: 't-label' }, 'Shared with employers'), h('dd', {}, 'Nothing')),
        h('div', {}, h('dt', { class: 't-label' }, 'Identity'), h('dd', {}, 'Yours until you apply')),
      ),
      h('a', { class: 'btn btn--primary', href: '#/saved/agent' }, 'Set up rules', icon('arrow-right')),
    );
  };
  paint();
  const unsub = subscribe(paint);
  const node = h(
    'section',
    { class: 'band on-dark', 'aria-labelledby': 'agent-h' },
    h(
      'div',
      { class: 'wrap band__grid grid' },
      h(
        'div',
        { class: 'band__text' },
        h('span', { class: 'eyebrow' }, 'Optional · private · from day one'),
        h('h2', { class: 't-d2', id: 'agent-h' }, 'An agent that works for you, and tells no one.'),
        h('p', { class: 't-lead' }, 'You never need it to search. Turn it on and it watches the searches you choose, right here in your browser, and brings back what is new.'),
        h(
          'ul',
          { class: 'plain ticks' },
          ...['Runs on this device. No account, no server list.', 'Never shares who you are until you decide to apply.', 'Every action goes into a log you can read, export or erase.'].map((t) => h('li', {}, icon('lock', { size: 18 }), h('span', {}, t))),
        ),
      ),
      h('div', { class: 'band__panel' }, mini),
    ),
  );
  return { node, unsub };
}

function registers() {
  const current = getState().audience;
  return h(
    'section',
    { class: 'section wrap', 'aria-labelledby': 'reg-h' },
    h('div', { class: 'rulehead' }, h('h2', { class: 't-label', id: 'reg-h' }, 'One mark, three registers'), h('span', { class: 't-label muted' }, 'Same grid, type and seal')),
    h(
      'ul',
      { class: 'plain registers' },
      ...Object.values(REGISTERS).map((r) =>
        h(
          'li',
          { class: `register register--${r.id}` },
          h('span', { class: 'register__bar' }),
          h('p', { class: 't-label muted' }, r.direction),
          h('h3', { class: 't-d3' }, r.name),
          h('p', { class: 'register__blurb' }, r.blurb),
          h('button', { class: `btn ${current === r.id ? 'btn--secondary' : 'btn--quiet'}`, type: 'button', 'aria-pressed': String(current === r.id), onClick: () => setAudience(r.id) }, current === r.id ? 'Viewing' : `View as ${r.name.toLowerCase()}`),
        ),
      ),
    ),
  );
}

export function render({ state }) {
  const register = state.audience;
  const copy = COPY[register];
  const n = openJobCount();
  const band = agentBand(copy);

  const node = h(
    'div',
    { class: 'landing' },
    h(
      'section',
      { class: 'hero wrap', 'aria-labelledby': 'hero-h' },
      h(
        'div',
        { class: 'hero__grid grid' },
        h('div', { class: 'hero__head' }, h('span', { class: 'eyebrow' }, copy.eyebrow), h('h1', { class: 't-d1', id: 'hero-h' }, copy.h1)),
        h(
          'div',
          { class: 'hero__main' },
          h('p', { class: 't-lead hero__lead' }, copy.lead),
          searchBar(copy, n),
          h('p', { class: 'quick' }, h('span', { class: 't-label muted' }, 'Try'), ...QUICK_SEARCHES.map((s) => h('a', { class: 'qchip', href: `#/jobs?q=${encodeURIComponent(s.q)}` }, s.label))),
          h(
            'dl',
            { class: 'stats' },
            h('div', {}, h('dd', { class: 'stats__n tnum' }, String(n)), h('dt', { class: 't-label' }, 'Listings')),
            h('div', {}, h('dd', { class: 'stats__n tnum' }, String(countryCount())), h('dt', { class: 't-label' }, 'Countries')),
            h('div', {}, h('dd', { class: 'stats__n tnum' }, String(employerCount())), h('dt', { class: 't-label' }, 'Employers')),
            h('div', {}, h('dd', { class: 'stats__n tnum' }, '0'), h('dt', { class: 't-label' }, 'Accounts needed')),
          ),
        ),
        h('div', { class: 'hero__aside' }, specimen(register, copy)),
      ),
    ),
    sealLegend(),
    howItWorks(),
    band.node,
    registers(),
  );

  return { title: 'Every job, on the record', node, destroy: band.unsub };
}
