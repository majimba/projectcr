# Setup Notifications for Existing Tasks

## Current Issue
You have tasks assigned to "Chawana Maseka" but no notifications are showing because:
1. **No profiles in database** - The `profiles` table is empty
2. **No matching user** - Tasks are assigned to "Chawana Maseka" but there's no profile with that name
3. **Tasks created before notifications** - Existing tasks don't have notifications

## Solution Steps

### Step 1: Create Your Profile

You need to ensure your user profile exists in the database with the exact name used in task assignments.

**Option A: Through Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Open your project: `dmbavfwdvjbbtvpotvsn`
3. Go to **SQL Editor**
4. Run this query to check what auth users exist:
```sql
SELECT id, email, raw_user_meta_data->>'full_name' as full_name 
FROM auth.users;
```

5. Copy your user ID, then run this to create/update your profile:
```sql
-- Replace YOUR_USER_ID with your actual user ID from step 4
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  'YOUR_USER_ID',  -- Your user ID from auth.users
  'chawana.maseka@gmail.com',  -- Your email
  'Chawana Maseka',  -- MUST match exactly with task assignments
  'user'
)
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name;
```

**Option B: Auto-create profiles for all auth users**
```sql
-- This creates profiles for ALL authenticated users
INSERT INTO profiles (id, email, full_name)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)) as full_name
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = auth.users.id
);
```

### Step 2: Verify Profile Name Matches

Make sure your profile `full_name` **exactly matches** the `assignee_name` in deliverables:

```sql
-- Check task assignments
SELECT DISTINCT assignee_name 
FROM deliverables 
WHERE assignee_name IS NOT NULL;

-- Check profiles
SELECT id, full_name 
FROM profiles;

-- They must match EXACTLY (case-sensitive, spaces, etc.)
```

### Step 3: Run Backfill Script

Once your profile exists with the correct name:

```bash
cd "/Users/mac/Arc Synthesis/luminary_co/project CR/dashboard/project-cr-app"
node backfill-notifications.js
```

This will create notifications for:
- ✅ All tasks assigned to you
- ✅ All tasks you've completed

### Step 4: Refresh and Check

1. Refresh your browser at http://localhost:3001
2. Click the notification bell
3. You should see notifications for:
   - "Open Business Bank Account" (assigned & completed)
   - "Confirm Tax Registration" (assigned & completed)

## Future Tasks

Going forward, the database triggers will automatically create notifications when:
- A task is assigned to you
- You complete a task
- Task status changes

No manual backfilling needed for new tasks!

## Troubleshooting

**Issue: "No profile found for Chawana Maseka"**
- **Cause**: Profile doesn't exist or name doesn't match
- **Fix**: Run Step 1 above to create profile with exact name

**Issue: "No notifications appear"**
- **Cause**: Profile exists but name spelling is different
- **Fix**: Update profile name to match exactly:
```sql
UPDATE profiles 
SET full_name = 'Chawana Maseka'  -- Exact spelling from tasks
WHERE email = 'chawana.maseka@gmail.com';
```

**Issue: "Notifications created but can't see them"**
- **Cause**: Wrong user logged in, or RLS policies blocking
- **Fix**: Make sure you're logged in as the user with the matching profile

## Quick Fix Command

If you just want to get it working fast:

1. **Find your user ID:**
```bash
curl -s "https://dmbavfwdvjbbtvpotvsn.supabase.co/rest/v1/rpc/auth_uid" \
  -H "apikey: YOUR_KEY" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

2. **Create profile via SQL Editor:**
```sql
-- Use your actual user ID
INSERT INTO profiles (id, email, full_name)
VALUES ('your-user-id-here', 'chawana.maseka@gmail.com', 'Chawana Maseka')
ON CONFLICT (id) DO NOTHING;
```

3. **Run backfill:**
```bash
node backfill-notifications.js
```

That's it! Your notifications should now appear.
