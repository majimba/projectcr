// Script to populate Project CR tasks via Supabase API
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dmbavfwdvjbbtvpotvsn.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtYmF2ZndkdmpiYnR2cG90dnNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTg4NjksImV4cCI6MjA3NDc5NDg2OX0.HZBvoUnMmZZ_6rMYhdKm0b03wjbRtCaH67dAejEYXJU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Project CR phases data
const projectPhases = [
  {
    name: 'Week 1: Strategic Foundation',
    description: 'Define ICP, UVP, brand identity, and financial setup',
    icon: '🏁',
    start_date: '2025-01-01',
    due_date: '2025-01-07',
    order_index: 1,
    status: 'in-progress'
  },
  {
    name: 'Week 2: Digital Presence',
    description: 'Website, marketing automation, and project management systems',
    icon: '📱',
    start_date: '2025-01-08',
    due_date: '2025-01-14',
    order_index: 2,
    status: 'not-started'
  },
  {
    name: 'Week 3: Internal Systems',
    description: 'HR framework, culture documentation, and payroll setup',
    icon: '👥',
    start_date: '2025-01-15',
    due_date: '2025-01-21',
    order_index: 3,
    status: 'not-started'
  },
  {
    name: 'Week 4: Launch Readiness',
    description: 'Client materials, final testing, and go-live preparation',
    icon: '🎯',
    start_date: '2025-01-22',
    due_date: '2025-01-31',
    order_index: 4,
    status: 'not-started'
  }
];

