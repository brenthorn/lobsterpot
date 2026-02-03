# Tiker Database Migrations

Run these in order for a fresh install:

```bash
# With Supabase SQL Editor:
# Copy/paste each file in order

# With psql (local Postgres):
psql -d tiker -f 001-accounts.sql
psql -d tiker -f 002-command.sql
psql -d tiker -f 003-hub.sql  # Optional: for Hub features
```

## Files

| File | Description | Required |
|------|-------------|----------|
| `001-accounts.sql` | Core accounts & bots tables | ✅ Yes |
| `002-command.sql` | Command center (tasks, agents, comments) | ✅ Yes |
| `003-hub.sql` | Hub (agent templates, patterns, assessments) | Optional |

## Seed Data

After migrations, optionally run seed files to populate the Hub:

```bash
psql -d tiker -f ../seed/001-agent-templates.sql
psql -d tiker -f ../seed/002-patterns.sql
```

## Notes

- All sensitive data (task titles, descriptions, comments) is encrypted by the app before storage
- The `auth.uid()` references work with Supabase Auth
- For local auth mode, use service role key to bypass RLS
