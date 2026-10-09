/**
 * Minimal static file server for the preview smoke tests — stdlib only, no new
 * dependency. It reproduces the parts of Vercel's static hosting the smoke
 * checks care about: directory index resolution, clean URLs without a trailing
 * slash (`vercel.json` sets `trailingSlash: false`), correct content types, and
 * an honest 404.
 *
 * Fixture caveat: this is a local harness, not Vercel. Header-level rules from
 * vercel.json (X-Robots-Tag, security headers, the preview robots rewrite) do
 * not apply here and are asserted separately, by reading vercel.json.
 */

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
};

/** @param {string} root @returns {Promise<{ dir: string, origin: string, close: () => Promise<void> }>} */
export async function serveStatic(root) {
  const base = resolve(root);
  if (!(await isDirectory(base))) throw new Error(`serveStatic: not a directory: ${base}`);

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);

    // Reject traversal before touching the filesystem.
    const candidates = [];
    const normalised = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    const target = join(base, normalised);
    if (!target.startsWith(base + sep) && target !== base) {
      res.writeHead(403, { 'content-type': 'text/plain' });
      res.end('forbidden');
      return;
    }

    candidates.push(target);
    candidates.push(`${target}.html`);
    candidates.push(join(target, 'index.html'));

    for (const candidate of candidates) {
      if (await isFile(candidate)) {
        res.writeHead(200, {
          'content-type': CONTENT_TYPES[extname(candidate)] ?? 'application/octet-stream',
        });
        createReadStream(candidate).pipe(res);
        return;
      }
    }

    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end('<!doctype html><title>404</title><h1>404</h1>');
  });

  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());

  return {
    dir: base,
    origin: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise((done, fail) => server.close((err) => (err ? fail(err) : done()))),
  };
}

/** @param {string} path */
async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

/** @param {string} path */
async function isDirectory(path) {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}
