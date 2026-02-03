'use client'

import { useEffect, useState } from 'react'
import { Agent, Task, Activity, TaskStatus, getAgents, getTasks, getActivities, updateTaskStatus } from '@/lib/mission-control'
import AgentCard from '@/components/AgentCard'
import KanbanColumn from '@/components/KanbanColumn'
import ActivityFeed from '@/components/ActivityFeed'
import TaskDetailModal from '@/components/TaskDetailModal'
import CreateTaskModal from '@/components/CreateTaskModal'
import TwoFactorVerifyModal from '@/components/TwoFactorVerifyModal'
import { use2FA } from '@/hooks/use2FA'
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { createClient } from '@/lib/supabase'

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'inbox', title: 'Inbox' },
  { status: 'assigned', title: 'Assigned' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'review', title: 'Review' },
  { status: 'done', title: 'Done' }
]

export default function MissionControlClient() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [hideDone, setHideDone] = useState(true) // Hide completed by default
  
  // 2FA for write access
  const { 
    hasWriteAccess, 
    requires2FA, 
    needs2FASetup,
    withWriteAccess,
    showVerifyModal,
    onVerifySuccess,
    onVerifyCancel,
    loading: twoFALoading 
  } = use2FA()

  // Configure drag sensors with proper activation constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before activating drag
      },
    })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  useEffect(() => {
    loadData()
    setupRealtimeSubscriptions()
  }, [])

  // Update tab title when tasks need attention
  useEffect(() => {
    const reviewCount = tasks.filter(t => t.status === 'review').length
    if (reviewCount > 0) {
      document.title = `(${reviewCount}) Mission Control - Needs Review`
    } else {
      document.title = 'Mission Control - Bonnie & Clyde'
    }
  }, [tasks])

  async function loadData() {
    try {
      const [botsData, tasksData, activitiesData] = await Promise.all([
        getAgents(),
        getTasks(),
        getActivities()
      ])
      setAgents(botsData)
      setTasks(tasksData)
      setActivities(activitiesData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  function setupRealtimeSubscriptions() {
    const supabase = createClient()

    // Subscribe to agent updates
    const agentsSub = supabase
      .channel('mc_agents_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mc_agents' }, (payload) => {
        console.log('Agent change:', payload)
        loadData()
      })
      .subscribe()

    // Subscribe to task updates
    const tasksSub = supabase
      .channel('mc_tasks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mc_tasks' }, (payload) => {
        console.log('Task change via realtime:', payload)
        // Small delay to avoid race condition with optimistic update
        setTimeout(() => loadData(), 100)
      })
      .subscribe()

    // Subscribe to activity updates
    const activitiesSub = supabase
      .channel('mc_activities_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mc_activities' }, (payload) => {
        console.log('Activity change:', payload)
        loadData()
      })
      .subscribe()

    return () => {
      agentsSub.unsubscribe()
      tasksSub.unsubscribe()
      activitiesSub.unsubscribe()
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    console.log('Drag end:', { activeId: active.id, overId: over?.id, overData: over })
    setActiveId(null)
    
    if (!over) {
      console.log('No drop target detected')
      return
    }
    
    // Check if over.id is a valid TaskStatus
    const validStatuses: TaskStatus[] = ['inbox', 'assigned', 'in_progress', 'review', 'done', 'blocked']
    if (!validStatuses.includes(over.id as TaskStatus)) {
      console.log('Invalid drop target:', over.id)
      return
    }

    const taskId = active.id as string
    const task = tasks.find(t => t.id === taskId)
    const newStatus = over.id as TaskStatus
    
    if (task?.status === newStatus) {
      console.log('Dropped on same column, ignoring')
      return
    }
    
    // Check write access - if no access, prompt for 2FA
    if (requires2FA && !hasWriteAccess) {
      withWriteAccess(async () => {
        await performTaskUpdate(taskId, newStatus, task?.title)
      })
      return
    }
    
    await performTaskUpdate(taskId, newStatus, task?.title)
  }

  async function performTaskUpdate(taskId: string, newStatus: TaskStatus, taskTitle?: string) {
    console.log(`Updating task "${taskTitle}" to ${newStatus}`)

    // Optimistically update UI first
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ))

    try {
      await updateTaskStatus(taskId, newStatus)
      console.log('✓ Task updated successfully in database')
    } catch (error) {
      console.error('✗ Failed to update task:', error)
      alert(`Failed to update task: ${error}`)
      loadData() // Reload on error to revert
    }
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  const activeAgents = agents.filter(a => a.status === 'active').length
  const tasksInQueue = tasks.filter(t => t.status !== 'done').length
  const reviewCount = tasks.filter(t => t.status === 'review').length
  
  // Filter tasks by selected agent
  const filteredTasks = selectedAgent 
    ? tasks.filter(t => {
        if (selectedAgent === 'Jay') {
          // Jay's tasks are ones not assigned to agents, or assigned to Jay
          const jayAgent = agents.find(a => a.name === 'Jay')
          return t.assigned_agent_ids.length === 0 || (jayAgent && t.assigned_agent_ids.includes(jayAgent.id))
        }
        const bot = agents.find(a => a.name === selectedAgent)
        return bot && t.assigned_agent_ids.includes(bot.id)
      })
    : tasks

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading Mission Control...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">MISSION CONTROL</h1>
              <span className="text-sm text-gray-500">Clyde & Bonnie</span>
            </div>

            <div className="flex items-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{activeAgents}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Agents Active</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{tasksInQueue}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Tasks in Queue</div>
              </div>
              {reviewCount > 0 && (
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="text-3xl font-bold text-orange-600">{reviewCount}</div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-xs text-orange-600 uppercase tracking-wide font-semibold">Needs Review</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-lg font-mono text-gray-900">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Write Access Banner */}
      {requires2FA && !hasWriteAccess && !twoFALoading && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-[1800px] mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm text-yellow-800">
                {needs2FASetup ? (
                  <><strong>Read-only mode.</strong> Enable 2FA to create or edit tasks.</>
                ) : (
                  <><strong>Read-only mode.</strong> Verify 2FA to create or edit tasks.</>
                )}
              </span>
            </div>
            {needs2FASetup ? (
              <a
                href="/dashboard?tab=settings"
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition"
              >
                Enable 2FA
              </a>
            ) : (
              <button
                onClick={() => withWriteAccess(async () => {})}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition"
              >
                Verify Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[2000px] mx-auto px-6 py-6">
        {/* Filter and Controls Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-gray-900 text-lg">MISSION QUEUE</h2>
            
            {/* Agent Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter:</span>
              <button
                onClick={() => setSelectedAgent(null)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedAgent === null 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {agents.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.name)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    selectedAgent === agent.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{agent.emoji}</span>
                  <span>{agent.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Hide Done toggle */}
            <button
              onClick={() => setHideDone(!hideDone)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                hideDone 
                  ? 'bg-gray-200 text-gray-600' 
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {hideDone ? 'Show Done' : 'Hide Done'}
              {!hideDone && ` (${tasks.filter(t => t.status === 'done').length})`}
            </button>
            
            <button
              onClick={() => {
                if (requires2FA && !hasWriteAccess) {
                  withWriteAccess(async () => setShowCreateTask(true))
                } else {
                  setShowCreateTask(true)
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              + Create Task
            </button>
          </div>
        </div>

        {/* Kanban Board - Full Width */}
        <div>

          <DndContext 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            sensors={sensors}
            collisionDetection={closestCenter}
          >
            <div className="flex gap-4 pb-4">
              {COLUMNS.filter(col => !hideDone || col.status !== 'done').map(column => (
                <KanbanColumn
                  key={column.status}
                  status={column.status}
                  title={column.title}
                  tasks={filteredTasks.filter(t => t.status === column.status)}
                  agents={agents}
                  onTaskClick={setSelectedTask}
                />
              ))}
            </div>
            <DragOverlay>
              {activeId ? (
                <div className="bg-white border-l-4 border-l-blue-400 rounded-lg p-3 shadow-xl opacity-90">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {tasks.find(t => t.id === activeId)?.title}
                  </h3>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Activity Feed - Below Kanban */}
        <div className="mt-6">
          <div className="bg-white rounded-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                LIVE FEED
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </span>
              <span className="text-sm font-normal text-gray-500">{activities.length} recent</span>
            </h2>
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          agents={agents}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTaskModal
          agents={agents}
          onClose={() => setShowCreateTask(false)}
          onSuccess={() => loadData()}
        />
      )}

      {/* 2FA Verify Modal */}
      {showVerifyModal && (
        <TwoFactorVerifyModal
          onSuccess={onVerifySuccess}
          onCancel={onVerifyCancel}
        />
      )}
    </div>
  )
}
