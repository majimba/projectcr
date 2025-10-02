# Manual Fix for Notifications

## The Problem
- You're logged in to the app
- But no profile exists in the database
- This prevents notifications from being created

## Solution: Run SQL Directly in Supabase Dashboard

### Step 1: Go to Supabase SQL Editor
https://supabase.com/dashboard/project/dmbavfwdvjbbtvpotvsn/editor/sql

### Step 2: Check if auth users exist
Run this first:
```sql
SELECT id, email, created_at FROM auth.users;
```

**Expected Result:**
- You should see at least one user (you!)
- Copy your `id` (it's a UUID)

### Step 3: Create Your Profile
Replace `YOUR_USER_ID_HERE` with the ID from Step 2:

```sql
-- Create your profile
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with your user ID from Step 2
  'chawana@luminaryco.co',  -- Your email
  'Chawana Maseka',  -- Your name (must match exactly)
  'user'
)
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name;

-- Verify it was created
SELECT * FROM profiles;
```

### Step 4: Fix Task Name Typos
```sql
-- Fix the typo in task assignments
UPDATE deliverables
SET assignee_name = 'Chawana Maseka'
WHERE assignee_name = 'Chawana Masaka';

-- Verify
SELECT DISTINCT assignee_name FROM deliverables 
WHERE assignee_name IS NOT NULL;
```

### Step 5: Run Backfill Script
Back in your terminal:
```bash
cd "/Users/mac/Arc Synthesis/luminary_co/project CR/dashboard/project-cr-app"
node backfill-notifications.js
```

**Expected Output:**
```
✅ Created assignment notification: "Open Business Bank Account" → Chawana Maseka
✅ Created assignment notification: "Confirm Tax Registration" → Chawana Maseka  
🎉 Created completion notification: "Open Business Bank Account" → Chawana Maseka
🎉 Created completion notification: "Confirm Tax Registration" → Chawana Maseka
📊 Total: 4+ notifications
```

### Step 6: Check Notifications in App
1. Refresh browser: http://localhost:3001
2. Click notification bell icon
3. You should see your notifications!

## Alternative: If No Auth Users Exist

If Step 2 shows no users, you need to sign up:

1. **Log out** from the app
2. Go to http://localhost:3001/login
3. Click "Sign Up" (if available) or use the signup flow
4. **Sign up with:**
   - Email: `chawana@luminaryco.co`
   - Password: (choose one)
   - Full Name: `Chawana Maseka`
5. Then go back to Step 2 above

## Quick Verification Commands

After running the SQL, verify everything:

```sql
-- Check profile exists
SELECT COUNT(*) as profile_count FROM profiles;

-- Check tasks are correctly assigned
SELECT COUNT(*) as task_count FROM deliverables 
WHERE assignee_name = 'Chawana Maseka';

-- Check notifications were created
SELECT COUNT(*) as notification_count FROM notifications;
```

## Still Having Issues?

If you're still having problems, please share:
1. Output from Step 2 (Do auth users exist?)
2. Output from profile check
3. Any error messages from the backfill script

The notification system is 100% built and ready - we just need your profile in the database!
