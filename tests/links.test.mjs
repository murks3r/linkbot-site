/* The link check: every link and every source on every built page that stays on this site leads to a built file, and
   every anchor to an element with that id on the page it names. Code is not read (an attribute in a code sample is
   not a link), nor the 404 page's links to itself in other languages: any address that is not built shows it. Skipped
   until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';

/* An address on this site → the built file: "/" is index.html, "/how-it-works" how-it-works.html (format: file). */
const fileOf = path => {
  const clean = decodeURI(path.replace(/\/$/, '') || '/index');
  return [clean, `${clean}.html`, `${clean}/index.html`].map(p => new URL(`.${p}`, dist)).find(url => existsSync(url) && !readdirSafe(url));
};
const readdirSafe = url => { try { readdirSync(url); return true; } catch { return false; } };
const ids = new Map();
const idsOf = url => {
  if (!ids.has(url.href)) ids.set(url.href, new Set([...readFileSync(url, 'utf8').matchAll(/\sid="([^"]+)"/g)].map(m => m[1])));
  return ids.get(url.href);
};

test('every link and source on the site leads somewhere, every anchor to its element', { skip }, () => {
  const pages = readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html'));
  assert.ok(pages.length > 0);
  const broken = [];
  for (const page of pages) {
    const self = new URL(page, dist);
    const html = readFileSync(self, 'utf8').replace(/<(script|pre|code)\b[\s\S]*?<\/\1>/g, '');
    for (const [, attr, value] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
      if (/^(https?:|mailto:|data:|tel:|javascript:)/i.test(value) || value.startsWith('//')) continue;
      const [path, hash] = value.split('#');
      if (/(^|\/)404$/.test(path)) continue;
      const target = path ? fileOf(path.split('?')[0]) : self;
      if (!target) { broken.push(`${page}: ${attr} ${value}`); continue; }
      if (hash && target.pathname.endsWith('.html') && !idsOf(target).has(decodeURIComponent(hash))) broken.push(`${page}: ${value} (no #${hash})`);
    }
  }
  assert.deepEqual([...new Set(broken)], [], 'links that lead nowhere');
});
