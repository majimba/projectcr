-- Fix profile creation and task name typos
-- This ensures profiles are created and task names are corrected

-- Create profiles for all auth users (especially those with chawana emails)
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email LIKE '%chawana%' THEN 'Chawana Maseka'
    ELSE COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1))
  END as full_name,
  'user' as role
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO UPDATE 
SET full_name = CASE 
  WHEN EXCLUDED.email LIKE '%chawana%' THEN 'Chawana Maseka'
  ELSE profiles.full_name
END;

-- Fix typo in deliverables: Chawana Masaka → Chawana Maseka
UPDATE deliverables
SET assignee_name = 'Chawana Maseka'
WHERE assignee_name = 'Chawana Masaka';

-- Show summary
SELECT 
  'Profiles:' as table_name, 
  COUNT(*) as count 
FROM profiles
UNION ALL
SELECT 
  'Tasks assigned to Chawana Maseka:' as table_name, 
  COUNT(*) as count 
FROM deliverables 
WHERE assignee_name = 'Chawana Maseka';
