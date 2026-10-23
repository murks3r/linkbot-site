/* Renders public/og.png (1200×630), the link preview image, from the site's own palette and
   typefaces (Concept A4: green ink on warm paper, the headline set expanded, emphasis by tone).
   Re-run after a brand change: node scripts/og.cjs */
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');
// Embedded, not linked: a page set from a string cannot load file:// fonts, and a missing font
// would silently fall back to a serif.
const file = name => 'data:font/woff2;base64,' + fs.readFileSync(path.join(__dirname, '../node_modules/@fontsource-variable', name)).toString('base64');
const html = `<!doctype html><html><head><style>
@font-face{font-family:D;src:url(${file('archivo/files/archivo-latin-wdth-normal.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:T;src:url(${file('figtree/files/figtree-latin-wght-normal.woff2')}) format('woff2');font-weight:300 900}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#fbf8f1;color:#123a2c;font-family:T;padding:72px 84px;display:grid;grid-template-rows:auto 1fr auto}
.brand{font-family:D;font-stretch:112%;font-size:38px;font-weight:600;letter-spacing:-.03em}
h1{align-self:center;font-family:D;font-stretch:112%;font-size:96px;font-weight:460;letter-spacing:-.035em;line-height:1}
h1 span{display:block;font-weight:300;color:#37584c}
p{display:flex;align-items:center;gap:18px;font-size:28px;color:#37584c}
p i{display:inline-block;width:14px;height:14px;border-radius:50%;background:#ff9dbb}
</style></head><body><div class="brand">Linkbot</div><h1>Find work that fits.<span>Keep your privacy.</span></h1><p><i></i>Say what matters in a few words. No account, no public profile.</p></body></html>`;
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family));
  if (!loaded.includes('D') || !loaded.includes('T')) throw Error(`fonts did not load: ${loaded}`);
  await page.screenshot({ path: path.join(__dirname, '../public/og.png') });
  await browser.close();
  console.log('wrote public/og.png');
})();
