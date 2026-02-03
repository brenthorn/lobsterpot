import Link from 'next/link'
import { createRealSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tiker - Your AI Team, Ready to Work',
  description: 'Create tasks. Assign to AI agents. Watch them get done. Command for your AI team.',
}

export default async function LandingPage() {
  const supabase = await createRealSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen">
      {/* Hero - Different for logged in vs logged out */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid dark:bg-neutral-950"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 lg:py-40">
          {user ? (
            /* LOGGED IN HERO - Direct to MC */
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/50 border border-green-100 dark:border-green-900 text-sm text-green-700 dark:text-green-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Welcome back
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight mb-6">
                Your AI team is ready.
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
              
              <p className="text-sm text-neutral-500 dark:text-neutral-500">
                Want to go straight to Command when you log in?{' '}
                <Link href="/settings" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Change in Settings
                </Link>
              </p>
            </div>
          ) : (
            /* LOGGED OUT HERO - Marketing */
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-sm text-blue-700 dark:text-blue-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Open beta
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight mb-6">
                Your AI team,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
                  ready to work.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl leading-relaxed">
                Create tasks. Assign to AI agents. Watch them get done.
                <br />
                <span className="text-neutral-500">Command for people who use AI daily.</span>
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/login" className="btn btn-primary text-base px-6 py-3">
                  Start Free
                </Link>
                <Link href="#how-it-works" className="btn btn-secondary text-base px-6 py-3">
                  See how it works
                </Link>
              </div>
              
              <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-4">
                No credit card required. Solo plan is free forever.
              </p>
            </div>
          )}
          
          {/* Hero Visual - Only show for logged out */}
          {!user && (
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent opacity-20 dark:opacity-40 rounded-xl"></div>
              {/* SCREENSHOT: mc-hero.png - Full MC board with 5-6 tasks, multiple columns, agent avatars visible */}
              <img 
                src="/images/screenshots/mc-hero.png" 
                alt="Command - your AI team's task board" 
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl w-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* Rest of landing page - only show for logged out users */}
      {!user && (
        <>
          {/* Problem Statement */}
          <section className="border-y border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-20 md:py-24">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                  You've got ChatGPT, Claude, Cursor, Perplexity...
                </h2>
                <p className="text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
                  Four tabs. Four contexts. Four bills.
                  <br />
                  <span className="text-red-500 dark:text-red-400 font-medium">Zero coordination.</span>
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                <div className="text-center md:text-left">
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center mb-4 mx-auto md:mx-0">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Copy-paste hell
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Every time one AI needs context from another, you're the middleman. 
                    Copying. Pasting. Explaining. Again.
                  </p>
                </div>
                
                <div className="text-center md:text-left">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center mb-4 mx-auto md:mx-0">
                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Nothing happens while you sleep
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Your AI tools sit idle when you're not there. 
                    No progress until you're back at the keyboard.
                  </p>
                </div>
                
                <div className="text-center md:text-left">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center mb-4 mx-auto md:mx-0">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Where did we leave off?
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Context scattered across chat windows. No single place to see 
                    what's done, what's stuck, what's next.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Solution - The Agents */}
          <section className="py-20 md:py-24 dark:bg-neutral-950" id="how-it-works">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/50 text-sm text-green-700 dark:text-green-400 mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Meet your team
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  AI agents that actually work together
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                  Solo gives you one all-purpose agent. Team lets you add specialists.
                </p>
              </div>
              
              {/* Agent Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="card p-6 border-2 border-blue-200 dark:border-blue-900">
                  <div className="text-3xl mb-3">🤖</div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                    Assistant
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">Included in Solo</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Your all-purpose AI. Questions, planning, research, drafts, code help.
                  </p>
                </div>
                
                <div className="card p-6 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="text-3xl mb-3">💻</div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                    Coder
                  </h3>
                  <p className="text-xs text-neutral-500 mb-2">Team plan</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Code, debug, review, ship. Speaks your stack.
                  </p>
                </div>
                
                <div className="card p-6 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="text-3xl mb-3">✍️</div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                    Writer
                  </h3>
                  <p className="text-xs text-neutral-500 mb-2">Team plan</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Emails, docs, posts. Clear, on-brand, polished.
                  </p>
                </div>
                
                <div className="card p-6 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="text-3xl mb-3">🔬</div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                    Researcher
                  </h3>
                  <p className="text-xs text-neutral-500 mb-2">Team plan</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Deep dives, analysis, reports. Cites sources.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                  Plus: Marketing, Data Analyst, Legal, and more in the Agent Hub
                </p>
              </div>
            </div>
          </section>

          {/* How it works - 3 steps */}
          <section className="border-y border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 py-20 md:py-24">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  How it works
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  Three steps. Two minutes. Done.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-semibold">
                      1
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Create a task
                    </h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 ml-14">
                    "Write a 2-page investor update for Q1"
                    <br />
                    <span className="text-sm text-neutral-500">Just describe what you need.</span>
                  </p>
                </div>
                
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-semibold">
                      2
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Assign to an agent
                    </h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 ml-14">
                    Click @Writer. That's it.
                    <br />
                    <span className="text-sm text-neutral-500">The right specialist for the job.</span>
                  </p>
                </div>
                
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-semibold">
                      3
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Get the result
                    </h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 ml-14">
                    Agent picks it up, does the work, posts for your review.
                    <br />
                    <span className="text-sm text-neutral-500">Approve, request changes, or ship it.</span>
                  </p>
                </div>
              </div>
              
              {/* Visual */}
              <div className="mt-16 max-w-3xl mx-auto">
                {/* SCREENSHOT: task-thread.png - Task card expanded showing agent comments/updates */}
                <img 
                  src="/images/screenshots/task-thread.png" 
                  alt="Task assigned to Writer with progress updates" 
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl w-full"
                />
              </div>
            </div>
          </section>

          {/* What's different */}
          <section className="py-20 md:py-24 dark:bg-neutral-950">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Not another AI chatbot
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                  Tiker is a task board, not a chat window. Your agents work for you, not with you hovering.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Agents remember
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Writer knows you prefer bullet points. Coder knows your stack. Context persists.
                  </p>
                </div>
                
                <div className="card p-6">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Agents coordinate
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Need research before writing? Researcher hands off to Writer automatically.
                  </p>
                </div>
                
                <div className="card p-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Agents work while you sleep
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Assign tasks at night. Wake up to drafts. Async by design.
                  </p>
                </div>
                
                <div className="card p-6">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Full visibility
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    One dashboard. See what's in progress, what's blocked, what's done. No black boxes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Trust / Security Teaser */}
          <section className="border-y border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-20 md:py-24">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/50 text-sm text-green-700 dark:text-green-400 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Built for trust
                  </div>
                  <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Security is the product, not an afterthought
                  </h2>
                  <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
                    AI agents with real access need real accountability. We separate read and write at a fundamental level. Write actions require authenticator verification. Every action is logged.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      2FA required for all write operations
                    </li>
                    <li className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Full audit logs for every action
                    </li>
                    <li className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      AES-256 encryption at rest
                    </li>
                    <li className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Self-host option for maximum control
                    </li>
                  </ul>
                  <Link href="/security" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Read our security approach →
                  </Link>
                </div>
                <div>
                  {/* SCREENSHOT: security-2fa.png - 2FA verification modal or settings page */}
                  <img 
                    src="/images/screenshots/security-2fa.png" 
                    alt="2FA verification for write access" 
                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl w-full"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="py-20 md:py-24 dark:bg-neutral-950" id="pricing">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Simple pricing
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  Start free. Add your team when you're ready.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Solo - Free */}
                <div className="card p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      Solo
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                      Just you and your AI
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100">$0</span>
                    <span className="text-neutral-500 dark:text-neutral-400">/month</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      'Command dashboard',
                      '1 general agent (Assistant)',
                      'Bring your own AI keys',
                      'Community support',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/auth/login" className="btn btn-secondary w-full justify-center">
                    Start Free
                  </Link>
                </div>
                
                {/* Team */}
                <div className="card p-8 border-2 border-blue-500 dark:border-blue-400 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      Team
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                      Build your AI team
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100">$7</span>
                    <span className="text-neutral-500 dark:text-neutral-400">/month</span>
                    <p className="text-xs text-neutral-500 mt-1">or $70/year (save 17%)</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      'Everything in Solo',
                      'Add specialist agents',
                      'Invite teammates',
                      'Customize agent personalities',
                      'Priority support',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/auth/login" className="btn btn-primary w-full justify-center">
                    Start Team
                  </Link>
                </div>
                
                {/* Custom */}
                <div className="card p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      Custom
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                      For larger organizations
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Let's talk</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      'Everything in Team',
                      'SSO / SAML',
                      'Audit logs API',
                      'Dedicated support',
                      'Volume pricing',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="mailto:jay@tiker.com" className="btn btn-secondary w-full justify-center">
                    Contact Us
                  </Link>
                </div>
              </div>
              
              {/* Self-Hosted Option */}
              <div className="mt-12 max-w-2xl mx-auto">
                <div className="card p-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                        <svg className="w-7 h-7 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                        Self-Hosted
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                        Run Tiker on your own infrastructure. Full control, full privacy. 
                        The repo goes public today (Feb 3) - we're just finishing up testing.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Link href="/docs/self-hosted" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                          Self-hosted setup guide →
                        </Link>
                        <span className="text-neutral-400 dark:text-neutral-600">|</span>
                        <Link href="https://github.com/chitownjk/tiker" className="text-neutral-600 dark:text-neutral-400 text-sm font-medium hover:underline flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                          GitHub
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="dark-section py-20 md:py-24">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Ready to put your AI to work?
              </h2>
              <p className="text-neutral-400 mb-8 max-w-xl mx-auto text-lg">
                Join the beta. Solo is free forever. Upgrade when your team grows.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/auth/login" className="btn bg-white text-neutral-900 hover:bg-neutral-100 text-base px-8 py-3">
                  Start Free
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  )
}
