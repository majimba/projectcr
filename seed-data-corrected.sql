-- Project CR Dashboard Seed Data (Corrected)
-- This script populates the database with initial project data

-- Insert project phases based on the 4-week implementation timeline
INSERT INTO project_phases (name, description, start_date, due_date, status, order_index) VALUES
('Week 1: Foundation & Setup', 'Initial project setup, database schema, and basic authentication', '2024-09-30', '2025-01-06', 'completed', 1),
('Week 2: Core Features', 'Deliverables management, team features, and basic reporting', '2025-01-07', '2025-01-13', 'in-progress', 2),
('Week 3: Advanced Features', 'Timeline view, advanced reporting, and notifications', '2025-01-14', '2025-01-20', 'not-started', 3),
('Week 4: Polish & Launch', 'UI/UX improvements, testing, and deployment', '2025-01-21', '2025-01-27', 'not-started', 4);

-- First, we need to get the profile ID for Chawana Maseka
-- Insert team members (they will be linked to profiles)
INSERT INTO team_members (profile_id, role, assigned_tasks, is_active) VALUES
((SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Project Manager', 'Overall project coordination and management', true);

-- Insert sample deliverables based on the work plan
INSERT INTO deliverables (title, description, status, assignee_id, assignee_name, project_area, due_date, week_number, document_link, progress, created_by) VALUES
-- Week 1 Deliverables (Completed)
('Project Setup & Database Schema', 'Set up Next.js project with Supabase integration and create database schema', 'done', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'Backend', '2025-01-02', 1, 'https://docs.google.com/document/d/project-setup', 100, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
('Authentication System', 'Implement user authentication with Supabase Auth', 'done', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'Backend', '2025-01-03', 1, 'https://docs.google.com/document/d/auth-system', 100, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
('Basic UI Components', 'Create reusable UI components (buttons, cards, forms)', 'done', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'Frontend', '2025-01-04', 1, 'https://docs.google.com/document/d/ui-components', 100, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
('Dashboard Layout', 'Implement sidebar and main dashboard layout', 'done', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'Frontend', '2025-01-05', 1, 'https://docs.google.com/document/d/dashboard-layout', 100, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),

-- Week 2 Deliverables (In Progress)
('Deliverables Management', 'CRUD operations for deliverables with status tracking', 'in-progress', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'Backend', '2025-01-10', 2, 'https://docs.google.com/document/d/deliverables-crud', 75, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
('Team Management', 'User profiles and team member management', 'in-progress', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'Frontend', '2025-01-11', 2, 'https://docs.google.com/document/d/team-management', 60, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
('Basic Reporting', 'KPI cards and basic analytics dashboard', 'in-progress', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'Backend', '2025-01-12', 2, 'https://docs.google.com/document/d/basic-reporting', 40, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
('API Documentation', 'Document all API endpoints and data models', 'not-started', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'Backend', '2025-01-13', 2, 'https://docs.google.com/document/d/api-docs', 0, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),

-- Week 3 Deliverables (Not Started)
('Timeline View', 'Interactive timeline showing project progress', 'not-started', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'Frontend', '2025-01-18', 3, 'https://docs.google.com/document/d/timeline-view', 0, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
('Advanced Reporting', 'Detailed analytics and export functionality', 'not-started', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'Backend', '2025-01-19', 3, 'https://docs.google.com/document/d/advanced-reporting', 0, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
('Notifications System', 'Real-time notifications for updates and deadlines', 'not-started', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'Backend', '2025-01-20', 3, 'https://docs.google.com/document/d/notifications', 0, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),

-- Week 4 Deliverables (Not Started)
('Mobile Responsiveness', 'Ensure all components work on mobile devices', 'not-started', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'Frontend', '2025-01-25', 4, 'https://docs.google.com/document/d/mobile-responsive', 0, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
('Performance Optimization', 'Optimize loading times and user experience', 'not-started', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'DevOps', '2025-01-26', 4, 'https://docs.google.com/document/d/performance-opt', 0, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
('Testing & QA', 'Comprehensive testing and quality assurance', 'not-started', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'Frontend', '2025-01-27', 4, 'https://docs.google.com/document/d/testing-qa', 0, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
('Deployment & Launch', 'Deploy to production and launch the application', 'not-started', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Chawana Maseka', 'DevOps', '2025-01-28', 4, 'https://docs.google.com/document/d/deployment', 0, (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'));

-- Insert sample comments for some deliverables
INSERT INTO deliverable_comments (deliverable_id, author_id, content) VALUES
((SELECT id FROM deliverables WHERE title = 'Project Setup & Database Schema'), (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Great work on the database schema! All tables are properly set up with relationships.'),
((SELECT id FROM deliverables WHERE title = 'Authentication System'), (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Authentication is working perfectly. Users can sign up and log in without issues.'),
((SELECT id FROM deliverables WHERE title = 'Deliverables Management'), (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'Working on the CRUD operations. Should be ready by end of week.'),
((SELECT id FROM deliverables WHERE title = 'Team Management'), (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'), 'UI components are ready, implementing the backend integration now.');

-- Insert sample history entries
INSERT INTO deliverable_history (deliverable_id, action, old_value, new_value, changed_by) VALUES
((SELECT id FROM deliverables WHERE title = 'Project Setup & Database Schema'), 'Status updated to', 'not-started', 'done', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
((SELECT id FROM deliverables WHERE title = 'Authentication System'), 'Status updated to', 'in-progress', 'done', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
((SELECT id FROM deliverables WHERE title = 'Basic UI Components'), 'Status updated to', 'in-progress', 'done', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
((SELECT id FROM deliverables WHERE title = 'Dashboard Layout'), 'Status updated to', 'in-progress', 'done', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
((SELECT id FROM deliverables WHERE title = 'Deliverables Management'), 'Status updated to', 'not-started', 'in-progress', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
((SELECT id FROM deliverables WHERE title = 'Team Management'), 'Status updated to', 'not-started', 'in-progress', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com')),
((SELECT id FROM deliverables WHERE title = 'Basic Reporting'), 'Status updated to', 'not-started', 'in-progress', (SELECT id FROM profiles WHERE email = 'chawana.maseka@gmail.com'));
