# Email Addresses Clarification

## ✅ CORRECT Email Setup

### Team Member Email Addresses (Personal Gmail)
These are the **ONLY** real email addresses for team members:

| Name | Email Address |
|------|--------------|
| Chawana Maseka | `chawana.maseka@gmail.com` |
| Maynard Muchangwe | `maynarjfilms@gmail.com` |
| Emmanuel Kapili | `risendream@gmail.com` |
| Munsanje Hachamba | `pandazm76@gmail.com` |
| Delphine Mwape | `delphinemwape2@gmail.com` |

### Company Email Address
- **Only real company email**: `hello@luminaryco.co`

## ❌ What DOESN'T Exist

The following @luminaryco.co email addresses **DO NOT EXIST**:
- ❌ chawana.masaka@luminaryco.co
- ❌ maynard.muchangwe@luminaryco.co
- ❌ emmanuel.kapili@luminaryco.co
- ❌ munsanje.hachamba@luminaryco.co
- ❌ delphine.mwape@luminaryco.co

**Only** `hello@luminaryco.co` is a real company address.

## How It Works Now

### Team Members Page (`/team`)
- ✅ Shows personal Gmail addresses
- ✅ These are the actual working email addresses
- ✅ When users sign up, their profile email (Gmail) overrides the default

### Notification Emails
- ✅ Go to personal Gmail addresses
- ✅ Uses hardcoded mapping as fallback
- ✅ Can be overridden by profile email when user signs up

### Profile System
- ✅ Users can update their own email in profile
- ✅ Profile email takes priority over default mapping
- ✅ Changes reflect immediately in team display and notifications

## Database Update Required

To fix the team_members table to show correct emails:

```sql
-- Run this in Supabase SQL Editor:
-- File: fix-team-member-emails.sql

UPDATE team_members SET email = 'chawana.maseka@gmail.com' 
WHERE name = 'Chawana Masaka' OR name = 'Chawana Maseka';

UPDATE team_members SET email = 'maynarjfilms@gmail.com' 
WHERE name = 'Maynard Muchangwe';

UPDATE team_members SET email = 'risendream@gmail.com' 
WHERE name = 'Emmanuel Kapili';

UPDATE team_members SET email = 'pandazm76@gmail.com' 
WHERE name = 'Munsanje Hachamba';

UPDATE team_members SET email = 'delphinemwape2@gmail.com' 
WHERE name = 'Delphine Mwape';
```

## Email Flow

```
Task Assignment/Notification
    ↓
Check if user has profile
    ↓
├─ YES → Use profile.email (their Gmail)
└─ NO  → Check team_members.email
    ↓
├─ Found → Use team_members.email
└─ Not Found → Use hardcoded Gmail mapping
    ↓
Send email to Personal Gmail ✉️
```

## Company Notifications

All company management notifications go to:
- **`hello@luminaryco.co`**

This includes:
- Task assignment alerts for management
- Task completion notifications
- System updates

## Summary

✅ **Use**: Personal Gmail addresses everywhere  
✅ **Display**: Personal Gmail on team members page  
✅ **Send to**: Personal Gmail for notifications  
✅ **Company email**: Only `hello@luminaryco.co`  
❌ **Don't use**: Individual @luminaryco.co addresses (they don't exist)

---

**Last Updated**: October 2, 2025  
**Action Required**: Run `fix-team-member-emails.sql` in Supabase

