/* The stand-in for the jobs space's interests until J2-5 exists, and the one place to swap it for the real client: the
   pages and src/front/covert.ts reach the covert yes only through `interests`. It keeps the session in this browser
   tab (sessionStorage, gone when the tab closes) and sends nothing. The one person who can sign in is made up: their
   email address counts as confirmed, the one check that exists today, and their made-up current employer is on their
   block list. */
import type { Posting } from './catalogue.ts';
import { SIGNED_OUT, sayYes, withdraw, type Person, type Session } from './interest.ts';

export interface Interests {
  read(): Session;
  signIn(): Session;
  signOut(): Session;
  say(posting: Pick<Posting, 'id' | 'source' | 'original_url'>): Session;
  withdraw(postingId: string): Session;
}

export const MADE_UP_PERSON: Person = { id: 'person-made-up', checks: ['email'], blocked: ['current-employer.example'] };

const KEY = 'jobs-covert-yes-made-up';

/** The stand-in over any storage with getItem and setItem (sessionStorage in the browser, a map in the tests). */
export const stub = (storage: Pick<Storage, 'getItem' | 'setItem'>, now = () => new Date().toISOString()): Interests => {
  const read = (): Session => {
    try { return { ...SIGNED_OUT, ...JSON.parse(storage.getItem(KEY) ?? 'null') }; } catch { return SIGNED_OUT; }
  };
  const write = (s: Session) => { storage.setItem(KEY, JSON.stringify(s)); return s; };
  return {
    read,
    signIn: () => write({ ...read(), person: MADE_UP_PERSON }),
    signOut: () => write({ ...read(), person: null }),
    say: posting => write(sayYes(read(), posting, now())),
    withdraw: postingId => write(withdraw(read(), postingId)),
  };
};

/** The covert yes as the pages use it. */
export const interests = (): Interests => stub(sessionStorage);
