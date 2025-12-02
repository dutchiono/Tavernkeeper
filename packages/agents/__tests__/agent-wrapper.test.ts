import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AgentWrapper } from '../src/agent-wrapper';
import type { ElizaAgentConfig, Plugin } from '../src/types/eliza';
import type { Action, GameEvent } from '@innkeeper/lib';

describe('AgentWrapper', () => {
  let config: ElizaAgentConfig;
  let wrapper: AgentWrapper;

  beforeEach(() => {
    config = {
      id: 'test-agent',
      name: 'Test Agent',
      persona: {
        name: 'Test',
        traits: [],
      },
      memory: {
        shortTerm: [],
        episodic: [],
        longTerm: {},
      },
    };

    wrapper = new AgentWrapper(config, 'http://localhost:3000', 'test-key');
  });

  describe('registerPlugin', () => {
    it('should register a plugin', () => {
      const plugin: Plugin = {
        name: 'test-plugin',
      } as Plugin;

      wrapper.registerPlugin(plugin);
      // Plugin should be registered (no error thrown)
      expect(true).toBe(true);
    });
  });

  describe('initialize', () => {
    it('should initialize agent', async () => {
      await wrapper.initialize();
      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('updatePersona', () => {
    it('should update persona', async () => {
      const newPersona = {
        name: 'Updated Agent',
        traits: ['brave'],
      };

      await wrapper.updatePersona(newPersona);
      expect(config.persona).toEqual(newPersona);
    });
  });

  describe('updateMemory', () => {
    it('should update memory', async () => {
      const newMemory = {
        shortTerm: [{ eventId: 'event-1', timestamp: Date.now() }],
        episodic: [],
        longTerm: {},
      };

      await wrapper.updateMemory(newMemory);
      expect(config.memory).toEqual(newMemory);
    });
  });

  describe('getAction', () => {
    it('should return null if no hook provided', async () => {
      const action = await wrapper.getAction({
        turnNumber: 1,
        events: [],
        worldState: {},
      });

      expect(action).toBeNull();
    });

    it('should call onTurn hook if provided', async () => {
      const mockAction: Action = {
        type: 'move',
        actorId: 'test-agent',
        target: { x: 5, y: 10 },
      };

      config.hooks = {
        onTurn: vi.fn().mockResolvedValue(mockAction),
      };

      wrapper = new AgentWrapper(config, 'http://localhost:3000', 'test-key');
      const action = await wrapper.getAction({
        turnNumber: 1,
        events: [],
        worldState: {},
      });

      expect(action).toEqual(mockAction);
      expect(config.hooks?.onTurn).toHaveBeenCalledWith(1, []);
    });
  });

  describe('submitAction', () => {
    it('should throw error if game-action-plugin not registered', async () => {
      const action: Action = {
        type: 'move',
        actorId: 'test-agent',
        target: { x: 0, y: 0 },
      };

      await expect(wrapper.submitAction(action)).rejects.toThrow('game-action-plugin not registered');
    });
  });

  describe('onRunStart', () => {
    it('should call onRunStart hook if provided', async () => {
      const mockHook = vi.fn();
      config.hooks = {
        onRunStart: mockHook,
      };

      wrapper = new AgentWrapper(config, 'http://localhost:3000', 'test-key');
      await wrapper.onRunStart('run-123');

      expect(mockHook).toHaveBeenCalledWith('run-123');
    });
  });

  describe('onRunEnd', () => {
    it('should call onRunEnd hook if provided', async () => {
      const mockHook = vi.fn();
      config.hooks = {
        onRunEnd: mockHook,
      };

      wrapper = new AgentWrapper(config, 'http://localhost:3000', 'test-key');
      await wrapper.onRunEnd('run-123', 'victory');

      expect(mockHook).toHaveBeenCalledWith('run-123', 'victory');
    });
  });
});

