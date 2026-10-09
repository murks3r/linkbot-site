/**
 * Accessibility and semantic-markup regression tests against the built page.
 * These are cheap, deterministic invariants; they do not replace a manual
 * audit with assistive technology (see docs/site-hardening/02-...).
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { elementIds, headingLevels, loadBuiltHtml, metaContent, referencedIds } from './helpers.mjs';

const built = loadBuiltHtml();
const html = built.ok ? built.html : '';
const skipReason = built.ok ? undefined : built.reason;

test('document declares a language and a zoomable viewport', { skip: skipReason }, () => {
  const lang = html.match(/<html[^>]*\slang="([^"]*)"/)?.[1];
  assert.ok(lang && lang.trim().length > 0, '<html> must declare a language');
  const viewport = metaContent(html, 'viewport');
  assert.ok(viewport, 'no viewport meta');
  assert.doesNotMatch(viewport, /user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/, 'pinch zoom must not be disabled');
});

test('exactly one h1 and no skipped heading levels', { skip: skipReason }, () => {
  const levels = headingLevels(html);
  assert.equal(levels.filter((level) => level === 1).length, 1, 'the page must expose exactly one h1');
  assert.equal(levels[0], 1, 'the first heading must be the h1');
  let previous = levels[0];
  for (const level of levels.slice(1)) {
    assert.ok(level <= previous + 1, `heading level jumps from h${previous} to h${level}`);
    previous = level;
  }
});

test('a skip link is the first anchor and targets an existing id', { skip: skipReason }, () => {
  const firstAnchor = html.match(/<a\s[^>]*href="([^"]+)"[^>]*>/)?.[1];
  assert.equal(firstAnchor, '#main', 'the first anchor must be the skip link');
  assert.ok(elementIds(html).includes('main'), 'the skip link target #main does not exist');
});

test('ids are unique', { skip: skipReason }, () => {
  const ids = elementIds(html);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual([...new Set(duplicates)], [], 'duplicate ids break anchor navigation and aria references');
});

test('aria references and in-page links all resolve', { skip: skipReason }, () => {
  const ids = new Set(elementIds(html));
  const missing = [...new Set(referencedIds(html))].filter((id) => !ids.has(id));
  assert.deepEqual(missing, [], 'dangling aria-labelledby/describedby or fragment links');
});

test('every section landmark is labelled', { skip: skipReason }, () => {
  for (const tag of html.matchAll(/<section\s([^>]*)>/g)) {
    assert.match(
      tag[1],
      /aria-label(?:ledby)?="/,
      `<section ${tag[1].slice(0, 40)}...> has no accessible name`,
    );
  }
});

test('every form control is wrapped in a label and the form posts somewhere usable', { skip: skipReason }, () => {
  const controls = html.match(/<(?:input|textarea|select)\b/g) ?? [];
  const wrapped = [...html.matchAll(/<label[\s\S]*?<\/label>/g)]
    .flatMap((match) => match[0].match(/<(?:input|textarea|select)\b/g) ?? []);
  assert.equal(controls.length, wrapped.length, 'every control must sit inside a <label>');
  assert.ok(controls.length > 0, 'expected the access-request form controls');
  const action = html.match(/<form[^>]*action="([^"]+)"/)?.[1];
  assert.equal(action, 'mailto:hello@linkbot.org', 'form action changed: verify the submission path still works');
});

test('every image has alt text and every link has an accessible name', { skip: skipReason }, () => {
  for (const image of html.matchAll(/<img\s([^>]*)>/g)) {
    assert.match(image[1], /\balt="/, `<img ${image[1].slice(0, 40)}...> has no alt attribute`);
  }
  for (const anchor of html.matchAll(/<a\s([^>]*)>([\s\S]*?)<\/a>/g)) {
    const [, attributes, inner] = anchor;
    const text = inner.replace(/<[^>]*>/g, '').trim();
    const hasLabel = /aria-label(?:ledby)?="/.test(attributes) || /\btitle="/.test(attributes);
    assert.ok(text.length > 0 || hasLabel, `<a ${attributes.slice(0, 60)}> has no accessible name`);
  }
});

test('no element restates aria-hidden="false"', { todo: 'KNOWN GAP: src/components/three/ThreeExperience.astro:15 sets aria-hidden="false" (a redundant no-op) on the pinned narrative container; that file is outside this task\'s authorised paths — see docs/site-hardening/02-unresolved-and-out-of-scope.md' }, () => {
  assert.doesNotMatch(html, /aria-hidden="false"/);
});
