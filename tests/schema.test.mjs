/* The structured data of the built site (src/components/SEO.astro), read back and checked like a validator would: every
   indexable page in every language carries one JSON-LD block that parses, with WebSite, SoftwareApplication and a
   BreadcrumbList whose items are absolute and numbered from 1. The organisation is the marketing site's node, named by
   its @id only (src/lib/marketing.ts): no page carries an Organization of its own. No node states a price, a rating
   or an address. robots.txt names the AI crawlers, and llms.txt and llms-full.txt are built. Skipped until the site is
   built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_NAME } from '../src/i18n/terms.ts';
import { ORGANIZATION_ID } from '../src/lib/marketing.ts';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const skip = !existsSync(join(dist, 'index.html')) && 'build the site first';
const pages = () => readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html') && !f.startsWith('__preview')).map(f => [f, readFileSync(join(dist, f), 'utf8')]);
const blocks = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));

test('every page carries WebSite, SoftwareApplication and a BreadcrumbList, published by the marketing site’s organisation', { skip }, () => {
  const all = pages();
  assert.ok(all.length > 50, `only ${all.length} pages`);
  for (const [name, html] of all) {
    const found = blocks(html);
    assert.equal(found.length, 1, `${name}: one JSON-LD block`);
    const nodes = found[0];
    assert.ok(Array.isArray(nodes), `${name}: a list of nodes`);
    for (const node of nodes) {
      assert.equal(node['@context'], 'https://schema.org', `${name}: @context`);
      assert.ok(typeof node['@type'] === 'string', `${name}: @type`);
      for (const key of ['offers', 'aggregateRating', 'address', 'foundingDate', 'logo']) assert.ok(!(key in node), `${name}: ${node['@type']} states ${key}`);
    }
    const byType = Object.fromEntries(nodes.map(node => [node['@type'], node]));
    for (const type of ['WebSite', 'SoftwareApplication', 'BreadcrumbList']) assert.ok(byType[type], `${name}: ${type}`);
    assert.ok(!byType.Organization, `${name}: an Organization of its own`);
    for (const type of ['WebSite', 'SoftwareApplication']) assert.deepEqual(byType[type].publisher, { '@id': ORGANIZATION_ID }, `${name}: ${type} publisher`);
    assert.ok(byType.SoftwareApplication.applicationCategory && byType.SoftwareApplication.operatingSystem, `${name}: SoftwareApplication`);
    byType.BreadcrumbList.itemListElement.forEach((item, index) => {
      assert.equal(item['@type'], 'ListItem');
      assert.equal(item.position, index + 1, `${name}: crumb position`);
      assert.ok(item.name && /^https:\/\//.test(item.item), `${name}: crumb ${index + 1}`);
    });
  }
});

test('robots.txt lets the AI crawlers in; llms.txt and llms-full.txt are built', { skip }, () => {
  const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
  for (const agent of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot']) assert.match(robots, new RegExp(`User-agent: ${agent}\\nAllow: /\\n`), agent);
  assert.doesNotMatch(robots, /Disallow/);
  assert.ok(readFileSync(join(dist, 'llms.txt'), 'utf8').startsWith(`# ${PUBLIC_NAME} docs\n\n> ${PUBLIC_NAME} lets two businesses`), 'llms.txt');
  const full = readFileSync(join(dist, 'llms-full.txt'), 'utf8');
  for (const needle of ['Page: /developers', 'Page: /developers/docs', 'Page: /privacy']) assert.ok(full.includes(needle), `llms-full.txt: ${needle}`);
  assert.doesNotMatch(full.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, ''), /<[a-z][^>]*>/i, 'llms-full.txt carries markup outside its code');
});
