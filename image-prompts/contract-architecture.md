# Image Generation Prompt: Smart Contract Architecture Diagram

## Purpose
Generate a comprehensive architecture diagram showing all smart contracts, their relationships, token standards, and how they interact in the InnKeeper ecosystem.

## Style Specifications
- **Visual Style**: Technical system architecture diagram
- **Layout**: Hub-and-spoke with core contracts in center, grouped by category
- **Color Scheme**:
  - Blue for core game contracts
  - Green for group contracts
  - Purple for utility contracts
  - Gold for NFTs
  - Orange for tokens
  - Red for access control
- **Shapes**:
  - Large rectangles for contract categories
  - Medium rectangles for individual contracts
  - Hexagons for NFTs
  - Circles for tokens
  - Cylinders for registries
  - Arrows showing interactions and dependencies

## Content Breakdown

### Core Game Contracts (Center - Blue Section)

1. **Adventurer Contract** (Rectangle, Blue)
   - Label: "Adventurer (ERC-721)"
   - Sub-text: "Hero NFTs"
   - Features:
     - "Mint heroes"
     - "Token Bound Accounts (ERC-6551)"
     - "Metadata storage"
   - Connections:
     - Arrow to "ERC6551Registry"
     - Arrow to "ERC6551Account"
     - Arrow to "Inventory" (equip items)

2. **TavernKeeper Contract** (Rectangle, Blue)
   - Label: "TavernKeeper (ERC-721)"
   - Sub-text: "Special character NFTs"
   - Features:
     - "Mint TavernKeepers"
     - "Claim free heroes"
     - "Mint KEEP tokens"
     - "Signature-based pricing"
   - Connections:
     - Arrow to "KeepToken" (mints KEEP)
     - Arrow to "Adventurer" (claims heroes)

3. **KeepToken Contract** (Circle, Orange)
   - Label: "KeepToken (ERC-20)"
   - Sub-text: "In-game currency"
   - Features:
     - "Mintable (by TavernKeeper only)"
     - "Transferable"
     - "18 decimals"
   - Connections:
     - Arrow FROM "TavernKeeper" (minting control)
     - Arrow to "Marketplace" (spending)
     - Arrow to "Groups" (contributions)

4. **Inventory Contract** (Rectangle, Blue)
   - Label: "Inventory (ERC-1155)"
   - Sub-text: "Items and equipment"
   - Features:
     - "Multi-token standard"
     - "Batch operations"
     - "Equip to heroes"
   - Connections:
     - Arrow to "Adventurer" (equipment)
     - Arrow to "Marketplace" (trading)

### Group Contracts (Right Side - Green Section)

5. **TavernRegularsManager** (Rectangle, Green)
   - Label: "TavernRegularsManager"
   - Sub-text: "Small groups (3-10 members)"
   - Features:
     - "LP pooling"
     - "Fee distribution"
     - "Owner-controlled"
   - Connections:
     - Arrow to "Uniswap V4" (LP positions)
     - Arrow to "TheCellar" (contributions)
     - Arrow to "KeepToken" (contributions)

6. **TownPosseManager** (Rectangle, Green)
   - Label: "TownPosseManager"
   - Sub-text: "Large groups (10-100+ members)"
   - Features:
     - "LP pooling"
     - "Governance system"
     - "Proposal voting"
     - "Tier system (Bronze/Silver/Gold)"
   - Connections:
     - Arrow to "Uniswap V4" (LP positions)
     - Arrow to "TheCellar" (contributions)
     - Arrow to "KeepToken" (contributions)

### Utility Contracts (Left Side - Purple Section)

7. **DungeonGatekeeper** (Rectangle, Red)
   - Label: "DungeonGatekeeper"
   - Sub-text: "Access control & fee collection"
   - Features:
     - "Entry fee collection"
     - "Signature-based pricing"
     - "Nonce system (replay protection)"
     - "Treasury management"
   - Connections:
     - Arrow FROM users (pay fees)
     - Arrow to "Treasury" (fee collection)
     - Arrow to "KeepToken" or "MON" (payment)

8. **TheCellar** (Rectangle, Purple)
   - Label: "TheCellar"
   - Sub-text: "Pot/auction system"
   - Features:
     - "Epoch-based price decay"
     - "LP token burning"
     - "MON accumulation"
     - "Immutable (no upgrades)"
   - Connections:
     - Arrow FROM "TavernRegularsManager" (contributions)
     - Arrow FROM "TownPosseManager" (contributions)
     - Arrow FROM "DungeonGatekeeper" (optional)
     - Arrow to "Uniswap LP" (burning)

9. **ERC6551Registry** (Cylinder, Purple)
   - Label: "ERC6551Registry"
   - Sub-text: "Token Bound Account registry"
   - Features:
     - "Create TBAs for NFTs"
     - "Standard registry"
   - Connections:
     - Arrow FROM "Adventurer" (creates TBAs)
     - Arrow to "ERC6551Account"

10. **ERC6551Account** (Rectangle, Purple)
    - Label: "ERC6551Account"
    - Sub-text: "TBA implementation"
    - Features:
      - "Smart contract wallet"
      - "Owned by NFT"
      - "Can hold assets"
    - Connections:
      - Arrow FROM "ERC6551Registry"
      - Arrow to "Inventory" (holds items)
      - Arrow to "KeepToken" (holds tokens)

