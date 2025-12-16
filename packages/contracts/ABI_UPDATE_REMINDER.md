# ⚠️ CRITICAL: ABI UPDATE REMINDER

## **EVERY TIME YOU UPGRADE A CONTRACT, YOU MUST UPDATE THE ABI!**

### Why This Matters

When you add new functions, events, or **custom errors** to a contract, the frontend ABI must be updated or:
- ❌ Custom errors won't decode properly → Shows "Internal JSON-RPC error"
- ❌ New functions won't be callable from frontend
- ❌ New events won't be listenable
- ❌ Type safety breaks

### Where to Update

**File:** `apps/web/lib/contracts/registry.ts`

**What to add:**
1. **New Functions** - Add function definitions to the `abi` array
2. **New Events** - Add event definitions to the `abi` array
3. **Custom Errors** - Add error definitions with `type: 'error'` to the `abi` array
4. **New Constants** - Add constant getter functions if they're public

### Example: Adding Custom Errors

```typescript
// In registry.ts, add to the contract's abi array:
{
  inputs: [{ internalType: 'uint256', name: 'timeRemaining', type: 'uint256' }],
  name: 'CooldownActive',
  type: 'error',  // ← Important: type is 'error', not 'function'
},
```

### Checklist for Every Upgrade

- [ ] Deploy new contract implementation
- [ ] Update DEPLOYMENT_TRACKER.md with new implementation address
- [ ] **Update `apps/web/lib/contracts/registry.ts` ABI:**
  - [ ] Add new functions
  - [ ] Add new events
  - [ ] Add new custom errors
  - [ ] Add new public constants (as view functions)
- [ ] Test frontend can call new functions
- [ ] Test frontend can decode new errors
- [ ] Update frontend code to use new features

### Common Mistakes

❌ **Forgetting to add custom errors** → Results in "Internal JSON-RPC error"
❌ **Wrong error format** → Must use `type: 'error'`, not `type: 'function'`
❌ **Missing function parameters** → ABI must match contract exactly
❌ **Not testing after update** → Always verify errors decode correctly

### How to Get the Correct ABI

1. **From Hardhat compilation:**
   ```bash
   cd packages/contracts
   npx hardhat compile
   # Check artifacts/contracts/[ContractName].sol/[ContractName].json
   # Copy the "abi" array
   ```

2. **From deployed contract (if verified):**
   - Check block explorer (MonadScan)
   - Copy verified ABI

3. **From contract source:**
   - Read the Solidity contract
   - Manually add function/error/event definitions

### Related Files

- `packages/contracts/DEPLOYMENT_TRACKER.md` - Tracks deployments
- `apps/web/lib/contracts/registry.ts` - **Frontend ABI definitions** ⚠️
- `apps/web/lib/contracts/addresses.ts` - Contract addresses

---

**Remember: If you upgrade a contract and don't update the ABI, the frontend will break!**