// Project CR deliverables data
const deliverables = [
  // Week 1: Strategic Foundation
  // Strategy Layer Tasks
  {
    title: 'Conduct Competitor Analysis',
    description: 'Review 2-3 key competitors and document their positioning, pricing, and service offerings',
    status: 'not-started',
    project_area: 'Strategy Layer',
    week_number: 1,
    due_date: '2025-01-03',
    progress: 0
  },
  {
    title: 'Draft Ideal Client Profile (ICP)',
    description: 'Define primary and secondary market segments with detailed client personas',
    status: 'not-started',
    project_area: 'Strategy Layer',
    week_number: 1,
    due_date: '2025-01-04',
    progress: 0
  },
  {
    title: 'Create Unique Value Proposition (UVP)',
    description: 'Craft compelling UVP that differentiates Luminary Co. from competitors',
    status: 'not-started',
    project_area: 'Strategy Layer',
    week_number: 1,
    due_date: '2025-01-05',
    progress: 0
  },
  {
    title: 'Complete One-Page Strategy Document',
    description: 'Compile ICP, UVP, and competitive analysis into comprehensive strategy document',
    status: 'not-started',
    project_area: 'Strategy Layer',
    week_number: 1,
    due_date: '2025-01-07',
    progress: 0
  },

  // Branding & Identity Tasks
  {
    title: 'Finalize Brand Identity Document',
    description: 'Complete brand identity package with core values, personality, and positioning',
    status: 'not-started',
    project_area: 'Branding & Identity',
    week_number: 1,
    due_date: '2025-01-03',
    progress: 0
  },
  {
    title: 'Create Brand Style Guide',
    description: 'Develop comprehensive style guide with colors, fonts, imagery guidelines',
    status: 'not-started',
    project_area: 'Branding & Identity',
    week_number: 1,
    due_date: '2025-01-04',
    progress: 0
  },
  {
    title: 'Design Logo Pack',
    description: 'Create primary logo, variations, and usage guidelines',
    status: 'not-started',
    project_area: 'Branding & Identity',
    week_number: 1,
    due_date: '2025-01-05',
    progress: 0
  },
  {
    title: 'Develop Marketing Collateral Templates',
    description: 'Create branded templates for proposals, presentations, and marketing materials',
    status: 'not-started',
    project_area: 'Branding & Identity',
    week_number: 1,
    due_date: '2025-01-06',
    progress: 0
  },
  {
    title: 'Create Lead Magnet Document',
    description: 'Design "Brand Clarity Checklist" or "Pitch-Perfect Brand Guide" for newsletter signups',
    status: 'not-started',
    project_area: 'Branding & Identity',
    week_number: 1,
    due_date: '2025-01-07',
    progress: 0
  },

  // Finance & Administration Tasks
  {
    title: 'Open Business Bank Account',
    description: 'Establish business banking relationship with proper documentation',
    status: 'not-started',
    project_area: 'Finance & Administration',
    week_number: 1,
    due_date: '2025-01-02',
    progress: 0
  },
  {
    title: 'Draft Financial Controls Policy',
    description: 'Create spending limits, approval hierarchy, and financial oversight procedures',
    status: 'not-started',
    project_area: 'Finance & Administration',
    week_number: 1,
    due_date: '2025-01-04',
    progress: 0
  },
  {
    title: 'Set Up Accounting System',
    description: 'Configure accounting software and chart of accounts',
    status: 'not-started',
    project_area: 'Finance & Administration',
    week_number: 1,
    due_date: '2025-01-06',
    progress: 0
  },
  {
    title: 'Confirm Tax Registration',
    description: 'Verify TPIN registration and VAT registration if applicable',
    status: 'not-started',
    project_area: 'Finance & Administration',
    week_number: 1,
    due_date: '2025-01-07',
    progress: 0
  },
  {
    title: 'Create Accounting Policies & Chart of Accounts',
    description: 'Document accounting procedures and account structure',
    status: 'not-started',
    project_area: 'Finance & Administration',
    week_number: 1,
    due_date: '2025-01-05',
    progress: 0
  },

  // Week 2: Digital Presence & Systems
  // Social Media & Marketing Tasks
  {
    title: 'Build Website Skeleton',
    description: 'Create website foundation with core pages and structure',
    status: 'not-started',
    project_area: 'Social Media & Marketing',
    week_number: 2,
    due_date: '2025-01-09',
    progress: 0
  },
  {
    title: 'Implement Newsletter Signup',
    description: 'Add newsletter signup functionality and integrate with email marketing platform',
    status: 'not-started',
    project_area: 'Social Media & Marketing',
    week_number: 2,
    due_date: '2025-01-10',
    progress: 0
  },
  {
    title: 'Create Social Media Strategy',
    description: 'Develop comprehensive social media strategy and content guidelines',
    status: 'not-started',
    project_area: 'Social Media & Marketing',
    week_number: 2,
    due_date: '2025-01-11',
    progress: 0
  },
  {
    title: 'Build Content Calendar (3 months)',
    description: 'Plan and schedule 3 months of content across all social platforms',
    status: 'not-started',
    project_area: 'Social Media & Marketing',
    week_number: 2,
    due_date: '2025-01-12',
    progress: 0
  },
  {
    title: 'Draft Newsletter Welcome Sequence',
    description: 'Create 3-4 automated welcome emails for new subscribers',
    status: 'not-started',
    project_area: 'Social Media & Marketing',
    week_number: 2,
    due_date: '2025-01-13',
    progress: 0
  },
  {
    title: 'Set Up Email Marketing Automation',
    description: 'Configure email marketing platform and automation workflows',
    status: 'not-started',
    project_area: 'Social Media & Marketing',
    week_number: 2,
    due_date: '2025-01-14',
    progress: 0
  },

  // Operations & Systems Tasks
  {
    title: 'Deploy Project Management System',
    description: 'Set up and configure project management tool (Notion/Asana/Trello)',
    status: 'not-started',
    project_area: 'Operations & Systems',
    week_number: 2,
    due_date: '2025-01-09',
    progress: 0
  },
  {
    title: 'Create Operations Manual (SOPs)',
    description: 'Document standard operating procedures for key business processes',
    status: 'not-started',
    project_area: 'Operations & Systems',
    week_number: 2,
    due_date: '2025-01-11',
    progress: 0
  },
  {
    title: 'Implement Password Manager',
    description: 'Set up organization-wide password management system',
    status: 'not-started',
    project_area: 'Operations & Systems',
    week_number: 2,
    due_date: '2025-01-12',
    progress: 0
  },
  {
    title: 'Configure Two-Factor Authentication (2FA)',
    description: 'Enable 2FA across all critical business accounts and systems',
    status: 'not-started',
    project_area: 'Operations & Systems',
    week_number: 2,
    due_date: '2025-01-13',
    progress: 0
  },
  {
    title: 'Create Tech Stack & Security Policy',
    description: 'Document approved software, security protocols, and usage guidelines',
    status: 'not-started',
    project_area: 'Operations & Systems',
    week_number: 2,
    due_date: '2025-01-14',
    progress: 0
  },

  // Week 3: HR & Internal Systems
  // HR & People Tasks
  {
    title: 'Create Employment Contracts',
    description: 'Draft comprehensive employment contracts for different roles',
    status: 'not-started',
    project_area: 'HR & People',
    week_number: 3,
    due_date: '2025-01-16',
    progress: 0
  },
  {
    title: 'Develop NDAs',
    description: 'Create non-disclosure agreements for employees and contractors',
    status: 'not-started',
    project_area: 'HR & People',
    week_number: 3,
    due_date: '2025-01-17',
    progress: 0
  },
  {
    title: 'Build HR Policy Handbook',
    description: 'Create comprehensive HR policies covering all employment aspects',
    status: 'not-started',
    project_area: 'HR & People',
    week_number: 3,
    due_date: '2025-01-18',
    progress: 0
  },
  {
    title: 'Design Onboarding Checklist & Framework',
    description: 'Create structured onboarding process for new team members',
    status: 'not-started',
    project_area: 'HR & People',
    week_number: 3,
    due_date: '2025-01-19',
    progress: 0
  },
  {
    title: 'Create Payroll & Benefits Policy',
    description: 'Establish payroll procedures and employee benefits framework',
    status: 'not-started',
    project_area: 'HR & People',
    week_number: 3,
    due_date: '2025-01-20',
    progress: 0
  },
  {
    title: 'Develop Culture Translation Framework',
    description: 'Map company values to concrete HR and client behaviors',
    status: 'not-started',
    project_area: 'HR & People',
    week_number: 3,
    due_date: '2025-01-21',
    progress: 0
  },

  // Week 4: Client-Ready Launch
  // Client-Facing Readiness Tasks
  {
    title: 'Create Company Profile Deck',
    description: 'Develop professional company presentation for client pitches',
    status: 'not-started',
    project_area: 'Client-Facing Readiness',
    week_number: 4,
    due_date: '2025-01-23',
    progress: 0
  },
  {
    title: 'Design Client Proposal Template',
    description: 'Create standardized proposal template with pricing and scope',
    status: 'not-started',
    project_area: 'Client-Facing Readiness',
    week_number: 4,
    due_date: '2025-01-24',
    progress: 0
  },
  {
    title: 'Develop Client Contract Template',
    description: 'Draft comprehensive client service agreements and contracts',
    status: 'not-started',
    project_area: 'Client-Facing Readiness',
    week_number: 4,
    due_date: '2025-01-25',
    progress: 0
  },
  {
    title: 'Create Case Studies / Portfolio Samples',
    description: 'Develop sample case studies showcasing company capabilities',
    status: 'not-started',
    project_area: 'Client-Facing Readiness',
    week_number: 4,
    due_date: '2025-01-26',
    progress: 0
  },
  {
    title: 'Build Client Onboarding Packet',
    description: 'Create welcome document, project roadmap, and communication guide',
    status: 'not-started',
    project_area: 'Client-Facing Readiness',
    week_number: 4,
    due_date: '2025-01-27',
    progress: 0
  },
  {
    title: 'Design Project Offboarding & Feedback Template',
    description: 'Create final report template and testimonial request process',
    status: 'not-started',
    project_area: 'Client-Facing Readiness',
    week_number: 4,
    due_date: '2025-01-28',
    progress: 0
  },

  // Social Media & Marketing Tasks (Week 4)
  {
    title: 'Launch Website + Social Campaign',
    description: 'Go live with website and launch coordinated social media campaign',
    status: 'not-started',
    project_area: 'Social Media & Marketing',
    week_number: 4,
    due_date: '2025-01-29',
    progress: 0
  },
  {
    title: 'Design Landing Page with Signup Form',
    description: 'Create optimized landing page connected to insider list',
    status: 'not-started',
    project_area: 'Social Media & Marketing',
    week_number: 4,
    due_date: '2025-01-30',
    progress: 0
  },

  // Operations & Systems Tasks (Week 4)
  {
    title: 'Run Mock Client Pitch',
    description: 'Conduct internal pitch session to test presentation and materials',
    status: 'not-started',
    project_area: 'Operations & Systems',
    week_number: 4,
    due_date: '2025-01-29',
    progress: 0
  },
  {
    title: 'Conduct Pilot Onboarding/Offboarding Test',
    description: 'Run internal project test to validate client experience system',
    status: 'not-started',
    project_area: 'Operations & Systems',
    week_number: 4,
    due_date: '2025-01-30',
    progress: 0
  },

  // Finance & Administration Tasks (Week 4)
  {
    title: 'Allocate Contingency Fund',
    description: 'Set up 3-6 months operating reserve in dedicated sub-account',
    status: 'not-started',
    project_area: 'Finance & Administration',
    week_number: 4,
    due_date: '2025-01-31',
    progress: 0
  },
  {
    title: 'Complete Budget & Cash Flow Forecast',
    description: 'Finalize financial projections and budget for next 12 months',
    status: 'not-started',
    project_area: 'Finance & Administration',
    week_number: 4,
    due_date: '2025-01-31',
    progress: 0
  }
];

