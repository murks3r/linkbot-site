/* it: the home's words (src/front/copy.ts); the page's sentences are the site's. Not yet read by a native speaker
   (docs/truth-check.md). */
import type { FrontCopy } from '../copy.ts';
import { PUBLIC_NAME } from '../../i18n/terms.ts';

export const it: FrontCopy = {
  landing: {
    meta: {
      title: `${PUBLIC_NAME} per sviluppatori: fiducia prima di conoscersi, nella sua piattaforma`,
      description: `Integri ${PUBLIC_NAME} con uno script e un elemento, o costruisca la sua interfaccia sulla Space API. Provi «entrambi dicono sì» con due aziende inventate.`,
    },
    opening: {
      h1: 'Fiducia prima di conoscersi, integrata nella sua piattaforma.',
      sub: {
        today: `${PUBLIC_NAME} conferma ogni parte, cerca la corrispondenza in privato e presenta due aziende solo quando entrambe dicono sì.`,
        full: `${PUBLIC_NAME} controlla chi è reale, cerca la corrispondenza in privato e presenta due aziende solo quando entrambe dicono sì.`,
      },
      start: 'Inizi in 5 minuti',
      docs: 'Legga la documentazione',
    },
    trial: {
      h2: 'Lo provi: un acquirente, un fornitore',
      label: 'Dati di esempio inventati · funziona nel suo browser, non viene inviato nulla',
      steps: ['Controllo', 'Corrispondenza in privato', 'Entrambe dicono sì'],
      progress: 'Passi',
      buyer: { role: 'Acquirente', name: 'Northfield Fittings', wants: 'Cerca', text: 'Alloggiamenti in alluminio, 5.000 all’anno, ISO 9001, consegna nell’UE' },
      supplier: { role: 'Fornitore', name: 'Lakeside Castings', wants: 'Offre', text: 'Pezzi in alluminio pressofuso da 1.000 unità, ISO 9001, spedizione in tutta l’UE' },
      hidden: 'Nome nascosto',
      email: 'Indirizzo email',
      check: {
        title: 'Ogni parte conferma il proprio contatto',
        p: 'Ogni parte conferma che cosa ha chiesto e apre un link inviato al suo indirizzo email. Prima della conferma non viene salvato nulla.',
        pending: 'Non ancora confermato',
        done: 'Confermato tramite un link',
        button: 'Confermare',
        next: 'Cercare una corrispondenza',
      },
      match: {
        title: 'Una possibile corrispondenza, senza nomi',
        p: `${PUBLIC_NAME} confronta le due parti criterio per criterio. Ogni parte vede i verdetti, mai il nome o il contatto dell’altra.`,
        card: 'Possibile corrispondenza',
        criteria: [
          { label: 'Materiale', value: 'Alluminio', verdict: 'meets' },
          { label: 'Quantità', value: '5.000 all’anno; da 1.000 unità', verdict: 'meets' },
          { label: 'Certificato', value: 'ISO 9001', verdict: 'meets' },
          { label: 'Consegna', value: 'Nell’UE', verdict: 'meets' },
          { label: 'Processo', value: 'Pressofusione; la richiesta non lo dice', verdict: 'unknown' },
        ],
        verdicts: { meets: 'Corrisponde', partly: 'Corrisponde in parte', conflicts: 'Contraddice', unknown: 'Sconosciuto' },
        approved: 'Una persona designata della piattaforma ha approvato questa possibile corrispondenza. L’approvazione non rivela nulla.',
        next: 'Chiedere a entrambe le parti',
      },
      yes: {
        title: 'Entrambe dicono sì, o nessuno sa nulla',
        p: 'Ogni parte risponde per conto suo. Finché entrambe non dicono sì, nessuna sa chi è l’altra.',
        ask: { buyer: 'Essere presentato a questo fornitore?', supplier: 'Essere presentato a questo acquirente?' },
        yes: 'Sì',
        no: 'No',
        waiting: 'Sì. In attesa dell’altra parte, che non vede questa risposta.',
        said: 'No.',
        introduced: 'Presentate. Entrambe hanno detto sì; solo ora i nomi e gli indirizzi email vengono condivisi.',
        mode: 'Qui come presentazione diretta; una piattaforma può fare la presentazione anche tramite il proprio team.',
        declined: 'Nessuna presentazione. Una parte ha detto no, quindi nessuna sa chi è l’altra.',
        reset: 'Ricominciare',
      },
    },
    embed: {
      h2: 'L’integrazione più breve',
      p: 'Uno script e un elemento sulla sua pagina; le domande si adattano al suo mercato.',
      hosted: 'Accesso ospitato per altre piattaforme',
      developers: 'Per sviluppatori',
      docs: 'Tutta la documentazione',
    },
    bottom: {
      h2: `Non sviluppa software? Che cos’è ${PUBLIC_NAME}, in parole semplici.`,
      button: 'Lo legga su sensalio.de',
      line: 'Tutto ciò che si vede qui funziona con dati fittizi; controllato il {date}.',
      status: 'Lo stato completo',
    },
    labels: { live: 'Live', soon: 'Prossimamente' },
  },
};
