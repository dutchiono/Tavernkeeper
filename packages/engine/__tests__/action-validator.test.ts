import { describe, it, expect } from 'vitest';
import { validateAction, isValidActionType } from '../src/action-validator';
import type { Action, Entity } from '@innkeeper/lib';

const createEntity = (id: string): Entity => ({
  id,
  name: `Entity ${id}`,
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
  },
});

describe('Action Validator', () => {
  const entities = new Map<string, Entity>([
    ['actor-1', createEntity('actor-1')],
    ['target-1', createEntity('target-1')],
  ]);

  describe('validateAction', () => {
    it('should reject action with invalid actorId', () => {
      const action: Action = {
        type: 'move',
        actorId: 'invalid-actor',
        target: { x: 0, y: 0 },
      };

      const result = validateAction(action, entities);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('actorId');
    });

    it('should validate move action', () => {
      const validAction: Action = {
        type: 'move',
        actorId: 'actor-1',
        target: { x: 5, y: 10 },
      };

      const invalidAction: Action = {
        type: 'move',
        actorId: 'actor-1',
        target: { x: NaN, y: 10 },
      } as Action;

      expect(validateAction(validAction, entities).valid).toBe(true);
      expect(validateAction(invalidAction, entities).valid).toBe(false);
    });

    it('should validate attack action', () => {
      const validAction: Action = {
        type: 'attack',
        actorId: 'actor-1',
        targetId: 'target-1',
      };

      const invalidAction: Action = {
        type: 'attack',
        actorId: 'actor-1',
        targetId: 'invalid-target',
      };

      expect(validateAction(validAction, entities).valid).toBe(true);
      expect(validateAction(invalidAction, entities).valid).toBe(false);
    });

    it('should validate skill_check action', () => {
      const validAction: Action = {
        type: 'skill_check',
        actorId: 'actor-1',
        skill: 'stealth',
        difficulty: 15,
      };

      const invalidAction: Action = {
        type: 'skill_check',
        actorId: 'actor-1',
        skill: 'stealth',
        difficulty: NaN,
      } as Action;

      expect(validateAction(validAction, entities).valid).toBe(true);
      expect(validateAction(invalidAction, entities).valid).toBe(false);
    });

    it('should validate use_item action', () => {
      const validAction: Action = {
        type: 'use_item',
        actorId: 'actor-1',
        itemId: 'item-123',
      };

      const invalidAction: Action = {
        type: 'use_item',
        actorId: 'actor-1',
      } as Action;

      expect(validateAction(validAction, entities).valid).toBe(true);
      expect(validateAction(invalidAction, entities).valid).toBe(false);
    });

    it('should validate interact action', () => {
      const validAction: Action = {
        type: 'interact',
        actorId: 'actor-1',
        targetId: 'target-1',
        interaction: 'inspect',
      };

      const invalidAction: Action = {
        type: 'interact',
        actorId: 'actor-1',
        targetId: 'invalid-target',
        interaction: 'inspect',
      };

      expect(validateAction(validAction, entities).valid).toBe(true);
      expect(validateAction(invalidAction, entities).valid).toBe(false);
    });
  });

  describe('isValidActionType', () => {
    it('should return true for valid action types', () => {
      expect(isValidActionType('move')).toBe(true);
      expect(isValidActionType('attack')).toBe(true);
      expect(isValidActionType('skill_check')).toBe(true);
      expect(isValidActionType('use_item')).toBe(true);
      expect(isValidActionType('interact')).toBe(true);
    });

    it('should return false for invalid action types', () => {
      expect(isValidActionType('invalid')).toBe(false);
      expect(isValidActionType('')).toBe(false);
      expect(isValidActionType('MOVE')).toBe(false);
    });
  });
});

