# Dungeon Run System Investigation

**Date:** 2025-01-XX
**Status:** Critical Issues Identified
**Priority:** HIGH

## Executive Summary

The dungeon run system has multiple critical issues causing non-reproducible errors, HP management failures, and race conditions. The core problems are:

1. **HP not reset before runs** - Heroes start with stale HP from previous runs
2. **Deferred DB writes** - HP changes only saved at end, lost on failure
3. **Race conditions** - Async operations not properly synchronized
4. **No HP restoration on failure** - Heroes remain at low/zero HP after failed runs
5. **Conflicting fail-safes** - Multiple error handling mechanisms that conflict

## Critical Issues

### 1. HP Not Reset Before Run Starts ⚠️

**Location:** `apps/web/lib/services/dungeonRunService.ts:230-338`

**Problem:**
- Heroes are loaded from database with whatever HP they had from previous run
- No code resets HP to `maxHealth` when a new run starts
- If previous run failed/crashed, heroes can start with 0 HP or very low HP

**Code Evidence:**
```typescript
// Line 241: Load adventurer from DB
let adventurer = await getAdventurer(heroId);

// Line 336: Add to party - NO HP RESET HERE
partyMembers.push(adventurer);
```

**Impact:**
- "Dungeons started with no hp" errors
- Heroes die immediately in first combat
- Non-reproducible because depends on previous run state

**Fix Required:**
- Reset HP to `maxHealth` when loading heroes for a new run
- Or restore HP before run starts

---

### 2. HP Updates Deferred (Batched) ⚠️⚠️

**Location:** `apps/web/lib/services/dungeonRunService.ts:340-572`

**Problem:**
- Combat HP changes stored in memory only (`partyMembers` array)
- HP updates pushed to `deferredStatUpdates` array
- Only written to DB at END of run (line 540-572)
- If run fails/crashes/times out, ALL HP changes are LOST

**Code Evidence:**
```typescript
// Line 340: "FAST MODE: Deferring DB writes"
// Line 347: Accumulate updates
const deferredStatUpdates: Array<...> = [];

// Line 475-486: Update in memory, defer DB write
member.stats = { ...member.stats, ...update.updates };
deferredStatUpdates.push(update);

// Line 540: Only write at END
if (deferredStatUpdates.length > 0) {
  // Batch update...
}
```

**Impact:**
- Non-reproducible errors - if run completes, HP saved; if fails, HP lost
- Heroes can have incorrect HP state
- Database and memory state diverge

**Fix Required:**
- Write HP changes immediately after combat (or at least after each room)
- Or use transactions to ensure atomicity
- Or persist checkpoints periodically

---

### 3. Race Conditions in Async Operations ⚠️

**Location:** Multiple files

**Problem A: `withTimeout` doesn't cancel operations**
```typescript
// Line 111-120: Uses Promise.race
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, ...) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(...)), timeoutMs);
    }),
  ]);
}
```
- If timeout fires, original promise still runs
- Can cause duplicate operations
- Database writes can happen after timeout

**Problem B: Promise.all with error swallowing**
```typescript
// Line 556-570: Errors caught and ignored
const updatePromises = Array.from(updatesByHero.values()).map(update =>
  withTimeout(...).catch(error => {
    console.error(...);
    return null; // ERROR SWALLOWED
  })
);
await Promise.all(updatePromises);
```
- Errors are logged but ignored
- Operations can fail silently
- State can be inconsistent

**Problem C: Heroes locked in parallel, worker starts before lock completes**
```typescript
// apps/web/app/api/runs/route.ts:116-119
await Promise.all([
  dungeonStateService.lockHeroes(run.id, checkingHeroes),
  dungeonStateService.incrementUserDailyRun(walletAddress)
]);

// Line 139: Job enqueued immediately
const job = await runQueue.add('run-simulation', {...});
```
- Worker might start before heroes are fully locked
- Race condition between lock and run start

**Fix Required:**
- Properly cancel operations on timeout
- Don't swallow errors in Promise.all
- Wait for locks to complete before enqueuing job
- Use proper async/await patterns

