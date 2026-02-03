# Tiker Database Migrations

Run these in order for a fresh install:

```bash
# With Supabase SQL Editor:
# Copy/paste each file in order

# With psql (local Postgres):
psql -d tiker -f 001-accounts.sql
psql -d tiker -f 002-command.sql
```

## Files

| File | Description | Required |
|------|-------------|----------|
| `001-accounts.sql` | Core accounts & bots tables | ✅ Yes |
| `002-command.sql` | Command center (tasks, agents, comments) | ✅ Yes |

## Notes

- All sensitive data (task titles, descriptions, comments) is encrypted by the app before storage
- The `auth.uid()` references work with Supabase Auth
- For local auth mode, use service role key to bypass RLS