async function populateDatabase() {
  console.log('🚀 Starting Project CR database population...');
  
  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await supabase.from('deliverables').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('project_phases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Insert project phases
    console.log('📋 Inserting project phases...');
    const { data: phasesData, error: phasesError } = await supabase
      .from('project_phases')
      .insert(projectPhases);
    
    if (phasesError) {
      console.error('❌ Error inserting phases:', phasesError);
      return;
    }
    console.log(`✅ Inserted ${projectPhases.length} project phases`);
    
    // Insert deliverables
    console.log('📝 Inserting deliverables...');
    const { data: deliverablesData, error: deliverablesError } = await supabase
      .from('deliverables')
      .insert(deliverables);
    
    if (deliverablesError) {
      console.error('❌ Error inserting deliverables:', deliverablesError);
      return;
    }
    console.log(`✅ Inserted ${deliverables.length} deliverables`);
    
    console.log('🎉 Project CR database population complete!');
    console.log(`📊 Database now contains:`);
    console.log(`   - ${projectPhases.length} Project CR phases (Week 1-4)`);
    console.log(`   - ${deliverables.length} Project CR tasks across 6 implementation areas`);
    console.log(`   - Proper categorization by week and project area`);
    console.log('');
    console.log('🌐 Your dashboard is ready at: http://localhost:3001');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the population script
populateDatabase();