---

### 4. HP Restoration Only in Safe Rooms ⚠️

**Location:** `apps/web/lib/services/dungeonRunService.ts:1079-1116`

**Problem:**
- `restoreAdventurer` only called in safe rooms
- NOT called at run start
- NOT called at run end
- NOT called on failure

**Code Evidence:**
```typescript
// Line 1079: Only in 'safe' room case
case 'safe': {
  restoreAdventurer(member.heroId, {
    restoreHealth: true,
    restoreMana: true,
  });
}
```

**Impact:**
- Heroes accumulate damage across runs
- No way to recover HP between runs
- Heroes can be permanently at low HP

**Fix Required:**
- Restore HP at run start (or reset to max)
- Optionally restore HP at run end (if victory)
- Restore HP on failure (to prevent permanent low HP)

---

### 5. Heroes Unlocked But HP Not Restored ⚠️

**Location:** `apps/web/workers/runWorker.ts:234-264`

**Problem:**
- `unlockHeroes` only updates `hero_states` table (status = 'idle')
- Does NOT restore HP to maxHealth
- Heroes remain at low/zero HP after run

**Code Evidence:**
```typescript
// Line 244: Unlock heroes
await dungeonStateService.unlockHeroes(checkingHeroes);

// dungeonStateService.ts:133-166
// Only updates hero_states table, no HP restoration
.update({
  status: 'idle',
  locked_until: null,
  current_run_id: null,
})
```

**Impact:**
- Heroes can be permanently at low HP
- Next run starts with low HP
- Creates cascading failures

**Fix Required:**
- Restore HP when unlocking heroes (at least on failure)
- Or reset HP at start of next run

---

## Data Flow Problems

### Current Flow (BROKEN)

```
1. Run Start
   ├─ Load heroes from DB (with stale HP) ❌
   ├─ NO HP reset ❌
   └─ Start run with potentially 0 HP ❌

2. During Run
   ├─ Combat happens
   ├─ HP updated in memory only ❌
   ├─ Changes pushed to deferredStatUpdates ❌
   └─ NOT persisted to DB ❌

3. Run End (Success)
   ├─ Batch write all HP changes ✅
   └─ Unlock heroes (no HP restore) ❌

4. Run End (Failure)
   ├─ HP changes LOST ❌
   ├─ Unlock heroes (no HP restore) ❌
   └─ Heroes remain at low/zero HP ❌

5. Next Run
   └─ Starts with stale HP from previous run ❌
```

### Desired Flow (FIXED)

```
1. Run Start
   ├─ Load heroes from DB
   ├─ Reset HP to maxHealth ✅
   └─ Start run with full HP ✅

2. During Run
   ├─ Combat happens
   ├─ HP updated in memory
   ├─ Persist HP after each room/combat ✅
   └─ Keep DB and memory in sync ✅

3. Run End (Success)
   ├─ Final HP state persisted ✅
   ├─ Unlock heroes
   └─ Optionally restore HP (if desired) ✅

4. Run End (Failure)
   ├─ HP state persisted (if possible) ✅
   ├─ Restore HP to maxHealth ✅
   └─ Unlock heroes ✅

5. Next Run
   └─ Starts with full HP (reset at start) ✅
```

---

## Architecture Issues

### 1. Too Many Conflicting Fail-Safes

**Problem:**
- Multiple error handling mechanisms that conflict
- `withTimeout` wrappers that don't actually cancel
- Error catching that swallows errors
- Multiple retry mechanisms

**Examples:**
- `withTimeout` uses `Promise.race` but doesn't cancel original promise
- `Promise.all` with `.catch()` that returns `null` - errors swallowed
- Try/catch blocks that log but don't handle errors properly

**Fix:**
- Consolidate error handling
- Use proper cancellation (AbortController)
- Don't swallow errors
- Have single source of truth for error handling

### 2. Async Operations Not Properly Awaited

**Problem:**
- `Promise.all` with error swallowing
- `withTimeout` that doesn't cancel original promise
- Operations that continue after timeout

