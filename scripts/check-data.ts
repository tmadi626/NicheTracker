// Quick test to see what data we have in Supabase
import { createClient } from '@/lib/supabase/client'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function checkData() {
  const supabase = createClient()
  
  console.log('🔍 Checking Supabase data...')
  
  // Check niches
  const { data: niches, error: nicheError } = await supabase
    .from('niches')
    .select('*')
  
  console.log('📊 Niches:', niches?.length || 0)
  if (nicheError) console.error('❌ Niche error:', nicheError.message)
  else niches?.forEach(n => console.log(`  - ${n.name} (${n.slug})`))
  
  // Check ideas
  const { data: ideas, error: ideaError } = await supabase
    .from('ideas')
    .select('*')
  
  console.log('💡 Ideas:', ideas?.length || 0)
  if (ideaError) console.error('❌ Idea error:', ideaError.message)
  else ideas?.forEach(i => console.log(`  - ${i.title}`))
  
  // Check highlights
  const { data: highlights, error: highlightError } = await supabase
    .from('highlights')
    .select('*')
  
  console.log('📌 Highlights:', highlights?.length || 0)
  if (highlightError) console.error('❌ Highlight error:', highlightError.message)
  else highlights?.forEach(h => console.log(`  - ${h.quote.substring(0, 50)}...`))
  
  // Check subreddits
  const { data: subreddits, error: subredditError } = await supabase
    .from('subreddits')
    .select('*')
  
  console.log('🔗 Subreddits:', subreddits?.length || 0)
  if (subredditError) console.error('❌ Subreddit error:', subredditError.message)
  else subreddits?.forEach(s => console.log(`  - ${s.name}`))
}

checkData().catch(console.error)
