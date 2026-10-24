/* Die Worte der Seite auf Deutsch, typisiert gegen das Englische (en.ts): ein fehlender Schlüssel
   kompiliert nicht. Jeder Satz sagt, was der Vertrag der Space-API (0.2.7) und die Docs der
   Connect-Lane heute hergeben, nichts darüber hinaus. Sie-Form, wie das Widget. */
import type { Catalogue, Status } from './en.ts';

export const de: Catalogue = {
  site: {
    name: 'Linkbot',
    claim: 'Eine Matching-Schicht, die jede Plattform einbetten kann.',
    skip: 'Zum Inhalt',
    menu: 'Menü',
    toc: 'Auf dieser Seite',
    language: 'Sprache',
    nav: { how: 'So funktioniert es', platforms: 'Für Plattformen', verticals: 'Für Branchen' },
    footer: {
      product: 'Linkbot',
      legal: 'Rechtliches',
      imprint: 'Impressum',
      privacy: 'Datenschutzhinweis',
      line: 'Diese Seite setzt keine Cookies, lädt nichts von Dritten und nutzt keine Analyse-Dienste.',
    },
    status: { now: 'Läuft heute auf dem Staging-Space', contract: 'Im Vertrag, noch nicht auf Staging', later: 'Noch nicht gebaut' },
    synthetic: 'Alles auf dieser Seite beschreibt den Vertrag der Space-API und das, was auf dem synthetischen Staging-Space von Geoprocure läuft, mit synthetischen Daten. Noch nutzt es keine echte Person und keine echte Organisation.',
    more: 'Mehr lesen',
  },

  home: {
    title: 'Linkbot: Anfrage trifft Angebot, Menschen entscheiden',
    description: 'Eine Matching-Schicht für jede Plattform: ein Space pro Markt, Anfragen und Angebote als bestätigte Kriterien, eine Vorstellung erst, wenn beide Ja sagen.',
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
    ways: {
      title: 'Vier Wege zu sagen, was Sie brauchen oder anbieten',
      lede: 'Das Formular läuft heute auf dem Staging-Space. Text, Board und Beobachtungen stehen im Vertrag und laufen noch nicht auf Staging.',
      items: [
        { name: 'Per Formular', status: 'now' as Status, body: 'Das Formular kommt aus dem Pack: Pflichtkriterien zuerst, jede Liste mit „Anderes / nicht aufgeführt“, „Weiß nicht“ und „Beliebig“. Das Widget zeigt es auf den Seiten der Plattform.' },
        { name: 'In eigenen Worten', status: 'contract' as Status, body: 'Eine Lesung schlägt Werte vor, jeden mit dem Zitat, aus dem er stammt, und fragt nach, wo sie unsicher ist. Sie überschreibt nie, was eine Person gewählt hat. Aus, bis eine Richtlinie für das Lesen freigegeben ist.' },
        { name: 'Auf dem Board', status: 'contract' as Status, body: 'Offene Anfragen und Angebote, gelistet nur mit Zustimmung der Person, der sie gehören, mit den vergröberten Werten des Packs und nie mit dem Absender. Wer einen Eintrag beantwortet, beginnt einen Entwurf auf der anderen Seite.' },
        { name: 'Mit einer Beobachtung', status: 'contract' as Status, body: 'Eine Beobachtung hält eine Anfrage oder ein Angebot offen und sagt nur der Person Bescheid, die sie angelegt hat, wenn etwas Neues passt.' },
      ],
    },
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
    platforms: { title: 'Für Plattformen', body: 'Ein Skript und ein Element bringen einen Space auf Ihre Seite. Ihre Seite hält den Publishable Key, der nur auf Ihren Origins gilt; der Secret Key bleibt auf Ihrem Server. Ihr Team gibt Fälle in einer Konsole frei, die auf Ihrem Rechner oder hinter Ihrem eigenen Login läuft.', link: 'Was eine Plattform bekommt' },
    verticals: { title: 'Für Branchen', body: 'Ein Pack beschreibt einen Markt: seine Kriterien, Optionen und Einheiten, seine Beschriftungen und Fragen in den Sprachen des Space, was jedes Kriterium auf welcher Stufe preisgibt, und die Gates, die der Markt braucht. Der erste ist Industrieminerale.', link: 'Was ein Pack enthält' },
    state: { title: 'Wo es steht', body: 'Diese Seite zeigt keine Demo des Widgets, bis ein Demo-Space mit synthetischen Daten existiert.' },
  },

  how: {
    title: 'So funktioniert Linkbot: von der bestätigten Anfrage zur Vorstellung',
    description: 'Ein Space, ein Pack, vier Wege zu beschreiben, ein Urteil pro Kriterium, Freigabe durch einen benannten Operator, eine Vorstellung erst, wenn beide Ja sagen.',
    eyebrow: 'So funktioniert es',
    h1: ['Von der bestätigten Anfrage', 'zur Vorstellung.'],
    lede: 'Jeder Schritt unten steht im Vertrag der Space-API. Wo der Staging-Space einen Schritt noch nicht ausführt, sagt die Seite es.',
    toc: [['space', 'Ein Space'], ['pack', 'Ein Pack'], ['describe', 'Vier Wege zu beschreiben'], ['confirm', 'Bestätigen'], ['matching', 'Matching'], ['approval', 'Freigabe und Gates'], ['yes', 'Beide Ja'], ['introduction', 'Die Vorstellung'], ['after', 'Danach'], ['sees', 'Wer sieht was'], ['languages', 'Fünf Sprachen'], ['today', 'Was heute funktioniert']] as [string, string][],
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
      lede: 'Das Formular läuft heute auf dem Staging-Space. Text, Board und Beobachtungen stehen im Vertrag; die Instanz antwortet darauf mit „nicht implementiert“, bis ihr Abschnitt gebaut ist.',
      items: [
        { name: 'Per Formular', status: 'now' as Status, paras: [
          'Das Formular wird aus dem Pack erzeugt. Pflichtkriterien kommen zuerst; der Rest steht hinter „Mehr Details“. Nichts ist vorausgewählt: keine Option, keine Einheit, keine Basis, keine Art der Partei. Jede Liste bietet „Anderes / nicht aufgeführt“, „Weiß nicht“ und „Beliebig“, wo das Pack sie erlaubt.',
          'Jedes Kriterium trägt eine Gewichtung. Muss und Nie sind hart; Wünschenswert, Offen dafür und Lieber nicht sind weich. Das Pack kann eine vorschlagen, markiert als Vorschlag, und die Person kann sie ändern, sofern das Pack sie nicht festlegt. Wer Nie wählt, bestätigt das eigens.',
        ] },
        { name: 'In eigenen Worten', status: 'contract' as Status, paras: [
          'Eine Person schreibt, was sie braucht oder anbietet. Eine Lesung schlägt Werte für dieselben Kriterien vor, jeden neben den Worten, aus denen er stammt, und fragt nach, wo sie nicht entscheiden kann: eine Einheit, eine Option, eine Zahl, die zwei Schreibweisen verschieden lesen. Eine Lesung überschreibt nie, was eine Person gewählt hat; ein Unterschied wird zur Frage.',
          'Der Textweg ist aus, bis eine Richtlinie für das Lesen freigegeben ist. Was auch immer den Text liest: Harte Bedingungen bleiben bei deterministischem Code, kein Modell überstimmt ein Muss oder ein Nie.',
        ] },
        { name: 'Auf dem Board', status: 'contract' as Status, paras: [
          'Das Board listet Anfragen und Angebote, deren Besitzer zugestimmt haben, nie von selbst. Es zeigt nur die Felder, die das Pack auf der Board-Stufe erlaubt, vergröbert, wie das Pack es festlegt, und nie, wer eingestellt hat. Wer einen Eintrag beantwortet, beginnt einen Entwurf auf der anderen Seite, im selben Formular.',
        ] },
        { name: 'Mit einer Beobachtung', status: 'contract' as Status, paras: [
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
      title: 'Was heute funktioniert, und was noch nicht',
      lede: 'Genau die Teile, die heute auf dem Staging-Space laufen, mit denselben Quadraten, die das Produkt für Belege nutzt.',
      columns: [
        { status: 'now' as Status, title: 'Läuft heute auf dem Staging-Space', lead: 'Synthetische Daten, auf Deutsch und Englisch.', items: [
          'Eine Anfrage oder ein Angebot per Formular beschreiben, mit dem Identitätshinweis, wo der Space einen hat',
          'Bestätigen; der Browser, der bestätigt hat, verwaltet, was er angelegt hat',
          'Matching mit einem Urteil pro Kriterium',
          'Gates und Freigabe durch einen benannten Operator',
          'Vorstellungen im Operator-Modus, mit Quittungen',
          'Ergebnisse, Änderungen, Pausieren und Schließen',
          'Löschung mit dem Löschprotokoll der Instanz',
          'Der Beschreiben-Modus des Widgets gegen den Staging-Space; die Instanz liefert das Widget selbst noch nicht aus',
        ] },
        { status: 'contract' as Status, title: 'Im Vertrag, noch nicht auf Staging', lead: 'Die Instanz antwortet mit „nicht implementiert“, bis der Abschnitt gebaut ist.', items: [
          'Eine Anfrage oder ein Angebot aus Text lesen',
          'Das Board',
          'Beobachtungen und ihre Nachrichten',
          'Webhooks an den Server der Plattform',
          'E-Mail, die die Instanz verlässt; heute wird nichts versandt',
          'Einstellungen, Origins, Schlüssel und Funnel in der Konsole',
        ] },
        { status: 'later' as Status, title: 'Nicht gebaut', lead: 'Kein Datum versprochen.', items: [
          'Eine Demo des Widgets auf dieser Seite; sie wartet auf einen Demo-Space mit synthetischen Daten',
          'Veröffentlichte Pakete für WordPress, Next.js und Astro; die Rezepte existieren und laufen in der CI',
        ] },
      ],
    },
  },

  platforms: {
    title: 'Für Plattformen: ein Linkbot-Space auf Ihren eigenen Seiten',
    description: 'Ein Linkbot-Space auf Ihren Seiten: ein Skript und ein Element, ein Publishable Key, Ihr Datenhinweis, eine Konsole für Ihr Team, Webhooks für Ihren Server.',
    eyebrow: 'Für Plattformen',
    h1: ['Ein Space', 'auf Ihren eigenen Seiten.'],
    lede: 'Ein Skript und ein Element zeigen das Widget auf Ihrer Seite, in Ihren Schriften und Farben. Ihr Team gibt Fälle in einer Konsole auf Ihrem Rechner oder hinter Ihrem eigenen Login frei. Ihr Server erfährt von Ereignissen über signierte Webhooks.',
    toc: [['embed', 'Das Embed'], ['keys', 'Schlüssel und Origins'], ['console', 'Die Konsole'], ['server', 'SDK und Webhooks'], ['recipes', 'Rezepte'], ['state', 'Wo es steht']] as [string, string][],
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
        'Heute werden die erlaubten Origins beim Einrichten eines Space gesetzt; die Konsole kann sie noch nicht ändern.',
      ],
    },
    console: {
      title: 'Die Konsole für Ihr Team',
      paras: [
        'Die Konsole zeigt die Freigabe-Warteschlange, jeden Fall mit seinen Gates und seiner Freigabe, die Vorstellungen mit ihren Quittungen, die Ergebnisse, die Webhook-Endpunkte und die Operatoren. Sie läuft auf einem Rechner von Ihnen oder hinter Ihrem eigenen Login; der Secret Key bleibt auf ihrem Server. Es gibt kein Linkbot-Login für Operatoren.',
        'Einstellungen, Origins, Schlüssel und ein Funnel warten auf die Routen, die der Vertrag als Nächstes ergänzt.',
      ],
    },
    server: {
      title: 'Ihr Server: das SDK und Webhooks',
      paras: [
        'Das SDK gibt Ihrem Server einen Client, der durch den Vertrag der Space-API typisiert ist: Eine Route, ein Feld oder ein Wert, den der Vertrag nicht hat, ist ein Typfehler. Es prüft auch Webhook-Zustellungen genau so, wie der Vertrag es vorgibt. Es ist noch nicht veröffentlicht; sein Code liegt im Connect-Repository.',
        'Webhooks tragen IDs und Zustände, nie Kontaktdaten; Ihr Server holt Details mit seinem Secret Key. Zustellungen sind signiert und werden wiederholt. Sie stehen im Vertrag und werden vom Staging-Space noch nicht gesendet.',
      ],
    },
    recipes: {
      title: 'Rezepte: reines HTML, Astro, Next.js, WordPress',
      paras: [
        'Jedes Rezept ist eine Datei, die in der CI von Connect in drei Browser-Engines gegen den Beispiel-Build mit synthetischen Daten läuft: eine einfache Seite mit strenger Content Security Policy, eine Astro-Komponente, eine Next.js-Seite mit dem React-Wrapper und ein kleines WordPress-Plugin mit einem Shortcode.',
        'Keines davon läuft so, wie es geschrieben ist, schon gegen einen echten Space: Die Staging-Instanz liefert anstelle des Widgets eine Testdatei aus, bis dort ein Release eingespielt ist.',
      ],
    },
    state: { title: 'Wo es steht' },
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
};
