# Contributing to AIPaths Academy Content

Thank you for your interest in contributing! This repository is designed to be simple and easy to use—you can edit in Obsidian, your favorite text editor, or directly on GitHub.

## Repository Structure

This repository uses a content-first structure with numeric prefixes for ordering:

```
/blogs/                        # Blog posts
  /001_getting-started/        # Each post in its own folder
    001_getting-started.en.md  # English version
    001_getting-started.es.md  # Spanish version
  /002_ai-agents/
    002_ai-agents.en.md
    002_ai-agents.es.md

/docs/                         # Documentation
  /001_ai-agents-guide/        # Each doc in its own folder
    001_ai-agents-guide.en.md  # English version
    001_ai-agents-guide.es.md  # Spanish version
  /002_claude-context-window/
    002_claude-context-window.en.md
    002_claude-context-window.es.md
  /003_superclaude/
    003_superclaude.en.md
    003_superclaude.es.md

/templates/                    # Templates for creating new content
  doc-template.md
  blog-template.md
```

### Important Naming Convention

All content is organized in folders with matching filenames:
- **Folder name**: `001_title-slug/` - Controls display order and URL
- **File names**: `001_title-slug.en.md` and `001_title-slug.es.md` - Must match folder name
- **Language suffix**: `.en.md` (English) or `.es.md` (Spanish)

The folder name (without prefix) becomes the URL slug:
- `blogs/001_getting-started/` → `/getting-started`
- `docs/002_ai-agents-guide/` → `/ai-agents-guide`

## How to Contribute

### Quick Start

1. **Fork this repository** on GitHub
2. **Clone your fork** to your computer
3. **Create/edit** files in the appropriate language folder
4. **Use templates** from `/templates/` for structure
5. **Commit and push** your changes
6. **Create a pull request**

### Adding New Documentation

**Step 1:** Determine the next number

Check existing folders in `/docs/` to find the highest number (e.g., if last is `003_`, use `004_`)

**Step 2:** Create folder and copy template

```bash
# If the last folder is 003_superclaude, use 004_
mkdir docs/004_your-topic
cp templates/doc-template.md docs/004_your-topic/004_your-topic.en.md
```

**Step 3:** Fill in the frontmatter

```yaml
---
title: "Your Document Title"
description: "Brief description (max 160 characters)"
tags: ["topic1", "topic2", "related-concept"]
published: true
lastUpdated: "2025-01-05"
author: "Your Name"
---
```

**Important notes about frontmatter:**
- `tags`: Use descriptive tags for search and organization (no rigid categories!)
- `published`: Set to `false` for drafts
- `lastUpdated`: Use ISO date format (YYYY-MM-DD)
- `description`: Keep under 160 characters for SEO

**Step 4:** Write your content

Follow the template structure. Key guidelines:
- Use clear headings (H2 for main sections, H3 for subsections)
- Include code examples with language tags
- Add practical examples readers can try
- Link to related content

**Step 5:** Create Spanish version (optional but encouraged)

```bash
# Create Spanish version in the same folder
cp docs/004_your-topic/004_your-topic.en.md docs/004_your-topic/004_your-topic.es.md
```

Then translate the content. Don't just use machine translation—review and adjust for natural language.

### Adding Blog Posts

**Step 1:** Determine the next number and copy the template

```bash
# Check existing folders in /blogs/ for the highest number
# If the last folder is 001_getting-started, use 002_
mkdir blogs/002_your-post-title
cp templates/blog-template.md blogs/002_your-post-title/002_your-post-title.en.md
```

**Step 2:** Fill in the frontmatter

```yaml
---
title: "Your Engaging Blog Post Title"
description: "Compelling description (150-160 characters)"
author: "Your Name"
publishedAt: "2025-01-05"
tags: ["topic1", "topic2", "tutorial"]
readingTime: 8
published: true
---
```

**Step 3:** Write engaging content

Blog posts should be:
- **Personal**: Share your experience or perspective
- **Practical**: Include code examples and real scenarios
- **Actionable**: Give readers something to do or try
- **Conversational**: Write like you're explaining to a friend

### Editing Existing Content

1. Find the file you want to edit
2. Make your changes
3. Update the `lastUpdated` date in frontmatter
4. Commit with a clear message: `fix: Correct API endpoint in getting-started guide`

## Content Guidelines

### Writing Style

- **Clear and concise**: Avoid jargon unless necessary
- **Beginner-friendly**: Explain concepts simply
- **Practical**: Focus on real-world use cases
- **Professional**: Maintain a respectful, helpful tone

### Formatting

**Code Blocks:**
Always specify the language:

````markdown
```typescript
const example = "like this";
```
````

