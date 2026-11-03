/* The structured data of the built site (src/components/SEO.astro), read back and checked like a validator would: every
   indexable page in every language carries one JSON-LD block that parses, with Organization, WebSite,
   SoftwareApplication and a BreadcrumbList whose items are absolute and numbered from 1; /faq adds a FAQPage whose
   questions and answers are the page's own text, and a DefinedTermSet of the terms. No node states a price, a rating
   or an address. robots.txt names the AI crawlers, and llms.txt and llms-full.txt are built. Skipped until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANGS, pathFor } from '../src/i18n/index.ts';
import { FAQ } from '../src/faq/index.ts';
import { TERM_KEYS } from '../src/i18n/terms.ts';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const skip = !existsSync(join(dist, 'index.html')) && 'build the site first';
const pages = () => readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html') && !f.startsWith('__preview')).map(f => [f, readFileSync(join(dist, f), 'utf8')]);
const blocks = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const decode = s => s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const file = (lang, page) => { const p = pathFor(lang, page); return join(dist, `${p === '/' ? '/index' : p}.html`); };

test('every page carries Organization, WebSite, SoftwareApplication and a BreadcrumbList', { skip }, () => {
  const all = pages();
  assert.ok(all.length > 100, `only ${all.length} pages`);
  for (const [name, html] of all) {
    const found = blocks(html);
    assert.equal(found.length, 1, `${name}: one JSON-LD block`);
    const nodes = found[0];
    assert.ok(Array.isArray(nodes), `${name}: a list of nodes`);
    for (const node of nodes) {
      assert.equal(node['@context'], 'https://schema.org', `${name}: @context`);
      assert.ok(typeof node['@type'] === 'string', `${name}: @type`);
      for (const key of ['offers', 'aggregateRating', 'address', 'foundingDate', 'legalName', 'logo']) assert.ok(!(key in node), `${name}: ${node['@type']} states ${key}`);
    }
    const byType = Object.fromEntries(nodes.map(node => [node['@type'], node]));
    for (const type of ['Organization', 'WebSite', 'SoftwareApplication', 'BreadcrumbList']) assert.ok(byType[type], `${name}: ${type}`);
    assert.ok(byType.Organization.name && byType.Organization.url && byType.Organization.description, `${name}: Organization`);
    assert.equal(byType.WebSite.publisher['@id'], byType.Organization['@id'], `${name}: WebSite publisher`);
    assert.ok(byType.SoftwareApplication.applicationCategory && byType.SoftwareApplication.operatingSystem, `${name}: SoftwareApplication`);
    byType.BreadcrumbList.itemListElement.forEach((item, index) => {
      assert.equal(item['@type'], 'ListItem');
      assert.equal(item.position, index + 1, `${name}: crumb position`);
      assert.ok(item.name && /^https:\/\//.test(item.item), `${name}: crumb ${index + 1}`);
    });
  }
});

test('/faq carries a FAQPage with the page’s own questions and answers, and the terms as a DefinedTermSet', { skip }, () => {
  for (const lang of LANGS) {
    const html = readFileSync(file(lang, '/faq'), 'utf8');
    const nodes = blocks(html)[0];
    const faq = nodes.find(node => node['@type'] === 'FAQPage');
    assert.ok(faq, `${lang}: FAQPage`);
    assert.equal(faq.mainEntity.length, FAQ[lang].items.length);
    const text = decode(html.replace(/<script[\s\S]*?<\/script>/g, ''));
    for (const q of faq.mainEntity) {
      assert.equal(q['@type'], 'Question');
      assert.equal(q.acceptedAnswer['@type'], 'Answer');
      assert.ok(text.includes(q.name), `${lang}: the question “${q.name}” is on the page`);
      for (const sentence of q.acceptedAnswer.text.split(/(?<=\.) /)) assert.ok(text.includes(sentence), `${lang}: the answer “${sentence}” is on the page`);
    }
    const terms = nodes.find(node => node['@type'] === 'DefinedTermSet');
    assert.equal(terms?.hasDefinedTerm.length, TERM_KEYS.length, `${lang}: DefinedTermSet`);
  }
});

test('robots.txt lets the AI crawlers in; llms.txt and llms-full.txt are built', { skip }, () => {
  const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
  for (const agent of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot']) assert.match(robots, new RegExp(`User-agent: ${agent}\\nAllow: /\\n`), agent);
  assert.doesNotMatch(robots, /Disallow/);
  assert.match(readFileSync(join(dist, 'llms.txt'), 'utf8'), /^# Linkbot\n\n> Linkbot lets two businesses/);
  const full = readFileSync(join(dist, 'llms-full.txt'), 'utf8');
  for (const needle of ['Page: /faq', 'Page: /how-it-works', 'Page: /privacy', FAQ.en.items[0].q]) assert.ok(full.includes(needle), `llms-full.txt: ${needle}`);
  assert.doesNotMatch(full.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, ''), /<[a-z][^>]*>/i, 'llms-full.txt carries markup outside its code');
});
