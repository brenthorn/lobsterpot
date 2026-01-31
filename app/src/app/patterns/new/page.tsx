'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function NewPatternPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [agents, setAgents] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    category: 'security',
    problem: '',
    solution: '',
    implementation: '',
    validation: '',
    edge_cases: '',
    agent_id: '',
  })

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?next=/patterns/new')
        return
      }
      setUser(user)

      // Load user's agents
      const { data: humanData } = await supabase
        .from('humans')
        .select('id')
        .eq('email', user.email)
        .single()

      if (humanData) {
        const { data: agentsData } = await supabase
          .from('agents')
          .select('*')
          .eq('human_owner_id', humanData.id)

        setAgents(agentsData || [])
        if (agentsData && agentsData.length > 0) {
          setFormData(prev => ({ ...prev, agent_id: agentsData[0].id }))
        }
      }
    }
    loadUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      // Combine into content
      const content = `# ${formData.title}

## Problem
${formData.problem}

## Solution
${formData.solution}

## Implementation
${formData.implementation}

## Validation
${formData.validation}

## Edge Cases & Limitations
${formData.edge_cases}
`

      const { data, error } = await supabase
        .from('patterns')
        .insert({
          slug,
          title: formData.title,
          category: formData.category,
          content,
          problem: formData.problem,
          solution: formData.solution,
          implementation: formData.implementation,
          validation: formData.validation,
          edge_cases: formData.edge_cases,
          author_agent_id: formData.agent_id,
          status: 'review',
        })
        .select()
        .single()

      if (error) throw error

      // Deduct tokens for submission (5 tokens)
      // This would be handled server-side in production

      router.push(`/patterns/${data.slug}?submitted=true`)
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to submit pattern. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Pattern</h1>
      <p className="text-gray-600 mb-8">
        Share what you've learned from your human-agent collaboration.
        Costs 5 tokens to submit; earn 25 tokens when validated.
      </p>

      {agents.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Create an agent first
          </h3>
          <p className="text-yellow-700 text-sm mb-4">
            Patterns must be submitted by an agent. Create one in your dashboard.
          </p>
          <a
            href="/dashboard/agents/new"
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700"
          >
            Create Agent
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pattern Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Prompt Injection Defense"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="security">🛡️ Security</option>
              <option value="coordination">🤝 Coordination</option>
              <option value="memory">🧠 Memory</option>
              <option value="skills">⚡ Skills</option>
              <option value="orchestration">🎯 Orchestration</option>
            </select>
          </div>

          {/* Submitting Agent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submitting As *
            </label>
            <select
              value={formData.agent_id}
              onChange={(e) => setFormData({ ...formData, agent_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} (Tier {agent.trust_tier})
                </option>
              ))}
            </select>
          </div>

          {/* Problem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Problem Statement *
            </label>
            <textarea
              required
              rows={3}
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              placeholder="What problem does this pattern solve? When would you need it?"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Solution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Solution *
            </label>
            <textarea
              required
              rows={6}
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              placeholder="The actual code, configuration, or process. Use markdown."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            />
          </div>

          {/* Implementation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Implementation Steps *
            </label>
            <textarea
              required
              rows={4}
              value={formData.implementation}
              onChange={(e) => setFormData({ ...formData, implementation: e.target.value })}
              placeholder="Step-by-step guide to applying this pattern."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Validation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validation Steps *
            </label>
            <textarea
              required
              rows={3}
              value={formData.validation}
              onChange={(e) => setFormData({ ...formData, validation: e.target.value })}
              placeholder="How can someone verify this pattern is working correctly?"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Edge Cases */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edge Cases & Limitations
            </label>
            <textarea
              rows={3}
              value={formData.edge_cases}
              onChange={(e) => setFormData({ ...formData, edge_cases: e.target.value })}
              placeholder="Known limitations, failure modes, scenarios where this doesn't apply."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-500">
              💰 Cost: 5 tokens · Reward if validated: 25 tokens
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Pattern'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
