// @ts-nocheck
/**
 * Entry point: hash router.
 *
 *   #/                landing
 *   #/jobs?…          results (the URL is the source of truth for the search)
 *   #/jobs/<id>       job detail
 *   #/saved           saved jobs + private Job Agent
 *   #/saved/agent     the same screen, scrolled to the agent
 *
 * Hash routing needs no server rewrites, so the build deploys as plain static
 * files. Views own their DOM; a view may update the hash with replaceState (see
 * `adopt`) without triggering a re-render, which is how filters stay responsive.
 */
import { h } from './dom.js';
import { getState, subscribe } from './store.js';
import { mountChrome, watchChrome } from './shell.js';

const main = document.getElementById('main');

const ROUTES = [
  { name: 'landing', test: (p) => (p === '/' || p === '' ? {} : null), load: () => import('./views/landing.js') },
  { name: 'results', test: (p) => (/^\/jobs\/?$/.test(p) ? {} : null), load: () => import('./views/results.js') },
  { name: 'detail', test: (p) => { const m = p.match(/^\/jobs\/([a-z0-9-]+)\/?$/); return m ? { id: m[1] } : null; }, load: () => import('./views/detail.js') },
  { name: 'saved', test: (p) => { const m = p.match(/^\/saved(\/agent)?\/?$/); return m ? { agent: Boolean(m[1]) } : null; }, load: () => import('./views/saved.js') },
];

let current = null; // { destroy }
let handledHash = null;
let firstRender = true;
let lastAudience = null;

function parse() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, search = ''] = raw.split('?');
  for (const route of ROUTES) {
    const params = route.test(path);
    if (params) return { route, name: route.name, params, search, ...params };
  }
  return { route: ROUTES[0], name: 'landing', params: {}, search: '', notFound: path };
}

/** A view changed the URL itself; do not re-render for it. */
export function adopt(hash) {
  handledHash = hash;
  history.replaceState(null, '', hash);
}

export function currentSearch() {
  return location.hash.includes('?') ? location.hash.split('?')[1] : '';
}

async function render() {
  const route = parse();
  handledHash = location.hash;
  if (current && current.destroy) current.destroy();
  current = null;
  mountChrome(route);
  document.documentElement.dataset.audience = getState().audience;
  lastAudience = getState().audience;

  let view;
  try {
    view = (await route.route.load()).render({ ...route, state: getState() });
  } catch (error) {
    console.error(error);
    view = { title: 'Not available', node: h('div', { class: 'wrap section' }, h('h1', { class: 't-d2' }, 'Not available yet.'), h('p', {}, error.message)) };
  }
  document.title = `${view.title} · Linkbot prototype`;
  main.replaceChildren(view.node);
  current = view;
  main.dataset.route = route.name;

  if (!view.keepScroll) window.scrollTo(0, 0);
  if (!firstRender) {
    const heading = main.querySelector('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }
  if (view.after) view.after();
  firstRender = false;
}

window.addEventListener('hashchange', () => {
  if (location.hash === handledHash) return;
  render();
});

watchChrome();
subscribe((state) => {
  if (state.audience !== lastAudience) {
    document.documentElement.dataset.audience = state.audience;
    lastAudience = state.audience;
    render();
  }
});

render();
