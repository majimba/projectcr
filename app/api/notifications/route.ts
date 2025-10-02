import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { NewNotification } from '@/types/database';

// GET /api/notifications - Fetch user's notifications
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      // Return empty notifications array instead of 401 to prevent HTML error pages
      return NextResponse.json({ 
        notifications: [], 
        unreadCount: 0, 
        totalCount: 0 
      });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unread_only') === 'true';

    // Build query
    let query = supabase
      .from('notifications')
      .select(`
        *,
        related_deliverable:deliverables(
          id,
          title,
          status,
          project_area
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter for unread only if requested
    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data: notifications, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      // Return empty notifications array instead of 500 to prevent HTML error pages
      return NextResponse.json({ 
        notifications: [], 
        unreadCount: 0, 
        totalCount: 0,
        error: 'Failed to fetch notifications'
      });
    }

    // Get unread count
    const { count: unreadCount, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (countError) {
      console.error('Error fetching unread count:', countError);
    }

    return NextResponse.json({
      notifications: notifications || [],
      unreadCount: unreadCount || 0,
      totalCount: notifications?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    // Return empty notifications array instead of 500 to prevent HTML error pages
    return NextResponse.json({ 
      notifications: [], 
      unreadCount: 0, 
      totalCount: 0,
      error: 'Internal server error'
    });
  }
}

// POST /api/notifications - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { user_id, type, title, message, related_deliverable_id, related_user_id, metadata } = body;

    // Validate required fields
    if (!user_id || !type || !title || !message) {
      return NextResponse.json({ 
        error: 'Missing required fields: user_id, type, title, message' 
      }, { status: 400 });
    }

    // Validate notification type
    const validTypes = ['task_assigned', 'task_completed', 'task_status_changed', 'comment_added', 'due_date_reminder', 'task_updated'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ 
        error: `Invalid notification type. Must be one of: ${validTypes.join(', ')}` 
      }, { status: 400 });
    }

    const notificationData: NewNotification = {
      user_id,
      type,
      title,
      message,
      related_deliverable_id: related_deliverable_id || null,
      related_user_id: related_user_id || null,
      metadata: metadata || {},
      is_read: false
    };

    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      notification: data 
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
