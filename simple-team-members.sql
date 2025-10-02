-- Simple Team Members Setup for Project CR Dashboard
-- This script creates team members without requiring auth.users

-- First, let's modify the team_members table to not require profile_id
-- We'll add name and email columns directly to team_members

-- Add columns to team_members table if they don't exist
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Clear existing team members
DELETE FROM team_members;

-- Insert team members with all data directly in team_members table
INSERT INTO team_members (name, email, role, assigned_tasks, bio, is_active, joined_at) VALUES
('Chawana Masaka', 'chawana.masaka@luminaryco.co', 'Project Manager', 'Oversee project timelines, resources, and communication for Project CR implementation.', 'Project Manager overseeing Project CR implementation and overall project coordination.', true, NOW()),
('Maynard Muchangwe', 'maynard.muchangwe@luminaryco.co', 'Operations Manager', 'Manage daily operations, process optimization, and operational efficiency.', 'Operations Manager responsible for daily operations and process optimization.', true, NOW()),
('Emmanuel Kapili', 'emmanuel.kapili@luminaryco.co', 'Finance Manager', 'Handle financial planning, budgeting, and financial reporting for Project CR.', 'Finance Manager handling financial planning, budgeting, and financial reporting.', true, NOW()),
('Munsanje Hachamba', 'munsanje.hachamba@luminaryco.co', 'Legal Counsel', 'Provide legal guidance, contract management, and compliance oversight.', 'Legal Counsel providing legal guidance, contract management, and compliance oversight.', true, NOW()),
('Delphine Mwape', 'delphine.mwape@luminaryco.co', 'Administration Manager', 'Manage administrative processes, documentation, and support functions.', 'Administration Manager managing administrative processes and support functions.', true, NOW());

-- Verify the data was inserted
SELECT 
  id,
  name,
  email,
  role,
  assigned_tasks,
  bio,
  is_active,
  joined_at
FROM team_members
ORDER BY joined_at;




