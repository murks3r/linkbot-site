/* The contact path is true today: Linkbot has no domain of its own yet, so no page names an address or sends a form,
   and every page says that contact details follow with the domain. One constant (src/lib/contact.ts) switches the
   address on once the owner names the domain. And the build sends no one anywhere else: no host outside Linkbot's own
   appears in the build output, apart from the identifiers listed in ALLOWED below. Skipped until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTACT_EMAIL } from '../src/lib/contact.ts';
import { LANGS, catalogues } from '../src/i18n/index.ts';

const UNOWNED = ['linkbot', 'org'].join('.');
const PLACEHOLDER = 'linkbot-domain-tbd.invalid';
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const skip = !existsSync(join(dist, 'index.html')) && 'build the site first';

/* Linkbot's own hosts: where production runs (astro.config.mjs) and, once named, the domain of the contact address. */
const OWN = new Set([new URL(process.env.SITE_URL || 'https://linkbot-site.vercel.app').host, PLACEHOLDER]);
if (CONTACT_EMAIL) OWN.add(CONTACT_EMAIL.split('@')[1]);
/* Hosts that appear only as identifiers, never as a place a reader or a browser is sent: the JSON-LD vocabulary. XML
   namespaces (xmlns="…") are removed before the scan, and the fonts' licence texts ship verbatim, as their licence
   (SIL OFL 1.1) requires, so they are not read. A template such as https://{space_host}/ names no host. */
const ALLOWED = new Set(['schema.org']);
const LICENCE = /^fonts\/.*\/(OFL|LICENSE[^/]*)\.txt$/;
const TEXT = /\.(html|xml|txt|js|css|json|svg|webmanifest)$/;

const files = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const path = join(dir, entry.name);
  return entry.isDirectory() ? files(path) : [path];
});

test('the contact address is unset or on a domain Linkbot owns', () => {
  if (CONTACT_EMAIL === null) return;
  assert.match(CONTACT_EMAIL, /^[^@\s]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i, 'CONTACT_EMAIL is not an address');
  const domain = CONTACT_EMAIL.split('@')[1].toLowerCase();
  assert.notEqual(domain, UNOWNED, 'CONTACT_EMAIL is on the domain Linkbot does not own');
  assert.ok(!domain.endsWith('.invalid'), 'CONTACT_EMAIL is on the placeholder domain, which never resolves');
});

test('every page carries the contact section, and an address only when one is set', { skip }, () => {
  const pages = files(dist).filter(path => path.endsWith('.html') && !relative(dist, path).startsWith('__preview'));
  assert.ok(pages.length > 0);
  const pending = LANGS.map(lang => catalogues[lang].site.footer.contactPending);
  for (const path of pages) {
    const html = readFileSync(path, 'utf8');
    const where = relative(dist, path);
    assert.ok(html.includes('id="contact"'), `${where}: no contact section`);
    const mails = [...html.matchAll(/mailto:([^"'?\s>]*)/g)].map(match => match[1]);
    if (CONTACT_EMAIL === null) {
      assert.deepEqual(mails, [], `${where}: a mail address, though Linkbot has none yet`);
      assert.ok(pending.some(words => html.includes(words)), `${where}: the contact section does not say that details follow with the domain`);
    } else {
      assert.ok(mails.length > 0 && mails.every(mail => mail === CONTACT_EMAIL), `${where}: mail addresses ${mails.join(', ')}`);
    }
  }
});

test('no host outside Linkbot’s own appears in the build output', { skip }, () => {
  const hits = [];
  for (const path of files(dist)) {
    const where = relative(dist, path);
    if (!TEXT.test(where) || LICENCE.test(where)) continue;
    const text = readFileSync(path, 'utf8').replace(/\sxmlns(:\w+)?="[^"]*"/g, '');
    const hosts = [
      ...[...text.matchAll(/\b[a-z][a-z0-9+.-]*:\/\/([a-z0-9-]+(?:\.[a-z0-9-]+)+)/gi)].map(match => match[1]),
      ...[...text.matchAll(/(?:^|[\s"'(=])\/\/([a-z0-9-]+(?:\.[a-z0-9-]+)+)/gi)].map(match => match[1]),
      ...[...text.matchAll(/[a-z0-9._%+-]+@([a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,})\b/gi)].map(match => match[1]),
    ];
    for (const host of hosts.map(host => host.toLowerCase())) if (!OWN.has(host) && !ALLOWED.has(host)) hits.push(`${where}: ${host}`);
  }
  assert.deepEqual([...new Set(hits)], [], 'a host outside Linkbot’s own in the build output');
});
