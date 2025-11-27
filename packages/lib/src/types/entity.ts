export interface Entity {
  id: string;
  name: string;
  stats: EntityStats;
  position?: Position;
  roomId?: string; // Current room the entity is in
  inventory?: Item[]; // Items the entity is carrying
  isPlayer?: boolean; // Whether this is a player-controlled entity
}

export interface EntityStats {
  str: number; // Strength
  dex: number; // Dexterity
  con: number; // Constitution
  int: number; // Intelligence
  wis: number; // Wisdom
  cha: number; // Charisma
  ac: number; // Armor Class
  hp: number; // Current Hit Points
  maxHp: number; // Maximum Hit Points
  attackBonus: number; // Base attack bonus
}

export interface Position {
  x: number;
  y: number;
  z?: number; // Optional for 3D maps
}

export interface Weapon {
  name: string;
  die: number; // Dice sides (e.g., 6 for d6)
  dieCount: number; // Number of dice (e.g., 2 for 2d6)
  type: 'melee' | 'ranged' | 'magic';
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'misc';
  properties?: Record<string, unknown>;
}

