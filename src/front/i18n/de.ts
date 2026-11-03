/* de: the front's words (src/front/copy.ts); the page's sentences are the site's. Not yet read by a native speaker
   (docs/truth-check.md). */
import type { FrontCopy } from '../copy.ts';

export const de: FrontCopy = {
  a: {
    ledger: {
      label: 'Synthetisch · feste Werte, für diese Seite geschrieben · hier wird nichts abgeglichen',
      space: 'Ein Space für Industrieminerale',
      need: 'Die Anfrage',
      offer: 'Das Angebot',
      table: 'Das Paar, Kriterium für Kriterium',
      columns: { criterion: 'Kriterium', need: 'Die Anfrage sagt', offer: 'Das Angebot sagt', verdict: 'Urteil' },
      importance: { must: 'Muss', nice_to_have: 'Wünschenswert' },
      verdicts: { meets: 'Passt', partly: 'Passt teilweise', conflicts: 'Widerspricht', unknown: 'Unbekannt' },
      state: 'Jedes Muss passt, also kann dieses Paar eine Passung sein. Die weichen Kriterien zeigen nur; sie entscheiden nicht.',
      before: 'Bevor jemand vorgestellt wird',
      stages: [
        {
          name: 'Gate',
          text: 'Ein benannter Operator trägt die vom Space verlangte Prüfung als bestanden ein. Das System entscheidet nie ein Gate.',
        },
        {
          name: 'Freigabe',
          text: 'Ein benannter, aktiver Operator gibt den Fall frei. Eine Freigabe allein gibt nichts preis.',
        },
        {
          name: 'Beide Ja',
          text: 'Jede Seite antwortet für sich. Bevor beide Ja gesagt haben, erfährt die andere Seite nichts.',
        },
        {
          name: 'Vorstellung',
          text: 'Der Server legt sie an, sobald die letzte der drei Bedingungen erfüllt ist, in beliebiger Reihenfolge, und verweigert jeden anderen Weg. Jede Seite erhält eine Quittung.',
        },
      ],
      notice: 'Eine mögliche Passung gibt nur die Urteile preis und einen festen Hinweis, dass Menschen entscheiden.',
      legend: 'Durchgezogen: passt. Geteilt: passt teilweise. Gekreuzt: widerspricht. Gestrichelt: unbekannt, was nie eine Passung ist.',
    },
  },
  landing: {
    meta: {
      title: 'Linkbot: Ihre Plattform bringt Käufer und Verkäufer zusammen, Linkbot findet, wer passt',
      description: 'Für Plattformen, die Käufer und Verkäufer zusammenbringen: ein Widget, das jede Seite fragt, was sie braucht, je Kriterium urteilt und nach zwei Ja vorstellt.',
    },
    opening: {
      h1: 'Ihre Plattform bringt Käufer und Verkäufer zusammen. Linkbot findet, wer passt.',
      sub: 'Sein Widget fragt jede Seite, was sie braucht; Linkbot zeigt für jedes Kriterium ein Urteil und stellt die beiden Seiten erst vor, wenn beide Ja sagen.',
      button: 'Schritt für Schritt ansehen',
    },
    cards: {
      h2: 'Was es für Sie tut',
      items: [
        { name: 'Fragen in der Sprache Ihres Markts', text: 'Jede Seite sagt, was sie braucht oder anbietet, in einer Zeile oder in Fragen, die zu ihrem Markt passen; gespeichert wird erst, wenn sie bestätigt.', button: 'Die Anfrage ansehen' },
        { name: 'Wir suchen weiter', text: 'Passt noch nichts, sucht Linkbot weiter und sagt nur Ihnen Bescheid, wenn etwas Neues passt.', small: 'In der Demo gehen seine E-Mails an ein Testpostfach und erreichen niemanden.', button: 'Ansehen, wie es weitersucht' },
        { name: 'Vorgestellt erst nach zwei Ja', text: 'Zwei Seiten werden erst vorgestellt, wenn eine benannte Person zustimmt und beide Ja sagen.', button: 'Die Vorstellung ansehen' },
      ],
    },
    stage: {
      h2: 'Eine Vorstellung, von beiden Seiten',
      p: 'Eine Anfrage und ein Angebot werden erst vorgestellt, wenn eine benannte Person zustimmt und beide Seiten Ja sagen.',
      roles: 'Welche Seite zeigen',
      buyer: 'Als Käufer',
      supplier: 'Als Lieferant',
      label: 'Aufgezeichneter Durchgang · erfundene Daten',
      supplierNote: 'Von der Seite des Lieferanten ist bisher nur sein Ja aufgezeichnet; sein Angebot beschreibt der Lieferant im selben Widget.',
      link: 'Alle sechs Schritte durchgehen',
    },
    sees: {
      h2: 'Wer was sieht, und wann',
      p: 'Jeder Schritt zeigt nur, was dieser Schritt erlaubt; die Angaben für eine Vorstellung gehen erst nach dem Ja beider Seiten hinaus.',
      link: 'Wer was sieht, Schritt für Schritt',
    },
    platforms: {
      h2: 'Für Plattformen',
      p: 'Ein Skript und ein Element auf Ihrer Seite; die Fragen passen zu Ihrem Markt.',
      snippet: 'Die kürzeste Einbettung',
      later: 'Mit Ihren eigenen Build-Werkzeugen einbinden',
      button: 'Für Plattformen',
      developers: 'Für Entwickler',
    },
    bottom: {
      h2: 'Ihr Markt ist noch nicht dabei? Sagen Sie uns, was Sie zusammenbringen.',
      button: 'Sagen Sie uns, was Sie zusammenbringen',
      prepared: 'Die Adresse, an die Sie schreiben können, ist in Vorbereitung; die Seite hinter dem Knopf sagt, wie Sie uns erreichen werden.',
      line: 'Alles, was hier zu sehen ist, läuft mit erfundenen Daten; geprüft am {date}.',
      status: 'Der ganze Stand',
    },
    labels: { live: 'Live', soon: 'Demnächst' },
  },
  c: {
    meta: {
      title: 'Linkbot: wer was sieht, und wann',
      description: 'Eine Matching-Schicht, die jede Plattform einbetten kann, gebaut um eine Frage: wer was sieht, und wann. Ein synthetisches Angebot, Stufe für Stufe.',
    },
    hero: {
      eyebrow: 'Eine Matching-Schicht, die jede Plattform einbetten kann',
      h1: ['Wer was sieht,', 'und wann.'],
      lede: 'Ein Pack gibt jedem Kriterium eine Stufe, und eine Stufe ist der weiteste Punkt, bis zu dem ein Wert gelangt: das Board, eine mögliche Passung, die Vorstellung oder allein das Team der Plattform. Unten: ein synthetisches Angebot, Stufe für Stufe, und die Quittung, die jeden Lesezugriff begrenzt.',
      primary: 'Was eine Plattform bekommt',
      secondary: 'Wer was sieht, im Einzelnen',
    },
    stages: {
      label: 'Synthetisch · ein Angebot, für diese Seite geschrieben · hier wird nichts abgeglichen und niemand vorgestellt',
      sees: 'Wer es sieht',
      shows: 'Was es zeigt',
      not: 'Auf dieser Stufe nicht',
      receipt: {
        h3: 'Die Quittung',
        lines: [
          'Wer welche Felder sehen darf, und ab wann.',
          'Jeder Lesezugriff auf eine Vorstellung, mit seinem Zeitpunkt.',
          'Feldschlüssel und Zeiten, nie Werte.',
          'Was nicht in der Quittung steht, wird später nie offengelegt.',
        ],
      },
    },
    why: {
      h2: 'Warum eine Plattform Linkbot an ihre Nutzer heranlassen kann',
      items: [
        {
          h3: 'Ein Space pro Markt, auf einer eigenen Instanz',
          p: 'Ein Space ist ein Markt auf einer Plattform, mit eigener Anwendung, Datenbank, eigenen Schlüsseln und eigenem Löschprotokoll. Das Matching läuft in ihm; keine Anfrage, kein Angebot und keine Passung wird mit einem anderen Space geteilt.',
        },
        {
          h3: 'Ihre Seiten, Ihre Schlüssel, Ihr Team',
          p: 'Das Widget läuft in Ihren Seiten unter Ihrem eigenen Datenhinweis. Ihre Seite hält einen Publishable Key, der nur auf Ihren Origins gilt; der Secret Key bleibt auf Ihrem Server; Ihr Team gibt Fälle in einer Konsole hinter Ihrem eigenen Login frei, und es gibt keinen Linkbot-Login für Operatoren.',
        },
        {
          h3: 'Eine benannte Person, nie das System',
          p: 'Gates werden von einem benannten Operator eingetragen, mit einer Referenz und ohne personenbezogene Daten, und ein benannter Operator gibt frei. Eine Freigabe allein gibt nichts preis; jeder Schreibzugriff nennt, wer ihn ausgelöst hat, und steht im Audit-Log.',
        },
        {
          h3: 'Menschen entscheiden, jede Seite für sich',
          p: 'Jede Seite beantwortet eine mögliche Passung für ihre eigene Seite. Bevor beide Ja gesagt haben, erfährt die andere Seite nichts, und ein späteres Nein nimmt ein Ja zurück. Der Server legt die Vorstellung an, sobald die letzte Bedingung erfüllt ist, und verweigert jeden anderen Weg.',
        },
      ],
    },
    deletion: { h2: 'Löschung: was geht, und was bleibt' },
    platforms: {
      h2: 'Für Plattformen',
      p: 'Ein Skript und ein Element bringen einen Space auf Ihre Seite; die Konsole für Ihr Team läuft auf Ihrem Rechner oder hinter Ihrem eigenen Login; Ihr Server erfährt von Ereignissen über signierte Webhooks, die im Vertrag stehen und vom Staging-Space noch nicht gesendet werden.',
      link: 'Was eine Plattform bekommt',
    },
    verticals: {
      h2: 'Für Branchen',
      p: 'Ein Pack beschreibt einen Markt: seine Kriterien, Optionen und Einheiten, seine Beschriftungen und Fragen in den Sprachen des Space, was jedes Kriterium auf welcher Stufe preisgibt, und die Gates, die der Markt braucht. Das erste ist das für Industrieminerale.',
      link: 'Was ein Pack enthält',
    },
    state: {
      h2: 'Wo Linkbot steht',
      p: 'Das Angebot oben ist fester Text, für diese Seite im Vokabular eines synthetischen Packs geschrieben; das Produkt ist hier nicht gelaufen. Die Demo-Seite geht den ganzen Weg Schritt für Schritt durch.',
    },
  },
  demo: {
    meta: {
      title: 'Linkbot: der ganze Weg, von der Anfrage bis zur Vorstellung',
      description: 'Der Weg eines Einkäufers durch Linkbot in sechs Schritten: von der Anfrage zum Ja beider Seiten und zur Vorstellung. Mit erfundenen Daten.',
    },
    hero: {
      eyebrow: 'Demo · erfundene Daten',
      h1: ['Von der Anfrage bis zur Vorstellung,', 'in sechs Schritten.'],
      lede: 'Was zwischen der ersten Zeile eines Einkäufers und dem Moment geschieht, in dem zwei Unternehmen einander vorgestellt werden, Schritt für Schritt, und wer bei jedem Schritt handelt.',
    },
    test: 'Dies ist ein Test-Space mit erfundenen Daten. Jede Anfrage, jedes Angebot, jedes Unternehmen und jeder Wert hier ist für Tests erfunden. Bitte geben Sie nichts Echtes ein: kein Unternehmen, keine Person, keine eigene Adresse. Seine E-Mails gehen in ein Test-Postfach und erreichen niemanden.',
    steps: {
      h2: 'Der Weg, Schritt für Schritt',
      who: 'Wer handelt',
      items: [
        { name: 'Die Anfrage', who: 'Der Einkäufer', text: 'Der Einkäufer beschreibt den Bedarf auf der Seite einer Plattform, im Formular, das das Pack des Marktes erzeugt, oder in einer Zeile Text, die feste Regeln lesen und in vorgeschlagene Werte umsetzen. Nichts ist vorausgewählt, und was der Einkäufer nicht angegeben hat, bleibt unbekannt.' },
        { name: 'Die Kriterien, bestätigt', who: 'Der Einkäufer', text: 'Der Einkäufer prüft jeden Wert und bestätigt. Erst jetzt wird etwas gespeichert: Der Server prüft jeden Wert gegen das Pack und nennt jedes Feld, das nicht passt. Die E-Mail-Adresse wird über einen Link bestätigt.' },
        { name: 'Die möglichen Passungen', who: 'Der Space', text: 'Das Matching vergleicht die gespeicherten Kriterien Stück für Stück mit denen der anderen Seite: ein Urteil pro Kriterium, passt, passt teilweise, widerspricht oder unbekannt, nie eine Punktzahl. Eine mögliche Passung zeigt jeder Seite nur die Urteile und einen Hinweis, dass Menschen entscheiden.' },
        { name: 'Beide sagen Ja', who: 'Der Einkäufer und der Lieferant', text: 'Jede Seite beantwortet die mögliche Passung für sich selbst. Bevor beide Ja gesagt haben, erfährt die andere Seite nichts, und ein späteres Nein widerruft ein Ja.' },
        { name: 'Der Operator gibt frei', who: 'Das Team der Plattform', text: 'Ein namentlich genannter Operator hält die Prüfungen fest, die der Space verlangt, und gibt das Paar frei. Eine Freigabe allein gibt nichts preis, und jede Änderung nennt, wer sie vorgenommen hat.' },
        { name: 'Die Vorstellung', who: 'Der Server', text: 'Sobald die letzte der drei Bedingungen erfüllt ist, in beliebiger Reihenfolge, erstellt der Server die Vorstellung, und auf jedem anderen Weg verweigert er sie. Jede Seite erhält einen Beleg, wer welche Felder sehen darf. Im direkten Modus, dem hier aufgezeichneten, kann danach jede Seite die Felder öffnen, die die andere in dieser Phase teilt. Eine Plattform kann stattdessen den Operator-Modus wählen: Dann sieht nur ihr Team beide Seiten und nimmt mit ihnen Kontakt auf.' },
      ],
    },
    replay: {
      label: 'Aufgezeichneter Durchgang · erfundene Daten',
      lede: 'Bilder des Widgets und der Operator-Konsole bei jedem Schritt, aufgenommen auf einem Computer. Jede Partei, jedes Unternehmen und jeder Wert darin ist erfunden.',
      note: 'Aufgenommen am 25. Oktober 2026 auf der Demo-Bühne von Linkbot Connect, die das Widget und die Operator-Konsole auf einem Computer gegen eine Beispiel-Space-API laufen lässt. Nichts auf diesen Bildern hat einen Space oder einen Menschen erreicht. Die Aufnahme stellt im Modus direkt vor: Nach der Freigabe durch den Operator kann jede Seite öffnen, was die andere teilt.',
      steps: 'Die sechs Schritte',
      position: 'Schritt {n} von {total}',
      previous: 'Vorheriger Schritt',
      next: 'Nächster Schritt',
      screens: [
        ['Das Widget des Einkäufers: das Formular, das das Beispiel-Pack erzeugt, mit Rohphosphat gewählt und einem P₂O₅-Minimum von 30 %. Die Gewichtung ist als vorgeschlagen markiert, sonst ist nichts gewählt.'],
        ['Das Widget des Einkäufers nach dem Bestätigen: Die Anfrage ist aktiv, mit jedem Kriterium und seiner Gewichtung. Noch keine Angebote zu zeigen.'],
        ['Das Widget des Einkäufers: ein Angebot, das passen könnte, mit einem Haken je Kriterium, der Frage „Möchten Sie vorgestellt werden?“ und dem Hinweis, dass Menschen entscheiden.'],
        ['Das Widget des Einkäufers nach dem Ja: „Ihr Ja ist festgehalten. Sample space prüft es zuerst.“', 'Das Widget des Lieferanten: dieselbe mögliche Passung, von der Angebotsseite aus als Anfrage mit einem Haken je Kriterium, nach dem eigenen Ja des Lieferanten, mit denselben Worten.'],
        ['Der Fall in der Operator-Konsole: die Prüfung jeder Seite und die KYC- und Sanktionsprüfung des Falls, vom Beispiel-Operator als bestanden festgehalten, dann „Von Ihrem Team freigegeben.“'],
        ['Das Widget des Einkäufers unter „Meine Anfragen und Angebote“: Beide Seiten haben Ja gesagt, die Anfrage ist vorgestellt, und eine Schaltfläche zeigt, was die andere Seite teilt.', 'Die Vorstellungen in der Operator-Konsole: eine Vorstellung, im Modus direkt, ohne Kontaktdaten aufgeführt.'],
      ],
    },
    watch: {
      name: 'Wenn noch nichts passt: beobachten',
      who: 'Der Einkäufer',
      text: 'Nach dem Bestätigen kann der Einkäufer die Anfrage offen halten und beobachten: wie oft, wöchentlich oder täglich; worüber er hören will; und in den E-Mail-Optionen, höchstens wie viele pro E-Mail und keine E-Mail vor einem gewählten Tag. Eine Beobachtung meldet nur ihrem Inhaber, wenn etwas Neues passt, und beginnt, sobald die E-Mail-Adresse bestätigt ist. Sie läuft 90 Tage und lässt sich jederzeit pausieren, fortsetzen oder beenden, auch über einen Link in ihren E-Mails.',
      screens: ['Das Widget des Einkäufers nach dem Bestätigen, noch ohne Angebote: eine Beobachtung, wöchentlich, auf alles, was die Muss-Kriterien erfüllt, höchstens 5 pro E-Mail.', 'Dasselbe Widget nach „Beobachten starten“: Die Beobachtung wartet darauf, dass die E-Mail-Adresse bestätigt wird, höchstens 5 pro E-Mail, bis zum 23.01.2027. Die Aufnahme hat keine E-Mail gesendet, und die erfundene Adresse existiert nicht.'],
    },
    space: {
      h2: 'Das Board des Test-Space',
      on: 'Unten steht das Widget selbst, vom Test-Space ausgeliefert, im Board-Modus: die offenen Anfragen und Angebote, deren Inhaber sie zeigen wollten, vergröbert, wie das Pack es festlegt. Wer auf einen Eintrag antwortet, beginnt bei Schritt 1, auf der anderen Seite.',
      off: 'Auf dieser Seite steht noch kein Widget: Es wartet auf einen Demo-Space mit synthetischen Daten. Bis dahin zeigt der Weg oben Bilder.',
      notice: 'Ein Test-Space mit erfundenen Daten: Geben Sie nichts Echtes ein. Seine E-Mails erreichen niemanden.',
    },
  },
  stages: [
    {
      key: 'board',
      name: 'Board',
      eyes: 3,
      open: 1,
      who: 'Alle, die das Board sehen können',
      rule: 'Nur Felder der Board-Stufe, vergröbert, wie das Pack es festlegt, und nur für Angebote, deren Besitzer zugestimmt haben. Nie, wer eingestellt hat.',
      fields: [
        { label: 'Produkt', value: 'Rohphosphat' },
        { label: 'P₂O₅-Gehalt', value: '31–32 %' },
        { label: 'Menge', value: '20.000–25.000 t, als Band von 5.000 t' },
        { label: 'Lieferbedingung', value: 'CFR, CIF oder FOB' },
        { label: 'Benannter Hafen', value: 'Italien oder Spanien, als die Länder der Häfen' },
        { label: 'Verschiffungszeitraum', value: 'Januar bis Februar 2027' },
      ],
      not: ['Cadmium, Zahlung, Verpackung, Ursprung und Inspektion: Passungsstufe, nicht Board', 'Wer es eingestellt hat'],
    },
    {
      key: 'match',
      name: 'Passung',
      eyes: 2,
      open: 0.75,
      who: 'Die beiden Seiten einer möglichen Passung',
      rule: 'Urteile zu Feldern der Passungsstufe oder darunter, mit der Regel und den Werten, die sie anführt. Kein Name, keine Kontaktdaten, kein Hinweis auf die Antwort der anderen Seite.',
      fields: [
        { label: 'Cadmium', value: 'höchstens 18 mg/kg je kg P₂O₅', verdict: 'meets' },
        { label: 'Zahlung', value: 'Kasse gegen Dokumente; ein Akkreditiv war gefragt', verdict: 'conflicts' },
        { label: 'Verpackung', value: 'im Angebot nicht angegeben', verdict: 'unknown' },
        { label: 'Ursprungsland', value: 'Ägypten; Marokko oder Jordanien war gefragt', verdict: 'conflicts' },
        { label: 'Unabhängige Inspektion', value: 'im Angebot nicht angegeben', verdict: 'unknown' },
      ],
      not: ['Anzeigename und E-Mail-Adresse des Angebots', 'Die Antwort der Anfrage, bis beide Ja gesagt haben'],
    },
    {
      key: 'introduction',
      name: 'Vorstellung',
      eyes: 1,
      open: 0.5,
      who: 'Im Operator-Modus das Team der Plattform; im Direkt-Modus beide Seiten',
      rule: 'Anzeigename, bestätigte E-Mail-Adresse und die Kriterien, die das Pack für diese Stufe vorsieht. Jeder Lesezugriff wird auf der Quittung vermerkt.',
      fields: [
        { label: 'Anzeigename', value: 'der des Angebots, wie angegeben' },
        { label: 'E-Mail-Adresse', value: 'eine, über einen Link bestätigt' },
        { label: 'Kriterien der Vorstellungsstufe', value: 'wie das Pack es festlegt' },
      ],
      not: [
        'Felder, die das Pack dem Operator vorbehält',
        'Im Operator-Modus: alles von der anderen Seite; die Quittung jeder Seite sagt, dass beide zugestimmt haben und die Plattform sich meldet',
      ],
    },
    {
      key: 'operator',
      name: 'Operator',
      eyes: 1,
      open: 0.3,
      who: 'Nur das Team der Plattform',
      rule: 'Felder, die das Pack der Plattform vorbehält, etwa die Identitätsangaben für eine Prüfung der Partei. Sie erreichen die andere Seite nie, und jeder Zugriff wird festgehalten.',
      fields: [
        { label: 'Identitätsangaben', value: 'für die Prüfung der Partei des Space, gesehen vom Team' },
        { label: 'Der Eintrag zum Gate', value: 'bestanden, nicht bestanden oder verwiesen, mit einer Referenz und ohne personenbezogene Daten' },
      ],
      not: ['Nichts davon für die andere Seite'],
    },
  ],
};
