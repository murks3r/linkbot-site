/* The covert yes, in the shape the jobs space plans for it (J2-5, Core-Engine, a draft): a real posting becomes, on its
   first interest, a `seeking` intent held by an unclaimed company party (the key is J2-5's, read from the catalogue; see
   partyOf); a checked person's covert yes is an interest on it. The person's block list (domains, as the blocks draft
   normalises them: lower case, no "www.", a subdomain is covered) applies before anything is counted. Pure rules over a session, so the browser (src/front/covert.ts) and the tests
   (tests/jobs-covert.test.mjs) run the same code; where the session lives is src/jobs/interest-stub.ts. */
import type { Posting } from './catalogue.ts';

/** The checks a person can have passed. Today there is one: the email address confirmed through a link. */
export type Check = 'email';

export interface Person { id: string; checks: Check[]; blocked: string[] }

/** One covert yes on one posting. A withdrawn one is kept for the person's record, never counted. */
export interface Interest { posting_id: string; party: string | null; at: string; state: 'covert' | 'withdrawn' }

export interface Session { person: Person | null; interests: Interest[] }

export const SIGNED_OUT: Session = { person: null, interests: [] };

/** A domain as a block compares it: lower case, no "www.". */
export const domain = (value: string): string => value.trim().toLowerCase().replace(/^www\./, '');

/** The unclaimed company party a posting's interests go to: the key the catalogue carries (J2-5), never one the browser
    derives from the posting's address (on an application system every employer shares the host, and a board id is no
    domain a block can cover, T-J2 FUND 3 and 7). null while J2-5 gives none: the yes is then the person's own record and
    counts for no company. */
export const partyOf = (posting: Pick<Posting, 'party'>): string | null => posting.party;

/** Whether a block on `blocked` covers a party: the same domain or one of its subdomains. A party keyed by a board id is
    never covered: tying a board to the domain a company confirmed is open (T-J2 FUND 3, J2-5 and NX-K1). */
export const covers = (blocked: string, party: string): boolean => {
  const b = domain(blocked);
  return party === b || party.endsWith(`.${b}`);
};

export const isChecked = (person: Person): boolean => person.checks.includes('email');

export const said = (s: Session, postingId: string): Interest | undefined =>
  s.interests.find(i => i.posting_id === postingId && i.state === 'covert');

/** Only a signed-in, checked person says yes, once per posting. */
export const canSay = (s: Session, postingId: string): boolean =>
  s.person !== null && isChecked(s.person) && !said(s, postingId);

export const sayYes = (s: Session, posting: Pick<Posting, 'id' | 'party'>, at: string): Session =>
  canSay(s, posting.id)
    ? { ...s, interests: [...s.interests.filter(i => i.posting_id !== posting.id), { posting_id: posting.id, party: partyOf(posting), at, state: 'covert' }] }
    : s;

export const withdraw = (s: Session, postingId: string): Session =>
  ({ ...s, interests: s.interests.map(i => i.posting_id === postingId && i.state === 'covert' ? { ...i, state: 'withdrawn' } : i) });

/** The person's covert yeses, newest first: what /jobs/mine lists. */
export const mine = (s: Session): Interest[] =>
  s.interests.filter(i => i.state === 'covert').sort((a, b) => b.at.localeCompare(a.at));

/** How many covert yeses a party's postings hold, as the company would see the number once it claims them: a person
    who blocked the party is left out before counting, and so is every withdrawn yes. A yes on a posting without a party
    key (null) counts for no one. */
export const countFor = (yeses: { person: Person; interest: Interest }[], party: string): number =>
  yeses.filter(({ person, interest }) => interest.state === 'covert' && interest.party !== null && interest.party === party && !person.blocked.some(b => covers(b, party))).length;
