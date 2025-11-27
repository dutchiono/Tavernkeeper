import { describe, it, expect } from 'vitest';
import {
  isPositionInRoom,
  findRoomForPosition,
  arePositionsInSameRoom,
  checkRoomTransition,
  validateMovement,
  areEntitiesInSameRoom,
  getEntitiesInRoom,
} from '../src/spatial';
import type { Room, DungeonMap, Entity, Position } from '@innkeeper/lib';
import { loadMap } from '../src/map-loader';

describe('Spatial', () => {
  const testRoom: Room = {
    id: 'test-room',
    x: 100,
    y: 100,
    width: 200,
    height: 150,
    type: 'room',
    connections: [],
    spawnPoints: [{ x: 150, y: 150 }],
    items: [],
    enemies: [],
  };

  describe('isPositionInRoom', () => {
    it('should return true for position inside room', () => {
      const position: Position = { x: 150, y: 150 };
      expect(isPositionInRoom(position, testRoom)).toBe(true);
    });

    it('should return false for position outside room', () => {
      const position: Position = { x: 50, y: 50 };
      expect(isPositionInRoom(position, testRoom)).toBe(false);
    });

    it('should return true for position on room boundary', () => {
      const position: Position = { x: 100, y: 100 };
      expect(isPositionInRoom(position, testRoom)).toBe(true);
    });

    it('should return false for position just outside room', () => {
      const position: Position = { x: 300, y: 250 };
      expect(isPositionInRoom(position, testRoom)).toBe(false);
    });
  });

  describe('findRoomForPosition', () => {
    it('should find room for position', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();

      const entryRoom = map!.rooms[0];
      const position: Position = {
        x: entryRoom.x + entryRoom.width / 2,
        y: entryRoom.y + entryRoom.height / 2,
      };

      const room = findRoomForPosition(position, map!);
      expect(room).toBeTruthy();
      expect(room?.id).toBe(entryRoom.id);
    });

    it('should return null for position outside all rooms', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();

      const position: Position = { x: 0, y: 0 };
      const room = findRoomForPosition(position, map!);
      expect(room).toBeNull();
    });
  });

  describe('arePositionsInSameRoom', () => {
    it('should return true for positions in same room', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();

      const room = map!.rooms[0];
      const pos1: Position = { x: room.x + 10, y: room.y + 10 };
      const pos2: Position = { x: room.x + 20, y: room.y + 20 };

      expect(arePositionsInSameRoom(pos1, pos2, map!)).toBe(true);
    });

    it('should return false for positions in different rooms', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();

      const room1 = map!.rooms[0];
      const room2 = map!.rooms[1];
      const pos1: Position = { x: room1.x + 10, y: room1.y + 10 };
      const pos2: Position = { x: room2.x + 10, y: room2.y + 10 };

      expect(arePositionsInSameRoom(pos1, pos2, map!)).toBe(false);
    });
  });

  describe('checkRoomTransition', () => {
    it('should detect room transition', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();

      const room1 = map!.rooms[0];
      const room2 = map!.rooms[1];
      const entity: Entity = {
        id: 'test-entity',
        name: 'Test',
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, hp: 20, maxHp: 20, attackBonus: 0 },
        roomId: room1.id,
        position: { x: room1.x + 10, y: room1.y + 10 },
      };

      const newPosition: Position = { x: room2.x + 10, y: room2.y + 10 };
      const transition = checkRoomTransition(entity, newPosition, map!, entity.roomId);

      expect(transition.transitioned).toBe(true);
      expect(transition.fromRoom).toBe(room1.id);
      expect(transition.toRoom).toBe(room2.id);
    });

    it('should not transition if rooms are not connected', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();

      const room1 = map!.rooms[0];
      // Create a room that's not connected
      const unconnectedRoom: Room = {
        id: 'unconnected',
        x: 500,
        y: 500,
        width: 100,
        height: 100,
        type: 'room',
        connections: [],
        spawnPoints: [],
        items: [],
        enemies: [],
      };

      const entity: Entity = {
        id: 'test-entity',
        name: 'Test',
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, hp: 20, maxHp: 20, attackBonus: 0 },
        roomId: room1.id,
        position: { x: room1.x + 10, y: room1.y + 10 },
      };

      const newPosition: Position = { x: unconnectedRoom.x + 10, y: unconnectedRoom.y + 10 };
      const transition = checkRoomTransition(entity, newPosition, { ...map!, rooms: [...map!.rooms, unconnectedRoom] }, entity.roomId);

      expect(transition.transitioned).toBe(false);
    });
  });

  describe('validateMovement', () => {
    it('should validate movement within same room', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();

      const room = map!.rooms[0];
      const entity: Entity = {
        id: 'test-entity',
        name: 'Test',
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, hp: 20, maxHp: 20, attackBonus: 0 },
        roomId: room.id,
        position: { x: room.x + 10, y: room.y + 10 },
      };

      const targetPosition: Position = { x: room.x + 20, y: room.y + 20 };
      const validation = validateMovement(entity, targetPosition, map!);

      expect(validation.valid).toBe(true);
    });

    it('should invalidate movement outside all rooms', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();

      const entity: Entity = {
        id: 'test-entity',
        name: 'Test',
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, hp: 20, maxHp: 20, attackBonus: 0 },
      };

      const targetPosition: Position = { x: 0, y: 0 };
      const validation = validateMovement(entity, targetPosition, map!);

      expect(validation.valid).toBe(false);
      expect(validation.reason).toBeDefined();
    });
  });

  describe('areEntitiesInSameRoom', () => {
    it('should return true for entities in same room', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();

      const room = map!.rooms[0];
      const entity1: Entity = {
        id: 'entity-1',
        name: 'Entity 1',
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, hp: 20, maxHp: 20, attackBonus: 0 },
        roomId: room.id,
      };
      const entity2: Entity = {
        id: 'entity-2',
        name: 'Entity 2',
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, hp: 20, maxHp: 20, attackBonus: 0 },
        roomId: room.id,
      };

      expect(areEntitiesInSameRoom(entity1, entity2, map!)).toBe(true);
    });

    it('should return false for entities in different rooms', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();

      const entity1: Entity = {
        id: 'entity-1',
        name: 'Entity 1',
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, hp: 20, maxHp: 20, attackBonus: 0 },
        roomId: map!.rooms[0].id,
      };
      const entity2: Entity = {
        id: 'entity-2',
        name: 'Entity 2',
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, hp: 20, maxHp: 20, attackBonus: 0 },
        roomId: map!.rooms[1].id,
      };

      expect(areEntitiesInSameRoom(entity1, entity2, map!)).toBe(false);
    });
  });

  describe('getEntitiesInRoom', () => {
    it('should return all entities in a room', () => {
      const map = loadMap('abandoned-cellar');
      expect(map).toBeTruthy();

      const room = map!.rooms[0];
      const entities = new Map<string, Entity>();

      entities.set('entity-1', {
        id: 'entity-1',
        name: 'Entity 1',
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, hp: 20, maxHp: 20, attackBonus: 0 },
        roomId: room.id,
      });
      entities.set('entity-2', {
        id: 'entity-2',
        name: 'Entity 2',
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, hp: 20, maxHp: 20, attackBonus: 0 },
        roomId: room.id,
      });
      entities.set('entity-3', {
        id: 'entity-3',
        name: 'Entity 3',
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, hp: 20, maxHp: 20, attackBonus: 0 },
        roomId: map!.rooms[1].id, // Different room
      });

      const roomEntities = getEntitiesInRoom(room.id, entities);
      expect(roomEntities.length).toBe(2);
      expect(roomEntities.map(e => e.id)).toContain('entity-1');
      expect(roomEntities.map(e => e.id)).toContain('entity-2');
    });
  });
});

