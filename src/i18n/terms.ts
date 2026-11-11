/* Linkbot's fixed terms, the one source for the site, the widget and the docs: each term once per language, with one
   definition that is true today (docs/truth-check.md). The marketing site shows them as its glossary;
   the Connect lane takes the same words for the widget. `avoid` lists the synonyms the copy may not use for a term;
   tests/terms.test.mjs fails when one appears in any catalogue, front copy or FAQ.
   "Verified history" (the owner's plan) is written "checked history": BUILD MODE bans "verified" (CLAUDE.md, rule 4),
   and the German is "geprüfte Historie" either way. It is planned, not built, and its definition says so. */
import type { Lang } from './locales.ts';

/** The name the public reads: on the home, in the FAQ and its terms, in llms.txt (the head of llms-full.txt), in the header and
    footer and in schema.org, and every page's own copy (owner, 2026-11-10: the company and the platform are Sensalio;
    BRAND.md of the same day). Changing this line renames all of them; tests/name.test.mjs fails where a source or a
    built page writes the old name out. Code identifiers, repository and package names stay Linkbot. */
export const PUBLIC_NAME = 'Sensalio';

/** The legal entity, until the rename to Sensalio OÜ is entered in the Estonian Business Register (BRAND.md: imprints
    and privacy texts keep this name until then). schema.org's Organization carries it as legalName. */
export const LEGAL_NAME = 'Linkbot OÜ';

export const TERM_KEYS = ['linkbot', 'space', 'check', 'privateMatch', 'boardCard', 'bothSayYes', 'introduction', 'checkedHistory'] as const;
export type TermKey = (typeof TERM_KEYS)[number];

export interface Term { term: string; definition: string; avoid: RegExp[] }

const NAME_AVOID = [/\bLinkBot\b/, /\bLink-Bot\b/, /\bLink Bot\b/];

