import type { APIRoute } from 'astro'
import { categories, categoryList, CATEGORY_META, allSites } from '../lib/data'

export const GET: APIRoute = async () => {
  const lines: string[] = [
    `# links.oriz.in — ${allSites.length} curated 2026 dev sites`,
    '',
    `## About`,
    `Hand-picked directory. Every site verified alive in 2026. Tier badges: free / signup / freemium.`,
    `Source: https://github.com/chirag127/links-site`,
    '',
  ]

  for (const cat of categoryList()) {
    const meta = CATEGORY_META[cat] ?? { label: cat, blurb: '' }
    const sites = categories[cat] ?? []
    lines.push(`## ${meta.label} (${sites.length})`)
    if (meta.blurb) lines.push(meta.blurb)
    lines.push('')
    for (const s of sites) {
      const pick = (s as any).stack_match ? ' ★' : ''
      lines.push(`- [${s.name}](${s.url}) — [${s.tier}]${pick} ${s.why}`)
    }
    lines.push('')
  }

  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
