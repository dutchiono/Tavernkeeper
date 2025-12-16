# Test Suite

This directory contains all test files for the web application.

## Quick Start for New Developers

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode (recommended for development):**
```bash
npm test -- --watch
```

**Run a specific test file:**
```bash
npm test -- dungeonRunHpManagement.test.ts
```

**Run tests matching a pattern:**
```bash
npm test -- --grep "HP Management"
```

### Understanding Test Output

When tests run, you'll see:

```
✅ Passing tests show in green
❌ Failing tests show in red with error details
⏭️  Skipped tests show in yellow
```

**Example output:**
```
✓ __tests__/services/dungeonRunHpManagement.test.ts (10 tests) 36ms
  ✓ HP Reset at Run Start (3 tests)
  ✓ Redis Checkpointing (4 tests)
  ❌ HP Persistence Strategy (2 tests) - 1 failed
```

### Reading Error Messages

When a test fails, vitest shows:

1. **Test name** - Which test failed
2. **Expected vs Received** - What was expected vs what actually happened
3. **Stack trace** - Where the error occurred in the code

**Example:**
```
FAIL  __tests__/services/dungeonRunHpManagement.test.ts > should save checkpoint
AssertionError: expected "spy" to be called with arguments: [ 'dungeon_run:checkpoint:run-123' ]

Received: Number of calls: 0

❯ __tests__/services/dungeonRunHpManagement.test.ts:204:31
```

**How to read this:**
- The test expected `mockRedis.setex` to be called with specific arguments
- But it was never called (0 calls)
- The error points to line 204 in the test file

### Watch Mode

**Watch mode automatically re-runs tests when files change:**

```bash
npm test -- --watch
```

**Watch mode commands:**
- `a` - Run all tests
- `f` - Run only failed tests
- `q` - Quit watch mode
- `p` - Filter by filename pattern
- `t` - Filter by test name pattern

**When to use watch mode:**
- ✅ When writing new tests
- ✅ When debugging failing tests
- ✅ When refactoring code
- ❌ When running CI/CD (use `--run` instead)

### Getting Help from AI Agents

**When asking an agent to help with tests, provide:**

1. **The test file name:**
   ```
   "Help me fix the tests in __tests__/services/dungeonRunHpManagement.test.ts"
   ```

2. **The error output:**
   ```
   "The test 'should save checkpoint' is failing with: expected spy to be called..."
   ```

3. **What you're trying to test:**
   ```
   "I'm testing that Redis checkpoints are saved after each dungeon level"
   ```

4. **What you've tried:**
   ```
   "I've checked the mocks but the Redis client isn't being called"
   ```

**Example prompt for an agent:**
```
I have a failing test in __tests__/services/dungeonRunHpManagement.test.ts.
The test "should save checkpoint to Redis after each level" is failing because
mockRedis.setex is never called. The error shows "Number of calls: 0".
I think the issue is that the dungeon run ends early before checkpoints are saved.
Can you help me fix the mocks so the run progresses and checkpoints are saved?
```

### Common Test Patterns

**Mocking Supabase:**
```typescript
(supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
  select: vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    }),
  }),
});
```

**Mocking Services:**
```typescript
vi.mock('@/lib/services/myService');
(myServiceModule.myFunction as any) = vi.fn().mockResolvedValue(mockResult);
```

**Testing Async Functions:**
```typescript
it('should handle async operations', async () => {
  const result = await myAsyncFunction();
  expect(result).toBe(expectedValue);
});
```

**Testing Error Cases:**
```typescript
it('should handle errors gracefully', async () => {
  (myServiceModule.myFunction as any) = vi.fn().mockRejectedValue(new Error('Test error'));
  await expect(myFunction()).rejects.toThrow('Test error');
});
```

### Test File Organization

```
__tests__/
├── api/              # API route tests
├── services/         # Service layer tests
├── workers/          # Worker tests
├── lib/              # Library tests
└── README.md         # This file
```

