# CLI: the `linkbot` command (planned)

**Planned, not built.** There is no command to install or run yet. Until there is, the [quickstart](/developers/docs/guides/embed-in-five-minutes) puts the widget on a page by hand, in five minutes.

## What it is planned to do

- `linkbot init` puts the widget into a Next.js, Astro or plain HTML project.
- `linkbot dev` runs a local stand-in of the Space API with a synthetic sample space, so the widget can be tried without a space.
- `linkbot doctor` checks the configuration: a publishable key (`pk_…`) and never a secret key (`sk_…`), the address of the space's widget, and https everywhere except on your own machine.

It is planned to need no account and send no telemetry, and to reach the network only when it is given the address of a Space API.

## Where it stands

The package `packages/cli` exists in the open-core export. It holds the checks the three commands will share, and no command yet. Its words on this page come from that package's description.
