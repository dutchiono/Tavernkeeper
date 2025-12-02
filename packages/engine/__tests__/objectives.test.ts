import { describe, it, expect } from 'vitest';
import {
  checkObjective,
  checkAllObjectives,
  areAllObjectivesComplete,
  isPartyWiped,
} from '../src/objectives';
import type { DungeonObjective, Entity, GameEvent, CombatEvent } from '@innkeeper/lib';
import { createEntity } from './engine.test';

describe('Objectives', () => {
  describe('checkObjective', () => {
    it('should detect boss defeat', () => {
      const objective: DungeonObjective = {
        type: 'defeat_boss',
        target: 'boss-1',
      };

      const entities = new Map<string, Entity>();
      entities.set('boss-1', createEntity('boss-1', { stats: { hp: 0 } })); // Dead

      const events: GameEvent[] = [];

      expect(checkObjective(objective, entities, events)).toBe(true);
    });

    it('should detect boss alive', () => {
      const objective: DungeonObjective = {
        type: 'defeat_boss',
        target: 'boss-1',
      };

      const entities = new Map<string, Entity>();
      entities.set('boss-1', createEntity('boss-1', { stats: { hp: 50 } })); // Alive

      const events: GameEvent[] = [];

      expect(checkObjective(objective, entities, events)).toBe(false);
    });

    it('should detect boss death from events', () => {
      const objective: DungeonObjective = {
        type: 'defeat_boss',
        target: 'boss-1',
      };

      const entities = new Map<string, Entity>();
      // Boss not in entities (was removed after death)

      const events: GameEvent[] = [
        {
          type: 'combat',
          id: 'death-1',
          timestamp: Date.now(),
          actorId: 'boss-1',
          action: 'death',
        } as CombatEvent,
      ];

      expect(checkObjective(objective, entities, events)).toBe(true);
    });

    it('should detect item retrieval', () => {
      const objective: DungeonObjective = {
        type: 'retrieve_item',
        target: 'treasure-1',
      };

      const entities = new Map<string, Entity>();
      entities.set('player-1', createEntity('player-1', {
        isPlayer: true,
        inventory: [{ id: 'treasure-1', name: 'Treasure', type: 'misc' }],
      }));

      const events: GameEvent[] = [];

      expect(checkObjective(objective, entities, events)).toBe(true);
    });

    it('should not detect item if not in inventory', () => {
      const objective: DungeonObjective = {
        type: 'retrieve_item',
        target: 'treasure-1',
      };

      const entities = new Map<string, Entity>();
      entities.set('player-1', createEntity('player-1', {
        isPlayer: true,
        inventory: [],
      }));

      const events: GameEvent[] = [];

      expect(checkObjective(objective, entities, events)).toBe(false);
    });
  });

  describe('checkAllObjectives', () => {
    it('should check all objectives', () => {
      const objectives: DungeonObjective[] = [
        { type: 'defeat_boss', target: 'boss-1' },
        { type: 'retrieve_item', target: 'treasure-1' },
      ];

      const entities = new Map<string, Entity>();
      entities.set('boss-1', createEntity('boss-1', { stats: { hp: 0 } }));
      entities.set('player-1', createEntity('player-1', {
        isPlayer: true,
        inventory: [{ id: 'treasure-1', name: 'Treasure', type: 'misc' }],
      }));

      const events: GameEvent[] = [];

      const statuses = checkAllObjectives(objectives, entities, events);
      expect(statuses.length).toBe(2);
      expect(statuses[0].completed).toBe(true);
      expect(statuses[1].completed).toBe(true);
    });
  });

  describe('areAllObjectivesComplete', () => {
    it('should return true when all objectives complete', () => {
      const objectives: DungeonObjective[] = [
        { type: 'defeat_boss', target: 'boss-1' },
      ];

      const entities = new Map<string, Entity>();
      entities.set('boss-1', createEntity('boss-1', { stats: { hp: 0 } }));

      const events: GameEvent[] = [];

      expect(areAllObjectivesComplete(objectives, entities, events)).toBe(true);
    });

    it('should return false when objectives incomplete', () => {
      const objectives: DungeonObjective[] = [
        { type: 'defeat_boss', target: 'boss-1' },
      ];

      const entities = new Map<string, Entity>();
      entities.set('boss-1', createEntity('boss-1', { stats: { hp: 50 } }));

      const events: GameEvent[] = [];

      expect(areAllObjectivesComplete(objectives, entities, events)).toBe(false);
    });
  });

  describe('isPartyWiped', () => {
    it('should return true when all players are dead', () => {
      const entities = new Map<string, Entity>();
      entities.set('player-1', createEntity('player-1', { isPlayer: true, stats: { hp: 0 } }));
      entities.set('player-2', createEntity('player-2', { isPlayer: true, stats: { hp: 0 } }));

      expect(isPartyWiped(entities)).toBe(true);
    });

    it('should return false when at least one player is alive', () => {
      const entities = new Map<string, Entity>();
      entities.set('player-1', createEntity('player-1', { isPlayer: true, stats: { hp: 0 } }));
      entities.set('player-2', createEntity('player-2', { isPlayer: true, stats: { hp: 20 } }));

      expect(isPartyWiped(entities)).toBe(false);
    });

    it('should return false when no players exist', () => {
      const entities = new Map<string, Entity>();
      entities.set('monster-1', createEntity('monster-1', { isPlayer: false }));

      expect(isPartyWiped(entities)).toBe(false);
    });
  });
});

