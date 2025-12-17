/**
 * Test Policy Configuration
 *
 * This file defines the test requirements and coverage thresholds for the repository.
 * It serves as the single source of truth for test governance and is used by:
 * - Meta-tests (repo-health.test.ts)
 * - Vitest coverage configuration
 * - Architecture analysis scripts
 */

export const TEST_POLICY = {
  // Files that MUST have at least one test
  mustBeTestedGlobs: [
    "apps/web/lib/**/*.ts",
    "apps/web/app/api/**/*.ts",
    "apps/web/workers/**/*.ts",
    "packages/*/src/**/*.ts",
    "packages/*/__tests__/**/*.ts"
  ],

  // Files that are allowed to be untested
  allowedUntestedGlobs: [
    "**/*.d.ts",
    "**/index.ts",
    "**/types.ts",
    "**/constants.ts",
    "**/__generated__/**",
    "**/dist/**",
    "**/node_modules/**",
    "**/vitest.config.ts",
    "**/vitest.setup.ts",
    "**/vitest.config.*.ts",
    "apps/web/app/**/page.tsx", // Next.js pages
    "apps/web/app/**/layout.tsx",
    "apps/web/app/**/loading.tsx",
    "apps/web/app/**/error.tsx",
    "apps/web/app/**/not-found.tsx",
    "apps/web/app/**/template.tsx",
    "apps/web/app/**/opengraph-image.*",
    "apps/web/app/**/icon.*",
    "apps/web/app/**/apple-icon.*",
    "apps/web/app/**/favicon.*",
    "apps/web/app/**/robots.txt",
    "apps/web/app/**/sitemap.*",
    "apps/web/app/**/route.ts", // API routes are tested via their handlers
    "**/test-policy.ts", // This file itself
    "**/scripts/**/*.ts", // Scripts are not unit tested
    "**/contributions/**/*.ts", // Contribution code may have its own test structure
  ],

  // Directories that should never contain orphans
  noOrphansIn: [
    "apps/web/lib",
    "apps/web/app/api",
    "apps/web/workers",
    "packages/*/src"
  ],

  // Minimum global coverage thresholds
  coverage: {
    statements: 70,
    branches: 60,
    functions: 65,
    lines: 70
  },

  // Architectural zones with different requirements
  zones: {
    "api": {
      coverage: 80,
      description: "API routes need higher coverage due to external interface"
    },
    "workers": {
      coverage: 75,
      description: "Workers need good coverage due to background processing"
    },
    "services": {
      coverage: 75,
      description: "Services need good coverage due to business logic"
    },
    "lib": {
      coverage: 70,
      description: "Library code needs solid coverage"
    }
  },

  // Test file naming patterns
  testFilePatterns: [
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "**/__tests__/**/*.ts",
    "**/__tests__/**/*.tsx"
  ],

  // Files that should be excluded from coverage reports
  coverageExclude: [
    "**/*.d.ts",
    "**/index.ts",
    "**/types.ts",
    "**/constants.ts",
    "**/__generated__/**",
    "**/dist/**",
    "**/node_modules/**",
    "**/vitest.config.ts",
    "**/vitest.setup.ts",
    "**/test-policy.ts",
    "apps/web/app/**/page.tsx",
    "apps/web/app/**/layout.tsx",
    "apps/web/app/**/loading.tsx",
    "apps/web/app/**/error.tsx",
    "apps/web/app/**/not-found.tsx",
    "apps/web/app/**/template.tsx"
  ]
};

