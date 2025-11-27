import { existsSync, rmSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Clean test results and reports before each test run
 * This ensures we don't accumulate old test results
 *
 * Removes all subdirectories and files except the directory itself
 */
async function globalSetup() {
  const testResultsDir = join(__dirname, '..', 'test-results');
  const reportDir = join(__dirname, '..', 'playwright-report');

  // Clean test-results subdirectories and files (but keep the directory)
  if (existsSync(testResultsDir)) {
    const entries = readdirSync(testResultsDir);
    for (const entry of entries) {
      const fullPath = join(testResultsDir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        rmSync(fullPath, { recursive: true, force: true });
      } else {
        // Remove files too (like old JSON results)
        rmSync(fullPath, { force: true });
      }
    }
  }

  // Clean playwright-report directory completely
  if (existsSync(reportDir)) {
    rmSync(reportDir, { recursive: true, force: true });
  }
}

export default globalSetup;

