import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// DELETE /api/command/tasks/[id] - Delete a task
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params
    const adminClient = createAdminClient()
    
    // Get user session
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check 2FA
    const cookieStore = await cookies()
    const writeAccess = cookieStore.get('tiker_write_access')
    if (!writeAccess?.value) {
      // Check if user has 2FA enabled
      const { data: account } = await adminClient
        .from('accounts')
        .select('id, two_factor_enabled')
        .eq('auth_uid', session.user.id)
        .single()
      
      if (account?.two_factor_enabled) {
        return NextResponse.json({ error: '2FA_REQUIRED' }, { status: 403 })
      }
    }
    
    // Get account ID
    const { data: account } = await adminClient
      .from('accounts')
      .select('id')
      .eq('auth_uid', session.user.id)
      .single()
    
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }
    
    // Verify task belongs to this account
    const { data: task, error: taskError } = await adminClient
      .from('mc_tasks')
      .select('id, account_id')
      .eq('id', taskId)
      .single()
    
    if (taskError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    
    if (task.account_id !== account.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Delete associated comments first
    await adminClient
      .from('mc_comments')
      .delete()
      .eq('task_id', taskId)
    
    // Delete associated activities
    await adminClient
      .from('mc_activities')
      .delete()
      .eq('task_id', taskId)
    
    // Delete the task
    const { error: deleteError } = await adminClient
      .from('mc_tasks')
      .delete()
      .eq('id', taskId)
    
    if (deleteError) {
      console.error('Error deleting task:', deleteError)
      return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
