#!/usr/bin/env node

// Simple WebSocket test client to verify the server implementation works
import WebSocket from "ws";

async function testWebSocketConnection() {
  console.log("Testing WebSocket connection...");

  try {
    // Test basic WebSocket connection
    const ws = new WebSocket("ws://localhost:3002/ws");

    ws.on("open", function open() {
      console.log("✅ Connected to basic WebSocket endpoint");
      ws.send("Hello from test client!");
    });

    ws.on("message", function message(data) {
      console.log("📨 Received:", data.toString());
    });

    ws.on("error", function error(err) {
      console.error("❌ WebSocket error:", err.message);
    });

    ws.on("close", function close(code, reason) {
      console.log(`🔌 Connection closed: ${code} - ${reason.toString()}`);
    });

    // Wait a bit for the connection to complete
    setTimeout(() => {
      ws.close();
    }, 2000);
  } catch (error) {
    console.error("❌ Failed to connect:", error.message);
  }
}

async function testEventWebSocketConnection() {
  console.log("\nTesting event-specific WebSocket connection...");

  try {
    // Test event-specific WebSocket connection (will likely fail without auth, but should get proper error)
    const ws = new WebSocket("ws://localhost:3002/ws/events/123");

    ws.on("open", function open() {
      console.log("✅ Connected to event WebSocket endpoint");
    });

    ws.on("message", function message(data) {
      console.log("📨 Received:", data.toString());
    });

    ws.on("error", function error(err) {
      console.log("⚠️  Expected auth error:", err.message);
    });

    ws.on("close", function close(code, reason) {
      console.log(`🔌 Event connection closed: ${code} - ${reason.toString()}`);
    });

    // Wait a bit
    setTimeout(() => {
      ws.close();
    }, 2000);
  } catch (error) {
    console.error("❌ Failed to connect to event endpoint:", error.message);
  }
}

// Run the tests
async function runTests() {
  console.log("🚀 Starting WebSocket functionality tests...\n");

  await testWebSocketConnection();

  // Wait a bit between tests
  setTimeout(async () => {
    await testEventWebSocketConnection();

    console.log("\n✨ WebSocket tests completed!");
  }, 3000);
}

runTests();
