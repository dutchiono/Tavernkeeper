import type {
  Entity,
  Action,
  GameEvent,
  CombatEvent,
  ExplorationEvent,
  InteractionEvent,
  SystemEvent,
  NarrativeEvent,
  Turn,
  DungeonState,
  DungeonMap,
} from '@innkeeper/lib';
import type { RNG } from './rng';
import { makeRng, generateSeed, d } from './rng';
import { attack, applyDamage, isDead } from './combat';
import { rollInitiative } from './initiative';
import { validateAction } from './action-validator';
import { getAbilityModifier } from '@innkeeper/lib';
import { loadMap } from './map-loader';
import { checkRoomTransition, validateMovement, generateRoomTransitionEvents } from './spatial';
import { DMManager } from './dm-manager';
import { areAllObjectivesComplete, isPartyWiped } from './objectives';
import { AgentWrapper } from '@innkeeper/agents';
import { GameActionPluginImpl, MemoryPluginImpl } from '@innkeeper/agents';
import { getAgentConfig } from '@innkeeper/agents';
import type { ElizaAgentConfig } from '@innkeeper/agents';

export interface EngineState {
  entities: Map<string, Entity>;
  currentTurn: number;
  turnOrder: string[]; // Entity IDs in initiative order
  events: GameEvent[];
  seed: string;
  rng: RNG;
  dungeonState?: DungeonState;
}

export interface SimulationConfig {
  dungeonSeed: string;
  runId: string;
  startTime: number;
  entities: Entity[];
  maxTurns?: number;
  mapId?: string; // Map ID to load
  agentIds?: string[]; // Agent IDs for player entities (must match entity order)
  elizaUrl?: string;
  elizaApiKey?: string;
}

export interface SimulationResult {
  events: GameEvent[];
  finalState: EngineState;
  turns: Turn[];
  result: 'victory' | 'defeat' | 'timeout' | 'abandoned';
}

/**
 * Initialize entities from map data
 */
function initializeEntitiesFromMap(
  map: DungeonMap,
  playerEntities: Entity[],
  rng: RNG
): { entities: Entity[]; monsterIds: string[] } {
  const entities: Entity[] = [...playerEntities];
  const monsterIds: string[] = [];

  // Find entry room (first room or room with type 'room')
  const entryRoom = map.rooms.find((r) => r.type === 'room' && r.id !== 'boss') || map.rooms[0];
  if (!entryRoom) {
    throw new Error('Map must have an entry room');
  }

  // Place player entities in entry room
  const spawnPoint = entryRoom.spawnPoints[0];
  if (spawnPoint) {
    playerEntities.forEach((entity, index) => {
      const spawn = entryRoom.spawnPoints[index % entryRoom.spawnPoints.length];
      entity.position = { x: spawn.x, y: spawn.y };
      entity.roomId = entryRoom.id;
      entity.isPlayer = true;
    });
  }

  // Spawn enemies from map
  for (const room of map.rooms) {
    for (const enemy of room.enemies) {
      const spawn = room.spawnPoints[Math.floor(rng() * room.spawnPoints.length)];
      const enemyEntity: Entity = {
        id: enemy.id,
        name: enemy.name,
        stats: enemy.stats,
        position: { x: spawn.x, y: spawn.y },
        roomId: room.id,
        isPlayer: false,
        inventory: [],
      };
      entities.push(enemyEntity);
      monsterIds.push(enemy.id);
    }
  }

  return { entities, monsterIds };
}

/**
 * Create a new engine state
 */
