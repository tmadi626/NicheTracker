// Test Supabase connection
import { createClient } from '@/lib/supabase/client'

// Load environment variables
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    console.log('📊 Project URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('🔑 Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing')
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Missing Supabase credentials in .env.local')
      return false
    }
    
    const supabase = createClient()
    const { data, error } = await supabase
      .from('niches')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase query failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('📊 Database is ready for queries')
    return true
  } catch (error) {
    console.error('❌ Supabase connection error:', error)
    return false
  }
}

// Run test if called directly
if (require.main === module) {
  testSupabaseConnection()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
}
