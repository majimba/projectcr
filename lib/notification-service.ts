import { createClient } from '@/lib/supabase-server';
import { NewNotification } from '@/types/database';

export interface CreateNotificationParams {
  userId: string;
  type: 'task_assigned' | 'task_completed' | 'task_status_changed' | 'comment_added' | 'due_date_reminder' | 'task_updated';
  title: string;
  message: string;
  relatedDeliverableId?: string;
  relatedUserId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const notificationData: NewNotification = {
      user_id: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      related_deliverable_id: params.relatedDeliverableId || null,
      related_user_id: params.relatedUserId || null,
      metadata: params.metadata || {},
      is_read: false
    };

    const { error } = await supabase
      .from('notifications')
      .insert(notificationData);

    if (error) {
      console.error('Error creating notification:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error creating notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

/**
 * Create a notification for task assignment
 */
export async function createTaskAssignmentNotification(
  assigneeName: string,
  taskTitle: string,
  taskId: string,
  projectArea: string,
  dueDate?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Find the user by their full name
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('full_name', assigneeName)
      .single();

    if (profileError || !profile) {
      console.warn(`User not found for assignee: ${assigneeName}`);
      return { success: false, error: 'User not found' };
    }

    return await createNotification({
      userId: profile.id,
      type: 'task_assigned',
      title: 'Task Assigned',
      message: `You have been assigned to "${taskTitle}"`,
      relatedDeliverableId: taskId,
      metadata: {
        assignee_name: assigneeName,
        project_area: projectArea,
        due_date: dueDate
      }
    });
  } catch (error) {
    console.error('Error creating task assignment notification:', error);
    return { success: false, error: 'Failed to create task assignment notification' };
  }
}

/**
 * Create a notification for task completion
 */
export async function createTaskCompletionNotification(
  assigneeName: string,
  taskTitle: string,
  taskId: string,
  projectArea: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Find the user by their full name
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('full_name', assigneeName)
      .single();

    if (profileError || !profile) {
      console.warn(`User not found for assignee: ${assigneeName}`);
      return { success: false, error: 'User not found' };
    }

    return await createNotification({
      userId: profile.id,
      type: 'task_completed',
      title: 'Task Completed',
      message: `Congratulations! You completed "${taskTitle}"`,
      relatedDeliverableId: taskId,
      metadata: {
        assignee_name: assigneeName,
        project_area: projectArea,
        completed_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating task completion notification:', error);
    return { success: false, error: 'Failed to create task completion notification' };
  }
}

/**
 * Create a notification for task status change
 */
export async function createTaskStatusChangeNotification(
  assigneeName: string,
  taskTitle: string,
  taskId: string,
  oldStatus: string,
  newStatus: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Find the user by their full name
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('full_name', assigneeName)
      .single();

    if (profileError || !profile) {
      console.warn(`User not found for assignee: ${assigneeName}`);
      return { success: false, error: 'User not found' };
    }

    return await createNotification({
      userId: profile.id,
      type: 'task_status_changed',
      title: 'Task Status Updated',
      message: `"${taskTitle}" status changed from ${oldStatus} to ${newStatus}`,
      relatedDeliverableId: taskId,
      metadata: {
        assignee_name: assigneeName,
        old_status: oldStatus,
        new_status: newStatus
      }
    });
  } catch (error) {
    console.error('Error creating task status change notification:', error);
    return { success: false, error: 'Failed to create task status change notification' };
  }
}
