import { z } from 'zod'

export const siteSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  why: z.string(),
  tier: z.enum(['free', 'signup', 'freemium']),
  verified_alive: z.boolean(),
  last_active_signal: z.string(),
  relevance_to_our_stack: z.enum(['low', 'medium', 'high']),
  review: z.string(),
  stack_match: z.boolean().optional(),
})

export const dataSchema = z.object({
  categories: z.record(z.string(), z.array(siteSchema)),
  dead_from_sdmg15: z.array(z.string()).optional(),
})

export type Site = z.infer<typeof siteSchema>
export type SiteWithCategory = Site & { category: string; slug: string }
export type Data = z.infer<typeof dataSchema>
