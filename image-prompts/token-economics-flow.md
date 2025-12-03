# Image Generation Prompt: Token Economics Flow Diagram

## Purpose
Generate a detailed flow diagram visualizing the complete KEEP token economy, from creation through distribution, usage, and the Cellar pot system.

## Style Specifications
- **Visual Style**: Financial/economic flow diagram with currency symbols and token icons
- **Layout**: Circular/cyclical flow showing token lifecycle, with central hub for The Cellar
- **Color Scheme**:
  - Gold/yellow for KEEP tokens
  - Blue for MON (native currency)
  - Green for earning/rewards
  - Red for spending/burning
  - Purple for The Cellar pot
  - Orange for group activities
- **Shapes**:
  - Coins/tokens for KEEP tokens
  - Hexagons for NFTs
  - Cylinders for smart contracts
  - Rounded rectangles for processes
  - Arrows showing flow direction and amounts

## Content Breakdown

### Central Hub: The Cellar (Center)
1. **The Cellar Pot** (Large Cylinder, Purple)
   - Label: "The Cellar Pot"
   - Sub-text: "Accumulates MON from various sources"
   - Visual: Pot/treasure chest with MON inside
   - Multiple arrows pointing IN (contributions)
   - One arrow pointing OUT (buying the pot)

### Token Creation Sources (Top Section)

#### Source 1: TavernKeeper NFT System
2. **TavernKeeper NFT** (Hexagon, Gold)
   - Label: "TavernKeeper NFT (ERC-721)"
   - Arrow pointing down
3. **Time-Based Accumulation** (Rounded Rectangle, Green)
   - Label: "Accumulate KEEP Over Time"
   - Sub-text: "0.01 KEEP per second (default rate)"
   - Visual: Clock icon with accumulating tokens
   - Arrow pointing down
4. **Claim KEEP Tokens** (Rounded Rectangle, Gold)
   - Label: "Claim KEEP Tokens"
   - Sub-text: "Minted to NFT owner"
   - Arrow pointing to "KEEP Token Pool" (see below)

#### Source 2: Gameplay Rewards
5. **Dungeon Completion** (Rounded Rectangle, Green)
   - Label: "Complete Dungeon Run"
   - Arrow pointing down
6. **Boss Defeat** (Rounded Rectangle, Green)
   - Label: "Defeat Boss"
   - Arrow pointing down
7. **Group Activities** (Rounded Rectangle, Orange)
   - Label: "Participate in Groups"
   - Sub-text: "Tavern Regulars / Town Posse"
   - Arrow pointing down
8. **Mint KEEP Reward** (Cylinder, Blue)
   - Label: "TavernKeeper Contract Mints KEEP"
   - Sub-text: "Only TavernKeeper can mint"
   - All arrows converge here
   - Arrow pointing down to "KEEP Token Pool"

### KEEP Token Pool (Middle Section)
9. **KEEP Token Pool** (Large Coin Stack, Gold)
   - Label: "KEEP Token Supply"
   - Sub-text: "ERC-20 Token on Monad"
   - Visual: Stack of gold coins with KEEP symbol
   - Multiple arrows pointing OUT (usage)

### Token Usage/Spending (Bottom Section)

#### Usage 1: Marketplace
10. **Marketplace Purchase** (Rounded Rectangle, Red)
    - Label: "Buy Items on Marketplace"
    - Sub-text: "Spend KEEP for equipment"
    - Arrow from KEEP Pool
    - Arrow pointing to "Item Transfer"

#### Usage 2: In-Game Purchases
11. **Item Purchases** (Rounded Rectangle, Red)
    - Label: "Purchase Items from NPCs"
    - Arrow from KEEP Pool

#### Usage 3: Group Contributions
12. **Group Contribution** (Rounded Rectangle, Orange)
    - Label: "Contribute to Groups"
    - Sub-text: "Tavern Regulars / Town Posse"
    - Arrow from KEEP Pool
    - Arrow pointing to "Group LP Pool"

### Group Economics Flow (Right Side)

#### Group LP Pooling
13. **Group LP Pool** (Cylinder, Orange)
    - Label: "Group LP Position"
    - Sub-text: "Uniswap V4 LP tokens"
    - Visual: Liquidity pool icon
    - Arrow pointing down

#### Fee Distribution
14. **LP Fee Generation** (Rounded Rectangle, Green)
    - Label: "Generate LP Fees"
    - Sub-text: "From Uniswap trading"
    - Arrow pointing down
