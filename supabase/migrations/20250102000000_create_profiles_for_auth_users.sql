-- Create profiles for all existing authenticated users
-- This ensures that everyone who can log in also has a profile

-- Insert profiles for all auth users that don't have a profile yet
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1)
  ) as full_name,
  'user' as role
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Show what was created
SELECT 
  'Created/Updated profiles:' as status,
  COUNT(*) as count
FROM profiles;
