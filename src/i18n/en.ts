/* The site's words in English: the source every other language is typed against. Every sentence
   states what the Space API contract (0.2.7) and the Connect lane's docs provide today, nothing
   else: no "verified", "live", "automated", "anonymous", "real-time", "stays private", no invented
   numbers, no feature the product does not have on the staging space (tests/i18n.test.mjs). */

/** Where a capability stands: on the staging space now; in the contract, not on staging yet; not built. */
export type Status = 'now' | 'contract' | 'later';

/** A row of a two- or three-column table on an integration page. */
export interface Row { name: string; what: string; more?: string }
/** A section of an integration page: paragraphs, a list, a table, or a mix; `code` sets names and items in code. */
export interface Section { id: string; title: string; paras?: string[]; items?: string[]; rows?: Row[]; columns?: string[]; code?: boolean }

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
          'Each criterion carries an importance. Must and never are hard; nice to have, open to and rather not are soft. The pack may suggest one, marked “suggested”, and the person can change it unless the pack locks it. Choosing never asks for a separate confirmation.',
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
    toc: [['pages', 'Each integration'], ['embed', 'The embed'], ['keys', 'Keys and origins'], ['console', 'The console'], ['server', 'SDK and webhooks'], ['recipes', 'Recipes'], ['state', 'Where it stands']] as [string, string][],
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
        'It has no account and sends nothing you type anywhere: the fields on the home page work in your browser only, and the site stores nothing.',
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

  /* S2: one page per integration, each with only what the Connect lane's docs show today. The
     sections carry paragraphs, a list, or a table (rows with two or three columns). */
  integrations: {
    eyebrow: 'For platforms',
    hub: 'Each integration on its own page',
    state: 'Where it stands',
    pages: {
      embed: {
        nav: 'The embed',
        title: 'The embed: one script, one element · Linkbot for platforms',
        description: 'What a page sets on the embed: the element’s attributes, your data notice, the theme variables, the Content Security Policy, what the widget keeps and sends.',
        h1: ['One script,', 'one element.'],
        lede: 'The widget is one script and one element per place it appears. Your page sets its key, its mode, its side and its language; everything else comes from your space.',
        sections: [
          { id: 'element', title: 'The element', paras: [
            'Load the script once per page, with async, so your page renders without waiting for it. Put the element where the form should appear. Several elements on one page are several widgets, and elements added later, as single-page applications do, start on their own.',
            'A value the widget does not know falls back to the default, with a warning in the browser console. A language the space does not offer falls back too, and the widget says so on screen.',
          ], code: true, columns: ['Attribute', 'Values', 'Default'], rows: [
            { name: 'data-linkbot', what: 'your publishable key. The widget refuses to start with a secret key and tells you to rotate it', more: 'required' },
            { name: 'data-mode', what: 'describe (say what you need or offer), board (browse and answer listings), mine (my requests, watches and possible fits)', more: 'describe' },
            { name: 'data-side', what: 'seeking (a need) or offer', more: 'seeking' },
            { name: 'data-locale', what: 'en, de, es, it or fr', more: 'the visitor’s browser language, then the space default' },
            { name: 'data-input', what: 'form, text or both; it can only narrow what the space allows', more: 'the space’s setting' },
            { name: 'data-api', what: 'your space’s API base, https only (http on localhost)', more: 'the origin the script was loaded from' },
          ] },
          { id: 'notice', title: 'Your data notice', paras: ['A child with slot="notice" appears just above the confirm button, styled by your page’s CSS. The widget adds its own fixed lines next to it, such as “Nothing is used until you confirm.” What you write there comes from your own privacy texts.'] },
          { id: 'design', title: 'Design', paras: [
            'The widget takes your page’s font and text colour. Everything else is set by CSS variables on the element: the accent for the primary button, selected choices and focus rings, its hover, the corner radius, text and secondary text, headings and their font, the font of field labels, card borders and dividers, field borders, card and surface backgrounds, and the error colour and background.',
            'The widget picks black or white text for the accent, whichever contrasts more. If your page is dark, set color-scheme: dark on the element. Your page’s other styles do not reach inside the widget, which renders in a shadow root, and the widget’s styles do not reach your page.',
          ] },
          { id: 'csp', title: 'Content Security Policy', paras: [
            'Allow the origin of the script in script-src, and the Space API’s origin in connect-src, plus the script’s origin if it differs: the widget loads a language other than English from next to itself and checks it against a sha256 built into the script.',
            'Styles need no “unsafe-inline”: the widget uses a constructable stylesheet. In browsers without one it adds a single style element that carries the nonce of its own script tag, so put your nonce on the script tag if your policy uses nonces. If you host the script yourself, copy its locales folder with it.',
          ] },
          { id: 'global', title: 'The page’s global', paras: ['The script defines one global, window.Linkbot, and nothing else: the embed’s version, whether it is the sample build, and mount and unmount for an element the scan cannot see, for example inside your own shadow root.'] },
          { id: 'keeps', title: 'What the widget keeps, and what it sends', paras: [
            'Its guest session and owner tokens sit in sessionStorage, per tab and per space. It uses no cookies and no localStorage. Requests go to the Space API only, without credentials. There are no analytics. The sample build sends nothing over the network.',
            'sessionStorage belongs to your page’s origin, so any script you run on that page can read the draft and the tokens. Run no scripts you do not trust on pages that carry the widget.',
          ] },
        ] as Section[],
        state: ['The script comes from your space’s own instance. The staging instance serves a test fixture in its place until a release of the widget is deployed there; on 2026-10-23 the widget ran against the staging space’s API with the released script served from a local stand-in for that address.'],
      },
      sdk: {
        nav: 'SDK and webhooks',
        title: 'The SDK, the React wrapper and webhooks · Linkbot for platforms',
        description: 'A server client typed by the Space API contract, the webhook check, the React wrapper, and how your server receives Linkbot’s events.',
        h1: ['Your server,', 'typed by the contract.'],
        lede: 'Nothing of the SDK goes into a browser page: the embed takes the publishable key, and the SDK’s client refuses to start in a browser. It is not published yet; its code is in the Connect repository.',
        sections: [
          { id: 'client', title: 'The client', paras: [
            'The client takes your space’s API base (https only, except on localhost), your secret key from your server’s secret store (a value that is not shaped like a secret key is refused) and, if you want, your runtime’s fetch. Its paths, parameters, bodies and responses are the contract’s own, generated from the YAML Core posted and pinned by sha256: a route, field or value the contract does not have is a type error.',
            'A fresh idempotency key is one call away. Writes the contract marks need one; keep the key with the write and send the same key when you retry it, so the space does the write once.',
          ] },
          { id: 'seeding', title: 'Seeding your platform’s own offer', paras: ['Your server seeds an offer on the operator path, and a second operator confirms it: four eyes. On a space that checks each party, such as Geoprocure’s, seeding your own organisation’s offer counts as a confirm, so it carries the identity release the space’s notice asks for, and the space refuses it without one. This is for your own organisation only; anyone else’s release is theirs to give, in the widget.'] },
          { id: 'webhooks', title: 'Webhooks', paras: [
            'Register an endpoint with your secret key, https only. The signing secret is shown once and belongs in your secret store, never in code. Each delivery carries an id, a timestamp in seconds and a signature: the HMAC-SHA256 of the timestamp, a dot and the raw body, keyed with your secret.',
            'Refuse a delivery older than five minutes or whose signature does not match. The SDK’s check does both, comparing in constant time with Web Crypto, in Node, Deno, Bun and edge runtimes. Check the raw body before you parse it. Answer 2xx quickly: anything else is retried with backoff for 24 hours, then the delivery is marked dead. A retry carries the same id, so handle each id once, with the ids in your database rather than in memory.',
            'Rotate the secret when you need to: the old one stays valid for up to seven days, and the check takes both. Deliveries carry ids and states, never contact data; fetch details with your secret key. The delivery log lists status, attempts and a hash of the body, never the body. Webhooks are in the contract and not sent by the staging space yet.',
          ] },
          { id: 'events', title: 'Event types', paras: ['Every event has an id, a type, the space id, the time it occurred, the contract version and the object it is about, with its type, id and state where there is one. The types:'], code: true, items: ['intent.confirmed', 'intent.revised', 'intent.status_changed', 'match.proposed', 'match.updated', 'gate.recorded', 'approval.recorded', 'answer.recorded', 'clarification.requested', 'review.recorded', 'introduction.created', 'outcome.recorded', 'watch.delivered', 'channel.verified', 'deletion.completed', 'key.rotated'] },
          { id: 'react', title: 'The React wrapper', paras: [
            'The wrapper renders the same element as the snippet and loads the script once per address; the embed then starts in its own shadow root, which React never touches. It is a client component, so it works in the Next.js App Router, and it adds no global CSS.',
            'Its props are the element’s attributes: the publishable key and the script address are required (a secret key throws), then mode, side, locale, input, api, your notice, a class name and a style for the theme variables. When a prop the embed reads changes, the wrapper gives React a new element and the embed starts afresh. A page that wants the script loaded before it renders an element can ask for that too. Not published yet.',
          ] },
        ] as Section[],
        state: ['The SDK and the wrapper are built and tested in the Connect repository and not published. The webhooks guide’s receiver is tested against signed sample deliveries; the staging space does not send webhooks yet.'],
      },
      console: {
        nav: 'The console',
        title: 'The console for your team · Linkbot for platforms',
        description: 'The approval queue, cases with gates and approval, introductions with receipts, outcomes, webhooks and operators, on your machine or behind your own login.',
        h1: ['Your team’s console,', 'behind your own login.'],
        lede: 'The console is a small server, the only place the space’s secret key is used, plus the page your team works in. There is no Linkbot login for operators: your platform signs its team in. You run it on your own machine as a local tool, or mount its handler behind your platform’s login. It is never a public Linkbot page.',
        sections: [
          { id: 'views', title: 'What it shows', columns: ['View', 'What it shows'], rows: [
            { name: 'Approval queue', what: 'Cases waiting for your team, with no identities: the fit per criterion, both sides’ answers, missing gates.' },
            { name: 'Case', what: 'The fit per criterion and why. Your team records the case’s checks and each party’s check (passed, failed, referred, and waived only where the gate allows it), a party’s check side by side so one party’s record never reads as the other’s; approves or declines with an optional reason for the audit log; answers for your platform’s own offers or requests only, as the signed-in operator; asks one side to clarify.' },
            { name: 'Introductions', what: 'Listed without contact details. Opening one asks first, then shows the contact fields and records the read. A value from a long list, such as a country or a port, shows by name with its code. Receipts and outcomes.' },
            { name: 'Webhooks', what: 'Add an endpoint (https only); the signing secret is shown once; rotate, with the old secret valid for up to seven days; remove; the delivery log.' },
            { name: 'Operators', what: 'The register: add, deactivate, reactivate.' },
            { name: 'Space and snippet', what: 'The settings as the Space API reports them, and the snippet with your publishable key and your instance’s script address.' },
            { name: 'Setup', what: 'The five steps, with what your space has for each.' },
          ] },
          { id: 'safe', title: 'How the key stays safe', items: [
            'The key stays on the server. The page gets its settings from the server, and the tests check that this response carries no secret key.',
            'No proxy: each operation is listed with the fields it may send; anything else is refused and unlisted fields are dropped.',
            'The server names the operator from your sign-in; an id sent by the page is ignored.',
            'It answers only for your platform’s own side of a case, worked out on the server; the page never picks a side and never gets the intents, which hold identity fields.',
            'Only the console’s own page can call it: its own header, its own origin, same-origin requests, JSON bodies.',
            'Local mode binds to the local machine only and answers only to its own name, which blocks DNS rebinding.',
            'A strict page policy: no inline script or style, no framing, no caching.',
          ] },
          { id: 'run', title: 'Running it', paras: [
            'On sample data: the sample operator API answers from memory with synthetic data, needs no key and sends nothing over the network, and every page says so in a banner. It follows the contract’s rules, so you can try them: a gate that cannot be waived, approval only after the required gates, an introduction only with every gate, the approval and a yes from both sides, and a read receipt when your team opens the contact details.',
            'Against a space: the API base, your secret key from your secret store, your id in the space’s operator register and, if you want the snippet shown, the publishable key. Behind your login: one handler; your session decides who acts, and without a signed-in operator it answers 401. Behind a proxy it needs the public address the browser used.',
            'This path ran against Geoprocure’s synthetic staging space on 2026-10-23: the queue, a case, both kinds of check, the approval, an answer for the platform’s own offer, and an introduction with its receipt.',
          ] },
          { id: 'notyet', title: 'Not here yet, and why', items: [
            'Settings, allowed origins and keys cannot be changed from the console: the contract has no routes for them yet. Spaces are provisioned with Core’s tool, so setting one up from a pack here waits on a route too.',
            'No funnel: it shows no numbers until the Space API reports real ones.',
            'No “send again” for a delivery until there are real deliveries to try it on.',
          ] },
        ] as Section[],
        state: ['The console is built on the Space API contract and ran against the synthetic staging space on 2026-10-23; its tests run against a sample operator API with synthetic data.'],
      },
      wordpress: {
        nav: 'WordPress',
        title: 'WordPress · Linkbot for platforms',
        description: 'A small plugin adds the shortcode for every editor: install it, put it where the form should appear, keep caching plugins away from the script.',
        h1: ['A shortcode', 'for every editor.'],
        lede: 'Pasting the snippet into a Custom HTML block works only for users WordPress lets post scripts, which excludes editors on multisite networks. The plugin adds a shortcode that works for every editor, loads the script once per page through WordPress’s own script loading, and checks every value it prints.',
        sections: [
          { id: 'install', title: 'Install the plugin', paras: ['Copy the plugin folder to the plugins directory, or zip it and upload it under Plugins, then activate it. The whole plugin is one file.'] },
          { id: 'shortcode', title: 'The shortcode', paras: ['In the block editor, add a Shortcode block. The text between the opening and the closing shortcode becomes your data notice, shown above the confirm button. Use the same script address in every shortcode on a page: the plugin loads the script once, from the first.'], code: true, columns: ['Attribute', 'What it is'], rows: [
            { name: 'src', what: 'the https address of the script on your space’s instance; it must be https' },
            { name: 'key', what: 'your publishable key. A secret key shows people who can edit the page a warning, and visitors nothing' },
            { name: 'mode, side, locale, input, api', what: 'the element’s attributes without the data- prefix. A value the plugin does not know is left out, so the widget uses its default' },
          ] },
          { id: 'caching', title: 'Caching and optimisation plugins', paras: ['Plugins that combine, minify, move or delay scripts must leave the script alone: exclude it by its address or by its handle. The widget loads its other languages from next to itself and checks each one against a sha256 it carries, so a copy elsewhere cannot load them. If your host does not allow plugins, the shortcode is not available, and a Custom HTML block works only for users WordPress lets post scripts.'] },
        ] as Section[],
        state: ['Connect’s CI runs the plugin in a real WordPress 6.8 on PHP 8.3 through WordPress Playground and loads its pages in three browser engines against the sample build: the shortcode starts the widget with your notice, two shortcodes on one page load the script once, a shortcode with a secret key shows a visitor nothing. It has not run against a real space as written yet. The recipe is the whole plugin today; a settings page is not part of it.'],
      },
      nextjs: {
        nav: 'Next.js',
        title: 'Next.js · Linkbot for platforms',
        description: 'The React wrapper in the App Router: a client component a server component can render, the public variables, the policy, webhooks in a route handler.',
        h1: ['The wrapper', 'in the App Router.'],
        lede: 'Use the React wrapper. It is a client component, so a server component can render it: the script address and your publishable key as props, the mode, the side and the language, your data notice, and the theme variables in its style.',
        sections: [
          { id: 'props', title: 'Props and variables', paras: ['The script address and the publishable key are required. They are public by design: the key only identifies your space and works only on your allowed origins. Public variables are fixed at build time. The notice is your data notice, shown above the confirm button; the style sets the theme variables and reserves room before the widget loads, so the page below does not jump.'] },
          { id: 'csp', title: 'Content Security Policy', paras: ['Add the script’s origin to script-src, and the Space API’s origin together with the script’s origin to connect-src. The wrapper adds the script tag from the browser: under a nonce-based policy with strict-dynamic that tag is allowed because trusted code adds it; without strict-dynamic, list the script’s origin. The example sends no policy, so Connect’s CI does not test one for Next.js yet.'] },
          { id: 'server', title: 'Your server side', paras: ['Webhooks arrive at a route handler; the webhooks guide shows one for the App Router, in code CI runs. The secret key stays on the server, never in a public variable.'] },
        ] as Section[],
        state: ['Connect’s CI builds the example with Next.js 16.3.8 and React 19.3, which typechecks it, then starts it and runs the page in three browser engines against the sample build: the wrapper loads the script once, the widget starts with the notice and the theme, and the console shows no errors. It has not run against a real space as written yet. No package is published.'],
      },
      astro: {
        nav: 'Astro',
        title: 'Astro · Linkbot for platforms',
        description: 'One component: the script left inline so Astro does not bundle it, the notice through a wrapper, three public variables, and a static build.',
        h1: ['One component,', 'a static build.'],
        lede: 'Copy one component into your site. It renders the script tag and the element from three public variables: the script address on your space’s instance, your publishable key and, if the script comes from another origin, your API base. The page needs no server: a static Astro build works.',
        sections: [
          { id: 'inline', title: 'The script stays inline', paras: ['The script tag carries is:inline, so Astro leaves it alone. The script must load from where it is served, because it fetches its other languages from next to itself and checks each one against a sha256 it carries.'] },
          { id: 'notice', title: 'The notice', paras: ['Astro uses the notice slot name for its own slots and drops the attribute, so the component puts your notice in a wrapper the widget picks up. Your page’s CSS styles it.'] },
          { id: 'twice', title: 'Twice on one page', paras: ['If you use the component twice on one page, the script tag appears twice; the second load does nothing. Set the public variables in your build’s environment or in an environment file you do not commit; they are public by design.'] },
        ] as Section[],
        state: ['Connect’s CI builds the example with Astro 7.3.5 and runs the built page in three browser engines against the sample build: the widget starts, shows the notice, takes the theme, and Astro left the script tag alone. It has not run against a real space as written yet. A packaged Astro integration is not built.'],
      },
    },
  },
};

export type Catalogue = typeof en;
