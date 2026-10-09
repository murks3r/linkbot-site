/**
 * Structured-data (JSON-LD) regression tests against the built page.
 * Checks parseability, internal reference integrity, host correctness, asset
 * existence and that no rich-result type is asserted that the product cannot
 * support today.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CANONICAL_HOST,
  CANONICAL_ORIGIN,
  SITE,
  exists,
  loadBuiltHtml,
  parseJsonLdBlocks,
} from './helpers.mjs';

const built = loadBuiltHtml();
const html = built.ok ? built.html : '';
const skipReason = built.ok ? undefined : built.reason;

/** Rich-result types that would be fabricated on a page with no such content. */
const UNSUPPORTED_TYPES = ['JobPosting', 'Review', 'AggregateRating', 'Offer', 'Product', 'Event'];

function graph() {
  const blocks = parseJsonLdBlocks(html);
  return blocks.flatMap((block) => (Array.isArray(block['@graph']) ? block['@graph'] : [block]));
}

test('JSON-LD parses and declares the schema.org context once', { skip: skipReason }, () => {
  const blocks = parseJsonLdBlocks(html);
  assert.equal(blocks.length, 1, 'expected a single @graph document rather than repeated blocks');
  assert.equal(blocks[0]['@context'], 'https://schema.org');
  assert.ok(Array.isArray(blocks[0]['@graph']), 'expected an @graph array');
});

test('every absolute URL and @id in the graph resolves on this build origin', { skip: skipReason }, () => {
  const nodes = graph();
  assert.ok(nodes.length >= 3, 'expected Organization, WebSite and WebPage nodes');
  for (const node of nodes) {
    for (const key of ['url', '@id']) {
      const value = node[key];
      if (value === undefined) continue;
      const url = new URL(value.startsWith('http') ? value : `${CANONICAL_ORIGIN}${value}`);
      assert.ok(url.protocol === 'https:' || url.protocol === 'http:', `${key} ${value} must be absolute`);
      assert.equal(
        url.origin,
        CANONICAL_ORIGIN,
        `${key} ${value} must name the origin this build resolved, not another host`,
      );
      assert.equal(url.host, CANONICAL_HOST, `${key} ${value} must use the canonical host`);
      if (SITE.indexable) assert.equal(url.protocol, 'https:', `${key} ${value} must be https in production`);
    }
  }
});

test('cross-node @id references resolve inside the graph', { skip: skipReason }, () => {
  const ids = new Set(graph().map((node) => node['@id']).filter(Boolean));
  const references = graph().flatMap((node) =>
    ['publisher', 'isPartOf', 'about', 'mainEntity', 'mainEntityOfPage'].flatMap((key) => {
      const value = node[key];
      if (!value) return [];
      const list = Array.isArray(value) ? value : [value];
      return list.filter((entry) => entry && entry['@id']).map((entry) => entry['@id']);
    }),
  );
  assert.ok(references.length >= 4, 'expected the graph to link its nodes');
  for (const reference of references) {
    assert.ok(ids.has(reference), `dangling @id reference: ${reference}`);
  }
});

test('Organization node carries the verified identity fields and a resolvable contact', { skip: skipReason }, () => {
  const organization = graph().find((node) => node['@type'] === 'Organization');
  assert.ok(organization, 'no Organization node');
  assert.equal(organization.name, 'Linkbot');
  assert.equal(organization.legalName, 'Linkbot OÜ');
  assert.equal(organization.email, 'hello@linkbot.org');
  assert.equal(organization.address?.addressCountry, 'EE');
  assert.equal(organization.address?.addressLocality, 'Tallinn');
  assert.ok(
    organization.address.addressCountry.length === 2,
    'addressCountry must be an ISO 3166-1 alpha-2 code',
  );
  assert.match(String(organization.foundingDate), /^\d{4}$/, 'foundingDate must be a year if declared');
});

test('Organization logo and image point at assets that exist', { skip: skipReason }, () => {
  const organization = graph().find((node) => node['@type'] === 'Organization');
  for (const key of ['logo', 'image']) {
    const asset = organization[key];
    assert.ok(asset, `Organization.${key} missing`);
    assert.equal(asset['@type'], 'ImageObject');
    assert.ok(exists(`public${new URL(asset.url).pathname}`), `Organization.${key} asset ${asset.url} does not exist`);
    assert.ok(Number.isFinite(asset.width) && Number.isFinite(asset.height), `Organization.${key} needs dimensions`);
  }
  const logo = organization.logo;
  assert.equal(logo.url, `${CANONICAL_ORIGIN}/favicon.svg`, 'logo must be the brand mark, not the social card');
});

test('WebPage node mirrors the page canonical URL and title', { skip: skipReason }, () => {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const page = graph().find((node) => node['@type'] === 'WebPage');
  assert.ok(page, 'no WebPage node');
  assert.equal(page.url, canonical);
  assert.equal(page.name, title);
  assert.equal(page.inLanguage, 'en');
});

test('no rich-result type is asserted that this site cannot substantiate', { skip: skipReason }, () => {
  for (const node of graph()) {
    for (const type of [].concat(node['@type'])) {
      assert.ok(
        !UNSUPPORTED_TYPES.includes(type),
        `structured data asserts ${type}, but this marketing page publishes no such content`,
      );
    }
  }
});

test('structured data contains no unsupported superlative or quantified claim', { skip: skipReason }, () => {
  const organization = graph().find((node) => node['@type'] === 'Organization');
  const text = JSON.stringify(organization);
  assert.doesNotMatch(
    text,
    /\b(industry[- ]leading|world[- ]class|market[- ]leading|number one|#1|best[- ]in[- ]class|millions of|thousands of|%\s*of)\b/i,
    'structured data must stay within what the site publishes',
  );
});
