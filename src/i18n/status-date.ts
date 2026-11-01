/* The day the site's status sentences were last checked against their two sources: the staging
   space's health report (`GET /health` on its Space API, no key needed) and the Connect lane's plan
   (§1 of its `docs/plan/connect-plan.md`). Every catalogue writes this day into its status
   sentences, so a reader sees how old a status is, and tests/status.test.mjs fails once it is more
   than 14 days old. Renew it only together with the sentences and their rows in docs/truth-check.md. */
import type { Lang } from './locales.ts';

export const STATUS_CHECKED = '2026-10-26';

const LOCALE: Record<Lang, string> = { en: 'en-GB', de: 'de-DE', es: 'es-ES', it: 'it-IT', fr: 'fr-FR' };

/** A day (YYYY-MM-DD) in a language's own long form, such as "25 October 2026". */
export const longDay = (lang: Lang, day: string): string =>
  new Intl.DateTimeFormat(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${day}T00:00:00Z`));

/** The day of the last check in a language's own long form. */
export const statusDate = (lang: Lang): string => longDay(lang, STATUS_CHECKED);

/* The widget release the staging instance serves (`embed.version` in its health report) and the day
   that was read. It moves faster than the other status sentences, so it carries its own day; renew
   both together with the rows that name it in docs/truth-check.md. */
export const WIDGET_RELEASE = '0.6.1-v1';
export const WIDGET_CHECKED = '2026-11-01';

/** The day the widget release was read, in a language's own long form. */
export const widgetDate = (lang: Lang): string => longDay(lang, WIDGET_CHECKED);
