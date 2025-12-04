# Mainnet Upgrade Guide: Fix Uniswap V4 Liquidity Implementation

## Critical Fix Summary

**Problem**: LP tokens were being minted but NO actual liquidity was added to Uniswap V4 pools. The `modifyLiquidity()` call was commented out, making the system non-functional.

**Solution**: Implemented complete Uniswap V4 liquidity addition with pool initialization, liquidityDelta calculation, and BalanceDelta settlement.

## Contracts to Upgrade

### 1. CellarHook (The Cellar)
- **Proxy Address**: `0x6c7612F44B71E5E6E2bA0FEa799A23786A537755`
- **Current Implementation**: `0x9aAc7082B18733a6951e0885C26DdD0Efa2b8C05` (from FIRSTDEPLOYMENT.md)
- **Network**: Monad Mainnet
- **Changes**:
  - Implemented `modifyLiquidity()` call
  - Added pool initialization
  - Added liquidityDelta calculation
  - Added BalanceDelta settlement
  - Fixed tick range handling

### 2. CellarZapV4
- **Proxy Address**: `0xf7248a01051bf297Aa56F12a05e7209C60Fc5863`
- **Current Implementation**: Check on-chain before upgrade
- **Network**: Monad Mainnet
- **Changes**: Updated comments (removed "placeholder" language)

## Pre-Upgrade Steps

### Step 1: Check for Stuck Tokens

```powershell
cd packages/contracts

# Check for stuck tokens from previous addLiquidity() calls
npx hardhat run scripts/recover_stuck_tokens.ts --network monad
```

**This will show:**
- Contract balances (MON and KEEP)
- Total LP token supply
- Users who may need to recover tokens
- Recovery instructions

**Important:** Users should recover stuck tokens BEFORE upgrading, as recovery is only available before pool initialization.

### Step 2: Verify Current State

```powershell
cd packages/contracts

# Check current implementation addresses
npx hardhat run scripts/verify_deployed_state.ts --network monad
```

**Record**:
- Current CellarHook implementation address
- Current CellarZapV4 implementation address
- Current `potBalance` in CellarHook
- Current `slot0` state (epochId, initPrice, startTime)
- Pool initialization status (`poolInitialized`)

### Step 3: Backup State

Before upgrading, document:
- `potBalance`: `await cellarHook.potBalance()`
- `slot0`: `await cellarHook.slot0()`
- `poolInitialized`: `await cellarHook.poolInitialized()`
- Any existing LP token balances
- Contract token balances (MON and KEEP)
- Pool state (if pools exist)

### Step 4: Verify Upgrade Permissions

Ensure deployer wallet has upgrade permissions:
- Check that deployer is owner of CellarHook proxy
- Check that deployer is owner of CellarZapV4 proxy
- Verify sufficient gas balance

## Upgrade Execution

### Step 1: Run Upgrade Script

```powershell
cd packages/contracts

# Set network to mainnet (monad = mainnet in hardhat.config.ts)
npx hardhat run scripts/upgrade_liquidity_fix.ts --network monad
```

**What the script does**:
1. Verifies proxy addresses exist
2. Gets current implementation addresses
3. Deploys new implementations
4. Upgrades CellarHook proxy
5. Upgrades CellarZapV4 proxy
6. Updates frontend addresses automatically
7. Updates deployment tracker
8. Prints documentation update commands

### Step 2: Update Documentation

After upgrade completes, the script will print commands. Run them:

```powershell
# For CellarHook
$env:CONTRACT_NAME="CellarHook"; $env:OLD_IMPL="<OLD_FROM_SCRIPT_OUTPUT>"; $env:NEW_IMPL="<NEW_FROM_SCRIPT_OUTPUT>"; $env:REASON="Fixed Uniswap V4 liquidity implementation - added modifyLiquidity call, pool initialization, BalanceDelta settlement"; npx hardhat run scripts/update_deployment_docs.ts

# For CellarZapV4
$env:CONTRACT_NAME="CellarZapV4"; $env:OLD_IMPL="<OLD_FROM_SCRIPT_OUTPUT>"; $env:NEW_IMPL="<NEW_FROM_SCRIPT_OUTPUT>"; $env:REASON="Fixed Uniswap V4 liquidity implementation - updated comments"; npx hardhat run scripts/update_deployment_docs.ts
```

**Or manually update** `FIRSTDEPLOYMENT.md` Upgrade History section:

```markdown
### 2025-01-XX: Fixed Uniswap V4 Liquidity Implementation
- **Reason**: Fixed critical bug where LP tokens were minted but no liquidity was added to pools
- **Contracts Upgraded**:
  - **CellarHook (The Cellar)**:
    - Proxy: `0x6c7612F44B71E5E6E2bA0FEa799A23786A537755`
    - Old Impl: `<OLD_IMPL>`
    - New Impl: `<NEW_IMPL>`
  - **CellarZapV4**:
    - Proxy: `0xf7248a01051bf297Aa56F12a05e7209C60Fc5863`
    - Old Impl: `<OLD_IMPL>`
    - New Impl: `<NEW_IMPL>`
- **Status**: ✅ Success
- **Notes**:
  - Implemented actual `modifyLiquidity()` call (was commented out)
  - Added pool initialization logic
  - Added proper liquidityDelta calculation
  - Implemented BalanceDelta settlement (settle/take pattern)
  - Fixed tick range handling (0,0 now uses full range)
  - LP tokens now represent actual liquidity in Uniswap V4 pools
  - Pools are now tradeable
```

