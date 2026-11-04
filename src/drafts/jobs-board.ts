/* The job board's words, in the five languages: the search on the draft /jobs (src/components/front/Board.astro) and
   the posting's own draft page /jobs/<id> (src/pages/[...lang]/jobs/[id].astro). The board is planned to read the job
   catalogue (postings from employers' own application systems and the Federal Employment Agency's job search, each
   with source, fetched date and the link to the original); until its read API exists it reads made-up postings in the
   same shape (src/jobs/recorded.ts). The covert yes is planned and shown disabled. Both pages follow /jobs: drafts for
   the owner, never indexed, out of the sitemap, left out of production builds (buildsJobsPage). Every sentence has its
   row in docs/truth-check.md (sections "/jobs" and "/jobs/<id>"). */
import { PUBLIC_NAME } from '../i18n/terms.ts';
import type { Lang } from '../i18n/locales.ts';
import type { EmploymentKind, Salary, Source, WorkMode } from '../jobs/catalogue.ts';
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
  /** The employment types the board names in words; any other the source states shows as the source writes it. */
  employment: Record<EmploymentKind, string>;
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
  facts: { place: string; mode: string; employment: string; salary: string; posted: string; validThrough: string; source: string; fetched: string };
  notStated: string;
  original: { button: string; note: string };
  covert: { button: string; soon: string; p: string };
  posting: { h2: string; note: string };
}

const today = (en: boolean) => en
  ? `${PUBLIC_NAME} runs no job catalogue today: the collector and its read API are drafts on development branches, none merged. The postings on these pages are made up in the shape the catalogue is planned to have, and their addresses end in .example, which leads nowhere.`
  : `${PUBLIC_NAME} betreibt heute keinen Stellenkatalog: Der Sammler und seine Lese-Schnittstelle sind Entwürfe auf Entwicklungszweigen, keiner zusammengeführt. Die Stellen auf diesen Seiten sind erfunden, in der Form, die der Katalog haben soll, und ihre Adressen enden auf .example, das nirgends hinführt.`;

