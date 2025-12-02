# 🚨 CRITICAL FIX REQUIRED

## Problem

The app is trying to call contracts at address `0x0000000000000000000000000000000000000000` (zero address). This will **ABSOLUTELY DESTROY PRODUCTION**.

## Root Cause

`NEXT_PUBLIC_USE_LOCALHOST` environment variable is **NOT SET**, so the app is using `MONAD_ADDRESSES` instead of `LOCALHOST_ADDRESSES`.

When `CONTRACT_ADDRESSES.KEEP_TOKEN` is undefined or wrong, `getContractAddress()` returns `undefined`, which gets coerced to `0x0000000000000000000000000000000000000000`.

## Immediate Fix

**Add to `.env.local` (in project root):**
```env
NEXT_PUBLIC_USE_LOCALHOST=true
```

**Then restart your Next.js dev server.**

## Additional Issues Fixed

1. ✅ **Deployment script now updates IMPLEMENTATION_ADDRESSES** - Previously, implementation addresses were set to proxy addresses (WRONG!)
2. ✅ **Added validation** - Server-side check for zero addresses
3. ✅ **Better error messages** - Now shows exactly what's wrong

## Why This Is Critical

- **Zero address calls will fail silently or revert**
- **Users won't be able to interact with contracts**
- **Balance checks will fail**
- **Transactions will fail**
- **Production will be completely broken**

## Verification

After setting `NEXT_PUBLIC_USE_LOCALHOST=true` and restarting:

1. Check browser console - should NOT see zero address errors
2. Check that `CONTRACT_ADDRESSES.KEEP_TOKEN` is `0x9b0E42Df8cEf8802C690F9900955aDb04ff41439` (localhost proxy)
3. Verify `IMPLEMENTATION_ADDRESSES` has DIFFERENT addresses from proxies

## Implementation Addresses Issue

The `IMPLEMENTATION_ADDRESSES` section had the same addresses as proxies. This is **WRONG** for UUPS proxies:
- **Proxy address**: Where users interact (e.g., `0x9b0E42Df8cEf8802C690F9900955aDb04ff41439`)
- **Implementation address**: The actual contract code (different address)

The deployment script now correctly updates both.
