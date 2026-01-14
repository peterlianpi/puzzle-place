// WebSocket client example - not used in app, useWebSocket hook instead
// This demonstrates direct WebSocket connection for testing

export const connectToEventWS = (eventId: string) => {
  const ws = new WebSocket(`ws://localhost:3000/api/ws/events/${eventId}`);

  ws.onopen = () => {
    console.log(`Connected to event ${eventId}`);
    ws.send(JSON.stringify({ type: 'join', eventId }));
  };

  ws.onmessage = (event) => {
    console.log('Received:', event.data);
  };

  ws.onclose = () => {
    console.log('Disconnected from event WS');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return ws;
};

// Usage: const ws = connectToEventWS('123');