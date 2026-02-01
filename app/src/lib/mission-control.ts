// Mission Control API client
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
}

export interface Comment {
  id: string
  task_id: string
  agent_id: string
  content: string
  created_at: string
  agent?: Agent
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
}

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
  const { error } = await supabase
    .from('mc_tasks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', taskId)
  
  if (error) throw error
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
  const { data, error } = await supabase
    .from('mc_tasks')
    .insert(task)
    .select()
    .single()
  
  if (error) throw error
  return data as Task
}

export async function createComment(taskId: string, content: string, agentId?: string) {
  const supabase = createClient()
  
  // If no agentId provided, try to get the current user's agent
  let finalAgentId = agentId
  if (!finalAgentId) {
    const { data: userData } = await supabase.auth.getUser()
    if (userData?.user?.email) {
      // Look up agent by email match (for Jay)
      const { data: agent } = await supabase
        .from('mc_agents')
        .select('id')
        .eq('name', 'Jay')
        .single()
      
      if (agent) finalAgentId = agent.id
    }
  }
  
  if (!finalAgentId) {
    throw new Error('Unable to determine agent/user for comment')
  }
  
  const { data, error } = await supabase
    .from('mc_comments')
    .insert({ task_id: taskId, agent_id: finalAgentId, content })
    .select()
    .single()
  
  if (error) throw error
  return data as Comment
}
