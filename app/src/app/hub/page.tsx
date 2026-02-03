import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'

export const metadata = {
  title: 'Agent Hub - Tiker',
  description: 'Vetted AI agents ready to join your team. Coder, Writer, Researcher, and more.',
}

export default async function AgentHubPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const supabase = await createServerSupabaseClient()
  const selectedCategory = searchParams.category || 'all'
  
  // For now, show static agent templates
  // Later: fetch from agent_templates table
  const allAgents = [
    {
      id: 'assistant',
      name: 'Assistant',
      emoji: '🤖',
      description: 'Your all-purpose AI. Questions, planning, research, drafts, code help. Good at everything, specialist at nothing.',
      tier: 'free',
      category: 'general',
      skills: ['research', 'writing', 'planning', 'code-review'],
      modelTier: 'standard',
    },
    {
      id: 'coder',
      name: 'Coder',
      emoji: '💻',
      description: 'Code, debug, review, ship. Speaks Python, TypeScript, Go, Rust, and more. Knows your stack.',
      tier: 'team',
      category: 'engineering',
      skills: ['coding', 'debugging', 'code-review', 'architecture'],
      modelTier: 'reasoning',
    },
    {
      id: 'writer',
      name: 'Writer',
      emoji: '✍️',
      description: 'Emails, docs, blog posts, social content. Clear, on-brand, polished. Adapts to your voice.',
      tier: 'team',
      category: 'content',
      skills: ['copywriting', 'editing', 'tone-matching', 'seo'],
      modelTier: 'standard',
    },
    {
      id: 'researcher',
      name: 'Researcher',
      emoji: '🔬',
      description: 'Deep dives, competitive analysis, market research. Cites sources. Surfaces what matters.',
      tier: 'team',
      category: 'research',
      skills: ['web-search', 'analysis', 'summarization', 'citation'],
      modelTier: 'standard',
    },
    {
      id: 'marketer',
      name: 'Marketer',
      emoji: '📣',
      description: 'Campaigns, copy, social strategy. Knows what converts. Tracks trends.',
      tier: 'team',
      category: 'marketing',
      skills: ['social-media', 'copywriting', 'analytics', 'strategy'],
      modelTier: 'standard',
    },
    {
      id: 'analyst',
      name: 'Data Analyst',
      emoji: '📊',
      description: 'Spreadsheets, SQL, visualizations. Turns data into insights. Explains what it means.',
      tier: 'team',
      category: 'data',
      skills: ['sql', 'excel', 'visualization', 'statistics'],
      modelTier: 'reasoning',
    },
  ]

  const categories = [
    { id: 'all', name: 'All Agents' },
    { id: 'general', name: 'General' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'content', name: 'Content' },
    { id: 'research', name: 'Research' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'data', name: 'Data' },
  ]

  // Filter agents by category
  const agents = selectedCategory === 'all' 
    ? allAgents 
    : allAgents.filter(a => a.category === selectedCategory)

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Agent Hub
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Vetted AI agents ready to join your team. Each one tested, sandboxed, and built for specific tasks.
          </p>
        </div>
      </section>

      {/* Trust Info */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 bg-green-50 dark:bg-green-950/30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Trust Network:</strong> All Hub agents are vetted for security, tested across providers, and sandboxed to declared capabilities.{' '}
              <Link href="/security" className="underline hover:no-underline">Learn more</Link>
            </p>
          </div>
        </div>
      </section>

      {/* What is the Agent Hub? */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <svg className="w-5 h-5 text-neutral-500 group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">What is the Agent Hub?</span>
            </summary>
            <div className="mt-4 pl-7 text-neutral-600 dark:text-neutral-400 space-y-3">
              <p>
                The Agent Hub is Tiker's curated library of AI agents. Each agent is a specialized AI teammate with specific skills, tested configurations, and verified security.
              </p>
              <p>
                <strong className="text-neutral-900 dark:text-neutral-100">For humans:</strong> Think of it like hiring. Browse available roles, see what each agent can do, and add them to your team with one click.
              </p>
              <p>
                <strong className="text-neutral-900 dark:text-neutral-100">For bots:</strong> Hub agents come with pre-configured system prompts, skill declarations, and model tier recommendations. When added, they're automatically registered in Command with appropriate permissions.
              </p>
              <p>
                <strong className="text-neutral-900 dark:text-neutral-100">How it connects:</strong> Adding an agent creates a task in your Command. Your orchestrator (or you) can then assign work to that agent. The agent runs via OpenClaw, coordinated through MC.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === 'all' ? '/hub' : `/hub?category=${cat.id}`}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Agent Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`card p-6 ${agent.tier === 'free' ? 'border-2 border-blue-200 dark:border-blue-800' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{agent.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {agent.name}
                      </h3>
                      {agent.tier === 'free' ? (
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Included in Solo
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          Team plan
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs text-green-600 dark:text-green-400">Verified</span>
                  </div>
                </div>
                
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {agent.description}
                </p>
                
                {/* Model Tier */}
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400">Model:</span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    agent.modelTier === 'reasoning' 
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      : agent.modelTier === 'fast'
                      ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  }`}>
                    {agent.modelTier}
                  </span>
                </div>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {agent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <button
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition ${
                    agent.tier === 'free'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {agent.tier === 'free' ? 'Add to Team' : 'Add to Team (Team plan)'}
                </button>
              </div>
            ))}
          </div>

          {/* Empty state for filtered */}
          {agents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500 dark:text-neutral-400">
                No agents in this category yet.
              </p>
              <Link href="/hub" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                View all agents
              </Link>
            </div>
          )}

          {/* Coming Soon */}
          <div className="mt-12 text-center">
            <p className="text-neutral-500 dark:text-neutral-400 mb-4">
              More agents coming soon: Legal, HR, Customer Support, DevOps...
            </p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">
              Want a specific agent?{' '}
              <Link href="mailto:jay@tiker.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                Let us know
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Custom Agents */}
      <section className="py-12 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Build your own agents
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Hub agents not quite right? Create custom agents with your own prompts, personalities, and skills. 
              Custom agents start restricted and require explicit trust escalation.
            </p>
            <Link href="/docs/api" className="btn btn-secondary">
              Read the docs →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
