import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { UpdateDeliverable } from '@/types/database'
import { createTaskAssignmentNotification, createTaskCompletionNotification, createTaskStatusChangeNotification } from '@/lib/notification-service'

// GET /api/deliverables/[id] - Fetch a specific deliverable
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      .eq('id', id)
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      .eq('id', id)
      .single()

    // Update the deliverable
    const { data, error } = await supabase
      .from('deliverables')
      .update(updateData)
      .eq('id', id)
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
          deliverable_id: id,
          action: 'Status updated to',
          old_value: currentDeliverable.status,
          new_value: updateData.status,
          changed_by: user.id
        })
      }
      
      if (currentDeliverable.assignee_id !== updateData.assignee_id) {
        historyEntries.push({
          deliverable_id: id,
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

    // Send email notifications for task completion
    if (updateData.status === 'done' && currentDeliverable?.status !== 'done') {
      try {
        // Send congratulations to team member
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'congratulations',
            taskData: data,
            assigneeName: updateData.assignee_name || 'Unknown'
          })
        });

        // Send completion confirmation to company
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'completion',
            taskData: data,
            assigneeName: updateData.assignee_name || 'Unknown'
          })
        });

        // Create notification for task completion
        if (updateData.assignee_name && updateData.assignee_name !== 'Unassigned') {
          await createTaskCompletionNotification(
            updateData.assignee_name,
            data.title,
            id,
            data.project_area
          );
        }

        console.log('Completion notifications sent successfully');
      } catch (emailError) {
        console.error('Failed to send completion notifications:', emailError);
        // Don't fail the update if email fails
      }
    }

    // Create notification for task assignment
    if (updateData.assignee_name !== undefined && 
        updateData.assignee_name !== currentDeliverable?.assignee_name &&
        updateData.assignee_name && 
        updateData.assignee_name !== 'Unassigned') {
      try {
        await createTaskAssignmentNotification(
          updateData.assignee_name,
          data.title,
          id,
          data.project_area,
          data.due_date
        );
        console.log('Task assignment notification created successfully');
      } catch (notificationError) {
        console.error('Failed to create assignment notification:', notificationError);
        // Don't fail the update if notification fails
      }
    }

    // Create notification for status change
    if (updateData.status && updateData.status !== currentDeliverable?.status) {
      try {
        if (updateData.assignee_name && updateData.assignee_name !== 'Unassigned') {
          await createTaskStatusChangeNotification(
            updateData.assignee_name,
            data.title,
            id,
            currentDeliverable?.status || 'unknown',
            updateData.status
          );
          console.log('Task status change notification created successfully');
        }
      } catch (notificationError) {
        console.error('Failed to create status change notification:', notificationError);
        // Don't fail the update if notification fails
      }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('deliverables')
      .delete()
      .eq('id', id)

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