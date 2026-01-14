#!/usr/bin/env bun

// Standalone WebSocket server using Bun.serve() as per the documentation
import { auth } from "@/lib/auth/auth";

type WebSocketData = {
  eventId?: string;
  connectedAt: number;
  userId: string;
};

const server = Bun.serve<WebSocketData>({
  port: 3002, // Different port from Next.js
  fetch(req, server) {
    const url = new URL(req.url);

    // Basic WebSocket endpoint
    if (url.pathname === "/ws") {
      const success = server.upgrade(req, {
        data: {
          connectedAt: Date.now(),
          userId: "anonymous"
        }
      });
      if (success) {
        console.log("✅ Upgraded connection to basic WebSocket");
        return undefined;
      }
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    // Event-specific WebSocket endpoint with authentication
    if (url.pathname.startsWith("/ws/events/")) {
      const eventId = url.pathname.split("/ws/events/")[1];

      // For simplicity, we'll allow connections without auth for testing
      // In production, you'd validate auth here
      console.log(`🔄 Attempting to upgrade connection for event ${eventId}`);

      const success = server.upgrade(req, {
        data: {
          eventId,
          connectedAt: Date.now(),
          userId: "test-user" // In real app, get from auth
        }
      });

      if (success) {
        console.log(`✅ Upgraded connection for event ${eventId}`);
        return undefined;
      }
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    return new Response("Not found", { status: 404 });
  },
  websocket: {
    message(ws, message) {
      console.log(`📨 Message received:`, message);

      // Echo back the message
      ws.send(`Echo: ${message}`);

      // If this is an event-specific connection, broadcast to others with same event
      if (ws.data?.eventId) {
        const eventId = ws.data.eventId;
        console.log(`📢 Broadcasting to event ${eventId}: ${message}`);

        // In a real app, you'd maintain rooms/channels for events
        // For now, just echo back with event context
        ws.send(JSON.stringify({
          type: 'event-message',
          eventId,
          message: String(message),
          timestamp: Date.now()
        }));
      }
    },

    open(ws) {
      console.log(`🔓 WebSocket opened`);
      if (ws.data?.eventId) {
        console.log(`📅 Event WebSocket opened for event ${ws.data.eventId}`);
        ws.send(JSON.stringify({
          type: 'connected',
          eventId: ws.data.eventId,
          message: `Connected to event ${ws.data.eventId}`
        }));
      } else {
        ws.send(JSON.stringify({
          type: 'connected',
          message: 'Connected to basic WebSocket'
        }));
      }
    },

    close(ws, code, reason) {
      console.log(`🔒 WebSocket closed: ${code} - ${reason}`);
      if (ws.data?.eventId) {
        console.log(`📅 Event WebSocket closed for event ${ws.data.eventId}`);
      }
    },



    // WebSocket configuration from Bun docs
    idleTimeout: 120, // 2 minutes
    maxPayloadLength: 16 * 1024 * 1024, // 16 MB
    backpressureLimit: 1024 * 1024, // 1 MB
    perMessageDeflate: true, // Enable compression
  },
});

console.log(`🚀 WebSocket server running on ${server.hostname}:${server.port}`);
console.log(`📡 Available endpoints:`);
console.log(`   - ws://localhost:${server.port}/ws`);
console.log(`   - ws://localhost:${server.port}/ws/events/{eventId}`);