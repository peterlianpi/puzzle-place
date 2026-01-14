import { Hono } from "hono";
import { upgradeWebSocket, websocket } from 'hono/bun';
import { auth } from "@/lib/auth/auth";

const app = new Hono()

.get(
  "/ws",
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`);
        ws.send("Hello from server!");
      },
      onClose: () => {
        console.log("Connection closed");
      },
    };
  })
)
.get(
  "/ws/events/:id",
  upgradeWebSocket(async (c) => {
    // Authenticate user
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) {
      return {
        onOpen(event, ws) {
          ws.close(1008, 'Unauthorized');
        },
      };
    }

    const eventId = c.req.param('id');
    return {
      onOpen(event, ws) {
        console.log(`WebSocket opened for event ${eventId}`);
      },
      onMessage(event, ws) {
        console.log(`Event ${eventId} received message: ${event.data}`);
        // Send event-updated message to trigger frontend refetch
        const updateMessage = JSON.stringify({ type: 'event-updated', eventId });
        ws.send(updateMessage);
        console.log(`Event ${eventId} sent update: ${updateMessage}`);
      },
      onClose: () => {
        console.log(`Event ${eventId} WebSocket connection closed`);
      },
      onError: (error) => {
        console.error(`Event ${eventId} WebSocket error:`, error);
      },
    };
  })
);

const handler = {
  fetch: app.fetch,
  websocket,
};


export default handler;