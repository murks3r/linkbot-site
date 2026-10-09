/**
 * Browser journey for the agency page, run against the built static preview.
 *
 * It exercises the interactive example, the fail-closed review states, keyboard
 * access, the mobile viewport and the mailto enquiry handoff — and asserts that
 * the page never transmits form data anywhere. No real candidate data, no
 * submissions and no outbound contacts are involved.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.AGENCY_PREVIEW_ORIGIN || 'http://127.0.0.1:4321';
const ALLOWED_HOSTS = new Set([new URL(baseUrl).host, 'fonts.googleapis.com', 'fonts.gstatic.com']);

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 840 } });
  const page = await context.newPage();
  const requests = [];
  const pageErrors = [];
  page.on('request', (request) => requests.push({ url: request.url(), method: request.method() }));
  page.on('pageerror', (error) => pageErrors.push(String(error)));

  await page.goto(`${baseUrl}/for-agencies`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Explainable shortlists/ }).waitFor();
  assert.match(await page.title(), /Linkbot for Recruiting Agencies/);

  // --- Claims discipline: the page must not assert performance it cannot show.
  const bodyText = await page.locator('body').innerText();
  const bannedPhrases = [
    'Live demo', 'Better shortlists', 'AI-powered', 'time saved', 'hours saved',
    'guaranteed', '% faster', 'placement rate', 'success rate', 'best candidates',
  ];
  for (const phrase of bannedPhrases) {
    assert.equal(bodyText.toLowerCase().includes(phrase.toLowerCase()), false, `unsupported claim on page: ${phrase}`);
  }
  assert.match(bodyText, /demonstration only/i);
  assert.match(bodyText, /fictional|synthetic/i);

  // --- CTA hierarchy: the conversion ask is primary, the example is secondary.
  const hero = page.locator('section[aria-labelledby="agency-hero-heading"]');
  assert.equal(await hero.locator('a.btn-primary').first().getAttribute('href'), '#pilot');
  assert.equal(await hero.locator('a.btn-ghost').first().getAttribute('href'), '#demo');
  assert.match(await page.locator('nav[aria-label="Agency page navigation"]').innerText(), /Interactive example/);
  const pilotCtas = await page.getByRole('link', { name: /Request a scoped pilot/ }).count();
  assert.ok(pilotCtas >= 3, `expected the pilot CTA in nav, hero and after the example (found ${pilotCtas})`);

  const demo = page.getByLabel('Interactive example recruiting workspace');
  await demo.getByRole('radio', { name: /Senior Platform Engineer/ }).waitFor();
  assert.match(await demo.innerText(), /Interactive example · synthetic data/i);
  assert.match(await demo.innerText(), /no data leaves your browser/i);
  assert.equal(await demo.locator('article').filter({ hasText: 'SYNTHETIC PROFILE' }).count(), 3);

  // --- Mandate selection is a radiogroup with keyboard support and roving tabindex.
  const radios = demo.getByRole('radio');
  assert.equal(await radios.count(), 4);
  assert.equal(await demo.locator('[role="radio"][tabindex="0"]').count(), 1);
  await demo.getByRole('radio', { name: /Senior Platform Engineer/ }).focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await demo.getByRole('radio', { name: /Lead Product Designer/ }).getAttribute('aria-checked'), 'true');
  assert.equal(await page.evaluate(() => document.activeElement?.textContent?.includes('Lead Product Designer')), true);
  await page.keyboard.press('End');
  assert.equal(await demo.getByRole('radio', { name: /Staff Security Engineer/ }).getAttribute('aria-checked'), 'true');
  await page.keyboard.press('Home');
  assert.equal(await demo.getByRole('radio', { name: /Senior Platform Engineer/ }).getAttribute('aria-checked'), 'true');

  // --- Hard failure is blocked with a stated reason, and reachable by screen readers.
  const blocked = demo.locator('article').filter({ hasText: 'P-008' });
  assert.equal(await blocked.getByRole('button', { name: 'Add P-008 to shortlist' }).isDisabled(), true);
  assert.match(await blocked.getByText(/Not shortlistable/).innerText(), /EU work location/);
  const describedBy = await blocked.getByRole('button', { name: 'Add P-008 to shortlist' }).getAttribute('aria-describedby');
  assert.equal(await blocked.locator(`#${describedBy}`).count(), 1);

  // --- Evidence inspection keeps unknowns visible.
  const uncertain = demo.locator('article').filter({ hasText: 'P-031' });
  await uncertain.getByRole('button', { name: 'Inspect P-031 evidence' }).click();
  await demo.getByRole('heading', { name: 'Evidence for P-031' }).waitFor();
  assert.match(await demo.getByText('Rotation preference not yet stated').textContent(), /not yet stated/);
  assert.ok(await demo.getByText('Not verified').first().isVisible());

  // --- Shortlisting announces itself and updates the review panel.
  await demo.getByRole('button', { name: 'Add P-014 to shortlist' }).click();
  await demo.getByRole('button', { name: 'Add P-031 to shortlist' }).click();
  await demo.getByRole('heading', { name: /Your working shortlist/ }).waitFor();
  assert.equal((await demo.getByRole('heading', { name: /Your working shortlist/ }).innerText()).trim(), 'Your working shortlist (2)');
  assert.match(await demo.locator('p.sr-only[role="status"]').innerText(), /P-031 added to the shortlist/);
  assert.match(await demo.innerText(), /Required criteria met \(1\)/i);
  assert.match(await demo.innerText(), /Needs verification first \(1\)/i);
  assert.match(await demo.innerText(), /Not eligible \(1\)/i);
  assert.match(await demo.getByText(/EU work location/).first().innerText(), /EU work location/);
  await demo.getByText(/Verification still open before any approach: P-031\./).waitFor();

  // --- Keyboard-only path: reach a shortlist control with Tab and toggle it with Enter.
  await page.evaluate(() => {
    const checked = document.querySelector('[role="radio"][aria-checked="true"]');
    if (checked instanceof HTMLElement) checked.focus();
  });
  let reached = false;
  for (let i = 0; i < 40 && !reached; i++) {
    await page.keyboard.press('Tab');
    const label = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    if (label === 'Remove P-014 from shortlist') {
      await page.keyboard.press('Enter');
      reached = true;
    }
  }
  assert.ok(reached, 'a shortlist control could not be reached with the keyboard alone');
  assert.equal((await demo.getByRole('heading', { name: /Your working shortlist/ }).innerText()).trim(), 'Your working shortlist (1)');

  // --- Candidate-side preview: focus moves in, and back out on close.
  const previewTrigger = demo.getByRole('button', { name: /Preview candidate interest request/ });
  await previewTrigger.click();
  await demo.getByRole('heading', { name: /Would you like to explore this opportunity/ }).waitFor();
  await page.waitForFunction(() => document.activeElement?.closest('[aria-label="Candidate-side interest preview"]') !== null, null, { timeout: 3000 });
  await demo.getByRole('button', { name: 'I’m interested' }).click();
  await demo.getByText('Interest indicated — disclosure remains separate.').waitFor();
  await demo.getByRole('button', { name: 'Simulate permission' }).click();
  await demo.getByText(/No action was taken/).waitFor();
  await demo.getByRole('button', { name: 'Close preview' }).click();
  await page.waitForFunction(() => (document.activeElement?.textContent || '').includes('Preview candidate interest request'), null, { timeout: 3000 });

  // --- A thin pool produces no relaxed shortlist, only a stated explanation.
  await demo.getByRole('radio', { name: /Staff Security Engineer/ }).click();
  await demo.getByText(/No synthetic profile in this example pool meets every hard requirement/).waitFor();
  assert.match(await demo.innerText(), /Not eligible \(2\)/i);
  assert.match(await demo.innerText(), /Required criteria met \(0\)/i);
  const shortlistControls = demo.locator('button[aria-label*="to shortlist"], button[aria-label*="from shortlist"]');
  const controlCount = await shortlistControls.count();
  assert.equal(controlCount, 2);
  for (let i = 0; i < controlCount; i++) {
    assert.equal(await shortlistControls.nth(i).isDisabled(), true, 'no profile in a thin pool may be shortlistable');
  }
  assert.equal(await demo.getByRole('button', { name: /Preview candidate interest request/ }).isDisabled(), true);

  // --- Reset returns the workspace to its opening state.
  await demo.getByRole('button', { name: 'Reset demonstration' }).click();
  assert.equal(await demo.getByRole('radio', { name: /Senior Platform Engineer/ }).getAttribute('aria-checked'), 'true');
  assert.equal((await demo.getByRole('heading', { name: /Your working shortlist/ }).innerText()).trim(), 'Your working shortlist (0)');

  // --- Pilot enquiry: validation errors are explicit, and success is never faked.
  const form = page.getByRole('form', { name: 'Agency pilot email enquiry' });
  await form.locator('[name="agency"]').fill('Example agency');
  await form.locator('[name="email"]').fill('visitor@example.test');
  await form.locator('[name="focus"]').selectOption('Data and AI');
  await form.locator('[name="name"]').fill('   ');
  await form.getByRole('button', { name: /Prepare enquiry in your email app/ }).click();
  await form.getByText(/Nothing was prepared/).waitFor();
  assert.match(await form.getByText(/no email draft was opened and no data left this page/).innerText(), /no data left this page/);
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('name')), 'name');
  assert.match(await form.getByText('Enter the name we should reply to.').innerText(), /Enter the name/);
  assert.equal(await form.getByRole('link', { name: 'Open the draft again' }).count(), 0);

  await form.locator('[name="name"]').fill('Example visitor');
  await form.locator('[name="context"]').fill('One senior data engineering mandate.');
  await form.getByRole('button', { name: /Prepare enquiry in your email app/ }).click();
  await form.getByText(/An email draft was requested from your device/).waitFor();
  assert.match(await form.getByText(/no enquiry has been submitted/).innerText(), /no enquiry has been submitted/);
  const draftHref = await form.getByRole('link', { name: 'Open the draft again' }).getAttribute('href');
  assert.match(draftHref, /^mailto:hello@linkbot\.org\?subject=/);
  assert.match(decodeURIComponent(draftHref.split('&body=')[1]), /Example visitor/);
  await form.getByText('Review the exact message text').click();
  const draftText = await form.getByLabel('Prepared enquiry message text').inputValue();
  assert.match(draftText, /Agency pilot enquiry/);
  assert.match(draftText, /Example agency/);
  assert.equal(/submitted|successfully sent/i.test(draftText), false, 'the draft must not claim a submission');

  // --- Nothing was transmitted. The only non-GET is the local mailto handoff,
  // and exactly one is expected: the invalid submission above produced none.
  const mailtoRequests = requests.filter((request) => request.url.startsWith('mailto:'));
  const httpRequests = requests.filter((request) => !request.url.startsWith('mailto:'));
  assert.equal(mailtoRequests.length, 1, 'exactly one mailto handoff is expected, from the valid enquiry only');
  assert.ok(mailtoRequests[0].url.startsWith('mailto:hello@linkbot.org?subject='), 'the handoff must address the published mailbox');
  for (const request of httpRequests) {
    assert.equal(request.method, 'GET', `unexpected ${request.method} request to ${request.url}`);
    assert.ok(ALLOWED_HOSTS.has(new URL(request.url).host), `unexpected request host: ${request.url}`);
  }
  assert.deepEqual(pageErrors, []);

  // --- Mobile viewport: no horizontal overflow, usable tap targets.
  await page.setViewportSize({ width: 375, height: 812 });
  assert.ok((await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)) <= 1, 'Mobile horizontal overflow');
  const tiny = await demo.locator('button, a').evaluateAll((nodes) => nodes
    .map((node) => ({ label: node.getAttribute('aria-label') || (node.textContent || '').trim().slice(0, 30), height: node.getBoundingClientRect().height }))
    .filter((entry) => entry.height < 40));
  assert.deepEqual(tiny, [], 'interactive controls below 40px on mobile');
  const primaryHeight = await page.locator('#demo a.btn-primary').first().boundingBox();
  assert.ok(primaryHeight && primaryHeight.height >= 44, 'primary mobile CTA below 44px');
  const navPillHeight = await page.locator('nav[aria-label="Agency page navigation"] a[href="#pilot"]').boundingBox();
  assert.ok(navPillHeight && navPillHeight.height >= 44, 'navigation pilot CTA below 44px on mobile');
  const submitHeight = await page.locator('#pilot form button[type="submit"]').boundingBox();
  assert.ok(submitHeight && submitHeight.height >= 44, 'enquiry submit button below 44px');
  await demo.getByRole('radio', { name: /Senior Data Engineer/ }).click();
  await demo.getByRole('heading', { name: 'Senior Data Engineer' }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0);

  console.log('PASS: claims, CTA hierarchy, radiogroup keyboard, fail-closed review, thin pool, focus management, mailto honesty, no outbound requests, mobile');
} finally {
  await browser.close();
}
