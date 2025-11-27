# Monad Network Configuration

This project is configured to use the Monad blockchain network.

## Required Environment Variables

Add these to your `.env` file:

```env
# Monad Network Configuration
NEXT_PUBLIC_MONAD_CHAIN_ID=10143  # Monad testnet chain ID (update when mainnet is available)
NEXT_PUBLIC_MONAD_RPC_URL=https://testnet-rpc.monad.xyz  # Monad RPC endpoint
NEXT_PUBLIC_MONAD_EXPLORER_URL=https://testnet-explorer.monad.xyz  # Monad block explorer

# ERC-6551 Configuration (Monad)
NEXT_PUBLIC_ERC6551_REGISTRY_ADDRESS=0x...  # ERC-6551 registry deployed on Monad
NEXT_PUBLIC_ERC6551_IMPLEMENTATION_ADDRESS=0x...  # ERC-6551 implementation on Monad
NEXT_PUBLIC_ERC6551_PROXY_ADDRESS=0x...  # ERC-6551 proxy on Monad

# Contract Addresses (Monad)
NEXT_PUBLIC_ERC20_TOKEN_ADDRESS=0x...  # ERC-20 token contract for marketplace pairs
NEXT_PUBLIC_INVENTORY_CONTRACT_ADDRESS=0x...  # ERC-1155 inventory items contract
NEXT_PUBLIC_ADVENTURER_CONTRACT_ADDRESS=0x...  # ERC-721 Adventurer NFT contract
NEXT_PUBLIC_TAVERNKEEPER_CONTRACT_ADDRESS=0x...  # ERC-721 TavernKeeper NFT contract

# Pseudoswap Configuration (Monad)
NEXT_PUBLIC_PSEUDOSWAP_ROUTER_ADDRESS=0x...  # Pseudoswap router contract
NEXT_PUBLIC_PSEUDOSWAP_FACTORY_ADDRESS=0x...  # Pseudoswap factory contract

# Protocol Fees
CLAIM_FEE_MULTIPLIER=1.1  # 10% above gas (barely more than gas)
NEXT_PUBLIC_FEE_RECIPIENT_ADDRESS=0x...  # Treasury wallet address (set in Inventory contract on deployment)

# Testnet Wallet (for development/testing only)
# WARNING: Never use this in production. Only for testnet.
TESTNET_PRIVATE_KEY=0x...  # Your testnet wallet private key (without 0x prefix is also fine)
# Note: If NEXT_PUBLIC_FEE_RECIPIENT_ADDRESS is not set, fees will go to the testnet wallet address
```

## Notes

- All contracts need to be deployed on Monad network
- ERC-6551 registry and implementation need to be deployed on Monad (or use existing if available)
- Update chain ID and RPC URLs when Monad mainnet launches
- Testnet values are placeholders - update with official Monad testnet details

