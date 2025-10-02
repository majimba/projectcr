-- Copy and paste this ENTIRE script into Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/dmbavfwdvjbbtvpotvsn/editor/sql

-- Step 1: Check if any auth users exist
SELECT 'Step 1: Auth Users' as info, id, email FROM auth.users;

-- Step 2: If you see your user above, copy the ID and replace YOUR_USER_ID below
-- If NO users appear, you need to sign up first!

-- CREATE YOUR PROFILE (uncomment and replace YOUR_USER_ID):
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES (
--   'YOUR_USER_ID',  -- Replace with your actual user ID from Step 1
--   'chawana.maseka@gmail.com',
--   'Chawana Maseka',
--   'user'
-- );

-- Step 3: Fix task name typos
UPDATE deliverables
SET assignee_name = 'Chawana Maseka'
WHERE assignee_name = 'Chawana Masaka';

-- Step 4: Verify everything
SELECT 'Profiles:' as info, * FROM profiles;
SELECT 'Tasks for Chawana:' as info, COUNT(*) as count 
FROM deliverables WHERE assignee_name = 'Chawana Maseka';

-- INSTRUCTIONS:
-- 1. If Step 1 shows NO users: You need to sign up first at http://localhost:3001
-- 2. If Step 1 shows your user: Uncomment the INSERT statement, replace YOUR_USER_ID, run it
-- 3. After creating profile, run in terminal: node backfill-notifications.js
