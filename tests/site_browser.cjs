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
      // Concept A9, direction W4 (Begegnung): the story block holds one story, S1–S5, privacy included.
      check(JSON.stringify(stages) === JSON.stringify(['value', 'story', 'start']), `the home runs value → story → start (${stages})`);
      // The story (W4 Begegnung): five stations, each its own words and its own picture, in the flow
      // under reduced motion; every picture says it is an illustration.
      const story = await page.evaluate(() => { const r = document.querySelector('[data-direction="begegnung"]');
        return { pinned: r?.dataset.mode === 'pin', stations: [...(r?.querySelectorAll('.begegnung-station') ?? [])].map(s => ({ title: s.querySelector('h2')?.textContent ?? '', pic: s.querySelector('.begegnung-frame')?.getAttribute('aria-label') ?? '' })) }; });
      check(story.stations.length === 5 && !story.pinned, `reduced motion: the story is five stations in the flow, not pinned (${JSON.stringify(story).slice(0, 200)})`);
      check(story.stations.map(s => s.title).join(' | ') === 'Private by default. Shared only when you decide. | Compared with your words, not with you. | A fit is not permission to contact you. | Then it gets personal, if you want it to. | Change your mind: pause, remove or revoke.', `the five stations S1–S5 (${story.stations.map(s => s.title).join(' | ')})`);
      check(story.stations.every(s => s.pic.startsWith('Illustration:')), 'every station’s picture says it is an illustration');
      // A9 (W1): the default story never states "A fit tells no one" (an option only while counsel's reading
      // is open, founder B).
      check(!/tells no one/i.test(await page.evaluate(() => document.querySelector('main').innerText)), 'the default home never says "A fit tells no one"');
      const home = await page.evaluate(() => document.querySelector('main').innerText);
      check(!/What works today|short phrases|Write it in|runs in circles/i.test(home), 'no status section, no writing instructions and no problem-first loop on the home page');
      check(/Employers aren’t told you’re looking/.test(home) && /Compared with your words, not with you/.test(home), 'the story names who is not told: employers; a fit is with your words, not with you');
      check(/Built, tested in staging; not yet live with employers/.test(home) && /In development, not live/.test(home) && /Open question/.test(home), 'sharing, private matching and what is not built carry their real status');
      check(/A fit is not permission to contact you/.test(home) && /Linkbot never applies for you/.test(home) && /once, or by a standing rule you set/.test(home) && !/\bmatched\b|Only your yes opens anything|[Hh]andshake/.test(home), 'a fit is not permission and not applying; sharing is said as it is (once, or by a standing rule); no match as contact, no Handshake');
      check(!/encrypt|anonym|zero.knowledge|on your device|nobody can see|guarantee/i.test(home), 'no claim of encryption, anonymity, local-only processing or guarantees');
      // Reduced motion: the final states are simply there.
      const still = await page.evaluate(() => {
        const r = document.querySelector('[data-direction="begegnung"]'), vis = e => !!e && getComputedStyle(e).display !== 'none' && Number(getComputedStyle(e).opacity) === 1;
        const tags = k => [...r.querySelectorAll(`.begegnung-v${k} .begegnung-tag`)].filter(vis).map(t => t.textContent.trim());
        return { frames: [...r.querySelectorAll('.begegnung-station .begegnung-frame')].filter(f => getComputedStyle(f).display !== 'none').length,
          running: r.getAnimations({ subtree: true }).length, tags3: tags(3), tags4: tags(4), tags5: tags(5), air: document.querySelector('[data-air]')?.dataset.air };
      });
      check(still.frames === 5 && still.running === 0, `reduced motion: five finished pictures, nothing running (${JSON.stringify(still)})`);
      check(still.tags3.includes('In development, not live') && still.tags4.includes('In development, not live') && still.tags4.includes('Not shared') && still.tags5.some(t => /Copies already received aren’t recalled\..*Built, tested in staging/.test(t)) && still.tags5.includes('In development, not live'), `reduced motion: the labels stand in the pictures (${JSON.stringify(still)})`);
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
          z: Number(s.zIndex), air: z('.air'), main: z('main'), footer: z('footer'), header: z('[data-masthead]'), washOver: [...document.querySelector('.air').children].slice(-2).map(e => e.matches('[data-wash]') ? 'wash' : e.matches('[data-cap]') ? 'cap' : e.className).join(' ') === 'wash cap',
          looseBlends: [...document.querySelectorAll('body *')].filter(e => e !== noise && getComputedStyle(e).mixBlendMode !== 'normal' && ['main', 'footer', 'header', 'body', 'html'].includes(nearest(e))).map(e => e.className),
          prints: [...document.querySelectorAll('img[src*="/material/print"]')].map(i => i.closest('.yr-you') ? 'yours' : i.closest('section, div')?.className), calm: [...document.querySelectorAll('[data-air-calm]')].map(e => e.className.split(' ')[1]) };
      });
      check(material.parent === 'body' && !material.bodyGroup && material.position === 'absolute' && Math.abs(material.height - material.page) <= 2 && material.at0 === 0 && material.at600 === -600, `the noise lies in the page flow, as tall as the document, and scrolls with it (${JSON.stringify(material)})`);
      check(/noise-d2-medium\.webp/.test(material.image) && material.repeat === 'repeat' && material.blend === 'multiply' && material.hidden === 'true' && material.events === 'none', `the noise is the d2 tile, tiled, printed with multiply, decorative and never in the way of a pointer (${JSON.stringify(material)})`);
      check(material.air < material.z && material.washOver && [material.main, material.footer, material.header].every(c => c > material.z), `the ground, the light and the wash lie beneath the noise, and main, the footer and the header above it (${JSON.stringify(material)})`);
      check(material.looseBlends.length === 0, `every blend inside the content has its own group (${material.looseBlends})`);
      check(JSON.stringify(material.prints) === JSON.stringify([]), `this story uses no fingerprint (${material.prints})`);
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
      check(JSON.stringify(material.calm) === JSON.stringify([]), `nothing calms the light; the story reveals colour instead (${material.calm})`);
      await context.close();

      // ── 2b. Concept A9 (W1 part 2): the seamless header, the noise on short pages, and text on the
      //        open ground, all measured in pixels with the noise beneath. ──
      // In-page pixel statistics on a screenshot (decoded on a canvas; regions in device pixels).
      const stats = (pg, bufs, job) => pg.evaluate(async ([srcs, job]) => {
        const imgs = await Promise.all(srcs.map(src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + src; })));
        const data = imgs.map(img => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0); return { w: c.width, h: c.height, d: g.getImageData(0, 0, c.width, c.height).data }; });
        const L8 = (d, i) => .2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2];
        const lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }, rel = (d, i) => .2126 * lin(d[i]) + .7152 * lin(d[i + 1]) + .0722 * lin(d[i + 2]);
        const strip = (im, y0, y1) => { let r = 0, g = 0, b = 0, n = 0, e = 0; for (let y = Math.max(0, y0); y < Math.min(im.h, y1); y++) for (let x = 0; x < im.w; x++) { const i = (y * im.w + x) * 4; r += im.d[i]; g += im.d[i + 1]; b += im.d[i + 2]; n++; if (x) e += Math.abs(L8(im.d, i) - L8(im.d, i - 4)); } return { r: r / n, g: g / n, b: b / n, t: e / n }; };
        if (job.kind === 'seam') {
          const [ground, bare] = data, a = strip(ground, job.edge - job.s - job.px, job.edge - job.px), z = strip(ground, job.edge + job.px, job.edge + job.s + job.px);
          const fa = strip(ground, job.end - job.s - job.px, job.end - job.px), fz = strip(ground, job.end + job.px, job.end + job.s + job.px);
          let delta = 0, n = 0; for (let y = 0; y < Math.min(ground.h, job.end); y++) for (let x = 0; x < ground.w; x++) { const i = (y * ground.w + x) * 4; delta += Math.max(Math.abs(ground.d[i] - bare.d[i]), Math.abs(ground.d[i + 1] - bare.d[i + 1]), Math.abs(ground.d[i + 2] - bare.d[i + 2])); n++; }
          const step = (p, q) => Math.max(Math.abs(p.r - q.r), Math.abs(p.g - q.g), Math.abs(p.b - q.b)), ratio = (p, q) => (q.t + .5) / (p.t + .5);
          return { copy: delta / n, edgeStep: step(a, z), edgeRatio: ratio(a, z), featherStep: step(fa, fz), featherRatio: ratio(fa, fz) };
        }
        if (job.kind === 'text') {
          const [im] = data; return job.boxes.map(b => {
            const [r, g, bl] = b.color.match(/\d+/g).map(Number), t = .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(bl), ls = [];
            for (let y = Math.max(0, Math.round(b.y * job.dpr)); y < Math.min(im.h, Math.round((b.y + b.h) * job.dpr)); y++) for (let x = Math.max(0, Math.round(b.x * job.dpr)); x < Math.min(im.w, Math.round((b.x + b.w) * job.dpr)); x++) ls.push(rel(im.d, (y * im.w + x) * 4));
            if (ls.length < 10) return null; ls.sort((p, q) => p - q);
            const c = l => (Math.max(t, l) + .05) / (Math.min(t, l) + .05);
            return { ...b, ratio: Math.min(c(ls[Math.floor(ls.length * .02)]), c(ls[Math.floor(ls.length * .98)])) };
          }).filter(Boolean);
        }
        if (job.kind === 'grain') { const [im] = data; let e = 0, m = 0; for (let y = Math.max(1, job.y0); y < Math.min(im.h - 1, job.y1); y++) for (let x = 1; x < im.w - 1; x += 2) { let t = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) t += L8(im.d, ((y + dy) * im.w + x + dx) * 4); const q = L8(im.d, (y * im.w + x) * 4) - t / 9; e += q * q; m++; } return Math.sqrt(e / m); }
      }, [bufs.map(b => b.toString('base64')), job]);
      const hideContent = 'main > *, footer > *, .halo { visibility: hidden !important; } .masthead-inner, [data-toc] details { visibility: hidden !important; }';
      // The header: scrolled, a plate copies the ground exactly (with the plate removed, the grounds-only
      // picture under the header and its feather is the same, so its grain continues the page's texel
      // for texel), no colour step or texture change across its edge, and every header word keeps
      // 4.5:1 over the real pixels with content passing beneath it.
      for (const [route, width, dpr, y] of [['/', 1440, 1, 300], ['/', 390, 2, 1200], ['/privacy', 1440, 1, 1200], ['/privacy', 390, 2, 1200], ['/hiring', 1440, 2, 300]]) {
        for (const motion of ['no-preference', 'reduce']) {
          const ctx = await browser.newContext({ viewport: { width, height: HEIGHTS[width] }, deviceScaleFactor: dpr, reducedMotion: motion });
          const pg = await ctx.newPage();
          await pg.goto(origin + route, { waitUntil: 'networkidle' }); await pg.evaluate(() => document.fonts.ready);
          await pg.evaluate(v => scrollTo(0, v), y); await pg.waitForTimeout(700);
          const head = await pg.evaluate(() => { const h = document.querySelector('[data-masthead]'), r = h.getBoundingClientRect(), toc = document.querySelector('[data-toc][data-stuck]');
            const edge = toc ? toc.getBoundingClientRect().bottom : r.bottom, plate = toc ? toc.querySelector('.toc-plate') : h.querySelector('.masthead-plate');
            const words = [...h.querySelectorAll('a, summary')].filter(e => e.getClientRects().length && !e.closest('details:not([open]) > :not(summary)') && getComputedStyle(e).visibility === 'visible' && getComputedStyle(e).backgroundColor === 'rgba(0, 0, 0, 0)').map(e => { const g = document.createRange(); g.selectNodeContents(e); const b = g.getBoundingClientRect(); return { text: e.textContent.trim(), color: getComputedStyle(e).color, x: b.left, y: b.top, w: b.width, h: b.height }; });
            return { scrolled: h.hasAttribute('data-scrolled'), opacity: getComputedStyle(h.querySelector('.masthead-plate')).opacity, edge, end: plate.getBoundingClientRect().bottom, words }; });
          check(head.scrolled && head.opacity === '1', `${route}@${width} ${motion}: scrolled, the header shows its plate (${JSON.stringify({ scrolled: head.scrolled, opacity: head.opacity })})`);
          const quiet = await pg.addStyleTag({ content: '[data-masthead] *, [data-masthead] *::before, [data-masthead] *::after { color: transparent !important; text-decoration-color: transparent !important; } [data-masthead] svg { visibility: hidden !important; }' });
          await pg.waitForTimeout(100);
          const words = await stats(pg, [await pg.screenshot()], { kind: 'text', dpr, boxes: head.words });
          await quiet.evaluate(n => n.remove());
          for (const w of words) check(w.ratio >= 4.5, `${route}@${width} ${motion} scrolled ${y}: the header's "${w.text}" keeps ${w.ratio.toFixed(2)}:1 over what passes beneath`);
          const hidden = await pg.addStyleTag({ content: hideContent }); await pg.waitForTimeout(150);
          const ground = await pg.screenshot();
          const bare = await pg.addStyleTag({ content: '.masthead-plate, .toc-plate { display: none !important; }' }); await pg.waitForTimeout(150);
          const without = await pg.screenshot();
          await bare.evaluate(n => n.remove()); await hidden.evaluate(n => n.remove());
          const seam = await stats(pg, [ground, without], { kind: 'seam', edge: Math.round(head.edge * dpr), end: Math.round(head.end * dpr), s: 6 * dpr, px: dpr });
          check(seam.copy < .5, `${route}@${width} ${motion} scrolled ${y}: the plate is a copy of the ground, its grain aligned with the page's (mean |Δ| ${seam.copy.toFixed(3)} levels)`);
          check(seam.edgeStep <= 2 && Math.abs(seam.edgeRatio - 1) <= .15 && seam.featherStep <= 2 && Math.abs(seam.featherRatio - 1) <= .15, `${route}@${width} ${motion} scrolled ${y}: no edge (colour step ${seam.edgeStep.toFixed(2)} / ${seam.featherStep.toFixed(2)} levels, texture ratio ${seam.edgeRatio.toFixed(3)} / ${seam.featherRatio.toFixed(3)})`);
          report.header = report.header ?? []; report.header.push({ route, width, dpr, y, motion, copy: +seam.copy.toFixed(3), edgeStep: +seam.edgeStep.toFixed(2), edgeRatio: +seam.edgeRatio.toFixed(3), featherStep: +seam.featherStep.toFixed(2), featherRatio: +seam.featherRatio.toFixed(3), minWord: +Math.min(...words.map(w => w.ratio)).toFixed(2) });
          await ctx.close();
        }
      }
      // Short pages in tall windows: the noise reaches the bottom of the view (V1).
      for (const [w, h] of [[1440, 1600], [2560, 1440]]) for (const route of ['/imprint', '/privacy-policy', '/does-not-exist']) {
        const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
        const pg = await ctx.newPage(); await pg.goto(origin + route, { waitUntil: 'networkidle' });
        const cover = await pg.evaluate(() => ({ bottom: document.querySelector('[data-noise]').getBoundingClientRect().bottom, view: innerHeight }));
        const hidden = await pg.addStyleTag({ content: hideContent }); await pg.waitForTimeout(100);
        const grain = await stats(pg, [await pg.screenshot()], { kind: 'grain', y0: h - 120, y1: h - 4 });
        await hidden.evaluate(n => n.remove());
        check(cover.bottom >= cover.view - 1 && grain >= 5, `${route} at ${w}×${h}: the noise reaches the bottom of the view (layer bottom ${Math.round(cover.bottom)} of ${cover.view}; grain ${grain.toFixed(2)} in the last 120 px)`);
        await ctx.close();
      }
      // Text on the open ground (guardrail E, tokens.md): every small text over the noise keeps 4.5:1
      // (large text 3:1) against the 2nd and 98th percentile of the real pixels beneath it.
      const groundBoxes = () => {
        const alpha = v => { if (v === 'transparent') return 0; const m = v.match(/rgba?\(([^)]+)\)/); if (!m) return 1; const p = m[1].split(/[\s,/]+/).filter(Boolean); return p.length > 3 ? Number(p[3]) : 1; };
        const top = document.querySelector('[data-masthead]').getBoundingClientRect().bottom + 30, out = [];
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = walk.nextNode(); n; n = walk.nextNode()) {
          const e = n.parentElement; if (!n.data.trim() || !e || !e.closest('main, footer') || e.closest('[aria-hidden="true"], details:not([open]) > :not(summary)')) continue;
          const c = getComputedStyle(e); if (c.visibility !== 'visible') continue;
          let o = 1, surface = false; for (let a = e; a && a !== document.documentElement; a = a.parentElement) { const s = getComputedStyle(a); o *= Number(s.opacity); if (!surface && a.closest('main, footer') && (alpha(s.backgroundColor) > .5 || s.backgroundImage !== 'none' || s.backdropFilter !== 'none')) surface = true; }
          if (o < .99 || surface) continue;
          const size = parseFloat(c.fontSize), large = size >= 24 || (size >= 18.66 && Number(c.fontWeight) >= 700);
          const g = document.createRange(); g.selectNodeContents(n);
          for (const r of g.getClientRects()) if (r.width > 3 && r.height > 3 && r.top > top && r.bottom < innerHeight - 1 && r.left >= 0 && r.right <= innerWidth) out.push({ text: n.data.trim().slice(0, 40), color: c.color, large, x: r.left, y: r.top, w: r.width, h: r.height });
        }
        return out;
      };
      const textLow = [];
      let textChecked = 0;
      for (const [width, dpr] of [[1440, 1], [390, 2]]) for (const route of PAGES) {
        const ctx = await browser.newContext({ viewport: { width, height: HEIGHTS[width] }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
        const pg = await ctx.newPage(); await pg.goto(origin + route, { waitUntil: 'networkidle' }); await pg.evaluate(() => document.fonts.ready);
        const full = await pg.evaluate(() => document.documentElement.scrollHeight - innerHeight);
        for (const at of [0, .2, .4, .6, .8, 1]) {
          await pg.evaluate(v => scrollTo(0, v), Math.round(full * at)); await pg.waitForTimeout(250);
          const boxes = await pg.evaluate(groundBoxes);
          const quiet = await pg.addStyleTag({ content: '*, *::before, *::after { color: transparent !important; -webkit-text-fill-color: transparent !important; text-decoration-color: transparent !important; text-shadow: none !important; }' });
          await pg.waitForTimeout(100);
          const measured = await stats(pg, [await pg.screenshot()], { kind: 'text', dpr, boxes });
          await quiet.evaluate(n => n.remove());
          textChecked += measured.length;
          for (const m of measured) if (m.ratio < (m.large ? 3 : 4.5)) textLow.push(`${route}@${width} "${m.text}" ${m.ratio.toFixed(2)}`);
        }
        await ctx.close();
      }
      check(textChecked > 300 && textLow.length === 0, `text on the open ground keeps its contrast over the noise (${textChecked} boxes; below: ${[...new Set(textLow)].slice(0, 6).join('; ')})`);
      report.groundText = { checked: textChecked, below: textLow.length };

      // Without scripts, everything is there too, and the search never sends the words.
      const bare = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
      const bp = await bare.newPage();
      await bp.goto(origin + '/', { waitUntil: 'networkidle' });
      check(await bp.evaluate(() => { const r = document.querySelector('[data-direction="begegnung"]'); return !r.dataset.mode && [...r.querySelectorAll('.begegnung-station .begegnung-frame')].every(f => getComputedStyle(f).display !== 'none') && r.querySelectorAll('.begegnung-still').length === 5; }), 'without scripts the story is five finished pictures in the flow');
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
      for (const at of ['.hero', '.begegnung-v2', '.begegnung-v4', '.start']) {
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
      // (W4: A8's .signal scene is gone; the hero, a full screen with no colour hook of its own, stands in.)
      await lp.evaluate(() => { const s = document.querySelector('.hero'); s.setAttribute('data-air-reveal', ''); scrollTo(0, s.getBoundingClientRect().top + scrollY); });
      await lp.waitForTimeout(500);
      const asked = await lp.evaluate(() => Number(getComputedStyle(document.querySelector('.air')).getPropertyValue('--air-reveal')));
      await lp.evaluate(() => document.querySelector('.hero').removeAttribute('data-air-reveal')); await lp.waitForTimeout(400);
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

      // With motion (W4 Begegnung): one pinned stage beside five captions in the flow; every layer is a
      // CSS scroll-driven animation of the track's view timeline, so the picture is a function of the
      // scroll position: forward, back, after a jump or a fling; every station legible.
      const moving = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
      await moving.addInitScript(colorKit);
      const mp = await moving.newPage();
      await mp.goto(origin + '/', { waitUntil: 'load' });
      await mp.evaluate(() => document.fonts.ready);
      const frame = () => mp.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      const settle = async () => { await frame(); await mp.waitForTimeout(300); };
      const station = k => mp.evaluate(k => { const s = document.querySelectorAll('.begegnung-station')[k], h = parseFloat(getComputedStyle(document.querySelector('.begegnung-pin')).top) || 0; return Math.round(s.getBoundingClientRect().top + scrollY - h); }, k);
      const picture = () => mp.evaluate(() => [...document.querySelectorAll('.begegnung-pin .begegnung-canvas > :not(noscript)')].map(e => { const s = getComputedStyle(e); return Math.round(Number(s.opacity) * 100) + (s.transform === 'none' ? '' : s.transform.replace(/-?[\d.]+/g, n => (+n).toFixed(1))); }).join('|'));
      const go = async y => { await mp.evaluate(y => scrollTo(0, y), y); await settle(); };
      check(await mp.evaluate(() => document.querySelector('[data-direction="begegnung"]').dataset.mode) === 'pin', 'begegnung: pinned with motion at 1440×900');
      const seen = [];
      for (let k = 0; k < 5; k++) {
        await go(await station(k)); seen.push(await picture());
        const at = await mp.evaluate(() => { const p = document.querySelector('.begegnung-pin'); return { pinned: Math.abs(p.getBoundingClientRect().top - parseFloat(getComputedStyle(p).top)) < 2, loaded: [...p.querySelectorAll('img')].every(i => i.src && i.complete) }; });
        check(at.pinned && at.loaded, `begegnung station ${k + 1}: the stage is pinned and its layers are loaded (${JSON.stringify(at)})`);
      }
      check(new Set(seen).size === 5, 'begegnung: five different pictures');
      for (let k = 3; k >= 0; k--) { await go(await station(k)); check(await picture() === seen[k], `begegnung: scrolling back to station ${k + 1} shows its picture again`); }
      await go(await mp.evaluate(() => document.documentElement.scrollHeight)); await go(await station(3));
      check(await picture() === seen[3], 'begegnung: a jump back lands on station 4’s picture');
      const second = await station(1);
      await mp.evaluate(y => { for (let k = 0; k <= 40; k++) scrollTo(0, (k * 977) % (y * 4)); scrollTo(0, y); }, second); await settle();
      check(await picture() === seen[1], 'begegnung: after a fast fling the stage shows the picture for where the page stopped');
      // Every station's words keep their contrast, over the real pixels (noise and colour beneath).
      for (let k = 0; k < 5; k++) {
        await go(await station(k));
        await mp.evaluate(k => { document.querySelectorAll('[aria-hidden="true"]:not(.icon):not(.mark)').forEach(e => { e.dataset.qaHidden = e.style.visibility; e.style.visibility = 'hidden'; });
          document.querySelectorAll('.begegnung-station').forEach((s, j) => { s.inert = j !== k; }); }, k);
        const audit = await mp.evaluate(pageAudit, { modal: false, touch: false });
        const boxes = await mp.evaluate(k => [...document.querySelectorAll('.begegnung-station')[k].querySelectorAll('.begegnung-title, .begegnung-body, .begegnung-status, .begegnung-plate-text, .begegnung-legend li')].map(e => { const r = e.getBoundingClientRect(); return { x: Math.max(0, Math.round(r.left)), y: Math.max(0, Math.round(r.top)), width: Math.round(r.width), height: Math.round(r.height), color: getComputedStyle(e).color }; }).filter(b => b.y + b.height <= innerHeight), k);
        await mp.evaluate(() => { document.querySelectorAll('[inert]').forEach(e => { e.inert = false; }); document.querySelectorAll('[data-qa-hidden]').forEach(e => { e.style.visibility = e.dataset.qaHidden; delete e.dataset.qaHidden; }); });
        check(audit.contrast.failures.length === 0, `begegnung station ${k + 1}: text below its contrast minimum: ${audit.contrast.failures.slice(0, 2).map(f => `${f.node} ${f.text} ${f.ratio}`).join('; ')}`);
        check(audit.overflow.scrollWidth <= audit.overflow.clientWidth, `begegnung station ${k + 1}: no horizontal overflow`);
        const tag = await mp.addStyleTag({ content: '.begegnung-station * { color: transparent !important; }' });
        for (const box of boxes) {
          const png = await mp.screenshot({ clip: { x: box.x, y: box.y, width: Math.max(1, box.width), height: Math.max(1, box.height) } });
          const ratio = await mp.evaluate(async ([src, color]) => {
            const img = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + src; });
            const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
            const d = g.getImageData(0, 0, c.width, c.height).data, lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }, L = (r, g, b) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
            const ls = []; for (let k = 0; k < d.length; k += 4) ls.push(L(d[k], d[k + 1], d[k + 2])); ls.sort((a, b) => a - b);
            const [r, g2, b] = color.match(/\d+/g).map(Number), t = L(r, g2, b), bg = ls[Math.floor(ls.length * .02)], hi = ls[Math.floor(ls.length * .98)];
            return Math.min((Math.max(t, bg) + .05) / (Math.min(t, bg) + .05), (Math.max(t, hi) + .05) / (Math.min(t, hi) + .05));
          }, [png.toString('base64'), box.color]);
          check(ratio >= 4.5, `begegnung station ${k + 1}: a line over the real background keeps ${ratio.toFixed(2)}:1`);
        }
        await tag.evaluate(n => n.remove());
      }
      // Placement (W4 round 2, verification m7; replaces A8's "nothing leaves the stage" check): at every
      // station's end state, at five sizes, every label in the picture lies wholly on screen and on no
      // other label, no label covers the station's words, and every line of the words is what is on top
      // at its centre (nothing covers the legend, a statement or a plate).
      for (const [w, h] of [[1440, 900], [1280, 720], [390, 844], [360, 640], [320, 640]]) {
        await mp.setViewportSize({ width: w, height: h }); await frame(); await frame(); await mp.waitForTimeout(200);
        for (let k = 1; k <= 5; k++) {
          const y = await mp.evaluate(k => { const r = document.querySelector('[data-direction="begegnung"]');
            if (r.dataset.mode === 'pin') { const s = document.querySelectorAll('.begegnung-station')[k - 1], top = parseFloat(getComputedStyle(document.querySelector('.begegnung-pin')).top) || 0; return s.getBoundingClientRect().top + scrollY - top; }
            const f = document.querySelector(`.begegnung-v${k} .begegnung-frame`).getBoundingClientRect(); return f.top + scrollY - (innerHeight - .45 * (innerHeight + f.height)); }, k);
          await go(Math.max(0, Math.round(y)));
          const place = await mp.evaluate(k => {
            const r = document.querySelector('[data-direction="begegnung"]'), pin = r.dataset.mode === 'pin', box = e => e.getBoundingClientRect();
            const tags = [...r.querySelectorAll(`${pin ? '.begegnung-pin' : `.begegnung-v${k}`} .begegnung-tag`)].filter(t => Number(getComputedStyle(t).opacity) > .5).map(t => ({ text: t.textContent.trim().slice(0, 24), b: box(t) }));
            const words = r.querySelectorAll('.begegnung-words')[k - 1], wb = box(words), hit = (a, b) => a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
            const lines = [...words.querySelectorAll('.begegnung-title, .begegnung-body, .begegnung-status, .begegnung-plate-text, .begegnung-legend li')].map(e => { const b = box(e), x = b.left + b.width / 2, y = b.top + b.height / 2;
              const top = y > 0 && y < innerHeight ? document.elementFromPoint(x, y) : null; return { text: e.textContent.trim().slice(0, 24), onTop: !top || words.contains(top), inView: b.left >= 0 && b.right <= innerWidth }; });
            return { pin, vw: innerWidth, tags, off: tags.filter(t => t.b.left < 0 || t.b.right > innerWidth).map(t => [t.text, Math.round(t.b.left), Math.round(t.b.right)]),
              clash: tags.flatMap((a, i) => tags.slice(i + 1).filter(b => hit(a.b, b.b)).map(b => [a.text, b.text])), onWords: tags.filter(t => hit(t.b, wb)).map(t => t.text),
              covered: lines.filter(l => !l.onTop).map(l => l.text), outside: lines.filter(l => !l.inView).map(l => l.text) };
          }, k);
          check(place.off.length === 0, `${w}×${h} S${k}: every label in the picture is wholly on screen (${JSON.stringify(place.off)})`);
          check(place.clash.length === 0, `${w}×${h} S${k}: no label lies on another (${JSON.stringify(place.clash)})`);
          check(place.onWords.length === 0, `${w}×${h} S${k}: no label covers the station's words (${JSON.stringify(place.onWords)})`);
          check(place.covered.length === 0 && place.outside.length === 0, `${w}×${h} S${k}: nothing covers the words, and they stay on screen (${JSON.stringify(place)})`.slice(0, 400));
        }
      }
      await mp.setViewportSize({ width: 1440, height: 900 }); await frame();
      // Pinned only where every caption fits one screen; short screens and phones keep the stations in the flow.
      for (const [w, h, want] of [[1024, 768, 'pin'], [1280, 720, 'pin'], [844, 390, 'flow'], [375, 667, 'flow'], [390, 844, 'flow']]) {
        await mp.setViewportSize({ width: w, height: h }); await frame(); await frame();
        check(await mp.evaluate(() => document.querySelector('[data-direction="begegnung"]').dataset.mode ?? 'flow') === want, `${w}×${h}: the story is ${want}`);
      }
      await moving.close();
      report.journeys.composition = 'A7 hero at 1440/1024/390/320 (the field placed at the optical centre and dominant, balanced headline a step below it, criteria floating clear of everything, three promises); the noise in the page flow beneath all content (scrolling, multiply, the field free of it), the fingerprint once; a living atmosphere (alive when idle, calm, quiet towards white and grey at rest, one bright world, still under reduced motion, paused when hidden, the hand never moves the search, nothing written on the root); value → story → start; the Begegnung story (W4): five stations in the flow without scripts, under reduced motion and on short screens or phones, pinned with motion on wide screens (forward, back, jump, fling, contrast per station over the real background)';
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
