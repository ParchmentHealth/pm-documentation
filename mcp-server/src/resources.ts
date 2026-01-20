/**
 * MCP Resources for Parchment Documentation
 * Reads from bundled docs.json - no filesystem access needed at runtime
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
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

let cachedIndex: DocsIndex | null = null;

/**
 * Load the bundled docs index
 */
function loadDocsIndex(): DocsIndex | null {
  if (cachedIndex) return cachedIndex;

  const indexPath = join(__dirname, 'content', 'docs.json');
  if (!existsSync(indexPath)) {
    console.error('Docs index not found. Package may not be built correctly.');
    return null;
  }
  try {
    const content = readFileSync(indexPath, 'utf-8');
    cachedIndex = JSON.parse(content) as DocsIndex;
    return cachedIndex;
  } catch (error) {
    console.error('Error loading docs index:', error);
    return null;
  }
}

/**
 * Resource URI to doc ID mapping
 */
const RESOURCE_MAP: Record<string, string> = {
  'parchment://docs/integration-guide': 'partner-integration-guide',
  'parchment://docs/post-integration-guide': 'post-integration-guide',
  'parchment://docs/authentication': 'authentication-partner-index',
  'parchment://docs/token-creation': 'authentication-partner-token-creation',
  'parchment://docs/scopes': 'authentication-partner-scopes',
  'parchment://docs/sso': 'sso-sso-integration-generic',
  'parchment://docs/sso-auth0': 'sso-sso-integration-auth0',
  'parchment://docs/embedded-iframe': 'sso-embedded-iframe',
  'parchment://docs/webhooks': 'webhooks-webhook-integration',
  'parchment://docs/webhook-events': 'webhooks-webhook-events',
  'parchment://docs/webhook-verification': 'webhooks-webhook-verification',
  'parchment://docs/faq': 'docs-faq',
  'parchment://docs/api-introduction': 'api-reference-introduction',
  'parchment://docs/response-standards': 'api-reference-response-standards',
  'parchment://docs/introduction': 'introduction',
};

/**
 * Get document content by URI
 */
function getDocContent(uri: string): string | null {
  if (uri === 'parchment://openapi') {
    const index = loadDocsIndex();
    return index?.openapi || null;
  }

  const docId = RESOURCE_MAP[uri];
  if (!docId) return null;

  const index = loadDocsIndex();
  if (!index) return null;

  const doc = index.docs.find(d => d.id === docId);
  return doc?.rawContent || null;
}

/**
 * Resource definitions for listing
 */
const RESOURCE_DEFINITIONS = [
  {
    uri: 'parchment://openapi',
    name: 'OpenAPI Specification',
    description: 'Parchment API OpenAPI 3.0 specification with all endpoints and schemas',
    mimeType: 'application/json',
  },
  {
    uri: 'parchment://docs/integration-guide',
    name: 'Partner Integration Guide',
    description: 'Complete guide for integrating with Parchment Health API',
    mimeType: 'text/markdown',
  },
  {
    uri: 'parchment://docs/post-integration-guide',
    name: 'Post Integration Guide',
    description: 'Steps after completing integration - sandbox to production',
    mimeType: 'text/markdown',
  },
  {
    uri: 'parchment://docs/authentication',
    name: 'Authentication Overview',
    description: 'Partner authentication including registration and token generation',
    mimeType: 'text/markdown',
  },
  {
    uri: 'parchment://docs/token-creation',
    name: 'Token Creation',
    description: 'How to create partner authentication tokens',
    mimeType: 'text/markdown',
  },
  {
    uri: 'parchment://docs/scopes',
    name: 'Authentication Scopes',
    description: 'Available API scopes and permissions',
    mimeType: 'text/markdown',
  },
  {
    uri: 'parchment://docs/sso',
    name: 'SSO Integration',
    description: 'Server-to-server SSO implementation guide',
    mimeType: 'text/markdown',
  },
  {
    uri: 'parchment://docs/sso-auth0',
    name: 'SSO with Auth0',
    description: 'SSO integration guide for Auth0',
    mimeType: 'text/markdown',
  },
  {
    uri: 'parchment://docs/embedded-iframe',
    name: 'Embedded iFrame',
    description: 'Embedding Parchment Portal in an iframe',
    mimeType: 'text/markdown',
  },
  {
    uri: 'parchment://docs/webhooks',
    name: 'Webhook Integration',
    description: 'Real-time event notifications via webhooks',
    mimeType: 'text/markdown',
  },
  {
    uri: 'parchment://docs/webhook-events',
    name: 'Webhook Events',
    description: 'Available webhook event types and payloads',
    mimeType: 'text/markdown',
  },
  {
    uri: 'parchment://docs/faq',
    name: 'FAQ',
    description: 'Frequently asked questions',
    mimeType: 'text/markdown',
  },
];

/**
 * Register all resources with the MCP server
 */
export function registerResources(server: McpServer): void {
  // Register docs resources
  server.resource(
    'parchment-docs',
    'parchment://docs/{path}',
    async (uri) => {
      const content = getDocContent(uri.href);
      if (!content) {
        throw new Error(`Resource not found: ${uri.href}`);
      }

      const def = RESOURCE_DEFINITIONS.find(r => r.uri === uri.href);
      return {
        contents: [{
          uri: uri.href,
          mimeType: def?.mimeType || 'text/markdown',
          text: content,
        }],
      };
    }
  );

  // Register OpenAPI resource
  server.resource(
    'parchment-openapi',
    'parchment://openapi',
    async () => {
      const content = getDocContent('parchment://openapi');
      if (!content) {
        throw new Error('OpenAPI specification not found');
      }
      return {
        contents: [{
          uri: 'parchment://openapi',
          mimeType: 'application/json',
          text: content,
        }],
      };
    }
  );
}

/**
 * Get list of all available resources
 */
export function getResourceList() {
  return RESOURCE_DEFINITIONS;
}
