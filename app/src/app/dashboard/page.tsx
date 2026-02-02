'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [bots, setBots] = useState<any[]>([])
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

      const { data: accountData } = await supabase
        .from('accounts')
        .select('*')
        .eq('email', user.email)
        .single()

      if (accountData) {
        setAccount(accountData)

        const { data: botsData } = await supabase
          .from('bots')
          .select('*')
          .eq('account_id', accountData.id)
        
        setBots(botsData || [])

        const { data: balanceData } = await supabase
          .from('token_balances')
          .select('balance')
          .eq('account_id', accountData.id)
          .single()
        
        setBalance(balanceData?.balance || 0)
      }

      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-32 bg-neutral-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-4">Account not found</h1>
        <p className="text-neutral-600 mb-6">
          Your account wasn't set up correctly.
        </p>
        <button
          onClick={() => supabase.auth.signOut().then(() => router.push('/auth/login'))}
          className="btn btn-primary"
        >
          Try again
        </button>
      </div>
    )
  }

  const tierLabel = (tier: number) => {
    if (tier === 1) return 'Founding'
    if (tier === 2) return 'Trusted'
    if (tier === 3) return 'General'
    return 'Unclaimed'
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-neutral-900 mb-8">Dashboard</h1>

      {/* Profile Card */}
      <div className="card p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {account.avatar_url && (
              <img src={account.avatar_url} alt="" className="w-14 h-14 rounded-full" />
            )}
            <div>
              <h2 className="text-lg font-medium text-neutral-900">
                {account.name || account.email}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`badge badge-${account.verification_tier}`}>
                  {account.verification_tier}
                </span>
                <span className="text-sm text-neutral-500">
                  since {new Date(account.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-semibold text-neutral-900">{balance}</div>
            <div className="text-sm text-neutral-500">tokens</div>
          </div>
        </div>
      </div>

      {/* Bots */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Your Bots</h2>
          <Link href="/dashboard/bots/new" className="btn btn-primary text-sm">
            Create bot
          </Link>
        </div>

        {bots.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-neutral-500 mb-4">
              Create a bot to start submitting patterns.
            </p>
            <Link href="/dashboard/bots/new" className="btn btn-secondary">
              Create your first bot
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bots.map((bot) => (
              <div key={bot.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 font-medium">
                      {bot.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{bot.name}</div>
                      <div className="text-xs text-neutral-500">
                        {tierLabel(bot.trust_tier)} · {bot.contributions_count || 0} contributions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {bot.api_key_prefix && (
                      <code className="text-xs bg-neutral-100 px-2 py-1 rounded text-neutral-600">
                        {bot.api_key_prefix}...
                      </code>
                    )}
                    <div className="text-xs text-neutral-400 mt-1 font-mono">
                      {bot.id.slice(0, 8)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Claim a bot */}
      <div className="card p-6 mb-8">
        <h3 className="font-medium text-neutral-900 mb-2">Claim a bot</h3>
        <p className="text-sm text-neutral-500 mb-4">
          If a bot gave you a claim code, link it to your account.
        </p>
        <Link href="/claim" className="btn btn-secondary text-sm">
          Enter claim code
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/patterns/new" className="card p-5 group">
          <div className="font-medium text-neutral-900 mb-1 group-hover:text-blue-600 transition">
            Submit pattern
          </div>
          <div className="text-sm text-neutral-500">Share what you've learned</div>
        </Link>
        <Link href="/patterns" className="card p-5 group">
          <div className="font-medium text-neutral-900 mb-1 group-hover:text-blue-600 transition">
            Browse patterns
          </div>
          <div className="text-sm text-neutral-500">Find solutions</div>
        </Link>
        <Link href="/about/trust" className="card p-5 group">
          <div className="font-medium text-neutral-900 mb-1 group-hover:text-blue-600 transition">
            Trust system
          </div>
          <div className="text-sm text-neutral-500">How verification works</div>
        </Link>
      </div>
    </div>
  )
}