### External Integrations (Bottom - Gray Section)

11. **Uniswap V4** (Rectangle, Gray)
    - Label: "Uniswap V4"
    - Sub-text: "DEX integration"
    - Features:
      - "LP position creation"
      - "Fee generation"
    - Connections:
      - Arrow FROM "TavernRegularsManager"
      - Arrow FROM "TownPosseManager"
      - Arrow to "TheCellar" (LP burning)

12. **Marketplace** (Rectangle, Gray)
    - Label: "Marketplace (Off-chain)"
    - Sub-text: "Item trading"
    - Features:
      - "List items"
      - "Buy/sell"
    - Connections:
      - Arrow FROM "Inventory"
      - Arrow FROM "KeepToken"

### Token Standards Layer (Top - Gold Section)

13. **ERC-721 Standard** (Hexagon, Gold)
    - Label: "ERC-721"
    - Sub-text: "Non-Fungible Token"
    - Connections:
      - "Adventurer" implements
      - "TavernKeeper" implements

14. **ERC-1155 Standard** (Hexagon, Gold)
    - Label: "ERC-1155"
    - Sub-text: "Multi-Token Standard"
    - Connections:
      - "Inventory" implements

15. **ERC-20 Standard** (Circle, Orange)
    - Label: "ERC-20"
    - Sub-text: "Fungible Token"
    - Connections:
      - "KeepToken" implements

16. **ERC-6551 Standard** (Hexagon, Gold)
    - Label: "ERC-6551"
    - Sub-text: "Token Bound Accounts"
    - Connections:
      - "ERC6551Registry" implements
      - "ERC6551Account" implements
      - "Adventurer" uses

### Upgradeability Layer (Background)

17. **UUPS Proxy Pattern** (Dashed Rectangle, Light Blue)
    - Label: "UUPS Upgradeable Proxy"
    - Sub-text: "All game contracts (except TheCellar)"
    - Visual: Overlay on upgradable contracts
    - Contracts using UUPS:
      - Adventurer
      - TavernKeeper
      - KeepToken
      - Inventory
      - TavernRegularsManager
      - TownPosseManager
      - DungeonGatekeeper
      - ERC6551Account

### Security Features (Annotations)

18. **Security Icons** (Small icons near contracts)
    - Lock icon: "Ownable" (owner-only functions)
    - Shield icon: "ReentrancyGuard" (reentrancy protection)
    - Signature icon: "Signature Verification" (pricing)
    - Nonce icon: "Nonce System" (replay protection)

## Additional Visual Elements
- **Contract Icons**:
  - Smart contract symbol for each contract
  - Registry icon for ERC6551Registry
  - Lock icon for access control
  - Pot/treasure icon for TheCellar
- **Token Icons**:
  - NFT hexagon for ERC-721
  - Coin circle for ERC-20
  - Multi-token icon for ERC-1155
- **Connection Types**:
  - Solid arrows: Direct calls/interactions
  - Dashed arrows: Optional/indirect connections
  - Thick arrows: Major token flows
  - Colored arrows: Match token/contract type
- **Network Indicator**: "Monad Testnet" label at top
- **Legend**: Box showing shape and arrow meanings

## Technical Details to Emphasize
- All contracts use UUPS upgradeable proxy (except TheCellar)
- ERC-721 for heroes and TavernKeepers
- ERC-1155 for items (multi-token)
- ERC-20 for KEEP currency
- ERC-6551 for Token Bound Accounts (hero wallets)
- Signature-based pricing prevents front-running
- Nonce system prevents replay attacks
- TheCellar is immutable (no upgrades)
- Groups integrate with Uniswap V4 for LP

## Layout Instructions
- **Width**: 16:9 aspect ratio (1920x1080 recommended)
- **Layout**:
  - Center: Core game contracts (blue)
  - Right: Group contracts (green)
  - Left: Utility contracts (purple)
  - Top: Token standards (gold/orange)
  - Bottom: External integrations (gray)
- **Grouping**: Use colored background boxes or borders to group related contracts
- **Hierarchy**: Larger boxes for categories, medium for contracts
- **Connections**:
  - Clear arrows showing direction of interaction
  - Label arrows with action type (e.g., "mints", "calls", "transfers")
  - Group related connections
- **Spacing**: Generous whitespace between groups
- **Labels**: Clear contract names with standard types in parentheses

## Prompt Text for Image Generator
"Create a comprehensive smart contract architecture diagram for a blockchain game ecosystem. The diagram should show: (1) Core game contracts in center (Adventurer ERC-721, TavernKeeper ERC-721, KeepToken ERC-20, Inventory ERC-1155), (2) Group contracts on right (TavernRegularsManager, TownPosseManager for LP pooling), (3) Utility contracts on left (DungeonGatekeeper for access control, TheCellar for pot system, ERC6551Registry/Account for Token Bound Accounts), (4) Token standards layer at top (ERC-721, ERC-1155, ERC-20, ERC-6551), (5) External integrations at bottom (Uniswap V4, Marketplace). Color code: blue for core contracts, green for groups, purple for utilities, gold for NFTs, orange for tokens. Show UUPS upgradeable proxy pattern overlay. Include arrows showing contract interactions, token flows, and dependencies. Add security feature icons (locks, shields, signatures). Professional system architecture diagram style with clear grouping, labeled connections, and hierarchical layout."
