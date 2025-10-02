-- Remove duplicate notifications and add constraint to prevent future duplicates

-- Step 1: View current duplicates
SELECT 
  'Current Duplicates:' as step,
  user_id,
  type,
  related_deliverable_id,
  COUNT(*) as count
FROM notifications
GROUP BY user_id, type, related_deliverable_id
HAVING COUNT(*) > 1;

-- Step 2: Delete duplicates, keeping only the most recent one
WITH duplicates AS (
  SELECT id, 
         ROW_NUMBER() OVER (
           PARTITION BY user_id, type, related_deliverable_id 
           ORDER BY created_at DESC
         ) as rn
  FROM notifications
  WHERE related_deliverable_id IS NOT NULL
)
DELETE FROM notifications
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- Step 3: Create unique index to prevent future duplicates for task-related notifications
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_task_notifications 
ON notifications (user_id, type, related_deliverable_id) 
WHERE related_deliverable_id IS NOT NULL;

-- Step 4: Verify cleanup
SELECT 
  'After Cleanup:' as step,
  user_id,
  type,
  COUNT(*) as count
FROM notifications
GROUP BY user_id, type
ORDER BY type;

