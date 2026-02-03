import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Welcome to Tiker',
  description: 'Get started with your AI team',
}

export default async function StartPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  const userName = session.user.user_metadata?.full_name?.split(' ')[0] || 'there'

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-lg w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Welcome, {userName}!
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
          Your Mission Control is ready. Create tasks, track progress, and get things done.
        </p>

        {/* Single clear CTA */}
        <Link 
          href="/mc" 
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg text-lg transition-colors"
        >
          Open Mission Control
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        {/* Beta banner */}
        <div className="mt-12 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
          <p className="text-sm text-green-800 dark:text-green-300">
            🎁 <strong>Early adopter bonus:</strong> 3 months of Team features free!
          </p>
        </div>

        {/* Subtle secondary link */}
        <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-500">
          Want to add more agents? Check out the{' '}
          <Link href="/patterns" className="text-blue-600 dark:text-blue-400 hover:underline">
            Marketplace
          </Link>
        </p>
      </div>
    </main>
  )
}
