/* The draft page /developers/prepare-a-request, in five languages: an agent prepares a need or an offer, the person
   checks it in the platform's form and sends it, or not. Both parts (the agent's tool in the read-only MCP prototype,
   the prefill of the widget's describe mode) are on development branches, not merged and in no release, so the page is
   a draft for the owner's review: linked from nowhere, never indexed, out of the sitemap, and left out of production
   builds. The mark's words are the widget's own (its catalogue key `prefilled`). Every sentence has its row in
   docs/truth-check.md (section "/developers/prepare-a-request"). */
import type { Lang } from '../i18n/locales.ts';
import { buildsDraft, type Draft } from './draft.ts';
import { PUBLIC_NAME } from '../i18n/terms.ts';

/** Whether a production build carries the draft. Set it to true once both parts run on the staging space and the owner approves the page. */
export const PREPARE_IN_PRODUCTION = false;

/** Whether a build carries the draft (src/drafts/draft.ts). */
export const buildsPrepare = (env: { VERCEL_ENV?: string }, inProduction = PREPARE_IN_PRODUCTION): boolean =>
  buildsDraft(env, inProduction);

export const prepare: Record<Lang, Draft> = {
  en: {
    banner: 'Draft, not published: planned, not on the staging space.',
    bannerNote: 'This page is linked from nowhere on the site and is never indexed. The two parts it describes are on development branches, not merged and in no release; neither runs on the staging space, and both were tried with synthetic data only.',
    title: 'Prepare a request with an agent (planned, draft)',
    description: 'Draft: an agent prepares a need or an offer, the person checks it in the platform’s form and sends it, or not. Planned, not on the staging space.',
    eyebrow: 'Developers · planned · draft',
    h1: ['Prepare a request with an agent:', 'the person checks and sends.'],
    lede: 'An assistant a person already uses can prepare a need or an offer in the terms of a space’s form. It sends nothing. The person opens the platform’s form with the prepared values, checks each one, changes what is wrong and presses send, or does not. The page names no date.',
    sections: [
      {
        id: 'roles',
        title: 'Who does what',
        paragraphs: [
          'The agent prepares: it reads the space’s form, writes a draft with the form’s criteria and states how much each one matters. It decides nothing and cannot send.',
          'The person decides: a request exists only once a person presses send in the platform’s form. It is then recorded like any request the person enters; the space has no way yet to record that an agent prepared a value.',
        ],
      },
      {
        id: 'today',
        title: 'Today: two drafts, not on the staging space',
        paragraphs: [
          `The agent’s part is a tool of the read-only prototype for the Model Context Protocol (MCP), on a development branch of ${PUBLIC_NAME}’s repository. It runs on the agent’s own machine and refuses a space that does not hold synthetic data.`,
          'The form’s part is a change to the widget’s describe mode, on a development branch of the widget; no widget release carries it. Neither part is merged, and neither runs on the staging space.',
        ],
      },
      {
        id: 'agent',
        title: 'Step 1: the agent prepares',
        paragraphs: [
          'The agent reads the space’s form: its criteria, their options and their units. It writes the draft as a list of criteria, each with a value and an importance. An importance the agent leaves out is refused, never guessed: the agent asks the person, or passes on the form’s suggestion as a suggestion.',
          'The tool checks the draft with the space’s dry run, which stores nothing. It answers with the draft as sent, what is invalid, what the form would still ask the person, and a link to the platform’s page where the space’s widget runs.',
          'The values travel in the part of the link after the # sign, which a browser never sends to a server. A value the form does not take from a link is left out and named with its reason: words written in a free field, and codes from long lists the form does not carry, such as ports, which the person picks in the form.',
        ],
      },
      {
        id: 'person',
        title: 'Step 2: the person checks',
        paragraphs: [
          'The person opens the link. The widget’s describe form starts with the prepared values and takes them out of the address once read, so they stay out of the browser’s history and out of a copied link.',
          'Each prepared value carries one line, “Prepared for you. Please check.”, until the person changes it or answers a question about it.',
          'The importance is never in the link. Each value starts with the importance the form suggests, marked as suggested, and the person sets it; a suggested “never” still needs the person’s own confirmation.',
          'A form the person already started in that tab wins over the link. A widget without this change opens an empty form on the same link.',
        ],
      },
      {
        id: 'send',
        title: 'Step 3: nothing leaves before send',
        paragraphs: [
          'Opening the form with prepared values sends none of them to the space; they leave only when the person presses send.',
          'The agent’s tool has no way to send a request, answer a match or change anything in a space. If the person does not press send, nothing is submitted.',
        ],
      },
    ],
    open: {
      title: 'Open, not decided',
      items: [
        'A one-time confirmation link that hands the agent’s checked draft to the form: waits for a decision.',
        'A way for the space to record that an agent prepared a value: needs a change to the Space API contract.',
        'Reaching the tool over the internet instead of on the agent’s own machine: not built, not decided.',
        'Prepared codes from long lists such as ports, without sending them before the person does.',
        'Spaces with real data: the tool reads none.',
      ],
    },
  },
  de: {
    banner: 'Entwurf, nicht veröffentlicht: geplant, nicht auf dem Staging-Space.',
    bannerNote: 'Diese Seite ist nirgends auf der Website verlinkt und wird nie indexiert. Die beiden Teile, die sie beschreibt, liegen auf Entwicklungszweigen, sind nicht zusammengeführt und in keinem Release; keiner läuft auf dem Staging-Space, und beide wurden nur mit synthetischen Daten ausprobiert.',
    title: 'Eine Anfrage mit einem Agenten vorbereiten (geplant, Entwurf)',
    description: 'Entwurf: Ein Agent bereitet einen Bedarf oder ein Angebot vor, die Person prüft es im Formular und sendet es, oder nicht. Geplant, nicht auf Staging.',
    eyebrow: 'Entwickler · geplant · Entwurf',
    h1: ['Eine Anfrage mit einem Agenten vorbereiten:', 'die Person prüft und sendet.'],
    lede: 'Ein Assistent, den eine Person ohnehin nutzt, kann einen Bedarf oder ein Angebot in den Begriffen des Formulars eines Space vorbereiten. Er sendet nichts. Die Person öffnet das Formular der Plattform mit den vorbereiteten Werten, prüft jeden, ändert, was nicht stimmt, und drückt auf Senden, oder nicht. Die Seite nennt kein Datum.',
    sections: [
      {
        id: 'roles',
        title: 'Wer was tut',
        paragraphs: [
          'Der Agent bereitet vor: Er liest das Formular des Space, schreibt einen Entwurf mit den Kriterien des Formulars und gibt an, wie wichtig jedes ist. Er entscheidet nichts und kann nicht senden.',
          'Die Person entscheidet: Eine Anfrage gibt es erst, wenn eine Person im Formular der Plattform auf Senden drückt. Sie wird dann wie jede Anfrage erfasst, die die Person selbst eingibt; der Space kann noch nicht festhalten, dass ein Agent einen Wert vorbereitet hat.',
        ],
      },
      {
        id: 'today',
        title: 'Heute: zwei Entwürfe, nicht auf dem Staging-Space',
        paragraphs: [
          `Der Teil des Agenten ist ein Werkzeug des Lese-Prototyps für das Model Context Protocol (MCP), auf einem Entwicklungszweig des ${PUBLIC_NAME}-Repositorys. Er läuft auf dem eigenen Rechner des Agenten und verweigert einen Space, der keine synthetischen Daten enthält.`,
          'Der Teil des Formulars ist eine Änderung am Beschreiben-Modus des Widgets, auf einem Entwicklungszweig des Widgets; kein Widget-Release enthält sie. Keiner der beiden Teile ist zusammengeführt, und keiner läuft auf dem Staging-Space.',
        ],
      },
      {
        id: 'agent',
        title: 'Schritt 1: Der Agent bereitet vor',
        paragraphs: [
          'Der Agent liest das Formular des Space: seine Kriterien, ihre Optionen und ihre Einheiten. Er schreibt den Entwurf als Liste von Kriterien, jedes mit einem Wert und einer Wichtigkeit. Lässt der Agent eine Wichtigkeit weg, wird der Entwurf abgelehnt, nie geraten: Der Agent fragt die Person oder gibt den Vorschlag des Formulars als Vorschlag weiter.',
          'Das Werkzeug prüft den Entwurf mit dem Probelauf des Space, der nichts speichert. Es antwortet mit dem Entwurf, wie er gesendet wurde, mit dem, was ungültig ist, mit dem, was das Formular die Person noch fragen würde, und mit einem Link auf die Seite der Plattform, auf der das Widget des Space läuft.',
          'Die Werte stehen im Teil des Links nach dem Zeichen #, den ein Browser nie an einen Server sendet. Ein Wert, den das Formular nicht aus einem Link übernimmt, wird weggelassen und mit seinem Grund genannt: Worte aus einem freien Feld und Codes aus langen Listen, die das Formular nicht mitführt, etwa Häfen; diese wählt die Person im Formular.',
        ],
      },
      {
        id: 'person',
        title: 'Schritt 2: Die Person prüft',
        paragraphs: [
          'Die Person öffnet den Link. Das Beschreiben-Formular des Widgets beginnt mit den vorbereiteten Werten und nimmt sie nach dem Lesen aus der Adresse, sodass sie weder im Verlauf des Browsers noch in einem kopierten Link bleiben.',
          'Jeder vorbereitete Wert trägt eine Zeile, „Für Sie vorbereitet. Bitte prüfen Sie es.“, bis die Person ihn ändert oder eine Frage dazu beantwortet.',
          'Die Wichtigkeit steht nie im Link. Jeder Wert beginnt mit der Wichtigkeit, die das Formular vorschlägt, als vorgeschlagen markiert, und die Person legt sie fest; ein vorgeschlagenes „nie“ braucht weiterhin die eigene Bestätigung der Person.',
          'Ein Formular, das die Person in diesem Tab schon begonnen hat, hat Vorrang vor dem Link. Ein Widget ohne diese Änderung öffnet mit demselben Link ein leeres Formular.',
        ],
      },
      {
        id: 'send',
        title: 'Schritt 3: Vor dem Senden geht nichts hinaus',
        paragraphs: [
          'Das Öffnen des Formulars mit vorbereiteten Werten sendet keinen davon an den Space; sie gehen erst hinaus, wenn die Person auf Senden drückt.',
          'Das Werkzeug des Agenten kann keine Anfrage senden, keinen Treffer beantworten und nichts in einem Space ändern. Drückt die Person nicht auf Senden, wird nichts eingereicht.',
        ],
      },
    ],
    open: {
      title: 'Offen, nicht entschieden',
      items: [
        'Ein einmaliger Bestätigungslink, der den geprüften Entwurf des Agenten an das Formular übergibt: wartet auf eine Entscheidung.',
        'Ein Weg, im Space festzuhalten, dass ein Agent einen Wert vorbereitet hat: braucht eine Änderung am Vertrag der Space API.',
        'Das Werkzeug über das Internet erreichen statt auf dem eigenen Rechner des Agenten: nicht gebaut, nicht entschieden.',
        'Vorbereitete Codes aus langen Listen wie Häfen, ohne sie zu senden, bevor die Person es tut.',
        'Spaces mit echten Daten: Das Werkzeug liest keinen.',
      ],
    },
  },
  es: {
    banner: 'Borrador, no publicado: previsto, no está en el espacio de staging.',
    bannerNote: 'Esta página no está enlazada desde ninguna parte del sitio y nunca se indexa. Las dos partes que describe están en ramas de desarrollo, sin fusionar y en ninguna versión publicada; ninguna funciona en el espacio de staging, y ambas se probaron solo con datos sintéticos.',
    title: 'Preparar una solicitud con un agente (previsto, borrador)',
    description: 'Borrador: un agente prepara una necesidad o una oferta, la persona la revisa en el formulario y la envía, o no. Previsto, no está en staging.',
    eyebrow: 'Desarrolladores · previsto · borrador',
    h1: ['Preparar una solicitud con un agente:', 'la persona revisa y envía.'],
    lede: 'Un asistente que una persona ya usa puede preparar una necesidad o una oferta en los términos del formulario de un espacio. No envía nada. La persona abre el formulario de la plataforma con los valores preparados, revisa cada uno, cambia lo que no es correcto y pulsa enviar, o no. La página no indica ninguna fecha.',
    sections: [
      {
        id: 'roles',
        title: 'Quién hace qué',
        paragraphs: [
          'El agente prepara: lee el formulario del espacio, escribe un borrador con los criterios del formulario e indica cuánto importa cada uno. No decide nada y no puede enviar.',
          'La persona decide: una solicitud existe solo cuando una persona pulsa enviar en el formulario de la plataforma. Entonces se registra como cualquier solicitud que la persona introduce; el espacio aún no puede registrar que un agente preparó un valor.',
        ],
      },
      {
        id: 'today',
        title: 'Hoy: dos borradores, no están en el espacio de staging',
        paragraphs: [
          `La parte del agente es una herramienta del prototipo de solo lectura para el Model Context Protocol (MCP), en una rama de desarrollo del repositorio de ${PUBLIC_NAME}. Funciona en la propia máquina del agente y rechaza un espacio que no contenga datos sintéticos.`,
          'La parte del formulario es un cambio en el modo de descripción del widget, en una rama de desarrollo del widget; ninguna versión del widget lo incluye. Ninguna de las dos partes está fusionada y ninguna funciona en el espacio de staging.',
        ],
      },
      {
        id: 'agent',
        title: 'Paso 1: el agente prepara',
        paragraphs: [
          'El agente lee el formulario del espacio: sus criterios, sus opciones y sus unidades. Escribe el borrador como una lista de criterios, cada uno con un valor y una importancia. Si el agente omite una importancia, el borrador se rechaza, nunca se adivina: el agente pregunta a la persona o transmite la sugerencia del formulario como sugerencia.',
          'La herramienta comprueba el borrador con la prueba en seco del espacio, que no guarda nada. Responde con el borrador tal como se envió, lo que no es válido, lo que el formulario aún preguntaría a la persona y un enlace a la página de la plataforma donde funciona el widget del espacio.',
          'Los valores viajan en la parte del enlace después del signo #, que un navegador nunca envía a un servidor. Un valor que el formulario no toma de un enlace se omite y se nombra con su motivo: las palabras escritas en un campo libre y los códigos de listas largas que el formulario no lleva, como los puertos, que la persona elige en el formulario.',
        ],
      },
      {
        id: 'person',
        title: 'Paso 2: la persona revisa',
        paragraphs: [
          'La persona abre el enlace. El formulario de descripción del widget empieza con los valores preparados y los quita de la dirección una vez leídos, de modo que no quedan en el historial del navegador ni en un enlace copiado.',
          'Cada valor preparado lleva una línea, «Preparado para usted. Revíselo, por favor.», hasta que la persona lo cambia o responde a una pregunta sobre él.',
          'La importancia nunca está en el enlace. Cada valor empieza con la importancia que sugiere el formulario, marcada como sugerida, y la persona la fija; un «nunca» sugerido sigue necesitando la confirmación de la propia persona.',
          'Un formulario que la persona ya empezó en esa pestaña tiene prioridad sobre el enlace. Un widget sin este cambio abre un formulario vacío con el mismo enlace.',
        ],
      },
      {
        id: 'send',
        title: 'Paso 3: nada sale antes de enviar',
        paragraphs: [
          'Abrir el formulario con valores preparados no envía ninguno de ellos al espacio; salen solo cuando la persona pulsa enviar.',
          'La herramienta del agente no tiene forma de enviar una solicitud, responder a una coincidencia ni cambiar nada en un espacio. Si la persona no pulsa enviar, no se presenta nada.',
        ],
      },
    ],
    open: {
      title: 'Abierto, no decidido',
      items: [
        'Un enlace de confirmación de un solo uso que entregue al formulario el borrador ya comprobado del agente: espera una decisión.',
        'Una forma de que el espacio registre que un agente preparó un valor: requiere un cambio en el contrato de la Space API.',
        'Acceder a la herramienta por internet en lugar de en la propia máquina del agente: no construido, no decidido.',
        'Códigos preparados de listas largas como los puertos, sin enviarlos antes de que lo haga la persona.',
        'Espacios con datos reales: la herramienta no lee ninguno.',
      ],
    },
  },
  it: {
    banner: 'Bozza, non pubblicata: prevista, non è sullo spazio di staging.',
    bannerNote: 'Questa pagina non è collegata da nessuna parte del sito e non viene mai indicizzata. Le due parti che descrive sono su rami di sviluppo, non unite e in nessuna versione rilasciata; nessuna funziona sullo spazio di staging, ed entrambe sono state provate solo con dati sintetici.',
    title: 'Preparare una richiesta con un agente (prevista, bozza)',
    description: 'Bozza: un agente prepara un bisogno o un’offerta, la persona lo controlla nel modulo e lo invia, oppure no. Prevista, non è sullo staging.',
    eyebrow: 'Sviluppatori · previsto · bozza',
    h1: ['Preparare una richiesta con un agente:', 'la persona controlla e invia.'],
    lede: 'Un assistente che una persona usa già può preparare un bisogno o un’offerta nei termini del modulo di uno spazio. Non invia nulla. La persona apre il modulo della piattaforma con i valori preparati, controlla ciascuno, cambia ciò che non va e preme invia, oppure no. La pagina non indica alcuna data.',
    sections: [
      {
        id: 'roles',
        title: 'Chi fa cosa',
        paragraphs: [
          'L’agente prepara: legge il modulo dello spazio, scrive una bozza con i criteri del modulo e indica quanto conta ciascuno. Non decide nulla e non può inviare.',
          'La persona decide: una richiesta esiste solo quando una persona preme invia nel modulo della piattaforma. Viene allora registrata come ogni richiesta che la persona inserisce; lo spazio non può ancora registrare che un agente ha preparato un valore.',
        ],
      },
      {
        id: 'today',
        title: 'Oggi: due bozze, non sullo spazio di staging',
        paragraphs: [
          `La parte dell’agente è uno strumento del prototipo in sola lettura per il Model Context Protocol (MCP), su un ramo di sviluppo del repository di ${PUBLIC_NAME}. Funziona sulla macchina dell’agente stesso e rifiuta uno spazio che non contenga dati sintetici.`,
          'La parte del modulo è una modifica alla modalità di descrizione del widget, su un ramo di sviluppo del widget; nessuna versione del widget la contiene. Nessuna delle due parti è unita, e nessuna funziona sullo spazio di staging.',
        ],
      },
      {
        id: 'agent',
        title: 'Passo 1: l’agente prepara',
        paragraphs: [
          'L’agente legge il modulo dello spazio: i suoi criteri, le loro opzioni e le loro unità. Scrive la bozza come elenco di criteri, ciascuno con un valore e un’importanza. Se l’agente omette un’importanza, la bozza viene rifiutata, mai indovinata: l’agente chiede alla persona o passa il suggerimento del modulo come suggerimento.',
          'Lo strumento controlla la bozza con la prova a vuoto dello spazio, che non salva nulla. Risponde con la bozza così come è stata inviata, ciò che non è valido, ciò che il modulo chiederebbe ancora alla persona e un link alla pagina della piattaforma dove funziona il widget dello spazio.',
          'I valori viaggiano nella parte del link dopo il segno #, che un browser non invia mai a un server. Un valore che il modulo non prende da un link viene omesso e nominato con il suo motivo: le parole scritte in un campo libero e i codici di lunghi elenchi che il modulo non porta con sé, come i porti, che la persona sceglie nel modulo.',
        ],
      },
      {
        id: 'person',
        title: 'Passo 2: la persona controlla',
        paragraphs: [
          'La persona apre il link. Il modulo di descrizione del widget parte con i valori preparati e li toglie dall’indirizzo una volta letti, così non restano nella cronologia del browser né in un link copiato.',
          'Ogni valore preparato porta una riga, «Preparato per Lei. La preghiamo di controllarlo.», finché la persona non lo cambia o risponde a una domanda su di esso.',
          'L’importanza non è mai nel link. Ogni valore parte con l’importanza che il modulo suggerisce, segnata come suggerita, e la persona la stabilisce; un «mai» suggerito richiede comunque la conferma della persona stessa.',
          'Un modulo che la persona ha già iniziato in quella scheda ha la precedenza sul link. Un widget senza questa modifica apre un modulo vuoto con lo stesso link.',
        ],
      },
      {
        id: 'send',
        title: 'Passo 3: nulla esce prima dell’invio',
        paragraphs: [
          'Aprire il modulo con valori preparati non ne invia nessuno allo spazio; escono solo quando la persona preme invia.',
          'Lo strumento dell’agente non ha modo di inviare una richiesta, rispondere a una corrispondenza o cambiare qualcosa in uno spazio. Se la persona non preme invia, non viene presentato nulla.',
        ],
      },
    ],
    open: {
      title: 'Aperto, non deciso',
      items: [
        'Un link di conferma monouso che consegni al modulo la bozza già controllata dell’agente: attende una decisione.',
        'Un modo per lo spazio di registrare che un agente ha preparato un valore: richiede una modifica al contratto della Space API.',
        'Raggiungere lo strumento via internet invece che sulla macchina dell’agente stesso: non costruito, non deciso.',
        'Codici preparati da lunghi elenchi come i porti, senza inviarli prima che lo faccia la persona.',
        'Spazi con dati reali: lo strumento non ne legge nessuno.',
      ],
    },
  },
  fr: {
    banner: 'Brouillon, non publié : prévu, pas sur l’espace de staging.',
    bannerNote: 'Cette page n’est liée depuis aucun endroit du site et n’est jamais indexée. Les deux parties qu’elle décrit sont sur des branches de développement, non fusionnées et dans aucune version publiée ; aucune ne tourne sur l’espace de staging, et les deux n’ont été essayées qu’avec des données synthétiques.',
    title: 'Préparer une demande avec un agent (prévu, brouillon)',
    description: 'Brouillon : un agent prépare un besoin ou une offre, la personne le vérifie dans le formulaire et l’envoie, ou non. Prévu, pas sur le staging.',
    eyebrow: 'Développeurs · prévu · brouillon',
    h1: ['Préparer une demande avec un agent :', 'la personne vérifie et envoie.'],
    lede: 'Un assistant qu’une personne utilise déjà peut préparer un besoin ou une offre dans les termes du formulaire d’un espace. Il n’envoie rien. La personne ouvre le formulaire de la plateforme avec les valeurs préparées, vérifie chacune, corrige ce qui ne va pas et appuie sur envoyer, ou non. La page n’indique aucune date.',
    sections: [
      {
        id: 'roles',
        title: 'Qui fait quoi',
        paragraphs: [
          'L’agent prépare : il lit le formulaire de l’espace, rédige un brouillon avec les critères du formulaire et indique l’importance de chacun. Il ne décide rien et ne peut pas envoyer.',
          'La personne décide : une demande n’existe que lorsqu’une personne appuie sur envoyer dans le formulaire de la plateforme. Elle est alors enregistrée comme toute demande que la personne saisit ; l’espace ne peut pas encore enregistrer qu’un agent a préparé une valeur.',
        ],
      },
      {
        id: 'today',
        title: 'Aujourd’hui : deux brouillons, pas sur l’espace de staging',
        paragraphs: [
          `La partie de l’agent est un outil du prototype en lecture seule pour le Model Context Protocol (MCP), sur une branche de développement du dépôt de ${PUBLIC_NAME}. Il tourne sur la propre machine de l’agent et refuse un espace qui ne contient pas de données synthétiques.`,
          'La partie du formulaire est une modification du mode de description du widget, sur une branche de développement du widget ; aucune version du widget ne la contient. Aucune des deux parties n’est fusionnée, et aucune ne tourne sur l’espace de staging.',
        ],
      },
      {
        id: 'agent',
        title: 'Étape 1 : l’agent prépare',
        paragraphs: [
          'L’agent lit le formulaire de l’espace : ses critères, leurs options et leurs unités. Il rédige le brouillon comme une liste de critères, chacun avec une valeur et une importance. Si l’agent omet une importance, le brouillon est refusé, jamais deviné : l’agent demande à la personne ou transmet la suggestion du formulaire comme suggestion.',
          'L’outil vérifie le brouillon avec l’essai à blanc de l’espace, qui n’enregistre rien. Il répond avec le brouillon tel qu’envoyé, ce qui n’est pas valide, ce que le formulaire demanderait encore à la personne, et un lien vers la page de la plateforme où tourne le widget de l’espace.',
          'Les valeurs voyagent dans la partie du lien après le signe #, qu’un navigateur n’envoie jamais à un serveur. Une valeur que le formulaire ne reprend pas d’un lien est laissée de côté et nommée avec sa raison : les mots écrits dans un champ libre, et les codes de longues listes que le formulaire ne porte pas, comme les ports, que la personne choisit dans le formulaire.',
        ],
      },
      {
        id: 'person',
        title: 'Étape 2 : la personne vérifie',
        paragraphs: [
          'La personne ouvre le lien. Le formulaire de description du widget commence avec les valeurs préparées et les retire de l’adresse une fois lues, de sorte qu’elles ne restent ni dans l’historique du navigateur ni dans un lien copié.',
          'Chaque valeur préparée porte une ligne, « Préparé pour vous. Veuillez vérifier. », jusqu’à ce que la personne la modifie ou réponde à une question à son sujet.',
          'L’importance n’est jamais dans le lien. Chaque valeur commence avec l’importance que le formulaire suggère, marquée comme suggérée, et la personne la fixe ; un « jamais » suggéré demande toujours la confirmation de la personne elle-même.',
          'Un formulaire que la personne a déjà commencé dans cet onglet l’emporte sur le lien. Un widget sans cette modification ouvre un formulaire vide avec le même lien.',
        ],
      },
      {
        id: 'send',
        title: 'Étape 3 : rien ne part avant l’envoi',
        paragraphs: [
          'Ouvrir le formulaire avec des valeurs préparées n’en envoie aucune à l’espace ; elles ne partent que lorsque la personne appuie sur envoyer.',
          'L’outil de l’agent n’a aucun moyen d’envoyer une demande, de répondre à une correspondance ou de modifier quoi que ce soit dans un espace. Si la personne n’appuie pas sur envoyer, rien n’est soumis.',
        ],
      },
    ],
    open: {
      title: 'Ouvert, non décidé',
      items: [
        'Un lien de confirmation à usage unique qui remette au formulaire le brouillon déjà vérifié de l’agent : attend une décision.',
        'Un moyen pour l’espace d’enregistrer qu’un agent a préparé une valeur : demande une modification du contrat de la Space API.',
        'Atteindre l’outil par internet au lieu de la propre machine de l’agent : pas construit, pas décidé.',
        'Des codes préparés issus de longues listes comme les ports, sans les envoyer avant que la personne ne le fasse.',
        'Des espaces avec des données réelles : l’outil n’en lit aucun.',
      ],
    },
  },
};
