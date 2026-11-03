# Recipe: WordPress

> **Not yet run against a real space:** a test space with synthetic data serves the widget release `embed-v0.6.1-v1` at `/embed/v0/embed.js`, with its language files and CORS, but this recipe has not run against it. The plugin is `packages/wordpress/linkbot-space`, version 0.1.0-v1; each version is a tag of this repository, and nothing is on wordpress.org yet. CI runs it in a real WordPress 6.8 on PHP 8.3, through WordPress Playground, and loads its pages in Chromium, Firefox and WebKit against the sample build. It checks that:
>
> - the shortcode starts the widget with the space from **Settings → Linkbot** and your notice, and its own attributes win over the settings;
> - the block shows the space, with its own language and notice;
> - two placements on one page load `embed.js` once;
> - a secret key in a shortcode shows a visitor nothing and loads nothing, and the settings page refuses to store one.

The plugin adds a settings page, a block and the shortcode `[linkbot]`. You set your space once; editors then place it with the block or the shortcode. Both work for every editor: WordPress keeps scripts out of posts for everyone without the `unfiltered_html` capability, and that excludes editors on multisite networks.

## 1. Install the plugin

Copy the folder `packages/wordpress/linkbot-space` to `wp-content/plugins/`, or zip it and upload it under **Plugins → Add New → Upload Plugin**. Then activate it. Deleting the plugin removes its one option; pages keep their blocks and shortcodes, which then show visitors nothing.

## 2. Set your space once: Settings → Linkbot

| Field | What to enter |
| --- | --- |
| Address of embed.js | `https://{space_host}/embed/v0/embed.js`, served by your space's instance. It must be https. |
| Publishable key | Your `pk_…`. A secret key (`sk_…`) is refused and not saved, and the page says to rotate it. |
| Space API address | Only if `embed.js` comes from somewhere else than your space's instance: `https://{space_host}/api/space/v0`. |
| What it shows, side, language | The defaults for every placement. Left empty, the widget decides: describe, a need, and the visitor's browser language. |

A value the settings page can't use is not saved, the stored value stays, and the page says why.

## 3. Place it

**The block.** Add the **Linkbot space** block, under Widgets. Its sidebar sets what it shows, the side, the language and how people describe; an empty choice means the site's setting. Write your data notice in the block: it appears above the confirm button. In the editor the block shows a placeholder; the widget runs on the published page.

**The shortcode.** In any editor, for example in a **Shortcode** block:

<!-- snippet: examples/wordpress/shortcode.txt -->
```text
[linkbot mode="describe" side="seeking"]Your two lines, from your own privacy texts.[/linkbot]
```

- The text between `[linkbot]` and `[/linkbot]` is your data notice.
- `mode`, `side`, `locale`, `input` and `api` are the element's attributes without `data-`; see the [embed reference](../reference/embed.md). A value the plugin doesn't know is left out, so the setting or the widget's default applies.
- A shortcode may also carry its own `src` and `key`. Whatever it sets wins over the settings:

<!-- snippet: examples/wordpress/shortcode-own.txt -->
```text
[linkbot src="EMBED_URL" key="pk_…" locale="de"]
```

The plugin refuses a secret key wherever it appears: people who can edit the page see a warning, and visitors see nothing. Use the same `src` everywhere on a page: the plugin loads the script once, from the first placement.

## Caching and optimisation plugins

Plugins that combine, minify, move or delay scripts must leave `embed.js` alone. Exclude it by its address, or by its handle, `linkbot-embed`. `embed.js` loads its other languages from next to itself and checks each one against a sha256 it carries, so a copy elsewhere can't load them.

If your site sends a Content Security Policy, see the [HTML recipe](html.md#content-security-policy). If your WordPress host doesn't allow plugins, neither the block nor the shortcode is available. A Custom HTML block with the [snippet](../guides/quickstart.md#2-paste-the-snippet) works only for users WordPress lets post scripts.
