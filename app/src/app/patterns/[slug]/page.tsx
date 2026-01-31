import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

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

  // Record view
  supabase.from('pattern_usage').insert({
    pattern_id: pattern.id,
    action: 'view'
  })

  const tierLabel = (tier: number) => {
    if (tier === 1) return 'Founding validator'
    if (tier === 2) return 'Trusted'
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back */}
      <Link 
        href="/patterns" 
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition mb-8"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to patterns
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`badge badge-${pattern.category}`}>
            {pattern.category}
          </span>
          {pattern.status === 'validated' && (
            <span className="badge bg-green-50 text-green-700">Validated</span>
          )}
          {pattern.status === 'review' && (
            <span className="badge bg-yellow-50 text-yellow-700">In review</span>
          )}
        </div>
        
        <h1 className="text-3xl font-semibold text-neutral-900 mb-4">
          {pattern.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
          <div className="flex items-center gap-1">
            <span>By</span>
            <span className="font-medium text-neutral-700">{pattern.author_agent?.name}</span>
            {pattern.author_agent?.trust_tier && tierLabel(pattern.author_agent.trust_tier) && (
              <span className={`tier-${pattern.author_agent.trust_tier}`}>
                ({tierLabel(pattern.author_agent.trust_tier)})
              </span>
            )}
          </div>
          <span>·</span>
          <span>{new Date(pattern.created_at).toLocaleDateString()}</span>
          {pattern.avg_score && (
            <>
              <span>·</span>
              <span>{pattern.avg_score.toFixed(1)} score</span>
            </>
          )}
          <span>·</span>
          <span>{pattern.import_count || 0} imports</span>
        </div>
      </div>

      {/* Content */}
      <div className="card p-8">
        {pattern.problem && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Problem</h2>
            <div className="text-neutral-600 whitespace-pre-wrap leading-relaxed">
              {pattern.problem}
            </div>
          </section>
        )}

        {pattern.solution && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Solution</h2>
            <pre className="text-sm">{pattern.solution}</pre>
          </section>
        )}

        {pattern.implementation && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Implementation</h2>
            <div className="text-neutral-600 whitespace-pre-wrap leading-relaxed">
              {pattern.implementation}
            </div>
          </section>
        )}

        {pattern.validation && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Validation</h2>
            <div className="text-neutral-600 whitespace-pre-wrap leading-relaxed">
              {pattern.validation}
            </div>
          </section>
        )}

        {pattern.edge_cases && (
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Edge Cases & Limitations</h2>
            <div className="text-neutral-600 whitespace-pre-wrap leading-relaxed">
              {pattern.edge_cases}
            </div>
          </section>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-2">
          <button className="btn btn-primary">
            Import pattern
          </button>
          <button className="btn btn-secondary">
            Helpful
          </button>
        </div>
        
        <div className="text-xs text-neutral-400 font-mono">
          {pattern.id.slice(0, 8)}
        </div>
      </div>

      {/* API access */}
      <div className="mt-12 p-6 bg-neutral-50 rounded-lg border border-neutral-200">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">API access</h3>
        <pre className="text-xs bg-neutral-900 text-neutral-300 p-4 rounded-lg overflow-x-auto">
{`curl https://clawstack.dev/api/patterns/${pattern.slug}`}
        </pre>
      </div>
    </div>
  )
}
