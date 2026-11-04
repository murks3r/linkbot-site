/* The job board's words, in English and German: the search on the draft /jobs (src/components/front/Board.astro) and
   the posting's own draft page /jobs/<id> (src/pages/[...lang]/jobs/[id].astro). The board is planned to read the job
   catalogue (postings from employers' own application systems and the Federal Employment Agency's job search, each
   with source, fetched date and the link to the original); until its read API exists it reads made-up postings in the
   same shape (src/jobs/recorded.ts). The covert yes is planned and shown disabled. Both pages follow /jobs: drafts for
   the owner, never indexed, out of the sitemap, left out of production builds (buildsJobsPage). Every sentence has its
   row in docs/truth-check.md (sections "/jobs" and "/jobs/<id>"). */
import { PUBLIC_NAME } from '../i18n/terms.ts';
import type { Salary, Source, WorkMode } from '../jobs/catalogue.ts';
import type { Draft } from './draft.ts';

export interface BoardWords {
  h2: string;
  label: string;
  q: { label: string; hint: string };
  where: { label: string; hint: string };
  mode: { label: string; any: string };
  since: { label: string; any: string; days7: string; days30: string };
  clear: string;
  /** {n} is the number of postings. */
  count: { none: string; one: string; other: string };
  noScript: string;
  modes: Record<WorkMode, string>;
  sources: Record<Source, string>;
  salary: { per: Record<Salary['period'], string>; from: string; upTo: string };
  /** {source} and {date}. */
  sourceLine: string;
}

/** A posting's own page; its title, eyebrow, headline and lede come from the posting. */
export interface PostingWords extends Omit<Draft, 'title' | 'eyebrow' | 'h1' | 'lede'> {
  /** {title} and {employer}. */
  titleOf: string;
  back: string;
  facts: { place: string; mode: string; salary: string; posted: string; validThrough: string; source: string; fetched: string };
  notStated: string;
  original: { button: string; note: string };
  covert: { button: string; soon: string; p: string };
  posting: { h2: string; note: string };
}

const today = (en: boolean) => en
  ? `${PUBLIC_NAME} runs no job catalogue today: the collector and its read API are drafts on development branches, none merged. The postings on these pages are made up in the shape the catalogue is planned to have, and their addresses end in .example, which leads nowhere.`
  : `${PUBLIC_NAME} betreibt heute keinen Stellenkatalog: Der Sammler und seine Lese-Schnittstelle sind Entwürfe auf Entwicklungszweigen, keiner zusammengeführt. Die Stellen auf diesen Seiten sind erfunden, in der Form, die der Katalog haben soll, und ihre Adressen enden auf .example, das nirgends hinführt.`;

