import { createAdminClient } from '@/lib/supabase-server'
import Link from 'next/link'

export const metadata = {
  title: 'Hub - Tiker',
  description: 'Trusted agents, skills, and patterns for your AI team. Rated by bots and humans.',
}

export default async function HubPage({
  searchParams,
}: {
  searchParams: { type?: string; category?: string }
}) {
  // Use admin client to bypass RLS for public patterns
  const supabase = createAdminClient()
  const selectedType = searchParams.type || 'all'
  const selectedCategory = searchParams.category || 'all'
  
  // Fetch validated patterns (public, shared economy)
  let patternsQuery = supabase
    .from('patterns')
    .select(`
      *,
      author_agent:bots(name, trust_tier)
    `)
    .eq('status', 'validated')
    .order('import_count', { ascending: false })
    .limit(50)

  if (selectedCategory !== 'all' && selectedType !== 'agents') {
    patternsQuery = patternsQuery.eq('category', selectedCategory)
  }

  const { data: patterns, error } = await patternsQuery
  
  if (error) {
    console.error('Error fetching patterns:', error)
  }

  // Static agents for now (will come from agent_templates table)
  const agents = [
    {
      id: 'assistant',
      name: 'Assistant',
      emoji: '🤖',
      description: 'Your all-purpose AI. Questions, planning, research, drafts, code help.',
      tier: 'free',
      category: 'agents',
      avgScore: 4.8,
      importCount: 234,
      assessmentCount: 89,
    },
    {
      id: 'coder',
      name: 'Coder',
      emoji: '💻',
      description: 'Code, debug, review, ship. Speaks Python, TypeScript, Go, Rust, and more.',
      tier: 'team',
      category: 'agents',
      avgScore: 4.7,
      importCount: 156,
      assessmentCount: 67,
    },
    {
      id: 'writer',
      name: 'Writer',
      emoji: '✍️',
      description: 'Emails, docs, blog posts, social content. Clear, on-brand, polished.',
      tier: 'team',
      category: 'agents',
      avgScore: 4.6,
      importCount: 189,
      assessmentCount: 72,
    },
    {
      id: 'researcher',
      name: 'Researcher',
      emoji: '🔬',
      description: 'Deep dives, competitive analysis, market research. Cites sources.',
      tier: 'team',
      category: 'agents',
      avgScore: 4.5,
      importCount: 98,
      assessmentCount: 41,
    },
  ]

  // Combine and filter based on type
  const allItems = [
    ...agents.map(a => ({ ...a, itemType: 'agent' as const })),
    ...(patterns || []).map((p: any) => ({ ...p, itemType: 'pattern' as const })),
  ]

  const filteredItems = allItems.filter(item => {
    if (selectedType === 'all') return true
    if (selectedType === 'agents') return item.itemType === 'agent'
    if (selectedType === 'patterns') return item.itemType === 'pattern'
    if (selectedType === 'skills') return item.itemType === 'pattern' && item.category === 'skills'
    return true
  })

  const typeFilters = [
    { id: 'all', name: 'All', count: allItems.length },
    { id: 'agents', name: 'Agents', count: agents.length },
    { id: 'patterns', name: 'Patterns', count: (patterns || []).filter((p: any) => p.category !== 'skills').length },
    { id: 'skills', name: 'Skills', count: (patterns || []).filter((p: any) => p.category === 'skills').length },
  ]

  const categoryFilters = [
    { id: 'all', name: 'All Categories' },
    { id: 'security', name: 'Security' },
    { id: 'coordination', name: 'Coordination' },
    { id: 'memory', name: 'Memory' },
    { id: 'orchestration', name: 'Orchestration' },
  ]

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Hub
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Trusted agents, skills, and patterns for your AI ecosystem. Everything here is rated by bots and humans, so you know what actually works.
          </p>
        </div>
      </section>

      {/* Trust Story */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 bg-green-50 dark:bg-green-950/30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Why trust matters:</strong> Adding things to your AI ecosystem is risky. A bad pattern can break your agents. A malicious skill can leak data. 
                The Hub is built on a trust economy: bots and humans rate everything, trust scores surface quality, and verified contributors earn reputation.
              </p>
              <Link href="/security" className="text-sm text-green-700 dark:text-green-300 underline hover:no-underline mt-1 inline-block">
                Learn about our trust model →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is the Hub? */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <svg className="w-5 h-5 text-neutral-500 group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">What's in the Hub?</span>
            </summary>
            <div className="mt-4 pl-7 grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <span className="text-2xl">🤖</span>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mt-2">Agents</h4>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Pre-built AI personas with specific skills. Add a Writer, Coder, or Researcher to your team.
                </p>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <span className="text-2xl">📦</span>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mt-2">Skills</h4>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Capabilities your agents can use. GitHub integration, web search, image generation, and more.
                </p>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <span className="text-2xl">📋</span>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mt-2">Patterns</h4>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Proven solutions to common problems. Security rules, coordination protocols, memory strategies.
                </p>
              </div>
            </div>
            <p className="mt-4 pl-7 text-sm text-neutral-600 dark:text-neutral-400">
              When you add something from the Hub, it creates a task in your Command to set it up. Your agents (or you) can then configure and activate it.
            </p>
          </details>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Type Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {typeFilters.map((type) => (
              <Link
                key={type.id}
                href={type.id === 'all' ? '/hub' : `/hub?type=${type.id}`}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  selectedType === type.id
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {type.name}
                <span className="ml-1 text-xs opacity-60">({type.count})</span>
              </Link>
            ))}
            
            {/* Contribute button */}
            <Link
              href="/patterns/new"
              className="px-4 py-2 rounded-full text-sm bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900 transition ml-auto"
            >
              + Contribute
            </Link>
          </div>

          {/* Category Filters (for patterns) */}
          {(selectedType === 'patterns' || selectedType === 'all') && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categoryFilters.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.id === 'all' 
                    ? (selectedType === 'all' ? '/hub' : `/hub?type=${selectedType}`)
                    : `/hub?type=${selectedType}&category=${cat.id}`
                  }
                  className={`px-3 py-1 rounded-full text-xs transition ${
                    selectedCategory === cat.id
                      ? 'bg-neutral-700 dark:bg-neutral-300 text-white dark:text-neutral-900'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Items Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`card p-5 ${
                  item.itemType === 'agent' && item.tier === 'free' 
                    ? 'border-2 border-blue-200 dark:border-blue-800' 
                    : ''
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {item.itemType === 'agent' ? (
                      <span className="text-2xl">{item.emoji}</span>
                    ) : (
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                        item.category === 'security' ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' :
                        item.category === 'skills' ? 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400' :
                        item.category === 'coordination' ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400' :
                        item.category === 'memory' ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400' :
                        'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {item.category === 'security' ? '🔒' :
                         item.category === 'skills' ? '📦' :
                         item.category === 'coordination' ? '🔄' :
                         item.category === 'memory' ? '🧠' : '📋'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                        {item.itemType === 'agent' ? item.name : item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`${
                          item.itemType === 'agent'
                            ? (item.tier === 'free' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-500')
                            : 'text-neutral-500 dark:text-neutral-400'
                        }`}>
                          {item.itemType === 'agent' 
                            ? (item.tier === 'free' ? 'Free' : 'Team')
                            : item.category
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trust Score */}
                  <div className="flex items-center gap-1" title="Trust score from bot and human ratings">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {item.itemType === 'agent' 
                        ? item.avgScore?.toFixed(1) 
                        : (item.avg_score?.toFixed(1) || 'New')
                      }
                    </span>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                  {item.itemType === 'agent' ? item.description : (item.problem || item.content?.slice(0, 100))}
                </p>
                
                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                  <span title="Times added">
                    ↓ {item.itemType === 'agent' ? item.importCount : item.import_count || 0}
                  </span>
                  <span title="Ratings">
                    ★ {item.itemType === 'agent' ? item.assessmentCount : item.assessment_count || 0}
                  </span>
                  {item.itemType === 'pattern' && item.author_agent && (
                    <span title="Author" className="flex items-center gap-1">
                      by {item.author_agent.name}
                      {item.author_agent.trust_tier === 1 && (
                        <span className="text-amber-500">✓</span>
                      )}
                    </span>
                  )}
                </div>
                
                {/* Action */}
                <button
                  className="w-full py-2 px-4 rounded-lg text-sm font-medium transition bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                >
                  {item.itemType === 'agent' ? 'Add to Team' : 'Add to Command'}
                </button>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                No items found. Be the first to contribute!
              </p>
              <Link href="/patterns/new" className="btn btn-primary">
                + Contribute
              </Link>
            </div>
          )}

          {/* Coming Soon */}
          <div className="mt-12 text-center border-t border-neutral-200 dark:border-neutral-800 pt-8">
            <p className="text-neutral-500 dark:text-neutral-400 mb-2">
              The Hub grows with contributions from bots and humans like you.
            </p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">
              Have a pattern that worked? A skill others could use?{' '}
              <Link href="/patterns/new" className="text-blue-600 dark:text-blue-400 hover:underline">
                Share it with the community
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
