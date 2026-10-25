/* A shared link looks finished: every built page names its own preview image (og:image), in its own language, and the
   build drew it as a 1200 × 630 PNG at that address (src/integrations/share-images.ts). Skipped until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const skip = !existsSync(join(dist, 'index.html')) && 'build the site first';
const meta = (html, property) => html.match(new RegExp(`<meta (?:property|name)="${property}" content="([^"]*)"`))?.[1];

test('every page has its own preview image, drawn by the build', { skip }, () => {
  const pages = readdirSync(dist, { recursive: true }).filter(file => file.endsWith('.html'));
  const seen = new Map();
  for (const page of pages) {
    const html = readFileSync(join(dist, page), 'utf8');
    const image = meta(html, 'og:image');
    assert.ok(image, `${page} has no og:image`);
    for (const p of ['og:title', 'og:description', 'og:image:alt', 'twitter:card']) assert.ok(meta(html, p), `${page} has no ${p}`);
    const { pathname } = new URL(image);
    assert.ok(!seen.has(pathname), `${page} shares its image with ${seen.get(pathname)}`);
    seen.set(pathname, page);
    const png = readFileSync(join(dist, pathname));
    assert.equal(png.toString('latin1', 1, 4), 'PNG', `${pathname} is not a PNG`);
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1200, 630], `${pathname} is not 1200 × 630`);
  }
  const drawn = readdirSync(join(dist, 'og'), { recursive: true }).filter(file => file.endsWith('.png'));
  assert.equal(drawn.length, seen.size, `og/ holds images no page names: ${drawn.filter(f => ![...seen.keys()].includes(`/og/${f}`)).join(', ')}`);
});
