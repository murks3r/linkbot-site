/**
 * PREVIEW FIXTURE DATA — synthetic, clearly labelled, never a live catalogue.
 *
 * These records exist so the discovery experience can be built, tested and
 * reviewed before the canonical Universal Supply API is wired up. They are:
 *
 *  - synthetic: every employer, posting and URL is invented;
 *  - labelled: `source.kind === 'fixture'`, `source.name` starts with
 *    "Preview fixture", and every URL is on the reserved `example.com` domain;
 *  - deterministic: dates are expressed as day offsets from the moment of the
 *    query, so freshness states stay meaningful and tests stay reproducible
 *    by injecting a fixed clock.
 *
 * Do NOT import this module anywhere except the fixture adapter. Nothing here
 * may be presented as a live job catalogue.
 */

import type {
  EmploymentType,
  JobOpportunity,
  JobSource,
  OpportunityStatus,
  SalaryPeriod,
  WorkMode,
} from '../types.ts';

/** Canonical occupation vocabulary available to the occupation filter. */
export const OCCUPATIONS: Record<string, string> = {
  'backend-engineer': 'Backend Engineer',
  'frontend-engineer': 'Frontend Engineer',
  'fullstack-engineer': 'Full-stack Engineer',
  'mobile-engineer': 'Mobile Engineer',
  'data-engineer': 'Data Engineer',
  'data-analyst': 'Data Analyst',
  'data-scientist': 'Data Scientist',
  'ml-engineer': 'Machine Learning Engineer',
  'devops-engineer': 'Platform / DevOps Engineer',
  'security-engineer': 'Security Engineer',
  'qa-engineer': 'QA Engineer',
  'engineering-manager': 'Engineering Manager',
  'product-manager': 'Product Manager',
  'product-designer': 'Product Designer',
  'ux-researcher': 'UX Researcher',
  'growth-marketer': 'Growth Marketer',
  'content-strategist': 'Content Strategist',
  'account-executive': 'Account Executive',
  'customer-support': 'Customer Support Specialist',
  'finance-analyst': 'Finance Analyst',
  'recruiter': 'Technical Recruiter',
  'legal-counsel': 'Legal Counsel',
  'operations-manager': 'Operations Manager',
  'clinical-nurse': 'Clinical Nurse',
};

export const COUNTRY_NAMES: Record<string, string> = {
  AT: 'Austria', AU: 'Australia', BE: 'Belgium', BR: 'Brazil', CA: 'Canada',
  CH: 'Switzerland', CZ: 'Czechia', DE: 'Germany', DK: 'Denmark', EE: 'Estonia',
  ES: 'Spain', FI: 'Finland', FR: 'France', GB: 'United Kingdom', IE: 'Ireland',
  IN: 'India', IT: 'Italy', NL: 'Netherlands', PL: 'Poland', PT: 'Portugal',
  RO: 'Romania', SE: 'Sweden', US: 'United States',
};

export type WorkModeFixture = WorkMode;
export type EmploymentTypeFixture = EmploymentType;

interface FixtureSource {
  id: string;
  name: string;
  url: string | null;
  kind: JobSource['kind'];
}

/** Sources are all fixture sources; none of them is a real feed. */
const SOURCES: Record<string, FixtureSource> = {
  atsA: { id: 'fx-ats-a', name: 'Preview fixture — Example ATS A', url: 'https://example.com/sources/ats-a', kind: 'fixture' },
  atsB: { id: 'fx-ats-b', name: 'Preview fixture — Example ATS B', url: 'https://example.com/sources/ats-b', kind: 'fixture' },
  boardA: { id: 'fx-board-a', name: 'Preview fixture — Example Board A', url: 'https://example.com/sources/board-a', kind: 'fixture' },
  direct: { id: 'fx-direct', name: 'Preview fixture — Example employer careers page', url: 'https://example.com/sources/careers', kind: 'fixture' },
};

/** Observed-at timestamp for every fixture record (fixed, UTC). */
export const FIXTURE_RETRIEVED_AT = '2026-10-09T06:00:00.000Z';

type SalarySeed =
  | null
  | {
      min: number;
      max: number | null;
      currency: string;
      period: SalaryPeriod;
      note?: string;
    };

interface Seed {
  id: string;
  /** Overrides the derived canonical id — used for the dedupe test pair. */
  canonicalId?: string;
  title: string;
  occupation: keyof typeof OCCUPATIONS | string;
  employer: string;
  employerUrl?: string | null;
  city: string | null;
  region?: string | null;
  /** ISO-3166-1 alpha-2. `null` means the source named no country. */
  country: string | null;
  workMode: WorkMode;
  employmentType: EmploymentType;
  salary: SalarySeed;
  skills: string[];
  summary: string;
  blurb: string;
  source: keyof typeof SOURCES;
  /** Days before "now" the source says it was published. null = unstated. */
  publishedDaysAgo: number | null;
  modifiedDaysAgo?: number | null;
  /** Days after "now" the posting stops being valid. null = unstated. */
  validInDays?: number | null;
  status?: OpportunityStatus;
  /** false = the source exposes no original application URL. */
  apply?: boolean;
  language?: string;
}

