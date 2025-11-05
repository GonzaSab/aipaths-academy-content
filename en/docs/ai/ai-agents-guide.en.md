---
title: "Understanding AI Agents in Claude Code"
description: "Learn how AI agents work in Claude Code, why they matter, and how to leverage them effectively for complex tasks"
tags: ["agents", "claude-code", "beginner", "context-window"]
published: true
lastUpdated: "2025-01-05"
author: "AIPaths Academy"
---

# Understanding AI Agents in Claude Code

AI agents in Claude Code are specialized subprocesses that autonomously handle complex, multi-step tasks. Think of them as focused experts that can explore, plan, test, and execute specific workflows while you continue working on other things.

## What is an AI Agent?

An AI agent is an autonomous subprocess launched by Claude Code to handle specific types of tasks. Unlike a simple command execution, agents can:

- **Think independently**: Make decisions about next steps without constant guidance
- **Use multiple tools**: Combine file reading, searching, code analysis, and more
- **Work iteratively**: Adjust their approach based on what they discover
- **Run in parallel**: Multiple agents can work simultaneously on different tasks
- **Report back**: Return comprehensive results when they complete their work

**Example scenario:**
Instead of you manually searching for authentication code, reading multiple files, and piecing together how it works, you can launch an Explore agent that autonomously searches, reads relevant files, follows code references, and returns a complete analysis.

## Why AI Agents Matter

### 1. Context Window Efficiency

Claude Code has a context window (the amount of information it can "see" at once). Every file you read, every search result, and every conversation message consumes this window.

**Without agents:**
```
Your context window: [Message 1] [Message 2] [File read] [Search results] [Another file] [More searches]...
→ Context window fills up quickly
→ You lose earlier conversation history
→ Performance degrades
```

**With agents:**
```
Your context window: [Message 1] [Message 2] [Agent launch] [Agent summary]
Agent's context window: [Searches] [File reads] [Analysis] [More searches]...
→ Your context stays clean
→ You get a concise summary instead of raw data
→ Better performance and longer conversations
```

### 2. Parallel Execution

Agents can run simultaneously, dramatically speeding up complex workflows:

```typescript
// Launch multiple agents in parallel
Task("Explore authentication flow") +
Task("Explore database schema") +
Task("Explore API endpoints")
// All three run at once, each with their own context
```

### 3. Specialized Expertise

Each agent type has specific capabilities optimized for certain tasks:

| Agent Type | Best For | Tools Available |
|------------|----------|-----------------|
| **Explore** | Codebase discovery, understanding architecture | File search, grep, read, pattern matching |
| **Plan** | Breaking down complex features, design decisions | All tools, optimized for planning |
| **git-commit-guardian** | Secure commits, reviewing changes | Git commands, security scanning |
| **playwright-browser-tester** | Browser testing, debugging web apps | Playwright, browser automation |

## Agent Types: Task-Based Not Role-Based

**Important principle:** Think about *what needs to be done*, not *who should do it*.

### Common Agent Tasks

#### Explore Agent
**Use when you need to:**
- Understand how a feature is implemented
- Find where specific functionality lives
- Map out code architecture
- Answer "how does X work?" questions

**Example tasks:**
```bash
# Good: Specific exploration tasks
- "Find all API endpoints and how they're authenticated"
- "Explore the user registration flow from frontend to database"
- "Understand how error handling works across the application"

# Bad: Too vague
- "Look at the code"
- "Understand everything about authentication"
```

#### Plan Agent
**Use when you need to:**
- Break down complex implementations
- Design multi-step features
- Make architectural decisions
- Create implementation roadmaps

**Example tasks:**
```bash
# Good: Complex planning needs
- "Plan how to add OAuth authentication to the existing auth system"
- "Design a caching layer for the API with Redis"
- "Break down implementing real-time notifications"

# Bad: Simple tasks that don't need planning
- "Add a console.log statement"
- "Fix a typo"
```

## How the Context Window Works

### Understanding Token Limits

Claude Code (Sonnet 4.5) has a **200,000 token context window**. Approximately:
- 1 token ≈ 4 characters
- 1,000 tokens ≈ 750 words
- Average code file (200 lines) ≈ 1,500-3,000 tokens

**What fills your context window:**
1. **Conversation history**: Every message exchanged
2. **File contents**: Every file read with the Read tool
3. **Search results**: Output from Grep, Glob, etc.
4. **Tool outputs**: Results from bash commands, etc.
5. **System prompts**: Instructions Claude Code uses

### Context Window Best Practices