**CRITICAL - Valid Language Identifiers:**
Never use placeholder text like `[language]` in code blocks. Use actual language names:
- ✅ Good: `typescript`, `javascript`, `python`, `bash`, `json`, `yaml`, `text`, `markdown`
- ❌ Bad: `[language]`, `[code]`, `your-language`

**Callouts:**
Use for important notes:

```markdown
> **Note**: Important information here

> **Warning**: Critical security consideration

> **Pro Tip**: Helpful shortcut or best practice
```

**Links:**
- Use descriptive text: `[Claude API Documentation](https://docs.anthropic.com)`
- Not: `[Click here](https://docs.anthropic.com)`

## MDX Compilation Rules (CRITICAL)

Our documentation uses MDX, which combines Markdown with JSX. This means certain characters are interpreted as code. **Follow these rules to avoid compilation errors:**

### 1. Comparison Operators MUST Be Escaped

**The Problem:** MDX interprets `<` as the start of a JSX tag.

**Examples that BREAK:**
```markdown
❌ Hardware with <16GB RAM
❌ Response time <100ms
❌ Budget <$50/month
❌ Use for <10,000 users
```

**Correct Usage:**
```markdown
✅ Hardware with &lt;16GB RAM
✅ Response time &lt;100ms
✅ Budget &lt;$50/month
✅ Use for &lt;10,000 users
```

**Rule:** Always replace `<` with `&lt;` when followed by a number or dollar sign in regular text.

