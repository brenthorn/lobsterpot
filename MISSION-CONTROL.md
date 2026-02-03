# Mission Control

Dashboard for coordinating Clyde & Bonnie agent activities.

## Setup

### 1. Apply Database Schema

Run this SQL in Supabase SQL Editor:

```bash
cat ~/botnet/development/clawstack/supabase/mission-control.sql
```

Copy the output and run it in: https://supabase.com/dashboard/project/YOUR_PROJECT/editor

### 2. Install CLI Tool

The `mc` CLI tool is located at `~/botnet/development/clawstack/cli/mc`

To use it from anywhere, add to your shell rc file (~/.bashrc or ~/.zshrc):

```bash
export PATH="$PATH:$HOME/botnet/development/clawstack/cli"
```

Or create an alias:

```bash
alias mc="$HOME/botnet/development/clawstack/cli/mc"
```

Then reload your shell or run:

```bash
source ~/.bashrc  # or ~/.zshrc
```

### 3. Test the CLI

```bash
mc heartbeat --agent Clyde
mc list --type agents
mc list --type tasks
```

## Usage

### For Agents (Clyde & Bonnie)

**Send heartbeat:**
```bash
mc heartbeat --agent Clyde
```

**Update status:**
```bash
mc status --agent Clyde --status active
mc status --agent Clyde --status idle
mc status --agent Clyde --status blocked --task "Fix Bonnie heartbeat"
```

**Create a task:**
```bash
mc task create --title "Research Cal.com integration" --description "Check API docs and pricing" --assign Bonnie --tags "research,calendar"
```

**Comment on a task:**
```bash
mc comment --task "Research Cal.com integration" --agent Clyde --message "Found good API docs, looks feasible"
```

**List tasks and agents:**
```bash
mc list --type tasks
mc list --type agents
```

## UI Access

Navigate to: **https://tiker.com/bonnieclyde**

(Must be logged in with Jay's Google account)

## Architecture

### Database Tables

- `mc_agents` - Agent roster (Clyde, Bonnie, future agents)
- `mc_tasks` - Task queue with status tracking
- `mc_comments` - Discussion threads on tasks
- `mc_activities` - Activity feed for real-time updates

### UI Features

- **Agent Status Cards** - See who's online, last heartbeat, current task
- **Kanban Board** - Drag and drop tasks between columns (Inbox → Assigned → In Progress → Review → Done)
- **Activity Feed** - Real-time stream of all agent actions
- **Task Details** - Click any task to see full context and comments

### Real-time Updates

The UI uses Supabase real-time subscriptions. When an agent updates via CLI, the dashboard updates instantly.

## Integration with Agents

### In Heartbeat Logic

```bash
#!/bin/bash
# In agent heartbeat script

# Record heartbeat
mc heartbeat --agent Clyde

# Update status based on what you're doing
if [ -n "$CURRENT_TASK" ]; then
  mc status --agent Clyde --status active --task "$CURRENT_TASK"
else
  mc status --agent Clyde --status idle
fi
```

### When Starting Work

```bash
mc status --agent Clyde --status active --task "Building Mission Control"
mc comment --task "Building Mission Control" --agent Clyde --message "Starting on the UI components"
```

### When Blocked

```bash
mc status --agent Clyde --status blocked --task "Fix Bonnie heartbeat"
mc comment --task "Fix Bonnie heartbeat" --agent Clyde --message "Need Jay to check Tailscale config"
```

### When Done

```bash
mc comment --task "Building Mission Control" --agent Clyde --message "UI complete, ready for review"
# Jay will drag task to "Done" column in UI
```

## Development

### Run Dev Server

```bash
cd ~/botnet/development/clawstack/app
npm run dev
```

Access at http://localhost:3000/bonnieclyde

### Deploy

Pushes to `main` branch auto-deploy to Vercel → tiker.com

```bash
cd ~/botnet/development/clawstack
git add .
git commit -m "Mission Control MVP"
git push origin main
```

## Future Enhancements

- [ ] Add @mention notifications (like in the Twitter thread)
- [ ] Thread subscriptions (auto-notify participants)
- [ ] Daily standup reports (scheduled summary to Telegram)
- [ ] Task creation from UI
- [ ] Cost/token tracking per agent
- [ ] Session history viewer (click agent → see recent conversations)
- [ ] Mobile responsive view
