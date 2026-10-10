// @ts-nocheck
/**
 * SYNTHETIC DATA — every employer, posting, person and URL below is invented.
 *
 * Nothing here is a live catalogue. Employers are fictional, apply links point
 * at the reserved example.com domain, and "now" is a fixed prototype clock so
 * that Newest, Stale and the agent's findings are reproducible.
 *
 * Contract notes (same spirit as the PR #12 domain model):
 *   - an unknown value is `null`, never a sentinel, a zero or an empty string
 *   - provenance is mandatory unless the source itself is unknown (null)
 *   - dates are expressed as day offsets from the prototype clock
 */

/** The prototype clock. 9 Oct 2026, 09:00 UTC. */
export const NOW = Date.UTC(2026, 9, 9, 9, 0, 0);
export const DAY = 86400000;

export const SOURCES = {
  pinewood: { id: 'pinewood', name: 'Pinewood ATS', kind: 'ats', kindLabel: 'Applicant system', cadence: 'polled every 24 h', url: 'https://example.com/sources/pinewood' },
  careers: { id: 'careers', name: 'Employer careers page', kind: 'employer_site', kindLabel: 'Employer’s own site', cadence: 'read directly from the employer', url: 'https://example.com/sources/careers' },
  tallyboard: { id: 'tallyboard', name: 'Tallyboard', kind: 'job_board', kindLabel: 'Job board', cadence: 'polled every 48 h', url: 'https://example.com/sources/tallyboard' },
  dovetail: { id: 'dovetail', name: 'Dovetail Feed', kind: 'aggregator', kindLabel: 'Aggregator', cadence: 'polled every 72 h', url: 'https://example.com/sources/dovetail' },
};

