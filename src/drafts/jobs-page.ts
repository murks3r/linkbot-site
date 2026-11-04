/* The draft page /jobs, in English and German: Jobs, the second vertical: the job board's search over the catalogue
   (src/drafts/jobs-board.ts; made-up postings until the catalogue's read API exists), the home's "both say yes" demo
   in a jobs version (src/components/front/Trial.astro: the person in the buyer's place, the company in the supplier's), the link to the
   person's own page (/jobs/mine), and two FAQ entries that are also the page's schema.org FAQPage. Nothing of it is
   built in Jobs, so the page is a draft for the owner's review: linked from nowhere, never indexed, out of the sitemap,
   and left out of production builds. The role's values are the jobs pack draft's role A (as on /jobs/mine); the rules
   are the Jobs spec draft's. Every sentence has its row in docs/truth-check.md (section "/jobs"). */
import { PUBLIC_NAME } from '../i18n/terms.ts';
import type { FrontCopy } from '../front/copy.ts';
import { buildsDraft, type Draft, type DraftSection } from './draft.ts';

/** Whether a production build carries the draft. Set it to true once Jobs runs on a space and the owner approves the page. */
export const JOBS_PAGE_IN_PRODUCTION = false;

/** Whether a build carries the draft (src/drafts/draft.ts). */
export const buildsJobsPage = (env: { VERCEL_ENV?: string }, inProduction = JOBS_PAGE_IN_PRODUCTION): boolean =>
  buildsDraft(env, inProduction);

export interface JobsDraft extends Draft {
  /** The home's demo words, in Jobs: buyer is the person, supplier the company. */
  demo: FrontCopy['landing']['trial'];
  mine: { p: string; link: string };
  /** Shown first among the sections and given to schema.org as the page's FAQPage. */
  faq: DraftSection[];
}

