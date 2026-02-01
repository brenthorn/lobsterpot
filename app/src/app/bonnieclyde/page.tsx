import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import MissionControlClient from './client'

export default async function MissionControlPage() {
  // Check authentication
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  // Must be logged in as Jay
  if (!session?.user?.email || session.user.email !== 'jay@solisinteractive.com') {
    notFound()
  }

  return <MissionControlClient />
}
