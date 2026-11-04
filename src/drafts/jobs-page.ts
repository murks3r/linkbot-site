/* The draft page /jobs, in the five languages: Jobs, the second vertical: the job board's search over the catalogue
   (src/drafts/jobs-board.ts; made-up postings until the catalogue's read API exists), the home's "both say yes" demo
   in a jobs version (src/components/front/Trial.astro: the person in the buyer's place, the company in the supplier's), the link to the
   person's own page (/jobs/mine), and two FAQ entries that are also the page's schema.org FAQPage. Nothing of it is
   built in Jobs, so the page is a draft for the owner's review: linked from nowhere, never indexed, out of the sitemap,
   and left out of production builds. The role's values are the jobs pack draft's role A (as on /jobs/mine); the rules
   are the Jobs spec draft's. Every sentence has its row in docs/truth-check.md (section "/jobs"). */
import { PUBLIC_NAME } from '../i18n/terms.ts';
import type { Lang } from '../i18n/locales.ts';
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

export const jobsPage: Record<Lang, JobsDraft> = {
  en: {
    banner: 'Draft, not published: planned, not built.',
    bannerNote: `This page is linked from nowhere on the site and is never indexed. ${PUBLIC_NAME} runs no job catalogue and no jobs space today. The postings below are made up in the shape the catalogue is planned to have, and the demo uses made-up data too. Both run in this browser only: they send nothing and store nothing.`,
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
    bannerNote: `Diese Seite ist von nirgends auf der Website verlinkt und wird nie indexiert. ${PUBLIC_NAME} betreibt heute keinen Stellenkatalog und keinen Jobs-Space. Die Stellen unten sind erfunden, in der Form, die der Katalog haben soll, und auch die Demo nutzt erfundene Daten. Beides läuft nur in diesem Browser: Es sendet nichts und speichert nichts.`,
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
  es: {
    banner: 'Borrador, no publicado: previsto, no construido.',
    bannerNote: `Esta página no está enlazada desde ningún lugar del sitio y nunca se indexa. ${PUBLIC_NAME} no gestiona hoy ningún catálogo de empleo ni ningún espacio de Jobs. Los anuncios de abajo son inventados, con la forma que se prevé para el catálogo, y la demostración también usa datos inventados. Ambos funcionan solo en este navegador: no envían nada y no guardan nada.`,
    title: 'Jobs: anuncios directamente de los empleadores, un sí confidencial (previsto, borrador)',
    description: `Borrador: un tablón de empleo en ${PUBLIC_NAME} con anuncios de los propios empleadores, fuente y fecha de obtención en cada uno, y un sí discreto. Datos inventados.`,
    eyebrow: 'Jobs · previsto · borrador',
    h1: ['Anuncios directamente de los empleadores.', 'Diga que sí con discreción.'],
    lede: `Previsto: un tablón gratuito de anuncios tomados de los propios sistemas de candidaturas de los empleadores y de la búsqueda de empleo de la Agencia Federal de Empleo de Alemania, cada uno con su fuente, el día en que se obtuvo y un enlace al original. Encima, un sí discreto para quien ya trabaja: la empresa sabe que alguien está interesado, como criterios sin nombre, y solo sabe quién es cuando ella también dice que sí. ${PUBLIC_NAME} comprueba a ambas partes, y un no no revela nada. La página no indica ninguna fecha.`,
    demo: {
      h2: 'Pruébelo: una persona, una empresa',
      label: 'Datos de ejemplo inventados · se ejecuta en su navegador, no se envía nada',
      steps: ['Comprobación', 'Encaje en privado', 'Ambas dicen que sí'],
      progress: 'Pasos',
      buyer: { role: 'Persona', name: 'Aoife Byrne (ficticia)', wants: 'Busca', text: 'Un puesto junior en datos, híbrido, en Irlanda, desde febrero de 2027, 42.000–46.000 EUR al año' },
      supplier: { role: 'Empresa', name: 'Northwind Analytics (ficticia)', wants: 'Contrata', text: 'Un analista de datos junior, híbrido, en Irlanda o en los Países Bajos, desde principios de 2027, 40.000–48.000 EUR al año' },
      hidden: 'Nombre oculto',
      email: 'Dirección de correo',
      check: {
        title: 'Cada parte confirma su contacto',
        p: 'Cada parte confirma los criterios que indicó y abre un enlace enviado a su dirección de correo. No se guarda nada antes de que confirme. Las comprobaciones de la empresa están previstas.',
        pending: 'Aún sin confirmar',
        done: 'Confirmado con un enlace',
        button: 'Confirmar',
        next: 'Buscar un encaje',
      },
      match: {
        title: 'Una tarjeta de puesto sin nombres',
        p: `${PUBLIC_NAME} compara el puesto y a la persona criterio por criterio. La empresa ve el veredicto de cada uno, nunca el nombre, el contacto ni la cifra salarial de la persona. Sin puntuación ni clasificación.`,
        card: 'Posible encaje: analista de datos junior',
        criteria: [
          { label: 'Puesto', value: 'Datos y analítica, junior', verdict: 'meets' },
          { label: 'Banda salarial', value: 'La del puesto: 40.000–48.000 EUR al año', verdict: 'meets' },
          { label: 'Modalidad de trabajo', value: 'Híbrido', verdict: 'meets' },
          { label: 'Lugar', value: 'Irlanda', verdict: 'meets' },
          { label: 'Idiomas de trabajo', value: 'El puesto no lo indica', verdict: 'unknown' },
        ],
        verdicts: { meets: 'Encaja', partly: 'Encaja en parte', conflicts: 'Contradice', unknown: 'Desconocido' },
        approved: 'Una persona con nombre del equipo del espacio aprobó este posible encaje. La aprobación no revela nada.',
        next: 'Preguntar a ambas partes',
      },
      yes: {
        title: 'Ambas dicen que sí, o nadie se entera de nada',
        p: 'Cada parte responde por su cuenta. Hasta que ambas dicen que sí, ninguna sabe quién es la otra.',
        ask: { buyer: '¿Le interesa este puesto?', supplier: '¿Quiere que le presenten a esta persona?' },
        yes: 'Me interesa',
        no: 'No es para mí',
        waiting: 'Interés indicado. A la espera de la otra parte, que no ve esta respuesta.',
        said: 'No es para mí.',
        introduced: 'Presentadas. Ambas dijeron que sí, así que solo ahora se envían los nombres y las direcciones de correo confirmadas.',
        mode: 'Aquí se muestra como presentación directa; un espacio de Jobs también puede hacer la presentación a través de su propio equipo.',
        declined: 'Sin presentación. Una parte dijo que no, así que ninguna sabe quién es la otra.',
        reset: 'Empezar de nuevo',
      },
      more: 'Su propia página en Jobs',
    },
    mine: {
      p: 'Lo que ve una persona al iniciar sesión: los criterios que confirmó, lo que ve de ella cada empresa, quién nunca la ve, pausa, exportación y borrado.',
      link: 'Su propia página en Jobs (borrador, en inglés)',
    },
    faq: [
      {
        id: 'covert',
        title: `¿Qué es la búsqueda de empleo discreta en ${PUBLIC_NAME}?`,
        paragraphs: [
          `Una forma prevista de buscar un nuevo empleo mientras sigue trabajando. Usted le dice a ${PUBLIC_NAME} lo que quiere en una conversación breve y lo confirma como criterios: sin perfil público, sin currículum, sin candidatura. Una empresa lo ve solo como esos criterios y el veredicto de cada uno, sin su nombre, y solo se le presenta cuando usted y la empresa dicen que sí.`,
          'Está previsto, no construido: hoy no funciona ningún espacio de Jobs.',
        ],
      },
      {
        id: 'employer',
        title: '¿Ve algo mi empleador?',
        paragraphs: [
          `Así está previsto: usted indica las empresas que nunca deben verle, empezando por su empleador actual. Una empresa indicada no obtiene ningún encaje con usted, ni tarjeta ni recuento, y nunca se entera de que usted la indicó. Esto vale mientras la empresa use el dominio que confirmó con ${PUBLIC_NAME}; no se promete nada más fuerte.`,
          'Cualquier otra empresa ve solo criterios y veredictos, nunca su nombre, hasta que ambas partes dicen que sí. La lista está prevista y aún no está construida.',
        ],
      },
    ],
    sections: [
      {
        id: 'rules',
        title: 'Las reglas que sigue esta página',
        paragraphs: [
          'Una persona no tiene perfil público: ni tarjeta en un tablón, ni resultado de búsqueda, ni entrada en un listado. Una empresa ve a una persona solo como criterios y veredictos, sin nombre, hasta que ambas dijeron que sí.',
          'No hay puntuación ni clasificación: una empresa ve el veredicto de cada criterio, con las mismas palabras con que la persona lo ve sobre sí misma, nunca la cifra salarial de la persona.',
          'Un no, un bloqueo o un sí aún sin responder nunca se muestra a la otra parte.',
          'La presentación llega solo cuando ambas dijeron que sí y el equipo del espacio la aprobó; entonces cada parte recibe el nombre y la dirección de correo confirmada de la otra.',
        ],
      },
      {
        id: 'today',
        title: 'Lo que existe hoy',
        paragraphs: [
          `Nada de esta página está construido en Jobs, y ${PUBLIC_NAME} no gestiona ningún espacio de Jobs, ni siquiera con datos inventados. Los criterios de Jobs, las tarjetas de puesto, el lado de la empresa y el inicio de sesión son borradores en ramas de desarrollo, ninguno integrado; la lista de bloqueo aún no está construida.`,
          'Tampoco hay todavía un catálogo de empleo: el recolector y su API de lectura son borradores en ramas de desarrollo, ninguno integrado, y los anuncios del tablón son inventados.',
          'Hoy, la única comprobación de una persona es la dirección de correo que confirma con un enlace.',
        ],
      },
    ],
    open: {
      title: 'Pendiente antes de que lo use gente real',
      items: [
        'El nombre y el dominio con los que Jobs aparece ante las personas.',
        'Cómo se comprueba a una empresa antes de que vea a nadie; el control de su dominio es la primera comprobación prevista.',
        'Si empieza un piloto cerrado con personas invitadas y a quién se invita. Esto lo decide el propietario.',
        'Si se responden las preguntas de la asesoría jurídica sobre los criterios de Jobs antes de que participe gente real.',
        'Si se publica esta página y cuándo: el visto bueno del propietario.',
      ],
    },
  },
  it: {
    banner: 'Bozza, non pubblicata: previsto, non costruito.',
    bannerNote: `Questa pagina non è collegata da nessuna parte del sito e non viene mai indicizzata. ${PUBLIC_NAME} oggi non gestisce alcun catalogo di annunci né alcuno spazio Jobs. Gli annunci qui sotto sono inventati, nella forma prevista per il catalogo, e anche la demo usa dati inventati. Entrambi funzionano solo in questo browser: non inviano nulla e non salvano nulla.`,
    title: 'Jobs: annunci direttamente dai datori di lavoro, un sì in modo riservato (previsto, bozza)',
    description: `Bozza: una bacheca di lavoro su ${PUBLIC_NAME} con annunci direttamente dai datori di lavoro, fonte e data di recupero su ciascuno, e un sì riservato. Dati inventati.`,
    eyebrow: 'Jobs · previsto · bozza',
    h1: ['Annunci direttamente dai datori di lavoro.', 'Dire sì in modo riservato.'],
    lede: `Previsto: una bacheca gratuita di annunci presi dai sistemi di candidatura dei datori di lavoro stessi e dalla ricerca di lavoro dell’Agenzia federale per il lavoro tedesca, ciascuno con la sua fonte, il giorno in cui è stato recuperato e un link all’originale. In più, un sì riservato per chi ha già un lavoro: l’azienda viene a sapere che qualcuno è interessato, come criteri senza nome, e viene a sapere chi è solo quando dice sì anch’essa. ${PUBLIC_NAME} controlla entrambe le parti e un no non rivela nulla. La pagina non indica alcuna data.`,
    demo: {
      h2: 'Provi: una persona, un’azienda',
      label: 'Dati di esempio inventati · funziona nel Suo browser, non viene inviato nulla',
      steps: ['Controllo', 'Corrispondenza in privato', 'Entrambe dicono sì'],
      progress: 'Passaggi',
      buyer: { role: 'Persona', name: 'Aoife Byrne (fittizia)', wants: 'Cerca', text: 'Un ruolo junior nei dati, ibrido, in Irlanda, da febbraio 2027, 42.000–46.000 EUR l’anno' },
      supplier: { role: 'Azienda', name: 'Northwind Analytics (fittizia)', wants: 'Assume', text: 'Un data analyst junior, ibrido, in Irlanda o nei Paesi Bassi, da inizio 2027, 40.000–48.000 EUR l’anno' },
      hidden: 'Nome nascosto',
      email: 'Indirizzo email',
      check: {
        title: 'Ciascuna parte conferma il proprio contatto',
        p: 'Ciascuna parte conferma i criteri che ha indicato e apre un link inviato al proprio indirizzo email. Prima della conferma non viene salvato nulla. I controlli sull’azienda sono previsti.',
        pending: 'Non ancora confermato',
        done: 'Confermato tramite un link',
        button: 'Conferma',
        next: 'Cerca una corrispondenza',
      },
      match: {
        title: 'Una scheda del ruolo senza nomi',
        p: `${PUBLIC_NAME} confronta il ruolo e la persona criterio per criterio. L’azienda vede il verdetto su ciascuno, mai il nome, il contatto o la cifra dello stipendio della persona. Nessun punteggio, nessuna classifica.`,
        card: 'Possibile corrispondenza: data analyst junior',
        criteria: [
          { label: 'Ruolo', value: 'Dati e analisi, junior', verdict: 'meets' },
          { label: 'Fascia salariale', value: 'Quella del ruolo: 40.000–48.000 EUR l’anno', verdict: 'meets' },
          { label: 'Modalità di lavoro', value: 'Ibrido', verdict: 'meets' },
          { label: 'Sede', value: 'Irlanda', verdict: 'meets' },
          { label: 'Lingue di lavoro', value: 'Il ruolo non lo indica', verdict: 'unknown' },
        ],
        verdicts: { meets: 'Corrisponde', partly: 'Corrisponde in parte', conflicts: 'Contraddice', unknown: 'Sconosciuto' },
        approved: 'Una persona identificata del team dello spazio ha approvato questa possibile corrispondenza. L’approvazione non rivela nulla.',
        next: 'Chiedere a entrambe le parti',
      },
      yes: {
        title: 'Entrambe dicono sì, oppure nessuno viene a sapere nulla',
        p: 'Ciascuna parte risponde da sola. Finché entrambe non dicono sì, nessuna delle due viene a sapere chi è l’altra.',
        ask: { buyer: 'Le interessa questo ruolo?', supplier: 'Vuole essere presentata a questa persona?' },
        yes: 'Mi interessa',
        no: 'Non fa per me',
        waiting: 'Mi interessa. In attesa dell’altra parte, che non vede questa risposta.',
        said: 'Non fa per me.',
        introduced: 'Presentazione fatta. Entrambe hanno detto sì, quindi solo ora vengono inviati i nomi e gli indirizzi email confermati.',
        mode: 'Qui mostrata come presentazione diretta; uno spazio Jobs può fare la presentazione anche tramite il proprio team.',
        declined: 'Nessuna presentazione. Una parte ha detto no, quindi nessuna delle due viene a sapere chi è l’altra.',
        reset: 'Ricomincia',
      },
      more: 'La Sua pagina in Jobs',
    },
    mine: {
      p: 'Che cosa vede una persona dopo l’accesso: i criteri confermati, che cosa vede di lei ogni azienda, chi non la vede mai, pausa, esportazione e cancellazione.',
      link: 'La Sua pagina in Jobs (bozza, in inglese)',
    },
    faq: [
      {
        id: 'covert',
        title: `Che cos’è la ricerca di lavoro riservata su ${PUBLIC_NAME}?`,
        paragraphs: [
          `Un modo previsto per cercare un nuovo lavoro mentre si è occupati. Lei dice a ${PUBLIC_NAME} che cosa vuole in una breve conversazione e lo conferma come criteri: nessun profilo pubblico, nessun CV, nessuna candidatura. Un’azienda La vede solo come quei criteri e il verdetto su ciascuno, senza il Suo nome, e la presentazione avviene solo quando entrambe le parti dicono sì.`,
          'È previsto, non costruito: oggi non funziona alcuno spazio Jobs.',
        ],
      },
      {
        id: 'employer',
        title: 'Il mio datore di lavoro vede qualcosa?',
        paragraphs: [
          'Il piano è questo: Lei elenca le aziende che non devono mai vederLa, a cominciare dal Suo attuale datore di lavoro. Un’azienda in elenco non riceve alcuna corrispondenza con Lei, nessuna scheda e nessun conteggio, e non viene mai informata che Lei l’ha inserita. Questo vale finché l’azienda usa il dominio che ha confermato con ' + PUBLIC_NAME + '; non si promette nulla di più.',
          'Qualsiasi altra azienda vede solo criteri e verdetti, mai il Suo nome, finché entrambe le parti non dicono sì. L’elenco è previsto e non ancora costruito.',
        ],
      },
    ],
    sections: [
      {
        id: 'rules',
        title: 'Le regole che questa pagina segue',
        paragraphs: [
          'Una persona non ha un profilo pubblico: nessuna scheda su una bacheca, nessun risultato di ricerca, nessuna voce in un elenco. Un’azienda vede una persona solo come criteri e verdetti, senza nome, finché entrambe non hanno detto sì.',
          'Non ci sono punteggi né classifiche: un’azienda vede il verdetto su ciascun criterio, con le stesse parole che la persona vede su di sé, mai la cifra dello stipendio della persona.',
          'Un no, un blocco o un sì ancora senza risposta non viene mai mostrato all’altra parte.',
          'La presentazione segue solo quando entrambe hanno detto sì e il team dello spazio l’ha approvata; allora ciascuna parte riceve il nome e l’indirizzo email confermato dell’altra.',
        ],
      },
      {
        id: 'today',
        title: 'Che cosa esiste oggi',
        paragraphs: [
          `Nulla di questa pagina è costruito in Jobs e ${PUBLIC_NAME} non gestisce alcuno spazio Jobs, nemmeno con dati inventati. I criteri di Jobs, le schede dei ruoli, il lato aziendale e l’accesso sono bozze su rami di sviluppo, nessuna integrata; l’elenco dei blocchi non è ancora costruito.`,
          'Non c’è ancora nemmeno un catalogo di annunci: il raccoglitore e la sua API di lettura sono bozze su rami di sviluppo, nessuna integrata, e gli annunci sulla bacheca sono inventati.',
          'Oggi l’unico controllo su una persona è l’indirizzo email che conferma tramite un link.',
        ],
      },
    ],
    open: {
      title: 'Aperto prima che persone reali lo usino',
      items: [
        'Il nome e il dominio con cui Jobs appare alle persone.',
        'Come viene controllata un’azienda prima che veda qualcuno; il controllo del suo dominio è il primo controllo previsto.',
        'Se parte un pilota chiuso con persone invitate e chi viene invitato. Lo decide il proprietario.',
        'Se le domande alla consulenza legale sui criteri di Jobs hanno una risposta prima che partecipino persone reali.',
        'Se e quando questa pagina viene pubblicata: il via libera del proprietario.',
      ],
    },
  },
  fr: {
    banner: 'Brouillon, non publié : prévu, pas construit.',
    bannerNote: `Cette page n’est liée depuis aucun endroit du site et n’est jamais indexée. ${PUBLIC_NAME} ne fait fonctionner aucun catalogue d’emplois ni aucun espace Jobs aujourd’hui. Les annonces ci-dessous sont inventées, dans la forme que le catalogue doit avoir, et la démo utilise aussi des données inventées. Les deux ne fonctionnent que dans ce navigateur : elles n’envoient rien et ne stockent rien.`,
    title: 'Jobs : des annonces directement des employeurs, un oui en confidence (prévu, brouillon)',
    description: `Brouillon : un tableau d’emplois sur ${PUBLIC_NAME}, annonces des employeurs eux-mêmes, source et date de récupération sur chacune, un oui discret. Données inventées.`,
    eyebrow: 'Jobs · prévu · brouillon',
    h1: ['Des annonces directement des employeurs.', 'Dites oui en confidence.'],
    lede: `Prévu : un tableau gratuit d’annonces tirées des systèmes de candidature propres aux employeurs et de la recherche d’emploi de l’Agence fédérale pour l’emploi allemande, chacune avec sa source, le jour où elle a été récupérée et un lien vers l’original. En plus, un oui discret pour une personne en poste : l’entreprise apprend que quelqu’un est intéressé, sous forme de critères sans nom, et ne sait qui c’est que lorsqu’elle dit oui aussi. ${PUBLIC_NAME} contrôle les deux côtés, et un non ne révèle rien. La page ne donne aucune date.`,
    demo: {
      h2: 'Essayez : une personne, une entreprise',
      label: 'Données d’exemple inventées · fonctionne dans votre navigateur, rien n’est envoyé',
      steps: ['Contrôle', 'Rapprochement en privé', 'Les deux disent oui'],
      progress: 'Étapes',
      buyer: { role: 'Personne', name: 'Aoife Byrne (fictive)', wants: 'Recherche', text: 'Un poste junior en données, hybride, en Irlande, à partir de février 2027, 42 000–46 000 EUR par an' },
      supplier: { role: 'Entreprise', name: 'Northwind Analytics (fictive)', wants: 'Recrute', text: 'Un analyste de données junior, hybride, en Irlande ou aux Pays-Bas, à partir du début de 2027, 40 000–48 000 EUR par an' },
      hidden: 'Nom masqué',
      email: 'Adresse e-mail',
      check: {
        title: 'Chaque côté confirme son contact',
        p: 'Chaque côté confirme les critères qu’il a donnés et ouvre un lien envoyé à son adresse e-mail. Rien n’est enregistré avant sa confirmation. Les contrôles de l’entreprise sont prévus.',
        pending: 'Pas encore confirmé',
        done: 'Confirmé par un lien',
        button: 'Confirmer',
        next: 'Chercher une correspondance',
      },
      match: {
        title: 'Une carte de poste sans noms',
        p: `${PUBLIC_NAME} compare le poste et la personne critère par critère. L’entreprise voit le verdict sur chacun, jamais le nom, le contact ni le montant du salaire de la personne. Pas de score, pas de classement.`,
        card: 'Correspondance possible : analyste de données junior',
        criteria: [
          { label: 'Poste', value: 'Données et analyse, junior', verdict: 'meets' },
          { label: 'Fourchette de salaire', value: 'Celle du poste : 40 000–48 000 EUR par an', verdict: 'meets' },
          { label: 'Mode de travail', value: 'Hybride', verdict: 'meets' },
          { label: 'Lieu', value: 'Irlande', verdict: 'meets' },
          { label: 'Langues de travail', value: 'Le poste ne le précise pas', verdict: 'unknown' },
        ],
        verdicts: { meets: 'Correspond', partly: 'Correspond en partie', conflicts: 'Contredit', unknown: 'Inconnu' },
        approved: 'Une personne nommée de l’équipe de l’espace a approuvé cette correspondance possible. L’approbation ne révèle rien.',
        next: 'Interroger les deux côtés',
      },
      yes: {
        title: 'Les deux disent oui, ou personne n’apprend rien',
        p: 'Chaque côté répond seul. Tant que les deux n’ont pas dit oui, aucun ne sait qui est l’autre.',
        ask: { buyer: 'Intéressé par ce poste ?', supplier: 'Être mis en relation avec cette personne ?' },
        yes: 'Intéressé',
        no: 'Pas pour moi',
        waiting: 'Intéressé. En attente de l’autre côté, qui ne voit pas cette réponse.',
        said: 'Pas pour moi.',
        introduced: 'Mise en relation faite. Les deux ont dit oui, donc ce n’est que maintenant que les noms et les adresses e-mail confirmées sont transmis.',
        mode: 'Montrée ici comme une mise en relation directe ; un espace Jobs peut aussi la faire par sa propre équipe.',
        declined: 'Pas de mise en relation. Un côté a dit non, donc aucun ne sait qui est l’autre.',
        reset: 'Recommencer',
      },
      more: 'Votre propre page dans Jobs',
    },
    mine: {
      p: 'Ce qu’une personne voit une fois connectée : les critères qu’elle a confirmés, ce que chaque entreprise voit d’elle, qui ne la voit jamais, la pause, l’export et la suppression.',
      link: 'Votre propre page dans Jobs (brouillon, en anglais)',
    },
    faq: [
      {
        id: 'covert',
        title: `Qu’est-ce que la recherche d’emploi discrète sur ${PUBLIC_NAME} ?`,
        paragraphs: [
          `Une façon prévue de chercher un nouvel emploi pendant que vous êtes en poste. Vous dites à ${PUBLIC_NAME} ce que vous voulez dans une courte conversation et vous le confirmez sous forme de critères : pas de profil public, pas de CV, pas de candidature. Une entreprise ne vous voit que comme ces critères et le verdict sur chacun, sans votre nom, et vous n’êtes mis en relation que lorsque vous et l’entreprise dites oui.`,
          'C’est prévu, pas construit : aucun espace Jobs ne fonctionne aujourd’hui.',
        ],
      },
      {
        id: 'employer',
        title: 'Mon employeur voit-il quelque chose ?',
        paragraphs: [
          `C’est le plan : vous listez les entreprises qui ne doivent jamais vous voir, votre employeur actuel en premier. Une entreprise listée n’a aucune correspondance avec vous, aucune carte et aucun décompte, et on ne lui dit jamais que vous l’avez listée. Cela vaut tant que l’entreprise utilise le domaine qu’elle a confirmé auprès de ${PUBLIC_NAME} ; rien de plus fort n’est promis.`,
          'Toute autre entreprise ne voit que des critères et des verdicts, jamais votre nom, jusqu’à ce que les deux côtés disent oui. La liste est prévue, pas encore construite.',
        ],
      },
    ],
    sections: [
      {
        id: 'rules',
        title: 'Les règles que suit cette page',
        paragraphs: [
          'Une personne n’a pas de profil public : pas de carte sur un tableau, pas de résultat de recherche, pas d’entrée dans une liste. Une entreprise ne voit une personne que comme des critères et des verdicts, sans nom, tant que les deux n’ont pas dit oui.',
          'Il n’y a ni score ni classement : une entreprise voit le verdict sur chaque critère, dans les mêmes mots que ceux que la personne voit à son sujet, jamais le montant de son salaire.',
          'Un non, un blocage ou un oui qui n’a pas encore reçu de réponse n’est jamais montré à l’autre côté.',
          'La mise en relation n’a lieu que lorsque les deux ont dit oui et que l’équipe de l’espace l’a approuvée ; alors chaque côté reçoit le nom et l’adresse e-mail confirmée de l’autre.',
        ],
      },
      {
        id: 'today',
        title: 'Ce qui existe aujourd’hui',
        paragraphs: [
          `Rien de cette page n’est construit dans Jobs, et ${PUBLIC_NAME} ne fait fonctionner aucun espace Jobs, pas même avec des données inventées. Les critères Jobs, les cartes de poste, le côté entreprise et la connexion sont des brouillons sur des branches de développement, aucun fusionné ; la liste de blocage n’est pas encore construite.`,
          'Il n’y a pas non plus encore de catalogue d’annonces : le collecteur et son API de lecture sont des brouillons sur des branches de développement, aucun fusionné, et les annonces du tableau sont inventées.',
          'Aujourd’hui, le seul contrôle d’une personne est l’adresse e-mail qu’elle confirme par un lien.',
        ],
      },
    ],
    open: {
      title: 'À régler avant que de vraies personnes l’utilisent',
      items: [
        'Le nom et le domaine sous lesquels Jobs apparaît aux personnes.',
        'Comment une entreprise est contrôlée avant de voir quelqu’un ; le contrôle de son domaine est le premier contrôle prévu.',
        'Si un pilote fermé avec des personnes invitées démarre, et qui est invité. C’est au propriétaire de décider.',
        'Si les questions du conseil juridique sur les critères Jobs sont réglées avant que de vraies personnes participent.',
        'Si et quand cette page est publiée : le feu vert du propriétaire.',
      ],
    },
  },
};
