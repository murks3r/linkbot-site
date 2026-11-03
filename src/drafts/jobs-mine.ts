/* The draft page /jobs/mine, in English and German: the person's own page in Jobs, the second vertical, once signed in:
   the confirmed criteria, the verdicts each company sees, an answer per role, the companies that never see the person,
   pause, export and delete. A demo on fictional data that runs in the browser only (src/front/mine.ts); nothing of it
   is built in Jobs, so the page is a draft for the owner's review: linked from nowhere, never indexed, out of the
   sitemap, and left out of production builds. The criteria, their labels and the roles' values come from the jobs
   pack's draft and its demo fixtures; the rules from the Jobs spec's draft. Every sentence has its row in
   docs/truth-check.md (section "/jobs/mine"). */
import { PUBLIC_NAME } from '../i18n/terms.ts';
import type { Answer } from '../front/mine.ts';
import { buildsDraft, type Draft } from './draft.ts';

/** Whether a production build carries the draft. Set it to true once Jobs runs on a space and the owner approves the page. */
export const JOBS_MINE_IN_PRODUCTION = false;

/** Whether a build carries the draft (src/drafts/draft.ts). */
export const buildsJobsMine = (env: { VERCEL_ENV?: string }, inProduction = JOBS_MINE_IN_PRODUCTION): boolean =>
  buildsDraft(env, inProduction);

export type Verdict = 'meets' | 'partly' | 'conflicts' | 'unknown';
/** The jobs pack's criteria the person states (notes are never compared, so never on this page). */
export const CRITERIA = ['role_family', 'seniority', 'work_country', 'work_mode', 'start_date', 'languages', 'salary_band', 'employment_type'] as const;
export type Criterion = (typeof CRITERIA)[number];

/** A role that may fit: its card's facts up front, and the verdict on each of the person's criteria. A role with a
    conflict on one of the person's musts is hidden from both sides; the person is told which must. */
export interface Role { id: string; title: string; facts: string[]; verdicts: Partial<Record<Criterion, Verdict>>; hidden?: boolean }
export interface Company { id: string; name: string; domain: string; employer?: boolean }

export interface MineDemo {
  h2: string;
  label: string;
  signIn: { title: string; p: string; button: string; planned: string; signedIn: string; out: string };
  pause: { title: string; active: string; paused: string; pause: string; resume: string };
  criteria: { title: string; p: string; must: string; nice: string; change: string; values: Record<Criterion, string>; labels: Record<Criterion, string>; musts: Criterion[] };
  roles: {
    title: string; p: string; yours: string; sees: string; salary: string; verdicts: Record<Verdict, string>;
    answers: Record<Exclude<Answer, 'open'>, string>; said: Record<Exclude<Answer, 'open'>, string>; reopen: string;
    paused: string; hidden: string; list: Role[];
  };
  block: { title: string; p: string; promise: string; employer: string; block: string; unblock: string; on: string; off: string; companies: Company[]; first: string[] };
  history: { title: string; p: string; entries: string[] };
  exporting: { title: string; p: string; button: string; file: string; note: string };
  deletion: { title: string; p: string; button: string; ask: string; yes: string; no: string; done: string; again: string };
  signOut: string;
}
export interface MineDraft extends Draft { demo: MineDemo }

const ROLE_IDS = ['a', 'b', 'c'] as const;
const COMPANY_IDS = ['employer', 'northwind', 'brightfield'] as const;

