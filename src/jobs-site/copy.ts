/* The jobs site's own words, in English and German (the board's search words and a posting's facts are the drafts' own,
   src/drafts/jobs-board.ts, so both read the same). Every sentence is true today: the board shows listings from
   employers' own career pages when the catalogue or its last snapshot holds some; private interest, claiming and
   introductions are built in the engine but not open on this site, and the pages say so. Labels follow the jobs launch
   plan's rules: a listing is sourced until its employer claimed it; no logo wall, no "hiring with us", no count of
   interested people on a sourced listing. */
import { JOBS_NAME, type JobsLang } from './data.ts';

export interface Section { id: string; title: string; paragraphs: string[] }
export interface ProsePage { title: string; description: string; eyebrow: string; h1: string; lede: string; sections: Section[] }

export interface JobsCopy {
  site: {
    skip: string; menu: string;
    nav: { board: string; how: string; companies: string; sources: string };
    footer: { claim: string; powered: string; imprint: string; privacy: string; legal: string; site: string; other: string };
  };
  home: {
    title: string; description: string; h1: string; lede: string;
    /** {date}. */
    asOf: string;
    board: { label: string; original: string; labels: { sourced: string; participating: string } };
    refreshing: { title: string; p: string };
  };
  posting: {
    /** {title} and {employer}. */
    titleOf: string; description: string;
    /** {date}. */
    sourced: string; participating: string;
    interest: { title: string; reachable: string; unreachable: string };
  };
  mine: { title: string; description: string; eyebrow: string; h1: string; lede: string };
  companies: ProsePage;
  how: ProsePage;
  sources: ProsePage;
  imprint: ProsePage;
  privacy: ProsePage;
}

