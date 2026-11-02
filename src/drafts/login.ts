/* The draft page /developers/login-with-linkbot, in English only: the planned sign-in with Linkbot for the people who
   use a space, and what works today without it. Nothing on it is built or decided; it is a plan for after the first
   release, so the page is a draft for the owner's review: linked from nowhere, never indexed, out of the sitemap, and
   left out of production builds. Every sentence has its row in docs/truth-check.md (section
   "/developers/login-with-linkbot"). */
import { buildsDraft, type Draft } from './draft.ts';

/** Whether a production build carries the draft. Set it to true once the sign-in is built and the owner approves the page. */
export const LOGIN_IN_PRODUCTION = false;

/** Whether a build carries the draft (src/drafts/draft.ts). */
export const buildsLogin = (env: { VERCEL_ENV?: string }, inProduction = LOGIN_IN_PRODUCTION): boolean =>
  buildsDraft(env, inProduction);

export const login: Draft = {
  banner: 'Draft, not published: a planned feature, not built.',
  bannerNote: 'This page is linked from nowhere on the site, is never indexed and exists in English only. Sign-in with Linkbot is a plan for after the first release; nothing on this page is built, and none of it is decided.',
  title: 'Login with Linkbot (planned, draft)',
  description: 'Draft: the planned sign-in with Linkbot, one account for the people who use a space and one page with their own entries. Not built, not decided.',
  eyebrow: 'Developers · planned · draft',
  h1: ['Login with Linkbot:', 'planned, not built.'],
  lede: 'What a sign-in with Linkbot is meant to give the people who use a space, and what works today without it. Everything this page calls planned is a plan for after the first release: it is not built, not in the Space API contract and not decided. The page names no date.',
  sections: [
    {
      id: 'today',
      title: 'Today: no accounts',
      paragraphs: [
        'Today nobody signs in to Linkbot, and there is no password. A person who describes a need or an offer confirms it, and confirms their email address through a link.',
        'The browser that confirmed manages what it created: it shows “mine”, answers possible fits and changes the watch, for sixty days from last use, and only in that tab. A new browser gets access again through a link sent to the confirmed address.',
        'Operators do not sign in to Linkbot either. Your platform signs its team in, and the console runs on your machine or behind your own login.',
      ],
    },
    {
      id: 'planned',
      title: 'Planned: one account for the people who use a space',
      paragraphs: [
        'A person signs in with a link sent to their email address, without a password.',
        'After signing in, the person sees one page with their own needs, offers and watches, in place of one link per entry. That page is visible only after signing in.',
        'The accounts, the sign-in and the sessions sit with Linkbot, not with each platform.',
      ],
    },
    {
      id: 'platforms',
      title: 'Planned: what it means for your platform',
      paragraphs: [
        'Your page shows a sign-in button, and the pages that need a signed-in person ask for one. The widget shows the page of a person’s own entries.',
      ],
    },
    {
      id: 'contract',
      title: 'Planned: the contract comes first',
      paragraphs: [
        'Accounts enter the Space API contract first, with a new version and its changelog, before the widget, the SDK or a platform changes. No version of the contract has accounts today.',
      ],
    },
  ],
  open: {
    title: 'Open before anything is built',
    items: [
      'Who is responsible for the account data: Linkbot alone, Linkbot together with the platform, or the platform with Linkbot working on its behalf. This is for the owner, with counsel.',
      'Which sign-in service carries the accounts, and what it costs.',
      'How an account is tied to the entries a person has already confirmed through an email link.',
      'What a platform may see of an account, and for what purpose.',
      'What the privacy notice says about accounts, and how access and deletion work per account.',
    ],
  },
};
