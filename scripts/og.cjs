/* Renders public/og.png (1200×630), the link preview image, from the site's own palette and
   typeface. Re-run after a brand change: node scripts/og.cjs */
const { chromium } = require('playwright');
const path = require('node:path');
const font = 'file://' + path.join(__dirname, '../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wdth-normal.woff2');
const html = `<!doctype html><html><head><style>
@font-face{font-family:IS;src:url(${font}) format('woff2');font-weight:400 700;font-stretch:75% 100%}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#fff;color:#121a33;font-family:IS;padding:72px 80px;display:grid;grid-template-rows:auto 1fr auto}
.brand{font-size:40px;font-weight:700;letter-spacing:-.035em}.brand span{background:linear-gradient(transparent 54%,#ffdd57 54% 94%,transparent 94%);padding:0 3px}
h1{align-self:center;font-size:104px;font-weight:640;letter-spacing:-.045em;line-height:.98}
h1 span{background:linear-gradient(transparent 56%,#ffdd57 56% 92%,transparent 92%)}
p{font-size:30px;color:#464c60;letter-spacing:-.01em}
</style></head><body><div class="brand"><span>Linkbot</span></div><h1>Say <span>what matters</span>.<br>See what fits.</h1><p>Private job search in your own words. No account, no public profile.</p></body></html>`;
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(__dirname, '../public/og.png') });
  await browser.close();
  console.log('wrote public/og.png');
})();
