# TavernKeeper Architecture Overview

## System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        SYSTEM ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   FRONTEND   │  Next.js App (apps/web)
│  (React/TS)  │  - UI Components
└──────┬───────┘  - Game State Management
       │
       │ HTTP/REST
       │
┌──────▼──────────────────────────────────────────────────────┐
│                    API ROUTES                                 │
│  /api/runs          - Create dungeon runs                     │
│  /api/runs/[id]     - Get run status                          │
│  /api/dungeons      - Dungeon management                      │
│  /api/world         - World initialization                    │
└──────┬──────────────────────────────────────────────────────┘
       │
       │
┌──────▼──────────────────────────────────────────────────────┐
│                    REDIS QUEUE (BullMQ)                       │
│  - run-simulation   - Dungeon run jobs                        │
│  - timer-events     - Timed event delivery                    │
│  - replay           - Run replay jobs                         │
└──────┬──────────────────────────────────────────────────────┘
       │
       │
┌──────▼──────────────────────────────────────────────────────┐
│                    WORKERS                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ runWorker         - Processes dungeon runs            │  │
│  │ timerWorker       - Delivers timed events              │  │
│  │ replayWorker      - Replays runs                       │  │
│  │ stakingTracker    - Tracks staking (optional)          │  │
│  │ autoHarvest       - Auto-harvests (optional)           │  │
│  └──────────────────────────────────────────────────────┘  │
└──────┬──────────────────────────────────────────────────────┘
       │
       │
┌──────▼──────────────────────────────────────────────────────┐
│              DUNGEON RUN SERVICE                             │
│  - executeDungeonRun()  - Main orchestration                 │
│  - executeRoom()        - Room processing                    │
│  - Combat integration   - Combat system                      │
│  - HP management        - Health tracking                    │
└──────┬──────────────────────────────────────────────────────┘
       │
       │
┌──────▼──────────────────────────────────────────────────────┐
│              CONTRIBUTION SYSTEMS                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ adventurer-tracking    - Hero stats/HP                │  │
│  │ combat-system          - Combat resolution            │  │
│  │ themed-dungeon-gen     - Dungeon generation           │  │
│  │ inventory-tracking     - Equipment/items              │  │
│  │ monster-stat-blocks    - Monster stats                 │  │
│  │ procedural-item-gen    - Item generation               │  │
│  │ timer-system           - Event scheduling              │  │
│  └──────────────────────────────────────────────────────┘  │
└──────┬──────────────────────────────────────────────────────┘
       │
       │
┌──────▼──────────────────────────────────────────────────────┐
│              SUPABASE (PostgreSQL)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ runs              - Run records                       │  │
│  │ dungeons          - Dungeon definitions               │  │
│  │ adventurers       - Hero stats/HP                      │  │
│  │ hero_states       - Hero lock status                  │  │
│  │ run_events        - Event logs                        │  │
│  │ user_dungeon_stats - Daily limits                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow - Dungeon Run

```
USER ACTION
   │
   ├─ Select party
   ├─ Select dungeon
   └─ Click "Start Run"

FRONTEND
   │
   ├─ POST /api/runs
   │  │
   │  └─ { party, dungeonId, walletAddress }
   │
   └─ Display "Run queued..."

API ROUTE (/api/runs)
   │
   ├─ Validate input
   ├─ Check hero availability
   ├─ Check daily limits
   ├─ Create run record in DB
   ├─ Lock heroes in hero_states
   └─ Enqueue job to Redis

REDIS QUEUE
   │
   └─ Job: { runId, dungeonId, party, seed, startTime }

WORKER (runWorker)
   │
   ├─ Pick up job from queue
   ├─ Call executeDungeonRun()
   │  │
   │  ├─ Load dungeon from DB
   │  ├─ Load party members (with HP) ⚠️
   │  ├─ Execute levels/rooms
   │  │  │
   │  │  ├─ Combat rooms
   │  │  │  ├─ Initialize combat
   │  │  │  ├─ Run combat (HP in memory)
   │  │  │  └─ Update party HP ⚠️ (deferred)
   │  │  │
   │  │  ├─ Safe rooms
   │  │  │  └─ Restore HP ✅
   │  │  │
   │  │  └─ Other rooms...
   │  │
   │  ├─ Batch write HP updates ⚠️ (only if success)
   │  └─ Return result
   │
   ├─ Update run status in DB
   ├─ Unlock heroes
   └─ Return job result

FRONTEND (Polling)
   │
   ├─ GET /api/runs/[id]
   │  │
   │  └─ Check status
   │
   └─ Display results when complete
```

---

## HP Management Architecture

### Current State (BROKEN)

