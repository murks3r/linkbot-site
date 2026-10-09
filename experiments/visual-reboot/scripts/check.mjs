// @ts-nocheck
/**
 * Static checks — no browser, no dependencies.
 *
 *   node scripts/check.mjs
 *
 *   1. WCAG contrast of every token pair, for every audience accent
 *   2. every .js/.mjs file parses (node --check)
 *   3. every .js/.mjs file starts with `// @ts-nocheck` (see README: the repo
 *      root's tsconfig globs **\/*, so this folder must never be able to fail
 *      the Astro typecheck)
 *   4. no external hosts in src/
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
const fail = (msg) => { failures += 1; console.log(`  ✗ ${msg}`); };
const pass = (msg) => console.log(`  ✓ ${msg}`);

function walk(dir, skip = ['node_modules', 'dist', 'screenshots']) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (skip.includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p, skip));
    else out.push(p);
  }
  return out;
}

/* ---------- 1. contrast ---------- */
const tokens = readFileSync(join(root, 'src/css/tokens.css'), 'utf8');

function varsIn(block) {
  const vars = {};
  for (const m of block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})\b/gi)) vars[m[1]] = m[2].toLowerCase();
  return vars;
}
const rootBlock = tokens.match(/:root\s*\{([\s\S]*?)\n\}/)[1];
const base = varsIn(rootBlock);
base.focus = base.ink; // tokens.css: --focus: var(--ink)
const audiences = { talent: base };
for (const name of ['developers', 'employers']) {
  const block = tokens.match(new RegExp(`:root\\[data-audience="${name}"\\]\\s*\\{([\\s\\S]*?)\\}`))[1];
  audiences[name] = { ...base, ...varsIn(block) };
}

const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// [foreground, background, minimum, what]
const PAIRS = [
  ['ink', 'paper', 4.5, 'body text on page'],
  ['ink', 'surface', 4.5, 'body text on record sheet'],
  ['ink-2', 'paper', 4.5, 'secondary text'],
  ['muted', 'paper', 4.5, 'tertiary text on page'],
  ['muted', 'surface', 4.5, 'tertiary text on sheet'],
  ['muted', 'sunken', 4.5, 'tertiary text on well'],
  ['accent', 'paper', 4.5, 'accent as text / link on page'],
  ['accent', 'surface', 4.5, 'accent as text on sheet'],
  ['accent-ink', 'accent-tint', 4.5, 'text on selected-row wash'],
  ['ink', 'accent-tint', 4.5, 'body text on selected-row wash'],
  ['on-accent', 'accent', 4.5, 'primary button label'],
  ['on-accent', 'accent-ink', 4.5, 'primary button label, hover'],
  ['control', 'paper', 3, 'control border on page'],
  ['control', 'surface', 3, 'control border on sheet'],
  ['accent', 'surface', 3, 'accent graphics (seal, switch) on sheet'],
  // The focus ring is an ink outline drawn 2px OFF the control, so it borders the
  // surface the control sits on (never the control's own fill).
  ['focus', 'paper', 3, 'focus ring on page'],
  ['focus', 'surface', 3, 'focus ring on sheet'],
  ['focus', 'sunken', 3, 'focus ring on well'],
  ['focus', 'accent-tint', 3, 'focus ring on selected-row wash'],
];
console.log('Contrast (WCAG 2.2; text >= 4.5, graphics/controls >= 3)');
for (const [audience, v] of Object.entries(audiences)) {
  let worst = Infinity;
  let worstLabel = '';
  for (const [fg, bg, min, what] of PAIRS) {
    if (!v[fg] || !v[bg]) { fail(`${audience}: missing token ${fg} or ${bg}`); continue; }
    const r = ratio(v[fg], v[bg]);
    if (r < min) fail(`${audience}: ${what} — ${fg} ${v[fg]} on ${bg} ${v[bg]} = ${r.toFixed(2)} (< ${min})`);
    if (r / min < worst) { worst = r / min; worstLabel = `${what} ${r.toFixed(2)}:1`; }
  }
  pass(`${audience.padEnd(11)} ${PAIRS.length} pairs checked; tightest: ${worstLabel}`);
}

/* ---------- 2/3. JS ---------- */
console.log('\nJavaScript');
const jsFiles = walk(root).filter((f) => ['.js', '.mjs'].includes(extname(f)));
for (const file of jsFiles) {
  const rel = relative(root, file);
  const syntax = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (syntax.status !== 0) fail(`${rel}: syntax error\n${syntax.stderr}`);
  if (!readFileSync(file, 'utf8').startsWith('// @ts-nocheck')) fail(`${rel}: missing leading "// @ts-nocheck"`);
}
if (failures === 0) pass(`${jsFiles.length} files parse and carry @ts-nocheck`);

/* ---------- 4. external hosts ---------- */
console.log('\nExternal hosts');
const allowed = new Set(['www.w3.org', 'example.com', 'www.example.com', 'schema.example.com']);
let external = 0;
for (const file of walk(join(root, 'src')).filter((f) => ['.html', '.css', '.js', '.svg'].includes(extname(f)))) {
  for (const m of readFileSync(file, 'utf8').matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
    if (!allowed.has(m[1].toLowerCase())) { external += 1; fail(`${relative(root, file)}: ${m[1]}`); }
  }
}
if (external === 0) pass('none outside the allow-list (SVG namespace, reserved example.com)');

console.log(failures === 0 ? '\nall checks passed' : `\n${failures} check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
