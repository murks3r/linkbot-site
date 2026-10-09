// @ts-nocheck
/** Specimen: tokens, type roles, seal scale and controls. Reads real CSS values. */
import { h, icon, seal, unknown, mark } from './dom.js';

const root = document.documentElement;
const main = document.getElementById('main');
const cssVar = (name) => getComputedStyle(root).getPropertyValue(name).trim();

/* contrast, computed live from the resolved tokens */
const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return ((x + 0.05) / (y + 0.05)).toFixed(2); };

function swatch(token, label) {
  const hex = cssVar(`--${token}`);
  const dark = lum(hex) < 0.3;
  const chip = h('div', { class: 'swatch__chip', dataset: { token } }, h('span', {}, dark ? 'Aa' : 'Aa'));
  chip.style.setProperty('background', `var(--${token})`);
  chip.style.setProperty('color', dark ? '#fff' : '#101216');
  return h(
    'div',
    { class: 'swatch' },
    chip,
    h('span', { class: 'swatch__name' }, label || token),
    h('span', { class: 'swatch__meta' }, `${hex} · ${ratio(hex, cssVar('--paper'))}:1 on paper`),
  );
}

function section(title, kicker, ...body) {
  return h(
    'section',
    { class: 'sys-section', 'aria-labelledby': `h-${title.replace(/\W+/g, '-').toLowerCase()}` },
    h('div', { class: 'rulehead' }, h('h2', { class: 't-label', id: `h-${title.replace(/\W+/g, '-').toLowerCase()}` }, title), h('span', { class: 't-label muted' }, kicker)),
    ...body,
  );
}

function toast(text) {
  const region = document.getElementById('toasts');
  const t = h('div', { class: 'toast' }, icon('check', { size: 16 }), text);
  region.append(t);
  setTimeout(() => t.remove(), 2600);
}

