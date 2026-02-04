import Link from 'next/link'
import { createRealSupabaseClient } from '@/lib/supabase-server'
import { SplitScreenHero } from '@/components/SplitScreenHero'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tiker - Stop babysitting your AI tools',
  description: 'A command center for AI agents. Task board, not chat window. Async by design.',
}

export default async function LandingPage() {
  const supabase = await createRealSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen">
      {/* Hero - Logged in */}
      {user ? (
        <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900 text-sm text-green-700 dark:text-green-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Your AI team is active
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-neutral-900 dark:text-neutral-100 leading-[1] tracking-tight mb-6">
                Back to work.
              </h1>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Link 
                  href="/command" 
                  className="group p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 transition"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        Command
                      </h2>
                    </div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Your task dashboard. Create, assign, track.
                  </p>
                </Link>
                
                <Link 
                  href="/hub" 
                  className="group p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-purple-400 dark:hover:border-purple-600 transition"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                        Agent Hub
                      </h2>
                    </div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Add specialists to your team.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Split Screen Hero */}
          <SplitScreenHero />

          {/* The Problem - One punchy statement */}
          <section className="py-24 md:py-32 border-b border-neutral-200 dark:border-neutral-800">
            <div className="max-w-6xl mx-auto px-6">
              <div className="max-w-3xl">
                <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-4 uppercase tracking-wider">The problem</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight mb-8">
                  Your AI tools don't talk to each other. They only work when YOU work. Context dies between sessions.
                </h2>
                <p className="text-xl text-neutral-500 dark:text-neutral-400">
                  You're not scaling AI. You're babysitting it.
                </p>
              </div>
            </div>
          </section>

          {/* The Solution */}
          <section className="py-24 md:py-32 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" id="how-it-works">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div>
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-4 uppercase tracking-wider">The solution</p>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight mb-6">
                    A command center for AI agents.
                  </h2>
                  <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
                    Task board, not chat window.
                  </p>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900 text-sm text-green-700 dark:text-green-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Async by design
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-neutral-900 dark:text-neutral-100 font-medium text-lg">Create a task</p>
                      <p className="text-neutral-500 dark:text-neutral-400">"Write Q1 investor update"</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-neutral-900 dark:text-neutral-100 font-medium text-lg">Assign to an agent</p>
                      <p className="text-neutral-500 dark:text-neutral-400">Writer, Coder, Researcher...</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-neutral-900 dark:text-neutral-100 font-medium text-lg">Get the result</p>
                      <p className="text-neutral-500 dark:text-neutral-400">While you sleep</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What makes it different - Editorial style */}
          <section className="py-24 md:py-32 border-b border-neutral-200 dark:border-neutral-800">
            <div className="max-w-6xl mx-auto px-6">
              <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-4 uppercase tracking-wider">Why Tiker</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight mb-16">
                What makes it different.
              </h2>
              
              <div className="space-y-16">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Specialist agents
                    </h3>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Coder, Writer, Researcher, Data Analyst — each optimized for specific work. Not one generalist pretending to do everything.
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Agents remember
                    </h3>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Your context and preferences persist. Writer knows you hate buzzwords. Coder knows your naming conventions. No re-explaining.
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Auto-coordination
                    </h3>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Researcher finishes data gathering → hands off to Writer automatically. You're not the middleman anymore.
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-16">
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-neutral-900 dark:text-neutral-100 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        Full audit trail
                      </h3>
                      <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Every action logged. Every handoff tracked. Complete visibility into what your AI team is doing — and when.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Credibility */}
          <section className="py-24 md:py-32 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <div className="max-w-6xl mx-auto px-6">
              <div className="max-w-3xl">
                <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-4 uppercase tracking-wider">Built in public</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight mb-8">
                  Not vaporware. Not a wrapper.
                </h2>
                
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                  Built this because I was drowning in AI tool chaos. Went from concept to working product in 36 hours of non-stop coding.
                </p>
                
                <div className="flex flex-wrap gap-6 mb-8">
                  <span className="text-neutral-900 dark:text-neutral-100 font-medium">Open source (MIT)</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-medium">Self-hostable</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-medium">Production-ready</span>
                </div>
                
                <p className="text-neutral-500 dark:text-neutral-400">
                  Used by teams who can't afford AI tools that don't coordinate.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing - Editorial style */}
          <section className="py-24 md:py-32 border-b border-neutral-200 dark:border-neutral-800" id="pricing">
            <div className="max-w-6xl mx-auto px-6">
              <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-4 uppercase tracking-wider">Pricing</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight mb-16">
                Simple pricing.
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Solo */}
                <div className="py-8 border-t-2 border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Solo</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 mb-6">Just getting started</p>
                  <div className="mb-6">
                    <span className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100">$0</span>
                    <span className="text-neutral-500 dark:text-neutral-400">/month</span>
                  </div>
                  <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      1 general-purpose agent
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Command dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Community support
                    </li>
                  </ul>
                </div>
                
                {/* Team */}
                <div className="py-8 border-t-2 border-neutral-900 dark:border-neutral-100">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Team</h3>
                    <span className="text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-2 py-0.5 rounded">Popular</span>
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400 mb-6">Build your AI team</p>
                  <div className="mb-6">
                    <span className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100">$7</span>
                    <span className="text-neutral-500 dark:text-neutral-400">/month</span>
                  </div>
                  <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      All specialist agents
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Invite collaborators
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Priority support
                    </li>
                  </ul>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-6">
                    First 3 months FREE this week
                  </p>
                </div>
                
                {/* Self-hosted */}
                <div className="py-8 border-t-2 border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Self-hosted</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 mb-6">Full control</p>
                  <div className="mb-6">
                    <span className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100">Free</span>
                  </div>
                  <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Run on your infrastructure
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Full data control
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      OSS on GitHub
                    </li>
                  </ul>
                  <a 
                    href="https://github.com/chitownjk/tiker" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-900 dark:text-neutral-100 underline underline-offset-4 mt-6 inline-block"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight mb-6">
                  Ready to stop babysitting?
                </h2>
                <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8">
                  Start your AI team today. Solo is free forever — no credit card required.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/auth/login" 
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition"
                  >
                    Start your AI team
                  </Link>
                  <a 
                    href="https://github.com/chitownjk/tiker" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-4 text-base font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  )
}
