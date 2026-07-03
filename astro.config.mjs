import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import siteShell from '@chirag127/site-shell/astro'

export default defineConfig({
  site: 'https://links.oriz.in',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
  integrations: [
    react(),
    mdx(),
    sitemap(),
    siteShell({
      name: 'links',
      tagline: 'The directory — 100+ curated 2026 sites',
      palette: {
        bg: '#0a1929',
        fg: '#f5efe0',
        accent: '#ffb700',
        accent2: '#ff8a95',
        muted: '#c8bfa8',
        rule: '#1e3a5f',
      },
      fonts: { head: 'Fraunces', body: 'Inter', mono: 'JetBrains Mono' },
      githubUrl: 'https://github.com/chirag127/links-site',
    }),
  ],
  experimental: {},
})
