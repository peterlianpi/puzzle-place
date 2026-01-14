#!/usr/bin/env node

// Development startup script that automatically starts both Next.js and WebSocket servers
import { spawn } from 'child_process';
import { platform } from 'os';

console.log('🚀 Starting Puzzle Place Development Environment...\n');

const isWindows = platform() === 'win32';
const servers = [
  { name: 'Next.js', command: 'bun', args: ['run', 'dev:next'], color: '\x1b[36m' },
  { name: 'WebSocket', command: 'bun', args: ['run', 'ws:start'], color: '\x1b[35m' }
];

const processes = [];

function startServer(serverConfig, index) {
  console.log(`${serverConfig.color}[${serverConfig.name}]\x1b[0m Starting...`);

  const proc = spawn(serverConfig.command, serverConfig.args, {
    stdio: 'inherit',
    shell: isWindows,
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  proc.on('close', (code) => {
    console.log(`${serverConfig.color}[${serverConfig.name}]\x1b[0m exited with code ${code}`);
    // If one server exits, kill the others
    if (code !== 0) {
      console.log('\n❌ One server exited unexpectedly. Stopping all servers...');
      processes.forEach(p => p.kill());
      process.exit(code);
    }
  });

  proc.on('error', (err) => {
    console.error(`${serverConfig.color}[${serverConfig.name}]\x1b[0m failed to start:`, err.message);
  });

  processes.push(proc);
  return proc;
}

// Start all servers
servers.forEach((server, index) => {
  setTimeout(() => startServer(server, index), index * 1000); // Stagger startup by 1 second
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down servers...');
  processes.forEach(proc => proc.kill());
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down servers...');
  processes.forEach(proc => proc.kill());
  process.exit(0);
});

console.log('📡 Servers will be available at:');
console.log('   🌐 Next.js:    http://localhost:3000');
console.log('   🔌 WebSocket:  ws://localhost:3001');
console.log('\nPress Ctrl+C to stop all servers\n');