export const OCCUPATIONS = {
  backend: {
    label: 'Backend Engineer',
    about: 'You will design, build and run the services behind a product that people use every day, from the first sketch to the 3 a.m. alert.',
    do: ['Own services end to end: design, review, deploy and operate', 'Shape data models and APIs that other teams build on', 'Make reliability measurable and then improve it'],
    ask: ['Several years of production backend work in a typed language', 'Comfort with relational databases and distributed failure modes', 'A habit of writing things down so others can follow'],
  },
  frontend: {
    label: 'Frontend Engineer',
    about: 'You will build the interfaces people actually touch, and care as much about the hundredth state of a component as the first.',
    do: ['Build accessible, fast interfaces in TypeScript', 'Turn design intent into reusable, documented components', 'Measure real-user performance and act on it'],
    ask: ['Strong HTML, CSS and TypeScript fundamentals', 'Experience shipping accessible UI to production', 'Taste, and the patience to defend it with evidence'],
  },
  fullstack: {
    label: 'Full-stack Engineer',
    about: 'You will move across the whole product, from the database to the pixel, and keep the seams between them honest.',
    do: ['Ship features across the stack in small, reviewable steps', 'Pair with design and product before code is written', 'Keep CI green and the deploy boring'],
    ask: ['Broad experience across web frontend and backend', 'Evidence of owning something from idea to production', 'Clear written communication'],
  },
  mobile: {
    label: 'Mobile Engineer',
    about: 'You will build and maintain a native app used daily, where small details like startup time and offline behaviour decide whether it feels trustworthy.',
    do: ['Build native features with the design team', 'Own release quality, crash rates and startup time', 'Improve the shared architecture as the app grows'],
    ask: ['Production experience on iOS or Android', 'Familiarity with modern concurrency and testing patterns', 'Care for performance on real devices'],
  },
  'data-eng': {
    label: 'Data Engineer',
    about: 'You will build the pipelines and models that make company data dependable enough to decide with.',
    do: ['Design and maintain batch and streaming pipelines', 'Model data so analysts can answer questions without a ticket', 'Add tests and lineage so surprises are caught early'],
    ask: ['Strong SQL and a scripting language', 'Experience with a modern orchestration and transformation stack', 'Respect for data quality over data volume'],
  },
  'data-analyst': {
    label: 'Data Analyst',
    about: 'You will turn questions into evidence, and evidence into decisions that people in other teams can follow.',
    do: ['Answer business questions with clear, reproducible analysis', 'Build and maintain dashboards people actually open', 'Challenge metrics that do not measure what they claim'],
    ask: ['Fluent SQL and a statistics foundation', 'Experience communicating findings to non-specialists', 'Curiosity about how the numbers were produced'],
  },
  'data-scientist': {
    label: 'Data Scientist',
    about: 'You will apply statistics and modelling to problems where being right matters more than being clever.',
    do: ['Frame ambiguous problems as testable hypotheses', 'Build, validate and monitor models in production', 'Explain uncertainty to decision makers'],
    ask: ['A strong statistics and experimentation background', 'Python and the usual scientific stack', 'Experience taking a model past the notebook'],
  },
  ml: {
    label: 'Machine Learning Engineer',
    about: 'You will take models from research into systems that serve real traffic, and keep them honest once they are there.',
    do: ['Build training and serving pipelines', 'Evaluate models offline and online', 'Reduce latency, cost and surprise'],
    ask: ['Production experience with ML systems', 'Solid Python and software engineering habits', 'Judgement about when not to use a model'],
  },
  devops: {
    label: 'Platform / DevOps Engineer',
    about: 'You will build the paved road other engineers drive on: deployment, observability and the infrastructure underneath.',
    do: ['Run and improve the deployment platform', 'Define and defend service-level objectives', 'Automate away repeated toil'],
    ask: ['Experience operating production infrastructure', 'Infrastructure as code and a scripting language', 'Calm in an incident'],
  },
  security: {
    label: 'Security Engineer',
    about: 'You will find the problems before someone else does, and make the secure path the easy one.',
    do: ['Review designs and code for security risk', 'Build detection and response tooling', 'Help teams fix, not just find'],
    ask: ['Applied security experience in cloud environments', 'Ability to write code, not only reports', 'Good judgement about risk'],
  },
  qa: {
    label: 'QA Engineer',
    about: 'You will make quality visible: what is tested, what is not, and what that means for shipping.',
    do: ['Design and automate end-to-end tests', 'Triage failures and fix flaky tests at the root', 'Partner with engineers on testable design'],
    ask: ['Experience with browser or API test automation', 'An eye for edge cases', 'Clear, calm bug reports'],
  },
  'eng-manager': {
    label: 'Engineering Manager',
    about: 'You will lead a team of engineers, protect their focus and take responsibility for what they ship together.',
    do: ['Grow engineers through honest, regular feedback', 'Plan and deliver with product and design', 'Hire carefully and onboard well'],
    ask: ['Prior experience leading an engineering team', 'Technical credibility with your team', 'A record of retaining good people'],
  },
  'product-manager': {
    label: 'Product Manager',
    about: 'You will decide what is worth building next, and be able to explain why with evidence rather than volume.',
    do: ['Define problems and success measures before solutions', 'Work daily with engineers and designers', 'Say no, kindly and with reasons'],
    ask: ['Experience shipping a product to real users', 'Comfort with quantitative and qualitative evidence', 'Clear writing'],
  },
  'product-designer': {
    label: 'Product Designer',
    about: 'You will design products end to end, from the problem framing to the final interaction, and see them through to production.',
    do: ['Lead design from research to shipped interface', 'Contribute to and use a shared design system', 'Prototype to test ideas cheaply'],
    ask: ['A portfolio that shows decisions, not just screens', 'Strong interaction and typographic craft', 'Experience collaborating closely with engineers'],
  },
  'ux-researcher': {
    label: 'UX Researcher',
    about: 'You will make sure the team understands the people it builds for, using the right method for the question.',
    do: ['Plan and run qualitative and quantitative studies', 'Turn findings into decisions, not decks', 'Build research habits across the team'],
    ask: ['Mixed-methods research experience', 'Rigour about sampling and bias', 'Ability to influence without authority'],
  },
  growth: {
    label: 'Growth Marketer',
    about: 'You will find the channels and messages that bring in the right people, and measure what is actually working.',
    do: ['Plan and run acquisition and lifecycle experiments', 'Own reporting you would trust yourself', 'Work with product on onboarding'],
    ask: ['Experience with performance and lifecycle channels', 'Analytical habits', 'Honest attribution'],
  },
  content: {
    label: 'Content Strategist',
    about: 'You will decide what the organisation says, to whom, and in what voice, and make that easy to keep up.',
    do: ['Plan and edit content across channels', 'Maintain voice and style guidance', 'Collaborate with experts to explain complex topics'],
    ask: ['A strong editorial portfolio', 'Search and analytics literacy', 'An ear for plain language'],
  },
  'account-exec': {
    label: 'Account Executive',
    about: 'You will own a pipeline of mid-sized customers, from first conversation to signed contract.',
    do: ['Run discovery and demos', 'Negotiate and close new business', 'Hand over cleanly to customer success'],
    ask: ['Proven B2B software sales experience', 'Discipline with pipeline hygiene', 'Straightforward, trustworthy communication'],
  },
  support: {
    label: 'Customer Support Specialist',
    about: 'You will be the person customers meet when something is not working, and the person who makes sure the product team hears about it.',
    do: ['Resolve customer issues with care and speed', 'Document answers so they scale', 'Escalate patterns, not just tickets'],
    ask: ['Excellent written communication', 'Patience and curiosity', 'Comfort with support tooling'],
  },
  'finance-analyst': {
    label: 'Finance Analyst',
    about: 'You will help the business plan, track and explain its numbers, month after month.',
    do: ['Maintain forecasts and budget models', 'Prepare monthly reporting and variance analysis', 'Support planning with other teams'],
    ask: ['Experience in FP&A or similar', 'Advanced spreadsheet and SQL skills', 'Care about accuracy'],
  },
  recruiter: {
    label: 'Technical Recruiter',
    about: 'You will help the company hire people it will be glad to have worked with, and help candidates make a considered decision.',
    do: ['Source and talk to candidates for technical roles', 'Coordinate interviews and feedback', 'Keep candidates informed throughout'],
    ask: ['Experience recruiting engineers or similar roles', 'Respect for candidates’ time', 'Good data hygiene in the applicant system'],
  },
  legal: {
    label: 'Legal Counsel',
    about: 'You will advise the business on contracts and compliance in clear, practical terms.',
    do: ['Draft and negotiate commercial agreements', 'Advise on data-protection questions', 'Build templates that teams can use safely'],
    ask: ['Qualified and experienced in commercial law', 'Practical GDPR knowledge', 'A plain-spoken style'],
  },
  'ops-manager': {
    label: 'Operations Manager',
    about: 'You will keep the day-to-day running: people, suppliers, schedules and the unglamorous details that decide whether the week goes well.',
    do: ['Coordinate schedules, suppliers and handovers', 'Improve processes with the people who use them', 'Report honestly on what is slipping'],
    ask: ['Operations experience in a fast-moving setting', 'Organisation and follow-through', 'Calm under pressure'],
  },
  nurse: {
    label: 'Registered Nurse',
    about: 'You will provide safe, compassionate care and work as part of a multidisciplinary team.',
    do: ['Assess, plan and deliver patient care', 'Maintain accurate records and handovers', 'Support colleagues and students'],
    ask: ['Current professional registration', 'Relevant clinical experience', 'Commitment to patient safety'],
  },
};

