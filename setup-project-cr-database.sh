#!/bin/bash

# Project CR Database Setup Script
# This script sets up the database with Project CR tasks and phases

echo "🚀 Setting up Project CR Database..."

# Navigate to project directory
cd "$(dirname "$0")"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Start Supabase (if not already running)
echo "📡 Starting Supabase..."
supabase start

# Reset the database to ensure clean state
echo "🔄 Resetting database..."
supabase db reset

# Apply migrations
echo "📋 Applying migrations..."
supabase db push

# Run the Project CR seeding script
echo "🌱 Seeding Project CR tasks..."
psql -h localhost -p 54322 -U postgres -d postgres -f seed-data-project-cr.sql

echo "✅ Project CR Database setup complete!"
echo ""
echo "📊 Database contains:"
echo "   - 4 Project CR phases (Week 1-4)"
echo "   - 50+ Project CR tasks across 6 implementation areas"
echo "   - Proper categorization by week and project area"
echo ""
echo "🌐 You can now start the application with:"
echo "   npm run dev"
echo ""
echo "📝 Access the dashboard at: http://localhost:3000"


