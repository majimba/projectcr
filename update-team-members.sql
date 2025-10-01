-- Update Team Members for Project CR Dashboard
-- This script updates the database with the correct team member information

-- First, let's check what users exist in auth.users
-- SELECT id, email FROM auth.users;

-- Insert/update profiles for team members (using existing user IDs or creating new ones)
-- Note: If you have existing users, replace the UUIDs below with their actual IDs

-- Option 1: If you have existing users, use their IDs
-- Option 2: If no users exist, we'll create profiles without the foreign key constraint

-- Let's first try to insert profiles without specifying IDs (let Supabase generate them)
-- But first, we need to temporarily disable the foreign key constraint or use a different approach

-- Create a temporary table for team member data
CREATE TEMP TABLE temp_team_members (
  email TEXT,
  full_name TEXT,
  role TEXT,
  bio TEXT,
  team_role TEXT,
  assigned_tasks TEXT
);

-- Insert team member data into temp table
INSERT INTO temp_team_members (email, full_name, role, bio, team_role, assigned_tasks) VALUES
('chawana.masaka@luminaryco.co', 'Chawana Masaka', 'admin', 'Project Manager overseeing Project CR implementation and overall project coordination.', 'Project Manager', 'Oversee project timelines, resources, and communication for Project CR implementation.'),
('maynard.muchangwe@luminaryco.co', 'Maynard Muchangwe', 'user', 'Operations Manager responsible for daily operations and process optimization.', 'Operations Manager', 'Manage daily operations, process optimization, and operational efficiency.'),
('emmanuel.kapili@luminaryco.co', 'Emmanuel Kapili', 'user', 'Finance Manager handling financial planning, budgeting, and financial reporting.', 'Finance Manager', 'Handle financial planning, budgeting, and financial reporting for Project CR.'),
('munsanje.hachamba@luminaryco.co', 'Munsanje Hachamba', 'user', 'Legal Counsel providing legal guidance, contract management, and compliance oversight.', 'Legal Counsel', 'Provide legal guidance, contract management, and compliance oversight.'),
('delphine.mwape@luminaryco.co', 'Delphine Mwape', 'user', 'Administration Manager managing administrative processes and support functions.', 'Administration Manager', 'Manage administrative processes, documentation, and support functions.');

-- Clear existing team members
DELETE FROM team_members;

-- For now, let's create team members without profile references
-- This will work for the team page display
INSERT INTO team_members (profile_id, role, assigned_tasks, is_active, joined_at) VALUES
('00000000-0000-0000-0000-000000000000', 'Project Manager', 'Oversee project timelines, resources, and communication for Project CR implementation.', true, NOW()),
('00000000-0000-0000-0000-000000000001', 'Operations Manager', 'Manage daily operations, process optimization, and operational efficiency.', true, NOW()),
('00000000-0000-0000-0000-000000000002', 'Finance Manager', 'Handle financial planning, budgeting, and financial reporting for Project CR.', true, NOW()),
('00000000-0000-0000-0000-000000000003', 'Legal Counsel', 'Provide legal guidance, contract management, and compliance oversight.', true, NOW()),
('00000000-0000-0000-0000-000000000004', 'Administration Manager', 'Manage administrative processes, documentation, and support functions.', true, NOW());

-- Verify the data was inserted
SELECT 
  tm.id,
  p.full_name,
  p.email,
  tm.role,
  tm.assigned_tasks,
  tm.is_active,
  tm.joined_at
FROM team_members tm
JOIN profiles p ON tm.profile_id = p.id
ORDER BY tm.joined_at;