export const JOBS_COPY: Record<JobsLang, JobsCopy> = {
  en: {
    site: {
      skip: 'Skip to content',
      menu: 'Menu',
      nav: { board: 'Jobs', how: 'How it works', companies: 'For companies', sources: 'Sources' },
      footer: {
        claim: 'Jobs from employers’ own career pages, each with its source, the day it was fetched and the link to the original.',
        powered: 'Powered by Linkbot',
        imprint: 'Imprint', privacy: 'Privacy', legal: 'Legal', site: 'Site', other: 'Deutsch',
      },
    },
    home: {
      title: `${JOBS_NAME}: jobs from employers’ own career pages`,
      description: 'Search jobs taken from employers’ own career pages. Each listing names its source and the day it was fetched, and links the original posting, where you apply.',
      h1: 'Jobs from employers’ own career pages.',
      lede: 'Each listing shows where it comes from, the day it was fetched and the link to the original posting, where you apply. Telling an employer privately that you are interested is being built and not open yet.',
      asOf: 'Listings as of {date}',
      board: {
        label: 'From employers’ own career pages · the search runs in your browser',
        original: 'Original posting',
        labels: { sourced: 'This employer does not take part yet.', participating: 'This employer takes part.' },
      },
      refreshing: {
        title: 'The listings are being refreshed',
        p: 'There is no listing to show right now. The search is off until the listings are back.',
      },
    },
    posting: {
      titleOf: `{title} at {employer} · ${JOBS_NAME}`,
      description: '{title} at {employer}: the facts the posting states, its source, the day it was fetched and the link to the original.',
      sourced: 'From the employer’s public careers feed, fetched {date}. This employer does not take part yet.',
      participating: 'This employer claimed its listings and takes part.',
      interest: {
        title: 'Private interest',
        reachable: 'Telling this employer privately that you are interested is being built and not open yet. Until then, apply at the original posting.',
        unreachable: 'We cannot pass on interest for this listing yet.',
      },
    },
    mine: {
      title: `Your own page · ${JOBS_NAME}`,
      description: 'The page where you will see each interest and how it stands. A demo with made-up data.',
      eyebrow: 'Your own page · planned',
      h1: 'Your own page',
      lede: 'Here you will see the criteria you confirmed, how each employer’s role compares with them, and who never sees you. It is not open yet: the demo below uses made-up data, runs in this browser only and sends nothing.',
    },
    companies: {
      title: `For companies · ${JOBS_NAME}`,
      description: 'How an employer will claim its listings, see who is interested without names, and answer. Claiming is not open yet.',
      eyebrow: 'For companies',
      h1: 'Your listings are already here. Claiming them is next.',
      lede: 'The board takes listings from employers’ own career pages. An employer that claims its listings will see who is interested, without names, and decide whom to meet. Claiming is not open yet.',
      sections: [
        { id: 'claim', title: 'How a claim will work', paragraphs: [
          'An employer claims its listings with a mailbox at its own domain: the domain whose careers page links the board its listings come from. Nobody else can claim them.',
          'Once claimed, its listings say that it takes part.',
        ] },
        { id: 'see', title: 'What a claimed employer will see', paragraphs: [
          'How many people are interested in each listing, and each person’s profile without name, contact or current employer. It answers yes, no or not now.',
          'Names and contact go to both sides only when both said yes. A no is never shown to the person; they see that the interest ended on a date.',
          'A person’s current employer and the companies a person blocked never see that person.',
        ] },
        { id: 'today', title: 'Today', paragraphs: [
          'Claiming is not open yet, so no employer takes part and every listing on the board is labelled as not taking part.',
          'To have a listing removed, take it off your own careers feed: it leaves the board with the next update.',
        ] },
      ],
    },
    how: {
      title: `How it works · ${JOBS_NAME}`,
      description: 'From a listing to an introduction: find a job, say privately that you are interested, the employer answers, and names go out only when both said yes.',
      eyebrow: 'How it works',
      h1: 'From a listing to an introduction, only when both say yes.',
      lede: 'The board is open to everyone. The private steps behind it are being built and not open yet.',
      sections: [
        { id: 'find', title: '1. Find a job', paragraphs: ['Search the listings by what, where, work mode and date. Each listing names its source and the day it was fetched, and links the original posting, where you can always apply directly. No sign-in.'] },
        { id: 'interest', title: '2. Say privately that you are interested', paragraphs: ['One tap on a listing, once you have confirmed a short profile and your email address. The employer sees the profile without your name, contact or current employer. Your current employer and companies you blocked never see it. Not open yet.'] },
        { id: 'answer', title: '3. The employer answers', paragraphs: ['An employer that claimed its listings answers yes, no or not now. A no is never shown to you: you see that the interest ended on a date. Not open yet.'] },
        { id: 'introduction', title: '4. An introduction when both said yes', paragraphs: ['Only when both sides said yes do the names and contact go to each other. Not open yet.'] },
        { id: 'today', title: 'What runs today', paragraphs: ['The board and its search. Private interest, claiming and introductions are not open on this site yet.'] },
      ],
    },
    sources: {
      title: `Sources · ${JOBS_NAME}`,
      description: 'Where the listings come from, what “does not take part yet” means, and how an employer removes or claims a listing.',
      eyebrow: 'Sources',
      h1: 'Where the listings come from',
      lede: 'Every listing comes from an employer’s own application system, read from its public feed. Each one names its source, the day it was fetched and the link to the original posting.',
      sections: [
        { id: 'where', title: 'The sources', paragraphs: [
          'The board reads the public feeds of employers’ own application systems whose terms allow it: Personio, Greenhouse, Lever, Ashby, Workable and Recruitee. Nothing else is a source.',
          'It keeps the facts a posting states (title, employer, place, work mode, employment type, salary if stated, dates) and no posting text: the original carries it, and you apply there.',
        ] },
        { id: 'sourced', title: '“This employer does not take part yet”', paragraphs: [
          'A listing taken from a careers feed is labelled so until its employer claims it. It does not mean the employer knows this board or works with it.',
        ] },
        { id: 'fresh', title: 'How current a listing is', paragraphs: [
          'A listing shows the day it was fetched, and the board the day of its last update. A posting its employer withdrew leaves the board with the next update. If the listings cannot be read, the board shows the last ones it had, with their date, and never an invented one.',
        ] },
        { id: 'remove', title: 'Removing or claiming a listing', paragraphs: [
          'An employer removes a listing by taking it off its own careers feed. Claiming listings, with a mailbox at the employer’s own domain, is not open yet.',
        ] },
      ],
    },
    imprint: {
      title: `Imprint · ${JOBS_NAME}`,
      description: 'The imprint of this site.',
      eyebrow: 'Legal', h1: 'Imprint',
      lede: 'The imprint follows before this site is published, with the name and address of its operator.',
      sections: [],
    },
    privacy: {
      title: `Privacy · ${JOBS_NAME}`,
      description: 'The privacy notice of this site.',
      eyebrow: 'Legal', h1: 'Privacy',
      lede: 'The privacy notice follows before this site is published, with the name of its operator.',
      sections: [],
    },
  },
  de: {
    site: {
      skip: 'Zum Inhalt',
      menu: 'Menü',
      nav: { board: 'Stellen', how: 'So funktioniert es', companies: 'Für Firmen', sources: 'Quellen' },
      footer: {
        claim: 'Stellen aus den eigenen Karriereseiten der Arbeitgeber, jede mit Quelle, Abrufdatum und dem Link zur Originalanzeige.',
        powered: 'Powered by Linkbot',
        imprint: 'Impressum', privacy: 'Datenschutz', legal: 'Rechtliches', site: 'Seite', other: 'English',
      },
    },
    home: {
      title: `${JOBS_NAME}: Stellen aus den Karriereseiten der Arbeitgeber`,
      description: 'Stellen aus den eigenen Karriereseiten der Arbeitgeber durchsuchen. Jede Anzeige nennt Quelle und Abrufdatum und verlinkt die Originalanzeige, wo Sie sich bewerben.',
      h1: 'Stellen aus den eigenen Karriereseiten der Arbeitgeber.',
      lede: 'Jede Anzeige zeigt, woher sie kommt, wann sie abgerufen wurde, und verlinkt die Originalanzeige, wo Sie sich bewerben. Einem Arbeitgeber vertraulich Interesse zu zeigen, wird gebaut und ist noch nicht offen.',
      asOf: 'Stand der Stellen: {date}',
      board: {
        label: 'Aus den Karriereseiten der Arbeitgeber · die Suche läuft in Ihrem Browser',
        original: 'Originalanzeige',
        labels: { sourced: 'Dieser Arbeitgeber macht noch nicht mit.', participating: 'Dieser Arbeitgeber macht mit.' },
      },
      refreshing: {
        title: 'Die Stellen werden gerade aktualisiert',
        p: 'Im Moment gibt es keine Stelle zu zeigen. Die Suche ist aus, bis die Stellen wieder da sind.',
      },
    },
    posting: {
      titleOf: `{title} bei {employer} · ${JOBS_NAME}`,
      description: '{title} bei {employer}: was die Anzeige angibt, ihre Quelle, das Abrufdatum und der Link zur Originalanzeige.',
      sourced: 'Aus dem öffentlichen Karriere-Feed des Arbeitgebers, abgerufen am {date}. Dieser Arbeitgeber macht noch nicht mit.',
      participating: 'Dieser Arbeitgeber hat seine Stellen übernommen und macht mit.',
      interest: {
        title: 'Vertrauliches Interesse',
        reachable: 'Diesem Arbeitgeber vertraulich Interesse zu zeigen, wird gebaut und ist noch nicht offen. Bis dahin bewerben Sie sich über die Originalanzeige.',
        unreachable: 'Für diese Anzeige können wir Interesse noch nicht weitergeben.',
      },
    },
    mine: {
      title: `Ihre eigene Seite · ${JOBS_NAME}`,
      description: 'Die Seite, auf der Sie jedes Interesse und seinen Stand sehen werden. Eine Demo mit erfundenen Daten.',
      eyebrow: 'Ihre eigene Seite · geplant',
      h1: 'Ihre eigene Seite',
      lede: 'Hier sehen Sie künftig die Kriterien, die Sie bestätigt haben, wie die Stelle jedes Arbeitgebers dazu passt, und wer Sie nie sieht. Sie ist noch nicht offen: Die Demo unten nutzt erfundene Daten, läuft nur in diesem Browser und sendet nichts.',
    },
    companies: {
      title: `Für Firmen · ${JOBS_NAME}`,
      description: 'Wie ein Arbeitgeber seine Stellen übernehmen, Interessierte ohne Namen sehen und antworten wird. Die Übernahme ist noch nicht offen.',
      eyebrow: 'Für Firmen',
      h1: 'Ihre Stellen sind schon hier. Als Nächstes übernehmen Sie sie.',
      lede: 'Die Börse übernimmt Stellen aus den eigenen Karriereseiten der Arbeitgeber. Ein Arbeitgeber, der seine Stellen übernimmt, sieht künftig, wer Interesse hat, ohne Namen, und entscheidet, wen er kennenlernt. Die Übernahme ist noch nicht offen.',
      sections: [
        { id: 'claim', title: 'Wie die Übernahme funktionieren wird', paragraphs: [
          'Ein Arbeitgeber übernimmt seine Stellen mit einem Postfach an seiner eigenen Domain: der Domain, deren Karriereseite das Bewerbersystem verlinkt, aus dem seine Stellen kommen. Niemand sonst kann sie übernehmen.',
          'Danach steht an seinen Stellen, dass er mitmacht.',
        ] },
        { id: 'see', title: 'Was ein Arbeitgeber dann sieht', paragraphs: [
          'Wie viele Menschen an jeder Stelle Interesse haben, und das Profil jeder Person ohne Namen, Kontakt oder aktuellen Arbeitgeber. Er antwortet mit Ja, Nein oder Nicht jetzt.',
          'Namen und Kontakt gehen erst an beide Seiten, wenn beide Ja gesagt haben. Ein Nein sieht die Person nie; sie sieht, dass das Interesse an einem Datum endete.',
          'Der aktuelle Arbeitgeber einer Person und Firmen, die sie gesperrt hat, sehen sie nie.',
        ] },
        { id: 'today', title: 'Heute', paragraphs: [
          'Die Übernahme ist noch nicht offen, also macht kein Arbeitgeber mit, und an jeder Stelle steht, dass ihr Arbeitgeber noch nicht mitmacht.',
          'Um eine Stelle entfernen zu lassen, nehmen Sie sie aus Ihrem eigenen Karriere-Feed: Mit der nächsten Aktualisierung verschwindet sie von der Börse.',
        ] },
      ],
    },
    how: {
      title: `So funktioniert es · ${JOBS_NAME}`,
      description: 'Von der Anzeige zur Vorstellung: Stelle finden, vertraulich Interesse zeigen, der Arbeitgeber antwortet, Namen gehen erst raus, wenn beide Ja gesagt haben.',
      eyebrow: 'So funktioniert es',
      h1: 'Von der Anzeige zur Vorstellung, nur wenn beide Ja sagen.',
      lede: 'Die Börse ist für alle offen. Die vertraulichen Schritte dahinter werden gebaut und sind noch nicht offen.',
      sections: [
        { id: 'find', title: '1. Eine Stelle finden', paragraphs: ['Suchen Sie nach Was, Wo, Arbeitsweise und Datum. Jede Anzeige nennt Quelle und Abrufdatum und verlinkt die Originalanzeige, über die Sie sich immer direkt bewerben können. Ohne Anmeldung.'] },
        { id: 'interest', title: '2. Vertraulich Interesse zeigen', paragraphs: ['Ein Tipp auf eine Anzeige, nachdem Sie ein kurzes Profil und Ihre E-Mail-Adresse bestätigt haben. Der Arbeitgeber sieht das Profil ohne Ihren Namen, Kontakt oder aktuellen Arbeitgeber. Ihr aktueller Arbeitgeber und Firmen, die Sie gesperrt haben, sehen es nie. Noch nicht offen.'] },
        { id: 'answer', title: '3. Der Arbeitgeber antwortet', paragraphs: ['Ein Arbeitgeber, der seine Stellen übernommen hat, antwortet mit Ja, Nein oder Nicht jetzt. Ein Nein sehen Sie nie: Sie sehen, dass das Interesse an einem Datum endete. Noch nicht offen.'] },
        { id: 'introduction', title: '4. Eine Vorstellung, wenn beide Ja gesagt haben', paragraphs: ['Erst wenn beide Seiten Ja gesagt haben, gehen Namen und Kontakt an die jeweils andere. Noch nicht offen.'] },
        { id: 'today', title: 'Was heute läuft', paragraphs: ['Die Börse und ihre Suche. Vertrauliches Interesse, Übernahme und Vorstellungen sind auf dieser Seite noch nicht offen.'] },
      ],
    },
    sources: {
      title: `Quellen · ${JOBS_NAME}`,
      description: 'Woher die Stellen kommen, was „macht noch nicht mit“ bedeutet und wie ein Arbeitgeber eine Stelle entfernt oder übernimmt.',
      eyebrow: 'Quellen',
      h1: 'Woher die Stellen kommen',
      lede: 'Jede Stelle stammt aus dem eigenen Bewerbersystem eines Arbeitgebers, gelesen aus seinem öffentlichen Feed. Jede nennt Quelle, Abrufdatum und den Link zur Originalanzeige.',
      sections: [
        { id: 'where', title: 'Die Quellen', paragraphs: [
          'Die Börse liest die öffentlichen Feeds der eigenen Bewerbersysteme von Arbeitgebern, deren Bedingungen das erlauben: Personio, Greenhouse, Lever, Ashby, Workable und Recruitee. Nichts sonst ist eine Quelle.',
          'Sie behält, was eine Anzeige angibt (Titel, Arbeitgeber, Ort, Arbeitsweise, Anstellungsart, Gehalt, wenn angegeben, Daten), und keinen Anzeigentext: Den trägt die Originalanzeige, und dort bewerben Sie sich.',
        ] },
        { id: 'sourced', title: '„Dieser Arbeitgeber macht noch nicht mit“', paragraphs: [
          'So ist eine Stelle aus einem Karriere-Feed gekennzeichnet, bis ihr Arbeitgeber sie übernimmt. Es heißt nicht, dass der Arbeitgeber diese Börse kennt oder mit ihr zusammenarbeitet.',
        ] },
        { id: 'fresh', title: 'Wie aktuell eine Stelle ist', paragraphs: [
          'Jede Stelle zeigt ihr Abrufdatum, die Börse den Tag ihrer letzten Aktualisierung. Eine Anzeige, die der Arbeitgeber zurückgezogen hat, verschwindet mit der nächsten Aktualisierung. Können die Stellen nicht gelesen werden, zeigt die Börse die letzten, die sie hatte, mit ihrem Datum, und nie eine erfundene.',
        ] },
        { id: 'remove', title: 'Eine Stelle entfernen oder übernehmen', paragraphs: [
          'Ein Arbeitgeber entfernt eine Stelle, indem er sie aus seinem eigenen Karriere-Feed nimmt. Die Übernahme von Stellen, mit einem Postfach an der eigenen Domain des Arbeitgebers, ist noch nicht offen.',
        ] },
      ],
    },
    imprint: {
      title: `Impressum · ${JOBS_NAME}`,
      description: 'Das Impressum dieser Seite.',
      eyebrow: 'Rechtliches', h1: 'Impressum',
      lede: 'Das Impressum folgt, bevor diese Seite veröffentlicht wird, mit Name und Anschrift des Betreibers.',
      sections: [],
    },
    privacy: {
      title: `Datenschutz · ${JOBS_NAME}`,
      description: 'Die Datenschutzerklärung dieser Seite.',
      eyebrow: 'Rechtliches', h1: 'Datenschutz',
      lede: 'Die Datenschutzerklärung folgt, bevor diese Seite veröffentlicht wird, mit dem Namen des Betreibers.',
      sections: [],
    },
  },
};
