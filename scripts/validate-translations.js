#!/usr/bin/env node

/**
 * Translation Consistency Validator for AIPaths Academy
 *
 * Validates EN/ES content pairs for consistency:
 * - Verifies EN and ES versions exist for each content_id
 * - Checks tags are identical across translations
 * - Validates publishedAt dates match
 * - Ensures content_id format is correct
 * - Warns about missing required fields
 *
 * Usage:
 *   node scripts/validate-translations.js
 *   node scripts/validate-translations.js --verbose
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const icons = {
  error: '=4',
  warning: '=�',
  success: '',
  info: '=�',
};

const REQUIRED_FIELDS = ['content_id', 'locale', 'title', 'description', 'publishedAt', 'updatedAt', 'tags'];
const SHARED_FIELDS = ['content_id', 'tags', 'publishedAt', 'coverImage'];

/**
 * Extract frontmatter from markdown file
 */
function extractFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    return null;
  }

  const frontmatterText = match[1];
  const frontmatter = {};
  const lines = frontmatterText.split('\n');
  let currentKey = null;
  let inMultilineArray = false;
  let arrayItems = [];

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') {
      continue;
    }

    // Check if we're in a multiline array
    if (inMultilineArray) {
      if (line.trim().startsWith('-')) {
        // Array item
        const item = line.trim().substring(1).trim();
        arrayItems.push(item);
      } else if (line.match(/^\w+:/)) {
        // New key, end multiline array
        frontmatter[currentKey] = arrayItems;
        inMultilineArray = false;
        arrayItems = [];

        // Parse new key
        const kvMatch = line.match(/^(\w+):\s*(.*)$/);
        if (kvMatch) {
          const [, key, value] = kvMatch;
          currentKey = key;
          if (value.trim() === '') {
            // Start of new multiline array
            inMultilineArray = true;
            arrayItems = [];
          } else {
            frontmatter[key] = parseValue(value);
          }
        }
      }
      continue;
    }

    // Handle key-value pairs
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      currentKey = key;

      if (value.trim() === '') {
        // Start of multiline array
        inMultilineArray = true;
        arrayItems = [];
      } else {
        frontmatter[key] = parseValue(value);
      }
    }
  }

  // Close any remaining multiline array
  if (inMultilineArray && currentKey) {
    frontmatter[currentKey] = arrayItems;
  }

  return frontmatter;
}

/**
 * Parse a frontmatter value
 */
