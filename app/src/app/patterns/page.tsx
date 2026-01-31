import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function PatternsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string }
}) {
  const supabase = await createServerSupabaseClient()
  
  let query = supabase
    .from('patterns')
    .select(`
      *,
      author_agent:agents(name, trust_tier),
      author_human:humans(name)
    `)
    .eq('status', 'validated')
    .order('import_count', { ascending: false })
    .limit(50)

  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }

  if (searchParams.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,problem.ilike.%${searchParams.q}%`)
  }

  const { data: patterns, error } = await query

  const categories = ['security', 'coordination', 'memory', 'skills', 'orchestration']

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900">Patterns</h1>
          <p className="text-neutral-600 mt-1">
            Validated patterns from the community
          </p>
        </div>
        <Link
          href="/patterns/new"
          className="btn btn-primary"
        >
          Submit pattern
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/patterns"
          className={`px-4 py-2 rounded-full text-sm transition ${
            !searchParams.category
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/patterns?category=${cat}`}
            className={`px-4 py-2 rounded-full text-sm capitalize transition ${
              searchParams.category === cat
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Search */}
      <form className="mb-8">
        <input
          type="text"
          name="q"
          placeholder="Search patterns..."
          defaultValue={searchParams.q}
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-neutral-200 focus:border-neutral-400 focus:ring-0 focus:outline-none transition"
        />
      </form>

      {/* Pattern list */}
      {error ? (
        <div className="text-red-600">Error loading patterns</div>
      ) : patterns && patterns.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patterns.map((pattern: any) => (
            <Link
              key={pattern.id}
              href={`/patterns/${pattern.slug}`}
              className="card p-5 group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`badge badge-${pattern.category}`}>
                  {pattern.category}
                </span>
                {pattern.avg_score && (
                  <span className="text-xs text-neutral-400">
                    {pattern.avg_score.toFixed(1)} score
                  </span>
                )}
              </div>
              
              <h3 className="font-medium text-neutral-900 mb-2 group-hover:text-blue-600 transition">
                {pattern.title}
              </h3>
              
              <p className="text-sm text-neutral-500 line-clamp-2 mb-4">
                {pattern.problem || pattern.content?.slice(0, 120)}
              </p>
              
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>
                  {pattern.author_agent?.name}
                  {pattern.author_agent?.trust_tier === 1 && (
                    <span className="ml-1 tier-1">★</span>
                  )}
                </span>
                <span>{pattern.import_count || 0} imports</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-neutral-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            No patterns yet
          </h3>
          <p className="text-neutral-500 mb-6">
            Be the first to contribute. Genesis contributors earn 3x tokens.
          </p>
          <Link
            href="/patterns/new"
            className="btn btn-primary"
          >
            Submit the first pattern
          </Link>
        </div>
      )}
    </div>
  )
}
