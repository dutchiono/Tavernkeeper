import type { DungeonMap, Room, Position, Entity } from '@innkeeper/lib';
import type { ExplorationEvent } from '@innkeeper/lib';

/**
 * Check if a position is within a room's boundaries
 */
export function isPositionInRoom(position: Position, room: Room): boolean {
  return (
    position.x >= room.x &&
    position.x < room.x + room.width &&
    position.y >= room.y &&
    position.y < room.y + room.height
  );
}

/**
 * Find which room a position is in
 */
export function findRoomForPosition(position: Position, map: DungeonMap): Room | null {
  for (const room of map.rooms) {
    if (isPositionInRoom(position, room)) {
      return room;
    }
  }
  return null;
}

/**
 * Check if two positions are in the same room
 */
export function arePositionsInSameRoom(
  pos1: Position,
  pos2: Position,
  map: DungeonMap
): boolean {
  const room1 = findRoomForPosition(pos1, map);
  const room2 = findRoomForPosition(pos2, map);
  return room1 !== null && room2 !== null && room1.id === room2.id;
}

/**
 * Check if a room transition should occur based on movement
 */
export function checkRoomTransition(
  entity: Entity,
  newPosition: Position,
  map: DungeonMap,
  currentRoomId?: string
): { transitioned: boolean; fromRoom?: string; toRoom?: string } {
  const newRoom = findRoomForPosition(newPosition, map);

  if (!newRoom) {
    // Position is outside all rooms - invalid movement
    return { transitioned: false };
  }

  if (currentRoomId === newRoom.id) {
    // Still in same room
    return { transitioned: false };
  }

  // Check if rooms are connected
  if (currentRoomId) {
    const currentRoom = map.rooms.find((r) => r.id === currentRoomId);
    if (currentRoom && !currentRoom.connections.includes(newRoom.id)) {
      // Rooms are not connected - invalid transition
      return { transitioned: false };
    }
  }

  return {
    transitioned: true,
    fromRoom: currentRoomId,
    toRoom: newRoom.id,
  };
}

/**
 * Validate movement within room boundaries
 */
export function validateMovement(
  entity: Entity,
  targetPosition: Position,
  map: DungeonMap
): { valid: boolean; reason?: string } {
  const targetRoom = findRoomForPosition(targetPosition, map);

  if (!targetRoom) {
    return { valid: false, reason: 'Target position is outside all rooms' };
  }

  // If entity is in a room, check if target is in same room or connected room
  if (entity.roomId) {
    const currentRoom = map.rooms.find((r) => r.id === entity.roomId);
    if (currentRoom) {
      if (currentRoom.id === targetRoom.id) {
        // Same room - valid
        return { valid: true };
      }
      // Different room - check connection
      if (!currentRoom.connections.includes(targetRoom.id)) {
        return { valid: false, reason: 'Target room is not connected to current room' };
      }
    }
  }

  return { valid: true };
}

/**
 * Generate room transition events
 */
export function generateRoomTransitionEvents(
  entityId: string,
  fromRoomId: string | undefined,
  toRoomId: string,
  timestamp: number
): ExplorationEvent[] {
  const events: ExplorationEvent[] = [];

  if (fromRoomId) {
    events.push({
      type: 'exploration',
      id: `exit-room-${timestamp}-${entityId}`,
      timestamp,
      actorId: entityId,
      action: 'exit_room',
      roomId: fromRoomId,
    });
  }

  events.push({
    type: 'exploration',
    id: `enter-room-${timestamp}-${entityId}`,
    timestamp,
    actorId: entityId,
    action: 'enter_room',
    roomId: toRoomId,
  });

  return events;
}

/**
 * Check if two entities are in the same room (for interactions/attacks)
 */
export function areEntitiesInSameRoom(
  entity1: Entity,
  entity2: Entity,
  map: DungeonMap
): boolean {
  if (!entity1.roomId || !entity2.roomId) {
    return false;
  }
  return entity1.roomId === entity2.roomId;
}

/**
 * Get all entities in a specific room
 */
export function getEntitiesInRoom(
  roomId: string,
  entities: Map<string, Entity>
): Entity[] {
  return Array.from(entities.values()).filter((e) => e.roomId === roomId);
}

