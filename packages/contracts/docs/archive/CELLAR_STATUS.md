# Cellar Status - Critical Issue

**Date**: 2025-01-XX
**Status**: 🔴 **DISABLED - CRITICAL BUG**

## Current Situation

The Cellar functionality has been **TEMPORARILY DISABLED** in the frontend due to a critical arithmetic overflow error discovered during testing.

## The Problem

When attempting to add liquidity via `CellarZapV4.mintLP()` or `CellarHook.addLiquidity()`, the transaction reverts with:

```
ProviderError: execution reverted: arithmetic underflow or overflow (0x11)
```

### Root Cause

The issue occurs in the liquidity calculation functions (`_getLiquidityForAmount0` and `_getLiquidityForAmount1`) when using full range ticks (MIN_TICK to MAX_TICK).

**Specific Issue:**
- When `tickLower == 0 && tickUpper == 0`, the code was defaulting to `MIN_TICK (-887272)` and `MAX_TICK (887272)`
- The calculation `amount0 * sqrtPriceAX96 * sqrtPriceBX96` overflows `uint256` when using such extreme tick values
- `sqrtPriceAX96` and `sqrtPriceBX96` become very large numbers (near 2^160) when calculated from MIN_TICK and MAX_TICK
- Multiplying these together with `amount0` exceeds `uint256` maximum value

### Code Location

**File**: `packages/contracts/contracts/hooks/CellarHook.sol`

**Problematic Code** (lines 282-285):
```solidity
if (tickLower == 0 && tickUpper == 0) {
    // Use full range
    actualTickLower = MIN_TICK;
    actualTickUpper = MAX_TICK;
}
```

**Problematic Calculation** (line 386):
```solidity
uint256 numerator = amount0 * uint256(sqrtPriceAX96) * uint256(sqrtPriceBX96);
```

## Fix Applied (Not Yet Deployed)

Changed the default behavior to use a reasonable tick range around the current price instead of full range:

```solidity
if (tickLower == 0 && tickUpper == 0) {
    // Use reasonable range around current price (price = 3, tick ≈ 10986)
    // Use ±20000 ticks around current price (approximately ±200% price range)
    int24 currentTick = 10986; // Approximate tick for price = 3
    int24 rangeTicks = 20000;
    actualTickLower = ((currentTick - rangeTicks) / key.tickSpacing) * key.tickSpacing;
    actualTickUpper = ((currentTick + rangeTicks) / key.tickSpacing) * key.tickSpacing;

    // Ensure ticks are within bounds
    if (actualTickLower < MIN_TICK) actualTickLower = MIN_TICK;
    if (actualTickUpper > MAX_TICK) actualTickUpper = MAX_TICK;
}
```

## What's Been Done

1. ✅ **Identified the bug** - Arithmetic overflow in liquidity calculation
2. ✅ **Fixed the code** - Changed default tick range from full range to reasonable range
3. ✅ **Compiled successfully** - Contract compiles without errors
4. ✅ **Disabled frontend** - Cellar UI is disabled with warning message
5. ❌ **NOT YET DEPLOYED** - Fix needs to be deployed to mainnet

## What Needs to Happen Next

### Immediate Actions Required

1. **Deploy the Fix**
   - Create upgrade script for `CellarHook`
   - Deploy new implementation
   - Upgrade proxy to new implementation
   - Verify contract on block explorer

2. **Test the Fix**
   - Test liquidity addition with small amounts (0.1 MON + 0.3 KEEP)
   - Verify pool initialization works
   - Verify LP tokens are minted correctly
   - Verify liquidity is actually added to Uniswap V4 pool

3. **Re-enable Frontend**
   - Remove `CELLAR_DISABLED` flag from `TheCellarView.tsx`
   - Re-enable cellar button in `BottomNav.tsx`
   - Re-enable "RAID CELLAR" button in `TheOfficeView.tsx`

### Testing Checklist

- [ ] Deploy new `CellarHook` implementation
- [ ] Upgrade proxy to new implementation
- [ ] Verify contract on block explorer
- [ ] Test `addLiquidity()` with small amounts
- [ ] Test `CellarZapV4.mintLP()` with small amounts
- [ ] Verify pool is initialized
- [ ] Verify LP tokens are minted
- [ ] Verify liquidity is in Uniswap V4 pool
- [ ] Test with larger amounts
- [ ] Re-enable frontend
- [ ] Test end-to-end via frontend

## Impact Assessment

### What Still Works
- ✅ Contract upgrade completed successfully
- ✅ Recovery functions available (for stuck tokens)
- ✅ Pool initialization logic is correct
- ✅ BalanceDelta settlement logic is correct

### What's Broken
- ❌ Adding liquidity fails with arithmetic overflow
- ❌ Users cannot mint LP tokens
- ❌ Pool cannot be initialized via normal flow
- ❌ Frontend cellar functionality disabled

### What's At Risk
- Users who attempt to add liquidity will have transactions revert
- No new liquidity can be added until fix is deployed
- Existing stuck tokens can still be recovered (recovery functions work)

## Technical Details

### Contract Addresses (Mainnet)
- **CellarHook Proxy**: `0x6c7612F44B71E5E6E2bA0FEa799A23786A537755`
- **Current Implementation**: `0xcFd31f58Dd2d8fBaFA60208e4a57c8B00f086b78` (has overflow bug)
- **CellarZapV4 Proxy**: `0xf7248a01051bf297Aa56F12a05e7209C60Fc5863`

### Error Details
- **Error Code**: `0x11` (arithmetic underflow or overflow)
- **Location**: `CellarHook._getLiquidityForAmount0()` line 386
- **Trigger**: Calling `addLiquidity()` or `mintLP()` with default ticks (0, 0)

## Notes

- The fix uses a ±20000 tick range, which provides approximately ±200% price movement coverage
- This is more practical than full range anyway (full range positions are capital inefficient)
- The fix maintains backward compatibility - users can still specify custom tick ranges
- The overflow only occurs with full range, so custom ranges should work fine

## Related Files

- `packages/contracts/contracts/hooks/CellarHook.sol` - Main contract (fixed, not deployed)
- `packages/contracts/scripts/test_liquidity_via_zap.ts` - Test script (fails with current deployment)
- `packages/contracts/scripts/test_liquidity_addition.ts` - Test script (fails with current deployment)
- `apps/web/components/TheCellarView.tsx` - Frontend component (disabled)
- `apps/web/components/BottomNav.tsx` - Navigation (cellar button disabled)
- `apps/web/components/TheOfficeView.tsx` - Office view (raid cellar button disabled)

---

**Last Updated**: 2025-01-XX
**Next Action**: Deploy fix and test
