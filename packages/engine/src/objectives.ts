import type { DungeonObjective, Entity, GameEvent, CombatEvent } from '@innkeeper/lib';
import { isDead } from './combat';

export interface ObjectiveStatus {
  objective: DungeonObjective;
  completed: boolean;
  progress?: number;
}

/**
 * Check if an objective has been completed
 */
export function checkObjective(
  objective: DungeonObjective,
  entities: Map<string, Entity>,
  events: GameEvent[]
): boolean {
  switch (objective.type) {
    case 'defeat_boss': {
      const targetEntity = entities.get(objective.target);
      if (!targetEntity) {
        // Entity doesn't exist - check if it was killed
        const deathEvent = events.find(
          (e) =>
            e.type === 'combat' &&
            (e as CombatEvent).action === 'death' &&
            (e as CombatEvent).actorId === objective.target
        );
        return deathEvent !== undefined;
      }
      return isDead(targetEntity);
    }

    case 'retrieve_item': {
      // Check if any player entity has the item in inventory
      for (const entity of entities.values()) {
        if (entity.isPlayer && entity.inventory) {
          const hasItem = entity.inventory.some((item) => item.id === objective.target);
          if (hasItem) {
            return true;
          }
        }
      }
      return false;
    }

    case 'clear_room': {
      // Check if all enemies in the target room are dead
      // This would require room context - simplified for now
      const targetEntity = entities.get(objective.target);
      if (!targetEntity) {
        return true; // Entity doesn't exist, assume cleared
      }
      return isDead(targetEntity);
    }

    case 'survive': {
      // Check if party is still alive after X turns
      // This is time-based, would need turn count
      const playerEntities = Array.from(entities.values()).filter((e) => e.isPlayer);
      return playerEntities.some((e) => !isDead(e));
    }

    default:
      return false;
  }
}

/**
 * Check all objectives for a dungeon
 */
export function checkAllObjectives(
  objectives: DungeonObjective[],
  entities: Map<string, Entity>,
  events: GameEvent[]
): ObjectiveStatus[] {
  return objectives.map((objective) => ({
    objective,
    completed: checkObjective(objective, entities, events),
  }));
}

/**
 * Check if all objectives are completed (victory condition)
 */
export function areAllObjectivesComplete(
  objectives: DungeonObjective[],
  entities: Map<string, Entity>,
  events: GameEvent[]
): boolean {
  const statuses = checkAllObjectives(objectives, entities, events);
  return statuses.every((status) => status.completed);
}

/**
 * Check if party is wiped (defeat condition)
 */
export function isPartyWiped(entities: Map<string, Entity>): boolean {
  const playerEntities = Array.from(entities.values()).filter((e) => e.isPlayer);
  if (playerEntities.length === 0) {
    return false; // No players, can't be wiped
  }
  return playerEntities.every((e) => isDead(e));
}

