/* Direction A: the one synthetic pair the front page plays (GEO-188 front-page preview, 2026-10-24). Fixed values
   written for this page, in the vocabulary of the sample pack for industrial minerals (murks3r/linkbot-connect,
   packages/adapter/src/sample/pack.ts, itself synthetic); nothing here is a real need, offer or match, and nothing is
   matched on the page. Each verdict follows the rule the Space API contract names for its control (the matching
   paragraph, 0.2.7): the same option meets; a limit kept meets; overlapping ranges and windows meet; the asked
   term among the offered meets; a soft criterion without a hit conflicts and only shows; "not stated" is unknown
   and never a fit. Whether the pair can be a fit follows from the hard criteria alone. */
export type Verdict = 'meets' | 'partly' | 'conflicts' | 'unknown';
export type Importance = 'must' | 'nice_to_have';
export interface Row { key: string; label: string; importance: Importance; need: string; offer: string; verdict: Verdict; why: string }

export const ROWS: Row[] = [
  { key: 'product', label: 'Product', importance: 'must', need: 'Rock phosphate', offer: 'Rock phosphate', verdict: 'meets', why: 'the same option on both sides' },
  { key: 'p2o5', label: 'P₂O₅ content', importance: 'must', need: 'at least 30 %', offer: '31–32 %', verdict: 'meets', why: 'the offer’s range keeps the limit' },
  { key: 'cadmium', label: 'Cadmium', importance: 'must', need: 'at most 20 mg/kg per kg of P₂O₅', offer: 'at most 18 mg/kg per kg of P₂O₅', verdict: 'meets', why: 'the same basis, inside the limit' },
  { key: 'quantity', label: 'Quantity', importance: 'must', need: '22,500–27,500 t', offer: '20,000–25,000 t', verdict: 'meets', why: 'the two ranges overlap' },
  { key: 'incoterm', label: 'Delivery terms', importance: 'must', need: 'CFR', offer: 'CFR, CIF or FOB', verdict: 'meets', why: 'the asked term is among the offered' },
  { key: 'port', label: 'Named port', importance: 'must', need: 'Augusta (IT AUG)', offer: 'Augusta, Ravenna or Tarragona', verdict: 'meets', why: 'the asked port is among the offered' },
  { key: 'window', label: 'Shipment window', importance: 'must', need: 'Q1 2027', offer: '15 January to 15 April 2027', verdict: 'meets', why: 'the windows overlap' },
  { key: 'payment', label: 'Payment', importance: 'nice_to_have', need: 'Letter of credit', offer: 'Cash against documents', verdict: 'conflicts', why: 'a soft criterion: it shows, it does not decide' },
  { key: 'packaging', label: 'Packaging', importance: 'nice_to_have', need: 'Bulk', offer: 'not stated', verdict: 'unknown', why: 'not stated in the offer' },
  { key: 'origin', label: 'Country of origin', importance: 'nice_to_have', need: 'Morocco or Jordan', offer: 'Egypt', verdict: 'conflicts', why: 'a soft criterion: it shows, it does not decide' },
  { key: 'inspection', label: 'Independent inspection at loading', importance: 'nice_to_have', need: 'Yes', offer: 'not stated', verdict: 'unknown', why: 'not stated in the offer' },
];
