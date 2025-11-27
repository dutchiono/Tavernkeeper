# Contract Deployment Tracker

**CRITICAL: DO NOT REDEPLOY CONTRACTS WITHOUT UPDATING THIS FILE**

This file tracks all contract deployments. **ALWAYS** update this file when deploying contracts.

## Current Status: ⚠️ NOT READY FOR DEPLOYMENT

**Contracts are NOT currently upgradeable proxies.** They need to be converted to UUPS proxy pattern before deployment.

---

## Contract Inventory

### 1. ERC-6551 Infrastructure (Not Upgradeable)

#### ERC6551Registry
- **Status**: ✅ Ready (infrastructure contract, not upgradeable)
- **Type**: Direct implementation
- **Purpose**: Registry for creating Token Bound Accounts (TBAs)
- **Upgradeable**: No (infrastructure contract)
- **Deployment Required**: Yes
- **Deployed Address**: `NOT DEPLOYED`
- **Network**: Monad Testnet
- **Deployment Date**: `TBD`
- **Deployment TX**: `TBD`
- **Notes**: Standard ERC-6551 registry implementation

#### ERC6551Account (Implementation)
- **Status**: ✅ Ready (implementation contract, not upgradeable)
- **Type**: Direct implementation
- **Purpose**: TBA account implementation (deployed via CREATE2)
- **Upgradeable**: No (implementation contract)
- **Deployment Required**: Yes
- **Deployed Address**: `NOT DEPLOYED`
- **Network**: Monad Testnet
- **Deployment Date**: `TBD`
- **Deployment TX**: `TBD`
- **Notes**: Each NFT gets a unique TBA address via CREATE2

---

### 2. Game Contracts (Need Proxy Conversion)

#### GoldToken (ERC-20)
- **Status**: ⚠️ **NOT READY** - Needs UUPS proxy conversion
- **Current Type**: Direct implementation (Ownable)
- **Required Type**: UUPS Upgradeable Proxy
- **Purpose**: In-game currency token
- **Upgradeable**: Yes (should be)
- **Deployment Required**: Yes (after proxy conversion)
- **Proxy Address**: `NOT DEPLOYED`
- **Implementation Address**: `NOT DEPLOYED`
- **Network**: Monad Testnet
- **Deployment Date**: `TBD`
- **Deployment TX**: `TBD`
- **Initial Supply**: 1,000,000 GOLD
- **Notes**: 
  - Currently NOT upgradeable
  - Must convert to UUPS before deployment
  - Needs proxy + implementation deployment

#### Inventory (ERC-1155)
- **Status**: ⚠️ **NOT READY** - Needs UUPS proxy conversion
- **Current Type**: Direct implementation (Ownable)
- **Required Type**: UUPS Upgradeable Proxy
- **Purpose**: ERC-1155 items/inventory contract
- **Upgradeable**: Yes (should be)
- **Deployment Required**: Yes (after proxy conversion)
- **Proxy Address**: `NOT DEPLOYED`
- **Implementation Address**: `NOT DEPLOYED`
- **Network**: Monad Testnet
- **Deployment Date**: `TBD`
- **Deployment TX**: `TBD`
- **Fee Recipient**: `TBD` (set in constructor)
- **Notes**: 
  - Currently NOT upgradeable
  - Has fee collection built-in
  - Must convert to UUPS before deployment
  - Constructor requires `feeRecipient` address

#### Adventurer (ERC-721)
- **Status**: ⚠️ **NOT READY** - Needs UUPS proxy conversion
- **Current Type**: Direct implementation (Ownable)
- **Required Type**: UUPS Upgradeable Proxy
- **Purpose**: Adventurer NFT contract
- **Upgradeable**: Yes (should be)
- **Deployment Required**: Yes (after proxy conversion)
- **Proxy Address**: `NOT DEPLOYED`
- **Implementation Address**: `NOT DEPLOYED`
- **Network**: Monad Testnet
- **Deployment Date**: `TBD`
- **Deployment TX**: `TBD`
- **Notes**: 
  - Currently NOT upgradeable
  - Must convert to UUPS before deployment

#### TavernKeeper (ERC-721)
- **Status**: ⚠️ **NOT READY** - Needs UUPS proxy conversion
- **Current Type**: Direct implementation (Ownable)
- **Required Type**: UUPS Upgradeable Proxy
- **Purpose**: TavernKeeper NFT contract
- **Upgradeable**: Yes (should be)
- **Deployment Required**: Yes (after proxy conversion)
- **Proxy Address**: `NOT DEPLOYED`
- **Implementation Address**: `NOT DEPLOYED`
- **Network**: Monad Testnet
- **Deployment Date**: `TBD`
- **Deployment TX**: `TBD`
- **Notes**: 
  - Currently NOT upgradeable
  - Must convert to UUPS before deployment

---

## Deployment Checklist

### Before Deployment

- [ ] Convert all game contracts to UUPS upgradeable pattern
- [ ] Test proxy deployment locally
- [ ] Verify proxy initialization
- [ ] Test upgrade functionality
- [ ] Set fee recipient address for Inventory contract
- [ ] Prepare deployment script with proxy pattern

### Deployment Steps

1. **Deploy ERC-6551 Infrastructure:**
   - [ ] Deploy ERC6551Registry
   - [ ] Deploy ERC6551Account (implementation)
   - [ ] Verify deployments
   - [ ] Update this file with addresses

