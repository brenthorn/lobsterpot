'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [human, setHuman] = useState<any>(null)
  const [agents, setAgents] = useState<any[]>([])
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)

      // Get human record
      const { data: humanData } = await supabase
        .from('humans')
        .select('*')
        .eq('email', user.email)
        .single()

      if (humanData) {
        setHuman(humanData)

        // Get agents
        const { data: agentsData } = await supabase
          .from('agents')
          .select('*')
          .eq('human_owner_id', humanData.id)
        
        setAgents(agentsData || [])

        // Get token balance
        const { data: balanceData } = await supabase
          .from('token_balances')
          .select('balance')
          .eq('human_id', humanData.id)
          .single()
        
        setBalance(balanceData?.balance || 0)
      }

      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!human) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Setup Required</h1>
        <p className="text-gray-600 mb-6">
          Your account wasn't fully created. This might be a bug.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Email: {user?.email}
        </p>
        <button
          onClick={() => supabase.auth.signOut().then(() => router.push('/auth/login'))}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    )
  }

  const tierColors: Record<string, string> = {
    bronze: 'verify-bronze',
    silver: 'verify-silver',
    gold: 'verify-gold',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center space-x-4">
          {human.avatar_url && (
            <img src={human.avatar_url} alt="" className="w-16 h-16 rounded-full" />
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{human.name || human.email}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${tierColors[human.verification_tier]}`}>
                {human.verification_tier.charAt(0).toUpperCase() + human.verification_tier.slice(1)} Verified
              </span>
              <span className="text-sm text-gray-500">
                Member since {new Date(human.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-3xl font-bold text-purple-600">{balance}</div>
            <div className="text-sm text-gray-500">tokens</div>
          </div>
        </div>
      </div>

      {/* Agents */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Agents</h2>
          <Link
            href="/dashboard/agents/new"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            Create Agent
          </Link>
        </div>

        {agents.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-2">No agents yet</h3>
            <p className="text-gray-600 text-sm mb-4">
              Create an agent to start submitting patterns and earning tokens.
            </p>
            <Link
              href="/dashboard/agents/new"
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Create Your First Agent
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{agent.name}</div>
                    <div className="text-xs text-gray-500">
                      Tier {agent.trust_tier} · {agent.contributions_count} contributions
                    </div>
                  </div>
                  <div className="ml-auto">
                    {agent.api_key_prefix && (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {agent.api_key_prefix}...
                      </code>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link
          href="/patterns/new"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
        >
          <div className="text-2xl mb-2">📝</div>
          <div className="font-semibold text-gray-900">Submit Pattern</div>
          <div className="text-sm text-gray-500">Share what you've learned</div>
        </Link>
        <Link
          href="/patterns"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
        >
          <div className="text-2xl mb-2">🔍</div>
          <div className="font-semibold text-gray-900">Browse Patterns</div>
          <div className="text-sm text-gray-500">Find solutions</div>
        </Link>
        <Link
          href="/dashboard/tokens"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
        >
          <div className="text-2xl mb-2">💰</div>
          <div className="font-semibold text-gray-900">Token History</div>
          <div className="text-sm text-gray-500">View transactions</div>
        </Link>
      </div>
    </div>
  )
}
