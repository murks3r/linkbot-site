/* Copies the docs of Connect's open-core export into src/content/open-core/, where /developers/docs renders them at
   build time. It builds the export with Connect's own scripts/oss-export.sh (its allowlist, its oss/ files, its
   transform.mjs with the edited contract copy, the regenerated route list and its guard.mjs, which refuses the export if
   any internal name or id is left; gitleaks over the commit), from a shared clone of the checkout at the ref with the
   contract package's dependencies installed, in a temporary folder, without its pnpm check, and keeps only docs/
   without its architecture decisions.
   SOURCE.json records the commit it came from and the export commit. One change of the site's own, after the
   export's: the clone address of the repository, which is not public yet, becomes OPEN_CORE_REPO_URL (the docs' own
   convention, as EMBED_URL).

     node tools/sync-open-core-docs.mjs <linkbot-connect checkout> [ref]     (ref: origin/next/publish-fixes)

   It needs pnpm and gitleaks, as the export script does. Run it again when Connect changes its docs; the diff under
   src/content/open-core/ is the review. */
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [checkout, ref = 'origin/next/publish-fixes'] = process.argv.slice(2);
if (!checkout) throw new Error('usage: node tools/sync-open-core-docs.mjs <linkbot-connect checkout> [ref]');
const git = (dir, ...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', maxBuffer: 64 << 20 }).trim();
const commit = git(checkout, 'rev-parse', '--short', ref);

const work = mkdtempSync(join(tmpdir(), 'open-core-'));
const source = join(work, 'source');
const out = join(work, 'export');
try {
  /* A clone that shares the checkout's objects: the export script reads HEAD, and the checkout itself stays untouched. */
  execFileSync('git', ['clone', '-q', '--shared', '--no-checkout', checkout, source]);
  git(source, 'checkout', '-q', '--detach', git(checkout, 'rev-parse', ref));
  /* transform.mjs reads the contract with the contract package's yaml: that package's dependencies, nothing else. */
  execFileSync('pnpm', ['install', '--frozen-lockfile', '--prefer-offline', '--reporter=silent', '--filter', '@linkbot-connect/contract'], { cwd: source, stdio: 'inherit' });
  execFileSync('bash', ['scripts/oss-export.sh', '--no-check'], { cwd: source, stdio: ['ignore', 'inherit', 'inherit'], env: { ...process.env, OSS_OUT: out } });
  const exported = git(out, 'rev-parse', '--short', 'HEAD');

  /* The public names: oss/brand.env's defaults (": ${OSS_NAME:=Linkbot}"). */
  const brand = Object.fromEntries([...readFileSync(join(source, 'oss/brand.env'), 'utf8').matchAll(/\$\{(OSS_\w+):=([^}]*)\}/g)].map((m) => [m[1], m[2]]));

  const target = new URL('../src/content/open-core/', import.meta.url).pathname;
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  /* The architecture decisions are the export's history, not the site's docs: left out. */
  cpSync(join(out, 'docs'), join(target, 'docs'), { recursive: true, filter: (path) => !/\/docs\/adr(\/|$)/.test(path) });
  const repoUrl = new RegExp(`https://github\\.com/${brand.OSS_REPO.replace(/[.]/g, '\\.')}(\\.git)?`, 'g');
  for (const rel of readdirSync(join(target, 'docs'), { recursive: true }).map(String).filter((p) => p.endsWith('.md'))) {
    const file = join(target, 'docs', rel);
    writeFileSync(file, readFileSync(file, 'utf8').replace(repoUrl, 'OPEN_CORE_REPO_URL'));
  }
  writeFileSync(join(target, 'SOURCE.json'), `${JSON.stringify({ repository: 'linkbot-connect', ref: ref.replace(/^origin\//, ''), commit, export: exported, name: brand.OSS_NAME, scope: brand.OSS_SCOPE, publicRepository: brand.OSS_REPO }, null, 2)}\n`);
  console.log(`open-core docs from ${ref} at ${commit} (export ${exported}) → src/content/open-core/docs`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
