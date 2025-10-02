#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function backfillNotifications() {
  console.log('🚀 Starting notifications backfill...\n');

  try {
    // Get all deliverables with assignments
    const { data: deliverables, error: deliverablesError } = await supabase
      .from('deliverables')
      .select('id, title, assignee_name, status, project_area, due_date, created_at, updated_at')
      .not('assignee_name', 'is', null)
      .neq('assignee_name', '')
      .neq('assignee_name', 'Unassigned');

    if (deliverablesError) {
      console.error('❌ Error fetching deliverables:', deliverablesError);
      return;
    }

    console.log(`📦 Found ${deliverables.length} assigned tasks\n`);

    let assignmentCount = 0;
    let completionCount = 0;

    for (const task of deliverables) {
      // Find the user profile for this assignee
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('full_name', task.assignee_name)
        .single();

      if (profileError || !profile) {
        console.log(`⚠️  No profile found for: ${task.assignee_name}`);
        continue;
      }

      // Check if assignment notification already exists
      const { data: existingAssignment } = await supabase
        .from('notifications')
        .select('id')
        .eq('related_deliverable_id', task.id)
        .eq('type', 'task_assigned')
        .single();

      // Create assignment notification if it doesn't exist
      if (!existingAssignment) {
        const { error: assignError } = await supabase
          .from('notifications')
          .insert({
            user_id: profile.id,
            type: 'task_assigned',
            title: 'Task Assigned',
            message: `You have been assigned to "${task.title}"`,
            related_deliverable_id: task.id,
            metadata: {
              assignee_name: task.assignee_name,
              project_area: task.project_area,
              due_date: task.due_date,
              backfilled: true
            },
            created_at: task.created_at,
            is_read: false
          });

        if (!assignError) {
          assignmentCount++;
          console.log(`✅ Created assignment notification: "${task.title}" → ${task.assignee_name}`);
        } else {
          console.error(`❌ Error creating assignment notification:`, assignError);
        }
      }

      // If task is completed, check for completion notification
      if (task.status === 'done') {
        const { data: existingCompletion } = await supabase
          .from('notifications')
          .select('id')
          .eq('related_deliverable_id', task.id)
          .eq('type', 'task_completed')
          .single();

        // Create completion notification if it doesn't exist
        if (!existingCompletion) {
          const { error: completeError } = await supabase
            .from('notifications')
            .insert({
              user_id: profile.id,
              type: 'task_completed',
              title: 'Task Completed',
              message: `Congratulations! You completed "${task.title}"`,
              related_deliverable_id: task.id,
              metadata: {
                assignee_name: task.assignee_name,
                project_area: task.project_area,
                completed_at: task.updated_at,
                backfilled: true
              },
              created_at: task.updated_at,
              is_read: false
            });

          if (!completeError) {
            completionCount++;
            console.log(`🎉 Created completion notification: "${task.title}" → ${task.assignee_name}`);
          } else {
            console.error(`❌ Error creating completion notification:`, completeError);
          }
        }
      }
    }

    console.log(`\n✨ Backfill Complete!`);
    console.log(`📬 Created ${assignmentCount} assignment notifications`);
    console.log(`🎊 Created ${completionCount} completion notifications`);
    console.log(`📊 Total: ${assignmentCount + completionCount} notifications\n`);

    // Show summary by user
    const { data: summary } = await supabase
      .from('notifications')
      .select('user_id, profiles!inner(full_name)')
      .eq('metadata->>backfilled', 'true');

    if (summary) {
      const userCounts = {};
      summary.forEach(n => {
        const name = n.profiles.full_name;
        userCounts[name] = (userCounts[name] || 0) + 1;
      });

      console.log('📋 Notifications by user:');
      Object.entries(userCounts).forEach(([name, count]) => {
        console.log(`   ${name}: ${count} notifications`);
      });
    }

  } catch (error) {
    console.error('❌ Backfill failed:', error);
  }
}

backfillNotifications();
