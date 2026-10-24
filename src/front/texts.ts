/* Every text module of the front pages, for tests/front.test.mjs: a module registered here is scanned for forbidden
   claims, empty strings and private details. */
import { HOME } from './home-copy.ts';
import { A } from './a-copy.ts';
import { ROWS } from './a-match.ts';
import { B } from './b-copy.ts';
import { CRITERIA, WORDS } from './b-pack.ts';
import { C } from './c-copy.ts';
import { STAGES } from './c-stages.ts';
export const TEXTS = { home: HOME, a: A, aMatch: ROWS, b: B, bPack: { WORDS, CRITERIA }, c: C, cStages: STAGES };