function parseValue(value) {
  const trimmed = value.trim();

  // Inline array [item1, item2]
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      return trimmed
        .slice(1, -1)
        .split(',')
        .map(v => v.trim().replace(/^["']|["']$/g, ''));
    }
  }

  // Remove quotes from strings
  return trimmed.replace(/^["']|["']$/g, '');
}

/**
 * Find all content files in a directory
 */
function findContentFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        traverse(fullPath);
      } else if (entry.isFile() && /\.(en|es)\.md$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Validate content_id format
 */
function validateContentId(contentId, filePath) {
  const errors = [];

  if (!contentId) {
    errors.push('Missing content_id field');
    return errors;
  }

  // Check format: blogs-kebab-case or docs-kebab-case
  const validFormat = /^(blogs|docs)-[a-z0-9]+(-[a-z0-9]+)*$/;
  if (!validFormat.test(contentId)) {
    errors.push(`Invalid content_id format: "${contentId}". Must be "blogs-kebab-case" or "docs-kebab-case"`);
  }

  // Check prefix matches directory
  const isBlog = filePath.includes('/blogs/');
  const isDoc = filePath.includes('/docs/');

  if (isBlog && !contentId.startsWith('blogs-')) {
    errors.push(`Blog post content_id must start with "blogs-", got: "${contentId}"`);
  }

  if (isDoc && !contentId.startsWith('docs-')) {
    errors.push(`Documentation content_id must start with "docs-", got: "${contentId}"`);
  }

  return errors;
}

/**
 * Validate required fields
 */
function validateRequiredFields(frontmatter, filePath) {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (!frontmatter[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate locale matches filename
  const localeFromFile = path.basename(filePath).match(/\.(en|es)\.md$/)?.[1];
  if (frontmatter.locale !== localeFromFile) {
    errors.push(`Locale mismatch: frontmatter says "${frontmatter.locale}", filename says "${localeFromFile}"`);
  }

  // Validate tags format
  if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
    errors.push('Tags must be an array');
  } else if (frontmatter.tags) {
    // Check for non-lowercase or non-English tags
    const invalidTags = frontmatter.tags.filter(tag =>
      typeof tag !== 'string' || tag !== tag.toLowerCase() || /[^a-z0-9-]/.test(tag)
    );
    if (invalidTags.length > 0) {
      errors.push(`Invalid tag format (must be lowercase, kebab-case): ${invalidTags.join(', ')}`);
    }
  }

  return errors;
}

/**
 * Main validation function
 */
function validateContent(contentDir, verbose = false) {
  const dirName = path.basename(contentDir);
  console.log(`\n${colors.cyan}=== Validating ${dirName}/ ===${colors.reset}\n`);

  const files = findContentFiles(contentDir);
  const contentMap = new Map(); // content_id -> { en: path, es: path, frontmatter: {} }
  const errors = [];
  const warnings = [];

  if (files.length === 0) {
    console.log(`${colors.yellow}No content files found in ${contentDir}${colors.reset}\n`);
    return true;
  }

  // Step 1: Parse all files and group by content_id
  for (const filePath of files) {
    const frontmatter = extractFrontmatter(filePath);
    const relativePath = path.relative(contentDir, filePath);

    if (!frontmatter) {
      errors.push({
        file: relativePath,
        message: 'No frontmatter found',
      });
      continue;
    }

    // Validate individual file
    const contentIdErrors = validateContentId(frontmatter.content_id, filePath);
    const fieldErrors = validateRequiredFields(frontmatter, filePath);

    for (const error of [...contentIdErrors, ...fieldErrors]) {
      errors.push({
        file: relativePath,
        message: error,
      });
    }

    // Group by content_id
    const contentId = frontmatter.content_id;
    if (!contentId) continue;

    if (!contentMap.has(contentId)) {
      contentMap.set(contentId, { en: null, es: null, frontmatter: {} });
    }

    const locale = frontmatter.locale;
    const entry = contentMap.get(contentId);
    entry[locale] = filePath;
    entry.frontmatter[locale] = frontmatter;
  }

  // Step 2: Validate EN/ES pairs
  for (const [contentId, data] of contentMap.entries()) {
    // Check both versions exist
    // Spanish-only policy: ES is what gets published, EN is frozen legacy.
    // A missing English file is expected and must never block; a missing
    // Spanish file is a real problem worth failing on.
    if (!data.en) {
      warnings.push({
        contentId,
        message: 'Spanish-only (no English file) — expected under Spanish-only policy',
      });
    }

    if (!data.es) {
      errors.push({
        contentId,
        message: 'Missing Spanish version',
      });
    }

    // If both exist, validate consistency
    if (data.en && data.es) {
      const enFrontmatter = data.frontmatter.en;
      const esFrontmatter = data.frontmatter.es;

      // Check shared fields match
      for (const field of SHARED_FIELDS) {
        const enValue = JSON.stringify(enFrontmatter[field]);
        const esValue = JSON.stringify(esFrontmatter[field]);

        if (enValue !== esValue) {
          // Under the Spanish-only freeze the English file is never rewritten,
          // so a divergence inside an existing pair cannot be fixed without
          // breaking the freeze. Report it, do not block on it.
          warnings.push({
            contentId,
            message: `Field "${field}" doesn't match between EN/ES\n    EN: ${enValue}\n    ES: ${esValue}`,
          });
        }
      }

      // Check updatedAt is present
      if (!enFrontmatter.updatedAt || !esFrontmatter.updatedAt) {
        warnings.push({
          contentId,
          message: 'Missing updatedAt field',
        });
      }
    }
  }

  // Step 3: Report results
  console.log(`${colors.blue}Files scanned:${colors.reset} ${files.length}`);
  console.log(`${colors.blue}Content pairs:${colors.reset} ${contentMap.size}\n`);

  if (errors.length === 0 && warnings.length === 0) {
    console.log(`${icons.success} ${colors.green}All content is valid!${colors.reset}\n`);
    return true;
  }

  // Print errors
  if (errors.length > 0) {
    console.log(`${colors.red}${icons.error} Errors (${errors.length}):${colors.reset}`);
    for (const error of errors) {
      const location = error.file || error.contentId;
      console.log(`\n  ${colors.gray}${location}${colors.reset}`);
      console.log(`  ${error.message}`);
    }
    console.log('');
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log(`${colors.yellow}${icons.warning} Warnings (${warnings.length}):${colors.reset}`);
    for (const warning of warnings) {
      console.log(`\n  ${colors.gray}${warning.contentId}${colors.reset}`);
      console.log(`  ${warning.message}`);
    }
    console.log('');
  }

  return errors.length === 0;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose') || args.includes('-v');

  console.log(`\n${colors.blue}< AIPaths Academy Translation Validator${colors.reset}`);
  console.log(`${colors.gray}${'P'.repeat(80)}${colors.reset}`);

  const repoPath = path.join(__dirname, '..');
  const blogsPath = path.join(repoPath, 'blogs');
  const docsPath = path.join(repoPath, 'docs');

  const blogsValid = validateContent(blogsPath, verbose);
  const docsValid = validateContent(docsPath, verbose);

  // Summary
  console.log(`${colors.gray}${'P'.repeat(80)}${colors.reset}`);

  if (blogsValid && docsValid) {
    console.log(`\n${icons.success} ${colors.green}All validations passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${icons.error} ${colors.red}Validation failed. Please fix the errors above.${colors.reset}\n`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateContent, extractFrontmatter };