export const TERMS: Record<Lang, Record<TermKey, Term>> = {
  en: {
    linkbot: { term: PUBLIC_NAME, definition: 'A service that lets two businesses that do not know each other trust each other before they meet: it confirms each side, matches them in private and introduces them only when both say yes.', avoid: NAME_AVOID },
    space: { term: 'space', definition: 'One market on one platform, with its own instance, database and keys, and the questions of that market. The first space is for industrial minerals and runs as a test instance with synthetic data.', avoid: [/\btenant\b/i] },
    check: { term: 'check', definition: `What is confirmed about a side before anything is stored or matched. Today each side confirms its email address through a link sent to it. Checks of a company by ${PUBLIC_NAME} are planned.`, avoid: [/\bverification\b/i, /\bvetting\b/i] },
    privateMatch: { term: 'private match', definition: `${PUBLIC_NAME} compares a need and an offer criterion by criterion and gives a verdict per criterion (fits, partly fits, conflicts, unknown), never a score. Neither side sees the other’s name or contact.`, avoid: [/\bblind match/i, /\banonymous match/i] },
    boardCard: { term: 'board card without names', definition: 'How a possible fit appears to a side on the board: the criteria and their verdicts, without the other side’s name or contact.', avoid: [/\bmatch card\b/i, /\bblind card\b/i] },
    bothSayYes: { term: 'both say yes', definition: 'Each side answers a possible fit on its own. Only when both say yes does an introduction follow; a no on either side reveals nothing to the other.', avoid: [/\bBoth yes\b/, /\bdouble opt-in\b/i, /\bmutual (consent|yes)\b/i] },
    introduction: { term: 'introduction', definition: 'The moment the names and contact details go to both sides: only after the space’s gates, a named operator’s approval and both sides’ yes, made directly or through the platform’s team.', avoid: [/\bintro\b/i, /\bconnection request\b/i] },
    checkedHistory: { term: 'checked history', definition: 'Planned, not built: the record of checks, introductions and confirmed deals that grows with each one.', avoid: [/\bverified history\b/i, /\btrust score\b/i, /\breputation score\b/i] },
  },
  de: {
    linkbot: { term: PUBLIC_NAME, definition: 'Ein Dienst, mit dem zwei Unternehmen, die sich nicht kennen, einander vertrauen können, bevor sie sich kennen: Er bestätigt jede Seite, gleicht verborgen ab und stellt beide erst vor, wenn beide Ja sagen.', avoid: NAME_AVOID },
    space: { term: 'Space', definition: 'Ein Markt auf einer Plattform, mit eigener Instanz, Datenbank und eigenen Schlüsseln und den Fragen dieses Markts. Der erste Space ist für Industrieminerale und läuft als Test-Instanz mit synthetischen Daten.', avoid: [/\bMandant\w*/] },
    check: { term: 'Prüfung', definition: `Was über eine Seite bestätigt ist, bevor etwas gespeichert oder abgeglichen wird. Heute bestätigt jede Seite ihre E-Mail-Adresse über einen Link, der ihr geschickt wird. Firmenprüfungen durch ${PUBLIC_NAME} sind geplant.`, avoid: [/\bVerifizierung\b/] },
    privateMatch: { term: 'verborgener Abgleich', definition: `${PUBLIC_NAME} vergleicht eine Anfrage und ein Angebot Kriterium für Kriterium und gibt ein Urteil pro Kriterium (passt, passt teilweise, widerspricht, unbekannt), nie eine Punktzahl. Keine Seite sieht Namen oder Kontakt der anderen.`, avoid: [/\bblinde[ns]? (Matching|Abgleich)/i, /\banonyme[nr]? Abgleich/i] },
    boardCard: { term: 'Board-Karte ohne Namen', definition: 'Wie eine mögliche Passung einer Seite auf dem Board erscheint: die Kriterien und ihre Urteile, ohne Namen oder Kontakt der anderen Seite.', avoid: [/\bMatchkarte\b/i, /\bMatch-Karte\b/i] },
    bothSayYes: { term: 'beide sagen Ja', definition: 'Jede Seite beantwortet eine mögliche Passung für sich. Erst wenn beide Ja sagen, folgt eine Vorstellung; ein Nein auf einer Seite verrät der anderen nichts.', avoid: [/\bBeide Ja\b(?! (gesagt|sagen))/, /\bDouble-Opt-in\b/i, /\bbeidseitige Zustimmung\b/i] },
    introduction: { term: 'Vorstellung', definition: 'Der Moment, in dem Namen und Kontaktdaten an beide Seiten gehen: erst nach den Gates des Space, der Freigabe eines benannten Operators und dem Ja beider Seiten, direkt oder über das Team der Plattform.', avoid: [/\bKontaktvermittlung\b/i, /\bIntro\b/] },
    checkedHistory: { term: 'geprüfte Historie', definition: 'Geplant, nicht gebaut: der Verlauf der Prüfungen, Vorstellungen und bestätigten Geschäfte, der mit jedem davon wächst.', avoid: [/\bverifizierte Historie\b/i, /\bVertrauens-?[sS]core\b/] },
  },
  es: {
    linkbot: { term: PUBLIC_NAME, definition: 'Un servicio que permite que dos empresas que no se conocen confíen la una en la otra antes de conocerse: confirma cada parte, busca el encaje en privado y las presenta solo cuando ambas dicen que sí.', avoid: NAME_AVOID },
    space: { term: 'espacio', definition: 'Un mercado en una plataforma, con su propia instancia, base de datos y claves, y las preguntas de ese mercado. El primer espacio es para minerales industriales y funciona como instancia de prueba con datos sintéticos.', avoid: [/\binquilino\b/i] },
    check: { term: 'comprobación', definition: `Lo que se confirma de una parte antes de guardar o comparar nada. Hoy cada parte confirma su dirección de correo con un enlace que se le envía. Las comprobaciones de empresas por ${PUBLIC_NAME} están previstas.`, avoid: [/\bverificación\b/i] },
    privateMatch: { term: 'encaje en privado', definition: `${PUBLIC_NAME} compara una necesidad y una oferta criterio por criterio y da un veredicto por criterio (encaja, encaja en parte, contradice, desconocido), nunca una puntuación. Ninguna parte ve el nombre ni el contacto de la otra.`, avoid: [/\bemparejamiento ciego\b/i, /\bencaje ciego\b/i] },
    boardCard: { term: 'tarjeta del tablón sin nombres', definition: 'Cómo ve una parte un posible encaje en el tablón: los criterios y sus veredictos, sin el nombre ni el contacto de la otra parte.', avoid: [/\btarjeta ciega\b/i] },
    bothSayYes: { term: 'ambas dicen que sí', definition: 'Cada parte responde por sí misma a un posible encaje. Solo cuando ambas dicen que sí llega una presentación; un no de cualquiera de las dos no revela nada a la otra.', avoid: [/\bSí de ambos(?!\w)/, /\bAmbos dicen sí(?![\wí])/, /\bdoble opt-in\b/i] },
    introduction: { term: 'presentación', definition: 'El momento en que los nombres y los datos de contacto llegan a ambas partes: solo después de los gates del espacio, la aprobación de un operador con nombre y el sí de ambas, de forma directa o a través del equipo de la plataforma.', avoid: [/\bsolicitud de conexión\b/i] },
    checkedHistory: { term: 'historial comprobado', definition: 'Previsto, no construido: el registro de comprobaciones, presentaciones y negocios confirmados que crece con cada uno.', avoid: [/\bhistorial verificado\b/i, /\bpuntuación de confianza\b/i] },
  },
  it: {
    linkbot: { term: PUBLIC_NAME, definition: 'Un servizio che permette a due aziende che non si conoscono di fidarsi l’una dell’altra prima di conoscersi: conferma ciascuna parte, cerca la corrispondenza in privato e le presenta solo quando entrambe dicono sì.', avoid: NAME_AVOID },
    space: { term: 'spazio', definition: 'Un mercato su una piattaforma, con istanza, database e chiavi propri e le domande di quel mercato. Il primo spazio è dedicato ai minerali industriali e funziona come istanza di prova con dati sintetici.', avoid: [/\btenant\b/i] },
    check: { term: 'controllo', definition: `Ciò che è confermato di una parte prima che qualcosa venga salvato o confrontato. Oggi ciascuna parte conferma il proprio indirizzo email con un link che le viene inviato. I controlli sulle aziende da parte di ${PUBLIC_NAME} sono previsti.`, avoid: [/\bverifica\b/i] },
    privateMatch: { term: 'corrispondenza in privato', definition: `${PUBLIC_NAME} confronta una richiesta e un’offerta criterio per criterio e dà un verdetto per criterio (corrisponde, corrisponde in parte, contraddice, sconosciuto), mai un punteggio. Nessuna parte vede il nome o il contatto dell’altra.`, avoid: [/\bcorrispondenza cieca\b/i, /\bmatching cieco\b/i] },
    boardCard: { term: 'scheda della bacheca senza nomi', definition: 'Come una possibile corrispondenza appare a una parte sulla bacheca: i criteri e i loro verdetti, senza il nome o il contatto dell’altra parte.', avoid: [/\bscheda cieca\b/i] },
    bothSayYes: { term: 'entrambe dicono sì', definition: 'Ciascuna parte risponde da sola a una possibile corrispondenza. Solo quando entrambe dicono sì segue una presentazione; un no di una delle due non rivela nulla all’altra.', avoid: [/\bDoppio sì(?!\w)/, /\bEntrambi dicono sì(?!\w)/, /\bdoppio opt-in\b/i] },
    introduction: { term: 'presentazione', definition: 'Il momento in cui i nomi e i contatti arrivano a entrambe le parti: solo dopo i gate dello spazio, l’approvazione di un operatore identificato e il sì di entrambe, in modo diretto o tramite il team della piattaforma.', avoid: [/\brichiesta di connessione\b/i] },
    checkedHistory: { term: 'storico controllato', definition: 'Previsto, non costruito: il registro dei controlli, delle presentazioni e degli affari confermati che cresce con ognuno.', avoid: [/\bstorico verificato\b/i, /\bpunteggio di fiducia\b/i] },
  },
  fr: {
    linkbot: { term: PUBLIC_NAME, definition: 'Un service qui permet à deux entreprises qui ne se connaissent pas de se faire confiance avant de se rencontrer : il confirme chaque côté, fait le rapprochement en privé et ne les met en relation que lorsque les deux disent oui.', avoid: NAME_AVOID },
    space: { term: 'espace', definition: 'Un marché sur une plateforme, avec sa propre instance, sa base de données, ses clés et les questions de ce marché. Le premier espace est consacré aux minéraux industriels et fonctionne comme instance de test avec des données synthétiques.', avoid: [/\blocataire\b/i] },
    check: { term: 'contrôle', definition: `Ce qui est confirmé d’un côté avant que quoi que ce soit soit enregistré ou comparé. Aujourd’hui, chaque côté confirme son adresse e-mail par un lien qui lui est envoyé. Les contrôles d’entreprises par ${PUBLIC_NAME} sont prévus.`, avoid: [/\bvérification\b/i] },
    privateMatch: { term: 'rapprochement en privé', definition: `${PUBLIC_NAME} compare un besoin et une offre critère par critère et donne un verdict par critère (correspond, correspond en partie, contredit, inconnu), jamais un score. Aucun côté ne voit le nom ni le contact de l’autre.`, avoid: [/\bappariement aveugle\b/i, /\brapprochement aveugle\b/i] },
    boardCard: { term: 'carte du tableau sans noms', definition: 'Comment une correspondance possible apparaît à un côté sur le tableau : les critères et leurs verdicts, sans le nom ni le contact de l’autre côté.', avoid: [/\bcarte aveugle\b/i] },
    bothSayYes: { term: 'les deux disent oui', definition: 'Chaque côté répond seul à une correspondance possible. Une mise en relation ne suit que lorsque les deux disent oui ; un non de l’un ou de l’autre ne révèle rien à l’autre.', avoid: [/\bdouble oui\b/i, /\bdouble opt-in\b/i] },
    introduction: { term: 'mise en relation', definition: 'Le moment où les noms et les coordonnées parviennent aux deux côtés : seulement après les gates de l’espace, l’approbation d’un opérateur identifié et le oui des deux, directement ou par l’équipe de la plateforme.', avoid: [/\bdemande de connexion\b/i] },
    checkedHistory: { term: 'historique contrôlé', definition: 'Prévu, pas construit : le registre des contrôles, des mises en relation et des affaires confirmées, qui grandit avec chacun.', avoid: [/\bhistorique vérifié\b/i, /\bscore de confiance\b/i] },
  },
};

/* The team's own words, never on a public page (owner, 2026-10-29): "pack", "watch"/"Beobachten" and "staging" are
   internal; "Geoprocure" is left out because Linkbot is not switched on there. /developers alone may say "pack", a
   developer's word. A regex source; tests/terms.test.mjs reads it against every built public page. */
export const INTERNAL = String.raw`\b(packs?|watch(es|ing)?|beobachten|staging|geoprocure)\b`;
