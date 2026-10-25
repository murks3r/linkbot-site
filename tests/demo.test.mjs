/* The /demo page embeds the widget only with an https embed.js and a publishable key, never in production, and
   refuses a secret key (src/demo/space.ts). Synthetic values only. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { demoSpace } from '../src/demo/space.ts';

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
