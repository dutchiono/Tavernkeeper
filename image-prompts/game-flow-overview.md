# Image Generation Prompt: Complete Game Flow Overview

## Purpose
Generate a comprehensive flowchart/infographic showing the complete InnKeeper game loop from player onboarding through dungeon runs to rewards and progression.

## Style Specifications
- **Visual Style**: Modern technical flowchart with infographic elements
- **Layout**: Top-to-bottom flow with clear directional arrows
- **Color Scheme**:
  - Blue tones for blockchain/on-chain actions
  - Green tones for rewards and progression
  - Orange/red tones for combat and dungeons
  - Purple tones for AI/agent systems
  - Gold/yellow for NFTs and valuable items
- **Shapes**:
  - Rounded rectangles for processes
  - Diamonds for decision points
  - Cylinders for data storage (blockchain)
  - Hexagons for NFTs/tokens
  - Circles for start/end points

## Content Breakdown

### Section 1: Player Onboarding (Top)
1. **Start Node** (Circle, Gold): "New Player"
2. **Mint TavernKeeper NFT** (Hexagon, Gold)
   - Label: "Mint TavernKeeper NFT (ERC-721)"
   - Sub-text: "Signature-based pricing, prevents front-running"
   - Arrow pointing down
3. **Claim Free Hero** (Rounded Rectangle, Blue)
   - Label: "Claim Free Adventurer Hero"
   - Sub-text: "One free hero per TavernKeeper NFT"
   - Arrow pointing down
4. **Hero Created** (Hexagon, Gold)
   - Label: "Adventurer NFT (ERC-721)"
   - Sub-text: "Unique attributes, Token Bound Account (ERC-6551)"
   - Arrow pointing down

### Section 2: Party Formation (Middle-Top)
5. **Create Party** (Rounded Rectangle, Green)
   - Label: "Form Party (1-5 Heroes)"
   - Sub-text: "Select your heroes or invite others"
   - Arrow pointing down
6. **Decision Point** (Diamond, Orange)
   - Label: "Party Full?"
   - Two branches:
     - "No" → "Invite Players" (Rounded Rectangle, Green) → back to decision
     - "Yes" → continue down
7. **Select Dungeon** (Rounded Rectangle, Orange)
   - Label: "Choose Dungeon"
   - Arrow pointing down

### Section 3: Dungeon Entry (Middle)
8. **Pay Entry Fee** (Rounded Rectangle, Blue)
   - Label: "Pay Entry Fee via DungeonGatekeeper"
   - Sub-text: "MON or ERC-20 tokens, signature-based pricing"
   - Icon: Lock/gate symbol
   - Arrow pointing down
9. **Dungeon Access Granted** (Rounded Rectangle, Green)
   - Label: "Access Granted"
   - Arrow pointing down

### Section 4: Dungeon Run (Center - Large Section)
10. **Generate Seed** (Cylinder, Purple)
    - Label: "Generate Deterministic Seed"
    - Sub-text: "Party + Timestamp + Dungeon ID + Random"
    - Arrow pointing down
11. **Dungeon Generated** (Rounded Rectangle, Orange)
    - Label: "Procedurally Generate Dungeon"
    - Sub-text: "Rooms, monsters, loot - all deterministic"
    - Arrow pointing down
12. **AI Agent Decisions** (Rounded Rectangle, Purple)
    - Label: "Heroes Make Autonomous Decisions"
    - Sub-text: "ElizaOS agents with personality & memory"
    - Multiple arrows branching out to:
      - "Explore Room" (Rounded Rectangle, Orange)
      - "Enter Combat" (Rounded Rectangle, Red)
      - "Collect Treasure" (Rounded Rectangle, Gold)
      - "Rest" (Rounded Rectangle, Green)
13. **Combat Loop** (Diamond, Red)
    - Label: "Combat Encounter?"
    - If "Yes":
      - "Roll Initiative" → "Turn-Based Combat" → "Calculate Damage" → back to decision
    - If "No": continue
14. **Room Types** (Multiple Rounded Rectangles, various colors)
    - "Combat Room" (Red)
    - "Treasure Room" (Gold)
    - "Rest Room" (Green)
    - "Boss Room" (Dark Red)
    - "Empty Room" (Gray)
    - All converge to decision point
15. **Objective Check** (Diamond, Orange)
    - Label: "Objectives Complete?"
    - Two branches:
      - "No" → back to AI Agent Decisions
      - "Yes" → continue down

### Section 5: Rewards & Progression (Bottom)
16. **Calculate Rewards** (Rounded Rectangle, Gold)
    - Label: "Calculate Rewards"
    - Sub-text: "Loot + KEEP tokens + Experience"
    - Arrow pointing down
17. **Distribute Loot** (Rounded Rectangle, Gold)
    - Label: "Distribute Loot to Party"
    - Sub-text: "ERC-1155 items, procedurally generated"
    - Arrow pointing down
18. **Mint KEEP Tokens** (Cylinder, Blue)
    - Label: "Mint KEEP Tokens"
    - Sub-text: "Reward for completion, boss defeats"
    - Arrow pointing down
19. **Equip Items** (Rounded Rectangle, Green)
    - Label: "Equip Items to Heroes"
    - Sub-text: "6 equipment slots per hero"
    - Arrow pointing down
20. **Update Hero State** (Cylinder, Blue)
    - Label: "Update Hero on Blockchain"
    - Sub-text: "New equipment, memories, experience"
    - Arrow pointing down
21. **End Node** (Circle, Green)
    - Label: "Ready for Next Run"
    - Arrow looping back to "Create Party" (optional dashed line)

## Additional Visual Elements
- **Background**: Subtle grid pattern or dungeon-themed texture
- **Icons**:
  - Sword for combat
  - Chest for loot
  - Brain/AI symbol for agents
  - Blockchain link icon for on-chain actions
  - Party icon for groups
- **Legend**: Small box in corner showing shape meanings
- **Flow Indicators**: Numbered steps or clear arrow progression
- **Highlight Boxes**: Important concepts in colored boxes (e.g., "Deterministic Engine" in purple box)

## Technical Details to Emphasize
- All dungeon runs are deterministic (same seed = same results)
- Heroes use AI agents (ElizaOS) for autonomous decisions
- All assets are on-chain (ERC-721, ERC-1155, ERC-20, ERC-6551)
- Signature-based pricing prevents front-running
- Token Bound Accounts allow heroes to own assets

## Layout Instructions
- **Width**: 16:9 aspect ratio (1920x1080 recommended)
- **Flow Direction**: Primarily vertical (top to bottom)
- **Sections**: Clearly separated with subtle dividers or background color changes
- **Spacing**: Generous whitespace between major sections
- **Typography**: Clear, readable fonts with hierarchy (larger for main steps, smaller for sub-text)
- **Connections**: Bold arrows for primary flow, dashed arrows for optional/looping paths

## Prompt Text for Image Generator
"Create a comprehensive technical flowchart showing a complete game loop for a blockchain-based dungeon crawler game. The diagram should flow top-to-bottom showing: (1) Player onboarding with NFT minting, (2) Party formation with 1-5 heroes, (3) Dungeon entry with fee payment, (4) Deterministic dungeon run with AI agent decision-making, combat encounters, and room exploration, (5) Reward distribution with loot and tokens. Use modern infographic style with color-coded sections: blue for blockchain actions, green for rewards, orange/red for combat, purple for AI systems, gold for NFTs. Include icons for combat, loot, AI agents, and blockchain. Show clear directional flow with arrows. Emphasize deterministic mechanics and on-chain assets. Professional technical diagram aesthetic with clean lines and clear typography."