export function createEngineState(config: SimulationConfig): EngineState {
  const seed = generateSeed(config.dungeonSeed, config.runId, config.startTime.toString());
  const rng = makeRng(seed);

  let entities: Entity[] = config.entities;
  let dungeonState: DungeonState | undefined;
  let monsterIds: string[] = [];

  // Load map if mapId is provided
  if (config.mapId) {
    const map = loadMap(config.mapId);
    if (map) {
      const initialized = initializeEntitiesFromMap(map, config.entities, rng);
      entities = initialized.entities;
      monsterIds = initialized.monsterIds;

      // Create dungeon state
      const entityRoomMap: Record<string, { roomId: string; position: { x: number; y: number } }> = {};
      for (const entity of entities) {
        if (entity.position && entity.roomId) {
          entityRoomMap[entity.id] = {
            roomId: entity.roomId,
            position: entity.position,
          };
        }
      }

      dungeonState = {
        map,
        entities: entityRoomMap,
        currentRoom: map.rooms[0]?.id,
        discoveredRooms: new Set([map.rooms[0]?.id].filter(Boolean) as string[]),
      };
    }
  }

  const entityMap = new Map<string, Entity>();
  entities.forEach((entity) => {
    entityMap.set(entity.id, entity);
  });

  // Roll initiative
  const initiative = rollInitiative(entities, rng);
  const turnOrder = initiative.map((entry) => entry.entityId);

  return {
    entities: entityMap,
    currentTurn: 0,
    turnOrder,
    events: [],
    seed,
    rng,
    dungeonState,
  };
}

/**
 * Execute a single action and return events
 */
export function executeAction(state: EngineState, action: Action): GameEvent[] {
  const events: GameEvent[] = [];
  const validation = validateAction(action, state.entities);

  if (!validation.valid) {
    events.push({
      type: 'system',
      id: `error-${Date.now()}`,
      timestamp: Date.now(),
      message: `Invalid action: ${validation.errors.map((e) => e.message).join(', ')}`,
    } as SystemEvent);
    return events;
  }

  const actor = state.entities.get(action.actorId);
  if (!actor) {
    return events;
  }

  // Spatial validation for movement
  if (action.type === 'move' && state.dungeonState) {
    const spatialValidation = validateMovement(actor, action.target, state.dungeonState.map);
    if (!spatialValidation.valid) {
      events.push({
        type: 'system',
        id: `error-${Date.now()}`,
        timestamp: Date.now(),
        message: `Invalid movement: ${spatialValidation.reason}`,
      } as SystemEvent);
      return events;
    }

    // Check for room transition
    const transition = checkRoomTransition(
      actor,
      action.target,
      state.dungeonState.map,
      actor.roomId
    );

    if (transition.transitioned && transition.toRoom) {
      // Update entity room
      actor.roomId = transition.toRoom;
      if (state.dungeonState) {
        state.dungeonState.entities[actor.id] = {
          roomId: transition.toRoom,
          position: action.target,
        };
        state.dungeonState.discoveredRooms.add(transition.toRoom);
      }

      // Generate room transition events
      const transitionEvents = generateRoomTransitionEvents(
        actor.id,
        transition.fromRoom,
        transition.toRoom,
        Date.now()
      );
      events.push(...transitionEvents);
    }
  }

  switch (action.type) {
    case 'attack': {
      const target = state.entities.get(action.targetId!);
      if (!target) break;

      // Check if target is in same room (if dungeon state exists)
      if (state.dungeonState && actor.roomId && target.roomId && actor.roomId !== target.roomId) {
        events.push({
          type: 'system',
          id: `error-${Date.now()}`,
          timestamp: Date.now(),
          message: 'Cannot attack target in different room',
        } as SystemEvent);
        break;
      }

      const result = attack(actor, target, null, state.rng);
      const updatedTarget = applyDamage(target, result.damage);
      state.entities.set(target.id, updatedTarget);

      events.push({
        type: 'combat',
        id: `combat-${Date.now()}`,
        timestamp: Date.now(),
        actorId: actor.id,
        targetId: target.id,
        action: 'attack',
        roll: result.roll,
        hit: result.hit,
        damage: result.damage,
        critical: result.critical,
      } as CombatEvent);

      if (isDead(updatedTarget)) {
        events.push({
          type: 'combat',
          id: `death-${Date.now()}`,
          timestamp: Date.now(),
          actorId: updatedTarget.id,
          action: 'death',
        } as CombatEvent);
      }
      break;
    }

    case 'move': {
      const updatedActor = {
        ...actor,
        position: action.target,
      };
      state.entities.set(actor.id, updatedActor);

      // Update dungeon state
      if (state.dungeonState && updatedActor.roomId) {
        state.dungeonState.entities[actor.id] = {
          roomId: updatedActor.roomId,
          position: action.target,
        };
      }

      events.push({
        type: 'exploration',
        id: `move-${Date.now()}`,
        timestamp: Date.now(),
        actorId: actor.id,
        action: 'move',
        location: action.target,
      } as ExplorationEvent);
      break;
    }

    case 'skill_check': {
      const roll = d(20, state.rng) + getAbilityModifier(actor.stats.wis); // Default to WIS
      const success = roll >= action.difficulty;

      events.push({
        type: 'interaction',
        id: `skill-${Date.now()}`,
        timestamp: Date.now(),
        actorId: actor.id,
        targetId: action.targetId || '',
        interaction: action.skill,
        success,
        result: { roll, difficulty: action.difficulty },
      } as InteractionEvent);
      break;
    }

    case 'interact': {
      events.push({
        type: 'interaction',
        id: `interact-${Date.now()}`,
        timestamp: Date.now(),
        actorId: actor.id,
        targetId: action.targetId!,
        interaction: action.interaction,
        success: true, // Simplified - would check conditions
      } as InteractionEvent);
      break;
    }

    case 'use_item': {
      // Simplified item usage
      events.push({
        type: 'system',
        id: `item-${Date.now()}`,
        timestamp: Date.now(),
        message: `${actor.name} used item ${action.itemId}`,
      } as SystemEvent);
      break;
    }
  }

  return events;
}

