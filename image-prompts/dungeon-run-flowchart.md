# Image Generation Prompt: Dungeon Run Detailed Flowchart

## Purpose
Generate a detailed step-by-step flowchart showing exactly what happens during a dungeon run, from seed generation through room exploration, combat, and completion.

## Style Specifications
- **Visual Style**: Detailed technical flowchart with game elements
- **Layout**: Top-to-bottom primary flow with branching paths for different room types
- **Color Scheme**:
  - Purple for seed/RNG/deterministic systems
  - Orange for dungeon structure
  - Red for combat
  - Gold for treasure/loot
  - Green for rest/safe zones
  - Dark red for bosses
  - Gray for empty rooms
- **Shapes**:
  - Cylinders for data/storage (seeds, state)
  - Rounded rectangles for processes
  - Diamonds for decisions
  - Hexagons for rooms
  - Circles for start/end
  - Parallelograms for AI decisions

## Content Breakdown

### Initialization Phase (Top)

1. **Start Node** (Circle, Orange)
   - Label: "Start Dungeon Run"
   - Arrow pointing down

2. **Generate Seed** (Cylinder, Purple)
   - Label: "Generate Deterministic Seed"
   - Sub-text: "Party composition + Timestamp + Dungeon ID + Random component"
   - Formula: "seed = hash(partyHash, timestamp, dungeonId, random)"
   - Visual: Random number generator icon
   - Arrow pointing down

3. **Initialize RNG** (Rounded Rectangle, Purple)
   - Label: "Initialize Seeded RNG"
   - Sub-text: "Same seed = same results (deterministic)"
   - Arrow pointing down

4. **Generate Dungeon Structure** (Rounded Rectangle, Orange)
   - Label: "Generate Dungeon Map"
   - Sub-text: "Up to 100 levels, multiple rooms per level"
   - Visual: Grid/map icon
   - Arrow pointing down

5. **Set Objectives** (Rounded Rectangle, Orange)
   - Label: "Set Dungeon Objectives"
   - Sub-text: "Defeat all monsters / Reach room / Collect items / Defeat boss"
   - Arrow pointing down

6. **Place Party** (Rounded Rectangle, Green)
   - Label: "Place Party at Entrance"
   - Sub-text: "All heroes start at dungeon entrance"
   - Arrow pointing down

### Main Loop: Room Exploration (Center - Large Section)

7. **Current Room** (Hexagon, Orange)
   - Label: "Current Room"
   - Visual: Room icon with door
   - Arrow pointing down

8. **AI Agent Decision** (Parallelogram, Purple)
   - Label: "AI Agent Makes Decision"
   - Sub-text: "ElizaOS agent with personality & memory"
   - Visual: Brain/AI icon
   - Multiple arrows branching to:
      - "Move to Next Room"
      - "Explore Current Room"
      - "Interact with Object"
      - "Use Item"
   - All converge to room type check

9. **Determine Room Type** (Diamond, Orange)
   - Label: "Room Type?"
   - Five branches (color-coded):
      - "Combat" (Red) → Combat Flow
      - "Treasure" (Gold) → Treasure Flow
      - "Rest" (Green) → Rest Flow
      - "Boss" (Dark Red) → Boss Flow
      - "Empty" (Gray) → Empty Flow

### Combat Room Flow (Red Branch)

10. **Combat Encounter** (Rounded Rectangle, Red)
    - Label: "Combat Encounter"
    - Sub-text: "Monsters spawn based on seed"
    - Visual: Sword icon
    - Arrow pointing down

11. **Roll Initiative** (Rounded Rectangle, Red)
    - Label: "Roll Initiative for All"
    - Sub-text: "d20 + DEX modifier"
    - Formula: "initiative = d20(seed) + DEX"
    - Arrow pointing down

12. **Determine Turn Order** (Rounded Rectangle, Red)
    - Label: "Sort by Initiative"
    - Sub-text: "Higher initiative acts first"
    - Arrow pointing down

13. **Combat Turn Loop** (Diamond, Red)
    - Label: "Combat Active?"
    - If "Yes":
       - "Current Actor's Turn" (Rounded Rectangle, Red)
       - "AI Chooses Action" (Parallelogram, Purple)
       - "Resolve Action" (Rounded Rectangle, Red)
         - "Attack" → "Roll to Hit (d20 + modifier vs AC)" → "Roll Damage" → "Apply Damage"
         - "Defend" → "Gain AC Bonus"
         - "Use Item" → "Apply Item Effect"
         - "Skill Check" → "Roll d20 + attribute vs DC"
       - "Check HP" (Diamond, Red)
         - "HP > 0?" → Continue
         - "HP ≤ 0?" → "Defeated" → Check if all defeated
    - If "No" (all enemies defeated):
       - "Victory" → "Drop Loot" → Continue to Loot Distribution

### Treasure Room Flow (Gold Branch)

14. **Treasure Room** (Rounded Rectangle, Gold)
    - Label: "Treasure Room"
    - Visual: Chest icon
    - Arrow pointing down

15. **Generate Loot** (Rounded Rectangle, Gold)
    - Label: "Generate Loot Items"
    - Sub-text: "Procedurally generated based on seed"
    - Sub-text: "Rarity: Common, Uncommon, Rare, Epic, Legendary"
    - Arrow pointing down

16. **Loot Distribution** (Rounded Rectangle, Gold)
    - Label: "Distribute Loot to Party"
    - Sub-text: "ERC-1155 items"
    - Arrow pointing to "Check Objectives"

