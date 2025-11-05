#!/bin/bash

# Setup script for data migration from Flask SQLite to Supabase

echo "Setting up data migration environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "Error: pip3 is required but not installed."
    exit 1
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt

# Check if environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "Error: Environment variables not set."
    echo "Please set the following environment variables:"
    echo "  export SUPABASE_URL=your_supabase_project_url"
    echo "  export SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key"
    exit 1
fi

# Check if SQLite database exists
if [ ! -f "../NicheTracker/instance/niches.db" ]; then
    echo "Error: SQLite database not found at ../NicheTracker/instance/niches.db"
    echo "Please ensure the original Flask application database exists."
    exit 1
fi

echo "Setup complete! You can now run the migration with:"
echo "  python3 migrate-data.py"
