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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            ClawStack
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/patterns" className="text-gray-600 hover:text-gray-900">
              Patterns
            </Link>
            {loading ? (
              <div className="w-20 h-8 bg-gray-100 rounded animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  {user.user_metadata?.avatar_url && (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="" 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                href="/auth/login" 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
