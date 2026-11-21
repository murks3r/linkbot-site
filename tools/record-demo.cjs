/* Records the demo page's walkthrough (src/components/front/Replay.astro): the six steps of a buyer's path, with the
   supplier's yes beside the buyer's, as pictures of the widget and the operator console, and the watch a buyer can set
   when nothing fits yet, from Linkbot Connect's demo stage in its local rehearsal. That rehearsal runs
   the widget, the console and a sample Space API on 127.0.0.1 with fictional data only, and nothing leaves the machine.
   It never points at a space; this script knows no host but 127.0.0.1, and no key.

   In a checkout of murks3r/linkbot-connect (build/vision), as its apps/demo/README.md says:
     pnpm install && pnpm --filter @linkbot-connect/embed build && pnpm --filter @linkbot-connect/console build
     pnpm --filter @linkbot-connect/demo start
   Then, here, one language per fresh start of the stage (its sample API keeps the parties in memory):
     node tools/record-demo.cjs <en|de|es|it|fr>
   The watch's two pictures come from a request alone, so all five languages run on one start of the stage, before any
   offer is made there:
     node tools/record-demo.cjs <en|de|es|it|fr> watch
   The pictures go to public/material/demo/<lang>/. The pane pages speak en and de; for es, it and fr the widget is given
   the language on its host element, and the host page's own label is said in that language. */
const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const [lang, part] = process.argv.slice(2);
if (!['en', 'de', 'es', 'it', 'fr'].includes(lang) || ![undefined, 'watch'].includes(part)) throw new Error('usage: node tools/record-demo.cjs <en|de|es|it|fr> [watch]');
const out = require('path').join(__dirname, '..', 'public', 'material', 'demo', lang);
fs.mkdirSync(out, { recursive: true });
const T = {
  en: { confirmSeeking: 'Confirm my request', confirmOffer: 'Confirm my offer', introYes: 'Yes, introduce us', showFits: 'Show what may fit', approve: 'Approve' },
  de: { confirmSeeking: 'Meine Anfrage bestätigen', confirmOffer: 'Mein Angebot bestätigen', introYes: 'Ja, bitte vorstellen', showFits: 'Zeigen, was passen könnte', approve: 'Freigeben' },
  es: { confirmSeeking: 'Confirmar mi solicitud', confirmOffer: 'Confirmar mi oferta', introYes: 'Sí, preséntennos', showFits: 'Mostrar lo que puede encajar', approve: 'Aprobar' },
  it: { confirmSeeking: 'Conferma la mia richiesta', confirmOffer: 'Conferma la mia offerta', introYes: 'Sì, presentateci', showFits: 'Mostra ciò che potrebbe essere adatto', approve: 'Approva' },
  fr: { confirmSeeking: 'Confirmer ma demande', confirmOffer: 'Confirmer mon offre', introYes: 'Oui, mettez-nous en relation', showFits: 'Afficher ce qui pourrait convenir', approve: 'Approuver' },
}[lang];
// The pane pages speak en and de; for es, it and fr the host page's own label is translated and the widget is given the locale.
const LABEL = { es: 'Datos sintéticos (demo)', it: 'Dati sintetici (demo)', fr: 'Données synthétiques (démo)' };
const VIEW = { width: 640, height: 880 };

async function pane(ctx, port) {
  const p = await ctx.newPage();
  // Before the widget reads its host element: the language, and the host page's own label in that language.
  if (LABEL[lang]) await p.addInitScript(([lang, label]) => {
    new MutationObserver((records, observer) => {
      const host = document.querySelector('[data-linkbot]'), tag = document.querySelector('p.label');
      if (tag && tag.textContent !== label) tag.textContent = label;
      if (host) { host.setAttribute('data-locale', lang); document.documentElement.lang = lang; observer.disconnect(); }
    }).observe(document, { childList: true, subtree: true });
  }, [lang, LABEL[lang]]);
  return p;
}
const url = (port, mode) => `http://127.0.0.1:${port}/?locale=${lang === 'de' ? 'de' : 'en'}${mode ? `&mode=${mode}` : ''}`;

async function fill(p, side) {
  const w = p.locator('[data-linkbot]');
  const c = (k) => w.locator(`[data-criterion="${k}"]`);
  await c('product').locator('input[value="o:rock_phosphate"]').check();
  const seeking = side === 'seeking';
  await c('p2o5').locator('input').nth(0).fill(seeking ? '30' : lang === 'en' ? '30.5' : '30,5');
  if (!seeking) await c('p2o5').locator('input').nth(1).fill(lang === 'en' ? '31.5' : '31,5');
  await c('quantity').locator('input').nth(0).fill('20000');
  await c('quantity').locator('input').nth(1).fill(seeking ? '30000' : '50000');
  if (seeking) {
    await c('incoterm').locator('select').selectOption('o:CFR');
    await c('port').locator('input').click(); await p.keyboard.type('augu'); await p.waitForTimeout(500);
    await p.keyboard.press('ArrowDown'); await p.keyboard.press('Enter');
  } else {
    await c('incoterm').locator('input[value="CFR"]').check();
    await c('port').locator('input[value="ITAUG"]').check();
  }
  await c('window').locator('.lb-quick button').nth(1).click();
  await w.locator('details summary').first().click();
  await c('cadmium').locator('input').nth(1).fill(seeking ? '20' : '15');
  await c('cadmium').locator('select').selectOption({ index: 2 });
  if (seeking) await c('party').locator('input[value="organisation"]').check();
  await c('notice').locator('input[type="checkbox"]').check();
  return w;
}

