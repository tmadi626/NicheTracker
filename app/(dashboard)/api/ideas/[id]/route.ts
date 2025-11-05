import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: idea, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !idea) {
      return NextResponse.json(
        { success: false, error: 'Idea not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: idea
    })
  } catch (error) {
    console.error('Error fetching idea:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch idea' },
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
      title, 
      problem, 
      solution, 
      audience, 
      status, 
      impact, 
      confidence, 
      effort, 
      notes, 
      sourceUrl, 
      tags 
    } = body

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { calculateIceScore } = await import('@/lib/utils')

    const impactValue = impact || 1
    const confidenceValue = confidence || 1
    const effortValue = effort || 1
    const iceScore = calculateIceScore(impactValue, confidenceValue, effortValue)

    const { data: idea, error } = await supabase
      .from('ideas')
      .update({
        title,
        problem: problem || null,
        solution: solution || null,
        audience: audience || null,
        status: (status || 'Backlog') as 'Backlog' | 'Exploring' | 'Validating' | 'Building' | 'Launched',
        impact: impactValue,
        confidence: confidenceValue,
        effort: effortValue,
        ice_score: iceScore,
        notes: notes || null,
        source_url: sourceUrl || null,
        tags: tags || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: idea
    })
  } catch (error) {
    console.error('Error updating idea:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update idea' },
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
      .from('ideas')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Idea deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting idea:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete idea' },
      { status: 500 }
    )
  }
}
