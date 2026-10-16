/* Bakes the Begegnung illustration (art/scene.svg) into the images the page composites.

     node src/components/directions/begegnung/art/bake.mjs        (from the site's root; Playwright from devDependencies)

   For every <g data-layer> of the drawing: rendered alone in headless Chromium, cropped to its own
   painted pixels, encoded as WebP (Chromium's encoder) at two resolutions, written to
   public/directions/begegnung/<layer>-1x.webp and -15x.webp. 1× is the stage's size on a 1440 px
   screen (0.84 px per drawing unit; phones use it too, about 1.7 device px per CSS px on a 390 px
   phone), 1.5× is for dense wide screens. Soft layers (data-k, the veil and the halo) are baked at
   that fraction of the resolution: they are blurred by nature. art/layers.json records each layer's box in
   drawing units and its files' sizes. Also five finished pictures, one per station, for browsers
   without scripts (<noscript>), at 1×.

   The drawing uses the site's own Figtree (from node_modules). No third-party art. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LAYERS, STATIONS, value } from '../scene.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../..');
const out = path.join(root, 'public/directions/begegnung');
const svg = fs.readFileSync(path.join(here, 'scene.svg'), 'utf8');
const font = path.join(root, 'node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2');
const SCALES = { '1x': .84, '15x': 1.26 };
const Q = Number(process.env.Q || .72);
const W = 1900, H = 760; // the drawing plus the sleeves' run to the right

const page_html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Figtree Variable'; src: url('data:font/woff2;base64,${fs.readFileSync(font).toString('base64')}') format('woff2'); font-weight: 300 900; }
html, body { margin: 0; background: transparent; } svg { display: block; }
</style></head><body>${svg.replace('viewBox="0 0 900 760"', `viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" id="art"`)}</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
await page.setContent(page_html);
await page.evaluate(() => document.fonts.ready);

/** Render at `scale` px per unit; returns the PNG of `clip` (units). */
async function render(scale, clip, prepare) {
  await page.setViewportSize({ width: Math.ceil(W * scale), height: Math.ceil(H * scale) });
  await page.evaluate(([scale, W, H]) => { const s = document.getElementById('art'); s.setAttribute('width', W * scale); s.setAttribute('height', H * scale); }, [scale, W, H]);
  await page.evaluate(prepare.fn, prepare.arg);
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  return page.screenshot({ omitBackground: true, clip: { x: clip.x * scale, y: clip.y * scale, width: clip.w * scale, height: clip.h * scale } });
}
/** In the page: the painted bounds of a PNG (alpha > 1), and the WebP of it (optionally cropped). */
const inPage = (png, op) => page.evaluate(async ([src, op, Q]) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + src; await img.decode();
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  if (op === 'bounds') {
    const d = g.getImageData(0, 0, c.width, c.height).data; let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3] > 1) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return { x0, y0, x1, y1, w: c.width, h: c.height };
  }
  const blob = await new Promise(r => c.toBlob(r, 'image/webp', Q));
  const b = new Uint8Array(await blob.arrayBuffer()); let s = ''; for (let i = 0; i < b.length; i += 32768) s += String.fromCharCode(...b.subarray(i, i + 32768));
  return { b64: btoa(s), w: c.width, h: c.height };
}, [png.toString('base64'), op, Q]);

const only = id => ({ fn: id => { for (const g of document.querySelectorAll('[data-layer]')) { g.style.visibility = g.dataset.layer === id ? 'visible' : 'hidden'; g.style.transform = ''; } }, arg: id });

