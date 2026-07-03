import type { APIRoute } from 'astro'
import { allSites } from '../lib/data'

export const GET: APIRoute = async () => {
  const docs = allSites.map((s) => ({
    slug: s.slug,
    name: s.name,
    why: s.why,
    review: s.review,
    tags: `${s.category} ${s.tier} ${s.relevance_to_our_stack}${s.stack_match ? ' stack-pick' : ''}`,
    category: s.category,
    tier: s.tier,
  }))
  return new Response(JSON.stringify(docs), {
    headers: { 'content-type': 'application/json' },
  })
}
