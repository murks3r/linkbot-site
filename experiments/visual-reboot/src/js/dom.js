// @ts-nocheck
/**
 * DOM helpers: a tiny element builder, the icon set and the seal glyphs.
 * No framework, no innerHTML for user-supplied text (everything goes through
 * text nodes), and no inline style attributes (the CSP forbids them).
 */

/** h('button', { class: 'btn', onClick }, 'Label', icon('check')) */
export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value === false || value === null || value === undefined) continue;
    if (key === 'class') el.className = value;
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === 'for') el.htmlFor = value;
    else if (['value', 'checked', 'disabled', 'selected', 'hidden', 'open'].includes(key)) el[key] = value;
    else el.setAttribute(key, value === true ? '' : String(value));
  }
  append(el, children);
  return el;
}

export function append(parent, children) {
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return parent;
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

function fromMarkup(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content.firstElementChild;
}

/* ---------- icons: 20px grid, square caps, miter joins — angular like the seal ---------- */

const ICONS = {
  search: '<path d="M8.5 3.25a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5ZM12.4 12.4 17 17"/>',
  bookmark: '<path d="M5.5 3h9v14L10 13.25 5.5 17Z"/>',
  'bookmark-fill': '<path d="M5.5 3h9v14L10 13.25 5.5 17Z" fill="currentColor"/>',
  'arrow-right': '<path d="M3 10h14M11 4l6 6-6 6"/>',
  'arrow-left': '<path d="M17 10H3M9 4l-6 6 6 6"/>',
  'arrow-up-right': '<path d="M6 14 14 6M7 6h7v7"/>',
  close: '<path d="M5 5l10 10M15 5 5 15"/>',
  plus: '<path d="M10 4v12M4 10h12"/>',
  check: '<path d="M4 10.5 8 14.5 16 5.5"/>',
  filter: '<path d="M3 5h14M6 10h8M8.5 15h3"/>',
  external: '<path d="M8 4H4v12h12v-4M11 3h6v6M17 3l-8 8"/>',
  download: '<path d="M10 3v10M5.5 9 10 13.5 14.5 9M4 17h12"/>',
  trash: '<path d="M4 6h12M8 6V3.5h4V6M5.5 6l.75 11h7.5L14.5 6"/>',
  play: '<path d="M6 4l10 6-10 6Z"/>',
  clock: '<path d="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM10 6v4.2l3 1.8"/>',
  'chevron-down': '<path d="M5 8l5 5 5-5"/>',
  'chevron-right': '<path d="M8 5l5 5-5 5"/>',
  lock: '<path d="M5 9h10v8H5ZM7 9V6.5a3 3 0 0 1 6 0V9"/>',
  agent: '<path d="M4 7h12v9H4ZM10 3v4M7.5 11.5h.01M12.5 11.5h.01"/>',
  device: '<path d="M3 5h14v9H3ZM7 17h6M10 14v3"/>',
  info: '<path d="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM10 9v5M10 6.3v.01"/>',
  pin: '<path d="M10 17s5-4.4 5-8.2a5 5 0 0 0-10 0C5 12.6 10 17 10 17ZM10 8v.01"/>',
};

export function icon(name, { size = 20, class: cls = '' } = {}) {
  const body = ICONS[name];
  if (!body) throw new Error(`unknown icon: ${name}`);
  return fromMarkup(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false" class="${cls}">${body}</svg>`,
  );
}

/* ---------- the seal ---------- */

/* Octagon impression of Direction A (geometry shared with PR #12's mark). */
const OCT = 'M29.3 21.51 21.51 29.3H10.49L2.7 21.51V10.49L10.49 2.7h11.02L29.3 10.49Z';
const SQUARE = 'M9 9h14v14H9Z';

const SEAL_GLYPHS = {
  // sealed: solid impression, detail knocked out
  verified: `<path d="${OCT}" fill="currentColor"/><path d="${SQUARE}" fill="none" stroke-width="1.8" class="glyph-knock-stroke"/><circle cx="16" cy="16" r="3" class="glyph-knock-fill"/>`,
  // attributed: outline impression, solid core
  sourced: `<path d="${OCT}" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="${SQUARE}" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="16" r="3" fill="currentColor"/>`,
  // fading: broken impression, hollow core
  stale: `<path d="${OCT}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-dasharray="6 3.4"/><circle cx="16" cy="16" r="3.4" fill="none" stroke="currentColor" stroke-width="2"/>`,
  // no impression: dotted outline, empty
  unknown: `<path d="${OCT}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-dasharray="1.2 3.6" stroke-linecap="round"/>`,
};

export const SEAL_WORDS = { verified: 'Verified', sourced: 'Sourced', stale: 'Stale', unknown: 'Unknown' };

export function sealGlyph(state, size = 20) {
  return fromMarkup(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}" aria-hidden="true" focusable="false">${SEAL_GLYPHS[state]}</svg>`,
  );
}

/** glyph + word. Colour alone never carries the state. */
export function seal(state, { size = 18, large = false, word = true } = {}) {
  return h(
    'span',
    { class: `seal seal--${state}${large ? ' seal--lg' : ''}` },
    sealGlyph(state, large ? 26 : size),
    word ? h('span', { class: 'seal__word' }, SEAL_WORDS[state]) : h('span', { class: 'sr-only' }, SEAL_WORDS[state]),
  );
}

/* ---------- brand mark: provisional — Direction A geometry, production approval pending ---------- */

export function mark(size = 28) {
  return fromMarkup(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}" aria-hidden="true" focusable="false"><path d="${OCT}" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="${SQUARE}" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="16" r="3.2" class="mark-core"/></svg>`,
  );
}

/** Honest UNKNOWN: hatched void with words, never a dash. */
export function unknown(text = 'Not stated by source') {
  return h('span', { class: 'void' }, sealGlyph('unknown', 14), text);
}

/* ---------- JSON, rendered so that `null` reads as the honest void it is ---------- */

export function jsonView(value, depth = 0) {
  const pad = '  '.repeat(depth);
  if (value === null) return [h('span', { class: 'jnull' }, 'null')];
  if (Array.isArray(value)) {
    if (value.length === 0) return ['[]'];
    return ['[\n', ...value.flatMap((v, i) => [pad + '  ', ...jsonView(v, depth + 1), i < value.length - 1 ? ',' : '', '\n']), pad + ']'];
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    return ['{\n', ...entries.flatMap(([k, v], i) => [pad + '  ', h('span', { class: 'jk' }, JSON.stringify(k)), ': ', ...jsonView(v, depth + 1), i < entries.length - 1 ? ',' : '', '\n']), pad + '}'];
  }
  if (typeof value === 'string') return [h('span', { class: 'js' }, JSON.stringify(value))];
  return [h('span', { class: 'jn' }, String(value))];
}
