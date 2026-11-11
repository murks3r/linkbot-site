/* Las palabras del sitio en español: traducción del catálogo fuente en inglés. */
import type { Catalogue } from './en.ts';
import { statusDate } from './status-date.ts';
import { PUBLIC_NAME } from './terms.ts';

/** The day the status sentences were checked, in this language (status-date.ts). */
const AS_OF = statusDate('es');

export const es: Catalogue = {
  site: {
    name: PUBLIC_NAME,
    claim: 'Confianza entre dos empresas antes de conocerse.',
    skip: 'Saltar al contenido',
    menu: 'Menú',
    toc: 'En esta página',
    language: 'Idioma',
    nav: { docs: 'Documentación', developers: 'Desarrolladores' },
    footer: {
      product: PUBLIC_NAME,
      legal: 'Legal',
      imprint: 'Aviso legal',
      privacy: 'Aviso de privacidad',
      contact: 'Contacto',
      contactPending: `Los datos de contacto están en preparación, por eso este sitio aún no indica ninguna dirección ni tiene formulario de contacto.`,
      line: 'Este sitio no usa cookies, no carga nada de terceros y no usa analíticas.',
    },
    synthetic: 'Todo en este sitio describe el contrato de Space API y lo que se ejecuta en el espacio de prueba sintético, con datos sintéticos. Ninguna persona ni organización real lo usa todavía.',
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
        `A ${AS_OF}, la instancia del espacio de prueba sintético sirve la versión 0.6.1-v1 del widget.`,
      ],
    },
    sdk: {
      title: 'El SDK en su servidor',
      lede: 'Una vez, desde su servidor, con la clave secreta: registra su receptor de webhooks y devuelve el secreto de firma, que se muestra solo esta vez.',
      notes: [
        `A ${AS_OF} el SDK no está en npm. Se usa desde un clon del repositorio de Connect, donde es un paquete del workspace.`,
        `La prueba de este ejemplo se ejecuta contra un sustituto, no contra un espacio. A ${AS_OF} el espacio de prueba no envía webhooks.`,
      ],
    },
    docs: {
      title: 'La documentación',
      lede: `Generada en este sitio a partir de la exportación open core del repositorio de Connect, en inglés. A ${AS_OF}, el repositorio en sí es privado y no hay nada publicado.`,
      sections: {
        quickstart: { name: 'Inicio rápido (5 minutos)', body: 'Una etiqueta script, tu clave publicable y el origen de tu página; después, el inicio rápido completo y el recorrido de una persona por la API.' },
        widget: { name: 'Widget', body: 'Cada atributo del embed, el wrapper de React y recetas para HTML simple, Astro, Next.js y WordPress.' },
        sdk: { name: 'SDK', body: 'Los clientes tipados para tu servidor y para el lado de la persona, y la comprobación de la firma de los webhooks.' },
        cli: { name: 'CLI', body: 'El comando linkbot: probar el widget en tu equipo, integrarlo en tu sitio y comprobar la configuración. Aún no publicado.' },
        protocol: { name: 'Protocolo', body: 'El contrato de la Space API, los tres pasos que respeta y quién tiene cada clave.' },
        api: { name: 'Referencia de la API', body: 'Cada ruta de la Space API, generada a partir del contrato.' },
        open: { name: 'Qué es abierto y qué está alojado', body: 'Lo que una plataforma ejecuta por sí misma y lo que queda en el servicio alojado.' },
      },
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
    title: 'Estado: qué funciona en el espacio de prueba, qué está hecho y qué está previsto',
    description: `Dónde está cada parte de ${PUBLIC_NAME}, según la lista de comprobación del sitio: en el espacio de prueba sintético, construida sin ejecutarse allí, o prevista.`,
    eyebrow: 'Estado',
    h1: ['Dónde está,', 'parte por parte.'],
    lede: `Comprobado el ${AS_OF} con el informe de estado del espacio de prueba y el plan de Connect. Esta página se genera a partir de la lista de comprobación del sitio, así que no dice nada que esa lista no diga.`,
    states: {
      test: { title: 'En el espacio de prueba', lead: 'Datos sintéticos, en alemán e inglés.' },
      built: { title: 'Construido o en el contrato, no en el espacio de prueba', lead: 'No se ejecuta allí y no está publicado.' },
      planned: { title: 'Previsto, no construido', lead: 'Sin fecha prometida.' },
    },
    items: {
      form: 'Describir una solicitud o una oferta por formulario, con el aviso de identidad donde el espacio lo tiene',
      text: 'Describir una solicitud o una oferta con sus propias palabras, leídas por reglas fijas sin un modelo',
      board: 'El tablón, con los valores simplificados del espacio, que lista solo lo que su titular eligió',
      watches: 'Las búsquedas abiertas; su email va a un buzón de prueba y no llega a nadie',
      control: 'Los ajustes, orígenes, claves y el funnel de un espacio, mediante Space API',
      confirm: 'Confirmar; el navegador que confirmó gestiona lo que creó',
      matching: 'Emparejamiento con un veredicto por criterio',
      gates: 'Gates y aprobación por un operador con nombre',
      introductions: 'Presentaciones en modo de operador, con comprobantes',
      outcomes: 'Resultados, cambios, pausas y cierres',
      deletion: 'Borrado con el registro de borrado de la instancia',
      widget: 'El widget, servido por la propia instancia desde una release fijada (0.6.1-v1)',
      webhooks: 'Webhooks al servidor de la plataforma: en el contrato, y el SDK comprueba sus firmas; el espacio de prueba no los envía',
      mail: 'Email que llega a un buzón real; el email del espacio de prueba va a un buzón de prueba',
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
    title: `Novedades: los pasos del producto ${PUBLIC_NAME}, con fecha`,
    description: `Cada paso de ${PUBLIC_NAME} que un cliente puede notar, con fecha y con su estado: en el espacio de prueba sintético, o construido y aún no disponible.`,
    eyebrow: 'Novedades',
    h1: ['Qué ha cambiado,', 'paso a paso.'],
    lede: 'Una entrada por cada paso del producto que un cliente puede notar, la más reciente primero. Cada una dice si se ejecuta en el espacio de prueba sintético o si está construida y aún no disponible. Nada de esto está publicado todavía para usuarios reales.',
    states: { test: 'En el espacio de prueba', built: 'Construido, aún no disponible' },
    note: 'Cada entrada procede de un archivo del repositorio de este sitio que nombra las pull requests en las que se basa; una entrada sin ellas detiene la compilación.',
    link: 'Novedades',
  },

  privacy: {
    title: `Aviso de privacidad · ${PUBLIC_NAME}`,
    description: 'El aviso de privacidad de este sitio web está en preparación. Lo que ya es cierto: el sitio no usa cookies, no carga nada de terceros y no usa analíticas.',
    eyebrow: 'Aviso de privacidad',
    h1: 'En preparación',
    lede: 'El aviso de privacidad de este sitio web se está redactando y revisando. Aparecerá aquí cuando se publique. Hasta entonces no se muestra nada, porque un texto legal no puede redactarse por conjetura.',
    released: { description: `El aviso de privacidad del sitio web de ${PUBLIC_NAME}: qué trata el sitio, para qué, con qué base jurídica y cuáles son sus derechos.` },
    facts: {
      title: 'Lo que ya es cierto de este sitio',
      items: [
        'No usa cookies ni analíticas ni rastreo.',
        'No carga nada de terceros: las tipografías y las imágenes salen de este sitio.',
        'No tiene cuenta y no envía a ninguna parte nada de lo que escriba: los campos de la página de inicio funcionan solo en su navegador, y el sitio no guarda nada.',
        'El producto se ejecuta en las páginas de una plataforma, bajo el aviso de datos de esa plataforma, junto a las líneas fijas del widget.',
      ],
    },
  },

  imprint: {
    title: `Aviso legal · ${PUBLIC_NAME}`,
    description: `El aviso legal del sitio web de ${PUBLIC_NAME}: datos del proveedor y de contacto. El texto está en preparación.`,
    eyebrow: 'Aviso legal',
    h1: 'En preparación',
    lede: 'El aviso legal (proveedor, dirección, representantes, datos registrales y fiscales, contacto) se está preparando y aparecerá aquí cuando esté confirmado. Hasta entonces no se muestra nada, porque nada de ello puede inventarse.',
    released: { description: `El aviso legal del sitio web de ${PUBLIC_NAME}: proveedor, dirección, representantes, datos registrales y fiscales, y contacto.` },
  },

  contact: {
    title: `Contacto · ${PUBLIC_NAME}`,
    description: `Cómo contactar con ${PUBLIC_NAME}. Los datos de contacto están en preparación: esta página indicará la dirección en cuanto exista su buzón.`,
    eyebrow: 'Contacto',
    h1: 'En preparación',
    released: { h1: 'Escríbanos', description: `Cómo contactar con ${PUBLIC_NAME}: la dirección a la que escribir con una pregunta sobre ${PUBLIC_NAME} o sobre un espacio en su plataforma.` },
    write: 'Escriba a {email}.',
  },

  notFound: {
    title: `Página no encontrada · ${PUBLIC_NAME}`,
    description: 'Esta página no existe. Vaya a la página de inicio o lea el sitio en otro idioma.',
    eyebrow: 'Página no encontrada',
    h1: 'Aquí no hay nada.',
    lede: 'Puede que la página se haya movido.',
    home: 'Ir a la página de inicio',
    languages: 'Este sitio en otros idiomas',
  },
};
