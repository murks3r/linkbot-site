/**
 * Browser smoke journey for the static preview, run only in CI.
 * No network submissions or real candidate data are involved.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.AGENCY_PREVIEW_ORIGIN || 'http://127.0.0.1:4321';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 840 } });
  await page.goto(`${baseUrl}/for-agencies`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Better shortlists/ }).waitFor();
  assert.match(await page.title(), /Linkbot for Recruiting Agencies/);

  const demo = page.getByLabel('Interactive synthetic recruiting demonstration');
  await demo.getByRole('button', { name: /Senior Platform Engineer/ }).waitFor();
  const blocked = demo.locator('article').filter({ hasText: 'P-008' });
  assert.equal(await blocked.getByRole('button', { name: 'Add P-008 to shortlist' }).isDisabled(), true);

  const uncertain = demo.locator('article').filter({ hasText: 'P-031' });
  await uncertain.getByRole('button', { name: 'Inspect evidence' }).click();
  await demo.getByRole('heading', { name: 'Evidence for P-031' }).waitFor();
  assert.match(await demo.getByText('Rotation preference not yet stated').textContent(), /not yet stated/);

  await demo.getByRole('button', { name: 'Add P-014 to shortlist' }).click();
  await demo.getByRole('button', { name: 'Add P-031 to shortlist' }).click();
  await demo.getByRole('button', { name: /Preview candidate interest request/ }).click();
  await demo.getByRole('heading', { name: /Would you like to explore this opportunity/ }).waitFor();
  await demo.getByRole('button', { name: 'I’m interested' }).click();
  await demo.getByText('Interest indicated — disclosure remains separate.').waitFor();
  await demo.getByRole('button', { name: 'Simulate permission' }).click();
  await demo.getByText(/No action was taken/).waitFor();

  await demo.getByRole('button', { name: /Lead Product Designer/ }).click();
  await demo.getByText('No candidates shortlisted yet.').waitFor();
  assert.equal(await demo.getByRole('heading', { name: /Your working shortlist/ }).textContent(), 'Your working shortlist (0)');

  const form = page.getByRole('form', { name: 'Agency pilot email enquiry' });
  await form.locator('[name="name"]').fill('Example visitor');
  await form.locator('[name="agency"]').fill('Example agency');
  await form.locator('[name="email"]').fill('visitor@example.test');
  await form.locator('[name="focus"]').selectOption('Data and AI');
  await form.getByRole('button', { name: /Prepare pilot enquiry/ }).click();
  await form.getByText(/Nothing has been sent by Linkbot's website/).waitFor();
  assert.match(await form.getByRole('link', { name: 'Open the draft again' }).getAttribute('href'), /^mailto:hello@linkbot\.org/);

  await page.setViewportSize({ width: 375, height: 812 });
  assert.ok((await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)) <= 1, 'Mobile horizontal overflow');
  await demo.getByRole('button', { name: /Senior Data Engineer/ }).click();
  await demo.getByRole('heading', { name: 'Senior Data Engineer' }).waitFor();
  console.log('PASS: mandate selection, hard failures, unknowns, shortlist, interest, permission, mailto, mobile');
} finally {
  await browser.close();
}
