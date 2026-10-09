/**
 * llms.txt regression tests: the machine-readable summary must stay accurate,
 * stay on the canonical host, and only reference routes and contacts that
 * actually exist in the build.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  loadBuiltFile,
  loadBuiltHtml,
  readText,
  elementIds,
} from './helpers.mjs';

const llms = readText('public/llms.txt');
/** Paragraph-wrapped prose is matched on a whitespace-flattened copy. */
const llmsFlat = llms.replace(/\s+/g, ' ');
const urls = [...llms.matchAll(/https?:\/\/[^\s)>,\]]+/g)].map((match) => match[0]);
const linkedPaths = [...llms.matchAll(/\]\(([^)\s]+)\)/g)].map((match) => match[1]);

test('llms.txt keeps the required shape: H1 title followed by a summary blockquote', () => {
  const lines = llms.split(/\r?\n/);
  assert.match(lines[0], /^# \S/, 'first line must be an H1 title');
  const summaryIndex = lines.findIndex((line) => line.trim().startsWith('>'));
  assert.ok(summaryIndex > 0 && summaryIndex < 10, 'a blockquote summary must follow the title');
  assert.ok(lines[summaryIndex].trim().length > 40, 'summary must be a real sentence, not a stub');
});

test('llms.txt names no host of its own and links the site root-relative', () => {
  assert.deepEqual(
    urls,
    [],
    'llms.txt is a static file: an absolute URL would name a single environment\u2019s host, and ' +
      'the D6 migration removed the old domain from it entirely (see docs/integration/jobsite-preview-v1.md)',
  );
  assert.ok(linkedPaths.length >= 2, 'expected the core page and the access form');
  for (const path of linkedPaths) {
    assert.ok(path.startsWith('/'), `llms.txt link ${path} must be root-relative`);
  }
  assert.ok(linkedPaths.includes('/'), 'llms.txt must link the home page');
  assert.ok(linkedPaths.some((path) => path.startsWith('/#')), 'llms.txt must link the access request');
});

test('llms.txt carries contact details and states the current product status', () => {
  assert.match(llmsFlat, /hello@linkbot\.org/, 'contact address missing');
  assert.match(llmsFlat, /private beta/i, 'product status (private beta) missing');
  assert.match(llmsFlat, /API is in private testing/i, 'API availability claim missing');
});

test('llms.txt does not advertise a capability the site does not publish', () => {
  assert.match(
    llmsFlat,
    /no real job listings on this site/i,
    'llms.txt must state that the /jobs surface is not real supply',
  );
  assert.match(
    llmsFlat,
    /labelled synthetic sample data/i,
    'llms.txt must say what /jobs actually serves, now that the route exists',
  );
  assert.doesNotMatch(llms, /\bAPI is generally available\b|\bgeneral availability\b/i, 'no GA claim may be made');
  assert.doesNotMatch(llms, /\bpricing\b|\bplans?\b|\$/i, 'no pricing claim may be made while none is published');
});

test('the built llms.txt is byte-identical to the source file', async (t) => {
  const built = loadBuiltFile('dist/llms.txt');
  if (!built.ok) return t.skip(built.reason);
  assert.equal(
    built.text,
    llms,
    'no build step may rewrite llms.txt: it is static and deliberately names no host',
  );
});

test('anchors referenced by llms.txt exist in the built page', async (t) => {
  const built = loadBuiltHtml();
  if (!built.ok) return t.skip(built.reason);
  const ids = new Set(elementIds(built.html));
  for (const path of linkedPaths) {
    const fragment = path.split('#')[1];
    if (!fragment) continue;
    assert.ok(ids.has(fragment), `llms.txt links #${fragment} but the built page has no such id`);
  }
});

test('the contact address in llms.txt is the address the page actually uses', async (t) => {
  const built = loadBuiltHtml();
  if (!built.ok) return t.skip(built.reason);
  const mailtos = [...built.html.matchAll(/mailto:([^"'?]+)/g)].map((match) => match[1]);
  assert.ok(mailtos.length > 0, 'the built page exposes no mailto contact');
  for (const mailto of new Set(mailtos)) {
    assert.ok(llms.includes(mailto), `llms.txt omits the published contact address ${mailto}`);
  }
});
