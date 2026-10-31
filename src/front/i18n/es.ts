/* es: the front's words (src/front/copy.ts); the page's sentences are the site's. Not yet read by a native speaker
   (docs/truth-check.md). */
import type { FrontCopy } from '../copy.ts';

export const es: FrontCopy = {
  a: {
    ledger: {
      label: 'Sintético · valores fijos, escritos para esta página · nada se empareja aquí',
      space: 'Un espacio para minerales industriales',
      need: 'La solicitud',
      offer: 'La oferta',
      table: 'La pareja, criterio por criterio',
      columns: { criterion: 'Criterio', need: 'La solicitud declara', offer: 'La oferta declara', verdict: 'Veredicto' },
      importance: { must: 'Imprescindible', nice_to_have: 'Deseable' },
      verdicts: { meets: 'Encaja', partly: 'Encaja en parte', conflicts: 'Contradice', unknown: 'Desconocido' },
      state: 'Todos los criterios imprescindibles encajan, así que esta pareja puede ser una coincidencia. Los criterios blandos solo se muestran; no deciden.',
      before: 'Antes de que nadie reciba una presentación',
      stages: [
        {
          name: 'Gate',
          text: 'Un operador con nombre registra como superada la comprobación que exige el espacio. El sistema nunca decide un gate.',
        },
        {
          name: 'Aprobación',
          text: 'Un operador activo y con nombre aprueba el caso. Una aprobación por sí sola no revela nada.',
        },
        {
          name: 'Sí de ambos',
          text: 'Cada parte responde por sí misma. Antes de que ambas hayan dicho que sí, el otro lado no se entera de nada.',
        },
        {
          name: 'Presentación',
          text: 'El servidor la crea cuando se cumple la última de las tres condiciones, en cualquier orden, y rechaza cualquier otra vía. Cada parte recibe un comprobante.',
        },
      ],
      notice: 'Una posible coincidencia solo revela los veredictos y un aviso fijo de que las personas deciden.',
      legend: 'Relleno: encaja. Dividido: encaja en parte. Cruzado: contradice. Discontinuo: desconocido, que nunca es una coincidencia.',
    },
  },
  landing: {
    meta: {
      title: 'Linkbot: su plataforma une a compradores y vendedores, Linkbot encuentra quién encaja',
      description: 'Un widget para plataformas que unen a compradores y vendedores: pregunta a cada parte qué necesita, da un veredicto por criterio y presenta solo tras dos síes.',
    },
    opening: {
      h1: 'Su plataforma une a compradores y vendedores. Linkbot encuentra quién encaja.',
      sub: 'Su widget pregunta a cada parte qué necesita; Linkbot muestra un veredicto para cada criterio y presenta a las dos partes solo cuando ambas dicen que sí.',
      button: 'Verlo paso a paso',
    },
    cards: {
      h2: 'Lo que hace por usted',
      items: [
        { name: 'Preguntar con las palabras de su mercado', text: 'Cada parte dice qué necesita u ofrece, en una línea o en preguntas que encajan con su mercado; no se guarda nada hasta que lo confirma.', button: 'Ver la solicitud' },
        { name: 'Seguimos buscando', text: 'Si aún no encaja nada, Linkbot sigue buscando y solo le avisa a usted cuando algo nuevo encaja.', small: 'En la demo sus correos van a un buzón de prueba y no llegan a nadie.', button: 'Ver cómo sigue buscando' },
        { name: 'Presentados solo tras dos síes', text: 'Dos partes se presentan solo después de que una persona designada lo apruebe y ambas digan que sí.', button: 'Ver la presentación' },
      ],
    },
    stage: {
      h2: 'Una presentación, desde ambos lados',
      p: 'Una solicitud y una oferta se presentan solo después de que una persona designada lo apruebe y ambas partes digan que sí.',
      roles: 'Qué lado mostrar',
      buyer: 'Como comprador',
      supplier: 'Como proveedor',
      label: 'Recorrido grabado · datos ficticios',
      supplierNote: 'Del lado del proveedor, por ahora solo está grabado su sí; el proveedor describe su oferta en el mismo widget.',
      link: 'Recorrer los seis pasos',
    },
    sees: {
      h2: 'Quién ve qué, y cuándo',
      p: 'Cada paso muestra solo lo que ese paso permite; los datos para una presentación salen solo después del sí de ambas partes.',
      link: 'Quién ve qué, paso a paso',
    },
    platforms: {
      h2: 'Para plataformas',
      p: 'Un script y un elemento en su página; las preguntas encajan con su mercado.',
      snippet: 'La integración más corta',
      later: 'Añadirlo con sus propias herramientas de compilación',
      button: 'Para plataformas',
      developers: 'Para desarrolladores',
    },
    bottom: {
      h2: '¿Su mercado aún no está? Cuéntenos qué une usted.',
      button: 'Cuéntenos qué une usted',
      prepared: 'La dirección a la que escribir está en preparación; la página tras el botón dice cómo nos contactará.',
      line: 'Todo lo que se muestra aquí funciona con datos ficticios; comprobado el {date}.',
      status: 'El estado completo',
    },
    labels: { live: 'Live', soon: 'Próximamente' },
  },
  c: {
    meta: {
      title: 'Linkbot: quién ve qué, y cuándo',
      description: 'Una capa de emparejamiento que cualquier plataforma puede integrar, en torno a una pregunta: quién ve qué, y cuándo. Una oferta sintética, etapa por etapa.',
    },
    hero: {
      eyebrow: 'Una capa de emparejamiento que cualquier plataforma puede integrar',
      h1: ['Quién ve qué,', 'y cuándo.'],
      lede: 'El pack da a cada criterio una etapa, y una etapa es lo más lejos que llega un valor: el tablón, una posible coincidencia, la presentación o solo el equipo de la plataforma. Abajo: una oferta sintética, etapa por etapa, y el comprobante que limita cada lectura.',
      primary: 'Qué recibe una plataforma',
      secondary: 'Quién ve qué, por completo',
    },
    stages: {
      label: 'Sintético · una oferta, escrita para esta página · aquí nadie se empareja ni recibe una presentación',
      sees: 'Quién lo ve',
      shows: 'Qué muestra',
      not: 'No en esta etapa',
      receipt: {
        h3: 'El comprobante',
        lines: [
          'Quién puede ver qué campos, y desde cuándo.',
          'Cada lectura de una presentación, con su hora.',
          'Claves de campo y horas, nunca valores.',
          'Lo que no está en el comprobante no se revela nunca después.',
        ],
      },
    },
    why: {
      h2: 'Por qué una plataforma puede dejar que Linkbot se acerque a sus usuarios',
      items: [
        {
          h3: 'Un espacio por mercado, en su propia instancia',
          p: 'Un espacio es un mercado en una plataforma, con su propia aplicación, base de datos, claves y registro de borrado. El emparejamiento se ejecuta dentro de él; ninguna solicitud, ninguna oferta y ninguna coincidencia se comparte con otro espacio.',
        },
        {
          h3: 'Sus páginas, sus claves, su equipo',
          p: 'El widget se ejecuta en sus páginas bajo su propio aviso de datos. Su página lleva una publishable key que solo funciona en sus orígenes; la secret key queda en su servidor; su equipo aprueba casos en una consola detrás de su propio inicio de sesión, y no hay un inicio de sesión de Linkbot para operadores.',
        },
        {
          h3: 'Una persona con nombre, nunca el sistema',
          p: 'Los gates los registra un operador con nombre, con una referencia y sin datos personales, y un operador con nombre aprueba. Una aprobación por sí sola no revela nada; cada escritura indica quién la hizo y aparece en el registro de auditoría.',
        },
        {
          h3: 'Las personas deciden, cada una por sí misma',
          p: 'Cada parte responde una posible coincidencia por su lado. Antes de que ambas hayan dicho que sí, el otro lado no se entera de nada, y un no posterior revoca un sí. El servidor crea la presentación cuando se cumple la última condición, y rechaza cualquier otra vía.',
        },
      ],
    },
    deletion: { h2: 'Borrado: qué se va y qué se queda' },
    platforms: {
      h2: 'Para plataformas',
      p: 'Un script y un elemento ponen un espacio en su página; la consola de su equipo se ejecuta en su máquina o detrás de su propio inicio de sesión; su servidor se entera de los eventos mediante webhooks firmados, que están en el contrato y que el espacio de staging aún no envía.',
      link: 'Qué recibe una plataforma',
    },
    verticals: {
      h2: 'Para verticales',
      p: 'Un pack describe un mercado: sus criterios, opciones y unidades, sus etiquetas y preguntas en los idiomas del espacio, qué revela cada criterio en cada etapa y los gates que el mercado necesita. El primero es el de minerales industriales.',
      link: 'Qué contiene un pack',
    },
    state: {
      h2: 'Estado actual',
      p: 'La oferta de arriba es texto fijo, escrito para esta página con el vocabulario de un pack sintético; el producto no se ejecutó aquí. La página de demo recorre todo el camino, paso a paso.',
    },
  },
  demo: {
    meta: {
      title: 'Linkbot: todo el recorrido, de la solicitud a la presentación',
      description: 'El recorrido de un comprador por Linkbot en seis pasos, de la solicitud al sí de ambas partes y la presentación. Con datos ficticios.',
    },
    hero: {
      eyebrow: 'Demo · datos ficticios',
      h1: ['De la solicitud a la presentación,', 'en seis pasos.'],
      lede: 'Lo que ocurre entre la primera línea de un comprador y el momento en que dos empresas se presentan, paso a paso, y quién actúa en cada paso.',
    },
    test: 'Este es un espacio de prueba con datos ficticios. Cada solicitud, oferta, empresa y valor de aquí se ha inventado para pruebas. No introduzca nada real: ninguna empresa, ninguna persona, ninguna dirección propia. Sus correos van a un buzón de prueba y no llegan a nadie.',
    steps: {
      h2: 'El recorrido, paso a paso',
      who: 'Quién actúa',
      items: [
        { name: 'La solicitud', who: 'El comprador', text: 'El comprador describe la necesidad en la página de una plataforma, en el formulario que genera el pack del mercado, o en una línea de texto que unas reglas fijas leen y convierten en valores propuestos. Nada está preseleccionado, y lo que el comprador no indicó queda como desconocido.' },
        { name: 'Los criterios, confirmados', who: 'El comprador', text: 'El comprador revisa cada valor y confirma. Solo entonces se guarda algo: el servidor comprueba cada valor con el pack y nombra cada campo que no lo cumple. La dirección de correo se confirma mediante un enlace.' },
        { name: 'Los posibles encajes', who: 'El espacio', text: 'El matching compara los criterios guardados con los de la otra parte, uno a uno: un veredicto por criterio, encaja, encaja en parte, contradice o desconocido, nunca una puntuación. Un posible encaje muestra a cada parte solo los veredictos y un aviso de que deciden las personas.' },
        { name: 'Ambos dicen sí', who: 'El comprador y el proveedor', text: 'Cada parte responde al posible encaje por sí misma. Antes de que ambas hayan dicho sí, la otra parte no sabe nada, y un no posterior revoca un sí.' },
        { name: 'El operador aprueba', who: 'El equipo de la plataforma', text: 'Un operador con nombre registra las comprobaciones que exige el espacio y aprueba el par. Una aprobación por sí sola no revela nada, y cada escritura indica quién la hizo.' },
        { name: 'La presentación', who: 'El servidor', text: 'Cuando se cumple la última de las tres condiciones, en cualquier orden, el servidor crea la presentación, y la rechaza por cualquier otra vía. Cada parte recibe un comprobante de quién puede ver qué campos. En el modo directo, el que se grabó aquí, cada parte puede abrir después los campos que la otra comparte en esta fase. Una plataforma puede elegir en su lugar el modo operador: entonces solo su equipo ve a ambas partes y contacta con ellas.' },
      ],
    },
    replay: {
      label: 'Recorrido grabado · datos ficticios',
      lede: 'Imágenes del widget y de la consola del operador en cada paso, grabadas en un solo ordenador. Cada parte, empresa y valor que aparece en ellas es ficticio.',
      note: 'Grabado el 25 de octubre de 2026 en el escenario de demostración de Linkbot Connect, que ejecuta el widget y la consola del operador contra una API de espacio de ejemplo en un solo ordenador. Nada de estas imágenes llegó a un espacio ni a una persona. La grabación presenta en modo directo: tras la aprobación del operador, cada lado puede abrir lo que el otro comparte.',
      steps: 'Los seis pasos',
      position: 'Paso {n} de {total}',
      previous: 'Paso anterior',
      next: 'Paso siguiente',
      screens: [
        ['El widget del comprador: el formulario que genera el pack de ejemplo, con roca fosfórica elegida y un mínimo de P₂O₅ del 30 %. La importancia aparece marcada como sugerida y no hay nada más elegido.'],
        ['El widget del comprador tras confirmar: la solicitud está activa, con cada criterio y su importancia. Todavía no hay ofertas que mostrar.'],
        ['El widget del comprador: una oferta que puede encajar, con una marca por criterio, la pregunta «¿Quiere que les presenten?» y el aviso de que deciden las personas.'],
        ['El widget del comprador tras el sí: «Su sí queda registrado. Sample space lo revisa primero.»', 'El widget del proveedor: el mismo posible encaje, visto desde el lado de la oferta como una solicitud con una marca por criterio, tras el propio sí del proveedor, con las mismas palabras.'],
        ['El caso en la consola del operador: el control de cada lado y el control KYC y de sanciones del caso, registrados como superados por el operador de ejemplo, y después «Aprobado por su equipo.»'],
        ['El widget del comprador en «Mis solicitudes y ofertas»: ambos lados dijeron que sí, la solicitud está presentada y un botón muestra lo que comparte el otro lado.', 'Las presentaciones en la consola del operador: una presentación, en modo directo, listada sin datos de contacto.'],
      ],
    },
    watch: {
      name: 'Si aún no encaja nada: un seguimiento',
      who: 'El comprador',
      text: 'Tras confirmar, el comprador puede mantener la solicitud abierta y seguirla: con qué frecuencia, semanal o diaria; sobre qué quiere saber; y, en las opciones de correo, como máximo cuántos por correo y ningún correo antes de un día elegido. Un seguimiento avisa solo a su titular cuando algo nuevo encaja, y empieza cuando se confirma la dirección de correo. Dura 90 días y puede pausarse, reanudarse o terminarse en cualquier momento, también desde un enlace en sus correos.',
      screens: ['El widget del comprador tras confirmar, aún sin ofertas que mostrar: un seguimiento semanal, sobre todo lo que cumple los requisitos imprescindibles, como máximo 5 por correo.', 'El mismo widget tras iniciar el seguimiento: espera a que se confirme la dirección de correo, como máximo 5 por correo, hasta el 23 de enero de 2027. La grabación no envió ningún correo, y la dirección ficticia no existe.'],
    },
    space: {
      h2: 'El tablón del espacio de prueba',
      on: 'Abajo está el propio widget, servido por el espacio de prueba, en modo tablón: las solicitudes y ofertas abiertas cuyos titulares quisieron mostrarlas, generalizadas como declara el pack. Responder a una empieza en el paso 1, del otro lado.',
      off: 'Esta página aún no muestra ningún widget: espera un espacio de demostración con datos sintéticos. Hasta entonces, el recorrido de arriba se muestra en imágenes.',
      notice: 'Un espacio de prueba con datos ficticios: no introduzca nada real. Sus correos no llegan a nadie.',
    },
  },
  stages: [
    {
      key: 'board',
      name: 'Tablón',
      eyes: 3,
      open: 1,
      who: 'Todo el que puede ver el tablón',
      rule: 'Solo campos de la etapa de tablón, simplificados como declara el pack, y solo de ofertas cuyo titular lo aceptó. Nunca quién publicó.',
      fields: [
        { label: 'Producto', value: 'Roca fosfórica' },
        { label: 'Contenido de P₂O₅', value: '31–32 %' },
        { label: 'Cantidad', value: '20.000–25.000 t, en una banda de 5.000 t' },
        { label: 'Condiciones de entrega', value: 'CFR, CIF o FOB' },
        { label: 'Puerto designado', value: 'Italia o España, como países de los puertos' },
        { label: 'Plazo de embarque', value: 'de enero a febrero de 2027' },
      ],
      not: ['Cadmio, pago, embalaje, origen e inspección: etapa de coincidencia, no tablón', 'Quién lo publicó'],
    },
    {
      key: 'match',
      name: 'Coincidencia',
      eyes: 2,
      open: 0.75,
      who: 'Las dos partes de una posible coincidencia',
      rule: 'Veredictos de los campos de la etapa de coincidencia o inferior, con la regla y los valores que cita. Sin nombre, sin datos de contacto, sin rastro de la respuesta del otro lado.',
      fields: [
        { label: 'Cadmio', value: 'como máximo 18 mg/kg por kg de P₂O₅', verdict: 'meets' },
        { label: 'Pago', value: 'pago contra documentos; se pidió una carta de crédito', verdict: 'conflicts' },
        { label: 'Embalaje', value: 'no declarado en la oferta', verdict: 'unknown' },
        { label: 'País de origen', value: 'Egipto; se pidió Marruecos o Jordania', verdict: 'conflicts' },
        { label: 'Inspección independiente', value: 'no declarado en la oferta', verdict: 'unknown' },
      ],
      not: ['El nombre visible y la dirección de email de la oferta', 'La respuesta de la solicitud, hasta que ambas hayan dicho que sí'],
    },
    {
      key: 'introduction',
      name: 'Presentación',
      eyes: 1,
      open: 0.5,
      who: 'En modo de operador, el equipo de la plataforma; en modo directo, ambas partes',
      rule: 'Nombre visible, dirección de email confirmada y los criterios que el pack guarda para esta etapa. Cada lectura queda registrada en el comprobante.',
      fields: [
        { label: 'Nombre visible', value: 'el de la oferta, tal como se dio' },
        { label: 'Dirección de email', value: 'una, confirmada mediante un enlace' },
        { label: 'Criterios de la etapa de presentación', value: 'como declara el pack' },
      ],
      not: [
        'Campos que el pack reserva al operador',
        'En modo de operador: cualquier cosa del otro lado; el comprobante de cada parte dice que ambas aceptaron y que la plataforma se pondrá en contacto con ellas',
      ],
    },
    {
      key: 'operator',
      name: 'Operador',
      eyes: 1,
      open: 0.3,
      who: 'Solo el equipo de la plataforma',
      rule: 'Campos que el pack reserva a la plataforma, como los datos de identidad para una comprobación de parte. Nunca llegan al otro lado, y cada acceso queda registrado.',
      fields: [
        { label: 'Datos de identidad', value: 'para la comprobación de parte del espacio, vistos por el equipo' },
        { label: 'El registro del gate', value: 'superado, fallido o remitido, con una referencia y sin datos personales' },
      ],
      not: ['Nada de ello, para el otro lado'],
    },
  ],
};
