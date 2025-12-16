# Dungeon Run Flowcharts

## Current Flow (BROKEN) - Run Start to End

```
┌─────────────────────────────────────────────────────────────────┐
│                    DUNGEON RUN - CURRENT FLOW                   │
└─────────────────────────────────────────────────────────────────┘

1. USER INITIATES RUN
   │
   ├─ POST /api/runs
   │  │
   │  ├─ Check hero availability
   │  ├─ Check daily limits
   │  ├─ Create run record in DB
   │  ├─ Lock heroes (Promise.all) ⚠️
   │  └─ Enqueue job to Redis ⚠️ (might start before lock completes)
   │
   └─ Return run ID

2. WORKER PICKS UP JOB
   │
   ├─ runWorker.processJob()
   │  │
   │  ├─ Fetch run data from DB
   │  ├─ Get wallet address
   │  └─ Call executeDungeonRun()
   │
   └─ ⚠️ Heroes might not be locked yet

3. EXECUTE DUNGEON RUN
   │
   ├─ Load dungeon from DB
   │
   ├─ Load party members
   │  │
   │  ├─ For each hero:
   │  │  ├─ getAdventurer(heroId) ⚠️ Gets STALE HP from DB
   │  │  ├─ Load equipment
   │  │  └─ Add to partyMembers ⚠️ NO HP RESET
   │  │
   │  └─ ⚠️ Heroes can have 0 HP or low HP
   │
   ├─ Execute levels (while loop)
   │  │
   │  ├─ For each level:
   │  │  │
   │  │  ├─ Execute rooms
   │  │  │  │
   │  │  │  ├─ Combat room:
   │  │  │  │  ├─ Initialize combat
   │  │  │  │  ├─ Run combat (HP updated in memory)
   │  │  │  │  ├─ Extract HP from finalState
   │  │  │  │  └─ Push to deferredStatUpdates ⚠️ NOT PERSISTED
   │  │  │  │
   │  │  │  ├─ Safe room:
   │  │  │  │  ├─ restoreAdventurer() ✅ (only place HP restored)
   │  │  │  │  └─ Push to deferredStatUpdates
   │  │  │  │
   │  │  │  └─ Other rooms...
   │  │  │
   │  │  ├─ Update partyMembers in memory ⚠️
   │  │  └─ Accumulate deferredStatUpdates ⚠️
   │  │
   │  └─ Continue to next level
   │
   ├─ Run completes (success or failure)
   │
   ├─ IF SUCCESS:
   │  │
   │  └─ Batch write deferredStatUpdates ⚠️ (only if run completes)
   │
   └─ IF FAILURE:
      │
      └─ ⚠️ deferredStatUpdates LOST (never written to DB)

4. WORKER CLEANUP
   │
   ├─ Update run status in DB
   │
   ├─ Unlock heroes
   │  │
   │  └─ ⚠️ Only updates hero_states table
   │     └─ ⚠️ NO HP RESTORATION
   │
   └─ Return result

5. NEXT RUN
   │
   └─ ⚠️ Starts with STALE HP from previous run
      └─ Problem repeats
```

---

## Fixed Flow (PROPOSED) - Run Start to End

```
┌─────────────────────────────────────────────────────────────────┐
│                  DUNGEON RUN - FIXED FLOW                      │
└─────────────────────────────────────────────────────────────────┘

1. USER INITIATES RUN
   │
   ├─ POST /api/runs
   │  │
   │  ├─ Check hero availability
   │  ├─ Check daily limits
   │  ├─ Create run record in DB
   │  ├─ Lock heroes (await all) ✅
   │  └─ Wait for locks to complete ✅
   │     └─ Then enqueue job to Redis ✅
   │
   └─ Return run ID

2. WORKER PICKS UP JOB
   │
   ├─ runWorker.processJob()
   │  │
   │  ├─ Fetch run data from DB
   │  ├─ Get wallet address
   │  └─ Call executeDungeonRun()
   │
   └─ ✅ Heroes are guaranteed to be locked

3. EXECUTE DUNGEON RUN
   │
   ├─ Load dungeon from DB
   │
   ├─ Load party members
   │  │
   │  ├─ For each hero:
   │  │  ├─ getAdventurer(heroId)
   │  │  ├─ ✅ RESET HP to maxHealth ✅
   │  │  ├─ Load equipment
   │  │  └─ Add to partyMembers
   │  │
   │  └─ ✅ Heroes start with full HP
   │
   ├─ Execute levels (while loop)
   │  │
   │  ├─ For each level:
   │  │  │
   │  │  ├─ Execute rooms
   │  │  │  │
   │  │  │  ├─ Combat room:
   │  │  │  │  ├─ Initialize combat
   │  │  │  │  ├─ Run combat (HP updated in memory)
   │  │  │  │  ├─ Extract HP from finalState
   │  │  │  │  ├─ ✅ PERSIST HP to DB immediately ✅
   │  │  │  │  └─ Update partyMembers in memory
   │  │  │  │
   │  │  │  ├─ Safe room:
   │  │  │  │  ├─ restoreAdventurer()
   │  │  │  │  └─ ✅ PERSIST HP to DB immediately ✅
   │  │  │  │
   │  │  │  └─ Other rooms...
   │  │  │
   │  │  └─ Continue to next level
   │  │
   │  └─ ✅ HP always in sync with DB
   │
   ├─ Run completes (success or failure)
   │
   └─ ✅ HP already persisted (no batch write needed)

4. WORKER CLEANUP
   │
   ├─ Update run status in DB
   │
   ├─ IF SUCCESS:
   │  │
   │  └─ Unlock heroes (HP already correct)
   │
   └─ IF FAILURE:
      │
      ├─ ✅ RESTORE HP to maxHealth ✅
      └─ Unlock heroes

5. NEXT RUN
   │
   └─ ✅ Starts with full HP (reset at start) ✅
      └─ No cascading failures
```

