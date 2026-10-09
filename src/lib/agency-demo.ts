/**
 * Explicitly fictional fixture set for the public agency walkthrough.
 * No names, contact details, CVs, or customer performance data.
 */
export type RequirementStatus = 'met' | 'unknown' | 'unmet';
export type RequirementKind = 'required' | 'preferred';
export interface Requirement {
  key: string;
  label: string;
  kind: RequirementKind;
  interpretation: string;
}
export interface Assessment {
  status: RequirementStatus;
  evidence: string;
}
export interface ExampleCandidate {
  id: string;
  role: string;
  context: string;
  location: string;
  availability: string;
  strengths: string[];
  assessments: Record<string, Assessment>;
}
export interface Mandate {
  id: string;
  label: string;
  brief: string;
  location: string;
  workMode: string;
  level: string;
  pool: string;
  requirements: Requirement[];
  candidates: ExampleCandidate[];
}

export const mandates: Mandate[] = [
  {
    id: 'platform',
    label: 'Senior Platform Engineer',
    brief: 'A Berlin-based product team needs an engineer to own Kubernetes infrastructure, collaborate across services and join an on-call rotation.',
    location: 'Germany / EU',
    workMode: 'Remote within EU',
    level: 'Senior',
    pool: 'Agency-owned infrastructure network',
    requirements: [
      { key: 'k8s', label: 'Production Kubernetes', kind: 'required', interpretation: 'Operated Kubernetes workloads in production' },
      { key: 'eu', label: 'EU work location', kind: 'required', interpretation: 'Can work remotely within the European Union' },
      { key: 'oncall', label: 'On-call readiness', kind: 'required', interpretation: 'Open to participating in an on-call rotation' },
      { key: 'iac', label: 'Infrastructure as code', kind: 'preferred', interpretation: 'Evidence of Terraform or similar IaC tooling' },
    ],
    candidates: [
      {
        id: 'P-014', role: 'Platform engineer · 8 years', context: 'Cloud platforms · SaaS', location: 'Germany', availability: 'Not confirmed',
        strengths: ['Kubernetes operations', 'Terraform delivery', 'Service reliability'],
        assessments: {
          k8s: { status: 'met', evidence: 'Example work history: production cluster ownership' },
          eu: { status: 'met', evidence: 'Example location: Germany' },
          oncall: { status: 'met', evidence: 'Example preference: rotation accepted' },
          iac: { status: 'met', evidence: 'Example projects: Terraform modules' },
        },
      },
      {
        id: 'P-031', role: 'Site reliability engineer · 6 years', context: 'B2B infrastructure', location: 'Netherlands', availability: 'Not confirmed',
        strengths: ['Incident response', 'Kubernetes operations', 'Systems observability'],
        assessments: {
          k8s: { status: 'met', evidence: 'Example experience: multi-cluster operations' },
          eu: { status: 'met', evidence: 'Example location: Netherlands' },
          oncall: { status: 'unknown', evidence: 'Rotation preference not yet stated' },
          iac: { status: 'met', evidence: 'Example projects: infrastructure automation' },
        },
      },
      {
        id: 'P-008', role: 'Cloud engineer · 7 years', context: 'Developer tooling', location: 'United Kingdom', availability: 'Not confirmed',
        strengths: ['Platform tooling', 'Infrastructure automation', 'CI/CD'],
        assessments: {
          k8s: { status: 'met', evidence: 'Example projects: cluster tooling' },
          eu: { status: 'unmet', evidence: 'Example location: UK; EU location requirement not met' },
          oncall: { status: 'met', evidence: 'Example preference: on-call accepted' },
          iac: { status: 'met', evidence: 'Example projects: Terraform pipelines' },
        },
      },
    ],
  },
  {
    id: 'design',
    label: 'Lead Product Designer',
    brief: 'A London fintech needs a hands-on design lead who can guide a product team, improve complex workflows and strengthen its design system.',
    location: 'London, UK',
    workMode: 'Hybrid · 2 days in office',
    level: 'Lead',
    pool: 'Agency-owned product design network',
    requirements: [
      { key: 'lead', label: 'Product leadership', kind: 'required', interpretation: 'Led end-to-end product design work' },
      { key: 'hybrid', label: 'London hybrid', kind: 'required', interpretation: 'Available for two London office days weekly' },
      { key: 'workflow', label: 'Complex workflows', kind: 'required', interpretation: 'Experience simplifying complex user journeys' },
      { key: 'system', label: 'Design systems', kind: 'preferred', interpretation: 'Built or governed a reusable design system' },
    ],
    candidates: [
      {
        id: 'D-012', role: 'Lead product designer · 9 years', context: 'Payments · regulated products', location: 'London', availability: 'Not confirmed',
        strengths: ['Product direction', 'Financial workflows', 'Design systems'],
        assessments: {
          lead: { status: 'met', evidence: 'Example history: led two product streams' },
          hybrid: { status: 'met', evidence: 'Example preference: London hybrid' },
          workflow: { status: 'met', evidence: 'Example portfolio: multi-step financial flows' },
          system: { status: 'met', evidence: 'Example portfolio: design system governance' },
        },
      },
      {
        id: 'D-027', role: 'Senior product designer · 7 years', context: 'Enterprise SaaS', location: 'London', availability: 'Not confirmed',
        strengths: ['Enterprise UX', 'Research synthesis', 'Team mentoring'],
        assessments: {
          lead: { status: 'unknown', evidence: 'Formal lead ownership not confirmed' },
          hybrid: { status: 'met', evidence: 'Example preference: London hybrid' },
          workflow: { status: 'met', evidence: 'Example portfolio: administrative workflows' },
          system: { status: 'met', evidence: 'Example portfolio: component library' },
        },
      },
      {
        id: 'D-004', role: 'Design director · 11 years', context: 'Consumer platforms', location: 'Manchester', availability: 'Not confirmed',
        strengths: ['Team leadership', 'Interaction design', 'Stakeholder alignment'],
        assessments: {
          lead: { status: 'met', evidence: 'Example history: managed a design team' },
          hybrid: { status: 'unmet', evidence: 'Example preference: fully remote only' },
          workflow: { status: 'met', evidence: 'Example portfolio: high-volume consumer flows' },
          system: { status: 'unknown', evidence: 'Design system ownership not documented' },
        },
      },
    ],
  },
  {
    id: 'data',
    label: 'Senior Data Engineer',
    brief: 'A European analytics company needs a senior engineer to own SQL pipelines, orchestration and privacy-aware data delivery.',
    location: 'EMEA',
    workMode: 'Remote · EMEA time zones',
    level: 'Senior',
    pool: 'Agency-owned data engineering network',
    requirements: [
      { key: 'sql', label: 'Advanced SQL', kind: 'required', interpretation: 'Has owned and optimized analytical SQL workloads' },
      { key: 'orchestration', label: 'Pipeline orchestration', kind: 'required', interpretation: 'Production experience with orchestrated data jobs' },
      { key: 'emea', label: 'EMEA overlap', kind: 'required', interpretation: 'Able to work EMEA hours' },
      { key: 'privacy', label: 'Privacy-aware delivery', kind: 'preferred', interpretation: 'Applied access controls or data minimization' },
    ],
    candidates: [
      {
        id: 'E-019', role: 'Data engineer · 8 years', context: 'Analytics infrastructure', location: 'Portugal', availability: 'Not confirmed',
        strengths: ['SQL optimization', 'Airflow', 'Data access controls'],
        assessments: {
          sql: { status: 'met', evidence: 'Example history: query optimization at scale' },
          orchestration: { status: 'met', evidence: 'Example work: production Airflow pipelines' },
          emea: { status: 'met', evidence: 'Example preference: EMEA schedule' },
          privacy: { status: 'met', evidence: 'Example work: restricted data access layers' },
        },
      },
      {
        id: 'E-022', role: 'Analytics engineer · 6 years', context: 'B2B data products', location: 'Spain', availability: 'Not confirmed',
        strengths: ['dbt models', 'SQL transformations', 'Quality monitoring'],
        assessments: {
          sql: { status: 'met', evidence: 'Example history: analytics SQL ownership' },
          orchestration: { status: 'unknown', evidence: 'Operational scheduler ownership unclear' },
          emea: { status: 'met', evidence: 'Example preference: EMEA schedule' },
          privacy: { status: 'met', evidence: 'Example work: role-based access controls' },
        },
      },
      {
        id: 'E-006', role: 'Data platform engineer · 7 years', context: 'Distributed processing', location: 'Canada', availability: 'Not confirmed',
        strengths: ['Streaming pipelines', 'Distributed processing', 'SQL'],
        assessments: {
          sql: { status: 'met', evidence: 'Example work: warehouse query tuning' },
          orchestration: { status: 'met', evidence: 'Example work: scheduled processing' },
          emea: { status: 'unmet', evidence: 'Example preference: North America hours only' },
          privacy: { status: 'unknown', evidence: 'Privacy controls not documented' },
        },
      },
    ],
  },
  {
    id: 'security',
    label: 'Staff Security Engineer',
    brief: 'A Dublin fintech needs a staff engineer to own application security review, threat modelling and incident readiness for regulated payment systems.',
    location: 'Dublin, Ireland',
    workMode: 'Hybrid · 3 days in office',
    level: 'Staff',
    pool: 'Agency-owned security network (example)',
    requirements: [
      { key: 'appsec', label: 'Application security ownership', kind: 'required', interpretation: 'Owned application security review for a production system' },
      { key: 'dublin', label: 'Dublin hybrid', kind: 'required', interpretation: 'Available for three Dublin office days weekly' },
      { key: 'regulated', label: 'Regulated framework', kind: 'required', interpretation: 'Worked under a named regulated security framework' },
      { key: 'threat', label: 'Threat modelling', kind: 'preferred', interpretation: 'Ran threat modelling with engineering teams' },
    ],
    candidates: [
      {
        id: 'S-002', role: 'Security engineer · 9 years', context: 'Payments infrastructure', location: 'Portugal', availability: 'Not confirmed',
        strengths: ['Application security', 'Threat modelling', 'Secure SDLC'],
        assessments: {
          appsec: { status: 'met', evidence: 'Example work history: owned application security review' },
          dublin: { status: 'unmet', evidence: 'Example preference: remote only, based outside Ireland' },
          regulated: { status: 'met', evidence: 'Example work: payment platform security reviews' },
          threat: { status: 'met', evidence: 'Example practice: threat modelling sessions' },
        },
      },
      {
        id: 'S-011', role: 'Security architect · 12 years', context: 'Enterprise platforms', location: 'Ireland', availability: 'Not confirmed',
        strengths: ['Security architecture', 'Incident readiness', 'Risk assessment'],
        assessments: {
          appsec: { status: 'unknown', evidence: 'Direct application security ownership not documented' },
          dublin: { status: 'met', evidence: 'Example location: Ireland' },
          regulated: { status: 'unmet', evidence: 'Example history: no regulated framework named' },
          threat: { status: 'met', evidence: 'Example practice: architecture risk reviews' },
        },
      },
    ],
  },
];

