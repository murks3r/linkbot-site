/* es: the home's words (src/front/copy.ts); the page's sentences are the site's. Not yet read by a native speaker
   (docs/truth-check.md). */
import type { FrontCopy } from '../copy.ts';
import { PUBLIC_NAME } from '../../i18n/terms.ts';

export const es: FrontCopy = {
  landing: {
    meta: {
      title: `${PUBLIC_NAME} para desarrolladores: confianza antes de conocerse, en su plataforma`,
      description: `Integre ${PUBLIC_NAME} con un script y un elemento, o construya su propia interfaz sobre la Space API. Pruebe «ambos dicen sí» con dos empresas ficticias.`,
    },
    opening: {
      h1: 'Confianza antes de conocerse, integrada en su plataforma.',
      sub: {
        today: `${PUBLIC_NAME} confirma a cada parte, busca el encaje en privado y presenta a dos empresas solo cuando ambas dicen que sí.`,
        full: `${PUBLIC_NAME} comprueba quién es real, busca el encaje en privado y presenta a dos empresas solo cuando ambas dicen que sí.`,
      },
      start: 'Empiece en 5 minutos',
      docs: 'Leer la documentación',
    },
    trial: {
      h2: 'Pruébelo: un comprador, un proveedor',
      label: 'Datos de ejemplo inventados · funciona en su navegador, no se envía nada',
      steps: ['Comprobar', 'Encaje en privado', 'Ambas dicen que sí'],
      progress: 'Pasos',
      buyer: { role: 'Comprador', name: 'Northfield Fittings', wants: 'Necesita', text: 'Carcasas de aluminio, 5.000 al año, ISO 9001, entrega dentro de la UE' },
      supplier: { role: 'Proveedor', name: 'Lakeside Castings', wants: 'Ofrece', text: 'Piezas de aluminio fundidas a presión desde 1.000 unidades, ISO 9001, envío a toda la UE' },
      hidden: 'Nombre oculto',
      email: 'Correo electrónico',
      check: {
        title: 'Cada parte confirma su contacto',
        p: 'Cada parte confirma lo que pidió y abre un enlace enviado a su dirección de correo. No se guarda nada antes de que confirme.',
        pending: 'Aún sin confirmar',
        done: 'Confirmado mediante un enlace',
        button: 'Confirmar',
        next: 'Buscar un encaje',
      },
      match: {
        title: 'Un posible encaje, sin nombres',
        p: `${PUBLIC_NAME} compara a las dos partes criterio por criterio. Cada parte ve los veredictos, nunca el nombre ni el contacto de la otra.`,
        card: 'Posible encaje',
        criteria: [
          { label: 'Material', value: 'Aluminio', verdict: 'meets' },
          { label: 'Cantidad', value: '5.000 al año; desde 1.000 unidades', verdict: 'meets' },
          { label: 'Certificado', value: 'ISO 9001', verdict: 'meets' },
          { label: 'Entrega', value: 'Dentro de la UE', verdict: 'meets' },
          { label: 'Proceso', value: 'Fundición a presión; la solicitud no lo dice', verdict: 'unknown' },
        ],
        verdicts: { meets: 'Encaja', partly: 'Encaja en parte', conflicts: 'Contradice', unknown: 'Desconocido' },
        approved: 'Una persona designada de la plataforma aprobó este posible encaje. La aprobación no revela nada.',
        next: 'Preguntar a ambas partes',
      },
      yes: {
        title: 'Ambas dicen que sí, o nadie sabe nada',
        p: 'Cada parte responde por su cuenta. Hasta que ambas digan que sí, ninguna sabe quién es la otra.',
        ask: { buyer: '¿Quiere que le presenten a este proveedor?', supplier: '¿Quiere que le presenten a este comprador?' },
        yes: 'Sí',
        no: 'No',
        waiting: 'Sí. Esperando a la otra parte, que no ve esta respuesta.',
        said: 'No.',
        introduced: 'Presentadas. Ambas dijeron que sí; solo ahora se comparten los nombres y las direcciones de correo.',
        mode: 'Se muestra aquí como presentación directa; una plataforma también puede hacer la presentación a través de su propio equipo.',
        declined: 'Sin presentación. Una parte dijo que no, así que ninguna sabe quién es la otra.',
        reset: 'Empezar de nuevo',
      },
    },
    embed: {
      h2: 'La integración más corta',
      p: 'Un script y un elemento en su página; las preguntas encajan con su mercado.',
      hosted: 'Acceso alojado para otras plataformas',
      developers: 'Para desarrolladores',
      docs: 'Toda la documentación',
    },
    bottom: {
      h2: `¿No desarrolla software? Qué es ${PUBLIC_NAME}, en palabras sencillas.`,
      button: 'Léalo en sensalio.de',
      line: 'Todo lo que se muestra aquí funciona con datos ficticios; comprobado el {date}.',
      status: 'El estado completo',
    },
    labels: { live: 'Live', soon: 'Próximamente' },
  },
};
