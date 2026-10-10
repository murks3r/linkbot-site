// @ts-nocheck
/** Site chrome: prototype strip, header, footer, and toasts. */
import { h, icon, mark, append, clear } from './dom.js';
import { getState, setAudience, subscribe } from './store.js';
import { REGISTERS } from './copy.js';

export function toast(text, link) {
  const region = document.getElementById('toasts');
  const t = h('div', { class: 'toast' }, icon('check', { size: 16 }), h('span', {}, text), link && h('a', { class: 'toast__link', href: link.href }, link.label));
  region.append(t);
  setTimeout(() => t.remove(), 4200);
}

function protoStrip() {
  return h(
    'div',
    { class: 'proto', role: 'note' },
    h('div', { class: 'wrap proto__in' }, h('span', { class: 'proto__tag' }, 'Synthetic data'), h('span', { class: 'proto__text' }, 'Prototype: fictional employers and listings, not a live catalogue.', h('span', { class: 'proto__clock' }, ' Clock fixed at 9 Oct 2026, 09:00 UTC.'))),
  );
}

function header(route) {
  const s = getState();
  const link = (href, key, label, extra) =>
    h('a', { class: 'nav__link', href, 'aria-current': route.name === key.name && Boolean(route.agent) === Boolean(key.agent) ? 'page' : undefined }, label, extra);
  const savedCount = s.saved.length;
  return h(
    'header',
    { class: 'site-header' },
    h(
      'div',
      { class: 'wrap site-header__bar' },
      h('a', { class: 'brand', href: '#/', title: 'Provisional mark — production logo pending approval', 'aria-label': 'Linkbot — home' }, mark(30), h('span', { class: 'brand__word' }, 'Linkbot')),
      h(
        'nav',
        { class: 'nav', 'aria-label': 'Primary' },
        link('#/jobs', { name: 'results' }, 'Jobs'),
        link('#/saved', { name: 'saved', agent: false }, 'Saved', savedCount > 0 && h('span', { class: 'nav__count tnum', 'aria-label': `${savedCount} saved` }, String(savedCount))),
        link('#/saved/agent', { name: 'saved', agent: true }, 'Agent', h('span', { class: `nav__pip${s.agent.enabled ? ' is-on' : ''}` }), h('span', { class: 'sr-only' }, s.agent.enabled ? 'on' : 'off')),
      ),
      h(
        'div',
        { class: 'seg seg--header', role: 'radiogroup', 'aria-label': 'View as' },
        ...Object.values(REGISTERS).map((r) =>
          h('label', { class: 'seg__item' }, h('input', { class: 'seg__input', type: 'radio', name: 'register', value: r.id, checked: s.audience === r.id, onChange: () => setAudience(r.id) }), h('span', { class: 'seg__face' }, r.name)),
        ),
      ),
    ),
  );
}

function footer() {
  const s = getState();
  return h(
    'footer',
    { class: 'site-footer' },
    h(
      'div',
      { class: 'wrap' },
      h(
        'div',
        { class: 'site-footer__grid grid' },
        h('div', { class: 'site-footer__brand' }, h('a', { class: 'brand', href: '#/', 'aria-label': 'Linkbot — home' }, mark(30), h('span', { class: 'brand__word' }, 'Linkbot')), h('p', { class: 't-small muted' }, 'Free, public job discovery with provenance on every listing. The mark shown is provisional; the production logo is pending approval.')),
        h('div', {}, h('h2', { class: 't-label' }, 'Product'), h('ul', { class: 'plain site-footer__list' }, h('li', {}, h('a', { href: '#/jobs' }, 'Search jobs')), h('li', {}, h('a', { href: '#/saved' }, 'Saved jobs')), h('li', {}, h('a', { href: '#/saved/agent' }, 'Job Agent')), h('li', {}, h('a', { href: '/system' }, 'Design system')))),
        h(
          'div',
          {},
          h('h2', { class: 't-label' }, 'View as'),
          h('ul', { class: 'plain site-footer__list' }, ...Object.values(REGISTERS).map((r) => h('li', {}, h('button', { class: 'linkbtn', type: 'button', 'aria-pressed': String(s.audience === r.id), onClick: () => setAudience(r.id) }, r.name)))),
        ),
        h('div', {}, h('h2', { class: 't-label' }, 'This prototype'), h('ul', { class: 'plain site-footer__list t-small' }, h('li', {}, 'Every listing is synthetic; every employer is fictional.'), h('li', {}, 'Type is a set of temporary, correctly licensed stand-ins for the Brand workstream’s fonts.'), h('li', {}, 'No cookies, no analytics, no network requests. Saved items stay in this browser.'))),
      ),
      h('p', { class: 'site-footer__legal t-mono muted' }, 'Visual reboot · prototype for owner review · not a live service'),
    ),
  );
}

let chromeRoute = { name: 'landing' };

export function mountChrome(route) {
  chromeRoute = route;
  const top = document.getElementById('chrome-top');
  const bottom = document.getElementById('chrome-bottom');
  clear(top);
  clear(bottom);
  top.append(protoStrip(), header(route));
  bottom.append(footer());
}

/** Re-render chrome when saved count, agent state or register change. */
export function watchChrome() {
  subscribe(() => {
    const focused = document.activeElement;
    const keep = focused && focused.closest && focused.closest('.site-header, .site-footer') ? focused.getAttribute('name') + ':' + focused.getAttribute('value') : null;
    mountChrome(chromeRoute);
    if (keep && keep !== 'null:null') {
      const [name, value] = keep.split(':');
      const el = document.querySelector(`input[name="${name}"][value="${value}"]`);
      if (el) el.focus();
    }
  });
}
