# Image Generation Prompt: The Cellar & Group Economics

## Purpose
Generate a detailed diagram explaining The Cellar pot system, epoch mechanics, group LP pooling, fee distribution, and how they all interconnect in the token economy.

## Style Specifications
- **Visual Style**: Economic/financial flow diagram with pot system visualization
- **Layout**: Central hub (The Cellar) with group systems on sides, epoch timeline at top
- **Color Scheme**:
  - Purple for The Cellar pot system
  - Orange for group mechanics
  - Green for earnings/rewards
  - Red for burning/spending
  - Blue for LP tokens
  - Gold for MON accumulation
- **Shapes**:
  - Large cylinder/pot for The Cellar
  - Rectangles for groups
  - Circles for tokens
  - Arrows showing flows and amounts
  - Timeline/graph for epoch price decay

## Content Breakdown

### Section 1: The Cellar Pot System (Center - Large)

#### Pot Accumulation
1. **The Cellar Pot** (Large Cylinder, Purple)
   - Label: "The Cellar Pot"
   - Sub-text: "Accumulates MON tokens"
   - Visual: Treasure chest/pot filling with MON
   - Multiple arrows pointing IN (sources)
   - One arrow pointing OUT (buying)

#### Contribution Sources
2. **Group Contribution Tax** (Rounded Rectangle, Orange)
   - Label: "1% Tax on Group Contributions"
   - Sub-text: "From Tavern Regulars & Town Posse"
   - Amount: "1% of all contributions"
   - Arrow pointing to "The Cellar Pot"

3. **Group LP Fee Share** (Rounded Rectangle, Orange)
   - Label: "20% of LP Fees"
   - Sub-text: "From group LP positions"
   - Amount: "20% of generated fees"
   - Arrow pointing to "The Cellar Pot"

4. **Other Sources** (Rounded Rectangle, Purple)
   - Label: "Other Contributions"
   - Sub-text: "Dungeon fees, treasury, etc."
   - Arrow pointing to "The Cellar Pot"

### Section 2: Epoch System (Top - Timeline)

5. **Epoch Timeline** (Horizontal Timeline, Purple)
   - Label: "Epoch Period"
   - Visual: Timeline with price decay curve
   - Start: "initPrice (high)"
   - End: "0 (low)"
   - Arrow showing time progression

6. **Current Epoch** (Rectangle, Purple)
   - Label: "Current Epoch"
   - Sub-text: "Epoch ID, start time, initial price"
   - Visual: Epoch box on timeline
   - Arrow pointing down

7. **Price Decay Formula** (Rectangle, Purple)
   - Label: "Price Decay Formula"
   - Formula: "price = initPrice - (initPrice × timePassed / epochPeriod)"
   - Visual: Decreasing line graph
   - Sub-text: "Linear decay from initPrice to 0"
   - Arrow pointing down

8. **Current Price** (Rounded Rectangle, Purple)
   - Label: "Current Pot Price"
   - Sub-text: "Decreases over time"
   - Visual: Price indicator
   - Arrow pointing down to "Buy Pot" section

### Section 3: Buying the Pot (Center-Bottom)

9. **Check Price** (Rounded Rectangle, Purple)
   - Label: "Query Current Price"
   - Sub-text: "getPrice() function"
   - Arrow pointing down

10. **Buy Decision** (Diamond, Purple)
    - Label: "Buy Pot Now?"
    - Two branches:
      - "Yes" → continue to buy process
      - "No" → "Wait for lower price" → back to price check

11. **Burn LP Tokens** (Rounded Rectangle, Red)
    - Label: "Burn LP Tokens"
    - Sub-text: "Amount = current pot price"
    - Visual: Fire/burn icon
    - Formula: "burnAmount = getPrice()"
    - Arrow pointing down

12. **Transfer to Dead Address** (Cylinder, Red)
    - Label: "LP Tokens → Dead Address"
    - Sub-text: "Permanently burned"
    - Visual: Dead address icon (0x000...)
    - Arrow pointing down

