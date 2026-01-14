import { renderHook, act } from '@testing-library/react-hooks';
import { useWebSocket } from './use-websocket';

// Mock WebSocket that simulates server behavior
class MockWebSocketServer {
  private clients: WebSocket[] = [];
  private messageHandlers: ((message: any) => void)[] = [];

  connect(): WebSocket {
    const mockWs = {
      readyState: WebSocket.CONNECTING,
      send: jest.fn((data: string) => {
        // Simulate server receiving message
        const parsed = JSON.parse(data);
        this.messageHandlers.forEach(handler => handler(parsed));
      }),
      close: jest.fn(),
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
    };

    this.clients.push(mockWs);

    // Simulate immediate connection
    setTimeout(() => {
      mockWs.readyState = WebSocket.OPEN;
      mockWs.onopen?.(new Event('open'));
    }, 0);

    return mockWs as any;
  }

  // Simulate broadcasting to all clients
  broadcast(message: any) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.onmessage) {
        client.onmessage({ data: JSON.stringify(message) } as MessageEvent);
      }
    });
  }

  // Add message handler to simulate server logic
  onMessage(handler: (message: any) => void) {
    this.messageHandlers.push(handler);
  }

  disconnectAll() {
    this.clients.forEach(client => {
      client.onclose?.(new CloseEvent('close'));
    });
    this.clients = [];
  }
}

