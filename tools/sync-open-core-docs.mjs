/* Copies the docs of Connect's open-core export into src/content/open-core/, where /developers/docs renders them at
   build time. It builds the export the way Connect's scripts/oss-export.sh does (its allowlist, its oss/ files, its
   scripts/oss-export/transform.mjs with the names in oss/brand.env, which scrubs internal names and refuses the export
   if any are left), in a temporary folder, without installing, checking or committing anything, and keeps only docs/
   without its architecture decisions.
   SOURCE.json records the commit it came from. Three changes of the site's own, after the export's: the clone address
   of the repository, which is not public yet, becomes OPEN_CORE_REPO_URL (the docs' own convention, as EMBED_URL); "the
   Connect lane" becomes "the Connect team" (a lane is the build's word, tests/build.test.mjs); and the ticket ids the
   export leaves in the route list it pins (docs/reference/space-api.md, generated from the contract) go.

     node tools/sync-open-core-docs.mjs <linkbot-connect checkout> [ref]     (ref: origin/next/open-core)

   Run it again when Connect changes its docs; the diff under src/content/open-core/ is the review. */
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const [checkout, ref = 'origin/next/open-core'] = process.argv.slice(2);
if (!checkout) throw new Error('usage: node tools/sync-open-core-docs.mjs <linkbot-connect checkout> [ref]');
const git = (...args) => execFileSync('git', ['-C', checkout, ...args], { encoding: 'utf8', maxBuffer: 64 << 20 });
const show = (path) => git('show', `${ref}:${path}`);
const commit = git('rev-parse', '--short', ref).trim();

/* The allowlist and the copied oss/ files, as scripts/oss-export.sh has them at the ref: read from it, not repeated. */
const script = show('scripts/oss-export.sh');
const allow = script.match(/allow=\(\n([\s\S]*?)\n\)/)?.[1].split(/\s+/).filter(Boolean);
if (!allow?.length) throw new Error(`no allowlist in scripts/oss-export.sh at ${ref}`);
const present = allow.filter((path) => git('ls-tree', ref, '--', path).trim());

/* The public names: oss/brand.env's defaults (": ${OSS_NAME:=Linkbot}"). */
const brand = Object.fromEntries([...show('oss/brand.env').matchAll(/\$\{(OSS_\w+):=([^}]*)\}/g)].map((m) => [m[1], m[2]]));

const work = mkdtempSync(join(tmpdir(), 'open-core-'));
const out = join(work, 'export');
mkdirSync(out);
try {
  const archive = execFileSync('git', ['-C', checkout, 'archive', '--format=tar', ref, '--', ...present], { maxBuffer: 256 << 20 });
  execFileSync('tar', ['-x', '-C', out], { input: archive });
  for (const name of ['LICENSE', 'LICENSE-docs', 'NOTICE', 'README.md', 'SECURITY.md', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', 'package.json', 'pnpm-workspace.yaml']) {
    writeFileSync(join(out, name), show(`oss/${name}`));
  }
  for (const path of git('ls-tree', '-r', '--name-only', ref, 'oss/docs').split('\n').filter(Boolean)) {
    const target = join(out, 'docs', path.slice('oss/docs/'.length));
    mkdirSync(resolve(target, '..'), { recursive: true });
    writeFileSync(target, show(path));
  }
  const transform = join(work, 'transform.mjs'); // outside the export, which its guard reads
  writeFileSync(transform, show('scripts/oss-export/transform.mjs'));
  execFileSync(process.execPath, [transform, out], { stdio: 'inherit', env: { ...process.env, ...brand } });

  const target = new URL('../src/content/open-core/', import.meta.url).pathname;
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  /* The architecture decisions are the export's history, not the site's docs: left out. */
  cpSync(join(out, 'docs'), join(target, 'docs'), { recursive: true, filter: (path) => !/\/docs\/adr(\/|$)/.test(path) });
  const repoUrl = new RegExp(`https://github\\.com/${brand.OSS_REPO.replace(/[.]/g, '\\.')}(\\.git)?`, 'g');
  for (const rel of readdirSync(join(target, 'docs'), { recursive: true }).map(String).filter((p) => p.endsWith('.md'))) {
    const file = join(target, 'docs', rel);
    let text = readFileSync(file, 'utf8').replace(repoUrl, 'OPEN_CORE_REPO_URL').replace(/\bthe ([A-Z][\w-]*) lane\b/g, 'the $1 team');
    if (rel === 'reference/space-api.md') text = text
      .replace(/\s*\((?:GEO|V3)-\d+[^()]*\)/g, '')
      .replace(/decision D-[A-Z0-9]+ [a-z]; /g, '')
      .replace(/ of GEO-\d+/g, '')
      .replace(/; V3-\d+\)/g, ')');
    writeFileSync(file, text);
  }
  writeFileSync(join(target, 'SOURCE.json'), `${JSON.stringify({ repository: 'linkbot-connect', ref: ref.replace(/^origin\//, ''), commit, name: brand.OSS_NAME, scope: brand.OSS_SCOPE, publicRepository: brand.OSS_REPO }, null, 2)}\n`);
  console.log(`open-core docs from ${ref} at ${commit} → src/content/open-core/docs`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
