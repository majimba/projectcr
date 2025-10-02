-- Fix profile and task assignment issues
-- Run this in Supabase SQL Editor

-- Step 1: Find your user ID from auth
SELECT 'Your auth user:' as step, id, email FROM auth.users LIMIT 1;

-- Step 2: Create profile for the logged-in user
-- IMPORTANT: Replace 'YOUR_USER_ID' with the ID from Step 1
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  id,
  email,
  'Chawana Maseka' as full_name,  -- Correct spelling
  'user' as role
FROM auth.users
WHERE email LIKE '%chawana%' OR email LIKE '%luminary%'
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name;

-- Step 3: Fix typo in task assignments (Masaka → Maseka)
UPDATE deliverables
SET assignee_name = 'Chawana Maseka'
WHERE assignee_name = 'Chawana Masaka';

-- Step 4: Verify changes
SELECT 'Profiles created:' as step, COUNT(*) as count FROM profiles;
SELECT 'Tasks with correct name:' as step, COUNT(*) as count 
FROM deliverables WHERE assignee_name = 'Chawana Maseka';

-- Step 5: Show your profile
SELECT 'Your profile:' as step, * FROM profiles;
