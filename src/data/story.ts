/* The homepage argument (Concept A3): six recognisable problems of job discovery that feed one
   another, and Linkbot's answer to each, in the same order. Grounded language: no competitor is
   painted as malicious, and every answer is something the product does today or is labelled with
   its real status (see docs/design/concept-a2/README.md, evidence table). */
export type Status = 'live' | 'built' | 'next';
export const PROBLEMS = [
  { id: 'scattered', title: 'Jobs are scattered', text: 'Boards, career pages and recruiters each show part of the market, often the same role several times.',
    link: 'So you look everywhere,' },
  { id: 'repeat', title: 'The same search, again', text: 'You run one search on site after site, week after week, to catch what’s new.',
    link: 'and still can’t tell what fits,' },
  { id: 'fit', title: 'Fit is hard to judge', text: 'Many listings leave out what matters to you, like how remote “remote” really is.',
    link: 'so you make yourself findable,' },
  { id: 'visible', title: 'Visible to be found', text: 'To be noticed, you’re nudged to signal you’re open before you’ve decided anything.',
    link: 'which brings more messages,' },
  { id: 'messages', title: 'Messages that miss', text: 'Visibility brings outreach, and much of it doesn’t match what you want.',
    link: 'and contact you didn’t choose,' },
  { id: 'contact', title: 'Contact you didn’t choose', text: 'It’s hard to control who reaches you, and the right jobs get buried.',
    link: 'so you go back to searching.' },
] as const;

export const ANSWERS: { id: string; title: string; text: string; status: Status; statusText: string }[] = [
  { id: 'scattered', title: 'One place to look', text: 'Linkbot reads current listings from many sources and merges copies of the same job into one.', status: 'live', statusText: 'Works today' },
  { id: 'repeat', title: 'Say it once', text: 'A few words are your search. Save them, and Linkbot checks again each day and marks what’s new.', status: 'built', statusText: 'Daily checks: being proven' },
  { id: 'fit', title: 'See what fits, and what isn’t said', text: 'Every listing shows what it states about your words, what it states differently and what it leaves out.', status: 'live', statusText: 'Works today' },
  { id: 'visible', title: 'Nothing to publish', text: 'No public profile and no directory of people. Searching doesn’t even need an account.', status: 'live', statusText: 'Works today' },
  { id: 'messages', title: 'Nothing arrives uninvited', text: 'Linkbot doesn’t message you. You see what changed when you come back.', status: 'live', statusText: 'Works today' },
  { id: 'contact', title: 'Contact only with your yes', text: 'Employers can’t reach you through Linkbot. Details go only to a recipient you name, when you decide.', status: 'built', statusText: 'Sharing: built, in staging' },
];
