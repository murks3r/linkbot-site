/* The site's words in English: the source every other language is typed against. Every sentence
   states what the Space API contract (0.2.7) and the Connect lane's docs provide today, nothing
   else: no "verified", "live", "automated", "anonymous", "real-time", "stays private", no invented
   numbers, no feature the product does not have on the staging space (tests/i18n.test.mjs). */

/** Where a capability stands: on the staging space now; in the contract, not on staging yet; not built. */
export type Status = 'now' | 'contract' | 'later';

export const en = {
  site: {
    name: 'Linkbot',
    claim: 'A matching layer any platform can embed.',
    skip: 'Skip to content',
    menu: 'Menu',
    toc: 'On this page',
    language: 'Language',
    nav: { how: 'How it works', platforms: 'For platforms', verticals: 'For verticals' },
    footer: {
      product: 'Linkbot',
      legal: 'Legal',
      imprint: 'Imprint',
      privacy: 'Privacy notice',
      line: 'This site sets no cookies, loads nothing from third parties and uses no analytics.',
    },
    status: { now: 'On the staging space now', contract: 'In the contract, not on staging yet', later: 'Not built yet' },
    synthetic: 'Everything on this site describes the Space API contract and what runs on Geoprocure’s synthetic staging space, with synthetic data. No real person and no real organisation uses it yet.',
    more: 'Read more',
  },

  home: {
    title: 'Linkbot: needs meet offers, people decide',
    description: 'A matching layer any platform can embed: one space per market, needs and offers as confirmed criteria, and an introduction only after both sides say yes.',
    h1: ['Needs meet offers.', 'People decide.'],
    lede: 'Linkbot is a matching layer a platform embeds in its own pages. One space per market. Needs and offers as confirmed criteria. A verdict per criterion, never a score. An introduction only after both sides say yes.',
    actions: { how: 'How it works', platforms: 'For platforms' },
    flow: {
      label: 'From a need to an introduction',
      steps: [
        { name: 'Describe', note: 'a need or an offer, by form' },
        { name: 'Confirm', note: 'nothing is stored before' },
        { name: 'Fit', note: 'one verdict per criterion' },
        { name: 'Approve', note: 'a named operator, after the gates' },
        { name: 'Both yes', note: 'each side for itself' },
        { name: 'Introduce', note: 'then, and only then' },
      ],
    },
    pillars: [
      { title: 'One space per market.', body: 'A space is one market on one platform, with its own instance, database and keys. A pack gives it the vocabulary of its vertical: the criteria, the options, the units, the questions. The first space is Geoprocure’s, for industrial minerals.' },
      { title: 'Criteria, confirmed.', body: 'A need or an offer is a set of criteria, each with its source and its importance. Nothing is pre-selected, nothing is guessed, and what is not stated stays unknown. The person confirms the form; only then is anything stored.' },
      { title: 'An introduction only after both say yes.', body: 'Matching compares the stored criteria and shows a verdict per criterion. An introduction needs the gates of the space, a named operator’s approval and a yes from both sides. The server creates it then, and refuses every other way.' },
    ],
    ways: {
      title: 'Four ways to say what you need or offer',
      lede: 'The form runs on the staging space today. Text, the board and watches are in the contract and not on staging yet.',
      items: [
        { name: 'By form', status: 'now' as Status, body: 'The form comes from the pack: required criteria first, every list with “other / not listed”, “don’t know” and “any”. The widget shows it in the platform’s pages.' },
        { name: 'In your own words', status: 'contract' as Status, body: 'A reading proposes values with the quote each came from and asks where it is unsure. It never overwrites what a person chose. Off until a reading policy is approved.' },
        { name: 'On the board', status: 'contract' as Status, body: 'Open needs and offers, listed only when their owner opted in, with the pack’s coarsened values and never who posted. Answering one starts a draft on the other side.' },
        { name: 'With a watch', status: 'contract' as Status, body: 'A watch keeps a need or an offer open and tells only its owner when something new fits.' },
      ],
    },
    rules: {
      title: 'The rules, enforced by the server',
      items: [
        'Never guess: every stored value carries its source, and “other” is never mapped to the nearest option.',
        'Nothing pre-selected: the form has no default values, only suggestions marked as such.',
        'Unknown stays unknown: a criterion one side did not state is never counted as a fit.',
        'Nothing is stored before a person confirms.',
        'A match discloses nothing: only verdicts, at the stage the pack allows, and a notice that people decide.',
        'No introduction without the gates, a named operator’s approval and a yes from both sides.',
        'No model overrules a hard condition: must and never are decided by deterministic code.',
        'Every write names who did it and appears in the audit log.',
      ],
      link: 'How matching works, step by step',
    },
    platforms: { title: 'For platforms', body: 'One script and one element put a space on your page. Your page holds a publishable key that works only on your origins; the secret key stays on your server. Your team approves cases in a console that runs on your machine or behind your own login.', link: 'What a platform gets' },
    verticals: { title: 'For verticals', body: 'A pack describes a market: its criteria, options and units, its labels and questions in the space’s languages, what each criterion discloses at each stage, and the gates the market needs. The first is industrial minerals.', link: 'What a pack holds' },
    state: { title: 'Where it stands', body: 'This site shows no demo of the widget until a demo space with synthetic data exists.' },
  },

  how: {
    title: 'How Linkbot works: from a confirmed need to an introduction',
    description: 'A space, a pack, four ways to describe a need or an offer, a verdict per criterion, approval by a named operator, an introduction only after both say yes.',
    eyebrow: 'How it works',
    h1: ['From a confirmed need', 'to an introduction.'],
    lede: 'Every step below is in the Space API contract. Where the staging space does not run a step yet, the page says so.',
    toc: [['space', 'A space'], ['pack', 'A pack'], ['describe', 'Four ways to describe'], ['confirm', 'Confirm'], ['matching', 'Matching'], ['approval', 'Approval and gates'], ['yes', 'Both yes'], ['introduction', 'The introduction'], ['after', 'Afterwards'], ['sees', 'Who sees what'], ['languages', 'Five languages'], ['today', 'What works today']] as [string, string][],
    space: {
      title: 'A space is one market on one platform',
      paras: [
        'Every space is its own instance: its own application, database, keys and deletion log. The address of the instance identifies the space; no space id appears in any path.',
        'A space is set up with a pack and a version of it, the languages it offers, the mode of its introductions, the gates it requires and the origins its pages are allowed on. The platform’s page holds a publishable key, which only identifies the space and works only on those origins. The secret key stays on the platform’s server and never appears in a page.',
        'Matching runs inside a space. Nothing leaves it: no need, no offer and no fit is shared with another space.',
        'The first space is Geoprocure’s, for industrial minerals. It runs on a synthetic staging instance with synthetic data.',
      ],
    },
    pack: {
      title: 'A pack is the vocabulary of a vertical',
      paras: [
        'A pack lists the criteria a need and an offer can state, each with its control: a choice, several choices, a number with a unit, a range, a date window, a searchable list such as ports, or free text. Where a quantity depends on a basis, the pack says so, and “don’t know” keeps the basis unknown rather than picking one.',
        'The pack says which special answers a criterion allows: “other / not listed”, which keeps the person’s words and is never mapped to an option; “don’t know”; and “any”. It carries the labels, questions, synonyms and notices in the space’s languages.',
        'It also sets what each criterion discloses at each stage: on the board, in a possible fit, in an introduction, or to the platform’s team only; how a value is coarsened for the board; which importances a criterion allows; and the gates and the outcome categories of the market.',
        'A space pins one version of its pack, and the server validates every submission against that version. The client is never trusted.',
      ],
    },
    describe: {
      title: 'Four ways to say what you need or offer',
      lede: 'The form runs on the staging space today. Text, the board and watches are in the contract; the instance answers them with “not implemented” until their slice is built.',
      items: [
        { name: 'By form', status: 'now' as Status, paras: [
          'The form is generated from the pack. Required criteria come first; the rest sit behind “more details”. Nothing is pre-selected: no option, no unit, no basis, no party type. Every list offers “other / not listed”, “don’t know” and “any” where the pack allows them.',
          'Each criterion carries an importance. Must and never are hard; prefer, open to and rather not are soft. The pack may suggest one, marked “suggested”, and the person can change it unless the pack locks it. Choosing never asks for a separate confirmation.',
        ] },
        { name: 'In your own words', status: 'contract' as Status, paras: [
          'A person writes what they need or offer. A reading proposes values for the same criteria, each shown next to the words it came from, and asks where it cannot decide: a unit, an option, a number that two conventions read differently. A reading never overwrites what a person chose; a difference becomes a question.',
          'The text path is off until a reading policy is approved. Whatever reads the text, hard conditions stay with deterministic code: no model overrules a must or a never.',
        ] },
        { name: 'On the board', status: 'contract' as Status, paras: [
          'The board lists needs and offers whose owner opted in, never by default. It shows only the fields the pack allows at board stage, coarsened as the pack declares, and never who posted. Answering a listing starts a draft on the other side, in the same form.',
        ] },
        { name: 'With a watch', status: 'contract' as Status, paras: [
          'A watch keeps a need or an offer open and tells its owner when something new fits, by email or, for the platform, by webhook. It notifies only its owner and never discloses more than the board does. A person can pause, resume or end it, also from the link in a message.',
        ] },
      ],
    },
    confirm: {
      title: 'Confirming is the first thing that is stored',
      paras: [
        'Before a person confirms, nothing personal is stored: describing, answering and validating leave nothing behind. The widget says so above the confirm button: “Nothing is used until you confirm.” A draft lives in the browser tab and is gone when the tab closes.',
        'The confirm step is the form. The server validates every value against the pinned pack and names each field that fails. What is stored: the criteria with their values, sources and importances; the party, a person or an organisation with an optional display name; and, if given, an email address, which the person confirms through a link.',
        'The browser that confirmed manages what it created: it shows “mine”, answers possible fits and changes the watch, for sixty days from last use, and only in that tab. A new browser gets access again through a link sent to the confirmed address.',
        'On a space with a party check, such as Geoprocure’s, the confirm step shows the space’s own notice. The person ticks the release of their identity for that check themselves; nothing is ticked in advance, and a confirm without it is refused.',
      ],
    },
    matching: {
      title: 'Matching: one verdict per criterion, never a score',
      paras: [
        'Matching runs on the stored values with deterministic rules, after a confirm, after a change and once a day. It compares the need’s requirements with the facts the offer states.',
        'For every criterion the pack lets it compare, a match shows one verdict: meets, partly, conflicts or unknown, with the rule that decided it and the stored values it cites. A limit kept is a fit, a limit straddled is partly, a limit missed conflicts. “Any” on the need meets. “Don’t know” or “other” on either side is unknown, and unknown is never a fit.',
        'Whether a pair can be a fit at all follows from the hard conditions alone, must and never. Nothing else changes what the other side sees. There is no score.',
        'A possible fit discloses nothing by itself: only the verdicts on fields the pack allows at match stage, and a fixed notice that people decide. When one need or offer has had many new fits in a short time, the space holds the rest back and a later run proposes them.',
      ],
    },
    approval: {
      title: 'Approval and gates: a named person, never the system',
      paras: [
        'Each case is approved by a named, active operator of the platform. Before that, every gate the space requires has to be recorded as passed by a named operator. A gate is never decided by the system: the operator records a check done elsewhere, with a reference and without personal data.',
        'Geoprocure’s required gate is a KYC and sanctions check. It cannot be waived. An operator may refer it to counsel, which keeps it open. The latest record of a gate decides.',
        'An approval alone discloses nothing. A declined case is recorded as declined; its reason stays in the audit log.',
      ],
    },
    yes: {
      title: 'Both sides say yes, each for itself',
      paras: [
        'Each side answers a possible fit for its own side: yes, no or not now. Before both said yes, the other side learns nothing of the answer. The latest answer counts, so a later no revokes a yes.',
        'The server creates the introduction itself at the moment the last of the three conditions is met, in any order: the gates passed, the case approved, both sides yes. It refuses every other way.',
      ],
    },
    introduction: {
      title: 'The introduction, in the mode the space chose',
      paras: [
        'In operator mode, Geoprocure’s default, the fields at introduction stage go to the platform’s team only: display names, the confirmed email addresses, the criteria the pack keeps for this stage. Each side receives a receipt that says both sides agreed and that the platform will contact them, and that carries nothing of the other side.',
        'In direct mode, each side sees the other side’s fields at introduction stage. The platform’s team sees both. A field the pack keeps for the operator never reaches the other side.',
        'A receipt records who may see which fields, and every read of an introduction is recorded on it. What is not in the receipt is never revealed later.',
      ],
    },
    after: {
      title: 'Afterwards: outcomes, changes, deletion',
      paras: [
        'Both sides are asked for the outcome after thirty, sixty and ninety days; the platform’s team can record it too. The categories come from the space’s settings.',
        'A person can change a confirmed need or offer through the same form, pause it, resume it or close it. Every change runs matching again.',
        'A person can ask for their data to be deleted from the browser that confirmed; the request has to be confirmed through a link sent to an address confirmed earlier. The platform can delete on a person’s behalf, with a reference. What goes: the display name, the addresses, every criterion and consent, the verdicts of their matches, their tokens and their mail. What stays: ids, field keys, times and states, so receipts and the audit log remain consistent. Every deletion is written to the instance’s deletion log, and nothing claims to recall copies that left the instance.',
      ],
    },
    sees: {
      title: 'Who sees what, stage by stage',
      lede: 'The pack gives every criterion a stage. A stage is the furthest a value travels: a match shows no more than its stage allows, and a watch never discloses more than the board does.',
      stages: [
        { name: 'Board', who: 'Everyone who can see the board', what: 'Only fields at board stage, coarsened as the pack declares, only for needs and offers whose owner opted in. Never who posted.' },
        { name: 'Match', who: 'The two sides of a possible fit', what: 'Verdicts on fields at match stage or lower, with the rule and the values it cites. No name, no contact details, no sign of the other side’s answer.' },
        { name: 'Introduction', who: 'In operator mode the platform’s team; in direct mode both sides', what: 'Display name, confirmed email address and the criteria the pack keeps for this stage. Every read is recorded on the receipt.' },
        { name: 'Operator', who: 'The platform’s team only', what: 'Fields the pack keeps for the platform, such as the identity details for a KYC check. They never reach the other side, and every access is recorded.' },
      ],
    },
    languages: {
      title: 'Five languages, and no translation of your words',
      paras: [
        'The widget runs in English, German, Spanish, Italian and French. The page sets the language, then the visitor’s browser, then the space’s default; a language the space does not offer falls back, and the widget says so on screen.',
        'The Space API answers in the language asked for, or in the space’s default, and says which. Labels, questions, explanations and notices come in that language.',
        'A person’s own text is never translated. The language of the form and the language of the words are independent.',
      ],
    },
    today: {
      title: 'What works today, and what does not yet',
      lede: 'Exactly which parts run on the staging space now, with the same squares the product uses for evidence.',
      columns: [
        { status: 'now' as Status, title: 'On the staging space now', lead: 'Synthetic data, in German and English.', items: [
          'Describing a need or an offer by form, with the identity notice where the space has one',
          'Confirming; the browser that confirmed manages what it created',
          'Matching with a verdict per criterion',
          'Gates and approval by a named operator',
          'Introductions in operator mode, with receipts',
          'Outcomes, changes, pausing and closing',
          'Deletion with the instance’s deletion log',
          'The widget’s describe mode against the staging space; the instance does not serve the widget itself yet',
        ] },
        { status: 'contract' as Status, title: 'In the contract, not on staging yet', lead: 'The instance answers “not implemented” until the slice is built.', items: [
          'Reading a need or an offer from text',
          'The board',
          'Watches and their messages',
          'Webhooks to the platform’s server',
          'Email that leaves the instance; today nothing is sent',
          'The console’s settings, origins, keys and funnel',
        ] },
        { status: 'later' as Status, title: 'Not built', lead: 'Not promised as a date.', items: [
          'A demo of the widget on this site; it waits for a demo space with synthetic data',
          'Published packages for WordPress, Next.js and Astro; the recipes exist and run in CI',
        ] },
      ],
    },
  },

  platforms: {
    title: 'For platforms: a Linkbot space on your own pages',
    description: 'A Linkbot space on your own pages: one script and one element, a publishable key, your own data notice, a console for your team, webhooks for your server.',
    eyebrow: 'For platforms',
    h1: ['A space', 'on your own pages.'],
    lede: 'One script and one element show the widget in your page, in your fonts and colours. Your team approves cases in a console on your machine or behind your own login. Your server hears about events through signed webhooks.',
    toc: [['embed', 'The embed'], ['keys', 'Keys and origins'], ['console', 'The console'], ['server', 'SDK and webhooks'], ['recipes', 'Recipes'], ['state', 'Where it stands']] as [string, string][],
    embed: {
      title: 'The embed: one script, one element',
      paras: [
        'The script comes from your space’s own instance. The element carries your publishable key, the mode (describe, board or mine), the side (a need or an offer) and the language. Several elements on one page are several widgets.',
        'The widget renders in a shadow root, takes your page’s font and text colour and sets everything else through CSS variables on the element. It needs no “unsafe-inline” under a Content Security Policy.',
        'Your own data notice goes inside the element and appears above the confirm button, next to the widget’s fixed lines. The widget sets no cookies, keeps its draft and tokens in the browser tab, and sends nothing to anyone but your space.',
      ],
    },
    keys: {
      title: 'Keys and origins',
      paras: [
        'A publishable key identifies your space and works only on the origins your space allows; it belongs in the page. A secret key belongs on your server; the widget refuses to start with one and tells you to rotate it.',
        'Today the allowed origins are set when a space is provisioned; the console cannot change them yet.',
      ],
    },
    console: {
      title: 'The console for your team',
      paras: [
        'The console shows the approval queue, each case with its gates and approval, the introductions with their receipts, the outcomes, the webhook endpoints and the operators. It runs on a machine of yours or behind your own login; the secret key stays on its server. There is no Linkbot login for operators.',
        'Settings, origins, keys and a funnel wait for the routes the contract adds next.',
      ],
    },
    server: {
      title: 'Your server: the SDK and webhooks',
      paras: [
        'The SDK gives your server a client typed by the Space API contract: a route, field or value the contract does not have is a type error. It also checks webhook deliveries exactly as the contract specifies. It is not published yet; its code is in the Connect repository.',
        'Webhooks carry ids and states, never contact data; your server fetches details with its secret key. Deliveries are signed and retried. They are in the contract and not sent by the staging space yet.',
      ],
    },
    recipes: {
      title: 'Recipes: plain HTML, Astro, Next.js, WordPress',
      paras: [
        'Each recipe is a file that runs in Connect’s CI in three browser engines against the sample build with synthetic data: a plain page with a strict Content Security Policy, an Astro component, a Next.js page with the React wrapper, and a small WordPress plugin with a shortcode.',
        'None of them runs against a real space as written yet: the staging instance serves a test fixture in place of the widget until a release is deployed there.',
      ],
    },
    state: { title: 'Where it stands' },
  },

  verticals: {
    title: 'For verticals: a pack per market',
    description: 'A pack holds a market’s vocabulary: criteria, options, units, labels, disclosure per stage, gates and outcomes. The first space: industrial minerals.',
    eyebrow: 'For verticals',
    h1: ['A pack', 'per market.'],
    lede: 'A vertical joins Linkbot as a pack: the criteria of its market, the answers they allow, what each one discloses and when, and the gates the market needs. A space pins the pack; the form, the reading, the board and the matching rules follow from it.',
    toc: [['holds', 'What a pack holds'], ['first', 'The first space'], ['next', 'More verticals']] as [string, string][],
    holds: {
      title: 'What a pack holds',
      items: [
        'Criteria with their controls: a choice, several choices, a number with a unit, a range, a date window, a searchable list, free text',
        'Options, units and bases, with the conversions the pack declares; a conversion runs only through the offer’s own stated basis, never by assumption',
        'Which special answers each criterion allows: “other / not listed”, “don’t know”, “any”',
        'Which importances a criterion allows, and the suggested one',
        'The stage of every criterion, board, match, introduction or operator, and how a value is coarsened for the board',
        'Labels, questions, synonyms and notices in the space’s languages',
        'The gates of the market and the categories of an outcome',
      ],
    },
    first: {
      title: 'The first space: industrial minerals',
      paras: [
        'Geoprocure runs the first space, for industrial minerals, on a synthetic staging instance. Its required gate is a KYC and sanctions check, recorded by a named operator and never waived. Its introductions run in operator mode: Geoprocure’s team brings both sides together.',
      ],
    },
    next: {
      title: 'More verticals',
      paras: [
        'A vertical needs its pack and a platform that runs the space. A second pack with synthetic data is planned, so that a demo space can show the widget on this site without a real market.',
      ],
    },
  },

  privacy: {
    title: 'Privacy notice · Linkbot',
    description: 'The privacy notice for this website is in preparation. What is already true: the site sets no cookies, loads nothing from third parties and uses no analytics.',
    eyebrow: 'Privacy notice',
    h1: 'In preparation',
    lede: 'The privacy notice for this website is being written and reviewed. It appears here once it is released. Nothing is shown until then, because a legal text may not be drafted by guesswork.',
    facts: {
      title: 'What is already true of this site',
      items: [
        'It sets no cookies and uses no analytics or tracking.',
        'It loads nothing from third parties: the typefaces and images come from this site.',
        'It has no form and no account. Nothing you type reaches anyone.',
        'The product runs on a platform’s own pages, under that platform’s data notice, next to the widget’s fixed lines.',
      ],
    },
  },

  imprint: {
    title: 'Imprint · Linkbot',
    description: 'The legal notice for Linkbot’s website: provider and contact details. The text is in preparation.',
    eyebrow: 'Imprint',
    h1: 'In preparation',
    lede: 'The legal notice (provider, address, representatives, register and tax details, contact) is being prepared and appears here once it is confirmed. Nothing is shown until then, because none of it may be invented.',
  },

  notFound: {
    title: 'Page not found · Linkbot',
    description: 'This page does not exist. Go to the home page, or read the site in another language.',
    eyebrow: 'Page not found',
    h1: 'There’s nothing here.',
    lede: 'The page may have moved.',
    home: 'Go to the home page',
    languages: 'This site in other languages',
  },
};

export type Catalogue = typeof en;
