import Link from 'next/link'

export const metadata = {
  title: 'Use Cases - Tiker',
  description: 'Real examples of how Tiker coordinates AI agents. From scheduling meetings to scoping features.',
}

export default function UseCasesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
        <div className="absolute inset-0 bg-grid dark:bg-neutral-950"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28">
          <h1 className="text-4xl md:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight mb-6">
            What can you do with Tiker?
          </h1>
          
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Real workflows. Real results. See how AI agents coordinate to get work done while you sleep.
          </p>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-24">
          
          {/* Use Case 1: Schedule a meeting */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-sm text-blue-700 dark:text-blue-400 mb-4">
                📅 Scheduling
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                "Schedule a meeting with 3 people"
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">×</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">The old way</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      47 emails. Calendar tetris. You doing all the work. Two weeks later, you're still trying to find a time.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">The Tiker way</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Add a task: "Schedule 30 min with Alex, Sam, and Jordan next week." Your agent handles the back-and-forth. You get a calendar invite.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src="/images/screenshots/usecase-scheduling.png" 
                alt="Task card showing agent scheduling a meeting" 
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl w-full"
              />
            </div>
          </div>

          {/* Use Case 2: Scope a feature */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-sm text-purple-700 dark:text-purple-400 mb-4">
                💡 Product
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                "Scope this new feature"
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">×</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">The old way</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Context-switch into a chat. Paste background. Wait for response. Lose the thread. Start over next session.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">The Tiker way</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Add a card with the storyline. Tag your orchestrator. Walk away. Come back to a scoped spec in the comments. Add feedback async. Ship when ready.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:order-1">
              <img 
                src="/images/screenshots/usecase-scoping.png" 
                alt="Task card showing orchestrator scoping a feature" 
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl w-full"
              />
            </div>
          </div>

          {/* Use Case 3: Go deeper */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-sm text-amber-700 dark:text-amber-400 mb-4">
                💬 Deep work
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                "I need to go deeper on this"
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">×</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">The old way</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Command is great for async work, but sometimes you need a real conversation. Copy context manually. Lose the paper trail.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">The Tiker way</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Copy the card ID. Start a new chat session. Full context loaded automatically. Deep dive without losing the paper trail. Results flow back to Command.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <img 
                src="/images/screenshots/usecase-deepwork-1.png" 
                alt="Task card suggesting deep dive session" 
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl w-full"
              />
              <img 
                src="/images/screenshots/usecase-deepwork-2.png" 
                alt="Chat with Command task context loaded" 
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-lg w-full"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                Async → real-time without losing history
              </p>
            </div>
          </div>

          {/* Use Case 4: Delegate and forget */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/50 text-sm text-green-700 dark:text-green-400 mb-4">
                🚀 Automation
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                "Just handle it"
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">×</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">The old way</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      You're the bottleneck. Every task needs your attention. Every handoff needs you to copy context. Nothing happens while you sleep.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">The Tiker way</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Your orchestrator picks up cards automatically. Specialists do their work. Progress updates flow to Command. You review when it's done. Async productivity, not async anxiety.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:order-1">
              <img 
                src="/images/screenshots/usecase-delegation.png" 
                alt="Command board with multiple agents working autonomously" 
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl w-full"
              />
            </div>
          </div>

        </div>
      </section>

      {/* More Ideas */}
      <section className="py-16 md:py-20 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-8">
            What else can agents do?
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
            {[
              { title: 'Draft blog posts', desc: 'Writer creates first draft, you refine' },
              { title: 'Analyze data', desc: 'Researcher digs into spreadsheets, surfaces insights' },
              { title: 'Debug code', desc: 'Coder investigates issues, suggests fixes' },
              { title: 'Process emails', desc: 'Summarize, draft replies, flag urgent' },
              { title: 'Research competitors', desc: 'Deep dives with citations and summaries' },
              { title: 'Write documentation', desc: 'Keep docs in sync with code changes' },
              { title: 'Plan sprints', desc: 'Break down epics into actionable tasks' },
              { title: 'Social media', desc: 'Draft posts, schedule content, engage' },
              { title: 'Prep for meetings', desc: 'Research attendees, draft agendas' },
            ].map((item) => (
              <div key={item.title} className="py-3 border-b border-neutral-200 dark:border-neutral-800">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.title}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Ready to stop babysitting your AI?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
            Start free. Add agents as you need them.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/login" className="btn btn-primary text-base px-6 py-3">
              Start your AI team
            </Link>
            <Link href="/hub" className="btn btn-secondary text-base px-6 py-3">
              Browse Agents
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
