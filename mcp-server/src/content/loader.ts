#!/usr/bin/env tsx
/**
 * Content Loader
 * Parses MDX files from the documentation directory and builds a search index.
 * Run with: npm run build:content
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface DocEntry {
  id: string;
  title: string;
  description: string;
  path: string;
  content: string;
  rawContent: string;  // Full MDX content for resources
  category: string;
}

interface DocsIndex {
  version: string;
  generatedAt: string;
  docs: DocEntry[];
  openapi: string;  // Bundled OpenAPI spec
}

// Documentation directory (parent of mcp-server)
const DOCS_ROOT = join(__dirname, '..', '..', '..');

// Files/directories to include
const INCLUDE_PATHS = [
  'partner-integration-guide.mdx',
  'post-integration-guide.mdx',
  'introduction.mdx',
  'authentication/partner/index.mdx',
  'authentication/partner/token-creation.mdx',
  'authentication/partner/scopes.mdx',
  'sso/sso-integration-generic.mdx',
  'sso/sso-integration-auth0.mdx',
  'sso/embedded-iframe.mdx',
  'webhooks/webhook-integration.mdx',
  'webhooks/webhook-events.mdx',
  'webhooks/webhook-verification.mdx',
  'docs/faq.mdx',
  'api-reference/introduction.mdx',
  'api-reference/response-standards.mdx',
];

/**
 * Extract frontmatter from MDX content
 */
function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterStr = match[1];
  const body = content.slice(match[0].length);

  const frontmatter: Record<string, string> = {};
  const lines = frontmatterStr.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body };
}

/**
 * Convert MDX to plain text for search
 */
function mdxToPlainText(content: string): string {
  return content
    // Remove code blocks but keep content readable
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove JSX/HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Remove markdown links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove headers markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove blockquotes
    .replace(/^>\s*/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Remove table formatting
    .replace(/\|/g, ' ')
    // Collapse multiple whitespace
    .replace(/\s+/g, ' ')
    // Trim
    .trim();
}

/**
 * Determine category from file path
 */
function getCategory(filePath: string): string {
  if (filePath.includes('authentication')) return 'Authentication';
  if (filePath.includes('sso')) return 'SSO';
  if (filePath.includes('webhook')) return 'Webhooks';
  if (filePath.includes('api-reference')) return 'API Reference';
  if (filePath.includes('faq')) return 'FAQ';
  return 'Guide';
}

/**
 * Generate doc ID from path
 */
function generateId(filePath: string): string {
  return filePath
    .replace(/\.mdx$/, '')
    .replace(/\//g, '-')
    .replace(/^-/, '');
}

/**
 * Load and parse a single MDX file
 */
function loadDoc(filePath: string): DocEntry | null {
  const fullPath = join(DOCS_ROOT, filePath);

  if (!existsSync(fullPath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }

  try {
    const rawContent = readFileSync(fullPath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(rawContent);
    const plainText = mdxToPlainText(body);

    return {
      id: generateId(filePath),
      title: frontmatter.title || filePath,
      description: frontmatter.description || '',
      path: filePath,
      content: plainText,
      rawContent: rawContent,  // Include full MDX for resources
      category: getCategory(filePath),
    };
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

/**
 * Main build function
 */
function buildIndex(): void {
  console.log('Building documentation index...');
  console.log(`Docs root: ${DOCS_ROOT}`);

  const docs: DocEntry[] = [];

  for (const filePath of INCLUDE_PATHS) {
    const doc = loadDoc(filePath);
    if (doc) {
      docs.push(doc);
      console.log(`  Indexed: ${doc.title} (${doc.category})`);
    }
  }

  // Load OpenAPI spec
  const openapiPath = join(DOCS_ROOT, 'api-reference', 'openapi.json');
  let openapi = '';
  if (existsSync(openapiPath)) {
    openapi = readFileSync(openapiPath, 'utf-8');
    console.log('  Bundled: OpenAPI specification');
  } else {
    console.warn('  Warning: OpenAPI spec not found');
  }

  const index: DocsIndex = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    docs,
    openapi,
  };

  const outputPath = join(__dirname, 'docs.json');
  writeFileSync(outputPath, JSON.stringify(index, null, 2));

  console.log(`\nIndex built successfully!`);
  console.log(`  Total docs: ${docs.length}`);
  console.log(`  Output: ${outputPath}`);
}

// Run if executed directly
buildIndex();
