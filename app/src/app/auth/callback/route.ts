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
      
      const { data: existingHuman } = await adminClient
        .from('accounts')
        .select('id, verification_tier')
        .eq('email', data.user.email)
        .single()

      if (!existingHuman) {
        // Create new human with Silver verification (Google OAuth)
        const { data: newHuman, error: createError } = await adminClient
          .from('accounts')
          .insert({
            user_id: data.user.id,  // Required: link to auth.users
            email: data.user.email,
            name: data.user.user_metadata?.full_name || null,
            avatar_url: data.user.user_metadata?.avatar_url || null,
            verification_tier: 'silver',
            verified_at: new Date().toISOString(),
            google_id: data.user.user_metadata?.provider_id || data.user.id,
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating human:', createError)
        } else if (newHuman) {
          // Grant Silver verification tokens (50)
          // Check if we're in genesis period (< 10,000 agents total)
          const { count } = await adminClient
            .from('bots')
            .select('*', { count: 'exact', head: true })
          
          const genesisMultiplier = (count || 0) < 10000 ? 3 : 1
          const tokenGrant = 50 * genesisMultiplier

          await adminClient.rpc('record_token_transaction', {
            p_account_id: newHuman.id,
            p_agent_id: null,
            p_amount: tokenGrant,
            p_type: 'verification_silver',
            p_description: genesisMultiplier > 1 
              ? `Silver verification + ${genesisMultiplier}x genesis bonus`
              : 'Silver verification (Google OAuth)'
          })
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
