import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: niche, error } = await supabase
      .from('niches')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !niche) {
      return NextResponse.json(
        { success: false, error: 'Niche not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: niche
    })
  } catch (error) {
    console.error('Error fetching niche:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch niche' },
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
      .update({
        name,
        slug,
        description: description || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: niche
    })
  } catch (error) {
    console.error('Error updating niche:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update niche' },
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
      .from('niches')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Niche deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting niche:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete niche' },
      { status: 500 }
    )
  }
}
