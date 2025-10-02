-- Add notifications table for tracking user notifications
-- Migration for Project CR Dashboard Notifications System

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('task_assigned', 'task_completed', 'task_status_changed', 'comment_added', 'due_date_reminder', 'task_updated')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_deliverable_id UUID REFERENCES deliverables(id) ON DELETE CASCADE,
  related_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- For mentions, assignments, etc.
  metadata JSONB DEFAULT '{}', -- Store additional context like old/new values, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true); -- Allow system to create notifications for any user

CREATE POLICY "System can delete notifications" ON notifications
  FOR DELETE USING (true); -- Allow system to clean up old notifications

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_is_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_related_deliverable_id ON notifications(related_deliverable_id);

-- Create function to automatically create notifications for task assignments
CREATE OR REPLACE FUNCTION create_task_assignment_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if assignee_name changed and is not null/empty
  IF NEW.assignee_name IS DISTINCT FROM OLD.assignee_name 
     AND NEW.assignee_name IS NOT NULL 
     AND NEW.assignee_name != '' THEN
    
    -- Find the user_id for the assignee_name
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      related_deliverable_id,
      metadata
    ) 
    SELECT 
      p.id,
      'task_assigned',
      'Task Assigned',
      'You have been assigned to "' || NEW.title || '"',
      NEW.id,
      jsonb_build_object(
        'assignee_name', NEW.assignee_name,
        'project_area', NEW.project_area,
        'due_date', NEW.due_date
      )
    FROM profiles p
    WHERE p.full_name = NEW.assignee_name
    LIMIT 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically create notifications for task completions
CREATE OR REPLACE FUNCTION create_task_completion_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if status changed to 'done'
  IF NEW.status = 'done' AND OLD.status != 'done' THEN
    
    -- Create notification for the assignee
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      related_deliverable_id,
      metadata
    ) 
    SELECT 
      p.id,
      'task_completed',
      'Task Completed',
      'Congratulations! You completed "' || NEW.title || '"',
      NEW.id,
      jsonb_build_object(
        'assignee_name', NEW.assignee_name,
        'project_area', NEW.project_area,
        'completed_at', NOW()
      )
    FROM profiles p
    WHERE p.full_name = NEW.assignee_name
    AND NEW.assignee_name IS NOT NULL
    AND NEW.assignee_name != ''
    LIMIT 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic notification creation
DROP TRIGGER IF EXISTS trigger_task_assignment_notification ON deliverables;
CREATE TRIGGER trigger_task_assignment_notification
  AFTER UPDATE ON deliverables
  FOR EACH ROW EXECUTE FUNCTION create_task_assignment_notification();

DROP TRIGGER IF EXISTS trigger_task_completion_notification ON deliverables;
CREATE TRIGGER trigger_task_completion_notification
  AFTER UPDATE ON deliverables
  FOR EACH ROW EXECUTE FUNCTION create_task_completion_notification();

-- Create function to clean up old notifications (optional, for maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  -- Delete notifications older than 30 days that have been read
  DELETE FROM notifications 
  WHERE created_at < NOW() - INTERVAL '30 days' 
  AND is_read = true;
END;
$$ LANGUAGE plpgsql;

-- Add comment to table
COMMENT ON TABLE notifications IS 'Stores user notifications for task assignments, completions, and other events';
