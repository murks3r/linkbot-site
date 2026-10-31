/* What every draft page shares: its sections, and whether a build carries it. A draft is for the owner's review:
   linked from nowhere, never indexed, out of the sitemap, and left out of production builds until the owner approves
   it. tests/draft.test.mjs checks each draft. */

export interface DraftSection { id: string; title: string; paragraphs: string[] }

export interface Draft {
  banner: string;
  bannerNote: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string[];
  lede: string;
  sections: DraftSection[];
  open: { title: string; items: string[] };
}

/** Whether a build carries a draft: previews and local builds do; a production build (Vercel sets VERCEL_ENV to
    "production") only once the draft is approved for production. Pure, so tests/draft.test.mjs checks it without a build. */
export const buildsDraft = (env: { VERCEL_ENV?: string }, inProduction: boolean): boolean =>
  inProduction || env.VERCEL_ENV !== 'production';
