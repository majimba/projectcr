import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { NewDeliverable } from '@/types/database'

// GET /api/deliverables - Fetch all deliverables
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch deliverables with assignee information
    const { data: deliverables, error } = await supabase
      .from('deliverables')
      .select(`
        *,
        assignee:profiles!deliverables_assignee_id_fkey(full_name, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching deliverables:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(deliverables, { status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/deliverables - Create a new deliverable
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const newDeliverable: NewDeliverable = {
      title: body.title,
      description: body.description || null,
      status: body.status || 'not-started',
      assignee_id: body.assignee_id || null,
      assignee_name: body.assignee_name || null,
      project_area: body.project_area,
      due_date: body.due_date || null,
      week_number: body.week_number || null,
      document_link: body.document_link || null,
      progress: body.progress || 0,
      created_by: user.id
    }

    // Validate required fields
    if (!newDeliverable.title || !newDeliverable.project_area) {
      return NextResponse.json({ error: 'Title and project area are required' }, { status: 400 })
    }

    // Insert the new deliverable
    const { data, error } = await supabase
      .from('deliverables')
      .insert([newDeliverable])
      .select(`
        *,
        assignee:profiles!deliverables_assignee_id_fkey(full_name, avatar_url)
      `)
      .single()

    if (error) {
      console.error('Error creating deliverable:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log the creation in history
    await supabase
      .from('deliverable_history')
      .insert([{
        deliverable_id: data.id,
        action: 'Task created',
        changed_by: user.id
      }])

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
