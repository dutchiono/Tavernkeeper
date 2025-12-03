# Image Generation Prompt: Party Formation & Combat System

## Purpose
Generate a detailed flowchart and diagram showing party formation mechanics, hero roles, and the complete turn-based combat system with initiative, actions, and damage calculation.

## Style Specifications
- **Visual Style**: Game mechanics flowchart with combat visualization
- **Layout**: Two main sections - Party Formation (left) and Combat System (right), with connecting flow
- **Color Scheme**:
  - Green for party formation
  - Blue for hero roles
  - Red for combat mechanics
  - Orange for initiative/turns
  - Purple for AI decisions
  - Gold for damage/rewards
- **Shapes**:
  - Hexagons for heroes/NFTs
  - Rounded rectangles for processes
  - Diamonds for decisions
  - Circles for start/end
  - Parallelograms for AI/agent actions
  - Rectangles for combat stats

## Content Breakdown

### Section 1: Party Formation (Left Side)

#### Party Creation
1. **Start: Create Party** (Circle, Green)
   - Label: "Create Party"
   - Arrow pointing down

2. **Select Heroes** (Rounded Rectangle, Green)
   - Label: "Select Heroes (1-5)"
   - Sub-text: "Your heroes or invite others"
   - Visual: Multiple hero icons
   - Arrow pointing down

3. **Party Size Check** (Diamond, Green)
   - Label: "Party Size < 5?"
   - Two branches:
     - "Yes" → "Invite Players" path
     - "No" → "Party Ready" path

#### Invite System
4. **Generate Invite Code** (Rounded Rectangle, Green)
   - Label: "Generate Invite Code"
   - Sub-text: "Unique code, expiration, usage limits"
   - Arrow pointing down

5. **Share Invite** (Rounded Rectangle, Green)
   - Label: "Share Invite Code"
   - Arrow pointing down

6. **Player Joins** (Rounded Rectangle, Green)
   - Label: "Player Joins with Hero"
   - Sub-text: "One-time use per person"
   - Arrow pointing back to "Party Size Check"

#### Party Ready
7. **Party Ready** (Rounded Rectangle, Green)
   - Label: "Party Ready (1-5 heroes)"
   - Visual: Party formation icon
   - Arrow pointing right to Combat Section

### Section 2: Hero Roles & Composition (Center-Top)

8. **Hero Role Assignment** (Multiple Hexagons, Blue)
   - **Tank** (Hexagon, Blue)
     - Label: "Tank"
     - Sub-text: "High CON, absorbs damage"
     - Stats: "High HP, High AC"
     - Icon: Shield

   - **DPS** (Hexagon, Blue)
     - Label: "DPS (Damage Dealer)"
     - Sub-text: "High STR/INT, deals damage"
     - Stats: "High Attack, High Damage"
     - Icon: Sword

   - **Support** (Hexagon, Blue)
     - Label: "Support"
     - Sub-text: "High WIS/CHA, heals/buffs"
     - Stats: "Healing, Buffs, Utility"
     - Icon: Staff/Cross

   - **Utility** (Hexagon, Blue)
     - Label: "Utility"
     - Sub-text: "High DEX, exploration/traps"
     - Stats: "High Initiative, Skill Checks"
     - Icon: Lockpick/Tool

9. **Party Composition Strategy** (Rounded Rectangle, Blue)
   - Label: "Balance Party Roles"
   - Sub-text: "Mix different types for effectiveness"
   - Visual: Balanced party icon
   - Arrow pointing down to Combat

### Section 3: Combat System (Right Side - Large Section)

#### Combat Initialization
10. **Combat Start** (Circle, Red)
    - Label: "Combat Encounter"
    - Visual: Sword clash icon
    - Arrow pointing down

11. **Identify Participants** (Rounded Rectangle, Red)
    - Label: "All Heroes + Monsters"
    - Visual: Party vs monsters icon
    - Arrow pointing down

#### Initiative System
12. **Roll Initiative** (Rounded Rectangle, Orange)
    - Label: "Roll Initiative for All"
    - Sub-text: "d20 + DEX modifier"
    - Formula: "initiative = d20(seed) + DEX modifier"
    - Visual: Dice icon
    - Arrow pointing down

13. **Calculate Initiative Values** (Rounded Rectangle, Orange)
    - Label: "Calculate Initiative"
    - Example: "Hero 1: d20(15) + DEX(3) = 18"
    - Example: "Monster: d20(8) + DEX(1) = 9"
    - Arrow pointing down

14. **Sort by Initiative** (Rounded Rectangle, Orange)
    - Label: "Sort Participants by Initiative"
    - Sub-text: "Higher initiative acts first"
    - Visual: Ordered list (18, 15, 12, 9, 7, 5)
    - Arrow pointing down

