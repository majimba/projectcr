#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const userId = process.env.USER_ID;

if (!userId) {
  console.error('❌ Please provide USER_ID environment variable');
  console.log('Usage: USER_ID="your-uuid" node create-profile-with-id.js');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createProfile() {
  console.log('Creating profile for user:', userId);
  
  // First fix the task names
  const { error: updateError } = await supabase
    .from('deliverables')
    .update({ assignee_name: 'Chawana Maseka' })
    .eq('assignee_name', 'Chawana Masaka');
  
  if (!updateError) {
    console.log('✅ Fixed task name typos');
  }

  // Insert profile
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: 'chawana.maseka@gmail.com',
      full_name: 'Chawana Maseka',
      role: 'user'
    });

  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('✅ Profile created successfully!');
    console.log('\nNow run: node backfill-notifications.js');
  }
}

createProfile();
