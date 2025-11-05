import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nicheId = searchParams.get('nicheId')
    const ideaId = searchParams.get('ideaId')
    const supabase = await createClient()

    let query = supabase
      .from('highlights')
      .select('*')
      .order('created_at', { ascending: false })

    if (nicheId) {
      query = query.eq('niche_id', nicheId)
    }

    if (ideaId) {
      query = query.eq('idea_id', ideaId)
    }

    const { data: highlights, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: highlights || []
    })
  } catch (error) {
    console.error('Error fetching highlights:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch highlights' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      quote, 
      permalink, 
      subreddit, 
      author, 
      upvotes, 
      notes, 
      tags, 
      nicheId, 
      ideaId 
    } = body

    if (!quote || !nicheId) {
      return NextResponse.json(
        { success: false, error: 'Quote and nicheId are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: highlight, error } = await supabase
      .from('highlights')
      .insert({
        quote,
        permalink: permalink || null,
        subreddit: subreddit || null,
        author: author || null,
        upvotes: upvotes || null,
        notes: notes || null,
        tags: tags || null,
        niche_id: nicheId,
        idea_id: ideaId || null
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: highlight
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating highlight:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create highlight' },
      { status: 500 }
    )
  }
}
