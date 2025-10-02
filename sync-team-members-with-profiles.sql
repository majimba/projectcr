-- Script to manually sync team members with existing profiles
-- Run this if team members need to be linked with their profiles

-- Show current status
SELECT 
  tm.name AS team_member_name,
  tm.email AS team_member_email,
  tm.profile_id,
  p.full_name AS profile_name,
  p.email AS profile_email,
  CASE 
    WHEN tm.profile_id IS NOT NULL THEN '✅ Linked'
    WHEN p.id IS NOT NULL THEN '🔄 Can be linked'
    ELSE '❌ No profile found'
  END AS status
FROM team_members tm
LEFT JOIN profiles p ON tm.email = p.email
ORDER BY tm.joined_at;

-- Update team_members to link with existing profiles based on email
UPDATE team_members tm
SET profile_id = p.id
FROM profiles p
WHERE tm.email = p.email
  AND tm.profile_id IS NULL;

-- Verify the update
SELECT 
  tm.name AS team_member_name,
  tm.email AS team_member_email,
  tm.profile_id,
  p.full_name AS profile_name,
  p.avatar_url,
  CASE 
    WHEN tm.profile_id IS NOT NULL THEN '✅ Successfully Linked'
    ELSE '❌ Not linked'
  END AS status
FROM team_members tm
LEFT JOIN profiles p ON tm.profile_id = p.id
ORDER BY tm.joined_at;

