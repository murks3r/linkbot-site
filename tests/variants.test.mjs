/* The preview's variant switcher never reaches a production build: `npm run build` (no
   PUBLIC_PREVIEW_VARIANTS) must ship no panel, no axis script and no attribute on <html>. (The
   stylesheet's `html[data-v-…]` selectors may remain: nothing ever sets those attributes there.) */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const dist = new URL('../dist/index.html', import.meta.url);
test('a production build carries no variant switcher', { skip: !existsSync(dist) && 'build the site first' }, () => {
  const html = readFileSync(dist, 'utf8');
  for (const marker of ['data-variants-panel', 'data-variants-form', "setAttribute('data-v-'", 'Variants.astro']) assert.ok(!html.includes(marker), `${marker} in a production build`);
  assert.ok(!/<html[^>]*data-v-/.test(html), 'an axis attribute on <html> in a production build');
});

/* A9: the density stages are a preview axis. A production build ships only the default tile and no
   noise board; a preview build (PUBLIC_PREVIEW_VARIANTS=1, e.g. into dist-preview) carries the
   density axis with its four stages and the board at /__preview/noise. */
test('a production build ships the default noise tile alone', { skip: !existsSync(dist) && 'build the site first' }, () => {
  const root = new URL('../dist/', import.meta.url);
  assert.ok(existsSync(new URL('material/noise-d2-medium.webp', root)), 'the default tile is missing');
  for (const file of ['material/noise-d1-light.webp', 'material/noise-d3-dense.webp', 'material/paper.webp', '__preview/noise.html']) assert.ok(!existsSync(new URL(file, root)), `${file} in a production build`);
});
const preview = new URL('../dist-preview/index.html', import.meta.url);
test('a preview build carries the density axis and the noise board', { skip: !existsSync(preview) && 'no preview build (PUBLIC_PREVIEW_VARIANTS=1 astro build --outDir dist-preview)' }, () => {
  const root = new URL('../dist-preview/', import.meta.url), html = readFileSync(preview, 'utf8');
  assert.ok(html.includes('data-variants-form'), 'no switcher in a preview build');
  const axis = html.match(/<select[^>]*name="density"[^>]*>([\s\S]*?)<\/select>/)?.[1] ?? '';
  assert.deepEqual([...axis.matchAll(/value="(d\d)"/g)].map(m => m[1]), ['d2', 'd1', 'd3', 'd0'], 'the density axis offers d2 (default), d1, d3 and d0');
  for (const file of ['material/noise-d1-light.webp', 'material/noise-d2-medium.webp', 'material/noise-d3-dense.webp', 'material/paper.webp', '__preview/noise.html']) assert.ok(existsSync(new URL(file, root)), `${file} missing from a preview build`);
  const board = readFileSync(new URL('__preview/noise.html', root), 'utf8');
  for (const stage of ['d0', 'd1', 'd2', 'd3']) assert.ok(board.includes(`data-stage-key="${stage}"`), `the board lacks ${stage}`);
});

/* A9 W1 part 3 (review R9): the badge's alternative lines ("A fit tells no one", "Nobody sees you …")
   are preview options while counsel's reading is open (founder B, claims.md S2.3). No production page
   carries them, not even hidden; the default line remains. */
test('a production build renders only the badge’s default line', { skip: !existsSync(dist) && 'build the site first' }, () => {
  const root = new URL('../dist/', import.meta.url);
  let badges = 0;
  for (const page of ['index.html', 'privacy.html', 'hiring.html', 'how-it-works.html']) {
    const html = readFileSync(new URL(page, root), 'utf8').toUpperCase();
    for (const line of ['A FIT TELLS NO ONE', 'NOBODY SEES YOU UNLESS YOU SAY YES']) assert.ok(!html.includes(line), `${page} carries “${line}”`);
    if (html.includes('YOUR WORDS. YOUR DATA. YOUR CALL.')) badges++;
  }
  assert.ok(badges > 0, 'no page carries the badge’s default line');
});

/* A9 comparison (integration, founder G5): the direction homes (/__preview/home/<key>), the overview
   (/__preview/directions) with its contact sheets and frames, the directions' story files and the switcher's
   direction axis exist in preview builds only. A production build compiles none of them: no page, no file
   under directions/, no image of the overview, no stylesheet or script carrying a direction's code, and no
   page that names a direction. (Astro names shared CSS chunks after a page that uses them; with the
   comparison pages injected only into preview builds, production chunk names are W1's.) */
