#!/usr/bin/env node
// mc-check.js - Check for new Mission Control activity since last run
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../app/.env.local') })

const STATE_FILE = '/home/umbrel/.openclaw/workspace/memory/heartbeat-state.json'

// Load state
function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
  } catch {
    return { lastMCCheck: null, lastMCCommentsCheck: null }
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
  )
  
  const state = loadState()
  const lastCheck = state.lastMCCommentsCheck || new Date(0).toISOString()
  const now = new Date().toISOString()
  
  // Get Bonnie's ID
  const { data: bonnie } = await supabase
    .from('mc_agents')
    .select('id')
    .eq('name', 'Bonnie')
    .single()
  
  if (!bonnie) {
    console.error('Bonnie not found in MC')
    process.exit(1)
  }
  
  // Get tasks assigned to Bonnie
  const { data: tasks } = await supabase
    .from('mc_tasks')
    .select('id, title, status, created_at')
    .contains('assigned_agent_ids', [bonnie.id])
  
  // Check for new inbox items (inbox status, created since last check)
  const newInbox = tasks?.filter(t => 
    t.status === 'inbox' && 
    new Date(t.created_at) > new Date(lastCheck)
  ) || []
  
  // Check for new comments on Bonnie's tasks
  const taskIds = tasks?.map(t => t.id) || []
  let newComments = []
  
  if (taskIds.length > 0) {
    const { data: comments } = await supabase
      .from('mc_comments')
      .select('*, tasks:task_id(title)')
      .in('task_id', taskIds)
      .gt('created_at', lastCheck)
      .order('created_at', { ascending: false })
    
    newComments = comments || []
  }
  
  // Output results
  const result = {
    newInboxItems: newInbox.map(t => ({ id: t.id, title: t.title })),
    newComments: newComments.map(c => ({
      task: c.tasks?.title || c.task_id,
      content: c.content.substring(0, 100),
      created_at: c.created_at
    })),
    totalAssignedTasks: tasks?.length || 0,
    checkedAt: now
  }
  
  console.log(JSON.stringify(result, null, 2))
  
  // Update state
  state.lastMCCommentsCheck = now
  state.lastMCCheck = now
  saveState(state)
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
