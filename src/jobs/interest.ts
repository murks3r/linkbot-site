/* The covert yes, in the shape the jobs space plans for it (J2-5, Core-Engine, a draft): a real posting becomes, on its
   first interest, a `seeking` intent held by an unclaimed company party, keyed "<source>:<board>" (partyOf; Core-Engine's
   rule for J2-5, 2026-11-05); a checked person's covert yes is an interest on it. The person's block list (domains, as
   the blocks draft normalises them: lower case, no "www.", a subdomain is covered) applies when a company claims its
   postings with a domain it confirmed (J2-6), before it sees any count or summary (countFor). Pure rules over a session,
   so the browser (src/front/covert.ts) and the tests (tests/jobs-covert.test.mjs) run the same code; where the session
   lives is src/jobs/interest-stub.ts. */
import type { Posting } from './catalogue.ts';

/** The checks a person can have passed. Today there is one: the email address confirmed through a link. */
export type Check = 'email';

export interface Person { id: string; checks: Check[]; blocked: string[] }

/** One covert yes on one posting. A withdrawn one is kept for the person's record, never counted. */
export interface Interest { posting_id: string; party: string; at: string; state: 'covert' | 'withdrawn' }

export interface Session { person: Person | null; interests: Interest[] }

export const SIGNED_OUT: Session = { person: null, interests: [] };

/** A domain as a block compares it: lower case, no "www.". */
export const domain = (value: string): string => value.trim().toLowerCase().replace(/^www\./, '');

/** The unclaimed company party a posting's interests go to, as J2-5 keys it: "<source>:<board>", both as the catalogue
    delivers them (source plus employer.board). Never the host of original_url: on an application system that is the
    system's host, shared by every employer on it (T-J2 FUND 7). No board, no key: no company can claim such a posting,
    so the page offers no covert yes on it. */
export const partyOf = (posting: Pick<Posting, 'source' | 'board'>): string | null =>
  posting.board ? `${posting.source}:${posting.board}` : null;

/** Whether a block on `blocked` covers a domain a company confirmed: the same domain or one of its subdomains. An
    unclaimed party has no domain, so nothing is compared before the claim (T-J2 FUND 3). */
export const covers = (blocked: string, confirmed: string): boolean => {
  const b = domain(blocked);
  const d = domain(confirmed);
  return d === b || d.endsWith(`.${b}`);
};

export const isChecked = (person: Person): boolean => person.checks.includes('email');

export const said = (s: Session, postingId: string): Interest | undefined =>
  s.interests.find(i => i.posting_id === postingId && i.state === 'covert');

/** Only a signed-in, checked person says yes, once per posting. */
export const canSay = (s: Session, postingId: string): boolean =>
  s.person !== null && isChecked(s.person) && !said(s, postingId);

export const sayYes = (s: Session, posting: Pick<Posting, 'id' | 'source' | 'board'>, at: string): Session => {
  const party = partyOf(posting);
  return party !== null && canSay(s, posting.id)
    ? { ...s, interests: [...s.interests.filter(i => i.posting_id !== posting.id), { posting_id: posting.id, party, at, state: 'covert' }] }
    : s;
};

export const withdraw = (s: Session, postingId: string): Session =>
  ({ ...s, interests: s.interests.map(i => i.posting_id === postingId && i.state === 'covert' ? { ...i, state: 'withdrawn' } : i) });

/** The person's covert yeses, newest first: what /jobs/mine lists. */
export const mine = (s: Session): Interest[] =>
  s.interests.filter(i => i.state === 'covert').sort((a, b) => b.at.localeCompare(a.at));

/** How many covert yeses a company sees once it has claimed a party with a domain it confirmed (J2-6): only on that party,
    never a withdrawn one, and never one from a person whose block list covers the confirmed domain. Before the claim a
    company sees no number at all. */
export const countFor = (yeses: { person: Person; interest: Interest }[], claim: { party: string; domain: string }): number =>
  yeses.filter(({ person, interest }) => interest.state === 'covert' && interest.party === claim.party && !person.blocked.some(b => covers(b, claim.domain))).length;
