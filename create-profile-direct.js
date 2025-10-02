#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createProfileDirectly() {
  console.log('🚀 Creating profile directly...\n');

  try {
    // First, let's see what auth users exist
    console.log('📋 Checking auth setup...');
    
    // Try to get current session/user
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session exists:', !!session);
    
    if (!session) {
      console.log('\n⚠️  No active session found.');
      console.log('You need to be logged in for this to work.\n');
      console.log('Let me try a different approach - creating profile with a known user ID...\n');
    }

    // Get all profiles to see current state
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('*');
    
    console.log('📊 Current profiles in database:', existingProfiles?.length || 0);
    if (existingProfiles && existingProfiles.length > 0) {
      console.log('Existing profiles:', existingProfiles);
    }

    // Try to insert profile directly (this will work if we have the user ID)
    // We'll use a common approach - try to fetch from auth metadata
    console.log('\n🔍 Attempting to create/update profile...');
    
    // Method 1: Try with RPC call to handle auth user lookup
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_auth_user_id');
    
    if (rpcError) {
      console.log('RPC method not available (expected)');
    }

    // Method 2: Direct insert with upsert (will create if user exists)
    console.log('\n💡 Solution: We need to get your user ID from the browser.');
    console.log('\nHere\'s what to do:\n');
    console.log('1. Open your browser at http://localhost:3001');
    console.log('2. Open Developer Console (F12)');
    console.log('3. Run this JavaScript in the console:\n');
    console.log('   supabase.auth.getUser().then(({data}) => console.log(data.user.id));\n');
    console.log('4. Copy the user ID that appears');
    console.log('5. Run this command:\n');
    console.log('   USER_ID="your-id-here" node create-profile-with-id.js\n');

    // Create the helper script
    const fs = require('fs');
    const helperScript = `#!/usr/bin/env node

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
    console.log('\\nNow run: node backfill-notifications.js');
  }
}

createProfile();
`;

    fs.writeFileSync('create-profile-with-id.js', helperScript);
    console.log('✅ Created helper script: create-profile-with-id.js\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createProfileDirectly();
