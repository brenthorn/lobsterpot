'use client'

import { Task, Agent } from '@/lib/mission-control'
import { useDraggable } from '@dnd-kit/core'

interface TaskCardProps {
  task: Task
  agents: Agent[]
  onClick: () => void
}

const priorityColors = {
  low: 'border-l-gray-300',
  normal: 'border-l-blue-400',
  high: 'border-l-orange-400',
  urgent: 'border-l-red-500'
}

export default function TaskCard({ task, agents, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({ id: task.id })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  const assignedAgents = agents.filter(a => task.assigned_agent_ids.includes(a.id))
  const timeAgo = getTimeAgo(new Date(task.created_at))

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border-l-4 ${priorityColors[task.priority]} rounded-lg p-3 hover:shadow-md transition-shadow relative cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
    >
      {/* Clickable card area */}
      <div onClick={onClick} className="cursor-pointer">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-medium text-gray-900 text-sm flex-1">{task.title}</h3>
          <span className="text-xs text-gray-400 font-mono shrink-0" title="Task ID">
            #{task.id.substring(0, 8)}
          </span>
        </div>
      
        {task.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            {assignedAgents.map(agent => (
              <span key={agent.id} className="text-sm" title={agent.name}>
                {agent.emoji}
              </span>
            ))}
          </div>

          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
