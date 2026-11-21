/* llms.txt from its parts (src/pages/llms.txt.ts): the summary (src/llms/llms.txt), then the jobs section
   (src/llms/jobs.txt) only in a build that carries the draft jobs pages, with the public name put in for {name}. Pure,
   so tests/jobs-board.test.mjs composes the same text from the same files. */
import { PUBLIC_NAME } from '../i18n/terms.ts';

export const llmsText = (summary: string, jobs: string, withJobs: boolean): string =>
  (withJobs ? summary + jobs : summary).replaceAll('{name}', PUBLIC_NAME);
