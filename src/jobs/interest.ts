/* The covert yes, in the shape the jobs space plans for it (J2-5, Core-Engine, a draft): a real posting becomes, on its
   first interest, a `seeking` intent held by an unclaimed company party under the catalogue's party key
   "<source>:<board>" (Core-Engine's rule for J2-5, 2026-11-05; spec 8.3); a checked person's covert yes is an interest
   on it, and only on a posting whose employer domain the catalogue holds evidence for (claimableParty; catalogue
   0.1.1-draft). The person's block list (domains, as the blocks draft normalises them: lower case, no "www.", a
   subdomain is covered) applies when a company claims its postings with a domain it confirmed (J2-6), before it sees
   any count or summary (countFor). Pure rules over a session, so the browser (src/front/covert.ts) and the tests
   (tests/jobs-covert.test.mjs) run the same code; where the session lives is src/jobs/interest-stub.ts. */
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

/** The party a covert yes on this posting goes to: the catalogue's party key, as delivered, never rebuilt from the board
    or the host of original_url (T-J2 FUND 7). Null when the posting is unclaimable, that is without a party or without
    an evidenced employer domain (catalogue 0.1.1-draft, spec 8.3; the engine answers 409 posting_unclaimable): then the
    page shows no covert yes (T-J2d FUND 13). Against the jobs space this becomes the posting's can_say_yes. */
export const claimableParty = (posting: Pick<Posting, 'party' | 'employer_domain'>): string | null =>
  posting.party !== null && posting.employer_domain !== null ? posting.party : null;

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

export const sayYes = (s: Session, posting: Pick<Posting, 'id' | 'party' | 'employer_domain'>, at: string): Session => {
  const party = claimableParty(posting);
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
