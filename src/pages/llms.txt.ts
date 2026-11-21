import type { APIRoute } from 'astro';
import summary from '../llms/llms.txt?raw';
import jobs from '../llms/jobs.txt?raw';
import { llmsText } from '../llms/compose';
import { buildsJobsPage } from '../drafts/jobs-page';
/* /llms.txt, a plain-text summary for language models: src/llms/llms.txt with the public name put in for {name}, so a
   change of name is one line (src/i18n/terms.ts). A build that carries the draft jobs pages adds their section
   (src/llms/jobs.txt); a production build does not until the owner's go. llms-full.txt starts with this file
   (src/integrations/llms-full.ts). */
export const GET: APIRoute = () =>
  new Response(llmsText(summary, jobs, buildsJobsPage({ VERCEL_ENV: process.env.VERCEL_ENV })), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