describe('WebSocket Integration Tests', () => {
  let mockServer: MockWebSocketServer;

  beforeEach(() => {
    mockServer = new MockWebSocketServer();

    // Mock the global WebSocket
    const MockWebSocket = jest.fn().mockImplementation(() => mockServer.connect());
    Object.defineProperty(global, 'WebSocket', {
      writable: true,
      value: MockWebSocket,
    });
  });

  afterEach(() => {
    mockServer.disconnectAll();
    jest.clearAllMocks();
  });

  describe('Client-Server Message Exchange', () => {
    it('should handle echo server communication', () => {
      const messages: any[] = [];
      const { result } = renderHook(() =>
        useWebSocket({
          url: 'ws://test',
          onMessage: (data) => messages.push(data)
        })
      );

      // Set up echo server behavior
      mockServer.onMessage((message) => {
        mockServer.broadcast({ type: 'echo', data: message });
      });

      // Wait for connection
      act(() => {
        // Connection happens asynchronously
      });

      // Send a message
      act(() => {
        result.current.sendMessage({ type: 'test', content: 'hello' });
      });

      // Should receive echo back
      expect(messages).toContainEqual({
        type: 'echo',
        data: { type: 'test', content: 'hello' }
      });
    });

    it('should handle multiple clients broadcasting', () => {
      const messages1: any[] = [];
      const messages2: any[] = [];

      const hook1 = renderHook(() =>
        useWebSocket({
          url: 'ws://test',
          onMessage: (data) => messages1.push(data)
        })
      );

      const hook2 = renderHook(() =>
        useWebSocket({
          url: 'ws://test',
          onMessage: (data) => messages2.push(data)
        })
      );

      // Set up broadcast server behavior
      mockServer.onMessage((message) => {
        mockServer.broadcast({ type: 'broadcast', data: message, sender: 'server' });
      });

      // Client 1 sends message
      act(() => {
        hook1.result.current.sendMessage({ user: 'client1', text: 'hello' });
      });

      // Both clients should receive the broadcast
      expect(messages1).toContainEqual({
        type: 'broadcast',
        data: { user: 'client1', text: 'hello' },
        sender: 'server'
      });

      expect(messages2).toContainEqual({
        type: 'broadcast',
        data: { user: 'client1', text: 'hello' },
        sender: 'server'
      });
    });

    it('should handle event-driven updates', () => {
      const events: any[] = [];
      const { result } = renderHook(() =>
        useWebSocket({
          url: 'ws://test',
          onMessage: (data) => events.push(data)
        })
      );

      // Simulate server sending event updates
      mockServer.onMessage((message) => {
        if (message.type === 'get-events') {
          mockServer.broadcast({
            type: 'event-updated',
            eventId: message.eventId,
            action: 'updated'
          });
        }
      });

      // Client requests event update
      act(() => {
        result.current.sendMessage({ type: 'get-events', eventId: '123' });
      });

      // Should receive event update
      expect(events).toContainEqual({
        type: 'event-updated',
        eventId: '123',
        action: 'updated'
      });
    });
  });

  describe('Connection Lifecycle', () => {
    it('should handle connection and reconnection', () => {
      const connectionEvents: string[] = [];
      const { result } = renderHook(() =>
        useWebSocket({
          url: 'ws://test',
          onOpen: () => connectionEvents.push('open'),
          onClose: () => connectionEvents.push('close'),
          shouldReconnect: true,
          reconnectInterval: 100
        })
      );

      // Initial connection
      expect(connectionEvents).toContain('open');

      // Simulate disconnection and reconnection
      act(() => {
        mockServer.disconnectAll();
      });

      expect(connectionEvents).toContain('close');

      // After reconnection interval, should reconnect
      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(connectionEvents.filter(e => e === 'open')).toHaveLength(2);
    });

    it('should maintain message order', () => {
      const receivedMessages: any[] = [];
      const { result } = renderHook(() =>
        useWebSocket({
          url: 'ws://test',
          onMessage: (data) => receivedMessages.push(data)
        })
      );

      // Send messages in order
      const messages = [
        { id: 1, text: 'first' },
        { id: 2, text: 'second' },
        { id: 3, text: 'third' }
      ];

      messages.forEach(msg => {
        mockServer.broadcast(msg);
      });

      // Should receive in same order
      expect(receivedMessages).toEqual(messages);
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', () => {
      const errors: Event[] = [];
      const { result } = renderHook(() =>
        useWebSocket({
          url: 'ws://test',
          onError: (error) => errors.push(error)
        })
      );

      // Simulate server error
      const mockWs = mockServer.connect();
      act(() => {
        mockWs.onerror?.(new Event('error'));
      });

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should handle malformed server messages', () => {
      const messages: any[] = [];
      const errors: Event[] = [];

      const { result } = renderHook(() =>
        useWebSocket({
          url: 'ws://test',
          onMessage: (data) => messages.push(data),
          onError: (error) => errors.push(error)
        })
      );

      // Send malformed JSON
      const mockWs = mockServer.connect();
      act(() => {
        mockWs.onmessage?.({ data: 'invalid json' } as MessageEvent);
      });

      // Should handle error gracefully without crashing
      expect(errors.length).toBeGreaterThan(0);
      expect(messages.length).toBe(0);
    });
  });

  describe('Data Serialization', () => {
    it('should serialize and deserialize complex objects', () => {
      const receivedData: any[] = [];
      const { result } = renderHook(() =>
        useWebSocket({
          url: 'ws://test',
          onMessage: (data) => receivedData.push(data)
        })
      );

      const complexObject = {
        id: 'event-123',
        title: 'Test Event',
        participants: ['user1', 'user2', 'user3'],
        metadata: {
          createdAt: new Date().toISOString(),
          tags: ['gaming', 'online'],
          settings: {
            maxPlayers: 10,
            isPrivate: false
          }
        },
        status: 'active'
      };

      // Send complex object
      act(() => {
        result.current.sendMessage(complexObject);
      });

      // Simulate server echo
      mockServer.onMessage((message) => {
        mockServer.broadcast(message);
      });

      // Should receive identical object
      expect(receivedData[0]).toEqual(complexObject);
    });

    it('should handle binary data types', () => {
      const receivedData: any[] = [];
      const { result } = renderHook(() =>
        useWebSocket({
          url: 'ws://test',
          onMessage: (data) => receivedData.push(data)
        })
      );

      // Test with ArrayBuffer (though current implementation expects JSON)
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      view.setUint32(0, 12345);

      // Current implementation only handles JSON strings, so this should not trigger onMessage
      const mockWs = mockServer.connect();
      act(() => {
        mockWs.onmessage?.({ data: buffer } as MessageEvent);
      });

      // Should not have received any messages since binary data isn't parsed
      expect(receivedData.length).toBe(0);
    });
  });

  describe('Performance and Load', () => {
    it('should handle rapid message bursts', () => {
      const receivedCount = { value: 0 };
      const { result } = renderHook(() =>
        useWebSocket({
          url: 'ws://test',
          onMessage: () => receivedCount.value++
        })
      );

      // Send many messages rapidly
      const messageCount = 100;
      for (let i = 0; i < messageCount; i++) {
        mockServer.broadcast({ id: i, data: `message-${i}` });
      }

      expect(receivedCount.value).toBe(messageCount);
    });

    it('should handle large message payloads', () => {
      const receivedData: any[] = [];
      const { result } = renderHook(() =>
        useWebSocket({
          url: 'ws://test',
          onMessage: (data) => receivedData.push(data)
        })
      );

      // Create a large message (simulate detailed event data)
      const largeMessage = {
        type: 'event-details',
        event: {
          id: 'event-123',
          title: 'Large Gaming Tournament',
          description: 'A'.repeat(10000), // 10KB of description
          participants: Array.from({ length: 1000 }, (_, i) => ({
            id: `user-${i}`,
            name: `User ${i}`,
            avatar: `avatar-${i}.jpg`,
            stats: {
              gamesPlayed: Math.floor(Math.random() * 1000),
              winRate: Math.random(),
              achievements: Array.from({ length: 50 }, (_, j) => `achievement-${j}`)
            }
          })),
          settings: {
            rules: 'A'.repeat(5000), // 5KB of rules
            prizes: Array.from({ length: 100 }, (_, i) => ({
              position: i + 1,
              reward: `Reward for position ${i + 1}`,
              value: Math.floor(Math.random() * 10000)
            }))
          }
        }
      };

      mockServer.broadcast(largeMessage);

      expect(receivedData[0]).toEqual(largeMessage);
      expect(receivedData[0].event.participants).toHaveLength(1000);
    });
  });
});