/**
 * Simulate a full run with agent integration
 */
export async function simulateRun(config: SimulationConfig): Promise<SimulationResult> {
  const state = createEngineState(config);
  const turns: Turn[] = [];
  const maxTurns = config.maxTurns || 100;

  // Initialize agent wrappers for players
  const agentWrappers = new Map<string, AgentWrapper>();
  const agentConfig = getAgentConfig();
  const elizaUrl = config.elizaUrl || agentConfig.elizaUrl;
  const elizaApiKey = config.elizaApiKey || agentConfig.elizaApiKey;

  if (config.agentIds && config.agentIds.length > 0) {
    const playerEntities = Array.from(state.entities.values()).filter((e) => e.isPlayer);
    for (let i = 0; i < Math.min(config.agentIds.length, playerEntities.length); i++) {
      const entity = playerEntities[i];
      const agentId = config.agentIds[i];

      // In production, load agent config from database
      // For now, create a basic config
      const agentConfig: ElizaAgentConfig = {
        id: agentId,
        name: entity.name,
        persona: {
          name: entity.name,
          archetype: 'warrior',
          aggression: 0.5,
          caution: 0.5,
        },
        memory: {
          shortTerm: [],
          episodic: [],
          longTerm: {
            reputations: {},
            lore: [],
            relationships: {},
          },
        },
        plugins: ['game-action-plugin', 'memory-plugin'],
      };

      const wrapper = new AgentWrapper(agentConfig, elizaUrl, elizaApiKey);
      const gameActionPlugin = new GameActionPluginImpl('http://localhost:3000');
      const memoryPlugin = new MemoryPluginImpl('http://localhost:3000');
      wrapper.registerPlugin(gameActionPlugin);
      wrapper.registerPlugin(memoryPlugin);
      await wrapper.initialize();

      agentWrappers.set(entity.id, wrapper);
    }
  }

  // Initialize DM manager
  const dmManager = new DMManager(elizaUrl, elizaApiKey);
  await dmManager.initialize();

  // Register all monsters with DM
  const monsterEntities = Array.from(state.entities.values()).filter((e) => !e.isPlayer);
  for (const monster of monsterEntities) {
    dmManager.registerMonster(monster.id);
  }

  let result: 'victory' | 'defeat' | 'timeout' | 'abandoned' = 'timeout';

  // Run start hooks
  for (const wrapper of agentWrappers.values()) {
    await wrapper.onRunStart(config.runId);
  }

  for (let turnNum = 0; turnNum < maxTurns; turnNum++) {
    state.currentTurn = turnNum;
    const turnEvents: GameEvent[] = [];
    const turnActions: Array<{ entityId: string; action: string }> = [];

    // Collect actions from all entities in initiative order
    const actionQueue: Array<{ entityId: string; action: Action | null }> = [];

    for (const entityId of state.turnOrder) {
      const entity = state.entities.get(entityId);
      if (!entity || isDead(entity)) continue;

      let action: Action | null = null;

      if (entity.isPlayer) {
        // Get action from player agent
        const agentWrapper = agentWrappers.get(entityId);
        if (agentWrapper) {
          try {
            action = await agentWrapper.getAction({
              turnNumber: turnNum,
              events: state.events.slice(-10), // Last 10 events for context
              worldState: {
                entities: state.entities,
                currentRoom: entity.roomId,
              },
            });
          } catch (error) {
            console.error(`Error getting action from agent ${entityId}:`, error);
          }
        }
      } else {
        // Get action from DM for monster
        try {
          action = await dmManager.getMonsterAction(entityId, {
            turnNumber: turnNum,
            events: state.events.slice(-10),
            worldState: {
              entities: state.entities,
              currentRoom: entity.roomId,
            },
          });
        } catch (error) {
          console.error(`Error getting action from DM for ${entityId}:`, error);
        }
      }

      // Default action if agent didn't provide one
      if (!action) {
        // Simple default: move towards nearest enemy or idle
        const nearestEnemy = findNearestEnemy(entity, state.entities, state.dungeonState);
        if (nearestEnemy && nearestEnemy.position && entity.position) {
          // Move towards enemy (simplified)
          action = {
            type: 'move',
            actorId: entity.id,
            target: {
              x: entity.position.x + (nearestEnemy.position.x > entity.position.x ? 10 : -10),
              y: entity.position.y + (nearestEnemy.position.y > entity.position.y ? 10 : -10),
            },
          };
        } else {
          // No action - skip turn
          continue;
        }
      }

      actionQueue.push({ entityId, action });
    }

    // Execute actions in initiative order
    for (const { entityId, action } of actionQueue) {
      if (!action) continue;

      const actionEvents = executeAction(state, action);
      turnEvents.push(...actionEvents);
      turnActions.push({ entityId, action: action.type });
    }

    // Update agent memories with new events
    for (const wrapper of agentWrappers.values()) {
      // In production, update via MemoryPlugin
      // For now, events are already in state.events
    }

    if (turnEvents.length > 0) {
      state.events.push(...turnEvents);
      turns.push({
        number: turnNum,
        initiative: state.turnOrder.map((id) => ({
          entityId: id,
          initiative: 0, // Would be stored from initial roll
        })),
        actions: turnActions,
        events: turnEvents,
      });
    }

    // Check win/loss conditions
    if (state.dungeonState) {
      // Check objectives
      if (areAllObjectivesComplete(state.dungeonState.map.objectives, state.entities, state.events)) {
        result = 'victory';
        break;
      }
    }

    // Check party wipe
    if (isPartyWiped(state.entities)) {
      result = 'defeat';
      break;
    }

    // Check if all entities are dead
    const aliveEntities = Array.from(state.entities.values()).filter((e) => !isDead(e));
    if (aliveEntities.length === 0) {
      result = 'defeat';
      break;
    }
  }

  // Run end hooks
  for (const wrapper of agentWrappers.values()) {
    await wrapper.onRunEnd(config.runId, result);
  }

  return {
    events: state.events,
    finalState: state,
    turns,
    result,
  };
}

/**
 * Find nearest enemy to an entity
 */
function findNearestEnemy(
  entity: Entity,
  entities: Map<string, Entity>,
  dungeonState?: DungeonState
): Entity | null {
  if (!entity.position) return null;

  let nearest: Entity | null = null;
  let nearestDistance = Infinity;

  for (const other of entities.values()) {
    if (other.id === entity.id || !other.position) continue;
    if (entity.isPlayer === other.isPlayer) continue; // Same team
    if (isDead(other)) continue;

    // Check if in same room if dungeon state exists
    if (dungeonState && entity.roomId && other.roomId && entity.roomId !== other.roomId) {
      continue;
    }

    const dx = other.position.x - entity.position.x;
    const dy = other.position.y - entity.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = other;
    }
  }

  return nearest;
}
