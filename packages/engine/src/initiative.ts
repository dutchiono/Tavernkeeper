import type { Entity } from '@innkeeper/lib';
import type { RNG } from './rng';
import { d } from './rng';
import { getAbilityModifier } from '@innkeeper/lib';

export interface InitiativeEntry {
  entityId: string;
  initiative: number;
  dexMod: number;
}

/**
 * Roll initiative for all entities
 * Formula: d20 + DEX modifier
 */
export function rollInitiative(entities: Entity[], rng: RNG): InitiativeEntry[] {
  const entries: InitiativeEntry[] = entities.map((entity) => {
    const dexMod = getAbilityModifier(entity.stats.dex);
    const roll = d(20, rng);
    return {
      entityId: entity.id,
      initiative: roll + dexMod,
      dexMod,
    };
  });

  // Sort by initiative (highest first), then by DEX mod, then by ID for ties
  entries.sort((a, b) => {
    if (b.initiative !== a.initiative) {
      return b.initiative - a.initiative;
    }
    if (b.dexMod !== a.dexMod) {
      return b.dexMod - a.dexMod;
    }
    return a.entityId.localeCompare(b.entityId);
  });

  return entries;
}

