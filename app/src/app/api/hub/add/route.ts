import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/crypto'

interface AddRequest {
  type: 'agent' | 'pattern'
  id: string
  customizations?: {
    name?: string
    personality?: string
    modelTier?: string
  }
}

// Static agent templates (same as hub page - will move to DB later)
const AGENT_TEMPLATES: Record<string, {
  name: string
  emoji: string
  description: string
  tier: string
}> = {
  'assistant': {
    name: 'Assistant',
    emoji: '🤖',
    description: 'Your all-purpose AI. Questions, planning, research, drafts, code help.',
    tier: 'free',
  },
  'coder': {
    name: 'Coder',
    emoji: '💻',
    description: 'Code, debug, review, ship. Speaks Python, TypeScript, Go, Rust, and more.',
    tier: 'team',
  },
  'writer': {
    name: 'Writer',
    emoji: '✍️',
    description: 'Emails, docs, blog posts, social content. Clear, on-brand, polished.',
    tier: 'team',
  },
  'researcher': {
    name: 'Researcher',
    emoji: '🔬',
    description: 'Deep dives, competitive analysis, market research. Cites sources.',
    tier: 'team',
  },
}

// POST /api/hub/add - Add an agent or pattern to the user's Command
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: AddRequest = await request.json()
    const { type, id, customizations } = body

    if (!type || !id) {
      return NextResponse.json({ error: 'Type and id are required' }, { status: 400 })
    }

    if (type !== 'agent' && type !== 'pattern') {
      return NextResponse.json({ error: 'Type must be "agent" or "pattern"' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Get account ID
    const { data: account } = await adminClient
      .from('accounts')
      .select('id')
      .eq('auth_uid', session.user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    let title: string
    let description: string

    if (type === 'agent') {
      // Look up agent template
      const template = AGENT_TEMPLATES[id]
      if (!template) {
        return NextResponse.json({ error: 'Agent template not found' }, { status: 404 })
      }

      const agentName = customizations?.name || template.name
      title = `Setup: ${agentName} agent`
      
      // Build description with agent details and customizations
      const descriptionParts = [
        `## Agent Details`,
        `- **Template:** ${template.name} ${template.emoji}`,
        `- **Tier:** ${template.tier}`,
        `- **Description:** ${template.description}`,
      ]

      if (customizations) {
        descriptionParts.push('', '## Customizations')
        if (customizations.name) {
          descriptionParts.push(`- **Custom Name:** ${customizations.name}`)
        }
        if (customizations.personality) {
          descriptionParts.push(`- **Personality:** ${customizations.personality}`)
        }
        if (customizations.modelTier) {
          descriptionParts.push(`- **Model Tier:** ${customizations.modelTier}`)
        }
      }

      descriptionParts.push(
        '',
        '## Next Steps',
        '1. Review the agent configuration above',
        '2. Create the agent in Team settings',
        '3. Configure any additional settings',
        '4. Test the agent with a simple task'
      )

      description = descriptionParts.join('\n')

      // Note: agent templates don't have import_count in DB yet (static)
      // Will be added when agent_templates table is created
    } else {
      // Look up pattern from database
      const { data: pattern, error: patternError } = await adminClient
        .from('patterns')
        .select('id, title, category, problem, solution, implementation, validation, import_count')
        .eq('id', id)
        .single()

      if (patternError || !pattern) {
        return NextResponse.json({ error: 'Pattern not found' }, { status: 404 })
      }

      title = `Review: ${pattern.title}`
      
      // Build description with full pattern content
      const descriptionParts = [
        `## Pattern: ${pattern.title}`,
        `**Category:** ${pattern.category}`,
        '',
        '## Problem',
        pattern.problem || 'No problem statement provided.',
        '',
        '## Solution',
        pattern.solution || 'No solution provided.',
      ]

      if (pattern.implementation) {
        descriptionParts.push('', '## Implementation', pattern.implementation)
      }

      if (pattern.validation) {
        descriptionParts.push('', '## Validation', pattern.validation)
      }

      descriptionParts.push(
        '',
        '## Next Steps',
        '1. Review the pattern above',
        '2. Evaluate if it fits your use case',
        '3. Implement the solution in your agents/system',
        '4. Mark as complete when done'
      )

      description = descriptionParts.join('\n')

      // Increment import_count on the pattern
      await adminClient
        .from('patterns')
        .update({ import_count: (pattern.import_count || 0) + 1 })
        .eq('id', id)
    }

    // Create task with encrypted fields
    const { data: task, error: taskError } = await adminClient
      .from('mc_tasks')
      .insert({
        title: encrypt(title),
        description: encrypt(description),
        assigned_agent_ids: [],
        tags: [type === 'agent' ? 'setup' : 'review', 'hub-import'],
        priority: 'normal',
        status: 'inbox',
        account_id: account.id,
      })
      .select()
      .single()

    if (taskError) {
      console.error('Error creating task:', taskError)
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
    }

    // Return with decrypted fields for immediate use
    return NextResponse.json({
      success: true,
      task: {
        ...task,
        title,
        description,
      },
      message: type === 'agent' 
        ? `"${title}" added to your Command inbox`
        : `Pattern "${title.replace('Review: ', '')}" added to your Command inbox`,
    })
  } catch (error) {
    console.error('Error in hub/add:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
