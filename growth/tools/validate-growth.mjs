#!/usr/bin/env node
/**
 * validate-growth.mjs — structural validator for the growth/ deliverable tree.
 *
 * Checks:
 *  1. Required files exist.
 *  2. Every markdown file has exactly one H1 and a non-trivial body.
 *  3. No unfinished placeholder tokens (TODO/TBD/FIXME/XXX/lorem ipsum).
 *  4. Relative markdown links resolve to existing files.
 *  5. Draft-only asset directories carry an explicit DRAFT banner.
 *  6. Report of counts per directory.
 *
 * Usage: node growth/tools/validate-growth.mjs   (run from repo root)
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GROWTH = resolve(__dirname, '..'); // growth/tools -> growth

const REQUIRED = [
  'README.md',
  '01-strategy/flywheels.md',
  '01-strategy/assumptions.md',
  '01-strategy/decisions.md',
  '02-channels/channel-matrix.md',
  '02-channels/channel-prioritisation.md',
  '02-channels/distribution-checklist.md',
  '02-channels/referral-mechanism.md',
  '03-plan/eight-week-plan.md',
  '03-plan/editorial-calendar.md',
  '03-plan/engagement-runbook.md',
  '04-linkedin/playbook.md',
  '04-linkedin/posts-weeks-1-4.md',
  '05-blog/editorial-architecture.md',
  '05-blog/articles/a1-first-15-minutes.md',
  '05-blog/articles/a2-benchmark-honesty-de.md',
  '05-blog/articles/a3-public-supply-field-report.md',
  '06-product-hunt/launch-readiness-gate.md',
  '06-product-hunt/launch-package.md',
  '07-reddit/community-research.md',
  '07-reddit/participation-plan.md',
  '08-outreach/sequences-email.md',
  '08-outreach/sequences-linkedin.md',
  '08-outreach/newsletter-templates.md',
  '08-outreach/case-study-templates.md',
  '08-outreach/agency-segmentation.md',
  '09-measurement/utm-conventions.md',
  '09-measurement/event-taxonomy.md',
  '09-measurement/dashboards.md',
  '09-measurement/experiment-backlog.md',
  '10-validation/first-customer-validation.md',
  'copy/landing-talent-de-en.md',
  'copy/landing-agency-de-en.md',
  'research/sources.md',
];

const DRAFT_DIRS = ['04-linkedin', '05-blog', '06-product-hunt', '07-reddit', '08-outreach', 'copy'];

const BANNED = [
  /\bTODO\b/,
  /\bTBD\b/,
  /\bFIXME\b/,
  /\bXXX\b/,
  /lorem ipsum/i,
  /<insert\b/i,
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'tools' || name.startsWith('.')) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

const errors = [];
const warnings = [];
let fileCount = 0;

// 1. required files
for (const rel of REQUIRED) {
  if (!existsSync(join(GROWTH, rel))) errors.push(`MISSING required file: ${rel}`);
}

// 2-5. content checks
const mdFiles = walk(GROWTH);
for (const f of mdFiles) {
  fileCount++;
  const rel = f.slice(GROWTH.length + 1);
  const text = readFileSync(f, 'utf8');

  // H1 check (allow YAML frontmatter-ish blocks; count lines starting with '# ')
  const h1 = text.split('\n').filter((l) => /^# /.test(l)).length;
  if (h1 !== 1) errors.push(`${rel}: expected exactly 1 H1, found ${h1}`);

  // body size
  if (text.trim().length < 400) warnings.push(`${rel}: suspiciously short (<400 chars)`);

  // banned tokens
  for (const re of BANNED) {
    const m = text.match(re);
    if (m) errors.push(`${rel}: banned placeholder token "${m[0]}"`);
  }

  // relative markdown links
  const linkRe = /\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRe.exec(text)) !== null) {
    const target = match[1];
    if (/^(https?:|mailto:|#|tel:)/.test(target)) continue;
    const clean = target.split('#')[0];
    if (!clean) continue;
    const resolved = resolve(dirname(f), clean);
    if (!existsSync(resolved)) {
      // tolerate links that intentionally reference future/out-of-tree paths if they start with known roots
      errors.push(`${rel}: relative link does not resolve: ${target}`);
    }
  }

  // draft banner check in draft dirs
  const top = rel.split('/')[0];
  if (DRAFT_DIRS.includes(top)) {
    const head = text.slice(0, 1200);
    if (!/draft/i.test(head)) {
      errors.push(`${rel}: draft directory file must carry a DRAFT banner near the top`);
    }
  }
}

// 6. summary counts
const perDir = {};
for (const f of mdFiles) {
  const rel = f.slice(GROWTH.length + 1);
  const top = rel.includes('/') ? rel.split('/')[0] : '(root)';
  perDir[top] = (perDir[top] || 0) + 1;
}

console.log('growth/ validation');
console.log('==================');
console.log(`markdown files: ${fileCount}`);
for (const [d, n] of Object.entries(perDir).sort()) console.log(`  ${d.padEnd(24)} ${n}`);
console.log('');
for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);

if (errors.length) {
  console.log(`\nFAIL — ${errors.length} error(s).`);
  process.exit(1);
} else {
  console.log(`\nPASS — ${fileCount} files, ${warnings.length} warning(s).`);
}
