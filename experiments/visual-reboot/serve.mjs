// @ts-nocheck
/**
 * Tiny static server with no dependencies.
 *
 *   node serve.mjs --dir dist      serve the production build   (npm start / npm run preview)
 *   node serve.mjs --dir src       serve sources live + /public (npm run dev, no build step)
 *
 * It sends the same security headers that vercel.json sends in production —
 * including the strict Content-Security-Policy — so a local run and a deployed
 * preview behave identically. PORT or --port selects the port (default 4173).
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = dirname(fileURLToPath(import.meta.url));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

function securityHeaders() {
  try {
    const config = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
    const entry = (config.headers || []).find((h) => h.source === '/(.*)');
    return Object.fromEntries((entry?.headers || []).map((h) => [h.key, h.value]));
  } catch {
    return {};
  }
}

export function startServer({ dir = 'dist', port = 4173, quiet = false } = {}) {
  const base = resolve(root, dir);
  const fallbackBase = dir === 'src' ? resolve(root, 'public') : null;
  const headers = securityHeaders();

  if (!existsSync(base) && dir === 'dist') {
    const built = spawnSync(process.execPath, [join(root, 'build.mjs')], { stdio: 'inherit' });
    if (built.status !== 0) throw new Error('build failed');
  }

  const resolveFile = (root0, urlPath) => {
    const rel = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, '');
    const abs = resolve(root0, rel);
    if (abs !== root0 && !abs.startsWith(root0 + sep)) return null; // path traversal
    if (existsSync(abs) && statSync(abs).isDirectory()) {
      const index = join(abs, 'index.html');
      return existsSync(index) ? index : null;
    }
    if (existsSync(abs)) return abs;
    if (!extname(abs) && existsSync(abs + '.html')) return abs + '.html'; // cleanUrls
    return null;
  };

  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let file = resolveFile(base, url.pathname) || (fallbackBase && resolveFile(fallbackBase, url.pathname));
    let status = 200;
    if (!file) {
      status = 404;
      const page = join(base, '404.html');
      file = existsSync(page) ? page : null;
    }
    const common = { ...headers, 'Cache-Control': 'no-store' };
    if (!file) {
      res.writeHead(404, { ...common, 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    const body = readFileSync(file);
    res.writeHead(status, { ...common, 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Content-Length': body.length });
    res.end(req.method === 'HEAD' ? undefined : body);
  });

  return new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      const address = server.address();
      if (!quiet) console.log(`serving ${dir}/ at http://localhost:${address.port}`);
      resolvePromise({ server, port: address.port, url: `http://localhost:${address.port}` });
    });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const arg = (name, fallback) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > -1 ? process.argv[i + 1] : fallback;
  };
  startServer({ dir: arg('dir', 'dist'), port: Number(arg('port', process.env.PORT || 4173)) }).catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
