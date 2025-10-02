#!/bin/bash

# Setup Profile & Team Member Sync
# This script helps you set up the automatic syncing between profiles and team members

echo "================================================"
echo "Profile & Team Members Sync Setup"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project-cr-app directory"
    exit 1
fi

echo "✅ Running in correct directory"
echo ""

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. You can install it with:"
    echo "   npm install -g supabase"
    echo ""
    echo "📝 Manual Setup Instructions:"
    echo "   1. Go to your Supabase project dashboard"
    echo "   2. Navigate to SQL Editor"
    echo "   3. Copy and run: supabase/migrations/20251002000000_link_team_members_with_profiles.sql"
    echo "   4. Then run: sync-team-members-with-profiles.sql"
    echo ""
    exit 0
fi

echo "✅ Supabase CLI found"
echo ""

# Ask user if they want to proceed
echo "This will:"
echo "  1. Apply database migration for automatic profile linking"
echo "  2. Link existing team members with their profiles"
echo ""
read -p "Do you want to proceed? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "🚀 Applying migration..."
echo ""

# Apply migration
npx supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration applied successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. The system will now automatically link profiles with team members"
    echo "   2. When users sign up, they'll be linked by email"
    echo "   3. Profile pictures will appear in the team members list"
    echo "   4. Notification emails will use the correct addresses"
    echo ""
    echo "🔍 To verify the setup, run this in Supabase SQL Editor:"
    echo "   SELECT tm.name, tm.email, tm.profile_id, p.full_name, p.avatar_url"
    echo "   FROM team_members tm"
    echo "   LEFT JOIN profiles p ON tm.profile_id = p.id;"
    echo ""
    echo "📖 For more information, see: PROFILE_TEAM_SYNC_SETUP.md"
else
    echo ""
    echo "❌ Migration failed. Please check the error above."
    echo ""
    echo "💡 Try manual setup:"
    echo "   1. Go to Supabase Dashboard → SQL Editor"
    echo "   2. Run: supabase/migrations/20251002000000_link_team_members_with_profiles.sql"
    echo "   3. Then run: sync-team-members-with-profiles.sql"
fi

echo ""
echo "================================================"

