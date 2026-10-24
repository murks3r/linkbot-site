/* Every text module of the front page, for tests/front.test.mjs: a module registered here is scanned for forbidden
   claims, empty strings and private details. */
import { C } from './c-copy.ts';
import { STAGES } from './c-stages.ts';
export const TEXTS = { c: C, cStages: STAGES };
