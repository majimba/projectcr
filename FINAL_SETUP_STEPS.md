# ✅ Final Setup Steps for Notifications

## Current Status
✅ Notifications table created  
✅ API endpoints working  
✅ UI components ready  
✅ Database triggers configured  
✅ Profile auto-creation migration added  
❌ **Need to create your user account**

## What You Need to Do

### Step 1: Create/Login to Your Account

**Go to your app:** http://localhost:3001/login

**Option A: If you already have an account**
- Just log in with your credentials
- Your profile will be auto-created on login

**Option B: If you need to create an account**
1. Go to http://localhost:3001 (or /signup if there's a signup page)
2. Sign up with:
   - Email: `chawana.maseka@gmail.com`
   - Password: (choose a secure password)
   - **Full Name: `Chawana Maseka`** ← CRITICAL: Must match exactly!

### Step 2: Update Profile Name (if needed)

After logging in, if your profile name doesn't match the task assignments:

**Via Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/dmbavfwdvjbbtvpotvsn/editor
2. Go to Table Editor → `profiles`
3. Find your profile row
4. Edit `full_name` to be **exactly**: `Chawana Maseka`
5. Save

**OR via SQL Editor:**
```sql
-- Find your profile first
SELECT * FROM profiles;

-- Update your full_name to match task assignments
UPDATE profiles 
SET full_name = 'Chawana Maseka'
WHERE email = 'chawana.maseka@gmail.com';
```

### Step 3: Backfill Notifications for Existing Tasks

Once your profile exists with the correct name:

```bash
cd "/Users/mac/Arc Synthesis/luminary_co/project CR/dashboard/project-cr-app"
node backfill-notifications.js
```

You should see:
```
✅ Created assignment notification: "Open Business Bank Account" → Chawana Maseka
✅ Created assignment notification: "Confirm Tax Registration" → Chawana Maseka
🎉 Created completion notification: "Open Business Bank Account" → Chawana Maseka
🎉 Created completion notification: "Confirm Tax Registration" → Chawana Maseka
```

### Step 4: Verify Notifications Appear

1. Refresh your browser at http://localhost:3001
2. Click the notification bell icon
3. You should see 4 notifications:
   - 2 task assignments
   - 2 task completions

## Troubleshooting

### Issue: Backfill script says "No profile found"

**Check if profile exists:**
```bash
curl -s "https://dmbavfwdvjbbtvpotvsn.supabase.co/rest/v1/profiles?select=full_name" \
  -H "apikey: YOUR_KEY" | jq '.'
```

**Fix:** Make sure you're logged in to create the auth user and profile.

### Issue: Profile exists but name doesn't match

**Check task assignments:**
```sql
SELECT DISTINCT assignee_name FROM deliverables 
WHERE assignee_name IS NOT NULL;
```

**Check your profile:**
```sql
SELECT id, full_name FROM profiles;
```

**They must match EXACTLY** - same case, same spelling, same spaces.

### Issue: Notifications still not showing

1. **Check browser console** for errors (F12)
2. **Verify you're logged in** - check if profile dropdown shows your name
3. **Check server is running** on http://localhost:3001 (not 3000)
4. **Hard refresh browser** - Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## Future Behavior

Once everything is set up:
- ✅ **New task assignments** → Automatic notification
- ✅ **Task completions** → Automatic notification  
- ✅ **Real-time updates** → Every 30 seconds
- ✅ **Email notifications** → Also sent (if configured)

No manual steps needed for future tasks!

## Quick Verification

Run these to verify everything:

```bash
# 1. Check if you're logged in (in browser, check cookies)
# 2. Check profile exists
curl "https://dmbavfwdvjbbtvpotvsn.supabase.co/rest/v1/profiles?select=*" \
  -H "apikey: YOUR_KEY"

# 3. Check notifications count
curl "https://dmbavfwdvjbbtvpotvsn.supabase.co/rest/v1/notifications?select=count" \
  -H "apikey: YOUR_KEY"
```

## Summary

The notification system is **fully built and ready**. You just need to:
1. **Log in** (or sign up) to create your user profile
2. **Ensure name matches** "Chawana Maseka" exactly
3. **Run backfill script** to create notifications for existing tasks
4. **Refresh and enjoy** your working notification system! 🎉
