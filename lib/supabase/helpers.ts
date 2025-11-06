import { createClient as createServerClient } from './server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Creates a Supabase client with proper error handling for missing environment variables
 * @returns Supabase client instance
 * @throws Error with helpful message if environment variables are missing
 */
export async function getSupabaseClient(): Promise<SupabaseClient<Database>> {
  try {
    return await createServerClient()
  } catch (error: any) {
    // Check if it's the missing env vars error
    if (error?.message?.includes('URL and Key are required')) {
      throw new Error(
        'Supabase configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.\n\n' +
        'You can find these values in your Supabase project settings:\n' +
        'https://supabase.com/dashboard/project/_/settings/api'
      )
    }
    throw error
  }
}

