/* Die Worte der Seite auf Deutsch, typisiert gegen das Englische (en.ts): ein fehlender Schlüssel
   kompiliert nicht. Jeder Satz sagt, was der Vertrag der Space-API und die Docs der
   Connect-Lane hergeben, nichts darüber hinaus; ein Statussatz nennt den Tag seiner Prüfung (status-date.ts). Sie-Form, wie das Widget. */
import type { Catalogue } from './en.ts';
import { statusDate } from './status-date.ts';
import { PUBLIC_NAME } from './terms.ts';

/** The day the status sentences were checked, in this language (status-date.ts). */
const AS_OF = statusDate('de');

export const de: Catalogue = {
  site: {
    name: PUBLIC_NAME,
    claim: 'Vertrauen zwischen zwei Unternehmen, bevor sie sich kennen.',
    skip: 'Zum Inhalt',
    menu: 'Menü',
    toc: 'Auf dieser Seite',
    language: 'Sprache',
    nav: { docs: 'Doku', developers: 'Entwickler' },
    footer: {
      product: PUBLIC_NAME,
      legal: 'Rechtliches',
      imprint: 'Impressum',
      privacy: 'Datenschutzhinweis',
      contact: 'Kontakt',
      contactPending: `Die Kontaktdaten sind in Vorbereitung, deshalb nennt diese Seite noch keine Adresse und hat kein Kontaktformular.`,
      line: 'Diese Seite setzt keine Cookies, lädt nichts von Dritten und nutzt keine Analyse-Dienste.',
    },
    synthetic: 'Alles auf dieser Seite beschreibt den Vertrag der Space-API und das, was auf dem synthetischen Test-Space läuft, mit synthetischen Daten. Noch nutzt es keine echte Person und keine echte Organisation.',
  },

  developers: {
    title: 'Für Entwickler: das Widget einbetten oder auf der Space-API bauen',
    description: 'Wo die Doku von Connect liegt, die kürzeste Einbettung, ein kurzes SDK-Beispiel für Ihren Server und was es noch nicht gibt: npm-Pakete und MCP.',
    eyebrow: 'Für Entwickler',
    h1: ['Ein Skript', 'oder Ihre eigene Oberfläche.'],
    lede: `Zwei Wege, mit einem Space zu bauen: die Einbettung, ein Skript und ein Element auf Ihrer Seite, oder Ihre eigene Oberfläche auf der Space-API über das SDK, einen durch den Vertrag typisierten Client. Die Dokumentation von Connect zeigt beide. Stand ${AS_OF} liegt sie im Connect-Repository, das noch nicht öffentlich ist.`,
    toc: [['embed', 'Die kürzeste Einbettung'], ['sdk', 'Das SDK auf Ihrem Server'], ['docs', 'Die Dokumentation'], ['not-yet', 'Noch nicht verfügbar']] as [string, string][],
    embed: {
      title: 'Die kürzeste Einbettung',
      lede: 'Setzen Sie sie dorthin, wo das Formular erscheinen soll: Ihren Publishable Key ins Element, die Adresse Ihres Space ins Skript.',
      url: 'EMBED_URL steht für diese Adresse auf der eigenen Instanz Ihres Space; einen zentralen Host gibt es nicht:',
      notes: [
        'Der Modus ist describe, board, watch oder mine; die Seite ist seeking oder offer. Ohne Sprache folgt das Widget dem Browser des Besuchers.',
        'Der Publishable Key gilt nur auf den Origins, die Ihr Space erlaubt. Ein Secret Key gehört nie in eine Seite: Mit einem solchen startet das Widget nicht.',
        `Stand ${AS_OF} liefert die Instanz des synthetischen Test-Space das Widget in der Version 0.6.1-v1 aus.`,
      ],
    },
    sdk: {
      title: 'Das SDK auf Ihrem Server',
      lede: 'Einmal von Ihrem Server aus, mit dem Secret Key: Es registriert Ihren Webhook-Empfänger und gibt das Signaturgeheimnis zurück, das nur dieses eine Mal gezeigt wird.',
      notes: [
        `Das SDK ist Stand ${AS_OF} nicht auf npm. Es wird aus einem Klon des Connect-Repositorys genutzt, wo es ein Paket des Workspace ist.`,
        `Der Test dieses Beispiels läuft gegen einen Stellvertreter, nicht gegen einen Space. Stand ${AS_OF} sendet der Test-Space keine Webhooks.`,
      ],
    },
    docs: {
      title: 'Die Dokumentation',
      lede: `Auf dieser Seite aus dem open-core-Export des Connect-Repositorys gerendert, auf Englisch. Stand ${AS_OF} ist das Repository selbst privat, und nichts davon ist veröffentlicht.`,
      sections: {
        quickstart: { name: 'Quickstart (5 Minuten)', body: 'Ein Script-Tag, Ihr Publishable Key und der Origin Ihrer Seite; dann der ganze Quickstart und der Weg einer Person durch die API.' },
        widget: { name: 'Widget', body: 'Jedes Attribut des Embeds, der React-Wrapper und Rezepte für reines HTML, Astro, Next.js und WordPress.' },
        sdk: { name: 'SDK', body: 'Die typisierten Clients für Ihren Server und für die Seite der Person, und die Prüfung der Webhook-Signatur.' },
        cli: { name: 'CLI', body: 'Der Befehl linkbot: das Widget auf dem eigenen Rechner ausprobieren, in die eigene Seite einbauen, die Einrichtung prüfen. Noch nicht veröffentlicht.' },
        protocol: { name: 'Protokoll', body: 'Der Vertrag der Space API, die drei Schritte, die er einhält, und wer welchen Schlüssel hält.' },
        api: { name: 'API-Referenz', body: 'Jede Route der Space API, aus dem Vertrag erzeugt.' },
        open: { name: 'Was offen ist, was gehostet wird', body: 'Was eine Plattform selbst betreibt und was beim gehosteten Dienst bleibt.' },
      },
    },
    notYet: {
      title: 'Noch nicht verfügbar',
      items: [
        `npm-Pakete: Das SDK, der React-Wrapper und die Pakete für Next.js und Astro sind Stand ${AS_OF} nicht veröffentlicht. Heute laufen sie aus einem Klon des Connect-Repositorys.`,
        'MCP: geplant, nicht gebaut. Es gibt keinen MCP-Endpunkt, den man nutzen kann.',
        `Das Repository selbst: Es ist Stand ${AS_OF} privat.`,
        'Ein Space zum Ausprobieren: Für Entwickler gibt es noch keinen. Die Beispiele laufen gegen ein lokales Beispiel oder einen Stellvertreter.',
      ],
    },
  },

  status: {
    title: 'Status: was auf dem Test-Space läuft, was gebaut ist, was geplant ist',
    description: `Wo jeder Teil von ${PUBLIC_NAME} steht, aus dem Truth-Check der Website: auf dem synthetischen Test-Space, gebaut, aber dort nicht in Betrieb, oder geplant.`,
    eyebrow: 'Status',
    h1: ['Wo es steht,', 'Teil für Teil.'],
    lede: `Geprüft am ${AS_OF} anhand des Statusberichts des Test-Space und des Plans von Connect. Diese Seite wird aus dem Truth-Check der Website gebaut und sagt nichts, was dort nicht steht.`,
    states: {
      test: { title: 'Läuft auf dem Test-Space', lead: 'Synthetische Daten, auf Deutsch und Englisch.' },
      built: { title: 'Gebaut oder im Vertrag, nicht auf dem Test-Space', lead: 'Läuft dort nicht und ist nicht veröffentlicht.' },
      planned: { title: 'Geplant, nicht gebaut', lead: 'Kein Datum versprochen.' },
    },
    items: {
      form: 'Eine Anfrage oder ein Angebot per Formular beschreiben, mit dem Identitätshinweis, wo der Space einen hat',
      text: 'Eine Anfrage oder ein Angebot in eigenen Worten beschreiben, gelesen von festen Regeln ohne Modell',
      board: 'Das Board, mit den vergröberten Werten des Space und nur mit Einträgen, deren Besitzer zugestimmt haben',
      watches: 'Offene Suchen; ihre E-Mails gehen an ein Testpostfach und erreichen niemanden',
      control: 'Einstellungen, Origins, Schlüssel und Funnel eines Space, über die Space-API',
      confirm: 'Bestätigen; der Browser, der bestätigt hat, verwaltet, was er angelegt hat',
      matching: 'Matching mit einem Urteil pro Kriterium',
      gates: 'Gates und Freigabe durch einen benannten Operator',
      introductions: 'Vorstellungen im Operator-Modus, mit Quittungen',
      outcomes: 'Ergebnisse, Änderungen, Pausieren und Schließen',
      deletion: 'Löschung mit dem Löschprotokoll der Instanz',
      widget: 'Das Widget, von der Instanz selbst aus einem festgelegten Release ausgeliefert (0.6.1-v1)',
      webhooks: 'Webhooks an den Server der Plattform: im Vertrag, und das SDK prüft ihre Signaturen; der Test-Space sendet sie nicht',
      mail: 'E-Mail, die ein Postfach erreicht; die E-Mails des Test-Space gehen an ein Testpostfach',
      sdk: 'Das SDK und der React-Wrapper, im Connect-Repository; nicht auf npm veröffentlicht',
      console: 'Die Konsole für das Team einer Plattform; nicht veröffentlicht',
      recipes: 'Rezepte für WordPress, Next.js und Astro; sie laufen in der CI gegen einen Beispiel-Build und sind nicht als Pakete veröffentlicht',
      reader: 'Ein Modell, das Text liest, neben den festen Regeln; es wartet auf eine freigegebene Lese-Richtlinie',
      mcp: 'MCP, damit ein KI-Agent vorbereitet und ein Mensch bestätigt; geplant, es gibt keinen Endpunkt',
      demo: 'Eine Demo des Widgets auf dieser Seite; sie wartet auf einen Demo-Space mit synthetischen Daten',
    },
    source: 'Die Quelle jeder Zeile steht in docs/truth-check.md, im Repository dieser Website.',
    link: 'Der Status, Teil für Teil',
  },
  changelog: {
    title: `Neuigkeiten: die Produktschritte von ${PUBLIC_NAME}, datiert`,
    description: `Jeder Schritt von ${PUBLIC_NAME}, den ein Kunde bemerken kann, datiert und mit seinem Stand: auf dem synthetischen Test-Space oder gebaut und noch nicht verfügbar.`,
    eyebrow: 'Neuigkeiten',
    h1: ['Was sich geändert hat,', 'Schritt für Schritt.'],
    lede: 'Ein Eintrag pro Produktschritt, den ein Kunde bemerken kann, der neueste zuerst. Jeder sagt, ob er auf dem synthetischen Test-Space läuft oder gebaut ist und noch nicht verfügbar. Nichts davon ist schon für echte Nutzer veröffentlicht.',
    states: { test: 'Auf dem Test-Space', built: 'Gebaut, noch nicht verfügbar' },
    note: 'Jeder Eintrag stammt aus einer Datei im Repository dieser Website, die die Pull Requests nennt, auf denen er beruht; ein Eintrag ohne sie stoppt den Build.',
    link: 'Neuigkeiten',
  },

  privacy: {
    title: `Datenschutzhinweis · ${PUBLIC_NAME}`,
    description: 'Der Datenschutzhinweis dieser Website ist in Vorbereitung. Was schon gilt: keine Cookies, nichts von Dritten, keine Analyse-Dienste.',
    eyebrow: 'Datenschutzhinweis',
    h1: 'In Vorbereitung',
    lede: 'Der Datenschutzhinweis für diese Website wird geschrieben und geprüft. Er erscheint hier, sobald er freigegeben ist. Bis dahin steht hier nichts, weil ein Rechtstext nicht geraten werden darf.',
    released: { description: `Der Datenschutzhinweis der ${PUBLIC_NAME}-Website: was die Seite verarbeitet, wozu, auf welcher Rechtsgrundlage, und Ihre Rechte.` },
    facts: {
      title: 'Was für diese Seite schon gilt',
      items: [
        'Sie setzt keine Cookies und nutzt keine Analyse- oder Tracking-Dienste.',
        'Sie lädt nichts von Dritten: Schriften und Bilder kommen von dieser Seite.',
        'Sie hat kein Konto und sendet nichts, was Sie tippen, irgendwohin: Die Felder auf der Startseite arbeiten nur in Ihrem Browser, und die Seite speichert nichts.',
        'Das Produkt läuft auf den eigenen Seiten einer Plattform, unter deren Datenhinweis, neben den festen Zeilen des Widgets.',
      ],
    },
  },

  imprint: {
    title: `Impressum · ${PUBLIC_NAME}`,
    description: `Das Impressum der ${PUBLIC_NAME}-Website: Anbieter- und Kontaktangaben. Der Text ist in Vorbereitung.`,
    eyebrow: 'Impressum',
    h1: 'In Vorbereitung',
    lede: 'Das Impressum (Anbieter, Anschrift, Vertretung, Register- und Steuerangaben, Kontakt) wird vorbereitet und erscheint hier, sobald es bestätigt ist. Bis dahin steht hier nichts, weil nichts davon erfunden werden darf.',
    released: { description: `Das Impressum der ${PUBLIC_NAME}-Website: Anbieter, Anschrift, Vertretung, Register- und Steuerangaben und Kontakt.` },
  },

  contact: {
    title: `Kontakt · ${PUBLIC_NAME}`,
    description: `So erreichen Sie ${PUBLIC_NAME}. Die Kontaktdaten sind in Vorbereitung: Diese Seite nennt die Adresse, sobald ihr Postfach eingerichtet ist.`,
    eyebrow: 'Kontakt',
    h1: 'In Vorbereitung',
    released: { h1: 'Schreiben Sie uns', description: `So erreichen Sie ${PUBLIC_NAME}: die Adresse für eine Frage zu ${PUBLIC_NAME} oder dazu, wie ein Space auf Ihrer Plattform laufen würde.` },
    write: 'Schreiben Sie an {email}.',
  },

  notFound: {
    title: `Seite nicht gefunden · ${PUBLIC_NAME}`,
    description: 'Diese Seite gibt es nicht. Zur Startseite, oder die Seite in einer anderen Sprache lesen.',
    eyebrow: 'Seite nicht gefunden',
    h1: 'Hier ist nichts.',
    lede: 'Die Seite ist vielleicht umgezogen.',
    home: 'Zur Startseite',
    languages: 'Diese Seite in anderen Sprachen',
  },
};