export const jobsBoard: Record<'en' | 'de', { board: BoardWords; posting: PostingWords }> = {
  en: {
    board: {
      h2: 'Search the postings',
      label: 'Made-up postings in the planned catalogue’s shape · the search runs in your browser',
      q: { label: 'What', hint: 'Title, employer, a word' },
      where: { label: 'Where', hint: 'City or country' },
      mode: { label: 'Work mode', any: 'Any' },
      since: { label: 'Posted', any: 'Any time', days7: 'Last 7 days', days30: 'Last 30 days' },
      clear: 'Clear',
      count: { none: 'No posting fits. Try fewer words or another place.', one: '1 posting', other: '{n} postings' },
      noScript: 'All postings, newest first. The search needs scripts.',
      modes: { on_site: 'On site', hybrid: 'Hybrid', remote: 'Remote' },
      sources: { personio: 'Personio', greenhouse: 'Greenhouse', lever: 'Lever', ashby: 'Ashby', workable: 'Workable', smartrecruiters: 'SmartRecruiters', recruitee: 'Recruitee', ba: 'Federal Employment Agency' },
      salary: { per: { year: 'a year', month: 'a month', hour: 'an hour' }, from: 'from', upTo: 'up to' },
      sourceLine: 'Source: {source} · fetched {date}',
    },
    posting: {
      banner: 'Draft, not published: planned, not built.',
      bannerNote: 'This page is linked only from the draft job board, is never indexed and exists in English and German only. The posting is made up.',
      titleOf: '{title} at {employer} (draft)',
      description: 'Draft: a made-up posting on the planned job board, with its source, the day it was fetched and the link to the original.',
      back: 'All postings',
      facts: { place: 'Place', mode: 'Work mode', salary: 'Salary', posted: 'Posted', validThrough: 'Open until', source: 'Source', fetched: 'Fetched' },
      notStated: 'Not stated',
      original: { button: 'To the original posting', note: 'Opens the posting on the employer’s own page. You apply there, as the posting says.' },
      covert: {
        button: 'Covert yes',
        soon: 'Coming soon',
        p: `Planned: one tap tells the company that someone is interested, as criteria and a verdict on each, without a name. It learns who you are only when it says yes to you too. Companies on your block list, your current employer first, see nothing of it while they use the domain they confirmed with ${PUBLIC_NAME}.`,
      },
      posting: { h2: 'The posting', note: 'The text as the source gives it, unchanged.' },
      sections: [
        {
          id: 'today',
          title: 'What exists today',
          paragraphs: [today(true), 'The covert yes is not built: the button is disabled.'],
        },
      ],
      open: {
        title: 'Open before real people use it',
        items: [
          'The catalogue’s read API and its first daily run.',
          'The covert yes and what a company pays to unlock a person: the price and the payment provider are the owner’s.',
          'The name and the domain under which the board appears to people.',
          'Whether and when this page is published: the owner’s go.',
        ],
      },
    },
  },
  de: {
    board: {
      h2: 'Stellen durchsuchen',
      label: 'Erfundene Stellen in der Form des geplanten Katalogs · die Suche läuft in Ihrem Browser',
      q: { label: 'Was', hint: 'Titel, Arbeitgeber, Stichwort' },
      where: { label: 'Wo', hint: 'Stadt oder Land' },
      mode: { label: 'Arbeitsweise', any: 'Alle' },
      since: { label: 'Veröffentlicht', any: 'Jederzeit', days7: 'Letzte 7 Tage', days30: 'Letzte 30 Tage' },
      clear: 'Zurücksetzen',
      count: { none: 'Keine Stelle passt. Versuchen Sie weniger Wörter oder einen anderen Ort.', one: '1 Stelle', other: '{n} Stellen' },
      noScript: 'Alle Stellen, die neuesten zuerst. Die Suche braucht Skripte.',
      modes: { on_site: 'Vor Ort', hybrid: 'Hybrid', remote: 'Remote' },
      sources: { personio: 'Personio', greenhouse: 'Greenhouse', lever: 'Lever', ashby: 'Ashby', workable: 'Workable', smartrecruiters: 'SmartRecruiters', recruitee: 'Recruitee', ba: 'Bundesagentur für Arbeit' },
      salary: { per: { year: 'im Jahr', month: 'im Monat', hour: 'pro Stunde' }, from: 'ab', upTo: 'bis' },
      sourceLine: 'Quelle: {source} · abgerufen am {date}',
    },
    posting: {
      banner: 'Entwurf, nicht veröffentlicht: geplant, nicht gebaut.',
      bannerNote: 'Diese Seite ist nur vom Entwurf der Stellenbörse verlinkt, wird nie indexiert und existiert nur auf Englisch und Deutsch. Die Stelle ist erfunden.',
      titleOf: '{title} bei {employer} (Entwurf)',
      description: 'Entwurf: eine erfundene Stelle auf der geplanten Stellenbörse, mit Quelle, Abrufdatum und dem Link zur Originalanzeige.',
      back: 'Alle Stellen',
      facts: { place: 'Ort', mode: 'Arbeitsweise', salary: 'Gehalt', posted: 'Veröffentlicht', validThrough: 'Offen bis', source: 'Quelle', fetched: 'Abgerufen' },
      notStated: 'Nicht angegeben',
      original: { button: 'Zur Originalanzeige', note: 'Öffnet die Anzeige auf der eigenen Seite des Arbeitgebers. Sie bewerben sich dort, wie die Anzeige es sagt.' },
      covert: {
        button: 'Verdeckt Ja',
        soon: 'Demnächst',
        p: `Geplant: Ein Tippen sagt der Firma, dass jemand Interesse hat, als Kriterien mit einem Urteil zu jedem, ohne Namen. Wer Sie sind, erfährt sie erst, wenn sie auch Ja zu Ihnen sagt. Firmen auf Ihrer Sperrliste, Ihr aktueller Arbeitgeber zuerst, sehen nichts davon, solange sie die Domain nutzen, die sie bei ${PUBLIC_NAME} bestätigt haben.`,
      },
      posting: { h2: 'Die Anzeige', note: 'Der Text, wie die Quelle ihn liefert, unverändert.' },
      sections: [
        {
          id: 'today',
          title: 'Was es heute gibt',
          paragraphs: [today(false), 'Das verdeckte Ja ist nicht gebaut: Der Knopf ist abgeschaltet.'],
        },
      ],
      open: {
        title: 'Offen, bevor echte Menschen es nutzen',
        items: [
          'Die Lese-Schnittstelle des Katalogs und sein erster täglicher Lauf.',
          'Das verdeckte Ja und was eine Firma für die Freischaltung einer Person zahlt: Preis und Zahlungsanbieter entscheidet der Owner.',
          'Der Name und die Domain, unter denen die Börse für Menschen erscheint.',
          'Ob und wann diese Seite veröffentlicht wird: das Go des Owners.',
        ],
      },
    },
  },
};
