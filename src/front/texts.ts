/* Every text module of the front page, for tests/front.test.mjs: a module registered here is scanned for forbidden
   claims, empty strings and private details. */
import { B } from './b-copy.ts';
import { CRITERIA, PACK, WORDS } from './b-pack.ts';
export const TEXTS = { b: B, bPack: { PACK, WORDS, CRITERIA } };
