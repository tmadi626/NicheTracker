# Niche Tracker - Next.js + Supabase

A modern web application for tracking business niches, ideas, highlights, and subreddits. This is a migration from the original Flask-based application to Next.js with Supabase backend.

## Features

- **Niche Management**: Create and organize business niche categories
- **Idea Tracking**: Track business ideas with ICE scoring (Impact × Confidence / Effort)
- **Highlight Collection**: Save interesting Reddit comments and posts
- **Subreddit Monitoring**: Track subreddits with subscriber counts and notes
- **Tabbed Interface**: Organized view of all data per niche
- **Real-time Updates**: Live data synchronization with Supabase
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd niche-tracker-nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Supabase:**
   - Create a new Supabase project
   - Run the migration scripts in `supabase/migrations/`
   - Copy your project URL and anon key

4. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

### Run Migrations

1. **Connect to your Supabase project**
2. **Go to SQL Editor**
3. **Run the migration scripts in order:**
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_add_indexes.sql`
4. **Optionally run the seed script:**
   - `supabase/seed.sql`

### Migrate Existing Data

If you have data from the original Flask application:

1. **Install Python dependencies:**
   ```bash
   pip install supabase
   ```

2. **Set environment variables:**
   ```bash
   export SUPABASE_URL=your_supabase_project_url
   export SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Run the migration script:**
   ```bash
   npm run migrate
   ```

## Project Structure

```
niche-tracker-nextjs/
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Route groups
│   │   ├── page.tsx      # Home page
│   │   ├── niche/        # Niche-related pages
│   │   └── api/          # API routes
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/              # Shadcn/ui components
│   ├── forms/           # Form components
│   ├── tables/          # Table components
│   └── layout/          # Layout components
├── lib/                 # Utility functions
│   ├── supabase/        # Supabase client
│   ├── utils.ts         # General utilities
│   └── validations.ts   # Zod schemas
├── types/               # TypeScript types
├── supabase/            # Database migrations
└── scripts/             # Migration scripts
```

## API Endpoints

### Web Routes
- `GET /` - Home page (niches list)
- `GET /niche/new` - Create new niche
- `GET /niche/[slug]` - View niche with tabs
- `GET /niche/[slug]/edit` - Edit niche
- `GET /niche/[slug]/ideas/new` - Add idea
- `GET /niche/[slug]/highlights/new` - Add highlight
- `GET /niche/[slug]/subreddits/new` - Add subreddit

### API Routes
- `GET /api/niches` - List all niches
- `GET /api/niche/[slug]/ideas` - List ideas in niche
- `GET /api/niche/[slug]/highlights` - List highlights in niche
- `GET /api/niche/[slug]/subreddits` - List subreddits in niche

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run migrate` - Run data migration script

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling
- Shadcn/ui for components

## Deployment

### Vercel (Frontend)

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Supabase (Backend)

1. **Create Supabase project**
2. **Run database migrations**
3. **Configure Row Level Security (RLS) policies**
4. **Set up authentication (optional)**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.

## Changelog

### v1.0.0 (2025-01-21)
- Initial migration from Flask to Next.js
- Supabase integration
- Modern UI with Tailwind CSS and Shadcn/ui
- TypeScript support
- Real-time data synchronization