**Naming convention:**
- Test files: `*.test.ts` or `*.spec.ts`
- Match source file names: `dungeonRunService.ts` → `dungeonRunService.test.ts`

### Debugging Tips

1. **Add console.logs:**
   ```typescript
   it('should do something', async () => {
     console.log('Before:', someValue);
     const result = await myFunction();
     console.log('After:', result);
     expect(result).toBe(expected);
   });
   ```

2. **Use `.only` to run one test:**
   ```typescript
   it.only('should do something', async () => {
     // Only this test will run
   });
   ```

3. **Use `.skip` to skip a test:**
   ```typescript
   it.skip('should do something', async () => {
     // This test will be skipped
   });
   ```

4. **Check mock calls:**
   ```typescript
   expect(mockFunction).toHaveBeenCalled();
   expect(mockFunction).toHaveBeenCalledWith(expectedArgs);
   expect(mockFunction).toHaveBeenCalledTimes(2);
   ```

### Test Coverage

**Run with coverage:**
```bash
npm test -- --coverage
```

**Coverage reports show:**
- Which lines are tested
- Which functions are tested
- Which branches are tested

**Aim for:**
- 80%+ line coverage
- 100% coverage for critical paths (HP management, error handling)

### CI/CD Integration

Tests run automatically in CI/CD. If tests fail:
1. Check the CI logs for error details
2. Run tests locally to reproduce
3. Fix the issue
4. Push the fix

**Running tests like CI:**
```bash
npm test -- --run  # No watch mode, exits after completion
```

## Test Categories

### ✅ Safe Tests (No Contract Calls)
All tests in `__tests__/api/` are **fully mocked** and will NOT make any real contract calls or spend any money. They test:
- API route handlers
- Request/response validation
- Error handling
- Business logic

These tests mock all external dependencies:
- `@/lib/services/*` - All service functions are mocked
- `@/lib/wallet/testnetWallet` - Wallet creation is mocked
- `viem` - Blockchain client is mocked
- `fetch` - HTTP calls are mocked

### ⚠️ Contract Integration Tests (Separate Suite)
Tests that would interact with contracts are in separate files and are **NOT RUN** by default:
- `__tests__/services/tavernKeeperService.test.ts` - May make real calls if not properly mocked
- Any test that imports actual contract services without mocking

## Running Tests

### Run All Safe Tests (Default)
```bash
pnpm test
```

This runs all tests in `__tests__/` which are fully mocked and safe.

### Run Specific Test Files
```bash
pnpm test __tests__/api/marketplace-list.test.ts
```

## Test Safety Guarantees

1. **All API route tests are mocked** - They test route handlers, not actual contract interactions
2. **No real network calls** - `fetch`, `viem`, and all blockchain clients are mocked
3. **No wallet operations** - All wallet functions return mock data
4. **No transaction costs** - No real transactions are sent

## Adding New Tests

When adding new tests:

1. **Always mock external dependencies:**
   ```typescript
   vi.mock('@/lib/services/marketplace');
   vi.mock('@/lib/wallet/testnetWallet');
   ```

2. **Mock viem if used:**
   ```typescript
   vi.mock('viem', async () => {
     const actual = await vi.importActual('viem');
     return {
       ...actual,
       createPublicClient: vi.fn(() => ({
         readContract: vi.fn(),
       })),
     };
   });
   ```

3. **Mock fetch for HTTP calls:**
   ```typescript
   global.fetch = vi.fn();
   ```

4. **Never use real wallet addresses or private keys in tests**

## E2E Tests

E2E tests in `e2e/` may make HTTP requests to your local server, but they:
- Do NOT interact with real blockchain networks
- Do NOT send real transactions
- Only test UI and API endpoints (which should be mocked in test environment)

## Test Analysis Documents

- **`TEST_ANALYSIS_HP_MANAGEMENT.md`** - Detailed analysis of HP management test failures and whether they're mock issues or real problems
