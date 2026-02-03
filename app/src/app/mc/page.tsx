import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
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

  // Get account to verify it exists
  const { data: account } = await supabase
    .from('accounts')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!account) {
    // Account doesn't exist yet - redirect to start
    redirect('/start')
  }

  // Everyone with an account gets MC!
  return <MissionControlClient />
}
