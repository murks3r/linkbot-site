/* Every text module of the front page, for tests/front.test.mjs: a module registered here is scanned for forbidden
   claims, empty strings and private details. */
import { A } from './a-copy.ts';
import { ROWS } from './a-match.ts';
export const TEXTS = { a: A, aMatch: ROWS };