13. **Receive MON** (Rounded Rectangle, Green)
    - Label: "Receive Pot Contents (MON)"
    - Sub-text: "All accumulated MON"
    - Visual: MON tokens flowing to buyer
    - Arrow pointing down

14. **New Epoch Starts** (Rounded Rectangle, Purple)
    - Label: "New Epoch Begins"
    - Sub-text: "Price multiplier applied"
    - Formula: "newInitPrice = oldInitPrice × priceMultiplier"
    - Arrow looping back to "Epoch Timeline"

15. **Price Multiplier** (Rectangle, Purple)
    - Label: "Price Multiplier"
    - Sub-text: "Range: 1.1x to 3x"
    - Sub-text: "Increases next epoch starting price"
    - Visual: Multiplier icon

### Section 4: Group LP Pooling (Left Side - Orange)

#### Tavern Regulars (Small Groups)
16. **Tavern Regulars** (Rectangle, Orange)
    - Label: "Tavern Regulars"
    - Sub-text: "3-10 members, simple pooling"
    - Visual: Small group icon
    - Arrow pointing down

17. **Contribute MON** (Rounded Rectangle, Orange)
    - Label: "Members Contribute MON"
    - Sub-text: "Pool resources together"
    - Arrow pointing down

18. **Create LP Position** (Rounded Rectangle, Blue)
    - Label: "Create Uniswap V4 LP Position"
    - Sub-text: "MON + KEEP pair"
    - Visual: LP token icon
    - Arrow pointing down

19. **LP Position** (Cylinder, Blue)
    - Label: "Group LP Position"
    - Sub-text: "Shared liquidity"
    - Arrow pointing right to fee distribution

#### Town Posse (Large Groups)
20. **Town Posse** (Rectangle, Orange)
    - Label: "Town Posse"
    - Sub-text: "10-100+ members, governance"
    - Visual: Large group icon
    - Arrow pointing down

21. **Contribute MON** (Rounded Rectangle, Orange)
    - Label: "Members Contribute MON"
    - Sub-text: "Pool resources together"
    - Arrow pointing down

22. **Governance System** (Rounded Rectangle, Orange)
    - Label: "Governance Proposals"
    - Sub-text: "Vote on LP strategies"
    - Visual: Voting icon
    - Arrow pointing down

23. **Create LP Position** (Rounded Rectangle, Blue)
    - Label: "Create Uniswap V4 LP Position"
    - Sub-text: "MON + KEEP pair"
    - Visual: LP token icon
    - Arrow pointing down

24. **LP Position** (Cylinder, Blue)
    - Label: "Group LP Position"
    - Sub-text: "Shared liquidity"
    - Arrow pointing right to fee distribution

### Section 5: Fee Distribution (Right Side - Green/Orange)

25. **LP Fee Generation** (Rounded Rectangle, Green)
    - Label: "Generate LP Fees"
    - Sub-text: "From Uniswap trading activity"
    - Visual: Fee icon
    - Arrow pointing down

26. **Fee Distribution Split** (Diamond, Orange)
    - Label: "Distribute Fees"
    - Three branches:
      - "75% to Members" (Rounded Rectangle, Green)
      - "20% to Pot" (Rounded Rectangle, Purple)
      - "5% to Treasury" (Rounded Rectangle, Blue)

27. **Member Claims** (Rounded Rectangle, Green)
    - Label: "Members Claim Share"
    - Sub-text: "75% of fees distributed"
    - Formula: "memberShare = totalFees × 0.75 / memberCount"
    - Visual: Members receiving tokens

28. **Contribute to Pot** (Rounded Rectangle, Purple)
    - Label: "20% to The Cellar Pot"
    - Sub-text: "Automatic contribution"
    - Amount: "20% of all LP fees"
    - Arrow pointing to "The Cellar Pot"

29. **Treasury** (Cylinder, Blue)
    - Label: "5% to Treasury"
    - Sub-text: "Game operations"
    - Amount: "5% of all LP fees"

### Section 6: Contribution Tax Flow (Connection)

30. **Contribution Tax** (Rounded Rectangle, Orange)
    - Label: "1% Tax on Contributions"
    - Sub-text: "Applied when members contribute"
    - Formula: "tax = contribution × 0.01"
    - Visual: Tax icon
    - Arrow pointing to "The Cellar Pot"

