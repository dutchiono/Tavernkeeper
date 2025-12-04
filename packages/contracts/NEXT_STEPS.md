# Next Steps - Cellar Overflow Fix

## Current Status

✅ **Code Fixed** - Overflow bug fixed in `CellarHook.sol`
✅ **Frontend Disabled** - Cellar UI disabled to prevent user errors
✅ **Compiled** - Contract compiles successfully
❌ **NOT DEPLOYED** - Fix needs to be deployed to mainnet

## What To Do When You Return

### Step 1: Deploy the Fix

Create and run an upgrade script to deploy the fixed `CellarHook` implementation:

```powershell
cd packages/contracts
npx hardhat run scripts/upgrade_overflow_fix.ts --network monad
```

**Note**: `scripts/upgrade_overflow_fix.ts` has been created and is ready to run.

### Step 2: Verify the Contract

After deployment, verify the new implementation on the block explorer:

```powershell
npx hardhat verify --network monad <NEW_IMPLEMENTATION_ADDRESS>
```

### Step 3: Test the Fix

Test liquidity addition with small amounts:

```powershell
# Test via CellarZapV4
npx hardhat run scripts/test_liquidity_via_zap.ts --network monad

# Or test direct via CellarHook
npx hardhat run scripts/test_liquidity_addition.ts --network monad
```

**Expected Result**: Transaction should succeed, LP tokens should be minted, pool should be initialized.

### Step 4: Re-enable Frontend

Once testing confirms the fix works:

1. **Remove disabled flag** from `apps/web/components/TheCellarView.tsx`:
   - Change `const CELLAR_DISABLED = true;` to `const CELLAR_DISABLED = false;`

2. **Re-enable cellar button** in `apps/web/components/BottomNav.tsx`:
   - Remove `disabled={true}` and `opacity-50 cursor-not-allowed` classes
   - Remove `title` attribute

3. **Re-enable raid button** in `apps/web/components/TheOfficeView.tsx`:
   - Remove `disabled={true}` and `opacity-50 cursor-not-allowed` classes
   - Change button text back to `"RAID CELLAR"` (remove "(DISABLED)")

### Step 5: Test End-to-End

1. Start the frontend dev server
2. Navigate to the Cellar view
3. Try minting LP tokens via the UI
4. Verify everything works

## Quick Reference

### Files Changed (Fix Applied)
- `packages/contracts/contracts/hooks/CellarHook.sol` - Fixed tick range calculation (lines 282-291)

### Files Changed (Frontend Disabled)
- `apps/web/components/TheCellarView.tsx` - Added disabled message
- `apps/web/components/BottomNav.tsx` - Disabled cellar button
- `apps/web/components/TheOfficeView.tsx` - Disabled raid button

### Contract Addresses (Mainnet)
- **CellarHook Proxy**: `0x6c7612F44B71E5E6E2bA0FEa799A23786A537755`
- **Current Implementation** (has bug): `0xcFd31f58Dd2d8fBaFA60208e4a57c8B00f086b78`
- **New Implementation** (after upgrade): Will be generated on deployment

## What The Fix Does

Instead of using full range (MIN_TICK to MAX_TICK) which causes overflow, the fix uses a reasonable ±20000 tick range around the current price. This:
- Prevents arithmetic overflow
- Is more capital efficient anyway
- Still provides ±200% price movement coverage
- Maintains backward compatibility (users can still specify custom ranges)

## If Something Goes Wrong

1. **Check the error message** - It will tell you what failed
2. **Verify the contract** - Make sure it deployed correctly
3. **Check gas** - Make sure you have enough MON for gas
4. **Review logs** - The upgrade script outputs detailed information

## Summary

The fix is ready, just needs to be deployed. The process is:
1. Deploy upgrade → 2. Verify → 3. Test → 4. Re-enable frontend → 5. Done

Estimated time: 15-30 minutes (mostly waiting for transactions to confirm)
