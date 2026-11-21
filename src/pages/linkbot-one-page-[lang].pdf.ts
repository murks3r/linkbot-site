/* The one-page sheet as a PDF per language, /linkbot-one-page-<lang>.pdf, drawn at build time (src/lib/sheet-pdf.ts). */
import type { APIRoute, GetStaticPaths } from 'astro';
import { LANGS, type Lang } from '../i18n';
import { sheet } from '../lib/sheet';
import { renderSheetPdf } from '../lib/sheet-pdf';

export const getStaticPaths = (() => LANGS.map(lang => ({ params: { lang } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params, site }) => {
  if (!site) throw new Error("the one-page sheet needs the site's address (astro.config.mjs, site)");
  const pdf = await renderSheetPdf(sheet(params.lang as Lang, site));
  return new Response(Buffer.from(pdf), { headers: { 'Content-Type': 'application/pdf' } });
};
