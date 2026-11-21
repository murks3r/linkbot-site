# CLI: the `linkbot` command

**Built, not published.** The command is in the open-core repository (`packages/cli`, version 0.1.0). The repository is not public yet and the command is not on npm; you build it from a clone. Node 20 or later.

No account, no telemetry, no update check. Nothing is sent to any Linkbot host unless you pass `--api`.

## Try the widget on your machine

From a clone of the repository:

```bash
git clone OPEN_CORE_REPO_URL linkbot-connect && cd linkbot-connect
corepack enable && pnpm install
pnpm --filter "@linkbot-hq/cli..." build
node packages/cli/dist/linkbot.mjs dev
```

Open `http://127.0.0.1:4180/`. The page holds the widget, and a local stand-in answers the Space API (contract 0.2.18) with one sample space of made-up data, kept in memory until you stop the command. Its `/api/space/v0/health` reports `environment: local` and `data_mode: synthetic`.

## The commands

```bash
linkbot init    [--kind nextjs|astro|html] [--page index.html] [--key pk_…] [--embed-url <url>] [--api <url>] [--origin <origin>]
linkbot dev     [--port 4180] [--origin <origin>]… [--api <url> --key pk_…]
linkbot doctor  [--api <url>]
```

- `linkbot init` finds what your project is (Next.js, Astro or plain HTML) and adds the widget through the integration that fits. It writes `linkbot.config.json` with public values only, adds only the environment values a file lacks, and never overwrites a file. Without `--key` and `--embed-url` it points at the stand-in of `linkbot dev`. A secret key (`sk_…`) is refused.
- `linkbot dev` runs the stand-in on `127.0.0.1`: the page, the widget's files under `/embed/v0/` and the sample Space API under `/api/space/v0/`. With `--api <url> --key pk_…` the page's widget talks to that Space API instead.
- `linkbot doctor` checks Node, `linkbot.config.json`, the key's format, the addresses and the origin, and whether a page places the widget. It exits 1 on a failure. With `--api <url>` it asks that Space API for `/health` and `/space` with your key and origin.
