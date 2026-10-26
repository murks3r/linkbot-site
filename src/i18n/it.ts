/* Le parole del sito in italiano, tradotte dal catalogo inglese en.ts. */
import type { Catalogue, Section, Status } from './en.ts';
import { statusDate } from './status-date.ts';

/** The day the status sentences were checked, in this language (status-date.ts). */
const AS_OF = statusDate('it');

export const it: Catalogue = {
  site: {
    name: 'Linkbot',
    claim: 'Uno strato di corrispondenza che ogni piattaforma può integrare.',
    skip: 'Vai al contenuto',
    menu: 'Menu',
    toc: 'In questa pagina',
    language: 'Lingua',
    nav: { how: 'Come funziona', sees: 'Chi vede cosa', platforms: 'Per le piattaforme', verticals: 'Per i verticali', integrations: 'Integrazioni', developers: 'Sviluppatori' },
    footer: {
      product: 'Linkbot',
      legal: 'Informazioni legali',
      imprint: 'Note legali',
      privacy: 'Informativa sulla privacy',
      contact: 'Contatti',
      contactPending: 'I recapiti arriveranno con il nostro dominio. Linkbot non ha ancora un dominio proprio, quindi questo sito non indica alcun indirizzo e non ha un modulo di contatto.',
      line: 'Questo sito non imposta cookie, non carica nulla da terze parti e non usa strumenti di analisi.',
    },
    status: { now: 'Sullo spazio di staging', contract: 'Nel contratto, non sullo spazio di staging', later: 'Non realizzato' },
    synthetic: 'Tutto ciò che è descritto in questo sito riguarda il contratto della Space API e ciò che gira sullo spazio di staging sintetico di Geoprocure, con dati sintetici. Nessuna persona reale e nessuna organizzazione reale lo usa ancora.',
    more: 'Leggi di più',
  },

  home: {
    h1: ['Le richieste incontrano le offerte.', 'Decidono le persone.'],
    lede: 'Linkbot è uno strato di corrispondenza che una piattaforma integra nelle proprie pagine. Uno spazio per mercato. Richieste e offerte come criteri confermati. Un verdetto per criterio, mai un punteggio. Una presentazione solo dopo che entrambe le parti hanno detto sì.',
    actions: { how: 'Come funziona', platforms: 'Per le piattaforme' },
    flow: {
      label: 'Da una richiesta a una presentazione',
      steps: [
        { name: 'Descrizione', note: 'una richiesta o un’offerta, tramite modulo' },
        { name: 'Conferma', note: 'prima non viene salvato nulla' },
        { name: 'Corrispondenza', note: 'un verdetto per criterio' },
        { name: 'Approvazione', note: 'un operatore identificato, dopo i gate' },
        { name: 'Doppio sì', note: 'ogni parte per sé' },
        { name: 'Presentazione', note: 'allora, e solo allora' },
      ],
    },
    pillars: [
      { title: 'Uno spazio per mercato.', body: 'Uno spazio è un mercato su una piattaforma, con la propria istanza, il proprio database e le proprie chiavi. Un pack gli dà il vocabolario del suo verticale: i criteri, le opzioni, le unità, le domande. Il primo spazio è quello di Geoprocure, per i minerali industriali.' },
      { title: 'Criteri, confermati.', body: 'Una richiesta o un’offerta è un insieme di criteri, ciascuno con la propria fonte e la propria importanza. Nulla è preselezionato, nulla è indovinato e ciò che non è dichiarato resta sconosciuto. La persona conferma il modulo; solo allora viene salvato qualcosa.' },
      { title: 'Una presentazione solo dopo il sì di entrambi.', body: 'La corrispondenza confronta i criteri salvati e mostra un verdetto per criterio. Una presentazione richiede i gate dello spazio, l’approvazione di un operatore identificato e un sì da entrambe le parti. Il server la crea allora, e rifiuta ogni altra via.' },
    ],
    rules: {
      title: 'Le regole, applicate dal server',
      items: [
        'Mai indovinare: ogni valore salvato porta la propria fonte, e «Altro» non viene mai mappato sull’opzione più vicina.',
        'Nulla di preselezionato: il modulo non ha valori predefiniti, solo suggerimenti indicati come tali.',
        'Lo sconosciuto resta sconosciuto: un criterio che una parte non ha dichiarato non viene mai contato come corrispondenza.',
        'Nulla viene salvato prima che una persona confermi.',
        'Una corrispondenza non rivela nulla: solo verdetti, alla fase consentita dal pack, e un avviso che decidono le persone.',
        'Nessuna presentazione senza i gate, l’approvazione di un operatore identificato e un sì da entrambe le parti.',
        'Nessun modello prevale su una condizione rigida: Indispensabile e Mai sono decisi da codice deterministico.',
        'Ogni scrittura indica chi l’ha fatta e compare nel registro di audit.',
      ],
      link: 'Come funziona la corrispondenza, passo per passo',
    },
  },

  how: {
    title: 'Come funziona Linkbot: da una richiesta confermata a una presentazione',
    description: 'Uno spazio, un pack, quattro modi per dire richiesta o offerta, un verdetto per criterio, l’approvazione di un operatore, la presentazione dopo il doppio sì.',
    eyebrow: 'Come funziona',
    h1: ['Da una richiesta confermata', 'a una presentazione.'],
    lede: 'Ogni passaggio qui sotto è nel contratto della Space API. Dove lo spazio di staging non esegue ancora un passaggio, la pagina lo dice.',
    toc: [['blocks', 'Tre elementi'], ['rule', 'Il sì di entrambe le parti'], ['path', 'Il percorso in sei passaggi'], ['space', 'Uno spazio'], ['pack', 'Un pack'], ['describe', 'Quattro modi per descrivere'], ['confirm', 'Confermare'], ['matching', 'Corrispondenza'], ['approval', 'Approvazione e gate'], ['yes', 'Doppio sì'], ['introduction', 'La presentazione'], ['after', 'In seguito'], ['sees', 'Chi vede cosa'], ['languages', 'Cinque lingue'], ['today', 'Cosa gira sullo spazio di staging']] as [string, string][],
    blocks: {
      title: 'Tre elementi',
      lede: 'Uno spazio è fatto di tre parti. Ognuna è un gruppo di rotte del contratto della Space API.',
      items: [
        { name: 'Raccolta', text: 'Un acquirente o un fornitore descrive un fabbisogno o un’offerta, con il modulo o con parole proprie, controlla ogni valore e conferma. Prima della conferma non viene salvato nulla, e il server controlla ogni valore rispetto al pack dello spazio.' },
        { name: 'Monitoraggio', text: `Un monitoraggio tiene aperto un fabbisogno o un’offerta confermati e avvisa solo il titolare quando qualcosa di nuovo corrisponde, per e-mail o webhook. Il titolare lo mette in pausa o lo termina quando vuole, anche da un link. Al ${AS_OF}, le e-mail di monitoraggio dello spazio di staging vanno a una casella di prova e non raggiungono nessuno, e non invia ancora webhook.` },
        { name: 'Presentazioni', text: 'Quando entrambe le parti hanno detto sì e un operatore con nome ha approvato, il server presenta le due parti e dà a ciascuna una ricevuta di chi può vedere quali campi. In seguito a entrambe le parti viene chiesto l’esito.' },
      ],
    },
    rule: {
      title: 'Nessuna presentazione senza il sì di entrambe le parti',
      paras: [
        'La corrispondenza trova possibili abbinamenti; non presenta nessuno. Ogni parte risponde a un possibile abbinamento per conto proprio. Prima che entrambe abbiano detto sì, l’altra parte non viene a sapere nulla, e un no successivo revoca un sì.',
        'Lo spazio richiede inoltre l’approvazione di un operatore con nome dopo i controlli che stabilisce. Il server crea una presentazione solo quando ci sono tutte e tre, in qualsiasi ordine, e rifiuta ogni altra via.',
      ],
    },
    path: { title: 'Il percorso in sei passaggi', lede: 'I sei passaggi della pagina demo, e chi agisce in ciascuno.', link: 'La pagina demo' },
    space: {
      title: 'Uno spazio è un mercato su una piattaforma',
      paras: [
        'Ogni spazio è un’istanza a sé: la propria applicazione, il proprio database, le proprie chiavi e il proprio registro delle cancellazioni. L’indirizzo dell’istanza identifica lo spazio; nessun id di spazio compare in un percorso.',
        'Uno spazio viene configurato con un pack e una sua versione, le lingue che offre, la modalità delle sue presentazioni, i gate che richiede e le origin su cui sono consentite le sue pagine. La pagina della piattaforma contiene una Publishable Key, che identifica solo lo spazio e funziona solo su quelle origin. La Secret Key resta sul server della piattaforma e non compare mai in una pagina.',
        'La corrispondenza avviene dentro uno spazio. Da esso non esce nulla: nessuna richiesta, nessuna offerta e nessuna corrispondenza viene condivisa con un altro spazio.',
        'Il primo spazio è quello di Geoprocure, per i minerali industriali. Gira su un’istanza di staging sintetica con dati sintetici.',
      ],
    },
    pack: {
      title: 'Un pack è il vocabolario di un verticale',
      paras: [
        'Un pack elenca i criteri che una richiesta e un’offerta possono indicare, ciascuno con il suo controllo: una scelta, più scelte, un numero con un’unità, un intervallo, una finestra di date, un elenco cercabile come i porti, o testo libero. Quando una quantità dipende da una base, il pack lo dice, e «Non so» lascia la base sconosciuta invece di sceglierne una.',
        'Il pack indica quali risposte speciali un criterio consente: «Altro / non in elenco», che conserva le parole della persona e non viene mai mappato su un’opzione; «Non so»; e «Qualsiasi». Porta con sé etichette, domande, sinonimi e avvisi nelle lingue dello spazio.',
        'Stabilisce anche cosa ogni criterio rivela a ogni fase: sulla bacheca, in una possibile corrispondenza, in una presentazione o solo al team della piattaforma; come un valore viene reso meno preciso per la bacheca; quali importanze un criterio consente; e i gate e le categorie di esito del mercato.',
        'Uno spazio fissa una versione del proprio pack, e il server convalida ogni invio rispetto a quella versione. Il client non viene mai considerato attendibile.',
      ],
    },
    describe: {
      title: 'Quattro modi per indicare una richiesta o un’offerta',
      lede: `Al ${AS_OF}, il modulo, il testo, la bacheca e i monitoraggi girano sullo spazio di staging. I webhook lì non girano ancora, e le sue email vanno a una casella di prova che non raggiunge nessuno.`,
      items: [
        { name: 'Tramite modulo', status: 'now' as Status, paras: [
          'Il modulo viene generato dal pack. I criteri richiesti vengono prima; il resto sta dietro «ulteriori dettagli». Nulla è preselezionato: nessuna opzione, nessuna unità, nessuna base, nessun tipo di parte. Ogni elenco offre «Altro / non in elenco», «Non so» e «Qualsiasi» dove il pack li consente.',
          'Ogni criterio porta un’importanza. Indispensabile e Mai sono rigide; Preferibile, Accettabile e Meglio di no sono morbide. Il pack può suggerirne una, indicata come «suggerita», e la persona può cambiarla a meno che il pack non la blocchi. Scegliere Mai chiede una conferma separata.',
        ] },
        { name: 'Con parole proprie', status: 'now' as Status, paras: [
          'Una persona scrive ciò di cui ha bisogno o ciò che offre. Una lettura propone valori per gli stessi criteri, ognuno mostrato accanto alle parole da cui proviene, e chiede dove non sa decidere: un’unità, un’opzione, un numero che due convenzioni leggono in modo diverso. Una lettura non sovrascrive mai ciò che una persona ha scelto; una differenza diventa una domanda.',
          'Sullo spazio di staging il testo viene letto da regole fisse, senza un modello; un lettore con un modello attende una policy di lettura approvata. Qualunque sia il lettore del testo, le condizioni rigide restano al codice deterministico: nessun modello prevale su un Indispensabile o su un Mai.',
        ] },
        { name: 'Sulla bacheca', status: 'now' as Status, paras: [
          'La bacheca elenca richieste e offerte il cui proprietario ha dato il consenso, mai per impostazione predefinita. Mostra solo i campi che il pack consente alla fase bacheca, resi meno precisi come dichiara il pack, e mai chi ha pubblicato. Rispondere a un annuncio avvia una bozza dall’altra parte, nello stesso modulo.',
        ] },
        { name: 'Con un monitoraggio', status: 'now' as Status, paras: [
          'Un monitoraggio tiene aperta una richiesta o un’offerta e avvisa il suo proprietario quando qualcosa di nuovo corrisponde, via email o, per la piattaforma, via webhook. Notifica solo il suo proprietario e non rivela mai più della bacheca. Una persona può metterlo in pausa, riprenderlo o chiuderlo, anche dal link in un messaggio.',
        ] },
      ],
    },
    confirm: {
      title: 'Confermare è la prima cosa che viene salvata',
      paras: [
        'Prima che una persona confermi, nulla di personale viene salvato: descrivere, rispondere e convalidare non lasciano nulla dietro di sé. Il widget lo dice sopra il pulsante di conferma: «Niente viene usato finché Lei non conferma.» Una bozza vive nella scheda del browser e scompare quando la scheda si chiude.',
        'Il passaggio di conferma è il modulo. Il server convalida ogni valore rispetto al pack fissato e indica ogni campo che non passa. Cosa viene salvato: i criteri con i loro valori, fonti e importanze; la parte, una persona o un’organizzazione con un nome visualizzato facoltativo; e, se indicato, un indirizzo email, che la persona conferma tramite un link.',
        'Il browser che ha confermato gestisce ciò che ha creato: mostra «Le mie richieste e offerte», risponde alle possibili corrispondenze e modifica il monitoraggio, per sessanta giorni dall’ultimo uso e solo in quella scheda. Un nuovo browser ottiene di nuovo accesso tramite un link inviato all’indirizzo confermato.',
        'In uno spazio con un controllo della parte, come quello di Geoprocure, il passaggio di conferma mostra l’avviso dello spazio. La persona spunta da sé il consenso a rivelare la propria identità per quel controllo; nulla è spuntato in anticipo, e una conferma senza di esso viene rifiutata.',
      ],
    },
    matching: {
      title: 'Corrispondenza: un verdetto per criterio, mai un punteggio',
      paras: [
        'La corrispondenza gira sui valori salvati con regole deterministiche, dopo una conferma, dopo una modifica e una volta al giorno. Confronta i requisiti della richiesta con i fatti dichiarati dall’offerta.',
        'Per ogni criterio che il pack le consente di confrontare, una corrispondenza mostra un verdetto: corrisponde, corrisponde in parte, contraddice o sconosciuto, con la regola che lo ha deciso e i valori salvati che cita. Un limite rispettato corrisponde, un intervallo a cavallo del limite corrisponde in parte, un limite mancato contraddice. «Qualsiasi» sulla richiesta corrisponde. «Non so» o «Altro» su uno dei due lati è sconosciuto, e lo sconosciuto non è mai una corrispondenza.',
        'Se una coppia possa essere una corrispondenza dipende solo dalle condizioni rigide, Indispensabile e Mai. Nient’altro cambia ciò che vede l’altra parte. Non c’è alcun punteggio.',
        'Una possibile corrispondenza non rivela nulla di per sé: solo i verdetti sui campi che il pack consente alla fase di corrispondenza, e un avviso fisso che decidono le persone. Quando una richiesta o un’offerta ha avuto molte nuove corrispondenze in poco tempo, lo spazio trattiene le altre e un’esecuzione successiva le propone.',
      ],
    },
    approval: {
      title: 'Approvazione e gate: una persona identificata, mai il sistema',
      paras: [
        'Ogni caso viene approvato da un operatore identificato e attivo della piattaforma. Prima di ciò, ogni gate richiesto dallo spazio deve essere registrato come superato da un operatore identificato. Un gate non viene mai deciso dal sistema: l’operatore registra un controllo svolto altrove, con un riferimento e senza dati personali.',
        'Il gate richiesto da Geoprocure è un controllo KYC e sanzioni. Non può essere derogato. Un operatore può rinviarlo a un legale, il che lo lascia aperto. Decide l’ultima registrazione del gate.',
        'Un’approvazione da sola non rivela nulla. Un caso rifiutato viene registrato come rifiutato; il suo motivo resta nel registro di audit.',
      ],
    },
    yes: {
      title: 'Entrambe le parti dicono sì, ognuna per sé',
      paras: [
        'Ogni parte risponde a una possibile corrispondenza per il proprio lato: sì, no o non ora. Prima che entrambe abbiano detto sì, l’altra parte non apprende nulla della risposta. Conta l’ultima risposta, quindi un no successivo revoca un sì.',
        'Il server crea la presentazione da sé nel momento in cui l’ultima delle tre condizioni è soddisfatta, in qualsiasi ordine: i gate superati, il caso approvato, il sì di entrambe le parti. Rifiuta ogni altra via.',
      ],
    },
    introduction: {
      title: 'La presentazione, nella modalità scelta dallo spazio',
      paras: [
        'In modalità operatore, l’impostazione predefinita di Geoprocure, i campi alla fase di presentazione vanno solo al team della piattaforma: i nomi visualizzati, gli indirizzi email confermati, i criteri che il pack conserva per questa fase. Ogni parte riceve una ricevuta che dice che entrambe hanno acconsentito e che la piattaforma le contatterà, e che non contiene nulla dell’altra parte.',
        'In modalità diretta, ogni parte vede i campi dell’altra parte alla fase di presentazione. Il team della piattaforma vede entrambi. Un campo che il pack riserva all’operatore non raggiunge mai l’altra parte.',
        'Una ricevuta registra chi può vedere quali campi, e ogni lettura di una presentazione viene registrata su di essa. Ciò che non è nella ricevuta non viene mai rivelato in seguito.',
      ],
    },
    after: {
      title: 'In seguito: esiti, modifiche, cancellazione',
      paras: [
        'A entrambe le parti viene chiesto l’esito dopo trenta, sessanta e novanta giorni; anche il team della piattaforma può registrarlo. Le categorie provengono dalle impostazioni dello spazio.',
        'Una persona può modificare una richiesta o un’offerta confermata tramite lo stesso modulo, metterla in pausa, riprenderla o chiuderla. Ogni modifica fa girare di nuovo la corrispondenza.',
        'Una persona può chiedere la cancellazione dei propri dati dal browser che ha confermato; la richiesta deve essere confermata tramite un link inviato a un indirizzo confermato in precedenza. La piattaforma può cancellare per conto di una persona, con un riferimento. Cosa viene eliminato: il nome visualizzato, gli indirizzi, ogni criterio e consenso, i verdetti delle loro corrispondenze, i loro token e la loro posta. Cosa resta: id, chiavi di campo, date e stati, così le ricevute e il registro di audit restano coerenti. Ogni cancellazione viene scritta nel registro delle cancellazioni dell’istanza, e nulla dichiara di recuperare copie che hanno lasciato l’istanza.',
      ],
    },
    sees: {
      title: 'Chi vede cosa, fase per fase',
      lede: 'Il pack assegna a ogni criterio una fase. Una fase è il punto più lontano che un valore raggiunge: una corrispondenza non mostra più di quanto la sua fase consenta, e un monitoraggio non rivela mai più della bacheca.',
      stages: [
        { name: 'Bacheca', who: 'Chiunque possa vedere la bacheca', what: 'Solo i campi alla fase bacheca, resi meno precisi come dichiara il pack, solo per richieste e offerte il cui proprietario ha dato il consenso. Mai chi ha pubblicato.' },
        { name: 'Corrispondenza', who: 'Le due parti di una possibile corrispondenza', what: 'Verdetti sui campi alla fase di corrispondenza o inferiore, con la regola e i valori che cita. Nessun nome, nessun recapito, nessun segno della risposta dell’altra parte.' },
        { name: 'Presentazione', who: 'In modalità operatore il team della piattaforma; in modalità diretta entrambe le parti', what: 'Nome visualizzato, indirizzo email confermato e i criteri che il pack conserva per questa fase. Ogni lettura viene registrata sulla ricevuta.' },
        { name: 'Operatore', who: 'Solo il team della piattaforma', what: 'Campi che il pack riserva alla piattaforma, come i dettagli di identità per un controllo KYC. Non raggiungono mai l’altra parte, e ogni accesso viene registrato.' },
      ],
    },
    languages: {
      title: 'Cinque lingue, e nessuna traduzione delle Sue parole',
      paras: [
        'Il widget gira in inglese, tedesco, spagnolo, italiano e francese. La pagina imposta la lingua, poi il browser del visitatore, poi l’impostazione predefinita dello spazio; una lingua che lo spazio non offre ricade su un’altra, e il widget lo dice a schermo.',
        'La Space API risponde nella lingua richiesta, o in quella predefinita dello spazio, e dice quale. Etichette, domande, spiegazioni e avvisi arrivano in quella lingua.',
        'Il testo di una persona non viene mai tradotto. La lingua del modulo e la lingua delle parole sono indipendenti.',
      ],
    },
    today: {
      title: 'Cosa gira sullo spazio di staging, e cosa non ancora',
      lede: `Controllato il ${AS_OF} con il rapporto di stato dello spazio di staging e il piano di Connect: quali parti girano lì, con gli stessi quadrati che il prodotto usa come prova.`,
    },
  },

  platforms: {
    title: 'Integrazioni: uno spazio Linkbot sulle Sue pagine',
    description: 'Uno spazio Linkbot sulle Sue pagine: uno script e un elemento, una Publishable Key, la Sua informativa dati, la console per il team, i webhook per il server.',
    eyebrow: 'Integrazioni',
    h1: ['Uno spazio', 'sulle Sue pagine.'],
    lede: 'Uno script e un elemento mostrano il widget nella Sua pagina, con i Suoi font e i Suoi colori. Il Suo team approva i casi in una console sulla Sua macchina o dietro il Suo login. Il Suo server riceve gli eventi tramite webhook firmati.',
    toc: [['pages', 'Ogni integrazione'], ['embed', 'L’embed'], ['keys', 'Chiavi e origin'], ['console', 'La console'], ['server', 'SDK e webhook'], ['recipes', 'Ricette'], ['state', 'A che punto siamo']] as [string, string][],
    embed: {
      title: 'L’embed: uno script, un elemento',
      paras: [
        'Lo script proviene dall’istanza del Suo spazio. L’elemento porta la Sua Publishable Key, la modalità (describe, board o mine), il lato (una richiesta o un’offerta) e la lingua. Più elementi su una pagina sono più widget.',
        'Il widget viene renderizzato in uno shadow root, prende il font e il colore del testo della Sua pagina e imposta tutto il resto tramite variabili CSS sull’elemento. Non richiede «unsafe-inline» in una Content Security Policy.',
        'La Sua informativa dati va dentro l’elemento e compare sopra il pulsante di conferma, accanto alle righe fisse del widget. Il widget non imposta cookie, conserva la bozza e i token nella scheda del browser e non invia nulla a nessuno tranne che al Suo spazio.',
      ],
    },
    keys: {
      title: 'Chiavi e origin',
      paras: [
        'Una Publishable Key identifica il Suo spazio e funziona solo sulle origin consentite dal Suo spazio; sta nella pagina. Una Secret Key sta sul Suo server; il widget rifiuta di avviarsi con una e Le dice di ruotarla.',
        'Le origin consentite vengono impostate quando uno spazio viene predisposto. Dal contratto 0.2.9 la Space API può modificarle, e così anche la console.',
      ],
    },
    console: {
      title: 'La console per il Suo team',
      paras: [
        'La console mostra la coda di approvazione, ogni caso con i suoi gate e la sua approvazione, le presentazioni con le ricevute, gli esiti, gli endpoint webhook e gli operatori. Gira su una Sua macchina o dietro il Suo login; la Secret Key resta sul suo server. Non esiste un login Linkbot per gli operatori.',
        'Le sue schermate per impostazioni e modifiche dei criteri, chiavi, origin e funnel usano le route che la Space API ha dal contratto 0.2.9.',
      ],
    },
    server: {
      title: 'Il Suo server: l’SDK e i webhook',
      paras: [
        `L’SDK dà al Suo server un client tipizzato dal contratto della Space API: una route, un campo o un valore che il contratto non prevede è un errore di tipo. Controlla inoltre le consegne dei webhook esattamente come specifica il contratto. Al ${AS_OF} non è pubblicato; il suo codice è nel repository di Connect.`,
        `I webhook portano id e stati, mai dati di contatto; il Suo server recupera i dettagli con la Sua Secret Key. Le consegne sono firmate e ritentate. Sono nel contratto; al ${AS_OF} lo spazio di staging non le invia.`,
      ],
    },
    recipes: {
      title: 'Ricette: HTML semplice, Astro, Next.js, WordPress',
      paras: [
        'Ogni ricetta è un file che gira nella CI di Connect in tre motori browser contro la build di esempio con dati sintetici: una pagina semplice con una Content Security Policy rigorosa, un componente Astro, una pagina Next.js con il wrapper React e un piccolo plugin WordPress con uno shortcode.',
        `Al ${AS_OF} girano nella CI di Connect contro la build di esempio, non contro uno spazio; l’istanza di staging stessa serve la release 0.5.0-v1 del widget.`,
      ],
    },
    state: { title: 'A che punto siamo' },
  },

  forPlatforms: {
    title: 'Per le piattaforme: cosa ottiene un operatore con uno spazio Linkbot',
    description: 'Per chi vuole uno spazio per il proprio mercato: le quattro vie d’accesso, cosa ottiene una piattaforma e cosa resta suo: i suoi dati e la sua decisione.',
    eyebrow: 'Per le piattaforme',
    h1: ['Il Suo mercato, le Sue pagine,', 'la Sua decisione.'],
    lede: 'Per un operatore che vuole uno spazio per il proprio mercato: come uno spazio raggiunge i Suoi utenti, cosa ottiene e cosa resta Suo. Questa pagina descrive il contratto della Space API e lo spazio di staging sintetico di Geoprocure. Nessuna piattaforma reale gestisce ancora uno spazio, e questa pagina non indica prezzi.',
    toc: [['ways', 'Quattro vie d’accesso'], ['gets', 'Cosa ottiene'], ['yours', 'Cosa resta Suo'], ['details', 'I dettagli']] as [string, string][],
    ways: {
      title: 'Quattro vie d’accesso',
      lede: `Al ${AS_OF}, due di esse girano sullo spazio di staging e due non sono costruite.`,
      items: [
        { name: 'Pagine ospitate', status: 'later' as Status, body: 'Una pagina servita per Lei, da collegare invece di incorporare. Non è costruita. Oggi uno spazio compare solo sulle Sue pagine, tramite l’incorporamento o tramite il Suo server.' },
        { name: 'L’incorporamento', status: 'now' as Status, body: 'Uno script e un elemento sulla Sua pagina. Lo script arriva dall’istanza propria del Suo spazio; l’elemento porta la Sua chiave pubblicabile, che funziona solo sulle origini consentite dal Suo spazio. Le sue modalità: descrizione, bacheca, monitoraggio e i miei. L’istanza di staging serve la versione 0.5.0-v1 del widget.' },
        { name: 'L’API e l’SDK', status: 'now' as Status, body: `Il Suo server parla con la Space API con la chiave segreta, che non compare mai in una pagina: può inserire fabbisogni e offerte, registrare controlli e approvazioni, e leggere presentazioni ed esiti. L’SDK dà al Suo server un client tipizzato dal contratto. Al ${AS_OF} l’SDK non è pubblicato; il suo codice è nel repository di Connect.` },
        { name: 'MCP', status: 'later' as Status, body: 'Previsto, non costruito: un server MCP per spazio, tramite il quale un agente IA prepara un fabbisogno o un’offerta e una persona conferma e risponde. Il titolare ha scelto questa direzione; il suo progetto è proposto e il suo contratto è uno scheletro.' },
      ],
    },
    gets: {
      title: 'Cosa ottiene una piattaforma',
      items: [
        'Uno spazio proprio: un’istanza per un mercato, con il proprio database, le proprie chiavi e il proprio registro delle cancellazioni.',
        'Un pack con il vocabolario del Suo mercato. Il modulo, la lettura del testo, la bacheca e le regole della corrispondenza ne derivano.',
        'Un widget che riprende il carattere e il colore del testo della Sua pagina, con la Sua informativa sui dati sopra il pulsante di conferma.',
        'Corrispondenza con un verdetto per criterio, mai un punteggio, e una presentazione solo dopo il sì di entrambe le parti e l’approvazione del Suo team.',
        `Una console per il Suo team: la coda di approvazione, i casi con i loro controlli, le presentazioni con ricevute e gli esiti. Funziona sul Suo computer o dietro il Suo login. Al ${AS_OF} funziona su un campione con dati sintetici e non è pubblicata.`,
        `Webhook verso il Suo server, con id e stati, mai dati di contatto. Sono nel contratto; al ${AS_OF} lo spazio di staging non li invia.`,
      ],
    },
    yours: {
      title: 'Cosa resta Suo',
      items: [
        'La Sua decisione. Nessuna presentazione avviene senza che un operatore con nome del Suo team la approvi, dopo i controlli fissati dal Suo spazio. Il sistema non decide mai un controllo, e ogni parte dice sì o no per conto proprio.',
        'I Suoi dati. Fabbisogni, offerte e corrispondenze di uno spazio non vengono condivisi con un altro spazio. I webhook non portano dati di contatto; il Suo server recupera i dettagli con la sua chiave segreta.',
        'Le Sue pagine. La Sua informativa sui dati, il Suo carattere e i Suoi colori. Il widget non imposta cookie e non invia nulla a nessuno se non al Suo spazio.',
        'Il Suo login. Il Suo team accede tramite il Suo login; non esiste un login Linkbot per gli operatori.',
      ],
    },
    details: { title: 'I dettagli', lede: 'Le pagine di integrazione mostrano come funziona ogni parte: l’incorporamento, chiavi e origini, la console, l’SDK e i webhook, e ricette per HTML semplice, WordPress, Next.js e Astro.', link: 'Integrazioni' },
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
        `Al ${AS_OF}, l’istanza dello spazio di staging sintetico di Geoprocure serve la versione 0.5.0-v1 del widget.`,
      ],
    },
    sdk: {
      title: 'L’SDK sul Suo server',
      lede: 'Una volta, dal Suo server, con la chiave segreta: registra il Suo ricevitore di webhook e restituisce il segreto di firma, mostrato solo questa volta.',
      notes: [
        `Al ${AS_OF} l’SDK non è su npm. Si usa da un clone del repository di Connect, dove è un pacchetto del workspace.`,
        `Il test di questo esempio gira contro un sostituto, non contro uno spazio. Al ${AS_OF} lo spazio di staging non invia webhook.`,
      ],
    },
    docs: {
      title: 'La documentazione',
      lede: `Nel repository di Connect, sul suo branch di build. Al ${AS_OF} il repository è privato, quindi questi sono percorsi, non link.`,
      items: {
        embed5: { name: 'Incorporare in 5 minuti', body: 'La Sua chiave pubblicabile, l’origine della Sua pagina nella lista consentita, lo snippet e cosa fare se il widget non compare.' },
        quickstart: { name: 'Quickstart per sviluppatori', body: 'Per la Sua interfaccia al posto del widget: una persona descrive, conferma, vede le corrispondenze, dice sì e trova la presentazione, tramite il client ospite dell’SDK. Ha girato solo contro un esempio locale con dati sintetici.' },
        nextjs: { name: 'L’esempio Next.js', body: 'Ogni modalità del widget, e «mine» letto sul server tramite l’SDK. Gira contro un sostituto locale, non contro uno spazio.' },
        astro: { name: 'L’esempio Astro', body: 'Lo stesso in Astro: ogni modalità, e «mine» letto sul server tramite l’SDK. Gira contro un sostituto locale, non contro uno spazio.' },
        embedRef: { name: 'Il riferimento dell’incorporamento', body: 'Ogni attributo dell’elemento, l’informativa sui dati, il tema e una Content Security Policy.' },
        sdkRef: { name: 'Il riferimento dell’SDK', body: 'Il client per il Suo server con la chiave segreta, il client ospite, le chiavi di idempotenza e l’inserimento di dati.' },
        webhooks: { name: 'Webhook', body: 'Registrare un ricevitore, controllare la firma di ogni consegna, i nuovi tentativi e la rotazione. Lo spazio di staging non li invia ancora.' },
      },
      more: 'Come funziona ogni parte, in breve:',
      link: 'Integrazioni',
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
    title: 'Stato: cosa gira sullo staging, cosa è realizzato, cosa è previsto',
    description: 'Dove si trova ogni parte di Linkbot, secondo la lista di controllo del sito: sullo spazio di staging sintetico, realizzata ma non in esecuzione lì, o prevista.',
    eyebrow: 'Stato',
    h1: ['A che punto è,', 'parte per parte.'],
    lede: `Controllato il ${AS_OF} con il rapporto di stato dello spazio di staging e il piano di Connect. Questa pagina è generata dalla lista di controllo del sito, quindi non dice nulla che quella lista non dica.`,
    states: {
      staging: { title: 'Sullo spazio di staging', lead: 'Dati sintetici, in tedesco e inglese.' },
      built: { title: 'Realizzato o nel contratto, non sullo spazio di staging', lead: 'Non gira lì e non è pubblicato.' },
      planned: { title: 'Previsto, non realizzato', lead: 'Nessuna data promessa.' },
    },
    items: {
      form: 'Descrivere una richiesta o un’offerta tramite modulo, con l’avviso sull’identità dove lo spazio ne ha uno',
      text: 'Descrivere una richiesta o un’offerta con parole proprie, lette da regole fisse senza un modello',
      board: 'La bacheca, con i valori resi meno precisi dal pack, che elenca solo ciò per cui il proprietario ha dato il consenso',
      watches: 'I monitoraggi; le loro email vanno a una casella di prova e non raggiungono nessuno',
      control: 'Impostazioni, origin, chiavi e funnel di uno spazio, tramite la Space API',
      confirm: 'Confermare; il browser che ha confermato gestisce ciò che ha creato',
      matching: 'Corrispondenza con un verdetto per criterio',
      gates: 'Gate e approvazione da parte di un operatore identificato',
      introductions: 'Presentazioni in modalità operatore, con ricevute',
      outcomes: 'Esiti, modifiche, messa in pausa e chiusura',
      deletion: 'Cancellazione con il registro delle cancellazioni dell’istanza',
      widget: 'Il widget, servito dall’istanza stessa da una release fissata (0.5.0-v1)',
      webhooks: 'Webhook verso il server della piattaforma: nel contratto, e l’SDK ne controlla le firme; lo spazio di staging non li invia',
      mail: 'Email che raggiunge una casella reale; le email dello spazio di staging vanno a una casella di prova',
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
    title: 'Novità: i passi del prodotto Linkbot, datati',
    description: 'Ogni passo di Linkbot che un cliente può notare, datato e con il suo stato: sullo spazio di staging sintetico, oppure realizzato e non ancora lì.',
    eyebrow: 'Novità',
    h1: ['Che cosa è cambiato,', 'passo dopo passo.'],
    lede: 'Una voce per ogni passo del prodotto che un cliente può notare, la più recente per prima. Ognuna dice se gira sullo spazio di staging sintetico o se è realizzata e non ancora lì. Niente di tutto ciò è ancora pubblicato per utenti reali.',
    states: { staging: 'Sullo spazio di staging', built: 'Realizzato, non ancora sullo spazio di staging' },
    source: 'Fonte',
    note: 'Ogni voce proviene da docs/changelog.yml, nel repository di questo sito, e indica la pull request su cui si basa; una voce senza fonte ferma la build.',
    link: 'Novità',
  },
  requestDemo: {
    title: 'Richiedere una demo: cosa si può vedere oggi e cosa seguirà',
    description: 'Come funziona oggi una demo di Linkbot: un percorso registrato su un solo computer, con dati fittizi. Più avanti una sessione guidata, ancora senza data.',
    eyebrow: 'Richiedere una demo',
    h1: ['Una demo,', 'come si può dare oggi.'],
    lede: 'Non c’è ancora nulla da prenotare, e questa pagina non raccoglie nulla. Dice cosa si può vedere ora, cosa è previsto e come potrete contattarci.',
    now: {
      title: 'Ora: il percorso registrato',
      body: 'La pagina della demo mostra l’intero percorso di un acquirente in sei passaggi, dalla richiesta alla presentazione, con immagini del widget e della console dell’operatore registrate su un solo computer, con dati fittizi. Non servono richieste, account o indirizzi: apritela e procedete passo dopo passo.',
      link: 'Apri il percorso',
    },
    later: {
      title: 'Più avanti: una sessione guidata',
      body: 'Previsto: una sessione per il team di una piattaforma, in cui Linkbot mostra il widget e la console su uno spazio di prova con dati fittizi e risponde alle domande. Servono uno spazio demo e recapiti pubblicati. Nessuno dei due esiste ancora, quindi non c’è una data e non c’è nulla da prenotare.',
    },
    contact: {
      title: 'Come richiederla',
      write: 'Scrivete a {email}. Indicate la vostra piattaforma e il mercato che serve; non inviate richieste reali né dati personali di nessuno.',
    },
  },
  sheet: {
    title: 'Linkbot in una pagina',
    description: 'Linkbot in una pagina stampabile: i tre elementi, il sì di entrambe le parti, cosa ottiene e conserva una piattaforma, e a che punto è ogni parte. Senza prezzi.',
    eyebrow: 'Una pagina',
    dated: `Al ${AS_OF}. Generata dalle pagine di questo sito quando il sito viene costruito, quindi non dice nulla che esse non dicano. Non indica prezzi.`,
    pdf: 'Scarica in PDF',
    site: 'Di più su questo sito',
    link: 'Linkbot in una pagina (PDF)',
  },
  verticals: {
    title: 'Per i verticali: un pack per mercato',
    description: 'Un pack contiene il vocabolario di un mercato: criteri, opzioni, unità, etichette, rivelazione per fase, gate ed esiti. Il primo spazio: minerali industriali.',
    eyebrow: 'Per i verticali',
    h1: ['Un pack', 'per mercato.'],
    lede: 'Un verticale entra in Linkbot come pack: i criteri del suo mercato, le risposte che consentono, cosa ognuno rivela e quando, e i gate che il mercato richiede. Uno spazio fissa il pack; il modulo, la lettura, la bacheca e le regole di corrispondenza ne derivano.',
    toc: [['holds', 'Cosa contiene un pack'], ['first', 'Il primo spazio'], ['next', 'Altri verticali']] as [string, string][],
    holds: {
      title: 'Cosa contiene un pack',
      items: [
        'Criteri con i loro controlli: una scelta, più scelte, un numero con un’unità, un intervallo, una finestra di date, un elenco cercabile, testo libero',
        'Opzioni, unità e basi, con le conversioni che il pack dichiara; una conversione passa solo dalla base dichiarata dall’offerta, mai per supposizione',
        'Quali risposte speciali ogni criterio consente: «Altro / non in elenco», «Non so», «Qualsiasi»',
        'Quali importanze un criterio consente, e quella suggerita',
        'La fase di ogni criterio, bacheca, corrispondenza, presentazione o operatore, e come un valore viene reso meno preciso per la bacheca',
        'Etichette, domande, sinonimi e avvisi nelle lingue dello spazio',
        'I gate del mercato e le categorie di un esito',
      ],
    },
    first: {
      title: 'Il primo spazio: minerali industriali',
      paras: [
        'Geoprocure gestisce il primo spazio, per i minerali industriali, su un’istanza di staging sintetica. Il suo gate richiesto è un controllo KYC e sanzioni, registrato da un operatore identificato e mai derogato. Le sue presentazioni girano in modalità operatore: il team di Geoprocure mette in contatto le due parti.',
      ],
    },
    next: {
      title: 'Altri verticali',
      paras: [
        'Un verticale ha bisogno del suo pack e di una piattaforma che gestisca lo spazio. Un secondo pack con dati sintetici è pianificato, così uno spazio demo potrà mostrare il widget su questo sito senza un mercato reale.',
      ],
    },
  },

  privacy: {
    title: 'Informativa sulla privacy · Linkbot',
    description: 'L’informativa sulla privacy di questo sito è in preparazione. Già vero: il sito non imposta cookie, non carica nulla da terze parti e non usa analisi.',
    eyebrow: 'Informativa sulla privacy',
    h1: 'In preparazione',
    lede: 'L’informativa sulla privacy di questo sito è in fase di stesura e revisione. Comparirà qui una volta pubblicata. Fino ad allora non viene mostrato nulla, perché un testo legale non può essere redatto a tentativi.',
    released: { description: 'L’informativa sulla privacy del sito di Linkbot: cosa tratta il sito, perché, su quale base giuridica, e i diritti degli interessati.' },
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
    title: 'Note legali · Linkbot',
    description: 'Le note legali del sito di Linkbot: dati del fornitore e contatti. Il testo è in preparazione.',
    eyebrow: 'Note legali',
    h1: 'In preparazione',
    lede: 'Le note legali (fornitore, indirizzo, rappresentanti, registro e dati fiscali, contatti) sono in preparazione e compariranno qui una volta confermate. Fino ad allora non viene mostrato nulla, perché nulla di esse può essere inventato.',
    released: { description: 'Le note legali del sito di Linkbot: fornitore, indirizzo, rappresentanti, registro e dati fiscali, e contatti.' },
  },

  contact: {
    title: 'Contatti · Linkbot',
    description: 'Come contattare Linkbot. I contatti sono in preparazione: arriveranno con il dominio proprio di Linkbot, che non esiste ancora.',
    eyebrow: 'Contatti',
    h1: 'In preparazione',
    released: { h1: 'Come scriverci', description: 'Come contattare Linkbot: l’indirizzo a cui scrivere per una domanda su Linkbot o su uno spazio sulla propria piattaforma.' },
    write: 'L’indirizzo è {email}.',
  },

  notFound: {
    title: 'Pagina non trovata · Linkbot',
    description: 'Questa pagina non esiste. Vada alla pagina iniziale o legga il sito in un’altra lingua.',
    eyebrow: 'Pagina non trovata',
    h1: 'Non c’è nulla qui.',
    lede: 'La pagina potrebbe essere stata spostata.',
    home: 'Vada alla pagina iniziale',
    languages: 'Questo sito in altre lingue',
  },

  integrations: {
    eyebrow: 'Per le piattaforme',
    hub: 'Ogni integrazione su una propria pagina',
    state: 'A che punto siamo',
    pages: {
      embed: {
        nav: 'L’embed',
        title: 'L’embed: uno script, un elemento · Linkbot per le piattaforme',
        description: 'Cosa imposta la pagina sull’embed: attributi, la Sua informativa dati, variabili del tema, Content Security Policy, cosa il widget conserva e invia.',
        h1: ['Uno script,', 'un elemento.'],
        lede: 'Il widget è uno script e un elemento per ogni punto in cui compare. La Sua pagina imposta la sua chiave, la sua modalità, il suo lato e la sua lingua; tutto il resto proviene dal Suo spazio.',
        sections: [
          { id: 'element', title: 'L’elemento', paras: [
            'Carichi lo script una volta per pagina, con async, così la Sua pagina viene renderizzata senza attenderlo. Metta l’elemento dove deve comparire il modulo. Più elementi su una pagina sono più widget, e gli elementi aggiunti in seguito, come fanno le applicazioni a pagina singola, si avviano da soli.',
            'Un valore che il widget non conosce ricade sull’impostazione predefinita, con un avviso nella console del browser. Anche una lingua che lo spazio non offre ricade su un’altra, e il widget lo dice a schermo.',
          ], code: true, columns: ['Attributo', 'Valori', 'Predefinito'], rows: [
            { name: 'data-linkbot', what: 'la Sua Publishable Key. Il widget rifiuta di avviarsi con una Secret Key e Le dice di ruotarla', more: 'richiesto' },
            { name: 'data-mode', what: 'describe (dichiarare una richiesta o un’offerta), board (sfogliare e rispondere agli annunci), mine (le mie richieste, i monitoraggi e le possibili corrispondenze)', more: 'describe' },
            { name: 'data-side', what: 'seeking (una richiesta) o offer', more: 'seeking' },
            { name: 'data-locale', what: 'en, de, es, it o fr', more: 'la lingua del browser del visitatore, poi quella predefinita dello spazio' },
            { name: 'data-input', what: 'form, text o both; può solo restringere ciò che lo spazio consente', more: 'l’impostazione dello spazio' },
            { name: 'data-api', what: 'la base API del Suo spazio, solo https (http su localhost)', more: 'l’origin da cui è stato caricato lo script' },
          ] },
          { id: 'notice', title: 'La Sua informativa dati', paras: ['Un elemento figlio con slot="notice" compare appena sopra il pulsante di conferma, con lo stile del CSS della Sua pagina. Il widget aggiunge accanto le proprie righe fisse, come «Niente viene usato finché Lei non conferma.» Ciò che Lei scrive lì proviene dai Suoi testi sulla privacy.'] },
          { id: 'design', title: 'Design', paras: [
            'Il widget prende il font e il colore del testo della Sua pagina. Tutto il resto è impostato da variabili CSS sull’elemento: l’accento per il pulsante principale, le scelte selezionate e gli anelli di focus, il suo hover, il raggio degli angoli, il testo e il testo secondario, i titoli e il loro font, il font delle etichette dei campi, i bordi e i divisori delle card, i bordi dei campi, gli sfondi di card e superfici, e il colore e lo sfondo di errore.',
            'Il widget sceglie testo nero o bianco per l’accento, quello che contrasta di più. Se la Sua pagina è scura, imposti color-scheme: dark sull’elemento. Gli altri stili della Sua pagina non entrano nel widget, che viene renderizzato in uno shadow root, e gli stili del widget non raggiungono la Sua pagina.',
          ] },
          { id: 'csp', title: 'Content Security Policy', paras: [
            'Consenta l’origin dello script in script-src e l’origin della Space API in connect-src, più l’origin dello script se differisce: il widget carica una lingua diversa dall’inglese da accanto a sé e la controlla rispetto a uno sha256 integrato nello script.',
            'Gli stili non richiedono «unsafe-inline»: il widget usa un constructable stylesheet. Nei browser che ne sono privi aggiunge un singolo elemento style che porta il nonce del proprio tag script, quindi metta il Suo nonce sul tag script se la Sua policy usa i nonce. Se ospita lo script da sé, copi con esso la sua cartella locales.',
          ] },
          { id: 'global', title: 'Il globale della pagina', paras: ['Lo script definisce un solo globale, window.Linkbot, e nient’altro: la versione dell’embed, se si tratta della build di esempio, e mount e unmount per un elemento che la scansione non può vedere, per esempio dentro il Suo shadow root.'] },
          { id: 'keeps', title: 'Cosa conserva il widget, e cosa invia', paras: [
            'I suoi token di sessione ospite e di proprietario stanno in sessionStorage, per scheda e per spazio. Non usa cookie né localStorage. Le richieste vanno solo alla Space API, senza credenziali. Non ci sono strumenti di analisi. La build di esempio non invia nulla in rete.',
            'sessionStorage appartiene all’origin della Sua pagina, quindi ogni script che esegue su quella pagina può leggere la bozza e i token. Non esegua script di cui non si fida sulle pagine che ospitano il widget.',
          ] },
        ] as Section[],
        state: [`Lo script proviene dall’istanza del Suo spazio. Al ${AS_OF} l’istanza di staging serve la release 0.5.0-v1 del widget da un file fissato, come mostra il suo rapporto di stato; i controlli di Connect sulla bacheca e sui testi del widget sono passati contro quel file servito il 26 ottobre 2026.`],
      },
      sdk: {
        nav: 'SDK e webhook',
        title: 'L’SDK, il wrapper React e i webhook · Linkbot per le piattaforme',
        description: 'Un client server tipizzato dal contratto della Space API, il controllo dei webhook, il wrapper React e come il Suo server riceve gli eventi di Linkbot.',
        h1: ['Il Suo server,', 'tipizzato dal contratto.'],
        lede: `Nulla dell’SDK finisce in una pagina del browser: l’embed prende la Publishable Key, e il client dell’SDK rifiuta di avviarsi in un browser. Al ${AS_OF} non è pubblicato; il suo codice è nel repository di Connect.`,
        sections: [
          { id: 'client', title: 'Il client', paras: [
            'Il client prende la base API del Suo spazio (solo https, tranne su localhost), la Sua Secret Key dal secret store del Suo server (un valore che non ha la forma di una Secret Key viene rifiutato) e, se vuole, il fetch del Suo runtime. I suoi percorsi, parametri, body e risposte sono quelli del contratto, generati dallo YAML pubblicato da Core e fissati tramite sha256: una route, un campo o un valore che il contratto non prevede è un errore di tipo.',
            'Una chiave di idempotenza nuova è a una sola chiamata di distanza. Le scritture che il contratto contrassegna ne richiedono una; conservi la chiave con la scrittura e invii la stessa chiave quando la ritenta, così lo spazio esegue la scrittura una sola volta.',
          ] },
          { id: 'seeding', title: 'Inserire l’offerta della Sua piattaforma', paras: ['Il Suo server inserisce un’offerta sul percorso operatore, e un secondo operatore la conferma: quattro occhi. Su uno spazio che controlla ogni parte, come quello di Geoprocure, inserire l’offerta della propria organizzazione conta come conferma, quindi porta il consenso a rivelare l’identità che l’avviso dello spazio chiede, e lo spazio la rifiuta senza. Questo vale solo per la propria organizzazione; il consenso di qualunque altra parte spetta a quella parte, nel widget.'] },
          { id: 'webhooks', title: 'Webhook', paras: [
            'Registri un endpoint con la Sua Secret Key, solo https. Il segreto di firma viene mostrato una sola volta e sta nel Suo secret store, mai nel codice. Ogni consegna porta un id, un timestamp in secondi e una firma: l’HMAC-SHA256 del timestamp, un punto e il body grezzo, con chiave il Suo segreto.',
            'Rifiuti una consegna più vecchia di cinque minuti o la cui firma non corrisponde. Il controllo dell’SDK fa entrambe le cose, confrontando in tempo costante con Web Crypto, in Node, Deno, Bun e nei runtime edge. Controlli il body grezzo prima di analizzarlo. Risponda 2xx rapidamente: ogni altra risposta viene ritentata con backoff per 24 ore, poi la consegna viene contrassegnata come fallita. Un retry porta lo stesso id, quindi gestisca ogni id una sola volta, con gli id nel Suo database invece che in memoria.',
            `Ruoti il segreto quando serve: quello vecchio resta valido fino a sette giorni, e il controllo accetta entrambi. Le consegne portano id e stati, mai dati di contatto; recuperi i dettagli con la Sua Secret Key. Il registro delle consegne elenca stato, tentativi e un hash del body, mai il body. I webhook sono nel contratto; al ${AS_OF} lo spazio di staging non li invia.`,
          ] },
          { id: 'events', title: 'Tipi di evento', paras: ['Ogni evento ha un id, un tipo, l’id dello spazio, l’ora in cui è avvenuto, la versione del contratto e l’oggetto a cui si riferisce, con tipo, id e stato dove ce n’è uno. I tipi:'], code: true, items: ['intent.confirmed', 'intent.revised', 'intent.status_changed', 'match.proposed', 'match.updated', 'gate.recorded', 'approval.recorded', 'answer.recorded', 'clarification.requested', 'review.recorded', 'introduction.created', 'outcome.recorded', 'watch.delivered', 'channel.verified', 'deletion.completed', 'key.rotated'] },
          { id: 'react', title: 'Il wrapper React', paras: [
            'Il wrapper renderizza lo stesso elemento dello snippet e carica lo script una volta per indirizzo; l’embed poi si avvia nel proprio shadow root, che React non tocca mai. È un client component, quindi funziona nell’App Router di Next.js, e non aggiunge CSS globale.',
            `Le sue prop sono gli attributi dell’elemento: la Publishable Key e l’indirizzo dello script sono obbligatori (una Secret Key genera un errore), poi mode, side, locale, input, api, la Sua informativa, un nome di classe e uno stile per le variabili del tema. Quando una prop che l’embed legge cambia, il wrapper dà a React un nuovo elemento e l’embed riparte da capo. Una pagina che vuole lo script caricato prima di renderizzare un elemento può chiederlo. Non pubblicato al ${AS_OF}.`,
          ] },
        ] as Section[],
        state: [`L’SDK e il wrapper sono compilati e testati nel repository di Connect e, al ${AS_OF}, non sono pubblicati. Il ricevitore della guida ai webhook è testato contro consegne di esempio firmate; lo spazio di staging non invia webhook.`],
      },
      console: {
        nav: 'La console',
        title: 'La console per il Suo team · Linkbot per le piattaforme',
        description: 'La coda di approvazione, casi con gate e approvazione, presentazioni con ricevute, esiti, webhook e operatori, sulla Sua macchina o dietro il Suo login.',
        h1: ['La console del Suo team,', 'dietro il Suo login.'],
        lede: 'La console è un piccolo server, l’unico posto in cui viene usata la Secret Key dello spazio, più la pagina in cui lavora il Suo team. Non esiste un login Linkbot per gli operatori: la Sua piattaforma fa accedere il suo team. La esegue sulla Sua macchina come strumento locale, o monta il suo handler dietro il login della Sua piattaforma. Non è mai una pagina Linkbot pubblica.',
        sections: [
          { id: 'views', title: 'Cosa mostra', columns: ['Vista', 'Cosa mostra'], rows: [
            { name: 'Coda di approvazione', what: 'Casi in attesa del Suo team, senza identità: la corrispondenza per criterio, le risposte di entrambe le parti, i gate mancanti.' },
            { name: 'Caso', what: 'La corrispondenza per criterio e il perché. Il Suo team registra i controlli del caso e il controllo di ogni parte (superato, non superato, rinviato, e derogato solo dove il gate lo consente), il controllo di una parte affiancato così che la registrazione di una parte non risulti mai come quella dell’altra; approva o rifiuta con un motivo facoltativo per il registro di audit; risponde solo per le offerte o le richieste della Sua piattaforma, come operatore autenticato; chiede a una parte di chiarire.' },
            { name: 'Presentazioni', what: 'Elencate senza recapiti. Per aprirne una viene chiesta prima una conferma, poi compaiono i campi di contatto e la lettura viene registrata. Un valore da un elenco lungo, come un paese o un porto, compare per nome con il suo codice. Ricevute ed esiti.' },
            { name: 'Webhook', what: 'Aggiungere un endpoint (solo https); il segreto di firma viene mostrato una volta; ruotare, con il vecchio segreto valido fino a sette giorni; rimuovere; il registro delle consegne.' },
            { name: 'Operatori', what: 'Il registro: aggiungere, disattivare, riattivare.' },
            { name: 'Spazio e snippet', what: 'Le impostazioni come le riporta la Space API, e lo snippet con la Sua Publishable Key e l’indirizzo dello script della Sua istanza.' },
            { name: 'Configurazione', what: 'I cinque passaggi, con ciò che il Suo spazio ha per ciascuno.' },
          ] },
          { id: 'safe', title: 'Come la chiave resta al sicuro', items: [
            'La chiave resta sul server. La pagina riceve le sue impostazioni dal server, e i test controllano che questa risposta non contenga alcuna Secret Key.',
            'Nessun proxy: ogni operazione è elencata con i campi che può inviare; ogni altra cosa viene rifiutata e i campi non elencati vengono scartati.',
            'Il server ricava l’operatore dal Suo accesso; un id inviato dalla pagina viene ignorato.',
            'Risponde solo per il lato della Sua piattaforma in un caso, calcolato sul server; la pagina non sceglie mai un lato e non riceve mai gli intent, che contengono campi di identità.',
            'Solo la pagina della console può chiamarla: il suo header, la sua origin, richieste same-origin, body JSON.',
            'La modalità locale si lega solo alla macchina locale e risponde solo al proprio nome, il che blocca il DNS rebinding.',
            'Una policy di pagina rigorosa: nessuno script o stile inline, nessun inserimento in frame, nessuna cache.',
          ] },
          { id: 'run', title: 'Come eseguirla', paras: [
            'Sui dati di esempio: l’API operatore di esempio risponde dalla memoria con dati sintetici, non richiede chiavi e non invia nulla in rete, e ogni pagina lo dice in un banner. Segue le regole del contratto, così può provarle: un gate che non può essere derogato, l’approvazione solo dopo i gate richiesti, una presentazione solo con ogni gate, l’approvazione e un sì da entrambe le parti, e una ricevuta di lettura quando il Suo team apre i dettagli di contatto.',
            'Contro uno spazio: la base API, la Sua Secret Key dal Suo secret store, il Suo id nel registro operatori dello spazio e, se vuole vedere lo snippet, la Publishable Key. Dietro il Suo login: un solo handler; la Sua sessione decide chi agisce, e senza un operatore autenticato risponde 401. Dietro un proxy serve l’indirizzo pubblico usato dal browser.',
            'Questo percorso ha girato contro lo spazio di staging sintetico di Geoprocure il 23 ottobre 2026: la coda, un caso, entrambi i tipi di controllo, l’approvazione, una risposta per l’offerta della piattaforma e una presentazione con la sua ricevuta.',
          ] },
          { id: 'notyet', title: 'Non ancora qui, e perché', items: [
            'Un nuovo spazio si crea con lo strumento di predisposizione di Core, non dalla console; la procedura guidata in cinque passaggi della console scrive e convalida il file che quello strumento legge.',
            'Nessun «invia di nuovo» per una consegna finché non ci sono consegne reali su cui provarlo.',
          ] },
        ] as Section[],
        state: ['La console è costruita sul contratto della Space API e ha girato contro lo spazio di staging sintetico il 23 ottobre 2026; i suoi test girano contro un’API operatore di esempio con dati sintetici.'],
      },
      wordpress: {
        nav: 'WordPress',
        title: 'WordPress · Linkbot per le piattaforme',
        description: 'Un piccolo plugin aggiunge lo shortcode per ogni editor: installarlo, metterlo dove deve comparire il modulo, tenere lontani dallo script i plugin di caching.',
        h1: ['Uno shortcode', 'per ogni editor.'],
        lede: 'Incollare lo snippet in un blocco HTML personalizzato funziona solo per gli utenti a cui WordPress consente di pubblicare script, il che esclude gli editor sulle reti multisite. Il plugin aggiunge uno shortcode che funziona per ogni editor, carica lo script una volta per pagina tramite il caricamento script di WordPress e controlla ogni valore che stampa.',
        sections: [
          { id: 'install', title: 'Installare il plugin', paras: ['Copi la cartella del plugin nella directory dei plugin, oppure la comprima e la carichi in Plugin, quindi lo attivi. L’intero plugin è un solo file.'] },
          { id: 'shortcode', title: 'Lo shortcode', paras: ['Nell’editor a blocchi, aggiunga un blocco Shortcode. Il testo tra lo shortcode di apertura e quello di chiusura diventa la Sua informativa dati, mostrata sopra il pulsante di conferma. Usi lo stesso indirizzo dello script in ogni shortcode di una pagina: il plugin carica lo script una sola volta, dal primo.'], code: true, columns: ['Attributo', 'Che cos’è'], rows: [
            { name: 'src', what: 'l’indirizzo https dello script sull’istanza del Suo spazio; deve essere https' },
            { name: 'key', what: 'la Sua Publishable Key. Una Secret Key mostra un avviso a chi può modificare la pagina, e nulla ai visitatori' },
            { name: 'mode, side, locale, input, api', what: 'gli attributi dell’elemento senza il prefisso data-. Un valore che il plugin non conosce viene omesso, così il widget usa il suo predefinito' },
          ] },
          { id: 'caching', title: 'Plugin di caching e ottimizzazione', paras: ['I plugin che uniscono, minimizzano, spostano o ritardano gli script devono lasciare in pace lo script: lo escluda per indirizzo o per handle. Il widget carica le sue altre lingue da accanto a sé e controlla ognuna rispetto a uno sha256 che porta con sé, così una copia altrove non può caricarle. Se il Suo host non consente plugin, lo shortcode non è disponibile, e un blocco HTML personalizzato funziona solo per gli utenti a cui WordPress consente di pubblicare script.'] },
        ] as Section[],
        state: ['La CI di Connect esegue il plugin in un WordPress 6.8 reale su PHP 8.3 tramite WordPress Playground e carica le sue pagine in tre motori browser contro la build di esempio: lo shortcode avvia il widget con la Sua informativa, due shortcode su una pagina caricano lo script una volta, uno shortcode con una Secret Key non mostra nulla ai visitatori. Non ha ancora girato contro uno spazio reale così com’è scritto. La ricetta è oggi l’intero plugin; una pagina di impostazioni non ne fa parte.'],
      },
      nextjs: {
        nav: 'Next.js',
        title: 'Next.js · Linkbot per le piattaforme',
        description: 'Il wrapper React nell’App Router: un componente client renderizzabile da un componente server, le variabili pubbliche, la policy, i webhook in un route handler.',
        h1: ['Il wrapper', 'nell’App Router.'],
        lede: 'Usi il wrapper React. È un client component, quindi un server component può renderizzarlo: l’indirizzo dello script e la Sua Publishable Key come prop, la modalità, il lato e la lingua, la Sua informativa dati e le variabili del tema nel suo style.',
        sections: [
          { id: 'props', title: 'Prop e variabili', paras: ['L’indirizzo dello script e la Publishable Key sono obbligatori. Sono pubblici per scelta: la chiave identifica solo il Suo spazio e funziona solo sulle Sue origin consentite. Le variabili pubbliche vengono fissate al momento della build. L’informativa è la Sua informativa dati, mostrata sopra il pulsante di conferma; lo style imposta le variabili del tema e riserva spazio prima che il widget si carichi, così la pagina sottostante non salta.'] },
          { id: 'csp', title: 'Content Security Policy', paras: ['Aggiunga l’origin dello script a script-src, e l’origin della Space API insieme all’origin dello script a connect-src. Il wrapper aggiunge il tag script dal browser: con una policy basata su nonce e strict-dynamic quel tag è consentito perché lo aggiunge codice fidato; senza strict-dynamic, elenchi l’origin dello script. L’esempio non invia alcuna policy, quindi la CI di Connect non ne testa ancora una per Next.js.'] },
          { id: 'server', title: 'Il Suo lato server', paras: ['I webhook arrivano a un route handler; la guida ai webhook ne mostra uno per l’App Router, in codice che la CI esegue. La Secret Key resta sul server, mai in una variabile pubblica.'] },
        ] as Section[],
        state: ['La CI di Connect compila l’esempio con Next.js 16.3.8 e React 19.3, che ne controlla i tipi, poi lo avvia ed esegue la pagina in tre motori browser contro la build di esempio: il wrapper carica lo script una volta, il widget si avvia con l’informativa e il tema, e la console non mostra errori. Non ha ancora girato contro uno spazio reale così com’è scritto. Nessun pacchetto è pubblicato.'],
      },
      astro: {
        nav: 'Astro',
        title: 'Astro · Linkbot per le piattaforme',
        description: 'Un componente: lo script lasciato inline così Astro non lo raggruppa, l’informativa tramite un wrapper, tre variabili pubbliche e una build statica.',
        h1: ['Un componente,', 'una build statica.'],
        lede: 'Copi un componente nel Suo sito. Renderizza il tag script e l’elemento da tre variabili pubbliche: l’indirizzo dello script sull’istanza del Suo spazio, la Sua Publishable Key e, se lo script proviene da un’altra origin, la Sua base API. La pagina non ha bisogno di un server: una build Astro statica funziona.',
        sections: [
          { id: 'inline', title: 'Lo script resta inline', paras: ['Il tag script porta is:inline, così Astro lo lascia in pace. Lo script deve caricarsi da dove viene servito, perché recupera le sue altre lingue da accanto a sé e controlla ognuna rispetto a uno sha256 che porta con sé.'] },
          { id: 'notice', title: 'L’informativa', paras: ['Astro usa il nome dello slot notice per i propri slot e scarta l’attributo, quindi il componente mette la Sua informativa in un wrapper che il widget raccoglie. Il CSS della Sua pagina gli dà lo stile.'] },
          { id: 'twice', title: 'Due volte su una pagina', paras: ['Se usa il componente due volte su una pagina, il tag script compare due volte; il secondo caricamento non fa nulla. Imposti le variabili pubbliche nell’ambiente della Sua build o in un file di ambiente che non inserisce nel repository; sono pubbliche per scelta.'] },
        ] as Section[],
        state: ['La CI di Connect compila l’esempio con Astro 7.3.5 ed esegue la pagina compilata in tre motori browser contro la build di esempio: il widget si avvia, mostra l’informativa, adotta il tema e Astro ha lasciato in pace il tag script. Non ha ancora girato contro uno spazio reale così com’è scritto. Un’integrazione Astro pacchettizzata non è stata realizzata.'],
      },
    },
  },
};
