/* The home, version 3: the "both say yes" demo's states (src/front/trial.ts, pure logic) and the sub-line's truth: the
   built home says today's sub-line (src/front/hero.ts) and never the full one, which claims company checks that do not
   run yet, in any language; and it keeps the owner's page rules (one button, to the docs' quickstart, beside it a
   quiet link to the docs; the demo names its made-up data; no "Live" label, no internal word; for readers who are not
   developers, a link to the marketing site in their language). The demo makes no network call: its script names no address. The build checks are skipped
   until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { START, STORY, reduce, end, holds, canAdvance } from '../src/front/trial.ts';
import { SUBLINE } from '../src/front/hero.ts';
import { FRONT } from '../src/front/copy.ts';
import { LANGS } from '../src/i18n/index.ts';
import { marketingHome } from '../src/lib/marketing.ts';

const dist = new URL('../dist/', import.meta.url);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';
const run = (...actions) => actions.reduce(reduce, START);
const confirmBoth = [{ type: 'confirm', side: 'buyer' }, { type: 'confirm', side: 'supplier' }, { type: 'next' }, { type: 'next' }];

test('the match waits until both sides are confirmed', () => {
  assert.equal(canAdvance(START), false);
  assert.equal(run({ type: 'confirm', side: 'buyer' }, { type: 'next' }).step, 1);
  assert.equal(run(...confirmBoth.slice(0, 3)).step, 2);
  assert.equal(run(...confirmBoth).step, 3);
});

test('both yes is an introduction; one no reveals nothing, in either order', () => {
  const yes = side => ({ type: 'answer', side, yes: true }), no = side => ({ type: 'answer', side, yes: false });
  assert.equal(end(run(...confirmBoth, yes('buyer'))), 'open');
  assert.equal(end(run(...confirmBoth, yes('supplier'), yes('buyer'))), 'introduced');
  assert.equal(end(run(...confirmBoth, yes('buyer'), no('supplier'))), 'declined');
  assert.equal(end(run(...confirmBoth, no('buyer'), yes('supplier'))), 'declined', 'no answer counts after a no');
  assert.equal(end(run({ type: 'confirm', side: 'buyer' }, yes('buyer'))), 'open', 'no answer before step 3');
  assert.deepEqual(run(...confirmBoth, yes('buyer'), { type: 'reset' }), START);
});

test('the names show only after both yes; without scripts the whole path shows', () => {
  assert.equal(holds('end:introduced', run(...confirmBoth, { type: 'answer', side: 'buyer', yes: true })), false);
  assert.equal(holds('end:introduced', STORY), true);
  assert.equal(holds('step:2 end:introduced', STORY), true);
  assert.equal(holds('step:1|2', START), true);
});

test('the built home says today’s sub-line, never the full one', { skip }, () => {
  assert.equal(SUBLINE, 'today', 'the full sub-line needs company checks on the space and their row in docs/truth-check.md');
  for (const lang of LANGS) {
    const { opening } = FRONT[lang].landing;
    const home = readFileSync(new URL(lang === 'en' ? 'index.html' : `${lang}.html`, dist), 'utf8');
    assert.ok(home.includes(opening.sub.today), `${lang}: today’s sub-line is missing`);
    assert.ok(!home.includes(opening.sub.full), `${lang}: the full sub-line is on the page`);
    assert.equal((home.match(/<h1[\s>]/g) ?? []).length, 1, `${lang}: not exactly one headline`);
  }
});

test('the built home keeps the owner’s page rules in every language', { skip }, () => {
  for (const lang of LANGS) {
    const { opening, trial, labels } = FRONT[lang].landing;
    const home = readFileSync(new URL(lang === 'en' ? 'index.html' : `${lang}.html`, dist), 'utf8');
    const main = home.slice(home.indexOf('<main'), home.indexOf('</main>'));
    const buttons = main.match(/<a [^>]*class="btn[ "][^>]*>/g) ?? [];
    assert.equal(buttons.length, 1, `${lang}: not exactly one button`);
    assert.match(buttons[0], /href="\/developers\/docs\/guides\/embed-in-five-minutes"/, `${lang}: the one button does not lead to the quickstart`);
    assert.ok(main.includes(`>${opening.start}<`) && main.includes(`href="/developers/docs"`) && main.includes(`>${opening.docs}</a>`), `${lang}: the button or the docs link is missing`);
    assert.ok(main.includes(`href="${marketingHome(lang)}"`), `${lang}: no link to the marketing site`);
    assert.ok(main.includes(trial.label), `${lang}: the demo does not say it uses made-up example data`);
    assert.ok(!main.includes(`>${labels.live}</span>`), `${lang}: a “Live” label on the home`);
    assert.doesNotMatch(main.replace(/<[^>]+>/g, ' '), /\b(pack|packs|watch|staging|Geoprocure)\b|Beobacht/i, `${lang}: an internal word on the home`);
  }
});

test('the home’s script makes no network call', { skip }, () => {
  const scripts = readdirSync(new URL('_astro/', dist)).filter(f => f.endsWith('.js'));
  for (const file of scripts) {
    const js = readFileSync(new URL(`_astro/${file}`, dist), 'utf8');
    if (!js.includes('data-trial') && !js.includes('data-say')) continue;
    assert.doesNotMatch(js, /\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket|https?:\/\//, `${file}: a network call`);
  }
});
