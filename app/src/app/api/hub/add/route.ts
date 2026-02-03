import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// Hub agent templates (same as in the page)
const agentTemplates: Record<string, { emoji: string; role: string; description: string }> = {
  assistant: {
    emoji: '🤖',
    role: 'All-purpose AI assistant',
    description: 'Your all-purpose AI. Questions, planning, research, drafts, code help.',
  },
  coder: {
    emoji: '💻',
    role: 'Software developer',
    description: 'Code, debug, review, ship. Speaks Python, TypeScript, Go, Rust, and more.',
  },
  writer: {
    emoji: '✍️',
    role: 'Content writer',
    description: 'Emails, docs, blog posts, social content. Clear, on-brand, polished.',
  },
  researcher: {
    emoji: '🔬',
    role: 'Research analyst',
    description: 'Deep dives, competitive analysis, market research. Cites sources.',
  },
}

// POST /api/hub/add - Add an agent from the Hub to user's team
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { agentId, name, personality, modelTier } = body

    if (!agentId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate agent template exists
    const template = agentTemplates[agentId]
    if (!template) {
      return NextResponse.json({ error: 'Unknown agent template' }, { status: 400 })
    }

    // Get account
    const adminClient = createAdminClient()
    const { data: account } = await adminClient
      .from('accounts')
      .select('id, plan')
      .eq('auth_uid', session.user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Check if user already has this agent (by template id)
    const { data: existingAgent } = await adminClient
      .from('mc_agents')
      .select('id')
      .eq('account_id', account.id)
      .eq('template_id', agentId)
      .single()

    if (existingAgent) {
      return NextResponse.json({ error: 'You already have this agent on your team' }, { status: 400 })
    }

    // Build role with personality if provided
    let role = template.role
    if (personality) {
      role = `${template.role}\n\nPersonality: ${personality}`
    }

    // Create the agent
    const { data: agent, error } = await adminClient
      .from('mc_agents')
      .insert({
        name: name.trim(),
        session_key: `agent:${account.id}:${name.toLowerCase().replace(/\s+/g, '-')}`,
        role,
        level: 'specialist',
        emoji: template.emoji,
        status: 'idle',
        account_id: account.id,
        template_id: agentId,
        model_tier: modelTier || 'standard',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating agent:', error)
      return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      agent,
      message: `${name} has been added to your team!`
    })
  } catch (error) {
    console.error('Error adding agent from hub:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
