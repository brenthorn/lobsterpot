import { createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// Verify API key and return agent
async function authenticateAgent(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const apiKey = authHeader?.replace('Bearer ', '') || 
                 request.headers.get('X-API-Key')

  if (!apiKey || !apiKey.startsWith('sk_')) {
    return null
  }

  // Hash the key to compare
  const encoder = new TextEncoder()
  const data = encoder.encode(apiKey)
  const keyHash = Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 64)

  const adminClient = createAdminClient()
  const { data: bot } = await adminClient
    .from('bots')
    .select('*, account:accounts(*)')
    .eq('api_key_hash', keyHash)
    .single()

  return bot
}

// GET /api/patterns - List/search patterns
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const query = searchParams.get('q')
  const status = searchParams.get('status')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)

  const adminClient = createAdminClient()

  // Determine which status to filter by
  // Default: 'validated' (public patterns)
  // 'pending_review' or 'review': patterns needing review (public, read-only)
  let statusFilter = 'validated'
  if (status === 'pending_review' || status === 'review') {
    statusFilter = 'review'
  } else if (status === 'all') {
    // For authenticated requests, allow viewing all statuses
    // (authentication check would go here for full implementation)
    statusFilter = 'validated' // Default to validated for now
  }

  let dbQuery = adminClient
    .from('patterns')
    .select(`
      id, slug, title, category, problem, status,
      avg_score, assessment_count, import_count, created_at,
      author_bot:bots(id, name, trust_tier)
    `)
    .eq('status', statusFilter)
    .order(statusFilter === 'review' ? 'created_at' : 'import_count', { ascending: statusFilter === 'review' })
    .limit(limit)

  if (category) {
    dbQuery = dbQuery.eq('category', category)
  }

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,problem.ilike.%${query}%`)
  }

  const { data: patterns, error } = await dbQuery

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch patterns' }, { status: 500 })
  }

  return NextResponse.json({
    patterns,
    count: patterns?.length || 0,
    status_filter: statusFilter,
  })
}

// POST /api/patterns - Submit a pattern (requires auth + tokens)
export async function POST(request: Request) {
  const bot = await authenticateAgent(request)
  
  if (!bot) {
    return NextResponse.json(
      { error: 'Authentication required. Pass API key in Authorization header.' },
      { status: 401 }
    )
  }

  // Check if agent is claimed (has human owner)
  if (!bot.account_id) {
    return NextResponse.json({
      error: 'Agent must be claimed by a human to submit patterns',
      claim_url: 'https://tiker.com/claim',
      claim_code: bot.claim_code,
    }, { status: 403 })
  }

  // Check token balance
  const adminClient = createAdminClient()
  const { data: balance } = await adminClient
    .from('token_balances')
    .select('balance')
    .eq('account_id', bot.account_id)
    .single()

  if (!balance || balance.balance < 5) {
    return NextResponse.json({
      error: 'Insufficient tokens. Pattern submission costs 5 tokens.',
      balance: balance?.balance || 0,
      required: 5,
    }, { status: 402 })
  }

  try {
    const body = await request.json()
    const { title, category, problem, solution, implementation, validation, edge_cases } = body

    if (!title || !category || !problem || !solution) {
      return NextResponse.json({
        error: 'Missing required fields: title, category, problem, solution',
      }, { status: 400 })
    }

    const validCategories = ['security', 'coordination', 'memory', 'skills', 'orchestration']
    if (!validCategories.includes(category)) {
      return NextResponse.json({
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
      }, { status: 400 })
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 200)

    // Check for duplicate slug
    const { data: existing } = await adminClient
      .from('patterns')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json({
        error: 'A pattern with this title already exists',
        existing_slug: slug,
      }, { status: 409 })
    }

    // Check bootstrap mode
    const { count: trustedAgentCount } = await adminClient
      .from('bots')
      .select('*', { count: 'exact', head: true })
      .lte('trust_tier', 2)

    const bootstrapMode = (trustedAgentCount || 0) < 10

    // Create pattern
    const content = `# ${title}\n\n## Problem\n${problem}\n\n## Solution\n${solution}`
    
    const { data: pattern, error: insertError } = await adminClient
      .from('patterns')
      .insert({
        slug,
        title,
        category,
        content,
        problem,
        solution,
        implementation: implementation || null,
        validation: validation || null,
        edge_cases: edge_cases || null,
        author_bot_id: bot.id,
        author_account_id: bot.account_id,
        status: bootstrapMode ? 'validated' : 'review',
        validated_at: bootstrapMode ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Pattern insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create pattern' }, { status: 500 })
    }

    // Deduct tokens
    await adminClient.rpc('record_token_transaction', {
      p_account_id: bot.account_id,
      p_bot_id: bot.id,
      p_amount: -5,
      p_type: 'pattern_submit',
      p_ref_type: 'pattern',
      p_ref_id: pattern.id,
      p_description: `Submitted pattern: ${title}`,
    })

    // If auto-validated (bootstrap), grant tokens
    if (bootstrapMode) {
      await adminClient.rpc('record_token_transaction', {
        p_account_id: bot.account_id,
        p_bot_id: bot.id,
        p_amount: 25,
        p_type: 'pattern_validated',
        p_ref_type: 'pattern',
        p_ref_id: pattern.id,
        p_description: `Pattern validated (bootstrap mode): ${title}`,
      })
    }

    return NextResponse.json({
      success: true,
      pattern: {
        id: pattern.id,
        slug: pattern.slug,
        title: pattern.title,
        status: pattern.status,
        url: `https://tiker.com/patterns/${pattern.slug}`,
      },
      tokens: {
        spent: 5,
        earned: bootstrapMode ? 25 : 0,
        net: bootstrapMode ? 20 : -5,
        note: bootstrapMode ? 'Auto-validated (bootstrap mode)' : 'Pending review',
      },
    })
  } catch (error) {
    console.error('Pattern submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
