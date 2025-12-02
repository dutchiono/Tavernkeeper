import seedrandom from 'seedrandom';
import { createHash } from 'crypto';

export type RNG = () => number;

/**
 * Generate a deterministic seed from multiple inputs using HMAC-SHA256
 */
export function generateSeed(
  dungeonSeed: string,
  runId: string,
  startTime: number | string
): string {
  const combined = `${dungeonSeed}:${runId}:${startTime}`;
  return createHash('sha256').update(combined).digest('hex');
}

/**
 * Create a seeded PRNG instance
 */
export function makeRng(seed: string): RNG {
  return seedrandom(seed);
}

/**
 * Roll a die with the given number of sides
 */
export function d(sides: number, rng: RNG): number {
  return Math.floor(rng() * sides) + 1;
}

/**
 * Roll multiple dice (e.g., 2d6)
 */
export function rollDice(dieCount: number, sides: number, rng: RNG): number {
  let total = 0;
  for (let i = 0; i < dieCount; i++) {
    total += d(sides, rng);
  }
  return total;
}

/**
 * Roll with advantage (roll twice, take higher)
 */
export function rollWithAdvantage(sides: number, rng: RNG): number {
  const roll1 = d(sides, rng);
  const roll2 = d(sides, rng);
  return Math.max(roll1, roll2);
}

/**
 * Roll with disadvantage (roll twice, take lower)
 */
export function rollWithDisadvantage(sides: number, rng: RNG): number {
  const roll1 = d(sides, rng);
  const roll2 = d(sides, rng);
  return Math.min(roll1, roll2);
}