const SEEDS: Seed[] = [
  {
    id: 'opp-0001', title: 'Senior Backend Engineer (Payments)', occupation: 'backend-engineer',
    employer: 'Northwind Talent', employerUrl: 'https://example.com/employers/northwind',
    city: 'Berlin', region: 'Berlin', country: 'DE', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 85000, max: 105000, currency: 'EUR', period: 'year', note: 'plus equity' },
    skills: ['Go', 'PostgreSQL', 'Kafka', 'payments'], summary: 'Own the payments ledger service end to end.',
    blurb: 'Join a six-person platform team maintaining a double-entry ledger. You will design idempotent payment flows, own schema migrations and carry the on-call rotation.', source: 'atsA', publishedDaysAgo: 2, validInDays: 40,
  },
  {
    id: 'opp-0002', title: 'Frontend Engineer, Design Systems', occupation: 'frontend-engineer',
    employer: 'Helio Systems', employerUrl: 'https://example.com/employers/helio',
    city: 'Amsterdam', region: 'North Holland', country: 'NL', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 65000, max: 82000, currency: 'EUR', period: 'year' },
    skills: ['TypeScript', 'React', 'accessibility', 'Storybook'], summary: 'Build and govern the component library used by four product teams.',
    blurb: 'You will own the design-system roadmap, harden accessibility to WCAG 2.2 AA and reduce the surface area of one-off components.', source: 'atsA', publishedDaysAgo: 5, validInDays: 30,
  },
  {
    id: 'opp-0003', title: 'Machine Learning Engineer — Forecasting', occupation: 'ml-engineer',
    employer: 'Arbor Analytics', employerUrl: 'https://example.com/employers/arbor',
    city: null, region: null, country: 'GB', workMode: 'remote', employmentType: 'full_time',
    salary: { min: 78000, max: 96000, currency: 'GBP', period: 'year' },
    skills: ['Python', 'PyTorch', 'time series', 'MLOps'], summary: 'Ship demand-forecasting models to a production planning team.',
    blurb: 'Remote-first across the UK. You will work with planners to define evaluation windows and take models from notebook to batch inference.', source: 'atsB', publishedDaysAgo: 9, validInDays: 21,
  },
  {
    id: 'opp-0004', title: 'Product Designer', occupation: 'product-designer',
    employer: 'Lumen Robotics', employerUrl: 'https://example.com/employers/lumen',
    city: 'Munich', region: 'Bavaria', country: 'DE', workMode: 'onsite', employmentType: 'full_time',
    salary: null, skills: ['Figma', 'prototyping', 'hardware UI'], summary: 'Design operator interfaces for warehouse robotics.',
    blurb: 'The compensation band for this role is not published on the source. You will pair with firmware engineers on safety-critical operator screens.', source: 'direct', publishedDaysAgo: 12, validInDays: null,
  },
  {
    id: 'opp-0005', title: 'Data Engineer', occupation: 'data-engineer',
    employer: 'Tessera Labs', employerUrl: 'https://example.com/employers/tessera',
    city: 'Lisbon', region: 'Lisbon', country: 'PT', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 52000, max: 68000, currency: 'EUR', period: 'year' },
    skills: ['dbt', 'Airflow', 'Snowflake', 'SQL'], summary: 'Own the analytics warehouse and its dbt project.',
    blurb: 'Three days a week in the Lisbon office. You will rebuild nightly pipelines and document lineage for the finance reporting team.', source: 'atsB', publishedDaysAgo: 1, validInDays: 45,
  },
  {
    id: 'opp-0006', title: 'Platform Engineer (Kubernetes)', occupation: 'devops-engineer',
    employer: 'Cobalt Freight', employerUrl: 'https://example.com/employers/cobalt',
    city: 'Rotterdam', region: 'South Holland', country: 'NL', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 70000, max: 90000, currency: 'EUR', period: 'year' },
    skills: ['Kubernetes', 'Terraform', 'AWS', 'observability'], summary: 'Keep a multi-cluster freight-tracking platform up and boring.',
    blurb: 'You will own the cluster upgrade path, cut cloud spend and make deploys reversible. The team carries a shared on-call rota.', source: 'atsA', publishedDaysAgo: 4, validInDays: 26,
  },
  {
    id: 'opp-0007', title: 'Data Analyst (Growth)', occupation: 'data-analyst',
    employer: 'Fauna Digital', employerUrl: 'https://example.com/employers/fauna',
    city: 'Barcelona', region: 'Catalonia', country: 'ES', workMode: 'remote', employmentType: 'contract',
    salary: { min: 320, max: null, currency: 'EUR', period: 'day' },
    skills: ['SQL', 'experimentation', 'Amplitude'], summary: 'Six-month contract analysing acquisition funnels.',
    blurb: 'Day rate stated on the source; renewal is not guaranteed. You will instrument funnels and run readouts with the growth team.', source: 'boardA', publishedDaysAgo: 7, validInDays: 14,
  },
  {
    id: 'opp-0008', title: 'Engineering Manager, Infrastructure', occupation: 'engineering-manager',
    employer: 'Meridian Health', employerUrl: 'https://example.com/employers/meridian',
    city: 'Stockholm', region: 'Stockholm', country: 'SE', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 92000, max: 110000, currency: 'SEK', period: 'month' },
    skills: ['leadership', 'SRE', 'HIPAA', 'hiring'], summary: 'Lead two infrastructure squads serving clinical systems.',
    blurb: 'You will own hiring, the on-call policy and the platform roadmap for a regulated clinical environment.', source: 'atsB', publishedDaysAgo: 15, validInDays: 10,
  },
  {
    id: 'opp-0009', title: 'Customer Support Specialist (EMEA)', occupation: 'customer-support',
    employer: 'Halcyon Travel', employerUrl: 'https://example.com/employers/halcyon',
    city: null, region: null, country: 'IE', workMode: 'remote', employmentType: 'full_time',
    salary: { min: 34000, max: 40000, currency: 'EUR', period: 'year' },
    skills: ['Zendesk', 'troubleshooting', 'written English'], summary: 'First-line support for a travel booking platform.',
    blurb: 'Fully remote within Ireland. You will handle a shared queue, maintain macros and escalate to engineering with reproduction steps.', source: 'direct', publishedDaysAgo: 3, validInDays: 22,
  },
  {
    id: 'opp-0010', title: 'Security Engineer (Application)', occupation: 'security-engineer',
    employer: 'Onyx Security', employerUrl: 'https://example.com/employers/onyx',
    city: 'Tallinn', region: 'Harju', country: 'EE', workMode: 'onsite', employmentType: 'full_time',
    salary: { min: 60000, max: 78000, currency: 'EUR', period: 'year' },
    skills: ['threat modelling', 'SAST', 'OWASP', 'Python'], summary: 'Review product code and run the vulnerability programme.',
    blurb: 'On-site in Tallinn. You will triage dependency reports, run design reviews and keep the disclosure process defensible.', source: 'atsA', publishedDaysAgo: 6, validInDays: 34,
  },
  {
    id: 'opp-0011', title: 'Full-stack Engineer', occupation: 'fullstack-engineer',
    employer: 'Quill Media', employerUrl: 'https://example.com/employers/quill',
    city: 'London', region: 'England', country: 'GB', workMode: 'hybrid', employmentType: 'full_time',
    salary: null, skills: ['Node.js', 'React', 'PostgreSQL', 'editorial'], summary: 'Build publishing tools used by a newsroom.',
    blurb: 'Compensation is not stated on the source. You will ship reader-facing features and the CMS extensions journalists use daily.', source: 'boardA', publishedDaysAgo: 11, validInDays: 18,
  },
  {
    id: 'opp-0012', title: 'Mobile Engineer (Android)', occupation: 'mobile-engineer',
    employer: 'Dovetail Retail', employerUrl: 'https://example.com/employers/dovetail',
    city: 'Warsaw', region: 'Masovia', country: 'PL', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 24000, max: 31000, currency: 'PLN', period: 'month' },
    skills: ['Kotlin', 'Jetpack Compose', 'offline-first'], summary: 'Own the loyalty app used in 900 stores.',
    blurb: 'You will work on offline-first sync, in-store payment flows and the release train for a large consumer install base.', source: 'atsB', publishedDaysAgo: 8, validInDays: 20,
  },
  {
    id: 'opp-0013', title: 'Product Manager, Billing', occupation: 'product-manager',
    employer: 'Verdant Energy', employerUrl: 'https://example.com/employers/verdant',
    city: 'Copenhagen', region: 'Capital Region', country: 'DK', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 62000, max: 74000, currency: 'EUR', period: 'year' },
    skills: ['billing', 'discovery', 'stakeholder management'], summary: 'Own the billing and metering roadmap for utility customers.',
    blurb: 'You will run discovery with operations teams and make the metering-to-invoice path measurable and auditable.', source: 'direct', publishedDaysAgo: 18, validInDays: 6,
  },
  {
    id: 'opp-0014', title: 'UX Researcher', occupation: 'ux-researcher',
    employer: 'Lantern Education', employerUrl: 'https://example.com/employers/lantern',
    city: 'Dublin', region: 'Leinster', country: 'IE', workMode: 'hybrid', employmentType: 'contract',
    salary: { min: 450, max: 520, currency: 'EUR', period: 'day' },
    skills: ['usability testing', 'interviewing', 'synthesis'], summary: 'Nine-month contract running a research programme.',
    blurb: 'You will build a participant panel, run moderated studies and turn findings into shipped changes with the design team.', source: 'boardA', publishedDaysAgo: 21, validInDays: 9,
  },
  {
    id: 'opp-0015', title: 'Technical Recruiter', occupation: 'recruiter',
    employer: 'Kestrel Bank', employerUrl: 'https://example.com/employers/kestrel',
    city: 'Frankfurt', region: 'Hesse', country: 'DE', workMode: 'onsite', employmentType: 'full_time',
    salary: { min: 52000, max: 62000, currency: 'EUR', period: 'year' },
    skills: ['sourcing', 'interview design', 'ATS'], summary: 'Hire engineers for a regulated retail bank.',
    blurb: 'On-site four days a week. You will run structured interviews and keep the candidate record compliant with banking regulation.', source: 'direct', publishedDaysAgo: 14, validInDays: 25,
  },
  {
    id: 'opp-0016', title: 'Finance Analyst', occupation: 'finance-analyst',
    employer: 'Novara Foods', employerUrl: 'https://example.com/employers/novara',
    city: 'Milan', region: 'Lombardy', country: 'IT', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 38000, max: 46000, currency: 'EUR', period: 'year' },
    skills: ['financial modelling', 'Excel', 'Power BI'], summary: 'Support monthly close and margin analysis.',
    blurb: 'You will own the gross-margin model for two product lines and improve the consolidation process.', source: 'atsA', publishedDaysAgo: 10, validInDays: 30,
  },
  {
    id: 'opp-0017', title: 'QA Engineer (Automation)', occupation: 'qa-engineer',
    employer: 'Bracken Legal', employerUrl: 'https://example.com/employers/bracken',
    city: 'Vienna', region: 'Vienna', country: 'AT', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 48000, max: 58000, currency: 'EUR', period: 'year' },
    skills: ['Playwright', 'TypeScript', 'CI'], summary: 'Build the end-to-end test suite for a legal drafting tool.',
    blurb: 'You will replace a manual release checklist with a real, trustworthy automated suite and own flake triage.', source: 'atsB', publishedDaysAgo: 13, validInDays: 17,
  },
  {
    id: 'opp-0018', title: 'Content Strategist', occupation: 'content-strategist',
    employer: 'Quill Media', employerUrl: 'https://example.com/employers/quill',
    city: null, region: null, country: 'GB', workMode: 'remote', employmentType: 'part_time',
    salary: { min: 28000, max: 32000, currency: 'GBP', period: 'year', note: 'pro rata' },
    skills: ['editorial', 'SEO', 'information architecture'], summary: 'Three days a week owning editorial standards.',
    blurb: 'Remote within the UK. You will define tone across two brands and audit a large archive for duplication.', source: 'boardA', publishedDaysAgo: 2, validInDays: 28,
  },
  {
    id: 'opp-0019', title: 'Growth Marketer', occupation: 'growth-marketer',
    employer: 'Fauna Digital', employerUrl: 'https://example.com/employers/fauna',
    city: 'Madrid', region: 'Madrid', country: 'ES', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 42000, max: 55000, currency: 'EUR', period: 'year' },
    skills: ['paid acquisition', 'lifecycle', 'attribution'], summary: 'Own paid and lifecycle channels for a B2B SaaS.',
    blurb: 'You will run the experimentation calendar, own the attribution caveats and report honestly on channel quality.', source: 'direct', publishedDaysAgo: 5, validInDays: 33,
  },
  {
    id: 'opp-0020', title: 'Account Executive, DACH', occupation: 'account-executive',
    employer: 'Ironwood Construction', employerUrl: 'https://example.com/employers/ironwood',
    city: 'Zurich', region: 'Zurich', country: 'CH', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 95000, max: 130000, currency: 'CHF', period: 'year', note: 'on-target earnings' },
    skills: ['enterprise sales', 'German', 'construction tech'], summary: 'Sell project software to mid-size contractors.',
    blurb: 'Quota-carrying role covering Germany, Austria and Switzerland. Fluent German is required by the employer.', source: 'atsA', publishedDaysAgo: 16, validInDays: 12,
  },
  {
    id: 'opp-0021', title: 'Operations Manager', occupation: 'operations-manager',
    employer: 'Cobalt Freight', employerUrl: 'https://example.com/employers/cobalt',
    city: 'Gdańsk', region: 'Pomerania', country: 'PL', workMode: 'onsite', employmentType: 'full_time',
    salary: { min: 20000, max: 26000, currency: 'PLN', period: 'month' },
    skills: ['logistics', 'process design', 'team leadership'], summary: 'Run a cross-dock terminal and its shift leads.',
    blurb: 'On-site role managing a 60-person operation across three shifts, including weekend rotas.', source: 'direct', publishedDaysAgo: 20, validInDays: 15,
  },
  {
    id: 'opp-0022', title: 'Data Scientist', occupation: 'data-scientist',
    employer: 'Arbor Analytics', employerUrl: 'https://example.com/employers/arbor',
    city: 'Edinburgh', region: 'Scotland', country: 'GB', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 58000, max: 72000, currency: 'GBP', period: 'year' },
    skills: ['statistics', 'causal inference', 'Python'], summary: 'Run pricing and elasticity studies.',
    blurb: 'You will design quasi-experiments for pricing changes and write results the commercial team can act on.', source: 'atsB', publishedDaysAgo: 3, validInDays: 27,
  },
  {
    id: 'opp-0023', title: 'Legal Counsel (Commercial)', occupation: 'legal-counsel',
    employer: 'Bracken Legal', employerUrl: 'https://example.com/employers/bracken',
    city: 'Brussels', region: 'Brussels', country: 'BE', workMode: 'hybrid', employmentType: 'full_time',
    salary: null, skills: ['contracts', 'GDPR', 'negotiation'], summary: 'In-house counsel for a professional-services group.',
    blurb: 'Compensation is not stated on the source. Qualified in Belgium or another EU jurisdiction.', source: 'direct', publishedDaysAgo: 24, validInDays: 4,
  },
  {
    id: 'opp-0024', title: 'Clinical Nurse, Night Shift', occupation: 'clinical-nurse',
    employer: 'Meridian Health', employerUrl: 'https://example.com/employers/meridian',
    city: 'Helsinki', region: 'Uusimaa', country: 'FI', workMode: 'onsite', employmentType: 'temporary',
    salary: { min: 3400, max: 3900, currency: 'EUR', period: 'month' },
    skills: ['acute care', 'Finnish', 'night shift'], summary: 'Twelve-month temporary contract on a surgical ward.',
    blurb: 'Fixed-term cover for parental leave. Registration with the Finnish authority is required.', source: 'direct', publishedDaysAgo: 6, validInDays: 20,
  },
  {
    id: 'opp-0025', title: 'Backend Engineer (Rust)', occupation: 'backend-engineer',
    employer: 'Tessera Labs', employerUrl: 'https://example.com/employers/tessera',
    city: null, region: null, country: 'PT', workMode: 'remote', employmentType: 'contract',
    salary: { min: 500, max: 620, currency: 'EUR', period: 'day' },
    skills: ['Rust', 'gRPC', 'performance'], summary: 'Contract owning the hot path of a data service.',
    blurb: 'Remote in Europe, roughly six months. You will profile a latency-sensitive service and cut tail latencies.', source: 'boardA', publishedDaysAgo: 4, validInDays: 16,
  },
  {
    id: 'opp-0026', title: 'Frontend Engineer (Accessibility)', occupation: 'frontend-engineer',
    employer: 'Lantern Education', employerUrl: 'https://example.com/employers/lantern',
    city: 'Dublin', region: 'Leinster', country: 'IE', workMode: 'remote', employmentType: 'full_time',
    salary: { min: 62000, max: 75000, currency: 'EUR', period: 'year' },
    skills: ['accessibility', 'TypeScript', 'WCAG'], summary: 'Make a learning platform usable with assistive technology.',
    blurb: 'You will own the accessibility conformance work, run assistive-technology testing and fix the backlog it produces.', source: 'atsA', publishedDaysAgo: 7, validInDays: 23,
  },
  {
    id: 'opp-0027', title: 'DevOps Engineer', occupation: 'devops-engineer',
    employer: 'Lumen Robotics', employerUrl: 'https://example.com/employers/lumen',
    city: 'Porto', region: 'Porto', country: 'PT', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 48000, max: 60000, currency: 'EUR', period: 'year' },
    skills: ['CI/CD', 'Docker', 'Linux'], summary: 'Build the delivery pipeline for embedded firmware builds.',
    blurb: 'You will make firmware builds reproducible and cut release time from days to hours.', source: 'atsB', publishedDaysAgo: 1, validInDays: 44,
  },
  {
    id: 'opp-0028', title: 'Product Designer (Mobile)', occupation: 'product-designer',
    employer: 'Halcyon Travel', employerUrl: 'https://example.com/employers/halcyon',
    city: 'Bucharest', region: 'Bucharest', country: 'RO', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 30000, max: 38000, currency: 'EUR', period: 'year' },
    skills: ['Figma', 'iOS', 'design systems'], summary: 'Own the booking flow on iOS and Android.',
    blurb: 'You will run the flow end to end, from prototype testing to shipping the final specs with engineering.', source: 'direct', publishedDaysAgo: 9, validInDays: 19,
  },
  {
    id: 'opp-0029', title: 'Data Engineer (Streaming)', occupation: 'data-engineer',
    employer: 'Onyx Security', employerUrl: 'https://example.com/employers/onyx',
    city: null, region: null, country: 'DE', workMode: 'remote', employmentType: 'full_time',
    salary: { min: 72000, max: 88000, currency: 'EUR', period: 'year' },
    skills: ['Flink', 'Kafka', 'Go', 'streaming'], summary: 'Build the real-time detection data plane.',
    blurb: 'Remote in Germany. You will own exactly-once semantics and the schema registry for a detection pipeline.', source: 'atsA', publishedDaysAgo: 12, validInDays: 29,
  },
  {
    id: 'opp-0030', title: 'Engineering Manager, Payments', occupation: 'engineering-manager',
    employer: 'Northwind Talent', employerUrl: 'https://example.com/employers/northwind',
    city: 'Berlin', region: 'Berlin', country: 'DE', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 110000, max: 130000, currency: 'EUR', period: 'year' },
    skills: ['leadership', 'hiring', 'payments'], summary: 'Lead the payments group through a platform migration.',
    blurb: 'You will manage two teams, own the migration plan and keep the ledger correct throughout.', source: 'atsB', publishedDaysAgo: 5, validInDays: 21,
  },
  {
    id: 'opp-0031', title: 'Machine Learning Engineer (NLP)', occupation: 'ml-engineer',
    employer: 'Kestrel Bank', employerUrl: 'https://example.com/employers/kestrel',
    city: 'Frankfurt', region: 'Hesse', country: 'DE', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 80000, max: 95000, currency: 'EUR', period: 'year' },
    skills: ['NLP', 'transformers', 'Python', 'evaluation'], summary: 'Build document-understanding models for compliance review.',
    blurb: 'You will own model evaluation for a regulated use case, including documentation a regulator can inspect.', source: 'direct', publishedDaysAgo: 20, validInDays: 8,
  },
  {
    id: 'opp-0032', title: 'Customer Support Specialist (US)', occupation: 'customer-support',
    employer: 'Dovetail Retail', employerUrl: 'https://example.com/employers/dovetail',
    city: null, region: null, country: 'US', workMode: 'remote', employmentType: 'full_time',
    salary: { min: 48000, max: 56000, currency: 'USD', period: 'year' },
    skills: ['support', 'written English', 'CRM'], summary: 'Support a US customer base across time zones.',
    blurb: 'Remote within the United States, on a rotating schedule that includes one weekend day.', source: 'boardA', publishedDaysAgo: 2, validInDays: 31,
  },
  {
    id: 'opp-0033', title: 'Product Manager, Platform', occupation: 'product-manager',
    employer: 'Helio Systems', employerUrl: 'https://example.com/employers/helio',
    city: 'Amsterdam', region: 'North Holland', country: 'NL', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 78000, max: 92000, currency: 'EUR', period: 'year' },
    skills: ['platform', 'APIs', 'developer experience'], summary: 'Own the public API and developer platform.',
    blurb: 'You will run the API council, and you will publish a versioning and deprecation policy.', source: 'atsA', publishedDaysAgo: 26, validInDays: 5,
  },
  {
    id: 'opp-0034', title: 'Senior Site Reliability Engineer', occupation: 'devops-engineer',
    employer: 'Verdant Energy', employerUrl: 'https://example.com/employers/verdant',
    city: 'Aarhus', region: 'Central Denmark', country: 'DK', workMode: 'remote', employmentType: 'full_time',
    salary: { min: 68000, max: 82000, currency: 'EUR', period: 'year' },
    skills: ['SLOs', 'incident response', 'Go'], summary: 'Own reliability for grid-monitoring services.',
    blurb: 'Remote within CET ±1. You will define SLOs for services with a physical-world consequence and run blameless post-incident review.', source: 'atsB', publishedDaysAgo: 3, validInDays: 25,
  },
  {
    id: 'opp-0035', title: 'Backend Engineer (Python)', occupation: 'backend-engineer',
    employer: 'Novara Foods', employerUrl: 'https://example.com/employers/novara',
    city: 'Lisbon', region: 'Lisbon', country: 'PT', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 45000, max: 58000, currency: 'EUR', period: 'year' },
    skills: ['Python', 'Django', 'PostgreSQL'], summary: 'Build supply-chain integrations.',
    blurb: 'You will integrate supplier ERP systems and make the inbound stock forecast defensible.', source: 'direct', publishedDaysAgo: 8, validInDays: 35,
  },
  {
    id: 'opp-0036', title: 'Mobile Engineer (iOS)', occupation: 'mobile-engineer',
    employer: 'Ironwood Construction', employerUrl: 'https://example.com/employers/ironwood',
    city: 'Vienna', region: 'Vienna', country: 'AT', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 55000, max: 68000, currency: 'EUR', period: 'year' },
    skills: ['Swift', 'SwiftUI', 'site surveys'], summary: 'Build the site-survey app for field engineers.',
    blurb: 'You will work on offline capture, photo pipelines and a ruggedised-device constraint set.', source: 'atsA', publishedDaysAgo: 6, validInDays: 24,
  },
  {
    id: 'opp-0037', title: 'Data Analyst (Operations)', occupation: 'data-analyst',
    employer: 'Cobalt Freight', employerUrl: 'https://example.com/employers/cobalt',
    city: 'Rotterdam', region: 'South Holland', country: 'NL', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 48000, max: 58000, currency: 'EUR', period: 'year' },
    skills: ['SQL', 'Looker', 'operations'], summary: 'Make terminal throughput visible and comparable.',
    blurb: 'You will build the operational reporting layer and be honest about data quality gaps rather than smoothing them over.', source: 'atsB', publishedDaysAgo: 17, validInDays: 11,
  },
  {
    id: 'opp-0038', title: 'Security Analyst (SOC)', occupation: 'security-engineer',
    employer: 'Onyx Security', employerUrl: 'https://example.com/employers/onyx',
    city: null, region: null, country: 'GB', workMode: 'remote', employmentType: 'temporary',
    salary: null, skills: ['SIEM', 'incident triage', 'shift work'], summary: 'Six-month SOC shift cover.',
    blurb: 'The source states neither compensation nor a work mode. Remote within the UK. Shift pattern includes nights.', source: 'boardA', publishedDaysAgo: null, validInDays: null, status: 'unknown',
  },
  {
    id: 'opp-0039', title: 'Frontend Engineer (Legacy MVP)', occupation: 'frontend-engineer',
    employer: 'Quill Media', employerUrl: 'https://example.com/employers/quill',
    city: 'London', region: 'England', country: 'GB', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 55000, max: 65000, currency: 'GBP', period: 'year' },
    skills: ['Angular', 'TypeScript'], summary: 'Maintain an internal legacy tool. Role since withdrawn.',
    blurb: 'This posting was withdrawn by the source after the search index observed it. It is retained so closed-postings behaviour can be tested.', source: 'atsA', publishedDaysAgo: 30, validInDays: null, status: 'withdrawn',
  },
  {
    id: 'opp-0040', title: 'Growth Marketer (Contract)', occupation: 'growth-marketer',
    employer: 'Fauna Digital', employerUrl: 'https://example.com/employers/fauna',
    city: null, region: null, country: 'ES', workMode: 'remote', employmentType: 'contract',
    salary: { min: 400, max: null, currency: 'EUR', period: 'day' },
    skills: ['performance marketing'], summary: 'Contract that has passed its validity date.',
    blurb: 'The source stated a valid-through date that has now passed, so this record is classified as expired rather than withdrawn.', source: 'boardA', publishedDaysAgo: 48, validInDays: -3, status: 'expired',
  },
  {
    id: 'opp-0041', title: 'UX Researcher (closed)', occupation: 'ux-researcher',
    employer: 'Lantern Education', employerUrl: 'https://example.com/employers/lantern',
    city: 'Dublin', region: 'Leinster', country: 'IE', workMode: 'remote', employmentType: 'contract',
    salary: { min: 430, max: 490, currency: 'EUR', period: 'day' },
    skills: ['research ops'], summary: 'Second, older posting for the same research programme.',
    blurb: 'An earlier posting for the same programme, observed and since closed. Kept to exercise the closed-status filter.', source: 'direct', publishedDaysAgo: 60, validInDays: -10, status: 'expired',
  },
  {
    id: 'opp-0042', title: 'Backend Engineer (same posting, second source)',
    canonicalId: 'canon-northwind-payments-backend',
    occupation: 'backend-engineer',
    employer: 'Northwind Talent', employerUrl: 'https://example.com/employers/northwind',
    city: 'Berlin', region: 'Berlin', country: 'DE', workMode: 'hybrid', employmentType: 'full_time',
    salary: { min: 85000, max: 105000, currency: 'EUR', period: 'year' },
    skills: ['Go', 'PostgreSQL', 'Kafka', 'payments'],
    summary: 'The same Berlin payments role as seen through a second feed.',
    blurb: 'This record shares a canonical id with opp-0001: it is the same underlying posting observed through a different feed. It exists to prove that canonical identity, not the local id, is what deduplication would use.',
    source: 'boardA', publishedDaysAgo: 2, validInDays: 40,
  },
  {
    // Deliberately unknown in three dimensions at once: the source stated no
    // work mode, no compensation and no country. Used to exercise the Unknown
    // states and the explicit "not stated" filter options.
    id: 'opp-0043', title: 'Operations Coordinator (arrangements not stated)',
    occupation: 'operations-manager',
    employer: 'Juniper Bio', employerUrl: 'https://example.com/employers/juniper',
    city: null, region: null, country: null, workMode: 'unknown', employmentType: 'full_time',
    salary: null,
    skills: ['scheduling', 'supplier liaison'],
    summary: 'The source published this posting with no work mode, no compensation and no country.',
    blurb: 'Posted with an empty metadata set: the employer published the role without a work mode, without a compensation band and without naming a country. It is kept precisely because that is the case the UI must handle honestly.',
    source: 'boardA', publishedDaysAgo: 4, validInDays: 26,
  },
  {
    id: 'opp-0044', title: 'Maintenance Technician (shifts)',
    occupation: 'operations-manager',
    employer: 'Ironwood Construction', employerUrl: 'https://example.com/employers/ironwood',
    city: 'Lyon', region: 'Auvergne-Rhône-Alpes', country: 'FR', workMode: 'onsite',
    employmentType: 'unknown',
    salary: { min: 32000, max: 38000, currency: 'EUR', period: 'year' },
    skills: ['electrical', 'CMMS', 'shift work'],
    summary: 'The source stated the salary but not the contractual form.',
    blurb: 'Salary band stated, contractual form left blank by the source, so the employment type is an explicit Unknown rather than an assumption.',
    source: 'direct', publishedDaysAgo: 9, validInDays: 18,
  },
];

