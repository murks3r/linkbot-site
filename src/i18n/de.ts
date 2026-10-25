/* Die Worte der Seite auf Deutsch, typisiert gegen das Englische (en.ts): ein fehlender Schlüssel
   kompiliert nicht. Jeder Satz sagt, was der Vertrag der Space-API und die Docs der
   Connect-Lane hergeben, nichts darüber hinaus; ein Statussatz nennt den Tag seiner Prüfung (status-date.ts). Sie-Form, wie das Widget. */
import type { Catalogue, Section, Status } from './en.ts';
import { statusDate } from './status-date.ts';

/** The day the status sentences were checked, in this language (status-date.ts). */
const AS_OF = statusDate('de');

export const de: Catalogue = {
  site: {
    name: 'Linkbot',
    claim: 'Eine Matching-Schicht, die jede Plattform einbetten kann.',
    skip: 'Zum Inhalt',
    menu: 'Menü',
    toc: 'Auf dieser Seite',
    language: 'Sprache',
    nav: { how: 'So funktioniert es', sees: 'Wer was sieht', platforms: 'Für Plattformen', verticals: 'Für Branchen', integrations: 'Integrationen', developers: 'Entwickler' },
    footer: {
      product: 'Linkbot',
      legal: 'Rechtliches',
      imprint: 'Impressum',
      privacy: 'Datenschutzhinweis',
      contact: 'Kontakt',
      contactPending: 'Kontaktdaten folgen mit unserer Domain. Linkbot hat noch keine eigene Domain, deshalb nennt diese Seite keine Adresse und hat kein Kontaktformular.',
      line: 'Diese Seite setzt keine Cookies, lädt nichts von Dritten und nutzt keine Analyse-Dienste.',
    },
    status: { now: 'Läuft auf dem Staging-Space', contract: 'Im Vertrag, nicht auf dem Staging-Space', later: 'Nicht gebaut' },
    synthetic: 'Alles auf dieser Seite beschreibt den Vertrag der Space-API und das, was auf dem synthetischen Staging-Space von Geoprocure läuft, mit synthetischen Daten. Noch nutzt es keine echte Person und keine echte Organisation.',
    more: 'Mehr lesen',
  },

  home: {
    h1: ['Anfrage trifft Angebot.', 'Menschen entscheiden.'],
    lede: 'Linkbot ist eine Matching-Schicht, die eine Plattform in ihre eigenen Seiten einbettet. Ein Space pro Markt. Anfragen und Angebote als bestätigte Kriterien. Ein Urteil pro Kriterium, nie ein Score. Eine Vorstellung erst, wenn beide Seiten Ja sagen.',
    actions: { how: 'So funktioniert es', platforms: 'Für Plattformen' },
    flow: {
      label: 'Von der Anfrage zur Vorstellung',
      steps: [
        { name: 'Beschreiben', note: 'eine Anfrage oder ein Angebot, per Formular' },
        { name: 'Bestätigen', note: 'vorher wird nichts gespeichert' },
        { name: 'Passung', note: 'ein Urteil pro Kriterium' },
        { name: 'Freigeben', note: 'ein benannter Operator, nach den Gates' },
        { name: 'Beide Ja', note: 'jede Seite für sich' },
        { name: 'Vorstellen', note: 'dann, und nur dann' },
      ],
    },
    pillars: [
      { title: 'Ein Space pro Markt.', body: 'Ein Space ist ein Markt auf einer Plattform, mit eigener Instanz, Datenbank und eigenen Schlüsseln. Ein Pack gibt ihm das Vokabular seiner Branche: die Kriterien, die Optionen, die Einheiten, die Fragen. Der erste Space ist der von Geoprocure, für Industrieminerale.' },
      { title: 'Kriterien, bestätigt.', body: 'Eine Anfrage oder ein Angebot ist eine Menge von Kriterien, jedes mit seiner Quelle und seiner Gewichtung. Nichts ist vorausgewählt, nichts wird geraten, und was nicht angegeben ist, bleibt unbekannt. Die Person bestätigt das Formular; erst dann wird etwas gespeichert.' },
      { title: 'Eine Vorstellung erst, wenn beide Ja sagen.', body: 'Das Matching vergleicht die gespeicherten Kriterien und zeigt ein Urteil pro Kriterium. Eine Vorstellung braucht die Gates des Space, die Freigabe eines benannten Operators und ein Ja von beiden Seiten. Dann legt der Server sie an, und jeden anderen Weg verweigert er.' },
    ],
    rules: {
      title: 'Die Regeln, vom Server durchgesetzt',
      items: [
        'Nie raten: Jeder gespeicherte Wert trägt seine Quelle, und „Anderes“ wird nie auf die nächstliegende Option abgebildet.',
        'Nichts vorausgewählt: Das Formular hat keine Vorgabewerte, nur Vorschläge, die als solche markiert sind.',
        'Unbekannt bleibt unbekannt: Ein Kriterium, das eine Seite nicht angegeben hat, zählt nie als Passung.',
        'Nichts wird gespeichert, bevor eine Person bestätigt.',
        'Eine Passung gibt nichts preis: nur Urteile, auf der Stufe, die das Pack erlaubt, und einen Hinweis, dass Menschen entscheiden.',
        'Keine Vorstellung ohne die Gates, die Freigabe eines benannten Operators und ein Ja von beiden Seiten.',
        'Kein Modell überstimmt eine harte Bedingung: Muss und Nie entscheidet deterministischer Code.',
        'Jeder Schreibzugriff nennt, wer ihn ausgelöst hat, und steht im Audit-Log.',
      ],
      link: 'So funktioniert das Matching, Schritt für Schritt',
    },
  },

  how: {
    title: 'So funktioniert Linkbot: von der bestätigten Anfrage zur Vorstellung',
    description: 'Ein Space, ein Pack, vier Wege zu beschreiben, ein Urteil pro Kriterium, Freigabe durch einen benannten Operator, eine Vorstellung erst, wenn beide Ja sagen.',
    eyebrow: 'So funktioniert es',
    h1: ['Von der bestätigten Anfrage', 'zur Vorstellung.'],
    lede: 'Jeder Schritt unten steht im Vertrag der Space-API. Wo der Staging-Space einen Schritt noch nicht ausführt, sagt die Seite es.',
    toc: [['blocks', 'Drei Bausteine'], ['rule', 'Das Ja beider Seiten'], ['path', 'Der Weg in sechs Schritten'], ['space', 'Ein Space'], ['pack', 'Ein Pack'], ['describe', 'Vier Wege zu beschreiben'], ['confirm', 'Bestätigen'], ['matching', 'Matching'], ['approval', 'Freigabe und Gates'], ['yes', 'Beide Ja'], ['introduction', 'Die Vorstellung'], ['after', 'Danach'], ['sees', 'Wer sieht was'], ['languages', 'Fünf Sprachen'], ['today', 'Was auf dem Staging-Space läuft']] as [string, string][],
    blocks: {
      title: 'Drei Bausteine',
      lede: 'Ein Space besteht aus drei Teilen. Jeder ist eine Gruppe von Routen im Vertrag der Space-API.',
      items: [
        { name: 'Erfassung', text: 'Ein Käufer oder ein Anbieter beschreibt einen Bedarf oder ein Angebot, per Formular oder in eigenen Worten, prüft jeden Wert und bestätigt. Vor der Bestätigung wird nichts gespeichert, und der Server prüft jeden Wert gegen das Pack des Space.' },
        { name: 'Beobachten', text: `Eine Beobachtung hält einen bestätigten Bedarf oder ein Angebot offen und sagt nur dem Eigentümer Bescheid, wenn etwas Neues passt, per E-Mail oder Webhook. Der Eigentümer pausiert oder beendet sie jederzeit, auch über einen Link. Stand ${AS_OF}: Die Beobachtungs-E-Mails des Staging-Space gehen an ein Testpostfach und erreichen niemanden, und Webhooks sendet er noch nicht.` },
        { name: 'Vorstellungen', text: 'Sobald beide Seiten Ja gesagt haben und ein namentlich genannter Operator freigegeben hat, stellt der Server die beiden Seiten einander vor und gibt jeder eine Quittung, wer welche Felder sehen darf. Danach werden beide Seiten nach dem Ergebnis gefragt.' },
      ],
    },
    rule: {
      title: 'Keine Vorstellung ohne das Ja beider Seiten',
      paras: [
        'Das Matching findet mögliche Treffer; es stellt niemanden vor. Jede Seite beantwortet einen möglichen Treffer für sich. Bevor beide Ja gesagt haben, erfährt die andere Seite nichts, und ein späteres Nein widerruft ein Ja.',
        'Der Space verlangt außerdem die Freigabe eines namentlich genannten Operators nach den Prüfungen, die er festlegt. Der Server legt eine Vorstellung erst an, wenn alle drei vorliegen, in beliebiger Reihenfolge, und lehnt jeden anderen Weg ab.',
      ],
    },
    path: { title: 'Der Weg in sechs Schritten', lede: 'Die sechs Schritte der Demo-Seite, und wer bei jedem handelt.', link: 'Die Demo-Seite' },
    space: {
      title: 'Ein Space ist ein Markt auf einer Plattform',
      paras: [
        'Jeder Space ist eine eigene Instanz: eigene Anwendung, Datenbank, Schlüssel und eigenes Löschprotokoll. Die Adresse der Instanz bezeichnet den Space; in keinem Pfad steht eine Space-ID.',
        'Ein Space wird eingerichtet mit einem Pack und einer Version davon, den Sprachen, die er anbietet, dem Modus seiner Vorstellungen, den Gates, die er verlangt, und den Origins, auf denen seine Seiten erlaubt sind. Die Seite der Plattform hält den Publishable Key, der nur den Space bezeichnet und nur auf diesen Origins gilt. Der Secret Key bleibt auf dem Server der Plattform und steht nie in einer Seite.',
        'Das Matching läuft innerhalb eines Space. Nichts verlässt ihn: Keine Anfrage, kein Angebot und keine Passung wird mit einem anderen Space geteilt.',
        'Der erste Space ist der von Geoprocure, für Industrieminerale. Er läuft auf einer synthetischen Staging-Instanz mit synthetischen Daten.',
      ],
    },
    pack: {
      title: 'Ein Pack ist das Vokabular einer Branche',
      paras: [
        'Ein Pack listet die Kriterien, die eine Anfrage und ein Angebot angeben können, jedes mit seinem Eingabeelement: eine Auswahl, mehrere, eine Zahl mit Einheit, ein Bereich, ein Zeitfenster, eine durchsuchbare Liste wie Häfen oder freier Text. Wo eine Menge von einer Basis abhängt, sagt das Pack es, und „Weiß nicht“ lässt die Basis unbekannt, statt eine zu wählen.',
        'Das Pack sagt, welche besonderen Antworten ein Kriterium erlaubt: „Anderes / nicht aufgeführt“, das die Worte der Person behält und nie auf eine Option abgebildet wird; „Weiß nicht“; und „Beliebig“. Es trägt die Beschriftungen, Fragen, Synonyme und Hinweise in den Sprachen des Space.',
        'Es legt auch fest, was jedes Kriterium auf welcher Stufe preisgibt: auf dem Board, in einer möglichen Passung, in einer Vorstellung oder nur gegenüber dem Team der Plattform; wie ein Wert für das Board vergröbert wird; welche Gewichtungen ein Kriterium erlaubt; und die Gates und die Ergebniskategorien des Marktes.',
        'Ein Space pinnt eine Version seines Packs, und der Server prüft jede Einreichung gegen diese Version. Dem Client wird nie vertraut.',
      ],
    },
    describe: {
      title: 'Vier Wege zu sagen, was Sie brauchen oder anbieten',
      lede: `Stand ${AS_OF}: Formular, Text, Board und Beobachtungen laufen auf dem Staging-Space. Webhooks laufen dort noch nicht, und seine E-Mails gehen an ein Testpostfach, das niemanden erreicht.`,
      items: [
        { name: 'Per Formular', status: 'now' as Status, paras: [
          'Das Formular wird aus dem Pack erzeugt. Pflichtkriterien kommen zuerst; der Rest steht hinter „Mehr Details“. Nichts ist vorausgewählt: keine Option, keine Einheit, keine Basis, keine Art der Partei. Jede Liste bietet „Anderes / nicht aufgeführt“, „Weiß nicht“ und „Beliebig“, wo das Pack sie erlaubt.',
          'Jedes Kriterium trägt eine Gewichtung. Muss und Nie sind hart; Wünschenswert, Offen dafür und Lieber nicht sind weich. Das Pack kann eine vorschlagen, markiert als Vorschlag, und die Person kann sie ändern, sofern das Pack sie nicht festlegt. Wer Nie wählt, bestätigt das eigens.',
        ] },
        { name: 'In eigenen Worten', status: 'now' as Status, paras: [
          'Eine Person schreibt, was sie braucht oder anbietet. Eine Lesung schlägt Werte für dieselben Kriterien vor, jeden neben den Worten, aus denen er stammt, und fragt nach, wo sie nicht entscheiden kann: eine Einheit, eine Option, eine Zahl, die zwei Schreibweisen verschieden lesen. Eine Lesung überschreibt nie, was eine Person gewählt hat; ein Unterschied wird zur Frage.',
          'Auf dem Staging-Space lesen feste Regeln den Text, ohne Modell; ein Leser mit Modell wartet auf eine freigegebene Richtlinie für das Lesen. Was auch immer den Text liest: Harte Bedingungen bleiben bei deterministischem Code, kein Modell überstimmt ein Muss oder ein Nie.',
        ] },
        { name: 'Auf dem Board', status: 'now' as Status, paras: [
          'Das Board listet Anfragen und Angebote, deren Besitzer zugestimmt haben, nie von selbst. Es zeigt nur die Felder, die das Pack auf der Board-Stufe erlaubt, vergröbert, wie das Pack es festlegt, und nie, wer eingestellt hat. Wer einen Eintrag beantwortet, beginnt einen Entwurf auf der anderen Seite, im selben Formular.',
        ] },
        { name: 'Mit einer Beobachtung', status: 'now' as Status, paras: [
          'Eine Beobachtung hält eine Anfrage oder ein Angebot offen und sagt der Person Bescheid, die sie angelegt hat, wenn etwas Neues passt: per E-Mail oder, für die Plattform, per Webhook. Sie benachrichtigt nur diese Person und gibt nie mehr preis als das Board. Man kann sie pausieren, fortsetzen oder beenden, auch über den Link in einer Nachricht.',
        ] },
      ],
    },
    confirm: {
      title: 'Bestätigen ist das Erste, was gespeichert wird',
      paras: [
        'Bevor eine Person bestätigt, wird nichts Persönliches gespeichert: Beschreiben, Antworten und Prüfen hinterlassen nichts. Das Widget sagt es über dem Bestätigen-Knopf: Bis zur Bestätigung wird nichts verwendet. Ein Entwurf lebt im Browser-Tab und ist weg, wenn der Tab schließt.',
        'Der Bestätigungsschritt ist das Formular. Der Server prüft jeden Wert gegen das gepinnte Pack und benennt jedes Feld, das nicht besteht. Gespeichert werden: die Kriterien mit ihren Werten, Quellen und Gewichtungen; die Partei, eine Person oder eine Organisation mit optionalem Anzeigenamen; und, falls angegeben, eine E-Mail-Adresse, die die Person über einen Link bestätigt.',
        'Der Browser, der bestätigt hat, verwaltet, was er angelegt hat: Er zeigt „Meine“, beantwortet mögliche Passungen und ändert die Beobachtung, sechzig Tage ab der letzten Nutzung und nur in diesem Tab. Ein neuer Browser erhält den Zugang über einen Link an die bestätigte Adresse zurück.',
        'Auf einem Space mit einer Prüfung der Partei, wie dem von Geoprocure, zeigt der Bestätigungsschritt den eigenen Hinweis des Space. Die Freigabe ihrer Identität für diese Prüfung setzt die Person selbst; nichts ist vorab gesetzt, und ein Bestätigen ohne sie wird abgelehnt.',
      ],
    },
    matching: {
      title: 'Matching: ein Urteil pro Kriterium, nie ein Score',
      paras: [
        'Das Matching läuft mit deterministischen Regeln auf den gespeicherten Werten: nach einem Bestätigen, nach einer Änderung und einmal am Tag. Es vergleicht die Anforderungen der Anfrage mit den Tatsachen, die das Angebot angibt.',
        'Für jedes Kriterium, das das Pack vergleichen lässt, zeigt eine Passung ein Urteil: passt, passt teilweise, widerspricht oder unbekannt, mit der Regel, die entschieden hat, und den gespeicherten Werten, die sie anführt. Eine eingehaltene Grenze passt, eine überschnittene passt teilweise, eine verfehlte widerspricht. „Beliebig“ auf Seiten der Anfrage passt. „Weiß nicht“ oder „Andere“ auf einer der beiden Seiten ist unbekannt, und unbekannt ist nie eine Passung.',
        'Ob ein Paar überhaupt passen kann, folgt allein aus den harten Bedingungen, Muss und Nie. Nichts sonst ändert, was die andere Seite sieht. Es gibt keinen Score.',
        'Eine mögliche Passung gibt von sich aus nichts preis: nur die Urteile zu Feldern, die das Pack auf der Matching-Stufe erlaubt, und einen festen Hinweis, dass Menschen entscheiden. Hatte eine Anfrage oder ein Angebot in kurzer Zeit viele neue Passungen, hält der Space die übrigen zurück, und ein späterer Lauf schlägt sie vor.',
      ],
    },
    approval: {
      title: 'Freigabe und Gates: eine benannte Person, nie das System',
      paras: [
        'Jeden Fall gibt ein benannter, aktiver Operator der Plattform frei. Davor muss jedes Gate, das der Space verlangt, von einem benannten Operator als bestanden eingetragen sein. Ein Gate entscheidet nie das System: Der Operator trägt eine anderswo erledigte Prüfung ein, mit einer Referenz und ohne personenbezogene Daten.',
        'Das Pflicht-Gate von Geoprocure ist eine KYC- und Sanktionsprüfung. Es kann nicht erlassen werden. Ein Operator kann es an die Rechtsberatung verweisen, dann bleibt es offen. Der jeweils letzte Eintrag zu einem Gate entscheidet.',
        'Eine Freigabe allein gibt nichts preis. Ein abgelehnter Fall wird als abgelehnt festgehalten; der Grund bleibt im Audit-Log.',
      ],
    },
    yes: {
      title: 'Beide Seiten sagen Ja, jede für sich',
      paras: [
        'Jede Seite beantwortet eine mögliche Passung für ihre eigene Seite: Ja, Nein oder Jetzt nicht. Bevor beide Ja gesagt haben, erfährt die andere Seite nichts von der Antwort. Die letzte Antwort zählt, ein späteres Nein nimmt ein Ja zurück.',
        'Der Server legt die Vorstellung selbst an, in dem Moment, in dem die letzte der drei Bedingungen erfüllt ist, in beliebiger Reihenfolge: Gates bestanden, Fall freigegeben, beide Seiten Ja. Jeden anderen Weg verweigert er.',
      ],
    },
    introduction: {
      title: 'Die Vorstellung, im Modus, den der Space gewählt hat',
      paras: [
        'Im Operator-Modus, der Voreinstellung bei Geoprocure, gehen die Felder der Vorstellungsstufe nur an das Team der Plattform: Anzeigenamen, die bestätigten E-Mail-Adressen, die Kriterien, die das Pack für diese Stufe vorsieht. Jede Seite erhält eine Quittung, die sagt, dass beide Seiten zugestimmt haben und die Plattform sich meldet, und die nichts von der anderen Seite enthält.',
        'Im Direkt-Modus sieht jede Seite die Felder der anderen Seite auf der Vorstellungsstufe. Das Team der Plattform sieht beide. Ein Feld, das das Pack dem Operator vorbehält, erreicht die andere Seite nie.',
        'Eine Quittung hält fest, wer welche Felder sehen darf, und jedes Lesen einer Vorstellung wird auf ihr vermerkt. Was nicht in der Quittung steht, wird später nie offengelegt.',
      ],
    },
    after: {
      title: 'Danach: Ergebnisse, Änderungen, Löschung',
      paras: [
        'Beide Seiten werden nach dreißig, sechzig und neunzig Tagen nach dem Ergebnis gefragt; das Team der Plattform kann es ebenfalls eintragen. Die Kategorien kommen aus den Einstellungen des Space.',
        'Eine Person kann eine bestätigte Anfrage oder ein Angebot über dasselbe Formular ändern, pausieren, fortsetzen oder schließen. Jede Änderung lässt das Matching neu laufen.',
        'Eine Person kann aus dem Browser, der bestätigt hat, die Löschung ihrer Daten verlangen; eine bestätigte E-Mail-Adresse muss den Antrag über einen Link bestätigen. Die Plattform kann im Auftrag einer Person löschen, mit einer Referenz. Was geht: der Anzeigename, die Adressen, jedes Kriterium und jede Zustimmung, die Urteile ihrer Passungen, ihre Token und ihre Mails. Was bleibt: IDs, Feldnamen, Zeiten und Zustände, damit Quittungen und Audit-Log stimmig bleiben. Jede Löschung wird in das Löschprotokoll der Instanz geschrieben, und niemand behauptet, Kopien zurückzuholen, die die Instanz verlassen haben.',
      ],
    },
    sees: {
      title: 'Wer sieht was, Stufe für Stufe',
      lede: 'Das Pack gibt jedem Kriterium eine Stufe. Eine Stufe ist das Weiteste, was ein Wert reist: Eine Passung zeigt nicht mehr, als ihre Stufe erlaubt, und eine Beobachtung gibt nie mehr preis als das Board.',
      stages: [
        { name: 'Board', who: 'Alle, die das Board sehen können', what: 'Nur Felder der Board-Stufe, vergröbert, wie das Pack es festlegt, nur für Anfragen und Angebote mit Zustimmung ihrer Besitzer. Nie, wer eingestellt hat.' },
        { name: 'Passung', who: 'Die beiden Seiten einer möglichen Passung', what: 'Urteile zu Feldern der Matching-Stufe oder darunter, mit der Regel und den Werten, die sie anführt. Kein Name, keine Kontaktdaten, kein Hinweis auf die Antwort der anderen Seite.' },
        { name: 'Vorstellung', who: 'Im Operator-Modus das Team der Plattform; im Direkt-Modus beide Seiten', what: 'Anzeigename, bestätigte E-Mail-Adresse und die Kriterien, die das Pack für diese Stufe vorsieht. Jedes Lesen wird auf der Quittung vermerkt.' },
        { name: 'Operator', who: 'Nur das Team der Plattform', what: 'Felder, die das Pack der Plattform vorbehält, etwa die Identitätsangaben für eine KYC-Prüfung. Sie erreichen die andere Seite nie, und jeder Zugriff wird festgehalten.' },
      ],
    },
    languages: {
      title: 'Fünf Sprachen, und keine Übersetzung Ihrer Worte',
      paras: [
        'Das Widget läuft auf Englisch, Deutsch, Spanisch, Italienisch und Französisch. Die Seite setzt die Sprache, dann der Browser der Besucherin oder des Besuchers, dann die Voreinstellung des Space; eine Sprache, die der Space nicht anbietet, fällt zurück, und das Widget sagt es auf dem Bildschirm.',
        'Die Space-API antwortet in der gewünschten Sprache oder in der Voreinstellung des Space und sagt, in welcher. Beschriftungen, Fragen, Erklärungen und Hinweise kommen in dieser Sprache.',
        'Der eigene Text einer Person wird nie übersetzt. Die Sprache des Formulars und die Sprache der Worte sind unabhängig voneinander.',
      ],
    },
    today: {
      title: 'Was auf dem Staging-Space läuft, und was noch nicht',
      lede: `Geprüft am ${AS_OF} anhand des Statusberichts des Staging-Space und des Plans von Connect: welche Teile dort laufen, mit denselben Quadraten, die das Produkt für Belege nutzt.`,
    },
  },

  platforms: {
    title: 'Integrationen: ein Linkbot-Space auf Ihren eigenen Seiten',
    description: 'Ein Linkbot-Space auf Ihren Seiten: ein Skript und ein Element, ein Publishable Key, Ihr Datenhinweis, eine Konsole für Ihr Team, Webhooks für Ihren Server.',
    eyebrow: 'Integrationen',
    h1: ['Ein Space', 'auf Ihren eigenen Seiten.'],
    lede: 'Ein Skript und ein Element zeigen das Widget auf Ihrer Seite, in Ihren Schriften und Farben. Ihr Team gibt Fälle in einer Konsole auf Ihrem Rechner oder hinter Ihrem eigenen Login frei. Ihr Server erfährt von Ereignissen über signierte Webhooks.',
    toc: [['pages', 'Jede Integration'], ['embed', 'Das Embed'], ['keys', 'Schlüssel und Origins'], ['console', 'Die Konsole'], ['server', 'SDK und Webhooks'], ['recipes', 'Rezepte'], ['state', 'Wo es steht']] as [string, string][],
    embed: {
      title: 'Das Embed: ein Skript, ein Element',
      paras: [
        'Das Skript kommt von der eigenen Instanz Ihres Space. Das Element trägt Ihren Publishable Key, den Modus (Beschreiben, Board oder Meine), die Seite (eine Anfrage oder ein Angebot) und die Sprache. Mehrere Elemente auf einer Seite sind mehrere Widgets.',
        'Das Widget rendert in einem Shadow Root, übernimmt Schrift und Textfarbe Ihrer Seite und setzt alles andere über CSS-Variablen auf dem Element. Unter einer Content Security Policy braucht es kein „unsafe-inline“.',
        'Ihr eigener Datenhinweis steht im Element und erscheint über dem Bestätigen-Knopf, neben den festen Zeilen des Widgets. Das Widget setzt keine Cookies, hält Entwurf und Token im Browser-Tab und sendet nichts an jemand anderen als Ihren Space.',
      ],
    },
    keys: {
      title: 'Schlüssel und Origins',
      paras: [
        'Ein Publishable Key bezeichnet Ihren Space und gilt nur auf den Origins, die Ihr Space erlaubt; er gehört in die Seite. Ein Secret Key gehört auf Ihren Server; das Widget verweigert den Start mit einem solchen und sagt Ihnen, ihn zu rotieren.',
        'Die erlaubten Origins werden beim Einrichten eines Space gesetzt. Seit Vertrag 0.2.9 kann die Space-API sie ändern, und damit auch die Konsole.',
      ],
    },
    console: {
      title: 'Die Konsole für Ihr Team',
      paras: [
        'Die Konsole zeigt die Freigabe-Warteschlange, jeden Fall mit seinen Gates und seiner Freigabe, die Vorstellungen mit ihren Quittungen, die Ergebnisse, die Webhook-Endpunkte und die Operatoren. Sie läuft auf einem Rechner von Ihnen oder hinter Ihrem eigenen Login; der Secret Key bleibt auf ihrem Server. Es gibt kein Linkbot-Login für Operatoren.',
        'Ihre Ansichten für Einstellungen und Kriterien-Anpassungen, Schlüssel, Origins und Funnel nutzen die Routen, die die Space-API seit Vertrag 0.2.9 hat.',
      ],
    },
    server: {
      title: 'Ihr Server: das SDK und Webhooks',
      paras: [
        `Das SDK gibt Ihrem Server einen Client, der durch den Vertrag der Space-API typisiert ist: Eine Route, ein Feld oder ein Wert, den der Vertrag nicht hat, ist ein Typfehler. Es prüft auch Webhook-Zustellungen genau so, wie der Vertrag es vorgibt. Stand ${AS_OF} ist es nicht veröffentlicht; sein Code liegt im Connect-Repository.`,
        `Webhooks tragen IDs und Zustände, nie Kontaktdaten; Ihr Server holt Details mit seinem Secret Key. Zustellungen sind signiert und werden wiederholt. Sie stehen im Vertrag; Stand ${AS_OF} sendet der Staging-Space sie nicht.`,
      ],
    },
    recipes: {
      title: 'Rezepte: reines HTML, Astro, Next.js, WordPress',
      paras: [
        'Jedes Rezept ist eine Datei, die in der CI von Connect in drei Browser-Engines gegen den Beispiel-Build mit synthetischen Daten läuft: eine einfache Seite mit strenger Content Security Policy, eine Astro-Komponente, eine Next.js-Seite mit dem React-Wrapper und ein kleines WordPress-Plugin mit einem Shortcode.',
        `Stand ${AS_OF} laufen sie in der CI von Connect gegen den Beispiel-Build, nicht gegen einen Space; die Staging-Instanz selbst liefert das Release 0.3.0-v1 des Widgets aus.`,
      ],
    },
    state: { title: 'Wo es steht' },
  },

  forPlatforms: {
    title: 'Für Plattformen: was ein Betreiber mit einem Linkbot-Space bekommt',
    description: 'Für Betreiber, die einen Space für ihren Markt wollen: die vier Wege hinein, was eine Plattform bekommt und was ihr bleibt: ihre Daten und ihre Entscheidung.',
    eyebrow: 'Für Plattformen',
    h1: ['Ihr Markt, Ihre Seiten,', 'Ihre Entscheidung.'],
    lede: 'Für einen Betreiber, der einen Space für seinen eigenen Markt will: wie ein Space Ihre Nutzer erreicht, was Sie bekommen und was Ihnen bleibt. Diese Seite beschreibt den Vertrag der Space-API und Geoprocures synthetischen Staging-Space. Noch betreibt keine echte Plattform einen Space, und diese Seite nennt keine Preise.',
    toc: [['ways', 'Vier Wege hinein'], ['gets', 'Was Sie bekommen'], ['yours', 'Was Ihnen bleibt'], ['details', 'Die Einzelheiten']] as [string, string][],
    ways: {
      title: 'Vier Wege hinein',
      lede: `Stand ${AS_OF}: Zwei davon laufen auf dem Staging-Space, zwei sind nicht gebaut.`,
      items: [
        { name: 'Gehostete Seiten', status: 'later' as Status, body: 'Eine für Sie bereitgestellte Seite, auf die Sie verlinken, statt einzubetten. Sie ist nicht gebaut. Heute erscheint ein Space nur auf Ihren eigenen Seiten, über die Einbettung oder über Ihren eigenen Server.' },
        { name: 'Die Einbettung', status: 'now' as Status, body: 'Ein Skript und ein Element auf Ihrer Seite. Das Skript kommt von der eigenen Instanz Ihres Space; das Element trägt Ihren Publishable Key, der nur auf den Origins gilt, die Ihr Space erlaubt. Seine Modi: Beschreiben, Board, Beobachten und Meine. Die Staging-Instanz liefert das Widget in der Version 0.3.0-v1 aus.' },
        { name: 'Die API und das SDK', status: 'now' as Status, body: `Ihr Server spricht mit dem Secret Key mit der Space-API, und dieser Schlüssel erscheint nie in einer Seite: Er kann Bedarfe und Angebote anlegen, Prüfungen und Freigaben erfassen und Vorstellungen und Ergebnisse lesen. Das SDK gibt Ihrem Server einen Client, der durch den Vertrag typisiert ist. Stand ${AS_OF} ist das SDK nicht veröffentlicht; sein Code liegt im Connect-Repository.` },
        { name: 'MCP', status: 'later' as Status, body: 'Geplant, nicht gebaut: ein MCP-Server je Space, über den ein KI-Agent einen Bedarf oder ein Angebot vorbereitet und ein Mensch bestätigt und antwortet. Der Eigentümer hat diese Richtung gewählt; ihr Entwurf ist vorgeschlagen, ihr Vertrag ein Gerüst.' },
      ],
    },
    gets: {
      title: 'Was eine Plattform bekommt',
      items: [
        'Einen eigenen Space: eine Instanz für einen Markt, mit eigener Datenbank, eigenen Schlüsseln und eigenem Löschprotokoll.',
        'Ein Pack mit dem Vokabular Ihres Marktes. Das Formular, das Lesen von Text, das Board und die Regeln des Matchings folgen daraus.',
        'Ein Widget, das Schrift und Textfarbe Ihrer Seite übernimmt, mit Ihrem eigenen Datenhinweis über seinem Bestätigen-Knopf.',
        'Matching mit einem Urteil je Kriterium, nie einer Punktzahl, und eine Vorstellung erst nach dem Ja beider Seiten und der Freigabe Ihres Teams.',
        `Eine Konsole für Ihr Team: die Freigabe-Warteschlange, Fälle mit ihren Prüfungen, Vorstellungen mit Quittungen und Ergebnisse. Sie läuft auf Ihrem Rechner oder hinter Ihrem eigenen Login. Stand ${AS_OF} läuft sie auf einem Muster mit synthetischen Daten und ist nicht veröffentlicht.`,
        `Webhooks an Ihren Server, mit IDs und Zuständen, nie mit Kontaktdaten. Sie stehen im Vertrag; Stand ${AS_OF} sendet der Staging-Space sie nicht.`,
      ],
    },
    yours: {
      title: 'Was Ihnen bleibt',
      items: [
        'Ihre Entscheidung. Keine Vorstellung kommt zustande, ohne dass ein namentlich genannter Operator Ihres Teams sie freigibt, nach den Prüfungen, die Ihr Space festlegt. Das System entscheidet nie über eine Prüfung, und jede Seite sagt für sich Ja oder Nein.',
        'Ihre Daten. Bedarfe, Angebote und Treffer eines Space werden mit keinem anderen Space geteilt. Webhooks tragen keine Kontaktdaten; Ihr Server holt Einzelheiten mit seinem Secret Key.',
        'Ihre Seiten. Ihr eigener Datenhinweis, Ihre Schrift und Farben. Das Widget setzt keine Cookies und sendet nichts an jemand anderen als Ihren Space.',
        'Ihr Login. Ihr Team meldet sich über Ihren eigenen Login an; einen Linkbot-Login für Operatoren gibt es nicht.',
      ],
    },
    details: { title: 'Die Einzelheiten', lede: 'Die Integrationsseiten zeigen, wie jeder Teil funktioniert: die Einbettung, Schlüssel und Origins, die Konsole, das SDK und Webhooks, und Rezepte für reines HTML, WordPress, Next.js und Astro.', link: 'Integrationen' },
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
        `Stand ${AS_OF} liefert die Instanz von Geoprocures synthetischem Staging-Space das Widget in der Version 0.3.0-v1 aus.`,
      ],
    },
    sdk: {
      title: 'Das SDK auf Ihrem Server',
      lede: 'Einmal von Ihrem Server aus, mit dem Secret Key: Es registriert Ihren Webhook-Empfänger und gibt das Signaturgeheimnis zurück, das nur dieses eine Mal gezeigt wird.',
      notes: [
        `Das SDK ist Stand ${AS_OF} nicht auf npm. Es wird aus einem Klon des Connect-Repositorys genutzt, wo es ein Paket des Workspace ist.`,
        `Der Test dieses Beispiels läuft gegen einen Stellvertreter, nicht gegen einen Space. Stand ${AS_OF} sendet der Staging-Space keine Webhooks.`,
      ],
    },
    docs: {
      title: 'Die Dokumentation',
      lede: `Im Connect-Repository, auf seinem Build-Branch. Stand ${AS_OF} ist das Repository privat, deshalb stehen hier Pfade, keine Links.`,
      items: {
        embed5: { name: 'Einbetten in 5 Minuten', body: 'Ihr Publishable Key, der Origin Ihrer Seite auf der Freigabeliste, das Snippet und was zu tun ist, wenn das Widget nicht erscheint.' },
        quickstart: { name: 'Developer-Quickstart', body: 'Für Ihre eigene Oberfläche statt des Widgets: Eine Person beschreibt, bestätigt, sieht die Treffer, sagt Ja und findet die Vorstellung, über den Gast-Client des SDK. Er lief bisher nur gegen ein lokales Beispiel mit synthetischen Daten.' },
        nextjs: { name: 'Das Next.js-Beispiel', body: 'Jeder Modus des Widgets, und „mine“ auf dem Server über das SDK gelesen. Es läuft gegen einen lokalen Stellvertreter, nicht gegen einen Space.' },
        astro: { name: 'Das Astro-Beispiel', body: 'Dasselbe in Astro: jeder Modus, und „mine“ auf dem Server über das SDK gelesen. Es läuft gegen einen lokalen Stellvertreter, nicht gegen einen Space.' },
        embedRef: { name: 'Die Embed-Referenz', body: 'Jedes Attribut des Elements, der Datenhinweis, das Theme und eine Content Security Policy.' },
        sdkRef: { name: 'Die SDK-Referenz', body: 'Der Client für Ihren Server mit dem Secret Key, der Gast-Client, Idempotenzschlüssel und das Anlegen von Daten.' },
        webhooks: { name: 'Webhooks', body: 'Einen Empfänger registrieren, die Signatur jeder Zustellung prüfen, Wiederholungen und Rotation. Der Staging-Space sendet sie noch nicht.' },
      },
      more: 'Wie jeder Teil funktioniert, in Kürze:',
      link: 'Integrationen',
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
    title: 'Status: was auf dem Staging-Space läuft, was gebaut ist, was geplant ist',
    description: 'Wo jeder Teil von Linkbot steht, aus dem Truth-Check der Website: auf dem synthetischen Staging-Space, gebaut, aber dort nicht in Betrieb, oder geplant.',
    eyebrow: 'Status',
    h1: ['Wo es steht,', 'Teil für Teil.'],
    lede: `Geprüft am ${AS_OF} anhand des Statusberichts des Staging-Space und des Plans von Connect. Diese Seite wird aus dem Truth-Check der Website gebaut und sagt nichts, was dort nicht steht.`,
    states: {
      staging: { title: 'Läuft auf dem Staging-Space', lead: 'Synthetische Daten, auf Deutsch und Englisch.' },
      built: { title: 'Gebaut oder im Vertrag, nicht auf dem Staging-Space', lead: 'Läuft dort nicht und ist nicht veröffentlicht.' },
      planned: { title: 'Geplant, nicht gebaut', lead: 'Kein Datum versprochen.' },
    },
    items: {
      form: 'Eine Anfrage oder ein Angebot per Formular beschreiben, mit dem Identitätshinweis, wo der Space einen hat',
      text: 'Eine Anfrage oder ein Angebot in eigenen Worten beschreiben, gelesen von festen Regeln ohne Modell',
      board: 'Das Board, mit den vergröberten Werten des Packs und nur mit Einträgen, deren Besitzer zugestimmt haben',
      watches: 'Beobachtungen; ihre E-Mails gehen an ein Testpostfach und erreichen niemanden',
      control: 'Einstellungen, Origins, Schlüssel und Funnel eines Space, über die Space-API',
      confirm: 'Bestätigen; der Browser, der bestätigt hat, verwaltet, was er angelegt hat',
      matching: 'Matching mit einem Urteil pro Kriterium',
      gates: 'Gates und Freigabe durch einen benannten Operator',
      introductions: 'Vorstellungen im Operator-Modus, mit Quittungen',
      outcomes: 'Ergebnisse, Änderungen, Pausieren und Schließen',
      deletion: 'Löschung mit dem Löschprotokoll der Instanz',
      widget: 'Das Widget, von der Instanz selbst aus einem festgelegten Release ausgeliefert (0.3.0-v1)',
      webhooks: 'Webhooks an den Server der Plattform: im Vertrag, und das SDK prüft ihre Signaturen; der Staging-Space sendet sie nicht',
      mail: 'E-Mail, die ein Postfach erreicht; die E-Mails des Staging-Space gehen an ein Testpostfach',
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
  sheet: {
    title: 'Linkbot auf einer Seite',
    description: 'Linkbot auf einer druckbaren Seite, aus den Seiten dieser Website gemacht: die drei Bausteine, das Ja beider Seiten, was eine Plattform bekommt und behält, und wo jeder Teil steht. Datiert, ohne Preise.',
    eyebrow: 'Eine Seite',
    dated: `Stand ${AS_OF}. Beim Bauen der Website aus ihren Seiten erzeugt, sagt also nichts, was dort nicht steht. Es nennt keine Preise.`,
    pdf: 'Als PDF herunterladen',
    site: 'Mehr auf dieser Website',
    link: 'Linkbot auf einer Seite (PDF)',
  },
  verticals: {
    title: 'Für Branchen: ein Pack pro Markt',
    description: 'Ein Pack enthält das Vokabular eines Marktes: Kriterien, Optionen, Einheiten, Preisgabe je Stufe, Gates und Ergebnisse. Der erste Space: Industrieminerale.',
    eyebrow: 'Für Branchen',
    h1: ['Ein Pack', 'pro Markt.'],
    lede: 'Eine Branche kommt als Pack zu Linkbot: die Kriterien ihres Marktes, die Antworten, die sie erlauben, was jedes Kriterium wann preisgibt, und die Gates, die der Markt braucht. Ein Space pinnt das Pack; Formular, Lesung, Board und Matching-Regeln folgen daraus.',
    toc: [['holds', 'Was ein Pack enthält'], ['first', 'Der erste Space'], ['next', 'Weitere Branchen']] as [string, string][],
    holds: {
      title: 'Was ein Pack enthält',
      items: [
        'Kriterien mit ihren Eingabeelementen: eine Auswahl, mehrere, eine Zahl mit Einheit, ein Bereich, ein Zeitfenster, eine durchsuchbare Liste, freier Text',
        'Optionen, Einheiten und Basen, mit den Umrechnungen, die das Pack festlegt; eine Umrechnung läuft nur über die eigene angegebene Basis des Angebots, nie über eine Annahme',
        'Welche besonderen Antworten jedes Kriterium erlaubt: „Anderes / nicht aufgeführt“, „Weiß nicht“, „Beliebig“',
        'Welche Gewichtungen ein Kriterium erlaubt, und die vorgeschlagene',
        'Die Stufe jedes Kriteriums, Board, Passung, Vorstellung oder Operator, und wie ein Wert für das Board vergröbert wird',
        'Beschriftungen, Fragen, Synonyme und Hinweise in den Sprachen des Space',
        'Die Gates des Marktes und die Kategorien eines Ergebnisses',
      ],
    },
    first: {
      title: 'Der erste Space: Industrieminerale',
      paras: [
        'Geoprocure betreibt den ersten Space, für Industrieminerale, auf einer synthetischen Staging-Instanz. Sein Pflicht-Gate ist eine KYC- und Sanktionsprüfung, eingetragen von einem benannten Operator und nie erlassen. Seine Vorstellungen laufen im Operator-Modus: Das Team von Geoprocure bringt beide Seiten zusammen.',
      ],
    },
    next: {
      title: 'Weitere Branchen',
      paras: [
        'Eine Branche braucht ihr Pack und eine Plattform, die den Space betreibt. Ein zweites Pack mit synthetischen Daten ist geplant, damit ein Demo-Space das Widget auf dieser Seite zeigen kann, ohne einen echten Markt.',
      ],
    },
  },

  privacy: {
    title: 'Datenschutzhinweis · Linkbot',
    description: 'Der Datenschutzhinweis dieser Website ist in Vorbereitung. Was schon gilt: keine Cookies, nichts von Dritten, keine Analyse-Dienste.',
    eyebrow: 'Datenschutzhinweis',
    h1: 'In Vorbereitung',
    lede: 'Der Datenschutzhinweis für diese Website wird geschrieben und geprüft. Er erscheint hier, sobald er freigegeben ist. Bis dahin steht hier nichts, weil ein Rechtstext nicht geraten werden darf.',
    facts: {
      title: 'Was für diese Seite schon gilt',
      items: [
        'Sie setzt keine Cookies und nutzt keine Analyse- oder Tracking-Dienste.',
        'Sie lädt nichts von Dritten: Schriften und Bilder kommen von dieser Seite.',
        'Sie hat kein Formular und kein Konto. Nichts, was Sie tippen, erreicht jemanden.',
        'Das Produkt läuft auf den eigenen Seiten einer Plattform, unter deren Datenhinweis, neben den festen Zeilen des Widgets.',
      ],
    },
  },

  imprint: {
    title: 'Impressum · Linkbot',
    description: 'Das Impressum der Linkbot-Website: Anbieter- und Kontaktangaben. Der Text ist in Vorbereitung.',
    eyebrow: 'Impressum',
    h1: 'In Vorbereitung',
    lede: 'Das Impressum (Anbieter, Anschrift, Vertretung, Register- und Steuerangaben, Kontakt) wird vorbereitet und erscheint hier, sobald es bestätigt ist. Bis dahin steht hier nichts, weil nichts davon erfunden werden darf.',
  },

  notFound: {
    title: 'Seite nicht gefunden · Linkbot',
    description: 'Diese Seite gibt es nicht. Zur Startseite, oder die Seite in einer anderen Sprache lesen.',
    eyebrow: 'Seite nicht gefunden',
    h1: 'Hier ist nichts.',
    lede: 'Die Seite ist vielleicht umgezogen.',
    home: 'Zur Startseite',
    languages: 'Diese Seite in anderen Sprachen',
  },

  integrations: {
    eyebrow: 'Für Plattformen',
    hub: 'Jede Integration auf ihrer eigenen Seite',
    state: 'Wo es steht',
    pages: {
      embed: {
        nav: 'Das Embed',
        title: 'Das Embed: ein Skript, ein Element · Linkbot für Plattformen',
        description: 'Was eine Seite am Embed setzt: Attribute, Datenhinweis, Theme-Variablen, Content Security Policy, und was das Widget behält und sendet.',
        h1: ['Ein Skript,', 'ein Element.'],
        lede: 'Das Widget ist ein Skript und ein Element pro Stelle, an der es erscheint. Ihre Seite setzt seinen Schlüssel, seinen Modus, seine Seite und seine Sprache; alles andere kommt aus Ihrem Space.',
        sections: [
          { id: 'element', title: 'Das Element', paras: [
            'Laden Sie das Skript einmal pro Seite, mit async, damit Ihre Seite rendert, ohne darauf zu warten. Setzen Sie das Element dorthin, wo das Formular erscheinen soll. Mehrere Elemente auf einer Seite sind mehrere Widgets, und Elemente, die später hinzukommen, wie in Single-Page-Anwendungen, starten von selbst.',
            'Einen Wert, den das Widget nicht kennt, ersetzt es durch die Voreinstellung, mit einer Warnung in der Browser-Konsole. Eine Sprache, die der Space nicht anbietet, fällt ebenfalls zurück, und das Widget sagt es auf dem Bildschirm.',
          ], code: true, columns: ['Attribut', 'Werte', 'Voreinstellung'], rows: [
            { name: 'data-linkbot', what: 'Ihr Publishable Key. Mit einem Secret Key verweigert das Widget den Start und sagt Ihnen, ihn zu rotieren', more: 'Pflicht' },
            { name: 'data-mode', what: 'describe (sagen, was Sie brauchen oder anbieten), board (Einträge durchsehen und beantworten), mine (meine Anfragen, Beobachtungen und möglichen Passungen)', more: 'describe' },
            { name: 'data-side', what: 'seeking (eine Anfrage) oder offer (ein Angebot)', more: 'seeking' },
            { name: 'data-locale', what: 'en, de, es, it oder fr', more: 'die Browser-Sprache der Besucherin oder des Besuchers, dann die Voreinstellung des Space' },
            { name: 'data-input', what: 'form, text oder both; es kann nur einschränken, was der Space erlaubt', more: 'die Einstellung des Space' },
            { name: 'data-api', what: 'die API-Basis Ihres Space, nur https (http nur auf localhost)', more: 'der Origin, von dem das Skript geladen wurde' },
          ] },
          { id: 'notice', title: 'Ihr Datenhinweis', paras: ['Ein Kind-Element mit slot="notice" erscheint direkt über dem Bestätigen-Knopf, gestaltet vom CSS Ihrer Seite. Das Widget setzt seine eigenen festen Zeilen daneben, etwa die, dass bis zur Bestätigung nichts verwendet wird. Was Sie dort schreiben, kommt aus Ihren eigenen Datenschutztexten.'] },
          { id: 'design', title: 'Gestaltung', paras: [
            'Das Widget übernimmt Schrift und Textfarbe Ihrer Seite. Alles andere setzen CSS-Variablen auf dem Element: die Akzentfarbe für den Hauptknopf, gewählte Optionen und Fokusringe, ihr Hover, der Eckenradius, Text und Nebentext, Überschriften und ihre Schrift, die Schrift der Feldbeschriftungen, Kartenränder und Trennlinien, Feldränder, Karten- und Flächenhintergründe sowie Fehlerfarbe und -hintergrund.',
            'Für die Akzentfarbe wählt das Widget schwarzen oder weißen Text, je nachdem, was stärker kontrastiert. Ist Ihre Seite dunkel, setzen Sie color-scheme: dark auf dem Element. Die übrigen Stile Ihrer Seite reichen nicht in das Widget, das in einem Shadow Root rendert, und die Stile des Widgets reichen nicht in Ihre Seite.',
          ] },
          { id: 'csp', title: 'Content Security Policy', paras: [
            'Erlauben Sie den Origin des Skripts in script-src und den Origin der Space-API in connect-src, dazu den des Skripts, falls er sich unterscheidet: Das Widget lädt eine andere Sprache als Englisch von neben sich und prüft sie gegen eine im Skript hinterlegte sha256-Summe.',
            'Stile brauchen kein „unsafe-inline“: Das Widget nutzt ein konstruierbares Stylesheet. In Browsern ohne eines fügt es ein einziges style-Element hinzu, das die Nonce seines eigenen Script-Tags trägt; setzen Sie Ihre Nonce also auf das Script-Tag, wenn Ihre Richtlinie Nonces nutzt. Hosten Sie das Skript selbst, kopieren Sie den Ordner locales mit.',
          ] },
          { id: 'global', title: 'Das Global der Seite', paras: ['Das Skript definiert ein einziges Global, window.Linkbot, und sonst nichts: die Version des Embeds, ob es der Beispiel-Build ist, und mount und unmount für ein Element, das der Scan nicht sieht, etwa in Ihrem eigenen Shadow Root.'] },
          { id: 'keeps', title: 'Was das Widget behält und was es sendet', paras: [
            'Sein Gast-Sitzungs-Token und sein Besitzer-Token liegen in sessionStorage, pro Tab und pro Space. Es nutzt keine Cookies und kein localStorage. Anfragen gehen nur an die Space-API, ohne Zugangsdaten. Es gibt keine Analyse-Dienste. Der Beispiel-Build sendet nichts über das Netz.',
            'sessionStorage gehört dem Origin Ihrer Seite, also kann jedes Skript, das Sie auf dieser Seite ausführen, den Entwurf und die Token lesen. Führen Sie auf Seiten mit dem Widget keine Skripte aus, denen Sie nicht vertrauen.',
          ] },
        ] as Section[],
        state: [`Das Skript kommt von der eigenen Instanz Ihres Space. Stand ${AS_OF} liefert die Staging-Instanz das Release 0.3.0-v1 des Widgets aus einer festgelegten Datei aus, wie ihr Statusbericht zeigt; die Prüfungen von Connect für das Board und für die Formulierungen des Widgets bestanden am 24.10.2026 gegen diese ausgelieferte Datei.`],
      },
      sdk: {
        nav: 'SDK und Webhooks',
        title: 'Das SDK, der React-Wrapper und Webhooks · Linkbot für Plattformen',
        description: 'Ein Server-Client, typisiert durch den Vertrag der Space-API, die Webhook-Prüfung, der React-Wrapper, und wie Ihr Server Linkbots Ereignisse erhält.',
        h1: ['Ihr Server,', 'typisiert durch den Vertrag.'],
        lede: `Nichts vom SDK gehört in eine Browser-Seite: Das Embed nimmt den Publishable Key, und der Client des SDK verweigert den Start in einem Browser. Stand ${AS_OF} ist es nicht veröffentlicht; sein Code liegt im Connect-Repository.`,
        sections: [
          { id: 'client', title: 'Der Client', paras: [
            'Der Client nimmt die API-Basis Ihres Space (nur https, außer auf localhost), Ihren Secret Key aus dem geheimen Speicher Ihres Servers (ein Wert, der nicht wie ein Secret Key geformt ist, wird abgelehnt) und auf Wunsch das fetch Ihrer Laufzeit. Seine Pfade, Parameter, Rümpfe und Antworten sind die des Vertrags, erzeugt aus dem YAML, das Core veröffentlicht hat, und per sha256 gepinnt: Eine Route, ein Feld oder ein Wert, den der Vertrag nicht hat, ist ein Typfehler.',
            'Ein frischer Idempotenz-Schlüssel ist einen Aufruf entfernt. Schreibzugriffe, die der Vertrag so markiert, brauchen einen; bewahren Sie den Schlüssel beim Schreibzugriff auf und senden Sie denselben beim Wiederholen, damit der Space den Zugriff einmal ausführt.',
          ] },
          { id: 'seeding', title: 'Das eigene Angebot Ihrer Plattform anlegen', paras: ['Ihr Server legt ein Angebot auf dem Operator-Weg an, und ein zweiter Operator bestätigt es: vier Augen. Auf einem Space, der jede Partei prüft, wie dem von Geoprocure, zählt das Anlegen des Angebots Ihrer eigenen Organisation als Bestätigen, trägt also die Freigabe der Identität, die der Hinweis des Space verlangt, und der Space lehnt es ohne sie ab. Das gilt nur für Ihre eigene Organisation; die Freigabe anderer geben diese selbst, im Widget.'] },
          { id: 'webhooks', title: 'Webhooks', paras: [
            'Registrieren Sie einen Endpunkt mit Ihrem Secret Key, nur https. Das Signaturgeheimnis wird einmal gezeigt und gehört in Ihren geheimen Speicher, nie in Code. Jede Zustellung trägt eine ID, einen Zeitstempel in Sekunden und eine Signatur: HMAC-SHA256 über den Zeitstempel, einen Punkt und den rohen Rumpf, mit Ihrem Geheimnis als Schlüssel.',
            'Lehnen Sie eine Zustellung ab, die älter als fünf Minuten ist oder deren Signatur nicht passt. Die Prüfung des SDK tut beides, mit Vergleich in konstanter Zeit über Web Crypto, in Node, Deno, Bun und Edge-Laufzeiten. Prüfen Sie den rohen Rumpf, bevor Sie ihn parsen. Antworten Sie schnell mit 2xx: Alles andere wird mit wachsenden Abständen 24 Stunden lang wiederholt, danach gilt die Zustellung als tot. Eine Wiederholung trägt dieselbe ID; behandeln Sie jede ID einmal, mit den IDs in Ihrer Datenbank statt im Speicher.',
            `Rotieren Sie das Geheimnis bei Bedarf: Das alte bleibt bis zu sieben Tage gültig, und die Prüfung nimmt beide. Zustellungen tragen IDs und Zustände, nie Kontaktdaten; Details holen Sie mit Ihrem Secret Key. Das Zustellprotokoll zeigt Status, Versuche und eine Prüfsumme des Rumpfs, nie den Rumpf. Webhooks stehen im Vertrag; Stand ${AS_OF} sendet der Staging-Space sie nicht.`,
          ] },
          { id: 'events', title: 'Ereignistypen', paras: ['Jedes Ereignis hat eine ID, einen Typ, die Space-ID, den Zeitpunkt, die Vertragsversion und das Objekt, um das es geht, mit dessen Typ, ID und Zustand, wo es einen gibt. Die Typen:'], code: true, items: ['intent.confirmed', 'intent.revised', 'intent.status_changed', 'match.proposed', 'match.updated', 'gate.recorded', 'approval.recorded', 'answer.recorded', 'clarification.requested', 'review.recorded', 'introduction.created', 'outcome.recorded', 'watch.delivered', 'channel.verified', 'deletion.completed', 'key.rotated'] },
          { id: 'react', title: 'Der React-Wrapper', paras: [
            'Der Wrapper rendert dasselbe Element wie das Snippet und lädt das Skript einmal pro Adresse; das Embed startet dann in seinem eigenen Shadow Root, den React nie anfasst. Er ist eine Client-Komponente, funktioniert also im App Router von Next.js, und fügt kein globales CSS hinzu.',
            `Seine Props sind die Attribute des Elements: Publishable Key und Skriptadresse sind Pflicht (ein Secret Key wirft einen Fehler), dazu mode, side, locale, input, api, Ihr Hinweis, ein Klassenname und ein style für die Theme-Variablen. Ändert sich ein Prop, das das Embed liest, gibt der Wrapper React ein neues Element, und das Embed startet neu. Eine Seite, die das Skript laden will, bevor sie ein Element rendert, kann auch das verlangen. Stand ${AS_OF} nicht veröffentlicht.`,
          ] },
        ] as Section[],
        state: [`SDK und Wrapper sind im Connect-Repository gebaut und getestet und Stand ${AS_OF} nicht veröffentlicht. Der Empfänger aus der Webhook-Anleitung ist gegen signierte Beispiel-Zustellungen getestet; der Staging-Space sendet keine Webhooks.`],
      },
      console: {
        nav: 'Die Konsole',
        title: 'Die Konsole für Ihr Team · Linkbot für Plattformen',
        description: 'Freigabe-Warteschlange, Fälle mit Gates und Freigabe, Vorstellungen mit Quittungen, Webhooks und Operatoren, auf Ihrem Rechner oder hinter Ihrem Login.',
        h1: ['Die Konsole Ihres Teams,', 'hinter Ihrem eigenen Login.'],
        lede: 'Die Konsole ist ein kleiner Server, der einzige Ort, an dem der Secret Key des Space verwendet wird, plus die Seite, auf der Ihr Team arbeitet. Es gibt kein Linkbot-Login für Operatoren: Ihre Plattform meldet ihr Team an. Sie führen die Konsole auf Ihrem eigenen Rechner als lokales Werkzeug aus oder hängen ihren Handler hinter das Login Ihrer Plattform. Sie ist nie eine öffentliche Linkbot-Seite.',
        sections: [
          { id: 'views', title: 'Was sie zeigt', columns: ['Ansicht', 'Was sie zeigt'], rows: [
            { name: 'Freigabe-Warteschlange', what: 'Fälle, die auf Ihr Team warten, ohne Identitäten: die Passung pro Kriterium, die Antworten beider Seiten, fehlende Gates.' },
            { name: 'Fall', what: 'Die Passung pro Kriterium und warum. Ihr Team trägt die Prüfungen des Falls und die Prüfung jeder Partei ein (bestanden, nicht bestanden, verwiesen, und erlassen nur, wo das Gate es erlaubt), die Prüfung einer Partei nebeneinander, damit der Eintrag der einen nie als der der anderen gelesen wird; gibt frei oder lehnt ab, mit optionalem Grund für das Audit-Log; antwortet nur für die eigenen Angebote oder Anfragen Ihrer Plattform, als angemeldeter Operator; bittet eine Seite um Klärung.' },
            { name: 'Vorstellungen', what: 'Gelistet ohne Kontaktdaten. Wer eine öffnet, wird erst gefragt, sieht dann die Kontaktfelder, und das Lesen wird vermerkt. Ein Wert aus einer langen Liste, etwa ein Land oder ein Hafen, erscheint mit Namen und Code. Quittungen und Ergebnisse.' },
            { name: 'Webhooks', what: 'Endpunkt hinzufügen (nur https); das Signaturgeheimnis wird einmal gezeigt; rotieren, das alte Geheimnis bleibt bis zu sieben Tage gültig; entfernen; das Zustellprotokoll.' },
            { name: 'Operatoren', what: 'Das Register: hinzufügen, deaktivieren, reaktivieren.' },
            { name: 'Space und Snippet', what: 'Die Einstellungen, wie die Space-API sie meldet, und das Snippet mit Ihrem Publishable Key und der Skriptadresse Ihrer Instanz.' },
            { name: 'Einrichtung', what: 'Die fünf Schritte, mit dem, was Ihr Space für jeden hat.' },
          ] },
          { id: 'safe', title: 'Wie der Schlüssel geschützt bleibt', items: [
            'Der Schlüssel bleibt auf dem Server. Die Seite holt ihre Einstellungen vom Server, und die Tests prüfen, dass diese Antwort keinen Secret Key enthält.',
            'Kein Proxy: Jede Operation ist mit den Feldern gelistet, die sie senden darf; alles andere wird abgelehnt, ungelistete Felder werden verworfen.',
            'Der Server benennt den Operator aus Ihrer Anmeldung; eine von der Seite gesendete ID wird ignoriert.',
            'Sie antwortet nur für die eigene Seite Ihrer Plattform in einem Fall, ermittelt auf dem Server; die Seite wählt nie eine Seite aus und erhält nie die Intents, die Identitätsfelder enthalten.',
            'Nur die eigene Seite der Konsole kann sie aufrufen: ihr eigener Header, ihr eigener Origin, Same-Origin-Anfragen, JSON-Rümpfe.',
            'Der lokale Modus bindet nur an den lokalen Rechner und antwortet nur auf seinen eigenen Namen, was DNS-Rebinding blockiert.',
            'Eine strenge Seitenrichtlinie: kein Inline-Skript und -Stil, kein Einbetten in Frames, kein Caching.',
          ] },
          { id: 'run', title: 'Sie ausführen', paras: [
            'Mit Beispieldaten: Die Beispiel-Operator-API antwortet aus dem Speicher mit synthetischen Daten, braucht keinen Schlüssel und sendet nichts über das Netz, und jede Seite sagt das in einem Banner. Sie folgt den Regeln des Vertrags, Sie können sie also ausprobieren: ein Gate, das nicht erlassen werden kann, Freigabe erst nach den Pflicht-Gates, eine Vorstellung nur mit jedem Gate, der Freigabe und einem Ja beider Seiten, und eine Lesequittung, wenn Ihr Team die Kontaktdaten öffnet.',
            'Gegen einen Space: die API-Basis, Ihr Secret Key aus Ihrem geheimen Speicher, Ihre ID im Operator-Register des Space und, wenn das Snippet gezeigt werden soll, der Publishable Key. Hinter Ihrem Login: ein Handler; Ihre Sitzung entscheidet, wer handelt, und ohne angemeldeten Operator antwortet er mit 401. Hinter einem Proxy braucht er die öffentliche Adresse, die der Browser verwendet hat.',
            'Dieser Weg lief am 23.10.2026 gegen den synthetischen Staging-Space von Geoprocure: die Warteschlange, ein Fall, beide Arten von Prüfung, die Freigabe, eine Antwort für das eigene Angebot der Plattform und eine Vorstellung mit ihrer Quittung.',
          ] },
          { id: 'notyet', title: 'Noch nicht hier, und warum', items: [
            'Ein neuer Space entsteht mit dem Werkzeug von Core, nicht in der Konsole; der Assistent der Konsole in fünf Schritten schreibt und prüft die Datei, die dieses Werkzeug liest.',
            'Kein „Erneut senden“ für eine Zustellung, bis es echte Zustellungen gibt, an denen man es ausprobieren kann.',
          ] },
        ] as Section[],
        state: ['Die Konsole ist auf dem Vertrag der Space-API gebaut und lief am 23.10.2026 gegen den synthetischen Staging-Space; ihre Tests laufen gegen eine Beispiel-Operator-API mit synthetischen Daten.'],
      },
      wordpress: {
        nav: 'WordPress',
        title: 'WordPress · Linkbot für Plattformen',
        description: 'Ein kleines Plugin ergänzt den Shortcode für jede Redaktion: installieren, an die Stelle des Formulars setzen, Caching-Plugins vom Skript fernhalten.',
        h1: ['Ein Shortcode', 'für jede Redaktion.'],
        lede: 'Das Snippet in einen Custom-HTML-Block zu kleben funktioniert nur für Nutzerinnen und Nutzer, denen WordPress erlaubt, Skripte zu veröffentlichen, und das schließt Redaktionen in Multisite-Netzwerken aus. Das Plugin ergänzt einen Shortcode, der für alle funktioniert, lädt das Skript einmal pro Seite über das Skript-Laden von WordPress selbst und prüft jeden Wert, den es ausgibt.',
        sections: [
          { id: 'install', title: 'Das Plugin installieren', paras: ['Kopieren Sie den Plugin-Ordner in das Plugin-Verzeichnis, oder packen Sie ihn als Zip und laden Sie ihn unter Plugins hoch, dann aktivieren Sie ihn. Das ganze Plugin ist eine Datei.'] },
          { id: 'shortcode', title: 'Der Shortcode', paras: ['Fügen Sie im Block-Editor einen Shortcode-Block ein. Der Text zwischen öffnendem und schließendem Shortcode wird Ihr Datenhinweis, gezeigt über dem Bestätigen-Knopf. Verwenden Sie in jedem Shortcode einer Seite dieselbe Skriptadresse: Das Plugin lädt das Skript einmal, aus dem ersten.'], code: true, columns: ['Attribut', 'Was es ist'], rows: [
            { name: 'src', what: 'die https-Adresse des Skripts auf der Instanz Ihres Space; sie muss https sein' },
            { name: 'key', what: 'Ihr Publishable Key. Ein Secret Key zeigt Personen, die die Seite bearbeiten können, eine Warnung, und Besuchern nichts' },
            { name: 'mode, side, locale, input, api', what: 'die Attribute des Elements ohne das Präfix data-. Einen Wert, den das Plugin nicht kennt, lässt es weg, sodass das Widget seine Voreinstellung nimmt' },
          ] },
          { id: 'caching', title: 'Caching- und Optimierungs-Plugins', paras: ['Plugins, die Skripte zusammenfassen, verkleinern, verschieben oder verzögern, müssen das Skript in Ruhe lassen: Schließen Sie es über seine Adresse oder seinen Handle aus. Das Widget lädt seine anderen Sprachen von neben sich und prüft jede gegen eine sha256-Summe, die es trägt, also kann eine Kopie anderswo sie nicht laden. Erlaubt Ihr Hoster keine Plugins, steht der Shortcode nicht zur Verfügung, und ein Custom-HTML-Block funktioniert nur für Nutzerinnen und Nutzer, denen WordPress Skripte erlaubt.'] },
        ] as Section[],
        state: ['Die CI von Connect führt das Plugin in einem echten WordPress 6.8 auf PHP 8.3 über WordPress Playground aus und lädt seine Seiten in drei Browser-Engines gegen den Beispiel-Build: Der Shortcode startet das Widget mit Ihrem Hinweis, zwei Shortcodes auf einer Seite laden das Skript einmal, ein Shortcode mit einem Secret Key zeigt einem Besucher nichts. Gegen einen echten Space lief es so, wie es geschrieben ist, noch nicht. Das Rezept ist heute das ganze Plugin; eine Einstellungsseite gehört nicht dazu.'],
      },
      nextjs: {
        nav: 'Next.js',
        title: 'Next.js · Linkbot für Plattformen',
        description: 'Der React-Wrapper im App Router: eine Client-Komponente, öffentliche Variablen, die Content Security Policy und Webhooks in einem Route-Handler.',
        h1: ['Der Wrapper', 'im App Router.'],
        lede: 'Verwenden Sie den React-Wrapper. Er ist eine Client-Komponente, eine Server-Komponente kann ihn also rendern: Skriptadresse und Publishable Key als Props, Modus, Seite und Sprache, Ihr Datenhinweis und die Theme-Variablen in seinem style.',
        sections: [
          { id: 'props', title: 'Props und Variablen', paras: ['Skriptadresse und Publishable Key sind Pflicht. Sie sind absichtlich öffentlich: Der Schlüssel bezeichnet nur Ihren Space und gilt nur auf Ihren erlaubten Origins. Öffentliche Variablen stehen zur Build-Zeit fest. Der Hinweis ist Ihr Datenhinweis, gezeigt über dem Bestätigen-Knopf; der style setzt die Theme-Variablen und reserviert Platz, bevor das Widget lädt, damit die Seite darunter nicht springt.'] },
          { id: 'csp', title: 'Content Security Policy', paras: ['Nehmen Sie den Origin des Skripts in script-src auf und den Origin der Space-API zusammen mit dem des Skripts in connect-src. Der Wrapper fügt das Script-Tag aus dem Browser hinzu: Unter einer Nonce-Richtlinie mit strict-dynamic ist dieses Tag erlaubt, weil vertrauenswürdiger Code es hinzufügt; ohne strict-dynamic listen Sie den Origin des Skripts. Das Beispiel sendet keine Richtlinie, also testet die CI von Connect für Next.js noch keine.'] },
          { id: 'server', title: 'Ihre Server-Seite', paras: ['Webhooks kommen in einem Route-Handler an; die Webhook-Anleitung zeigt einen für den App Router, in Code, den die CI ausführt. Der Secret Key bleibt auf dem Server, nie in einer öffentlichen Variable.'] },
        ] as Section[],
        state: ['Die CI von Connect baut das Beispiel mit Next.js 16.3.8 und React 19.3, was es typprüft, startet es dann und führt die Seite in drei Browser-Engines gegen den Beispiel-Build aus: Der Wrapper lädt das Skript einmal, das Widget startet mit Hinweis und Theme, und die Konsole zeigt keine Fehler. Gegen einen echten Space lief es so, wie es geschrieben ist, noch nicht. Kein Paket ist veröffentlicht.'],
      },
      astro: {
        nav: 'Astro',
        title: 'Astro · Linkbot für Plattformen',
        description: 'Eine Komponente: das Skript bleibt inline, damit Astro es nicht bündelt, der Hinweis über einen Wrapper, drei öffentliche Variablen, ein statischer Build.',
        h1: ['Eine Komponente,', 'ein statischer Build.'],
        lede: 'Kopieren Sie eine Komponente in Ihre Site. Sie rendert das Script-Tag und das Element aus drei öffentlichen Variablen: der Skriptadresse auf der Instanz Ihres Space, Ihrem Publishable Key und, falls das Skript von einem anderen Origin kommt, Ihrer API-Basis. Die Seite braucht keinen Server: Ein statischer Astro-Build funktioniert.',
        sections: [
          { id: 'inline', title: 'Das Skript bleibt inline', paras: ['Das Script-Tag trägt is:inline, Astro lässt es also in Ruhe. Das Skript muss von dort laden, wo es ausgeliefert wird, weil es seine anderen Sprachen von neben sich holt und jede gegen eine sha256-Summe prüft, die es trägt.'] },
          { id: 'notice', title: 'Der Hinweis', paras: ['Astro verwendet den Slot-Namen des Hinweises für seine eigenen Slots und entfernt das Attribut, also legt die Komponente Ihren Hinweis in einen Wrapper, den das Widget aufnimmt. Das CSS Ihrer Seite gestaltet ihn.'] },
          { id: 'twice', title: 'Zweimal auf einer Seite', paras: ['Verwenden Sie die Komponente zweimal auf einer Seite, erscheint das Script-Tag zweimal; das zweite Laden tut nichts. Setzen Sie die öffentlichen Variablen in der Umgebung Ihres Builds oder in einer Umgebungsdatei, die Sie nicht einchecken; sie sind absichtlich öffentlich.'] },
        ] as Section[],
        state: ['Die CI von Connect baut das Beispiel mit Astro 7.3.5 und führt die gebaute Seite in drei Browser-Engines gegen den Beispiel-Build aus: Das Widget startet, zeigt den Hinweis, übernimmt das Theme, und Astro hat das Script-Tag in Ruhe gelassen. Gegen einen echten Space lief es so, wie es geschrieben ist, noch nicht. Eine paketierte Astro-Integration ist nicht gebaut.'],
      },
    },
  },
};