const EMPLOYER_BLURBS = {
  'Halden Pay': 'builds payment infrastructure for mid-sized retailers across Europe.',
  'Kestrel Cloud': 'runs a developer-focused cloud platform used by small and mid-sized software teams.',
  'Lumen & Lode': 'is a design studio that builds brands and products for cultural institutions.',
  'Stonecrop Analytics': 'helps public-sector bodies understand their own data.',
  'Tessellate Labs': 'researches search and ranking systems for specialist marketplaces.',
  'Fennel & Rook': 'makes planning software for independent restaurants.',
  'Alder Street Clinics': 'operates a network of community health clinics.',
  'Greenmile Grocers': 'is a regional grocery chain with a growing online business.',
  'Sable Systems': 'sells operations software to logistics and field-service businesses.',
  'Wren Mobility': 'builds the app behind a city-scale bike and scooter network.',
  'Ironbark Security': 'provides managed detection and response to mid-sized organisations.',
  'Pipistrelle Games': 'is an independent studio making cooperative games.',
  Paperkite: 'makes tools for small teams to plan and publish together.',
  'Marrow Health': 'builds software for clinics to coordinate patient care.',
  'Quillfeather Media': 'publishes independent journalism and long-form audio.',
  'Northmoor Credit': 'is a regional credit union modernising its systems.',
  'Harrow & Finch': 'is a commercial law practice advising growing companies.',
  'Cobalt Orchard': 'is a recruitment agency specialising in technology hiring.',
  'Tidewater Freight': 'moves containers and parcels through northern European ports.',
  'Loom & Lantern': 'develops collaboration software for distributed teams.',
  'Brightwater Energy': 'supplies renewable energy to homes and small businesses.',
  'Oakline Logistics': 'runs last-mile delivery for independent retailers.',
  'Vantage Fieldworks': 'builds mapping tools for surveyors and field crews.',
  'Tern Aerospace': 'develops lightweight composite components for light aircraft.',
  'Ember Foundry': 'is a product studio designing tools for small manufacturers.',
  'Saltmarsh District Council': 'provides local public services to around 90,000 residents.',
  'Corvid Robotics': 'builds inspection robots for industrial sites.',
  'Meridian Mills': 'is a regional flour and baking-ingredients producer.',
};