2. **Deploy Game Contracts (as Proxies):**
   - [ ] Deploy GoldToken implementation
   - [ ] Deploy GoldToken proxy
   - [ ] Initialize GoldToken proxy
   - [ ] Update this file
   
   - [ ] Deploy Inventory implementation
   - [ ] Deploy Inventory proxy
   - [ ] Initialize Inventory proxy (with fee recipient)
   - [ ] Update this file
   
   - [ ] Deploy Adventurer implementation
   - [ ] Deploy Adventurer proxy
   - [ ] Initialize Adventurer proxy
   - [ ] Update this file
   
   - [ ] Deploy TavernKeeper implementation
   - [ ] Deploy TavernKeeper proxy
   - [ ] Initialize TavernKeeper proxy
   - [ ] Update this file

3. **Post-Deployment:**
   - [ ] Verify all contracts on block explorer
   - [ ] Update `.env` files with addresses
   - [ ] Update `lib/contracts/registry.ts` with addresses
   - [ ] Run contract validation tests
   - [ ] Document proxy admin addresses

---

## Deployment History

### Monad Testnet

| Contract | Type | Address | Deployed | TX Hash | Notes |
|----------|------|---------|----------|---------|-------|
| ERC6551Registry | Direct | `TBD` | `TBD` | `TBD` | |
| ERC6551Account | Direct | `TBD` | `TBD` | `TBD` | |
| GoldToken | Proxy | `TBD` | `TBD` | `TBD` | |
| GoldToken | Impl | `TBD` | `TBD` | `TBD` | |
| Inventory | Proxy | `TBD` | `TBD` | `TBD` | |
| Inventory | Impl | `TBD` | `TBD` | `TBD` | |
| Adventurer | Proxy | `TBD` | `TBD` | `TBD` | |
| Adventurer | Impl | `TBD` | `TBD` | `TBD` | |
| TavernKeeper | Proxy | `TBD` | `TBD` | `TBD` | |
| TavernKeeper | Impl | `TBD` | `TBD` | `TBD` | |

### Monad Mainnet

| Contract | Type | Address | Deployed | TX Hash | Notes |
|----------|------|---------|----------|---------|-------|
| *Not deployed yet* | | | | | |

---

## Proxy Admin Addresses

**CRITICAL: Keep these secure!**

| Contract | Proxy Admin | Multisig? | Notes |
|----------|-------------|-----------|-------|
| GoldToken | `TBD` | `TBD` | |
| Inventory | `TBD` | `TBD` | |
| Adventurer | `TBD` | `TBD` | |
| TavernKeeper | `TBD` | `TBD` | |

---

## Upgrade History

### GoldToken
- **v1.0.0** - `TBD` - Initial deployment

### Inventory
- **v1.0.0** - `TBD` - Initial deployment (with fee collection)

### Adventurer
- **v1.0.0** - `TBD` - Initial deployment

### TavernKeeper
- **v1.0.0** - `TBD` - Initial deployment

---

## Required Changes Before Deployment

### 1. Convert Contracts to UUPS

All game contracts need to:
- Import `@openzeppelin/contracts-upgradeable`
- Extend upgradeable base contracts
- Use `initialize()` instead of `constructor()`
- Add `reinitialize()` functions if needed
- Include `proxiableUUID()` for UUPS

### 2. Update Deployment Script

The deployment script needs to:
- Deploy implementation contracts
- Deploy UUPS proxy contracts
- Initialize proxies with `initialize()` function
- Set proxy admin
- Verify deployments

### 3. Update Contract Registry

After deployment:
- Update `apps/web/lib/contracts/registry.ts` with addresses
- Update `.env` files
- Run validation tests

---

## Environment Variables to Update After Deployment

```env
# ERC-6551
NEXT_PUBLIC_ERC6551_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_ERC6551_IMPLEMENTATION_ADDRESS=0x...

# Game Contracts (Proxy Addresses)
NEXT_PUBLIC_ERC20_TOKEN_ADDRESS=0x...              # GoldToken proxy
NEXT_PUBLIC_INVENTORY_CONTRACT_ADDRESS=0x...       # Inventory proxy
NEXT_PUBLIC_ADVENTURER_CONTRACT_ADDRESS=0x...      # Adventurer proxy
NEXT_PUBLIC_TAVERNKEEPER_CONTRACT_ADDRESS=0x...    # TavernKeeper proxy

# Implementation Addresses (for validation)
NEXT_PUBLIC_ERC20_TOKEN_IMPLEMENTATION_ADDRESS=0x...
NEXT_PUBLIC_INVENTORY_IMPLEMENTATION_ADDRESS=0x...
NEXT_PUBLIC_ADVENTURER_IMPLEMENTATION_ADDRESS=0x...
NEXT_PUBLIC_TAVERNKEEPER_IMPLEMENTATION_ADDRESS=0x...

# Fee Recipient
NEXT_PUBLIC_FEE_RECIPIENT_ADDRESS=0x...
```

---

## Important Notes

1. **NEVER redeploy contracts without updating this file**
2. **ALWAYS verify addresses on block explorer after deployment**
3. **Keep proxy admin keys secure** - use multisig for production
4. **Test upgrades on testnet before mainnet**
5. **Document all upgrades in the Upgrade History section**

---

## Last Updated

- **Date**: 2024-01-XX
- **Updated By**: [Your Name]
- **Reason**: Initial deployment tracker creation

