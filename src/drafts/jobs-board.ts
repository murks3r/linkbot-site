/* The job board's words, in the five languages: the search on the draft /jobs (src/components/front/Board.astro) and
   the posting's own draft page /jobs/<id> (src/pages/[...lang]/jobs/[id].astro). The board is planned to read the job
   catalogue (postings from employers' own application systems whose terms allow it, each
   with source, fetched date and the link to the original); until its read API exists it reads made-up postings in the
   same shape (src/jobs/recorded.ts). The covert yes runs against a stand-in in the browser (src/jobs/interest-stub.ts). Both pages follow /jobs: drafts for
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
  /** The covert yes (src/components/front/CovertYes.astro): signed out, signed in and ready, said. */
  covert: {
    title: string; label: string;
    signIn: { p: string; button: string };
    button: string; line: string;
    said: string; mine: string; withdraw: string; withdrawn: string;
    note: string; noScript: string;
  };
}

const today = (en: boolean) => en
  ? `${PUBLIC_NAME} runs no job catalogue today: the collector and its read API are drafts on development branches, none merged. The postings on these pages are made up in the shape the catalogue is planned to have, Each links to the address form of its source with a made-up employer whose name ends in “example”, so it leads to no posting. The catalogue keeps no posting text; the original carries it.`
  : `${PUBLIC_NAME} betreibt heute keinen Stellenkatalog: Der Sammler und seine Lese-Schnittstelle sind Entwürfe auf Entwicklungszweigen, keiner zusammengeführt. Die Stellen auf diesen Seiten sind erfunden, in der Form, die der Katalog haben soll, Jede verlinkt die Adressform ihrer Quelle mit einem erfundenen Arbeitgeber, dessen Name auf „example“ endet, und führt so zu keiner Anzeige. Der Katalog speichert keinen Anzeigentext; die Originalanzeige trägt ihn.`;

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
      sources: { personio: 'Personio', greenhouse: 'Greenhouse', lever: 'Lever', ashby: 'Ashby', workable: 'Workable', recruitee: 'Recruitee' },
      salary: { per: { year: 'a year', month: 'a month', hour: 'an hour' }, from: 'from', upTo: 'up to' },
      sourceLine: 'Source: {source} · fetched {date}',
    },
    posting: {
      banner: 'Draft, not published: planned, not built.',
      bannerNote: 'This page is linked only from the draft job board and is never indexed. The posting and the person who signs in are made up.',
      titleOf: '{title} at {employer} (draft)',
      description: 'Draft: a made-up posting on the planned job board, with its source, the day it was fetched and the link to the original.',
      back: 'All postings',
      facts: { place: 'Place', mode: 'Work mode', employment: 'Employment', salary: 'Salary', posted: 'Posted', validThrough: 'Open until', source: 'Source', fetched: 'Fetched' },
      notStated: 'Not stated',
      original: { button: 'To the original posting', note: 'Opens the posting on the employer’s own page. You apply there, as the posting says.' },
      covert: {
        title: 'Say yes without being seen',
        label: 'Made-up person · in this browser tab only, nothing is sent',
        signIn: {
          p: 'Sign in to say yes covertly. Only a signed-in person whose email address is confirmed can.',
          button: 'Sign in (made-up person)',
        },
        button: 'Covert yes',
        line: 'Nobody sees who you are until the company unlocks you. Your employer and companies you blocked never see it.',
        said: 'Your covert yes is recorded. The company learns who you are only when it unlocks you.',
        mine: 'See it on your page',
        withdraw: 'Withdraw',
        withdrawn: 'Withdrawn. The company never learns who you are.',
        note: `Until it unlocks you, a company that claimed its postings sees only how many said yes and, per person, the criteria with a verdict on each, without a name. Blocking works on the domain a company confirmed with ${PUBLIC_NAME}; nothing stronger is promised.`,
        noScript: 'The covert yes needs JavaScript in this draft.',
      },
      sections: [
        {
          id: 'today',
          title: 'What exists today',
          paragraphs: [today(true), 'The covert yes on this page runs against a stand-in: a made-up person signs in, and the yes is kept in this browser tab only until it is closed. Nothing is sent and no company sees anything. The jobs space it is planned for is not built.'],
        },
      ],
      open: {
        title: 'Open before real people use it',
        items: [
          'The catalogue’s read API and its first daily run.',
          'The jobs space that records the covert yes, the sign-in and what a company pays to unlock a person: the price and the payment provider are the owner’s.',
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
      sources: { personio: 'Personio', greenhouse: 'Greenhouse', lever: 'Lever', ashby: 'Ashby', workable: 'Workable', recruitee: 'Recruitee' },
      salary: { per: { year: 'im Jahr', month: 'im Monat', hour: 'pro Stunde' }, from: 'ab', upTo: 'bis' },
      sourceLine: 'Quelle: {source} · abgerufen am {date}',
    },
    posting: {
      banner: 'Entwurf, nicht veröffentlicht: geplant, nicht gebaut.',
      bannerNote: 'Diese Seite ist nur vom Entwurf der Stellenbörse verlinkt und wird nie indexiert. Die Stelle und die Person, die sich anmeldet, sind erfunden.',
      titleOf: '{title} bei {employer} (Entwurf)',
      description: 'Entwurf: eine erfundene Stelle auf der geplanten Stellenbörse, mit Quelle, Abrufdatum und dem Link zur Originalanzeige.',
      back: 'Alle Stellen',
      facts: { place: 'Ort', mode: 'Arbeitsweise', employment: 'Anstellung', salary: 'Gehalt', posted: 'Veröffentlicht', validThrough: 'Offen bis', source: 'Quelle', fetched: 'Abgerufen' },
      notStated: 'Nicht angegeben',
      original: { button: 'Zur Originalanzeige', note: 'Öffnet die Anzeige auf der eigenen Seite des Arbeitgebers. Sie bewerben sich dort, wie die Anzeige es sagt.' },
      covert: {
        title: 'Ja sagen, ohne gesehen zu werden',
        label: 'Erfundene Person · nur in diesem Browser-Tab, nichts wird gesendet',
        signIn: {
          p: 'Melden Sie sich an, um verdeckt Ja zu sagen. Das kann nur, wer angemeldet ist und seine E-Mail-Adresse bestätigt hat.',
          button: 'Anmelden (erfundene Person)',
        },
        button: 'Verdeckt Ja',
        line: 'Niemand sieht, wer Sie sind, bis die Firma Sie freischaltet. Ihr Arbeitgeber und Firmen, die Sie gesperrt haben, sehen es nie.',
        said: 'Ihr verdecktes Ja ist festgehalten. Wer Sie sind, erfährt die Firma erst, wenn sie Sie freischaltet.',
        mine: 'Auf Ihrer Seite ansehen',
        withdraw: 'Zurückziehen',
        withdrawn: 'Zurückgezogen. Die Firma erfährt nie, wer Sie sind.',
        note: `Bis zur Freischaltung sieht eine Firma, die ihre Stellen übernommen hat, nur, wie viele Ja gesagt haben, und je Person die Kriterien mit einem Urteil zu jedem, ohne Namen. Die Sperre gilt für die Domain, die eine Firma bei ${PUBLIC_NAME} bestätigt hat; mehr wird nicht versprochen.`,
        noScript: 'Das verdeckte Ja braucht in diesem Entwurf JavaScript.',
      },
      sections: [
        {
          id: 'today',
          title: 'Was es heute gibt',
          paragraphs: [today(false), 'Das verdeckte Ja auf dieser Seite läuft gegen einen Platzhalter: Eine erfundene Person meldet sich an, und das Ja bleibt nur in diesem Browser-Tab, bis er geschlossen wird. Nichts wird gesendet, und keine Firma sieht etwas. Der Jobs-Space, für den es geplant ist, ist nicht gebaut.'],
        },
      ],
      open: {
        title: 'Offen, bevor echte Menschen es nutzen',
        items: [
          'Die Lese-Schnittstelle des Katalogs und sein erster täglicher Lauf.',
          'Der Jobs-Space, der das verdeckte Ja festhält, die Anmeldung und was eine Firma für die Freischaltung einer Person zahlt: Preis und Zahlungsanbieter entscheidet der Owner.',
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
      sources: { personio: 'Personio', greenhouse: 'Greenhouse', lever: 'Lever', ashby: 'Ashby', workable: 'Workable', recruitee: 'Recruitee' },
      salary: { per: { year: 'al año', month: 'al mes', hour: 'por hora' }, from: 'desde', upTo: 'hasta' },
      sourceLine: 'Fuente: {source} · obtenido el {date}',
    },
    posting: {
      banner: 'Borrador, no publicado: previsto, no construido.',
      bannerNote: 'Esta página solo se enlaza desde el borrador del tablón de empleo y nunca se indexa. El anuncio y la persona que inicia sesión son inventados.',
      titleOf: '{title} en {employer} (borrador)',
      description: 'Borrador: un anuncio inventado en el tablón de empleo previsto, con su fuente, el día en que se obtuvo y el enlace al original.',
      back: 'Todos los anuncios',
      facts: { place: 'Lugar', mode: 'Modalidad de trabajo', employment: 'Contratación', salary: 'Salario', posted: 'Publicado', validThrough: 'Abierto hasta', source: 'Fuente', fetched: 'Obtenido' },
      notStated: 'No indicado',
      original: { button: 'Ir al anuncio original', note: 'Abre el anuncio en la propia página del empleador. Usted se postula allí, como indica el anuncio.' },
      covert: {
        title: 'Decir que sí sin ser visto',
        label: 'Persona inventada · solo en esta pestaña del navegador, no se envía nada',
        signIn: {
          p: 'Inicie sesión para decir que sí de forma discreta. Solo puede hacerlo quien ha iniciado sesión y ha confirmado su dirección de correo.',
          button: 'Iniciar sesión (persona inventada)',
        },
        button: 'Sí discreto',
        line: 'Nadie ve quién es usted hasta que la empresa le desbloquea. Su empleador y las empresas que usted ha bloqueado no lo ven nunca.',
        said: 'Su sí discreto está registrado. La empresa solo sabe quién es usted cuando le desbloquea.',
        mine: 'Verlo en su página',
        withdraw: 'Retirar',
        withdrawn: 'Retirado. La empresa nunca sabe quién es usted.',
        note: `Hasta que le desbloquea, una empresa que ha reclamado sus anuncios solo ve cuántas personas han dicho que sí y, por persona, los criterios con un veredicto de cada uno, sin nombre. El bloqueo se aplica al dominio que una empresa ha confirmado con ${PUBLIC_NAME}; no se promete nada más.`,
        noScript: 'En este borrador, el sí discreto necesita JavaScript.',
      },
      sections: [
        {
          id: 'today',
          title: 'Lo que existe hoy',
          paragraphs: [`${PUBLIC_NAME} no gestiona hoy ningún catálogo de empleo: el recolector y su API de lectura son borradores en ramas de desarrollo, ninguno integrado. Los anuncios de estas páginas son inventados, con la forma que se prevé para el catálogo, Cada uno enlaza a la forma de dirección de su fuente con un empleador inventado cuyo nombre termina en «example», así que no lleva a ningún anuncio. El catálogo no guarda el texto de los anuncios; lo lleva el original.`, 'El sí discreto de esta página funciona con un sustituto: inicia sesión una persona inventada, y el sí se guarda solo en esta pestaña del navegador hasta que se cierra. No se envía nada y ninguna empresa ve nada. El espacio de empleo para el que está previsto no está construido.'],
        },
      ],
      open: {
        title: 'Pendiente antes de que lo use gente real',
        items: [
          'La API de lectura del catálogo y su primera ejecución diaria.',
          'El espacio de empleo que registra el sí discreto, el inicio de sesión y lo que paga una empresa por desbloquear a una persona: el precio y el proveedor de pago los decide el propietario.',
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
      sources: { personio: 'Personio', greenhouse: 'Greenhouse', lever: 'Lever', ashby: 'Ashby', workable: 'Workable', recruitee: 'Recruitee' },
      salary: { per: { year: 'l’anno', month: 'al mese', hour: 'all’ora' }, from: 'da', upTo: 'fino a' },
      sourceLine: 'Fonte: {source} · recuperato il {date}',
    },
    posting: {
      banner: 'Bozza, non pubblicata: previsto, non costruito.',
      bannerNote: 'Questa pagina è collegata solo dalla bozza della bacheca di lavoro e non viene mai indicizzata. L’annuncio e la persona che accede sono inventati.',
      titleOf: '{title} presso {employer} (bozza)',
      description: 'Bozza: un annuncio inventato sulla bacheca di lavoro prevista, con la sua fonte, il giorno in cui è stato recuperato e il link all’originale.',
      back: 'Tutti gli annunci',
      facts: { place: 'Luogo', mode: 'Modalità di lavoro', employment: 'Tipo di impiego', salary: 'Stipendio', posted: 'Pubblicato', validThrough: 'Aperto fino al', source: 'Fonte', fetched: 'Recuperato' },
      notStated: 'Non indicato',
      original: { button: 'All’annuncio originale', note: 'Apre l’annuncio sulla pagina del datore di lavoro stesso. Lì Lei si candida, come dice l’annuncio.' },
      covert: {
        title: 'Dire sì senza essere visti',
        label: 'Persona inventata · solo in questa scheda del browser, non viene inviato nulla',
        signIn: {
          p: 'Acceda per dire sì in modo riservato. Può farlo solo chi ha effettuato l’accesso e ha confermato il proprio indirizzo email.',
          button: 'Accedi (persona inventata)',
        },
        button: 'Sì riservato',
        line: 'Nessuno vede chi è Lei finché l’azienda non La sblocca. Il Suo datore di lavoro e le aziende che ha bloccato non lo vedono mai.',
        said: 'Il Suo sì riservato è registrato. L’azienda viene a sapere chi è Lei solo quando La sblocca.',
        mine: 'Vederlo sulla Sua pagina',
        withdraw: 'Ritira',
        withdrawn: 'Ritirato. L’azienda non viene mai a sapere chi è Lei.',
        note: `Finché non La sblocca, un’azienda che ha rivendicato i propri annunci vede solo quante persone hanno detto sì e, per persona, i criteri con un verdetto su ciascuno, senza nome. Il blocco vale per il dominio che un’azienda ha confermato con ${PUBLIC_NAME}; non si promette di più.`,
        noScript: 'In questa bozza il sì riservato richiede JavaScript.',
      },
      sections: [
        {
          id: 'today',
          title: 'Che cosa esiste oggi',
          paragraphs: [`${PUBLIC_NAME} oggi non gestisce alcun catalogo di annunci: il raccoglitore e la sua API di lettura sono bozze su rami di sviluppo, nessuna integrata. Gli annunci su queste pagine sono inventati, nella forma prevista per il catalogo, Ognuno rimanda alla forma di indirizzo della sua fonte con un datore di lavoro inventato il cui nome finisce con «example», quindi non porta ad alcun annuncio. Il catalogo non conserva il testo degli annunci; lo porta l’originale.`, 'Il sì riservato di questa pagina funziona con un sostituto: accede una persona inventata, e il sì resta solo in questa scheda del browser finché non viene chiusa. Non viene inviato nulla e nessuna azienda vede niente. Lo spazio lavoro per cui è previsto non è costruito.'],
        },
      ],
      open: {
        title: 'Aperto prima che persone reali lo usino',
        items: [
          'L’API di lettura del catalogo e la sua prima esecuzione giornaliera.',
          'Lo spazio lavoro che registra il sì riservato, l’accesso e quanto paga un’azienda per sbloccare una persona: il prezzo e il fornitore di pagamento li decide il proprietario.',
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
      sources: { personio: 'Personio', greenhouse: 'Greenhouse', lever: 'Lever', ashby: 'Ashby', workable: 'Workable', recruitee: 'Recruitee' },
      salary: { per: { year: 'par an', month: 'par mois', hour: 'par heure' }, from: 'à partir de', upTo: 'jusqu’à' },
      sourceLine: 'Source : {source} · récupéré le {date}',
    },
    posting: {
      banner: 'Brouillon, non publié : prévu, pas construit.',
      bannerNote: 'Cette page n’est liée que depuis le brouillon du tableau d’emplois et n’est jamais indexée. L’annonce et la personne qui se connecte sont inventées.',
      titleOf: '{title} chez {employer} (brouillon)',
      description: 'Brouillon : une annonce inventée sur le tableau d’emplois prévu, avec sa source, le jour où elle a été récupérée et le lien vers l’original.',
      back: 'Toutes les annonces',
      facts: { place: 'Lieu', mode: 'Mode de travail', employment: 'Contrat', salary: 'Salaire', posted: 'Publiée', validThrough: 'Ouverte jusqu’au', source: 'Source', fetched: 'Récupérée' },
      notStated: 'Non indiqué',
      original: { button: 'Vers l’annonce originale', note: 'Ouvre l’annonce sur la page propre de l’employeur. Vous y postulez, comme l’annonce l’indique.' },
      covert: {
        title: 'Dire oui sans être vu',
        label: 'Personne inventée · dans cet onglet du navigateur uniquement, rien n’est envoyé',
        signIn: {
          p: 'Connectez-vous pour dire oui discrètement. Seule une personne connectée dont l’adresse e-mail est confirmée le peut.',
          button: 'Se connecter (personne inventée)',
        },
        button: 'Oui discret',
        line: 'Personne ne voit qui vous êtes tant que l’entreprise ne vous a pas débloqué. Votre employeur et les entreprises que vous avez bloquées ne le voient jamais.',
        said: 'Votre oui discret est enregistré. L’entreprise n’apprend qui vous êtes que lorsqu’elle vous débloque.',
        mine: 'Le voir sur votre page',
        withdraw: 'Retirer',
        withdrawn: 'Retiré. L’entreprise n’apprend jamais qui vous êtes.',
        note: `Tant qu’elle ne vous a pas débloqué, une entreprise qui a revendiqué ses annonces ne voit que le nombre de personnes qui ont dit oui et, par personne, les critères avec un verdict sur chacun, sans nom. Le blocage s’applique au domaine qu’une entreprise a confirmé auprès de ${PUBLIC_NAME} ; rien de plus n’est promis.`,
        noScript: 'Dans ce brouillon, le oui discret a besoin de JavaScript.',
      },
      sections: [
        {
          id: 'today',
          title: 'Ce qui existe aujourd’hui',
          paragraphs: [
            `${PUBLIC_NAME} ne fait fonctionner aucun catalogue d’emplois aujourd’hui : le collecteur et son API de lecture sont des brouillons sur des branches de développement, aucun fusionné. Les annonces de ces pages sont inventées, dans la forme que le catalogue doit avoir, Chacune renvoie à la forme d’adresse de sa source avec un employeur inventé dont le nom se termine par « example », et ne mène donc à aucune annonce. Le catalogue ne conserve pas le texte des annonces ; l’original le porte.`,
            'Le oui discret de cette page fonctionne avec un substitut : une personne inventée se connecte, et le oui n’est gardé que dans cet onglet du navigateur jusqu’à sa fermeture. Rien n’est envoyé et aucune entreprise ne voit rien. L’espace emploi pour lequel il est prévu n’est pas construit.',
          ],
        },
      ],
      open: {
        title: 'À régler avant que de vraies personnes l’utilisent',
        items: [
          'L’API de lecture du catalogue et sa première exécution quotidienne.',
          'L’espace emploi qui enregistre le oui discret, la connexion et ce qu’une entreprise paie pour débloquer une personne : le prix et le prestataire de paiement relèvent du propriétaire.',
          'Le nom et le domaine sous lesquels le tableau apparaît aux personnes.',
          'Si et quand cette page est publiée : le feu vert du propriétaire.',
        ],
      },
    },
  },
};
