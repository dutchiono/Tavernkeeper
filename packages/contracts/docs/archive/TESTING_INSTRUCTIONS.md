# Testing Instructions

## Contract Verification

### Verify CellarHook Implementation
```powershell
cd packages/contracts
npx hardhat verify --network monad 0xcFd31f58Dd2d8fBaFA60208e4a57c8B00f086b78
```

**Note**: May require `ETHERSCAN_API_KEY` environment variable if MonadScan requires API key.

**Block Explorer**: https://monadscan.com/address/0xcFd31f58Dd2d8fBaFA60208e4a57c8B00f086b78

## Test Liquidity Addition

### Option 1: Via CellarZapV4 (Recommended - Simpler)
```powershell
cd packages/contracts
npx hardhat run scripts/test_liquidity_via_zap.ts --network monad
```

**What it does**:
- Tests with 0.1 MON + 0.3 KEEP (1:3 ratio)
- Uses `CellarZapV4.mintLP()` which handles PoolKey construction
- Verifies LP tokens are minted
- Verifies pool is initialized

### Option 2: Via CellarHook Directly
```powershell
cd packages/contracts
npx hardhat run scripts/test_liquidity_addition.ts --network monad
```

**What it does**:
- Tests with 0.1 MON + 0.3 KEEP (1:3 ratio)
- Uses `CellarHook.addLiquidity()` directly
- Requires PoolKey construction
- Verifies LP tokens are minted
- Verifies pool is initialized

## Expected Results

### Successful Test Should Show:
1. ✅ Transaction hash
2. ✅ Transaction confirmed
3. ✅ LP tokens minted: 0.1 LP (for 0.1 MON)
4. ✅ Pool initialized: YES (if first liquidity)
5. ✅ Balances updated correctly

### What to Verify:
- [ ] LP tokens minted correctly (1 LP per 1 MON)
- [ ] Pool initialization status changed from false to true
- [ ] MON balance decreased by 0.1
- [ ] KEEP balance decreased by 0.3
- [ ] No errors in transaction

## Troubleshooting

### If verification fails:
- Check if MonadScan requires API key
- Verify contract address is correct
- Check network configuration in hardhat.config.ts

### If test fails:
- Check deployer has sufficient MON and KEEP balances
- Verify token approvals are set correctly
- Check pool initialization status (recovery disabled if initialized)
- Verify contract addresses are correct

## Summary

**Ready to Test**: ✅
- Test scripts created
- Contracts upgraded
- All fixes implemented

**Next Actions**:
1. Verify contract on block explorer
2. Run test script with small amount
3. Verify results match expectations
