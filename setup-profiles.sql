-- Create profiles for team members
-- Run this in Supabase SQL Editor or through the CLI

-- First, let's see if there are any auth users
SELECT id, email, raw_user_meta_data->>'full_name' as full_name 
FROM auth.users;

-- Create profile for Chawana Maseka if user exists
-- Replace 'YOUR_USER_ID' with your actual user ID from the query above
-- INSERT INTO profiles (id, email, full_name)
-- VALUES ('YOUR_USER_ID', 'chawana.maseka@gmail.com', 'Chawana Maseka')
-- ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- Alternative: Create profiles for all existing auth users
INSERT INTO profiles (id, email, full_name)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', email) as full_name
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = auth.users.id
);
