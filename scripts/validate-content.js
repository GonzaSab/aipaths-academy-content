#!/usr/bin/env node

/**
 * Content Validation Script for AIPaths Academy
 *
 * Validates markdown/mdx files for:
 * - Heading structure (single H1, proper hierarchy)
 * - Frontmatter completeness and format
 * - MDX syntax issues
 * - File naming conventions
 *
 * Usage:
 *   node scripts/validate-content.js                    # Validate all
 *   node scripts/validate-content.js path/to/file.md    # Single file
 *   node scripts/validate-content.js --changed          # Only git changes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
};

const icons = {
  error: '🔴',
  warning: '🟡',
  info: '💡',
  success: '✅',
};

// Validation rules configuration
const RULES = {
  ERROR: [
    'single-h1',
    'required-frontmatter',
    'valid-locale',
    'mdx-syntax',
    'code-block-language',
  ],
  WARNING: [
    'h2-count',
    'heading-hierarchy',
    'h2-length',
    'description-length',
    'tag-count',
    'empty-sections',
  ],
  INFO: [
    'code-language-specified',
    'reading-time',
  ],
};

class ValidationResult {
  constructor(filePath) {
    this.filePath = filePath;
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  addError(message, line = null) {
    this.errors.push({ message, line });
  }

  addWarning(message, line = null) {
    this.warnings.push({ message, line });
  }

  addInfo(message, line = null) {
    this.info.push({ message, line });
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  hasIssues() {
    return this.errors.length > 0 || this.warnings.length > 0;
  }

  print() {
    const filename = path.relative(process.cwd(), this.filePath);

    if (!this.hasIssues()) {
      console.log(`${icons.success} ${colors.green}${filename}${colors.reset}`);
      return;
    }

    console.log(`\n${colors.gray}${'─'.repeat(80)}${colors.reset}`);
    console.log(`📄 ${colors.blue}${filename}${colors.reset}`);
    console.log(`${colors.gray}${'─'.repeat(80)}${colors.reset}`);

    if (this.errors.length > 0) {
      this.errors.forEach(({ message, line }) => {
        const location = line ? ` ${colors.gray}(line ${line})${colors.reset}` : '';
        console.log(`  ${icons.error} ${colors.red}ERROR${colors.reset}: ${message}${location}`);
      });
    }

    if (this.warnings.length > 0) {
      this.warnings.forEach(({ message, line }) => {
        const location = line ? ` ${colors.gray}(line ${line})${colors.reset}` : '';
        console.log(`  ${icons.warning} ${colors.yellow}WARNING${colors.reset}: ${message}${location}`);
      });
    }

    if (this.info.length > 0) {
      this.info.forEach(({ message, line }) => {
        const location = line ? ` ${colors.gray}(line ${line})${colors.reset}` : '';
        console.log(`  ${icons.info} ${colors.blue}INFO${colors.reset}: ${message}${location}`);
      });
    }
  }
}

function validateFile(filePath) {
  const result = new ValidationResult(filePath);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Parse frontmatter
    const frontmatter = parseFrontmatter(content);
    const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');

    // Run all validations
    validateHeadingStructure(bodyContent, result);
    validateFrontmatter(frontmatter, result);
    validateLocale(filePath, frontmatter, result);
    validateMDXSyntax(bodyContent, result);
    validateCodeBlocks(bodyContent, result);
    validateQuality(bodyContent, frontmatter, result);

  } catch (error) {
    result.addError(`Failed to read or parse file: ${error.message}`);
  }

  return result;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatterText = match[1];
  const frontmatter = {};
  const lines = frontmatterText.split('\n');

  let currentKey = null;
  let currentArray = null;

  lines.forEach(line => {
    // Check if it's an array item (starts with -)
    if (line.trim().startsWith('-') && currentArray !== null) {
      const item = line.trim().substring(1).trim().replace(/^["']|["']$/g, '');
      currentArray.push(item);
      return;
    }

    // Check if it's a key: value line
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');

      // Handle inline arrays [item1, item2]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        frontmatter[key] = value;
        currentKey = null;
        currentArray = null;
      }
      // Empty value after colon - might be start of multi-line array
      else if (value === '') {
        currentKey = key;
        currentArray = [];
        frontmatter[key] = currentArray;
      }
      // Regular key: value
      else {
        frontmatter[key] = value;
        currentKey = null;
        currentArray = null;
      }
    }
  });

  return frontmatter;
}

function validateHeadingStructure(content, result) {
  const lines = content.split('\n');
  let inCodeBlock = false;
  let h1Count = 0;
  let h1Line = null;
  const headings = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) return;

    // Check for headings
    const h1Match = line.match(/^#\s+[^#]/);
    const h2Match = line.match(/^##\s+[^#]/);
    const h3Match = line.match(/^###\s+[^#]/);
    const h4Match = line.match(/^####\s+[^#]/);

    if (h1Match) {
      h1Count++;
      h1Line = lineNum;
      headings.push({ level: 1, line: lineNum, text: line });
    } else if (h2Match) {
      headings.push({ level: 2, line: lineNum, text: line });
    } else if (h3Match) {
      headings.push({ level: 3, line: lineNum, text: line });
    } else if (h4Match) {
      headings.push({ level: 4, line: lineNum, text: line });
    }
  });

  // ERROR: Must have exactly 1 H1
  if (h1Count === 0) {
    result.addError('No H1 heading found. Document must have exactly one H1 title.');
  } else if (h1Count > 1) {
    result.addError(`Multiple H1 headings found (${h1Count}). Only the document title should be H1.`, h1Line);
  }

  // WARNING: Should have at least 3 H2 sections for good navigation
  const h2Count = headings.filter(h => h.level === 2).length;
  if (h2Count < 3) {
    result.addWarning(`Only ${h2Count} H2 sections found. Recommended: 3+ for "On This Page" navigation.`);
  }

  // WARNING: Check heading hierarchy (no skipping levels)
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1];
    const curr = headings[i];

    if (curr.level - prev.level > 1) {
      result.addWarning(
        `Heading hierarchy skip: H${prev.level} → H${curr.level}. Use progressive hierarchy.`,
        curr.line
      );
    }
  }

  // WARNING: H2 headings should be concise (2-8 words)
  headings.filter(h => h.level === 2).forEach(heading => {
    const text = heading.text.replace(/^##\s+/, '');
    const wordCount = text.trim().split(/\s+/).length;

    if (wordCount > 8) {
      result.addWarning(
        `H2 heading too long (${wordCount} words): "${text.substring(0, 50)}...". Keep under 8 words.`,
        heading.line
      );
    }
  });
}

function validateFrontmatter(frontmatter, result) {
  if (!frontmatter) {
    result.addError('No frontmatter found. Frontmatter is required.');
    return;
  }

  // ERROR: Required fields
  const required = ['title', 'description', 'tags'];
  required.forEach(field => {
    if (!frontmatter[field]) {
      result.addError(`Missing required frontmatter field: "${field}"`);
    }
  });

  // WARNING: Description length (SEO best practice)
  if (frontmatter.description) {
    const length = frontmatter.description.length;
    if (length > 160) {
      result.addWarning(`Description too long (${length} chars). Recommended: under 160 for SEO.`);
    }
  }

  // WARNING: Tag count
  if (frontmatter.tags) {
    const tagCount = Array.isArray(frontmatter.tags) ? frontmatter.tags.length : 0;
    if (tagCount < 4) {
      result.addWarning(`Only ${tagCount} tags. Recommended: 4-8 tags for better discoverability.`);
    } else if (tagCount > 8) {
      result.addWarning(`Too many tags (${tagCount}). Recommended: 4-8 tags.`);
    }
  }
}

function validateLocale(filePath, frontmatter, result) {
  const filename = path.basename(filePath);

  // ERROR: Filename must have locale (.en.md or .es.md)
  if (!filename.match(/\.(en|es)\.(md|mdx)$/)) {
    result.addError(
      `Filename must include locale: "${filename}" should be "*.en.md" or "*.es.md"`
    );
  }
}

function validateMDXSyntax(content, result) {
  const lines = content.split('\n');
  let inCodeBlock = false;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) return;

    // ERROR: Unescaped < before numbers or $
    if (line.match(/<\s*(\d|\$)/)) {
      result.addError(
        'Unescaped "<" before number/dollar sign. Use &lt; or wrap in backticks.',
        lineNum
      );
    }

    // ERROR: Unescaped curly braces in text
    if (line.match(/[^`]{[^`]+}[^`]/) && !line.trim().startsWith('```')) {
      const match = line.match(/({[^}]+})/);
      if (match) {
        result.addError(
          `Unescaped curly braces: "${match[1]}". Wrap in backticks or escape.`,
          lineNum
        );
      }
    }
  });
}

function validateCodeBlocks(content, result) {
  const codeBlockRegex = /```(\w*)\n/g;
  let match;
  const linesBefore = [];
  let currentLine = 1;

  content.split('\n').forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      const lang = line.trim().substring(3);

      // ERROR: Placeholder language
      if (lang.includes('[') || lang.toLowerCase() === 'language') {
        result.addError(
          `Invalid code block language: "${lang}". Use actual language (typescript, bash, etc).`,
          index + 1
        );
      }

      // INFO: Missing language (not an error but recommended)
      if (!lang && line.trim() === '```') {
        result.addInfo(
          'Code block without language specified. Consider adding for syntax highlighting.',
          index + 1
        );
      }
    }
  });
}

function validateQuality(content, frontmatter, result) {
  // INFO: Estimated reading time
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  if (readingTime < 2) {
    result.addInfo(`Short content (${readingTime} min read). Consider adding more detail.`);
  } else if (readingTime > 20) {
    result.addInfo(`Long content (${readingTime} min read). Consider breaking into multiple docs.`);
  }
}

function getFilesToValidate(args) {
  // Single file specified
  if (args.length > 0 && !args[0].startsWith('--')) {
    return [path.resolve(args[0])];
  }

  // Only changed files (git)
  if (args.includes('--changed')) {
    try {
      const changed = execSync('git diff --name-only --cached', { encoding: 'utf-8' })
        .split('\n')
        .filter(f => f.match(/\.(md|mdx)$/) && (f.startsWith('docs/') || f.startsWith('blogs/')))
        .map(f => path.resolve(f));

      if (changed.length === 0) {
        // If no staged files, check unstaged
        const unstaged = execSync('git diff --name-only', { encoding: 'utf-8' })
          .split('\n')
          .filter(f => f.match(/\.(md|mdx)$/) && (f.startsWith('docs/') || f.startsWith('blogs/')))
          .map(f => path.resolve(f));

        return unstaged;
      }

      return changed;
    } catch (error) {
      console.log(`${colors.yellow}Warning: Could not get git changes, validating all files.${colors.reset}`);
    }
  }

  // All docs and blogs
  const files = [];
  const scanDir = (dir) => {
    if (!fs.existsSync(dir)) return;

    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.match(/\.(md|mdx)$/)) {
        files.push(fullPath);
      }
    });
  };

  scanDir(path.join(process.cwd(), 'docs'));
  scanDir(path.join(process.cwd(), 'blogs'));

  return files;
}

function main() {
  const args = process.argv.slice(2);

  console.log(`\n${colors.blue}🔍 AIPaths Academy Content Validator${colors.reset}`);
  console.log(`${colors.gray}${'═'.repeat(80)}${colors.reset}\n`);

  const files = getFilesToValidate(args);

  if (files.length === 0) {
    console.log(`${colors.yellow}No files to validate.${colors.reset}\n`);
    process.exit(0);
  }

  console.log(`Validating ${files.length} file${files.length > 1 ? 's' : ''}...\n`);

  const results = files.map(validateFile);

  // Print results
  results.forEach(result => result.print());

  // Summary
  console.log(`\n${colors.gray}${'═'.repeat(80)}${colors.reset}`);

  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const totalInfo = results.reduce((sum, r) => sum + r.info.length, 0);
  const filesWithIssues = results.filter(r => r.hasIssues()).length;
  const filesClean = results.length - filesWithIssues;

  console.log(`\n📊 ${colors.blue}Summary${colors.reset}:`);
  console.log(`  ${icons.success} ${filesClean} file${filesClean !== 1 ? 's' : ''} passed`);
  if (filesWithIssues > 0) {
    console.log(`  ❌ ${filesWithIssues} file${filesWithIssues !== 1 ? 's' : ''} with issues`);
  }
  console.log(`  ${icons.error} ${totalErrors} error${totalErrors !== 1 ? 's' : ''}`);
  console.log(`  ${icons.warning} ${totalWarnings} warning${totalWarnings !== 1 ? 's' : ''}`);
  console.log(`  ${icons.info} ${totalInfo} info`);

  console.log('');

  // Exit code
  if (totalErrors > 0) {
    console.log(`${colors.red}❌ Validation failed with errors.${colors.reset}\n`);
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log(`${colors.yellow}⚠️  Validation passed with warnings.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.green}✅ All validations passed!${colors.reset}\n`);
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateFile, ValidationResult };
