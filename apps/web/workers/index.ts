// Load environment variables BEFORE importing any modules that use them
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
// Load environment variables
// 1. Try default .env in current dir (apps/web)
dotenv.config();
// 2. Try root .env (../../.env)
const rootEnvPath = path.resolve(process.cwd(), '../../.env');
dotenv.config({ path: rootEnvPath });

console.log('Worker Environment Loaded. REDIS_URL present:', !!process.env.REDIS_URL);

async function start() {
  // Use dynamic imports to ensure env vars are loaded BEFORE modules initialize
  await import('./runWorker');
  await import('./replayWorker');

  console.log('Workers started. Listening for jobs...');
}

start();

// Keep process alive
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down workers...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down workers...');
  process.exit(0);
});