---

## HP Management Flow - Current (BROKEN)

```
┌─────────────────────────────────────────────────────────────────┐
│              HP MANAGEMENT - CURRENT FLOW (BROKEN)              │
└─────────────────────────────────────────────────────────────────┘

RUN START
   │
   ├─ Load hero from DB
   │  │
   │  └─ hero.stats.health = 0 ⚠️ (from previous failed run)
   │
   ├─ Add to partyMembers
   │  │
   │  └─ ⚠️ NO HP RESET
   │
   └─ Start run with 0 HP ⚠️

DURING RUN
   │
   ├─ Combat happens
   │  │
   │  ├─ HP updated in memory: partyMembers[].stats.health
   │  ├─ Push to deferredStatUpdates[]
   │  └─ ⚠️ NOT written to DB
   │
   └─ DB and memory diverge ⚠️

RUN END (SUCCESS)
   │
   ├─ Batch write deferredStatUpdates[]
   │  │
   │  └─ ✅ HP saved to DB
   │
   └─ Unlock heroes (no HP restore)

RUN END (FAILURE)
   │
   ├─ ⚠️ deferredStatUpdates[] LOST
   │  │
   │  └─ ⚠️ HP changes never saved
   │
   ├─ Unlock heroes
   │  │
   │  └─ ⚠️ NO HP RESTORATION
   │
   └─ Hero remains at 0 HP ⚠️

NEXT RUN
   │
   └─ Starts with 0 HP again ⚠️
      └─ Problem repeats
```

---

## HP Management Flow - Fixed (PROPOSED)

```
┌─────────────────────────────────────────────────────────────────┐
│              HP MANAGEMENT - FIXED FLOW                        │
└─────────────────────────────────────────────────────────────────┘

RUN START
   │
   ├─ Load hero from DB
   │  │
   │  └─ hero.stats.health = 0 (from previous failed run)
   │
   ├─ ✅ RESET HP to maxHealth ✅
   │  │
   │  └─ hero.stats.health = hero.stats.maxHealth
   │
   ├─ Add to partyMembers
   │  │
   │  └─ ✅ Starts with full HP
   │
   └─ ✅ Persist reset HP to DB ✅

DURING RUN
   │
   ├─ Combat happens
   │  │
   │  ├─ HP updated in memory: partyMembers[].stats.health
   │  ├─ ✅ PERSIST HP to DB immediately ✅
   │  └─ ✅ DB and memory stay in sync
   │
   └─ ✅ HP always persisted

RUN END (SUCCESS)
   │
   ├─ ✅ HP already persisted (no batch needed)
   │
   └─ Unlock heroes (HP already correct)

RUN END (FAILURE)
   │
   ├─ ✅ HP already persisted (from last room)
   │
   ├─ ✅ RESTORE HP to maxHealth ✅
   │  │
   │  └─ ✅ Persist restored HP to DB
   │
   ├─ Unlock heroes
   │  │
   │  └─ ✅ Hero at full HP
   │
   └─ ✅ Ready for next run

NEXT RUN
   │
   └─ ✅ Starts with full HP (reset at start) ✅
      └─ No cascading failures
```

---

## Race Condition Flow - Current (BROKEN)

```
┌─────────────────────────────────────────────────────────────────┐
│           RACE CONDITION - CURRENT FLOW (BROKEN)               │
└─────────────────────────────────────────────────────────────────┘

API ROUTE (/api/runs)
   │
   ├─ Create run record
   │
   ├─ Promise.all([
   │     lockHeroes(),      ⚠️ Async operation
   │     incrementDaily()   ⚠️ Async operation
   │   ])
   │   │
   │   └─ ⚠️ Doesn't wait for completion
   │
   ├─ Enqueue job to Redis ⚠️ IMMEDIATELY
   │
   └─ Return run ID

WORKER
   │
   ├─ Job picked up from queue
   │
   ├─ Starts processing ⚠️
   │  │
   │  └─ ⚠️ Heroes might not be locked yet
   │
   └─ Race condition! ⚠️

TIMEOUT ISSUE
   │
   ├─ withTimeout(promise, 5000)
   │  │
   │  ├─ Promise.race([
   │  │     promise,              ⚠️ Original promise
   │  │     timeout(5000)         ⚠️ Timeout promise
   │  │   ])
   │  │
   │  └─ ⚠️ If timeout wins, original promise STILL RUNS
   │
   └─ ⚠️ Operations continue after timeout
```

