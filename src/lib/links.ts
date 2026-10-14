/* Where the product runs. The site explains; the app (murks3r/linkbot, served under /talent)
   searches, saves, watches and holds every permission. PUBLIC_APP_ORIGIN is the app's origin
   when it is not served beside the site; empty means the same origin. */
const origin = (import.meta.env.PUBLIC_APP_ORIGIN ?? '').replace(/\/+$/, '');
export const APP = `${origin}/talent`;

/** An app route, e.g. app('#/agency'). */
export const app = (route = '#/search') => `${APP}${route}`;

/** The app's search with words handed over in the fragment: browsers never send a fragment to a
    server, and the app removes the words from the address as soon as it has read them. */
export const searchWith = (words: string) => `${APP}#/search?q=${encodeURIComponent(words)}`;

export const NOINDEX = import.meta.env.PUBLIC_NOINDEX === '1';
