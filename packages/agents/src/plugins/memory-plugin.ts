import type { AgentMemory } from '@innkeeper/lib';
import type { MemoryPlugin } from '../types/eliza';

/**
 * Memory Plugin implementation
 * Handles persistent memory reads/writes to database
 */
export class MemoryPluginImpl implements MemoryPlugin {
  name = 'memory-plugin' as const;
  private apiUrl: string;

  constructor(apiUrl: string = 'http://localhost:3000/api') {
    this.apiUrl = apiUrl;
  }

  async readMemory(agentId: string): Promise<AgentMemory> {
    try {
      const response = await fetch(`${this.apiUrl}/agents/${agentId}/memory`);
      if (!response.ok) {
        throw new Error(`Failed to read memory: ${response.statusText}`);
      }
      return await response.json() as AgentMemory;
    } catch (error) {
      console.error('Error reading memory:', error);
      // Return default memory structure
      return {
        shortTerm: [],
        episodic: [],
        longTerm: {},
      };
    }
  }

  async writeMemory(agentId: string, memory: AgentMemory): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/agents/${agentId}/memory`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memory),
      });

      if (!response.ok) {
        throw new Error(`Failed to write memory: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error writing memory:', error);
      throw error;
    }
  }

  async updateShortTerm(agentId: string, eventId: string): Promise<void> {
    const memory = await this.readMemory(agentId);
    memory.shortTerm.push({
      eventId,
      timestamp: Date.now(),
    });

    // Keep only last 10 events
    if (memory.shortTerm.length > 10) {
      memory.shortTerm = memory.shortTerm.slice(-10);
    }

    await this.writeMemory(agentId, memory);
  }

  async addEpisodic(agentId: string, runId: string, summary: string): Promise<void> {
    const memory = await this.readMemory(agentId);
    memory.episodic.push({
      runId,
      summary,
    });
    await this.writeMemory(agentId, memory);
  }
}

