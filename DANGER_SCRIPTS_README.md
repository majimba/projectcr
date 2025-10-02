# ⚠️ DANGEROUS SCRIPTS - READ BEFORE RUNNING

## 🚨 Scripts That WILL DELETE Your Data

The following scripts contain commands that **WIPE OUT** your database:

### ❌ DO NOT RUN THESE (Unless you want to lose everything):

1. **`populate-project-cr-data.js`**
   - Deletes ALL deliverables
   - Deletes ALL project phases
   - Resets to demo data
   - **YOU WILL LOSE: All task assignments, completions, and progress**

2. **`setup-project-cr-database.sh`**
   - Runs `supabase db reset`
   - Completely wipes the database
   - **YOU WILL LOSE: Everything - all tables reset**

3. **`populate-with-auth.js`**
   - Deletes deliverables and phases
   - **YOU WILL LOSE: All task data**

## ✅ SAFE Scripts (Run Anytime):

### Profile & Team Management:
- `link-my-profile.sql` - Links your profile (safe UPDATE)
- `fix-team-member-emails.sql` - Updates emails (safe UPDATE)
- `sync-team-members-with-profiles.sql` - Links profiles (safe UPDATE)

### Notifications:
- `backfill-notifications.js` - Creates missing notifications (safe INSERT)
- `backfill-notifications.sql` - Same as above (safe INSERT)

### Security:
- `fix-security-warnings.sql` - Fixes function security (safe ALTER)

### Database Migrations:
- Anything in `supabase/migrations/` folder - Safe structural changes

## 🛡️ How to Protect Your Data:

### 1. **Never Run Scripts Without Checking**
Before running ANY `.js` or `.sh` script:
```bash
# Read it first!
cat script-name.js | grep -i "delete\|truncate\|reset"
```

If you see DELETE, TRUNCATE, or RESET commands - **STOP!**

### 2. **Regular Backups**
Back up your database regularly in Supabase Dashboard:
- Go to Database → Backups
- Enable Point-in-Time Recovery
- Or manually export: Database → Backups → Create backup

### 3. **Use the UI for Normal Operations**
- ✅ Assign tasks through the dashboard
- ✅ Update profiles through `/profile` page
- ✅ Complete tasks through task details
- ✅ Manage team through `/team` page

## 🔧 What Happened to Your Data:

Someone (or you accidentally) ran `populate-project-cr-data.js`, which:
1. Deleted all 56 deliverables
2. Reset them to unassigned demo tasks
3. Lost all your assignments and completions

## 💾 Future Protection:

I've marked the dangerous scripts clearly. Going forward:
- App restarts are always safe
- UI operations are always safe
- SQL migrations are structural only (safe)
- Only data population scripts are dangerous

## 📋 What To Do Now:

1. **Don't panic** - The app structure is fine
2. **Re-assign tasks** through the dashboard UI
3. **Going forward**: All changes persist automatically
4. **Never run** the population scripts again

## ✨ The Silver Lining:

Now that your profile and notification system is properly set up:
- Future task assignments will create notifications automatically
- Profile updates sync everywhere
- No manual SQL needed
- Everything persists correctly

---

**Remember**: When in doubt, ask before running any script!