### Section 7: Epoch Configuration (Bottom - Purple)

31. **Epoch Parameters** (Rectangle, Purple)
    - Label: "Epoch Configuration"
    - Parameters:
      - "MIN_EPOCH_PERIOD: 1 hour"
      - "MAX_EPOCH_PERIOD: 365 days"
      - "MIN_PRICE_MULTIPLIER: 1.1x (110%)"
      - "MAX_PRICE_MULTIPLIER: 3x (300%)"
    - Visual: Configuration icon

32. **Immutable Contract** (Rectangle, Purple)
    - Label: "TheCellar Contract"
    - Sub-text: "Immutable (no upgrades)"
    - Visual: Lock icon
    - Sub-text: "Parameters set at deployment"

## Additional Visual Elements
- **Pot Icon**: Large treasure chest/pot filling with MON
- **LP Token Icon**: Liquidity pool symbol
- **MON Token Icon**: Blue coin with "MON"
- **KEEP Token Icon**: Gold coin with "KEEP"
- **Fee Icon**: Percentage/money symbol
- **Tax Icon**: Small tax symbol
- **Burn Icon**: Fire/burn symbol for LP burning
- **Dead Address Icon**: 0x000... address
- **Timeline**: Horizontal timeline showing epoch progression
- **Price Graph**: Decreasing line showing price decay
- **Flow Amounts**: Percentage labels (1%, 20%, 75%, 5%)
- **Multiplier Visual**: Arrow showing price increase

## Technical Details to Emphasize
- The Cellar accumulates MON from multiple sources
- Epoch system with linear price decay (Dutch auction style)
- Price decreases from initPrice to 0 over epochPeriod
- Buying the pot burns LP tokens (sent to dead address)
- New epoch starts with higher price (multiplier applied)
- Groups contribute 1% tax on all contributions
- Groups contribute 20% of LP fees to pot
- Members receive 75% of LP fees
- Treasury receives 5% of LP fees
- TheCellar is immutable (no owner functions)
- Epoch parameters have min/max constraints

## Layout Instructions
- **Width**: 16:9 aspect ratio (1920x1080 recommended)
- **Layout**:
  - Center: The Cellar pot (large, prominent)
  - Top: Epoch timeline with price decay
  - Left: Group LP pooling (Tavern Regulars, Town Posse)
  - Right: Fee distribution (75/20/5 split)
  - Bottom: Epoch configuration and buying process
- **Flow Direction**:
  - Contributions flow INTO pot (top/left/right)
  - Buying flows OUT of pot (bottom)
  - Epoch timeline flows left to right
- **Connections**:
  - Solid arrows for primary flows
  - Dashed arrows for automatic processes
  - Thick arrows for major token movements
  - Color-coded by type (purple for pot, orange for groups, etc.)
- **Grouping**: Use background colors or boxes to group:
  - Purple background: The Cellar system
  - Orange background: Group systems
  - Green background: Rewards/earnings
- **Timeline**: Horizontal timeline at top showing epoch progression

## Prompt Text for Image Generator
"Create a comprehensive economic flow diagram showing The Cellar pot system and group economics for a blockchain game. Center: Large Cellar pot accumulating MON from multiple sources. Top: Epoch timeline showing linear price decay from initPrice to 0 over epochPeriod, with price multiplier increasing next epoch. Left: Group LP pooling systems (Tavern Regulars 3-10 members, Town Posse 10-100+ with governance) creating Uniswap V4 LP positions. Right: Fee distribution (75% to members, 20% to pot, 5% to treasury) from LP fees. Bottom: Buying process (burn LP tokens equal to current price, receive all MON, new epoch starts). Show 1% contribution tax and 20% fee share flowing to pot. Include epoch parameters (1 hour to 365 days, 1.1x to 3x multiplier). Color code: purple for Cellar, orange for groups, green for earnings, red for burning, blue for LP. Show price decay graph, LP token burning to dead address, and cyclical epoch system. Professional financial diagram with clear flows, percentages, and economic mechanics."
