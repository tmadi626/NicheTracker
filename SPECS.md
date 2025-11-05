# Niche Tracker - Next.js + Supabase Migration

## Project Overview

This is a migration of the Flask-based "Niche & Subreddit Tracker" to a modern Next.js application with Supabase backend. The application helps entrepreneurs and business developers organize and track subreddits, business ideas, and highlights from Reddit by niche categories.

## Original Flask Application Analysis

### Core Features
- **Niche Management**: Create, edit, delete business niche categories
- **Idea Tracking**: Business ideas with ICE scoring (Impact × Confidence / Effort)
- **Highlight Collection**: Save interesting Reddit comments/posts
- **Subreddit Monitoring**: Track subreddits with subscriber counts
- **Tabbed Interface**: Organized view of all data per niche
- **JSON API**: Read-only endpoints for all entities

### Database Schema (Original)
- **Niche**: name, slug, description, timestamps
- **Idea**: title, problem, solution, audience, status, ICE scoring, tags, source_url
- **Highlight**: quote, permalink, subreddit, author, upvotes, notes, tags, optional idea link
- **Subreddit**: name, URL, subscriber_count, notes

## New Architecture

### Technology Stack

**Frontend:**
- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui** for components
- **React Hook Form** + **Zod** for forms
- **TanStack Query** for data fetching
- **Lucide React** for icons

**Backend:**
- **Supabase** (PostgreSQL + Auth + Real-time)
- **Supabase Edge Functions** for complex operations
- **Row Level Security (RLS)** for data protection

**Deployment:**
- **Vercel** for frontend
- **Supabase** for database and backend services

### Database Schema (Supabase PostgreSQL)

```sql
-- Niches table
CREATE TABLE niches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ideas table
CREATE TABLE ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  problem TEXT,
  solution TEXT,
  audience VARCHAR(200),
  status VARCHAR(50) DEFAULT 'Backlog' CHECK (status IN ('Backlog', 'Exploring', 'Validating', 'Building', 'Launched')),
  impact INTEGER DEFAULT 1 CHECK (impact >= 1 AND impact <= 5),
  confidence INTEGER DEFAULT 1 CHECK (confidence >= 1 AND confidence <= 5),
  effort INTEGER DEFAULT 1 CHECK (effort >= 1 AND effort <= 5),
  ice_score DECIMAL(5,2) DEFAULT 0.0,
  notes TEXT,
  source_url VARCHAR(500),
  tags VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  niche_id UUID REFERENCES niches(id) ON DELETE CASCADE
);

-- Highlights table
CREATE TABLE highlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  permalink VARCHAR(500),
  subreddit VARCHAR(100),
  author VARCHAR(100),
  upvotes INTEGER,
  notes TEXT,
  tags VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  niche_id UUID REFERENCES niches(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL
);

-- Subreddits table
CREATE TABLE subreddits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  url VARCHAR(200) NOT NULL,
  subscriber_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  niche_id UUID REFERENCES niches(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_ideas_niche_id ON ideas(niche_id);
CREATE INDEX idx_highlights_niche_id ON highlights(niche_id);
CREATE INDEX idx_highlights_idea_id ON highlights(idea_id);
CREATE INDEX idx_subreddits_niche_id ON subreddits(niche_id);
CREATE INDEX idx_ideas_ice_score ON ideas(ice_score DESC);
CREATE INDEX idx_ideas_status ON ideas(status);
```

## Project Structure

```
niche-tracker-nextjs/
├── app/                          # Next.js 13+ app directory
│   ├── (dashboard)/             # Route groups
│   │   ├── page.tsx            # Home page (niches list)
│   │   ├── niche/
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx    # Niche detail with tabs
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── ideas/
│   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   └── [id]/edit/page.tsx
│   │   │   │   ├── highlights/
│   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   └── [id]/edit/page.tsx
│   │   │   │   └── subreddits/
│   │   │   │       ├── new/page.tsx
│   │   │   │       └── [id]/edit/page.tsx
│   │   │   └── new/page.tsx
│   │   └── api/                 # API routes
│   │       ├── niches/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── ideas/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── highlights/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       └── subreddits/
│   │           ├── route.ts
│   │           └── [id]/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Reusable components
│   ├── ui/                     # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── badge.tsx
│   ├── forms/
│   │   ├── niche-form.tsx
│   │   ├── idea-form.tsx
│   │   ├── highlight-form.tsx
│   │   └── subreddit-form.tsx
│   ├── tables/
│   │   ├── ideas-table.tsx
│   │   ├── highlights-table.tsx
│   │   └── subreddits-table.tsx
│   ├── tabs/
│   │   └── niche-tabs.tsx
│   └── layout/
│       ├── header.tsx
│       ├── navigation.tsx
│       └── footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Supabase client
│   │   ├── server.ts           # Server-side Supabase client
│   │   └── types.ts            # Generated types
│   ├── utils.ts                # Utility functions
│   ├── validations.ts          # Zod schemas
│   └── queries.ts              # TanStack Query hooks
├── types/                      # TypeScript types
│   ├── database.ts
│   ├── niche.ts
│   ├── idea.ts
│   ├── highlight.ts
│   └── subreddit.ts
├── supabase/
│   ├── migrations/             # Database migrations
│   │   ├── 001_initial_schema.sql
│   │   └── 002_add_indexes.sql
│   └── seed.sql
├── .env.local                  # Environment variables
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── SPECS.md
```

