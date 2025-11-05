// Test the getNiches function directly
import { getNiches } from '@/lib/queries'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function testGetNiches() {
  try {
    console.log('🔍 Testing getNiches function...')
    const niches = await getNiches()
    console.log('✅ Success! Found niches:', niches.length)
    niches.forEach(niche => {
      console.log(`  - ${niche.name}: ${niche.ideasCount} ideas, ${niche.highlightsCount} highlights, ${niche.subredditsCount} subreddits`)
    })
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testGetNiches()
