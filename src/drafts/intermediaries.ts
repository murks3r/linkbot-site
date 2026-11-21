/* The draft page /for-intermediaries, in English only: what a recruiter, broker or agency gets from Linkbot as an
   introduction layer. The owner has not decided this positioning, so the page is a draft for the owner's review: linked
   from nowhere, never indexed, out of the sitemap, and left out of production builds. Every sentence has its row in
   docs/truth-check.md (section "/for-intermediaries"). */
import { statusDate } from '../i18n/status-date.ts';
import { buildsDraft, type Draft } from './draft.ts';

/** Whether a production build carries the draft. Set it to true once the owner approves the page. */
export const INTERMEDIARIES_IN_PRODUCTION = false;

/** Whether a build carries the draft (src/drafts/draft.ts). */
export const buildsIntermediaries = (env: { VERCEL_ENV?: string }, inProduction = INTERMEDIARIES_IN_PRODUCTION): boolean =>
  buildsDraft(env, inProduction);

const AS_OF = statusDate('en');

export const intermediaries: Draft = {
  banner: 'Draft, not published, for the owner’s review.',
  bannerNote: 'This page is linked from nowhere on the site, is never indexed and exists in English only. The positioning towards intermediaries is the owner’s open decision.',
  title: 'For intermediaries: introductions on both sides’ yes (draft)',
  description: 'Draft for the owner: what a recruiter, broker or agency gets: intake, watch, an introduction after both sides’ yes, its own space, the embed and the API.',
  eyebrow: 'For intermediaries · draft',
  h1: ['Two sides you bring together,', 'introduced only after both say yes.'],
  lede: 'For a recruiter, a broker or an agency whose work is to bring a need and an offer together: what Linkbot does as the layer under that work, and what it does not do yet. This page describes the Space API contract and Geoprocure’s synthetic staging space, which is the only space running today. No intermediary runs a space, and this page names no prices.',
  sections: [
    {
      id: 'intake',
      title: 'Intake: a need or an offer as confirmed criteria',
      paragraphs: [
        'Each side describes what it needs or offers on your page: in the form your market’s pack generates, or in one line of text that fixed rules read into proposed values, without a model. Nothing is pre-selected, and what was not stated stays unknown.',
        'Nothing is stored before the person confirms. The server checks every value against the pack and names each failing field; the email address is confirmed through a link.',
        'Your server can also enter a need or an offer for someone, for example after a phone call. Each value it enters stays unknown for matching until its owner confirms it.',
      ],
    },
    {
      id: 'watch',
      title: 'Watch: a need that stays open',
      paragraphs: [
        'A watch keeps a confirmed need or offer open and tells only its owner when something new fits, by email or webhook, never beyond board stage. The owner pauses or ends it at any time, also from a link.',
        `As of ${AS_OF}, watches run on the staging space. Its email goes to a test mailbox and reaches no one, and it sends no webhooks yet.`,
      ],
    },
    {
      id: 'introduction',
      title: 'The introduction: both sides’ yes, and your approval',
      paragraphs: [
        'Matching compares the stored criteria one by one and shows a verdict per criterion, never a score. A possible fit discloses only the verdicts and a notice that people decide.',
        'An introduction needs three things, in any order: the checks your space requires, recorded as passed by a named operator of your team; that operator’s approval; and a yes from each side. Each side answers for itself and learns nothing of the other before both said yes, and a later no revokes a yes. The server refuses every other way.',
        'In operator mode the fields of both sides at the introduction stage go to your team only. Each side’s receipt says that both agreed and that you will contact them, and you make the contact yourself and record the outcome. In direct mode each side sees the other side’s fields at that stage instead. A field your pack keeps for the operator never reaches the other side.',
      ],
    },
    {
      id: 'space',
      title: 'A space of your own',
      paragraphs: [
        'A space is one instance for one market, with its own database, keys and deletion log. Its needs, offers and fits are not shared with another space.',
        'A space pins a pack: the criteria of its market, the answers they allow, what each one discloses and when, and the checks the market needs. The form, the reading, the board and the matching rules follow from it. No pack exists for recruiting, brokerage or agency work; the only pack a space uses today is industrial minerals, Geoprocure’s.',
        `Your team approves cases in a console behind your own login; there is no Linkbot login for operators. As of ${AS_OF} the console runs on a sample with synthetic data and is not published.`,
      ],
    },
    {
      id: 'embed',
      title: 'The embed and the API',
      paragraphs: [
        'The embed is one script and one element on your page. The element carries your publishable key, which works only on the origins your space allows. Its modes: describe, board, watch and mine.',
        `Your server talks to the Space API with the secret key, which never appears in a page: it can enter needs and offers, record checks and approvals, and read introductions and outcomes. As of ${AS_OF} the SDK is not published, and the staging space sends no webhooks.`,
      ],
    },
    {
      id: 'today',
      title: 'Where it stands',
      paragraphs: [
        'Geoprocure’s space, for industrial minerals, is the only example today. It runs on a synthetic staging instance with synthetic data; no real person or organisation uses it.',
        'No recruiter, broker or agency runs a space, and there is no pack for their markets.',
      ],
    },
  ],
  open: {
    title: 'Open for the owner',
    items: [
      'Whether intermediaries become a second audience of the site at all, and under which name.',
      'A pack for a first intermediary market, such as recruiting: which criteria, which checks, and which stage discloses what.',
      'Recruiting brings the personal data of candidates into a space. What that requires is for counsel before any page says more.',
    ],
  },
};
