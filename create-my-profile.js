#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// You need to provide your Supabase Service Role Key for this to work
// Get it from: https://supabase.com/dashboard/project/dmbavfwdvjbbtvpotvsn/settings/api

console.log('📋 Profile Creation Helper\n');
console.log('To create your profile, we need to run SQL in Supabase Dashboard.\n');
console.log('Follow these steps:\n');

console.log('1️⃣  Go to: https://supabase.com/dashboard/project/dmbavfwdvjbbtvpotvsn/editor/sql');
console.log('\n2️⃣  Run this query to find your user ID:\n');
console.log('---SQL---');
console.log(`SELECT id, email, raw_user_meta_data->>'full_name' as full_name 
FROM auth.users;`);
console.log('---------\n');

console.log('3️⃣  Copy your user ID, then run this (replace YOUR_USER_ID):\n');
console.log('---SQL---');
console.log(`-- Replace YOUR_USER_ID with your actual UUID from step 2
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  'YOUR_USER_ID',  -- Your user ID from step 2
  'chawana.maseka@gmail.com',
  'Chawana Maseka',  -- MUST match task assignments exactly
  'user'
)
ON CONFLICT (id) 
DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email;

-- Verify it was created
SELECT * FROM profiles;`);
console.log('---------\n');

console.log('4️⃣  After creating the profile, run this script to generate notifications:\n');
console.log('   node backfill-notifications.js\n');

console.log('📝 Note: The name "Chawana Maseka" must match EXACTLY how tasks are assigned.');
console.log('   Check current assignments with:');
console.log('   SELECT DISTINCT assignee_name FROM deliverables WHERE assignee_name IS NOT NULL;\n');

