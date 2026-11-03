/* /faq en español (src/faq/en.ts es la fuente). Escrito por la lane, sin revisión nativa todavía. */
import { statusDate } from '../i18n/status-date.ts';
import type { Faq } from './en.ts';

const AS_OF = statusDate('es');

export const es: Faq = {
  title: 'Preguntas sobre Linkbot: qué es y qué problema resuelve',
  description: 'Qué es Linkbot, qué problema resuelve, cómo funciona “ambas dicen que sí”, qué comprueba hoy, qué es código abierto y qué se aloja, y para quién es.',
  eyebrow: 'Preguntas frecuentes',
  h1: 'Preguntas sobre Linkbot',
  lede: 'Respuestas breves, cada una cierta hoy. Lo previsto se dice como previsto.',
  items: [
    {
      q: '¿Qué es Linkbot?',
      a: [
        'Linkbot permite que dos empresas que no se conocen confíen la una en la otra antes de conocerse. Funciona en tres pasos: una comprobación de cada parte, un encaje en privado y una presentación solo cuando ambas dicen que sí.',
        'Una plataforma integra Linkbot en sus propias páginas, con un espacio por mercado.',
      ],
    },
    {
      q: '¿Qué problema resuelve Linkbot?',
      a: [
        'En el comercio B2B, dejarse ver cuesta algo cuando hay mucho en juego. Un comprador que muestra una necesidad, o un proveedor que muestra lo que puede entregar, se lo cuenta a todo el mercado y no sabe quién es real al otro lado.',
        'Así, dos empresas que no se conocen no pueden confiar la una en la otra antes de conocerse. Linkbot lo cambia: confirma cada parte y muestra a cada una solo los criterios y un veredicto por criterio, nunca el nombre ni el contacto de la otra, hasta que ambas dicen que sí.',
      ],
    },
    {
      q: '¿Cómo funciona “ambas dicen que sí”?',
      a: [
        'Tras un encaje en privado, cada parte ve una tarjeta del board sin nombres: los criterios y un veredicto por criterio. Una persona con nombre en la plataforma aprueba el posible encaje; la aprobación no revela nada.',
        'Después cada parte responde por sí misma y no ve la respuesta de la otra. Solo cuando ambas dicen que sí se comparten los nombres y las direcciones de correo, de forma directa o a través del equipo de la plataforma. Un no de cualquiera de las dos no revela nada a la otra, y el servidor rechaza cualquier otro camino hacia una presentación.',
      ],
    },
    {
      q: '¿Qué comprueba Linkbot?',
      a: [
        'Solo lo que funciona hoy: cada parte confirma su dirección de correo con un enlace que se le envía, y no se guarda nada antes de que confirme.',
        'Las comprobaciones de una empresa por parte de Linkbot, como si es real, están previstas y no construidas.',
      ],
    },
    {
      q: '¿Qué es código abierto y qué se aloja?',
      a: [
        `A ${AS_OF}, nada de Linkbot está publicado como código abierto: el repositorio con el widget y el SDK es privado, y el SDK no está en npm.`,
        'El plan: el widget, el SDK, una herramienta de línea de comandos y la descripción del protocolo pasan a ser código abierto, con un inicio rápido de cinco minutos. Las comprobaciones, el historial comprobado, el encaje y la facturación siguen siendo un servicio que aloja Linkbot. La licencia aún no está elegida.',
        'Acceso alojado para otras plataformas: próximamente.',
      ],
    },
    {
      q: '¿Para quién es Linkbot?',
      a: [
        'Para plataformas que reúnen empresas y quieren una presentación solo donde ambas partes la quieren, y para los compradores y proveedores que hay en ellas. Una plataforma lo añade con un script y un elemento en su página.',
        'El primer espacio es para minerales industriales. Funciona como instancia de prueba con datos sintéticos; todavía no lo usa ninguna persona ni organización real.',
      ],
    },
  ],
  terms: {
    title: 'Los términos',
    lede: 'Las palabras que usa Linkbot, cada una con un solo significado, igual en este sitio, en el widget y en la documentación.',
  },
};