async function shot(p, name, anchor) {
  if (anchor) await anchor.evaluate((e) => { e.scrollIntoView({ block: 'start' }); window.scrollBy(0, -16); });
  else await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(300);
  const png = await p.screenshot();
  await sharp(png).webp({ quality: 74 }).toFile(`${out}/${name}.webp`);
}

// If nothing fits yet: the buyer's confirmed request, a fictional address that never resolves, a weekly watch on the
// musts with at most five per email, then the watch as it stands. The sample sends no mail, so it waits for the address.
async function watch(ctx) {
  const r = await pane(ctx, 4173); await r.goto(url(4173)); await r.waitForTimeout(800);
  const w = await fill(r, 'seeking');
  await w.getByRole('button', { name: T.confirmSeeking }).click(); await r.waitForTimeout(1000);
  // Until the request has an address, the watch's card asks for one; then it offers the watch.
  const ask = w.locator('section.lb-card', { has: r.locator('input[type="email"]') });
  await ask.locator('input[type="email"]').fill('buyer@example.invalid');
  await ask.locator('button').click(); await r.waitForTimeout(1000);
  const panel = w.locator('[data-section="watch"]');
  await panel.locator('input[value="weekly"]').check();
  await panel.locator('input[value="must_only"]').check();
  await panel.locator('[data-section="digest"] summary').click();
  await panel.locator('[data-section="digest"] select').selectOption('5');
  await shot(r, '7-watch', panel);
  await panel.locator('[data-action="watch"]').click(); await r.waitForTimeout(1200);
  // Set, the watch's card stands where the offer of a watch stood: the card after the criteria.
  await shot(r, '7-watching', w.locator('section.lb-card').nth(1));
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: VIEW, deviceScaleFactor: 1.5, locale: lang, reducedMotion: 'reduce' });
  if (part === 'watch') {
    await watch(ctx);
    console.log(lang, 'watch done');
    return b.close();
  }
  const r = await pane(ctx, 4173); await r.goto(url(4173)); await r.waitForTimeout(800);
  const wr = await fill(r, 'seeking');
  await shot(r, '1-request');
  await wr.getByRole('button', { name: T.confirmSeeking }).click(); await r.waitForTimeout(1000);
  await shot(r, '2-confirmed');
  const s = await pane(ctx, 4175); await s.goto(url(4175)); await s.waitForTimeout(800);
  const ws = await fill(s, 'offer');
  await ws.getByRole('button', { name: T.confirmOffer }).click(); await s.waitForTimeout(1500);
  await r.goto(url(4173, 'mine')); await r.waitForTimeout(1200);
  await wr.getByRole('button', { name: T.showFits }).click(); await r.waitForTimeout(1200);
  await shot(r, '3-fits');
  await wr.getByRole('button', { name: T.introYes }).first().click(); await r.waitForTimeout(1200);
  // The supplier answers the same possible fit from its own side.
  await s.goto(url(4175, 'mine')); await s.waitForTimeout(1200);
  await ws.getByRole('button', { name: T.showFits }).click(); await s.waitForTimeout(1200);
  await ws.getByRole('button', { name: T.introYes }).first().click(); await s.waitForTimeout(1200);
  await shot(s, '4-supplier-yes', ws.locator('[data-match]').first());
  await shot(r, '4-yes', wr.locator('[data-match]').first());
  const c = await ctx.newPage();
  await c.goto('http://127.0.0.1:4174/#/queue'); await c.waitForTimeout(1200);
  await c.locator('header select').selectOption(lang); await c.waitForTimeout(600);
  await c.locator('main a').first().click(); await c.waitForTimeout(1200);
  for (const sel of ['[data-party-gate="need_side"]', '[data-party-gate="offer_side"]', '[data-gate="kyc_sanctions_check"]']) {
    const g = c.locator(sel), passed = g.locator('input[value="passed"]');
    // A check the sample case already holds sits behind "Record another check": leave it as recorded.
    if (!(await passed.isVisible())) continue;
    await passed.check(); await g.locator('button').last().click(); await c.waitForTimeout(800);
  }
  await c.getByRole('button', { name: T.approve, exact: true }).click();
  await c.waitForTimeout(1200);
  await shot(c, '5-approved', c.locator('[data-party-gate="need_side"]'));
  await r.goto(url(4173, 'mine')); await r.waitForTimeout(1500);
  await shot(r, '6-introduced');
  // The console's list of introductions, as the platform's team sees it.
  await c.goto('http://127.0.0.1:4174/#/introductions'); await c.waitForTimeout(1200);
  await shot(c, '6-console');
  console.log(lang, 'done', fs.readdirSync(out).join(' '));
  await b.close();
})();