fs.mkdirSync(out, { recursive: true });
// ONLY=a,b rebakes just those layers (the rest is kept from layers.json); the stills are always rebaked.
const only_ids = (process.env.ONLY || '').split(',').filter(Boolean);
const previous = only_ids.length ? JSON.parse(fs.readFileSync(path.join(here, 'layers.json'), 'utf8')) : null;
const boxes = {}, files = {};
let total = { '1x': 0, '15x': 0 };
const ids = await page.evaluate(() => [...document.querySelectorAll('[data-layer]')].map(g => ({ id: g.dataset.layer, k: Number(g.dataset.k || 1) })));
for (const { id, k } of ids) {
  if (previous && !only_ids.includes(id) && previous.boxes[id]) { boxes[id] = previous.boxes[id]; files[id] = previous.files[id]; total['1x'] += files[id]['1x'].bytes; total['15x'] += files[id]['15x'].bytes; continue; }
  // 1. Find the painted pixels at the finer scale, over a generous crop around the geometry.
  const bb = await page.evaluate(id => { const b = document.querySelector(`[data-layer="${id}"]`).getBBox(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }, id);
  const pad = k < 1 ? 110 : 60;
  const wide = { x: Math.max(0, bb.x - pad), y: Math.max(0, bb.y - pad) };
  wide.w = Math.min(W, bb.x + bb.w + pad) - wide.x; wide.h = Math.min(H, bb.y + bb.h + pad) - wide.y;
  const fine = SCALES['15x'];
  const bounds = await inPage(await render(fine, wide, only(id)), 'bounds');
  if (bounds.x1 < 0) throw Error(`layer ${id} paints nothing`);
  const u = n => Math.round(n * 2) / 2; // half units
  const box = { x: u(wide.x + bounds.x0 / fine - 1), y: u(wide.y + bounds.y0 / fine - 1) };
  box.w = u(wide.x + (bounds.x1 + 1) / fine + 1) - box.x; box.h = u(wide.y + (bounds.y1 + 1) / fine + 1) - box.y;
  boxes[id] = box; files[id] = {};
  // 2. Bake that box at each resolution.
  for (const [name, scale] of Object.entries(SCALES)) {
    const webp = await inPage(await render(scale * k, box, only(id)), 'webp');
    const file = `${id}-${name}.webp`;
    fs.writeFileSync(path.join(out, file), Buffer.from(webp.b64, 'base64'));
    files[id][name] = { file, w: webp.w, h: webp.h, bytes: fs.statSync(path.join(out, file)).size };
    total[name] += files[id][name].bytes;
  }
  console.log(id.padEnd(16), JSON.stringify(box), files[id]['1x'].bytes, files[id]['15x'].bytes);
}

// 3. The five finished pictures, for browsers without scripts: every layer at its station's state.
const stills = {};
for (const k of STATIONS) {
  const states = Object.fromEntries(LAYERS.map(p => [p.id, value(p, k)]));
  const prepare = { fn: ([states, origins]) => { for (const g of document.querySelectorAll('[data-layer]')) { const v = states[g.dataset.layer]; g.style.visibility = v && v.o > .001 ? 'visible' : 'hidden'; g.style.opacity = v ? v.o : 0;
    const o = origins[g.dataset.layer]; g.style.transformBox = 'view-box'; g.style.transformOrigin = o ? `${o[0]}px ${o[1]}px` : '0 0'; g.style.transform = v ? `translate(${v.x}px, ${v.y}px) rotate(${v.r}deg) scale(${v.s})` : ''; } },
    arg: [states, Object.fromEntries(LAYERS.filter(p => p.origin).map(p => [p.id, p.origin]))] };
  const webp = await inPage(await render(SCALES['1x'], { x: 0, y: 0, w: 900, h: 760 }, prepare), 'webp');
  const file = `station-${k}-1x.webp`;
  fs.writeFileSync(path.join(out, file), Buffer.from(webp.b64, 'base64'));
  stills[k] = { file, w: webp.w, h: webp.h, bytes: fs.statSync(path.join(out, file)).size };
}
await page.evaluate(() => { for (const g of document.querySelectorAll('[data-layer]')) { g.style.cssText = ''; } });
await browser.close();

const report = { quality: Q, scales: SCALES, total_bytes: total, boxes, files, stills };
fs.writeFileSync(path.join(here, 'layers.json'), JSON.stringify(report, null, 1) + '\n');
console.log('total', total, 'stills', Object.values(stills).reduce((s, x) => s + x.bytes, 0));
