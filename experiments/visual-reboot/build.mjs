// @ts-nocheck
/**
 * Zero-dependency build: src/ + public/  ->  dist/
 *
 *   node build.mjs
 *
 * No npm install is needed (there are no dependencies), so this works in a fresh
 * Linux environment and on Vercel with Root Directory `experiments/visual-reboot`.
 *
 * What it does:
 *   1. clears dist/
 *   2. copies src/ and public/ into it (public wins on a clash)
 *   3. conservatively minifies CSS (comments + whitespace; no rewriting)
 *   4. syntax-checks every JS module with `node --check`
 *   5. fails if any source file references a host other than the allow-list
 *      (this prototype must never depend on an external service)
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';

const root = dirname(fileURLToPath(import.meta.url));
const SRC = join(root, 'src');
const PUBLIC = join(root, 'public');
const DIST = join(root, 'dist');

/** Hosts that may appear in source: SVG namespaces and the reserved example domain. */
const ALLOWED_HOSTS = new Set(['www.w3.org', 'example.com', 'www.example.com', 'schema.example.com']);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function fail(message) {
  console.error(`\nbuild failed: ${message}`);
  process.exit(1);
}

const started = Date.now();

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(SRC, DIST, { recursive: true });
if (existsSync(PUBLIC)) cpSync(PUBLIC, DIST, { recursive: true });

// 3 — CSS
for (const file of walk(DIST).filter((f) => extname(f) === '.css')) {
  writeFileSync(file, minifyCss(readFileSync(file, 'utf8')));
}

// 4 — JS syntax
const jsFiles = walk(DIST).filter((f) => ['.js', '.mjs'].includes(extname(f)));
for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) fail(`syntax error in ${relative(DIST, file)}\n${result.stderr}`);
}

// 5 — external hosts
const textFiles = walk(SRC).filter((f) => ['.html', '.css', '.js', '.mjs', '.svg'].includes(extname(f)));
const urlPattern = /https?:\/\/([a-z0-9.-]+)/gi;
for (const file of textFiles) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(urlPattern)) {
    if (!ALLOWED_HOSTS.has(match[1].toLowerCase())) {
      fail(`external host "${match[1]}" referenced in ${relative(root, file)}`);
    }
  }
}

// summary
const rows = walk(DIST)
  .map((f) => {
    const buf = readFileSync(f);
    return { file: relative(DIST, f), bytes: buf.length, gzip: ['.woff', '.png'].includes(extname(f)) ? buf.length : gzipSync(buf).length };
  })
  .sort((a, b) => a.file.localeCompare(b.file));
const total = rows.reduce((n, r) => n + r.bytes, 0);
const totalGzip = rows.reduce((n, r) => n + r.gzip, 0);
console.log(`built ${rows.length} files -> ${relative(process.cwd(), DIST) || 'dist'}  (${(total / 1024).toFixed(0)} kB raw, ~${(totalGzip / 1024).toFixed(0)} kB transferred)  in ${Date.now() - started} ms`);
if (process.argv.includes('--list')) for (const r of rows) console.log(`  ${r.file.padEnd(34)} ${String(r.bytes).padStart(8)} b`);