/** Override the derived canonical id for the duplicate fixture pair. */
const CANONICAL_OVERRIDE: Record<string, string> = { 'opp-0001': 'canon-northwind-payments-backend' };

function isoTimestamp(daysAgo: number, nowMs: number): string {
  return new Date(nowMs - daysAgo * 24 * 60 * 60 * 1000).toISOString();
}

function buildLocation(seed: Seed) {
  const country = seed.country ? COUNTRY_NAMES[seed.country] ?? seed.country : null;
  // A city-state (Berlin, Vienna, Brussels) comes back as both city and region;
  // repeating it makes the raw string read "Berlin, Berlin, Germany".
  const region =
    seed.region && seed.city && seed.region.toLowerCase() === seed.city.toLowerCase()
      ? null
      : seed.region ?? null;
  const parts = [seed.city, region, country].filter((p): p is string => Boolean(p));
  return {
    city: seed.city,
    region,
    country,
    countryCode: seed.country,
    raw: parts.join(', '),
  };
}

/** Materialise the fixture set for a given clock. Deterministic for a fixed now. */
export function buildFixtureOpportunities(nowMs: number): JobOpportunity[] {
  return SEEDS.map((seed) => {
    const source = SOURCES[seed.source];
    const applyUrl = seed.apply === false ? null : `https://example.com/apply/${seed.id}`;
    return {
      id: seed.id,
      canonicalId: seed.canonicalId ?? CANONICAL_OVERRIDE[seed.id] ?? `canon-${seed.id}`,
      title: seed.title,
      occupation: { id: seed.occupation, label: OCCUPATIONS[seed.occupation] ?? seed.occupation },
      employer: {
        id: `emp-${seed.employer.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: seed.employer,
        url: seed.employerUrl ?? null,
      },
      locations: [buildLocation(seed)],
      workMode: seed.workMode,
      employmentType: seed.employmentType,
      salary: seed.salary
        ? {
            stated: true,
            min: seed.salary.min,
            max: seed.salary.max ?? null,
            currency: seed.salary.currency,
            period: seed.salary.period,
            note: seed.salary.note ?? null,
          }
        : { stated: false, min: null, max: null, currency: null, period: 'unknown' as SalaryPeriod, note: null },
      summary: seed.summary,
      description: seed.blurb,
      skills: seed.skills,
      source: {
        id: source.id,
        name: source.name,
        url: source.url,
        kind: source.kind,
        retrievedAt: FIXTURE_RETRIEVED_AT,
      } satisfies JobSource,
      publishedAt: seed.publishedDaysAgo === null ? null : isoTimestamp(seed.publishedDaysAgo, nowMs),
      modifiedAt: seed.modifiedDaysAgo === undefined || seed.modifiedDaysAgo === null
        ? null
        : isoTimestamp(seed.modifiedDaysAgo, nowMs),
      validThrough: seed.validInDays === undefined || seed.validInDays === null
        ? null
        : isoTimestamp(-seed.validInDays, nowMs),
      status: seed.status ?? 'active',
      applyUrl,
      applicationMode: applyUrl ? 'external' : 'unknown',
      language: seed.language ?? 'en',
    };
  });
}

/** Seed count, exported so tests can assert the dataset has not silently shrunk. */
export const FIXTURE_SEED_COUNT = SEEDS.length;
