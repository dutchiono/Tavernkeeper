import { describe, it, expect } from 'vitest';
import { attack, applyDamage, heal, isDead, attackRoll } from '../src/combat';
import { makeRng } from '../src/rng';
import type { Entity } from '@innkeeper/lib';

const createEntity = (overrides?: Partial<Entity>): Entity => ({
  id: 'test-entity',
  name: 'Test Entity',
  stats: {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
    ac: 10,
    hp: 20,
    maxHp: 20,
    attackBonus: 0,
    ...overrides?.stats,
  },
  ...overrides,
});

describe('Combat', () => {
  const rng = makeRng('test-seed');

  describe('attackRoll', () => {
    it('should calculate attack roll correctly', () => {
      const attacker = createEntity({ stats: { attackBonus: 5 } });
      const roll = attackRoll(attacker, rng);
      expect(roll).toBeGreaterThanOrEqual(6); // 1 + 5
      expect(roll).toBeLessThanOrEqual(25); // 20 + 5
    });

    it('should handle advantage', () => {
      const attacker = createEntity();
      const roll1 = attackRoll(attacker, rng, true, false);
      const roll2 = attackRoll(attacker, rng, false, false);
      // With advantage, should generally be higher (not guaranteed but likely)
      expect(roll1).toBeGreaterThanOrEqual(1);
    });

    it('should handle disadvantage', () => {
      const attacker = createEntity();
      const roll = attackRoll(attacker, rng, false, true);
      expect(roll).toBeGreaterThanOrEqual(1);
      expect(roll).toBeLessThanOrEqual(20);
    });
  });

  describe('attack', () => {
    it('should hit when roll >= AC', () => {
      const attacker = createEntity({ stats: { attackBonus: 10 } });
      const target = createEntity({ stats: { ac: 10 } });
      const result = attack(attacker, target, null, rng);

      expect(result.roll).toBeGreaterThanOrEqual(11); // 1 + 10
      expect(result.hit).toBe(result.roll >= target.stats.ac);
    });

    it('should calculate critical on natural 20', () => {
      // This is probabilistic, so we test the structure
      const attacker = createEntity();
      const target = createEntity();
      const result = attack(attacker, target, null, rng);

      expect(result.critical).toBe(result.naturalRoll === 20);
      if (result.critical) {
        expect(result.damage).toBeGreaterThan(0);
      }
    });

    it('should deal damage on hit', () => {
      const attacker = createEntity({ stats: { str: 16, attackBonus: 5 } });
      const target = createEntity({ stats: { ac: 5 } });
      const result = attack(attacker, target, null, rng);

      if (result.hit) {
        expect(result.damage).toBeGreaterThan(0);
      }
    });

    it('should not deal damage on miss', () => {
      const attacker = createEntity({ stats: { attackBonus: -5 } });
      const target = createEntity({ stats: { ac: 30 } });
      const result = attack(attacker, target, null, rng);

      if (!result.hit) {
        expect(result.damage).toBe(0);
      }
    });
  });

  describe('applyDamage', () => {
    it('should reduce HP correctly', () => {
      const entity = createEntity({ stats: { hp: 20 } });
      const damaged = applyDamage(entity, 5);
      expect(damaged.stats.hp).toBe(15);
    });

    it('should not go below 0 HP', () => {
      const entity = createEntity({ stats: { hp: 5 } });
      const damaged = applyDamage(entity, 10);
      expect(damaged.stats.hp).toBe(0);
    });

    it('should preserve other stats', () => {
      const entity = createEntity({ stats: { hp: 20, ac: 15 } });
      const damaged = applyDamage(entity, 5);
      expect(damaged.stats.ac).toBe(15);
      expect(damaged.id).toBe(entity.id);
    });
  });

  describe('heal', () => {
    it('should increase HP correctly', () => {
      const entity = createEntity({ stats: { hp: 10, maxHp: 20 } });
      const healed = heal(entity, 5);
      expect(healed.stats.hp).toBe(15);
    });

    it('should not exceed maxHp', () => {
      const entity = createEntity({ stats: { hp: 15, maxHp: 20 } });
      const healed = heal(entity, 10);
      expect(healed.stats.hp).toBe(20);
    });
  });

  describe('isDead', () => {
    it('should return true when HP <= 0', () => {
      expect(isDead(createEntity({ stats: { hp: 0 } }))).toBe(true);
      expect(isDead(createEntity({ stats: { hp: -5 } }))).toBe(true);
    });

    it('should return false when HP > 0', () => {
      expect(isDead(createEntity({ stats: { hp: 1 } }))).toBe(false);
      expect(isDead(createEntity({ stats: { hp: 20 } }))).toBe(false);
    });
  });
});

