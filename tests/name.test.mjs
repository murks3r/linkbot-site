/* The public name comes from one constant, PUBLIC_NAME in src/i18n/terms.ts (owner, 2026-11-03: the public name
   changes, the choice is open). The home, the FAQ, the terms, llms.txt and the site name in the catalogues (header,
   footer, schema.org) read it, so a change of name is that one line. This test fails where one of those sources
   writes the name out instead. Comments, code identifiers and the synonym patterns are not text the public reads. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LANGS, catalogues } from '../src/i18n/index.ts';
import { PUBLIC_NAME, TERMS } from '../src/i18n/terms.ts';
import { FAQ } from '../src/faq/index.ts';
import { FRONT } from '../src/front/copy.ts';

const NAME = /\bLinkbot\b/;
const code = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\/(?:\\.|[^/\n])+\/[gimsuy]*/g, '');
/* src/front/i18n/<lang>.ts holds more pages than the home; only its landing block is the home's. */
const landing = source => source.match(/^ {2}landing: \{[\s\S]*?(?=^ {2}[a-z]+: \{)/m)?.[0] ?? '';

test('the name is written out only in PUBLIC_NAME', () => {
  const sources = {
    'src/i18n/terms.ts': code('src/i18n/terms.ts').replace(/export const PUBLIC_NAME = '[^']*';/, ''),
    'src/front/landing-copy.ts': code('src/front/landing-copy.ts'),
    'src/llms/llms.txt': readFileSync(new URL('../src/llms/llms.txt', import.meta.url), 'utf8'),
    'src/components/SEO.astro': code('src/components/SEO.astro'),
  };
  for (const lang of LANGS) {
    sources[`src/faq/${lang}.ts`] = code(`src/faq/${lang}.ts`);
    sources[`src/i18n/${lang}.ts (site.name)`] = code(`src/i18n/${lang}.ts`).match(/^ {2}site: \{\n\s*name: [^\n]*/m)?.[0] ?? 'missing';
    if (lang !== 'en') sources[`src/front/i18n/${lang}.ts (landing)`] = landing(code(`src/front/i18n/${lang}.ts`));
  }
  for (const [file, text] of Object.entries(sources)) {
    assert.ok(text.length > 0, `${file}: nothing read`);
    assert.doesNotMatch(text, NAME, `${file} writes the name out; use PUBLIC_NAME (src/i18n/terms.ts)`);
  }
});

test('the home, the FAQ, the terms and the site name say PUBLIC_NAME', () => {
  for (const lang of LANGS) {
    assert.equal(catalogues[lang].site.name, PUBLIC_NAME, lang);
    assert.equal(TERMS[lang].linkbot.term, PUBLIC_NAME, lang);
    assert.ok(FAQ[lang].h1.includes(PUBLIC_NAME), `${lang}: FAQ heading`);
    assert.ok(FRONT[lang].landing.meta.title.startsWith(PUBLIC_NAME), `${lang}: home title`);
  }
  assert.match(readFileSync(new URL('../src/llms/llms.txt', import.meta.url), 'utf8'), /^# \{name\}\n/);
});