### Step 3: Update DEPLOYMENT_TRACKER.md

Add entry to Upgrade History section:

```markdown
### The Cellar (CellarHook)
- **v3.0.0** - `<NEW_IMPL>` - Fixed Uniswap V4 liquidity implementation (2025-01-XX)
  - ✅ Implemented `modifyLiquidity()` call (was commented out)
  - ✅ Added pool initialization logic
  - ✅ Added liquidityDelta calculation using Uniswap V4 formulas
  - ✅ Implemented BalanceDelta settlement (settle/take pattern)
  - ✅ Fixed tick range handling (full range support)
  - **Proxy Address**: `0x6c7612F44B71E5E6E2bA0FEa799A23786A537755`

### CellarZapV4
- **v3.0.0** - `<NEW_IMPL>` - Fixed Uniswap V4 liquidity implementation (2025-01-XX)
  - ✅ Updated comments (removed "placeholder" language)
  - ✅ Clarified tick range behavior
  - **Proxy Address**: `0xf7248a01051bf297Aa56F12a05e7209C60Fc5863`
```

## Post-Upgrade Verification

### Critical Checks

1. **Check for Stuck Tokens**
   ```powershell
   npx hardhat run scripts/recover_stuck_tokens.ts --network monad
   ```
   - Verify contract balances
   - Check if users need to recover tokens
   - Ensure recovery is available (pool not initialized yet)

2. **Verify Implementation Addresses**
   ```powershell
   npx hardhat run scripts/verify_deployed_state.ts --network monad
   ```

3. **Test Pool Creation**
   - Add liquidity via CellarZapV4 or CellarHook
   - Verify pool is created in PoolManager
   - Verify liquidity exists in pool
   - Verify pool is tradeable (test swap if possible)
   - **Note:** First liquidity addition initializes pool and disables recovery

3. **Verify State Preservation**
   - Check `potBalance` is preserved
   - Check `slot0` state is preserved
   - Check existing LP token balances are preserved

4. **Test Functionality**
   - Test minting LP tokens
   - Verify LP tokens represent real liquidity
   - Test raid functionality
   - Test TavernRegularsManager integration
   - Test TownPosseManager integration

## Files Updated Automatically

The upgrade script automatically updates:
- ✅ `apps/web/lib/contracts/addresses.ts` (implementation addresses)
- ✅ `packages/contracts/DEPLOYMENT_TRACKER.md` (if script succeeds)

## Files That Need Manual Update

After upgrade, manually update:
- ✅ `FIRSTDEPLOYMENT.md` (Upgrade History section)
- ✅ `packages/contracts/DEPLOYMENT_TRACKER.md` (Upgrade History section - if script didn't update it)

## Rollback Plan

If upgrade causes issues:

1. **Stop Operations**: Pause liquidity operations immediately
2. **Identify Issue**: Check transaction logs, verify what failed
3. **Rollback**: Upgrade back to previous implementation
   ```powershell
   # Deploy previous implementation
   # Then upgrade proxy back to old implementation address
   ```
4. **Fix**: Address issues in code
5. **Retry**: Deploy fixed version

## Expected Outcomes

After successful upgrade:

✅ LP tokens represent actual liquidity in Uniswap V4 pools
✅ Pools are tradeable (users can swap MON/KEEP)
✅ Liquidity providers earn fees from trades
✅ System functions as originally intended
✅ No breaking changes to existing functionality
✅ All existing LP tokens remain valid

## Important Notes

- **Proxy addresses unchanged** - No frontend changes needed
- **Implementation addresses change** - Frontend auto-updates via script
- **State preserved** - UUPS upgrade maintains all storage
- **Backward compatible** - Same function signatures
- **Critical fix** - System was non-functional for liquidity before this

## Support

If issues arise:
1. Check transaction logs on block explorer
2. Verify proxy admin permissions
3. Check gas limits
4. Review error messages in upgrade script output
5. Check `UPGRADE_LIQUIDITY_FIX.md` for detailed troubleshooting

## References

- Upgrade Script: `packages/contracts/scripts/upgrade_liquidity_fix.ts`
- Recovery Script: `packages/contracts/scripts/recover_stuck_tokens.ts`
- Recovery Guide: `packages/contracts/RECOVERY_GUIDE.md`
- Detailed Plan: `packages/contracts/UPGRADE_LIQUIDITY_FIX.md`
- Deployment Tracker: `packages/contracts/DEPLOYMENT_TRACKER.md`
- Main Deployment Doc: `FIRSTDEPLOYMENT.md`
