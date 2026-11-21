/* The AI read test (run by hand after `npm run build`, not part of `npm test`: it calls a model). Two fresh model runs
   get only the built HTML of / and /faq, no tools, no memory and no CLAUDE.md, and answer in one sentence what Linkbot
   is and what problem it solves. It passes when every answer names trust between businesses that do not know each other,
   B2B, and the three steps: a check, a private match, and an introduction only when both say yes.
   Usage: node tools/ai-read-test.mjs [model ...]   (default: sonnet haiku; needs the `claude` CLI, logged in) */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const dist = new URL('../dist/', import.meta.url);
const html = page => readFileSync(fileURLToPath(new URL(page, dist)), 'utf8');
const models = process.argv.slice(2).length ? process.argv.slice(2) : ['sonnet', 'haiku'];

const prompt = `Below are two web pages as raw HTML: the home page and the FAQ page of one website. Read only them.

In one sentence: what is Linkbot and what problem does it solve?

<page path="/">
${html('index.html')}
</page>

<page path="/faq">
${html('faq.html')}
</page>`;

/** What a passing answer names; each check is a set of ways to say it. */
const NEEDS = {
  'trust between strangers': [/\btrust\b/i, /(do(es)? not|don['’]t|never) (yet )?know (each other|one another)|strangers|unknown (to each other|parties|businesses)|before (they|the two) (meet|know)/i],
  B2B: [/\bB2B\b|business(es)?[- ]to[- ]business|two (businesses|companies)|buyers? and suppliers?|suppliers? and buyers?/i],
  'step 1, a check': [/\b(check|checks|checking|confirm|confirms|confirming|verif\w*|vet\w*)\b/i],
  'step 2, a private match': [/\b(private(ly)?|hidden|without names|blind)\b[^.]{0,40}\bmatch|\bmatch\w*\b[^.]{0,40}\b(private(ly)?|in private|without (revealing )?names)\b/i],
  'step 3, both say yes': [/\bboth (sides? |parties )?(say|said|agree|consent)|mutual (yes|consent)|only when both/i],
};

const run = model => execFileSync('claude', ['-p', '--tools', '', '--strict-mcp-config', '--no-session-persistence', '--model', model,
  '--system-prompt', 'You answer questions about the documents the user gives you, from those documents only.'], {
  input: prompt, cwd: tmpdir(), encoding: 'utf8', maxBuffer: 1 << 20,
  env: { ...process.env, CLAUDE_CODE_DISABLE_CLAUDE_MDS: '1' },
}).trim();

let failed = false;
for (const model of models) {
  const answer = run(model);
  const missing = Object.entries(NEEDS).filter(([, ways]) => !ways.every(re => re.test(answer))).map(([name]) => name);
  failed ||= missing.length > 0;
  console.log(`## ${model}: ${missing.length ? `FAIL (missing: ${missing.join(', ')})` : 'pass'}\n\n${answer}\n`);
}
process.exitCode = failed ? 1 : 0;
