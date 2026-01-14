# 🚀 Development Setup

This guide explains how to run the Puzzle Place development environment with both Next.js and WebSocket servers.

## Automatic Startup (Recommended)

The easiest way to start development is:

```bash
# Automatically starts both Next.js and WebSocket servers
bun run dev

# Alternative: Use the auto-start script
bun run dev:auto
```

## Manual Startup Options

### Option 1: Concurrently (Cross-platform)
```bash
bun run dev:full
```

### Option 2: Windows Background Processes
```bash
bun run dev:full:windows
```

### Option 3: Separate Terminals

**Terminal 1 - Next.js:**
```bash
bun run dev:next
# or
bun run dev:only
```

**Terminal 2 - WebSocket Server:**
```bash
bun run ws:start
```

## Server Endpoints

Once both servers are running:

- **Next.js App**: http://localhost:3000
- **WebSocket Server**: ws://localhost:3002
  - Basic endpoint: `ws://localhost:3002/ws`
  - Event endpoint: `ws://localhost:3002/ws/events/{eventId}`

## Testing WebSocket Connection

Run the WebSocket test to verify everything is working:

```bash
bun run test-websocket.mjs
```

## Development Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | **Recommended** - Auto-starts both servers |
| `bun run dev:auto` | Alternative auto-start script |
| `bun run dev:next` | Next.js only |
| `bun run dev:only` | Next.js only (alias) |
| `bun run ws:start` | WebSocket server only |
| `bun run dev:full` | Cross-platform concurrent startup |
| `bun run dev:full:windows` | Windows-specific concurrent startup |

## Architecture

- **Next.js** (Port 3000): Main web application with React components
- **WebSocket Server** (Port 3001): Real-time communication using Bun.serve()
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth integration

## Features

- ⚡ **7x faster WebSockets** - Built on uWebSockets.js
- 🔄 **Auto-reconnection** - Client handles connection drops gracefully
- 📡 **Event broadcasting** - Real-time updates for game events
- 🛡️ **Authentication** - Secure WebSocket connections with auth tokens
- 🗜️ **Compression** - Per-message deflate compression enabled

## Troubleshooting

### WebSocket Connection Issues
1. Ensure both servers are running
2. Check that ports 3000 and 3001 are not in use
3. Run the test script: `bun run test-websocket.mjs`

### Port Conflicts
- Next.js: Change port in `next.config.ts` or use `PORT=3001 bun run dev:next`
- WebSocket: Change port in `websocket-server.ts`

### Build Issues
```bash
# Clean install
rm -rf node_modules
bun install

# Generate Prisma client
bun run db:generate
```

## Production Deployment

For production, deploy the WebSocket server separately:

```bash
# Build Next.js
bun run build

# Start WebSocket server (production mode)
NODE_ENV=production bun run ws:start
```

Use a reverse proxy (nginx) to route WebSocket traffic in production.