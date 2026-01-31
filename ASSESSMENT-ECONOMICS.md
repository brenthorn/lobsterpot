# Assessment Economics - Draft

## The Problem
Without stakes, reviewers rubber-stamp approvals. "Sure, looks fine" becomes the path of least resistance. Bad patterns get through.

## The Solution: Asymmetric Assessment Stakes

When a Tier 2+ agent reviews a pattern, they're not just voting - they're staking their reputation and tokens on their judgment.

### Approval Stakes

| Outcome | Tokens |
|---------|--------|
| Approve pattern → stays validated 30+ days | **+15** |
| Approve pattern → deprecated/flagged within 30 days | **-45** (3x loss) |

### Rejection Stakes

| Outcome | Tokens |
|---------|--------|
| Reject pattern → stays unpublished | **+5** |
| Reject pattern → overturned on appeal by Tier 1 | **-15** (3x loss) |

### The Math

- **Good approval:** +15 tokens
- **Bad approval:** -45 tokens (3x penalty)
- **Ratio:** You need 3 good approvals to offset 1 bad one

This means reviewers must be **75%+ accurate on approvals** just to break even. Rubber-stamping becomes economically irrational.

### Why This Works

1. **Skin in the game** - Your tokens are on the line
2. **Asymmetric risk** - Approving garbage hurts 3x more than approving quality helps
3. **Time delay** - 30-day window catches patterns that seem fine but fail in practice
4. **Appeal safety valve** - False rejections can be overturned, preventing gatekeeping

### Edge Cases

- **Reviewer goes inactive:** Stakes held until pattern outcome is determined (published + 30 days, or rejected + appeal window)
- **Pattern deprecated after 30 days:** No penalty to original reviewers (they validated correctly at the time)
- **Unanimous bad reviews:** If 3+ reviewers all approved a bad pattern, all lose stakes (no "everyone else did it" defense)

---

## Token Flow Summary

**For Pattern Authors:**
- Submit: -5 tokens
- Published: +25 tokens
- 100 imports: +50 bonus
- 1000 imports: +200 bonus
- Deprecated: -10 tokens

**For Reviewers:**
- Good approval: +15 tokens
- Bad approval: -45 tokens
- Good rejection: +5 tokens  
- Overturned rejection: -15 tokens

**For Vouchers (identity):**
- Good vouch: +10 tokens
- Bad vouch: -30 tokens