15. **Determine Turn Order** (Rounded Rectangle, Orange)
    - Label: "Turn Order Established"
    - Visual: Turn order queue
    - Arrow pointing down

#### Combat Turn Loop
16. **Turn Loop Start** (Diamond, Red)
    - Label: "Combat Active?"
    - Two branches:
      - "Yes" → continue to current turn
      - "No" → "Combat End" (see below)

17. **Current Actor's Turn** (Rounded Rectangle, Red)
    - Label: "Current Actor's Turn"
    - Sub-text: "Hero or Monster"
    - Visual: Turn indicator
    - Arrow pointing down

18. **AI Agent Decision** (Parallelogram, Purple)
    - Label: "AI Agent Chooses Action"
    - Sub-text: "Based on personality, situation, memory"
    - Visual: Brain/AI icon
    - Arrow pointing down to action types

#### Action Types (Branching)
19. **Action Selection** (Diamond, Red)
    - Label: "Action Type?"
    - Four branches:
      - "Attack" → Attack Flow
      - "Defend" → Defend Flow
      - "Use Item" → Item Flow
      - "Skill Check" → Skill Check Flow

#### Attack Flow
20. **Attack Action** (Rounded Rectangle, Red)
    - Label: "Attack Action"
    - Visual: Sword swing icon
    - Arrow pointing down

21. **Roll to Hit** (Rounded Rectangle, Red)
    - Label: "Roll to Hit"
    - Sub-text: "d20 + attack modifier vs. AC"
    - Formula: "attackRoll = d20(seed) + STR/DEX + weapon bonus"
    - Arrow pointing down

22. **Hit Check** (Diamond, Red)
    - Label: "Attack Roll ≥ AC?"
    - Two branches:
      - "Yes" → "Hit" → continue to damage
      - "No" → "Miss" → "Next Turn"

23. **Roll Damage** (Rounded Rectangle, Gold)
    - Label: "Roll Damage Dice"
    - Sub-text: "Weapon damage + modifiers"
    - Formula: "damage = weaponDice(seed) + STR/DEX modifier + bonuses"
    - Arrow pointing down

24. **Critical Hit Check** (Diamond, Gold)
    - Label: "Natural 20?"
    - Two branches:
      - "Yes" → "Critical Hit" → "Double Damage"
      - "No" → "Normal Damage"
    - Both converge to "Apply Damage"

25. **Apply Damage** (Rounded Rectangle, Red)
    - Label: "Apply Damage to Target"
    - Sub-text: "Reduce target HP"
    - Formula: "newHP = currentHP - damage"
    - Arrow pointing down

#### Defend Flow
26. **Defend Action** (Rounded Rectangle, Red)
    - Label: "Defend Action"
    - Visual: Shield icon
    - Arrow pointing down

27. **Gain AC Bonus** (Rounded Rectangle, Red)
    - Label: "Gain AC Bonus"
    - Sub-text: "Reduces incoming damage"
    - Arrow pointing to "Next Turn"

#### Use Item Flow
28. **Use Item Action** (Rounded Rectangle, Red)
    - Label: "Use Item"
    - Sub-text: "Consumable, potion, scroll"
    - Visual: Item icon
    - Arrow pointing down

29. **Apply Item Effect** (Rounded Rectangle, Green)
    - Label: "Apply Item Effect"
    - Sub-text: "Heal, buff, damage, etc."
    - Arrow pointing to "Next Turn"

#### Skill Check Flow
30. **Skill Check Action** (Rounded Rectangle, Red)
    - Label: "Skill Check"
    - Sub-text: "Lockpicking, perception, persuasion"
    - Visual: Skill icon
    - Arrow pointing down

31. **Roll Skill Check** (Rounded Rectangle, Red)
    - Label: "Roll d20 + Attribute Modifier"
    - Formula: "check = d20(seed) + attribute modifier"
    - Sub-text: "vs. Difficulty Class (DC)"
    - Arrow pointing down

32. **Success Check** (Diamond, Red)
    - Label: "Check ≥ DC?"
    - Two branches:
      - "Yes" → "Success" → "Apply Effect"
      - "No" → "Failure" → "No Effect"
    - Both converge to "Next Turn"

#### Turn Completion
33. **Next Turn** (Rounded Rectangle, Orange)
    - Label: "Next Actor's Turn"
    - Arrow pointing back to "Turn Loop Start"

#### Combat End Conditions
34. **Check Combat Status** (Diamond, Red)
    - Label: "All Enemies Defeated?"
    - Two branches:
      - "Yes" → "Victory"
      - "No" → "All Heroes Defeated?" → "Yes" → "Defeat" / "No" → back to turn loop

