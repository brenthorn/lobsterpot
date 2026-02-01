import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import MissionControlClient from './client'

export default async function MissionControlPage() {
  // Check authentication
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    notFound()
  }

  // Check if user has mc_admin flag
  const { data: human } = await supabase
    .from('humans')
    .select('mc_admin')
    .eq('id', session.user.id)
    .single()

  if (!human?.mc_admin) {
    notFound()
  }

  return <MissionControlClient />
}
