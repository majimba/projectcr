import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { UpdateDeliverable } from '@/types/database'

// GET /api/deliverables/[id] - Fetch a specific deliverable
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: deliverable, error } = await supabase
      .from('deliverables')
      .select(`
        *,
        assignee:profiles!deliverables_assignee_id_fkey(full_name, avatar_url),
        comments:deliverable_comments(
          id,
          content,
          created_at,
          author:profiles!deliverable_comments_author_id_fkey(full_name, avatar_url)
        ),
        history:deliverable_history(
          id,
          action,
          old_value,
          new_value,
          created_at,
          changed_by:profiles!deliverable_history_changed_by_fkey(full_name)
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching deliverable:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!deliverable) {
      return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 })
    }

    return NextResponse.json(deliverable, { status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/deliverables/[id] - Update a specific deliverable
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const updateData: UpdateDeliverable = {
      title: body.title,
      description: body.description,
      status: body.status,
      assignee_id: body.assignee_id,
      assignee_name: body.assignee_name,
      project_area: body.project_area,
      due_date: body.due_date,
      week_number: body.week_number,
      document_link: body.document_link,
      progress: body.progress
    }

    // Get the current deliverable to track changes
    const { data: currentDeliverable } = await supabase
      .from('deliverables')
      .select('*')
      .eq('id', params.id)
      .single()

    // Update the deliverable
    const { data, error } = await supabase
      .from('deliverables')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        assignee:profiles!deliverables_assignee_id_fkey(full_name, avatar_url)
      `)
      .single()

    if (error) {
      console.error('Error updating deliverable:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 })
    }

    // Log changes in history
    const historyEntries = []
    
    if (currentDeliverable) {
      if (currentDeliverable.status !== updateData.status) {
        historyEntries.push({
          deliverable_id: params.id,
          action: 'Status updated to',
          old_value: currentDeliverable.status,
          new_value: updateData.status,
          changed_by: user.id
        })
      }
      
      if (currentDeliverable.assignee_id !== updateData.assignee_id) {
        historyEntries.push({
          deliverable_id: params.id,
          action: 'Assignee changed to',
          old_value: currentDeliverable.assignee_name,
          new_value: updateData.assignee_name,
          changed_by: user.id
        })
      }
    }

    if (historyEntries.length > 0) {
      await supabase
        .from('deliverable_history')
        .insert(historyEntries)
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/deliverables/[id] - Delete a specific deliverable
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('deliverables')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting deliverable:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Deliverable deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
