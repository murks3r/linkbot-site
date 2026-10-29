/* Direction C: one synthetic offer, stage by stage (front-page preview, GEO-188, 2026-10-24). Fixed values written
   for this page in the vocabulary of the Connect lane's synthetic sample pack (murks3r/linkbot-connect,
   packages/adapter/src/sample/pack.ts): the stages of its criteria, its board coarsening (the quantity as a band of
   5,000 t, a port as its country, the window in whole months; contract 0.2.11), and what the Space API contract lets
   each stage show. Nothing here is a real offer, and nothing is matched or introduced on the page. */
export type Verdict = 'meets' | 'partly' | 'conflicts' | 'unknown';
export interface Field { label: string; value: string; verdict?: Verdict }
export interface Stage { key: 'board' | 'match' | 'introduction' | 'operator'; name: string; eyes: number; open: number; who: string; rule: string; fields: Field[]; not: string[] }

export const STAGES: Stage[] = [
  {
    key: 'board', name: 'Board', eyes: 3, open: 1,
    who: 'Everyone who can see the board',
    rule: 'Only fields at board stage, coarsened as the pack declares, and only for offers whose owner opted in. Never who posted.',
    fields: [
      { label: 'Product', value: 'Rock phosphate' },
      { label: 'P₂O₅ content', value: '31–32 %' },
      { label: 'Quantity', value: '20,000–25,000 t, as a band of 5,000 t' },
      { label: 'Delivery terms', value: 'CFR, CIF or FOB' },
      { label: 'Named port', value: 'Italy or Spain, as the ports’ countries' },
      { label: 'Shipment window', value: 'January to February 2027' },
    ],
    not: ['Cadmium, payment, packaging, origin and inspection: match stage, not board', 'Who posted it'],
  },
  {
    key: 'match', name: 'Match', eyes: 2, open: .75,
    who: 'The two sides of a possible fit',
    rule: 'Verdicts on fields at match stage or lower, with the rule and the values it cites. No name, no contact details, no sign of the other side’s answer.',
    fields: [
      { label: 'Cadmium', value: 'at most 18 mg/kg per kg of P₂O₅', verdict: 'meets' },
      { label: 'Payment', value: 'cash against documents; a letter of credit was asked', verdict: 'conflicts' },
      { label: 'Packaging', value: 'not stated in the offer', verdict: 'unknown' },
      { label: 'Country of origin', value: 'Egypt; Morocco or Jordan was asked', verdict: 'conflicts' },
      { label: 'Independent inspection', value: 'not stated in the offer', verdict: 'unknown' },
    ],
    not: ['The offer’s display name and email address', 'The need’s answer, until both have said yes'],
  },
  {
    key: 'introduction', name: 'Introduction', eyes: 1, open: .5,
    who: 'In operator mode the platform’s team; in direct mode both sides',
    rule: 'Display name, confirmed email address and the criteria the pack keeps for this stage. Every read is recorded on the receipt.',
    fields: [
      { label: 'Display name', value: 'the offer’s, as given' },
      { label: 'Email address', value: 'one, confirmed through a link' },
      { label: 'Criteria at introduction stage', value: 'as the pack declares' },
    ],
    not: ['Fields the pack keeps for the operator', 'In operator mode: anything of the other side; each side’s receipt says both agreed and the platform will contact them'],
  },
  {
    key: 'operator', name: 'Operator', eyes: 1, open: .3,
    who: 'The platform’s team only',
    rule: 'Fields the pack keeps for the platform, such as the identity details for a party check. They never reach the other side, and every access is recorded.',
    fields: [
      { label: 'Identity details', value: 'for the space’s party check, seen by the team' },
      { label: 'The gate record', value: 'passed, failed or referred, with a reference and no personal data' },
    ],
    not: ['Any of it, for the other side'],
  },
];
