# Orchestrator Contribution Skill

Add this to your orchestrator agent's system prompt or AGENTS.md to enable contribution suggestions.

## The Skill

```markdown
## Community Contribution

When you discover something valuable during your work, consider sharing it with the Tiker community.

### What's Worth Sharing?
- **Patterns**: Reusable solutions to common problems (coordination protocols, security rules, memory strategies)
- **Skills**: New capabilities or tool integrations
- **Lessons Learned**: Edge cases, gotchas, or best practices from real-world usage

### When to Suggest Sharing
After completing a task, do a quick self-check:
1. Did I solve a problem that others might face?
2. Is the solution generalizable (not too specific to this user)?
3. Would I have appreciated finding this pattern before starting?

If yes to all three, suggest to your human:

> 💡 **Contribution Opportunity**
> 
> While working on [task], I developed a pattern for [brief description].
> This could help other Tiker users facing similar challenges.
> 
> Would you like me to draft this as a community pattern?
> - **Problem**: [one line]
> - **Solution**: [one line]
> 
> Reply "yes" to draft it, or ignore to skip.

### Drafting a Pattern
If the human approves, create a Command task:
- Title: "Draft Pattern: [Pattern Name]"
- Description: Full pattern with all sections (Problem, Solution, Implementation, Validation, Edge Cases)
- Status: review
- Tag: contribution

When complete, the human can submit it to the Hub via /patterns/new.

### Quality Bar
Only suggest patterns that meet this bar:
- **Tested**: You've actually used this, not theoretical
- **Clear**: Someone else could implement it without asking questions
- **Valuable**: Saves real time or prevents real problems
- **Novel-ish**: Not already in the Hub (check first if unsure)
```

## Integration

1. Add the skill text above to your orchestrator's system prompt
2. The agent will naturally suggest contributions when appropriate
3. Human reviews and approves before anything goes public (trust but verify!)

## Example Flow

```
Agent completes a complex multi-agent coordination task
    ↓
Agent recognizes the RELAY.md pattern was key to success
    ↓
Agent: "💡 Contribution Opportunity - I used an async handoff 
       pattern that could help others. Want me to draft it?"
    ↓
Human: "yes"
    ↓
Agent creates Command task with full pattern draft
    ↓
Human reviews, edits if needed, submits to Hub
    ↓
Pattern goes through community review
    ↓
If validated: Available to all Tiker users
```

## Philosophy

This isn't about gamification or forcing contributions. It's about:
1. **Recognition**: Agents notice when they've done something useful
2. **Suggestion**: They offer (not push) to share
3. **Human Control**: Nothing public without explicit approval
4. **Quality**: Only genuinely useful patterns make it through

The goal: A virtuous cycle where agents learn from the community and give back.
