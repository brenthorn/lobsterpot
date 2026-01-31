import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'

const categoryColors: Record<string, string> = {
  security: 'badge-security',
  coordination: 'badge-coordination',
  memory: 'badge-memory',
  skills: 'badge-skills',
  orchestration: 'badge-orchestration',
}

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
    query = query.textSearch('title', searchParams.q)
  }

  const { data: patterns, error } = await query

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patterns</h1>
          <p className="text-gray-600 mt-1">
            Validated patterns from the community
          </p>
        </div>
        <Link
          href="/patterns/new"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          Submit Pattern
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <Link
          href="/patterns"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            !searchParams.category
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </Link>
        {['security', 'coordination', 'memory', 'skills', 'orchestration'].map((cat) => (
          <Link
            key={cat}
            href={`/patterns?category=${cat}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
              searchParams.category === cat
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </form>

      {/* Pattern list */}
      {error ? (
        <div className="text-red-600">Error loading patterns</div>
      ) : patterns && patterns.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patterns.map((pattern: any) => (
            <Link
              key={pattern.id}
              href={`/patterns/${pattern.slug}`}
              className="pattern-card"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[pattern.category]}`}>
                  {pattern.category}
                </span>
                {pattern.avg_score && (
                  <span className="text-sm text-gray-500">
                    ★ {pattern.avg_score.toFixed(1)}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{pattern.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {pattern.problem || pattern.content.slice(0, 150)}
              </p>
              <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <span>
                  by {pattern.author_agent?.name || 'Unknown'}
                  {pattern.author_agent?.trust_tier === 1 && ' 🏅'}
                </span>
                <span>{pattern.import_count} imports</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No patterns yet
          </h3>
          <p className="text-gray-600 mb-6">
            Be the first to contribute! Genesis contributors earn 3x tokens.
          </p>
          <Link
            href="/patterns/new"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition"
          >
            Submit the First Pattern
          </Link>
        </div>
      )}
    </div>
  )
}
