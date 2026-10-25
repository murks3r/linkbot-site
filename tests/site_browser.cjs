/* Browser acceptance for the public site, against the built dist (npm run build first).

   Serves dist with clean URLs. The WCAG checks are the app's own (murks3r/linkbot
   tests/frontend/quality_audit.cjs: accessibility tree, contrast over the effective background,
   target sizes, keyboard order and focus indicators, text spacing, label-in-name), so the site and
   the product are held to one standard. LINKBOT_APP_DIR points at an app checkout (default
   ../linkbot); without it the run fails rather than skipping.

     npm run build && LINKBOT_APP_DIR=../linkbot node tests/site_browser.cjs */
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const DIST = path.join(__dirname, '../dist');
const APP_DIR = path.resolve(process.env.LINKBOT_APP_DIR ?? path.join(__dirname, '../../linkbot'));
const AUDIT = path.join(APP_DIR, 'tests/frontend/quality_audit.cjs');
if (!fs.existsSync(AUDIT)) throw Error(`the app's accessibility audit is required: set LINKBOT_APP_DIR (looked for ${AUDIT})`);
const { colorKit, focusKit, pageAudit, treeFindings, keyboardFindings, textSpacingFindings, labelInName } = require(AUDIT);
if (!fs.existsSync(path.join(DIST, 'index.html'))) throw Error('build the site first (npm run build)');

const LANGS = ['en', 'de', 'es', 'it', 'fr'];
const ALL_PAGES = ['/', '/how-it-works', '/demo', '/for-platforms', '/developers', '/status', '/changelog', '/who-sees-what', '/platforms', '/platforms/embed', '/platforms/sdk', '/platforms/console', '/platforms/wordpress', '/platforms/nextjs', '/platforms/astro', '/verticals', '/privacy', '/imprint'];
/* SITE_PAGES=/,/demo runs the page checks for a subset only (a targeted pass between milestones); the journeys still run. */
const PAGES = process.env.SITE_PAGES ? process.env.SITE_PAGES.split(',') : ALL_PAGES;
const WIDTHS = [1440, 1024, 768, 390, 320];
/* SITE_SCHEME=dark runs every page in the dark palette. Light is the default for everyone (third pass, GEO-188): the
   page does not follow the system's scheme, so the dark run opens each page with the preview's ?theme=dark (and a dark
   system, which must not matter); the audit measures the computed colours either way. */
const SCHEME = process.env.SITE_SCHEME === 'dark' ? 'dark' : 'light';
const SWITCH = SCHEME === 'dark' ? '?theme=dark' : '';
const HEIGHTS = { 1440: 900, 1024: 768, 768: 1024, 390: 844, 320: 720 };
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
const FORBIDDEN = {
  en: /\b(verified|live|automated|anonymous|real-time|stays private)\b/i,
  de: /\b(verifiziert|live|automatisch|anonym|echtzeit|bleibt privat)\b/i,
  es: /\b(verificad\w*|en vivo|en directo|automatizad\w*|anónim\w*|tiempo real)\b/i,
  it: /\b(verificat\w*|dal vivo|live|automatizzat\w*|anonim\w*|tempo reale)\b/i,
  fr: /\b(vérifié\w*|en direct|live|automatisé\w*|anonym\w*|temps réel)\b/i,
};
const pathFor = (lang, page) => (lang === 'en' ? page : `/${lang}${page === '/' ? '' : page}`);

function serve() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://local');
    const clean = url.pathname === '/' ? '/index.html' : path.extname(url.pathname) ? url.pathname : `${url.pathname}.html`;
    const file = path.join(DIST, clean);
    if (!file.startsWith(DIST) || !fs.existsSync(file)) {
      res.writeHead(404, { 'Content-Type': TYPES['.html'] }); return res.end(fs.readFileSync(path.join(DIST, '404.html')));
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    res.end(fs.readFileSync(file));
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve({ server, origin: `http://127.0.0.1:${server.address().port}` })));
}

function motionRecorder() {
  window.__motion = [];
  const note = (kind, target) => window.__motion.push(`${kind} on ${target?.localName ?? '?'}${target?.classList?.length ? '.' + [...target.classList].join('.') : ''}`);
  document.addEventListener('animationstart', event => note(`animation ${event.animationName}`, event.target), true);
  document.addEventListener('transitionrun', event => note(`transition ${event.propertyName}`, event.target), true);
}

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

