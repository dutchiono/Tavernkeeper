import { describe, it, expect } from 'vitest';
import { loadMap, getAvailableMaps, validateMap } from '../src/map-loader';
import type { DungeonMap } from '@innkeeper/lib';

describe('Map Loader', () => {
  describe('loadMap', () => {
    it('should load abandoned-cellar map', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();
      expect(map?.id).toBe('abandoned-cellar');
      expect(map?.name).toBe('The Abandoned Cellar');
      expect(map?.rooms.length).toBe(3);
    });

    it('should load goblin-warren map', () => {
      const map = loadMap('goblin-warren');
      expect(map).toBeTruthy();
      expect(map?.id).toBe('goblin-warren');
      expect(map?.name).toBe('The Goblin Warren');
      expect(map?.rooms.length).toBe(5);
    });

    it('should return null for invalid map ID', () => {
      const map = loadMap('invalid-map');
      expect(map).toBeNull();
    });
  });

  describe('getAvailableMaps', () => {
    it('should return list of available maps', () => {
      const maps = getAvailableMaps();
      expect(maps).toContain('abandoned-cellar');
      expect(maps).toContain('goblin-warren');
      expect(maps.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('validateMap', () => {
    it('should validate a correct map', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();

      const validation = validateMap(map!);
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('should detect missing id', () => {
      const invalidMap = {
        name: 'Test',
        seed: 'test',
        rooms: [],
        width: 100,
        height: 100,
        objectives: [],
      } as DungeonMap;

      const validation = validateMap(invalidMap);
      expect(validation.valid).toBe(false);
      expect(validation.errors.some(e => e.includes('id'))).toBe(true);
    });

    it('should detect missing rooms', () => {
      const invalidMap = {
        id: 'test',
        name: 'Test',
        seed: 'test',
        rooms: [],
        width: 100,
        height: 100,
        objectives: [],
      } as DungeonMap;

      const validation = validateMap(invalidMap);
      expect(validation.valid).toBe(false);
      expect(validation.errors.some(e => e.includes('room'))).toBe(true);
    });

    it('should detect missing objectives', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();

      const invalidMap = {
        ...map!,
        objectives: [],
      };

      const validation = validateMap(invalidMap);
      expect(validation.valid).toBe(false);
      expect(validation.errors.some(e => e.includes('objective'))).toBe(true);
    });
  });
});

