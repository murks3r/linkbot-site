/* it: the front's words (src/front/copy.ts); the page's sentences are the site's. Not yet read by a native speaker
   (docs/truth-check.md). */
import type { FrontCopy } from '../copy.ts';

export const it: FrontCopy = {
  a: {
    ledger: {
      label: 'Sintetico · valori fissi, scritti per questa pagina · qui nulla viene messo in corrispondenza',
      space: 'Uno spazio per i minerali industriali',
      need: 'La richiesta',
      offer: 'L’offerta',
      table: 'La coppia, criterio per criterio',
      columns: { criterion: 'Criterio', need: 'La richiesta dichiara', offer: 'L’offerta dichiara', verdict: 'Verdetto' },
      importance: { must: 'Indispensabile', nice_to_have: 'Preferibile' },
      verdicts: { meets: 'Corrisponde', partly: 'Corrisponde in parte', conflicts: 'Contraddice', unknown: 'Sconosciuto' },
      state: 'Ogni criterio indispensabile corrisponde, quindi questa coppia può essere una corrispondenza. I criteri morbidi si limitano a mostrare; non decidono.',
      before: 'Prima che qualcuno venga presentato',
      stages: [
        {
          name: 'Gate',
          text: 'Un operatore identificato registra come superato il controllo richiesto dallo spazio. Il sistema non decide mai un gate.',
        },
        {
          name: 'Approvazione',
          text: 'Un operatore identificato e attivo approva il caso. Un’approvazione da sola non rivela nulla.',
        },
        {
          name: 'Doppio sì',
          text: 'Ogni parte risponde per sé. Prima che entrambe abbiano detto sì, l’altra parte non apprende nulla.',
        },
        {
          name: 'Presentazione',
          text: 'Il server la crea quando l’ultima delle tre condizioni è soddisfatta, in qualsiasi ordine, e rifiuta ogni altra via. Ogni parte riceve una ricevuta.',
        },
      ],
      notice: 'Una possibile corrispondenza rivela solo i verdetti, e un avviso fisso che decidono le persone.',
      legend: 'Pieno: corrisponde. Diviso: corrisponde in parte. Incrociato: contraddice. Tratteggiato: sconosciuto, che non è mai una corrispondenza.',
    },
  },
  landing: {
    meta: {
      title: 'Linkbot: la sua piattaforma unisce acquirenti e venditori, Linkbot trova chi corrisponde',
      description: 'Un widget per piattaforme che uniscono acquirenti e venditori: chiede a ogni parte che cosa cerca, dà un verdetto per criterio e presenta solo dopo due sì.',
    },
    opening: {
      h1: 'La sua piattaforma unisce acquirenti e venditori. Linkbot trova chi corrisponde.',
      sub: 'Il suo widget chiede a ogni parte che cosa cerca; Linkbot mostra un verdetto per ogni criterio e presenta le due parti solo quando entrambe dicono sì.',
      button: 'Vederlo passo per passo',
    },
    cards: {
      h2: 'Che cosa fa per lei',
      items: [
        { name: 'Chiedere con le parole del suo mercato', text: 'Ogni parte dice che cosa cerca o offre, in una riga o con domande adatte al suo mercato; non si salva nulla finché non conferma.', button: 'Vedere la richiesta' },
        { name: 'Continuiamo a cercare', text: 'Se ancora non corrisponde nulla, Linkbot continua a cercare e avvisa solo lei quando qualcosa di nuovo corrisponde.', small: 'Nella demo le sue e-mail vanno a una casella di prova e non raggiungono nessuno.', button: 'Vedere come continua a cercare' },
        { name: 'Presentati solo dopo due sì', text: 'Due parti vengono presentate solo dopo che una persona indicata approva ed entrambe dicono sì.', button: 'Vedere la presentazione' },
      ],
    },
    stage: {
      h2: 'Una presentazione, da entrambe le parti',
      p: 'Una richiesta e un’offerta vengono presentate solo dopo che una persona indicata approva ed entrambe le parti dicono sì.',
      roles: 'Quale parte mostrare',
      buyer: 'Come acquirente',
      supplier: 'Come fornitore',
      label: 'Percorso registrato · dati fittizi',
      supplierNote: 'Della parte del fornitore, finora è registrato solo il suo sì; il fornitore descrive la sua offerta nello stesso widget.',
      link: 'Percorrere tutti e sei i passi',
    },
    sees: {
      h2: 'Chi vede che cosa, e quando',
      p: 'Ogni passo mostra solo ciò che quel passo consente; i dati per una presentazione escono solo dopo il sì di entrambe le parti.',
      link: 'Chi vede che cosa, passo per passo',
    },
    platforms: {
      h2: 'Per le piattaforme',
      p: 'Uno script e un elemento sulla sua pagina; le domande si adattano al suo mercato.',
      snippet: 'L’integrazione più breve',
      later: 'Aggiungerlo con i suoi strumenti di build',
      button: 'Per le piattaforme',
      developers: 'Per sviluppatori',
    },
    bottom: {
      h2: 'Il suo mercato non c’è ancora? Ci dica che cosa unisce.',
      button: 'Ci dica che cosa unisce',
      prepared: 'L’indirizzo a cui scrivere è in preparazione; la pagina dietro il pulsante dice come ci raggiungerà.',
      line: 'Tutto ciò che si vede qui funziona con dati fittizi; controllato il {date}.',
      status: 'Lo stato completo',
    },
    labels: { live: 'Live', soon: 'Prossimamente' },
  },
  c: {
    meta: {
      title: 'Linkbot: chi vede che cosa, e quando',
      description: 'Uno strato di corrispondenza che ogni piattaforma può integrare, intorno a una domanda: chi vede che cosa, e quando. Un’offerta sintetica, fase per fase.',
    },
    hero: {
      eyebrow: 'Uno strato di corrispondenza che ogni piattaforma può integrare',
      h1: ['Chi vede che cosa,', 'e quando.'],
      lede: 'Un pack assegna a ogni criterio una fase, e una fase è il punto più lontano che un valore raggiunge: la bacheca, una possibile corrispondenza, la presentazione o solo il team della piattaforma. Qui sotto: un’offerta sintetica, fase per fase, e la ricevuta che delimita ogni lettura.',
      primary: 'Cosa ottiene una piattaforma',
      secondary: 'Chi vede che cosa, per intero',
    },
    stages: {
      label: 'Sintetico · un’offerta, scritta per questa pagina · qui nessuno viene messo in corrispondenza né presentato',
      sees: 'Chi lo vede',
      shows: 'Che cosa mostra',
      not: 'Non a questa fase',
      receipt: {
        h3: 'La ricevuta',
        lines: [
          'Chi può vedere quali campi, e da quando.',
          'Ogni lettura di una presentazione, con la sua ora.',
          'Chiavi di campo e orari, mai valori.',
          'Ciò che non è nella ricevuta non viene mai rivelato in seguito.',
        ],
      },
    },
    why: {
      h2: 'Perché una piattaforma può lasciare che Linkbot si avvicini ai suoi utenti',
      items: [
        {
          h3: 'Uno spazio per mercato, sulla propria istanza',
          p: 'Uno spazio è un mercato su una piattaforma, con la propria applicazione, il proprio database, le proprie chiavi e il proprio registro delle cancellazioni. La corrispondenza gira al suo interno; nessuna richiesta, nessuna offerta e nessuna corrispondenza viene condivisa con un altro spazio.',
        },
        {
          h3: 'Le Sue pagine, le Sue chiavi, il Suo team',
          p: 'Il widget gira nelle Sue pagine sotto la Sua informativa dati. La Sua pagina contiene una Publishable Key che funziona solo sulle Sue origin; la Secret Key resta sul Suo server; il Suo team approva i casi in una console dietro il Suo login, e non esiste un login Linkbot per gli operatori.',
        },
        {
          h3: 'Una persona identificata, mai il sistema',
          p: 'I gate vengono registrati da un operatore identificato, con un riferimento e senza dati personali, e un operatore identificato approva. Un’approvazione da sola non rivela nulla; ogni scrittura indica chi l’ha fatta e compare nel registro di audit.',
        },
        {
          h3: 'Decidono le persone, ognuna per sé',
          p: 'Ogni parte risponde a una possibile corrispondenza per il proprio lato. Prima che entrambe abbiano detto sì l’altra parte non apprende nulla, e un no successivo revoca un sì. Il server crea la presentazione quando l’ultima condizione è soddisfatta, e rifiuta ogni altra via.',
        },
      ],
    },
    deletion: { h2: 'Cancellazione: cosa va via e cosa resta' },
    platforms: {
      h2: 'Per le piattaforme',
      p: 'Uno script e un elemento mettono uno spazio sulla Sua pagina; la console per il Suo team gira sulla Sua macchina o dietro il Suo login; il Suo server apprende gli eventi tramite webhook firmati, che sono nel contratto e non vengono ancora inviati dallo spazio di staging.',
      link: 'Cosa ottiene una piattaforma',
    },
    verticals: {
      h2: 'Per i verticali',
      p: 'Un pack descrive un mercato: i suoi criteri, opzioni e unità, le sue etichette e domande nelle lingue dello spazio, ciò che ogni criterio rivela a ogni fase e i gate che il mercato richiede. Il primo è quello dei minerali industriali.',
      link: 'Cosa contiene un pack',
    },
    state: {
      h2: 'A che punto siamo',
      p: 'L’offerta qui sopra è testo fisso, scritto per questa pagina nel vocabolario di un pack sintetico; il prodotto non ha girato qui. La pagina demo percorre tutto il cammino, passo dopo passo.',
    },
  },
  demo: {
    meta: {
      title: 'Linkbot: tutto il percorso, dalla richiesta alla presentazione',
      description: 'Il percorso di un acquirente in Linkbot in sei passi, dalla richiesta al sì di entrambe le parti e alla presentazione. Con dati fittizi.',
    },
    hero: {
      eyebrow: 'Demo · dati fittizi',
      h1: ['Dalla richiesta alla presentazione,', 'in sei passi.'],
      lede: 'Che cosa succede tra la prima riga di un acquirente e il momento in cui due aziende vengono presentate, un passo alla volta, e chi agisce a ogni passo.',
    },
    test: 'Questo è uno spazio di prova con dati fittizi. Ogni richiesta, offerta, azienda e valore qui è inventato per i test. Non inserisca nulla di reale: nessuna azienda, nessuna persona, nessun indirizzo Suo. Le sue email vanno in una casella di prova e non raggiungono nessuno.',
    steps: {
      h2: 'Il percorso, passo dopo passo',
      who: 'Chi agisce',
      items: [
        { name: 'La richiesta', who: 'L’acquirente', text: 'L’acquirente descrive il fabbisogno nella pagina di una piattaforma, nel modulo che il pack del mercato genera, oppure in una riga di testo che regole fisse leggono e trasformano in valori proposti. Nulla è preselezionato, e ciò che l’acquirente non ha indicato resta sconosciuto.' },
        { name: 'I criteri, confermati', who: 'L’acquirente', text: 'L’acquirente controlla ogni valore e conferma. Solo ora viene salvato qualcosa: il server controlla ogni valore rispetto al pack e nomina ogni campo che non lo rispetta. L’indirizzo email viene confermato tramite un link.' },
        { name: 'Le possibili corrispondenze', who: 'Lo spazio', text: 'Il matching confronta i criteri salvati con quelli dell’altra parte, uno per uno: un verdetto per criterio, corrisponde, corrisponde in parte, contraddice o sconosciuto, mai un punteggio. Una possibile corrispondenza mostra a ciascuna parte solo i verdetti e un avviso che decidono le persone.' },
        { name: 'Entrambi dicono sì', who: 'L’acquirente e il fornitore', text: 'Ciascuna parte risponde alla possibile corrispondenza per sé. Prima che entrambe abbiano detto sì l’altra parte non sa nulla, e un no successivo revoca un sì.' },
        { name: 'L’operatore approva', who: 'Il team della piattaforma', text: 'Un operatore con nome registra i controlli che lo spazio richiede e approva la coppia. Un’approvazione da sola non rivela nulla, e ogni scrittura indica chi l’ha fatta.' },
        { name: 'La presentazione', who: 'Il server', text: 'Quando l’ultima delle tre condizioni è soddisfatta, in qualunque ordine, il server crea la presentazione, e la rifiuta per ogni altra via. Ciascuna parte riceve una ricevuta di chi può vedere quali campi. In modalità diretta, quella registrata qui, ciascuna parte può poi aprire i campi che l’altra condivide in questa fase. Una piattaforma può scegliere invece la modalità operatore: allora solo il suo team vede entrambe le parti e le contatta.' },
      ],
    },
    replay: {
      label: 'Percorso registrato · dati inventati',
      lede: 'Immagini del widget e della console dell’operatore a ogni passaggio, registrate su un solo computer. Ogni parte, azienda e valore che vi compare è inventato.',
      note: 'Registrato il 25 ottobre 2026 sul palco demo di Linkbot Connect, che esegue il widget e la console dell’operatore contro una Space API di esempio su un solo computer. Nulla di queste immagini ha raggiunto uno spazio o una persona. La registrazione presenta in modalità diretta: dopo l’approvazione dell’operatore ciascuna parte può aprire ciò che l’altra condivide.',
      steps: 'I sei passaggi',
      position: 'Passaggio {n} di {total}',
      previous: 'Passaggio precedente',
      next: 'Passaggio successivo',
      screens: [
        ['Il widget dell’acquirente: il modulo generato dal pack di esempio, con fosfato naturale scelto e un minimo di P₂O₅ del 30 %. L’importanza è segnata come suggerita, e nient’altro è scelto.'],
        ['Il widget dell’acquirente dopo la conferma: la richiesta è attiva, con ogni criterio e la sua importanza. Ancora nessuna offerta da mostrare.'],
        ['Il widget dell’acquirente: un’offerta che potrebbe essere adatta, con un segno di spunta per criterio, la domanda «Desidera essere presentato?» e l’avviso che decidono le persone.'],
        ['Il widget dell’acquirente dopo il sì: «Il Suo sì è registrato. Sample space lo esamina prima.»', 'Il widget del fornitore: la stessa possibile corrispondenza, vista dal lato dell’offerta come una richiesta con un segno di spunta per criterio, dopo il sì del fornitore stesso, con le stesse parole.'],
        ['Il caso nella console dell’operatore: il controllo di ciascuna parte e il controllo KYC e sanzioni del caso, registrati come superati dall’operatore di esempio, poi «Approvato dal Suo team.»'],
        ['Il widget dell’acquirente in «Le mie richieste e offerte»: entrambe le parti hanno detto sì, la richiesta è presentata e un pulsante mostra ciò che l’altra parte condivide.', 'Le presentazioni nella console dell’operatore: una presentazione, in modalità diretta, elencata senza dati di contatto.'],
      ],
    },
    watch: {
      name: 'Se ancora non c’è nulla di adatto: un monitoraggio',
      who: 'L’acquirente',
      text: 'Dopo la conferma, l’acquirente può tenere aperta la richiesta e monitorarla: con che frequenza, settimanale o giornaliera; su che cosa vuole essere informato; e, nelle opzioni e-mail, al massimo quanti per e-mail e nessuna e-mail prima di un giorno scelto. Un monitoraggio avvisa solo il suo titolare quando qualcosa di nuovo è adatto, e inizia quando l’indirizzo e-mail è confermato. Dura 90 giorni e si può mettere in pausa, riprendere o terminare in qualsiasi momento, anche da un link nelle sue e-mail.',
      screens: ['Il widget dell’acquirente dopo la conferma, ancora senza offerte da mostrare: un monitoraggio settimanale, su tutto ciò che soddisfa i requisiti indispensabili, al massimo 5 per e-mail.', 'Lo stesso widget dopo l’avvio del monitoraggio: attende la conferma dell’indirizzo e-mail, al massimo 5 per e-mail, fino al 23 gennaio 2027. La registrazione non ha inviato alcuna e-mail, e l’indirizzo fittizio non esiste.'],
    },
    space: {
      h2: 'La bacheca dello spazio di prova',
      on: 'Qui sotto c’è il widget stesso, servito dallo spazio di prova, in modalità bacheca: le richieste e le offerte aperte che i loro titolari hanno scelto di mostrare, rese meno precise come dichiara il pack. Rispondere a una comincia dal passo 1, dall’altra parte.',
      off: 'Questa pagina non mostra ancora alcun widget: attende uno spazio demo con dati sintetici. Fino ad allora il percorso qui sopra è mostrato in immagini.',
      notice: 'Uno spazio di prova con dati fittizi: non inserisca nulla di reale. Le sue email non raggiungono nessuno.',
    },
  },
  stages: [
    {
      key: 'board',
      name: 'Bacheca',
      eyes: 3,
      open: 1,
      who: 'Chiunque possa vedere la bacheca',
      rule: 'Solo i campi alla fase bacheca, resi meno precisi come dichiara il pack, e solo per le offerte il cui proprietario ha dato il consenso. Mai chi ha pubblicato.',
      fields: [
        { label: 'Prodotto', value: 'Fosfato naturale' },
        { label: 'Contenuto di P₂O₅', value: '31–32 %' },
        { label: 'Quantità', value: '20.000–25.000 t, come fascia di 5.000 t' },
        { label: 'Termini di resa', value: 'CFR, CIF o FOB' },
        { label: 'Porto convenuto', value: 'Italia o Spagna, come i paesi dei porti' },
        { label: 'Finestra di imbarco', value: 'da gennaio a febbraio 2027' },
      ],
      not: ['Cadmio, pagamento, imballaggio, origine e ispezione: fase corrispondenza, non bacheca', 'Chi ha pubblicato'],
    },
    {
      key: 'match',
      name: 'Corrispondenza',
      eyes: 2,
      open: 0.75,
      who: 'Le due parti di una possibile corrispondenza',
      rule: 'Verdetti sui campi alla fase corrispondenza o inferiore, con la regola e i valori che cita. Nessun nome, nessun recapito, nessun segno della risposta dell’altra parte.',
      fields: [
        { label: 'Cadmio', value: 'al massimo 18 mg/kg per kg di P₂O₅', verdict: 'meets' },
        { label: 'Pagamento', value: 'pagamento contro documenti; è stata chiesta una lettera di credito', verdict: 'conflicts' },
        { label: 'Imballaggio', value: 'non dichiarato nell’offerta', verdict: 'unknown' },
        { label: 'Paese di origine', value: 'Egitto; è stato chiesto Marocco o Giordania', verdict: 'conflicts' },
        { label: 'Ispezione indipendente', value: 'non dichiarato nell’offerta', verdict: 'unknown' },
      ],
      not: ['Il nome visualizzato e l’indirizzo email dell’offerta', 'La risposta della richiesta, finché entrambe non hanno detto sì'],
    },
    {
      key: 'introduction',
      name: 'Presentazione',
      eyes: 1,
      open: 0.5,
      who: 'In modalità operatore il team della piattaforma; in modalità diretta entrambe le parti',
      rule: 'Nome visualizzato, indirizzo email confermato e i criteri che il pack conserva per questa fase. Ogni lettura viene registrata sulla ricevuta.',
      fields: [
        { label: 'Nome visualizzato', value: 'quello dell’offerta, come indicato' },
        { label: 'Indirizzo email', value: 'uno, confermato tramite un link' },
        { label: 'Criteri alla fase presentazione', value: 'come dichiara il pack' },
      ],
      not: [
        'Campi che il pack riserva all’operatore',
        'In modalità operatore: qualsiasi cosa dell’altra parte; la ricevuta di ogni parte dice che entrambe hanno acconsentito e che la piattaforma le contatterà',
      ],
    },
    {
      key: 'operator',
      name: 'Operatore',
      eyes: 1,
      open: 0.3,
      who: 'Solo il team della piattaforma',
      rule: 'Campi che il pack riserva alla piattaforma, come i dettagli di identità per un controllo della parte. Non raggiungono mai l’altra parte, e ogni accesso viene registrato.',
      fields: [
        { label: 'Dettagli di identità', value: 'per il controllo della parte dello spazio, visti dal team' },
        { label: 'La registrazione del gate', value: 'superato, non superato o rinviato, con un riferimento e senza dati personali' },
      ],
      not: ['Niente di tutto ciò, per l’altra parte'],
    },
  ],
};
