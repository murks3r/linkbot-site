/**
 * Single source of truth for the origin that every absolute URL in a build is
 * derived from (astro.config.mjs `site`, `<link rel="canonical">`, `og:url`,
 * `og:image`, JSON-LD `url`/`@id`, `sitemap-index.xml`).
 *
 * Why this module exists
 * ---------------------
 * The organisation no longer owns `linkbot.org`, and the final public domain is
 * undecided. A build must therefore never invent a canonical host: it must
 * either use the origin it was explicitly told to use, or fall back to the host
 * it is actually being served from. `linkbot.org` is treated as an *invalid*
 * deployment target and fails the build (see `LEGACY_HOSTS`).
 *
 * Resolution order (first match wins)
 * -----------------------------------
 *   1. `VERCEL_ENV=preview`            -> the deployment's own host (`VERCEL_URL`).
 *      A preview must never claim a custom domain, even when one is configured
 *      for the project, because it would emit canonical URLs for a site that is
 *      not this deployment.
 *   2. `SITE_ORIGIN`                   -> the explicitly configured origin.
 *   3. `VERCEL_URL`                    -> the deployment's own host.
 *   4. `http://localhost:4321`         -> local fallback (Astro's dev default).
 *
 * `indexable` is true only when a real, non-loopback `SITE_ORIGIN` was supplied
 * and the build is not a Vercel preview. Every other outcome (localhost, a
 * `*.vercel.app` deployment host, a preview) is a non-production build: it is
 * marked `noindex` and carries a visible non-production notice.
 */

/** Astro's dev-server default, and the documented local preview origin. */
export const LOCAL_ORIGIN = 'http://localhost:4321';

/**
 * Hosts that are structurally impossible to serve publicly, and therefore can
 * never be a production canonical origin.
 */
const LOOPBACK_HOST = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/i;

/**
 * Domains the organisation does not control. Naming one as the site origin is a
 * deployment defect, not a configuration choice, so it fails the build loudly
 * instead of shipping canonical URLs to a third party's host.
 */
export const LEGACY_HOSTS = ['linkbot.org', 'www.linkbot.org'];

/**
 * Normalise a user-supplied origin: accept a bare host or a host with an
 * explicit scheme, reject anything that is not an http(s) origin, and drop any
 * path/query/hash so `new URL(path, origin)` behaves predictably.
 *
 * @param {unknown} value
 * @returns {string | undefined}
 */
function normaliseOrigin(value) {
  if (typeof value !== 'string') return undefined;
  const raw = value.trim();
  if (raw === '') return undefined;

  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;

  let url;
  try {
    url = new URL(withScheme);
  } catch {
    throw new Error(
      `SITE_ORIGIN is not a valid origin: ${JSON.stringify(value)}. ` +
        'Expected a bare host or a full origin, for example example.com.',
    );
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(
      `SITE_ORIGIN must be http or https, received ${JSON.stringify(url.protocol)} ` +
        `in ${JSON.stringify(value)}.`,
    );
  }

  return url.origin;
}

/** @param {string} origin */
function assertNotLegacyHost(origin) {
  const host = new URL(origin).hostname.toLowerCase();
  if (LEGACY_HOSTS.includes(host)) {
    throw new Error(
      `Refusing to build with site origin ${origin}: the organisation does not own ` +
        `${host}. Set SITE_ORIGIN to an origin you control (a Vercel preview host is ` +
        'used automatically). See docs/preview/domain-migration.md.',
    );
  }
}

/**
 * @typedef {object} SiteConfig
 * @property {string} origin      Absolute origin, no trailing slash.
 * @property {'production' | 'preview' | 'deployment' | 'local'} stage
 * @property {boolean} indexable  May this build be indexed and cite itself?
 * @property {string} source      Which input decided the origin (for logs/tests).
 */

/**
 * Resolve the build's site origin and indexing posture.
 *
 * @param {Record<string, string | undefined>} [env]
 * @returns {SiteConfig}
 */
export function resolveSite(env = process.env) {
  const explicit = normaliseOrigin(env.SITE_ORIGIN);
  if (explicit) assertNotLegacyHost(explicit);

  const vercelEnv = (env.VERCEL_ENV ?? '').trim();
  const vercelOrigin = normaliseOrigin(env.VERCEL_URL);
  if (vercelOrigin) assertNotLegacyHost(vercelOrigin);

  // 1. Vercel previews: always the deployment's own host, never a custom domain.
  if (vercelEnv === 'preview') {
    return {
      origin: vercelOrigin ?? LOCAL_ORIGIN,
      stage: 'preview',
      indexable: false,
      source: vercelOrigin ? 'vercel-preview-deployment-host' : 'default-local',
    };
  }

  // 2. An explicit origin wins. It is only "production" when it can actually be
  //    served publicly: a loopback origin is a local preview however it is set.
  if (explicit) {
    const publicHost = !LOOPBACK_HOST.test(new URL(explicit).hostname);
    return {
      origin: explicit,
      stage: publicHost ? 'production' : 'local',
      indexable: publicHost,
      source: 'SITE_ORIGIN',
    };
  }

  // 3. A Vercel deployment without an explicit origin: use its own host. It is
  //    not a canonical domain (see docs/preview/domain-migration.md), so it is
  //    never indexable.
  if (vercelOrigin) {
    return {
      origin: vercelOrigin,
      stage: 'deployment',
      indexable: false,
      source: 'VERCEL_URL',
    };
  }

  // 4. Local.
  return { origin: LOCAL_ORIGIN, stage: 'local', indexable: false, source: 'default-local' };
}

/**
 * Human-readable one-liner for build logs and smoke-test output.
 * @param {SiteConfig} site
 */
export function describeSite(site) {
  return (
    `site=${site.origin} stage=${site.stage} indexable=${site.indexable} ` +
    `(from ${site.source})`
  );
}
