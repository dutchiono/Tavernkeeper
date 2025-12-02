import type { Entity, EntityStats, Weapon } from '@innkeeper/lib';
import type { RNG } from './rng';
import { d, rollDice } from './rng';
import { getAbilityModifier } from '@innkeeper/lib';

export interface AttackResult {
  hit: boolean;
  roll: number;
  damage: number;
  critical: boolean;
  naturalRoll: number;
}

/**
 * Calculate attack roll: d20 + attack bonus
 */
export function attackRoll(
  attacker: Entity,
  rng: RNG,
  advantage = false,
  disadvantage = false
): number {
  let roll: number;

  if (advantage && !disadvantage) {
    roll = Math.max(d(20, rng), d(20, rng));
  } else if (disadvantage && !advantage) {
    roll = Math.min(d(20, rng), d(20, rng));
  } else {
    roll = d(20, rng);
  }

  return roll + attacker.stats.attackBonus;
}

/**
 * Perform an attack action
 */
export function attack(
  attacker: Entity,
  target: Entity,
  weapon: Weapon | null,
  rng: RNG,
  advantage = false,
  disadvantage = false
): AttackResult {
  const naturalRoll = advantage || disadvantage
    ? (advantage ? Math.max(d(20, rng), d(20, rng)) : Math.min(d(20, rng), d(20, rng)))
    : d(20, rng);

  const roll = naturalRoll + attacker.stats.attackBonus;
  const hit = roll >= target.stats.ac;
  const critical = naturalRoll === 20;

  let damage = 0;
  if (hit) {
    if (weapon) {
      const baseDamage = rollDice(weapon.dieCount, weapon.die, rng);
      const modifier = weapon.type === 'melee'
        ? getAbilityModifier(attacker.stats.str)
        : getAbilityModifier(attacker.stats.dex);

      if (critical) {
        // Critical: double the dice, add modifier once
        damage = rollDice(weapon.dieCount * 2, weapon.die, rng) + modifier;
      } else {
        damage = baseDamage + modifier;
      }
    } else {
      // Unarmed strike: 1 + STR modifier
      const modifier = getAbilityModifier(attacker.stats.str);
      damage = critical ? 2 + modifier : 1 + modifier;
    }
  }

  return {
    hit,
    roll,
    damage,
    critical,
    naturalRoll,
  };
}

/**
 * Apply damage to an entity
 */
export function applyDamage(entity: Entity, damage: number): Entity {
  const newHp = Math.max(0, entity.stats.hp - damage);
  return {
    ...entity,
    stats: {
      ...entity.stats,
      hp: newHp,
    },
  };
}

/**
 * Heal an entity
 */
export function heal(entity: Entity, amount: number): Entity {
  const newHp = Math.min(entity.stats.maxHp, entity.stats.hp + amount);
  return {
    ...entity,
    stats: {
      ...entity.stats,
      hp: newHp,
    },
  };
}

/**
 * Check if entity is dead
 */
export function isDead(entity: Entity): boolean {
  return entity.stats.hp <= 0;
}

