import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get niches
    const { data: niches, error: nicheError } = await supabase
      .from('niches')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (nicheError) throw nicheError
    if (!niches) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }
    
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

    return NextResponse.json({
      success: true,
      data: nichesWithCounts
    })
  } catch (error) {
    console.error('Error fetching niches:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch niches' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { slugify } = await import('@/lib/utils')
    
    const slug = slugify(name)
    
    const { data: niche, error } = await supabase
      .from('niches')
      .insert({
        name,
        slug,
        description: description || null
      })
      .select()
      .single()

    if (error) throw error

    // Get counts for the new niche
    const [ideasResult, highlightsResult, subredditsResult] = await Promise.all([
      supabase.from('ideas').select('id', { count: 'exact' }).eq('niche_id', niche.id),
      supabase.from('highlights').select('id', { count: 'exact' }).eq('niche_id', niche.id),
      supabase.from('subreddits').select('id', { count: 'exact' }).eq('niche_id', niche.id)
    ])

    const nicheWithCounts = {
      ...niche,
      ideasCount: ideasResult.count || 0,
      highlightsCount: highlightsResult.count || 0,
      subredditsCount: subredditsResult.count || 0
    }

    return NextResponse.json({
      success: true,
      data: nicheWithCounts
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating niche:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create niche' },
      { status: 500 }
    )
  }
}
