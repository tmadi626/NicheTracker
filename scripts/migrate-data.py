#!/usr/bin/env python3
"""
Data migration script to migrate from Flask SQLite to Supabase PostgreSQL
"""

import sqlite3
import json
import os
from datetime import datetime
from typing import Dict, List, Any

try:
    from supabase import create_client, Client
except ImportError:
    print("Error: supabase package not found. Install it with: pip install supabase")
    exit(1)

# Configuration
SQLITE_DB_PATH = "../NicheTracker/instance/niches.db"
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def connect_sqlite(db_path: str) -> sqlite3.Connection:
    """Connect to SQLite database"""
    return sqlite3.connect(db_path)

def connect_supabase(url: str, key: str) -> Client:
    """Connect to Supabase"""
    return create_client(url, key)

def migrate_niches(supabase: Client, sqlite_conn: sqlite3.Connection) -> Dict[str, str]:
    """Migrate niches and return mapping of old_id -> new_id"""
    print("Migrating niches...")
    
    # Get niches from SQLite
    cursor = sqlite_conn.cursor()
    cursor.execute("SELECT id, name, slug, description, created_at FROM niche")
    niches = cursor.fetchall()
    
    niche_mapping = {}
    
    for niche in niches:
        old_id, name, slug, description, created_at = niche
        
        # Insert into Supabase
        result = supabase.table('niches').insert({
            'name': name,
            'slug': slug,
            'description': description,
            'created_at': created_at
        }).execute()
        
        if result.data:
            new_id = result.data[0]['id']
            niche_mapping[str(old_id)] = new_id
            print(f"Migrated niche: {name} ({old_id} -> {new_id})")
    
    return niche_mapping

def migrate_ideas(supabase: Client, sqlite_conn: sqlite3.Connection, niche_mapping: Dict[str, str]):
    """Migrate ideas"""
    print("Migrating ideas...")
    
    cursor = sqlite_conn.cursor()
    cursor.execute("""
        SELECT id, title, problem, solution, audience, status, impact, 
               confidence, effort, ice_score, notes, source_url, tags, 
               created_at, niche_id 
        FROM idea
    """)
    ideas = cursor.fetchall()
    
    for idea in ideas:
        (old_id, title, problem, solution, audience, status, impact, 
         confidence, effort, ice_score, notes, source_url, tags, 
         created_at, old_niche_id) = idea
        
        new_niche_id = niche_mapping.get(str(old_niche_id))
        if not new_niche_id:
            print(f"Skipping idea {title} - niche not found")
            continue
        
        # Insert into Supabase
        result = supabase.table('ideas').insert({
            'title': title,
            'problem': problem,
            'solution': solution,
            'audience': audience,
            'status': status,
            'impact': impact,
            'confidence': confidence,
            'effort': effort,
            'ice_score': ice_score,
            'notes': notes,
            'source_url': source_url,
            'tags': tags,
            'created_at': created_at,
            'niche_id': new_niche_id
        }).execute()
        
        if result.data:
            print(f"Migrated idea: {title}")

def migrate_highlights(supabase: Client, sqlite_conn: sqlite3.Connection, niche_mapping: Dict[str, str]):
    """Migrate highlights"""
    print("Migrating highlights...")
    
    cursor = sqlite_conn.cursor()
    cursor.execute("""
        SELECT id, quote, permalink, subreddit, author, upvotes, 
               notes, tags, created_at, niche_id, idea_id 
        FROM highlight
    """)
    highlights = cursor.fetchall()
    
    for highlight in highlights:
        (old_id, quote, permalink, subreddit, author, upvotes, 
         notes, tags, created_at, old_niche_id, old_idea_id) = highlight
        
        new_niche_id = niche_mapping.get(str(old_niche_id))
        if not new_niche_id:
            print(f"Skipping highlight - niche not found")
            continue
        
        # Note: idea_id mapping would need to be implemented if highlights link to ideas
        # For now, we'll set it to None
        idea_id = None
        
        result = supabase.table('highlights').insert({
            'quote': quote,
            'permalink': permalink,
            'subreddit': subreddit,
            'author': author,
            'upvotes': upvotes,
            'notes': notes,
            'tags': tags,
            'created_at': created_at,
            'niche_id': new_niche_id,
            'idea_id': idea_id
        }).execute()
        
        if result.data:
            print(f"Migrated highlight: {quote[:50]}...")

def migrate_subreddits(supabase: Client, sqlite_conn: sqlite3.Connection, niche_mapping: Dict[str, str]):
    """Migrate subreddits"""
    print("Migrating subreddits...")
    
    cursor = sqlite_conn.cursor()
    cursor.execute("""
        SELECT id, name, url, subscriber_count, notes, created_at, niche_id 
        FROM subreddit
    """)
    subreddits = cursor.fetchall()
    
    for subreddit in subreddits:
        (old_id, name, url, subscriber_count, notes, created_at, old_niche_id) = subreddit
        
        new_niche_id = niche_mapping.get(str(old_niche_id))
        if not new_niche_id:
            print(f"Skipping subreddit {name} - niche not found")
            continue
        
        result = supabase.table('subreddits').insert({
            'name': name,
            'url': url,
            'subscriber_count': subscriber_count,
            'notes': notes,
            'created_at': created_at,
            'niche_id': new_niche_id
        }).execute()
        
        if result.data:
            print(f"Migrated subreddit: {name}")

def main():
    """Main migration function"""
    print("Starting data migration from SQLite to Supabase...")
    
    # Check environment variables
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables required")
        return
    
    # Check if SQLite database exists
    if not os.path.exists(SQLITE_DB_PATH):
        print(f"Error: SQLite database not found at {SQLITE_DB_PATH}")
        return
    
    try:
        # Connect to databases
        sqlite_conn = connect_sqlite(SQLITE_DB_PATH)
        supabase = connect_supabase(SUPABASE_URL, SUPABASE_KEY)
        
        # Migrate data
        niche_mapping = migrate_niches(supabase, sqlite_conn)
        migrate_ideas(supabase, sqlite_conn, niche_mapping)
        migrate_highlights(supabase, sqlite_conn, niche_mapping)
        migrate_subreddits(supabase, sqlite_conn, niche_mapping)
        
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        sqlite_conn.close()

if __name__ == "__main__":
    main()