export const jobsBoard: Record<Lang, { board: BoardWords; posting: PostingWords }> = {
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
      employment: { full_time: 'Full time', part_time: 'Part time', contract: 'Contract', temporary: 'Temporary', internship: 'Internship', apprenticeship: 'Apprenticeship' },
      sources: { personio: 'Personio', greenhouse: 'Greenhouse', lever: 'Lever', ashby: 'Ashby', workable: 'Workable', smartrecruiters: 'SmartRecruiters', recruitee: 'Recruitee', ba: 'Federal Employment Agency' },
      salary: { per: { year: 'a year', month: 'a month', hour: 'an hour' }, from: 'from', upTo: 'up to' },
      sourceLine: 'Source: {source} · fetched {date}',
    },
    posting: {
      banner: 'Draft, not published: planned, not built.',
      bannerNote: 'This page is linked only from the draft job board and is never indexed. The posting is made up.',
      titleOf: '{title} at {employer} (draft)',
      description: 'Draft: a made-up posting on the planned job board, with its source, the day it was fetched and the link to the original.',
      back: 'All postings',
      facts: { place: 'Place', mode: 'Work mode', employment: 'Employment', salary: 'Salary', posted: 'Posted', validThrough: 'Open until', source: 'Source', fetched: 'Fetched' },
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
      employment: { full_time: 'Vollzeit', part_time: 'Teilzeit', contract: 'Freie Mitarbeit', temporary: 'Befristet', internship: 'Praktikum', apprenticeship: 'Ausbildung' },
      sources: { personio: 'Personio', greenhouse: 'Greenhouse', lever: 'Lever', ashby: 'Ashby', workable: 'Workable', smartrecruiters: 'SmartRecruiters', recruitee: 'Recruitee', ba: 'Bundesagentur für Arbeit' },
      salary: { per: { year: 'im Jahr', month: 'im Monat', hour: 'pro Stunde' }, from: 'ab', upTo: 'bis' },
      sourceLine: 'Quelle: {source} · abgerufen am {date}',
    },
    posting: {
      banner: 'Entwurf, nicht veröffentlicht: geplant, nicht gebaut.',
      bannerNote: 'Diese Seite ist nur vom Entwurf der Stellenbörse verlinkt und wird nie indexiert. Die Stelle ist erfunden.',
      titleOf: '{title} bei {employer} (Entwurf)',
      description: 'Entwurf: eine erfundene Stelle auf der geplanten Stellenbörse, mit Quelle, Abrufdatum und dem Link zur Originalanzeige.',
      back: 'Alle Stellen',
      facts: { place: 'Ort', mode: 'Arbeitsweise', employment: 'Anstellung', salary: 'Gehalt', posted: 'Veröffentlicht', validThrough: 'Offen bis', source: 'Quelle', fetched: 'Abgerufen' },
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
  es: {
    board: {
      h2: 'Buscar anuncios',
      label: 'Anuncios inventados con la forma del catálogo previsto · la búsqueda se ejecuta en su navegador',
      q: { label: 'Qué', hint: 'Título, empleador, una palabra' },
      where: { label: 'Dónde', hint: 'Ciudad o país' },
      mode: { label: 'Modalidad de trabajo', any: 'Cualquiera' },
      since: { label: 'Publicado', any: 'En cualquier momento', days7: 'Últimos 7 días', days30: 'Últimos 30 días' },
      clear: 'Borrar',
      count: { none: 'Ningún anuncio encaja. Pruebe con menos palabras u otro lugar.', one: '1 anuncio', other: '{n} anuncios' },
      noScript: 'Todos los anuncios, los más recientes primero. La búsqueda necesita scripts.',
      modes: { on_site: 'Presencial', hybrid: 'Híbrido', remote: 'En remoto' },
      employment: { full_time: 'Jornada completa', part_time: 'Jornada parcial', contract: 'Por cuenta propia', temporary: 'Temporal', internship: 'Prácticas', apprenticeship: 'Contrato de aprendizaje' },
      sources: { personio: 'Personio', greenhouse: 'Greenhouse', lever: 'Lever', ashby: 'Ashby', workable: 'Workable', smartrecruiters: 'SmartRecruiters', recruitee: 'Recruitee', ba: 'Agencia Federal de Empleo de Alemania' },
      salary: { per: { year: 'al año', month: 'al mes', hour: 'por hora' }, from: 'desde', upTo: 'hasta' },
      sourceLine: 'Fuente: {source} · obtenido el {date}',
    },
    posting: {
      banner: 'Borrador, no publicado: previsto, no construido.',
      bannerNote: 'Esta página solo se enlaza desde el borrador del tablón de empleo y nunca se indexa. El anuncio es inventado.',
      titleOf: '{title} en {employer} (borrador)',
      description: 'Borrador: un anuncio inventado en el tablón de empleo previsto, con su fuente, el día en que se obtuvo y el enlace al original.',
      back: 'Todos los anuncios',
      facts: { place: 'Lugar', mode: 'Modalidad de trabajo', employment: 'Contratación', salary: 'Salario', posted: 'Publicado', validThrough: 'Abierto hasta', source: 'Fuente', fetched: 'Obtenido' },
      notStated: 'No indicado',
      original: { button: 'Ir al anuncio original', note: 'Abre el anuncio en la propia página del empleador. Usted se postula allí, como indica el anuncio.' },
      covert: {
        button: 'Sí discreto',
        soon: 'Próximamente',
        p: `Previsto: un toque le dice a la empresa que alguien está interesado, como criterios y un veredicto de cada uno, sin nombre. Solo sabe quién es usted cuando ella también le dice que sí. Las empresas de su lista de bloqueo, empezando por su empleador actual, no ven nada de esto mientras usen el dominio que confirmaron con ${PUBLIC_NAME}.`,
      },
      posting: { h2: 'El anuncio', note: 'El texto tal como lo da la fuente, sin cambios.' },
      sections: [
        {
          id: 'today',
          title: 'Lo que existe hoy',
          paragraphs: [`${PUBLIC_NAME} no gestiona hoy ningún catálogo de empleo: el recolector y su API de lectura son borradores en ramas de desarrollo, ninguno integrado. Los anuncios de estas páginas son inventados, con la forma que se prevé para el catálogo, y sus direcciones terminan en .example, que no lleva a ninguna parte.`, 'El sí discreto no está construido: el botón está desactivado.'],
        },
      ],
      open: {
        title: 'Pendiente antes de que lo use gente real',
        items: [
          'La API de lectura del catálogo y su primera ejecución diaria.',
          'El sí discreto y lo que paga una empresa por desbloquear a una persona: el precio y el proveedor de pago los decide el propietario.',
          'El nombre y el dominio con los que el tablón aparece ante las personas.',
          'Si se publica esta página y cuándo: el visto bueno del propietario.',
        ],
      },
    },
  },
  it: {
    board: {
      h2: 'Cerca negli annunci',
      label: 'Annunci inventati nella forma del catalogo previsto · la ricerca funziona nel Suo browser',
      q: { label: 'Che cosa', hint: 'Titolo, datore di lavoro, una parola' },
      where: { label: 'Dove', hint: 'Città o paese' },
      mode: { label: 'Modalità di lavoro', any: 'Qualsiasi' },
      since: { label: 'Pubblicato', any: 'In qualsiasi momento', days7: 'Ultimi 7 giorni', days30: 'Ultimi 30 giorni' },
      clear: 'Azzera',
      count: { none: 'Nessun annuncio corrisponde. Provi con meno parole o un altro luogo.', one: '1 annuncio', other: '{n} annunci' },
      noScript: 'Tutti gli annunci, i più recenti per primi. La ricerca richiede gli script.',
      modes: { on_site: 'In sede', hybrid: 'Ibrido', remote: 'Da remoto' },
      employment: { full_time: 'Tempo pieno', part_time: 'Tempo parziale', contract: 'Collaborazione autonoma', temporary: 'A termine', internship: 'Tirocinio', apprenticeship: 'Apprendistato' },
      sources: { personio: 'Personio', greenhouse: 'Greenhouse', lever: 'Lever', ashby: 'Ashby', workable: 'Workable', smartrecruiters: 'SmartRecruiters', recruitee: 'Recruitee', ba: 'Agenzia federale per il lavoro tedesca' },
      salary: { per: { year: 'l’anno', month: 'al mese', hour: 'all’ora' }, from: 'da', upTo: 'fino a' },
      sourceLine: 'Fonte: {source} · recuperato il {date}',
    },
    posting: {
      banner: 'Bozza, non pubblicata: previsto, non costruito.',
      bannerNote: 'Questa pagina è collegata solo dalla bozza della bacheca di lavoro e non viene mai indicizzata. L’annuncio è inventato.',
      titleOf: '{title} presso {employer} (bozza)',
      description: 'Bozza: un annuncio inventato sulla bacheca di lavoro prevista, con la sua fonte, il giorno in cui è stato recuperato e il link all’originale.',
      back: 'Tutti gli annunci',
      facts: { place: 'Luogo', mode: 'Modalità di lavoro', employment: 'Tipo di impiego', salary: 'Stipendio', posted: 'Pubblicato', validThrough: 'Aperto fino al', source: 'Fonte', fetched: 'Recuperato' },
      notStated: 'Non indicato',
      original: { button: 'All’annuncio originale', note: 'Apre l’annuncio sulla pagina del datore di lavoro stesso. Lì Lei si candida, come dice l’annuncio.' },
      covert: {
        button: 'Sì riservato',
        soon: 'Prossimamente',
        p: `Previsto: un tocco dice all’azienda che qualcuno è interessato, come criteri e un verdetto su ciascuno, senza nome. L’azienda viene a sapere chi è Lei solo quando dice sì anche a Lei. Le aziende nel Suo elenco dei blocchi, a cominciare dal Suo attuale datore di lavoro, non ne vedono nulla finché usano il dominio che hanno confermato con ${PUBLIC_NAME}.`,
      },
      posting: { h2: 'L’annuncio', note: 'Il testo come lo fornisce la fonte, invariato.' },
      sections: [
        {
          id: 'today',
          title: 'Che cosa esiste oggi',
          paragraphs: [`${PUBLIC_NAME} oggi non gestisce alcun catalogo di annunci: il raccoglitore e la sua API di lettura sono bozze su rami di sviluppo, nessuna integrata. Gli annunci su queste pagine sono inventati, nella forma prevista per il catalogo, e i loro indirizzi finiscono con .example, che non porta da nessuna parte.`, 'Il sì riservato non è costruito: il pulsante è disabilitato.'],
        },
      ],
      open: {
        title: 'Aperto prima che persone reali lo usino',
        items: [
          'L’API di lettura del catalogo e la sua prima esecuzione giornaliera.',
          'Il sì riservato e quanto paga un’azienda per sbloccare una persona: il prezzo e il fornitore di pagamento li decide il proprietario.',
          'Il nome e il dominio con cui la bacheca appare alle persone.',
          'Se e quando questa pagina viene pubblicata: il via libera del proprietario.',
        ],
      },
    },
  },
  fr: {
    board: {
      h2: 'Rechercher dans les annonces',
      label: 'Annonces inventées dans la forme du catalogue prévu · la recherche fonctionne dans votre navigateur',
      q: { label: 'Quoi', hint: 'Titre, employeur, un mot' },
      where: { label: 'Où', hint: 'Ville ou pays' },
      mode: { label: 'Mode de travail', any: 'Tous' },
      since: { label: 'Publiée', any: 'À tout moment', days7: '7 derniers jours', days30: '30 derniers jours' },
      clear: 'Effacer',
      count: { none: 'Aucune annonce ne correspond. Essayez moins de mots ou un autre lieu.', one: '1 annonce', other: '{n} annonces' },
      noScript: 'Toutes les annonces, les plus récentes d’abord. La recherche a besoin de scripts.',
      modes: { on_site: 'Sur site', hybrid: 'Hybride', remote: 'À distance' },
      employment: { full_time: 'Temps plein', part_time: 'Temps partiel', contract: 'Contrat de prestation', temporary: 'Temporaire', internship: 'Stage', apprenticeship: 'Apprentissage' },
      sources: { personio: 'Personio', greenhouse: 'Greenhouse', lever: 'Lever', ashby: 'Ashby', workable: 'Workable', smartrecruiters: 'SmartRecruiters', recruitee: 'Recruitee', ba: 'Agence fédérale pour l’emploi (Allemagne)' },
      salary: { per: { year: 'par an', month: 'par mois', hour: 'par heure' }, from: 'à partir de', upTo: 'jusqu’à' },
      sourceLine: 'Source : {source} · récupéré le {date}',
    },
    posting: {
      banner: 'Brouillon, non publié : prévu, pas construit.',
      bannerNote: 'Cette page n’est liée que depuis le brouillon du tableau d’emplois et n’est jamais indexée. L’annonce est inventée.',
      titleOf: '{title} chez {employer} (brouillon)',
      description: 'Brouillon : une annonce inventée sur le tableau d’emplois prévu, avec sa source, le jour où elle a été récupérée et le lien vers l’original.',
      back: 'Toutes les annonces',
      facts: { place: 'Lieu', mode: 'Mode de travail', employment: 'Contrat', salary: 'Salaire', posted: 'Publiée', validThrough: 'Ouverte jusqu’au', source: 'Source', fetched: 'Récupérée' },
      notStated: 'Non indiqué',
      original: { button: 'Vers l’annonce originale', note: 'Ouvre l’annonce sur la page propre de l’employeur. Vous y postulez, comme l’annonce l’indique.' },
      covert: {
        button: 'Oui discret',
        soon: 'Bientôt',
        p: `Prévu : un geste dit à l’entreprise que quelqu’un est intéressé, sous forme de critères et d’un verdict sur chacun, sans nom. Elle ne sait qui vous êtes que lorsqu’elle vous dit oui aussi. Les entreprises de votre liste de blocage, votre employeur actuel en premier, n’en voient rien tant qu’elles utilisent le domaine qu’elles ont confirmé auprès de ${PUBLIC_NAME}.`,
      },
      posting: { h2: 'L’annonce', note: 'Le texte tel que la source le donne, sans modification.' },
      sections: [
        {
          id: 'today',
          title: 'Ce qui existe aujourd’hui',
          paragraphs: [
            `${PUBLIC_NAME} ne fait fonctionner aucun catalogue d’emplois aujourd’hui : le collecteur et son API de lecture sont des brouillons sur des branches de développement, aucun fusionné. Les annonces de ces pages sont inventées, dans la forme que le catalogue doit avoir, et leurs adresses se terminent par .example, qui ne mène nulle part.`,
            'Le oui discret n’est pas construit : le bouton est désactivé.',
          ],
        },
      ],
      open: {
        title: 'À régler avant que de vraies personnes l’utilisent',
        items: [
          'L’API de lecture du catalogue et sa première exécution quotidienne.',
          'Le oui discret et ce qu’une entreprise paie pour débloquer une personne : le prix et le prestataire de paiement relèvent du propriétaire.',
          'Le nom et le domaine sous lesquels le tableau apparaît aux personnes.',
          'Si et quand cette page est publiée : le feu vert du propriétaire.',
        ],
      },
    },
  },
};
