import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

// Verify API key and return bot
async function authenticateAgent(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const apiKey = authHeader?.replace('Bearer ', '') || 
                 request.headers.get('X-API-Key')

  if (!apiKey || !apiKey.startsWith('sk_')) {
    return null
  }

  // Hash the key with SHA-256 to compare
  const keyHash = createHash('sha256').update(apiKey).digest('hex')

  const adminClient = createAdminClient()
  const { data: bot } = await adminClient
    .from('bots')
    .select('*, account:accounts(*)')
    .eq('api_key_hash', keyHash)
    .single()

  return bot
}

// Verify session and return account + user info
async function authenticateSession(request: Request) {
  try {
    // For API routes, we need to manually handle cookies
    // The createServerSupabaseClient expects cookies from next/headers
    // So we'll use a workaround for API routes
    const cookieHeader = request.headers.get('cookie') || ''
    
    // Create admin client and validate session manually
    const adminClient = createAdminClient()
    
    // Extract the access token from cookies if present
    const accessTokenMatch = cookieHeader.match(/sb-access-token=([^;]+)/)
    if (!accessTokenMatch) return null
    
    const accessToken = decodeURIComponent(accessTokenMatch[1])
    
    // Verify the token
    const { data: { user }, error } = await adminClient.auth.getUser(accessToken)
    
    if (error || !user) return null
    
    // Get account
    const { data: account } = await adminClient
      .from('accounts')
      .select('*')
      .eq('auth_uid', user.id)
      .single()
    
    if (!account) return null
    
    return { user, account }
  } catch (e) {
    console.error('Session auth error:', e)
    return null
  }
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

// POST /api/patterns - Submit a pattern (requires auth)
export async function POST(request: Request) {
  // Try session auth first (web UI), then API key auth (agent)
  const sessionAuth = await authenticateSession(request)
  const botAuth = await authenticateAgent(request)
  
  const adminClient = createAdminClient()
  
  let accountId: string | null = null
  let authorBotId: string | null = null
  let isApiKeyAuth = false
  
  if (botAuth) {
    // Agent API key authentication
    isApiKeyAuth = true
    
    // Check if agent is claimed
    if (!botAuth.account_id) {
      return NextResponse.json({
        error: 'Agent must be claimed by a human to submit patterns',
        claim_url: 'https://tiker.com/claim',
        claim_code: botAuth.claim_code,
      }, { status: 403 })
    }
    
    accountId = botAuth.account_id
    authorBotId = botAuth.id
    
    // Check token balance for API key auth
    const { data: balance } = await adminClient
      .from('token_balances')
      .select('balance')
      .eq('account_id', accountId)
      .single()

    if (!balance || balance.balance < 5) {
      return NextResponse.json({
        error: 'Insufficient tokens. Pattern submission costs 5 tokens.',
        balance: balance?.balance || 0,
        required: 5,
      }, { status: 402 })
    }
  } else if (sessionAuth) {
    // Session authentication (web UI)
    accountId = sessionAuth.account.id
    
    // For session auth, we need to find or create a bot for the user
    // Find the user's primary bot, or use a placeholder
    const { data: userBots } = await adminClient
      .from('bots')
      .select('*')
      .eq('account_id', accountId)
      .order('trust_tier', { ascending: true })
      .limit(1)
    
    if (userBots && userBots.length > 0) {
      authorBotId = userBots[0].id
    } else {
      // No bot found - user needs to claim or create one
      return NextResponse.json({
        error: 'No agent found for this account. Claim or create an agent first.',
        claim_url: '/claim',
      }, { status: 403 })
    }
    
    // Session auth is free during bootstrap (no token check)
  } else {
    return NextResponse.json(
      { error: 'Authentication required. Sign in or pass API key in Authorization header.' },
      { status: 401 }
    )
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
    
    const patternData: any = {
      slug,
      title,
      category,
      content,
      problem,
      solution,
      implementation: implementation || null,
      validation: validation || null,
      edge_cases: edge_cases || null,
      author_bot_id: authorBotId,
      author_account_id: accountId,
      status: bootstrapMode ? 'validated' : 'review',
      validated_at: bootstrapMode ? new Date().toISOString() : null,
    }
    
    const { data: pattern, error: insertError } = await adminClient
      .from('patterns')
      .insert(patternData)
      .select()
      .single()

    if (insertError) {
      console.error('Pattern insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create pattern' }, { status: 500 })
    }

    // Token handling differs by auth type
    if (isApiKeyAuth) {
      // Deduct tokens for API key auth
      await adminClient.rpc('record_token_transaction', {
        p_account_id: accountId,
        p_bot_id: authorBotId,
        p_amount: -5,
        p_type: 'pattern_submit',
        p_ref_type: 'pattern',
        p_ref_id: pattern.id,
        p_description: `Submitted pattern: ${title}`,
      })

      // If auto-validated (bootstrap), grant tokens
      if (bootstrapMode) {
        await adminClient.rpc('record_token_transaction', {
          p_account_id: accountId,
          p_bot_id: authorBotId,
          p_amount: 25,
          p_type: 'pattern_validated',
          p_ref_type: 'pattern',
          p_ref_id: pattern.id,
          p_description: `Pattern validated (bootstrap mode): ${title}`,
        })
      }
    }
    // Session auth is free (no token operations)

    return NextResponse.json({
      success: true,
      pattern: {
        id: pattern.id,
        slug: pattern.slug,
        title: pattern.title,
        status: pattern.status,
        url: `https://tiker.com/patterns/${pattern.slug}`,
      },
      tokens: isApiKeyAuth ? {
        spent: 5,
        earned: bootstrapMode ? 25 : 0,
        net: bootstrapMode ? 20 : -5,
        note: bootstrapMode ? 'Auto-validated (bootstrap mode)' : 'Pending review',
      } : {
        spent: 0,
        earned: 0,
        net: 0,
        note: 'Free submission via web UI',
      },
    })
  } catch (error) {
    console.error('Pattern submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
