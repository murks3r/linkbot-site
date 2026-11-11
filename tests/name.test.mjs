/* The public name comes from one constant, PUBLIC_NAME in src/i18n/terms.ts (owner, 2026-11-10: the company and the
   platform are Sensalio). Every page's own copy reads it: the catalogues, the front's copy, the FAQ, the terms, the
   drafts, the components and pages, the site's own Markdown and llms.txt ({name}), the changelog ({name}). This test
   fails where one of those sources writes the old name out, and where a built page or llms-full.txt shows it.
   Not the public's text: comments, code identifiers (window.Linkbot, the headers' names, package names), code samples,
   the legal entity's name (LEGAL_NAME, until the register entry), and the developer docs under /developers/docs, which
   are Connect's export and keep its wording until that export renames. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANGS, catalogues } from '../src/i18n/index.ts';
import { LEGAL_NAME, PUBLIC_NAME, TERMS } from '../src/i18n/terms.ts';
import { FAQ } from '../src/faq/index.ts';
import { FRONT } from '../src/front/copy.ts';
import { loadChangelog } from '../src/lib/changelog.ts';

const OLD = 'Linkbot';
const NAME = /\bLinkbot\b/;
const root = fileURLToPath(new URL('..', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
/* Identifiers that keep the old name: the embed's global and the legal entity. */
const allowed = text => text.replaceAll(LEGAL_NAME, ' ').replace(/window\.Linkbot\b/g, ' ');
const code = path => allowed(read(path)
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\/(?:\\.|[^/\n])+\/[gimsuy]*/g, ''));
const files = (dir, ext) => readdirSync(join(root, dir), { recursive: true }).filter(f => ext.test(f)).map(f => join(dir, f));

test('the old name is written out in no source of the pages’ copy', () => {
  assert.notEqual(PUBLIC_NAME, OLD);
  const sources = [
    ...files('src/i18n', /\.ts$/), ...files('src/front', /\.ts$/), ...files('src/faq', /\.ts$/), ...files('src/drafts', /\.ts$/),
    ...files('src/legal', /\.ts$/), ...files('src/demo', /\.ts$/), ...files('src/components', /\.astro$/), ...files('src/pages', /\.(astro|ts)$/),
    ...files('src/lib', /\.ts$/).filter(f => !f.endsWith('connect-docs.ts')), // connect-docs.ts: Connect's code sample, as code
    ...files('src/content/developers', /\.md$/), 'src/llms/llms.txt',
  ];
  assert.ok(sources.length > 50, `only ${sources.length} sources`);
  const hits = sources.filter(path => NAME.test(code(path)));
  assert.deepEqual(hits, [], `these sources write ${OLD} out; use PUBLIC_NAME (src/i18n/terms.ts), or {name} in Markdown and llms.txt`);
  const changelog = read('docs/changelog.yml').split('\n').filter(line => /^ {6}(en|de|es|it|fr): /.test(line) && NAME.test(line));
  assert.deepEqual(changelog, [], 'docs/changelog.yml writes the name out; write {name}');
});

test('the home, the FAQ, the terms, the site name and the changelog say PUBLIC_NAME', () => {
  for (const lang of LANGS) {
    assert.equal(catalogues[lang].site.name, PUBLIC_NAME, lang);
    assert.equal(TERMS[lang].linkbot.term, PUBLIC_NAME, lang);
    assert.ok(FAQ[lang].h1.includes(PUBLIC_NAME), `${lang}: FAQ heading`);
    assert.ok(FRONT[lang].landing.meta.title.startsWith(PUBLIC_NAME), `${lang}: home title`);
    assert.ok(loadChangelog().some(entry => entry.text[lang].includes(PUBLIC_NAME)), `${lang}: changelog`);
  }
  assert.match(read('src/llms/llms.txt'), /^# \{name\}\n/);
});

/* The built pages and llms-full.txt, as the public reads them: visible text, attributes and JSON-LD; not scripts, styles,
   code or HTML comments. Skipped until the site is built. */
const dist = join(root, 'dist');
const built = existsSync(join(dist, 'index.html'));
const DOCS = /^\/?developers\/docs([./]|$)/;
const shown = html => allowed(html.replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<(style|code|pre)\b[\s\S]*?<\/\1>/g, ' ').replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g, ' '));

test('no built page outside the developer docs shows the old name', { skip: !built && 'build the site first' }, () => {
  const pages = readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html') && !f.startsWith('__preview') && !DOCS.test(f));
  assert.ok(pages.length > 100, `only ${pages.length} pages`);
  const hits = pages.filter(f => NAME.test(shown(readFileSync(join(dist, f), 'utf8'))));
  assert.deepEqual(hits, [], `pages that show ${OLD}`);
});

test('llms-full.txt shows the old name only in the developer docs and in code', { skip: !built && 'build the site first' }, () => {
  const parts = readFileSync(join(dist, 'llms-full.txt'), 'utf8').split('\n---\n');
  const own = parts.filter(part => !DOCS.test(part.match(/^Page: (\S+)$/m)?.[1] ?? '/'));
  assert.ok(own.length > 20, `only ${own.length} parts`);
  const hits = own.map(part => allowed(part.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`\n]*`/g, ' ')))
    .flatMap(part => part.split('\n').filter(line => NAME.test(line)));
  assert.deepEqual(hits, [], `llms-full.txt lines that show ${OLD}`);
});
