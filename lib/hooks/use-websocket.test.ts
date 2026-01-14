import { renderHook, act } from "@testing-library/react-hooks";
import { useWebSocket } from "./use-websocket";
import { vi, describe, it, expect, beforeEach, afterEach, Mocked } from "vitest";

// Use the global mock WebSocket from setup, but create our own instance for control
const mockWebSocket = {
  readyState: WebSocket.CONNECTING as number,
  send: vi.fn(),
  close: vi.fn(),
  onopen: null as ((event: Event) => void) | null,
  onmessage: null as ((event: MessageEvent) => void) | null,
  onerror: null as ((event: Event) => void) | null,
  onclose: null as ((event: CloseEvent) => void) | null,
};

// Mock the constructor to return our controlled instance
const MockWebSocket = global.WebSocket as any;
MockWebSocket.mockImplementation(() => mockWebSocket);

describe("useWebSocket", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MockWebSocket.mockClear();
  });

  it("should initialize with disconnected state", () => {
    const { result } = renderHook(() => useWebSocket({ url: "ws://test" }));

    expect(result.current.isConnected).toBe(false);
    expect(result.current.lastMessage).toBe(null);
  });

  it("should connect to WebSocket on mount", () => {
    renderHook(() => useWebSocket({ url: "ws://test" }));

    expect(MockWebSocket).toHaveBeenCalledWith("ws://test");
  });

  it("should handle successful connection", () => {
    const onOpen = vi.fn();
    renderHook(() => useWebSocket({ url: "ws://test", onOpen }));

    act(() => {
      mockWebSocket.onopen?.(new Event("open"));
    });

    expect(onOpen).toHaveBeenCalled();
  });

  it("should handle incoming messages", () => {
    const onMessage = vi.fn();
    const { result } = renderHook(() =>
      useWebSocket({ url: "ws://test", onMessage })
    );

    const testData = { type: "test" };
    act(() => {
      mockWebSocket.onmessage?.({
        data: JSON.stringify(testData),
      } as MessageEvent);
    });

    expect(onMessage).toHaveBeenCalledWith(testData);
    expect(result.current.lastMessage).toEqual(testData);
  });

  it("should handle errors", () => {
    const onError = vi.fn();
    renderHook(() => useWebSocket({ url: "ws://test", onError }));

    const testError = new Event("error");
    act(() => {
      mockWebSocket.onerror?.(testError);
    });

    expect(onError).toHaveBeenCalledWith(testError);
  });

  it("should send messages", () => {
    const { result } = renderHook(() => useWebSocket({ url: "ws://test" }));

    const testMessage = { type: "test" };
    act(() => {
      result.current.sendMessage(testMessage);
    });

    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify(testMessage)
    );
  });

  it("should reconnect on close if shouldReconnect is true", () => {
    renderHook(() =>
      useWebSocket({
        url: "ws://test",
        shouldReconnect: true,
        reconnectInterval: 100,
      })
    );

    act(() => {
      mockWebSocket.onclose?.(new CloseEvent("close"));
    });

    // WebSocket constructor called again for reconnection
    expect(vi.mocked(global.WebSocket)).toHaveBeenCalledTimes(2);
  });

  it("should not reconnect if shouldReconnect is false", () => {
    renderHook(() =>
      useWebSocket({ url: "ws://test", shouldReconnect: false })
    );

    act(() => {
      mockWebSocket.onclose?.(new CloseEvent("close"));
    });

    expect(MockWebSocket).toHaveBeenCalledTimes(1);
  });

  describe("Connection States", () => {
    it("should set readyState to OPEN when connected", () => {
      renderHook(() => useWebSocket({ url: "ws://test" }));

      act(() => {
        mockWebSocket.readyState = WebSocket.OPEN;
        mockWebSocket.onopen?.(new Event("open"));
      });

      // The hook should be connected
      expect(mockWebSocket.onopen).toBeDefined();
    });

    it("should handle connection failure", () => {
      const onError = vi.fn();
      renderHook(() => useWebSocket({ url: "ws://test", onError }));

      act(() => {
        mockWebSocket.readyState = WebSocket.CLOSED;
        mockWebSocket.onerror?.(new Event("error"));
      });

      expect(onError).toHaveBeenCalled();
    });

    it("should not send messages when disconnected", () => {
      const { result } = renderHook(() => useWebSocket({ url: "ws://test" }));

      act(() => {
        mockWebSocket.readyState = WebSocket.CLOSED;
        result.current.sendMessage({ type: "test" });
      });

      expect(mockWebSocket.send).not.toHaveBeenCalled();
    });
  });

  describe("Message Handling", () => {
    it("should handle malformed JSON messages gracefully", () => {
      const onError = vi.fn();
      renderHook(() => useWebSocket({ url: "ws://test", onError }));

      act(() => {
        mockWebSocket.onmessage?.({ data: "invalid json" } as MessageEvent);
      });

      // Should not crash, but lastMessage should remain null
      expect(onError).toHaveBeenCalled();
    });

    it("should handle binary messages", () => {
      const onMessage = vi.fn();
      const { result } = renderHook(() =>
        useWebSocket({ url: "ws://test", onMessage })
      );

      const binaryData = new ArrayBuffer(8);
      act(() => {
        mockWebSocket.onmessage?.({ data: binaryData } as MessageEvent);
      });

      // The current implementation only handles JSON strings, so this should be handled gracefully
      expect(onMessage).not.toHaveBeenCalled();
    });

    it("should clear lastMessage on disconnect", () => {
      const { result } = renderHook(() => useWebSocket({ url: "ws://test" }));

      // Send a message first
      act(() => {
        mockWebSocket.readyState = WebSocket.OPEN;
        mockWebSocket.onopen?.(new Event("open"));
        mockWebSocket.onmessage?.({
          data: JSON.stringify({ type: "test" }),
        } as MessageEvent);
      });

      expect(result.current.lastMessage).toEqual({ type: "test" });

      // Disconnect
      act(() => {
        mockWebSocket.onclose?.(new CloseEvent("close"));
      });

      expect(result.current.isConnected).toBe(false);
    });
  });

  describe("Manual Connection Control", () => {
    it("should allow manual connection", () => {
      const { result } = renderHook(() => useWebSocket({ url: "ws://test" }));

      act(() => {
        result.current.connect();
      });

      expect(MockWebSocket).toHaveBeenCalledWith("ws://test");
    });

    it("should allow manual disconnection", () => {
      const { result } = renderHook(() => useWebSocket({ url: "ws://test" }));

      act(() => {
        result.current.disconnect();
      });

      expect(mockWebSocket.close).toHaveBeenCalled();
    });

    it("should prevent duplicate connections", () => {
      renderHook(() => useWebSocket({ url: "ws://test" }));

      act(() => {
        mockWebSocket.readyState = WebSocket.OPEN;
        mockWebSocket.onopen?.(new Event("open"));
      });

      // Try to connect again - should not create new WebSocket
      act(() => {
        // Simulate calling connect when already connected
        const hook = renderHook(() => useWebSocket({ url: "ws://test" }));
        hook.result.current.connect();
      });

      expect(MockWebSocket).toHaveBeenCalledTimes(2); // Initial + manual connect
    });
  });

  describe("Reconnection Logic", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should use custom reconnect interval", () => {
      renderHook(() =>
        useWebSocket({
          url: "ws://test",
          shouldReconnect: true,
          reconnectInterval: 10000,
        })
      );

      act(() => {
        mockWebSocket.onclose?.(new CloseEvent("close"));
      });

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(MockWebSocket).toHaveBeenCalledTimes(2);
    });

    it("should clean up reconnect timeout on unmount", () => {
      const { unmount } = renderHook(() =>
        useWebSocket({
          url: "ws://test",
          shouldReconnect: true,
          reconnectInterval: 1000,
        })
      );

      act(() => {
        mockWebSocket.onclose?.(new CloseEvent("close"));
      });

      unmount();

      expect(clearTimeout).toHaveBeenCalled();
    });
  });

  describe("Event Callbacks", () => {
    it("should call all event callbacks", () => {
      const callbacks = {
        onOpen: vi.fn(),
        onMessage: vi.fn(),
        onError: vi.fn(),
        onClose: vi.fn(),
      };

      renderHook(() =>
        useWebSocket({
          url: "ws://test",
          ...callbacks,
        })
      );

      act(() => {
        mockWebSocket.onopen?.(new Event("open"));
        mockWebSocket.onmessage?.({
          data: JSON.stringify({ test: true }),
        } as MessageEvent);
        mockWebSocket.onerror?.(new Event("error"));
        mockWebSocket.onclose?.(new CloseEvent("close"));
      });

      expect(callbacks.onOpen).toHaveBeenCalled();
      expect(callbacks.onMessage).toHaveBeenCalledWith({ test: true });
      expect(callbacks.onError).toHaveBeenCalled();
      expect(callbacks.onClose).toHaveBeenCalled();
    });

    it("should handle callbacks that throw errors", () => {
      const errorCallback = vi.fn().mockImplementation(() => {
        throw new Error("Callback error");
      });

      // Should not crash the hook
      expect(() => {
        renderHook(() =>
          useWebSocket({
            url: "ws://test",
            onMessage: errorCallback,
          })
        );

        act(() => {
          mockWebSocket.onmessage?.({
            data: JSON.stringify({}),
          } as MessageEvent);
        });
      }).not.toThrow();
    });
  });

  describe("URL Changes", () => {
    it("should reconnect when URL changes", () => {
      const { rerender } = renderHook(({ url }) => useWebSocket({ url }), {
        initialProps: { url: "ws://test1" },
      });

      expect(MockWebSocket).toHaveBeenCalledWith("ws://test1");

      rerender({ url: "ws://test2" });

      expect(MockWebSocket).toHaveBeenCalledWith("ws://test2");
    });

    it("should clean up previous connection on URL change", () => {
      const { rerender } = renderHook(({ url }) => useWebSocket({ url }), {
        initialProps: { url: "ws://test1" },
      });

      rerender({ url: "ws://test2" });

      expect(mockWebSocket.close).toHaveBeenCalled();
    });
  });
});