---

## Race Condition Flow - Fixed (PROPOSED)

```
┌─────────────────────────────────────────────────────────────────┐
│              RACE CONDITION - FIXED FLOW                        │
└─────────────────────────────────────────────────────────────────┘

API ROUTE (/api/runs)
   │
   ├─ Create run record
   │
   ├─ await Promise.all([
   │     lockHeroes(),      ✅ Wait for completion
   │     incrementDaily()   ✅ Wait for completion
   │   ])
   │   │
   │   └─ ✅ All operations complete
   │
   ├─ ✅ Verify heroes are locked
   │
   ├─ Enqueue job to Redis ✅ AFTER locks complete
   │
   └─ Return run ID

WORKER
   │
   ├─ Job picked up from queue
   │
   ├─ ✅ Heroes guaranteed to be locked
   │
   └─ ✅ No race condition

TIMEOUT ISSUE
   │
   ├─ withTimeout(promise, 5000, abortController)
   │  │
   │  ├─ Promise.race([
   │  │     promise,              ✅ With abort signal
   │  │     timeout(5000)         ✅ Cancels on timeout
   │  │   ])
   │  │
   │  └─ ✅ Original promise cancelled on timeout
   │
   └─ ✅ Operations stop on timeout
```

---

## Error Handling Flow - Current (BROKEN)

```
┌─────────────────────────────────────────────────────────────────┐
│          ERROR HANDLING - CURRENT FLOW (BROKEN)               │
└─────────────────────────────────────────────────────────────────┘

PROMISE.ALL WITH ERROR SWALLOWING
   │
   ├─ Promise.all([
   │     operation1().catch(() => null),  ⚠️ Error swallowed
   │     operation2().catch(() => null),  ⚠️ Error swallowed
   │     operation3().catch(() => null)   ⚠️ Error swallowed
   │   ])
   │   │
   │   └─ ⚠️ Errors logged but ignored
   │
   └─ ⚠️ State can be inconsistent

WITH TIMEOUT
   │
   ├─ withTimeout(operation, 5000)
   │  │
   │  ├─ Timeout fires after 5s
   │  │  │
   │  │  └─ ⚠️ Error thrown
   │  │
   │  └─ ⚠️ Original operation STILL RUNS
   │     │
   │     └─ ⚠️ Can cause duplicate operations

ERROR CATCHING
   │
   ├─ try {
   │     await operation()
   │   } catch (error) {
   │     console.error(error)  ⚠️ Only logged
   │     // ⚠️ No handling, no recovery
   │   }
   │
   └─ ⚠️ Errors don't propagate
```

---

## Error Handling Flow - Fixed (PROPOSED)

```
┌─────────────────────────────────────────────────────────────────┐
│              ERROR HANDLING - FIXED FLOW                        │
└─────────────────────────────────────────────────────────────────┘

PROMISE.ALL WITH PROPER ERROR HANDLING
   │
   ├─ Promise.allSettled([
   │     operation1(),  ✅ Errors captured
   │     operation2(),  ✅ Errors captured
   │     operation3()   ✅ Errors captured
   │   ])
   │   │
   │   ├─ Check each result
   │   │
   │   └─ ✅ Handle errors appropriately
   │
   └─ ✅ State stays consistent

WITH TIMEOUT (ABORT CONTROLLER)
   │
   ├─ const abortController = new AbortController()
   │
   ├─ withTimeout(operation, 5000, abortController)
   │  │
   │  ├─ Timeout fires after 5s
   │  │  │
   │  │  ├─ abortController.abort()  ✅ Cancel operation
   │  │  └─ Error thrown
   │  │
   │  └─ ✅ Original operation CANCELLED
   │
   └─ ✅ No duplicate operations

ERROR CATCHING
   │
   ├─ try {
   │     await operation()
   │   } catch (error) {
   │     console.error(error)
   │     await handleError(error)  ✅ Proper handling
   │     await recover()           ✅ Recovery logic
   │     throw error               ✅ Propagate if needed
   │   }
   │
   └─ ✅ Errors handled and recovered
```

---

## Summary

The flowcharts show:

1. **Current Flow (BROKEN):**
   - HP not reset at start
   - HP updates deferred and lost on failure
   - Race conditions in async operations
   - No HP restoration on failure
   - Errors swallowed

2. **Fixed Flow (PROPOSED):**
   - HP reset at start
   - HP persisted immediately
   - Proper async/await patterns
   - HP restoration on failure
   - Proper error handling

The fixes are straightforward but require careful implementation to avoid breaking existing functionality.

