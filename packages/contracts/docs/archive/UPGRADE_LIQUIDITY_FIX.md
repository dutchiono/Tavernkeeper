# Upgrade Plan: Fix Uniswap V4 Liquidity Implementation

## Overview

This upgrade fixes the critical issue where LP tokens were being minted but no actual liquidity was added to Uniswap V4 pools. The `modifyLiquidity()` call was commented out, meaning tokens were sitting in the Hook contract but not in tradeable pools.

## What's Being Fixed

### Critical Issues Fixed:
1. ✅ **Implemented `modifyLiquidity()` call** - Now actually adds liquidity to PoolManager
2. ✅ **Pool initialization** - Automatically initializes pool if it doesn't exist
3. ✅ **LiquidityDelta calculation** - Properly calculates liquidity from token amounts
4. ✅ **BalanceDelta settlement** - Implements settle/take pattern for token transfers
5. ✅ **Tick range handling** - Uses full range when 0,0 is provided
6. ✅ **Removed placeholder comments** - All "placeholder" language removed

### Contracts Being Upgraded:

1. **CellarHook** (The Cellar)
   - Proxy: `0x6c7612F44B71E5E6E2bA0FEa799A23786A537755`
   - Current Impl: `0x9aAc7082B18733a6951e0885C26DdD0Efa2b8C05` (from FIRSTDEPLOYMENT.md)
   - New Impl: TBD (will be deployed during upgrade)

2. **CellarZapV4**
   - Proxy: `0xf7248a01051bf297Aa56F12a05e7209C60Fc5863`
   - Current Impl: TBD (check before upgrade)
   - New Impl: TBD (will be deployed during upgrade)

## Pre-Upgrade Checklist

- [x] Code changes implemented and tested locally
- [x] Contracts compile successfully
- [x] Tests updated and passing
- [x] Recovery functions added to CellarHook
- [x] Recovery script created
- [ ] **Check for stuck tokens** (run `recover_stuck_tokens.ts`)
- [ ] **Verify current implementation addresses on-chain**
- [ ] **Backup current contract state** (potBalance, slot0, poolInitialized, etc.)
- [ ] **Test upgrade on testnet first** (if testnet available)
- [ ] **Verify deployer has upgrade permissions**
- [ ] **Ensure sufficient gas for upgrade transactions**

## Upgrade Process

### Step 1: Check for Stuck Tokens

```bash
cd packages/contracts

# Check for stuck tokens from previous addLiquidity() calls
npx hardhat run scripts/recover_stuck_tokens.ts --network monad
```

This will show contract balances, LP token supply, and recovery instructions.

### Step 2: Verify Current State

```bash
cd packages/contracts

# Check current implementation addresses
npx hardhat run scripts/verify_deployed_state.ts --network monad

# Verify proxy admin permissions
# (Check that deployer address can upgrade)
```

### Step 3: Backup Current State

Before upgrading, record:
- Current `potBalance` in CellarHook
- Current `slot0` state (epochId, initPrice, startTime)
- Current `poolInitialized` status
- Contract token balances (MON and KEEP)
- Any LP token balances
- Pool state if pools exist

### Step 4: Run Upgrade Script

```bash
cd packages/contracts

# Set network (monad = mainnet)
npx hardhat run scripts/upgrade_liquidity_fix.ts --network monad
```

The script will:
1. Deploy new implementations
2. Upgrade CellarHook proxy
3. Upgrade CellarZapV4 proxy
4. Update frontend addresses (implementation addresses)
5. Update deployment tracker
6. Print documentation update commands

### Step 5: Recovery (if needed)

If stuck tokens were found:
- Users should recover tokens BEFORE adding new liquidity
- Recovery is only available before pool initialization
- See `RECOVERY_GUIDE.md` for detailed instructions

### Step 6: Update Documentation

After upgrade completes, run:

