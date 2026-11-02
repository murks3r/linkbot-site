/* /faq in English, the source the other languages are typed against (src/faq/index.ts). Each answer states only what
   runs today or says plainly that it is planned; its rows in docs/truth-check.md: how.confirm, how.yes, how.introduction,
   home.rules, verticals.first, developers (the repository and npm), site.synthetic. */
import { statusDate } from '../i18n/status-date.ts';

const AS_OF = statusDate('en');

export const en = {
  title: 'Questions about Linkbot: what it is and what problem it solves',
  description: 'What Linkbot is, the problem it solves, how “both say yes” works, what it checks today, what is open source and what is hosted, and who it is for.',
  eyebrow: 'FAQ',
  h1: 'Questions about Linkbot',
  lede: 'Short answers, each true today. What is planned says so.',
  items: [
    {
      q: 'What is Linkbot?',
      a: [
        'Linkbot lets two businesses that do not know each other trust each other before they meet. It works in three steps: a check of each side, a private match, and an introduction only when both say yes.',
        'A platform embeds Linkbot in its own pages, with one space per market.',
      ],
    },
    {
      q: 'What problem does Linkbot solve?',
      a: [
        'In B2B trade, being seen costs something when a lot is at stake. A buyer who shows a need, or a supplier who shows what it can deliver, tells the whole market, and cannot tell who on the other side is real.',
        'So two businesses that do not know each other cannot trust each other before they meet. Linkbot changes that: it confirms each side and shows each only the criteria and a verdict per criterion, never the other’s name or contact, until both say yes.',
      ],
    },
    {
      q: 'How does “both say yes” work?',
      a: [
        'After a private match, each side sees a board card without names: the criteria and a verdict per criterion. A named person at the platform approves the possible fit; the approval reveals nothing.',
        'Then each side answers on its own and does not see the other’s answer. Only when both say yes do the names and email addresses go out, directly or through the platform’s team. A no on either side reveals nothing to the other, and the server refuses every other way to an introduction.',
      ],
    },
    {
      q: 'What does Linkbot check?',
      a: [
        'Only what runs today: each side confirms its email address through a link sent to it, and nothing is stored before it confirms.',
        'Checks of a company by Linkbot itself, such as whether it is real, are planned and not built.',
      ],
    },
    {
      q: 'What is open source and what is hosted?',
      a: [
        `As of ${AS_OF}, nothing of Linkbot is published as open source: the repository with the widget and the SDK is private, and the SDK is not on npm.`,
        'The plan: the widget, the SDK, a command-line tool and the description of the protocol become open source, with a quickstart of five minutes. The checks, the checked history, the matching and the billing stay a service Linkbot hosts. The licence is not chosen yet.',
        'Hosted access for other platforms: coming soon.',
      ],
    },
    {
      q: 'Who is Linkbot for?',
      a: [
        'For platforms that bring businesses together and want an introduction only where both sides want it, and for the buyers and suppliers on them. A platform adds it with one script and one element on its page.',
        'The first space is for industrial minerals. It runs as a test instance with synthetic data; no real person and no real organisation uses it yet.',
      ],
    },
  ],
  terms: {
    title: 'The terms',
    lede: 'The words Linkbot uses, each with one meaning, the same on this site, in the widget and in the docs.',
  },
};

export type Faq = typeof en;