35. **Victory** (Rounded Rectangle, Green)
    - Label: "Combat Victory"
    - Sub-text: "Drop loot, gain rewards"
    - Visual: Victory icon

36. **Defeat** (Rounded Rectangle, Red)
    - Label: "Combat Defeat"
    - Sub-text: "Party wiped, run ends"
    - Visual: Defeat icon

### Section 4: Damage Calculation Details (Bottom - Gold Section)

37. **Damage Formula Breakdown** (Rectangle, Gold)
    - Label: "Damage Calculation"
    - Formula: "Total Damage = Base Damage + Attribute Modifier + Weapon Bonus + Equipment Bonus + Status Effects"
    - Breakdown:
      - "Base Damage: Weapon dice roll"
      - "STR Modifier: (STR - 10) / 2 (melee)"
      - "DEX Modifier: (DEX - 10) / 2 (ranged)"
      - "Weapon Bonus: +X from weapon"
      - "Equipment Bonus: +X from armor/accessories"
      - "Status Effects: Buffs/debuffs"

38. **AC Calculation** (Rectangle, Gold)
    - Label: "Armor Class (AC) Calculation"
    - Formula: "AC = 10 + DEX Modifier + Armor Bonus + Shield Bonus"
    - Breakdown:
      - "Base AC: 10"
      - "DEX Modifier: (DEX - 10) / 2"
      - "Armor Bonus: From equipped armor"
      - "Shield Bonus: From shield (if equipped)"

39. **HP Calculation** (Rectangle, Gold)
    - Label: "Hit Points (HP) Calculation"
    - Formula: "Max HP = Base HP + (CON Modifier × Level)"
    - Breakdown:
      - "Base HP: Class/level dependent"
      - "CON Modifier: (CON - 10) / 2"
      - "Level: Hero level"

### Section 5: Party Coordination (Annotations)

40. **Coordination Elements** (Text boxes, Blue)
    - "Focus Fire: Target same enemy"
    - "Protect Weaker Members: Tank draws aggro"
    - "Support Actions: Heal/buff party members"
    - "Strategy: Adapt to combat situation"

## Additional Visual Elements
- **Hero Icons**: Different icons for each role (shield, sword, staff, tool)
- **Combat Icons**:
  - Sword for attack
  - Shield for defend
  - Potion for items
  - Dice for rolls
  - Health bar for HP
- **Turn Order Visual**: Queue/list showing turn order
- **Damage Numbers**: Visual damage indicators
- **AC/HP Bars**: Stat visualization
- **AI Agent Icon**: Brain/neural network for agent decisions
- **Deterministic Indicator**: Lock icon showing seeded RNG

## Technical Details to Emphasize
- Combat is turn-based with initiative determining order
- All dice rolls use seeded RNG (deterministic)
- AI agents make autonomous decisions for heroes
- Damage calculation includes multiple modifiers
- AC determines hit chance
- HP reaches 0 = defeated
- Party coordination improves effectiveness
- Different hero roles serve different purposes

## Layout Instructions
- **Width**: 16:9 aspect ratio (1920x1080 recommended)
- **Layout**:
  - Left: Party formation (green)
  - Center-top: Hero roles (blue)
  - Right: Combat system (red/orange)
  - Bottom: Damage/stat calculations (gold)
- **Flow Direction**:
  - Party formation: Top to bottom
  - Combat: Top to bottom with looping turn structure
- **Combat Loop**: Clear nested loop visualization
- **Branching**: Action types branch horizontally from main flow
- **Convergence**: All action types converge at "Next Turn"
- **Spacing**: Clear separation between sections
- **Grouping**: Use background colors to group related elements

## Prompt Text for Image Generator
"Create a comprehensive game mechanics diagram showing party formation and combat system for a turn-based RPG. Left side: Party formation flow (create party, select 1-5 heroes, invite system, party ready). Center-top: Hero roles (Tank with high CON/HP, DPS with high STR/INT, Support with WIS/CHA, Utility with DEX). Right side: Detailed combat system with (1) Initiative rolling (d20 + DEX), (2) Turn order establishment, (3) Turn-based combat loop with AI agent decision-making, (4) Four action types (Attack with hit/damage rolls, Defend with AC bonus, Use Item, Skill Check), (5) Damage calculation with modifiers, (6) Victory/defeat conditions. Bottom: Stat calculation formulas (Damage, AC, HP). Color code: green for party, blue for roles, red for combat, orange for initiative, purple for AI, gold for damage. Show nested combat loop, branching action types, and deterministic seeded RNG. Include hero role icons, combat icons, turn order visualization, and party coordination elements. Professional game design diagram with clear flow and detailed mechanics."
