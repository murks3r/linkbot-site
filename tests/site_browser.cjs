/* Browser acceptance for the public site, against the built dist (npm run build first).

   Serves dist with clean URLs and a stand-in for the app at /talent that only shows the address
   it was opened with, so the handoff can be checked without the app. The WCAG checks are the
   app's own (murks3r/linkbot tests/frontend/quality_audit.cjs: accessibility tree, contrast over
   the effective background, target sizes, keyboard order and focus indicators, text spacing,
   label-in-name), so the site and the product are held to one standard. LINKBOT_APP_DIR points
   at an app checkout (default ../linkbot); without it the run fails rather than skipping.

     npm run build && LINKBOT_APP_DIR=../linkbot node tests/site_browser.cjs */
const assert = require('node:assert/strict');
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

const PAGES = ['/', '/how-it-works', '/privacy', '/hiring'];
const WIDTHS = [1440, 1024, 768, 390, 320];
const HEIGHTS = { 1440: 900, 1024: 768, 768: 1024, 390: 844, 320: 720 };
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };

function serve() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://local');
    if (url.pathname === '/talent' || url.pathname.startsWith('/talent/')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<!doctype html><html lang="en"><title>App stand-in · Linkbot</title><main><h1>App stand-in</h1><p id="hash"></p></main><script>document.getElementById("hash").textContent=location.hash</script></html>');
    }
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
  const report = { pages: {}, audit: {}, journeys: {} };
  try {
    // ── 1. Every page: metadata, one h1, no third-party requests, no errors, reflow at 5 widths ──
    const titles = new Set(), descriptions = new Set();
    for (const route of PAGES) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
      await context.addInitScript(motionRecorder); await context.addInitScript(colorKit); await context.addInitScript(focusKit);
      const page = await context.newPage();
      const errors = [], foreign = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:')) foreign.push(r.url()); });
      const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
      check(response.status() === 200, `${route}: status ${response.status()}`);
      await page.evaluate(() => document.fonts.ready);
      const meta = await page.evaluate(() => ({
        lang: document.documentElement.lang, title: document.title, h1: document.querySelectorAll('h1').length,
        description: document.querySelector('meta[name="description"]')?.content ?? '',
        canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
        og: ['og:title', 'og:description', 'og:image', 'og:url'].map(p => document.querySelector(`meta[property="${p}"]`)?.content ?? ''),
        ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)),
        robots: document.querySelector('meta[name="robots"]')?.content ?? null,
        ids: [...document.querySelectorAll('[id]')].map(e => e.id),
        anchors: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(Boolean),
        links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')),
      }));
      check(meta.lang === 'en', `${route}: lang ${meta.lang}`);
      check(meta.h1 === 1, `${route}: ${meta.h1} h1 elements`);
      check(meta.title && !titles.has(meta.title), `${route}: title missing or repeated (${meta.title})`); titles.add(meta.title);
      check(meta.description.length >= 70 && meta.description.length <= 160 && !descriptions.has(meta.description), `${route}: description length ${meta.description.length} or repeated`); descriptions.add(meta.description);
      check(/^https:\/\//.test(meta.canonical), `${route}: canonical ${meta.canonical}`);
      check(meta.og.every(Boolean), `${route}: Open Graph incomplete`);
      if (route === '/') check(meta.ld.flat().some(x => x['@type'] === 'Organization') && !JSON.stringify(meta.ld).match(/legalName|foundingDate|address/), `/: organisation data must be present and limited to verifiable facts`);
      else check(meta.ld.some(x => x['@type'] === 'BreadcrumbList'), `${route}: breadcrumb data missing`);
      for (const id of meta.anchors) check(meta.ids.includes(id), `${route}: in-page link #${id} has no target`);
      check(foreign.length === 0, `${route}: third-party requests ${foreign.join(', ')}`);
      // Emphasis is weight, scale and tone. No highlighter, marker or painted underline anywhere:
      // the only gradients are the atmosphere's (layers that carry no text of their own, marked
      // data-decor), and no <mark> has a fill.
      const markers = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => {
        const s = getComputedStyle(e);
        const text = [...e.childNodes].some(n => n.nodeType === Node.TEXT_NODE && /\S/.test(n.data));
        return (/gradient\(/.test(s.backgroundImage) && (text || !e.closest('.air, [data-decor]'))) || (e.localName === 'mark' && s.backgroundColor !== 'rgba(0, 0, 0, 0)');
      }).map(e => `${e.localName}.${[...e.classList].join('.')}`));
      check(markers.length === 0, `${route}: marker treatment on ${markers.slice(0, 4).join(', ')}`);
      // Reflow at every width, then the app's WCAG audit at 1440 and 390 (as its quality gate does).
      const cdp = await context.newCDPSession(page);
      await cdp.send('DOM.enable'); await cdp.send('Accessibility.enable');
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: HEIGHTS[width] });
        await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
        // Purely decorative text (the field of openings, aria-hidden) is exempt from 1.4.3 and 1.4.12;
        // it is hidden while the audit measures the page's real text, then restored.
        await page.evaluate(() => document.querySelectorAll('[aria-hidden="true"]:not(.icon):not(.mark)').forEach(e => { e.dataset.qaHidden = e.style.visibility; e.style.visibility = 'hidden'; }));
        const audit = await page.evaluate(pageAudit, { modal: false, touch: width === 390 });
        const found = [...audit.contrast.failures, ...audit.target.failures, ...audit.target.touchFailures, ...audit.animations.map(detail => ({ rule: 'reduced-motion', detail }))];
        if (audit.overflow.scrollWidth > audit.overflow.clientWidth) found.push({ rule: 'reflow', detail: `${audit.overflow.scrollWidth} > ${audit.overflow.clientWidth}` });
        if (width === 1440 || width === 390) {
          const tree = await treeFindings(cdp, { modal: false });
          found.push(...tree.failures, ...await labelInName(cdp, { modal: false }), ...await page.evaluate(textSpacingFindings));
          const keys = await keyboardFindings(page, { modal: false, max: 400 });
          found.push(...keys.failures);
          report.audit[`${route}@${width}`] = { contrastChecked: audit.contrast.checked, worstContrast: audit.contrast.worst, targetsChecked: audit.target.checked,
            headings: tree.headings, landmarks: tree.landmarks, tabStops: keys.forward.length };
        }
        await page.evaluate(() => document.querySelectorAll('[data-qa-hidden]').forEach(e => { e.style.visibility = e.dataset.qaHidden; delete e.dataset.qaHidden; }));
        for (const f of found) failures.push(`${route}@${width}: ${f.rule}: ${f.detail ?? ''} ${f.node ?? ''}`.trim());
      }
      const motion = await page.evaluate(() => window.__motion.splice(0));
      check(motion.length === 0, `${route}: motion under reduced motion: ${motion.slice(0, 3).join('; ')}`);
      check(errors.length === 0, `${route}: errors ${errors.join(' | ')}`);
      report.pages[route] = { title: meta.title, links: meta.links.length };
      // Every same-site link resolves.
      for (const href of new Set(meta.links.filter(h => h.startsWith('/') && !h.startsWith('/talent')))) {
        const status = await page.request.get(origin + href.split('#')[0]).then(r => r.status());
        check(status === 200, `${route}: link ${href} → ${status}`);
      }
      await context.close();
    }

    // ── 2. The composition (Concept A7; the ground's layers of A9): the search at the centre of
    //       the opening viewport, the criteria people give Linkbot around it, one bright living
    //       world with a real paper grain beneath all content, then the story as the product works
    //       (Signal), privacy in the same light (Yours), the invitation. ──
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto(origin + '/', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      for (const width of [1440, 1024, 390, 320]) {
        await page.setViewportSize({ width, height: HEIGHTS[width] });
        await page.evaluate(() => { scrollTo(0, 0); return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); });
        const hero = await page.evaluate(() => {
          const box = el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, mid: (r.left + r.right) / 2, midY: (r.top + r.bottom) / 2, width: r.width, height: r.height }; };
          const h1 = document.querySelector('.hero h1'), field = document.querySelector('.hero .search-box'), btn = document.querySelector('.hero .btn-primary');
          const input = document.getElementById('q-hero'), fieldBox = () => (innerWidth <= 480 ? input.closest('.search-field') : field);
          const lines = [...h1.querySelectorAll('.h1-line')].map(l => { const s = getComputedStyle(l); return { weight: s.fontWeight, color: s.color, size: s.fontSize, stretch: s.fontStretch }; });
          const focal = [...document.querySelector('.hero-focal').children], h = h1.getBoundingClientRect();
          const fills = [...document.querySelectorAll('.hero a, .hero button')].filter(e => getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)').map(e => e.innerText.trim());
          const promises = [...document.querySelectorAll('.hero .promises li')];
          const chips = [...document.querySelectorAll('.halo-chip')].filter(c => getComputedStyle(c).display !== 'none').map(c => ({ text: c.innerText.replace(/\s+/g, ' ').trim(), level: c.dataset.level, ...box(c.querySelector('i')) }));
          return { vw: innerWidth, vh: innerHeight, header: document.querySelector('[data-masthead]').getBoundingClientRect().bottom, h1: box(h1), field: box(field), input: box(fieldBox()), btn: box(btn),
            align: getComputedStyle(h1).textAlign, h1Size: parseFloat(getComputedStyle(h1).fontSize), lines,
            beside: focal.filter(e => { const r = e.getBoundingClientRect(); return e !== h1 && r.bottom > h.top + 1 && r.top < h.bottom - 1; }).length,
            text: h1.innerText, fills, order: focal.map(e => e.className.split(' ')[0] || e.localName),
            describedBy: input.getAttribute('aria-describedby'), placeholder: input.placeholder,
            promises: promises.map(p => ({ text: p.textContent.trim(), ...box(p), size: parseFloat(getComputedStyle(p).fontSize) })),
            halo: { hidden: document.querySelector('.halo')?.getAttribute('aria-hidden'), chips },
            ctaFilled: getComputedStyle(document.querySelector('.masthead-cta')).backgroundColor !== 'rgba(0, 0, 0, 0)' };
        });
        check(hero.text === 'Find work that fits.\nKeep your privacy.', `${width}: the headline (${JSON.stringify(hero.text)})`);
        // Balanced: both lines in one weight, one colour, one size; nothing is softened or marked.
        check(hero.lines.length === 2 && hero.lines.every(l => JSON.stringify(l) === JSON.stringify(hero.lines[0])), `${width}: both headline lines carry the same weight, colour and size (${JSON.stringify(hero.lines)})`);
        for (const [name, b] of Object.entries({ h1: hero.h1, field: hero.field }))
          check(Math.abs(b.mid - hero.vw / 2) <= 2, `${width}: hero ${name} is centred (mid ${Math.round(b.mid)} of ${hero.vw})`);
        check(hero.align === 'center', `${width}: the headline is centred text`);
        check(hero.beside === 0, `${width}: nothing sits beside the headline`);
        // Headline, field and action are one composition: the headline, then the search, nothing more.
        check(JSON.stringify(hero.order) === JSON.stringify(['h1', 'hero-search']), `${width}: the focal unit is the headline, then the search, and nothing more (${hero.order})`);
        check(hero.describedBy === null && hero.placeholder.length > 0, `${width}: no note describes the field; the placeholder guides (${hero.describedBy})`);
        // The field is placed, not the pair: its centre falls a little below the middle of the space
        // under the header (mathematically centred reads high), on every screen.
        check(hero.field.top < hero.vh && hero.field.bottom <= hero.vh, `${width}: the search is in the first viewport`);
        const centre = (hero.input.midY - hero.header) / (hero.vh - hero.header);
        check(centre >= .5 && centre <= .56, `${width}: the field sits at the optical centre, just below the middle (${(centre * 100).toFixed(1)} % of the space under the header)`);
        // Dominant: the widest, tallest and highest-contrast object of the opening viewport.
        if (width >= 1024) {
          check(hero.field.width >= 700 && hero.field.width <= 810, `${width}: the search is wider than A6's 640 px (${Math.round(hero.field.width)} px)`);
          check(hero.field.height >= 72 && hero.field.height <= 80, `${width}: the search is taller than A6's 64 px (${Math.round(hero.field.height)} px)`);
          check(hero.field.width >= hero.h1.width * 1.5, `${width}: the search is half again as wide as the headline (${Math.round(hero.field.width)} vs ${Math.round(hero.h1.width)})`);
          check(hero.btn.height >= 56, `${width}: the pink action is a full, large target (${Math.round(hero.btn.height)} px)`);
        } else {
          check(hero.input.width >= hero.vw - 34 && hero.input.height >= 58 && hero.input.height <= 66, `${width}: on a phone the field takes the width (${Math.round(hero.input.width)} × ${Math.round(hero.input.height)})`);
          check(hero.btn.height >= 54 && hero.btn.top >= hero.input.bottom, `${width}: the action sits under the field, a full-size target`);
        }
        check(hero.h1Size >= (width >= 1024 ? 40 : width * .075) && hero.h1Size <= (width >= 1024 ? 58 : 40), `${width}: the headline is a step below the field, not monumental (${hero.h1Size} px)`);
        check(hero.h1.bottom < hero.field.top, `${width}: the headline sits above the search`);
        check(JSON.stringify(hero.fills) === JSON.stringify(['Search']), `${width}: the pink Search is the hero's only filled action (${hero.fills})`);
        check(!hero.ctaFilled, `${width}: the header's action stays quiet while the hero's search is in view`);
        // The promises: three plain lines at the foot, secondary to the search (smaller, apart from it).
        check(hero.promises.length === 3 && hero.promises.map(p => p.text).join(' | ') === 'No account needed to search | See why each job fits | Employers aren’t told you’re looking', `${width}: the three promises (${hero.promises.map(p => p.text).join(' | ')})`);
        check(hero.promises.every(p => p.bottom <= hero.vh && p.top > hero.btn.bottom + Math.min(hero.vh * .1, 56) && p.size <= 15), `${width}: the promises keep to the foot of the first viewport, small and apart from the search`);
        // Around the field: criteria people give Linkbot, with their levels; decorative, and never on
        // the words, the field, the action or the promises, nor past the screen's edge.
        const hit = (a, b, m = 8) => a.right + m > b.left && a.left - m < b.right && a.bottom + m > b.top && a.top - m < b.bottom;
        const clear = [hero.h1, hero.field, hero.input, hero.btn, ...hero.promises];
        check(hero.halo.hidden === 'true', `${width}: the floating criteria are decorative (aria-hidden)`);
        check(hero.halo.chips.length >= (width >= 1024 ? 4 : 2), `${width}: criteria float around the search (${hero.halo.chips.length})`);
        check(hero.halo.chips.every(c => /(Prefer|Avoid|Must)$/.test(c.text)) && hero.halo.chips.some(c => c.level === 'must') === (width !== 320 || hero.halo.chips.some(c => c.level === 'must')), `${width}: each shows its level (${hero.halo.chips.map(c => c.text).join(', ')})`);
        check(hero.halo.chips.every(c => !clear.some(b => hit(c, b))), `${width}: no floating criterion touches the headline, the field, the action or the promises`);
        check(hero.halo.chips.every(c => c.left >= 0 && c.right <= hero.vw && c.top >= hero.header && c.bottom <= hero.vh), `${width}: every floating criterion is wholly on screen`);
      }
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.locator('[data-start-cta]').scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      check(await page.evaluate(() => getComputedStyle(document.querySelector('.masthead-cta')).backgroundColor !== 'rgba(0, 0, 0, 0)'), 'once the hero has scrolled away, the header offers the search action');
      const stages = await page.evaluate(() => [...document.querySelectorAll('main > [data-stage]')].map(s => s.dataset.stage));
      check(JSON.stringify(stages) === JSON.stringify(['value', 'story', 'privacy', 'start']), `the home runs value → story → privacy → start (${stages})`);
      const scenes = await page.evaluate(() => [...document.querySelectorAll('[data-scene]')].map(s => ({ name: s.className.split(' ')[1], beats: s.dataset.beats.split(',').length, captions: [...s.querySelectorAll('[data-caption] h2')].map(h => h.textContent), live: s.classList.contains('is-live') })));
      check(JSON.stringify(scenes.map(s => [s.name, s.beats])) === JSON.stringify([['signal', 7], ['yours', 3]]), `two scenes with their beats (${JSON.stringify(scenes.map(s => [s.name, s.beats]))})`);
      check(scenes.every(s => s.captions.length === s.beats && !s.live), 'reduced motion: every scene is static, with one statement per beat, all readable in order');
      check(scenes[0].captions.join(' | ') === 'New openings every day. Most aren’t for you. | Say what would make a move worth it. | Linkbot reads it as criteria. | Prefer brings up what states it. | Avoid sends down what states it. | A Must is a hard line, and only you draw it. | Every fit shows its reasons.', `the story is the product, step by step (${scenes[0].captions.join(' | ')})`);
      check(scenes[1].captions.join(' | ') === 'What you see is yours. | A fit tells no one. | You decide what is shared, and with whom.', `privacy, in three facts (${scenes[1].captions.join(' | ')})`);
      const home = await page.evaluate(() => document.querySelector('main').innerText);
      check(!/What works today|short phrases|Write it in|runs in circles/i.test(home), 'no status section, no writing instructions and no problem-first loop on the home page');
      check(/Illustration/.test(home) && /interpreter/.test(home), 'the illustrations say they are illustrations, and the words are credited to the interpreter');
      check(/tested in staging, not yet live/.test(home) && /Private matching is in development/.test(home), 'sharing and private matching carry their real status');
      check(/not sharing, and it is not applying/.test(home) && /No name, no contact details/.test(home), 'matching is not disclosure and not applying; identity is never among the shared details');
      check(!/encrypt|anonym|zero.knowledge|on your device|nobody can see|guarantee/i.test(home), 'no claim of encryption, anonymity, local-only processing or guarantees');
      // Reduced motion: the final states are simply there.
      const still = await page.evaluate(() => {
        const vis = e => !!e && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden' && Number(getComputedStyle(e).opacity) === 1;
        const must = document.querySelector('.sg-chips .chip[data-must]');
        return {
          words: document.querySelector('.sg-sentence .sg-typed').textContent.replace(/\s+/g, ' ').trim(),
          chips: [...document.querySelectorAll('.sg-chips .chip')].map(c => c.querySelector('.chip-label').textContent),
          must: getComputedStyle(must.querySelector('.chip-hard')).opacity === '1' && getComputedStyle(must.querySelector('.chip-soft')).opacity === '0',
          list: [...document.querySelectorAll('.sg-card')].filter(vis).map(c => c.dataset.card).join(''),
          hidden: [...document.querySelectorAll('.sg-card[data-hidden]')].filter(c => getComputedStyle(c).display !== 'none').length,
          why: [...document.querySelectorAll('.sg-why > div')].filter(vis).length, note: vis(document.querySelector('.sg-hidden')),
          shared: [...document.querySelectorAll('.yr-shared li')].filter(vis).length, receipt: vis(document.querySelector('.yr-receipt')), fresh: vis(document.querySelector('.yr-fits li[data-new]')),
          nothing: vis(document.querySelector('.yr-nothing')), slot: vis(document.querySelector('.yr-slot')),
          air: document.querySelector('[data-air]')?.dataset.air };
      });
      check(still.words === 'Product designer, hybrid, more research, no agency work', `the words are the recorded reading's own (${still.words})`);
      check(still.chips.join(' | ') === 'Product designer | Hybrid | more research | agency work' && still.must, `reduced motion: the words are read and the Must is set (${still.chips.join(' | ')})`);
      check(still.list === 'abcde' && still.hidden === 0 && still.note && still.why === 4, `reduced motion: five in order, two hidden and counted, the reasons shown (${JSON.stringify(still)})`);
      check(still.shared === 3 && still.receipt && still.fresh && still.nothing && still.slot, `reduced motion: both sides, the new fit, the shared details, the empty identity slot and the receipt are there (${JSON.stringify(still)})`);
      check(still.air === 'still', `reduced motion: the atmosphere draws one still frame (${still.air})`);
      // The material (Concept A9's layer model): the ground (L0), the light (L1) and the wash (L2)
      // fixed beneath; one noise layer (L3) in the page flow, as tall as the document, scrolling with
      // the content and printing with multiply on those alone; everything that carries words (main,
      // the footer, the header: L4) above it, so no word, field, card or chip is printed by it, and
      // no ancestor of the noise is a group a component could drag it into. The fingerprint once, on
      // your side of the privacy chapter, and nowhere else.
      const material = await page.evaluate(() => {
        const noise = document.querySelector('[data-noise]'), s = getComputedStyle(noise), z = q => Number(getComputedStyle(document.querySelector(q)).zIndex);
        const group = e => { const c = getComputedStyle(e); return (c.position !== 'static' && c.zIndex !== 'auto') || ['fixed', 'sticky'].includes(c.position) || Number(c.opacity) < 1 || c.transform !== 'none' || c.filter !== 'none' || c.isolation === 'isolate' || c.mixBlendMode !== 'normal' || c.willChange !== 'auto'; };
        const nearest = e => { for (let a = e.parentElement; a; a = a.parentElement) if (group(a)) return a.localName; return null; };
        const top = () => Math.round(noise.getBoundingClientRect().top);
        scrollTo(0, 0); const at0 = top(); scrollTo(0, 600); const at600 = top(); scrollTo(0, 0);
        return { parent: noise.parentElement.localName, bodyGroup: group(document.body), height: Math.round(noise.getBoundingClientRect().height), page: document.documentElement.scrollHeight, blend: s.mixBlendMode, image: s.backgroundImage, repeat: s.backgroundRepeat, position: s.position, events: s.pointerEvents, hidden: noise.getAttribute('aria-hidden'), at0, at600,
          z: Number(s.zIndex), air: z('.air'), main: z('main'), footer: z('footer'), header: z('[data-masthead]'), washOver: document.querySelector('.air').lastElementChild?.matches('[data-wash]'),
          looseBlends: [...document.querySelectorAll('body *')].filter(e => e !== noise && getComputedStyle(e).mixBlendMode !== 'normal' && ['main', 'footer', 'header', 'body', 'html'].includes(nearest(e))).map(e => e.className),
          prints: [...document.querySelectorAll('img[src*="/material/print"]')].map(i => i.closest('.yr-you') ? 'yours' : i.closest('section, div')?.className), calm: [...document.querySelectorAll('[data-air-calm]')].map(e => e.className.split(' ')[1]) };
      });
      check(material.parent === 'body' && !material.bodyGroup && material.position === 'absolute' && Math.abs(material.height - material.page) <= 2 && material.at0 === 0 && material.at600 === -600, `the noise lies in the page flow, as tall as the document, and scrolls with it (${JSON.stringify(material)})`);
      check(/noise-d2-medium\.webp/.test(material.image) && material.repeat === 'repeat' && material.blend === 'multiply' && material.hidden === 'true' && material.events === 'none', `the noise is the d2 tile, tiled, printed with multiply, decorative and never in the way of a pointer (${JSON.stringify(material)})`);
      check(material.air < material.z && material.washOver && [material.main, material.footer, material.header].every(c => c > material.z), `the ground, the light and the wash lie beneath the noise, and main, the footer and the header above it (${JSON.stringify(material)})`);
      check(material.looseBlends.length === 0, `every blend inside the content has its own group (${material.looseBlends})`);
      check(JSON.stringify(material.prints) === JSON.stringify(['yours']), `the fingerprint appears once, on your side of the privacy chapter (${material.prints})`);
      // In pixels: inside the field the grain is gone (its surface lies above the noise); the open
      // ground beside it carries it.
      await page.setViewportSize({ width: 1440, height: 900 }); await page.evaluate(() => scrollTo(0, 0));
      const hide = await page.addStyleTag({ content: '.hero .search-box * { visibility: hidden !important; }' });
      const fieldBox = await page.evaluate(() => { const r = document.querySelector('.hero .search-box').getBoundingClientRect(); return { x: r.left + 24, y: r.top + 12, width: r.width * .5, height: r.height - 24 }; });
      const grainIn = clip => page.screenshot({ clip }).then(buf => page.evaluate(async src => {
        const img = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + src; });
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data, w = c.width, h = c.height, L = i => .2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2];
        let e = 0, m = 0; for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { let t = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) t += L(((y + dy) * w + x + dx) * 4); const q = L((y * w + x) * 4) - t / 9; e += q * q; m++; }
        return Math.sqrt(e / m); }, buf.toString('base64')));
      const inField = await grainIn(fieldBox), onGround = await grainIn({ x: 16, y: 150, width: 120, height: 560 });
      await hide.evaluate(n => n.remove());
      check(inField < 1 && onGround >= 5, `the field is not printed by the noise, the open ground is (grain ${inField.toFixed(2)} inside the field, ${onGround.toFixed(2)} on the ground)`);
      check(JSON.stringify(material.calm) === JSON.stringify(['yours']), `only the privacy chapter calms the light (${material.calm})`);
      await context.close();

      // Without scripts, everything is there too, and the search never sends the words.
      const bare = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
      const bp = await bare.newPage();
      await bp.goto(origin + '/', { waitUntil: 'networkidle' });
      check(await bp.evaluate(() => [...document.querySelectorAll('[data-scene]')].every(s => !s.classList.contains('is-live') && getComputedStyle(s.querySelector('[data-scene-stage]')).position !== 'sticky')), 'without scripts every scene is complete and static');
      check(await bp.evaluate(() => getComputedStyle(document.querySelector('.air-still')).backgroundImage.includes('radial-gradient') && !document.querySelector('.air.is-drawn')), 'without scripts the still atmosphere is there');
      check(await bp.locator('#q-hero').count() === 1 && await bp.locator('#q-hero').getAttribute('name') === null, 'without scripts the search is there and never sends the words (no name)');
      await bare.close();

      // ── The atmosphere and the paper, measured in pixels: alive when the page is left alone, yet
      //    calm; colourful and bright; the paper plainly visible; the hand never moves the search;
      //    nothing written on the document's root while it runs. ──
      const living = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'no-preference' });
      const lp = await living.newPage();
      await lp.addInitScript(() => {
        window.__rootWrites = 0;
        const watch = () => new MutationObserver(list => { window.__rootWrites += list.length; }).observe(document.documentElement, { attributes: true });
        const body = () => new MutationObserver(list => { window.__rootWrites += list.length; }).observe(document.body, { attributes: true });
        document.addEventListener('DOMContentLoaded', () => setTimeout(() => { window.__rootWrites = 0; watch(); body(); }, 0));
      });
      await lp.goto(origin + '/', { waitUntil: 'networkidle' });
      await lp.evaluate(() => document.fonts.ready);
      await lp.waitForTimeout(1600);
      const air = await lp.evaluate(() => ({ state: document.querySelector('[data-air]').dataset.air, drawn: document.querySelector('.air').classList.contains('is-drawn') }));
      check(air.state === 'live' && air.drawn, `with motion the atmosphere is live (${JSON.stringify(air)})`);
      // A strip of sky with no content in it (the left edge, between the header and the foot).
      const sky = { x: 16, y: 150, width: 120, height: 560 };
      const measure = (a, b) => lp.evaluate(async ([a, b]) => {
        const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + src; });
        const [ia, ib] = await Promise.all([load(a), load(b)]);
        const c = document.createElement('canvas'); c.width = ia.width; c.height = ia.height; const g = c.getContext('2d', { willReadFrequently: true });
        g.drawImage(ia, 0, 0); const da = g.getImageData(0, 0, c.width, c.height).data; g.drawImage(ib, 0, 0); const db = g.getImageData(0, 0, c.width, c.height).data;
        let changed = 0, sum = 0, chroma = 0; const n = da.length / 4;
        for (let i = 0; i < da.length; i += 4) { const d = (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])) / 3; sum += d; if (d > 2) changed++; chroma += Math.max(da[i], da[i + 1], da[i + 2]) - Math.min(da[i], da[i + 1], da[i + 2]); }
        // The paper: high-frequency energy (each pixel against the mean of its 3 × 3 neighbourhood).
        let e = 0, m = 0; const w = c.width, h = c.height, lum = i => .2126 * da[i] + .7152 * da[i + 1] + .0722 * da[i + 2];
        for (let y = 1; y < h - 1; y += 2) for (let x = 1; x < w - 1; x += 2) { const i = (y * w + x) * 4; let s = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s += lum(((y + dy) * w + x + dx) * 4); const d = lum(i) - s / 9; e += d * d; m++; }
        return { changed: changed / n * 100, mean: sum / n, chroma: chroma / n, grain: Math.sqrt(e / m) };
      }, [a.toString('base64'), b.toString('base64')]);
      const pixels = () => lp.screenshot({ clip: sky });
      const a = await pixels(); await lp.waitForTimeout(3000); const b = await pixels();
      const motion = await measure(a, b);
      // A6, measured the same way: 7 % of the strip changed in 3 s (mean 1.1 levels), chroma 28.6,
      // fine texture 5.3; A7 at its commit: about 76 %, 3.5 levels, 32.8, 6.9. A9 (founder A4: the
      // background far less colourful, towards white and grey, colour only where the story needs
      // it): the pigments desaturated to 35 % and a wash over them, so at rest the light is quiet,
      // near white-grey, and still alive (A9 v0 at its checkpoint: 4.0 %, 0.94 levels, chroma 4.2).
      check(motion.mean >= .4 && motion.mean <= 8, `left alone, the atmosphere still lives, calmly (${motion.changed.toFixed(1)} % of a sky strip changed in 3 s, mean ${motion.mean.toFixed(2)} levels; a hidden tab: < .3)`);
      check(motion.chroma <= 12, `at rest the light is quiet, towards white and grey (mean chroma ${motion.chroma.toFixed(1)}; A7: 32.8)`);
      check(motion.grain >= 6, `the paper is plainly visible at 2× (${motion.grain.toFixed(2)} levels of fine texture; A6's grain: 5.3)`);
      report.atmosphere = { changedIn3s: +motion.changed.toFixed(1), meanDelta: +motion.mean.toFixed(2), chroma: +motion.chroma.toFixed(1), grain: +motion.grain.toFixed(2) };
      // One bright world: at the hero, in the story and in the privacy chapter the viewport stays
      // light (no night, no colour-world jump).
      const levels = [];
      for (const at of ['.hero', '.signal', '.yours', '.start']) {
        await lp.evaluate(s => { const e = document.querySelector(s); scrollTo(0, e.getBoundingClientRect().top + scrollY + (s === '.hero' || s === '.start' ? 0 : e.offsetHeight * .3)); }, at);
        await lp.waitForTimeout(700);
        const png = await lp.screenshot({ scale: 'css' });
        levels.push(await lp.evaluate(async src => {
          const img = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + src; });
          const c = document.createElement('canvas'); c.width = 144; c.height = 90; const g = c.getContext('2d'); g.drawImage(img, 0, 0, 144, 90);
          const d = g.getImageData(0, 0, 144, 90).data; let s = 0, dark = 0; for (let k = 0; k < d.length; k += 4) { const l = (.2126 * d[k] + .7152 * d[k + 1] + .0722 * d[k + 2]); s += l; if (l < 120) dark++; }
          return { mean: s / (d.length / 4), dark: dark / (d.length / 4) };
        }, png.toString('base64')));
      }
      check(levels.every(l => l.mean >= 200 && l.dark <= .06), `one bright world from the hero to the invitation (${levels.map(l => `${l.mean.toFixed(0)}/${(l.dark * 100).toFixed(1)}%`).join(', ')})`);
      check(Math.max(...levels.map(l => l.mean)) - Math.min(...levels.map(l => l.mean)) <= 24, 'no chapter jumps to another light level');
      report.brightness = levels.map(l => +l.mean.toFixed(1));
      // The colour hook (A9, slots.md): a section that asks for colour after load is seen and brings
      // the colour back while it fills the view; removing its attribute brings the quiet back (V6).
      await lp.evaluate(() => { const s = document.querySelector('.signal'); s.setAttribute('data-air-reveal', ''); scrollTo(0, s.getBoundingClientRect().top + scrollY + s.offsetHeight * .3); });
      await lp.waitForTimeout(500);
      const asked = await lp.evaluate(() => Number(getComputedStyle(document.querySelector('.air')).getPropertyValue('--air-reveal')));
      await lp.evaluate(() => document.querySelector('.signal').removeAttribute('data-air-reveal')); await lp.waitForTimeout(400);
      const released = await lp.evaluate(() => Number(getComputedStyle(document.querySelector('.air')).getPropertyValue('--air-reveal')));
      check(asked >= .9 && released === 0, `a section that asks for colour later is seen, and one that stops asking is quiet again (--air-reveal ${asked} while asked, ${released} after)`);
      await lp.evaluate(() => scrollTo(0, 0)); await lp.waitForTimeout(400);
      // The hand: the search never moves, and the page's root is never written to.
      const before = await lp.evaluate(() => JSON.stringify(document.querySelector('.hero .search-box').getBoundingClientRect()));
      for (let x = 100; x <= 1340; x += 31) { await lp.mouse.move(x, 420 + Math.sin(x / 140) * 260); await lp.waitForTimeout(12); }
      await lp.mouse.move(720, 455); await lp.waitForTimeout(300);
      check(await lp.evaluate(() => JSON.stringify(document.querySelector('.hero .search-box').getBoundingClientRect())) === before, 'the pointer never moves the search');
      for (let k = 0; k < 40; k++) { await lp.mouse.wheel(0, 140); await lp.waitForTimeout(16); }
      for (let k = 0; k < 40; k++) { await lp.mouse.wheel(0, -140); await lp.waitForTimeout(16); }
      await lp.waitForTimeout(600);
      check(await lp.evaluate(() => window.__rootWrites) === 0, `nothing is written on <html> or <body> while the page idles, scrolls and follows the hand (${await lp.evaluate(() => window.__rootWrites)} writes)`);
      // A hidden tab: the field stops drawing; visible again, it continues.
      await lp.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
      await lp.waitForTimeout(300);
      const h1 = await pixels(); await lp.waitForTimeout(1500); const h2 = await pixels();
      check(await lp.evaluate(() => document.querySelector('[data-air]').dataset.air) === 'paused' && (await measure(h1, h2)).mean < .3, 'while the tab is hidden nothing is drawn');
      await lp.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
      check(await lp.evaluate(() => document.querySelector('[data-air]').dataset.air) === 'live', 'visible again, the atmosphere continues');
      await living.close();
      // Reduced motion: one still frame, nothing changes.
      const calm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
      const cp = await calm.newPage();
      await cp.goto(origin + '/', { waitUntil: 'networkidle' }); await cp.waitForTimeout(1500);
      const s1 = await cp.screenshot({ clip: sky }); await cp.waitForTimeout(2500); const s2 = await cp.screenshot({ clip: sky });
      check(s1.equals(s2), 'under reduced motion the atmosphere is still');
      await calm.close();

      // With motion: one number per scene, from the scroll position, drives every illustration, so
      // each scene plays forward, reverses, survives jumps, flings and resizes, and stays legible at
      // every beat. Statements change with their beat (a short eased transition), so states are read
      // once the transition has settled.
      const moving = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
      await moving.addInitScript(colorKit);
      const mp = await moving.newPage();
      await mp.goto(origin + '/', { waitUntil: 'networkidle' });
      await mp.evaluate(() => document.fonts.ready);
      const frame = () => mp.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      const settle = async () => { await frame(); await mp.waitForTimeout(950); };
      const geometry = i => mp.evaluate(i => { const root = document.querySelectorAll('[data-scene]')[i], s = root.querySelector('[data-scene-stage]'); const header = parseFloat(getComputedStyle(s).top) || 0;
        return { live: root.classList.contains('is-live'), start: root.getBoundingClientRect().top + scrollY - header, span: root.offsetHeight - s.offsetHeight, beats: root.dataset.beats.split(',').map(b => b.split(':').map(Number)) }; }, i);
      const state = i => mp.evaluate(i => {
        const root = document.querySelectorAll('[data-scene]')[i], s = root.querySelector('[data-scene-stage]'), r = s.getBoundingClientRect();
        const on = [...root.querySelectorAll('[data-caption]')].map(c => Math.round(Number(getComputedStyle(c).opacity) * 100) / 100);
        return { p: Number((root.querySelector('[data-scene-vars]') ?? s).style.getPropertyValue('--p')), beat: root.dataset.beat ?? null, pinned: Math.abs(r.top - parseFloat(getComputedStyle(s).top)) < 2, on,
          current: [...root.querySelectorAll('[data-caption]')].findIndex(c => c.getAttribute('aria-current') === 'step') }; }, i);
      const names = ['signal', 'yours'];
      for (let i = 0; i < 2; i++) {
        const g = await geometry(i);
        check(g.live, `${names[i]}: live with motion at 1440×900`);
        const at = async p => { await mp.evaluate(y => scrollTo(0, y), Math.round(g.start + p * g.span)); await settle(); return state(i); };
        const mids = g.beats.map(([a, b]) => (a + b) / 2);
        const seen = [];
        for (const [k, p] of mids.entries()) {
          const s = await at(p); seen.push(s);
          check(s.pinned && Math.abs(s.p - p) < .01, `${names[i]} beat ${k + 1}: pinned at p ${p.toFixed(2)} (${JSON.stringify(s)})`);
          check(s.current === k, `${names[i]} beat ${k + 1}: its statement is the current step (current ${s.current})`);
          check(s.on[k] >= .95 && s.on.every((o, j) => j === k || o <= .05), `${names[i]} beat ${k + 1}: one statement owns the stage (${s.on})`);
        }
        const back = await at(mids[0]);
        check(JSON.stringify(back) === JSON.stringify(seen[0]), `${names[i]}: scrolling back to beat 1 returns the same frame`);
        await mp.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await frame();
        const last = mids.length - 1;
        check(JSON.stringify(await at(mids[last])) === JSON.stringify(seen[last]), `${names[i]}: a jump back lands on the last beat's frame`);
        await mp.evaluate(({ start, span, p }) => { for (let k = 0; k <= 40; k++) scrollTo(0, start + span * ((k * 7) % 41) / 40); scrollTo(0, start + span * p); }, { start: g.start, span: g.span, p: mids[1] });
        await settle();
        check(JSON.stringify(await state(i)) === JSON.stringify(seen[1]), `${names[i]}: after a fast fling the stage shows the frame for where the page stopped`);
        for (const [k, p] of mids.entries()) {
          await at(p);
          await mp.evaluate(i => { document.querySelectorAll('main > *, .masthead, .footer').forEach(e => { e.inert = !e.contains(document.querySelectorAll('[data-scene]')[i]); }); document.querySelectorAll('[data-scene]').forEach((s, j) => { s.inert = j !== i; });
            document.querySelectorAll('[aria-hidden="true"]:not(.icon):not(.mark)').forEach(e => { e.dataset.qaHidden = e.style.visibility; e.style.visibility = 'hidden'; }); }, i);
          const audit = await mp.evaluate(pageAudit, { modal: false, touch: false });
          await mp.evaluate(() => { document.querySelectorAll('[inert]').forEach(e => { e.inert = false; }); document.querySelectorAll('[data-qa-hidden]').forEach(e => { e.style.visibility = e.dataset.qaHidden; delete e.dataset.qaHidden; }); });
          const bad = audit.contrast.failures;
          check(bad.length === 0, `${names[i]} beat ${k + 1}: text below its contrast minimum: ${bad.slice(0, 2).map(f => `${f.node} ${f.text} ${f.ratio}`).join('; ')}`);
          check(audit.overflow.scrollWidth <= audit.overflow.clientWidth, `${names[i]} beat ${k + 1}: no horizontal overflow`);
          // The statement over the real, living atmosphere: its darkest background pixels, with the
          // text itself hidden, against the text's colour.
          const real = await mp.evaluate(async i => {
            const root = document.querySelectorAll('[data-scene]')[i], cap = root.querySelector('[data-caption][aria-current="step"]');
            const parts = [...cap.querySelectorAll('h2, small')].map(e => ({ e, r: e.getBoundingClientRect(), color: getComputedStyle(e).color }));
            return parts.map(p => ({ x: Math.max(0, Math.round(p.r.left)), y: Math.max(0, Math.round(p.r.top)), width: Math.round(p.r.width), height: Math.round(p.r.height), color: p.color }));
          }, i);
          await mp.addStyleTag({ content: '[data-caption] * { color: transparent !important; }' }).then(t => t.evaluate(n => { n.id = 'qa-hide-text'; }));
          for (const box of real) {
            const png = await mp.screenshot({ clip: { x: box.x, y: box.y, width: Math.max(1, box.width), height: Math.max(1, box.height) } });
            const ratio = await mp.evaluate(async ([src, color]) => {
              const img = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + src; });
              const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
              const d = g.getImageData(0, 0, c.width, c.height).data, lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }, L = (r, g, b) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
              const ls = []; for (let k = 0; k < d.length; k += 4) ls.push(L(d[k], d[k + 1], d[k + 2])); ls.sort((a, b) => a - b);
              const [r, g2, b] = color.match(/\d+/g).map(Number), t = L(r, g2, b), bg = ls[Math.floor(ls.length * .02)], hi = ls[Math.floor(ls.length * .98)];
              return Math.min((Math.max(t, bg) + .05) / (Math.min(t, bg) + .05), (Math.max(t, hi) + .05) / (Math.min(t, hi) + .05));
            }, [png.toString('base64'), box.color]);
            check(ratio >= 4.5, `${names[i]} beat ${k + 1}: a statement over the living background keeps ${ratio.toFixed(2)}:1`);
          }
          await mp.evaluate(() => document.getElementById('qa-hide-text')?.remove());
        }
      }
      // Resizing keeps the frame for the position (geometry is measured again).
      for (const [w, h] of [[1024, 768], [390, 844], [1440, 900]]) {
        await mp.setViewportSize({ width: w, height: h }); await frame(); await frame();
        const g = await geometry(0); const p = (g.beats[3][0] + g.beats[3][1]) / 2;
        await mp.evaluate(y => scrollTo(0, y), Math.round(g.start + p * g.span)); await settle();
        const s = await state(0);
        check(g.live && s.current === 3 && Math.abs(s.p - p) < .01 && s.pinned, `${w}×${h}: after resizing, the fourth beat is still the fourth beat (${JSON.stringify(s)})`);
      }
      // Every beat at five sizes: nothing visible leaves the stage, nothing covers the legend or the
      // statement, and no row of the list covers another (a scene whose finished state cannot fit a
      // screen stays static there instead). Both scenes are live from 360 × 800 phones up.
      for (const [w, h] of [[360, 800], [390, 844], [1024, 768], [1280, 720], [1440, 900]]) {
        await mp.setViewportSize({ width: w, height: h }); await frame(); await frame();
        for (let i = 0; i < 2; i++) {
          const g = await geometry(i);
          check(g.live, `${w}×${h}: ${names[i]} is live`);
          if (!g.live) continue;
          for (const [k, [a, z]] of g.beats.entries()) {
            await mp.evaluate(y => scrollTo(0, y), Math.round(g.start + g.span * (a + z) / 2)); await settle();
            const issues = await mp.evaluate(i => {
              const t = document.querySelectorAll('[data-scene]')[i], s = t.querySelector('[data-scene-stage]'), sr = s.getBoundingClientRect();
              const visible = e => { let o = 1; for (let x = e; x && x !== s; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.visibility === 'hidden' || cs.display === 'none') return false; o *= Number(cs.opacity); } return o > .05; };
              const legend = t.querySelector('figcaption'), lr = legend && visible(legend) ? legend.getBoundingClientRect() : null;
              const cap = t.querySelector('.caption[aria-current]'), cr = cap ? cap.getBoundingClientRect() : null;
              const items = [...t.querySelectorAll('.caption h2, .caption small, .chip, .sg-lens, .sg-card, .sg-hidden, .yr-card, .yr-fits li, .yr-shared li, .yr-kept, .yr-receipt')].filter(e => !e.closest('[aria-hidden="true"]') && visible(e) && e.getBoundingClientRect().height > 0);
              const hit = (r, q) => r.bottom > q.top + 1 && r.top < q.bottom - 1 && r.right > q.left + 1 && r.left < q.right - 1;
              const out = [];
              for (const e of items) { const r = e.getBoundingClientRect(), name = e.className.split(' ')[0] || e.localName;
                if (r.bottom > sr.bottom + 1 || r.top < sr.top - 1) out.push(`${name} leaves the stage`);
                if (lr && !legend.contains(e) && hit(r, lr)) out.push(`${name} covers the legend`);
                if (cr && !cap.contains(e) && hit(r, cr)) out.push(`${name} covers the statement`); }
              const rows = items.filter(e => e.matches('.sg-lens, .sg-card, .sg-hidden'));
              for (let x = 0; x < rows.length; x++) for (let y = x + 1; y < rows.length; y++) if (hit(rows[x].getBoundingClientRect(), rows[y].getBoundingClientRect())) out.push(`${rows[x].dataset.card ?? rows[x].className.split(' ')[0]} covers ${rows[y].dataset.card ?? rows[y].className.split(' ')[0]}`);
              return [...new Set(out)];
            }, i);
            check(issues.length === 0, `${w}×${h} ${names[i]} beat ${k + 1}: ${issues.join('; ')}`);
          }
        }
      }
      // A screen too short for a stage gets the complete story instead.
      for (const [w, h] of [[844, 390], [375, 667]]) {
        await mp.setViewportSize({ width: w, height: h }); await frame(); await frame();
        check(await mp.evaluate(() => [...document.querySelectorAll('[data-scene]')].every(s => !s.classList.contains('is-live'))), `${w}×${h}: a screen too short for the stages gets the static story`);
      }
      await moving.close();
      report.journeys.composition = 'A7 hero at 1440/1024/390/320 (the field placed at the optical centre and dominant, balanced headline a step below it, criteria floating clear of everything, three promises); the noise in the page flow beneath all content (scrolling, multiply, the field free of it), the fingerprint once; a living atmosphere (alive when idle, calm, quiet towards white and grey at rest, one bright world, still under reduced motion, paused when hidden, the hand never moves the search, nothing written on the root); value → story → privacy → start; two scenes static (no JS, reduced motion, short screens) and live from 360 × 800 (beats, reverse, jump, fling, resize, contrast per beat, statements over the real background, no row over another)';
    }

    // ── 3. Journeys (motion allowed, as most visitors see it) ──
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    // The first action: words go to the app's search in the fragment, never in the query string.
    const field = page.locator('#q-hero');
    await page.locator('form[data-handoff]').first().getByRole('button', { name: 'Search' }).click();
    check(page.url() === origin + '/', 'an empty search must not leave the page');
    check(await page.locator('#q-hero-alert[role="alert"]').count() === 1, 'an empty search explains what to write');
    check(await field.getAttribute('aria-invalid') === 'true' && await field.getAttribute('aria-describedby') === 'q-hero-alert', 'the explanation is tied to the field');
    check(await page.evaluate(() => document.activeElement?.id) === 'q-hero', 'an empty search keeps focus in the field');
    await field.fill('Backend');
    check(await page.locator('#q-hero-alert').isHidden() && await field.getAttribute('aria-invalid') === null && await field.getAttribute('aria-describedby') === null, 'typing clears the explanation');
    await field.fill('Backend engineer, remote, no management');
    await field.press('Enter');
    await page.waitForURL(/\/talent/);
    const handed = new URL(page.url());
    check(handed.pathname === '/talent' && handed.search === '', `handoff address ${page.url()}`);
    check(handed.hash === '#/search?q=' + encodeURIComponent('Backend engineer, remote, no management'), `handoff fragment ${handed.hash}`);
    report.journeys.handoff = handed.pathname + handed.hash;
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const examples = await page.locator('.start-try a').evaluateAll(as => as.map(a => a.getAttribute('href')));
    check(examples.length === 3 && examples.every(h => h.startsWith('/talent#/search?q=')), `example links ${examples}`);
    // A8: the invitation is one plain call to action, no second field.
    check(await page.locator('.start input').count() === 0 && await page.locator('[data-start-cta]').count() === 1, 'the closing section has one call to action and no field');
    await page.locator('[data-start-cta]').click();
    await page.waitForURL(/\/talent/);
    check(new URL(page.url()).hash === '#/search', 'the closing action opens the search');

    // The reading demonstration (How it works): tabs, keyboard, the rewrite and the Must switch.
    await page.goto(origin + '/how-it-works', { waitUntil: 'networkidle' });
    const tabs = page.getByRole('tablist', { name: 'Example sentences' }).getByRole('tab');
    check(await tabs.count() === 5, 'five example sentences');
    await tabs.first().focus(); await page.keyboard.press('ArrowRight');
    check(await tabs.nth(1).getAttribute('aria-selected') === 'true', 'ArrowRight selects the next example');
    check(await page.evaluate(() => document.activeElement?.getAttribute('role')) === 'tab', 'focus follows the selected tab');
    check(await page.locator('.reader-panel:not([hidden])').count() === 1, 'exactly one reading visible');
    await page.keyboard.press('End');
    check(await tabs.nth(4).getAttribute('aria-selected') === 'true', 'End selects the last example');
    await tabs.nth(3).click();
    const paragraph = page.locator('#reader-panel-paragraph');
    check(/Nothing here can be used yet/.test(await paragraph.innerText()), 'the paragraph shows that nothing was understood');
    check(await paragraph.locator('.read').count() === 0, 'nothing in the paragraph is set as read');
    await paragraph.getByRole('button', { name: /Show the same thing as phrases/ }).click();
    check(await tabs.nth(4).getAttribute('aria-selected') === 'true', 'the rewrite opens from the paragraph');
    const rewrite = page.locator('#reader-panel-rewrite');
    check(await rewrite.locator('.read').count() === 4 && await rewrite.locator('.unused').count() >= 1, 'the rewrite reads four phrases and leaves one unused');
    const must = rewrite.getByRole('button', { name: 'Make it a Must' });
    await must.click();
    check(await must.getAttribute('aria-pressed') === 'true', 'the Must switch reports its state');
    check(await rewrite.locator('[data-chip][data-level="must"]').innerText() === 'Must', 'the chip says Must');
    report.journeys.reader = 'tabs, keyboard, rewrite, Must';

    // The listing demonstration: choosing a criterion brings its evidence forward; Not stated brings nothing.
    const rows = page.locator('[data-listing] [data-row]');
    await rows.nth(1).click();
    check(await page.locator('[data-listing] mark.is-on').count() === 1 && await page.locator('[data-listing] .listing-paper[data-focus]').count() === 1, 'the differing statement comes forward');
    await rows.nth(2).click();
    check(await page.locator('[data-listing] mark.is-on').count() === 0 && await page.locator('[data-listing] .listing-paper[data-focus]').count() === 0, 'nothing comes forward for a criterion the listing does not state');
    check(/doesn’t mention management/.test(await page.locator('[data-listing] [data-status]').innerText()), 'the status explains the unknown');
    report.journeys.listing = 'stated, differs, not stated';

    // Watching: the count follows the last visit and pausing.
    const count = () => page.locator('[data-watch] [data-count]').innerText();
    const visit = day => page.locator('[data-watch]').getByRole('button', { name: day });
    await visit('Monday').click(); check(await count() === '4', 'four new since Monday');
    check(await visit('Monday').getAttribute('aria-pressed') === 'true' && await visit('Wednesday').getAttribute('aria-pressed') === 'false', 'one last visit at a time');
    await visit('Friday').click(); check(await count() === '1', 'one new since Friday');
    await visit('Monday').click();
    await page.locator('[data-watch]').getByRole('button', { name: 'Pause from Thursday' }).click();
    check(await count() === '2' && await page.locator('[data-watch] [data-paused-note]').isVisible(), 'pausing stops the checks from Thursday');
    report.journeys.watching = 'last visit, pause';

    // The honest status overview lives in help now, not on the home page.
    const today = await page.locator('.today h3').allInnerTexts();
    check(today.length === 3 && /In the product now/.test(today[0]) && /Not built yet/.test(today[2]), `How it works states what is live today (${today})`);

    // Five separate decisions (Privacy), each with its status.
    await page.goto(origin + '/privacy', { waitUntil: 'networkidle' });
    const steps = page.getByRole('tablist', { name: 'Five separate decisions' }).getByRole('tab');
    check(await steps.count() === 5, 'five decisions');
    await steps.nth(3).click();
    check(/Built, tested in staging/.test(await page.locator('#step-panel-shared').innerText()), 'sharing states its status');
    report.journeys.decisions = 'five steps, status';
    await context.close();

    // ── 4. Crawl files ──
    const robots = await (await fetch(origin + '/robots.txt')).text();
    const sitemap = await (await fetch(origin + '/sitemap-0.xml')).text();
    const preview = /Disallow: \//.test(robots);
    report.robots = preview ? 'preview: disallow all' : 'production: allow, with sitemap';
    if (!preview) check(/Sitemap: https:\/\//.test(robots), 'robots.txt names the sitemap');
    for (const route of PAGES) check(sitemap.includes(route === '/' ? '</loc>' : `${route}</loc>`), `sitemap lists ${route}`);
    check(!sitemap.includes('404'), 'the sitemap leaves out the 404 page');
  } finally {
    await browser.close(); server.close();
  }
  const out = process.env.SITE_REPORT;
  if (out) fs.writeFileSync(out, JSON.stringify({ failures, ...report }, null, 2) + '\n');
  if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
  console.log(`site browser acceptance: ${PAGES.length} pages × ${WIDTHS.length} widths, journeys ${Object.keys(report.journeys).join(', ')}; ok`);
})().catch(error => { console.error(error); process.exit(1); });
