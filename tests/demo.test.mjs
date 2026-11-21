/* The /demo page embeds the widget only when the switch is on (PUBLIC_DEMO_LIVE=true, off by default) and it has an
   https embed.js and a publishable key, never in production, and refuses a secret key even while the switch is off
   (src/demo/space.ts). A build without a space says nothing about a test space and offers no "Try it": no test note,
   no notice, no widget, only that the widget waits for a demo space; the home's button stays "See it step by step". The build check is skipped until the site
   is built (without the demo's preview variables). Synthetic values only. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { demoSpace } from '../src/demo/space.ts';
import { FRONT } from '../src/front/copy.ts';
import { LANGS, pathFor } from '../src/i18n/index.ts';

const dist = new URL('../dist/', import.meta.url);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';

const script = 'https://space.example.invalid/embed/v0/embed.js', key = 'pk_test_synthetic', on = 'true';

test('no widget while the switch is off', () => {
  assert.equal(demoSpace({ PUBLIC_DEMO_EMBED_URL: script, PUBLIC_DEMO_KEY: key, VERCEL_ENV: 'preview' }), null);
  for (const value of ['', 'false', '1', 'yes'])
    assert.equal(demoSpace({ PUBLIC_DEMO_EMBED_URL: script, PUBLIC_DEMO_KEY: key, PUBLIC_DEMO_LIVE: value }), null, `switch “${value}”`);
});

test('no widget without both values', () => {
  assert.equal(demoSpace({ PUBLIC_DEMO_LIVE: on }), null);
  assert.equal(demoSpace({ PUBLIC_DEMO_EMBED_URL: script, PUBLIC_DEMO_LIVE: on }), null);
  assert.equal(demoSpace({}), null);
  assert.equal(demoSpace({ PUBLIC_DEMO_EMBED_URL: script }), null);
  assert.equal(demoSpace({ PUBLIC_DEMO_KEY: key }), null);
  assert.equal(demoSpace({ PUBLIC_DEMO_EMBED_URL: ' ', PUBLIC_DEMO_KEY: key }), null);
});

test('a preview with the switch on and both values embeds the widget', () => {
  assert.deepEqual(demoSpace({ PUBLIC_DEMO_EMBED_URL: script, PUBLIC_DEMO_KEY: key, PUBLIC_DEMO_LIVE: on, VERCEL_ENV: 'preview' }), { script, key });
});

test('a production build never embeds it', () => {
  assert.equal(demoSpace({ PUBLIC_DEMO_EMBED_URL: script, PUBLIC_DEMO_KEY: key, PUBLIC_DEMO_LIVE: on, VERCEL_ENV: 'production' }), null);
});

test('a secret key, a non-key, http and a script that is not embed.js are refused', () => {
  assert.throws(() => demoSpace({ PUBLIC_DEMO_EMBED_URL: script, PUBLIC_DEMO_KEY: 'sk_test_synthetic' }), /secret key/);
  assert.throws(() => demoSpace({ PUBLIC_DEMO_EMBED_URL: script, PUBLIC_DEMO_KEY: 'synthetic' }), /publishable/);
  assert.throws(() => demoSpace({ PUBLIC_DEMO_EMBED_URL: 'http://space.example.invalid/embed/v0/embed.js', PUBLIC_DEMO_KEY: key }), /https/);
  assert.throws(() => demoSpace({ PUBLIC_DEMO_EMBED_URL: 'https://space.example.invalid/app.js', PUBLIC_DEMO_KEY: key }), /embed\.js/);
  assert.throws(() => demoSpace({ PUBLIC_DEMO_EMBED_URL: 'not a url', PUBLIC_DEMO_KEY: key }), /not a URL/);
});

test('without a space, /demo names no test space and offers no “Try it” in any language', { skip }, () => {
  for (const lang of LANGS) {
    const { demo: D, landing: L } = FRONT[lang];
    const html = readFileSync(new URL(`.${pathFor(lang, '/demo')}.html`, dist), 'utf8');
    assert.ok(html.includes(D.space.off), `${lang}: the page does not say the widget waits for a demo space`);
    assert.ok(html.includes('data-show="supplier"'), `${lang}: the role switch is missing`);
    for (const [name, words] of Object.entries({ test: D.test, 'live.p': D.live.p, 'space.notice': D.space.notice, try: `>${L.opening.try}<`, widget: 'data-linkbot' }))
      assert.ok(!html.includes(words), `${lang}: ${name} shows without a space`);
    const home = readFileSync(new URL(lang === 'en' ? 'index.html' : `${lang}.html`, dist), 'utf8');
    assert.ok(home.includes(L.opening.button) && !home.includes(`>${L.opening.try}<`), `${lang}: the home's button is not “${L.opening.button}”`);
  }
});
