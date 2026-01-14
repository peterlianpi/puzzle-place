console.log("Setup running");
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { JSDOM } from "jsdom";

// Set up JSDOM
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost:3000",
});

global.window = dom.window as any;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock WebSocket to prevent real connections
global.WebSocket = vi.fn().mockImplementation(() => ({
  readyState: 0, // CONNECTING
  send: vi.fn(),
  close: vi.fn(),
  onopen: null,
  onmessage: null,
  onerror: null,
  onclose: null,
})) as any;

// Mock server-only to avoid import issues in logger
vi.mock("server-only", () => ({}));

// Mock logger to avoid server-only import
vi.mock("@/lib/logger", () => ({
  Logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    auth: vi.fn(),
    token: vi.fn(),
    devLog: vi.fn(),
  },
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "test";
process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY = "test";
process.env.CLOUDINARY_API_SECRET = "test";
