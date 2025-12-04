# Remaining Tasks After Upgrade

## ✅ Completed

1. ✅ **Upgrade Contracts** - CellarHook and CellarZapV4 upgraded successfully
2. ✅ **Frontend Addresses** - Updated `apps/web/lib/contracts/addresses.ts` with new implementation
3. ✅ **Deployment Tracker** - Updated `DEPLOYMENT_TRACKER.md`
4. ✅ **FIRSTDEPLOYMENT.md** - Updated with upgrade history entry
5. ✅ **Recovery Functions** - Added to contracts and tested

## ⚠️ Remaining Tasks

### 1. Contract Verification on Block Explorer
- [ ] Verify CellarHook new implementation on block explorer
  - Address: `0xcFd31f58Dd2d8fBaFA60208e4a57c8B00f086b78`
  - Network: Monad Mainnet
  - Action: Upload source code and verify on explorer

### 2. Frontend Integration Status

**✅ Verified**:
- ✅ Proxy address correct: `0x6c7612F44B71E5E6E2bA0FEa799A23786A537755`
- ✅ Implementation address updated: `0xcFd31f58Dd2d8fBaFA60208e4a57c8B00f086b78`
- ✅ Frontend uses proxy address (correct - should always use proxy)

**Frontend Integration**:
- ✅ Contract addresses updated in `apps/web/lib/contracts/addresses.ts`
- ✅ Frontend should automatically use new implementation via proxy
- ⚠️ **TODO**: Build recovery page (noted in UPGRADE_COMPLETE.md)

### 3. Frontend Recovery Page (TODO)
- [ ] **Build Recovery Page**
  - Location: `apps/web/app/(miniapp)/recover` or similar
  - Features:
    - Check user LP token balance
    - Display recoverable amounts (MON + KEEP)
    - Show recovery ratio (1 LP = 1 MON + 3 KEEP)
    - One-click recovery button
    - Status messages and warnings
    - Pool initialization status check
  - Function: Call `cellarHook.recoverStuckTokens(lpTokenAmount)` from frontend
  - UI: Show warnings if pool is initialized (recovery disabled)

### 4. Testing & Verification
- [ ] Test adding liquidity via frontend
  - Verify LP tokens are minted correctly
  - Verify liquidity is added to Uniswap V4 pool
  - Verify pool is initialized
  - Verify pools are tradeable

- [ ] Test recovery functionality
  - Test `recoverStuckTokens()` with actual LP tokens
  - Verify tokens are returned correctly
  - Verify LP tokens are burned

- [ ] Monitor for users recovering tokens
  - Check contract events for `TokensRecovered` events
  - Verify recovery works before pool initialization

### 5. User Communication
- [ ] Notify users about recovery availability
  - Users with LP tokens can recover before pool initialization
  - Recovery ratio: 1 LP = 1 MON + 3 KEEP
  - Recovery disabled once pool is initialized

### 6. Post-Upgrade Monitoring
- [ ] Monitor contract interactions
- [ ] Verify no errors in logs
- [ ] Check pool initialization when first liquidity is added
- [ ] Verify trading works correctly

## Summary

**Critical**:
- ✅ Contract upgrade complete
- ✅ Documentation updated
- ⚠️ Contract verification on block explorer (recommended but not blocking)

**Important**:
- ⚠️ Build recovery page for users (TODO - noted)
- ⚠️ Test liquidity addition end-to-end

**Nice to Have**:
- User notifications about recovery
- Monitoring dashboard

## Integration Status

**Frontend**: ✅ **FULLY INTEGRATED**
- ✅ Contract addresses updated (`apps/web/lib/contracts/addresses.ts`)
- ✅ Proxy address correct: `0x6c7612F44B71E5E6E2bA0FEa799A23786A537755`
- ✅ Implementation address updated: `0xcFd31f58Dd2d8fBaFA60208e4a57c8B00f086b78`
- ✅ Frontend uses proxy address (correct - should always use proxy)
- ✅ Frontend services use correct addresses (`theCellarService.ts`, `registry.ts`)
- ✅ New implementation accessible via proxy (automatic)
- ⚠️ **TODO**: Build recovery page (noted in UPGRADE_COMPLETE.md)

**Backend/Contracts**: ✅ **COMPLETE**
- ✅ Contracts upgraded successfully
- ✅ Recovery functions available (`recoverStuckTokens`, `recoverTokensForUser`)
- ✅ All fixes implemented (modifyLiquidity, pool initialization, BalanceDelta settlement)
- ✅ Storage layout compatible (poolInitialized at end)
- ⚠️ Contract verification on block explorer (recommended)

**Documentation**: ✅ **COMPLETE**
- ✅ FIRSTDEPLOYMENT.md updated with upgrade history
- ✅ DEPLOYMENT_TRACKER.md updated
- ✅ UPGRADE_COMPLETE.md created
- ✅ REMAINING_TASKS.md created
- ✅ Frontend addresses updated automatically
