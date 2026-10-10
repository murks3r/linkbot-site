// @ts-nocheck
/**
 * Local state: saved jobs, audience register and the private Job Agent.
 *
 * Everything lives in this browser's localStorage (with an in-memory fallback
 * when storage is blocked). Nothing is ever sent anywhere — there is no network
 * code in this prototype at all.
 *
 * Log timestamps come from a virtual clock (the fixed prototype clock plus one
 * minute per logged action) so screenshots and the agent demo are reproducible.
 */
import { NOW } from './data.js';
import { matchesSince, parseQuery, describeQuery } from './model.js';

const KEY = 'linkbot.visual-reboot.v1';
const BASELINE_LAST_RUN = Date.UTC(2026, 9, 6, 9, 0, 0); // three days before the prototype clock

const fresh = () => ({
  audience: 'talent',
  saved: [],
  agent: { enabled: false, disclosure: 'anonymous', rules: [], lastRunMs: BASELINE_LAST_RUN, findings: [], log: [] },
});

let memory = null;
function read() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const base = fresh();
    return {
      audience: ['talent', 'developers', 'employers'].includes(parsed.audience) ? parsed.audience : base.audience,
      saved: Array.isArray(parsed.saved) ? parsed.saved.filter((s) => s && typeof s.id === 'string') : [],
      agent: { ...base.agent, ...(parsed.agent || {}), rules: Array.isArray(parsed.agent?.rules) ? parsed.agent.rules : [], findings: Array.isArray(parsed.agent?.findings) ? parsed.agent.findings : [], log: Array.isArray(parsed.agent?.log) ? parsed.agent.log : [] },
    };
  } catch {
    return null;
  }
}
function write(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

let state = read() || fresh();
const listeners = new Set();
let persisted = write(state);

function commit(next) {
  state = next;
  persisted = write(state);
  for (const fn of listeners) fn(state);
}

export const getState = () => state;
export const isPersisted = () => persisted;
export const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/* virtual clock ------------------------------------------------------------ */
export const clockMs = () => NOW + state.agent.log.length * 60000;

function withLog(agent, kind, text) {
  const at = NOW + agent.log.length * 60000;
  return { ...agent, log: [...agent.log, { at, kind, text }] };
}

/* audience ----------------------------------------------------------------- */
export function setAudience(audience) {
  commit({ ...state, audience });
}

/* saved jobs --------------------------------------------------------------- */
export const isSaved = (id) => state.saved.some((s) => s.id === id);
export function toggleSaved(id) {
  const saved = isSaved(id) ? state.saved.filter((s) => s.id !== id) : [...state.saved, { id, at: clockMs() }];
  commit({ ...state, saved });
  return isSaved(id);
}

/* agent -------------------------------------------------------------------- */
export function setAgentEnabled(enabled) {
  commit({
    ...state,
    agent: withLog(
      { ...state.agent, enabled },
      'consent',
      enabled ? 'Agent turned on. It runs on this device and sends nothing anywhere.' : 'Agent turned off. Rules are kept but nothing runs.',
    ),
  });
}

export const DISCLOSURE = {
  anonymous: { label: 'Anonymous', text: 'Employers see nothing about you. Identity stays on this device.' },
  pseudonym: { label: 'Pseudonymous handle', text: 'If you reach out, a throwaway handle is used. Your name is never attached.' },
  named: { label: 'Named, per job', text: 'Your name is shared only for a job you approve, one at a time.' },
};

export function setDisclosure(value) {
  commit({ ...state, agent: withLog({ ...state.agent, disclosure: value }, 'consent', `Disclosure set to “${DISCLOSURE[value].label}”.`) });
}

export const hasRule = (queryString) => state.agent.rules.some((r) => r.query === queryString);
export function addRule(queryString) {
  if (hasRule(queryString)) return false;
  const label = describeQuery(parseQuery(queryString));
  const id = `r${state.agent.rules.length + 1}-${state.agent.log.length}`;
  commit({ ...state, agent: withLog({ ...state.agent, rules: [...state.agent.rules, { id, query: queryString, label, at: clockMs() }] }, 'local', `Rule added: ${label}.`) });
  return true;
}
export function removeRule(id) {
  const rule = state.agent.rules.find((r) => r.id === id);
  commit({
    ...state,
    agent: withLog({ ...state.agent, rules: state.agent.rules.filter((r) => r.id !== id), findings: state.agent.findings.filter((f) => f.ruleId !== id) }, 'local', `Rule removed: ${rule ? rule.label : id}.`),
  });
}

/** Evaluate every rule against the data, on this device. Returns the findings. */
export function runAgent() {
  const since = state.agent.lastRunMs;
  const findings = state.agent.rules.map((r) => ({ ruleId: r.id, label: r.label, jobIds: matchesSince(parseQuery(r.query), since).map((j) => j.id) }));
  const total = new Set(findings.flatMap((f) => f.jobIds)).size;
  commit({
    ...state,
    agent: withLog(
      { ...state.agent, findings, lastRunMs: NOW },
      'local',
      `Ran ${state.agent.rules.length} rule${state.agent.rules.length === 1 ? '' : 's'} locally: ${total} new listing${total === 1 ? '' : 's'}. Nothing was sent.`,
    ),
  });
  return findings;
}

/* data control ------------------------------------------------------------- */
export function exportJson() {
  return JSON.stringify({ exportedFrom: 'Linkbot visual-reboot prototype (synthetic data)', ...state }, null, 2);
}
export function eraseAll() {
  commit(fresh());
}
