import { z } from 'zod'

// Niche validation schemas
export const nicheSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
})

export const nicheCreateSchema = nicheSchema.omit({ slug: true })
export const nicheUpdateSchema = nicheSchema.partial()

// Idea validation schemas
export const ideaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  problem: z.string().max(1000, 'Problem must be less than 1000 characters').optional(),
  solution: z.string().max(1000, 'Solution must be less than 1000 characters').optional(),
  audience: z.string().max(200, 'Audience must be less than 200 characters').optional(),
  status: z.enum(['Backlog', 'Exploring', 'Validating', 'Building', 'Launched']).default('Backlog'),
  impact: z.number().min(1, 'Impact must be at least 1').max(5, 'Impact must be at most 5').default(1),
  confidence: z.number().min(1, 'Confidence must be at least 1').max(5, 'Confidence must be at most 5').default(1),
  effort: z.number().min(1, 'Effort must be at least 1').max(5, 'Effort must be at most 5').default(1),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  source_url: z.string().url('Must be a valid URL').max(500, 'URL must be less than 500 characters').optional(),
  tags: z.string().max(500, 'Tags must be less than 500 characters').optional(),
  niche_id: z.string().uuid('Must be a valid niche ID'),
})

export const ideaCreateSchema = ideaSchema
export const ideaUpdateSchema = ideaSchema.partial().omit({ niche_id: true })

// Highlight validation schemas
export const highlightSchema = z.object({
  quote: z.string().min(1, 'Quote is required').max(2000, 'Quote must be less than 2000 characters'),
  permalink: z.string().url('Must be a valid URL').max(500, 'URL must be less than 500 characters').optional(),
  subreddit: z.string().max(100, 'Subreddit must be less than 100 characters').optional(),
  author: z.string().max(100, 'Author must be less than 100 characters').optional(),
  upvotes: z.number().min(0, 'Upvotes must be non-negative').optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  tags: z.string().max(500, 'Tags must be less than 500 characters').optional(),
  niche_id: z.string().uuid('Must be a valid niche ID'),
  idea_id: z.string().uuid('Must be a valid idea ID').optional(),
})

export const highlightCreateSchema = highlightSchema
export const highlightUpdateSchema = highlightSchema.partial().omit({ niche_id: true })

// Subreddit validation schemas
export const subredditSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  url: z.string().url('Must be a valid URL').max(200, 'URL must be less than 200 characters'),
  subscriber_count: z.number().min(0, 'Subscriber count must be non-negative').default(0),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  niche_id: z.string().uuid('Must be a valid niche ID'),
})

export const subredditCreateSchema = subredditSchema
export const subredditUpdateSchema = subredditSchema.partial().omit({ niche_id: true })

// Type exports
export type NicheFormData = z.infer<typeof nicheCreateSchema>
export type NicheUpdateData = z.infer<typeof nicheUpdateSchema>
export type IdeaFormData = z.infer<typeof ideaCreateSchema>
export type IdeaUpdateData = z.infer<typeof ideaUpdateSchema>
export type HighlightFormData = z.infer<typeof highlightCreateSchema>
export type HighlightUpdateData = z.infer<typeof highlightUpdateSchema>
export type SubredditFormData = z.infer<typeof subredditCreateSchema>
export type SubredditUpdateData = z.infer<typeof subredditUpdateSchema>
