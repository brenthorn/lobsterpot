'use client'

import { useEffect, useState } from 'react'
import { Agent, Task, Activity, TaskStatus, getAgents, getTasks, getActivities, updateTaskStatus } from '@/lib/mission-control'
import AgentCard from '@/components/AgentCard'
import KanbanColumn from '@/components/KanbanColumn'
import ActivityFeed from '@/components/ActivityFeed'
import TaskDetailModal from '@/components/TaskDetailModal'
import CreateTaskModal from '@/components/CreateTaskModal'
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
      const [agentsData, tasksData, activitiesData] = await Promise.all([
        getAgents(),
        getTasks(),
        getActivities()
      ])
      setAgents(agentsData)
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mc_agents' }, () => {
        loadData()
      })
      .subscribe()

    // Subscribe to task updates
    const tasksSub = supabase
      .channel('mc_tasks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mc_tasks' }, () => {
        loadData()
      })
      .subscribe()

    // Subscribe to activity updates
    const activitiesSub = supabase
      .channel('mc_activities_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mc_activities' }, () => {
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
    setActiveId(null)
    
    if (!over || active.id === over.id) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    try {
      await updateTaskStatus(taskId, newStatus)
      // Optimistically update UI
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      ))
    } catch (error) {
      console.error('Failed to update task:', error)
      loadData() // Reload on error
    }
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  const activeAgents = agents.filter(a => a.status === 'active').length
  const tasksInQueue = tasks.filter(t => t.status !== 'done').length
  const reviewCount = tasks.filter(t => t.status === 'review').length

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

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Agents */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg p-4 sticky top-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                AGENTS
                <span className="text-sm font-normal text-gray-500">{agents.length}</span>
              </h2>
              <div className="space-y-2">
                {agents.map(agent => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
          </div>

          {/* Center - Kanban Board */}
          <div className="col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-lg">MISSION QUEUE</h2>
              <button
                onClick={() => setShowCreateTask(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                + Create Task
              </button>
            </div>

            <DndContext 
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
              sensors={sensors}
              collisionDetection={closestCenter}
            >
              <div className="flex gap-4 overflow-x-auto pb-4">
                {COLUMNS.map(column => (
                  <KanbanColumn
                    key={column.status}
                    status={column.status}
                    title={column.title}
                    tasks={tasks.filter(t => t.status === column.status)}
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

          {/* Right Sidebar - Activity Feed */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg p-4 sticky top-6 max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                LIVE FEED
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </h2>
              <div className="overflow-y-auto flex-1">
                <ActivityFeed activities={activities} />
              </div>
            </div>
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
    </div>
  )
}
