# @parchmenthealth/docs-mcp

MCP (Model Context Protocol) server for Parchment Health API documentation. This server provides AI assistants with access to Parchment's integration documentation, OpenAPI specification, and search capabilities.

## Installation

### Claude Code

Add to your `~/.claude.json`:

```json
{
  "mcpServers": {
    "parchment-docs": {
      "command": "npx",
      "args": ["-y", "@parchmenthealth/docs-mcp"]
    }
  }
}
```

Or via CLI:

```bash
claude mcp add parchment-docs -- npx -y @parchmenthealth/docs-mcp
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "parchment-docs": {
      "command": "npx",
      "args": ["-y", "@parchmenthealth/docs-mcp"]
    }
  }
}
```

### Codex

Use the same stdio configuration pattern as above.

## Available Tools

### `search_docs`

Search through Parchment API documentation.

**Parameters:**
- `query` (string, required): Search query - can include multiple terms
- `limit` (number, optional): Maximum results to return (default: 5)

**Example:**
```
search_docs("authentication token")
search_docs("webhook events", limit=10)
```

### `list_resources`

List all available documentation resources.

### `get_openapi_spec`

Get the complete OpenAPI 3.0 specification for the Parchment API.

## Available Resources

| Resource | URI | Description |
|----------|-----|-------------|
| OpenAPI Spec | `parchment://openapi` | Complete API specification |
| Integration Guide | `parchment://docs/integration-guide` | Partner integration guide |
| Authentication | `parchment://docs/authentication` | Auth overview |
| Token Creation | `parchment://docs/token-creation` | How to create tokens |
| Scopes | `parchment://docs/scopes` | Available API scopes |
| SSO | `parchment://docs/sso` | SSO integration guide |
| Webhooks | `parchment://docs/webhooks` | Webhook integration |
| FAQ | `parchment://docs/faq` | Frequently asked questions |

## Development

### Setup

```bash
cd mcp-server
npm install
```

### Build

```bash
npm run build
```

This runs two steps:
1. `build:content` - Parses MDX files and generates search index
2. `tsc` - Compiles TypeScript

### Test locally

```bash
# Run directly with tsx
npm run dev

# Or test JSON-RPC
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node dist/index.js
```

## License

MIT
