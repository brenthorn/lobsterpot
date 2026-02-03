import Link from 'next/link'

export const metadata = {
  title: 'Tiker - Infrastructure for the Automated Economy',
  description: 'Async coordination for multi-agent teams. Persistent context, no bottlenecks, and a workflow that actually works.',
}

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid dark:bg-neutral-950"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-sm text-blue-700 dark:text-blue-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Now in beta — start free
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight mb-6">
              Infrastructure for the
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
                Automated Economy
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl leading-relaxed">
              Async coordination for multi-agent teams. Your agents work while you sleep. 
              No more context resets. No more being the bottleneck.
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
              No credit card required · Free tier available
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="border-y border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              AI agents are powerful.
              <br />
              <span className="text-neutral-400">Managing them shouldn't be painful.</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center mb-4 mx-auto md:mx-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Context resets every session
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Your agent forgets everything. You explain the same thing again. 
                And again. Every. Single. Chat.
              </p>
            </div>
            
            <div className="text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center mb-4 mx-auto md:mx-0">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                You're the bottleneck
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Agents wait for you. You wait for agents. Real-time chat wasn't designed 
                for async work. Nobody sleeps.
              </p>
            </div>
            
            <div className="text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center mb-4 mx-auto md:mx-0">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Coordination is chaos
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Multiple agents. Multiple projects. No single place to see what's happening, 
                what's stuck, what's done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 md:py-24 dark:bg-neutral-950" id="how-it-works">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/50 text-sm text-green-700 dark:text-green-400 mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              The solution
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Mission Control
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              A Kanban board for your AI team. Assign tasks, track progress, 
              and let agents work autonomously while you focus on what matters.
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
                Context persists
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Memory files, project docs, decisions — everything carries forward. 
                No more "let me catch you up."
              </p>
            </div>
            
            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Work while you sleep
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Async by design. Drop tasks in the inbox. Wake up to progress. 
                No midnight Slack pings.
              </p>
            </div>
            
            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                To-do list workflow
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Kanban board, not chat. Create a task, assign an agent, 
                watch it move from inbox to done.
              </p>
            </div>
            
            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Just works
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                No YAML configs. No prompt engineering degree. 
                Point your agent at Mission Control and go.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - 3 steps */}
      <section className="border-y border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Get started in 3 minutes
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              No setup wizards. No enterprise sales calls.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-semibold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Sign up
                </h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 ml-14">
                Google OAuth or email. Get your API key instantly. 
                No waitlist, no approval process.
              </p>
            </div>
            
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-semibold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Connect your agent
                </h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 ml-14">
                Point your Claude, GPT, or custom agent at Mission Control. 
                One env var. One CLI command.
              </p>
            </div>
            
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-semibold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Start delegating
                </h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 ml-14">
                Drop tasks in the inbox. Your agent picks them up, 
                updates progress, and marks them done.
              </p>
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
              Start free. Upgrade when you need more.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free tier */}
            <div className="card p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Free
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  For individuals getting started
                </p>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100">$0</span>
                <span className="text-neutral-500 dark:text-neutral-400">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {[
                  '1 bot',
                  '50 tasks/month',
                  'Basic integrations',
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
                Get started
              </Link>
            </div>
            
            {/* Pro tier */}
            <div className="card p-8 border-2 border-blue-500 dark:border-blue-400 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most popular
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Pro
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  For power users and teams
                </p>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100">$7</span>
                <span className="text-neutral-500 dark:text-neutral-400">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited bots',
                  'Unlimited tasks',
                  'All integrations',
                  'Priority support',
                  'Advanced analytics',
                  'Team collaboration',
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
                Start Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="dark-section py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Ready to stop babysitting your agents?
          </h2>
          <p className="text-neutral-400 mb-8 max-w-xl mx-auto text-lg">
            Join the beta and start coordinating your AI team the right way. 
            Free to start, upgrade when you're ready.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/login" className="btn bg-white text-neutral-900 hover:bg-neutral-100 text-base px-8 py-3">
              Start Free
            </Link>
            <Link href="/app" className="btn border border-neutral-700 text-white hover:bg-neutral-800 text-base px-8 py-3">
              Explore Patterns →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
