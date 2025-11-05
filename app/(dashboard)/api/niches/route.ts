import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getNiches } from '@/lib/queries'

export async function GET(request: NextRequest) {
  try {
    const niches = await getNiches()

    return NextResponse.json({
      success: true,
      data: niches
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
