# OPENCLAW ORCHESTRATOR PROMPT: Tiker GPU Fund GTM Sprint

## SESSION CONTEXT SNAPSHOT
**Date:** 2026-02-04  
**Goal:** Raise $20,000 for local GPU cluster via Tiker revenue  
**Deadline:** 30 days  
**Current Revenue:** $0 (fresh start)

---

## WHAT IS TIKER?

**Product:** Open-source AI agent coordination platform  
**Tagline:** "Stop babysitting your AI tools"  
**Differentiator:** Task board for AI agents (Linear meets AutoGPT), async by design, persistent context, self-hostable  
**Stack:** Next.js 14, Supabase, Tailwind, Tailscale integration  
**Repo:** https://github.com/chitownjk/tiker  
**Site:** https://tiker.com

### Current Pricing
- **Solo:** $0 (1 agent, free forever)
- **Team:** $7/month (all agents, collaborators)
- **Self-hosted:** Free (MIT license)
- **Services:**
  - Remote Setup: $99 (was going to discount to $79)
  - Pi 5 Kit: $299 (was going to discount to $279)
  - Mac Mini M4: $999 (was going to discount to $949)

### New Product to Create
**"Founding Member" Tier:**
- Price: $149 one-time
- Includes: Lifetime Team plan ($7/mo forever) + 1 remote setup ($99 value) + Discord VIP + name on GPU cluster plaque
- Limit: First 50 people only
- Revenue target: 50 × $149 = $7,450

---

## THE VISION

Build a local GPU cluster so Tiker users can run AI agents WITHOUT paying OpenAI/Anthropic API fees. With a 4090, users can run 20+ agents locally for $0/month after setup. Break-even vs cloud: 2.2 months.

**Slogan:** "Stop renting your AI, own it."

---

## EXECUTION PLAN

### PHASE 1: IMMEDIATE (Tonight)

#### Task 1: Stripe Product Creation
Create new product in Stripe dashboard:
```
Name: Tiker Founding Member
Price: $149 USD (one-time payment)
Description: Lifetime Team plan + Remote setup + Discord VIP + GPU cluster recognition
Success URL: https://tiker.com?founding=success
Cancel URL: https://tiker.com?founding=canceled
```
**Output needed:** Price ID (format: `price_xxxxxxxxxx`)

#### Task 2: X (Twitter) Content Blitz
Schedule these posts via TweetDeck/Buffer:

**Thread #1: "The $47,000 API Bill" (Fear angle)**
```
Just saw a startup's OpenAI bill: $47k/month.

They're running 12 agents 24/7 doing:
- Customer support
- Content writing  
- Code review

Each agent costs them $3,900/mo in API fees.

Here's what they don't know: That same workload costs $89/mo on local GPUs.

🧵 How to escape the API trap...
```

**Thread #2: "I Built a Business in 36 Hours" (Proof angle)**
```
In February 2026, I was drowning in AI chaos.

5 different tools. Lost context. Copy-pasting between windows.

36 hours of non-stop coding later: Tiker was born.

A command center where AI agents actually WORK TOGETHER.

Not vaporware. Not a wrapper. Production-ready and open source.

Here's what 36 hours built 🧵
[attach kanban screenshot from /images/screenshots/kanban-full.png]
```

**Thread #3: "The Hardware ROI Calculator" (Logic angle)**
```
NVIDIA RTX 4090: $1,600
Running 20 AI agents locally: $0/month

AWS g5.2xlarge (A10G): $1.006/hour = $730/month

Break-even: 2.2 months.

After that? Pure profit.

But most teams can't configure this stuff...

That's why we built Tiker Setup Services 🧵
```

**Pin this tweet:**
```
Building an AI agent command center in public.

Goal: $20K for local GPU cluster so users can run agents without API fees.

Current stack: Next.js, Supabase, Tailscale
Status: Production-ready, open source
Revenue: Setup services ($99-$999)

If you're into self-hosted AI, follow along.

👇 Thread on what we built
```

#### Task 3: Discord Community Setup
Create these channels in Tiker Discord:
- `#showcase` - Users post Tiker setups
- `#hardware-deals` - GPU price tracking
- `#agent-marketplace` - Share custom agents
- `#sponsor-gpu` - Fundraising tracker

**Pin this message in #sponsor-gpu:**
```
🎯 GOAL: $20,000 for Local GPU Cluster

Current: $0
Target: $20,000

Perks:
• $50+ → Discord VIP + early features
• $149 → Founding Member (Lifetime Team + Setup + Name on plaque)
• $200+ → 1yr Team subscription ($84 value)
• $500+ → Remote setup included ($99 value)  
• $2000+ → Name on GPU cluster plaque
• $5000+ → Lifetime everything + advisory role

Transparency: github.com/chitownjk/tiker/blob/main/GPU_FUND.md

DM @chitownjk to claim perks after contributing.
```

**Bot permissions needed:**
- @Solis Games bot needs "Send Messages" permission in all channels
- OR create webhook: Server Settings → Integrations → Webhooks → Copy URL

#### Task 4: ProductHunt Draft
Create account at producthunt.com

**Draft:**
- **Name:** Tiker
- **Tagline:** Stop babysitting your AI tools
- **Description:** A command center for AI agents. Task board, not chat window. Async by design.
- **Topics:** Productivity, Developer Tools, Open Source

**First comment to post:**
```
I built this in 36 hours because I was drowning in AI tool chaos.

5 browser tabs. Lost context. Copy-pasting between Claude, ChatGPT, Cursor.

I wanted a Linear-style task board for AI agents.

So I built Tiker.

It's now production-ready, open source, and we offer setup services ($99 remote install or $299 Pi 5 kit shipped).

Currently fundraising $20k for a local GPU cluster—because users shouldn't pay API fees forever.

Ask me anything.
```

