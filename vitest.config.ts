import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // Setup file for environment variables (relative to root)
    setupFiles: [path.resolve(__dirname, './apps/web/vitest.setup.ts')],
    // Discover tests across all packages (relative to root)
    include: [
      path.resolve(__dirname, 'apps/**/__tests__/**/*.test.ts'),
      path.resolve(__dirname, 'packages/**/__tests__/**/*.test.ts'),
    ],
    exclude: [
      '**/node_modules/**',
      '**/e2e/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    reporters: [
      'verbose', // Shows each test file and suite clearly
      ['json', { outputFile: 'apps/web/test-results/vitest-results.json' }],
    ],
    // Show test file names and suite names clearly
    outputFile: {
      json: 'apps/web/test-results/vitest-results.json',
    },
    // Show clearer output
    logHeapUsage: false,
    silent: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/web'),
      '@innkeeper/engine': path.resolve(__dirname, './packages/engine/src'),
      '@innkeeper/agents': path.resolve(__dirname, './packages/agents/src'),
      '@innkeeper/lib': path.resolve(__dirname, './packages/lib/src'),
    },
  },
});

