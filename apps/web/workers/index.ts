// Load environment variables BEFORE importing any modules that use them
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
// Load environment variables
// 2. Try default .env in current dir (apps/web) - in case they have one there
dotenv.config();

// 3. Try root .env (../../.env) - This is the PRIMARY source as per user
const rootEnvPath = path.resolve(process.cwd(), '../../.env');
const result = dotenv.config({ path: rootEnvPath });

if (result.error) {
  console.warn('Warning: Could not load root .env file from:', rootEnvPath);
} else {
  console.log('Loaded root .env file from:', rootEnvPath);
}

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

