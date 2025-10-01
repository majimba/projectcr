-- Update Project CR dates from 2024 to 2025
-- Run this in your Supabase SQL Editor

-- Clear existing data
DELETE FROM deliverables;
DELETE FROM project_phases;

-- Insert Project CR phases with 2025 dates
INSERT INTO project_phases (name, description, icon, start_date, due_date, order_index, status) VALUES
('Week 1: Strategic Foundation', 'Define ICP, UVP, brand identity, and financial setup', '🏁', '2025-01-01', '2025-01-07', 1, 'in-progress'),
('Week 2: Digital Presence', 'Website, marketing automation, and project management systems', '📱', '2025-01-08', '2025-01-14', 2, 'not-started'),
('Week 3: Internal Systems', 'HR framework, culture documentation, and payroll setup', '👥', '2025-01-15', '2025-01-21', 3, 'not-started'),
('Week 4: Launch Readiness', 'Client materials, final testing, and go-live preparation', '🎯', '2025-01-22', '2025-01-31', 4, 'not-started');

-- Insert Project CR deliverables with 2025 dates
INSERT INTO deliverables (title, description, status, project_area, week_number, due_date, progress) VALUES

-- Week 1: Strategic Foundation (Jan 1-7, 2025)
-- Strategy Layer Tasks
('Conduct Competitor Analysis', 'Review 2-3 key competitors and document their positioning, pricing, and service offerings', 'not-started', 'Strategy Layer', 1, '2025-01-03', 0),
('Draft Ideal Client Profile (ICP)', 'Define primary and secondary market segments with detailed client personas', 'not-started', 'Strategy Layer', 1, '2025-01-04', 0),
('Create Unique Value Proposition (UVP)', 'Craft compelling UVP that differentiates Luminary Co. from competitors', 'not-started', 'Strategy Layer', 1, '2025-01-05', 0),
('Complete One-Page Strategy Document', 'Compile ICP, UVP, and competitive analysis into comprehensive strategy document', 'not-started', 'Strategy Layer', 1, '2025-01-07', 0),

-- Branding & Identity Tasks
('Finalize Brand Identity Document', 'Complete brand identity package with core values, personality, and positioning', 'not-started', 'Branding & Identity', 1, '2025-01-03', 0),
('Create Brand Style Guide', 'Develop comprehensive style guide with colors, fonts, imagery guidelines', 'not-started', 'Branding & Identity', 1, '2025-01-04', 0),
('Design Logo Pack', 'Create primary logo, variations, and usage guidelines', 'not-started', 'Branding & Identity', 1, '2025-01-05', 0),
('Develop Marketing Collateral Templates', 'Create branded templates for proposals, presentations, and marketing materials', 'not-started', 'Branding & Identity', 1, '2025-01-06', 0),
('Create Lead Magnet Document', 'Design "Brand Clarity Checklist" or "Pitch-Perfect Brand Guide" for newsletter signups', 'not-started', 'Branding & Identity', 1, '2025-01-07', 0),

-- Finance & Administration Tasks
('Open Business Bank Account', 'Establish business banking relationship with proper documentation', 'not-started', 'Finance & Administration', 1, '2025-01-02', 0),
('Draft Financial Controls Policy', 'Create spending limits, approval hierarchy, and financial oversight procedures', 'not-started', 'Finance & Administration', 1, '2025-01-04', 0),
('Set Up Accounting System', 'Configure accounting software and chart of accounts', 'not-started', 'Finance & Administration', 1, '2025-01-06', 0),
('Confirm Tax Registration', 'Verify TPIN registration and VAT registration if applicable', 'not-started', 'Finance & Administration', 1, '2025-01-07', 0),
('Create Accounting Policies & Chart of Accounts', 'Document accounting procedures and account structure', 'not-started', 'Finance & Administration', 1, '2025-01-05', 0),

-- Week 2: Digital Presence & Systems (Jan 8-14, 2025)
-- Social Media & Marketing Tasks
('Build Website Skeleton', 'Create website foundation with core pages and structure', 'not-started', 'Social Media & Marketing', 2, '2025-01-09', 0),
('Implement Newsletter Signup', 'Add newsletter signup functionality and integrate with email marketing platform', 'not-started', 'Social Media & Marketing', 2, '2025-01-10', 0),
('Create Social Media Strategy', 'Develop comprehensive social media strategy and content guidelines', 'not-started', 'Social Media & Marketing', 2, '2025-01-11', 0),
('Build Content Calendar (3 months)', 'Plan and schedule 3 months of content across all social platforms', 'not-started', 'Social Media & Marketing', 2, '2025-01-12', 0),
('Draft Newsletter Welcome Sequence', 'Create 3-4 automated welcome emails for new subscribers', 'not-started', 'Social Media & Marketing', 2, '2025-01-13', 0),
('Set Up Email Marketing Automation', 'Configure email marketing platform and automation workflows', 'not-started', 'Social Media & Marketing', 2, '2025-01-14', 0),
('Create Community Guidelines', 'Develop social media community standards and moderation policies', 'not-started', 'Social Media & Marketing', 2, '2025-01-13', 0),
('Design Influencer/Outreach Template', 'Create template for influencer partnerships and outreach campaigns', 'not-started', 'Social Media & Marketing', 2, '2025-01-14', 0),
('Create Website Content Plan', 'Plan all website content including copy, imagery, and structure', 'not-started', 'Social Media & Marketing', 2, '2025-01-14', 0),

