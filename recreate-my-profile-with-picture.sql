-- Recreate profile with your uploaded picture and link to team_members
-- Run this in Supabase SQL Editor

-- Step 1: Check auth user
SELECT 'Your Auth User:' as step;
SELECT id, email, created_at, 
       raw_user_meta_data->>'avatar_url' as metadata_avatar
FROM auth.users
WHERE email = 'chawana.maseka@gmail.com';

-- Step 2: Create/update profile with all your info
-- Note: You'll need to update the avatar_url with your actual uploaded image URL
INSERT INTO profiles (id, email, full_name, role, avatar_url)
SELECT 
  u.id,
  u.email,
  'Chawana Maseka',
  'Project Manager',
  u.raw_user_meta_data->>'avatar_url'  -- This gets it from your uploaded picture
FROM auth.users u
WHERE u.email = 'chawana.maseka@gmail.com'
ON CONFLICT (id) DO UPDATE
SET 
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
  email = EXCLUDED.email;

-- Step 3: Link to team_members
UPDATE team_members tm
SET profile_id = u.id
FROM auth.users u
WHERE tm.email = u.email
  AND u.email = 'chawana.maseka@gmail.com';

-- Step 4: Verify everything is linked
SELECT 
  'Profile Created & Linked:' as step,
  p.full_name,
  p.email,
  CASE 
    WHEN p.avatar_url IS NOT NULL THEN '✅ Has avatar: ' || substring(p.avatar_url, 1, 50) || '...'
    ELSE '❌ No avatar'
  END as avatar_status,
  tm.name as team_member_name,
  CASE 
    WHEN tm.profile_id IS NOT NULL THEN '✅ Linked to team_members'
    ELSE '❌ Not linked'
  END as team_link_status
FROM profiles p
LEFT JOIN team_members tm ON tm.profile_id = p.id
WHERE p.email = 'chawana.maseka@gmail.com';

-- Step 5: Clean up duplicate notifications (if any)
WITH duplicates AS (
  SELECT id, 
         ROW_NUMBER() OVER (
           PARTITION BY user_id, type, related_deliverable_id 
           ORDER BY created_at DESC
         ) as rn
  FROM notifications
)
DELETE FROM notifications
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

SELECT 'Duplicate notifications cleaned' as step;

