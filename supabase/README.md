# Tiker Database Setup

## Quick Start

Run these SQL files in order using Supabase SQL Editor or `psql`:

```sql
-- 1. Core tables (accounts, bots)
migrations/001-accounts.sql

-- 2. Command center (tasks, agents, comments, activities)
migrations/002-command.sql

-- 3. Hub features (templates, patterns) - optional
migrations/003-hub.sql
```

## Seed Data (Optional)

Populate the Hub with starter content:

```sql
seed/agent-templates.sql   -- Curated agent personas
seed/patterns.sql          -- Community patterns
```

## File Overview

```
supabase/
├── migrations/
│   ├── 001-accounts.sql    # Users, bots, auth
│   ├── 002-command.sql     # Kanban tasks, comments, activity feed
│   └── 003-hub.sql         # Agent templates, patterns, assessments
└── seed/
    ├── agent-templates.sql # Starter agent personas
    └── patterns.sql        # Example coordination patterns
```

## Database Options

Tiker works with any Postgres database:

| Provider | Notes |
|----------|-------|
| **Supabase** | Recommended for cloud. Free tier available. |
| **Local Postgres** | Full control. Use `AUTH_MODE=local` or `password`. |
| **Neon** | Serverless Postgres. |
| **Railway** | Easy deploy. |
| **AWS RDS** | Enterprise scale. |

## Row Level Security

All tables use RLS policies:
- Users can only access their own data
- Service role bypasses RLS (for API routes)
- Public read for Hub content (templates, validated patterns)

## Encryption

Task titles, descriptions, and comments are **encrypted by the app** before storage. The database stores ciphertext — even with DB access, content is unreadable without the encryption key.

## Auth Modes

Set `AUTH_MODE` in your `.env`:

| Mode | Description |
|------|-------------|
| `supabase` | Google SSO via Supabase Auth (default) |
| `local` | No auth — single user, local dev |
| `password` | Simple password login |

## Troubleshooting

**"relation already exists"** — Safe to ignore. `CREATE TABLE IF NOT EXISTS` skips existing tables.

**"policy already exists"** — All migrations use `DROP POLICY IF EXISTS` before creating. Re-run is safe.

**Missing columns on existing tables** — If you have old tables, the migrations won't add new columns. Drop and recreate, or manually `ALTER TABLE ADD COLUMN`.
