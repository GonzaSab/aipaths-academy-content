# Contributing to AIPaths Academy Content

Thank you for your interest in contributing! This repository is designed to be simple and easy to use—you can edit in Obsidian, your favorite text editor, or directly on GitHub.

## Repository Structure

This repository uses a simple, language-based structure with numeric prefixes for ordering:

```
/en/                           # English content
  /docs/                       # Documentation
    001_ai-agents-guide.en.md
    002_claude-context-window.en.md
    003_superclaude.en.md
  /blogs/                      # Blog posts
    001_getting-started-with-claude.en.md

/es/                           # Spanish content
  /docs/                       # Documentation (Spanish versions)
    001_ai-agents-guide.es.md
    002_claude-context-window.es.md
    003_superclaude.es.md
  /blogs/                      # Blog posts (Spanish versions)
    001_comenzando-con-claude.es.md

/templates/                    # Templates for creating new content
  doc-template.md
  blog-template.md
```

### Important Naming Convention

All files use numeric prefixes and language suffixes:
- **Numeric prefix**: `001_`, `002_`, `003_` - Controls display order
- **Language suffix**: `.en.md` (English) or `.es.md` (Spanish)

The filename (without prefix and language suffix) becomes the URL slug:
- `001_getting-started.en.md` → `/getting-started`
- `002_ai-agents-guide.es.md` → `/ai-agents-guide`

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

Check existing files in `/en/docs/` to find the highest number (e.g., if last is `003_`, use `004_`)

**Step 2:** Copy the template with numeric prefix

```bash
# If the last file is 003_superclaude.en.md, use 004_
cp templates/doc-template.md en/docs/004_your-topic.en.md
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
# Use the same numeric prefix
cp en/docs/004_your-topic.en.md es/docs/004_your-topic.es.md
```

Then translate the content. Don't just use machine translation—review and adjust for natural language.

### Adding Blog Posts

**Step 1:** Determine the next number and copy the template

```bash
# Check existing files in /en/blogs/ for the highest number
# If the last file is 001_getting-started-with-claude.en.md, use 002_
cp templates/blog-template.md en/blogs/002_your-post-title.en.md
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