## API Endpoints

### Web UI Routes

**Niches:**
- `GET /` - Home page listing all niches
- `GET /niche/new` - Create new niche form
- `POST /niche/new` - Create niche
- `GET /niche/[slug]` - View niche with tabbed interface
- `GET /niche/[slug]/edit` - Edit niche form
- `POST /niche/[slug]/edit` - Update niche
- `DELETE /niche/[slug]` - Delete niche

**Ideas:**
- `GET /niche/[slug]/ideas/new` - Add idea form
- `POST /niche/[slug]/ideas/new` - Create idea
- `GET /niche/[slug]/ideas/[id]/edit` - Edit idea form
- `POST /niche/[slug]/ideas/[id]/edit` - Update idea
- `DELETE /niche/[slug]/ideas/[id]` - Delete idea

**Highlights:**
- `GET /niche/[slug]/highlights/new` - Add highlight form
- `POST /niche/[slug]/highlights/new` - Create highlight
- `GET /niche/[slug]/highlights/[id]/edit` - Edit highlight form
- `POST /niche/[slug]/highlights/[id]/edit` - Update highlight
- `DELETE /niche/[slug]/highlights/[id]` - Delete highlight

**Subreddits:**
- `GET /niche/[slug]/subreddits/new` - Add subreddit form
- `POST /niche/[slug]/subreddits/new` - Create subreddit
- `GET /niche/[slug]/subreddits/[id]/edit` - Edit subreddit form
- `POST /niche/[slug]/subreddits/[id]/edit` - Update subreddit
- `DELETE /niche/[slug]/subreddits/[id]` - Delete subreddit

### JSON API Routes

- `GET /api/niches` - List all niches with counts
- `GET /api/niche/[slug]/ideas` - List all ideas in a niche
- `GET /api/niche/[slug]/highlights` - List all highlights in a niche
- `GET /api/niche/[slug]/subreddits` - List all subreddits in a niche

## Key Features

### 1. Tabbed Interface
The niche detail page features three tabs:
- **Ideas Tab**: Shows all business ideas with ICE score display, status filtering, and sorting
- **Highlights Tab**: Shows saved Reddit quotes/comments with optional idea linking
- **Subreddits Tab**: Shows tracked subreddits with sorting by name or subscriber count

### 2. ICE Score Calculation
Automatic calculation: `(Impact × Confidence) / Effort`
- Impact: 1-5 scale
- Confidence: 1-5 scale  
- Effort: 1-5 scale
- Higher scores indicate better ideas

### 3. Status Management
Ideas have 5 statuses:
- **Backlog**: Initial ideas
- **Exploring**: Research phase
- **Validating**: Testing assumptions
- **Building**: Development phase
- **Launched**: Live products

### 4. Data Relationships
- Niches contain Ideas, Highlights, and Subreddits
- Highlights can optionally link to Ideas
- Cascade deletion when removing niches
- All entities have timestamps and optional tags

## Migration Benefits

### Performance
- Server-side rendering with Next.js
- Optimized database queries with PostgreSQL
- Real-time updates with Supabase subscriptions
- Static generation for better SEO

### Developer Experience
- TypeScript for better code quality
- Modern React patterns (hooks, server components)
- Built-in API routes
- Automatic deployments with Vercel
- Hot reloading and fast refresh

### Scalability
- PostgreSQL can handle much larger datasets
- Supabase provides built-in authentication
- Easy to add features like user management
- Real-time collaboration capabilities
- Edge functions for complex operations

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Analytics, etc.
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## Development Setup

1. **Clone and install dependencies:**
   ```bash
   cd niche-tracker-nextjs
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project
   - Run the migration scripts
   - Copy environment variables

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Deployment

### Vercel (Frontend)
1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Supabase (Backend)
1. Create Supabase project
2. Run migrations
3. Configure RLS policies
4. Set up authentication (if needed)

## Data Migration

A Python script will be provided to migrate existing SQLite data to Supabase:

```python
# migration_script.py
import sqlite3
from supabase import create_client, Client

# Connect to existing SQLite database
sqlite_conn = sqlite3.connect('instance/niches.db')

# Connect to Supabase
supabase: Client = create_client(
    "your-supabase-url",
    "your-supabase-anon-key"
)

