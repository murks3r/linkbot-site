/* The dust tiles (GEO-188, third pass, 2026-10-24): public/material/dust-light.png and dust-dark.png.

   A tile of single-pixel grains that lies on the page background, under everything else, and scrolls with the page.
   Every grain is drawn independently of the others (white noise, with neighbours made rarer so no two grains clump
   into a bigger speck), so the tile has no edges: repeated, it shows no seam and no period. Three faint levels of the
   ink colour (light) or of the light ink (dark), as a 2-bit palette PNG of about ten kilobytes. The CSS draws one
   tile pixel per device pixel (site.css, --dust-size), so a grain is never larger than a pixel.

   Deterministic: the same seed writes the same bytes. To tune by eye, change DENSITY or the ALPHA levels and run
     node scripts/dust.mjs                                                                                        */
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const SIZE = 240;                 // device pixels; 240 divides into 1×, 1.5×, 2× and 3× screens (240, 160, 120, 80 CSS px)
const DENSITY = 0.22;             // the chance that a pixel holds a grain, before neighbours thin it out
const NEIGHBOUR = 0.35;           // the chance kept when the pixel to the left or above already holds one
const SHARE = [0.5, 0.35, 0.15];  // how the grains split over the three levels, faintest first
const TILES = {
  light: { rgb: [0x15, 0x17, 0x1a], alpha: [4, 6, 8], seed: 0x5eed1 },    // ink on the paper: 1.6, 2.4, 3.1 per cent
  dark: { rgb: [0xec, 0xec, 0xe8], alpha: [5, 8, 11], seed: 0x5eed2 },    // light ink on the dark ground: 2.0, 3.1, 4.3 per cent
};

const mulberry32 = seed => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = bytes => { let c = 0xffffffff; for (const b of bytes) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => {
  const head = Buffer.alloc(8); head.writeUInt32BE(data.length, 0); head.write(type, 4, 'ascii');
  const tail = Buffer.alloc(4); tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, tail]);
};

for (const [name, tile] of Object.entries(TILES)) {
  const random = mulberry32(tile.seed);
  const grid = new Uint8Array(SIZE * SIZE); // 0 = nothing, 1–3 = the levels
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const near = (x > 0 && grid[y * SIZE + x - 1]) || (y > 0 && grid[(y - 1) * SIZE + x]);
    if (random() >= DENSITY * (near ? NEIGHBOUR : 1)) continue;
    const r = random();
    grid[y * SIZE + x] = r < SHARE[0] ? 1 : r < SHARE[0] + SHARE[1] ? 2 : 3;
  }
  const stride = SIZE / 4; // four 2-bit pixels per byte
  const raw = Buffer.alloc(SIZE * (stride + 1));
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) raw[y * (stride + 1) + 1 + (x >> 2)] |= grid[y * SIZE + x] << (6 - 2 * (x & 3));
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(SIZE, 0); ihdr.writeUInt32BE(SIZE, 4); ihdr[8] = 2; ihdr[9] = 3; // 2-bit, indexed
  const plte = Buffer.from([0, 0, 0, ...tile.rgb, ...tile.rgb, ...tile.rgb]);
  const trns = Buffer.from([0, ...tile.alpha]);
  const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('PLTE', plte), chunk('tRNS', trns), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
  const out = new URL(`../public/material/dust-${name}.png`, import.meta.url);
  writeFileSync(out, png);
  const grains = grid.reduce((n, v) => n + (v > 0), 0), mean = grid.reduce((s, v) => s + (v ? tile.alpha[v - 1] : 0), 0) / grid.length / 255;
  console.log(`dust-${name}.png: ${SIZE}², ${(grains / grid.length * 100).toFixed(1)} % of pixels hold a grain, mean coverage ${(mean * 100).toFixed(2)} %, ${png.length} bytes`);
}