function build() {
  main.replaceChildren();

  /* ---------- head ---------- */
  const audience = h(
    'div',
    { class: 'seg', role: 'radiogroup', 'aria-label': 'Audience register' },
    ...['talent', 'developers', 'employers'].map((a) =>
      h(
        'label',
        { class: 'seg__item' },
        h('input', { class: 'seg__input', type: 'radio', name: 'aud', value: a, checked: root.dataset.audience === a, onChange: () => { root.dataset.audience = a; build(); } }),
        h('span', { class: 'seg__face' }, a[0].toUpperCase() + a.slice(1)),
      ),
    ),
  );

  main.append(
    h(
      'header',
      { class: 'sys-head' },
      h('div', { class: 'sys-head__top' }, h('a', { class: 't-label', href: '/' }, '← Prototype'), audience),
      h('span', { class: 'eyebrow' }, 'System · prototype'),
      h('h1', { class: 't-d2' }, 'One seal, three registers.'),
      h('p', { class: 't-lead', style: undefined }, 'The master identity grows from the notarial seal. Talent, Developers and Employers share ground, type, grid and controls; only the accent and a few labels change.'),
    ),
  );

  /* ---------- palette ---------- */
  main.append(
    section(
      'Palette',
      'One accent per register',
      h('div', { class: 'swatches' }, ...[
        ['paper', 'Paper'], ['surface', 'Surface'], ['sunken', 'Sunken'], ['ink', 'Ink'], ['ink-2', 'Ink 2'], ['muted', 'Muted'], ['rule', 'Rule'], ['control', 'Control'],
      ].map(([t, l]) => swatch(t, l))),
      h('div', { class: 'swatches' }, ...[['accent', 'Accent'], ['accent-ink', 'Accent ink'], ['accent-tint', 'Accent tint']].map(([t, l]) => swatch(t, l))),
      h('p', { class: 't-small muted' }, 'Ratios are computed in the browser from the resolved tokens. `npm run check` asserts every text pair ≥ 4.5:1 and every control border ≥ 3:1, for all three accents.'),
    ),
  );

  /* ---------- type roles ---------- */
  const role = (name, family, sample, meta, cls) =>
    h('div', { class: 'role' }, h('span', { class: 't-label' }, name), h('div', { class: cls }, sample), h('div', { class: 'role__meta' }, ...meta.map((m) => h('span', {}, m))));
  main.append(
    section(
      'Type roles',
      'Replaceable stand-ins',
      h(
        'div',
        { class: 'roles' },
        role('Display', '', 'Every job, on the record.', ['--font-display', 'stand-in: Inter Display · OFL 1.1', '500 / 600'], 't-d2'),
        role('Sans — reading', '', 'The employer published this role without a salary band. We show that plainly instead of guessing; you can still search, save and ask your agent to watch for an update.', ['--font-sans', 'stand-in: Inter · OFL 1.1', '400 / 500 / 600'], 't-read'),
        role('Mono — facts, provenance, ids', '', 'canon-opp-0043 · retrieved 6 Oct 2026 06:00 UTC · €85,000–105,000 / year', ['--font-mono', 'stand-in: DejaVu Sans Mono · Bitstream Vera', '400 / 700, tabular'], 't-mono'),
      ),
      h(
        'div',
        { class: 'scale' },
        ...[
          ['d1 · 46–120', 't-d1', 'Seal'],
          ['d2 · 36–64', 't-d2', 'On the record'],
          ['d3 · 28–40', 't-d3', 'Senior Platform Engineer'],
          ['title · 20/28', 't-title', 'Backend Engineer, Payments'],
          ['lead · 18–22', 't-lead', 'Search free. Keep an agent private.'],
          ['body · 16/26', '', 'Fixtures are labelled everywhere they appear.'],
          ['small · 14/20', 't-small', 'Observed 3 days before the prototype clock.'],
          ['label · 12 mono', 't-label', 'Provenance · record'],
        ].map(([k, c, s]) => h('div', { class: 'scale__row' }, h('span', { class: 't-mono muted' }, k), h('span', { class: c }, s))),
      ),
    ),
  );

  /* ---------- seal ---------- */
  const rows = [
    ['verified', 'Observed on the employer’s own page or applicant system and re-checked within 72 hours.'],
    ['sourced', 'Attributed to a named third-party source, seen within 7 days; not re-checked at the employer.'],
    ['stale', 'Last observed more than 7 days ago. It may have closed — confirm at the source before acting.'],
    ['unknown', 'We cannot say where or when this was published. Shown honestly; never hidden, never guessed.'],
  ];
  main.append(
    section(
      'The seal',
      'Provenance as a state system',
      h('div', { class: 'seal-scale' }, ...rows.map(([s, d]) => h('div', { class: 'seal-scale__row' }, seal(s, { large: true }), h('p', { class: 't-small' }, d)))),
      h('div', { class: 'demo-row' }, h('span', { class: 't-label' }, 'Brand mark (provisional)'), h('span', { class: 'demo-row' }, mark(40), h('span', { class: 't-d3' }, 'Linkbot')), h('span', { class: 'void' }, 'Pay not stated'), unknown()),
    ),
  );

  /* ---------- controls ---------- */
  const check = (label, count, checked, radio) =>
    h('label', { class: `check${radio ? ' check--radio' : ''}` }, h('input', { class: 'check__input', type: radio ? 'radio' : 'checkbox', name: radio ? 'demo-radio' : undefined, checked }), h('span', { class: 'check__box' }), h('span', { class: 'check__text' }, label), count !== undefined && h('span', { class: 'check__count' }, count));
  const sw = (on) => {
    const b = h('button', { class: 'switch', type: 'button', role: 'switch', 'aria-checked': on ? 'true' : 'false', onClick: () => b.setAttribute('aria-checked', b.getAttribute('aria-checked') === 'true' ? 'false' : 'true') }, h('span', { class: 'switch__track' }, h('span', { class: 'switch__thumb' })), h('span', { class: 'switch__state' }), h('span', {}, 'Job Agent'));
    return b;
  };
  main.append(
    section(
      'Controls',
      'Nearly square · glyph + word',
      h('div', { class: 'demo-row' },
        h('button', { class: 'btn btn--primary btn--lg', type: 'button', onClick: () => toast('Saved to this device') }, 'Search 48 jobs', icon('arrow-right')),
        h('button', { class: 'btn btn--primary', type: 'button' }, 'Apply at source', icon('arrow-up-right')),
        h('button', { class: 'btn btn--secondary', type: 'button' }, icon('bookmark'), 'Save'),
        h('button', { class: 'btn btn--quiet', type: 'button' }, 'Clear all'),
        h('button', { class: 'btn btn--primary', type: 'button', disabled: true }, 'Disabled'),
        h('button', { class: 'icon-btn icon-btn--outlined', type: 'button', 'aria-label': 'Save job', 'aria-pressed': 'false', onClick: (e) => { const b = e.currentTarget; const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); b.replaceChildren(icon(on ? 'bookmark-fill' : 'bookmark')); } }, icon('bookmark')),
      ),
      h('div', { class: 'demo-grid' },
        h('div', { class: 'field' }, h('label', { class: 'field__label', for: 'd-q' }, 'What'), h('input', { class: 'input', id: 'd-q', type: 'search', placeholder: 'Role, skill or employer' })),
        h('div', { class: 'field' }, h('label', { class: 'field__label', for: 'd-s' }, 'Sort'), h('div', { class: 'select' }, h('select', { id: 'd-s' }, h('option', {}, 'Most relevant'), h('option', {}, 'Newest first')), icon('chevron-down'))),
        h('fieldset', { class: 'field', style: undefined }, h('legend', { class: 'field__label' }, 'Work mode'), check('Remote', 14, true), check('Hybrid', 22, false), check('Unknown', 3, false)),
        h('fieldset', { class: 'field' }, h('legend', { class: 'field__label' }, 'Posted'), check('Any time', undefined, true, true), check('Last 7 days', undefined, false, true)),
      ),
      h('div', { class: 'demo-row' },
        sw(true), sw(false),
        h('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Sample segmented control' }, ...['Relevant', 'Newest', 'Pay'].map((l, i) => h('label', { class: 'seg__item' }, h('input', { class: 'seg__input', type: 'radio', name: 'sample-seg', checked: i === 0 }), h('span', { class: 'seg__face' }, l)))),
        h('span', { class: 'chip' }, h('span', { class: 'chip__text' }, 'Remote'), h('button', { class: 'chip__x', type: 'button', 'aria-label': 'Remove Remote' }, icon('close', { size: 14 }))),
        h('span', { class: 'tag' }, 'TypeScript'), h('span', { class: 'tag tag--solid' }, 'Synthetic'),
      ),
    ),
  );

  /* ---------- spacing ---------- */
  main.append(
    section('Space & radius', '4px base', h('div', { class: 'spacing' }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
      const bar = h('span', { class: 'spacing__bar' });
      bar.style.setProperty('width', `var(--s-${n})`);
      return h('div', { class: 'spacing__row' }, h('span', {}, `s-${n}`), bar);
    })), h('p', { class: 't-small muted' }, 'Radii: 0 · 2px · 4px, plus the 45° chamfer (10 / 14px) on filled primary actions. No shadows, no gradients.')),
  );
}

build();
