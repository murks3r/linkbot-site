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
      // Emphasis is weight, scale and tone. No highlighter, marker or painted underline anywhere:
      // the only gradients are the sky's (a layer that carries no text), and no <mark> has a fill.
      const markers = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => {
        const s = getComputedStyle(e);
        const text = [...e.childNodes].some(n => n.nodeType === Node.TEXT_NODE && /\S/.test(n.data));
        return (/gradient\(/.test(s.backgroundImage) && (text || !e.closest('.sky'))) || (e.localName === 'mark' && s.backgroundColor !== 'rgba(0, 0, 0, 0)');
      }).map(e => `${e.localName}.${[...e.classList].join('.')}`));
      check(markers.length === 0, `${route}: marker treatment on ${markers.slice(0, 4).join(', ')}`);
      // Reflow at every width, then the app's WCAG audit at 1440 and 390 (as its quality gate does).
      const cdp = await context.newCDPSession(page);
      await cdp.send('DOM.enable'); await cdp.send('Accessibility.enable');
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: HEIGHTS[width] });
        await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
        // Purely decorative text (the orbit's illustration, aria-hidden) is exempt from 1.4.3 and 1.4.12;
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

    // ── 2. The composition (Concept A5): one focal opening viewport, then the story on pinned
    //       scenes driven by scroll position, the hinge, the boundary, the invitation. ──
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto(origin + '/', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      for (const width of [1440, 1024, 390, 320]) {
        await page.setViewportSize({ width, height: HEIGHTS[width] });
        await page.evaluate(() => { scrollTo(0, 0); return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); });
        const hero = await page.evaluate(() => {
          const box = el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, mid: (r.left + r.right) / 2, midY: (r.top + r.bottom) / 2, width: r.width }; };
          const h1 = document.querySelector('.hero h1'), note = document.querySelector('.hero .hero-note'), field = document.querySelector('.hero .search-box'), btn = document.querySelector('.hero .btn-primary');
          const soft = h1.querySelector('.h1-soft'), blocks = [...document.querySelector('.hero-inner').children], h = h1.getBoundingClientRect();
          const fills = [...document.querySelectorAll('.hero a, .hero button')].filter(e => getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)').map(e => e.innerText.trim());
          return { vw: innerWidth, vh: innerHeight, h1: box(h1), note: box(note), field: box(field), btn: box(btn),
            align: [h1, note].map(e => getComputedStyle(e).textAlign), h1Size: parseFloat(getComputedStyle(h1).fontSize),
            weight: Number(getComputedStyle(h1).fontWeight), softWeight: Number(getComputedStyle(soft).fontWeight), soft: soft.textContent,
            beside: blocks.filter(e => { const r = e.getBoundingClientRect(); return e !== h1 && r.bottom > h.top + 1 && r.top < h.bottom - 1; }).length,
            text: h1.innerText, fills, order: blocks.map(e => e.className.split(' ')[0] || e.localName),
            describedBy: document.getElementById('q-hero').getAttribute('aria-describedby'),
            ctaFilled: getComputedStyle(document.querySelector('.masthead-cta')).backgroundColor !== 'rgba(0, 0, 0, 0)' };
        });
        check(hero.text === 'Find work that fits.\nKeep your privacy.', `${width}: the headline (${JSON.stringify(hero.text)})`);
        check(hero.soft === 'Keep your privacy.' && hero.softWeight < hero.weight, `${width}: the second line is the same voice, softened by weight (${hero.softWeight} < ${hero.weight}), not marked`);
        for (const [name, b] of Object.entries({ h1: hero.h1, note: hero.note, field: hero.field }))
          check(Math.abs(b.mid - hero.vw / 2) <= 2, `${width}: hero ${name} is centred (mid ${Math.round(b.mid)} of ${hero.vw})`);
        check(hero.align.every(a => a === 'center'), `${width}: headline and note are centred text`);
        check(hero.beside === 0, `${width}: nothing sits beside the headline`);
        check(JSON.stringify(hero.order) === JSON.stringify(['h1', 'hero-search', 'hero-note']), `${width}: headline, then the search, then one line (${hero.order})`);
        check(hero.describedBy === 'hero-note', `${width}: the note describes the field for assistive technology`);
        // The search is the focal point: in the first viewport, near its optical centre, wide, and the
        // headline composed above it rather than dominating it.
        check(hero.field.top < hero.vh && hero.field.bottom <= hero.vh, `${width}: the search is in the first viewport`);
        const centre = width >= 1024 ? hero.field.midY / hero.vh : (hero.field.top + hero.btn.bottom) / 2 / hero.vh;
        check(centre >= .34 && centre <= .56, `${width}: the search sits near the optical centre (${Math.round(centre * 100)} % of the viewport)`);
        check(hero.field.width >= (width >= 1024 ? 640 : hero.vw - 48), `${width}: the search is wide (${Math.round(hero.field.width)} px)`);
        check(hero.h1Size >= (width >= 1024 ? 56 : width * .09) && hero.h1Size <= (width >= 1024 ? 84 : 48), `${width}: the headline is composed, not monumental (${hero.h1Size} px)`);
        check(hero.h1.bottom < hero.field.top, `${width}: the headline sits above the search`);
        check(JSON.stringify(hero.fills) === JSON.stringify(['Search']), `${width}: the pink Search is the hero's only filled action (${hero.fills})`);
        check(!hero.ctaFilled, `${width}: the header's action stays quiet while the hero's search is in view`);
      }
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.locator('#q-start').scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      check(await page.evaluate(() => getComputedStyle(document.querySelector('.masthead-cta')).backgroundColor !== 'rgba(0, 0, 0, 0)'), 'once the hero has scrolled away, the header offers the search action');
      const stages = await page.evaluate(() => [...document.querySelectorAll('main > [data-stage]')].map(s => s.dataset.stage));
      check(JSON.stringify(stages) === JSON.stringify(['value', 'story', 'trust', 'boundary', 'start']), `the home runs value → story → trust → boundary → start (${stages})`);
      const scenes = await page.evaluate(() => [...document.querySelectorAll('[data-scene]')].map(s => ({ name: s.className.split(' ')[1], beats: s.dataset.beats.split(',').length, captions: [...s.querySelectorAll('[data-caption] h2')].map(h => h.textContent), live: s.classList.contains('is-live') })));
      check(JSON.stringify(scenes.map(s => [s.name, s.beats])) === JSON.stringify([['orbit', 5], ['priorities', 3], ['evidence', 2], ['boundary', 3]]), `four scenes with their beats (${JSON.stringify(scenes.map(s => [s.name, s.beats]))})`);
      check(scenes.every(s => s.captions.length === s.beats && !s.live), 'reduced motion: every scene is static, with one statement per beat, all readable in order');
      check(scenes[0].captions[0] === 'Job search runs in circles.' && scenes[0].captions[4] === 'Four fit. The rest step back.', `the loop story (${scenes[0].captions.join(' | ')})`);
      const home = await page.evaluate(() => document.querySelector('main').innerText);
      check(!/What works today|short phrases|Write it in/i.test(home), 'no status section and no writing instructions on the home page');
      check(/Illustration/.test(home) && /interpreter/.test(home), 'the illustrations say they are illustrations, and the words are credited to the interpreter');
      check(/tested in staging/.test(home) && /in development and not live/.test(home), 'sharing and private matching carry their real status');
      // Reduced motion: the final states are simply there.
      const still = await page.evaluate(() => ({
        fits: document.querySelectorAll('.orbit-card[data-fit]').length, typed: getComputedStyle(document.querySelector('.orbit-typed')).clipPath,
        must: getComputedStyle(document.querySelector('.priorities-read .chip[data-must]')).backgroundColor, rows: [...document.querySelectorAll('.evidence-rows > div')].map(d => getComputedStyle(d).opacity),
        share: getComputedStyle(document.querySelector('.boundary-share')).opacity, sky: !!document.querySelector('body[data-sky] .sky') }));
      check(still.fits === 4 && still.typed === 'inset(0px 0% 0px 0px)' || still.typed === 'inset(0px)', `reduced motion: the words are typed and four fit (${still.typed})`);
      check(still.rows.every(o => o === '1') && still.share === '1', 'reduced motion: the evidence rows and the shared card are simply there');
      check(still.sky, 'the sky lies under the home');
      await context.close();

      // Without scripts, everything is there too, and the search never sends the words.
      const bare = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
      const bp = await bare.newPage();
      await bp.goto(origin + '/', { waitUntil: 'networkidle' });
      check(await bp.evaluate(() => [...document.querySelectorAll('[data-scene]')].every(s => !s.classList.contains('is-live') && getComputedStyle(s.querySelector('[data-scene-stage]')).position !== 'sticky')), 'without scripts every scene is complete and static');
      check(await bp.locator('#q-hero').count() === 1 && await bp.locator('#q-hero').getAttribute('name') === null, 'without scripts the search is there and never sends the words (no name)');
      await bare.close();

      // With motion: one number per scene, from the scroll position, drives everything, so each scene
      // plays forward, reverses, survives jumps, flings and resizes, and stays legible at every beat.
      const moving = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
      await moving.addInitScript(colorKit);
      const mp = await moving.newPage();
      await mp.goto(origin + '/', { waitUntil: 'networkidle' });
      await mp.evaluate(() => document.fonts.ready);
      const frame = () => mp.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      const geometry = i => mp.evaluate(i => { const root = document.querySelectorAll('[data-scene]')[i], s = root.querySelector('[data-scene-stage]'); const header = parseFloat(getComputedStyle(s).top) || 0;
        return { live: root.classList.contains('is-live'), start: root.getBoundingClientRect().top + scrollY - header, span: root.offsetHeight - s.offsetHeight, beats: root.dataset.beats.split(',').map(b => b.split(':').map(Number)) }; }, i);
      const state = i => mp.evaluate(i => {
        const root = document.querySelectorAll('[data-scene]')[i], s = root.querySelector('[data-scene-stage]'), r = s.getBoundingClientRect();
        const on = [...root.querySelectorAll('[data-caption]')].map(c => Math.round(Number(getComputedStyle(c).opacity) * 100) / 100);
        return { p: Number(s.style.getPropertyValue('--p')), beat: root.dataset.beat ?? null, pinned: Math.abs(r.top - parseFloat(getComputedStyle(s).top)) < 2, on,
          current: [...root.querySelectorAll('[data-caption]')].findIndex(c => c.getAttribute('aria-current') === 'step') }; }, i);
      const names = ['orbit', 'priorities', 'evidence', 'boundary'];
      for (let i = 0; i < 4; i++) {
        const g = await geometry(i);
        check(g.live, `${names[i]}: live with motion at 1440×900`);
        const at = async p => { await mp.evaluate(y => scrollTo(0, y), Math.round(g.start + p * g.span)); await frame(); return state(i); };
        const mids = g.beats.map(([a, b]) => (a + b) / 2);
        const seen = [];
        for (const [k, p] of mids.entries()) {
          const s = await at(p); seen.push(s);
          check(s.pinned && Math.abs(s.p - p) < .01, `${names[i]} beat ${k + 1}: pinned at p ${p.toFixed(2)} (${JSON.stringify(s)})`);
          check(s.current === k, `${names[i]} beat ${k + 1}: its statement is the current step (current ${s.current})`);
          check(s.on[k] >= .95 && s.on.every((o, j) => j === k || o <= .05), `${names[i]} beat ${k + 1}: one statement owns the stage (${s.on})`);
        }
        // Backwards gives the same frames; a jump from the end lands on the right beat.
        const back = await at(mids[0]);
        check(JSON.stringify(back) === JSON.stringify(seen[0]), `${names[i]}: scrolling back to beat 1 returns the same frame`);
        await mp.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await frame();
        const last = mids.length - 1;
        check(JSON.stringify(await at(mids[last])) === JSON.stringify(seen[last]), `${names[i]}: a jump back lands on the last beat's frame`);
        // A fling: many positions in one frame, only the last one counts.
        await mp.evaluate(({ start, span, p }) => { for (let k = 0; k <= 40; k++) scrollTo(0, start + span * ((k * 7) % 41) / 40); scrollTo(0, start + span * p); }, { start: g.start, span: g.span, p: mids[1] });
        await frame();
        check(JSON.stringify(await state(i)) === JSON.stringify(seen[1]), `${names[i]}: after a fast fling the stage shows the frame for where the page stopped`);
        // Legible at every beat: the app's contrast audit over this scene alone.
        for (const [k, p] of mids.entries()) {
          await at(p);
          await mp.evaluate(i => { document.querySelectorAll('main > *, .masthead, .footer').forEach(e => { e.inert = !e.contains(document.querySelectorAll('[data-scene]')[i]); }); document.querySelectorAll('[data-scene]').forEach((s, j) => { s.inert = j !== i; });
            document.querySelectorAll('[aria-hidden="true"]:not(.icon):not(.mark)').forEach(e => { e.dataset.qaHidden = e.style.visibility; e.style.visibility = 'hidden'; }); }, i);
          const audit = await mp.evaluate(pageAudit, { modal: false, touch: false });
          await mp.evaluate(() => { document.querySelectorAll('[inert]').forEach(e => { e.inert = false; }); document.querySelectorAll('[data-qa-hidden]').forEach(e => { e.style.visibility = e.dataset.qaHidden; delete e.dataset.qaHidden; }); });
          const bad = audit.contrast.failures;
          check(bad.length === 0, `${names[i]} beat ${k + 1}: text below its contrast minimum: ${bad.slice(0, 2).map(f => `${f.node} ${f.text} ${f.ratio}`).join('; ')}`);
          check(audit.overflow.scrollWidth <= audit.overflow.clientWidth, `${names[i]} beat ${k + 1}: no horizontal overflow`);
        }
      }
      // Resizing keeps the frame for the position (geometry is measured again).
      for (const [w, h] of [[1024, 768], [390, 844], [1440, 900]]) {
        await mp.setViewportSize({ width: w, height: h }); await frame(); await frame();
        const g = await geometry(0); const p = (g.beats[2][0] + g.beats[2][1]) / 2;
        await mp.evaluate(y => scrollTo(0, y), Math.round(g.start + p * g.span)); await frame();
        const s = await state(0);
        check(g.live && s.current === 2 && Math.abs(s.p - p) < .01 && s.pinned, `${w}×${h}: after resizing, the orbit's third beat is still the third beat (${JSON.stringify(s)})`);
      }
      // A screen too short for a stage gets the complete story instead.
      await mp.setViewportSize({ width: 844, height: 390 }); await frame(); await frame();
      check(await mp.evaluate(() => [...document.querySelectorAll('[data-scene]')].every(s => !s.classList.contains('is-live'))), 'a short landscape screen gets the static story');
      await moving.close();
      report.journeys.composition = 'focal hero at 1440/1024/390/320; value → story → trust → boundary → start; four scenes static (no JS, reduced motion, short screen) and live (beats, reverse, jump, fling, resize, contrast and overflow per beat)';
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
    check(await field.getAttribute('aria-invalid') === 'true' && await field.getAttribute('aria-describedby') === 'q-hero-alert hero-note', 'the explanation is tied to the field, with the note');
    check(await page.evaluate(() => document.activeElement?.id) === 'q-hero', 'an empty search keeps focus in the field');
    await field.fill('Backend');
    check(await page.locator('#q-hero-alert').isHidden() && await field.getAttribute('aria-invalid') === null && await field.getAttribute('aria-describedby') === 'hero-note', 'typing clears the explanation and keeps the note');
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
