import type { AgentPersona, AgentMemory, Action, GameEvent } from '@innkeeper/lib';
import type { ElizaAgentConfig, Plugin, GameActionPlugin } from './types/eliza';

/**
 * Agent wrapper class that interfaces with ElizaOS
 * In production, this would make HTTP requests to ElizaOS service
 */
export class AgentWrapper {
  private config: ElizaAgentConfig;
  private plugins: Map<string, Plugin>;
  private elizaUrl: string;
  private apiKey: string;

  constructor(config: ElizaAgentConfig, elizaUrl: string, apiKey: string) {
    this.config = config;
    this.plugins = new Map();
    this.elizaUrl = elizaUrl;
    this.apiKey = apiKey;
  }

  /**
   * Register a plugin
   */
  registerPlugin(plugin: Plugin): void {
    this.plugins.set(plugin.name, plugin);
  }

  /**
   * Initialize agent with ElizaOS
   * This would POST to ElizaOS API to create/update the agent
   */
  async initialize(): Promise<void> {
    // In production: POST to ${this.elizaUrl}/api/agents
    // For now, this is a placeholder
    console.log(`Initializing agent ${this.config.id} with ElizaOS at ${this.elizaUrl}`);
  }

  /**
   * Update agent persona and memory
   */
  async updatePersona(persona: AgentPersona): Promise<void> {
    this.config.persona = persona;
    // In production: PATCH to ${this.elizaUrl}/api/agents/${this.config.id}
  }

  /**
   * Update agent memory
   */
  async updateMemory(memory: AgentMemory): Promise<void> {
    this.config.memory = memory;
    // In production: PATCH to ${this.elizaUrl}/api/agents/${this.config.id}/memory
  }

  /**
   * Get agent's current intent/action for a turn
   */
  async getAction(context: {
    turnNumber: number;
    events: GameEvent[];
    worldState: unknown;
  }): Promise<Action | null> {
    // In production: POST to ${this.elizaUrl}/api/agents/${this.config.id}/decide
    // with context, get back action intent

    // For now, return null (agents would submit actions via hooks)
    if (this.config.hooks?.onTurn) {
      return await this.config.hooks.onTurn(context.turnNumber, context.events);
    }

    return null;
  }

  /**
   * Submit action to game engine via plugin
   */
  async submitAction(action: Action): Promise<{ success: boolean; events?: GameEvent[] }> {
    const plugin = this.plugins.get('game-action-plugin');

    if (plugin && plugin.name === 'game-action-plugin') {
      return await (plugin as GameActionPlugin).submitAction(this.config.id, action) as { success: boolean; events?: GameEvent[] };
    }

    throw new Error('game-action-plugin not registered');
  }

  /**
   * Handle run start hook
   */
  async onRunStart(runId: string): Promise<void> {
    if (this.config.hooks?.onRunStart) {
      await this.config.hooks.onRunStart(runId);
    }
  }

  /**
   * Handle run end hook
   */
  async onRunEnd(runId: string, result: string): Promise<void> {
    if (this.config.hooks?.onRunEnd) {
      await this.config.hooks.onRunEnd(runId, result);
    }
  }
}

