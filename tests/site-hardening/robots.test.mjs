/**
 * robots.txt regression tests.
 *
 * Guards the crawl instructions against the class of bug this suite was
 * written for: rules that read as policy but bind to the wrong group, and
 * over-broad prefix rules that block unrelated future routes.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CANONICAL_HOST,
  configuredSiteOrigin,
  loadBuiltFile,
  parseRobots,
  readText,
  sitemapDirectives,
} from './helpers.mjs';

const robots = readText('public/robots.txt');
const groups = parseRobots(robots);
const wildcard = groups.find((group) => group.agents.includes('*'));
const named = groups.filter((group) => group.agents.length > 0 && !group.agents.includes('*'));
const reservedRules = [
  { field: 'disallow', value: '/api/' },
  { field: 'disallow', value: '/access$' },
];

test('robots.txt declares a wildcard group that allows crawling', () => {
  assert.ok(wildcard, 'no `User-agent: *` group found');
  assert.deepEqual(
    wildcard.rules.filter((rule) => rule.field === 'allow'),
    [{ field: 'allow', value: '/' }],
    'the wildcard group must allow the site root',
  );
});

test('reserved-path rules bind to the wildcard group, not to the last named group', () => {
  assert.ok(wildcard, 'no `User-agent: *` group found');
  for (const rule of reservedRules) {
    assert.ok(
      wildcard.rules.some((candidate) => candidate.field === rule.field && candidate.value === rule.value),
      `\`${rule.field}: ${rule.value}\` must sit inside the \`User-agent: *\` group`,
    );
  }
});

test('every named crawler group repeats the reserved-path rules instead of inheriting them', () => {
  assert.ok(named.length > 0, 'expected explicit answer-engine crawler groups');
  for (const group of named) {
    for (const rule of reservedRules) {
      assert.ok(
        group.rules.some((candidate) => candidate.field === rule.field && candidate.value === rule.value),
        `group for ${group.agents.join(', ')} would allow ${rule.value} because named groups do not inherit from \`*\``,
      );
    }
  }
});

test('no group disallows the whole site', () => {
  for (const group of groups) {
    for (const rule of group.rules.filter((candidate) => candidate.field === 'disallow')) {
      assert.notEqual(
        rule.value,
        '/',
        `group for ${group.agents.join(', ') || '(orphan rules)'} disallows the whole site, which is a parked-domain signal`,
      );
    }
  }
});

test('reserved paths use exact anchors so prefix collisions cannot occur', () => {
  for (const group of groups) {
    for (const rule of group.rules.filter((candidate) => candidate.field === 'disallow')) {
      assert.ok(
        rule.value.startsWith('/api/') || rule.value.endsWith('$'),
        `\`Disallow: ${rule.value}\` is an unanchored prefix rule; anchor it (e.g. /access$) to avoid blocking sibling routes such as /accessibility`,
      );
    }
  }
});

test('sitemap directive is absolute, on the canonical host and matches the configured site', () => {
  const directives = sitemapDirectives(robots);
  assert.equal(directives.length, 1, 'expected exactly one Sitemap directive');
  const url = new URL(directives[0]);
  assert.equal(url.protocol, 'https:');
  assert.equal(url.host, CANONICAL_HOST);
  assert.equal(url.pathname, '/sitemap-index.xml');
  assert.equal(url.origin, configuredSiteOrigin(), 'robots.txt Sitemap host must match astro.config.mjs `site`');
});

test('the built robots.txt is byte-identical to the source file', async (t) => {
  const built = loadBuiltFile('dist/robots.txt');
  if (!built.ok) return t.skip(built.reason);
  assert.equal(built.text, robots, 'astro build copies public/ verbatim; divergence means a stale build');
});
