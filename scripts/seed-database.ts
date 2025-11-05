import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Database } from '@/types/database'

// Load environment variables
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

type IdeaInsert = Database['public']['Tables']['ideas']['Insert']

// Seed data for testing
const seedData = {
  niches: [
    {
      name: 'Hobbies & DIY',
      slug: 'hobbies-diy',
      description: 'Creative hobbies and do-it-yourself projects'
    },
    {
      name: 'Health & Fitness',
      slug: 'health-fitness',
      description: 'Health, wellness, and fitness related content'
    },
    {
      name: 'Technology',
      slug: 'technology',
      description: 'Tech startups, software, and digital products'
    }
  ],
  ideas: [
    {
      title: 'Custom Woodworking Plans',
      problem: 'People struggle to find quality woodworking plans',
      solution: 'Create detailed, step-by-step woodworking plans with video tutorials',
      audience: 'DIY enthusiasts and woodworkers',
      status: 'Exploring' as const,
      impact: 4,
      confidence: 3,
      effort: 2,
      notes: 'This could be a great passive income stream',
      source_url: 'https://example.com',
      tags: 'woodworking, plans, diy'
    },
    {
      title: 'Gardening App for Beginners',
      problem: 'New gardeners don\'t know when to plant or how to care for plants',
      solution: 'Mobile app with planting schedules and care reminders',
      audience: 'Beginner gardeners',
      status: 'Backlog' as const,
      impact: 3,
      confidence: 4,
      effort: 3,
      notes: 'Could integrate with weather data',
      source_url: '',
      tags: 'gardening, app, mobile'
    }
  ],
  highlights: [
    {
      quote: 'Start with simple projects and gradually work your way up to more complex builds.',
      permalink: 'https://reddit.com/r/woodworking/comments/example',
      subreddit: 'r/woodworking',
      author: 'woodworker123',
      upvotes: 45,
      notes: 'Great advice for beginners',
      tags: 'planning, materials'
    },
    {
      quote: 'Patience is key in gardening. Plants grow at their own pace.',
      permalink: 'https://reddit.com/r/gardening/comments/example',
      subreddit: 'r/gardening',
      author: 'gardenmaster',
      upvotes: 23,
      notes: 'Encouraging for new gardeners',
      tags: 'patience, learning'
    }
  ],
  subreddits: [
    {
      name: 'r/woodworking',
      url: 'https://reddit.com/r/woodworking',
      subscriber_count: 2500000,
      notes: 'Great community for woodworking projects and advice'
    },
    {
      name: 'r/gardening',
      url: 'https://reddit.com/r/gardening',
      subscriber_count: 1800000,
      notes: 'Helpful tips and inspiration for gardeners'
    }
  ]
}

export async function seedDatabase() {
  const supabase = createClient()
  
  try {
    console.log('🌱 Starting database seeding...')
    
    // Create niches first
    const { data: niches, error: nicheError } = await supabase
      .from('niches')
      .insert(seedData.niches)
      .select()
    
    if (nicheError) throw nicheError
    console.log('✅ Created niches:', niches?.length)
    
    // Get the first niche ID for related data
    const hobbiesNiche = niches?.find(n => n.slug === 'hobbies-diy')
    if (!hobbiesNiche) throw new Error('Hobbies niche not found')
    
    // Create ideas
    const ideasWithNiche: IdeaInsert[] = seedData.ideas.map(idea => ({
      ...idea,
      niche_id: hobbiesNiche.id
    }))
    
    const { data: ideas, error: ideaError } = await supabase
      .from('ideas')
      .insert(ideasWithNiche)
      .select()
    
    if (ideaError) throw ideaError
    console.log('✅ Created ideas:', ideas?.length)
    
    // Create highlights
    const highlightsWithNiche = seedData.highlights.map((highlight, index) => ({
      ...highlight,
      niche_id: hobbiesNiche.id,
      idea_id: ideas?.[index]?.id || null
    }))
    
    const { data: highlights, error: highlightError } = await supabase
      .from('highlights')
      .insert(highlightsWithNiche)
      .select()
    
    if (highlightError) throw highlightError
    console.log('✅ Created highlights:', highlights?.length)
    
    // Create subreddits
    const subredditsWithNiche = seedData.subreddits.map(subreddit => ({
      name: subreddit.name,
      url: subreddit.url,
      subscriber_count: subreddit.subscriber_count,
      notes: subreddit.notes,
      niche_id: hobbiesNiche.id
    }))
    
    const { data: subreddits, error: subredditError } = await supabase
      .from('subreddits')
      .insert(subredditsWithNiche)
      .select()
    
    if (subredditError) throw subredditError
    console.log('✅ Created subreddits:', subreddits?.length)
    
    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