export interface ExcludedCandidate {
  candidate: ExampleCandidate;
  reasons: { label: string; detail: string }[];
}

export interface PoolSummary {
  /** Hard requirements met, with no outstanding verification. */
  ready: ExampleCandidate[];
  /** Hard requirements met, but at least one required criterion is still unverified. */
  needsVerification: ExampleCandidate[];
  /** At least one stated hard requirement is not met; these are never silently promoted. */
  excluded: ExcludedCandidate[];
  eligible: number;
}

/** Required criteria a candidate demonstrably does not meet. */
export function unmetRequirements(mandate: Mandate, candidate: ExampleCandidate) {
  return mandate.requirements
    .filter((r) => r.kind === 'required')
    .filter((r) => candidate.assessments[r.key]?.status === 'unmet' || !candidate.assessments[r.key])
    .map((r) => ({ label: r.label, detail: candidate.assessments[r.key]?.evidence ?? 'No evidence supplied' }));
}

/** Required criteria with no evidence either way. Unknown stays unknown. */
export function unknownRequirements(mandate: Mandate, candidate: ExampleCandidate) {
  return mandate.requirements
    .filter((r) => r.kind === 'required')
    .filter((r) => candidate.assessments[r.key]?.status === 'unknown')
    .map((r) => ({ label: r.label, detail: candidate.assessments[r.key]?.evidence ?? 'No evidence supplied' }));
}