```
HP STORAGE:
  ┌─────────────────┐
  │  Supabase DB     │  adventurers.health (persistent)
  │                  │  ⚠️ Can be stale
  └────────┬─────────┘
           │
           │ Load at run start
           │
  ┌────────▼─────────┐
  │  Memory          │  partyMembers[].stats.health (in-memory)
  │  (dungeonRun)    │  ⚠️ Only updated during run
  └────────┬─────────┘
           │
           │ Updated during combat
           │
  ┌────────▼─────────┐
  │  Combat System   │  CombatEntity.currentHp (in-memory)
  │                  │  ⚠️ Separate from partyMembers
  └──────────────────┘

HP FLOW:
  DB → Memory → Combat → Memory → DB (only if success) ⚠️

PROBLEMS:
  - HP not reset at start
  - HP updates deferred
  - HP lost on failure
  - Multiple HP representations
```

### Proposed State (FIXED)

```
HP STORAGE:
  ┌─────────────────┐
  │  Supabase DB     │  adventurers.health (source of truth)
  │                  │  ✅ Always up-to-date
  └────────┬─────────┘
           │
           │ Load & Reset at run start
           │
  ┌────────▼─────────┐
  │  Memory          │  partyMembers[].stats.health (cache)
  │  (dungeonRun)    │  ✅ Synced with DB
  └────────┬─────────┘
           │
           │ Updated during combat
           │
  ┌────────▼─────────┐
  │  Combat System   │  CombatEntity.currentHp (temporary)
  │                  │  ✅ Synced with partyMembers
  └──────────────────┘

HP FLOW:
  DB → Reset → Memory → Combat → Memory → DB (immediately) ✅

FIXES:
  - HP reset at start ✅
  - HP persisted immediately ✅
  - HP restored on failure ✅
  - Single source of truth ✅
```

---

## Worker Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    WORKER SYSTEM                             │
└─────────────────────────────────────────────────────────────┘

WORKER TYPES:
  ┌──────────────────────────────────────────────────────┐
  │ runWorker                                             │
  │  - Processes dungeon runs                            │
  │  - One job = one complete run                        │
  │  - Synchronous processing                            │
  │  - ⚠️ No retry on failure                            │
  └──────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────┐
  │ timerWorker                                          │
  │  - Delivers timed events                             │
  │  - Scheduled events                                  │
  └──────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────┐
  │ replayWorker                                         │
  │  - Replays completed runs                            │
  │  - For debugging/testing                             │
  └──────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────┐
  │ stakingTrackerWorker (optional)                      │
  │  - Tracks staking rewards                            │
  └──────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────┐
  │ autoHarvestWorker (optional)                         │
  │  - Auto-harvests rewards                             │
  └──────────────────────────────────────────────────────┘

WORKER LIFECYCLE:
  1. Worker starts
  2. Connects to Redis
  3. Listens for jobs
  4. Processes job when available
  5. Updates job status
  6. Returns result

NOT THE PROBLEM:
  - Multiple workers are NOT being spun up per run
  - Each run is one job, processed by one worker
  - The issue is the run processing logic, not worker count
```

---

## Database Schema (Relevant Tables)

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE TABLES                           │
└─────────────────────────────────────────────────────────────┘

runs
  - id (UUID)
  - dungeon_id (UUID)
  - party (text[])
  - seed (text)
  - status (text)
  - start_time (timestamp)
  - wallet_address (text)

adventurers
  - token_id (text)
  - contract_address (text)
  - health (int) ⚠️ Can be stale
  - max_health (int)
  - mana (int)
  - ... other stats

hero_states
  - contract_address (text)
  - token_id (text)
  - status ('idle' | 'dungeon')
  - locked_until (timestamp)
  - current_run_id (UUID)

run_events
  - id (UUID)
  - run_id (UUID)
  - event_type (text)
  - event_data (jsonb)
  - timestamp (timestamp)

dungeons
  - id (UUID)
  - seed (text)
  - map (jsonb)
  - ... other fields
```

---

## Key Issues Summary

1. **HP Management**
   - Not reset at run start
   - Updates deferred and lost on failure
   - Not restored on failure

2. **Async Operations**
   - Race conditions
   - Errors swallowed
   - Timeouts don't cancel operations

3. **Data Consistency**
   - DB and memory can diverge
   - No single source of truth
   - Lost updates on failure

4. **Error Handling**
   - Too many conflicting mechanisms
   - Errors not properly handled
   - No recovery logic

---

## Recommended Architecture Changes

1. **HP Management**
   - Reset HP at run start
   - Persist HP immediately after each room
   - Restore HP on failure

2. **Async Operations**
   - Proper async/await patterns
   - Wait for locks before enqueuing
   - Use AbortController for cancellation

3. **Data Consistency**
   - DB as single source of truth
   - Keep memory in sync with DB
   - Use transactions where needed

4. **Error Handling**
   - Consolidate error handling
   - Proper error propagation
   - Recovery logic for failures

