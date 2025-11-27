import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryPluginImpl } from '../../src/plugins/memory-plugin';
import type { AgentMemory } from '@innkeeper/lib';

global.fetch = vi.fn();

describe('MemoryPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('readMemory', () => {
    it('should read memory successfully', async () => {
      const plugin = new MemoryPluginImpl('http://localhost:3000/api');
      const mockMemory: AgentMemory = {
        shortTerm: [],
        episodic: [],
        longTerm: {},
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMemory,
      });

      const memory = await plugin.readMemory('agent-1');

      expect(memory).toEqual(mockMemory);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/agents/agent-1/memory');
    });

    it('should return default memory on error', async () => {
      const plugin = new MemoryPluginImpl();
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      const memory = await plugin.readMemory('agent-1');

      expect(memory).toEqual({
        shortTerm: [],
        episodic: [],
        longTerm: {},
      });
    });
  });

  describe('writeMemory', () => {
    it('should write memory successfully', async () => {
      const plugin = new MemoryPluginImpl('http://localhost:3000/api');
      const memory: AgentMemory = {
        shortTerm: [{ eventId: 'event-1', timestamp: Date.now() }],
        episodic: [],
        longTerm: {},
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
      });

      await plugin.writeMemory('agent-1', memory);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/agents/agent-1/memory',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(memory),
        })
      );
    });

    it('should throw error on failure', async () => {
      const plugin = new MemoryPluginImpl();
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Server Error',
      });

      const memory: AgentMemory = {
        shortTerm: [],
        episodic: [],
        longTerm: {},
      };

      await expect(plugin.writeMemory('agent-1', memory)).rejects.toThrow();
    });
  });

  describe('updateShortTerm', () => {
    it('should add event to short term memory', async () => {
      const plugin = new MemoryPluginImpl();
      const mockMemory: AgentMemory = {
        shortTerm: [],
        episodic: [],
        longTerm: {},
      };

      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => mockMemory })
        .mockResolvedValueOnce({ ok: true });

      await plugin.updateShortTerm('agent-1', 'event-123');

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should limit short term memory to 10 events', async () => {
      const plugin = new MemoryPluginImpl();
      const mockMemory: AgentMemory = {
        shortTerm: Array.from({ length: 10 }, (_, i) => ({
          eventId: `event-${i}`,
          timestamp: Date.now() - i * 1000,
        })),
        episodic: [],
        longTerm: {},
      };

      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => mockMemory })
        .mockResolvedValueOnce({ ok: true });

      await plugin.updateShortTerm('agent-1', 'event-new');

      const writeCall = (global.fetch as any).mock.calls[1];
      const writtenMemory = JSON.parse(writeCall[1].body);
      expect(writtenMemory.shortTerm).toHaveLength(10);
    });
  });

  describe('addEpisodic', () => {
    it('should add episodic memory', async () => {
      const plugin = new MemoryPluginImpl();
      const mockMemory: AgentMemory = {
        shortTerm: [],
        episodic: [],
        longTerm: {},
      };

      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => mockMemory })
        .mockResolvedValueOnce({ ok: true });

      await plugin.addEpisodic('agent-1', 'run-123', 'Summary of run');

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});