### Rest Room Flow (Green Branch)

17. **Rest Room** (Rounded Rectangle, Green)
    - Label: "Rest Room (Safe Zone)"
    - Visual: Bed/campfire icon
    - Arrow pointing down

18. **Restore HP** (Rounded Rectangle, Green)
    - Label: "Restore Party HP"
    - Sub-text: "Full heal or partial restore"
    - Arrow pointing to "Check Objectives"

### Boss Room Flow (Dark Red Branch)

19. **Boss Encounter** (Rounded Rectangle, Dark Red)
    - Label: "Boss Room"
    - Visual: Large monster icon
    - Arrow pointing down

20. **Boss Combat** (Rounded Rectangle, Dark Red)
    - Label: "Boss Combat"
    - Sub-text: "Enhanced stats, special abilities"
    - Arrow pointing to Combat Flow (reuse combat mechanics)

21. **Boss Defeat** (Rounded Rectangle, Gold)
    - Label: "Boss Defeated"
    - Sub-text: "Guaranteed rare/legendary loot"
    - Arrow pointing to "Loot Distribution"

### Empty Room Flow (Gray Branch)

22. **Empty Room** (Rounded Rectangle, Gray)
    - Label: "Empty Room"
    - Sub-text: "No encounters, continue exploration"
    - Arrow pointing to "Check Objectives"

### Objective Checking (Convergence Point)

23. **Check Objectives** (Diamond, Orange)
    - Label: "Objectives Complete?"
    - Two branches:
       - "No" → "Move to Next Room" (Rounded Rectangle, Orange) → back to "Current Room"
       - "Yes" → continue down

### Completion Phase (Bottom)

24. **Calculate Final Rewards** (Rounded Rectangle, Gold)
    - Label: "Calculate Final Rewards"
    - Sub-text: "Loot + KEEP tokens + Experience"
    - Arrow pointing down

25. **Distribute Rewards** (Rounded Rectangle, Gold)
    - Label: "Distribute to Party Members"
    - Sub-text: "Items to hero TBAs, KEEP to owners"
    - Arrow pointing down

26. **Update Hero State** (Cylinder, Blue)
    - Label: "Update Heroes on Blockchain"
    - Sub-text: "New equipment, memories, experience"
    - Arrow pointing down

27. **Store Run Data** (Cylinder, Blue)
    - Label: "Store Complete Event Log"
    - Sub-text: "All actions, decisions, outcomes (reproducible)"
    - Arrow pointing down

28. **End Node** (Circle, Green)
    - Label: "Run Complete"
    - Sub-text: "Victory / Defeat / Timeout / Abandoned"

### Alternative Endings (Side Paths)

29. **Party Wiped** (Diamond, Red)
    - Label: "All Heroes Defeated?"
    - If "Yes": "Defeat" → "End Node (Defeat)"

30. **Timeout** (Diamond, Orange)
    - Label: "Time Limit Exceeded?"
    - If "Yes": "Timeout" → "End Node (Timeout)"

31. **Abandon** (Rounded Rectangle, Gray)
    - Label: "Party Abandons Run"
    - Arrow to "End Node (Abandoned)"

## Additional Visual Elements
- **Seed Visualization**: Random number generator with seed input
- **Room Icons**: Different icons for each room type
- **Combat Icons**: Sword, shield, health bar
- **Loot Icons**: Chest, items with rarity colors
- **AI Agent Icons**: Brain/neural network symbol
- **Deterministic Indicator**: Lock icon with "Deterministic" label
- **Flow Numbers**: Optional step numbers for clarity
- **Time Indicators**: Clock icon for timeout checks

## Technical Details to Emphasize
- All randomness is seeded (deterministic)
- Same seed produces identical results
- AI agents make autonomous decisions based on personality
- Combat is turn-based with initiative system
- Loot is procedurally generated but deterministic
- All results are stored and reproducible
- Heroes can be defeated (HP reaches 0)
- Multiple victory/defeat conditions

## Layout Instructions
- **Width**: 16:9 aspect ratio (1920x1080 recommended)
- **Flow Direction**: Primarily vertical with horizontal branches for room types
- **Main Path**: Central vertical flow (initialization → main loop → completion)
- **Branching**: Room type branches spread horizontally from main path
- **Combat Loop**: Nested loop visualization showing turn-based structure
- **Convergence**: All room types converge at objective check
- **Spacing**: Clear separation between phases
- **Grouping**: Use background colors or boxes to group:
   - Purple background: Seed/RNG section
   - Orange background: Dungeon structure
   - Red background: Combat section
   - Gold background: Rewards section

## Prompt Text for Image Generator
"Create a detailed technical flowchart showing a complete dungeon run process for a deterministic blockchain game. The diagram should flow top-to-bottom showing: (1) Seed generation and deterministic RNG initialization, (2) Dungeon map and objective generation, (3) Main exploration loop with AI agent decision-making, (4) Five room type branches (Combat with turn-based initiative system, Treasure with loot generation, Rest for healing, Boss with enhanced combat, Empty rooms), (5) Objective checking and completion with reward distribution. Color code: purple for deterministic/seed systems, orange for dungeon structure, red for combat, gold for treasure, green for rest, dark red for bosses. Show nested combat loop with initiative rolls, turn order, action resolution, and HP checks. Include AI agent decision points, procedural loot generation, and deterministic mechanics. Professional technical flowchart with clear branching paths, decision diamonds, and process rectangles. Emphasize the deterministic nature with seed visualization."