/**
 * One compact row per posting.
 * [id, title, occupation, employer, city, cc, mode, type, pay, postedDaysAgo,
 *  validInDays, skills, source, observedDaysAgo[], extra]
 * pay: { min, max, cur, per, note? } | null.  extra: { loc, url, apply, status, closedDaysAgo, lang, region }
 */
const ROWS = [
  ['j01', 'Senior Backend Engineer, Payments', 'backend', 'Halden Pay', 'Berlin', 'DE', 'hybrid', 'full_time', { min: 85000, max: 105000, cur: 'EUR', per: 'year', note: 'plus equity' }, 2, 24, ['Go', 'PostgreSQL', 'Kafka'], 'pinewood', [0, 1, 2]],
  ['j02', 'Staff Platform Engineer', 'devops', 'Kestrel Cloud', 'Amsterdam', 'NL', 'remote', 'full_time', { min: 115000, max: 140000, cur: 'EUR', per: 'year' }, 1, null, ['Kubernetes', 'Terraform', 'Observability'], 'careers', [0, 1]],
  ['j03', 'Frontend Engineer, Design Systems', 'frontend', 'Lumen & Lode', 'Lisbon', 'PT', 'hybrid', 'full_time', { min: 52000, max: 68000, cur: 'EUR', per: 'year' }, 3, 30, ['TypeScript', 'Web components', 'Accessibility'], 'tallyboard', [1, 3]],
  ['j04', 'Data Engineer', 'data-eng', 'Stonecrop Analytics', 'Porto', 'PT', 'hybrid', 'full_time', { min: 48000, max: 60000, cur: 'EUR', per: 'year' }, 1, null, ['dbt', 'Airflow', 'SQL'], 'pinewood', [0, 1]],
  ['j05', 'Machine Learning Engineer, Search', 'ml', 'Tessellate Labs', 'London', 'GB', 'hybrid', 'full_time', { min: 95000, max: 120000, cur: 'GBP', per: 'year' }, 5, 20, ['Python', 'PyTorch', 'Ranking'], 'pinewood', [2, 5]],
  ['j06', 'Product Designer', 'product-designer', 'Fennel & Rook', 'Dublin', 'IE', 'remote', 'full_time', null, 4, null, ['Figma', 'Prototyping', 'Research'], 'tallyboard', [3, 4]],
  ['j07', 'Registered Nurse, Night Shift', 'nurse', 'Alder Street Clinics', 'Manchester', 'GB', 'onsite', 'part_time', { min: 19, max: 23, cur: 'GBP', per: 'hour' }, 6, 10, ['Acute care', 'Patient safety'], 'careers', [5, 6]],
  ['j08', 'Customer Support Specialist (German)', 'support', 'Greenmile Grocers', 'Hamburg', 'DE', 'hybrid', 'full_time', { min: 38000, max: 44000, cur: 'EUR', per: 'year' }, 2, 14, ['German', 'Zendesk', 'Escalation'], 'tallyboard', [1, 2], { lang: 'de' }],
  ['j09', 'Account Executive, Mid-Market', 'account-exec', 'Sable Systems', 'New York', 'US', 'hybrid', 'full_time', { min: 90000, max: 120000, cur: 'USD', per: 'year', note: 'base; OTE $180–220k' }, 7, 21, ['SaaS', 'Outbound', 'Negotiation'], 'dovetail', [3, 7]],
  ['j10', 'Engineering Manager, Mobile', 'eng-manager', 'Wren Mobility', 'Stockholm', 'SE', 'hybrid', 'full_time', { min: 80000, max: 95000, cur: 'SEK', per: 'month' }, 9, 12, ['Leadership', 'iOS', 'Android'], 'pinewood', [8, 9]],
  ['j11', 'Security Engineer', 'security', 'Ironbark Security', 'Warsaw', 'PL', 'remote', 'full_time', { min: 24000, max: 32000, cur: 'PLN', per: 'month' }, 3, 28, ['AppSec', 'Threat modelling', 'Cloud'], 'careers', [0, 3]],
  ['j12', 'QA Engineer', 'qa', 'Pipistrelle Games', 'Tallinn', 'EE', 'hybrid', 'full_time', { min: 3200, max: 4100, cur: 'EUR', per: 'month' }, 11, null, ['Test automation', 'Playwright'], 'tallyboard', [10, 11]],
  ['j13', 'Product Manager, Growth', 'product-manager', 'Paperkite', 'London', 'GB', 'hybrid', 'full_time', { min: 80000, max: 100000, cur: 'GBP', per: 'year' }, 2, 25, ['Experimentation', 'Analytics'], 'pinewood', [1, 2]],
  ['j14', 'UX Researcher', 'ux-researcher', 'Marrow Health', 'Zurich', 'CH', 'hybrid', 'full_time', { min: 105000, max: 125000, cur: 'CHF', per: 'year' }, 6, 17, ['Interviews', 'Synthesis'], 'careers', [4, 6]],
  ['j15', 'Growth Marketer', 'growth', 'Greenmile Grocers', 'Madrid', 'ES', 'hybrid', 'full_time', null, 8, null, ['SEO', 'CRM', 'Paid media'], 'dovetail', [4, 8]],
  ['j16', 'Content Strategist', 'content', 'Quillfeather Media', 'London', 'GB', 'remote', 'part_time', { min: 28000, max: 34000, cur: 'GBP', per: 'year', note: 'pro rata' }, 4, 9, ['Editorial', 'SEO'], 'tallyboard', [3, 4]],
  ['j17', 'Finance Analyst', 'finance-analyst', 'Northmoor Credit', 'Dublin', 'IE', 'hybrid', 'full_time', { min: 55000, max: 66000, cur: 'EUR', per: 'year' }, 12, 6, ['FP&A', 'Excel', 'SQL'], 'dovetail', [11, 12]],
  ['j18', 'Legal Counsel, Commercial', 'legal', 'Harrow & Finch', 'Munich', 'DE', 'onsite', 'full_time', { min: 90000, max: 120000, cur: 'EUR', per: 'year' }, 3, 30, ['Contracts', 'GDPR'], 'careers', [2, 3]],
  ['j19', 'Technical Recruiter', 'recruiter', 'Cobalt Orchard', null, null, 'remote', 'contract', { min: 400, max: 480, cur: 'GBP', per: 'day' }, 5, 14, ['Sourcing', 'Engineering hiring'], 'tallyboard', [4, 5], { apply: false }],
  ['j20', 'Operations Manager', 'ops-manager', 'Tidewater Freight', 'Rotterdam', 'NL', 'onsite', 'full_time', null, 2, 20, ['Logistics', 'Lean'], 'pinewood', [0, 2]],
  ['j21', 'Full-stack Engineer', 'fullstack', 'Loom & Lantern', 'Vienna', 'AT', 'remote', 'full_time', { min: 62000, max: 78000, cur: 'EUR', per: 'year' }, 1, null, ['TypeScript', 'Node', 'React'], 'pinewood', [0, 1]],
  ['j22', 'Mobile Engineer (iOS)', 'mobile', 'Wren Mobility', 'Gothenburg', 'SE', 'hybrid', 'full_time', { min: 62000, max: 75000, cur: 'SEK', per: 'month' }, 6, 22, ['Swift', 'SwiftUI'], 'pinewood', [2, 6]],
  ['j23', 'Data Analyst', 'data-analyst', 'Brightwater Energy', 'Copenhagen', 'DK', 'hybrid', 'full_time', { min: 48000, max: 58000, cur: 'DKK', per: 'month' }, 7, 13, ['SQL', 'Looker', 'Statistics'], 'dovetail', [6, 7]],
  ['j24', 'Data Scientist, Pricing', 'data-scientist', 'Oakline Logistics', 'Barcelona', 'ES', 'hybrid', 'full_time', { min: 58000, max: 74000, cur: 'EUR', per: 'year' }, 4, 21, ['Python', 'Causal inference'], 'tallyboard', [3, 4]],
  ['j25', 'Backend Engineer (Java)', 'backend', 'Northmoor Credit', 'Frankfurt', 'DE', 'onsite', 'full_time', { min: 70000, max: 88000, cur: 'EUR', per: 'year' }, 10, 10, ['Java', 'Spring', 'Oracle'], 'careers', [9, 10]],
  ['j26', 'Frontend Engineer, Mapping', 'frontend', 'Vantage Fieldworks', 'Toronto', 'CA', 'remote', 'full_time', { min: 100000, max: 125000, cur: 'CAD', per: 'year' }, 3, 19, ['TypeScript', 'WebGL'], 'pinewood', [1, 3]],
  ['j27', 'DevOps Engineer', 'devops', 'Tern Aerospace', 'Bristol', 'GB', 'hybrid', 'full_time', { min: 62000, max: 78000, cur: 'GBP', per: 'year' }, 5, 16, ['CI/CD', 'AWS', 'Python'], 'tallyboard', [4, 5]],
  ['j28', 'Senior Product Designer', 'product-designer', 'Ember Foundry', 'Berlin', 'DE', 'hybrid', 'full_time', { min: 70000, max: 88000, cur: 'EUR', per: 'year' }, 1, 28, ['Design systems', 'Prototyping'], 'pinewood', [0, 1]],
  ['j29', 'Registered Nurse, Community', 'nurse', 'Saltmarsh District Council', 'Leeds', 'GB', 'hybrid', 'full_time', { min: 33000, max: 38000, cur: 'GBP', per: 'year' }, 9, 8, ['Community care'], 'dovetail', [8, 9]],
  ['j30', 'Customer Success Manager', 'support', 'Kestrel Cloud', 'Dublin', 'IE', 'hybrid', 'full_time', { min: 55000, max: 68000, cur: 'EUR', per: 'year' }, 2, 20, ['Onboarding', 'SaaS'], 'careers', [1, 2]],
  ['j31', 'Backend Engineer, Ledger', 'backend', 'Halden Pay', 'Lisbon', 'PT', 'remote', 'full_time', { min: 70000, max: 92000, cur: 'EUR', per: 'year' }, 1, null, ['Rust', 'PostgreSQL'], 'pinewood', [0, 1]],
  ['j32', 'Analytics Engineer', 'data-eng', 'Stonecrop Analytics', null, null, 'remote', 'full_time', { min: 60000, max: 76000, cur: 'EUR', per: 'year' }, 3, 25, ['dbt', 'SQL', 'Python'], 'careers', [2, 3], { loc: 'Europe (country not stated)' }],
  ['j33', 'Engineering Manager, Platform', 'eng-manager', 'Kestrel Cloud', 'London', 'GB', 'hybrid', 'full_time', { min: 120000, max: 145000, cur: 'GBP', per: 'year' }, 2, 25, ['Platform', 'Leadership'], 'careers', [0, 2]],
  ['j34', 'Product Manager, Payments', 'product-manager', 'Halden Pay', 'Amsterdam', 'NL', 'hybrid', 'full_time', { min: 85000, max: 105000, cur: 'EUR', per: 'year' }, 4, 21, ['Payments', 'Roadmapping'], 'pinewood', [3, 4]],
  ['j35', 'Machine Learning Engineer', 'ml', 'Corvid Robotics', 'Munich', 'DE', 'onsite', 'full_time', null, 14, null, ['Python', 'Computer vision'], 'tallyboard', [13, 14]],
  ['j36', 'Security Analyst (SOC)', 'security', 'Ironbark Security', 'Dublin', 'IE', 'onsite', 'full_time', { min: 52000, max: 64000, cur: 'EUR', per: 'year' }, 2, 18, ['SIEM', 'Incident response'], 'careers', [1, 2]],
  ['j37', 'Operations Coordinator', 'ops-manager', 'Meridian Mills', null, null, 'unknown', 'full_time', null, 5, 26, ['Scheduling', 'Supplier liaison'], 'dovetail', [4, 5]],
  ['j38', 'Senior Backend Engineer', 'backend', 'Sable Systems', 'Austin', 'US', 'remote', 'full_time', { min: 150000, max: 185000, cur: 'USD', per: 'year' }, 3, 14, ['Python', 'Django'], null, []],
  ['j39', 'Community Manager', 'content', 'Pipistrelle Games', null, null, 'remote', 'unknown', null, null, null, ['Moderation', 'Community'], null, [], { apply: false }],
  ['j40', 'Warehouse Systems Analyst', 'data-analyst', 'Tidewater Freight', 'Antwerp', 'BE', 'onsite', 'full_time', { min: 46000, max: 56000, cur: 'EUR', per: 'year' }, 5, 11, ['SQL', 'WMS'], 'pinewood', [4, 5]],
  ['j41', 'Lead Designer, Brand', 'product-designer', 'Lumen & Lode', 'Paris', 'FR', 'hybrid', 'contract', { min: 450, max: 550, cur: 'EUR', per: 'day' }, 6, 15, ['Brand', 'Typography'], 'tallyboard', [5, 6]],
  ['j42', 'Site Reliability Engineer', 'devops', 'Sable Systems', 'Chicago', 'US', 'hybrid', 'full_time', { min: 140000, max: 170000, cur: 'USD', per: 'year' }, 2, 26, ['SRE', 'Go', 'Kubernetes'], 'pinewood', [0, 2]],
  ['j43', 'Frontend Engineer', 'frontend', 'Pipistrelle Games', 'Tallinn', 'EE', 'remote', 'full_time', { min: 3800, max: 5000, cur: 'EUR', per: 'month' }, 4, 20, ['TypeScript', 'Canvas'], 'careers', [3, 4]],
  ['j44', 'Data Analyst, Public Health', 'data-analyst', 'Saltmarsh District Council', 'Leeds', 'GB', 'hybrid', 'full_time', { min: 36000, max: 42000, cur: 'GBP', per: 'year' }, 3, 12, ['R', 'SQL', 'Dashboards'], 'careers', [2, 3]],
  ['j45', 'Account Executive', 'account-exec', 'Kestrel Cloud', 'London', 'GB', 'hybrid', 'full_time', null, 5, 14, ['SaaS'], 'dovetail', [3, 5]],
  ['j46', 'Technical Writer', 'content', 'Tessellate Labs', null, null, 'remote', 'contract', { min: 350, max: 420, cur: 'EUR', per: 'day' }, 8, null, ['Documentation', 'APIs'], 'tallyboard', [7, 8], { loc: 'Europe (country not stated)' }],
  // closed postings are kept on the record but hidden unless asked for
  ['j47', 'Mobile Engineer (Android)', 'mobile', 'Marrow Health', 'Berlin', 'DE', 'hybrid', 'full_time', { min: 68000, max: 84000, cur: 'EUR', per: 'year' }, 25, null, ['Kotlin', 'Jetpack Compose'], 'careers', [24, 12, 4], { status: 'closed', closedDaysAgo: 3 }],
  ['j48', 'Paralegal (Internship)', 'legal', 'Harrow & Finch', 'Munich', 'DE', 'onsite', 'internship', { min: 1400, max: 1400, cur: 'EUR', per: 'month' }, 30, null, ['Research', 'Drafting'], 'tallyboard', [29, 10], { status: 'closed', closedDaysAgo: 9 }],
  ['j49', 'Recruiting Coordinator', 'recruiter', 'Cobalt Orchard', 'Madrid', 'ES', 'hybrid', 'full_time', { min: 32000, max: 38000, cur: 'EUR', per: 'year' }, 20, null, ['Scheduling', 'Applicant systems'], 'dovetail', [19, 6], { status: 'closed', closedDaysAgo: 5 }],
];

