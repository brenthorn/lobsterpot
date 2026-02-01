'use client'

import { Task, Agent, Comment } from '@/lib/mission-control'
import { useEffect, useState } from 'react'
import { getTaskComments } from '@/lib/mission-control'

interface TaskDetailModalProps {
  task: Task
  agents: Agent[]
  onClose: () => void
}

export default function TaskDetailModal({ task, agents, onClose }: TaskDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [task.id])

  async function loadComments() {
    try {
      const data = await getTaskComments(task.id)
      setComments(data)
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const assignedAgents = agents.filter(a => task.assigned_agent_ids.includes(a.id))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{task.title}</h2>
              {task.description && (
                <p className="text-gray-600">{task.description}</p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4"
            >
              ×
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Status:</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {task.status}
              </span>
            </div>

            {assignedAgents.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Assigned:</span>
                <div className="flex gap-1">
                  {assignedAgents.map(agent => (
                    <span key={agent.id} title={agent.name}>
                      {agent.emoji} {agent.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {task.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Activity</h3>
          
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      {comment.agent?.emoji}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">
                        {comment.agent?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">No comments yet</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="text-xs text-gray-500">
            Created {new Date(task.created_at).toLocaleString()}
            {task.completed_at && ` • Completed ${new Date(task.completed_at).toLocaleString()}`}
          </div>
        </div>
      </div>
    </div>
  )
}
