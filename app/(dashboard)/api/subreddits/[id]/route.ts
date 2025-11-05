import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: subreddit, error } = await supabase
      .from('subreddits')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !subreddit) {
      return NextResponse.json(
        { success: false, error: 'Subreddit not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: subreddit
    })
  } catch (error) {
    console.error('Error fetching subreddit:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subreddit' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, url, subscriberCount, notes } = body

    if (!name || !url) {
      return NextResponse.json(
        { success: false, error: 'Name and url are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: subreddit, error } = await supabase
      .from('subreddits')
      .update({
        name,
        url,
        subscriber_count: subscriberCount || 0,
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: subreddit
    })
  } catch (error) {
    console.error('Error updating subreddit:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update subreddit' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('subreddits')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Subreddit deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting subreddit:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete subreddit' },
      { status: 500 }
    )
  }
}
