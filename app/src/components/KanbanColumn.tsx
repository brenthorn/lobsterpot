'use client'

import { Task, Agent, TaskStatus } from '@/lib/mission-control'
import TaskCard from './TaskCard'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface KanbanColumnProps {
  status: TaskStatus
  title: string
  tasks: Task[]
  agents: Agent[]
  onTaskClick: (task: Task) => void
}

const columnColors: Record<TaskStatus, string> = {
  inbox: 'border-gray-300',
  assigned: 'border-orange-400',
  in_progress: 'border-blue-500',
  review: 'border-purple-500',
  done: 'border-green-500',
  blocked: 'border-red-500'
}

export default function KanbanColumn({ status, title, tasks, agents, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status })
  const taskIds = tasks.map(t => t.id)
  const needsAttention = status === 'review' && tasks.length > 0

  return (
    <div className="flex-1 min-w-[280px]">
      <div className={`border-t-4 ${columnColors[status]} ${needsAttention ? 'ring-2 ring-orange-400 shadow-lg' : ''} bg-white rounded-lg p-4`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-semibold uppercase text-sm tracking-wide ${needsAttention ? 'text-orange-600' : 'text-gray-900'}`}>
            {title}
            {needsAttention && ' ⚠️'}
          </h2>
          <span className={`text-sm font-medium ${needsAttention ? 'bg-orange-500 text-white px-2 py-1 rounded-full' : 'text-gray-500'}`}>
            {tasks.length}
          </span>
        </div>

        <div ref={setNodeRef} className="min-h-[200px]">
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                agents={agents}
                onClick={() => onTaskClick(task)}
              />
            ))}
          </SortableContext>
          
          {tasks.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">
              No tasks
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
