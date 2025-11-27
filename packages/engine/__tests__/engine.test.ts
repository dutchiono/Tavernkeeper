import { describe, it, expect } from 'vitest';
import { createEngineState, executeAction, simulateRun } from '../src/engine';
import { makeRng } from '../src/rng';
import type { Entity, Action } from '@innkeeper/lib';

const createEntity = (id: string, overrides?: Partial<Entity>): Entity => ({
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
    ...overrides?.stats,
  },
  ...overrides,
});

describe('Engine', () => {
  describe('createEngineState', () => {
    it('should create engine state with entities', () => {
      const entities = [
        createEntity('entity-1'),
        createEntity('entity-2'),
      ];

      const state = createEngineState({
        dungeonSeed: 'test-dungeon',
        runId: 'test-run',
        startTime: 1000,
        entities,
      });

      expect(state.entities.size).toBe(2);
      expect(state.turnOrder).toHaveLength(2);
      expect(state.currentTurn).toBe(0);
      expect(state.events).toHaveLength(0);
      expect(state.seed).toBeTruthy();
    });

    it('should generate deterministic seed', () => {
      const entities = [createEntity('entity-1')];
      const config = {
        dungeonSeed: 'test-dungeon',
        runId: 'test-run',
        startTime: 1000,
        entities,
      };

      const state1 = createEngineState(config);
      const state2 = createEngineState(config);

      expect(state1.seed).toBe(state2.seed);
    });

    it('should roll initiative for all entities', () => {
      const entities = [
        createEntity('entity-1', { stats: { dex: 14 } }),
        createEntity('entity-2', { stats: { dex: 10 } }),
      ];

      const state = createEngineState({
        dungeonSeed: 'test',
        runId: 'test',
        startTime: 1000,
        entities,
      });

      expect(state.turnOrder).toContain('entity-1');
      expect(state.turnOrder).toContain('entity-2');
    });
  });

  describe('executeAction', () => {
    it('should execute move action', () => {
      const entities = [createEntity('entity-1')];
      const state = createEngineState({
        dungeonSeed: 'test',
        runId: 'test',
        startTime: 1000,
        entities,
      });

      const action: Action = {
        type: 'move',
        actorId: 'entity-1',
        target: { x: 5, y: 10 },
      };

      const events = executeAction(state, action);

      expect(events.length).toBeGreaterThan(0);
      expect(events[0].type).toBe('exploration');
      expect(state.entities.get('entity-1')?.position).toEqual({ x: 5, y: 10 });
    });

    it('should execute attack action', () => {
      const entities = [
        createEntity('attacker', { stats: { attackBonus: 5 } }),
        createEntity('target', { stats: { ac: 10, hp: 20 } }),
      ];

      const state = createEngineState({
        dungeonSeed: 'test',
        runId: 'test',
        startTime: 1000,
        entities,
      });

      const action: Action = {
        type: 'attack',
        actorId: 'attacker',
        targetId: 'target',
      };

      const events = executeAction(state, action);

      expect(events.length).toBeGreaterThan(0);
      const combatEvent = events.find(e => e.type === 'combat');
      expect(combatEvent).toBeTruthy();
    });

    it('should reject invalid actions', () => {
      const entities = [createEntity('entity-1')];
      const state = createEngineState({
        dungeonSeed: 'test',
        runId: 'test',
        startTime: 1000,
        entities,
      });

      const invalidAction: Action = {
        type: 'attack',
        actorId: 'entity-1',
        targetId: 'invalid-target',
      };

      const events = executeAction(state, invalidAction);

      expect(events.length).toBeGreaterThan(0);
      expect(events[0].type).toBe('system');
    });
  });

  describe('simulateRun', () => {
    it('should simulate a run and return result', async () => {
      const entities = [
        createEntity('entity-1', { isPlayer: true }),
        createEntity('entity-2', { isPlayer: true }),
      ];

      const result = await simulateRun({
        dungeonSeed: 'test-dungeon',
        runId: 'test-run',
        startTime: 1000,
        entities,
        maxTurns: 10,
      });

      expect(result.events).toBeDefined();
      expect(result.turns).toBeDefined();
      expect(result.result).toBeDefined();
      expect(['victory', 'defeat', 'timeout', 'abandoned']).toContain(result.result);
    });

    it('should respect maxTurns limit', async () => {
      const entities = [createEntity('entity-1', { isPlayer: true })];
      const result = await simulateRun({
        dungeonSeed: 'test',
        runId: 'test',
        startTime: 1000,
        entities,
        maxTurns: 5,
      });

      expect(result.turns.length).toBeLessThanOrEqual(5);
    });

    it('should be deterministic with same inputs', async () => {
      const entities = [createEntity('entity-1', { isPlayer: true })];
      const config = {
        dungeonSeed: 'test',
        runId: 'test',
        startTime: 1000,
        entities,
        maxTurns: 10,
      };

      const result1 = await simulateRun(config);
      const result2 = await simulateRun(config);

      expect(result1.events.length).toBe(result2.events.length);
      expect(result1.result).toBe(result2.result);
    });

    it('should load map when mapId is provided', async () => {
      const entities = [
        createEntity('player-1', { isPlayer: true }),
      ];

      const result = await simulateRun({
        dungeonSeed: 'test',
        runId: 'test',
        startTime: 1000,
        entities,
        mapId: 'abandoned-cellar',
        maxTurns: 5,
      });

      expect(result.finalState.dungeonState).toBeDefined();
      if (result.finalState.dungeonState) {
        expect(result.finalState.dungeonState.map).toBeDefined();
        expect(result.finalState.dungeonState.map.id).toBe('abandoned-cellar');
        expect(result.finalState.dungeonState.map.rooms.length).toBeGreaterThan(0);
      }
    });

    it('should initialize entities from map', async () => {
      const entities = [
        createEntity('player-1', { isPlayer: true }),
      ];

      const result = await simulateRun({
        dungeonSeed: 'test',
        runId: 'test',
        startTime: 1000,
        entities,
        mapId: 'abandoned-cellar',
        maxTurns: 5,
      });

      // Should have player entities plus map enemies
      const allEntities = Array.from(result.finalState.entities.values());
      expect(allEntities.length).toBeGreaterThan(1); // Player + at least one enemy

      // Player should have roomId and position
      const player = allEntities.find(e => e.isPlayer);
      expect(player?.roomId).toBeDefined();
      expect(player?.position).toBeDefined();
    });
  });
});

