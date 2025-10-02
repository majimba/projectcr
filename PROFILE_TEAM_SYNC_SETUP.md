# Profile & Team Members Sync Setup

## Overview
This document explains how profile information (including profile pictures) is now synced with the team members display, and how notification emails are matched with team member data.

## What Changed

### 1. **Team Members Now Show Profile Data** 🎉
When a team member signs up and creates a profile, their information is automatically synced:
- ✅ Profile picture displays in team members list
- ✅ Name, email, phone, and bio from profile override team_members table
- ✅ Real-time updates when profile is changed
- ✅ Backwards compatible with team members who haven't signed up yet

### 2. **Dynamic Email Matching** 📧
Notification emails now intelligently match team members:
- ✅ Checks database first for email addresses
- ✅ Uses profile email if user has signed up
- ✅ Falls back to team_members email
- ✅ Maintains backwards compatibility with hardcoded emails

### 3. **Automatic Linking** 🔗
Team members are automatically linked with profiles:
- ✅ When a user signs up, their profile is linked to team_members by email
- ✅ Existing profiles are linked via migration script
- ✅ Profile updates automatically sync to team display

## How It Works

### Database Structure
```
team_members table:
├── id (UUID)
├── profile_id (UUID) → links to profiles table
├── name (fallback if no profile)
├── email (fallback if no profile)
├── role
├── assigned_tasks
├── bio (fallback if no profile)
├── phone (fallback if no profile)
└── is_active

profiles table:
├── id (UUID)
├── email
├── full_name
├── avatar_url ← Shows in team display!
├── phone
└── bio
```

### Priority System
When displaying team member data:
1. **First**: Check if `profile_id` exists and use profile data
2. **Second**: Fall back to team_members table data
3. **Result**: Seamless display whether user has signed up or not

### Email Matching Flow
```
Notification Triggered
    ↓
getTeamMemberEmailFromDB(assigneeName)
    ↓
1. Query team_members table by name
    ↓
2. If profile_id exists, use profile.email
    ↓
3. Otherwise, use team_members.email
    ↓
4. If not found, use hardcoded fallback
    ↓
Send Email ✉️
```

## Setup Instructions

### Step 1: Run Migration
Apply the migration to enable automatic linking:

```bash
# Navigate to project directory
cd "project CR/dashboard/project-cr-app"

# Apply migration using Supabase CLI
npx supabase db push
```

Or run manually in Supabase SQL Editor:
```sql
-- Copy contents from:
supabase/migrations/20251002000000_link_team_members_with_profiles.sql
```

### Step 2: Sync Existing Profiles (One-Time)
If you have existing profiles that need to be linked:

```sql
-- Run this in Supabase SQL Editor:
-- Copy contents from:
sync-team-members-with-profiles.sql
```

This will:
1. Show current linking status
2. Link team members with profiles by matching emails
3. Verify the links were created

### Step 3: Test the Integration

#### Test Profile Picture Sync:
1. Go to `/profile` page
2. Upload a profile picture
3. Update your profile
4. Navigate to `/team` page
5. ✅ Your picture should appear in the team list!

#### Test Email Notifications:
1. Assign a task to yourself
2. Check that the notification email goes to the correct address
3. If you've updated your profile email, it should use the new one

## Files Modified

### 1. `/app/api/team-members/route.ts`
- Now joins `team_members` with `profiles` table
- Returns profile data when available
- Falls back to team_members data for non-signup users

### 2. `/lib/gmail-email-service.ts`
- Added `getTeamMemberEmailFromDB()` function
- Queries database for current email addresses
- Maintains fallback for backwards compatibility
- Updated all email sending functions to use dynamic lookup

### 3. `/supabase/migrations/20251002000000_link_team_members_with_profiles.sql`
- Creates automatic linking on profile creation
- Updates existing team members with profile links
- Adds database triggers for automatic sync

### 4. `/sync-team-members-with-profiles.sql`
- Manual sync script for existing data
- Shows linking status
- Verifies connections

## Benefits

### For Users Who Sign Up
✅ Profile picture appears everywhere automatically  
✅ Can update their own contact information  
✅ Email notifications go to current email  
✅ Bio and phone sync across the system  

### For Team Members Without Accounts
✅ Still appear in team list with static data  
✅ Can receive notifications using team_members email  
✅ No disruption to existing workflow  
✅ Can sign up later to take control of their profile  

### For Administrators
✅ Single source of truth for user data  
✅ No manual syncing required  
✅ Automatic updates across the system  
✅ Easy to see who has signed up (has_profile flag)  

## Troubleshooting

### Profile Picture Not Showing?
1. Check if profile_id is set in team_members table
2. Run sync script: `sync-team-members-with-profiles.sql`
3. Verify emails match between tables

### Emails Going to Wrong Address?
1. Check profile email vs team_members email
2. Update profile email in `/profile` page
3. Verify email in database matches expected value

### Team Member Not Listed?
1. Check `is_active = true` in team_members table
2. Verify team member record exists
3. Check browser console for API errors

## Testing Checklist

- [ ] Profile picture uploads and displays in team list
- [ ] Profile updates reflect immediately in team display
- [ ] Notification emails use correct addresses
- [ ] New signups automatically link to team_members
- [ ] Existing team members without profiles still display
- [ ] Email changes in profile update notification recipient

## Future Enhancements

Potential improvements for the future:
- Allow users to invite team members via email
- Add role-based permissions tied to profiles
- Display "Invite to sign up" button for unlinked team members
- Show last login time for team members with profiles
- Add team member presence indicators (online/offline)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify database migrations are applied
3. Run the sync script to link existing profiles
4. Check Supabase logs for API errors

---

**Note**: All changes are backwards compatible. Team members without profiles will continue to function normally using the static data in the team_members table.

