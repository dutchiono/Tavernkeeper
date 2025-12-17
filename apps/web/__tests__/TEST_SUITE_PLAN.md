# Comprehensive Test Suite Plan

## Current Status

**Test Files**: 41 total (33 passing, 8 failing)
**Test Cases**: 209 total (183 passing, 24 failing, 2 skipped)

## Missing Test Coverage

### Critical Services (High Priority)

#### 1. Party Management Services
- [ ] `partyService.ts` - Core party operations
  - Create party
  - Join party
  - Leave party
  - Get party details
  - Invite generation
  - Party status updates

#### 2. Marketplace Services
- [ ] `marketplace.ts` - Item trading
  - List items for sale
  - Buy items
  - Get listings
  - Price calculations
  - Transaction handling

#### 3. Inventory Services
- [ ] `inventoryTransfer.ts` - Item transfers
  - Equip/unequip items
  - Transfer items between heroes
  - Inventory validation
  - Item ownership checks

#### 4. Loot Services
- [ ] `lootClaim.ts` - Loot claiming
  - Claim loot from runs
  - Loot validation
  - Reward distribution
  - Claim status tracking

#### 5. Game State Services
- [ ] `dungeonStateService.ts` - Dungeon state management
  - State persistence
  - State restoration
  - State transitions
  - Checkpoint management

- [ ] `gameLoggingService.ts` - Event logging
  - Event persistence
  - Event retrieval
  - Event filtering
  - Log cleanup

- [ ] `eventParser.ts` - Event parsing
  - Parse combat events
  - Parse exploration events
  - Parse interaction events
  - Event validation

#### 6. World Services
- [ ] `worldInitializationService.ts` - World setup
  - World generation
  - World state initialization
  - World progress tracking
  - World cleanup

#### 7. Office Services
- [ ] `officeManagerCache.ts` - Office manager caching
  - Cache management
  - Cache invalidation
  - Cache updates

- [ ] `officePnlService.ts` - Office P&L calculations
  - P&L calculations
  - Revenue tracking
  - Cost tracking

#### 8. Token Services
- [ ] `keepToken.ts` - KEEP token operations (partial coverage exists)
  - Balance checks
  - Transfer operations
  - Approval operations

- [ ] `theCellarService.ts` - Cellar operations
  - Cellar state
  - Raid operations
  - Pot balance tracking

#### 9. Pricing Services
- [ ] `monPriceService.ts` - MON price tracking
  - Price fetching
  - Price caching
  - Price calculations

- [ ] `mcapService.ts` - Market cap service
  - MCAP calculations
  - MCAP caching

#### 10. Utility Services
- [ ] `gasEstimator.ts` - Gas estimation
  - Gas price estimation
  - Transaction cost calculation
  - Gas optimization

- [ ] `spriteService.ts` - Sprite management
  - Sprite generation
  - Sprite caching
  - Sprite updates

- [ ] `metadataStorage.ts` - Metadata storage (partial coverage exists)
  - Metadata upload
  - Metadata retrieval
  - Metadata updates

### Missing API Route Tests

#### 1. Dungeon Routes
- [ ] `api/dungeons/route.ts` - List dungeons
- [ ] `api/dungeons/[id]/map/route.ts` - Get dungeon map
- [ ] `api/dungeons/update-icon-position/route.ts` - Update icon position

#### 2. World Routes
- [ ] `api/world/initialize/route.ts` - Initialize world
- [ ] `api/world/status/route.ts` - Get world status
- [ ] `api/world/progress/route.ts` - Get world progress
- [ ] `api/world/cleanup/route.ts` - Cleanup world
- [ ] `api/world/force-init/route.ts` - Force initialization

#### 3. Office Routes
- [ ] `api/office/get-manager/route.ts` - Get office manager
- [ ] `api/office/save-manager/route.ts` - Save office manager
- [ ] `api/office/notify-previous-manager/route.ts` - Notify previous manager

