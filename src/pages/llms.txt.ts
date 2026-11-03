import type { APIRoute } from 'astro';
import template from '../llms/llms.txt?raw';
import { PUBLIC_NAME } from '../i18n/terms';
/* /llms.txt, a plain-text summary for language models: src/llms/llms.txt with the public name put in for {name}, so a
   change of name is one line (src/i18n/terms.ts). llms-full.txt starts with this file (src/integrations/llms-full.ts). */
export const GET: APIRoute = () =>
  new Response(template.replaceAll('{name}', PUBLIC_NAME), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
