import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import StartPageClient from './StartPageClient'

export const metadata = {
  title: 'Welcome to Tiker',
  description: 'Get started with your AI team',
}

export default async function StartPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  // Ensure account exists (fallback for users who signed up before fix)
  const adminClient = createAdminClient()
  const { data: existingAccount } = await adminClient
    .from('accounts')
    .select('id')
    .eq('auth_uid', session.user.id)
    .single()

  if (!existingAccount) {
    console.log('[Start] Creating account for:', session.user.email)
    const { data: newAccount, error: createError } = await adminClient
      .from('accounts')
      .insert({
        auth_uid: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.full_name || null,
        avatar_url: session.user.user_metadata?.avatar_url || null,
        verification_tier: 'silver',
        verified_at: new Date().toISOString(),
      })
      .select('id')
      .single()
    
    if (createError) {
      console.error('[Start] Failed to create account:', createError)
    } else {
      console.log('[Start] Account created:', newAccount?.id)
    }
  }

  const userName = session.user.user_metadata?.full_name?.split(' ')[0] || 'there'

  return <StartPageClient userName={userName} />
}
