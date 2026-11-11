/* de: the home's words (src/front/copy.ts); the page's sentences are the site's. Not yet read by a native speaker
   (docs/truth-check.md). */
import type { FrontCopy } from '../copy.ts';
import { PUBLIC_NAME } from '../../i18n/terms.ts';

export const de: FrontCopy = {
  landing: {
    meta: {
      title: `${PUBLIC_NAME} für Entwickler: Vertrauen, bevor man sich kennt, in Ihrer Plattform`,
      description: `${PUBLIC_NAME} mit einem Skript und einem Element einbinden oder auf der Space-API selbst bauen. „Beide sagen Ja“ mit zwei erfundenen Unternehmen ausprobieren.`,
    },
    opening: {
      h1: 'Vertrauen, bevor man sich kennt, eingebaut in Ihre Plattform.',
      sub: {
        today: `${PUBLIC_NAME} bestätigt jede Seite, gleicht verborgen ab und stellt zwei Unternehmen erst vor, wenn beide Ja sagen.`,
        full: `${PUBLIC_NAME} prüft, wer echt ist, gleicht verborgen ab und stellt zwei Unternehmen erst vor, wenn beide Ja sagen.`,
      },
      start: 'In 5 Minuten starten',
      docs: 'Zur Doku',
    },
    trial: {
      h2: 'Probieren Sie es aus: ein Käufer, ein Lieferant',
      label: 'Erfundene Beispieldaten · läuft in Ihrem Browser, nichts wird gesendet',
      steps: ['Prüfen', 'Verborgen abgleichen', 'Beide sagen Ja'],
      progress: 'Schritte',
      buyer: { role: 'Käufer', name: 'Northfield Fittings', wants: 'Braucht', text: 'Aluminiumgehäuse, 5.000 im Jahr, ISO 9001, Lieferung innerhalb der EU' },
      supplier: { role: 'Lieferant', name: 'Lakeside Castings', wants: 'Bietet', text: 'Aluminium-Druckgussteile ab 1.000 Stück, ISO 9001, Versand in die ganze EU' },
      hidden: 'Name verborgen',
      email: 'E-Mail-Adresse',
      check: {
        title: 'Jede Seite bestätigt ihren Kontakt',
        p: 'Jede Seite bestätigt, was sie angefragt hat, und öffnet einen Link, der an ihre E-Mail-Adresse geht. Vor der Bestätigung wird nichts gespeichert.',
        pending: 'Noch nicht bestätigt',
        done: 'Über einen Link bestätigt',
        button: 'Bestätigen',
        next: 'Passung suchen',
      },
      match: {
        title: 'Eine mögliche Passung, ohne Namen',
        p: `${PUBLIC_NAME} vergleicht beide Kriterium für Kriterium. Jede Seite sieht die Urteile, nie den Namen oder Kontakt der anderen.`,
        card: 'Mögliche Passung',
        criteria: [
          { label: 'Material', value: 'Aluminium', verdict: 'meets' },
          { label: 'Menge', value: '5.000 im Jahr; ab 1.000 Stück', verdict: 'meets' },
          { label: 'Zertifikat', value: 'ISO 9001', verdict: 'meets' },
          { label: 'Lieferung', value: 'Innerhalb der EU', verdict: 'meets' },
          { label: 'Verfahren', value: 'Druckguss; die Anfrage sagt nichts dazu', verdict: 'unknown' },
        ],
        verdicts: { meets: 'Passt', partly: 'Passt teilweise', conflicts: 'Widerspricht', unknown: 'Unbekannt' },
        approved: 'Eine benannte Person der Plattform hat diese mögliche Passung freigegeben. Die Freigabe gibt nichts preis.',
        next: 'Beide Seiten fragen',
      },
      yes: {
        title: 'Beide sagen Ja, oder niemand erfährt etwas',
        p: 'Jede Seite antwortet für sich. Bevor beide Ja sagen, erfährt keine, wer die andere ist.',
        ask: { buyer: 'Diesem Lieferanten vorgestellt werden?', supplier: 'Diesem Käufer vorgestellt werden?' },
        yes: 'Ja',
        no: 'Nein',
        waiting: 'Ja. Wartet auf die andere Seite, die diese Antwort nicht sieht.',
        said: 'Nein.',
        introduced: 'Vorgestellt. Beide haben Ja gesagt; erst jetzt gehen Namen und E-Mail-Adressen hinaus.',
        mode: 'Hier als direkte Vorstellung gezeigt; eine Plattform kann die Vorstellung auch über ihr eigenes Team machen.',
        declined: 'Keine Vorstellung. Eine Seite hat Nein gesagt; keine erfährt, wer die andere ist.',
        reset: 'Neu beginnen',
      },
    },
    embed: {
      h2: 'Die kürzeste Einbettung',
      p: 'Ein Skript und ein Element auf Ihrer Seite; die Fragen passen zu Ihrem Markt.',
      hosted: 'Gehosteter Zugang für andere Plattformen',
      developers: 'Für Entwickler',
      docs: 'Die ganze Doku',
    },
    bottom: {
      h2: `Sie entwickeln nicht? Was ${PUBLIC_NAME} ist, in einfachen Worten.`,
      button: 'Auf sensalio.de lesen',
      line: 'Alles, was hier zu sehen ist, läuft mit erfundenen Daten; geprüft am {date}.',
      status: 'Der ganze Stand',
    },
    labels: { live: 'Live', soon: 'Demnächst' },
  },
};
