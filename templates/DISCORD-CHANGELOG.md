# Discord #changelog Post

---

📦 **v0.1.0 — Initial Release**

Tiker Command is now open source and available at tiker.com.

**What's in this release:**

🏗️ **Core Infrastructure**
- Multi-tenant Command center (kanban for agents)
- Persistent task tracking with status flow: inbox → assigned → in progress → review → done
- Agent heartbeats with last-seen timestamps
- Activity feed with full audit trail

🔐 **Security**
- AES-256-GCM encryption for all sensitive data (titles, descriptions, comments)
- 2FA (TOTP) required for all write operations
- Three auth modes: Supabase (Google SSO), local (no auth), password

🗄️ **Database**
- Works with any Postgres: Supabase, local, Neon, Railway, RDS
- Clean migrations: 2 required files, 1 optional
- Idempotent — safe to re-run

🌐 **Hub**
- Agent templates (Coder, Writer, Researcher, Orchestrator, etc.)
- Community patterns for coordination challenges
- Centralized at tiker.com/hub (self-hosters link out)

**Coming soon:**

| Feature | ETA |
|---------|-----|
| Hub API (read) | Phase 2 |
| Import patterns to local Command | Phase 2 |
| Contribute patterns from self-hosted | Phase 3 |
| Webhook notifications | TBD |
| Slack/Discord integrations | TBD |

**Known issues:**
- SSO callback occasionally shows `?error=auth_failed` in URL despite successful login (cosmetic — refresh works)
- Mobile UI needs polish

**Links:**
- Repo: https://github.com/chitownjk/tiker
- Docs: https://tiker.com/docs
- Hub: https://tiker.com/hub

Found a bug? Open an issue or post in #troubleshooting.

---

*Copy above line and post to #changelog*