/**
 * Groups a set of fictional candidates the way a recruiter would review them.
 * Failures, unknown evidence and preferences are never merged into one score.
 */
export function summariseCandidates(mandate: Mandate, candidates: ExampleCandidate[]): PoolSummary {
  const ready: ExampleCandidate[] = [];
  const needsVerification: ExampleCandidate[] = [];
  const excluded: ExcludedCandidate[] = [];
  for (const candidate of candidates) {
    const fit = evaluateCandidate(mandate, candidate);
    if (fit.failed > 0) excluded.push({ candidate, reasons: unmetRequirements(mandate, candidate) });
    else if (fit.unresolved > 0) needsVerification.push(candidate);
    else ready.push(candidate);
  }
  return { ready, needsVerification, excluded, eligible: ready.length + needsVerification.length };
}

export function summarisePool(mandate: Mandate): PoolSummary {
  return summariseCandidates(mandate, rankCandidates(mandate));
}

export function evaluateCandidate(mandate: Mandate, candidate: ExampleCandidate) {
  const required = mandate.requirements.filter((r) => r.kind === 'required');
  const preferred = mandate.requirements.filter((r) => r.kind === 'preferred');
  const failed = required.filter((r) => candidate.assessments[r.key]?.status !== 'met' && candidate.assessments[r.key]?.status !== 'unknown').length;
  const unresolved = required.filter((r) => candidate.assessments[r.key]?.status === 'unknown' || !candidate.assessments[r.key]).length;
  const preferredMet = preferred.filter((r) => candidate.assessments[r.key]?.status === 'met').length;
  return {
    failed, unresolved, preferredMet,
    classification: failed > 0 ? 'Does not meet requirement' : unresolved > 0 ? 'Needs verification' : 'Required criteria met',
    shortListable: failed === 0,
  };
}

export function rankCandidates(mandate: Mandate): ExampleCandidate[] {
  return [...mandate.candidates].sort((a, b) => {
    const aFit = evaluateCandidate(mandate, a);
    const bFit = evaluateCandidate(mandate, b);
    return aFit.failed - bFit.failed ||
      aFit.unresolved - bFit.unresolved ||
      bFit.preferredMet - aFit.preferredMet ||
      a.id.localeCompare(b.id);
  });
}
