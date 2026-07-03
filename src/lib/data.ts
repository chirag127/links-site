import raw from '../data/sites-2026.json'
import { dataSchema, type Site, type SiteWithCategory } from './schema'

// Validate at build time; throws with a clear error if the JSON drifts.
const data = dataSchema.parse(raw)

export const categories = data.categories
export const deadLinks: string[] = data.dead_from_sdmg15 ?? []

export const CATEGORY_ORDER = [
  'agent-era-2026',
  'when-stuck',
  'learning',
  'docs',
  'tools',
  'interview-prep',
  'competitive',
  'jobs',
  'news',
  'blogs',
] as const

export const CATEGORY_META: Record<string, { label: string; blurb: string }> = {
  'agent-era-2026': { label: 'Agent era 2026', blurb: 'The picks that matter most to how we build now.' },
  'when-stuck': { label: 'When stuck', blurb: 'Q&A archives and communities that still answer.' },
  learning: { label: 'Learning', blurb: 'Structured practice, courses, and paths.' },
  docs: { label: 'Docs', blurb: 'Reference material worth bookmarking.' },
  tools: { label: 'Tools', blurb: 'The daily-use utility belt.' },
  'interview-prep': { label: 'Interview prep', blurb: 'For the day the recruiter emails.' },
  competitive: { label: 'Competitive', blurb: 'Algorithmic sport and skill sharpening.' },
  jobs: { label: 'Jobs', blurb: 'Where the roles are actually posted.' },
  news: { label: 'News', blurb: 'What shipped this week.' },
  blogs: { label: 'Blogs', blurb: 'Long-form worth subscribing to.' },
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const allSites: SiteWithCategory[] = Object.entries(categories).flatMap(([category, sites]) =>
  sites.map((s) => ({ ...s, category, slug: slugify(s.name) }))
)

export const bySlug: Record<string, SiteWithCategory> = Object.fromEntries(allSites.map((s) => [s.slug, s]))

export function sitesForCategory(cat: string): SiteWithCategory[] {
  return allSites.filter((s) => s.category === cat)
}

export function categoryList(): string[] {
  const known = new Set(CATEGORY_ORDER as readonly string[])
  const extras = Object.keys(categories).filter((c) => !known.has(c))
  return [...CATEGORY_ORDER.filter((c) => categories[c]), ...extras]
}

export type { Site, SiteWithCategory }
