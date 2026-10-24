/* Linkbot does not own the domain that earlier copy used: a third party holds it (owner, 2026-10-24;
   CLAUDE.md, "Domains and identification"). No tracked file may name it, in any letter case, and a
   merge that brings it back fails here. Its name is put together from parts, so that this file does
   not name it either and a search of the repository for it finds nothing. Binary files and the
   lockfile npm writes are not read. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const UNOWNED = ['linkbot', 'org'].join('.');
const root = fileURLToPath(new URL('..', import.meta.url));

test('no tracked file names the domain Linkbot does not own', () => {
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  const hits = [];
  for (const file of tracked) {
    const path = join(root, file);
    // git still lists a file deleted from the working tree until the deletion is staged.
    if (file === 'package-lock.json' || !existsSync(path)) continue;
    const bytes = readFileSync(path);
    if (bytes.includes(0)) continue; // a NUL byte: binary
    const lines = bytes.toString('utf8').toLowerCase().split('\n');
    lines.forEach((line, index) => { if (line.includes(UNOWNED)) hits.push(`${file}:${index + 1}`); });
  }
  assert.deepEqual(hits, [], `the domain Linkbot does not own is named at ${hits.join(', ')}; where a Linkbot domain is meant, write linkbot-domain-tbd.invalid`);
});
