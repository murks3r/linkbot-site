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
