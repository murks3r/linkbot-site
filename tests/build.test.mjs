/* A production build (npm run build, no PUBLIC_NOINDEX, no PUBLIC_PREVIEW_VARIANTS) carries every
   page in every language, each one saying which language it is in, pointing at its alternates,
   indexable, and without the preview's variant switcher. Skipped until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { LANGS, DEFAULT_LANG, pathFor, catalogues } from '../src/i18n/index.ts';

const PAGES = ['/', '/how-it-works', '/who-sees-what', '/platforms', '/platforms/embed', '/platforms/sdk', '/platforms/console', '/platforms/wordpress', '/platforms/nextjs', '/platforms/astro', '/verticals', '/privacy', '/imprint'];
const dist = new URL('../dist/', import.meta.url);
const file = (lang, page) => { const p = pathFor(lang, page); return new URL(`.${p === '/' ? '/index' : p}.html`, dist); };
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';

/* Pages whose words exist in English only (the redesign pass of 2026-10-24: direction C as its own page, until it is
   translated): every language gets the page in English throughout, says so in the reader's language, and carries
   lang="en". */
const ENGLISH_ONLY = ['/who-sees-what'];

test('every page exists in every language and says which language it is in', { skip }, () => {
  for (const lang of LANGS) for (const page of PAGES) {
    const html = readFileSync(file(lang, page), 'utf8');
    const content = catalogues[lang] && !ENGLISH_ONLY.includes(page) ? lang : DEFAULT_LANG;
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
