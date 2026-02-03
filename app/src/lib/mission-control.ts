// Command API client
import { createClient } from '@/lib/supabase'

export type AgentStatus = 'idle' | 'active' | 'blocked'
export type TaskStatus = 'inbox' | 'assigned' | 'in_progress' | 'review' | 'done' | 'blocked'
export type ActivityType = 'heartbeat' | 'task_created' | 'task_updated' | 'task_assigned' | 'comment' | 'status_change' | 'blocked' | 'unblocked'

export interface Agent {
  id: string
  name: string
  session_key: string
  role: string
  level: 'intern' | 'specialist' | 'lead'
  emoji: string
  avatar_url?: string
  status: AgentStatus
  current_task_id?: string
  last_heartbeat?: string
  created_at: string
  updated_at: string
  account_id?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  assigned_agent_ids: string[]
  created_by_agent_id?: string
  tags: string[]
  priority: 'low' | 'normal' | 'high' | 'urgent'
  created_at: string
  updated_at: string
  completed_at?: string
  account_id?: string
}

export interface Comment {
  id: string
  task_id: string
  agent_id: string
  content: string
  created_at: string
  agent?: Agent
  account_id?: string
}

export interface Activity {
  id: string
  agent_id?: string
  type: ActivityType
  message: string
  task_id?: string
  metadata?: any
  created_at: string
  agent?: Agent
  task?: Task
  account_id?: string
}

// Get current user's account ID
export async function getCurrentAccountId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user?.email) return null
  
  const { data: account } = await supabase
    .from('accounts')
    .select('id')
    .eq('email', user.email)
    .single()
  
  return account?.id || null
}

// RLS handles filtering - these queries will automatically return only user's data
export async function getAgents() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('mc_agents')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data as Agent[]
}

export async function getTasks() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('mc_tasks')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Task[]
}

export async function getActivities(limit = 50) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('mc_activities')
    .select(`
      *,
      agent:mc_agents(name, emoji),
      task:mc_tasks(title)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as Activity[]
}

export async function getTaskComments(taskId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('mc_comments')
    .select(`
      *,
      agent:mc_agents(name, emoji)
    `)
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data as Comment[]
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const supabase = createClient()
  console.log('updateTaskStatus called:', { taskId, status })
  
  const { data, error } = await supabase
    .from('mc_tasks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .select()
  
  console.log('Supabase response:', { data, error })
  
  if (error) {
    console.error('Supabase error details:', error)
    throw error
  }
  
  return data
}

export async function updateTaskAssignees(taskId: string, agentIds: string[]) {
  const supabase = createClient()
  const { error } = await supabase
    .from('mc_tasks')
    .update({ 
      assigned_agent_ids: agentIds,
      status: agentIds.length > 0 ? 'assigned' : 'inbox',
      updated_at: new Date().toISOString() 
    })
    .eq('id', taskId)
  
  if (error) throw error
}

export async function createTask(task: {
  title: string
  description?: string
  assigned_agent_ids?: string[]
  tags?: string[]
  priority?: 'low' | 'normal' | 'high' | 'urgent'
}) {
  const supabase = createClient()
  
  // Get current account_id
  const accountId = await getCurrentAccountId()
  if (!accountId) {
    throw new Error('Not authenticated')
  }
  
  const { data, error } = await supabase
    .from('mc_tasks')
    .insert({
      ...task,
      account_id: accountId
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Task
}

export async function createComment(taskId: string, content: string, agentId?: string) {
  const supabase = createClient()
  
  // Get current account_id
  const accountId = await getCurrentAccountId()
  if (!accountId) {
    throw new Error('Not authenticated')
  }
  
  // If no agentId provided, try to get the current user's agent
  let finalAgentId = agentId
  if (!finalAgentId) {
    const { data: userData } = await supabase.auth.getUser()
    if (userData?.user?.email) {
      // Look up agent by name "Jay" within this account
      const { data: agent } = await supabase
        .from('mc_agents')
        .select('id')
        .eq('name', 'Jay')
        .eq('account_id', accountId)
        .single()
      
      if (agent) finalAgentId = agent.id
    }
  }
  
  // Create a placeholder "You" agent if none exists
  if (!finalAgentId) {
    // Try to find or create a "You" agent for this user
    const { data: existingYou } = await supabase
      .from('mc_agents')
      .select('id')
      .eq('name', 'You')
      .eq('account_id', accountId)
      .single()
    
    if (existingYou) {
      finalAgentId = existingYou.id
    } else {
      // Create "You" agent
      const { data: newAgent, error: agentError } = await supabase
        .from('mc_agents')
        .insert({
          name: 'You',
          session_key: `user:${accountId}`,
          role: 'Human operator',
          level: 'lead',
          emoji: '👤',
          status: 'active',
          account_id: accountId
        })
        .select('id')
        .single()
      
      if (newAgent) finalAgentId = newAgent.id
    }
  }
  
  if (!finalAgentId) {
    throw new Error('Unable to determine agent/user for comment')
  }
  
  const { data, error } = await supabase
    .from('mc_comments')
    .insert({ 
      task_id: taskId, 
      agent_id: finalAgentId, 
      content,
      account_id: accountId
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Comment
}

// Create a default agent for new users
export async function createDefaultAgent(name: string, emoji: string, role: string) {
  const supabase = createClient()
  
  const accountId = await getCurrentAccountId()
  if (!accountId) {
    throw new Error('Not authenticated')
  }
  
  const { data, error } = await supabase
    .from('mc_agents')
    .insert({
      name,
      session_key: `agent:${accountId}:${name.toLowerCase()}`,
      role,
      level: 'specialist',
      emoji,
      status: 'idle',
      account_id: accountId
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Agent
}
