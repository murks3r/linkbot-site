/* "Linkbot in one page" says no more than the site: every word of the sheet is a catalogue sentence the site already
   renders, it carries the status day and the contact constant, and the build made one A4 page per language, as a
   print page and as a PDF. The PDF checks are skipped until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { PDFDocument } from 'pdf-lib';
import { LANGS, pathFor } from '../src/i18n/index.ts';
import { statusDate } from '../src/i18n/status-date.ts';
import { CONTACT_EMAIL } from '../src/lib/contact.ts';
import { sheet, sheetPdfPath } from '../src/lib/sheet.ts';

const site = new URL('https://linkbot-site.vercel.app');
const dist = new URL('../dist/', import.meta.url);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';
const words = s => [s.title, s.claim, s.dated, s.synthetic, s.contact.text, ...s.sections.flatMap(section => [section.title, ...section.blocks.flatMap(block =>
  block.kind === 'para' ? [block.text] : block.kind === 'list' ? block.items : block.items.flatMap(term => [term.name, term.text]))])];
const html = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

test('the sheet is dated, names no prices, and its contact line is the constant', () => {
  for (const lang of LANGS) {
    const s = sheet(lang, site);
    assert.ok(s.dated.includes(statusDate(lang)), `${lang}: the sheet does not name the status day`);
    assert.ok(s.sections.length >= 6, `${lang}: the sheet has ${s.sections.length} sections`);
    assert.equal(s.contact.text === CONTACT_EMAIL || !CONTACT_EMAIL, true, `${lang}: the contact line is not CONTACT_EMAIL`);
    assert.ok(!/[€$£]|\b(EUR|USD)\b/.test(words(s).join(' ')), `${lang}: the sheet names a price`);
  }
});

test('every sentence of the sheet is on the print page, and its sections are on the pages they come from', { skip }, () => {
  for (const lang of LANGS) {
    const s = sheet(lang, site);
    const page = readFileSync(new URL(`${pathFor(lang, '/one-page').slice(1)}.html`, dist), 'utf8');
    for (const text of words(s)) assert.ok(page.includes(html(text)), `${lang}: the print page lacks “${text.slice(0, 60)}”`);
    const sources = ['/how-it-works', '/for-platforms', '/status'].map(path => readFileSync(new URL(`${pathFor(lang, path).slice(1)}.html`, dist), 'utf8')).join('');
    for (const section of s.sections) assert.ok(sources.includes(html(section.title)), `${lang}: “${section.title}” is on none of the source pages`);
  }
});

test('the PDF is one A4 page per language, titled with the status day', { skip }, async () => {
  for (const lang of LANGS) {
    const doc = await PDFDocument.load(readFileSync(new URL(sheetPdfPath(lang).slice(1), dist)), { updateMetadata: false });
    assert.equal(doc.getPageCount(), 1, `${lang}: the PDF has ${doc.getPageCount()} pages`);
    const { width, height } = doc.getPage(0).getSize();
    assert.deepEqual([Math.round(width), Math.round(height)], [595, 842], `${lang}: the PDF is not A4`);
    assert.ok(doc.getTitle()?.includes(statusDate(lang)), `${lang}: the PDF's title lacks the status day`);
    assert.equal(doc.catalog.get(doc.catalog.context.obj('Lang'))?.decodeText?.(), lang, `${lang}: the PDF's language`);
  }
});
