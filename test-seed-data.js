// Test script to verify seeded data
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dmbavfwdvjbbtvpotvsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtYmF2ZndkdmpiYnR2cG90dnNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTg4NjksImV4cCI6MjA3NDc5NDg2OX0.HZBvoUnMmZZ_6rMYhdKm0b03wjbRtCaH67dAejEYXJU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSeedData() {
  console.log('🧪 Testing seeded data...\n');

  try {
    // Test project phases
    console.log('📅 Project Phases:');
    const { data: phases, error: phasesError } = await supabase
      .from('project_phases')
      .select('*')
      .order('order_index');
    
    if (phasesError) {
      console.error('❌ Error fetching phases:', phasesError);
    } else {
      console.log(`✅ Found ${phases.length} project phases`);
      phases.forEach(phase => {
        console.log(`   - ${phase.name} (${phase.status})`);
      });
    }

    // Test deliverables
    console.log('\n📋 Deliverables:');
    const { data: deliverables, error: deliverablesError } = await supabase
      .from('deliverables')
      .select('*')
      .order('week_number, due_date');
    
    if (deliverablesError) {
      console.error('❌ Error fetching deliverables:', deliverablesError);
    } else {
      console.log(`✅ Found ${deliverables.length} deliverables`);
      deliverables.forEach(deliverable => {
        console.log(`   - ${deliverable.title} (${deliverable.status}) - Week ${deliverable.week_number}`);
      });
    }

    // Test team members
    console.log('\n👥 Team Members:');
    const { data: teamMembers, error: teamError } = await supabase
      .from('team_members')
      .select('*');
    
    if (teamError) {
      console.error('❌ Error fetching team members:', teamError);
    } else {
      console.log(`✅ Found ${teamMembers.length} team members`);
      teamMembers.forEach(member => {
        console.log(`   - ${member.role}`);
      });
    }

    // Test comments
    console.log('\n💬 Comments:');
    const { data: comments, error: commentsError } = await supabase
      .from('deliverable_comments')
      .select('*');
    
    if (commentsError) {
      console.error('❌ Error fetching comments:', commentsError);
    } else {
      console.log(`✅ Found ${comments.length} comments`);
    }

    // Test history
    console.log('\n📝 History:');
    const { data: history, error: historyError } = await supabase
      .from('deliverable_history')
      .select('*');
    
    if (historyError) {
      console.error('❌ Error fetching history:', historyError);
    } else {
      console.log(`✅ Found ${history.length} history entries`);
    }

    console.log('\n🎉 Seed data test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSeedData();
