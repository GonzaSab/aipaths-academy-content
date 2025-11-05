# AIPaths Academy Content Repository

Official content repository for [AIPaths Academy](https://aipaths-academy.vercel.app) - A bilingual platform for learning AI development.

## What's Inside

This repository contains all the educational content for AIPaths Academy:

- **Documentation** - Comprehensive guides on Claude AI, AI Agents, MCP, and more
- **Blog Posts** - Tutorials, articles, and insights
- **Templates** - Ready-to-use templates for creating new content

## Languages

All content is available in:
- English (`/en/`)
- Spanish (`/es/`)

## Repository Structure

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

/templates/                    # Content templates
  doc-template.md
  blog-template.md
```

### How It Works

- **Language folders** (`/en/`, `/es/`) organize content by language
- **Numeric prefixes** (`001_`, `002_`, `003_`) control the display order
- **Filenames** use language suffixes: `.en.md` or `.es.md`
- **URLs** are generated from the filename (without prefix and language suffix)
  - Example: `001_getting-started.en.md` → `/getting-started`

## Quick Start

### For Contributors

**1. Fork and clone this repository**

```bash
git clone https://github.com/YOUR-USERNAME/aipaths-academy-content.git
cd aipaths-academy-content
```

**2. Create new content using templates**

For documentation:
```bash
# Find the next available number (e.g., if last is 003_, use 004_)
cp templates/doc-template.md en/docs/004_your-topic.en.md
```

For blog posts:
```bash
# Find the next available number
cp templates/blog-template.md en/blogs/002_your-post.en.md
```

**3. Edit in your favorite editor**

- Use Obsidian for a visual, organized editing experience
- Use VS Code, Sublime, or any markdown editor
- Edit directly on GitHub

**4. Commit and push**

```bash
git add .
git commit -m "docs: Add guide on your topic"
git push origin main
```

**5. Create a pull request**

Your content will be reviewed and merged!

### For Obsidian Users

This repository is optimized for Obsidian:

1. **Open as vault**: File → Open folder as vault → Select this repository
2. **Browse visually**: Navigate through topic folders
3. **Use templates**: Copy from `/templates/` folder
4. **Drag and drop**: Images, files, everything just works
5. **Commit**: Use Obsidian Git plugin or terminal

## Content Guidelines

### Frontmatter Format

**For Documentation:**
```yaml
---
title: "Your Document Title"
description: "Brief description (max 160 characters)"
tags: ["tag1", "tag2", "tag3"]
published: true
lastUpdated: "2025-01-05"
author: "Your Name"
---
```

**For Blog Posts:**
```yaml
---
title: "Your Blog Post Title"
description: "Compelling description"
author: "Your Name"
publishedAt: "2025-01-05"
tags: ["topic1", "topic2"]
readingTime: 8
published: true
---
```

### Tags (Not Categories)

We use **flexible tags** instead of rigid categories:

**Good tags:**
- `["claude", "getting-started", "api", "beginner"]`
- `["deployment", "nextjs", "vercel", "production"]`
- `["agents", "context-window", "advanced"]`

**Tag guidelines:**
- Use 4-6 tags per document
- Be specific but reusable
- Think about searchability
- Describe the content accurately

### Writing Style

- **Clear**: Avoid unnecessary jargon
- **Practical**: Include real examples
- **Beginner-friendly**: Explain concepts simply
- **Professional**: Maintain a helpful, respectful tone

## Workflow

### Simple 4-Step Process

1. **Write** - Create or edit content in your preferred editor
2. **Test** - Verify code examples work and links are valid
3. **Commit** - Push to your fork
4. **Submit PR** - Request review and merge

### Bilingual Content

Creating content in both languages:

1. Create English version first: `your-doc.en.md`
2. Copy to Spanish: `cp your-doc.en.md your-doc.es.md`
3. Translate thoughtfully (not just machine translation)
4. Keep structure identical between languages

## Examples

### Adding a New Guide

```bash
# 1. Determine the next number (check existing files in /en/docs/)
# If last file is 003_superclaude.en.md, use 004_

# 2. Copy template with numeric prefix
cp templates/doc-template.md en/docs/004_claude-streaming.en.md

# 3. Edit the file (fill in frontmatter, write content)

# 4. Create Spanish version
cp en/docs/004_claude-streaming.en.md es/docs/004_claude-streaming.es.md

# 5. Translate Spanish version

# 6. Commit
git add .
git commit -m "docs: Add guide on Claude streaming responses"
git push
```

### Adding a Blog Post

```bash
# 1. Determine the next number (check existing files in /en/blogs/)
# If last file is 001_getting-started-with-claude.en.md, use 002_

# 2. Copy template with numeric prefix
cp templates/blog-template.md en/blogs/002_my-first-ai-app.en.md

# 3. Write your post

# 4. Commit
git add .
git commit -m "blog: Create tutorial for building first AI app"
git push
```

## Code Examples

All code must:
- Work as written
- Include clear comments
- Use environment variables for secrets
- Handle errors properly

Example:
```typescript
import Anthropic from '@anthropic-ai/sdk';

// Use environment variables, never hardcode keys
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function example() {
  try {
    // Always include error handling
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: 'Hello!' }],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

## Resources

- **Contributing Guide**: See [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Doc Template**: [templates/doc-template.md](./templates/doc-template.md)
- **Blog Template**: [templates/blog-template.md](./templates/blog-template.md)
- **Issues**: [Report bugs or suggest content](https://github.com/GonzaSab/aipaths-academy-content/issues)
- **Discussions**: [Ask questions](https://github.com/GonzaSab/aipaths-academy-content/discussions)

## License

This content is licensed under [CC BY 4.0](./LICENSE).

You're free to:
- Share and redistribute
- Adapt and build upon
- Use commercially

Just provide attribution to AIPaths Academy.

## Questions?

- **Content questions**: [Open a Discussion](https://github.com/GonzaSab/aipaths-academy-content/discussions)
- **Bug reports**: [Open an Issue](https://github.com/GonzaSab/aipaths-academy-content/issues)
- **Pull requests**: [Contributing Guide](./CONTRIBUTING.md)

---

Built with care for the AI development community.
