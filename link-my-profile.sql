-- Link your existing auth user to profiles and team_members
-- Run this in Supabase SQL Editor

-- Step 1: Check what we have
SELECT 'Auth Users:' as step;
SELECT id, email, created_at FROM auth.users;

SELECT 'Existing Profiles:' as step;
SELECT id, email, full_name, avatar_url FROM profiles;

SELECT 'Team Members:' as step;
SELECT id, name, email, profile_id FROM team_members;

-- Step 2: Create profile for auth user if it doesn't exist
-- Replace 'chawana.maseka@gmail.com' with your actual email if different
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'Chawana Maseka'),
  'Project Manager'
FROM auth.users u
WHERE u.email = 'chawana.maseka@gmail.com'
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  full_name = COALESCE(profiles.full_name, EXCLUDED.full_name);

-- Step 3: Link profile to team_members
UPDATE team_members tm
SET profile_id = u.id
FROM auth.users u
WHERE tm.email = u.email
  AND tm.email = 'chawana.maseka@gmail.com';

-- Step 4: Verify the linking
SELECT 
  tm.name,
  tm.email,
  tm.profile_id,
  p.full_name as profile_name,
  p.avatar_url as profile_picture,
  CASE 
    WHEN tm.profile_id IS NOT NULL THEN '✅ Linked'
    ELSE '❌ Not Linked'
  END as status
FROM team_members tm
LEFT JOIN profiles p ON tm.profile_id = p.id
WHERE tm.email = 'chawana.maseka@gmail.com';

