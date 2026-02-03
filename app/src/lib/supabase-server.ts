import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getAuthMode, hasLocalSession, getLocalUser, getLocalAccountId } from '@/lib/local-auth'

type CookieToSet = {
  name: string
  value: string
  options?: Record<string, unknown>
}

/**
 * Check if we're in local auth mode (no Supabase)
 */
export function isLocalMode(): boolean {
  return getAuthMode() !== 'supabase'
}

/**
 * Get session for local auth modes
 * Returns a mock session object compatible with Supabase session structure
 */
export async function getLocalSession() {
  const hasSession = await hasLocalSession()
  if (!hasSession) return null
  
  const user = getLocalUser()
  return {
    user: {
      id: user.id,
      email: user.email,
      user_metadata: { full_name: user.name }
    }
  }
}

export async function createServerSupabaseClient() {
  // In local mode, return a mock client
  if (isLocalMode()) {
    return createLocalMockClient()
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component - ignore
          }
        },
      },
    }
  )
}

/**
 * Create a mock Supabase client for local auth mode
 * Only implements auth.getSession() - DB operations use direct Postgres
 */
function createLocalMockClient() {
  return {
    auth: {
      async getSession() {
        const session = await getLocalSession()
        return { data: { session }, error: null }
      },
      async getUser() {
        const session = await getLocalSession()
        return { data: { user: session?.user || null }, error: null }
      }
    }
  } as any
}

// Admin client with service role (use sparingly, server-side only)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
