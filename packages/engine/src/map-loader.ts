import type { DungeonMap } from '@innkeeper/lib';
import cellarMap from './maps/cellar.json';
import goblinWarrenMap from './maps/goblin-warren.json';

const MAPS: Record<string, DungeonMap> = {
  'abandoned-cellar': cellarMap as DungeonMap,
  'goblin-warren': goblinWarrenMap as DungeonMap,
};

/**
 * Load a dungeon map by ID
 */
export function loadMap(mapId: string): DungeonMap | null {
  const map = MAPS[mapId];
  if (!map) {
    return null;
  }
  return map;
}

/**
 * Get all available map IDs
 */
export function getAvailableMaps(): string[] {
  return Object.keys(MAPS);
}

/**
 * Validate map structure
 */
export function validateMap(map: DungeonMap): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!map.id) {
    errors.push('Map missing id');
  }
  if (!map.name) {
    errors.push('Map missing name');
  }
  if (!map.seed) {
    errors.push('Map missing seed');
  }
  if (!map.rooms || map.rooms.length === 0) {
    errors.push('Map must have at least one room');
  }
  if (!map.objectives || map.objectives.length === 0) {
    errors.push('Map must have at least one objective');
  }

  // Validate rooms
  const roomIds = new Set<string>();
  for (const room of map.rooms) {
    if (roomIds.has(room.id)) {
      errors.push(`Duplicate room ID: ${room.id}`);
    }
    roomIds.add(room.id);

    if (!room.spawnPoints || room.spawnPoints.length === 0) {
      errors.push(`Room ${room.id} must have at least one spawn point`);
    }

    // Validate connections
    for (const connectionId of room.connections) {
      if (!roomIds.has(connectionId) && connectionId !== room.id) {
        // Connection might be to a room we haven't seen yet, so we'll check after
      }
    }
  }

  // Validate connections are bidirectional
  for (const room of map.rooms) {
    for (const connectionId of room.connections) {
      const connectedRoom = map.rooms.find((r) => r.id === connectionId);
      if (!connectedRoom) {
        errors.push(`Room ${room.id} connects to non-existent room ${connectionId}`);
      } else if (!connectedRoom.connections.includes(room.id)) {
        errors.push(`Room ${room.id} connects to ${connectionId}, but connection is not bidirectional`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

