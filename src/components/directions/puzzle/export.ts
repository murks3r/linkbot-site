/* Writes the `puzzle` direction's porcelain objects as standalone SVG files into
   public/directions/puzzle/ (geometry.ts draws them). Run after changing a drawing, and commit the
   files:   node src/components/directions/puzzle/export.ts          (write)
            node src/components/directions/puzzle/export.ts --check  (fail if a file is stale)
   Node 22.18+ runs this TypeScript directly (type stripping). */
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { files } from './geometry.ts';

const dir = new URL('../../../../public/directions/puzzle/', import.meta.url);
const check = process.argv.includes('--check');
const want = files();
mkdirSync(dir, { recursive: true });
const stale: string[] = [];
for (const [name, svg] of Object.entries(want)) {
  const file = new URL(`${name}.svg`, dir);
  if (check) { if (!existsSync(file) || readFileSync(file, 'utf8') !== svg) stale.push(name); }
  else writeFileSync(file, svg);
}
const extra = readdirSync(dir).filter(f => f.endsWith('.svg') && !(f.slice(0, -4) in want));
if (check && (stale.length || extra.length)) { console.error(`stale: ${stale.join(', ') || '–'}; not drawn any more: ${extra.join(', ') || '–'}`); process.exit(1); }
console.log(check ? `${Object.keys(want).length} files current` : `wrote ${Object.keys(want).length} files`);
