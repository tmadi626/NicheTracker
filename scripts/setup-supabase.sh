#!/bin/bash

# Supabase Migration Script
# This script helps you run the database migrations

echo "🚀 Setting up Supabase database migrations..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo "SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key"
    echo ""
    exit 1
fi

# Load environment variables
source .env.local

# Check if credentials are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ Supabase credentials not found in .env.local"
    echo "Please add your Supabase project URL and anon key"
    exit 1
fi

echo "✅ Supabase credentials found"
echo "📊 Project URL: $NEXT_PUBLIC_SUPABASE_URL"

# Run migrations
echo "🔄 Running database migrations..."

# Migration 1: Initial schema
echo "📝 Running initial schema migration..."
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d @supabase/migrations/001_initial_schema.sql

# Migration 2: Indexes
echo "📝 Running indexes migration..."
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d @supabase/migrations/002_add_indexes.sql

echo "✅ Database migrations completed!"
echo "🎉 Your Supabase database is ready!"
