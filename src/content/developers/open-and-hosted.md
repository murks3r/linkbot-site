# What is open, what is hosted

{name} has an open part and a hosted part. The open part is everything a platform puts on its own site or server to plug a space in. The hosted part is the service behind the Space API that does the checking, the private match and the introductions.

**Nothing is published yet.** The repository with the open part is not public, and its packages are not on npm. The licence is not chosen yet. Hosted access for other platforms: coming soon. These docs show the open part as it is prepared for publication.

| Open: the open-core repository | Hosted: the {name} service |
| --- | --- |
| The widget and its one adapter to the Space API | The checks of each party: today each side's email address; company checks are planned, not built |
| The SDK for your server, with the webhook check | The private match |
| The React, Next.js, Astro and WordPress integrations | The introduction, only after both say yes |
| The Space API contract and the types generated from it | The checked history (planned, not built) |
| The CLI, the `linkbot` command | Billing (planned, not built) |
| These docs and the examples | |

## Why the line is there

The open part runs in your page and on your server, so once it is published you can read every line of it. The hosted part holds what two strangers must not see of each other before both say yes, and, once it is built, the checked history. The [protocol](/developers/docs/protocol) describes the line between them: one HTTP API, the Space API, with the [route list](/developers/docs/reference/space-api) generated from its contract.

## Until hosted access opens

Everything in the open part runs against a local sample space with made-up example data. The [developer quickstart](/developers/docs/guides/developer-quickstart) walks a person's path through it, from a session to the introduction.
