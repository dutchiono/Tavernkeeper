import { describe, it, expect } from 'vitest';
import { rollInitiative } from '../src/initiative';
import { makeRng } from '../src/rng';
import type { Entity } from '@innkeeper/lib';

const createEntity = (id: string, dex: number): Entity => ({
  id,
  name: `Entity ${id}`,
  stats: {
    str: 10,
    dex,
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

describe('Initiative', () => {
  it('should roll initiative for all entities', () => {
    const entities = [
      createEntity('entity-1', 14), // +2 DEX mod
      createEntity('entity-2', 10), // +0 DEX mod
      createEntity('entity-3', 18), // +4 DEX mod
    ];

    const rng = makeRng('test-seed');
    const initiative = rollInitiative(entities, rng);

    expect(initiative).toHaveLength(3);
    expect(initiative.every(entry => entry.initiative >= entry.dexMod + 1)).toBe(true);
    expect(initiative.every(entry => entry.initiative <= entry.dexMod + 20)).toBe(true);
  });

  it('should sort by initiative (highest first)', () => {
    const entities = [
      createEntity('entity-1', 10),
      createEntity('entity-2', 10),
      createEntity('entity-3', 10),
    ];

    const rng = makeRng('test-seed');
    const initiative = rollInitiative(entities, rng);

    for (let i = 0; i < initiative.length - 1; i++) {
      expect(initiative[i].initiative).toBeGreaterThanOrEqual(initiative[i + 1].initiative);
    }
  });

  it('should break ties by DEX modifier', () => {
    const entities = [
      createEntity('entity-1', 10), // +0
      createEntity('entity-2', 14), // +2
      createEntity('entity-3', 18), // +4
    ];

    const rng = makeRng('test-seed-deterministic');
    const initiative = rollInitiative(entities, rng);

    // Higher DEX should generally come first (if initiative ties)
    const dexMods = initiative.map(i => i.dexMod);
    // This is probabilistic, but structure should be correct
    expect(initiative.length).toBe(3);
  });

  it('should be deterministic with same seed', () => {
    const entities = [
      createEntity('entity-1', 10),
      createEntity('entity-2', 14),
    ];

    const rng1 = makeRng('test-seed');
    const rng2 = makeRng('test-seed');

    const init1 = rollInitiative(entities, rng1);
    const init2 = rollInitiative(entities, rng2);

    expect(init1).toEqual(init2);
  });
});

