/**
 * Head metadata regression tests, run against the real build output in dist/.
 * Every assertion is anchored to the built HTML, not to the component source,
 * so a component that stops emitting a tag fails here.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CANONICAL_HOST,
  CANONICAL_ORIGIN,
  SITE,
  allMetaContents,
  exists,
  loadBuiltHtml,
  metaContent,
  mimeForUrl,
  svgDimensions,
} from './helpers.mjs';

const built = loadBuiltHtml();
const html = built.ok ? built.html : '';
const skipReason = built.ok ? undefined : built.reason;

const TITLE = '<title>Linkbot — Private eligibility, not public exposure</title>';

test('head emits exactly one title, description and canonical link', { skip: skipReason }, () => {
  assert.equal(html.split('<title>').length - 1, 1, 'expected exactly one <title>');
  assert.ok(html.includes(TITLE), 'title drifted from the layout default');
  assert.equal(allMetaContents(html, 'description').length, 1, 'expected exactly one description');
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, 'expected exactly one canonical link');
});

test('canonical URL is absolute, on the canonical host this build was given', { skip: skipReason }, () => {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical, 'no canonical link in the built head');
  const url = new URL(canonical);
  assert.ok(url.protocol === 'https:' || url.protocol === 'http:', 'the canonical must be absolute');
  assert.equal(url.origin, CANONICAL_ORIGIN, 'the canonical must use the origin this build resolved');
  assert.equal(url.host, CANONICAL_HOST);
  if (SITE.indexable) {
    assert.equal(url.protocol, 'https:', 'an indexable production build must be https');
  }
  assert.equal(canonical, `${CANONICAL_ORIGIN}/`, 'the home page canonical must be the origin root');
});

test('og:url equals the canonical URL', { skip: skipReason }, () => {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(metaContent(html, 'og:url'), canonical);
});

test('title and description are identical across page, Open Graph and Twitter tags', { skip: skipReason }, () => {
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = metaContent(html, 'description');
  assert.equal(metaContent(html, 'og:title'), title);
  assert.equal(metaContent(html, 'twitter:title'), title);
  assert.equal(metaContent(html, 'og:description'), description);
  assert.equal(metaContent(html, 'twitter:description'), description);
  assert.ok(description.length > 50 && description.length < 300, 'description length is outside a usable range');
});

test('robots directives match the indexing posture of this build', { skip: skipReason }, () => {
  const robots = metaContent(html, 'robots');
  assert.ok(robots, 'no robots meta directive');

  if (!SITE.indexable) {
    // Non-production build (localhost, a *.vercel.app deployment, or a Vercel
    // preview): the guard in BaseLayout/PreviewNotice decides this, and exactly
    // one robots meta is allowed to carry the decision.
    assert.match(robots, /\bnoindex\b/, 'a non-production build must be noindex');
    assert.match(robots, /\bnofollow\b/);
    assert.doesNotMatch(robots, /(^|[,\s])index([,\s]|$)/, 'no sibling `index` directive may contradict it');
    assert.equal(allMetaContents(html, 'robots').length, 1, 'a duplicate robots meta is a defect');
    return;
  }

  assert.match(robots, /\bindex\b/);
  assert.match(robots, /\bfollow\b/);
  assert.doesNotMatch(robots, /\bnoindex\b/, 'an indexable build must not be marked noindex');
  assert.match(robots, /max-image-preview:large/, 'large previews are required for the 1200x630 card');
});

test('og:image and twitter:image are the same absolute asset that exists', { skip: skipReason }, () => {
  const ogImage = metaContent(html, 'og:image');
  assert.equal(metaContent(html, 'twitter:image'), ogImage);
  const url = new URL(ogImage);
  assert.ok(url.protocol === 'https:' || url.protocol === 'http:', 'the social image must be absolute');
  assert.equal(url.origin, CANONICAL_ORIGIN, 'og:image must use the origin this build resolved');
  assert.equal(url.host, CANONICAL_HOST);
  assert.ok(exists(`public${url.pathname}`), `og:image asset public${url.pathname} does not exist`);
});

test('og:image declares the real asset dimensions and MIME type', { skip: skipReason }, () => {
  const ogImage = metaContent(html, 'og:image');
  const width = Number(metaContent(html, 'og:image:width'));
  const height = Number(metaContent(html, 'og:image:height'));
  assert.ok(Number.isFinite(width) && Number.isFinite(height), 'og:image:width/height must be numeric');
  const asset = svgDimensions(`public${new URL(ogImage).pathname}`);
  assert.deepEqual({ width, height }, asset, 'declared og:image dimensions drifted from the asset');
  assert.equal(metaContent(html, 'og:image:type'), mimeForUrl(ogImage), 'og:image:type must match the asset format');
});

test('social images carry alt text and the card type matches the asset ratio', { skip: skipReason }, () => {
  const alt = metaContent(html, 'og:image:alt');
  assert.ok(alt && alt.length > 10, 'og:image:alt must describe the card');
  assert.equal(metaContent(html, 'twitter:image:alt'), alt);
  assert.equal(metaContent(html, 'twitter:card'), 'summary_large_image');
  assert.equal(metaContent(html, 'og:type'), 'website');
  assert.equal(metaContent(html, 'og:site_name'), 'Linkbot');
});

test('the social card is served in a format link-preview crawlers render', { todo: 'KNOWN GAP: og:image is /og.svg (SVG is not rendered by Facebook/X/LinkedIn/WhatsApp). A 1200x630 PNG/JPG cannot be added from the authorised paths — see docs/site-hardening/02-unresolved-and-out-of-scope.md' }, () => {
  const ogImage = metaContent(html, 'og:image');
  assert.match(new URL(ogImage).pathname, /\.(png|jpe?g|webp)$/);
});
