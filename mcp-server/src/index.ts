#!/usr/bin/env node
/**
 * Parchment Documentation MCP Server
 *
 * Provides access to Parchment Health API documentation via the Model Context Protocol.
 *
 * Resources:
 * - OpenAPI specification
 * - Integration guides
 * - Authentication documentation
 * - SSO integration guides
 * - Webhook documentation
 * - FAQ
 *
 * Tools:
 * - search_docs: Full-text search across all documentation
 * - list_resources: List all available documentation resources
 * - get_openapi_spec: Get the complete OpenAPI specification
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerResources } from './resources.js';
import { registerTools } from './tools.js';

const SERVER_NAME = 'parchment-docs';
const SERVER_VERSION = '1.0.0';

async function main(): Promise<void> {
  // Create MCP server
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Register resources and tools
  registerResources(server);
  registerTools(server);

  // Connect via stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr (stdout is used for MCP protocol)
  console.error(`${SERVER_NAME} v${SERVER_VERSION} started`);
}

// Handle errors
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
