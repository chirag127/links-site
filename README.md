# links-site

[![Stars](https://img.shields.io/github/stars/chirag127/links-site?style=flat-square)](https://github.com/chirag127/links-site/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

Astro source for **[links.oriz.in](https://links.oriz.in)** — 100+ hand-picked, 2026-verified dev sites, presented as a curated editorial directory.

**Live:** https://links.oriz.in

## Stack

- **Astro 5** — static-site generation
- **Tailwind v4** — utility CSS
- **React 19** — islands (search, theme toggle)
- **FlexSearch** — client-side search over names + reviews + why
- **[@chirag127/site-shell](https://github.com/chirag127/site-shell)** — shared wordmark, footer, Bunny Fonts loader
- **Content**: `src/data/sites-2026.json` (validated by Zod schema at build time)

## Design

"The Directory" — deep-navy editorial magazine. Palette:

- `#0a1929` navy bg
- `#122b45` surface panel
- `#f5efe0` cream text
- `#ffb700` gold accent (active tabs, stack picks, hover underlines)
- `#ff8a95` blush accent (tier badges only)

Fonts (Bunny): Fraunces (variable, editorial serif) · Inter (body) · JetBrains Mono (mono).

Per [`per-app-distinctive-frontend-design`](https://knowledge.oriz.in/rules/design/per-app-distinctive-frontend-design.html).

## Dev

```bash
pnpm install
pnpm dev
```

## Deploy

```bash
pnpm deploy   # astro build + wrangler pages deploy dist
```

Auto-deploys to Cloudflare Pages (`links-oriz-in`) on push to `main` via `.github/workflows/publish.yml`.

## License

MIT.
