/* The draft page /developers/a-new-vertical, in English only: what a pack is and the steps from a scaffold to a
   registered pack, with the second synthetic vertical, expert engagements, as the example. The steps are a way for
   Linkbot's own repository; part of it is on a development branch and none of it runs on a staging space, so the page
   is a draft for the owner's review: linked from nowhere, never indexed, out of the sitemap, and left out of
   production builds. Every sentence has its row in docs/truth-check.md (section "/developers/a-new-vertical"). */
import { buildsDraft, type Draft } from './draft.ts';
import { PUBLIC_NAME } from '../i18n/terms.ts';

/** Whether a production build carries the draft. Set it to true once the way is merged and the owner approves the page. */
export const NEW_VERTICAL_IN_PRODUCTION = false;

/** Whether a build carries the draft (src/drafts/draft.ts). */
export const buildsNewVertical = (env: { VERCEL_ENV?: string }, inProduction = NEW_VERTICAL_IN_PRODUCTION): boolean =>
  buildsDraft(env, inProduction);

export const newVertical: Draft = {
  banner: 'Draft, not published: planned, not on the staging space.',
  bannerNote: `This page is linked from nowhere on the site, is never indexed and exists in English only. Part of the way it describes is on a development branch of ${PUBLIC_NAME}’s repository and not merged; none of it runs on the staging space, and its example pack holds synthetic data only.`,
  title: 'A new vertical (planned, draft)',
  description: 'Draft: what a pack is, and the steps from a scaffold to a registered pack, with a synthetic example vertical. Planned, not on the staging space.',
  eyebrow: 'Developers · planned · draft',
  h1: ['A new vertical:', 'one pack, nothing else.'],
  lede: `How a vertical joins ${PUBLIC_NAME}: as a pack, written and checked step by step, with no change to the engine. The example is expert engagements, a second vertical with synthetic data that went through every step below. The page names no date and no customer.`,
  sections: [
    {
      id: 'pack',
      title: 'What a pack is',
      paragraphs: [
        'A pack is the vocabulary of one vertical: the criteria a need and an offer can state, the option lists and units they use, the labels in five languages, and for every criterion the stage it travels to and how a board card coarsens it.',
        'A space pins one version of its pack by its hash, and the server checks every submission against that version. The form, the reading, the board and the matching rules follow from the pack.',
      ],
    },
    {
      id: 'today',
      title: `Today: a way inside ${PUBLIC_NAME}’s repository`,
      paragraphs: [
        `A pack is written in ${PUBLIC_NAME}’s own repository. A platform cannot add a pack itself, and there is no hosted service for it.`,
        'The check of step 5 is on the repository’s integration branch for the first release. The one-command scaffold, the check of the pins, the reading rule of step 6 and the example pack are on a development branch and not merged. Every pack is a draft, and none has left that state.',
      ],
    },
    {
      id: 'example',
      title: 'The example: expert engagements',
      paragraphs: [
        'An organisation that needs expert help for an engagement of limited length, on one side, and an organisation that offers it, on the other. No party is a person: the pack’s criteria ask for and compare no name, contact or photo.',
        'Eight criteria: the field, the type of engagement, the duration, the work mode, the start window, the working languages, a budget band and notes. A duration is in days or weeks, a budget in euros, net, for the whole engagement. Months, day rates and other currencies are not offered, so a text that uses them is asked about and not guessed.',
        'On a board card the field, the type and the work mode show as stated and the start window as a quarter; the duration, the budget, the languages and the notes stay off the card. The pack is pinned only by a local space with synthetic data.',
      ],
    },
    {
      id: 'questions',
      title: 'Step 1: five questions, before any file',
      paragraphs: [
        'Who is on each side, and is it an organisation or a person? What must a person say for a match to mean something? Which of those are hard limits and which are wishes? What must a board card never reveal? Which numbers exist, and in which unit?',
        'If an answer needs something the pack format cannot say, the vertical asks for a change to the format and does not work around it.',
      ],
    },
    {
      id: 'scaffold',
      title: 'Step 2: scaffold',
      paragraphs: [
        'One command writes a new pack with two example criteria and placeholder labels, builds its first version, checks it against the pack schema and registers it as a draft. The scaffold already passes the checks; the rest of the work is replacing the example.',
      ],
    },
    {
      id: 'fill',
      title: 'Step 3: replace the example with the vertical',
      paragraphs: [
        'In this order: the pack’s name, its parties and the sections of its form; the option lists, with codes that are never reused or given a new meaning; the units, with their conversions and the words people write for them; the criteria, each with its control, the special answers it allows, its importance, its stage and its coarsening for the board.',
        'Then synthetic samples: offers marked as test data and pairs of a need and an offer with the verdict expected for each criterion, which a reference evaluator recomputes. Expert engagements has 4 option lists with 31 options, 2 synthetic offers and 4 pairs.',
      ],
    },
    {
      id: 'languages',
      title: 'Step 4: labels in five languages',
      paragraphs: [
        'Every label exists in English, German, Spanish, Italian and French. English and German are the reviewed pair; the Spanish, Italian and French labels of the example are drafts that wait for a native reader, and a pack does not leave draft before each is read.',
      ],
    },
    {
      id: 'check',
      title: 'Step 5: validate, build, check',
      paragraphs: [
        'One check validates the sources, builds the version folder from them byte for byte the same each time, checks it against the schema and its cross-rules, and confirms that the version is registered and unchanged.',
        'The rules it enforces: five languages everywhere, nothing pre-selected, a coarsening for every criterion shown on the board, and no identity field unless a party is a person.',
      ],
    },
    {
      id: 'reader',
      title: 'Step 6, only if needed: a rule for reading text',
      paragraphs: [
        'A pack may add a rule for how a description in a person’s own words is read. Expert engagements needed one: a bare duration in an offer, such as “12 weeks”, is the engagement’s length, while the same words in a need stay a question.',
        'The engine does not accept a pack version with such a rule yet. Until it does, a local space pins the version of the example without it, which has the same criteria.',
      ],
    },
    {
      id: 'version',
      title: 'Step 7: a change is a new version',
      paragraphs: [
        'A registered version never changes, because spaces pin it by its hash. A change is a new version, registered next to the old ones. Expert engagements has three: the scaffold filled in, a reworded label for the board stage, and the reading rule.',
      ],
    },
    {
      id: 'pin',
      title: 'Step 8: pin it in a space',
      paragraphs: [
        'A space’s setup file names the pack, its version and the hash from the registry. A check confirms that every pinned version is registered, that the hashes are equal and that each space pins one pack. A plan step shows what the platform would create, without a network.',
        'Nothing in this example is set up on a server or deployed.',
      ],
    },
  ],
  open: {
    title: 'Open',
    items: [
      `Whether a pack can be written outside ${PUBLIC_NAME}’s repository, and by whom.`,
      'Whether a person, such as an independent expert, may be a party in expert engagements.',
      'A coarse band for a duration or a budget on a board card; today the format has a band for tonnes only.',
      'The engine accepting a pack version with a reading rule.',
      'A native reader for the Spanish, Italian and French labels.',
      'Leaving draft, for any pack.',
    ],
  },
};