#### Task 5: GitHub Transparency
Create `GPU_FUND.md` in repo root:
```markdown
# GPU Cluster Fund

## Goal
$20,000 for local inference cluster

## Why
So Tiker users can run agents without OpenAI/Anthropic API fees

## Hardware Plan
- 2× NVIDIA RTX 4090 ($3,200)
- 1× Server chassis + PSU ($800)
- 128GB RAM ($600)
- Threadripper CPU ($1,500)
- Storage + networking ($400)
- Setup labor ($500)
- 6-month buffer ($15,000)
Total: ~$22,000

## Progress
| Date | Source | Amount | Running Total |
|------|--------|--------|---------------|
| ...  | ...    | ...    | ...           |

## Perks Claimed
- [ ] 

Last updated: YYYY-MM-DD
```

### PHASE 2: THIS WEEK

#### Influencer Outreach

**Tier 1 - DM these people:**

**@levelsio (Pieter Levels):**
```
Hey Pieter,

Built Tiker in 36 hours—open-source command center for AI agents. Linear meets AutoGPT, actually production-ready.

Saw your frustration with AI tool chaos. Tiker solves with async coordination + persistent context.

Fundraising $20k for local GPU cluster so users stop paying API fees forever.

Worth a look? Early access + repo attribution for you.

https://tiker.com
```

**@marc_lou:**
```
Hey Marc,

36-hour build: Tiker—AI agent command center. Think task board for autonomous agents.

Open source, production-ready, MIT license.

$20k GPU fundraise to offer free local inference (no more OpenAI bills).

Aligns with your "build in public" ethos. Interested?

https://tiker.com
```

**Tier 2 - YouTube targets:**
- NetworkChuck (homelab/self-hosting)
- TechnoTim (Kubernetes/self-hosted)
- Jeff Geerling (Raspberry Pi/hardware)

**Email subject:** "Self-hosted AI swarm for $299 vs $500+/mo OpenAI"

#### Reddit Posts

**r/selfhosted:**
```
[Showoff] Tiker - Command center for local AI agents (open source)

Screenshot: [kanban]

Self-hosted everything for years. Nextcloud, Jellyfin, Home Assistant. But AI kept me on APIs.

Built Tiker—task board for AI agents that runs entirely local.

- Create tasks, assign to specialist agents
- Agents remember context between sessions  
- Auto-coordination (Researcher → Writer handoff)
- Full audit trail

Stack: Next.js, Supabase, Tailscale

MIT licensed. Self-host free, or we offer setup services.

GitHub: [link]
```

**r/LocalLLaMA:**
```
Running 20 agents locally on a single 4090 with Tiker

Built an open-source coordination layer for local LLMs.

Instead of chaining prompts, you get a task board. Agents pick up work, collaborate, hand off tasks.

Supports any OpenAI-compatible endpoint (llama.cpp, vLLM, etc.)

Demo: [link]
GitHub: [link]

Curious if anyone's tried multi-agent setups with local models?
```

---

## REVENUE PROJECTION

| Source | Target | Amount |
|--------|--------|--------|
| Founding Members (50×$149) | 50 | $7,450 |
| Remote Setups ($79×30) | 30 | $2,370 |
| Pi 5 Kits ($279×15) | 15 | $4,185 |
| Mac Mini ($949×2) | 2 | $1,898 |
| GitHub Sponsors | Ongoing | $1,000 |
| Discord Donations | | $500 |
| Enterprise Deposits (2×$1k) | 2 | $2,000 |
| **TOTAL** | | **$19,403** |

---

## CRITICAL ASSETS NEEDED

### Files to Create/Modify
1. `GPU_FUND.md` - Transparency tracker (root of repo)
2. Update `/services` page - Add Founding Member tier
3. Create Stripe product - Get price ID
4. Update landing page - Add social proof banner (code provided above)

### API Keys/Access Needed
- Stripe: Create product, get price ID
- X/Twitter: Post threads, pin tweet
- Discord: Bot permissions or webhook URL
- ProductHunt: Account creation
- GitHub: Sponsor button enable

### Screenshots to Use
- `/images/screenshots/kanban-full.png` - Main product
- `/images/screenshots/task-detail.png` - Rich context
- `/images/screenshots/mc-hero.png` - Dashboard

---

## SUCCESS METRICS

**Week 1:**
- [ ] 10+ Founding Members sold ($1,490)
- [ ] 5+ Services booked ($500+)
- [ ] 100+ Discord members
- [ ] ProductHunt launch live

**Week 2:**
- [ ] 25+ Founding Members ($3,725)
- [ ] 1 influencer response
- [ ] 1 YouTube mention

**Week 4:**
- [ ] 50 Founding Members sold out ($7,450)
- [ ] $20k total raised
- [ ] GPU cluster ordered

---

## CONTEXT NOTES FOR FUTURE SESSIONS

- Services = Hardware/setup services (NOT AI agent services)
- Landing page uses editorial design (no AI slop cards)
- Keep Done column collapsed in kanban (already implemented)
- Discord + GitHub in header (already done)
- Services dropdown shows: Remote Install, Pi Kit, Mac Mini, Custom
- User has Solis Games bot with Stripe/X access configured
- User going to bed now - execute autonomously

---

## QUESTIONS FOR ORCHESTRATOR

1. Do you have access to Stripe dashboard to create the Founding Member product?
2. Do you have X/Twitter API access for posting threads?
3. Do you have Discord bot token/webhook for posting updates?
4. Are the screenshot paths correct for attaching to posts?
5. Do you need any code changes deployed before posting?

Execute what you can. Report back blockers.
