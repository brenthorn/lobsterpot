'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TwoFactorSetup from '@/components/TwoFactorSetup'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [redirectToMC, setRedirectToMC] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }
      
      setUser(user)
      
      // Load account data
      const { data: accountData } = await supabase
        .from('accounts')
        .select('*')
        .eq('auth_uid', user.id)
        .single()
      
      if (accountData) {
        setAccount(accountData)
        setRedirectToMC(accountData.redirect_to_mc || false)
      }
      
      setLoading(false)
    }
    
    loadUser()
  }, [])

  const handleSavePreferences = async () => {
    if (!account) return
    
    setSaving(true)
    setMessage(null)
    
    const { error } = await supabase
      .from('accounts')
      .update({ redirect_to_mc: redirectToMC })
      .eq('id', account.id)
    
    if (error) {
      setMessage({ type: 'error', text: 'Failed to save preferences' })
    } else {
      setMessage({ type: 'success', text: 'Preferences saved' })
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded mb-8"></div>
          <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-8">
          Settings
        </h1>

        {/* Account Info */}
        <section className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Account
          </h2>
          
          <div className="flex items-center gap-4 mb-6">
            {user.user_metadata?.avatar_url && (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {user.email}
              </p>
              {account?.tier && (
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                  account.tier === 'team' 
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}>
                  {account.tier === 'team' ? 'Team Plan' : 'Solo Plan'}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Preferences
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={redirectToMC}
                onChange={(e) => setRedirectToMC(e.target.checked)}
                className="w-5 h-5 rounded border-neutral-300 text-blue-600 mt-0.5"
              />
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  Go to Mission Control on login
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Skip the landing page and go straight to MC when you're logged in
                </p>
              </div>
            </label>
          </div>
          
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300'
            }`}>
              {message.text}
            </div>
          )}
          
          <button
            onClick={handleSavePreferences}
            disabled={saving}
            className="btn btn-primary mt-4"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </section>

        {/* Security / 2FA */}
        <section className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Security
          </h2>
          
          {account?.two_factor_enabled ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  Two-factor authentication enabled
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Write access is protected by your authenticator app
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg mb-6">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Two-factor authentication not enabled
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Enable 2FA to unlock write access in Mission Control. Until then, you're in read-only mode.
                  </p>
                </div>
              </div>
              
              <TwoFactorSetup 
                onComplete={() => {
                  // Refresh account data
                  window.location.reload()
                }}
              />
            </div>
          )}
        </section>

        {/* Danger Zone */}
        <section className="card p-6 border-red-200 dark:border-red-900">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Danger Zone
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  Export your data
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Download all your tasks, agents, and settings
                </p>
              </div>
              <button className="btn btn-secondary text-sm">
                Export
              </button>
            </div>
            
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    Delete account
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button className="btn bg-red-600 hover:bg-red-700 text-white text-sm">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Back link */}
        <div className="mt-8">
          <Link href="/mc" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Mission Control
          </Link>
        </div>
      </div>
    </main>
  )
}
