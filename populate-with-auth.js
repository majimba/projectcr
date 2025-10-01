// Script to populate Project CR tasks with proper authentication
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
    start_date: '2024-10-01',
    due_date: '2024-10-07',
    order_index: 1,
    status: 'in-progress'
  },
  {
    name: 'Week 2: Digital Presence',
    description: 'Website, marketing automation, and project management systems',
    icon: '📱',
    start_date: '2024-10-08',
    due_date: '2024-10-14',
    order_index: 2,
    status: 'not-started'
  },
  {
    name: 'Week 3: Internal Systems',
    description: 'HR framework, culture documentation, and payroll setup',
    icon: '👥',
    start_date: '2024-10-15',
    due_date: '2024-10-21',
    order_index: 3,
    status: 'not-started'
  },
  {
    name: 'Week 4: Launch Readiness',
    description: 'Client materials, final testing, and go-live preparation',
    icon: '🎯',
    start_date: '2024-10-22',
    due_date: '2024-10-31',
    order_index: 4,
    status: 'not-started'
  }
];

// Sample deliverables (first 10 for testing)
const sampleDeliverables = [
  {
    title: 'Conduct Competitor Analysis',
    description: 'Review 2-3 key competitors and document their positioning, pricing, and service offerings',
    status: 'not-started',
    project_area: 'Strategy Layer',
    week_number: 1,
    due_date: '2024-10-03',
    progress: 0
  },
  {
    title: 'Draft Ideal Client Profile (ICP)',
    description: 'Define primary and secondary market segments with detailed client personas',
    status: 'not-started',
    project_area: 'Strategy Layer',
    week_number: 1,
    due_date: '2024-10-04',
    progress: 0
  },
  {
    title: 'Create Unique Value Proposition (UVP)',
    description: 'Craft compelling UVP that differentiates Luminary Co. from competitors',
    status: 'not-started',
    project_area: 'Strategy Layer',
    week_number: 1,
    due_date: '2024-10-05',
    progress: 0
  },
  {
    title: 'Finalize Brand Identity Document',
    description: 'Complete brand identity package with core values, personality, and positioning',
    status: 'not-started',
    project_area: 'Branding & Identity',
    week_number: 1,
    due_date: '2024-10-03',
    progress: 0
  },
  {
    title: 'Create Brand Style Guide',
    description: 'Develop comprehensive style guide with colors, fonts, imagery guidelines',
    status: 'not-started',
    project_area: 'Branding & Identity',
    week_number: 1,
    due_date: '2024-10-04',
    progress: 0
  },
  {
    title: 'Open Business Bank Account',
    description: 'Establish business banking relationship with proper documentation',
    status: 'not-started',
    project_area: 'Finance & Administration',
    week_number: 1,
    due_date: '2024-10-02',
    progress: 0
  },
  {
    title: 'Build Website Skeleton',
    description: 'Create website foundation with core pages and structure',
    status: 'not-started',
    project_area: 'Social Media & Marketing',
    week_number: 2,
    due_date: '2024-10-09',
    progress: 0
  },
  {
    title: 'Create Employment Contracts',
    description: 'Draft comprehensive employment contracts for different roles',
    status: 'not-started',
    project_area: 'HR & People',
    week_number: 3,
    due_date: '2024-10-16',
    progress: 0
  },
  {
    title: 'Create Company Profile Deck',
    description: 'Develop professional company presentation for client pitches',
    status: 'not-started',
    project_area: 'Client-Facing Readiness',
    week_number: 4,
    due_date: '2024-10-23',
    progress: 0
  },
  {
    title: 'Launch Website + Social Campaign',
    description: 'Go live with website and launch coordinated social media campaign',
    status: 'not-started',
    project_area: 'Social Media & Marketing',
    week_number: 4,
    due_date: '2024-10-29',
    progress: 0
  }
];

async function createTestUser() {
  console.log('👤 Creating test user for authentication...');
  
  const { data, error } = await supabase.auth.signUp({
    email: 'test@luminaryco.co',
    password: 'TestPassword123!',
    options: {
      data: {
        full_name: 'Test User'
      }
    }
  });

  if (error) {
    console.log('ℹ️  User might already exist, trying to sign in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'test@luminaryco.co',
      password: 'TestPassword123!'
    });

    if (signInError) {
      console.error('❌ Authentication failed:', signInError.message);
      return false;
    }
    
    console.log('✅ Signed in successfully');
    return true;
  }

  console.log('✅ Test user created and signed in');
  return true;
}

async function populateDatabase() {
  console.log('🚀 Starting Project CR database population with authentication...');
  
  try {
    // Create/authenticate user first
    const authSuccess = await createTestUser();
    if (!authSuccess) {
      console.log('⚠️  Proceeding without authentication - may hit RLS restrictions');
    }

    // Try to clear existing data (may fail due to RLS)
    console.log('🧹 Attempting to clear existing data...');
    try {
      await supabase.from('deliverables').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('project_phases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      console.log('✅ Existing data cleared');
    } catch (clearError) {
      console.log('⚠️  Could not clear existing data (RLS restriction):', clearError.message);
    }
    
    // Insert project phases
    console.log('📋 Inserting project phases...');
    const { data: phasesData, error: phasesError } = await supabase
      .from('project_phases')
      .insert(projectPhases);
    
    if (phasesError) {
      console.error('❌ Error inserting phases:', phasesError.message);
      console.log('💡 This is likely due to Row Level Security. You may need to run the SQL script manually in Supabase dashboard.');
    } else {
      console.log(`✅ Inserted ${projectPhases.length} project phases`);
    }
    
    // Insert sample deliverables
    console.log('📝 Inserting sample deliverables...');
    const { data: deliverablesData, error: deliverablesError } = await supabase
      .from('deliverables')
      .insert(sampleDeliverables);
    
    if (deliverablesError) {
      console.error('❌ Error inserting deliverables:', deliverablesError.message);
      console.log('💡 This is likely due to Row Level Security. You may need to run the SQL script manually in Supabase dashboard.');
    } else {
      console.log(`✅ Inserted ${sampleDeliverables.length} sample deliverables`);
    }
    
    if (phasesError || deliverablesError) {
      console.log('');
      console.log('🔧 Manual Setup Required:');
      console.log('1. Go to: https://supabase.com/dashboard/project/dmbavfwdvjbbtvpotvsn/sql');
      console.log('2. Copy the contents of PROJECT_CR_TASKS_FOR_SUPABASE.sql');
      console.log('3. Paste and run the SQL script');
      console.log('');
      console.log('This will populate your database with all Project CR tasks!');
    } else {
      console.log('🎉 Project CR database population complete!');
      console.log(`📊 Database now contains:`);
      console.log(`   - ${projectPhases.length} Project CR phases (Week 1-4)`);
      console.log(`   - ${sampleDeliverables.length} sample Project CR tasks`);
      console.log('');
      console.log('🌐 Your dashboard is ready at: http://localhost:3000');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.log('');
    console.log('🔧 Manual Setup Required:');
    console.log('1. Go to: https://supabase.com/dashboard/project/dmbavfwdvjbbtvpotvsn/sql');
    console.log('2. Copy the contents of PROJECT_CR_TASKS_FOR_SUPABASE.sql');
    console.log('3. Paste and run the SQL script');
  }
}

// Run the population script
populateDatabase();