export const jobsPage: Record<'en' | 'de', JobsDraft> = {
  en: {
    banner: 'Draft, not published: planned, not built.',
    bannerNote: `This page is linked from nowhere on the site, is never indexed and exists in English and German only. ${PUBLIC_NAME} runs no job catalogue and no jobs space today. The postings below are made up in the shape the catalogue is planned to have, and the demo uses made-up data too. Both run in this browser only: they send nothing and store nothing.`,
    title: 'Jobs: postings straight from the employers, a yes in confidence (planned, draft)',
    description: `Draft: a job board on ${PUBLIC_NAME} with postings straight from employers, source and fetched date on each, and a covert yes. Made-up data.`,
    eyebrow: 'Jobs · planned · draft',
    h1: ['Jobs straight from the employers.', 'Say yes in confidence.'],
    lede: `Planned: a free board of postings taken from employers’ own application systems and from the job search of Germany’s Federal Employment Agency, each with its source, the day it was fetched and a link to the original. On top, a covert yes for a person in work: the company learns that someone is interested, as criteria without a name, and learns who it is only when it says yes too. ${PUBLIC_NAME} checks both sides, and a no reveals nothing. The page names no date.`,
    demo: {
      h2: 'Try it: one person, one company',
      label: 'Made-up example data · runs in your browser, nothing is sent',
      steps: ['Check', 'Private match', 'Both say yes'],
      progress: 'Steps',
      buyer: { role: 'Person', name: 'Aoife Byrne (fictional)', wants: 'Looks for', text: 'A junior data role, hybrid, in Ireland, from February 2027, 42,000–46,000 EUR a year' },
      supplier: { role: 'Company', name: 'Northwind Analytics (fictional)', wants: 'Hires', text: 'A junior data analyst, hybrid, in Ireland or the Netherlands, from early 2027, 40,000–48,000 EUR a year' },
      hidden: 'Name hidden',
      email: 'Email address',
      check: {
        title: 'Each side confirms its contact',
        p: 'Each side confirms the criteria it gave and opens a link sent to its email address. Nothing is stored before it confirms. Checks of the company are planned.',
        pending: 'Not confirmed yet',
        done: 'Confirmed through a link',
        button: 'Confirm',
        next: 'Look for a fit',
      },
      match: {
        title: 'A role card without names',
        p: `${PUBLIC_NAME} compares the role and the person criterion by criterion. The company sees the verdict on each, never the person’s name, contact or salary figure. No score, no ranking.`,
        card: 'Possible fit: junior data analyst',
        criteria: [
          { label: 'Role', value: 'Data and analytics, junior', verdict: 'meets' },
          { label: 'Salary band', value: 'The role’s: 40,000–48,000 EUR a year', verdict: 'meets' },
          { label: 'Work mode', value: 'Hybrid', verdict: 'meets' },
          { label: 'Location', value: 'Ireland', verdict: 'meets' },
          { label: 'Working languages', value: 'The role does not say', verdict: 'unknown' },
        ],
        verdicts: { meets: 'Fits', partly: 'Partly fits', conflicts: 'Conflicts', unknown: 'Unknown' },
        approved: 'A named person on the space’s team approved this possible fit. The approval reveals nothing.',
        next: 'Ask both sides',
      },
      yes: {
        title: 'Both say yes, or nobody learns anything',
        p: 'Each side answers on its own. Until both say yes, neither learns who the other is.',
        ask: { buyer: 'Interested in this role?', supplier: 'Be introduced to this person?' },
        yes: 'Interested',
        no: 'Not for me',
        waiting: 'Interested. Waiting for the other side, which does not see this answer.',
        said: 'Not for me.',
        introduced: 'Introduced. Both said yes, so only now do the names and confirmed email addresses go out.',
        mode: 'Shown here as a direct introduction; a jobs space can also make the introduction through its own team.',
        declined: 'No introduction. One side said no, so neither learns who the other is.',
        reset: 'Start again',
      },
      more: 'Your own page in Jobs',
    },
    mine: {
      p: 'What a person sees once signed in: the criteria they confirmed, what each company sees about them, who never sees them, pause, export and delete.',
      link: 'Your own page in Jobs (draft)',
    },
    faq: [
      {
        id: 'covert',
        title: `What is covert job search on ${PUBLIC_NAME}?`,
        paragraphs: [
          `A planned way to look for a new job while you are in work. You tell ${PUBLIC_NAME} what you want in a short conversation and confirm it as criteria: no public profile, no CV, no application. A company sees you only as those criteria and the verdict on each, without your name, and you are introduced only when you and the company both say yes.`,
          'It is planned, not built: no jobs space runs today.',
        ],
      },
      {
        id: 'employer',
        title: 'Does my employer see anything?',
        paragraphs: [
          'That is the plan: you list the companies that must never see you, your current employer first. A listed company gets no match with you, no card and no count, and it is never told that you listed it. This holds while the company uses the domain it confirmed with ' + PUBLIC_NAME + '; nothing stronger is promised.',
          'Any other company sees criteria and verdicts only, never your name, until both sides say yes. The list is planned, not built yet.',
        ],
      },
    ],
    sections: [
      {
        id: 'rules',
        title: 'The rules this page follows',
        paragraphs: [
          'A person has no public profile: no card on a board, no search result, no listing. A company sees a person only as criteria and verdicts, without a name, until both said yes.',
          'There is no score and no ranking: a company sees the verdict on each criterion, in the same words the person sees about themselves, never the person’s salary figure.',
          'A no, a block or a yes not yet answered is never shown to the other side.',
          'The introduction follows only when both said yes and the space’s team approved it; then each side gets the other’s name and confirmed email address.',
        ],
      },
      {
        id: 'today',
        title: 'What exists today',
        paragraphs: [
          `None of this page is built in Jobs, and ${PUBLIC_NAME} runs no jobs space, not even with made-up data. The jobs criteria, the role cards, the company side and the sign-in are drafts on development branches, none merged; the block list is not built yet.`,
          'There is no job catalogue yet either: the collector and its read API are drafts on development branches, none merged, and the postings on the board are made up.',
          'Today a person’s only check is the email address they confirm through a link.',
        ],
      },
    ],
    open: {
      title: 'Open before real people use it',
      items: [
        'The name and the domain under which Jobs appears to people.',
        'How a company is checked before it sees anyone; control of its domain is the first planned check.',
        'Whether a closed pilot with invited people starts, and who is invited. This is for the owner.',
        'Whether counsel’s questions on the jobs criteria are answered before real people take part.',
        'Whether and when this page is published: the owner’s go.',
      ],
    },
  },
  de: {
    banner: 'Entwurf, nicht veröffentlicht: geplant, nicht gebaut.',
    bannerNote: `Diese Seite ist von nirgends auf der Website verlinkt, wird nie indexiert und existiert nur auf Englisch und Deutsch. ${PUBLIC_NAME} betreibt heute keinen Stellenkatalog und keinen Jobs-Space. Die Stellen unten sind erfunden, in der Form, die der Katalog haben soll, und auch die Demo nutzt erfundene Daten. Beides läuft nur in diesem Browser: Es sendet nichts und speichert nichts.`,
    title: 'Jobs: Stellen direkt von den Arbeitgebern, ein vertrauliches Ja (geplant, Entwurf)',
    description: `Entwurf: eine Stellenbörse bei ${PUBLIC_NAME} mit Stellen direkt von den Arbeitgebern, Quelle und Abrufdatum an jeder, und ein verdecktes Ja. Erfundene Daten.`,
    eyebrow: 'Jobs · geplant · Entwurf',
    h1: ['Stellen direkt von den Arbeitgebern.', 'Vertraulich Ja sagen.'],
    lede: `Geplant: eine kostenlose Börse mit Stellen aus den Bewerbungssystemen der Arbeitgeber selbst und aus der Jobsuche der Bundesagentur für Arbeit, jede mit Quelle, Abrufdatum und Link zur Originalanzeige. Darauf ein verdecktes Ja für Angestellte: Die Firma erfährt, dass jemand Interesse hat, als Kriterien ohne Namen, und wer es ist, erst wenn sie auch Ja sagt. ${PUBLIC_NAME} prüft beide Seiten, und ein Nein verrät nichts. Die Seite nennt kein Datum.`,
    demo: {
      h2: 'Probieren Sie es aus: eine Person, eine Firma',
      label: 'Erfundene Beispieldaten · läuft in Ihrem Browser, nichts wird gesendet',
      steps: ['Prüfen', 'Verborgen abgleichen', 'Beide sagen Ja'],
      progress: 'Schritte',
      buyer: { role: 'Person', name: 'Aoife Byrne (erfunden)', wants: 'Sucht', text: 'Eine Junior-Stelle in Daten, hybrid, in Irland, ab Februar 2027, 42.000–46.000 EUR im Jahr' },
      supplier: { role: 'Firma', name: 'Northwind Analytics (erfunden)', wants: 'Besetzt', text: 'Junior Data Analyst, hybrid, in Irland oder den Niederlanden, ab Anfang 2027, 40.000–48.000 EUR im Jahr' },
      hidden: 'Name verborgen',
      email: 'E-Mail-Adresse',
      check: {
        title: 'Jede Seite bestätigt ihren Kontakt',
        p: 'Jede Seite bestätigt die Kriterien, die sie genannt hat, und öffnet einen Link, der an ihre E-Mail-Adresse geht. Vor der Bestätigung wird nichts gespeichert. Prüfungen der Firma sind geplant.',
        pending: 'Noch nicht bestätigt',
        done: 'Über einen Link bestätigt',
        button: 'Bestätigen',
        next: 'Passung suchen',
      },
      match: {
        title: 'Eine Stellenkarte ohne Namen',
        p: `${PUBLIC_NAME} vergleicht Stelle und Person Kriterium für Kriterium. Die Firma sieht das Urteil zu jedem, nie Namen, Kontakt oder Gehaltszahl der Person. Keine Punktzahl, keine Rangliste.`,
        card: 'Mögliche Passung: Junior Data Analyst',
        criteria: [
          { label: 'Stelle', value: 'Daten und Analytik, Junior', verdict: 'meets' },
          { label: 'Gehaltsband', value: 'Das der Stelle: 40.000–48.000 EUR im Jahr', verdict: 'meets' },
          { label: 'Arbeitsweise', value: 'Hybrid', verdict: 'meets' },
          { label: 'Arbeitsort', value: 'Irland', verdict: 'meets' },
          { label: 'Arbeitssprachen', value: 'Die Stelle sagt nichts dazu', verdict: 'unknown' },
        ],
        verdicts: { meets: 'Passt', partly: 'Passt teilweise', conflicts: 'Widerspricht', unknown: 'Unbekannt' },
        approved: 'Eine benannte Person aus dem Team des Space hat diese mögliche Passung freigegeben. Die Freigabe gibt nichts preis.',
        next: 'Beide Seiten fragen',
      },
      yes: {
        title: 'Beide sagen Ja, oder niemand erfährt etwas',
        p: 'Jede Seite antwortet für sich. Bevor beide Ja sagen, erfährt keine, wer die andere ist.',
        ask: { buyer: 'Interesse an dieser Stelle?', supplier: 'Dieser Person vorgestellt werden?' },
        yes: 'Interessiert',
        no: 'Nichts für mich',
        waiting: 'Interessiert. Wartet auf die andere Seite, die diese Antwort nicht sieht.',
        said: 'Nichts für mich.',
        introduced: 'Vorgestellt. Beide haben Ja gesagt; erst jetzt gehen Namen und bestätigte E-Mail-Adressen hinaus.',
        mode: 'Hier als direkte Vorstellung gezeigt; ein Jobs-Space kann die Vorstellung auch über sein eigenes Team machen.',
        declined: 'Keine Vorstellung. Eine Seite hat Nein gesagt; keine erfährt, wer die andere ist.',
        reset: 'Neu beginnen',
      },
      more: 'Ihre eigene Seite in Jobs',
    },
    mine: {
      p: 'Was eine Person nach der Anmeldung sieht: die bestätigten Kriterien, was jede Firma über sie sieht, wer sie nie sieht, Pause, Export und Löschen.',
      link: 'Ihre eigene Seite in Jobs (Entwurf)',
    },
    faq: [
      {
        id: 'covert',
        title: `Was ist die verdeckte Jobsuche bei ${PUBLIC_NAME}?`,
        paragraphs: [
          `Ein geplanter Weg, aus einer Anstellung heraus eine neue Stelle zu suchen. Sie sagen ${PUBLIC_NAME} in einem kurzen Gespräch, was Sie wollen, und bestätigen es als Kriterien: kein öffentliches Profil, kein Lebenslauf, keine Bewerbung. Eine Firma sieht Sie nur als diese Kriterien und das Urteil zu jedem, ohne Ihren Namen, und Sie werden erst vorgestellt, wenn Sie und die Firma beide Ja sagen.`,
          'Das ist geplant, nicht gebaut: Heute läuft kein Jobs-Space.',
        ],
      },
      {
        id: 'employer',
        title: 'Sieht mein Arbeitgeber etwas?',
        paragraphs: [
          'So ist es geplant: Sie führen die Firmen auf, die Sie nie sehen dürfen, Ihren aktuellen Arbeitgeber zuerst. Eine aufgeführte Firma bekommt keinen Abgleich mit Ihnen, keine Karte und keine Zahl, und sie erfährt nie, dass Sie sie aufgeführt haben. Das gilt, solange die Firma die Domain nutzt, die sie bei ' + PUBLIC_NAME + ' bestätigt hat; mehr wird nicht versprochen.',
          'Jede andere Firma sieht nur Kriterien und Urteile, nie Ihren Namen, bis beide Seiten Ja sagen. Die Liste ist geplant und noch nicht gebaut.',
        ],
      },
    ],
    sections: [
      {
        id: 'rules',
        title: 'Die Regeln dieser Seite',
        paragraphs: [
          'Eine Person hat kein öffentliches Profil: keine Karte auf einem Board, kein Suchergebnis, keinen Eintrag in einer Liste. Eine Firma sieht eine Person nur als Kriterien und Urteile, ohne Namen, bis beide Ja gesagt haben.',
          'Es gibt keine Punktzahl und keine Rangliste: Eine Firma sieht das Urteil zu jedem Kriterium, in denselben Worten, die die Person über sich sieht, nie die Gehaltszahl der Person.',
          'Ein Nein, eine Sperre oder ein noch nicht beantwortetes Ja wird der anderen Seite nie gezeigt.',
          'Die Vorstellung folgt erst, wenn beide Ja gesagt haben und das Team des Space sie freigegeben hat; dann bekommt jede Seite Namen und bestätigte E-Mail-Adresse der anderen.',
        ],
      },
      {
        id: 'today',
        title: 'Was es heute gibt',
        paragraphs: [
          `Nichts von dieser Seite ist in Jobs gebaut, und ${PUBLIC_NAME} betreibt keinen Jobs-Space, auch nicht mit erfundenen Daten. Die Jobs-Kriterien, die Stellenkarten, die Firmenseite und die Anmeldung sind Entwürfe auf Entwicklungszweigen, keiner zusammengeführt; die Sperrliste ist noch nicht gebaut.`,
          'Einen Stellenkatalog gibt es auch noch nicht: Der Sammler und seine Lese-Schnittstelle sind Entwürfe auf Entwicklungszweigen, keiner zusammengeführt, und die Stellen auf der Börse sind erfunden.',
          'Heute ist die einzige Prüfung einer Person die E-Mail-Adresse, die sie über einen Link bestätigt.',
        ],
      },
    ],
    open: {
      title: 'Offen, bevor echte Menschen es nutzen',
      items: [
        'Der Name und die Domain, unter denen Jobs für Menschen erscheint.',
        'Wie eine Firma geprüft wird, bevor sie jemanden sieht; die Kontrolle über ihre Domain ist die erste geplante Prüfung.',
        'Ob ein geschlossener Pilot mit eingeladenen Menschen startet und wer eingeladen wird. Das entscheidet der Owner.',
        'Ob die Fragen an die Rechtsberatung zu den Jobs-Kriterien beantwortet sind, bevor echte Menschen teilnehmen.',
        'Ob und wann diese Seite veröffentlicht wird: das Go des Owners.',
      ],
    },
  },
};