15. **Fee Distribution Split** (Diamond, Orange)
    - Three branches:
      - "75% to Members" (Rounded Rectangle, Green) → "Member Claims"
      - "20% to Pot" (Rounded Rectangle, Purple) → "The Cellar Pot"
      - "5% to Treasury" (Rounded Rectangle, Blue) → "Treasury"

#### Contribution Tax
16. **1% Contribution Tax** (Rounded Rectangle, Purple)
    - Label: "1% Tax on Contributions"
    - Sub-text: "Goes directly to The Cellar"
    - Arrow from Group Contribution
    - Arrow pointing to "The Cellar Pot"

### The Cellar System (Left Side)

#### Epoch Mechanics
17. **Epoch System** (Rounded Rectangle, Purple)
    - Label: "Epoch-Based Price Decay"
    - Sub-text: "Price decreases linearly over time"
    - Visual: Clock with decreasing price line
    - Arrow pointing down
18. **Current Pot Price** (Rounded Rectangle, Purple)
    - Label: "Current Pot Price (LP tokens)"
    - Sub-text: "Decreases from initPrice to 0"
    - Formula: "price = initPrice - (initPrice × timePassed / epochPeriod)"
    - Arrow pointing down

#### Buying the Pot
19. **Burn LP Tokens** (Rounded Rectangle, Red)
    - Label: "Burn LP Tokens"
    - Sub-text: "Amount = current pot price"
    - Visual: Fire/burn icon
    - Arrow pointing down
20. **Receive MON** (Rounded Rectangle, Green)
    - Label: "Receive Pot Contents (MON)"
    - Sub-text: "All accumulated MON"
    - Arrow pointing to "Player Wallet"
21. **New Epoch Starts** (Rounded Rectangle, Purple)
    - Label: "New Epoch Begins"
    - Sub-text: "Price multiplier increases next epoch"
    - Arrow looping back to "Epoch System"

### Token Flow Summary
- **Creation**: TavernKeeper accumulation, gameplay rewards
- **Distribution**: Minted to players, distributed as rewards
- **Usage**: Marketplace, purchases, group contributions
- **Recycling**: Group fees → Cellar → Pot system
- **Burning**: LP tokens burned to buy pot

## Additional Visual Elements
- **Currency Icons**:
  - Gold coin with "KEEP" for KEEP tokens
  - Blue coin with "MON" for native currency
  - LP token icon for liquidity positions
- **Flow Amounts**: Percentage labels on arrows (e.g., "75%", "20%", "5%")
- **Rate Indicators**: "0.01 KEEP/sec" near accumulation
- **Time Indicators**: Clock icons for time-based mechanics
- **Contract Icons**: Smart contract symbols for on-chain actions
- **Background**: Subtle financial/graph paper texture

## Technical Details to Emphasize
- KEEP tokens are ERC-20 on Monad blockchain
- Only TavernKeeper contract can mint KEEP
- The Cellar uses epoch-based price decay (Dutch auction style)
- Group fee distribution: 75% members, 20% pot, 5% treasury
- 1% tax on all group contributions goes to pot
- LP tokens are burned (sent to dead address) to buy pot
- Price multiplier increases each epoch (1.1x to 3x range)

## Layout Instructions
- **Width**: 16:9 aspect ratio (1920x1080 recommended)
- **Layout**: Central hub (The Cellar) with flows radiating outward
- **Flow Direction**:
  - Top: Token creation sources
  - Middle: Token pool and distribution
  - Bottom: Token usage
  - Left: The Cellar mechanics
  - Right: Group economics
- **Connections**:
  - Solid arrows for primary flows
  - Dashed arrows for secondary flows
  - Thick arrows for major token movements
  - Color-coded by token type (gold for KEEP, blue for MON)
- **Grouping**: Use subtle background colors or boxes to group related elements

## Prompt Text for Image Generator
"Create a comprehensive token economics flow diagram for a blockchain game. The diagram should show: (1) KEEP token creation from TavernKeeper NFT accumulation (0.01 KEEP/sec) and gameplay rewards, (2) Token distribution and usage in marketplace and group contributions, (3) Group LP pooling with fee distribution (75% members, 20% pot, 5% treasury), (4) The Cellar pot system with epoch-based price decay where players burn LP tokens to claim accumulated MON. Use a hub-and-spoke layout with The Cellar as the central hub. Color code: gold for KEEP tokens, blue for MON, purple for The Cellar, orange for groups, green for earnings, red for spending/burning. Include percentage labels on distribution arrows, rate indicators, and currency icons. Show cyclical nature of token economy. Professional financial diagram aesthetic with clear flow directions and token symbols."