export const jobsMine: Record<'en' | 'de', MineDraft> = {
  en: {
    banner: 'Draft, not published: planned, not built.',
    bannerNote: `This page is linked from nowhere on the site, is never indexed and exists in English and German only. ${PUBLIC_NAME} runs no jobs space today. The demo below uses made-up data and runs in this browser only: it sends nothing and stores nothing.`,
    title: 'Jobs: your own page (planned, draft)',
    description: 'Draft: a person’s own page in Jobs. Criteria, the verdicts companies see, who never sees them, pause, export and delete. Made-up data.',
    eyebrow: 'Jobs · planned · draft',
    h1: ['Your own page in Jobs:', 'what companies see, and who never sees you.'],
    lede: `Jobs is planned so that a person can look for a new role without their current employer finding out: ${PUBLIC_NAME} checks both sides, matches roles and people as criteria only, and introduces them only when both said yes. This is the page where the person sees what they confirmed, what each company sees about them, and who never sees them at all. The page names no date.`,
    demo: {
      h2: 'Try it',
      label: 'Made-up data · in this browser only',
      signIn: {
        title: 'Sign in to see your page',
        p: 'Your page is visible only after you sign in. Nobody else sees it, and there is no public profile.',
        button: 'Sign in',
        planned: 'Planned: one sign-in in place of one email link per entry. Today nobody signs in; the browser that confirmed holds access.',
        signedIn: 'Signed in. This is your page.',
        out: 'Sign out',
      },
      pause: {
        title: 'Your search',
        active: 'Active: companies whose roles may fit see your criteria and verdicts, without your name.',
        paused: 'Paused: no company sees you and no new role is proposed to you until you resume. Your answers stay as they are.',
        pause: 'Pause my search',
        resume: 'Resume',
      },
      criteria: {
        title: 'Your criteria',
        p: 'What you confirmed in the conversation, and nothing else: no CV, no cover letter, no application. Only what you confirmed is stored.',
        must: 'Musts',
        nice: 'Nice to have',
        change: 'To change a line, open the conversation again; nothing changes until you confirm.',
        labels: { role_family: 'Role', seniority: 'Seniority', work_country: 'Country of work', work_mode: 'On site or remote', start_date: 'Start date', languages: 'Working languages', salary_band: 'Salary band (gross per year)', employment_type: 'Employment type' },
        values: { role_family: 'Data and analytics', seniority: 'Junior', work_country: 'Ireland', work_mode: 'Hybrid', start_date: 'February 2027', languages: 'English', salary_band: '42,000–46,000 EUR', employment_type: 'Permanent employment' },
        musts: ['role_family', 'seniority', 'work_country', 'work_mode', 'start_date', 'languages'],
      },
      roles: {
        title: 'What companies see about you',
        p: 'Each role that may fit, with the verdict on each of your criteria. The company sees these verdicts, in these words, and nothing else: not your name, not your contact. No score, no ranking: companies list people by how recent they are.',
        yours: 'Yours',
        sees: 'The company sees',
        salary: 'The company sees the verdict on your salary band, never your figure.',
        verdicts: { meets: 'Fits', partly: 'Partly fits', conflicts: 'Conflicts', unknown: 'Unknown' },
        answers: { interested: 'Interested', declined: 'Not for me', later: 'Later' },
        said: {
          interested: 'Sent with the criteria you confirmed. The company sees nothing of it until it says yes too.',
          declined: 'Not for you. The company learns nothing of it.',
          later: 'Nothing is recorded. The role stays here.',
        },
        reopen: 'Change my answer',
        paused: 'Paused: you can answer once you resume.',
        hidden: 'One more role is hidden from you and from its company alike: it asks for “On site”, and your must says “Hybrid”. No one is told more.',
        list: [
          { id: ROLE_IDS[0], title: 'Junior data analyst', facts: ['Data and analytics', 'Junior or professional (mid level)', '40,000–48,000 EUR', 'Hybrid', 'Ireland or Netherlands', 'From Q1 2027', 'Permanent or fixed-term'], verdicts: { role_family: 'meets', seniority: 'meets', work_country: 'meets', work_mode: 'meets', start_date: 'meets', languages: 'meets', salary_band: 'meets', employment_type: 'meets' } },
          { id: ROLE_IDS[1], title: 'Reporting analyst', facts: ['Data and analytics', 'Junior', '38,000–44,000 EUR', 'Hybrid', 'Ireland', 'From Q1 2027', 'Fixed-term'], verdicts: { role_family: 'meets', seniority: 'meets', work_country: 'meets', work_mode: 'meets', start_date: 'meets', languages: 'unknown', salary_band: 'partly', employment_type: 'conflicts' } },
          { id: ROLE_IDS[2], title: 'On-site data analyst', facts: [], verdicts: { work_mode: 'conflicts' }, hidden: true },
        ],
      },
      block: {
        title: 'Who never sees you',
        p: 'A company on this list gets no match with you, no card and no count, and it is never told that you listed it.',
        promise: `Companies you list never see you while they use the domain they confirmed with ${PUBLIC_NAME}. Nothing stronger is promised.`,
        employer: 'Your current employer',
        block: 'Block',
        unblock: 'Remove from the list',
        on: 'Never sees you',
        off: 'Not on your list',
        companies: [
          { id: COMPANY_IDS[0], name: 'Fictional Current Employer Ltd', domain: 'current-employer.example', employer: true },
          { id: COMPANY_IDS[1], name: 'Northwind Analytics (fictional)', domain: 'northwind.example' },
          { id: COMPANY_IDS[2], name: 'Brightfield Data (fictional)', domain: 'brightfield.example' },
        ],
        first: [COMPANY_IDS[0]],
      },
      history: {
        title: 'Your history',
        p: 'Each check you passed and each introduction is added to your history; entries are only ever added, never changed. You see and export it. A company sees counts only, and only after its yes.',
        entries: ['Email address confirmed through a link (a check)'],
      },
      exporting: {
        title: 'Export',
        p: 'One file with everything on this page: your criteria, your answers, your list, your history.',
        button: 'Export my data',
        file: 'jobs-mine-made-up.json',
        note: 'Made-up data from a draft page. Nothing was sent or stored.',
      },
      deletion: {
        title: 'Delete',
        p: 'One action removes your criteria, your answers and your list. What stays is the record that a deletion happened, without your words.',
        button: 'Delete everything',
        ask: 'Delete everything on this page? It cannot be undone.',
        yes: 'Yes, delete',
        no: 'Keep it',
        done: 'Deleted. No company sees anything of you any more.',
        again: 'Start the demo again',
      },
      signOut: 'Sign out',
    },
    sections: [
      {
        id: 'rules',
        title: 'The rules this page follows',
        paragraphs: [
          'A person has no public profile: no card on a board, no search result, no listing. A company sees a person only as criteria and verdicts, without a name, until both said yes.',
          'The person sees the criteria and verdicts the company sees about them, in the same words. There is no score and no ranking; companies list people by how recent they are.',
          'A conflict with a must hides a role and a person from each other alike, and the person sees which must conflicted. A no, a block or a yes not yet answered is never shown to the other side.',
          'People say yes on both sides. The introduction exists only when both said yes and the space’s team approved it; then each side gets the other’s name and confirmed email address.',
        ],
      },
      {
        id: 'today',
        title: 'What exists today',
        paragraphs: [
          `None of this page is built in Jobs, and ${PUBLIC_NAME} runs no jobs space, not even with made-up data. Some parts it rests on are drafts on development branches: the jobs criteria, the conversation that turns your words into criteria, the role cards, the company side, the sign-in and the history. The block list is not built yet. None of it is merged.`,
          'Today a person’s only check is the email address they confirm through a link.',
        ],
      },
    ],
    open: {
      title: 'Open before real people use it',
      items: [
        'The name and the domain under which Jobs appears to people.',
        'Whether a closed pilot with invited people starts, who is invited, and from which sender address. This is for the owner.',
        'Whether counsel’s questions on the jobs criteria are answered before real people take part.',
        'Which sign-in service carries the accounts, and how an account is tied to entries confirmed through an email link.',
        'How a person can be checked beyond the confirmed email address without their employer learning of it.',
      ],
    },
  },
  de: {
    banner: 'Entwurf, nicht veröffentlicht: geplant, nicht gebaut.',
    bannerNote: `Diese Seite ist von nirgends auf der Website verlinkt, wird nie indexiert und existiert nur auf Englisch und Deutsch. ${PUBLIC_NAME} betreibt heute keinen Jobs-Space. Die Demo unten nutzt erfundene Daten und läuft nur in diesem Browser: Sie sendet nichts und speichert nichts.`,
    title: 'Jobs: Ihre eigene Seite (geplant, Entwurf)',
    description: 'Entwurf: die eigene Seite einer Person in Jobs. Kriterien, die Urteile, die Firmen sehen, wer sie nie sieht, Pause, Export, Löschen. Erfundene Daten.',
    eyebrow: 'Jobs · geplant · Entwurf',
    h1: ['Ihre eigene Seite in Jobs:', 'was Firmen sehen, und wer Sie nie sieht.'],
    lede: `Jobs ist so geplant, dass eine Person eine neue Stelle suchen kann, ohne dass ihr aktueller Arbeitgeber davon erfährt: ${PUBLIC_NAME} prüft beide Seiten, gleicht Stellen und Personen nur über Kriterien ab und stellt sie erst vor, wenn beide Ja gesagt haben. Auf dieser Seite sieht die Person, was sie bestätigt hat, was jede Firma über sie sieht und wer sie gar nicht sieht. Die Seite nennt kein Datum.`,
    demo: {
      h2: 'Selbst ausprobieren',
      label: 'Erfundene Daten · nur in diesem Browser',
      signIn: {
        title: 'Melden Sie sich an, um Ihre Seite zu sehen',
        p: 'Ihre Seite ist erst nach der Anmeldung sichtbar. Niemand sonst sieht sie, und es gibt kein öffentliches Profil.',
        button: 'Anmelden',
        planned: 'Geplant: eine Anmeldung statt eines E-Mail-Links je Eintrag. Heute meldet sich niemand an; der Browser, der bestätigt hat, behält den Zugang.',
        signedIn: 'Angemeldet. Das ist Ihre Seite.',
        out: 'Abmelden',
      },
      pause: {
        title: 'Ihre Suche',
        active: 'Aktiv: Firmen, deren Stellen passen könnten, sehen Ihre Kriterien und Urteile, ohne Ihren Namen.',
        paused: 'Pausiert: Keine Firma sieht Sie, und Ihnen wird keine neue Stelle vorgeschlagen, bis Sie fortsetzen. Ihre Antworten bleiben, wie sie sind.',
        pause: 'Suche pausieren',
        resume: 'Fortsetzen',
      },
      criteria: {
        title: 'Ihre Kriterien',
        p: 'Was Sie im Gespräch bestätigt haben, und nichts sonst: kein Lebenslauf, kein Anschreiben, keine Bewerbung. Gespeichert wird nur, was Sie bestätigt haben.',
        must: 'Muss',
        nice: 'Wünschenswert',
        change: 'Um eine Zeile zu ändern, öffnen Sie das Gespräch erneut; nichts ändert sich, bevor Sie bestätigen.',
        labels: { role_family: 'Tätigkeitsfeld', seniority: 'Erfahrungsstufe', work_country: 'Arbeitsland', work_mode: 'Vor Ort oder remote', start_date: 'Starttermin', languages: 'Arbeitssprachen', salary_band: 'Gehaltsband (brutto pro Jahr)', employment_type: 'Anstellungsart' },
        values: { role_family: 'Daten und Analyse', seniority: 'Junior', work_country: 'Irland', work_mode: 'Hybrid', start_date: 'Februar 2027', languages: 'Englisch', salary_band: '42.000–46.000 EUR', employment_type: 'Unbefristete Anstellung' },
        musts: ['role_family', 'seniority', 'work_country', 'work_mode', 'start_date', 'languages'],
      },
      roles: {
        title: 'Was Firmen über Sie sehen',
        p: 'Jede Stelle, die passen könnte, mit dem Urteil zu jedem Ihrer Kriterien. Die Firma sieht diese Urteile, in diesen Worten, und sonst nichts: nicht Ihren Namen, nicht Ihren Kontakt. Kein Punktwert, keine Rangliste: Firmen sehen Personen in der Reihenfolge, in der sie dazukamen.',
        yours: 'Ihres',
        sees: 'Die Firma sieht',
        salary: 'Die Firma sieht das Urteil zu Ihrem Gehaltsband, nie Ihre Zahl.',
        verdicts: { meets: 'Passt', partly: 'Passt teilweise', conflicts: 'Widerspricht', unknown: 'Unbekannt' },
        answers: { interested: 'Interessiert', declined: 'Nichts für mich', later: 'Später' },
        said: {
          interested: 'Gesendet, mit den Kriterien, die Sie bestätigt haben. Die Firma sieht davon nichts, bis sie ebenfalls Ja sagt.',
          declined: 'Nichts für Sie. Die Firma erfährt davon nichts.',
          later: 'Nichts wird festgehalten. Die Stelle bleibt hier.',
        },
        reopen: 'Antwort ändern',
        paused: 'Pausiert: Sie können antworten, sobald Sie fortsetzen.',
        hidden: 'Eine weitere Stelle ist für Sie und für ihre Firma gleichermaßen ausgeblendet: Sie verlangt „Vor Ort“, und Ihr Muss sagt „Hybrid“. Mehr erfährt niemand.',
        list: [
          { id: ROLE_IDS[0], title: 'Junior-Datenanalyst/in', facts: ['Daten und Analyse', 'Junior oder berufserfahren (mittlere Stufe)', '40.000–48.000 EUR', 'Hybrid', 'Irland oder Niederlande', 'Ab Q1 2027', 'Unbefristet oder befristet'], verdicts: { role_family: 'meets', seniority: 'meets', work_country: 'meets', work_mode: 'meets', start_date: 'meets', languages: 'meets', salary_band: 'meets', employment_type: 'meets' } },
          { id: ROLE_IDS[1], title: 'Reporting-Analyst/in', facts: ['Daten und Analyse', 'Junior', '38.000–44.000 EUR', 'Hybrid', 'Irland', 'Ab Q1 2027', 'Befristet'], verdicts: { role_family: 'meets', seniority: 'meets', work_country: 'meets', work_mode: 'meets', start_date: 'meets', languages: 'unknown', salary_band: 'partly', employment_type: 'conflicts' } },
          { id: ROLE_IDS[2], title: 'Datenanalyst/in vor Ort', facts: [], verdicts: { work_mode: 'conflicts' }, hidden: true },
        ],
      },
      block: {
        title: 'Wer Sie nie sieht',
        p: 'Eine Firma auf dieser Liste bekommt keinen Abgleich mit Ihnen, keine Karte und keine Zahl, und sie erfährt nie, dass Sie sie eingetragen haben.',
        promise: `Firmen auf Ihrer Liste sehen Sie nie, solange sie die Domain nutzen, die sie bei ${PUBLIC_NAME} bestätigt haben. Mehr wird nicht versprochen.`,
        employer: 'Ihr aktueller Arbeitgeber',
        block: 'Sperren',
        unblock: 'Von der Liste nehmen',
        on: 'Sieht Sie nie',
        off: 'Nicht auf Ihrer Liste',
        companies: [
          { id: COMPANY_IDS[0], name: 'Erfundener Arbeitgeber GmbH', domain: 'current-employer.example', employer: true },
          { id: COMPANY_IDS[1], name: 'Northwind Analytics (erfunden)', domain: 'northwind.example' },
          { id: COMPANY_IDS[2], name: 'Brightfield Data (erfunden)', domain: 'brightfield.example' },
        ],
        first: [COMPANY_IDS[0]],
      },
      history: {
        title: 'Ihre Historie',
        p: 'Jede Prüfung, die Sie bestanden haben, und jede Vorstellung kommt in Ihre Historie; Einträge kommen nur hinzu und werden nie geändert. Sie sehen und exportieren sie. Eine Firma sieht nur Zahlen, und erst nach ihrem Ja.',
        entries: ['E-Mail-Adresse über einen Link bestätigt (eine Prüfung)'],
      },
      exporting: {
        title: 'Exportieren',
        p: 'Eine Datei mit allem auf dieser Seite: Ihre Kriterien, Ihre Antworten, Ihre Liste, Ihre Historie.',
        button: 'Meine Daten exportieren',
        file: 'jobs-meine-seite-erfunden.json',
        note: 'Erfundene Daten von einer Entwurfsseite. Nichts wurde gesendet oder gespeichert.',
      },
      deletion: {
        title: 'Löschen',
        p: 'Eine Aktion entfernt Ihre Kriterien, Ihre Antworten und Ihre Liste. Was bleibt, ist der Vermerk, dass gelöscht wurde, ohne Ihre Worte.',
        button: 'Alles löschen',
        ask: 'Alles auf dieser Seite löschen? Das lässt sich nicht rückgängig machen.',
        yes: 'Ja, löschen',
        no: 'Behalten',
        done: 'Gelöscht. Keine Firma sieht mehr etwas von Ihnen.',
        again: 'Demo neu starten',
      },
      signOut: 'Abmelden',
    },
    sections: [
      {
        id: 'rules',
        title: 'Die Regeln dieser Seite',
        paragraphs: [
          'Eine Person hat kein öffentliches Profil: keine Karte am Board, kein Suchergebnis, keinen Eintrag in einer Liste. Eine Firma sieht eine Person nur als Kriterien und Urteile, ohne Namen, bis beide Ja gesagt haben.',
          'Die Person sieht die Kriterien und Urteile, die die Firma über sie sieht, in denselben Worten. Es gibt keinen Punktwert und keine Rangliste; Firmen sehen Personen in der Reihenfolge, in der sie dazukamen.',
          'Ein Widerspruch zu einem Muss blendet Stelle und Person füreinander gleichermaßen aus, und die Person sieht, welches Muss widersprach. Ein Nein, eine Sperre oder ein noch unbeantwortetes Ja wird der anderen Seite nie gezeigt.',
          'Auf beiden Seiten sagen Menschen Ja. Die Vorstellung gibt es erst, wenn beide Ja gesagt haben und das Team des Space sie freigegeben hat; dann erhält jede Seite Namen und bestätigte E-Mail-Adresse der anderen.',
        ],
      },
      {
        id: 'today',
        title: 'Was es heute gibt',
        paragraphs: [
          `Nichts auf dieser Seite ist in Jobs gebaut, und ${PUBLIC_NAME} betreibt keinen Jobs-Space, auch nicht mit erfundenen Daten. Einige Teile, auf denen sie aufbaut, sind Entwürfe auf Entwicklungszweigen: die Jobs-Kriterien, das Gespräch, das Ihre Worte in Kriterien übersetzt, die Stellenkarten, die Firmenseite, die Anmeldung und die Historie. Die Sperrliste ist noch nicht gebaut. Nichts davon ist zusammengeführt.`,
          'Heute ist die einzige Prüfung einer Person die E-Mail-Adresse, die sie über einen Link bestätigt.',
        ],
      },
    ],
    open: {
      title: 'Offen, bevor echte Menschen es nutzen',
      items: [
        'Der Name und die Domain, unter denen Jobs für Menschen erscheint.',
        'Ob ein geschlossener Pilot mit eingeladenen Menschen startet, wer eingeladen wird und von welcher Absenderadresse. Das entscheidet der Owner.',
        'Ob die Fragen an die Rechtsberatung zu den Jobs-Kriterien beantwortet sind, bevor echte Menschen teilnehmen.',
        'Welcher Anmeldedienst die Konten trägt, und wie ein Konto mit Einträgen verbunden wird, die über einen E-Mail-Link bestätigt wurden.',
        'Wie eine Person über die bestätigte E-Mail-Adresse hinaus geprüft werden kann, ohne dass ihr Arbeitgeber davon erfährt.',
      ],
    },
  },
};
