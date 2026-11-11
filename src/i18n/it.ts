/* Le parole del sito in italiano, tradotte dal catalogo inglese en.ts. */
import type { Catalogue } from './en.ts';
import { statusDate } from './status-date.ts';
import { PUBLIC_NAME } from './terms.ts';

/** The day the status sentences were checked, in this language (status-date.ts). */
const AS_OF = statusDate('it');

export const it: Catalogue = {
  site: {
    name: PUBLIC_NAME,
    claim: 'Fiducia tra due aziende prima di conoscersi.',
    skip: 'Vai al contenuto',
    menu: 'Menu',
    toc: 'In questa pagina',
    language: 'Lingua',
    nav: { docs: 'Documentazione', developers: 'Sviluppatori' },
    footer: {
      product: PUBLIC_NAME,
      legal: 'Informazioni legali',
      imprint: 'Note legali',
      privacy: 'Informativa sulla privacy',
      contact: 'Contatti',
      contactPending: `I recapiti sono in preparazione, quindi questo sito non indica ancora alcun indirizzo e non ha un modulo di contatto.`,
      line: 'Questo sito non imposta cookie, non carica nulla da terze parti e non usa strumenti di analisi.',
    },
    synthetic: 'Tutto ciò che è descritto in questo sito riguarda il contratto della Space API e ciò che gira sullo spazio di prova sintetico, con dati sintetici. Nessuna persona reale e nessuna organizzazione reale lo usa ancora.',
  },

  developers: {
    title: 'Per gli sviluppatori: incorporare il widget o costruire sulla Space API',
    description: 'Dove si trova la documentazione di Connect, l’incorporamento più breve, un breve esempio SDK per il Suo server e cosa manca ancora: pacchetti npm e MCP.',
    eyebrow: 'Per gli sviluppatori',
    h1: ['Uno script,', 'o la Sua interfaccia.'],
    lede: `Due modi di costruire con uno spazio: l’incorporamento, uno script e un elemento sulla Sua pagina, oppure la Sua interfaccia sulla Space API tramite l’SDK, un client tipizzato dal contratto. La documentazione di Connect mostra entrambi. Al ${AS_OF} si trova nel repository di Connect, che non è ancora pubblico.`,
    toc: [['embed', 'L’incorporamento più breve'], ['sdk', 'L’SDK sul Suo server'], ['docs', 'La documentazione'], ['not-yet', 'Non ancora disponibile']] as [string, string][],
    embed: {
      title: 'L’incorporamento più breve',
      lede: 'Lo inserisca dove deve comparire il modulo: la Sua chiave pubblicabile nell’elemento e l’indirizzo del Suo spazio nello script.',
      url: 'EMBED_URL sta per questo indirizzo, sull’istanza propria del Suo spazio; non esiste un host centrale:',
      notes: [
        'La modalità è describe, board, watch o mine; il lato è seeking o offer. Senza lingua il widget segue il browser del visitatore.',
        'La chiave pubblicabile funziona solo sulle origini consentite dal Suo spazio. Una chiave segreta non va mai in una pagina: con essa il widget si rifiuta di partire.',
        `Al ${AS_OF}, l’istanza dello spazio di prova sintetico serve la versione 0.6.1-v1 del widget.`,
      ],
    },
    sdk: {
      title: 'L’SDK sul Suo server',
      lede: 'Una volta, dal Suo server, con la chiave segreta: registra il Suo ricevitore di webhook e restituisce il segreto di firma, mostrato solo questa volta.',
      notes: [
        `Al ${AS_OF} l’SDK non è su npm. Si usa da un clone del repository di Connect, dove è un pacchetto del workspace.`,
        `Il test di questo esempio gira contro un sostituto, non contro uno spazio. Al ${AS_OF} lo spazio di prova non invia webhook.`,
      ],
    },
    docs: {
      title: 'La documentazione',
      lede: `Generata su questo sito dall’esportazione open core del repository di Connect, in inglese. Al ${AS_OF} il repository stesso è privato e nulla è pubblicato.`,
      sections: {
        quickstart: { name: 'Avvio rapido (5 minuti)', body: 'Un tag script, la tua chiave pubblicabile e l’origine della tua pagina; poi l’avvio rapido completo e il percorso di una persona attraverso l’API.' },
        widget: { name: 'Widget', body: 'Ogni attributo dell’embed, il wrapper React e ricette per HTML semplice, Astro, Next.js e WordPress.' },
        sdk: { name: 'SDK', body: 'I client tipizzati per il tuo server e per il lato della persona, e il controllo della firma dei webhook.' },
        cli: { name: 'CLI', body: 'Il comando linkbot: provare il widget sul proprio computer, inserirlo nel proprio sito, verificare la configurazione. Non ancora pubblicato.' },
        protocol: { name: 'Protocollo', body: 'Il contratto della Space API, i tre passi che rispetta e chi detiene quale chiave.' },
        api: { name: 'Riferimento API', body: 'Ogni rotta della Space API, generata dal contratto.' },
        open: { name: 'Cosa è aperto, cosa è ospitato', body: 'Ciò che una piattaforma gestisce da sé e ciò che resta al servizio ospitato.' },
      },
    },
    notYet: {
      title: 'Non ancora disponibile',
      items: [
        `Pacchetti npm: l’SDK, il wrapper React e i pacchetti Next.js e Astro non sono pubblicati al ${AS_OF}. Oggi girano da un clone del repository di Connect.`,
        'MCP: previsto, non costruito. Non c’è alcun endpoint MCP da usare.',
        `Il repository stesso: è privato al ${AS_OF}.`,
        'Uno spazio su cui provarlo: non ne viene ancora offerto nessuno agli sviluppatori. Gli esempi girano contro un esempio locale o un sostituto.',
      ],
    },
  },

  status: {
    title: 'Stato: cosa gira sullo spazio di prova, cosa è realizzato, cosa è previsto',
    description: `Dove si trova ogni parte di ${PUBLIC_NAME}, secondo la lista di controllo del sito: sullo spazio di prova sintetico, realizzata ma non in esecuzione lì, o prevista.`,
    eyebrow: 'Stato',
    h1: ['A che punto è,', 'parte per parte.'],
    lede: `Controllato il ${AS_OF} con il rapporto di stato dello spazio di prova e il piano di Connect. Questa pagina è generata dalla lista di controllo del sito, quindi non dice nulla che quella lista non dica.`,
    states: {
      test: { title: 'Sullo spazio di prova', lead: 'Dati sintetici, in tedesco e inglese.' },
      built: { title: 'Realizzato o nel contratto, non sullo spazio di prova', lead: 'Non gira lì e non è pubblicato.' },
      planned: { title: 'Previsto, non realizzato', lead: 'Nessuna data promessa.' },
    },
    items: {
      form: 'Descrivere una richiesta o un’offerta tramite modulo, con l’avviso sull’identità dove lo spazio ne ha uno',
      text: 'Descrivere una richiesta o un’offerta con parole proprie, lette da regole fisse senza un modello',
      board: 'La bacheca, con i valori resi meno precisi dallo spazio, che elenca solo ciò per cui il proprietario ha dato il consenso',
      watches: 'Le ricerche aperte; le loro email vanno a una casella di prova e non raggiungono nessuno',
      control: 'Impostazioni, origin, chiavi e funnel di uno spazio, tramite la Space API',
      confirm: 'Confermare; il browser che ha confermato gestisce ciò che ha creato',
      matching: 'Corrispondenza con un verdetto per criterio',
      gates: 'Gate e approvazione da parte di un operatore identificato',
      introductions: 'Presentazioni in modalità operatore, con ricevute',
      outcomes: 'Esiti, modifiche, messa in pausa e chiusura',
      deletion: 'Cancellazione con il registro delle cancellazioni dell’istanza',
      widget: 'Il widget, servito dall’istanza stessa da una release fissata (0.6.1-v1)',
      webhooks: 'Webhook verso il server della piattaforma: nel contratto, e l’SDK ne controlla le firme; lo spazio di prova non li invia',
      mail: 'Email che raggiunge una casella reale; le email dello spazio di prova vanno a una casella di prova',
      sdk: 'L’SDK e il wrapper React, nel repository di Connect; non pubblicati su npm',
      console: 'La console per il team di una piattaforma; non pubblicata',
      recipes: 'Ricette per WordPress, Next.js e Astro; girano in CI su una build di esempio e non sono pubblicate come pacchetti',
      reader: 'Un modello che legge il testo, accanto alle regole fisse; attende una policy di lettura approvata',
      mcp: 'MCP, perché un agente IA prepari e una persona confermi; previsto, non c’è alcun endpoint',
      demo: 'Una demo del widget su questo sito; attende uno spazio demo con dati sintetici',
    },
    source: 'La fonte di ogni riga è in docs/truth-check.md, nel repository di questo sito.',
    link: 'Lo stato, parte per parte',
  },
  changelog: {
    title: `Novità: i passi del prodotto ${PUBLIC_NAME}, datati`,
    description: `Ogni passo di ${PUBLIC_NAME} che un cliente può notare, datato e con il suo stato: sullo spazio di prova sintetico, oppure realizzato e non ancora disponibile.`,
    eyebrow: 'Novità',
    h1: ['Che cosa è cambiato,', 'passo dopo passo.'],
    lede: 'Una voce per ogni passo del prodotto che un cliente può notare, la più recente per prima. Ognuna dice se gira sullo spazio di prova sintetico o se è realizzata e non ancora disponibile. Niente di tutto ciò è ancora pubblicato per utenti reali.',
    states: { test: 'Sullo spazio di prova', built: 'Realizzato, non ancora disponibile' },
    note: 'Ogni voce proviene da un file nel repository di questo sito che indica le pull request su cui si basa; una voce senza di esse ferma la build.',
    link: 'Novità',
  },

  privacy: {
    title: `Informativa sulla privacy · ${PUBLIC_NAME}`,
    description: 'L’informativa sulla privacy di questo sito è in preparazione. Già vero: il sito non imposta cookie, non carica nulla da terze parti e non usa analisi.',
    eyebrow: 'Informativa sulla privacy',
    h1: 'In preparazione',
    lede: 'L’informativa sulla privacy di questo sito è in fase di stesura e revisione. Comparirà qui una volta pubblicata. Fino ad allora non viene mostrato nulla, perché un testo legale non può essere redatto a tentativi.',
    released: { description: `L’informativa sulla privacy del sito di ${PUBLIC_NAME}: cosa tratta il sito, perché, su quale base giuridica, e i diritti degli interessati.` },
    facts: {
      title: 'Cosa è già vero di questo sito',
      items: [
        'Non imposta cookie e non usa strumenti di analisi né tracciamento.',
        'Non carica nulla da terze parti: i caratteri e le immagini provengono da questo sito.',
        'Non ha account e non invia da nessuna parte nulla di ciò che si digita: i campi della pagina iniziale funzionano solo nel browser, e il sito non salva nulla.',
        'Il prodotto gira sulle pagine di una piattaforma, sotto l’informativa dati di quella piattaforma, accanto alle righe fisse del widget.',
      ],
    },
  },

  imprint: {
    title: `Note legali · ${PUBLIC_NAME}`,
    description: `Le note legali del sito di ${PUBLIC_NAME}: dati del fornitore e contatti. Il testo è in preparazione.`,
    eyebrow: 'Note legali',
    h1: 'In preparazione',
    lede: 'Le note legali (fornitore, indirizzo, rappresentanti, registro e dati fiscali, contatti) sono in preparazione e compariranno qui una volta confermate. Fino ad allora non viene mostrato nulla, perché nulla di esse può essere inventato.',
    released: { description: `Le note legali del sito di ${PUBLIC_NAME}: fornitore, indirizzo, rappresentanti, registro e dati fiscali, e contatti.` },
  },

  contact: {
    title: `Contatti · ${PUBLIC_NAME}`,
    description: `Come contattare ${PUBLIC_NAME}. I contatti sono in preparazione: questa pagina indicherà l’indirizzo non appena la sua casella esisterà.`,
    eyebrow: 'Contatti',
    h1: 'In preparazione',
    released: { h1: 'Come scriverci', description: `Come contattare ${PUBLIC_NAME}: l’indirizzo a cui scrivere per una domanda su ${PUBLIC_NAME} o su uno spazio sulla propria piattaforma.` },
    write: 'L’indirizzo è {email}.',
  },

  notFound: {
    title: `Pagina non trovata · ${PUBLIC_NAME}`,
    description: 'Questa pagina non esiste. Vada alla pagina iniziale o legga il sito in un’altra lingua.',
    eyebrow: 'Pagina non trovata',
    h1: 'Non c’è nulla qui.',
    lede: 'La pagina potrebbe essere stata spostata.',
    home: 'Vada alla pagina iniziale',
    languages: 'Questo sito in altre lingue',
  },
};
