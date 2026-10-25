/* A production build (npm run build, no PUBLIC_NOINDEX, no PUBLIC_PREVIEW_VARIANTS) carries every
   page in every language, each one saying which language it is in, pointing at its alternates,
   indexable, and without the preview's variant switcher. Skipped until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { LANGS, DEFAULT_LANG, pathFor, catalogues } from '../src/i18n/index.ts';

const PAGES = ['/', '/how-it-works', '/who-sees-what', '/for-platforms', '/developers', '/status', '/platforms', '/platforms/embed', '/platforms/sdk', '/platforms/console', '/platforms/wordpress', '/platforms/nextjs', '/platforms/astro', '/verticals', '/privacy', '/imprint'];
const dist = new URL('../dist/', import.meta.url);
const file = (lang, page) => { const p = pathFor(lang, page); return new URL(`.${p === '/' ? '/index' : p}.html`, dist); };
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';

test('every page exists in every language and says which language it is in', { skip }, () => {
  for (const lang of LANGS) for (const page of PAGES) {
    const html = readFileSync(file(lang, page), 'utf8');
    const content = catalogues[lang] ? lang : DEFAULT_LANG;
    assert.match(html, new RegExp(`<html lang="${content}"`), `${lang} ${page}: lang`);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${lang} ${page}: one h1`);
    assert.equal(html.includes('class="fallback"'), content !== lang, `${lang} ${page}: the fallback notice exactly when English stands in`);
    /* Where English stands in, none of the reader's own catalogue is on the page: not the skip link, the masthead or a
       section the page takes from the catalogue. */
    const own = content !== lang ? catalogues[lang] : undefined;
    if (own) for (const words of [own.site.skip, own.site.nav.how, own.home.rules.title]) assert.ok(!html.includes(words), `${lang} ${page}: English stands in, yet the page carries “${words}”`);
    for (const other of LANGS) assert.ok(html.includes(`hreflang="${other}"`), `${lang} ${page}: alternate ${other}`);
    assert.ok(html.includes('hreflang="x-default"'), `${lang} ${page}: x-default alternate`);
    assert.doesNotMatch(html, /name="robots" content="noindex/, `${lang} ${page}: indexable`);
  }
});

test('the 404 page and robots.txt are built', { skip }, () => {
  assert.ok(existsSync(new URL('404.html', dist)));
  assert.match(readFileSync(new URL('robots.txt', dist), 'utf8'), /Sitemap: https:\/\//);
});

test('a production build carries no variant switcher and no preview page', { skip }, () => {
  const html = readFileSync(new URL('index.html', dist), 'utf8');
  for (const marker of ['data-variants-panel', 'data-variants-form', "setAttribute('data-v-'", 'Variants.astro']) assert.ok(!html.includes(marker), `${marker} in a production build`);
  assert.ok(!/<html[^>]*data-v-/.test(html), 'an axis attribute on <html> in a production build');
  assert.ok(!existsSync(new URL('__preview/brand.html', dist)), 'the brand board in a production build');
});

test('while the Connect repository is private, /developers shows its paths and links to none of them', { skip }, () => {
  for (const lang of LANGS) {
    const html = readFileSync(file(lang, '/developers'), 'utf8');
    assert.ok(html.includes('docs/guides/embed-in-five-minutes.md'), `${lang}: the quickstart's path`);
    assert.doesNotMatch(html, /href="https:\/\/github\.com\/murks3r\/linkbot-connect/, `${lang}: a link into the private repository`);
  }
});

/* The milestone browser run and search engines read 50 to 160 characters of description; every built page stays inside. */
test('every page describes itself in 50 to 160 characters', { skip }, () => {
  const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(new URL(`${e.name}/`, dir)) : e.name.endsWith('.html') ? [new URL(e.name, dir)] : []);
  const entities = { '&#39;': "'", '&quot;': '"', '&amp;': '&', '&lt;': '<', '&gt;': '>' };
  for (const page of walk(dist)) {
    const raw = readFileSync(page, 'utf8').match(/<meta name="description" content="([^"]*)"/)?.[1];
    if (raw === undefined) continue;
    const text = raw.replace(/&#39;|&quot;|&amp;|&lt;|&gt;/g, e => entities[e]);
    assert.ok(text.length >= 50 && text.length <= 160, `${page.pathname.split('/dist/')[1]}: description is ${text.length} characters`);
  }
});