```bash
# For CellarHook
$env:CONTRACT_NAME="CellarHook"; $env:OLD_IMPL="<OLD_IMPL>"; $env:NEW_IMPL="<NEW_IMPL>"; $env:REASON="Fixed Uniswap V4 liquidity implementation - added modifyLiquidity call, pool initialization, BalanceDelta settlement"; npx hardhat run scripts/update_deployment_docs.ts

# For CellarZapV4
$env:CONTRACT_NAME="CellarZapV4"; $env:OLD_IMPL="<OLD_IMPL>"; $env:NEW_IMPL="<NEW_IMPL>"; $env:REASON="Fixed Uniswap V4 liquidity implementation - updated comments"; npx hardhat run scripts/update_deployment_docs.ts
```

Or manually update `FIRSTDEPLOYMENT.md` Upgrade History section.

### Step 7: Verify Upgrade

```bash
# Verify new implementations are active
npx hardhat run scripts/verify_deployed_state.ts --network monad

# Test liquidity addition (on testnet first if possible)
# Verify pools are created and tradeable
```

## Post-Upgrade Verification

### Critical Checks:

1. **Pool Creation**
   - [ ] Verify pools are actually created in PoolManager
   - [ ] Check that liquidity exists in pools
   - [ ] Verify pools are tradeable

2. **LP Token Functionality**
   - [ ] Test minting LP tokens
   - [ ] Verify LP tokens represent real liquidity
   - [ ] Test raid functionality still works

3. **State Preservation**
   - [ ] Verify `potBalance` preserved
   - [ ] Verify `slot0` state preserved
   - [ ] Verify existing LP token balances preserved

4. **Integration**
   - [ ] Test TavernRegularsManager integration
   - [ ] Test TownPosseManager integration
   - [ ] Verify frontend can interact with upgraded contracts

## Risk Assessment

### Low Risk:
- ✅ Proxy addresses unchanged (no frontend updates needed)
- ✅ State preserved (UUPS upgrade maintains storage)
- ✅ Backward compatible (same function signatures)

### Medium Risk:
- ⚠️ First time pools are actually created - need to verify pool initialization works
- ⚠️ BalanceDelta settlement - need to verify token transfers work correctly
- ⚠️ Native currency handling - need to verify ETH transfers work

### Mitigation:
- Test on testnet first if available
- Have rollback plan (can upgrade back to previous implementation)
- Monitor first few transactions after upgrade
- Verify pool creation before announcing upgrade complete

## Rollback Plan

If upgrade causes issues:

1. **Immediate**: Stop all liquidity operations
2. **Identify Issue**: Check transaction logs, verify what failed
3. **Rollback**: Upgrade back to previous implementation
   ```bash
   # Deploy previous implementation again
   # Upgrade proxy back to old implementation
   ```
4. **Fix**: Address issues in code
5. **Retry**: Deploy fixed version

## Expected Outcomes

After successful upgrade:

1. ✅ LP tokens represent actual liquidity in Uniswap V4 pools
2. ✅ Pools are tradeable (users can swap MON/KEEP)
3. ✅ Liquidity providers earn fees from trades
4. ✅ System functions as originally intended
5. ✅ No breaking changes to existing functionality

## Timeline

- **Preparation**: 30 minutes (verify addresses, backup state)
- **Upgrade Execution**: 10-15 minutes (run script, wait for confirmations)
- **Documentation**: 10 minutes (update FIRSTDEPLOYMENT.md)
- **Verification**: 30-60 minutes (test functionality)
- **Total**: ~2 hours

## Notes

- Proxy addresses stay the same - no frontend changes needed
- Implementation addresses will change - frontend will auto-update
- All existing LP tokens remain valid
- Pot balance and auction state preserved
- This is a critical fix - system was non-functional for liquidity

## Recovery

**Important:** Users may have stuck tokens from previous `addLiquidity()` calls.

See `RECOVERY_GUIDE.md` for:
- How to check for stuck tokens
- How to recover tokens
- Recovery window and limitations
- Troubleshooting

## Support

If issues arise:
1. Check transaction logs on block explorer
2. Verify proxy admin permissions
3. Check gas limits
4. Review error messages in upgrade script output
5. Check `RECOVERY_GUIDE.md` for recovery issues