1. **Start with Agents**: For any exploration or research task, default to using an agent
2. **Direct Reading for Known Files**: Use Read tool when you know exactly which file you need
3. **Batch Operations**: If reading multiple files directly, do it in parallel when possible
4. **Clear Completed Tasks**: Old todo items and conversation history count toward your limit
5. **Restart When Needed**: If context feels cluttered, consider starting a fresh conversation

## Practical Examples

### Example 1: Understanding a New Codebase

**Task:** You've joined a new project and need to understand the authentication flow.

**Approach:**
```typescript
// Launch an Explore agent with medium thoroughness
Task({
  description: "Explore authentication flow",
  prompt: `Explore how user authentication works in this application.

  Focus on:
  - Login and registration flows
  - Session management
  - Password handling
  - Token generation

  Thoroughness: medium

  Return a summary explaining the flow from login to authenticated session.`,
  subagent_type: "Explore"
})
```

**What the agent does:**
1. Searches for auth-related files
2. Reads relevant files (login, register, middleware)
3. Follows code references
4. Maps the flow
5. Returns concise summary

**What you get:**
A clear explanation of the auth flow without polluting your context with dozens of file reads.

### Example 2: Planning a New Feature

**Task:** Add payment processing to your e-commerce app.

**Approach:**
```typescript
// Launch a Plan agent
Task({
  description: "Plan payment processing",
  prompt: `Plan how to implement Stripe payment processing.

  Consider:
  - Where to integrate in the checkout flow
  - Database schema changes needed
  - Security considerations
  - Error handling
  - Webhook handling for payment events

  Review existing checkout code and propose a detailed implementation plan.`,
  subagent_type: "Plan"
})
```

**What the agent does:**
1. Explores current checkout flow
2. Identifies integration points
3. Plans database migrations
4. Considers security implications
5. Creates step-by-step implementation plan

**What you get:**
A comprehensive plan you can review and execute, without your context filling up with exploratory searches.

## Common Patterns

### Pattern 1: Parallel Exploration

When you need to understand multiple related systems:

```typescript
// Launch multiple Explore agents at once
Task("Explore authentication system") +
Task("Explore authorization/permissions") +
Task("Explore session management")

// All three run simultaneously
// You get three focused summaries
// Much faster than sequential exploration
```

### Pattern 2: Explore → Plan → Execute

For implementing new features:

```typescript
// Step 1: Understand current implementation
Task("Explore existing user profile system", subagent_type: "Explore")

// Step 2: Plan the new feature (after reviewing exploration results)
Task("Plan adding profile picture upload", subagent_type: "Plan")

// Step 3: Execute based on plan
// You implement based on the plan
// Then commit with git-commit-guardian
```

## When NOT to Use Agents

Agents are powerful but not always necessary:

**Don't use agents when:**

1. **You know the exact file**: Use Read tool directly
   ```typescript
   // Don't: Task("Read config.json")
   // Do: Read("config.json")
   ```

2. **Simple, single-file edits**: Just edit directly
   ```typescript
   // Don't: Task("Add a comment to line 50")
   // Do: Edit the file directly
   ```

3. **Quick terminal commands**: Use Bash tool
   ```typescript
   // Don't: Task("Run npm install")
   // Do: Bash("npm install")
   ```

## Troubleshooting

### "Agent found too many results"

**Problem:** Agent returns overwhelming summary.

**Solution:** Be more specific in your prompt.
```typescript
// Before: "Explore the application"
// After: "Find where user passwords are hashed"
```

### "Agent didn't find what I need"

**Problem:** Agent missed relevant code.

**Solutions:**
- Increase thoroughness level to "very thorough"
- Provide more specific search terms
- Try different phrasing of what you're looking for
- Give the agent file path hints if you have them

## Next Steps

Now that you understand AI agents:

1. **Practice with Explore Agent**
   - Try exploring your current project's main features
   - Experiment with different thoroughness levels
   - Compare results with manual exploration

2. **Use Plan Agent for Features**
   - Next time you implement something complex, try planning with an agent first
   - Compare the plan to what you would have done intuitively
   - Iterate on the plan before implementing

3. **Master Parallel Execution**
   - Practice launching multiple agents at once
   - Measure the time savings
   - Notice the context window benefits

## Additional Resources

- [Claude Code Documentation](https://docs.claude.com/claude-code)
- [Agent Tool Reference](https://docs.claude.com/claude-code/tools/task)
- [Context Window Deep Dive](/docs/agents/context-window-deep-dive)
- [Example Agent Workflows](/docs/agents/examples)

---

**Questions?** Open an [issue](https://github.com/GonzaSab/aipaths-academy-content/issues) or join our community discussions!
