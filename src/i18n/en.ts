/* The site's words in English: the source every other language is typed against. Every sentence
   states what the Space API contract and the Connect lane's docs provide, nothing
   else: no "verified", "live", "automated", "anonymous", "real-time", "stays private", no invented
   numbers, no feature the product does not have on the test space (tests/i18n.test.mjs). A status
   sentence names the day it was checked (status-date.ts). */

import { statusDate } from './status-date.ts';
import { PUBLIC_NAME } from './terms.ts';

/** The day the status sentences were checked, in English (status-date.ts). */
const AS_OF = statusDate('en');

export const en = {
  site: {
    name: PUBLIC_NAME,
    claim: 'Trust between two businesses before they meet.',
    skip: 'Skip to content',
    menu: 'Menu',
    toc: 'On this page',
    language: 'Language',
    nav: { docs: 'Docs', developers: 'Developers' },
    footer: {
      product: PUBLIC_NAME,
      legal: 'Legal',
      imprint: 'Imprint',
      privacy: 'Privacy notice',
      contact: 'Contact',
      contactPending: `Contact details are in preparation, so this site names no address yet and has no contact form.`,
      line: 'This site sets no cookies, loads nothing from third parties and uses no analytics.',
    },
    synthetic: 'Everything on this site describes the Space API contract and what runs on the synthetic test space, with synthetic data. No real person and no real organisation uses it yet.',
  },

  developers: {
    title: 'For developers: embed the widget or build on the Space API',
    description: 'Where Connect’s docs are, the shortest embed, a short SDK example for your server, and what is not available yet: npm packages and MCP.',
    eyebrow: 'For developers',
    h1: ['One script,', 'or your own interface.'],
    lede: `Two ways to build with a space: the embed, one script and one element on your page, or your own interface on the Space API through the SDK, a client typed by the contract. Connect’s documentation shows both. As of ${AS_OF} it is in the Connect repository, which is not public yet.`,
    toc: [['embed', 'The shortest embed'], ['sdk', 'The SDK on your server'], ['docs', 'The documentation'], ['not-yet', 'Not available yet']] as [string, string][],
    embed: {
      title: 'The shortest embed',
      lede: 'Put it where the form should appear, with your publishable key in the element and your space’s address in the script.',
      url: 'EMBED_URL stands for this address, on your space’s own instance; there is no central host:',
      notes: [
        'The mode is describe, board, watch or mine; the side is seeking or offer. Without a language the widget follows the visitor’s browser.',
        'The publishable key works only on the origins your space allows. A secret key never belongs in a page: the widget refuses to start with one.',
        `As of ${AS_OF}, the instance of the synthetic test space serves the widget’s release 0.6.1-v1.`,
      ],
    },
    sdk: {
      title: 'The SDK on your server',
      lede: 'Run once from your server, with the secret key: it registers your webhook receiver and returns the signing secret, which is shown only this once.',
      notes: [
        `The SDK is not on npm as of ${AS_OF}. It is used from a clone of the Connect repository, where it is a package of the workspace.`,
        `This example’s test runs against a stand-in, not a space. As of ${AS_OF} the test space does not send webhooks.`,
      ],
    },
    docs: {
      title: 'The documentation',
      lede: `Rendered on this site from the open-core export of the Connect repository, in English. As of ${AS_OF} the repository itself is private and nothing of it is published.`,
      sections: {
        quickstart: { name: 'Quickstart (5 minutes)', body: 'A script tag, your publishable key and your page’s origin; then the full quickstart and the person’s path through the API.' },
        widget: { name: 'Widget', body: 'Every attribute of the embed, the React wrapper, and recipes for plain HTML, Astro, Next.js and WordPress.' },
        sdk: { name: 'SDK', body: 'The typed clients for your server and for the person’s side, and the webhook signature check.' },
        cli: { name: 'CLI', body: 'The linkbot command: try the widget on your machine, put it into your site, check the setup. Not published yet.' },
        protocol: { name: 'Protocol', body: 'The Space API contract, the three steps it keeps, and who holds which key.' },
        api: { name: 'API reference', body: 'Every route of the Space API, generated from the contract.' },
        open: { name: 'What is open, what is hosted', body: 'What a platform runs itself, and what stays with the hosted service.' },
      },
    },
    notYet: {
      title: 'Not available yet',
      items: [
        `npm packages: the SDK, the React wrapper and the Next.js and Astro packages are not published as of ${AS_OF}. Today they run from a clone of the Connect repository.`,
        'MCP: planned, not built. There is no MCP endpoint to use.',
        `The repository itself: it is private as of ${AS_OF}.`,
        'A space to try it on: none is offered to developers yet. The examples run against a local sample or a stand-in.',
      ],
    },
  },

  status: {
    title: 'Status: what runs on the test space, what is built, what is planned',
    description: `Where each part of ${PUBLIC_NAME} stands, from the site’s truth check: on the synthetic test space, built but not running there, or planned.`,
    eyebrow: 'Status',
    h1: ['Where it stands,', 'part by part.'],
    lede: `Checked on ${AS_OF} against the test space’s health report and Connect’s plan. This page is built from the site’s truth check, so it says nothing that list does not.`,
    states: {
      test: { title: 'On the test space', lead: 'Synthetic data, in German and English.' },
      built: { title: 'Built or in the contract, not on the test space', lead: 'Not running there and not published.' },
      planned: { title: 'Planned, not built', lead: 'Not promised as a date.' },
    },
    items: {
      form: 'Describing a need or an offer by form, with the identity notice where the space has one',
      text: 'Describing a need or an offer in your own words, read by fixed rules without a model',
      board: 'The board, with the space’s coarsened values, listing only what its owner opted in',
      watches: 'Open searches; their email goes to a test mailbox and reaches no one',
      control: 'A space’s settings, origins, keys and funnel, through the Space API',
      confirm: 'Confirming; the browser that confirmed manages what it created',
      matching: 'Matching with a verdict per criterion',
      gates: 'Gates and approval by a named operator',
      introductions: 'Introductions in operator mode, with receipts',
      outcomes: 'Outcomes, changes, pausing and closing',
      deletion: 'Deletion with the instance’s deletion log',
      widget: 'The widget, served by the instance itself from a pinned release (0.6.1-v1)',
      webhooks: 'Webhooks to the platform’s server: in the contract, and the SDK checks their signatures; the test space does not send them',
      mail: 'Email that reaches an inbox; the test space’s email goes to a test mailbox',
      sdk: 'The SDK and the React wrapper, in the Connect repository; not published on npm',
      console: 'The console for a platform’s team; not published',
      recipes: 'Recipes for WordPress, Next.js and Astro; they run in CI against a sample build and are not published as packages',
      reader: 'A model that reads text, beside the fixed rules; it waits for an approved reading policy',
      mcp: 'MCP, so that an AI agent prepares and a person confirms; planned, there is no endpoint',
      demo: 'A demo of the widget on this site; it waits for a demo space with synthetic data',
    },
    source: 'The source of each line is in docs/truth-check.md, in this site’s repository.',
    link: 'The status, part by part',
  },
  changelog: {
    title: `What’s new: ${PUBLIC_NAME}’s product steps, dated`,
    description: `Each step of ${PUBLIC_NAME} a customer can notice, dated, with where it stands: on the synthetic test space, or built and not available yet.`,
    eyebrow: 'What’s new',
    h1: ['What changed,', 'step by step.'],
    lede: 'One entry per product step a customer can notice, newest first. Each says whether it runs on the synthetic test space or is built and not available yet. Nothing here is published for real users yet.',
    states: { test: 'On the test space', built: 'Built, not available yet' },
    note: 'Every entry comes from one file in this site’s repository that names the pull requests it rests on; an entry without them stops the build.',
    link: 'What’s new',
  },

  privacy: {
    title: `Privacy notice · ${PUBLIC_NAME}`,
    description: 'The privacy notice for this website is in preparation. What is already true: the site sets no cookies, loads nothing from third parties and uses no analytics.',
    eyebrow: 'Privacy notice',
    h1: 'In preparation',
    lede: 'The privacy notice for this website is being written and reviewed. It appears here once it is released. Nothing is shown until then, because a legal text may not be drafted by guesswork.',
    released: { description: `The privacy notice for ${PUBLIC_NAME}’s website: what the site processes, why, on which legal basis, and your rights.` },
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
    title: `Imprint · ${PUBLIC_NAME}`,
    description: `The legal notice for ${PUBLIC_NAME}’s website: provider and contact details. The text is in preparation.`,
    eyebrow: 'Imprint',
    h1: 'In preparation',
    lede: 'The legal notice (provider, address, representatives, register and tax details, contact) is being prepared and appears here once it is confirmed. Nothing is shown until then, because none of it may be invented.',
    released: { description: `The legal notice for ${PUBLIC_NAME}’s website: provider, address, representatives, register and tax details, and contact.` },
  },

  contact: {
    title: `Contact · ${PUBLIC_NAME}`,
    description: `How to reach ${PUBLIC_NAME}. Contact details are in preparation: this page names the address once its mailbox exists.`,
    eyebrow: 'Contact',
    h1: 'In preparation',
    released: { h1: 'Write to us', description: `How to reach ${PUBLIC_NAME}: the address to write to with a question about ${PUBLIC_NAME} or about running a space on your platform.` },
    write: 'Write to {email}.',
  },

  notFound: {
    title: `Page not found · ${PUBLIC_NAME}`,
    description: 'This page does not exist. Go to the home page, or read the site in another language.',
    eyebrow: 'Page not found',
    h1: 'There’s nothing here.',
    lede: 'The page may have moved.',
    home: 'Go to the home page',
    languages: 'This site in other languages',
  },
};

export type Catalogue = typeof en;
