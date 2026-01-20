/**
 * MCP Tools for Parchment Documentation
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface DocEntry {
  id: string;
  title: string;
  description: string;
  path: string;
  content: string;
  rawContent: string;
  category: string;
}

interface DocsIndex {
  version: string;
  generatedAt: string;
  docs: DocEntry[];
  openapi: string;
}

interface SearchResult {
  title: string;
  description: string;
  path: string;
  category: string;
  snippet: string;
  score: number;
}

/**
 * Load the pre-built docs index
 */
function loadDocsIndex(): DocsIndex | null {
  const indexPath = join(__dirname, 'content', 'docs.json');
  if (!existsSync(indexPath)) {
    console.error('Docs index not found. Run "npm run build:content" first.');
    return null;
  }
  try {
    const content = readFileSync(indexPath, 'utf-8');
    return JSON.parse(content) as DocsIndex;
  } catch (error) {
    console.error('Error loading docs index:', error);
    return null;
  }
}

/**
 * Simple text search scoring
 */
function calculateScore(doc: DocEntry, queryTerms: string[]): number {
  let score = 0;
  const titleLower = doc.title.toLowerCase();
  const descLower = doc.description.toLowerCase();
  const contentLower = doc.content.toLowerCase();

  for (const term of queryTerms) {
    // Title matches are weighted highest
    if (titleLower.includes(term)) {
      score += 10;
    }
    // Description matches are weighted medium
    if (descLower.includes(term)) {
      score += 5;
    }
    // Content matches are weighted lowest but still count
    const contentMatches = (contentLower.match(new RegExp(term, 'g')) || []).length;
    score += Math.min(contentMatches, 5); // Cap content matches
  }

  return score;
}

/**
 * Extract a relevant snippet from content
 */
function extractSnippet(content: string, queryTerms: string[], maxLength: number = 200): string {
  const contentLower = content.toLowerCase();

  // Find the first occurrence of any query term
  let bestIndex = -1;
  for (const term of queryTerms) {
    const index = contentLower.indexOf(term);
    if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
      bestIndex = index;
    }
  }

  if (bestIndex === -1) {
    // No match found, return beginning of content
    return content.slice(0, maxLength) + (content.length > maxLength ? '...' : '');
  }

  // Extract snippet around the match
  const start = Math.max(0, bestIndex - 50);
  const end = Math.min(content.length, bestIndex + maxLength - 50);

  let snippet = content.slice(start, end);

  // Add ellipsis if truncated
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';

  return snippet;
}

/**
 * Search through documentation
 */
function searchDocs(query: string, limit: number = 5): SearchResult[] {
  const index = loadDocsIndex();
  if (!index) {
    return [];
  }

  // Tokenize query
  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(term => term.length > 2);

  if (queryTerms.length === 0) {
    return [];
  }

  // Score and rank documents
  const results: SearchResult[] = index.docs
    .map(doc => ({
      title: doc.title,
      description: doc.description,
      path: doc.path,
      category: doc.category,
      snippet: extractSnippet(doc.content, queryTerms),
      score: calculateScore(doc, queryTerms),
    }))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

/**
 * Register tools with the MCP server
 */
export function registerTools(server: McpServer): void {
  server.tool(
    'search_docs',
    'Search through Parchment API documentation. Returns matching documents with relevant snippets. Use this to find information about authentication, API endpoints, webhooks, SSO, and integration patterns.',
    {
      query: z.string().describe('Search query - can include multiple terms'),
      limit: z.number().optional().default(5).describe('Maximum number of results to return (default: 5)'),
    },
    async ({ query, limit }) => {
      const results = searchDocs(query, limit ?? 5);

      if (results.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: `No results found for "${query}". Try different search terms or browse available resources.`,
          }],
        };
      }

      const formattedResults = results.map((result, index) => {
        return `## ${index + 1}. ${result.title}
**Category:** ${result.category}
**Path:** ${result.path}
**Description:** ${result.description}

**Snippet:**
${result.snippet}
`;
      }).join('\n---\n\n');

      return {
        content: [{
          type: 'text' as const,
          text: `Found ${results.length} result(s) for "${query}":\n\n${formattedResults}`,
        }],
      };
    }
  );

  server.tool(
    'list_resources',
    'List all available Parchment documentation resources. Use this to discover what documentation is available.',
    {},
    async () => {
      const index = loadDocsIndex();
      if (!index) {
        return {
          content: [{
            type: 'text' as const,
            text: 'Documentation index not available. Please ensure the MCP server is properly built.',
          }],
        };
      }

      const byCategory = new Map<string, DocEntry[]>();
      for (const doc of index.docs) {
        const existing = byCategory.get(doc.category) || [];
        existing.push(doc);
        byCategory.set(doc.category, existing);
      }

      let output = '# Parchment Documentation Resources\n\n';

      for (const [category, docs] of byCategory) {
        output += `## ${category}\n\n`;
        for (const doc of docs) {
          output += `- **${doc.title}**\n`;
          output += `  - ${doc.description}\n`;
          output += `  - URI: \`parchment://docs/${doc.id}\`\n\n`;
        }
      }

      return {
        content: [{
          type: 'text' as const,
          text: output,
        }],
      };
    }
  );

  server.tool(
    'get_openapi_spec',
    'Get the complete OpenAPI 3.0 specification for the Parchment API. This includes all endpoints, request/response schemas, and authentication details.',
    {},
    async () => {
      const index = loadDocsIndex();
      if (!index?.openapi) {
        return {
          content: [{
            type: 'text' as const,
            text: 'OpenAPI specification not found.',
          }],
        };
      }

      return {
        content: [{
          type: 'text' as const,
          text: index.openapi,
        }],
      };
    }
  );
}
