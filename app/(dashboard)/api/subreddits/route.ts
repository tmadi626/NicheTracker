import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nicheId = searchParams.get('nicheId')
    const supabase = await createClient()

    let query = supabase
      .from('subreddits')
      .select('*')
      .order('subscriber_count', { ascending: false })

    if (nicheId) {
      query = query.eq('niche_id', nicheId)
    }

    const { data: subreddits, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: subreddits || []
    })
  } catch (error) {
    console.error('Error fetching subreddits:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subreddits' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, url, subscriberCount, notes, nicheId } = body

    if (!name || !url || !nicheId) {
      return NextResponse.json(
        { success: false, error: 'Name, url, and nicheId are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: subreddit, error } = await supabase
      .from('subreddits')
      .insert({
        name,
        url,
        subscriber_count: subscriberCount || 0,
        notes: notes || null,
        niche_id: nicheId
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: subreddit
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating subreddit:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create subreddit' },
      { status: 500 }
    )
  }
}