-- Operations & Systems Tasks
('Deploy Project Management System', 'Set up and configure project management tool (Notion/Asana/Trello)', 'not-started', 'Operations & Systems', 2, '2025-01-09', 0),
('Create Operations Manual (SOPs)', 'Document standard operating procedures for key business processes', 'not-started', 'Operations & Systems', 2, '2025-01-11', 0),
('Implement Password Manager', 'Set up organization-wide password management system', 'not-started', 'Operations & Systems', 2, '2025-01-12', 0),
('Configure Two-Factor Authentication (2FA)', 'Enable 2FA across all critical business accounts and systems', 'not-started', 'Operations & Systems', 2, '2025-01-13', 0),
('Create Tech Stack & Security Policy', 'Document approved software, security protocols, and usage guidelines', 'not-started', 'Operations & Systems', 2, '2025-01-14', 0),
('Create Communication Policy', 'Establish internal and external communication guidelines', 'not-started', 'Operations & Systems', 2, '2025-01-10', 0),
('Develop Project Management Framework', 'Create standardized project management methodology', 'not-started', 'Operations & Systems', 2, '2025-01-12', 0),

-- Finance & Administration Tasks
('Design Invoice & Receipt Templates', 'Create branded invoice and receipt templates', 'not-started', 'Finance & Administration', 2, '2025-01-11', 0),

-- Week 3: HR & Internal Systems (Jan 15-21, 2025)
-- HR & People Tasks
('Create Employment Contracts', 'Draft comprehensive employment contracts for different roles', 'not-started', 'HR & People', 3, '2025-01-16', 0),
('Develop NDAs', 'Create non-disclosure agreements for employees and contractors', 'not-started', 'HR & People', 3, '2025-01-17', 0),
('Build HR Policy Handbook', 'Create comprehensive HR policies covering all employment aspects', 'not-started', 'HR & People', 3, '2025-01-18', 0),
('Design Onboarding Checklist & Framework', 'Create structured onboarding process for new team members', 'not-started', 'HR & People', 3, '2025-01-19', 0),
('Create Payroll & Benefits Policy', 'Establish payroll procedures and employee benefits framework', 'not-started', 'HR & People', 3, '2025-01-20', 0),
('Develop Culture Translation Framework', 'Map company values to concrete HR and client behaviors', 'not-started', 'HR & People', 3, '2025-01-21', 0),

-- Operations & Systems Tasks
('Launch Payroll System', 'Set up payroll in accounting software and configure payment processes', 'not-started', 'Operations & Systems', 3, '2025-01-18', 0),
('Create Secure HR Records System', 'Implement secure system for storing and managing employee records', 'not-started', 'Operations & Systems', 3, '2025-01-19', 0),
('Develop Culture Onboarding Module', 'Create culture training component for new employee induction', 'not-started', 'Operations & Systems', 3, '2025-01-20', 0),
('Create Data Backup & Recovery Plan', 'Establish monthly off-cloud backup routine and test recovery process', 'not-started', 'Operations & Systems', 3, '2025-01-21', 0),
('Draft Data Protection & Privacy Policy', 'Create comprehensive data protection and privacy compliance framework', 'not-started', 'Operations & Systems', 3, '2025-01-19', 0),
('Create Health & Safety Policy', 'Establish workplace health and safety procedures', 'not-started', 'Operations & Systems', 3, '2025-01-20', 0),

-- Finance & Administration Tasks
('Create Compliance Checklist', 'Document regulatory compliance requirements and procedures', 'not-started', 'Finance & Administration', 3, '2025-01-18', 0),

-- Week 4: Client-Ready Launch (Jan 22-31, 2025)
-- Client-Facing Readiness Tasks
('Create Company Profile Deck', 'Develop professional company presentation for client pitches', 'not-started', 'Client-Facing Readiness', 4, '2025-01-23', 0),
('Design Client Proposal Template', 'Create standardized proposal template with pricing and scope', 'not-started', 'Client-Facing Readiness', 4, '2025-01-24', 0),
('Develop Client Contract Template', 'Draft comprehensive client service agreements and contracts', 'not-started', 'Client-Facing Readiness', 4, '2025-01-25', 0),
('Create Case Studies / Portfolio Samples', 'Develop sample case studies showcasing company capabilities', 'not-started', 'Client-Facing Readiness', 4, '2025-01-26', 0),
('Build Client Onboarding Packet', 'Create welcome document, project roadmap, and communication guide', 'not-started', 'Client-Facing Readiness', 4, '2025-01-27', 0),
('Design Project Offboarding & Feedback Template', 'Create final report template and testimonial request process', 'not-started', 'Client-Facing Readiness', 4, '2025-01-28', 0),

-- Social Media & Marketing Tasks (Week 4)
('Launch Website + Social Campaign', 'Go live with website and launch coordinated social media campaign', 'not-started', 'Social Media & Marketing', 4, '2025-01-29', 0),
('Design Landing Page with Signup Form', 'Create optimized landing page connected to insider list', 'not-started', 'Social Media & Marketing', 4, '2025-01-30', 0),

-- Operations & Systems Tasks (Week 4)
('Run Mock Client Pitch', 'Conduct internal pitch session to test presentation and materials', 'not-started', 'Operations & Systems', 4, '2025-01-29', 0),
('Conduct Pilot Onboarding/Offboarding Test', 'Run internal project test to validate client experience system', 'not-started', 'Operations & Systems', 4, '2025-01-30', 0),

-- Finance & Administration Tasks (Week 4)
('Allocate Contingency Fund', 'Set up 3-6 months operating reserve in dedicated sub-account', 'not-started', 'Finance & Administration', 4, '2025-01-31', 0),
('Complete Budget & Cash Flow Forecast', 'Finalize financial projections and budget for next 12 months', 'not-started', 'Finance & Administration', 4, '2025-01-31', 0);

-- Verify the data was inserted
SELECT 'Project Phases:' as info, COUNT(*) as count FROM project_phases
UNION ALL
SELECT 'Deliverables:', COUNT(*) FROM deliverables;


