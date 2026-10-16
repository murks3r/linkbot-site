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
