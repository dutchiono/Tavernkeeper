import { defineConfig } from 'vitest/config';
import path from 'path';
import { existsSync, rmSync } from 'fs';

// Clean vitest results before each run
const testResultsFile = path.join(__dirname, 'test-results', 'vitest-results.json');
if (existsSync(testResultsFile)) {
  rmSync(testResultsFile, { force: true });
}

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/node_modules/**', '**/e2e/**', '**/.{idea,git,cache,output,temp}/**'],
    reporters: [
      'default',
      ['json', { outputFile: 'test-results/vitest-results.json' }], // Overwrites previous file
    ],
    // Use forks instead of threads to avoid "Terminating worker thread" errors
    // These errors are harmless but occur during worker cleanup with threads
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: false,
        isolate: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  // Suppress esbuild CJS deprecation warning
  esbuild: {
    target: 'node18',
  },
});
