import type { AgentPersona, AgentMemory, Action, GameEvent, Entity } from '@innkeeper/lib';
import type { ElizaAgentConfig } from '@innkeeper/agents';
import { AgentWrapper } from '@innkeeper/agents';
import { GameActionPluginImpl } from '@innkeeper/agents';
import { MemoryPluginImpl } from '@innkeeper/agents';
import { DMPluginImpl } from '@innkeeper/agents';
import { getAgentConfig } from '@innkeeper/agents';

/**
 * DM Manager - Controls all non-player entities (monsters, NPCs)
 */
export class DMManager {
  private dmAgent: AgentWrapper;
  private entityToAgentMap: Map<string, string>; // entityId -> agentId
  private config: ReturnType<typeof getAgentConfig>;
  private dmPlugin: DMPluginImpl;

  constructor(elizaUrl?: string, apiKey?: string) {
    this.config = getAgentConfig();
    const eliza = elizaUrl || this.config.elizaUrl;
    const key = apiKey || this.config.elizaApiKey;

    // Create DM agent configuration
    const dmConfig: ElizaAgentConfig = {
      id: 'dm-agent',
      name: 'Dungeon Master',
      persona: {
        name: 'Dungeon Master',
        archetype: 'custom',
        aggression: 0.7,
        caution: 0.3,
        goals: ['Challenge the party', 'Create engaging encounters', 'Narrate the story'],
        traits: ['Tactical', 'Narrative', 'Fair'],
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
      plugins: ['game-action-plugin', 'memory-plugin', 'dm-plugin'],
    };

    this.dmAgent = new AgentWrapper(dmConfig, eliza, key);

    // Register plugins
    const gameActionPlugin = new GameActionPluginImpl('http://localhost:3000');
    const memoryPlugin = new MemoryPluginImpl('http://localhost:3000');
    this.dmPlugin = new DMPluginImpl(eliza, key);

    this.dmAgent.registerPlugin(gameActionPlugin);
    this.dmAgent.registerPlugin(memoryPlugin);
    this.dmAgent.registerPlugin(this.dmPlugin);

    this.entityToAgentMap = new Map();
  }

  /**
   * Register a monster entity to be controlled by the DM
   */
  registerMonster(entityId: string, agentId?: string): void {
    this.entityToAgentMap.set(entityId, agentId || `dm-${entityId}`);
  }

  /**
   * Get action for a monster entity controlled by the DM
   */
  async getMonsterAction(
    entityId: string,
    context: {
      turnNumber: number;
      events: GameEvent[];
      worldState: {
        entities: Map<string, Entity>;
        currentRoom?: string;
      };
    }
  ): Promise<Action | null> {
    // DM makes decision for this monster
    // In a full implementation, the DM would consider:
    // - Monster's stats and capabilities
    // - Party positions and health
    // - Tactical situation
    // - Monster's behavior pattern

    const action = await this.dmAgent.getAction({
      turnNumber: context.turnNumber,
      events: context.events,
      worldState: {
        ...context.worldState,
        controllingEntityId: entityId,
      },
    });

    if (action) {
      // Ensure the action is for the correct entity
      action.actorId = entityId;
    }

    return action;
  }

  /**
   * Generate room description using DM plugin
   */
  async generateRoomDescription(roomId: string, context: unknown): Promise<string> {
    return await this.dmPlugin.generateRoomDescription(roomId, context);
  }

  /**
   * Generate event description using DM plugin
   */
  async generateEventDescription(event: GameEvent): Promise<string> {
    return await this.dmPlugin.generateEventDescription(event);
  }

  /**
   * Check if an entity is controlled by the DM
   */
  isDMControlled(entityId: string): boolean {
    return this.entityToAgentMap.has(entityId);
  }

  /**
   * Initialize DM agent
   */
  async initialize(): Promise<void> {
    await this.dmAgent.initialize();
  }
}
