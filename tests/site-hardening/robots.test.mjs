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
  CANONICAL_ORIGIN,
  SITE,
  loadBuiltFile,
  parseRobots,
  readText,
  sitemapDirectives,
} from './helpers.mjs';

const robots = readText('public/robots.txt');
const groups = parseRobots(robots);
const wildcard = groups.find((group) => group.agents.includes('*'));
const named = groups.filter((group) => group.agents.length > 0 && !group.agents.includes('*'));
/**
 * Rules every group must carry itself. A named group is matched on its own and
 * never inherits from `*` (RFC 9309 §2.2.1), so a rule that only sits in the
 * wildcard group silently exempts the crawlers the site most wants to talk to.
 */
const policyRules = [
  { field: 'disallow', value: '/api/' },
  { field: 'disallow', value: '/access$' },
  { field: 'disallow', value: '/jobs$' },
  { field: 'disallow', value: '/jobs/' },
];

test('robots.txt declares a wildcard group that allows crawling', () => {
  assert.ok(wildcard, 'no `User-agent: *` group found');
  assert.deepEqual(
    wildcard.rules.filter((rule) => rule.field === 'allow'),
    [{ field: 'allow', value: '/' }],
    'the wildcard group must allow the site root',
  );
});

test('every policy rule binds to the wildcard group, not to the last named group', () => {
  assert.ok(wildcard, 'no `User-agent: *` group found');
  for (const rule of policyRules) {
    assert.ok(
      wildcard.rules.some((candidate) => candidate.field === rule.field && candidate.value === rule.value),
      `\`${rule.field}: ${rule.value}\` must sit inside the \`User-agent: *\` group`,
    );
  }
});

test('every named crawler group repeats the policy rules instead of inheriting them', () => {
  assert.ok(named.length > 0, 'expected explicit answer-engine crawler groups');
  for (const group of named) {
    for (const rule of policyRules) {
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

test('disallow rules are anchored so a sibling route cannot be swallowed', () => {
  for (const group of groups) {
    for (const rule of group.rules.filter((candidate) => candidate.field === 'disallow')) {
      assert.ok(
        rule.value.startsWith('/api/') ||
          rule.value.endsWith('$') ||
          /^\/[a-z0-9-]+\/$/.test(rule.value),
        `\`Disallow: ${rule.value}\` is an unanchored prefix rule; anchor it (e.g. /access$) or ` +
          'end it at a path separator (e.g. /jobs/) so it cannot block a sibling route such as ' +
          '/accessibility or /jobsboard',
      );
    }
  }
});

test('the sitemap directive is injected into the build output, never stored in the source', () => {
  assert.deepEqual(
    sitemapDirectives(robots),
    [],
    'public/robots.txt must hold no Sitemap directive: it is static, so any literal would name ' +
      'a single environment\u2019s host. src/lib/preview-guard.mjs owns that line.',
  );

  const built = loadBuiltFile('dist/robots.txt');
  if (!built.ok) throw new Error(built.reason);

  if (!SITE.indexable) {
    // A non-production build replaces the file wholesale — see preview-guard.mjs.
    assert.match(built.text, /^Disallow: \/$/m);
    assert.deepEqual(sitemapDirectives(built.text), [], 'a preview must not advertise a sitemap');
    return;
  }

  const directives = sitemapDirectives(built.text);
  assert.equal(directives.length, 1, 'a production build must advertise exactly one sitemap');
  const url = new URL(directives[0]);
  assert.ok(url.protocol === 'https:' || url.protocol === 'http:', 'the sitemap URL must be absolute');
  assert.equal(url.origin, CANONICAL_ORIGIN, 'robots.txt Sitemap host must be this build\u2019s origin');
  assert.equal(url.pathname, '/sitemap-index.xml');
});

test('an indexable build copies the crawl policy verbatim and adds only the sitemap line', () => {
  const built = loadBuiltFile('dist/robots.txt');
  if (!built.ok) throw new Error(built.reason);
  if (!SITE.indexable) {
    assert.match(built.text, /^Disallow: \/$/m);
    return;
  }

  const builtWithoutSitemap = built.text
    .split(/\r?\n/)
    .filter((line) => !/^\s*sitemap\s*:/i.test(line))
    .join('\n')
    .replace(/\n+$/, '\n');
  assert.equal(
    builtWithoutSitemap,
    robots,
    'a production build may only append the Sitemap directive; any other divergence means a stale or edited build',
  );
  assert.equal(parseRobots(built.text).length, groups.length, 'the group structure must survive the build');
});
