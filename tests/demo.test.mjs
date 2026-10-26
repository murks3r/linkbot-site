/* The /demo page embeds the widget only with an https embed.js and a publishable key, never in production, and
   refuses a secret key (src/demo/space.ts). A build without a space says nothing about a test space: no test note,
   no board heading, no notice, only that the widget waits for a demo space. The build check is skipped until the site
   is built (without the demo's preview variables). Synthetic values only. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { demoSpace } from '../src/demo/space.ts';
import { FRONT } from '../src/front/copy.ts';
import { LANGS, pathFor } from '../src/i18n/index.ts';

const dist = new URL('../dist/', import.meta.url);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';

const script = 'https://space.example.invalid/embed/v0/embed.js', key = 'pk_test_synthetic';

test('no widget without both values', () => {
  assert.equal(demoSpace({}), null);
  assert.equal(demoSpace({ PUBLIC_DEMO_EMBED_URL: script }), null);
  assert.equal(demoSpace({ PUBLIC_DEMO_KEY: key }), null);
  assert.equal(demoSpace({ PUBLIC_DEMO_EMBED_URL: ' ', PUBLIC_DEMO_KEY: key }), null);
});

test('a preview with both values embeds the widget', () => {
  assert.deepEqual(demoSpace({ PUBLIC_DEMO_EMBED_URL: script, PUBLIC_DEMO_KEY: key, VERCEL_ENV: 'preview' }), { script, key });
});

test('a production build never embeds it', () => {
  assert.equal(demoSpace({ PUBLIC_DEMO_EMBED_URL: script, PUBLIC_DEMO_KEY: key, VERCEL_ENV: 'production' }), null);
});

test('a secret key, a non-key, http and a script that is not embed.js are refused', () => {
  assert.throws(() => demoSpace({ PUBLIC_DEMO_EMBED_URL: script, PUBLIC_DEMO_KEY: 'sk_test_synthetic' }), /secret key/);
  assert.throws(() => demoSpace({ PUBLIC_DEMO_EMBED_URL: script, PUBLIC_DEMO_KEY: 'synthetic' }), /publishable/);
  assert.throws(() => demoSpace({ PUBLIC_DEMO_EMBED_URL: 'http://space.example.invalid/embed/v0/embed.js', PUBLIC_DEMO_KEY: key }), /https/);
  assert.throws(() => demoSpace({ PUBLIC_DEMO_EMBED_URL: 'https://space.example.invalid/app.js', PUBLIC_DEMO_KEY: key }), /embed\.js/);
  assert.throws(() => demoSpace({ PUBLIC_DEMO_EMBED_URL: 'not a url', PUBLIC_DEMO_KEY: key }), /not a URL/);
});

test('without a space, /demo names no test space in any language', { skip }, () => {
  for (const lang of LANGS) {
    const { demo: D } = FRONT[lang];
    const html = readFileSync(new URL(`.${pathFor(lang, '/demo')}.html`, dist), 'utf8');
    assert.ok(html.includes(D.space.off), `${lang}: the page does not say the widget waits for a demo space`);
    for (const [name, words] of Object.entries({ test: D.test, h2: D.space.h2, on: D.space.on, notice: D.space.notice }))
      assert.ok(!html.includes(words), `${lang}: demo.${name === 'test' ? name : `space.${name}`} shows without a space`);
  }
});
