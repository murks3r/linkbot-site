/* Direction B: the questions a pack asks (front-page preview, GEO-188, 2026-10-24). The criteria, labels, options,
   units and special answers of the Connect lane's SAMPLE pack for industrial minerals (murks3r/linkbot-connect,
   packages/adapter/src/sample/pack.ts, version 0.2.0), which is synthetic and not Geoprocure's pack; the page says so.
   The form's shape is the contract's and ADR 0004's: required criteria first, the rest behind "More details"; every
   list offers "Other / not listed", "Don't know" and "Any" where the pack allows them; nothing is pre-selected; an
   importance is suggested, never set. Nothing here is sent or stored anywhere. */
export type Control = 'single_choice' | 'range' | 'multiple_choice' | 'searchable_list' | 'date_window' | 'yes_no';
export type Special = 'other' | 'unknown' | 'any';
export interface Criterion {
  key: string;
  label: string;
  help?: string;
  control: Control;
  options?: string[];
  unit?: string;
  /** A range's bases, when the pack asks what a limit refers to. */
  bases?: string[];
  /** Quick picks for a date window. */
  quick?: string[];
  specials: Special[];
  required: boolean;
  importance: 'must' | 'nice_to_have';
  /** The option that hides the phosphate-only criteria (the pack's show-when: sulphur is the one product that is no phosphate). */
  hides?: string;
  /** Shown only when the product is a phosphate (the pack's show-when). */
  phosphatesOnly?: boolean;
}

export const CRITERIA: Criterion[] = [
  { key: 'product', label: 'Product', control: 'single_choice', options: ['Rock phosphate', 'DAP (diammonium phosphate)', 'MAP (monoammonium phosphate)', 'TSP (triple superphosphate)', 'Sulphur'], hides: 'Sulphur', specials: ['other', 'unknown', 'any'], required: true, importance: 'must' },
  { key: 'p2o5', label: 'P₂O₅ content', help: 'Give a minimum, a maximum or both.', control: 'range', unit: '%', specials: ['unknown', 'any'], required: true, importance: 'must', phosphatesOnly: true },
  { key: 'quantity', label: 'Quantity', control: 'range', unit: 't', specials: ['unknown', 'any'], required: true, importance: 'must' },
  { key: 'incoterm', label: 'Delivery terms (Incoterms® 2020)', control: 'single_choice', options: ['EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'], specials: ['other', 'unknown', 'any'], required: true, importance: 'must' },
  { key: 'port', label: 'Named port', help: 'Search by name or UN/LOCODE.', control: 'searchable_list', specials: ['unknown', 'any'], required: true, importance: 'must' },
  { key: 'window', label: 'Shipment window', control: 'date_window', quick: ['Q1 2027', 'Q2 2027', 'Q3 2027', 'Q4 2027'], specials: ['unknown', 'any'], required: true, importance: 'must' },
  { key: 'cadmium', label: 'Cadmium (Cd)', help: 'Choose whether the limit is per kg of product or per kg of P₂O₅.', control: 'range', unit: 'mg/kg', bases: ['per kg of product', 'per kg of P₂O₅'], specials: ['unknown', 'any'], required: false, importance: 'must', phosphatesOnly: true },
  { key: 'payment', label: 'Payment', control: 'multiple_choice', options: ['Letter of credit (L/C)', 'Cash against documents (CAD)', 'Advance payment (T/T)', 'Open account'], specials: ['other', 'unknown', 'any'], required: false, importance: 'nice_to_have' },
  { key: 'packaging', label: 'Packaging', control: 'multiple_choice', options: ['Bulk', 'Big bags (FIBC)'], specials: ['other', 'unknown', 'any'], required: false, importance: 'nice_to_have' },
  { key: 'origin', label: 'Country of origin', control: 'multiple_choice', options: ['Morocco', 'Jordan', 'Egypt', 'Algeria', 'Senegal', 'Togo', 'Peru'], specials: ['other', 'unknown', 'any'], required: false, importance: 'nice_to_have' },
  { key: 'inspection', label: 'Independent inspection at loading', control: 'yes_no', specials: ['unknown'], required: false, importance: 'nice_to_have' },
];

/** The widget's own words for the special answers and the importances (Connect, packages/embed/src/i18n/en.ts). */
export const WORDS = {
  other: 'Other / not listed', unknown: 'Don’t know', any: 'Any', either: 'Either is fine', orAnswer: 'Or answer:',
  otherLabel: 'Describe it', otherNote: 'Your words are kept as you wrote them. They aren’t matched to the nearest option.',
  must: 'Must', niceToHave: 'Nice to have', suggested: 'suggested', min: 'Minimum', max: 'Maximum', yes: 'Yes', no: 'No',
  essentials: 'Needed for matching', details: 'More details',
  ambiguous: 'Is this {a} or {b}? Please type it so it can be read only one way.',
} as const;
