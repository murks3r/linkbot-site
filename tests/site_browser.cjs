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
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };

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
      // Concept A4: emphasis is weight, scale and tone. No highlighter, marker or painted underline
      // anywhere: no gradient backgrounds, and no <mark> with a fill.
      const markers = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => {
        const s = getComputedStyle(e);
        return /gradient\(/.test(s.backgroundImage) || (e.localName === 'mark' && s.backgroundColor !== 'rgba(0, 0, 0, 0)');
      }).map(e => `${e.localName}.${[...e.classList].join('.')}`));
      check(markers.length === 0, `${route}: marker treatment on ${markers.slice(0, 4).join(', ')}`);
      // Reflow at every width, then the app's WCAG audit at 1440 and 390 (as its quality gate does).
      const cdp = await context.newCDPSession(page);
      await cdp.send('DOM.enable'); await cdp.send('Accessibility.enable');
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: HEIGHTS[width] });
        await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
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

    // ── 2. The owner's composition (Concept A4): a centred, monumental hero; one question and
    //       one scroll-linked story; trust composed off the centre line on purpose; then first use.
    //       value → story → trust → start, with no status section on the home page. ──
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto(origin + '/', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      for (const width of [1440, 1024, 390, 320]) {
        await page.setViewportSize({ width, height: HEIGHTS[width] });
        await page.evaluate(() => { scrollTo(0, 0); return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); });
        const hero = await page.evaluate(() => {
          const box = el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, mid: (r.left + r.right) / 2, width: r.width }; };
          const h1 = document.querySelector('.hero h1'), lede = document.querySelector('.hero .lede'), field = document.querySelector('.hero .search-box');
          const soft = h1.querySelector('.h1-soft'), blocks = [...document.querySelector('.hero-inner').children], h = h1.getBoundingClientRect();
          return { vw: innerWidth, vh: innerHeight, h1: box(h1), lede: box(lede), field: box(field),
            align: [h1, lede].map(e => getComputedStyle(e).textAlign), h1Size: parseFloat(getComputedStyle(h1).fontSize),
            weight: Number(getComputedStyle(h1).fontWeight), softWeight: Number(getComputedStyle(soft).fontWeight), soft: soft.textContent,
            beside: blocks.filter(e => { const r = e.getBoundingClientRect(); return e !== h1 && r.bottom > h.top + 1 && r.top < h.bottom - 1; }).length,
            text: h1.innerText, hint: !!document.querySelector('.hero [data-hint], .hero .search-hint'),
            ctaFilled: getComputedStyle(document.querySelector('.masthead-cta')).backgroundColor !== 'rgba(0, 0, 0, 0)' };
        });
        check(hero.text === 'Find work that fits.\nKeep your privacy.', `${width}: the headline (${JSON.stringify(hero.text)})`);
        check(hero.soft === 'Keep your privacy.' && hero.softWeight < hero.weight, `${width}: the second line is the same voice, softened by weight (${hero.softWeight} < ${hero.weight}), not marked`);
        for (const [name, b] of Object.entries({ h1: hero.h1, lede: hero.lede, field: hero.field }))
          check(Math.abs(b.mid - hero.vw / 2) <= 2, `${width}: hero ${name} is centred (mid ${Math.round(b.mid)} of ${hero.vw})`);
        check(hero.align.every(a => a === 'center'), `${width}: headline and sentence are centred text`);
        check(hero.beside === 0, `${width}: nothing sits beside the headline (no two-column hero)`);
        check(hero.field.top < hero.vh && hero.field.bottom <= hero.vh, `${width}: the search is in the first viewport`);
        check(hero.field.width >= (width >= 1024 ? 720 : hero.vw - 48), `${width}: the search is wide (${Math.round(hero.field.width)} px)`);
        // Monumental: at least 80 px on wide screens, and a tenth of the width on phones.
        check(hero.h1Size >= (width >= 1024 ? 80 : width * .1), `${width}: the headline is monumental (${hero.h1Size} px)`);
        check(!hero.hint, `${width}: no instruction line under the hero's search`);
        check(!hero.ctaFilled, `${width}: the header's action stays quiet while the hero's search is in view`);
      }
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.locator('#q-start').scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      check(await page.evaluate(() => getComputedStyle(document.querySelector('.masthead-cta')).backgroundColor !== 'rgba(0, 0, 0, 0)'), 'once the hero has scrolled away, the header offers the search action');
      const story = await page.evaluate(() => [...document.querySelectorAll('main > section')].map(s => ({ stage: s.dataset.stage,
        head: (() => { const h = s.querySelector('h1, h2'); const r = h.getBoundingClientRect(); return { align: getComputedStyle(h).textAlign, mid: (r.left + r.right) / 2 }; })() })));
      check(JSON.stringify(story.map(s => s.stage)) === JSON.stringify(['value', 'story', 'trust', 'start']), `the home argues in order: value → story → trust → start (${story.map(s => s.stage)})`);
      for (const s of story.filter(s => s.stage !== 'trust')) check(s.head.align === 'center' && Math.abs(s.head.mid - 720) <= 2, `${s.stage}: its heading sits on the page's centre line`);
      const trust = story.find(s => s.stage === 'trust');
      check(trust && trust.head.align !== 'center' && trust.head.mid < 620, 'trust is composed off the centre line on purpose (editorial variation, not one monotonous axis)');
      const home = await page.evaluate(() => document.querySelector('main').innerText);
      check(!/What works today|short phrases|Write it in/i.test(home), 'no status section and no writing instructions on the home page');
      // Reduced motion: the story is complete at normal height, nothing waits for scrolling.
      const still = await page.evaluate(() => {
        const root = document.querySelector('[data-clarity]'), stage = root.querySelector('[data-clarity-stage]'), listing = root.querySelector('.clarity-listing');
        return { live: root.classList.contains('is-live'), position: getComputedStyle(stage).position, steps: [...root.querySelectorAll('[data-step]')].map(li => li.innerText.replace(/\s+/g, ' ').trim()),
          listing: Number(getComputedStyle(listing).opacity), clip: getComputedStyle(listing).clipPath, words: Number(getComputedStyle(root.querySelector('.clarity-words')).opacity),
          fits: [...root.querySelectorAll('.clarity-field li[data-fit]')].map(li => li.textContent) };
      });
      check(!still.live && still.position !== 'sticky', 'reduced motion: the story is not a sticky stage');
      check(still.steps.join(' | ') === '1 Say what matters to you. | 2 Linkbot reads each opening against it. | 3 You see why, and you decide.', `the story's three steps (${still.steps.join(' | ')})`);
      check(still.listing === 1 && still.clip === 'none' && still.words === 1, 'reduced motion: the words and the opened listing are simply there');
      check(still.fits.length === 4, 'four openings fit the reading and come forward');
      await context.close();

      // Without scripts, everything is there too.
      const bare = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
      const bp = await bare.newPage();
      await bp.goto(origin + '/', { waitUntil: 'networkidle' });
      check(await bp.evaluate(() => !document.querySelector('[data-clarity]').classList.contains('is-live') && getComputedStyle(document.querySelector('.clarity-listing')).opacity === '1'), 'without scripts the story is complete');
      check(await bp.locator('#q-hero').count() === 1 && await bp.locator('#q-hero').getAttribute('name') === null, 'without scripts the search is there and never sends the words (no name)');
      await bare.close();

      // With motion: one number from the scroll position drives the stage, so it plays forward,
      // reverses, survives jumps, flings and resizes, and stays legible at every beat.
      const moving = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
      await moving.addInitScript(colorKit);
      const mp = await moving.newPage();
      await mp.goto(origin + '/', { waitUntil: 'networkidle' });
      await mp.evaluate(() => document.fonts.ready);
      check(await mp.evaluate(() => document.querySelector('[data-clarity]').classList.contains('is-live')), 'with motion, the story is a live stage');
      const frame = () => mp.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      const geometry = () => mp.evaluate(() => { const t = document.querySelector('[data-clarity-track]'), s = document.querySelector('[data-clarity-stage]'); const header = parseFloat(getComputedStyle(s).top) || 0;
        return { start: t.getBoundingClientRect().top + scrollY - header, span: t.offsetHeight - s.offsetHeight }; });
      const state = () => mp.evaluate(() => {
        const root = document.querySelector('[data-clarity]'), stage = root.querySelector('[data-clarity-stage]');
        const r = stage.getBoundingClientRect(), listing = root.querySelector('.clarity-listing'), lr = listing.getBoundingClientRect();
        // How much of the listing is really on screen: hit-test ten points down its middle (a clipped
        // part is not hit), rather than trusting its style.
        const hits = Array.from({ length: 10 }, (_, i) => document.elementFromPoint(lr.left + lr.width / 2, lr.top + lr.height * (i + .5) / 10)).filter(e => e && listing.contains(e)).length;
        const color = sel => getComputedStyle(root.querySelector(sel)).color;
        return { p: Number(stage.style.getPropertyValue('--p')), step: [...root.querySelectorAll('[data-step]')].findIndex(li => li.getAttribute('aria-current') === 'step'),
          pinned: Math.abs(r.top - parseFloat(getComputedStyle(stage).top)) < 2, words: Math.round(Number(getComputedStyle(root.querySelector('.clarity-words')).opacity) * 100) / 100,
          shown: lr.bottom <= innerHeight && lr.top >= 0 ? hits / 10 : -1, fit: color('.clarity-field li[data-fit]'), other: color('.clarity-field li:not([data-fit])') };
      });
      let g = await geometry();
      const at = async p => { await mp.evaluate(y => scrollTo(0, y), Math.round(g.start + p * g.span)); await frame(); return state(); };
      const s0 = await at(0), s1 = await at(.26), s2 = await at(.55), s3 = await at(.85);
      check(s0.pinned && s0.p < .01 && s0.words === 0 && s0.shown === 0 && s0.step === -1, `p 0: the field alone, waiting (${JSON.stringify(s0)})`);
      check(Math.abs(s1.p - .26) < .01 && s1.words === 1 && s1.step === 0, `p .26: the words arrive, step 1 (${JSON.stringify(s1)})`);
      check(s2.step === 1 && s2.fit !== s2.other, `p .55: the field focuses, step 2 (${JSON.stringify(s2)})`);
      check(s3.step === 2 && s3.shown === 1, `p .85: one listing has opened, step 3 (${JSON.stringify(s3)})`);
      // Backwards plays it in reverse, without a reset: the same position gives the same frame.
      const back = await at(.26);
      check(JSON.stringify(back) === JSON.stringify(s1), `scrolling back to .26 returns the same frame (${JSON.stringify(back)})`);
      check((await at(0)).shown === 0, 'scrolling back to the start closes the listing again');
      // A jump past the story and straight back to its middle lands on the right frame.
      await mp.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await frame();
      check(JSON.stringify(await at(.55)) === JSON.stringify(s2), 'a jump back into the middle shows the middle frame');
      // A fling: many positions within one frame; only the last one counts.
      await mp.evaluate(({ start, span }) => { for (let i = 0; i <= 40; i++) scrollTo(0, start + span * ((i * 7) % 41) / 40); scrollTo(0, start + span * .85); }, g);
      await frame();
      check(JSON.stringify(await state()) === JSON.stringify(s3), 'after a fast fling the stage shows the frame for where the page stopped');
      // Resizing keeps the frame for the position (geometry is measured again).
      for (const [w, h] of [[1024, 768], [390, 844], [1440, 900]]) {
        await mp.setViewportSize({ width: w, height: h }); await frame(); await frame();
        g = await geometry();
        const s = await at(.55);
        check(s.step === 1 && Math.abs(s.p - .55) < .01 && s.pinned, `${w}×${h}: after resizing, .55 is still the focus frame (${JSON.stringify(s)})`);
      }
      // Legible at every beat: the app's contrast audit over the stage, at each step.
      for (const p of [0, .26, .55, .85, 1]) {
        await at(p);
        // Everything outside the story is made inert for this check, so every finding is the story's.
        await mp.evaluate(() => document.querySelectorAll('main > section:not(#story), .masthead, .footer').forEach(e => { e.inert = true; }));
        const audit = await mp.evaluate(pageAudit, { modal: false, touch: false });
        await mp.evaluate(() => document.querySelectorAll('[inert]').forEach(e => { e.inert = false; }));
        const inStage = audit.contrast.failures;
        check(inStage.length === 0, `p ${p}: story text below its contrast minimum: ${inStage.slice(0, 2).map(f => `${f.text} ${f.ratio}`).join('; ')}`);
      }
      // A screen too short for a stage gets the complete story instead.
      await mp.setViewportSize({ width: 844, height: 390 }); await frame(); await frame();
      check(await mp.evaluate(() => !document.querySelector('[data-clarity]').classList.contains('is-live')), 'a short landscape screen gets the static story');
      await moving.close();
      report.journeys.composition = 'centred hero at 1440/1024/390/320, value → story → trust → start, trust off-axis, story static (no JS, reduced motion, short screen) and live (forward, reverse, jump, fling, resize, contrast per beat)';
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
    check(await page.locator('#q-hero-alert').isHidden() && await field.getAttribute('aria-invalid') === null, 'typing clears the explanation');
    await field.fill('Backend engineer, remote, no management');
    await field.press('Enter');
    await page.waitForURL(/\/talent/);
    const handed = new URL(page.url());
    check(handed.pathname === '/talent' && handed.search === '', `handoff address ${page.url()}`);
    check(handed.hash === '#/search?q=' + encodeURIComponent('Backend engineer, remote, no management'), `handoff fragment ${handed.hash}`);
    report.journeys.handoff = handed.pathname + handed.hash;
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const examples = await page.locator('.search-try a').evaluateAll(as => as.map(a => a.getAttribute('href')));
    check(examples.length === 3 && examples.every(h => h.startsWith('/talent#/search?q=')), `example links ${examples}`);
    await page.locator('#q-start').fill('Data engineer, remote');
    await page.locator('#q-start').press('Enter');
    await page.waitForURL(/\/talent/);
    check(new URL(page.url()).hash === '#/search?q=' + encodeURIComponent('Data engineer, remote'), 'the closing search hands off too');

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