**Where This Applies:**
- ✅ Regular text and paragraphs
- ✅ List items (both ordered and unordered)
- ✅ Inside code blocks (plain text, not fenced)
- ✅ Headings
- ✅ Table cells
- ⚠️ Inside fenced code blocks (` ``` `), you can usually use `<` directly, but escape if you see errors

### 2. Greater Than Operators

**The Problem:** MDX can confuse `>` in certain contexts.

**Safer Approach:**
```markdown
❌ Users >1000
✅ Users &gt;1000

❌ Memory >8GB
✅ Memory &gt;8GB
```

**Rule:** When in doubt, escape `>` as `&gt;` in regular text.

### 3. Curly Braces in Text

**The Problem:** MDX interprets `{` and `}` as JavaScript expressions.

**Examples that BREAK:**
```markdown
❌ The object {name: "value"} is invalid
❌ Use the pattern {id} in your code
```

**Correct Usage:**
```markdown
✅ The object `{name: "value"}` is invalid  (wrapped in backticks)
✅ Use the pattern \{id\} in your code      (escaped with backslash)
```

**Rule:** Wrap curly braces in backticks (inline code) or escape them with backslashes.

### 4. Ampersands in URLs and Text

**The Problem:** `&` is an HTML entity marker and can cause issues.

**Examples:**
```markdown
⚠️ Use ?param1=value&param2=value  (might work but risky)
✅ Use ?param1=value&amp;param2=value
✅ Use `?param1=value&param2=value`  (in backticks is safe)
```

**Rule:** In regular text, use `&amp;` for ampersands. In code blocks or inline code, regular `&` is fine.

### 5. HTML Comments

**The Problem:** MDX processes HTML comments, which can cause issues.

**Avoid:**
```markdown
❌ <!-- This is a comment -->
```

**Better:**
```markdown
✅ [//]: # (This is a comment)
✅ Just delete the comment
```

**Rule:** Use Markdown-style comments `[//]: # (comment)` or remove comments entirely.

### 6. Self-Closing Tags

**The Problem:** Malformed self-closing tags cause errors.

**Examples that BREAK:**
```markdown
❌ <Component/ >     (space before >)
❌ <img src="x"/m>   (invalid character after /)
```

**Correct Usage:**
```markdown
✅ <Component />
✅ <img src="x" />
```

**Rule:** Use proper JSX syntax for any HTML/JSX tags, or avoid them entirely in Markdown.

### 7. Unescaped Hash in URLs

**The Problem:** Hashes can interfere with heading syntax.

**Safer Approach:**
```markdown
⚠️ Visit https://example.com#section
✅ Visit <https://example.com#section>
✅ Visit `https://example.com#section`
✅ [Visit Link](https://example.com#section)
```

**Rule:** Wrap URLs containing `#` in angle brackets, backticks, or use proper link syntax.

## Quick Reference: Characters to Watch

| Character | When to Escape | HTML Entity | Example |
|-----------|---------------|-------------|---------|
| `<` | Before numbers/$ | `&lt;` | `&lt;100ms` |
| `>` | Before numbers | `&gt;` | `&gt;1000` |
| `&` | In text (not code) | `&amp;` | `Smith &amp; Co` |
| `{` `}` | Always in text | Wrap in backticks | `` `{value}` `` |
| `[` `]` | In code blocks | Use language name | `` ```text`` not `` ```[language]`` |

## Testing Your Content

Before submitting, check for these common issues:

```bash
# Search for potential MDX errors in your file
grep -n "<[0-9$]" your-file.md      # Find unescaped < before numbers
grep -n "\[language\]" your-file.md # Find placeholder languages
grep -n "```\[" your-file.md        # Find invalid code blocks
```

## When You See MDX Errors

If you encounter an error like:
```
[next-mdx-remote] error compiling MDX:
Unexpected character `5` (U+0035) before name
```

This means:
1. You have `<5` or similar in your text
2. MDX thinks it's a JSX tag starting with a number (which is invalid)
3. **Solution:** Replace `<` with `&lt;`

**Other common errors:**
- `Unknown language: '[language]'` → Use actual language name in code blocks
- `Unexpected character after self-closing slash` → Fix malformed JSX/HTML tags
- `Expected '>' to close the tag` → Missing closing bracket in HTML/JSX

### Tags vs. Categories

**We use tags, not rigid categories.** This gives you flexibility:

**Good tags:**
- `["claude", "getting-started", "api", "beginner"]`
- `["deployment", "vercel", "nextjs", "production"]`
- `["agents", "context-window", "advanced"]`

**What makes a good tag:**
- Describes the content accurately
- Helps users find related content
- Specific enough to be useful
- Common enough to group content

**Avoid:**
- Too many tags (4-6 is ideal)
- Overly generic tags like "tutorial" alone
- Tags that are too specific to be reused

## Code Examples

### Requirements

All code examples must:
- **Work**: Test before submitting
- **Be clear**: Include comments explaining key parts
- **Be complete**: Include necessary imports and setup
- **Be secure**: No hardcoded secrets or API keys

### Example Format

```typescript
/**
 * Brief description of what this does
 */
import { SomePackage } from 'package-name';

// Setup with environment variables
const apiKey = process.env.API_KEY;

async function exampleFunction() {
  try {
    // Explain what this block does
    const result = await someOperation();
    return result;
  } catch (error) {
    // Always include error handling
    console.error('Operation failed:', error);
    throw error;
  }
}

// Show usage
const output = await exampleFunction();
console.log(output);
```

## Bilingual Content (EN/ES)

When creating content in both languages:

### Structure
- Keep file structure identical
- Use same filename (just change `.en.md` to `.es.md`)
- Match heading structure exactly

### Translation
- Don't rely solely on machine translation
- Translate idioms and expressions appropriately
- Keep technical terms consistent
- Maintain the same tone and style

### Code Examples
- Keep code identical between languages
- Translate comments and variable names if it aids understanding
- Translate output/results shown in comments

## Commit Message Format

Use clear, descriptive commit messages:

- `docs: Add guide on Claude streaming responses`
- `blog: Create tutorial for deploying Next.js apps`
- `fix: Correct code example in getting-started guide`
- `update: Refresh authentication guide with latest API`

**Format:**
- `docs:` - Documentation changes
- `blog:` - Blog post additions/changes
- `fix:` - Corrections or bug fixes
- `update:` - Refresh existing content
- `examples:` - Code example changes

## Pull Request Process

### Before Submitting

- [ ] Test all code examples
- [ ] Check all links work
- [ ] Proofread for typos and grammar
- [ ] Verify frontmatter is correct
- [ ] Ensure `.en.md` / `.es.md` naming is consistent

### PR Description

Include:
1. **What**: What content did you add/change?
2. **Why**: Why is this valuable?
3. **Testing**: How did you verify it works?
4. **Notes**: Anything reviewers should know?

### Review Process

1. Maintainers review within 3-5 business days
2. Address any feedback or requested changes
3. Once approved, content is merged
4. Changes go live automatically!

## Working in Obsidian

This repository is optimized for Obsidian editing:

### Workflow

1. **Open vault**: Open the repository folder in Obsidian
2. **Browse**: Navigate through language folders
3. **Create/Edit**: Use templates, drag images, create links
4. **Preview**: See how it looks in Obsidian's preview mode
5. **Commit**: Use git in terminal or Obsidian git plugin

### File Ordering

Numeric prefixes (`001_`, `002_`, `003_`) control the display order of documentation. This ensures content appears in a logical learning sequence.

### Obsidian Features

Use standard markdown. Avoid Obsidian-specific features like:
- `[[Wiki links]]` - Use `[standard markdown links](path)`
- Dataview queries
- Canvas files
- Obsidian-specific plugins

## Questions?

- **General questions**: [Open a Discussion](https://github.com/GonzaSab/aipaths-academy-content/discussions)
- **Bug reports**: [Open an Issue](https://github.com/GonzaSab/aipaths-academy-content/issues)
- **Content suggestions**: [Open an Issue](https://github.com/GonzaSab/aipaths-academy-content/issues)

## Recognition

Contributors are credited:
- In the `author` field of content
- In our contributors list
- In the project changelog

Thank you for helping make AI education accessible to everyone!
