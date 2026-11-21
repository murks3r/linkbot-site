/* The developer docs (src/lib/open-core-docs.ts): Connect's open-core export as copied by
   tools/sync-open-core-docs.mjs, and the site's own pages beside it. Plain Markdown, no front matter: the title is the
   first heading. The export's architecture decisions are not copied. */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

/* Ids keep the file's path ("guides/quickstart.md"), the key src/lib/open-core-docs.ts uses. */
const keepPath = ({ entry }: { entry: string }) => entry;

export const collections = {
  openCore: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/open-core/docs', generateId: keepPath }) }),
  developers: defineCollection({ loader: glob({ pattern: '*.md', base: './src/content/developers', generateId: keepPath }) }),
};
