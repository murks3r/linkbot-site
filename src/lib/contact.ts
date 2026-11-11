/* How to reach the site's owner. The site's domain is sensalio.de (owner, 2026-11-11); the mailbox on it is the owner's
   to create (suggested: hallo@sensalio.de). The address comes only from the environment: a build with CONTACT_EMAIL set
   shows it as a link in every page's contact section, and a build without it says the details are in preparation and
   has no contact form. Never an
   address on a domain the owner does not own, never the .invalid placeholder (tests/contact.test.mjs). */
export const CONTACT_EMAIL: string | null = process.env.CONTACT_EMAIL?.trim() || null;
