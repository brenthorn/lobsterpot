import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET /api/command/agents - Get agents for current user
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get account ID
    const adminClient = createAdminClient()
    const { data: account } = await adminClient
      .from('accounts')
      .select('id')
      .eq('auth_uid', session.user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Get agents for this account
    const { data: agents, error } = await adminClient
      .from('mc_agents')
      .select('*')
      .eq('account_id', account.id)
      .order('name')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
    }

    return NextResponse.json(agents || [])
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
