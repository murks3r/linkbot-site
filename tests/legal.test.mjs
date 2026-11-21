/* Imprint, privacy notice and contact are prepared placeholders until their texts exist: each page is built in every
   language, every page's footer links all three, and each says plainly that its text is in preparation, or shows the
   text. Filling one later is one change in one place: the address in src/lib/contact.ts, the imprint in
   src/legal/imprint.ts, the privacy notice in src/legal/privacy.ts. A text placed there carries no forbidden claim, no
   host, key or address (tests/forbidden.mjs). The build checks are skipped until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { IMPRINT } from '../src/legal/imprint.ts';
import { PRIVACY } from '../src/legal/privacy.ts';
import { CONTACT_EMAIL } from '../src/lib/contact.ts';
import { LANGS, isLang, pathFor, resolve } from '../src/i18n/index.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const TEXTS = { '/imprint': IMPRINT, '/privacy': PRIVACY };
const dist = new URL('../dist/', import.meta.url);
const file = (lang, page) => new URL(`.${pathFor(lang, page)}.html`, dist);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';

test('a legal text, once placed, is well formed and claims nothing the site may not say', () => {
  for (const [page, text] of Object.entries(TEXTS)) {
    if (text === null) continue;
    assert.ok(isLang(text.lang), `${page}: the text's language`);
    assert.ok(text.sections.length > 0 && text.sections.every(section => section.paras.length > 0), `${page}: an empty section`);
    for (const words of text.sections.flatMap(section => [section.title ?? '', ...section.paras])) {
      assert.doesNotMatch(words, FORBIDDEN[text.lang], `${page}: a forbidden claim in “${words}”`);
      assert.doesNotMatch(words, PRIVATE, `${page}: a host, key or address in “${words}”; the address belongs in src/lib/contact.ts`);
    }
  }
});

test('imprint, privacy notice and contact exist in every language, linked from the footer, prepared or filled', { skip }, () => {
  for (const lang of LANGS) {
    const { t } = resolve(lang);
    const pending = { '/imprint': [IMPRINT === null, t.imprint.lede], '/privacy': [PRIVACY === null, t.privacy.lede], '/contact': [CONTACT_EMAIL === null, t.site.footer.contactPending] };
    for (const [page, [open, words]] of Object.entries(pending)) {
      const html = readFileSync(file(lang, page), 'utf8');
      for (const link of Object.keys(pending)) assert.ok(html.includes(`href="${pathFor(lang, link)}"`), `${lang} ${page}: the footer does not link ${link}`);
      assert.equal(html.includes(words), open, `${lang} ${page}: the placeholder ${open ? 'is missing' : 'still shows beside the text'}`);
      if (page === '/contact' && !open) assert.ok(html.includes(`mailto:${CONTACT_EMAIL}`), `${lang} ${page}: no address`);
    }
  }
});
