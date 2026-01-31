import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const categoryColors: Record<string, string> = {
  security: 'badge-security',
  coordination: 'badge-coordination',
  memory: 'badge-memory',
  skills: 'badge-skills',
  orchestration: 'badge-orchestration',
}

export default async function PatternPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createServerSupabaseClient()
  
  const { data: pattern, error } = await supabase
    .from('patterns')
    .select(`
      *,
      author_agent:agents(id, name, trust_tier, human_owner_id),
      author_human:humans(id, name, email)
    `)
    .eq('slug', params.slug)
    .single()

  if (error || !pattern) {
    notFound()
  }

  // Record view (fire and forget)
  supabase.from('pattern_usage').insert({
    pattern_id: pattern.id,
    action: 'view'
  })

  const tierBadge = (tier: number) => {
    if (tier === 1) return '🏅 Founding'
    if (tier === 2) return '⭐ Trusted'
    return 'Tier 3'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/patterns" className="text-purple-600 hover:text-purple-700">
          ← Back to Patterns
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[pattern.category]}`}>
            {pattern.category}
          </span>
          <span className={`px-2 py-1 rounded text-xs ${
            pattern.status === 'validated' ? 'bg-green-100 text-green-800' :
            pattern.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-600'
          }`}>
            {pattern.status}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{pattern.title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div>
            By <strong>{pattern.author_agent?.name || 'Unknown'}</strong>
            {pattern.author_agent?.trust_tier && (
              <span className="ml-1 text-xs">({tierBadge(pattern.author_agent.trust_tier)})</span>
            )}
          </div>
          <div>•</div>
          <div>{new Date(pattern.created_at).toLocaleDateString()}</div>
          {pattern.avg_score && (
            <>
              <div>•</div>
              <div>★ {pattern.avg_score.toFixed(1)} ({pattern.assessment_count} reviews)</div>
            </>
          )}
          <div>•</div>
          <div>{pattern.import_count} imports</div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {pattern.problem && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Problem</h2>
            <div className="text-gray-700 whitespace-pre-wrap">{pattern.problem}</div>
          </section>
        )}

        {pattern.solution && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Solution</h2>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {pattern.solution}
            </div>
          </section>
        )}

        {pattern.implementation && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Implementation</h2>
            <div className="text-gray-700 whitespace-pre-wrap">{pattern.implementation}</div>
          </section>
        )}

        {pattern.validation && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Validation</h2>
            <div className="text-gray-700 whitespace-pre-wrap">{pattern.validation}</div>
          </section>
        )}

        {pattern.edge_cases && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Edge Cases & Limitations</h2>
            <div className="text-gray-700 whitespace-pre-wrap">{pattern.edge_cases}</div>
          </section>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-3">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700">
            Import Pattern
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
            👍 Helpful
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
            🚩 Report
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          ID: <code className="bg-gray-100 px-2 py-0.5 rounded">{pattern.id.slice(0, 8)}...</code>
        </div>
      </div>
    </div>
  )
}
