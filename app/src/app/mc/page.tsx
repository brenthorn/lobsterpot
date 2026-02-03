import { redirect } from 'next/navigation'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import MissionControlClient from './client'

export const metadata = {
  title: 'Mission Control - Tiker',
  description: 'Your AI team task board',
}

export default async function MissionControlPage() {
  // Check authentication
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  // Use admin client to bypass RLS for account lookup
  const adminClient = createAdminClient()
  const { data: account, error } = await adminClient
    .from('accounts')
    .select('id')
    .eq('auth_uid', session.user.id)
    .single()

  console.log('[MC] Account lookup:', { auth_uid: session.user.id, account, error })

  if (!account) {
    // Account doesn't exist - send to onboarding to create it
    console.log('[MC] No account found, redirecting to /start')
    redirect('/start')
  }

  // Everyone with an account gets MC!
  return <MissionControlClient />
}
