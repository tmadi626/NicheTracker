import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

type Tables = Database['public']['Tables']
type Niche = Tables['niches']['Row']
type Idea = Tables['ideas']['Row']
type Highlight = Tables['highlights']['Row']
type Subreddit = Tables['subreddits']['Row']

// Niche operations
export async function getNiches(): Promise<(Niche & { ideasCount: number; highlightsCount: number; subredditsCount: number })[]> {
  const supabase = createClient()
  
  // Get niches with counts
  const { data: niches, error: nicheError } = await supabase
    .from('niches')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (nicheError) throw nicheError
  if (!niches) return []
  
  // Get counts for each niche
  const nichesWithCounts = await Promise.all(
    niches.map(async (niche) => {
      try {
        const [ideasResult, highlightsResult, subredditsResult] = await Promise.all([
          supabase.from('ideas').select('id', { count: 'exact' }).eq('niche_id', niche.id),
          supabase.from('highlights').select('id', { count: 'exact' }).eq('niche_id', niche.id),
          supabase.from('subreddits').select('id', { count: 'exact' }).eq('niche_id', niche.id)
        ])
        
        return {
          ...niche,
          ideasCount: ideasResult.count || 0,
          highlightsCount: highlightsResult.count || 0,
          subredditsCount: subredditsResult.count || 0
        }
      } catch (error) {
        console.error(`Error getting counts for niche ${niche.id}:`, error)
        return {
          ...niche,
          ideasCount: 0,
          highlightsCount: 0,
          subredditsCount: 0
        }
      }
    })
  )
  
  return nichesWithCounts
}

export async function getNicheBySlug(slug: string): Promise<Niche | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('niches')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) return null
  return data
}

export async function createNiche(niche: {
  name: string
  slug: string
  description?: string
}): Promise<Niche> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('niches')
    .insert(niche)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateNiche(id: string, updates: Partial<Niche>): Promise<Niche> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('niches')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteNiche(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('niches')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Idea operations
export async function getIdeasByNiche(nicheId: string): Promise<Idea[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('niche_id', nicheId)
    .order('ice_score', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getIdeaById(id: string): Promise<Idea | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data
}

export async function createIdea(idea: {
  title: string
  problem?: string
  solution?: string
  audience?: string
  status?: string
  impact?: number
  confidence?: number
  effort?: number
  notes?: string
  source_url?: string
  tags?: string
  niche_id: string
}): Promise<Idea> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ideas')
    .insert(idea)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateIdea(id: string, updates: Partial<Idea>): Promise<Idea> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ideas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteIdea(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('ideas')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Highlight operations
export async function getHighlightsByNiche(nicheId: string): Promise<Highlight[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('highlights')
    .select('*')
    .eq('niche_id', nicheId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getHighlightById(id: string): Promise<Highlight | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('highlights')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data
}

export async function createHighlight(highlight: {
  quote: string
  permalink?: string
  subreddit?: string
  author?: string
  upvotes?: number
  notes?: string
  tags?: string
  niche_id: string
  idea_id?: string
}): Promise<Highlight> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('highlights')
    .insert(highlight)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateHighlight(id: string, updates: Partial<Highlight>): Promise<Highlight> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('highlights')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteHighlight(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('highlights')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Subreddit operations
export async function getSubredditsByNiche(nicheId: string): Promise<Subreddit[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('subreddits')
    .select('*')
    .eq('niche_id', nicheId)
    .order('subscriber_count', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getSubredditById(id: string): Promise<Subreddit | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('subreddits')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data
}

export async function createSubreddit(subreddit: {
  name: string
  url: string
  subscriber_count?: number
  notes?: string
  tags?: string
  niche_id: string
}): Promise<Subreddit> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('subreddits')
    .insert(subreddit)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateSubreddit(id: string, updates: Partial<Subreddit>): Promise<Subreddit> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('subreddits')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteSubreddit(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('subreddits')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
