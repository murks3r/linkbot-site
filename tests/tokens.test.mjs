/* One palette (docs/front/landing-plan.md §3): src/styles/tokens.css holds exactly the widget design spec v1's colours
   (§5), and no other stylesheet or component in src/ writes a colour of its own. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SPEC = { ground: '#F2F4F1', surface: '#FFFFFF', ink: '#1D2928', slate: '#556360', line: '#C5CECA', 'line-quiet': '#E3E8E6', track: '#D3DAD7', accent: '#2B4FA3', 'accent-soft': '#E8EEF9', 'accent-soft-2': '#C9D5EE', marker: '#F6DC7E' };
const HEX = /#[0-9a-f]{3,8}\b/gi;

test('tokens.css holds exactly the spec’s colours', () => {
  const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
  const found = Object.fromEntries([...css.matchAll(/--lb-([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6});/g)].map(([, name, hex]) => [name, hex.toUpperCase()]));
  assert.deepEqual(found, SPEC);
});

test('no other stylesheet or component writes a colour', () => {
  const files = [];
  const walk = dir => { for (const entry of readdirSync(dir, { withFileTypes: true })) { const path = join(dir, entry.name); if (entry.isDirectory()) walk(path); else if (/\.(css|astro)$/.test(entry.name)) files.push(path); } };
  walk('src');
  for (const file of files) {
    if (file === join('src', 'styles', 'tokens.css')) continue;
    // Only styles count: <style> blocks of a component, or the whole stylesheet; the theme-color meta is a document's.
    const text = readFileSync(file, 'utf8');
    const styles = file.endsWith('.css') ? text : [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
    assert.deepEqual(styles.match(HEX) ?? [], [], `${file} writes a colour`);
  }
});
