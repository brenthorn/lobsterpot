# Spawn Enhancement Technical Spec

## Overview

Enable `sessions_spawn` to accept DB-driven agent configuration, allowing orchestrators to spawn specialized agents without filesystem setup.

## Current State

```javascript
// Current sessions_spawn
sessions_spawn({
  task: "Write blog post about X",
  agentId: "writer",           // Must exist as configured agent
  model: "sonnet",             // Optional override
  label: "writer-task-123",    // For retrieval
  timeoutSeconds: 300
})
```

**Limitation:** `agentId` must reference a pre-configured agent with filesystem workspace.

## Proposed Enhancement

```javascript
// Enhanced sessions_spawn with inline config
sessions_spawn({
  task: "Write blog post about X",
  
  // NEW: Inline agent configuration
  agentConfig: {
    name: "Writer",
    soul: "I am Writer, focused on clear communication...",
    instructions: "Structure content with headers. Be concise...",
    skills: ["summarize", "web_fetch"],  // Skill filter
    memory: { ... }                       // Injected context
  },
  
  model: "anthropic/claude-sonnet-4-5",  // Resolved by orchestrator
  label: "writer-task-123",
  timeoutSeconds: 300
})
```

## Implementation Details

### 1. System Prompt Construction

When `agentConfig` is provided, construct system prompt:

```
# SOUL.md
{agentConfig.soul}

# AGENTS.md  
{agentConfig.instructions}

# Injected Memory
{JSON.stringify(agentConfig.memory)}

# Task
{task}
```

### 2. Skill Filtering

The `skills` array acts as a **filter**, not an installer:

- Orchestrator has ALL skills installed
- Spawned session only sees skills in the filter list
- If `skills` is empty/null, inherit all orchestrator skills

```javascript
// In spawn handler
const allowedSkills = agentConfig.skills || orchestratorSkills;
const filteredSkillContext = skills.filter(s => allowedSkills.includes(s.name));
```

### 3. Memory Injection

Memory is injected as context, not as files:

```javascript
// Orchestrator fetches from DB
const agentMemory = await supabase
  .from('account_agent_templates')
  .select('memory')
  .eq('account_id', accountId)
  .eq('agent_template_id', templateId)
  .single();

// Inject into spawn
sessions_spawn({
  agentConfig: {
    ...templateConfig,
    memory: agentMemory.memory
  }
})
```

### 4. Memory Persistence (Post-Task)

After spawn completes, orchestrator extracts learnings:

```javascript
// Spawn returns result
const result = await sessions_spawn({ ... });

// Extract memory updates (convention: agent outputs JSON block)
const memoryUpdates = extractMemoryBlock(result);

if (memoryUpdates) {
  await supabase
    .from('account_agent_templates')
    .update({ 
      memory: { ...existingMemory, ...memoryUpdates },
      updated_at: new Date()
    })
    .eq('account_id', accountId)
    .eq('agent_template_id', templateId);
}
```

### 5. Label Convention

Use consistent labels for tracking:

```
{template_slug}-{task_id}
```

Example: `writer-task-abc123`

This allows:
- Querying active spawns by template
- Linking MC tasks to spawn sessions
- Debugging/monitoring

## Orchestrator Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     ORCHESTRATOR                             │
│                                                              │
│  1. Check MC for assigned tasks                              │
│     → Task: "Write Q1 update" assigned to @Writer            │
│                                                              │
│  2. Fetch agent config from DB                               │
│     → SELECT * FROM get_agent_config(account_id, 'writer')   │
│     → Returns: { soul, instructions, skills, model, memory } │
│                                                              │
│  3. Spawn session with config                                │
│     → sessions_spawn({                                       │
│         task: "Write Q1 update",                             │
│         agentConfig: { ... },                                │
│         model: "anthropic/claude-sonnet-4-5",                │
│         label: "writer-task-xyz"                             │
│       })                                                     │
│                                                              │
│  4. Wait for completion                                      │
│     → Result returned                                        │
│                                                              │
│  5. Update MC task status                                    │
│     → Move to "review" or "done"                             │
│     → Post result as comment                                 │
│                                                              │
│  6. Persist memory updates                                   │
│     → Extract learnings from result                          │
│     → Update account_agent_templates.memory                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## API Changes

### sessions_spawn Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| task | string | yes | The task description |
| agentId | string | no | Existing agent reference (current behavior) |
| agentConfig | object | no | Inline agent configuration (new) |
| agentConfig.name | string | no | Display name |
| agentConfig.soul | string | no | SOUL.md content |
| agentConfig.instructions | string | no | AGENTS.md content |
| agentConfig.skills | string[] | no | Skill filter list |
| agentConfig.memory | object | no | Injected memory context |
| model | string | no | Model override |
| label | string | no | Session label for retrieval |
| timeoutSeconds | number | no | Timeout |
| cleanup | string | no | "delete" or "keep" |

**Validation:**
- Must provide either `agentId` OR `agentConfig`, not both
- If `agentConfig` provided, `soul` is recommended but not required

### sessions_spawn Response

```javascript
{
  success: true,
  sessionKey: "spawn:writer-task-xyz:abc123",
  result: "...",           // Agent's response
  memoryUpdates: { ... },  // Extracted memory (if any)
  tokensUsed: 1234,
  durationMs: 45000
}
```

## Multi-Gateway Considerations

When user has multiple gateways, task claiming prevents double-processing:

```sql
-- Claim task (atomic)
UPDATE mc_tasks 
SET 
  claimed_by_gateway = 'gateway-abc',
  claimed_at = NOW()
WHERE id = 'task-xyz' 
  AND claimed_by_gateway IS NULL
RETURNING id;
```

If returns NULL → another gateway claimed it, skip.

### Required Schema Addition

```sql
ALTER TABLE mc_tasks ADD COLUMN claimed_by_gateway VARCHAR(100);
ALTER TABLE mc_tasks ADD COLUMN claimed_at TIMESTAMPTZ;
CREATE INDEX idx_mc_tasks_claimed ON mc_tasks(claimed_by_gateway);
```

## Tiker Skill Integration

The `tiker` skill teaches orchestrators how to use this system:

```markdown
# SKILL.md - Tiker Integration

## Checking for Tasks

Every heartbeat, check MC for tasks assigned to your agents:

\`\`\`javascript
const tasks = await mc.getTasks({ 
  assignedTo: ['writer', 'coder', 'researcher'],
  status: 'assigned',
  unclaimed: true
});
\`\`\`

## Spawning an Agent

When you have a task for @Writer:

1. Claim the task (prevents other gateways from taking it)
2. Fetch Writer's config from DB
3. Spawn session with that config
4. Wait for result
5. Update task with result
6. Persist any memory updates
```

## Migration Path

### Phase 1: Add agentConfig support to sessions_spawn
- Accept inline config alongside existing agentId
- Construct system prompt from config
- No breaking changes to existing behavior

### Phase 2: Build Tiker skill
- Implement MC task checking
- Implement DB config fetching
- Implement spawn + result handling

### Phase 3: Update MC UI
- Add agent assignment to tasks
- Add agent marketplace panel
- Add model config in settings

## Open Questions

1. **Skill filtering implementation:** Does OpenClaw already support skill filtering per-session, or does this need to be built?

2. **Memory extraction convention:** What format should agents use to output memory updates? JSON block with specific markers?

3. **Timeout handling:** If spawn times out, should we auto-retry or mark task as blocked?

4. **Concurrent spawns:** Can orchestrator spawn multiple agents in parallel, or must it be sequential?
