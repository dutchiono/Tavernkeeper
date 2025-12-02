import { describe, it, expect } from 'vitest';
import { generateSeed, makeRng, d, rollDice, rollWithAdvantage, rollWithDisadvantage } from '../src/rng';

describe('RNG', () => {
  describe('generateSeed', () => {
    it('should generate deterministic seeds', () => {
      const seed1 = generateSeed('dungeon-1', 'run-1', '1000');
      const seed2 = generateSeed('dungeon-1', 'run-1', '1000');
      const seed3 = generateSeed('dungeon-1', 'run-2', '1000');

      expect(seed1).toBe(seed2); // Same inputs = same seed
      expect(seed1).not.toBe(seed3); // Different runId = different seed
    });

    it('should generate different seeds for different inputs', () => {
      const seed1 = generateSeed('dungeon-1', 'run-1', '1000');
      const seed2 = generateSeed('dungeon-2', 'run-1', '1000');
      const seed3 = generateSeed('dungeon-1', 'run-1', '2000');

      expect(seed1).not.toBe(seed2);
      expect(seed1).not.toBe(seed3);
    });
  });

  describe('makeRng', () => {
    it('should create RNG function', () => {
      const rng = makeRng('test-seed');
      expect(typeof rng).toBe('function');
      expect(typeof rng()).toBe('number');
    });

    it('should produce deterministic results with same seed', () => {
      const rng1 = makeRng('test-seed');
      const rng2 = makeRng('test-seed');

      const results1 = Array.from({ length: 10 }, () => rng1());
      const results2 = Array.from({ length: 10 }, () => rng2());

      expect(results1).toEqual(results2);
    });
  });

  describe('d', () => {
    it('should roll within valid range', () => {
      const rng = makeRng('test-seed');
      for (let i = 0; i < 100; i++) {
        const roll = d(20, rng);
        expect(roll).toBeGreaterThanOrEqual(1);
        expect(roll).toBeLessThanOrEqual(20);
      }
    });

    it('should roll different values', () => {
      const rng = makeRng('test-seed');
      const rolls = Array.from({ length: 100 }, () => d(20, rng));
      const uniqueRolls = new Set(rolls);
      expect(uniqueRolls.size).toBeGreaterThan(1);
    });
  });

  describe('rollDice', () => {
    it('should roll multiple dice correctly', () => {
      const rng = makeRng('test-seed');
      const result = rollDice(3, 6, rng);
      expect(result).toBeGreaterThanOrEqual(3); // Minimum: 3 * 1
      expect(result).toBeLessThanOrEqual(18); // Maximum: 3 * 6
    });

    it('should be deterministic with same seed', () => {
      const rng1 = makeRng('test-seed');
      const rng2 = makeRng('test-seed');
      expect(rollDice(2, 6, rng1)).toBe(rollDice(2, 6, rng2));
    });
  });

  describe('rollWithAdvantage', () => {
    it('should return higher of two rolls', () => {
      const rng = makeRng('test-seed');
      const result = rollWithAdvantage(20, rng);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(20);
    });
  });

  describe('rollWithDisadvantage', () => {
    it('should return lower of two rolls', () => {
      const rng = makeRng('test-seed');
      const result = rollWithDisadvantage(20, rng);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(20);
    });
  });
});