# Migrate data...
```

## Future Enhancements

- **User Authentication**: Multi-user support with Supabase Auth
- **Real-time Updates**: Live collaboration with Supabase subscriptions
- **Advanced Filtering**: Search and filter across all entities
- **Data Export**: Export data to CSV/JSON
- **Analytics Dashboard**: Track idea success rates
- **Reddit API Integration**: Auto-fetch subreddit data
- **Mobile App**: React Native version
- **API Rate Limiting**: Protect against abuse
- **Caching**: Redis for improved performance

## Migration Checklist

- [x] Set up Next.js project structure
- [x] Install required dependencies
- [x] Create comprehensive documentation
- [x] Set up Supabase configuration and types
- [x] Create database migration scripts
- [x] Build core UI components (Button, Card, Input, etc.)
- [x] Create data migration script
- [x] Set up project structure and routing
- [x] Implement CRUD operations for all entities
- [x] Create tabbed interface for niche details
- [x] Implement API routes
- [x] Fix Next.js 16 params handling
- [x] Fix SelectItem empty string validation errors
- [x] Test all functionality
- [ ] Add form validation with Zod
- [ ] Add authentication (optional)
- [ ] Deploy to Vercel
- [ ] Migrate existing data

## Implementation Status

### ✅ **Completed Features**

#### **Core Application Structure**
- [x] **Next.js 16 App Router** - Modern routing with async params handling
- [x] **TypeScript Configuration** - Full type safety throughout the application
- [x] **Tailwind CSS v3** - Utility-first styling with custom design system
- [x] **Component Library** - Reusable UI components (Button, Card, Input, Select, Tabs, etc.)

#### **Page Structure & Routing**
- [x] **Home Page** - Niches listing with create/edit/delete functionality
- [x] **Niche Detail Page** - Tabbed interface showing Ideas, Highlights, and Subreddits
- [x] **Niche Management** - Create, edit, and delete niche categories
- [x] **Ideas Management** - Full CRUD with ICE score calculation
- [x] **Highlights Management** - Save and manage Reddit quotes/comments
- [x] **Subreddits Management** - Track subreddits with subscriber counts

#### **API Routes**
- [x] **Niches API** - `/api/niches` and `/api/niches/[id]`
- [x] **Ideas API** - `/api/ideas` and `/api/ideas/[id]`
- [x] **Highlights API** - `/api/highlights` and `/api/highlights/[id]`
- [x] **Subreddits API** - `/api/subreddits` and `/api/subreddits/[id]`

#### **Key Features Implemented**
- [x] **ICE Score Calculator** - Interactive sliders for Impact, Confidence, Effort scoring
- [x] **Tabbed Interface** - Clean navigation between Ideas, Highlights, and Subreddits
- [x] **Form Validation** - Client-side validation with proper error handling
- [x] **Responsive Design** - Mobile-friendly layouts with Tailwind CSS
- [x] **Mock Data System** - Complete sample data for testing all functionality
- [x] **External Link Integration** - Direct links to Reddit posts and subreddits

#### **Technical Fixes**
- [x] **Next.js 16 Compatibility** - Fixed async params handling with `React.use()`
- [x] **Radix UI Select Validation** - Fixed empty string value errors
- [x] **Build Optimization** - All pages compile successfully without errors
- [x] **Type Safety** - Full TypeScript coverage with proper type definitions

### 🚧 **In Progress / Next Steps**

#### **Form Validation Enhancement**
- [ ] **Zod Integration** - Add comprehensive form validation schemas
- [ ] **Server-side Validation** - API endpoint validation
- [ ] **Error Message Display** - Enhanced user feedback for validation errors

#### **Backend Integration**
- [ ] **Supabase Setup** - Connect to PostgreSQL database
- [ ] **Authentication** - User management and data protection
- [ ] **Real-time Updates** - Live data synchronization
- [ ] **Data Migration** - Import from existing Flask application

#### **Deployment & Production**
- [ ] **Vercel Deployment** - Production deployment configuration
- [ ] **Environment Variables** - Secure configuration management
- [ ] **Performance Optimization** - Bundle size and loading optimization
- [ ] **SEO Optimization** - Meta tags and structured data

## Current Application State

The application is **fully functional** with a complete UI and mock data system. All major features are implemented and working:

- ✅ **Complete page structure** following Next.js 16 conventions
- ✅ **Modern, responsive UI** with professional design
- ✅ **Interactive features** like ICE score calculator and tabbed navigation
- ✅ **API endpoints** ready for backend integration
- ✅ **Type safety** with comprehensive TypeScript coverage
- ✅ **Build success** - no compilation or runtime errors

The application is ready for backend integration and can be deployed immediately with mock data for demonstration purposes.

## Next Steps

1. **Set up Supabase project** and run database migrations
2. **Replace mock data** with real Supabase queries
3. **Add Zod validation** for enhanced form validation
4. **Deploy to Vercel** for production access
5. **Migrate existing data** from Flask application
6. **Add authentication** for multi-user support
