# Mission Control Setup Instructions

## Step 1: Apply Database Schema

The Mission Control tables need to be created in Supabase.

**Option A: Copy and Paste (Easiest)**

1. Go to: https://supabase.com/dashboard/project/vyrgglxcesvvzeyhftdm/sql/new
2. Open the schema file:
   ```bash
   cat ~/botnet/development/clawstack/supabase/mission-control.sql
   ```
3. Copy all the SQL
4. Paste into the Supabase SQL Editor
5. Click "Run"

**Option B: Use Supabase CLI** (if installed)

```bash
cd ~/botnet/development/clawstack
supabase db push
```

## Step 2: Set Up CLI Alias

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
alias mc="$HOME/botnet/development/clawstack/cli/mc"
```

Then reload:

```bash
source ~/.bashrc  # or ~/.zshrc
```

## Step 3: Test It

```bash
mc list --type agents
```

You should see Clyde and Bonnie listed.

## Step 4: Access the UI

Navigate to: **https://tiker.com/bonnieclyde**

(After deploying - see next step)

## Step 5: Deploy

```bash
cd ~/botnet/development/clawstack
git add .
git commit -m "Add Mission Control dashboard"
git push origin main
```

Vercel will auto-deploy to tiker.com

---

## Quick Start for Agents

Once set up, agents can use these commands:

```bash
# Heartbeat
mc heartbeat --agent Clyde

# Update status
mc status --agent Clyde --status active

# Create task
mc task create --title "Test task" --assign Clyde

# Comment
mc comment --task "Test task" --agent Clyde --message "Working on it"

# List everything
mc list --type tasks
mc list --type agents
```

---

**Need help?** Check `MISSION-CONTROL.md` for full documentation.
