import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

export const createClient = async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    const isProduction = process.env.NODE_ENV === 'production'
    const envFile = isProduction ? '.env' : '.env.local'
    
    throw new Error(
      "Your project's URL and Key are required to create a Supabase client!\n\n" +
      `Environment variables not found. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.\n\n` +
      (isProduction 
        ? "In production, you need to set these as system environment variables or in a .env file.\n"
        : "Make sure your .env.local file exists and contains these variables.\n") +
      "Check your Supabase project's API settings to find these values:\n" +
      "https://supabase.com/dashboard/project/_/settings/api"
    )
  }

  const cookieStore = await cookies()
  
  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
