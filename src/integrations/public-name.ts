/* A remark step for the site's own Markdown pages (src/content/developers), registered in astro.config.mjs: "{name}" in
   their text becomes PUBLIC_NAME (src/i18n/terms.ts), as in llms.txt, so the public name stays one line. Code is left
   as written; the export's Markdown (src/content/open-core) is Connect's and passes through unchanged. */
import { PUBLIC_NAME } from '../i18n/terms.ts';

interface Node { type: string; value?: string; children?: Node[] }

const ROOT = '/src/content/developers/';

export const remarkPublicName = () => (tree: Node, file: { path?: string; history?: string[] }) => {
  if (!String(file.path ?? file.history?.[0] ?? '').includes(ROOT)) return;
  const walk = (node: Node) => {
    if (node.type === 'text' && node.value) node.value = node.value.replaceAll('{name}', PUBLIC_NAME);
    node.children?.forEach(walk);
  };
  walk(tree);
};
