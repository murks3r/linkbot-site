/* The developer docs at /developers/docs: the Markdown of Connect's open-core export (src/content/open-core/docs,
   copied by tools/sync-open-core-docs.mjs; SOURCE.json names the commit) and the site's own two pages
   (src/content/developers), in English, rendered at build time. This file holds their order, their addresses and the
   rule for links inside them; pure, so tests/developers-docs.test.mjs checks it without a build. */
import { PUBLIC_NAME } from '../i18n/terms.ts';

export const DOCS_BASE = '/developers/docs';

/** One entry in the docs' navigation: an export file (relative to its docs/), a page of the site's own, or a planned
    page, named without a link: its draft (src/drafts) is for the owner's review and linked from nowhere. */
export type DocItem = { doc: string } | { page: string } | { planned: string };

export interface DocSection { id: SectionId; title: string; items: DocItem[] }

export type SectionId = 'quickstart' | 'widget' | 'sdk' | 'cli' | 'protocol' | 'api' | 'open' | 'planned';

/** The structure the owner's plan names (02.11.): quickstart, widget, SDK, CLI, protocol, API reference, what is open
    and what is hosted; then what is planned, the subjects of the drafts, marked planned. */
export const SECTIONS: DocSection[] = [
  { id: 'quickstart', title: 'Quickstart (5 minutes)', items: [{ doc: 'guides/embed-in-five-minutes.md' }, { doc: 'guides/quickstart.md' }, { doc: 'guides/developer-quickstart.md' }] },
  { id: 'widget', title: 'Widget', items: [{ doc: 'reference/embed.md' }, { doc: 'reference/react.md' }, { doc: 'recipes/html.md' }, { doc: 'recipes/astro.md' }, { doc: 'recipes/nextjs.md' }, { doc: 'recipes/wordpress.md' }, { doc: 'guides/privacy-for-integrators.md' }] },
  { id: 'sdk', title: 'SDK', items: [{ doc: 'reference/sdk.md' }, { doc: 'guides/webhooks.md' }] },
  { id: 'cli', title: 'CLI', items: [{ page: 'cli' }] },
  { id: 'protocol', title: 'Protocol', items: [{ doc: 'protocol/README.md' }] },
  { id: 'api', title: 'API reference', items: [{ doc: 'reference/space-api.md' }] },
  { id: 'open', title: 'What is open, what is hosted', items: [{ page: 'open-and-hosted' }] },
  { id: 'planned', title: 'Planned', items: [{ planned: `Login with ${PUBLIC_NAME}` }, { planned: 'A new vertical' }, { planned: 'Prepare a request with an agent' }] },
];

/** The export's files the site renders: those in SECTIONS, plus its own index. */
export const DOC_FILES: string[] = ['README.md', ...SECTIONS.flatMap(s => s.items.flatMap(i => ('doc' in i ? [i.doc] : [])))];

/** An export file's address: docs/README.md is the docs' home, a folder's README.md is the folder, ".md" goes. */
export const docRoute = (file: string): string =>
  file === 'README.md' ? DOCS_BASE : `${DOCS_BASE}/${file.replace(/\/README\.md$/, '').replace(/\.md$/, '')}`;

export const pageRoute = (page: string): string => `${DOCS_BASE}/${page}`;

/** An entry's address; a planned one has none. */
export const itemRoute = (item: DocItem): string | null => ('doc' in item ? docRoute(item.doc) : 'page' in item ? pageRoute(item.page) : null);

/** The sections with an address (all but "planned"), each at its first entry's: the hub at /developers lists them. */
export const LINKED_SECTIONS = SECTIONS.flatMap(section => {
  const href = itemRoute(section.items[0]);
  return href ? [{ id: section.id, href }] : [];
});

/** What a link inside an export file becomes, from the file at `from` (relative to docs/):
    - another rendered file, with its anchor: the site's address of it;
    - an anchor on the same page: kept;
    - anything else (a package, an example, a licence, the architecture decisions, another site): no link, the words
      stay. The repository is not public yet, and the site sends no one to a host it does not own (tests/contact). */
export function rewriteLink(from: string, href: string): string | null {
  if (href.startsWith('#')) return href;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) return null;
  const [path, hash = ''] = href.split('#');
  const target = resolvePath(from, path);
  if (target === null || !DOC_FILES.includes(target)) return null;
  return docRoute(target) + (hash ? `#${hash}` : '');
}

/** `../reference/embed.md` from `guides/quickstart.md` → `reference/embed.md`; null when it leaves docs/. */
function resolvePath(from: string, path: string): string | null {
  const parts = from.split('/').slice(0, -1);
  for (const part of path.split('/')) {
    if (part === '..') { if (!parts.length) return null; parts.pop(); }
    else if (part && part !== '.') parts.push(part);
  }
  return parts.join('/');
}

/** A Markdown file's title: its first heading, without inline code marks. */
export const docTitle = (markdown: string): string => (markdown.match(/^# (.+)$/m)?.[1] ?? '').replace(/`/g, '').trim();

/** A Markdown file's description: its first plain paragraphs without links, marks or code, as many as reach 50
    characters, cut at a word to at most 160 (tests/build.test.mjs asks 50 to 160 of every page). */
export function docDescription(markdown: string): string {
  const plain = markdown.split(/\n{2,}/).map(block => block.trim())
    .filter(block => block && !/^(#|>|\||```|<!--|[-*] |\d+\. )/.test(block))
    .map(block => block.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[`*_]/g, '').replace(/\s+/g, ' ').trim());
  let text = '';
  for (const paragraph of plain) { text = text ? `${text} ${paragraph}` : paragraph; if (text.length >= 50) break; }
  if (text.length <= 160) return text;
  const cut = text.slice(0, 159);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:]$/, '')}…`;
}
