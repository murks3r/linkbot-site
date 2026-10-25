/* Las palabras del sitio en español: traducción del catálogo fuente en inglés. */
import type { Catalogue, Section, Status } from './en.ts';
import { statusDate } from './status-date.ts';

/** The day the status sentences were checked, in this language (status-date.ts). */
const AS_OF = statusDate('es');

export const es: Catalogue = {
  site: {
    name: 'Linkbot',
    claim: 'Una capa de emparejamiento que cualquier plataforma puede integrar.',
    skip: 'Saltar al contenido',
    menu: 'Menú',
    toc: 'En esta página',
    language: 'Idioma',
    nav: { how: 'Cómo funciona', sees: 'Quién ve qué', platforms: 'Para plataformas', verticals: 'Para verticales', integrations: 'Integraciones', developers: 'Desarrolladores' },
    footer: {
      product: 'Linkbot',
      legal: 'Legal',
      imprint: 'Aviso legal',
      privacy: 'Aviso de privacidad',
      contact: 'Contacto',
      contactPending: 'Los datos de contacto llegarán con nuestro dominio. Linkbot aún no tiene dominio propio, por eso este sitio no indica ninguna dirección ni tiene formulario de contacto.',
      line: 'Este sitio no usa cookies, no carga nada de terceros y no usa analíticas.',
    },
    status: { now: 'En el espacio de staging', contract: 'En el contrato, no en el espacio de staging', later: 'No construido' },
    synthetic: 'Todo en este sitio describe el contrato de Space API y lo que se ejecuta en el espacio de staging sintético de Geoprocure, con datos sintéticos. Ninguna persona ni organización real lo usa todavía.',
    more: 'Leer más',
  },

  home: {
    h1: ['Solicitudes y ofertas se encuentran.', 'Las personas deciden.'],
    lede: 'Linkbot es una capa de emparejamiento que una plataforma integra en sus propias páginas. Un espacio por mercado. Solicitudes y ofertas como criterios confirmados. Un veredicto por criterio, nunca una puntuación. Una presentación solo cuando ambas partes dicen que sí.',
    actions: { how: 'Cómo funciona', platforms: 'Para plataformas' },
    flow: {
      label: 'De una solicitud a una presentación',
      steps: [
        { name: 'Describir', note: 'una solicitud o una oferta, por formulario' },
        { name: 'Confirmar', note: 'antes no se guarda nada' },
        { name: 'Encaje', note: 'un veredicto por criterio' },
        { name: 'Aprobar', note: 'un operador con nombre, tras los gates' },
        { name: 'Sí de ambos', note: 'cada parte por sí misma' },
        { name: 'Presentar', note: 'entonces, y solo entonces' },
      ],
    },
    pillars: [
      { title: 'Un espacio por mercado.', body: 'Un espacio es un mercado en una plataforma, con su propia instancia, base de datos y claves. Un pack le da el vocabulario de su vertical: los criterios, las opciones, las unidades, las preguntas. El primer espacio es el de Geoprocure, para minerales industriales.' },
      { title: 'Criterios confirmados.', body: 'Una solicitud o una oferta es un conjunto de criterios, cada uno con su fuente y su importancia. Nada está preseleccionado, nada se adivina, y lo no declarado sigue desconocido. La persona confirma el formulario; solo entonces se guarda algo.' },
      { title: 'Una presentación solo tras el sí de ambas partes.', body: 'El emparejamiento compara los criterios guardados y muestra un veredicto por criterio. Una presentación requiere los gates del espacio, la aprobación de un operador con nombre y el sí de ambas partes. El servidor la crea entonces, y rechaza cualquier otra vía.' },
    ],
    rules: {
      title: 'Las reglas, aplicadas por el servidor',
      items: [
        'Nunca adivinar: cada valor guardado lleva su fuente, y «Otro / no está en la lista» nunca se asigna a la opción más cercana.',
        'Nada preseleccionado: el formulario no tiene valores por defecto, solo sugerencias marcadas como tales.',
        'Lo desconocido sigue desconocido: un criterio que una parte no declaró nunca cuenta como encaje.',
        'Nada se guarda antes de que una persona confirme.',
        'Una coincidencia no revela nada: solo veredictos, en la etapa que el pack permite, y un aviso de que las personas deciden.',
        'Ninguna presentación sin los gates, la aprobación de un operador con nombre y el sí de ambas partes.',
        'Ningún modelo anula una condición dura: Imprescindible y Nunca se deciden con código determinista.',
        'Cada escritura indica quién la hizo y aparece en el registro de auditoría.',
      ],
      link: 'Cómo funciona el emparejamiento, paso a paso',
    },
  },

  how: {
    title: 'Cómo funciona Linkbot: de una solicitud confirmada a una presentación',
    description: 'Un espacio, un pack, cuatro formas de describir, veredicto por criterio, aprobación de un operador con nombre y presentación solo tras el sí de ambos.',
    eyebrow: 'Cómo funciona',
    h1: ['De una solicitud confirmada', 'a una presentación.'],
    lede: 'Cada paso de abajo está en el contrato de Space API. Donde el espacio de staging aún no ejecuta un paso, la página lo dice.',
    toc: [['blocks', 'Tres piezas'], ['rule', 'El sí de ambas partes'], ['path', 'El camino en seis pasos'], ['space', 'Un espacio'], ['pack', 'Un pack'], ['describe', 'Cuatro formas de describir'], ['confirm', 'Confirmar'], ['matching', 'Emparejamiento'], ['approval', 'Aprobación y gates'], ['yes', 'El sí de ambas partes'], ['introduction', 'La presentación'], ['after', 'Después'], ['sees', 'Quién ve qué'], ['languages', 'Cinco idiomas'], ['today', 'Qué se ejecuta en el espacio de staging']] as [string, string][],
    blocks: {
      title: 'Tres piezas',
      lede: 'Un espacio se compone de tres partes. Cada una es un grupo de rutas del contrato de Space API.',
      items: [
        { name: 'Captación', text: 'Un comprador o un proveedor describe una necesidad o una oferta, con el formulario o con sus propias palabras, revisa cada valor y confirma. Antes de la confirmación no se guarda nada, y el servidor comprueba cada valor con el pack del espacio.' },
        { name: 'Seguimiento', text: `Un seguimiento mantiene abierta una necesidad o una oferta confirmada y avisa solo a su titular cuando algo nuevo encaja, por correo o webhook. El titular lo pausa o lo termina cuando quiere, también desde un enlace. A ${AS_OF}, los correos de seguimiento del espacio de staging van a un buzón de prueba y no llegan a nadie, y todavía no envía webhooks.` },
        { name: 'Presentaciones', text: 'Cuando ambas partes han dicho que sí y un operador con nombre lo ha aprobado, el servidor presenta a las dos partes y da a cada una un comprobante de quién puede ver qué campos. Después se pregunta a ambas partes por el resultado.' },
      ],
    },
    rule: {
      title: 'Ninguna presentación sin el sí de ambas partes',
      paras: [
        'El emparejamiento encuentra posibles encajes; no presenta a nadie. Cada parte responde a un posible encaje por sí misma. Antes de que ambas digan que sí, la otra parte no sabe nada, y un no posterior revoca un sí.',
        'El espacio exige además la aprobación de un operador con nombre tras las comprobaciones que fija. El servidor crea una presentación solo cuando se cumplen las tres condiciones, en cualquier orden, y rechaza cualquier otra vía.',
      ],
    },
    path: { title: 'El camino en seis pasos', lede: 'Los seis pasos de la página de demostración, y quién actúa en cada uno.', link: 'La página de demostración' },
    space: {
      title: 'Un espacio es un mercado en una plataforma',
      paras: [
        'Cada espacio es su propia instancia: su propia aplicación, base de datos, claves y registro de borrado. La dirección de la instancia identifica el espacio; ningún id de espacio aparece en ninguna ruta.',
        'Un espacio se configura con un pack y una versión de él, los idiomas que ofrece, el modo de sus presentaciones, los gates que exige y los orígenes en los que se permiten sus páginas. La página de la plataforma lleva una publishable key, que solo identifica el espacio y solo funciona en esos orígenes. La secret key queda en el servidor de la plataforma y nunca aparece en una página.',
        'El emparejamiento se ejecuta dentro de un espacio. Nada sale de él: ninguna solicitud, ninguna oferta y ningún encaje se comparte con otro espacio.',
        'El primer espacio es el de Geoprocure, para minerales industriales. Se ejecuta en una instancia de staging sintética con datos sintéticos.',
      ],
    },
    pack: {
      title: 'Un pack es el vocabulario de una vertical',
      paras: [
        'Un pack enumera los criterios que una solicitud y una oferta pueden declarar, cada uno con su control: una opción, varias opciones, un número con una unidad, un rango, una ventana de fechas, una lista con búsqueda como puertos, o texto libre. Donde una cantidad depende de una base, el pack lo dice, y «No lo sé» mantiene la base desconocida en lugar de elegir una.',
        'El pack dice qué respuestas especiales permite un criterio: «Otro / no está en la lista», que conserva las palabras de la persona y nunca se asigna a una opción; «No lo sé»; y «Cualquiera». Lleva las etiquetas, preguntas, sinónimos y avisos en los idiomas del espacio.',
        'También fija qué revela cada criterio en cada etapa: en el tablón, en una posible coincidencia, en una presentación o solo al equipo de la plataforma; cómo se reduce el detalle de un valor para el tablón; qué importancias permite un criterio; y los gates y las categorías de resultado del mercado.',
        'Un espacio fija una versión de su pack, y el servidor valida cada envío contra esa versión. Nunca se confía en el cliente.',
      ],
    },
    describe: {
      title: 'Cuatro formas de decir lo que solicita u ofrece',
      lede: `A fecha de ${AS_OF}, el formulario, el texto, el tablón y los seguimientos se ejecutan en el espacio de staging. Los webhooks aún no se ejecutan allí, y su email va a un buzón de prueba que no llega a nadie.`,
      items: [
        { name: 'Por formulario', status: 'now' as Status, paras: [
          'El formulario se genera a partir del pack. Los criterios obligatorios van primero; el resto queda detrás de «más detalles». Nada está preseleccionado: ni opción, ni unidad, ni base, ni tipo de parte. Cada lista ofrece «Otro / no está en la lista», «No lo sé» y «Cualquiera» donde el pack los permite.',
          'Cada criterio lleva una importancia. Imprescindible y Nunca son duras; Deseable, Aceptable y Mejor no son blandas. El pack puede sugerir una, marcada «sugerida», y la persona puede cambiarla salvo que el pack la bloquee. Elegir Nunca pide una confirmación aparte.',
        ] },
        { name: 'Con sus propias palabras', status: 'now' as Status, paras: [
          'Una persona escribe lo que solicita u ofrece. Una lectura propone valores para los mismos criterios, cada uno junto a las palabras de las que salió, y pregunta donde no puede decidir: una unidad, una opción, un número que dos convenciones leen de forma distinta. Una lectura nunca sobrescribe lo que una persona eligió; una diferencia se convierte en una pregunta.',
          'En el espacio de staging, reglas fijas leen el texto, sin un modelo; un lector con modelo espera a que se apruebe una política de lectura. Sea cual sea el lector del texto, las condiciones duras quedan en código determinista: ningún modelo anula un Imprescindible ni un Nunca.',
        ] },
        { name: 'En el tablón', status: 'now' as Status, paras: [
          'El tablón lista solicitudes y ofertas cuyo titular lo eligió, nunca por defecto. Muestra solo los campos que el pack permite en la etapa de tablón, simplificados como declara el pack, y nunca quién publicó. Responder a un anuncio inicia un borrador en el otro lado, en el mismo formulario.',
        ] },
        { name: 'Con un seguimiento', status: 'now' as Status, paras: [
          'Un seguimiento mantiene abierta una solicitud o una oferta y avisa a su titular cuando algo nuevo encaja, por email o, para la plataforma, por webhook. Notifica solo a su titular y nunca revela más que el tablón. Una persona puede pausarlo, reanudarlo o terminarlo, también desde el enlace de un mensaje.',
        ] },
      ],
    },
    confirm: {
      title: 'Confirmar es lo primero que se guarda',
      paras: [
        'Antes de que una persona confirme, no se guarda nada personal: describir, responder y validar no dejan nada. El widget lo dice encima del botón de confirmar: «No se usa nada hasta que usted lo confirme». Un borrador vive en la pestaña del navegador y desaparece al cerrarla.',
        'El paso de confirmar es el formulario. El servidor valida cada valor contra el pack fijado y nombra cada campo que falla. Qué se guarda: los criterios con sus valores, fuentes e importancias; la parte, una persona o una organización con un nombre visible opcional; y, si se da, una dirección de email, que la persona confirma mediante un enlace.',
        'El navegador que confirmó gestiona lo que creó: muestra «Mis solicitudes y ofertas», responde posibles coincidencias y cambia el seguimiento, durante sesenta días desde el último uso, y solo en esa pestaña. Un navegador nuevo vuelve a obtener acceso mediante un enlace enviado a la dirección confirmada.',
        'En un espacio con comprobación de parte, como el de Geoprocure, el paso de confirmar muestra el aviso propio del espacio. La persona marca por sí misma la autorización para revelar su identidad en esa comprobación; nada se marca de antemano, y una confirmación sin ella se rechaza.',
      ],
    },
    matching: {
      title: 'Emparejamiento: un veredicto por criterio, nunca una puntuación',
      paras: [
        'El emparejamiento se ejecuta sobre los valores guardados con reglas deterministas, tras una confirmación, tras un cambio y una vez al día. Compara los requisitos de la solicitud con los hechos que declara la oferta.',
        'Para cada criterio que el pack deja comparar, una coincidencia muestra un veredicto: encaja, encaja en parte, contradice o desconocido, con la regla que lo decidió y los valores guardados que cita. Un límite que se cumple encaja, un rango que cruza el límite encaja en parte, un límite que no se cumple contradice. «Cualquiera» en la solicitud encaja. «No lo sé» u «Otro / no está en la lista» en cualquier lado es desconocido, y desconocido nunca es un encaje.',
        'Si una pareja puede encajar o no depende solo de las condiciones duras, Imprescindible y Nunca. Nada más cambia lo que ve el otro lado. No hay puntuación.',
        'Una posible coincidencia no revela nada por sí misma: solo los veredictos de los campos que el pack permite en la etapa de coincidencia, y un aviso fijo de que las personas deciden. Cuando una solicitud u oferta ha tenido muchos encajes nuevos en poco tiempo, el espacio retiene el resto y una ejecución posterior los propone.',
      ],
    },
    approval: {
      title: 'Aprobación y gates: una persona con nombre, nunca el sistema',
      paras: [
        'Cada caso lo aprueba un operador activo de la plataforma, con nombre. Antes, cada gate que exige el espacio tiene que quedar registrado como superado por un operador con nombre. Un gate nunca lo decide el sistema: el operador registra una comprobación hecha en otro sitio, con una referencia y sin datos personales.',
        'El gate obligatorio de Geoprocure es una comprobación KYC y de sanciones. No se puede eximir. Un operador puede remitirla a asesoría jurídica, lo que la deja abierta. Decide el registro más reciente de un gate.',
        'Una aprobación por sí sola no revela nada. Un caso rechazado se registra como rechazado; su motivo queda en el registro de auditoría.',
      ],
    },
    yes: {
      title: 'Ambas partes dicen que sí, cada una por sí misma',
      paras: [
        'Cada parte responde una posible coincidencia por su lado: sí, no o ahora no. Antes de que ambas digan que sí, el otro lado no se entera de la respuesta. Cuenta la última respuesta, de modo que un no posterior revoca un sí.',
        'El servidor crea la presentación por sí mismo en el momento en que se cumple la última de las tres condiciones, en cualquier orden: gates superados, caso aprobado, sí de ambas partes. Rechaza cualquier otra vía.',
      ],
    },
    introduction: {
      title: 'La presentación, en el modo que eligió el espacio',
      paras: [
        'En el modo de operador, el predeterminado de Geoprocure, los campos de la etapa de presentación llegan solo al equipo de la plataforma: nombres visibles, las direcciones de email confirmadas, los criterios que el pack guarda para esta etapa. Cada parte recibe un comprobante que dice que ambas partes aceptaron y que la plataforma se pondrá en contacto con ellas, y que no lleva nada del otro lado.',
        'En el modo directo, cada parte ve los campos de la otra en la etapa de presentación. El equipo de la plataforma ve ambos. Un campo que el pack reserva al operador nunca llega al otro lado.',
        'Un comprobante registra quién puede ver qué campos, y cada lectura de una presentación queda registrada en él. Lo que no está en el comprobante no se revela nunca después.',
      ],
    },
    after: {
      title: 'Después: resultados, cambios, borrado',
      paras: [
        'A ambas partes se les pide el resultado a los treinta, sesenta y noventa días; el equipo de la plataforma también puede registrarlo. Las categorías salen de los ajustes del espacio.',
        'Una persona puede cambiar una solicitud o una oferta confirmada con el mismo formulario, pausarla, reanudarla o cerrarla. Cada cambio vuelve a ejecutar el emparejamiento.',
        'Una persona puede pedir que se borren sus datos desde el navegador que confirmó; la petición tiene que confirmarse mediante un enlace enviado a una dirección confirmada antes. La plataforma puede borrar en nombre de una persona, con una referencia. Qué se elimina: el nombre visible, las direcciones, cada criterio y consentimiento, los veredictos de sus coincidencias, sus tokens y su correo. Qué se queda: ids, claves de campo, fechas y estados, para que los comprobantes y el registro de auditoría sigan siendo coherentes. Cada borrado se escribe en el registro de borrado de la instancia, y nada afirma recuperar copias que salieron de la instancia.',
      ],
    },
    sees: {
      title: 'Quién ve qué, etapa por etapa',
      lede: 'El pack da a cada criterio una etapa. Una etapa es lo más lejos que viaja un valor: una coincidencia no muestra más de lo que permite su etapa, y un seguimiento nunca revela más que el tablón.',
      stages: [
        { name: 'Tablón', who: 'Todo el que puede ver el tablón', what: 'Solo campos de la etapa de tablón, simplificados como declara el pack, y solo de solicitudes y ofertas cuyo titular lo eligió. Nunca quién publicó.' },
        { name: 'Coincidencia', who: 'Las dos partes de una posible coincidencia', what: 'Veredictos de los campos de la etapa de coincidencia o inferior, con la regla y los valores que cita. Sin nombre, sin datos de contacto, sin rastro de la respuesta del otro lado.' },
        { name: 'Presentación', who: 'En modo de operador, el equipo de la plataforma; en modo directo, ambas partes', what: 'Nombre visible, dirección de email confirmada y los criterios que el pack guarda para esta etapa. Cada lectura queda registrada en el comprobante.' },
        { name: 'Operador', who: 'Solo el equipo de la plataforma', what: 'Campos que el pack reserva a la plataforma, como los datos de identidad para una comprobación KYC. Nunca llegan al otro lado, y cada acceso queda registrado.' },
      ],
    },
    languages: {
      title: 'Cinco idiomas, y sin traducción de sus palabras',
      paras: [
        'El widget se ejecuta en inglés, alemán, español, italiano y francés. La página fija el idioma, luego el navegador del visitante, luego el predeterminado del espacio; un idioma que el espacio no ofrece se sustituye por el siguiente, y el widget lo dice en pantalla.',
        'Space API responde en el idioma solicitado, o en el predeterminado del espacio, y dice cuál. Las etiquetas, preguntas, explicaciones y avisos llegan en ese idioma.',
        'El texto propio de una persona nunca se traduce. El idioma del formulario y el idioma de las palabras son independientes.',
      ],
    },
    today: {
      title: 'Qué se ejecuta en el espacio de staging, y qué no todavía',
      lede: `Comprobado el ${AS_OF} con el informe de estado del espacio de staging y el plan de Connect: qué partes se ejecutan allí, con los mismos cuadrados que el producto usa como evidencia.`,
    },
  },

  platforms: {
    title: 'Integraciones: un espacio Linkbot en sus propias páginas',
    description: 'Un espacio Linkbot en sus páginas: un script y un elemento, una publishable key, su aviso de datos, una consola para su equipo y webhooks para su servidor.',
    eyebrow: 'Integraciones',
    h1: ['Un espacio', 'en sus propias páginas.'],
    lede: 'Un script y un elemento muestran el widget en su página, con sus fuentes y colores. Su equipo aprueba casos en una consola en su máquina o detrás de su propio inicio de sesión. Su servidor se entera de los eventos mediante webhooks firmados.',
    toc: [['pages', 'Cada integración'], ['embed', 'El embed'], ['keys', 'Claves y orígenes'], ['console', 'La consola'], ['server', 'SDK y webhooks'], ['recipes', 'Recetas'], ['state', 'Estado actual']] as [string, string][],
    embed: {
      title: 'El embed: un script, un elemento',
      paras: [
        'El script sale de la propia instancia de su espacio. El elemento lleva su publishable key, el modo (describe, board o mine), el lado (una solicitud o una oferta) y el idioma. Varios elementos en una página son varios widgets.',
        'El widget se dibuja en un shadow root, toma la fuente y el color de texto de su página y fija todo lo demás mediante variables CSS en el elemento. No necesita «unsafe-inline» bajo una Content Security Policy.',
        'Su propio aviso de datos va dentro del elemento y aparece encima del botón de confirmar, junto a las líneas fijas del widget. El widget no usa cookies, guarda su borrador y sus tokens en la pestaña del navegador, y no envía nada a nadie salvo a su espacio.',
      ],
    },
    keys: {
      title: 'Claves y orígenes',
      paras: [
        'Una publishable key identifica su espacio y solo funciona en los orígenes que su espacio permite; va en la página. Una secret key va en su servidor; el widget se niega a arrancar con una y le dice que la rote.',
        'Los orígenes permitidos se fijan al aprovisionar un espacio. Desde el contrato 0.2.9, Space API puede cambiarlos, y también la consola.',
      ],
    },
    console: {
      title: 'La consola para su equipo',
      paras: [
        'La consola muestra la cola de aprobación, cada caso con sus gates y su aprobación, las presentaciones con sus comprobantes, los resultados, los endpoints de webhook y los operadores. Se ejecuta en una máquina suya o detrás de su propio inicio de sesión; la secret key queda en su servidor. No hay inicio de sesión de Linkbot para operadores.',
        'Sus pantallas de ajustes y cambios de criterios, claves, orígenes y funnel usan las rutas que Space API tiene desde el contrato 0.2.9.',
      ],
    },
    server: {
      title: 'Su servidor: el SDK y los webhooks',
      paras: [
        `El SDK da a su servidor un cliente tipado por el contrato de Space API: una ruta, un campo o un valor que el contrato no tiene es un error de tipos. También comprueba las entregas de webhook exactamente como especifica el contrato. A fecha de ${AS_OF} no está publicado; su código está en el repositorio de Connect.`,
        `Los webhooks llevan ids y estados, nunca datos de contacto; su servidor obtiene los detalles con su secret key. Las entregas van firmadas y se reintentan. Están en el contrato; a fecha de ${AS_OF}, el espacio de staging no las envía.`,
      ],
    },
    recipes: {
      title: 'Recetas: HTML plano, Astro, Next.js, WordPress',
      paras: [
        'Cada receta es un archivo que se ejecuta en el CI de Connect en tres motores de navegador contra la build de muestra con datos sintéticos: una página plana con una Content Security Policy estricta, un componente de Astro, una página de Next.js con el wrapper de React y un pequeño plugin de WordPress con un shortcode.',
        `A fecha de ${AS_OF} se ejecutan en el CI de Connect contra la build de muestra, no contra un espacio; la propia instancia de staging sirve la release 0.3.0-v1 del widget.`,
      ],
    },
    state: { title: 'Estado actual' },
  },

  forPlatforms: {
    title: 'Para plataformas: lo que obtiene un operador con un espacio Linkbot',
    description: 'Para quien quiere un espacio para su mercado: las cuatro vías de entrada, lo que obtiene una plataforma y lo que sigue siendo suyo: sus datos y su decisión.',
    eyebrow: 'Para plataformas',
    h1: ['Su mercado, sus páginas,', 'su decisión.'],
    lede: 'Para un operador que quiere un espacio para su propio mercado: cómo llega un espacio a sus usuarios, qué obtiene usted y qué sigue siendo suyo. Esta página describe el contrato de Space API y el espacio de staging sintético de Geoprocure. Todavía ninguna plataforma real gestiona un espacio, y esta página no menciona precios.',
    toc: [['ways', 'Cuatro vías de entrada'], ['gets', 'Lo que obtiene'], ['yours', 'Lo que sigue siendo suyo'], ['details', 'Los detalles']] as [string, string][],
    ways: {
      title: 'Cuatro vías de entrada',
      lede: `A ${AS_OF}, dos de ellas se ejecutan en el espacio de staging y dos no están construidas.`,
      items: [
        { name: 'Páginas alojadas', status: 'later' as Status, body: 'Una página servida para usted, a la que enlaza en lugar de integrarla. No está construida. Hoy un espacio aparece solo en sus propias páginas, mediante la integración o mediante su propio servidor.' },
        { name: 'La integración', status: 'now' as Status, body: 'Un script y un elemento en su página. El script viene de la propia instancia de su espacio; el elemento lleva su clave publicable, que solo funciona en los orígenes que su espacio permite. Sus modos: describir, tablón, seguimiento y lo mío. La instancia de staging sirve la versión 0.3.0-v1 del widget.' },
        { name: 'La API y el SDK', status: 'now' as Status, body: `Su servidor habla con Space API con la clave secreta, que nunca aparece en una página: puede crear necesidades y ofertas, registrar comprobaciones y aprobaciones, y leer presentaciones y resultados. El SDK da a su servidor un cliente tipado por el contrato. A ${AS_OF} el SDK no está publicado; su código está en el repositorio de Connect.` },
        { name: 'MCP', status: 'later' as Status, body: 'Previsto, no construido: un servidor MCP por espacio, a través del cual un agente de IA prepara una necesidad o una oferta y una persona confirma y responde. El propietario eligió esta dirección; su diseño está propuesto y su contrato es un esqueleto.' },
      ],
    },
    gets: {
      title: 'Lo que obtiene una plataforma',
      items: [
        'Un espacio propio: una instancia para un mercado, con su propia base de datos, sus claves y su registro de borrado.',
        'Un pack con el vocabulario de su mercado. El formulario, la lectura del texto, el tablón y las reglas del emparejamiento se derivan de él.',
        'Un widget que adopta la fuente y el color de texto de su página, con su propio aviso de datos encima del botón de confirmar.',
        'Emparejamiento con un veredicto por criterio, nunca una puntuación, y una presentación solo tras el sí de ambas partes y la aprobación de su equipo.',
        `Una consola para su equipo: la cola de aprobación, los casos con sus comprobaciones, las presentaciones con comprobantes y los resultados. Funciona en su equipo o detrás de su propio inicio de sesión. A ${AS_OF} funciona con una muestra de datos sintéticos y no está publicada.`,
        `Webhooks a su servidor, con ids y estados, nunca datos de contacto. Están en el contrato; a ${AS_OF} el espacio de staging no los envía.`,
      ],
    },
    yours: {
      title: 'Lo que sigue siendo suyo',
      items: [
        'Su decisión. No hay presentación si un operador con nombre de su equipo no la aprueba, tras las comprobaciones que fija su espacio. El sistema nunca decide una comprobación, y cada parte dice sí o no por sí misma.',
        'Sus datos. Las necesidades, ofertas y encajes de un espacio no se comparten con otro espacio. Los webhooks no llevan datos de contacto; su servidor obtiene los detalles con su clave secreta.',
        'Sus páginas. Su propio aviso de datos, su fuente y sus colores. El widget no instala cookies y no envía nada a nadie más que a su espacio.',
        'Su inicio de sesión. Su equipo entra con su propio inicio de sesión; no existe un inicio de sesión de Linkbot para operadores.',
      ],
    },
    details: { title: 'Los detalles', lede: 'Las páginas de integración muestran cómo funciona cada parte: la integración, claves y orígenes, la consola, el SDK y los webhooks, y recetas para HTML simple, WordPress, Next.js y Astro.', link: 'Integraciones' },
  },

  developers: {
    title: 'Para desarrolladores: integrar el widget o construir sobre Space API',
    description: 'Dónde está la documentación de Connect, la integración más corta, un breve ejemplo del SDK para su servidor y lo que aún no existe: paquetes npm y MCP.',
    eyebrow: 'Para desarrolladores',
    h1: ['Un script,', 'o su propia interfaz.'],
    lede: `Dos formas de construir con un espacio: la integración, un script y un elemento en su página, o su propia interfaz sobre Space API mediante el SDK, un cliente tipado por el contrato. La documentación de Connect muestra ambas. A ${AS_OF} está en el repositorio de Connect, que todavía no es público.`,
    toc: [['embed', 'La integración más corta'], ['sdk', 'El SDK en su servidor'], ['docs', 'La documentación'], ['not-yet', 'Aún no disponible']] as [string, string][],
    embed: {
      title: 'La integración más corta',
      lede: 'Colóquela donde deba aparecer el formulario: su clave publicable en el elemento y la dirección de su espacio en el script.',
      url: 'EMBED_URL representa esta dirección, en la propia instancia de su espacio; no hay un host central:',
      notes: [
        'El modo es describe, board, watch o mine; el lado es seeking u offer. Sin idioma, el widget sigue el navegador del visitante.',
        'La clave publicable solo funciona en los orígenes que su espacio permite. Una clave secreta nunca va en una página: el widget se niega a arrancar con ella.',
        `A ${AS_OF}, la instancia del espacio de staging sintético de Geoprocure sirve la versión 0.3.0-v1 del widget.`,
      ],
    },
    sdk: {
      title: 'El SDK en su servidor',
      lede: 'Una vez, desde su servidor, con la clave secreta: registra su receptor de webhooks y devuelve el secreto de firma, que se muestra solo esta vez.',
      notes: [
        `A ${AS_OF} el SDK no está en npm. Se usa desde un clon del repositorio de Connect, donde es un paquete del workspace.`,
        `La prueba de este ejemplo se ejecuta contra un sustituto, no contra un espacio. A ${AS_OF} el espacio de staging no envía webhooks.`,
      ],
    },
    docs: {
      title: 'La documentación',
      lede: `En el repositorio de Connect, en su rama de construcción. A ${AS_OF} el repositorio es privado, así que son rutas, no enlaces.`,
      items: {
        embed5: { name: 'Integrar en 5 minutos', body: 'Su clave publicable, el origen de su página en la lista de permitidos, el fragmento y qué hacer si el widget no aparece.' },
        quickstart: { name: 'Inicio rápido para desarrolladores', body: 'Para su propia interfaz en lugar del widget: una persona describe, confirma, ve las coincidencias, dice sí y encuentra la presentación, mediante el cliente de invitado del SDK. Solo se ha ejecutado contra un ejemplo local con datos sintéticos.' },
        nextjs: { name: 'El ejemplo de Next.js', body: 'Cada modo del widget, y «mine» leído en el servidor mediante el SDK. Se ejecuta contra un sustituto local, no contra un espacio.' },
        astro: { name: 'El ejemplo de Astro', body: 'Lo mismo en Astro: cada modo, y «mine» leído en el servidor mediante el SDK. Se ejecuta contra un sustituto local, no contra un espacio.' },
        embedRef: { name: 'La referencia de la integración', body: 'Cada atributo del elemento, el aviso de datos, el tema y una Content Security Policy.' },
        sdkRef: { name: 'La referencia del SDK', body: 'El cliente para su servidor con la clave secreta, el cliente de invitado, las claves de idempotencia y la carga de datos.' },
        webhooks: { name: 'Webhooks', body: 'Registrar un receptor, comprobar la firma de cada entrega, reintentos y rotación. El espacio de staging aún no los envía.' },
      },
      more: 'Cómo funciona cada parte, en breve:',
      link: 'Integraciones',
    },
    notYet: {
      title: 'Aún no disponible',
      items: [
        `Paquetes npm: el SDK, el wrapper de React y los paquetes de Next.js y Astro no están publicados a ${AS_OF}. Hoy se ejecutan desde un clon del repositorio de Connect.`,
        'MCP: previsto, no construido. No hay ningún endpoint MCP que usar.',
        `El propio repositorio: es privado a ${AS_OF}.`,
        'Un espacio para probarlo: todavía no se ofrece ninguno a desarrolladores. Los ejemplos se ejecutan contra un ejemplo local o un sustituto.',
      ],
    },
  },

  status: {
    title: 'Estado: qué se ejecuta en staging, qué está construido y qué está previsto',
    description: 'Dónde está cada parte de Linkbot, según la lista de comprobación del sitio: en el espacio de staging sintético, construida sin ejecutarse allí, o prevista.',
    eyebrow: 'Estado',
    h1: ['Dónde está,', 'parte por parte.'],
    lede: `Comprobado el ${AS_OF} con el informe de estado del espacio de staging y el plan de Connect. Esta página se genera a partir de la lista de comprobación del sitio, así que no dice nada que esa lista no diga.`,
    states: {
      staging: { title: 'En el espacio de staging', lead: 'Datos sintéticos, en alemán e inglés.' },
      built: { title: 'Construido o en el contrato, no en el espacio de staging', lead: 'No se ejecuta allí y no está publicado.' },
      planned: { title: 'Previsto, no construido', lead: 'Sin fecha prometida.' },
    },
    items: {
      form: 'Describir una solicitud o una oferta por formulario, con el aviso de identidad donde el espacio lo tiene',
      text: 'Describir una solicitud o una oferta con sus propias palabras, leídas por reglas fijas sin un modelo',
      board: 'El tablón, con los valores simplificados del pack, que lista solo lo que su titular eligió',
      watches: 'Los seguimientos; su email va a un buzón de prueba y no llega a nadie',
      control: 'Los ajustes, orígenes, claves y el funnel de un espacio, mediante Space API',
      confirm: 'Confirmar; el navegador que confirmó gestiona lo que creó',
      matching: 'Emparejamiento con un veredicto por criterio',
      gates: 'Gates y aprobación por un operador con nombre',
      introductions: 'Presentaciones en modo de operador, con comprobantes',
      outcomes: 'Resultados, cambios, pausas y cierres',
      deletion: 'Borrado con el registro de borrado de la instancia',
      widget: 'El widget, servido por la propia instancia desde una release fijada (0.3.0-v1)',
      webhooks: 'Webhooks al servidor de la plataforma: en el contrato, y el SDK comprueba sus firmas; el espacio de staging no los envía',
      mail: 'Email que llega a un buzón real; el email del espacio de staging va a un buzón de prueba',
      sdk: 'El SDK y el wrapper de React, en el repositorio de Connect; no publicados en npm',
      console: 'La consola para el equipo de una plataforma; no publicada',
      recipes: 'Recetas para WordPress, Next.js y Astro; se ejecutan en CI contra una build de muestra y no están publicadas como paquetes',
      reader: 'Un modelo que lee el texto, junto a las reglas fijas; espera una política de lectura aprobada',
      mcp: 'MCP, para que un agente de IA prepare y una persona confirme; previsto, no hay endpoint',
      demo: 'Una demo del widget en este sitio; espera un espacio de demo con datos sintéticos',
    },
    source: 'La fuente de cada línea está en docs/truth-check.md, en el repositorio de este sitio.',
    link: 'El estado, parte por parte',
  },
  changelog: {
    title: 'Novedades: los pasos del producto Linkbot, con fecha',
    description: 'Cada paso de Linkbot que un cliente puede notar, con fecha y con su estado: en el espacio de staging sintético, o construido y aún no allí.',
    eyebrow: 'Novedades',
    h1: ['Qué ha cambiado,', 'paso a paso.'],
    lede: 'Una entrada por cada paso del producto que un cliente puede notar, la más reciente primero. Cada una dice si se ejecuta en el espacio de staging sintético o si está construida y aún no allí. Nada de esto está publicado todavía para usuarios reales.',
    states: { staging: 'En el espacio de staging', built: 'Construido, aún no en el espacio de staging' },
    source: 'Fuente',
    note: 'Cada entrada procede de docs/changelog.yml, en el repositorio de este sitio, y nombra la pull request en la que se basa; una entrada sin fuente detiene la compilación.',
    link: 'Novedades',
  },
  sheet: {
    title: 'Linkbot en una página',
    description: 'Linkbot en una página imprimible, hecha con las páginas de este sitio: los tres componentes, el sí de ambas partes, lo que una plataforma obtiene y conserva, y en qué punto está cada parte. Con fecha, sin precios.',
    eyebrow: 'Una página',
    dated: `A fecha de ${AS_OF}. Generada con las páginas de este sitio al construirlo, así que no dice nada que ellas no digan. No menciona precios.`,
    pdf: 'Descargar en PDF',
    site: 'Más en este sitio',
    link: 'Linkbot en una página (PDF)',
  },
  verticals: {
    title: 'Para verticales: un pack por mercado',
    description: 'Un pack guarda el vocabulario de un mercado: criterios, opciones, unidades, revelación por etapa, gates y resultados. Primer espacio: minerales industriales.',
    eyebrow: 'Para verticales',
    h1: ['Un pack', 'por mercado.'],
    lede: 'Una vertical se une a Linkbot como un pack: los criterios de su mercado, las respuestas que permiten, qué revela cada uno y cuándo, y los gates que el mercado necesita. Un espacio fija el pack; el formulario, la lectura, el tablón y las reglas de emparejamiento salen de él.',
    toc: [['holds', 'Qué contiene un pack'], ['first', 'El primer espacio'], ['next', 'Más verticales']] as [string, string][],
    holds: {
      title: 'Qué contiene un pack',
      items: [
        'Criterios con sus controles: una opción, varias opciones, un número con una unidad, un rango, una ventana de fechas, una lista con búsqueda, texto libre',
        'Opciones, unidades y bases, con las conversiones que declara el pack; una conversión se ejecuta solo mediante la base declarada por la propia oferta, nunca por suposición',
        'Qué respuestas especiales permite cada criterio: «Otro / no está en la lista», «No lo sé», «Cualquiera»',
        'Qué importancias permite un criterio, y la sugerida',
        'La etapa de cada criterio, tablón, coincidencia, presentación u operador, y cómo se reduce el detalle de un valor para el tablón',
        'Etiquetas, preguntas, sinónimos y avisos en los idiomas del espacio',
        'Los gates del mercado y las categorías de un resultado',
      ],
    },
    first: {
      title: 'El primer espacio: minerales industriales',
      paras: [
        'Geoprocure gestiona el primer espacio, de minerales industriales, en una instancia de staging sintética. Su gate obligatorio es una comprobación KYC y de sanciones, registrada por un operador con nombre y nunca eximida. Sus presentaciones se ejecutan en modo de operador: el equipo de Geoprocure pone en contacto a ambas partes.',
      ],
    },
    next: {
      title: 'Más verticales',
      paras: [
        'Una vertical necesita su pack y una plataforma que gestione el espacio. Está previsto un segundo pack con datos sintéticos, para que un espacio de demo pueda mostrar el widget en este sitio sin un mercado real.',
      ],
    },
  },

  privacy: {
    title: 'Aviso de privacidad · Linkbot',
    description: 'El aviso de privacidad de este sitio web está en preparación. Lo que ya es cierto: el sitio no usa cookies, no carga nada de terceros y no usa analíticas.',
    eyebrow: 'Aviso de privacidad',
    h1: 'En preparación',
    lede: 'El aviso de privacidad de este sitio web se está redactando y revisando. Aparecerá aquí cuando se publique. Hasta entonces no se muestra nada, porque un texto legal no puede redactarse por conjetura.',
    facts: {
      title: 'Lo que ya es cierto de este sitio',
      items: [
        'No usa cookies ni analíticas ni rastreo.',
        'No carga nada de terceros: las tipografías y las imágenes salen de este sitio.',
        'No tiene formulario ni cuenta. Nada de lo que escriba llega a nadie.',
        'El producto se ejecuta en las páginas de una plataforma, bajo el aviso de datos de esa plataforma, junto a las líneas fijas del widget.',
      ],
    },
  },

  imprint: {
    title: 'Aviso legal · Linkbot',
    description: 'El aviso legal del sitio web de Linkbot: datos del proveedor y de contacto. El texto está en preparación.',
    eyebrow: 'Aviso legal',
    h1: 'En preparación',
    lede: 'El aviso legal (proveedor, dirección, representantes, datos registrales y fiscales, contacto) se está preparando y aparecerá aquí cuando esté confirmado. Hasta entonces no se muestra nada, porque nada de ello puede inventarse.',
  },

  notFound: {
    title: 'Página no encontrada · Linkbot',
    description: 'Esta página no existe. Vaya a la página de inicio o lea el sitio en otro idioma.',
    eyebrow: 'Página no encontrada',
    h1: 'Aquí no hay nada.',
    lede: 'Puede que la página se haya movido.',
    home: 'Ir a la página de inicio',
    languages: 'Este sitio en otros idiomas',
  },

  /* S2: una página por integración, cada una solo con lo que muestran hoy los documentos del carril Connect.
     Las secciones llevan párrafos, una lista o una tabla (filas con dos o tres columnas). */
  integrations: {
    eyebrow: 'Para plataformas',
    hub: 'Cada integración en su propia página',
    state: 'Estado actual',
    pages: {
      embed: {
        nav: 'El embed',
        title: 'El embed: un script, un elemento · Linkbot para plataformas',
        description: 'Qué fija una página en el embed: atributos del elemento, su aviso de datos, variables del tema, la Content Security Policy y qué guarda y envía el widget.',
        h1: ['Un script,', 'un elemento.'],
        lede: 'El widget es un script y un elemento por cada lugar donde aparece. Su página fija su clave, su modo, su lado y su idioma; todo lo demás sale de su espacio.',
        sections: [
          { id: 'element', title: 'El elemento', paras: [
            'Cargue el script una vez por página, con async, para que su página se dibuje sin esperarlo. Ponga el elemento donde debe aparecer el formulario. Varios elementos en una página son varios widgets, y los elementos añadidos después, como hacen las aplicaciones de una sola página, arrancan por su cuenta.',
            'Un valor que el widget no conoce se sustituye por el predeterminado, con una advertencia en la consola del navegador. Un idioma que el espacio no ofrece también se sustituye, y el widget lo dice en pantalla.',
          ], code: true, columns: ['Atributo', 'Valores', 'Predeterminado'], rows: [
            { name: 'data-linkbot', what: 'su publishable key. El widget se niega a arrancar con una secret key y le dice que la rote', more: 'obligatorio' },
            { name: 'data-mode', what: 'describe (diga lo que solicita u ofrece), board (explore y responda anuncios), mine (mis solicitudes, seguimientos y posibles coincidencias)', more: 'describe' },
            { name: 'data-side', what: 'seeking (una solicitud) u offer', more: 'seeking' },
            { name: 'data-locale', what: 'en, de, es, it o fr', more: 'el idioma del navegador del visitante, luego el predeterminado del espacio' },
            { name: 'data-input', what: 'form, text o both; solo puede restringir lo que el espacio permite', more: 'el ajuste del espacio' },
            { name: 'data-api', what: 'la base de la API de su espacio, solo https (http en localhost)', more: 'el origen desde el que se cargó el script' },
          ] },
          { id: 'notice', title: 'Su aviso de datos', paras: ['Un hijo con slot="notice" aparece justo encima del botón de confirmar, con el estilo del CSS de su página. El widget añade junto a él sus propias líneas fijas, como «No se usa nada hasta que usted lo confirme». Lo que escriba ahí sale de sus propios textos de privacidad.'] },
          { id: 'design', title: 'Diseño', paras: [
            'El widget toma la fuente y el color de texto de su página. Todo lo demás se fija con variables CSS en el elemento: el acento del botón principal, las opciones seleccionadas y los anillos de foco, su hover, el radio de las esquinas, el texto y el texto secundario, los títulos y su fuente, la fuente de las etiquetas de campo, los bordes y divisores de las tarjetas, los bordes de campo, los fondos de tarjeta y superficie, y el color y fondo de error.',
            'El widget elige texto negro o blanco para el acento, el que más contraste. Si su página es oscura, ponga color-scheme: dark en el elemento. Los demás estilos de su página no entran en el widget, que se dibuja en un shadow root, y los estilos del widget no llegan a su página.',
          ] },
          { id: 'csp', title: 'Content Security Policy', paras: [
            'Permita el origen del script en script-src y el origen de Space API en connect-src, más el origen del script si difiere: el widget carga un idioma distinto del inglés desde junto a sí mismo y lo comprueba contra un sha256 integrado en el script.',
            'Los estilos no necesitan «unsafe-inline»: el widget usa una constructable stylesheet. En navegadores sin ella añade un único elemento style que lleva el nonce de su propia etiqueta script, así que ponga su nonce en la etiqueta script si su política usa nonces. Si aloja el script usted mismo, copie su carpeta locales con él.',
          ] },
          { id: 'global', title: 'El global de la página', paras: ['El script define un único global, window.Linkbot, y nada más: la versión del embed, si es la build de muestra, y mount y unmount para un elemento que el escaneo no puede ver, por ejemplo dentro de su propio shadow root.'] },
          { id: 'keeps', title: 'Qué guarda el widget, y qué envía', paras: [
            'Sus tokens de sesión de invitado y de titular están en sessionStorage, por pestaña y por espacio. No usa cookies ni localStorage. Las peticiones van solo a Space API, sin credenciales. No hay analíticas. La build de muestra no envía nada por la red.',
            'sessionStorage pertenece al origen de su página, así que cualquier script que ejecute en esa página puede leer el borrador y los tokens. No ejecute scripts en los que no confíe en páginas que lleven el widget.',
          ] },
        ] as Section[],
        state: [`El script sale de la propia instancia de su espacio. A fecha de ${AS_OF}, la instancia de staging sirve la release 0.3.0-v1 del widget desde un archivo fijado, como muestra su informe de estado; las comprobaciones de Connect del tablón y de los textos del widget pasaron contra ese archivo servido el 24 de octubre de 2026.`],
      },
      sdk: {
        nav: 'SDK y webhooks',
        title: 'El SDK, el wrapper de React y los webhooks · Linkbot para plataformas',
        description: 'Un cliente de servidor tipado por el contrato de Space API, la comprobación de webhooks, el wrapper de React y cómo su servidor recibe los eventos de Linkbot.',
        h1: ['Su servidor,', 'tipado por el contrato.'],
        lede: `Nada del SDK va a una página de navegador: el embed toma la publishable key, y el cliente del SDK se niega a arrancar en un navegador. A fecha de ${AS_OF} no está publicado; su código está en el repositorio de Connect.`,
        sections: [
          { id: 'client', title: 'El cliente', paras: [
            'El cliente toma la base de la API de su espacio (solo https, salvo en localhost), su secret key del almacén de secretos de su servidor (un valor que no tenga forma de secret key se rechaza) y, si quiere, el fetch de su runtime. Sus rutas, parámetros, cuerpos y respuestas son los del contrato, generados a partir del YAML que publicó Core y fijados por sha256: una ruta, un campo o un valor que el contrato no tiene es un error de tipos.',
            'Una clave de idempotencia nueva está a una llamada. Las escrituras que el contrato marca la necesitan; guarde la clave con la escritura y envíe la misma clave al reintentarla, para que el espacio haga la escritura una sola vez.',
          ] },
          { id: 'seeding', title: 'Sembrar la oferta de su propia plataforma', paras: ['Su servidor siembra una oferta por la vía del operador, y un segundo operador la confirma: cuatro ojos. En un espacio que comprueba cada parte, como el de Geoprocure, sembrar la oferta de su propia organización cuenta como confirmación, así que lleva la autorización para revelar la identidad que pide el aviso del espacio, y el espacio la rechaza sin ella. Esto es solo para su propia organización; la autorización de cualquier otra parte la da esa parte, en el widget.'] },
          { id: 'webhooks', title: 'Webhooks', paras: [
            'Registre un endpoint con su secret key, solo https. El secreto de firma se muestra una vez y va en su almacén de secretos, nunca en el código. Cada entrega lleva un id, una marca de tiempo en segundos y una firma: el HMAC-SHA256 de la marca de tiempo, un punto y el cuerpo sin procesar, con su secreto como clave.',
            'Rechace una entrega de más de cinco minutos o cuya firma no coincida. La comprobación del SDK hace ambas cosas, comparando en tiempo constante con Web Crypto, en Node, Deno, Bun y runtimes de edge. Compruebe el cuerpo sin procesar antes de parsearlo. Responda 2xx rápido: cualquier otra cosa se reintenta con backoff durante 24 horas, y después la entrega se marca como fallida. Un reintento lleva el mismo id, así que trate cada id una vez, con los ids en su base de datos y no en memoria.',
            `Rote el secreto cuando lo necesite: el antiguo sigue siendo válido hasta siete días, y la comprobación acepta ambos. Las entregas llevan ids y estados, nunca datos de contacto; obtenga los detalles con su secret key. El registro de entregas lista el estado, los intentos y un hash del cuerpo, nunca el cuerpo. Los webhooks están en el contrato; a fecha de ${AS_OF}, el espacio de staging no los envía.`,
          ] },
          { id: 'events', title: 'Tipos de evento', paras: ['Cada evento tiene un id, un tipo, el id del espacio, el momento en que ocurrió, la versión del contrato y el objeto del que trata, con su tipo, id y estado donde los haya. Los tipos:'], code: true, items: ['intent.confirmed', 'intent.revised', 'intent.status_changed', 'match.proposed', 'match.updated', 'gate.recorded', 'approval.recorded', 'answer.recorded', 'clarification.requested', 'review.recorded', 'introduction.created', 'outcome.recorded', 'watch.delivered', 'channel.verified', 'deletion.completed', 'key.rotated'] },
          { id: 'react', title: 'El wrapper de React', paras: [
            'El wrapper dibuja el mismo elemento que el snippet y carga el script una vez por dirección; el embed arranca entonces en su propio shadow root, que React nunca toca. Es un componente de cliente, así que funciona en el App Router de Next.js, y no añade CSS global.',
            `Sus props son los atributos del elemento: la publishable key y la dirección del script son obligatorias (una secret key lanza un error), luego mode, side, locale, input, api, su aviso, un nombre de clase y un style para las variables del tema. Cuando cambia una prop que el embed lee, el wrapper da a React un elemento nuevo y el embed arranca de nuevo. Una página que quiera el script cargado antes de dibujar un elemento también puede pedirlo. Sin publicar a fecha de ${AS_OF}.`,
          ] },
        ] as Section[],
        state: [`El SDK y el wrapper están construidos y probados en el repositorio de Connect y, a fecha de ${AS_OF}, no están publicados. El receptor de la guía de webhooks está probado contra entregas de muestra firmadas; el espacio de staging no envía webhooks.`],
      },
      console: {
        nav: 'La consola',
        title: 'La consola para su equipo · Linkbot para plataformas',
        description: 'La cola de aprobación, casos con gates y aprobación, presentaciones con comprobantes, resultados, webhooks y operadores, en su máquina o tras su propio login.',
        h1: ['La consola de su equipo,', 'detrás de su propio login.'],
        lede: 'La consola es un servidor pequeño, el único lugar donde se usa la secret key del espacio, más la página en la que trabaja su equipo. No hay login de Linkbot para operadores: su plataforma da acceso a su equipo. La ejecuta en su propia máquina como herramienta local, o monta su handler detrás del login de su plataforma. Nunca es una página pública de Linkbot.',
        sections: [
          { id: 'views', title: 'Qué muestra', columns: ['Vista', 'Qué muestra'], rows: [
            { name: 'Cola de aprobación', what: 'Casos que esperan a su equipo, sin identidades: el encaje por criterio, las respuestas de ambas partes, los gates que faltan.' },
            { name: 'Caso', what: 'El encaje por criterio y por qué. Su equipo registra las comprobaciones del caso y la comprobación de cada parte (superada, fallida, remitida, y eximida solo donde el gate lo permite), la comprobación de una parte lado a lado para que el registro de una nunca se lea como el de la otra; aprueba o rechaza con un motivo opcional para el registro de auditoría; responde solo por las ofertas o solicitudes de su propia plataforma, como operador con sesión iniciada; pide aclaraciones a una parte.' },
            { name: 'Presentaciones', what: 'Listadas sin datos de contacto. Abrir una pide confirmación primero, después muestra los campos de contacto y registra la lectura. Un valor de una lista larga, como un país o un puerto, se muestra por su nombre con su código. Comprobantes y resultados.' },
            { name: 'Webhooks', what: 'Añadir un endpoint (solo https); el secreto de firma se muestra una vez; rotar, con el secreto antiguo válido hasta siete días; eliminar; el registro de entregas.' },
            { name: 'Operadores', what: 'El registro: añadir, desactivar, reactivar.' },
            { name: 'Espacio y snippet', what: 'Los ajustes tal como los informa Space API, y el snippet con su publishable key y la dirección del script de su instancia.' },
            { name: 'Puesta en marcha', what: 'Los cinco pasos, con lo que su espacio tiene para cada uno.' },
          ] },
          { id: 'safe', title: 'Cómo se mantiene segura la clave', items: [
            'La clave queda en el servidor. La página obtiene sus ajustes del servidor, y las pruebas comprueban que esa respuesta no lleva ninguna secret key.',
            'Sin proxy: cada operación se lista con los campos que puede enviar; cualquier otra cosa se rechaza y los campos no listados se descartan.',
            'El servidor nombra al operador a partir de su inicio de sesión; un id enviado por la página se ignora.',
            'Responde solo por el lado de su propia plataforma en un caso, resuelto en el servidor; la página nunca elige un lado y nunca recibe los intents, que contienen campos de identidad.',
            'Solo la propia página de la consola puede llamarla: su propia cabecera, su propio origen, peticiones same-origin, cuerpos JSON.',
            'El modo local se vincula solo a la máquina local y responde solo a su propio nombre, lo que bloquea el DNS rebinding.',
            'Una política de página estricta: sin script ni style inline, sin framing, sin caché.',
          ] },
          { id: 'run', title: 'Ejecutarla', paras: [
            'Con datos de muestra: la operator API de muestra responde desde memoria con datos sintéticos, no necesita clave y no envía nada por la red, y cada página lo dice en un banner. Sigue las reglas del contrato, para que pueda probarlas: un gate que no se puede eximir, aprobación solo tras los gates obligatorios, una presentación solo con todos los gates, la aprobación y el sí de ambas partes, y un comprobante de lectura cuando su equipo abre los datos de contacto.',
            'Contra un espacio: la base de la API, su secret key de su almacén de secretos, su id en el registro de operadores del espacio y, si quiere ver el snippet, la publishable key. Detrás de su login: un handler; su sesión decide quién actúa, y sin un operador con sesión iniciada responde 401. Detrás de un proxy necesita la dirección pública que usó el navegador.',
            'Esta vía se ejecutó contra el espacio de staging sintético de Geoprocure el 23 de octubre de 2026: la cola, un caso, ambos tipos de comprobación, la aprobación, una respuesta por la oferta de la propia plataforma y una presentación con su comprobante.',
          ] },
          { id: 'notyet', title: 'Aún no está, y por qué', items: [
            'Un espacio nuevo se crea con la herramienta de aprovisionamiento de Core, no desde la consola; el asistente de cinco pasos de la consola escribe y valida el archivo que esa herramienta lee.',
            'No hay «reenviar» para una entrega hasta que haya entregas reales con las que probarlo.',
          ] },
        ] as Section[],
        state: ['La consola está construida sobre el contrato de Space API y se ejecutó contra el espacio de staging sintético el 23 de octubre de 2026; sus pruebas se ejecutan contra una operator API de muestra con datos sintéticos.'],
      },
      wordpress: {
        nav: 'WordPress',
        title: 'WordPress · Linkbot para plataformas',
        description: 'Un plugin añade el shortcode para todos los editores: instálelo, póngalo donde debe aparecer el formulario, mantenga los plugins de caché lejos del script.',
        h1: ['Un shortcode', 'para todos los editores.'],
        lede: 'Pegar el snippet en un bloque de HTML personalizado solo funciona para los usuarios a los que WordPress deja publicar scripts, lo que excluye a los editores en redes multisite. El plugin añade un shortcode que funciona para todos los editores, carga el script una vez por página mediante la carga de scripts propia de WordPress y comprueba cada valor que imprime.',
        sections: [
          { id: 'install', title: 'Instalar el plugin', paras: ['Copie la carpeta del plugin al directorio de plugins, o comprímala y súbala en Plugins, y actívelo después. El plugin entero es un archivo.'] },
          { id: 'shortcode', title: 'El shortcode', paras: ['En el editor de bloques, añada un bloque de shortcode. El texto entre el shortcode de apertura y el de cierre se convierte en su aviso de datos, mostrado encima del botón de confirmar. Use la misma dirección de script en todos los shortcodes de una página: el plugin carga el script una vez, desde el primero.'], code: true, columns: ['Atributo', 'Qué es'], rows: [
            { name: 'src', what: 'la dirección https del script en la instancia de su espacio; debe ser https' },
            { name: 'key', what: 'su publishable key. Una secret key muestra una advertencia a quienes pueden editar la página, y nada a los visitantes' },
            { name: 'mode, side, locale, input, api', what: 'los atributos del elemento sin el prefijo data-. Un valor que el plugin no conoce se omite, de modo que el widget usa su predeterminado' },
          ] },
          { id: 'caching', title: 'Plugins de caché y optimización', paras: ['Los plugins que combinan, minifican, mueven o retrasan scripts deben dejar el script en paz: exclúyalo por su dirección o por su handle. El widget carga sus otros idiomas desde junto a sí mismo y comprueba cada uno contra un sha256 que lleva, de modo que una copia en otro sitio no puede cargarlos. Si su hosting no permite plugins, el shortcode no está disponible, y un bloque de HTML personalizado solo funciona para los usuarios a los que WordPress deja publicar scripts.'] },
        ] as Section[],
        state: ['El CI de Connect ejecuta el plugin en un WordPress 6.8 real sobre PHP 8.3 mediante WordPress Playground y carga sus páginas en tres motores de navegador contra la build de muestra: el shortcode arranca el widget con su aviso, dos shortcodes en una página cargan el script una vez, un shortcode con una secret key no muestra nada al visitante. Aún no se ha ejecutado contra un espacio real tal cual está escrito. La receta es hoy el plugin entero; una página de ajustes no forma parte de él.'],
      },
      nextjs: {
        nav: 'Next.js',
        title: 'Next.js · Linkbot para plataformas',
        description: 'El wrapper de React en el App Router: un componente de cliente que un componente de servidor puede usar, variables públicas, la política y webhooks.',
        h1: ['El wrapper', 'en el App Router.'],
        lede: 'Use el wrapper de React. Es un componente de cliente, de modo que un componente de servidor puede dibujarlo: la dirección del script y su publishable key como props, el modo, el lado y el idioma, su aviso de datos y las variables del tema en su style.',
        sections: [
          { id: 'props', title: 'Props y variables', paras: ['La dirección del script y la publishable key son obligatorias. Son públicas por diseño: la clave solo identifica su espacio y solo funciona en sus orígenes permitidos. Las variables públicas se fijan en el momento de la build. El aviso es su aviso de datos, mostrado encima del botón de confirmar; el style fija las variables del tema y reserva espacio antes de que cargue el widget, para que la página de abajo no salte.'] },
          { id: 'csp', title: 'Content Security Policy', paras: ['Añada el origen del script a script-src, y el origen de Space API junto con el origen del script a connect-src. El wrapper añade la etiqueta script desde el navegador: bajo una política con nonce y strict-dynamic esa etiqueta se permite porque la añade código de confianza; sin strict-dynamic, liste el origen del script. El ejemplo no envía ninguna política, así que el CI de Connect aún no prueba una para Next.js.'] },
          { id: 'server', title: 'Su lado de servidor', paras: ['Los webhooks llegan a un route handler; la guía de webhooks muestra uno para el App Router, en código que ejecuta el CI. La secret key queda en el servidor, nunca en una variable pública.'] },
        ] as Section[],
        state: ['El CI de Connect construye el ejemplo con Next.js 16.3.8 y React 19.3, que lo comprueba con typecheck, después lo arranca y ejecuta la página en tres motores de navegador contra la build de muestra: el wrapper carga el script una vez, el widget arranca con el aviso y el tema, y la consola no muestra errores. Aún no se ha ejecutado contra un espacio real tal cual está escrito. No hay ningún paquete publicado.'],
      },
      astro: {
        nav: 'Astro',
        title: 'Astro · Linkbot para plataformas',
        description: 'Un componente: el script se deja inline para que Astro no lo empaquete, el aviso mediante un wrapper, tres variables públicas y una build estática.',
        h1: ['Un componente,', 'una build estática.'],
        lede: 'Copie un componente en su sitio. Dibuja la etiqueta script y el elemento a partir de tres variables públicas: la dirección del script en la instancia de su espacio, su publishable key y, si el script viene de otro origen, su base de la API. La página no necesita servidor: una build estática de Astro funciona.',
        sections: [
          { id: 'inline', title: 'El script se queda inline', paras: ['La etiqueta script lleva is:inline, así que Astro la deja en paz. El script debe cargarse desde donde se sirve, porque obtiene sus otros idiomas desde junto a sí mismo y comprueba cada uno contra un sha256 que lleva.'] },
          { id: 'notice', title: 'El aviso', paras: ['Astro usa el nombre de slot notice para sus propios slots y descarta el atributo, así que el componente pone su aviso en un wrapper que el widget recoge. El CSS de su página le da estilo.'] },
          { id: 'twice', title: 'Dos veces en una página', paras: ['Si usa el componente dos veces en una página, la etiqueta script aparece dos veces; la segunda carga no hace nada. Fije las variables públicas en el entorno de su build o en un archivo de entorno que no suba al repositorio; son públicas por diseño.'] },
        ] as Section[],
        state: ['El CI de Connect construye el ejemplo con Astro 7.3.5 y ejecuta la página construida en tres motores de navegador contra la build de muestra: el widget arranca, muestra el aviso, toma el tema, y Astro dejó la etiqueta script en paz. Aún no se ha ejecutado contra un espacio real tal cual está escrito. No hay una integración de Astro empaquetada.'],
      },
    },
  },
};
