/* The claims the copy may not make (CLAUDE.md, BUILD MODE rule 4), per language, as whole words; and nothing that
   belongs to no public page: a host, an address, a key, a provider. Shared by the catalogue test (tests/i18n.test.mjs)
   and the front-page test (tests/front.test.mjs). "Match" as a stage name and "anonym…" in a sentence that says what
   is not claimed are not here: the copy avoids them altogether. */
export const FORBIDDEN = {
  en: /\b(verified|verifies|verifiable|live|automated|automatic(?:ally)?|anonym\w*|real[- ]time|stays private|guaranteed?)\b/i,
  de: /\b(verifiziert\w*|live|automatisch\w*|automatisiert\w*|anonym\w*|echtzeit|bleibt privat|garantiert\w*)\b/i,
  es: /\b(verificad\w*|en vivo|en directo|automatizad\w*|automátic\w*|anónim\w*|tiempo real|permanece privad\w*|garantizad\w*)\b/i,
  it: /\b(verificat\w*|dal vivo|live|automatizzat\w*|automatic\w*|anonim\w*|tempo reale|resta privat\w*|garantit\w*)\b/i,
  fr: /\b(vérifié\w*|en direct|live|automatisé\w*|automatique\w*|anonym\w*|temps réel|reste privé\w*|garanti\w*)\b/i,
};
/* A bare identifier (an event type such as channel.verified) is not a claim and is exempt from the word check. */
export const PRIVATE = /https?:\/\/|\bsk_|\bpk_|railway|vercel|resend|@[a-z0-9-]+\.[a-z]{2,}/i;
