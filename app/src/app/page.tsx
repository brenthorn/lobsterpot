import Link from 'next/link'
import { createRealSupabaseClient } from '@/lib/supabase-server'

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
        <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
          <div className="absolute inset-0 bg-grid dark:bg-neutral-950"></div>
          <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/50 border border-green-100 dark:border-green-900 text-sm text-green-700 dark:text-green-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Your AI team is active
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight mb-6">
                Back to work.
              </h1>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Link 
                  href="/command" 
                  className="card p-6 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        Command
                      </h2>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Your task dashboard
                      </p>
                    </div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Create tasks, assign to agents, track progress. Your AI team's home base.
                  </p>
                </Link>
                
                <Link 
                  href="/hub" 
                  className="card p-6 hover:border-neutral-300 dark:hover:border-neutral-600 transition group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                        Agent Hub
                      </h2>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Add specialists to your team
                      </p>
                    </div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Browse vetted agents. Add Coder, Writer, Researcher, and more.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Hero - Logged out */}
          <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
            <div className="absolute inset-0 bg-grid dark:bg-neutral-950"></div>
            <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32 lg:py-40">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-sm text-blue-700 dark:text-blue-300 mb-6">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Open source • Self-hosted option
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight mb-6">
                  Stop babysitting
                  <br />
                  <span className="text-neutral-400 dark:text-neutral-500">your AI tools.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl leading-relaxed">
                  Your AI tools don't talk to each other. They only work when YOU work. 
                  Every handoff requires manual copy-paste. Nothing happens overnight.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <Link href="/auth/login" className="btn btn-primary text-base px-8 py-3">
                    Start your AI team
                  </Link>
                  <Link href="#how-it-works" className="btn btn-secondary text-base px-6 py-3">
                    See how it works
                  </Link>
                </div>
                
                <p className="text-sm text-neutral-500 dark:text-neutral-500">
                  Solo plan is free forever. No credit card required.
                </p>
              </div>
            </div>
          </section>

          {/* The Problem - Brutal clarity */}
          <section className="py-20 md:py-28 border-b border-neutral-200 dark:border-neutral-800">
            <div className="max-w-6xl mx-auto px-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-8">
                  The problem is brutal.
                </h2>
                
                <div className="space-y-4 text-lg text-neutral-600 dark:text-neutral-400">
                  <p className="flex items-start gap-3">
                    <span className="text-red-500 font-mono">×</span>
                    Your AI tools don't talk to each other
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-red-500 font-mono">×</span>
                    They only work when YOU work
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-red-500 font-mono">×</span>
                    Every handoff requires manual copy-paste
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-red-500 font-mono">×</span>
                    Context dies between sessions
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-red-500 font-mono">×</span>
                    Nothing happens overnight
                  </p>
                </div>
                
                <p className="mt-8 text-xl text-neutral-900 dark:text-neutral-100 font-medium">
                  You're not scaling AI. You're babysitting it.
                </p>
              </div>
            </div>
          </section>

          {/* The Solution */}
          <section className="py-20 md:py-28 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" id="how-it-works">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                    A command center for AI agents.
                  </h2>
                  
                  <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
                    Think: <span className="text-neutral-900 dark:text-neutral-100 font-medium">Task board, not chat window.</span>
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="text-neutral-900 dark:text-neutral-100 font-medium">Create a task</p>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">"Write Q1 investor update"</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="text-neutral-900 dark:text-neutral-100 font-medium">Assign to an agent</p>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Writer, Coder, Researcher...</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="text-neutral-900 dark:text-neutral-100 font-medium">Agent executes and delivers</p>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">While you sleep</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-950/50 border border-green-100 dark:border-green-900 text-sm text-green-700 dark:text-green-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Async by design. Built for people who use AI daily.
                  </div>
                </div>
                
                <div>
                  <img 
                    src="/images/screenshots/mc-hero.png" 
                    alt="Command dashboard showing AI agents coordinating tasks" 
                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl w-full"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* What makes it different */}
          <section className="py-20 md:py-28 border-b border-neutral-200 dark:border-neutral-800">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-12">
                What makes it different.
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Specialist agents
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Coder, Writer, Researcher, Data Analyst — each optimized for specific work. Not one generalist pretending to do everything.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Agents remember
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Your context and preferences persist. Writer knows you hate buzzwords. Coder knows your naming conventions. No re-explaining.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Auto-coordination
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Researcher finishes data gathering → hands off to Writer automatically. You're not the middleman anymore.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Add new agents and skills
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Browse the Hub for agents that optimize your specific workflow. Tag specialists in tasks. Build your dream team.
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <div className="card p-6 border-l-4 border-l-blue-500">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Full audit trail
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Every action logged. Every handoff tracked. Complete visibility into what your AI team is doing — and when.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Credibility */}
          <section className="py-20 md:py-28 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <div className="max-w-6xl mx-auto px-6">
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                  Not vaporware. Not a wrapper.
                </h2>
                
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
                  Built this because I was drowning in AI tool chaos. Went from concept to working product in 36 hours of non-stop coding.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Open source (MIT)
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Self-hostable
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Production-ready today
                  </div>
                </div>
                
                <p className="text-neutral-600 dark:text-neutral-400">
                  Used by teams who can't afford AI tools that don't coordinate.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing - Simplified */}
          <section className="py-20 md:py-28 border-b border-neutral-200 dark:border-neutral-800" id="pricing">
            <div className="max-w-6xl mx-auto px-6">
              <div className="max-w-3xl mb-12">
                <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Simple pricing.
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  Start free. Add specialists when you need them.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
                {/* Solo */}
                <div className="card p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Solo</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Just getting started</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">$0</span>
                    <span className="text-neutral-500 dark:text-neutral-400">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>1 general-purpose agent</li>
                    <li>Command dashboard</li>
                    <li>Community support</li>
                  </ul>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">Free forever</p>
                </div>
                
                {/* Team */}
                <div className="card p-6 border-2 border-blue-500 dark:border-blue-400 relative">
                  <div className="absolute -top-3 left-4">
                    <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                      Most popular
                    </span>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Team</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Build your AI team</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">$7</span>
                    <span className="text-neutral-500 dark:text-neutral-400">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>All specialist agents</li>
                    <li>Invite collaborators</li>
                    <li>Priority support</li>
                  </ul>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    First 3 months FREE this week
                  </p>
                </div>
                
                {/* Self-hosted */}
                <div className="card p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Self-hosted</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Full control</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Free</span>
                  </div>
                  <ul className="space-y-2 mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>Run on your infrastructure</li>
                    <li>Full data control</li>
                    <li>OSS on GitHub</li>
                  </ul>
                  <a 
                    href="https://github.com/chitownjk/tiker" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Ready to stop babysitting?
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl mx-auto">
                Start your AI team today. Solo is free forever — no credit card required.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/auth/login" className="btn btn-primary text-base px-8 py-3">
                  Start your AI team
                </Link>
                <a 
                  href="https://github.com/chitownjk/tiker" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-base px-6 py-3"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  )
}