export const COUNTRIES = {
  AT: 'Austria', BE: 'Belgium', CA: 'Canada', CH: 'Switzerland', DE: 'Germany', DK: 'Denmark', EE: 'Estonia', ES: 'Spain',
  FR: 'France', GB: 'United Kingdom', IE: 'Ireland', NL: 'Netherlands', PL: 'Poland', PT: 'Portugal', SE: 'Sweden', US: 'United States',
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function build([id, title, occ, employer, city, cc, mode, type, pay, posted, valid, skills, source, obs, extra = {}]) {
  const o = OCCUPATIONS[occ];
  const status = extra.status || 'active';
  const locRaw = extra.loc || (city ? `${city}, ${COUNTRIES[cc]}` : null);
  const summary = o.about.replace(/^You will /, '').replace(/^./, (c) => c.toUpperCase());
  return {
    id,
    canonicalId: `canon-${id.replace('j', 'opp-00')}`,
    title,
    occ,
    occLabel: o.label,
    employer: { name: employer, url: employer === 'Meridian Mills' ? null : `https://example.com/employers/${slug(employer)}`, blurb: EMPLOYER_BLURBS[employer] },
    loc: city || locRaw ? { city: city || null, cc: cc || null, country: cc ? COUNTRIES[cc] : null, raw: locRaw } : null,
    mode,
    type,
    pay: pay ? { ...pay, note: pay.note || null } : null,
    posted, // days before NOW, or null = not stated
    modified: posted !== null && posted > 2 && obs.length > 1 ? Math.max(0, posted - 2) : null,
    valid, // days after NOW, or null = open-ended / not stated
    status,
    closedDaysAgo: extra.closedDaysAgo ?? null,
    skills,
    summary,
    source: source ? SOURCES[source] : null,
    obs, // days-ago list, newest first
    applyUrl: extra.apply === false ? null : `https://example.com/apply/${id}`,
    lang: extra.lang || (posted === null ? null : 'en'),
    description: {
      intro: employer && EMPLOYER_BLURBS[employer] ? `${employer} ${EMPLOYER_BLURBS[employer]}` : null,
      about: o.about,
      do: o.do,
      ask: o.ask,
    },
  };
}

export const JOBS = ROWS.map(build);
export const JOB_BY_ID = Object.fromEntries(JOBS.map((j) => [j.id, j]));
