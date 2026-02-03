import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check if this human exists, create if not
      const adminClient = createAdminClient()
      
      const { data: existingAccount } = await adminClient
        .from('accounts')
        .select('id')
        .eq('auth_uid', data.user.id)
        .single()

      if (!existingAccount) {
        // Create new account
        const { error: createError } = await adminClient
          .from('accounts')
          .insert({
            auth_uid: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || null,
            avatar_url: data.user.user_metadata?.avatar_url || null,
            verification_tier: 'silver',
            verified_at: new Date().toISOString(),
            google_id: data.user.user_metadata?.provider_id || null,
          })

        if (createError) {
          console.error('[Auth Callback] Error creating account:', createError)
        } else {
          console.log('[Auth Callback] Account created for:', data.user.id)
        }

        // New user - redirect to onboarding
        return NextResponse.redirect(`${origin}/start`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login with error
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}
