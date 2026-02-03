import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/crypto'

// POST /api/command/tasks/create - Create a new task (encrypts sensitive fields)
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, assigned_agent_ids, tags, priority } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Title required' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Get account ID
    const { data: account } = await adminClient
      .from('accounts')
      .select('id')
      .eq('auth_uid', session.user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Create task with encrypted fields
    const { data: task, error } = await adminClient
      .from('mc_tasks')
      .insert({
        title: encrypt(title),
        description: description ? encrypt(description) : null,
        assigned_agent_ids: assigned_agent_ids || [],
        tags: tags || [],
        priority: priority || 'normal',
        status: assigned_agent_ids?.length > 0 ? 'assigned' : 'inbox',
        account_id: account.id
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
    }

    // Return with decrypted fields for immediate use
    return NextResponse.json({
      ...task,
      title: title,
      description: description || null,
    })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