(async () => {
  const { server, origin } = await serve();
  const browser = await chromium.launch();
  const report = { pages: 0, audits: 0 };
  try {
    // ── 1. Every page in every language: metadata, one h1, the alternates, no third-party requests,
    //       no errors, no motion under reduced motion, reflow and the app's WCAG audit. ──
    for (const lang of LANGS) {
      const titles = new Set();
      for (const page of PAGES) {
        const route = pathFor(lang, page);
        const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', colorScheme: SCHEME });
        await context.addInitScript(motionRecorder); await context.addInitScript(colorKit); await context.addInitScript(focusKit);
        const tab = await context.newPage();
        const errors = [], foreign = [];
        tab.on('pageerror', e => errors.push(e.message));
        tab.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
        tab.on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:')) foreign.push(r.url()); });
        const response = await tab.goto(origin + route + SWITCH, { waitUntil: 'networkidle' });
        check(response.status() === 200, `${route}: status ${response.status()}`);
        await tab.evaluate(() => document.fonts.ready);
        const meta = await tab.evaluate(() => ({
          lang: document.documentElement.lang, title: document.title, h1: document.querySelectorAll('h1').length,
          description: document.querySelector('meta[name="description"]')?.content ?? '',
          canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
          alternates: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(l => l.hreflang),
          og: ['og:title', 'og:description', 'og:image', 'og:url', 'og:locale'].map(p => document.querySelector(`meta[property="${p}"]`)?.content ?? ''),
          ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)),
          robots: document.querySelector('meta[name="robots"]')?.content ?? null,
          fallback: document.querySelector('.fallback')?.textContent.trim() ?? '',
          current: document.querySelector('#lang-menu a[aria-current]')?.getAttribute('lang') ?? '',
          ids: [...document.querySelectorAll('[id]')].map(e => e.id),
          anchors: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(Boolean),
          links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')),
          // The page's prose without its code: an identifier such as channel.verified is not a claim.
          text: (() => { const main = document.querySelector('main').cloneNode(true); main.querySelectorAll('code').forEach(c => c.remove()); return main.innerText; })(),
        }));
        const own = meta.lang === lang;
        check(own || meta.lang === 'en', `${route}: lang ${meta.lang}`);
        check(own ? meta.fallback === '' : meta.fallback.length > 10, `${route}: the fallback notice exactly when English stands in (${meta.fallback})`);
        check(meta.current === lang, `${route}: the language menu marks ${lang} (${meta.current})`);
        check(meta.h1 === 1, `${route}: ${meta.h1} h1 elements`);
        check(meta.title && !titles.has(meta.title), `${route}: title missing or repeated (${meta.title})`); titles.add(meta.title);
        check(meta.description.length >= 50 && meta.description.length <= 160, `${route}: description length ${meta.description.length}`);
        check(/^https:\/\//.test(meta.canonical) && new URL(meta.canonical).pathname === route, `${route}: canonical ${meta.canonical}`);
        check(LANGS.every(l => meta.alternates.includes(l)) && meta.alternates.includes('x-default'), `${route}: alternates ${meta.alternates.join(',')}`);
        check(meta.og.every(Boolean), `${route}: Open Graph incomplete`);
        if (page === '/') check(meta.ld.flat().some(x => x['@type'] === 'Organization') && !JSON.stringify(meta.ld).match(/legalName|foundingDate|address/), `${route}: organisation data must be present and limited to verifiable facts`);
        else check(meta.ld.some(x => x['@type'] === 'BreadcrumbList'), `${route}: breadcrumb data missing`);
        check(meta.robots === null, `${route}: robots ${meta.robots} in a production build`);
        for (const id of meta.anchors) check(meta.ids.includes(id), `${route}: in-page link #${id} has no target`);
        check(foreign.length === 0, `${route}: third-party requests ${foreign.join(', ')}`);
        if (FORBIDDEN[meta.lang]) check(!FORBIDDEN[meta.lang].test(meta.text), `${route}: a forbidden claim word on the page (${meta.text.match(FORBIDDEN[meta.lang])?.[0]})`);
        // Reflow at every width for English, at the two audit widths for the other languages; then
        // the app's WCAG audit at 1440 and 390 (as its quality gate does).
        const cdp = await context.newCDPSession(tab);
        await cdp.send('DOM.enable'); await cdp.send('Accessibility.enable');
        for (const width of lang === 'en' ? WIDTHS : [1440, 390]) {
          await tab.setViewportSize({ width, height: HEIGHTS[width] });
          await tab.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
          const audit = await tab.evaluate(pageAudit, { modal: false, touch: width === 390 });
          const found = [...audit.contrast.failures, ...audit.target.failures, ...audit.target.touchFailures, ...audit.animations.map(detail => ({ rule: 'reduced-motion', detail }))];
          if (audit.overflow.scrollWidth > audit.overflow.clientWidth) found.push({ rule: 'reflow', detail: `${audit.overflow.scrollWidth} > ${audit.overflow.clientWidth}` });
          if (width === 1440 || width === 390) {
            const tree = await treeFindings(cdp, { modal: false });
            found.push(...tree.failures, ...await labelInName(cdp, { modal: false }), ...await tab.evaluate(textSpacingFindings));
            const keys = await keyboardFindings(tab, { modal: false, max: 400 });
            found.push(...keys.failures);
            report.audits += 1;
          }
          for (const f of found) failures.push(`${route}@${width}: ${f.rule}: ${f.detail ?? ''} ${f.node ?? ''}`.trim());
        }
        const motion = await tab.evaluate(() => window.__motion.splice(0));
        check(motion.length === 0, `${route}: motion under reduced motion: ${motion.slice(0, 3).join('; ')}`);
        check(errors.length === 0, `${route}: errors ${errors.join(' | ')}`);
        // Every same-site link resolves.
        for (const href of new Set(meta.links.filter(h => h.startsWith('/')))) {
          const status = await tab.request.get(origin + href.split('#')[0]).then(r => r.status());
          check(status === 200, `${route}: link ${href} → ${status}`);
        }
        report.pages += 1;
        await context.close();
      }
    }

    // ── 2. Journeys: the language switch, the table of contents, the phone menu. ──
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
      const tab = await context.newPage();
      await tab.goto(origin + '/', { waitUntil: 'networkidle' });
      // The language lives in one floating button (third pass): not in the masthead, not in the footer.
      check(await tab.evaluate(() => !document.querySelector('header .menu-lang, header a[hreflang], footer nav:not(#lang-menu) a[hreflang]')), 'language: no list in the masthead or the footer');
      await tab.click('[data-lang-button]');
      await tab.click('#lang-menu a[lang="de"]');
      await tab.waitForLoadState('networkidle');
      check(new URL(tab.url()).pathname === '/de' && await tab.evaluate(() => document.documentElement.lang) === 'de', `language switch: ${tab.url()}`);
      await tab.goto(origin + '/de/how-it-works', { waitUntil: 'networkidle' });
      // By keyboard: Enter opens it on the current language, the arrows move, Escape closes it and focus returns.
      await tab.focus('[data-lang-button]');
      await tab.keyboard.press('Enter');
      await tab.waitForFunction(() => document.activeElement?.closest('#lang-menu'));
      check(await tab.getAttribute('[data-lang-button]', 'aria-expanded') === 'true' && await tab.evaluate(() => document.activeElement.getAttribute('lang')) === 'de', 'language: Enter opens the list on the current language');
      await tab.keyboard.press('ArrowUp');
      check(await tab.evaluate(() => document.activeElement.getAttribute('lang')) === 'en', 'language: the arrow keys move between languages');
      await tab.keyboard.press('Escape');
      await tab.waitForFunction(() => document.activeElement?.hasAttribute('data-lang-button'));
      check(await tab.getAttribute('[data-lang-button]', 'aria-expanded') === 'false', 'language: Escape closes the list and focus returns to the button');
      await tab.click('[data-lang-button]');
      await tab.click('#lang-menu a[lang="en"]');
      await tab.waitForLoadState('networkidle');
      check(new URL(tab.url()).pathname === '/how-it-works', `language switch keeps the page: ${tab.url()}`);
      // The table of contents: a click lands on the section's heading, with the anchor in the address.
      await tab.click('[data-toc-link][href="#matching"]');
      await tab.waitForFunction(() => location.hash === '#matching');
      check(await tab.evaluate(() => document.activeElement?.id) === 'matching-title', 'table of contents: focus lands on the heading');
      check(await tab.evaluate(() => document.querySelector('[data-toc-link][href="#matching"]')?.getAttribute('aria-current')) === 'true', 'table of contents: the section in view is marked');
      // The phone menu opens, lists the three pages, and closes on Escape.
      await tab.setViewportSize({ width: 390, height: 844 });
      await tab.goto(origin + '/', { waitUntil: 'networkidle' });
      check(await tab.isVisible('.menu-main summary'), 'phone: the menu is offered');
      await tab.click('.menu-main summary');
      check(await tab.evaluate(() => [...document.querySelectorAll('.menu-main .menu-panel a')].filter(a => a.offsetParent !== null).length) === 5, 'phone: the menu lists the five pages');
      await tab.keyboard.press('Escape');
      check(await tab.evaluate(() => !document.querySelector('.menu-main').open), 'phone: Escape closes the menu');
      // On a phone the language button stays clear of the safe margin and of the ask button.
      const lang = await tab.evaluate(() => { const a = document.querySelector('[data-lang-button]').getBoundingClientRect(), b = document.querySelector('.ask-field .btn').getBoundingClientRect(); return { inside: a.right <= innerWidth - 16 && a.bottom <= innerHeight - 16, over: a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top }; });
      check(lang.inside && !lang.over, `phone: the language button is clear of the edges and of the ask button (${JSON.stringify(lang)})`);
      // The 404 page is served for an unknown address and offers every language.
      const missing = await tab.goto(origin + '/nothing-here', { waitUntil: 'networkidle' });
      check(missing.status() === 404 && await tab.evaluate(() => document.querySelectorAll('.nf-langs a').length) === 5, '404: served with the five languages');
      await context.close();
    }

    // ── 3. Motion and scheme (third pass): light for everyone; the Venn runs by itself, loops, pauses off-screen and on
    //       its control; no play-again button anywhere. ──
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
      const tab = await context.newPage();
      await tab.goto(origin + '/', { waitUntil: 'networkidle' });
      check(await tab.evaluate(() => getComputedStyle(document.body).backgroundColor) === 'rgb(244, 244, 241)', 'scheme: a dark system still gets the light page');
      check(await tab.evaluate(() => !document.querySelector('[data-venn-replay], [data-replay]')), 'motion: no play-again button');
      const venn = () => tab.evaluate(() => document.querySelector('[data-disc="need"]').getAttribute('transform') + [...document.querySelectorAll('[data-mark]')].map(m => m.style.opacity).join());
      const seen = new Set();
      for (let i = 0; i < 24; i++) { seen.add(await venn()); await tab.waitForTimeout(500); }
      check(seen.size > 12, `motion: the Venn runs by itself (${seen.size} distinct frames in 12 s)`);
      await tab.evaluate(() => scrollTo(0, document.body.scrollHeight));
      await tab.waitForTimeout(300);
      const away = await venn(); await tab.waitForTimeout(800);
      check(away === await venn(), 'motion: off-screen the Venn pauses');
      await tab.evaluate(() => scrollTo(0, 0));
      await tab.click('[data-motion-toggle]');
      const held = await venn(); await tab.waitForTimeout(800);
      check(held === await venn() && await tab.getAttribute('[data-motion-toggle]', 'aria-pressed') === 'true', 'motion: the control pauses the Venn');
      // On a phone the language button steps aside while a control (here the Venn's) passes beneath it.
      await tab.setViewportSize({ width: 390, height: 844 });
      await tab.evaluate(() => { const b = document.querySelector('[data-lang-button]').getBoundingClientRect(), c = document.querySelector('[data-motion-toggle]').getBoundingClientRect(); scrollBy(0, (c.top + c.height / 2) - (b.top + b.height / 2)); });
      await tab.waitForTimeout(150);
      check(await tab.evaluate(() => document.querySelector('[data-lang]').hasAttribute('data-yield')), 'phone: the language button steps aside over a control');
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  if (failures.length) { console.error(`${failures.length} failure(s):\n` + failures.map(f => `  ${f}`).join('\n')); process.exit(1); }
  console.log(`site browser acceptance (${SCHEME}): ${report.pages} pages (${LANGS.length} languages), ${report.audits} WCAG audits, journeys language button, table of contents, phone menu, 404, motion and scheme; ok`);
})().catch(error => { console.error(error); process.exit(1); });
