import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import MissionControlClient from './client'

export default async function MissionControlPage() {
  // Check authentication
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    console.log('[MC] No session found')
    notFound()
  }

  console.log('[MC] Session user ID:', session.user.id)
  console.log('[MC] Session user email:', session.user.email)

  // Check if user has mc_admin flag (query by email since humans.id != auth.users.id)
  const { data: human, error } = await supabase
    .from('humans')
    .select('mc_admin, email')
    .eq('email', session.user.email)
    .single()

  console.log('[MC] Human lookup result:', human)
  console.log('[MC] Human lookup error:', error)

  if (!human?.mc_admin) {
    console.log('[MC] Access denied - mc_admin not true')
    notFound()
  }

  console.log('[MC] Access granted!')
  return <MissionControlClient />
}
