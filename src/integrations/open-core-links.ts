/* A remark step for the export's Markdown (src/content/open-core/docs), registered in astro.config.mjs: each link
   becomes the site's address of the file it points to, or plain words where the site does not render that file
   (rewriteLink in src/lib/open-core-docs.ts), and the export's HTML comments (its snippet markers) go. Other Markdown
   passes through unchanged. */
import { rewriteLink } from '../lib/open-core-docs.ts';

interface Node { type: string; url?: string; value?: string; children?: Node[] }

const ROOT = '/src/content/open-core/docs/';

export const remarkOpenCoreLinks = () => (tree: Node, file: { path?: string; history?: string[] }) => {
  const path = String(file.path ?? file.history?.[0] ?? '');
  const at = path.indexOf(ROOT);
  if (at < 0) return;
  const from = path.slice(at + ROOT.length);
  const walk = (node: Node) => {
    if (!node.children) return;
    node.children = node.children.flatMap((child): Node[] => {
      if (child.type === 'html' && /^\s*<!--[\s\S]*-->\s*$/.test(child.value ?? '')) return [];
      walk(child);
      if (child.type !== 'link' || child.url === undefined) return [child];
      const url = rewriteLink(from, child.url);
      if (url === null) return child.children ?? [];
      child.url = url;
      return [child];
    });
  };
  walk(tree);
};