import { readdirSync } from 'node:fs';
const DIRECTION_KEYS = [...readFileSync(new URL('../src/lib/variants.ts', import.meta.url), 'utf8').match(/export const DIRECTIONS[\s\S]*?\];/)[0].matchAll(/key: '([a-z]+)'/g)].map(m => m[1]);
const OVERVIEW_IMAGES = ['contact', 'frame-s3-desktop', 'frame-s4-phone'];
const files = dir => existsSync(dir) ? readdirSync(dir, { recursive: true }).map(String) : [];
test('the comparison’s direction list and the pages injected into preview builds agree', () => {
  const config = readFileSync(new URL('../astro.config.mjs', import.meta.url), 'utf8');
  const injected = [...config.match(/const COMPARISON = \[([^\]]*)\]/)[1].matchAll(/'([a-z]+)'/g)].map(m => m[1]);
  assert.deepEqual(injected, DIRECTION_KEYS, 'astro.config.mjs COMPARISON and src/lib/variants.ts DIRECTIONS differ');
  assert.ok(DIRECTION_KEYS.length >= 2, 'fewer than two directions');
  for (const key of DIRECTION_KEYS) for (const file of [`src/preview/home-${key}.astro`, `src/components/directions/${key}/Story.astro`]) assert.ok(existsSync(new URL(`../${file}`, import.meta.url)), `${file} is missing`);
});
test('a production build has no direction pages, no direction axis and no storyboard images', { skip: !existsSync(dist) && 'build the site first' }, () => {
  const root = new URL('../dist/', import.meta.url), all = files(root);
  assert.ok(!existsSync(new URL('__preview/directions.html', root)) && !existsSync(new URL('__preview/home', root)), 'a comparison page in a production build');
  assert.deepEqual(all.filter(f => f.startsWith('directions')), [], 'the directions’ story files in a production build');
  assert.deepEqual(all.filter(f => OVERVIEW_IMAGES.some(name => f.split('/').pop().startsWith(name + '.'))), [], 'an overview image in a production build');
  for (const file of all.filter(f => /\.(html|css|js|xml|txt)$/.test(f))) {
    const text = readFileSync(new URL(file, root), 'utf8');
    for (const key of DIRECTION_KEYS) assert.ok(!text.includes(key), `${file} names the direction ${key}`);
    for (const marker of ['data-direction', '__preview/home', '__preview/directions', 'data-v-direction', '?direction=']) assert.ok(!text.includes(marker), `${file} carries ${marker}`);
  }
});
test('a preview build carries every direction’s home, the overview and the direction axis', { skip: !existsSync(preview) && 'no preview build (PUBLIC_PREVIEW_VARIANTS=1 astro build --outDir dist-preview)' }, () => {
  const root = new URL('../dist-preview/', import.meta.url), html = readFileSync(preview, 'utf8');
  const axis = html.match(/<select[^>]*name="direction"[^>]*>([\s\S]*?)<\/select>/)?.[1] ?? '';
  assert.deepEqual([...axis.matchAll(/value="([a-z]+)"/g)].map(m => m[1]), ['none', ...DIRECTION_KEYS], 'the direction axis offers none (default) and every direction');
  assert.ok(!html.includes('data-direction='), 'the default home carries a direction’s story');
  for (const key of DIRECTION_KEYS) {
    const page = readFileSync(new URL(`__preview/home/${key}.html`, root), 'utf8');
    assert.ok(page.includes(`data-direction="${key}"`), `/__preview/home/${key} lacks its story`);
    for (const other of DIRECTION_KEYS.filter(k => k !== key)) assert.ok(!page.includes(`data-direction="${other}"`), `/__preview/home/${key} carries ${other}`);
    assert.ok(files(new URL(`directions/${key}/`, root)).length > 0, `directions/${key}/ missing from a preview build`);
  }
  const overview = readFileSync(new URL('__preview/directions.html', root), 'utf8');
  for (const key of DIRECTION_KEYS) assert.ok(overview.includes(`href="/__preview/home/${key}"`) && overview.includes(`href="/talent?direction=${key}#/search"`), `the overview lacks the links of ${key}`);
  assert.equal([...overview.matchAll(/<img [^>]*src="\/_astro\/(contact|frame-s3-desktop|frame-s4-phone)\.[^"]+\.webp"/g)].length, 3 * DIRECTION_KEYS.length, 'the overview lacks a contact sheet or a frame');
  assert.ok(/deferred under the quota/.test(overview), 'the overview does not say W2 and W3 were deferred');
});
