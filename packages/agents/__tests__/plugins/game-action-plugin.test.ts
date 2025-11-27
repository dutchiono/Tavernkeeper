import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameActionPluginImpl } from '../../src/plugins/game-action-plugin';
import type { Action } from '@innkeeper/lib';

global.fetch = vi.fn();

describe('GameActionPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should submit action successfully', async () => {
    const plugin = new GameActionPluginImpl('http://localhost:3000/api');
    const mockEvents = [{ type: 'combat', id: 'event-1', timestamp: Date.now() }];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: mockEvents }),
    });

    const action: Action = {
      type: 'attack',
      actorId: 'agent-1',
      targetId: 'target-1',
    };

    const result = await plugin.submitAction('agent-1', action);

    expect(result.success).toBe(true);
    expect(result.events).toEqual(mockEvents);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/agents/agent-1/action',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ action }),
      })
    );
  });

  it('should handle API errors', async () => {
    const plugin = new GameActionPluginImpl();
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
    });

    const action: Action = {
      type: 'move',
      actorId: 'agent-1',
      target: { x: 0, y: 0 },
    };

    const result = await plugin.submitAction('agent-1', action);

    expect(result.success).toBe(false);
  });

  it('should handle network errors', async () => {
    const plugin = new GameActionPluginImpl();
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const action: Action = {
      type: 'move',
      actorId: 'agent-1',
      target: { x: 0, y: 0 },
    };

    const result = await plugin.submitAction('agent-1', action);

    expect(result.success).toBe(false);
  });
});

