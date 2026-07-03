import rss from '@astrojs/rss'
import { allSites, CATEGORY_META } from '../lib/data'

export async function GET(context: any) {
  const items = [...allSites]
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    .map((s) => ({
      title: `${s.name} — ${CATEGORY_META[s.category]?.label ?? s.category}`,
      description: `${s.why}\n\n${s.review}`,
      link: `/site/${s.slug}`,
    }))

  return rss({
    title: 'links.oriz.in',
    description: 'The directory — 100+ curated 2026 dev sites',
    site: context.site!.toString(),
    items,
  })
}
