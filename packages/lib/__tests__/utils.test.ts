import { describe, it, expect } from 'vitest';
import { getAbilityModifier } from '../src/utils';

describe('Utils', () => {
  describe('getAbilityModifier', () => {
    it('should calculate ability modifiers correctly', () => {
      expect(getAbilityModifier(1)).toBe(-5);
      expect(getAbilityModifier(8)).toBe(-1);
      expect(getAbilityModifier(10)).toBe(0);
      expect(getAbilityModifier(12)).toBe(1);
      expect(getAbilityModifier(14)).toBe(2);
      expect(getAbilityModifier(16)).toBe(3);
      expect(getAbilityModifier(18)).toBe(4);
      expect(getAbilityModifier(20)).toBe(5);
    });

    it('should handle edge cases', () => {
      expect(getAbilityModifier(0)).toBe(-5);
      expect(getAbilityModifier(30)).toBe(10);
    });
  });
});

