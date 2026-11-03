/* The developer docs (src/lib/open-core-docs.ts): the links inside the export's Markdown become the site's addresses or
   plain words, every file the navigation names was copied, and every built docs page says first that nothing is
   published and names no internal id or host. The build checks are skipped until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { DOC_FILES, SECTIONS, docDescription, docRoute, rewriteLink } from '../src/lib/open-core-docs.ts';

const content = new URL('../src/content/open-core/docs/', import.meta.url);
const dist = new URL('../dist/developers/', import.meta.url);

test('a link inside the export becomes the site’s address of the file, or no link', () => {
  assert.equal(rewriteLink('guides/quickstart.md', '../reference/embed.md#design'), '/developers/docs/reference/embed#design');
  assert.equal(rewriteLink('README.md', 'protocol/README.md'), '/developers/docs/protocol');
  assert.equal(rewriteLink('guides/quickstart.md', '#2-paste-the-snippet'), '#2-paste-the-snippet');
  assert.equal(rewriteLink('protocol/README.md', '../../packages/contract/openapi.yaml'), null);
  assert.equal(rewriteLink('README.md', 'adr/'), null);
  assert.equal(rewriteLink('reference/sdk.md', 'https://openapi-ts.dev/openapi-fetch/'), null);
  assert.equal(docRoute('README.md'), '/developers/docs');
});

test('every file the navigation names was copied from the export, and SOURCE.json names its commit', () => {
  for (const file of DOC_FILES) assert.ok(existsSync(new URL(file, content)), `${file} missing: run tools/sync-open-core-docs.mjs`);
  assert.match(JSON.parse(readFileSync(new URL('../SOURCE.json', content), 'utf8')).commit, /^[0-9a-f]{7,}$/);
  assert.deepEqual(SECTIONS.map(s => s.id), ['quickstart', 'widget', 'sdk', 'cli', 'protocol', 'api', 'open', 'planned']);
});

test('a description takes plain paragraphs up to 160 characters', () => {
  assert.equal(docDescription('# T\n\n> note\n\nShort one.\n\nAnd a second paragraph that makes it long enough.'), 'Short one. And a second paragraph that makes it long enough.');
  assert.ok(docDescription(`# T\n\n${'word '.repeat(60)}`).length <= 160);
});

test('every built docs page says nothing is published yet, and names no internal id or host', { skip: !existsSync(new URL('docs.html', dist)) && 'build the site first' }, () => {
  const pages = ['docs.html', ...readdirSync(new URL('docs/', dist), { recursive: true }).filter(f => f.endsWith('.html')).map(f => `docs/${f}`)];
  assert.equal(pages.length, DOC_FILES.length + 2);
  for (const page of pages) {
    const html = readFileSync(new URL(page, dist), 'utf8');
    assert.match(html, /<strong[^>]*>Not published yet\.<\/strong>/, `${page}: the note`);
    assert.doesNotMatch(html, /\b(GEO|CN|CE|V3|NX)-\d+|murks3r|geoprocure|railway/i, `${page}: an internal name`);
  }
});
