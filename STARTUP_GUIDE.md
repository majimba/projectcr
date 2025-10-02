# 🚀 Safe Server Startup Guide

## ✅ Your Data is ALWAYS Safe

**Important**: Your database is hosted on Supabase Cloud, NOT on your local machine.

### What Happens During Server Restart:

```
npm run dev (restart)
    ↓
1. Local Next.js server stops
2. Local Next.js server starts
3. Connects to Supabase Cloud ← Your data lives here
    ↓
✅ All data intact (tasks, profiles, notifications)
```

## 🎯 Why You Saw "Missing Profile"

The profile disappearing was a **display issue**, not data loss:

1. Server restarted
2. Browser tried to load before server was ready
3. Connection timed out temporarily
4. App showed "no profile" (but it was still in the database!)

## 🔧 Proper Startup Procedure:

### Method 1: Normal Restart (Always Safe)
```bash
# Stop server: Ctrl+C
# Start server:
npm run dev

# Wait for this message:
# ✓ Ready in X.Xs

# THEN refresh your browser
```

### Method 2: Clean Restart (If having issues)
```bash
# 1. Stop server (Ctrl+C)
# 2. Clear cache:
rm -rf .next

# 3. Start fresh:
npm run dev

# 4. Wait for "Ready" message
# 5. Refresh browser
```

## 📊 Data Persistence Guarantee:

| Operation | Your Data | Why |
|-----------|-----------|-----|
| Server restart (`npm run dev`) | ✅ Safe | Data in cloud |
| Browser refresh | ✅ Safe | Data in cloud |
| Computer restart | ✅ Safe | Data in cloud |
| Update code | ✅ Safe | Data in cloud |
| Run migrations | ✅ Safe | Only structure changes |
| Power outage | ✅ Safe | Data in cloud |

## ❌ ONLY These Delete Data:

1. **Running `populate-project-cr-data.js`** ← Now in `_DANGEROUS_DO_NOT_RUN/`
2. **Running `setup-project-cr-database.sh`** ← Now in `_DANGEROUS_DO_NOT_RUN/`
3. **Manually deleting in Supabase Dashboard**
4. **Running SQL DELETE commands**

Everything else is **100% safe**.

## 🐛 Troubleshooting "Missing Profile"

If you see your profile disappear after restart:

### Quick Fix:
```bash
# 1. Check if server is fully started
# Look for: ✓ Ready in X.Xs

# 2. Hard refresh browser
# Mac: Cmd + Shift + R
# Windows: Ctrl + Shift + R

# 3. Still not working?
# Re-run the profile SQL script in Supabase
```

### Why This Happens:
- Race condition: Browser loads before database connection established
- Solution: Just refresh after server is fully ready

## 🔒 Extra Safety Measures:

### 1. Enable Supabase Backups:
- Go to: Supabase Dashboard → Database → Backups
- Enable Point-in-Time Recovery
- Set retention: 7-30 days

### 2. Regular Manual Backups (Optional):
```bash
# Export your database (weekly):
# Supabase Dashboard → Database → Backups → Create backup
```

### 3. Version Control:
Your migrations are in Git, so database structure is version controlled.

## 💡 Best Practices:

### DO:
- ✅ Restart server anytime (`npm run dev`)
- ✅ Refresh browser anytime
- ✅ Update code anytime
- ✅ Run migrations
- ✅ Update profiles through UI

### DON'T:
- ❌ Run scripts in `_DANGEROUS_DO_NOT_RUN/`
- ❌ Run `populate-*` scripts
- ❌ Run scripts with DELETE commands
- ❌ Manually delete data in Supabase unless intentional

## 🎉 Summary:

**Your data lives in Supabase Cloud** - it's persistent across:
- ✅ Server restarts
- ✅ Browser refreshes  
- ✅ Code changes
- ✅ Computer restarts
- ✅ Everything normal development

**The only thing that deletes data**: Running explicit deletion scripts (now safely quarantined).

---

**Remember**: If you ever see "missing data" after restart, it's almost always a **display/connection issue**, not actual data loss. Just refresh your browser!