#### 4. Cellar Routes
- [ ] `api/cellar/notify-raid/route.ts` - Notify raid

#### 5. Hero Routes (Partial)
- [ ] `api/heroes/sync/route.ts` - Sync heroes
- [ ] `api/heroes/builder/preview/route.ts` - Preview builder
- [ ] `api/heroes/[tokenId]/color/route.ts` - Update hero color
- [ ] `api/heroes/[tokenId]/metadata/route.ts` - Get hero metadata
- [ ] `api/heroes/token/route.ts` - Get hero token

#### 6. Metadata Routes
- [ ] `api/metadata/[id]/route.ts` - Get metadata

#### 7. Notifications Routes
- [ ] `api/notifications/route.ts` - Get notifications

#### 8. Pricing Routes
- [ ] `api/pricing/sign/route.ts` - Sign pricing

#### 9. Map Routes
- [ ] `api/map/route.ts` - Get map

#### 10. Agent Routes (Partial)
- [ ] `api/agents/[id]/action/route.ts` - Agent actions
- [ ] `api/agents/[id]/converse/route.ts` - Agent conversation

#### 11. Frames Routes (Partial)
- [ ] `api/frames/scene.png/route.tsx` - Get scene image

### Integration Tests Needed

#### 1. Party → Dungeon Run Flow
- [ ] Create party
- [ ] Add heroes to party
- [ ] Start dungeon run
- [ ] Verify run creation
- [ ] Verify party state

#### 2. Dungeon Run → Combat Flow
- [ ] Start dungeon run
- [ ] Enter combat room
- [ ] Execute combat turns
- [ ] Verify combat results
- [ ] Verify HP updates

#### 3. Combat → Loot Flow
- [ ] Complete combat
- [ ] Receive loot
- [ ] Claim loot
- [ ] Verify inventory updates

#### 4. Marketplace → Inventory Flow
- [ ] List item for sale
- [ ] Buy item
- [ ] Verify ownership transfer
- [ ] Verify inventory update

#### 5. World → Dungeon Generation Flow
- [ ] Initialize world
- [ ] Generate dungeon
- [ ] Verify dungeon structure
- [ ] Verify dungeon state

## Test Implementation Priority

### Phase 1: Critical Services (Week 1)
1. `partyService.ts` - Core game functionality
2. `marketplace.ts` - Economic system
3. `inventoryTransfer.ts` - Item management
4. `lootClaim.ts` - Reward system
5. `dungeonStateService.ts` - State management

### Phase 2: Game State & Logging (Week 2)
1. `gameLoggingService.ts` - Event tracking
2. `eventParser.ts` - Event processing
3. `worldInitializationService.ts` - World setup

### Phase 3: API Routes (Week 3)
1. Dungeon routes
2. World routes
3. Office routes
4. Hero routes (missing ones)

### Phase 4: Utility Services (Week 4)
1. Pricing services
2. Gas estimation
3. Metadata services
4. Sprite services

### Phase 5: Integration Tests (Week 5)
1. End-to-end game flows
2. Multi-service interactions
3. Error recovery flows

## Test Structure

All tests should follow this structure:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all external dependencies
vi.mock('@/lib/supabase');
vi.mock('@/lib/services/...');

describe('ServiceName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup common mocks
  });

  describe('FunctionName', () => {
    it('should handle success case', async () => {
      // Test implementation
    });

    it('should handle error case', async () => {
      // Test implementation
    });

    it('should validate input', async () => {
      // Test implementation
    });
  });
});
```

## Coverage Goals

- **Services**: 75% coverage (per test-policy.ts)
- **API Routes**: 80% coverage
- **Critical Paths**: 100% coverage (party creation, dungeon runs, combat)

## Notes

- All tests must be fully mocked (no real contract calls)
- All tests must be deterministic
- All tests must run in < 5 seconds
- Integration tests may take longer but should be < 30 seconds

