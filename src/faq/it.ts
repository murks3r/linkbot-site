/* /faq in italiano (src/faq/en.ts è la fonte). Scritto dalla lane, non ancora letto da un madrelingua. */
import { statusDate } from '../i18n/status-date.ts';
import type { Faq } from './en.ts';
import { PUBLIC_NAME } from '../i18n/terms.ts';

const AS_OF = statusDate('it');

export const it: Faq = {
  title: `Domande su ${PUBLIC_NAME}: che cos’è e quale problema risolve`,
  description: `Che cos’è ${PUBLIC_NAME}, quale problema risolve, come funziona “entrambe dicono sì”, cosa controlla oggi, cosa è open source e cosa è ospitato, a chi si rivolge.`,
  eyebrow: 'Domande frequenti',
  h1: `Domande su ${PUBLIC_NAME}`,
  lede: 'Risposte brevi, ognuna vera oggi. Ciò che è previsto lo dice.',
  items: [
    {
      q: `Che cos’è ${PUBLIC_NAME}?`,
      a: [
        `${PUBLIC_NAME} permette a due aziende che non si conoscono di fidarsi l’una dell’altra prima di conoscersi. Funziona in tre passi: un controllo di ciascuna parte, una corrispondenza in privato e una presentazione solo quando entrambe dicono sì.`,
        `Una piattaforma integra ${PUBLIC_NAME} nelle proprie pagine, con uno spazio per mercato.`,
      ],
    },
    {
      q: `Quale problema risolve ${PUBLIC_NAME}?`,
      a: [
        'Nel commercio B2B farsi vedere costa qualcosa quando la posta in gioco è alta. Un acquirente che mostra un bisogno, o un fornitore che mostra ciò che può consegnare, lo dice a tutto il mercato e non sa chi dall’altra parte sia reale.',
        `Così due aziende che non si conoscono non possono fidarsi l’una dell’altra prima di conoscersi. ${PUBLIC_NAME} cambia questo: conferma ciascuna parte e mostra a ciascuna solo i criteri e un verdetto per criterio, mai il nome o il contatto dell’altra, finché entrambe dicono sì.`,
      ],
    },
    {
      q: 'Come funziona “entrambe dicono sì”?',
      a: [
        'Dopo una corrispondenza in privato, ciascuna parte vede una scheda del board senza nomi: i criteri e un verdetto per criterio. Una persona identificata della piattaforma approva la possibile corrispondenza; l’approvazione non rivela nulla.',
        'Poi ciascuna parte risponde da sola e non vede la risposta dell’altra. Solo quando entrambe dicono sì i nomi e gli indirizzi email vengono condivisi, in modo diretto o tramite il team della piattaforma. Un no di una delle due non rivela nulla all’altra, e il server rifiuta ogni altra via verso una presentazione.',
      ],
    },
    {
      q: `Che cosa controlla ${PUBLIC_NAME}?`,
      a: [
        'Solo ciò che funziona oggi: ciascuna parte conferma il proprio indirizzo email con un link che le viene inviato, e nulla viene salvato prima della conferma.',
        `I controlli di un’azienda da parte di ${PUBLIC_NAME} stesso, per esempio se è reale, sono previsti e non costruiti.`,
      ],
    },
    {
      q: 'Che cosa è open source e che cosa è ospitato?',
      a: [
        `Al ${AS_OF}, nulla di ${PUBLIC_NAME} è pubblicato come open source: il repository con il widget e l’SDK è privato, e l’SDK non è su npm.`,
        `Il piano: il widget, l’SDK, uno strumento da riga di comando e la descrizione del protocollo diventano open source, con un avvio rapido di cinque minuti. I controlli, lo storico controllato, la corrispondenza e la fatturazione restano un servizio ospitato da ${PUBLIC_NAME}. La licenza non è ancora scelta.`,
        'Accesso ospitato per altre piattaforme: prossimamente.',
      ],
    },
    {
      q: `A chi si rivolge ${PUBLIC_NAME}?`,
      a: [
        'Alle piattaforme che mettono in contatto aziende e vogliono una presentazione solo dove entrambe le parti la vogliono, e agli acquirenti e ai fornitori che vi si trovano. Una piattaforma lo aggiunge con uno script e un elemento nella sua pagina.',
        'Il primo spazio è dedicato ai minerali industriali. Funziona come istanza di prova con dati sintetici; nessuna persona e nessuna organizzazione reale lo usa ancora.',
      ],
    },
  ],
  terms: {
    title: 'I termini',
    lede: `Le parole che ${PUBLIC_NAME} usa, ognuna con un solo significato, uguale su questo sito, nel widget e nella documentazione.`,
  },
};
