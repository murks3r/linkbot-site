/* How to reach the site's owner. No domain is bought yet (BRAND.md, 2026-11-10; CLAUDE.md, "Domains and
   identification"), so the site names no address and has no contact form: it says that contact details follow with the
   domain. The address comes only from the environment: a build with CONTACT_EMAIL set to a mailbox on the owner's
   domain shows it as a link in every page's contact section, and a build without it says the details follow. Never an
   address on a domain the owner does not own, never the .invalid placeholder (tests/contact.test.mjs). */
export const CONTACT_EMAIL: string | null = process.env.CONTACT_EMAIL?.trim() || null;
