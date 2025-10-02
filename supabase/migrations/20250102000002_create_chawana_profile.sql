-- Create profile for Chawana Maseka
-- Using the correct email: chawana.maseka@gmail.com

-- Create profile for the auth user with chawana.maseka email
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  'Chawana Maseka' as full_name,
  'user' as role
FROM auth.users au
WHERE au.email = 'chawana.maseka@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET full_name = 'Chawana Maseka',
    email = EXCLUDED.email;

-- Also try with @luminaryco.co domain in case that's what's in auth
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  'Chawana Maseka' as full_name,
  'user' as role
FROM auth.users au
WHERE au.email LIKE '%chawana%' AND au.email LIKE '%luminary%'
ON CONFLICT (id) DO UPDATE 
SET full_name = 'Chawana Maseka';

-- Fix all task name variations to use correct spelling
UPDATE deliverables
SET assignee_name = 'Chawana Maseka'
WHERE assignee_name IN ('Chawana Masaka', 'Chawana Maseka');

-- Show what was created
SELECT 'Profile created/updated for:' as status, id, email, full_name FROM profiles;
SELECT 'Total tasks assigned to Chawana Maseka:' as status, COUNT(*) as count 
FROM deliverables WHERE assignee_name = 'Chawana Maseka';
