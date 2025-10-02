-- Backfill notifications for existing task assignments and completions
-- Run this in your Supabase SQL Editor to create notifications for existing tasks

-- Create notifications for all assigned tasks
INSERT INTO notifications (user_id, type, title, message, related_deliverable_id, metadata, created_at, is_read)
SELECT 
  p.id as user_id,
  'task_assigned' as type,
  'Task Assigned' as title,
  'You have been assigned to "' || d.title || '"' as message,
  d.id as related_deliverable_id,
  jsonb_build_object(
    'assignee_name', d.assignee_name,
    'project_area', d.project_area,
    'due_date', d.due_date,
    'backfilled', true
  ) as metadata,
  d.created_at as created_at,
  false as is_read
FROM deliverables d
JOIN profiles p ON p.full_name = d.assignee_name
WHERE d.assignee_name IS NOT NULL 
  AND d.assignee_name != ''
  AND d.assignee_name != 'Unassigned'
  AND NOT EXISTS (
    SELECT 1 FROM notifications n 
    WHERE n.related_deliverable_id = d.id 
    AND n.type = 'task_assigned'
  );

-- Create notifications for all completed tasks
INSERT INTO notifications (user_id, type, title, message, related_deliverable_id, metadata, created_at, is_read)
SELECT 
  p.id as user_id,
  'task_completed' as type,
  'Task Completed' as title,
  'Congratulations! You completed "' || d.title || '"' as message,
  d.id as related_deliverable_id,
  jsonb_build_object(
    'assignee_name', d.assignee_name,
    'project_area', d.project_area,
    'completed_at', d.updated_at,
    'backfilled', true
  ) as metadata,
  d.updated_at as created_at,
  false as is_read
FROM deliverables d
JOIN profiles p ON p.full_name = d.assignee_name
WHERE d.status = 'done'
  AND d.assignee_name IS NOT NULL 
  AND d.assignee_name != ''
  AND d.assignee_name != 'Unassigned'
  AND NOT EXISTS (
    SELECT 1 FROM notifications n 
    WHERE n.related_deliverable_id = d.id 
    AND n.type = 'task_completed'
  );

-- Show summary
SELECT 
  type,
  COUNT(*) as count
FROM notifications
GROUP BY type
ORDER BY type;
