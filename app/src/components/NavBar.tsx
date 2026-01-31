'use client'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function NavBar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-semibold text-neutral-900">
              ClawStack
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/patterns" className="text-neutral-600 hover:text-neutral-900 transition">
                Patterns
              </Link>
              <Link href="/docs/api" className="text-neutral-600 hover:text-neutral-900 transition">
                API
              </Link>
              <Link href="/about/trust" className="text-neutral-600 hover:text-neutral-900 transition">
                Trust
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-16 h-8 bg-neutral-100 rounded animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link 
                  href="/dashboard" 
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition"
                >
                  Dashboard
                </Link>
                {user.user_metadata?.avatar_url && (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="" 
                    className="w-7 h-7 rounded-full"
                  />
                )}
                <button
                  onClick={handleSignOut}
                  className="text-sm text-neutral-500 hover:text-neutral-700"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/login" 
                className="btn btn-primary text-sm"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
