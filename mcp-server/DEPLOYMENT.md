# MCP Server Deployment Guide

## How It Works

This MCP server runs **locally** on the user's machine via stdio transport. When users configure their AI tool (Claude Code, Cursor, etc.), the tool spawns the MCP server as a child process and communicates via stdin/stdout.

```
┌─────────────┐     stdio      ┌─────────────────┐
│ Claude Code │ ◄────────────► │ parchment-docs  │
│   (client)  │                │   MCP server    │
└─────────────┘                └─────────────────┘
```

## Publishing to npm

### Prerequisites
- npm account (create at npmjs.com)
- Access to `@parchmenthealth` org scope on npm

### Steps

1. **Login to npm**
   ```bash
   npm login
   ```

2. **Build the package**
   ```bash
   cd mcp-server && npm run build
   ```

3. **Publish**
   ```bash
   # Bump version in mcp-server/package.json (e.g., 1.0.1 → 1.0.2)
   npm publish --access public
   ```

4. **Verify**
   ```bash
   npx -y @parchmenthealth/docs-mcp
   # Should print: parchment-docs v1.0.0 started
   ```

### Updating

1. Bump version in `package.json`
2. Rebuild: `npm run build`
3. Publish: `npm publish`

## Alternative: Local Development Use

For internal testing without publishing:

```json
{
  "mcpServers": {
    "parchment-docs": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"]
    }
  }
}
```

## What Gets Published

Only these files are included (see `files` in package.json):
- `dist/` - compiled JavaScript + bundled docs content (~200KB)
- `README.md`

**All documentation content is bundled at build time** into `dist/content/docs.json`:
- Full text of all MDX docs
- OpenAPI specification
- Search index

Users don't need your repo - everything is self-contained in the npm package.

## Updating Documentation Content

When docs change:
1. Run `npm run build` to regenerate the search index
2. Bump version and republish

The content index is built at publish time from the MDX files.
