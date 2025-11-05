import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nicheId = searchParams.get('nicheId')
    const supabase = await createClient()

    let query = supabase
      .from('ideas')
      .select('*')
      .order('ice_score', { ascending: false })

    if (nicheId) {
      query = query.eq('niche_id', nicheId)
    }

    const { data: ideas, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: ideas || []
    })
  } catch (error) {
    console.error('Error fetching ideas:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ideas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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
      tags, 
      nicheId 
    } = body

    if (!title || !nicheId) {
      return NextResponse.json(
        { success: false, error: 'Title and nicheId are required' },
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
      .insert({
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
        niche_id: nicheId
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: idea
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating idea:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create idea' },
      { status: 500 }
    )
  }
}
