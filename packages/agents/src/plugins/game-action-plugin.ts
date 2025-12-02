import type { Action, GameEvent } from '@innkeeper/lib';
import type { GameActionPlugin } from '../types/eliza';

/**
 * Game Action Plugin implementation
 * Submits agent actions to the game engine via API
 */
export class GameActionPluginImpl implements GameActionPlugin {
  name = 'game-action-plugin' as const;
  private apiUrl: string;

  constructor(apiUrl: string = 'http://localhost:3000/api') {
    this.apiUrl = apiUrl;
  }

  async submitAction(agentId: string, action: Action): Promise<{ success: boolean; events?: GameEvent[] }> {
    try {
      const response = await fetch(`${this.apiUrl}/agents/${agentId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit action: ${response.statusText}`);
      }

      const data = await response.json() as { events: GameEvent[] };
      return {
        success: true,
        events: data.events,
      };
    } catch (error) {
      console.error('Error submitting action:', error);
      return {
        success: false,
      };
    }
  }
}

