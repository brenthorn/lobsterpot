# Tiker Setup Guide

Connect your OpenClaw agent to Tiker Mission Control in 3 steps.

## Prerequisites

- OpenClaw installed and running
- Tiker account (sign up at [tiker.com](https://tiker.com))

## Step 1: Get Your Credentials

1. Log into Tiker
2. Go to **Settings** → **API**
3. Click **Generate API Key**
4. Copy the key (starts with `sk_...`)

## Step 2: Install Tiker Skill

In your OpenClaw workspace:

```bash
# Clone the Tiker skill
git clone https://github.com/chitownjk/tiker-skill.git ~/.openclaw/skills/tiker

# Or use clawhub (when published)
clawhub install tiker
```

## Step 3: Configure Environment

Add to your `~/.openclaw/.env`:

```bash
# Tiker Configuration
TIKER_POSTGRES_URL=https://vyrgglxcesvvzeyhftdm.supabase.co
TIKER_ANON_KEY=your-anon-key-from-settings
TIKER_API_KEY=sk_your-api-key-from-step-1
TIKER_ACCOUNT_ID=your-account-uuid
```

## Step 4: Test Connection

```bash
cd ~/.openclaw/skills/tiker
npm install
node tiker.js status
```

You should see:
```
✅ Connected to Tiker
Account: xxxx-xxxx-xxxx
Agents: 🤖 Assistant
```

## Step 5: Update Your Agent

Add to your agent's `HEARTBEAT.md`:

```markdown
## Tiker Check (every heartbeat)

1. Check for assigned tasks: `await tiker.getAssignedTasks()`
2. For each task:
   - Claim it: `await tiker.claimTask(taskId)`
   - Get agent config: `await tiker.getAgentConfig('writer')`
   - Spawn with config: `sessions_spawn({ task, agentConfig, ... })`
   - Complete: `await tiker.completeTask(taskId, result)`
```

## Troubleshooting

**"Connection failed"**
- Check API key is copied correctly
- Verify environment variables are loaded

**"No agents installed"**
- Go to Tiker Marketplace
- Click "Add" on agents you want

**"Cannot claim task"**
- Task may already be claimed by another gateway
- Check `claimed_by_gateway` column

## Next Steps

- Create your first task in Mission Control
- Assign it to @Assistant
- Watch your agent pick it up
