/* /faq auf Deutsch (src/faq/en.ts ist die Quelle). */
import { statusDate } from '../i18n/status-date.ts';
import type { Faq } from './en.ts';
import { PUBLIC_NAME } from '../i18n/terms.ts';

const AS_OF = statusDate('de');

export const de: Faq = {
  title: `Fragen zu ${PUBLIC_NAME}: was es ist und welches Problem es löst`,
  description: `Was ${PUBLIC_NAME} ist, welches Problem es löst, wie „beide sagen Ja“ funktioniert, was es heute prüft, was Open Source ist und was gehostet wird, und für wen es ist.`,
  eyebrow: 'Häufige Fragen',
  h1: `Fragen zu ${PUBLIC_NAME}`,
  lede: 'Kurze Antworten, jede heute wahr. Was geplant ist, steht als geplant da.',
  items: [
    {
      q: `Was ist ${PUBLIC_NAME}?`,
      a: [
        `Mit ${PUBLIC_NAME} können zwei Unternehmen, die sich nicht kennen, einander vertrauen, bevor sie sich kennen. Es geht in drei Schritten: eine Prüfung jeder Seite, ein verborgener Abgleich und eine Vorstellung erst, wenn beide Ja sagen.`,
        `Eine Plattform bettet ${PUBLIC_NAME} in ihre eigenen Seiten ein, mit einem Space pro Markt.`,
      ],
    },
    {
      q: `Welches Problem löst ${PUBLIC_NAME}?`,
      a: [
        'Im B2B-Handel kostet gesehen werden etwas, wenn viel auf dem Spiel steht. Ein Einkäufer, der einen Bedarf zeigt, oder ein Lieferant, der zeigt, was er liefern kann, zeigt es dem ganzen Markt und weiß nicht, wer auf der anderen Seite echt ist.',
        `So können zwei Unternehmen, die sich nicht kennen, einander nicht vertrauen, bevor sie sich kennen. ${PUBLIC_NAME} ändert das: Es bestätigt jede Seite und zeigt jeder nur die Kriterien und ein Urteil pro Kriterium, nie Namen oder Kontakt der anderen, bis beide Ja sagen.`,
      ],
    },
    {
      q: 'Wie funktioniert „beide sagen Ja“?',
      a: [
        'Nach einem verborgenen Abgleich sieht jede Seite eine Board-Karte ohne Namen: die Kriterien und ein Urteil pro Kriterium. Eine benannte Person bei der Plattform gibt die mögliche Passung frei; die Freigabe verrät nichts.',
        'Dann antwortet jede Seite für sich und sieht die Antwort der anderen nicht. Erst wenn beide Ja sagen, gehen Namen und E-Mail-Adressen hinaus, direkt oder über das Team der Plattform. Ein Nein auf einer Seite verrät der anderen nichts, und der Server verweigert jeden anderen Weg zu einer Vorstellung.',
      ],
    },
    {
      q: `Was prüft ${PUBLIC_NAME}?`,
      a: [
        'Nur, was heute läuft: Jede Seite bestätigt ihre E-Mail-Adresse über einen Link, der ihr geschickt wird, und vor der Bestätigung wird nichts gespeichert.',
        `Prüfungen eines Unternehmens durch ${PUBLIC_NAME} selbst, etwa ob es echt ist, sind geplant und nicht gebaut.`,
      ],
    },
    {
      q: 'Was ist Open Source und was wird gehostet?',
      a: [
        `Stand ${AS_OF} ist nichts von ${PUBLIC_NAME} als Open Source veröffentlicht: Das Repository mit dem Widget und dem SDK ist privat, und das SDK ist nicht auf npm.`,
        `Der Plan: Das Widget, das SDK, ein Kommandozeilenwerkzeug und die Beschreibung des Protokolls werden Open Source, mit einem Schnellstart in fünf Minuten. Die Prüfungen, die geprüfte Historie, der Abgleich und die Abrechnung bleiben ein Dienst, den ${PUBLIC_NAME} hostet. Die Lizenz ist noch nicht gewählt.`,
        'Gehosteter Zugang für andere Plattformen: demnächst.',
      ],
    },
    {
      q: `Für wen ist ${PUBLIC_NAME}?`,
      a: [
        'Für Plattformen, die Unternehmen zusammenbringen und eine Vorstellung nur dort wollen, wo beide Seiten sie wollen, und für die Einkäufer und Lieferanten darauf. Eine Plattform fügt es mit einem Skript und einem Element in ihre Seite ein.',
        'Der erste Space ist für Industrieminerale. Er läuft als Test-Instanz mit synthetischen Daten; noch nutzt ihn keine echte Person und keine echte Organisation.',
      ],
    },
  ],
  terms: {
    title: 'Die Begriffe',
    lede: `Die Wörter, die ${PUBLIC_NAME} verwendet, jedes mit einer Bedeutung, gleich auf dieser Seite, im Widget und in der Dokumentation.`,
  },
};
