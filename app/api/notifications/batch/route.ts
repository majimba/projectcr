import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// PUT /api/notifications/batch - Mark multiple notifications as read
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, notification_ids } = body;

    // Validate input
    if (!action || !['mark_read', 'mark_unread', 'delete'].includes(action)) {
      return NextResponse.json({ 
        error: 'Invalid action. Must be: mark_read, mark_unread, or delete' 
      }, { status: 400 });
    }

    if (!Array.isArray(notification_ids) || notification_ids.length === 0) {
      return NextResponse.json({ 
        error: 'notification_ids must be a non-empty array' 
      }, { status: 400 });
    }

    // Validate all notification IDs are UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const invalidIds = notification_ids.filter(id => !uuidRegex.test(id));
    if (invalidIds.length > 0) {
      return NextResponse.json({ 
        error: `Invalid notification IDs: ${invalidIds.join(', ')}` 
      }, { status: 400 });
    }

    let query;
    const now = new Date().toISOString();

    switch (action) {
      case 'mark_read':
        query = supabase
          .from('notifications')
          .update({ 
            is_read: true, 
            read_at: now 
          })
          .in('id', notification_ids)
          .eq('user_id', user.id);
        break;

      case 'mark_unread':
        query = supabase
          .from('notifications')
          .update({ 
            is_read: false, 
            read_at: null 
          })
          .in('id', notification_ids)
          .eq('user_id', user.id);
        break;

      case 'delete':
        query = supabase
          .from('notifications')
          .delete()
          .in('id', notification_ids)
          .eq('user_id', user.id);
        break;

      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 });
    }

    if (!query) {
      return NextResponse.json({ 
        error: 'Invalid action' 
      }, { status: 400 });
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error performing batch ${action}:`, error);
      return NextResponse.json({ 
        error: `Failed to ${action.replace('_', ' ')} notifications` 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully performed ${action.replace('_', ' ')} on ${notification_ids.length} notification(s)`,
      affectedCount: notification_ids.length
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
