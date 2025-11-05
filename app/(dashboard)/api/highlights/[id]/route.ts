import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: highlight, error } = await supabase
      .from('highlights')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !highlight) {
      return NextResponse.json(
        { success: false, error: 'Highlight not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: highlight
    })
  } catch (error) {
    console.error('Error fetching highlight:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch highlight' },
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
    const { 
      quote, 
      permalink, 
      subreddit, 
      author, 
      upvotes, 
      notes, 
      tags, 
      ideaId 
    } = body

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: highlight, error } = await supabase
      .from('highlights')
      .update({
        quote,
        permalink: permalink || null,
        subreddit: subreddit || null,
        author: author || null,
        upvotes: upvotes || null,
        notes: notes || null,
        tags: tags || null,
        idea_id: ideaId || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: highlight
    })
  } catch (error) {
    console.error('Error updating highlight:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update highlight' },
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
      .from('highlights')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Highlight deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting highlight:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete highlight' },
      { status: 500 }
    )
  }
}
