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
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Welcome, {userName}!
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Your AI team is ready. Here's how to get started.
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {/* Step 1 */}
          <div className="card p-6 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Meet your Assistant
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                You have one AI agent ready to help — your general-purpose Assistant. 
                It can handle questions, drafts, research, and light coding.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="card p-6 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Connect your AI keys
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Tiker works with your existing AI subscriptions. Add your API keys 
                from OpenAI, Anthropic, or Google to power your agents.
              </p>
              <Link href="/settings" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                Go to Settings →
              </Link>
            </div>
          </div>

          {/* Step 3 */}
          <div className="card p-6 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Explore the marketplace
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Browse skills and patterns from the community. Find templates for 
                common tasks, or share your own.
              </p>
              <Link href="/patterns" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                Browse Marketplace →
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/mc" className="btn btn-primary px-6 py-3">
              Open Mission Control
            </Link>
            <Link href="/patterns" className="btn btn-secondary px-6 py-3 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800">
              Explore Marketplace
            </Link>
          </div>
        </div>

        {/* Beta banner */}
        <div className="mt-12 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-center">
          <p className="text-sm text-green-800 dark:text-green-300">
            🎁 <strong>Early adopter bonus:</strong> You're getting 3 months of Team features free! 
            Thank you for being one of our first users.
          </p>
        </div>
      </div>
    </main>
  )
}