**Fix:**
- Proper async/await patterns
- Use AbortController for cancellation
- Wait for all operations to complete
- Handle errors properly

### 3. Database Writes Deferred

**Problem:**
- All HP changes batched at end
- If anything fails, all changes lost
- No incremental persistence

**Fix:**
- Write HP after each room/combat
- Or use transactions
- Or persist checkpoints periodically
- At minimum, write HP on safe rooms

---

## Worker System Analysis

### Current Worker Architecture

**Workers:**
1. `runWorker` - Processes entire dungeon runs (synchronous)
2. `timerWorker` - Handles timed events
3. `stakingTrackerWorker` - Tracks staking (if enabled)
4. `autoHarvestWorker` - Auto-harvests (if enabled)
5. `replayWorker` - Replays runs

**Issue:**
- `runWorker` processes entire run synchronously
- If worker crashes/restarts, run is lost
- No retry mechanism for failed runs
- Single worker processes one run at a time

**Not the Problem:**
- Multiple workers are NOT being spun up per run
- Each run is one job, processed by one worker
- The issue is the run processing logic, not worker count

---

## Recommendations

### Immediate Fixes (Priority 1)

1. **Reset HP at Run Start**
   - Add HP reset when loading heroes for new run
   - Set `health = maxHealth` before starting

2. **Persist HP After Each Room**
   - Write HP to DB after each room completes
   - Don't defer all writes to end

3. **Restore HP on Failure**
   - When run fails, restore HP to maxHealth
   - Prevent heroes from being permanently at low HP

4. **Fix Race Conditions**
   - Wait for locks to complete before enqueuing job
   - Don't swallow errors in Promise.all
   - Use proper async/await patterns

### Medium Priority Fixes (Priority 2)

5. **Fix withTimeout Implementation**
   - Use AbortController to actually cancel operations
   - Don't let operations continue after timeout

6. **Add Checkpoints**
   - Persist state periodically during run
   - Allow recovery from crashes

7. **Consolidate Error Handling**
   - Single source of truth for error handling
   - Don't have conflicting mechanisms

### Long-term Improvements (Priority 3)

8. **Add Retry Mechanism**
   - Retry failed runs
   - Handle transient errors

9. **Add Monitoring**
   - Track HP state across runs
   - Alert on inconsistencies

10. **Add Tests**
    - Test HP reset logic
    - Test failure scenarios
    - Test race conditions

---

## Files to Modify

### High Priority
1. `apps/web/lib/services/dungeonRunService.ts`
   - Add HP reset at run start (line ~336)
   - Persist HP after each room (line ~475-495)
   - Restore HP on failure

2. `apps/web/workers/runWorker.ts`
   - Restore HP when unlocking heroes on failure (line ~294-303)

3. `apps/web/app/api/runs/route.ts`
   - Wait for locks before enqueuing job (line ~116-152)

### Medium Priority
4. `apps/web/lib/services/dungeonRunService.ts`
   - Fix `withTimeout` implementation (line ~111-120)
   - Fix Promise.all error handling (line ~556-570)

5. `apps/web/lib/services/dungeonStateService.ts`
   - Add HP restoration option to unlockHeroes

---

## Testing Strategy

1. **Test HP Reset**
   - Start run with hero at 0 HP
   - Verify HP reset to maxHealth at start

2. **Test HP Persistence**
   - Start run, take damage, crash run
   - Verify HP persisted correctly

3. **Test Failure Recovery**
   - Cause run to fail
   - Verify HP restored to maxHealth
   - Verify heroes unlocked

4. **Test Race Conditions**
   - Start multiple runs simultaneously
   - Verify no race conditions
   - Verify locks work correctly

---

## Conclusion

The dungeon run system has critical issues with HP management and async operations. The main problems are:

1. HP not reset before runs
2. HP updates deferred and lost on failure
3. Race conditions in async operations
4. No HP restoration on failure

These issues cause non-reproducible errors and heroes starting with no HP. The fixes are straightforward but require careful implementation to avoid breaking existing functionality.

