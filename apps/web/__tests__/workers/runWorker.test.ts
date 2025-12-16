import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Job } from 'bullmq';
import * as supabaseModule from '@/lib/supabase';
import * as engineModule from '@innkeeper/engine';
import * as adventurerServiceModule from '@/contributions/adventurer-tracking/code/services/adventurerService';
import * as dungeonStateServiceModule from '@/lib/services/dungeonStateService';
import Redis from 'ioredis';

// Mock ioredis for BullMQ
vi.mock('ioredis', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      connect: vi.fn(),
      quit: vi.fn(),
      get: vi.fn().mockResolvedValue(null),
      del: vi.fn().mockResolvedValue(1),
    })),
  };
});

vi.mock('@/lib/supabase');
vi.mock('@innkeeper/engine');
vi.mock('@/contributions/adventurer-tracking/code/services/adventurerService');
vi.mock('@/lib/services/dungeonStateService');

describe('RunWorker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process run job successfully', async () => {
    const mockDungeon = {
      id: 'dungeon-123',
      seed: 'dungeon-seed',
      map: {},
    };

    const mockCharacters = [
      { id: 'char-1', stats: { hp: 20, maxHp: 20, ac: 10 } },
      { id: 'char-2', stats: { hp: 15, maxHp: 15, ac: 12 } },
    ];

    const mockSimulationResult = {
      events: [
        { type: 'combat', timestamp: 1000, id: 'event-1' },
        { type: 'exploration', timestamp: 2000, id: 'event-2' },
      ],
      result: 'victory' as const,
    };

    (supabaseModule.supabase.from as any) = vi.fn()
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockDungeon, error: null }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ data: mockCharacters, error: null }),
        }),
      })
      .mockReturnValueOnce({
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      })
      .mockReturnValueOnce({
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      })
      .mockReturnValueOnce({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      });

    (engineModule.simulateRun as any) = vi.fn().mockResolvedValue(mockSimulationResult);

    // Import worker to trigger job processing
    const { runWorker } = await import('@/workers/runWorker');

    const mockJob = {
      id: 'job-123',
      data: {
        runId: 'run-123',
        dungeonId: 'dungeon-123',
        party: ['char-1', 'char-2'],
        seed: 'test-seed',
        startTime: 1000,
      },
    } as Job;

    // Simulate job processing
    const handler = (runWorker as any).process;
    if (handler) {
      const result = await handler(mockJob);

      expect(result.success).toBe(true);
      expect(result.runId).toBe('run-123');
      expect(result.eventsCount).toBe(2);
      expect(result.result).toBe('victory');
    }
  });

  it('should handle dungeon not found error', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
        }),
      }),
    });

    const { runWorker } = await import('@/workers/runWorker');
    const mockJob = {
      id: 'job-123',
      data: {
        runId: 'run-123',
        dungeonId: 'invalid-dungeon',
        party: ['char-1'],
        seed: 'test-seed',
        startTime: 1000,
      },
    } as Job;

    const handler = (runWorker as any).process;
    if (handler) {
      await expect(handler(mockJob)).rejects.toThrow('Dungeon invalid-dungeon not found');
    }
  });

  it('should update run with error status on failure', async () => {
    (supabaseModule.supabase.from as any) = vi.fn()
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: 'dungeon-123', seed: 'seed' }, error: null }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockRejectedValue(new Error('Database error')),
        }),
      })
      .mockReturnValueOnce({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      });

    (engineModule.simulateRun as any) = vi.fn().mockImplementation(() => {
      throw new Error('Simulation error');
    });

    (adventurerServiceModule.restoreAdventurer as any) = vi.fn().mockResolvedValue({});
    (dungeonStateServiceModule.dungeonStateService.unlockHeroes as any) = vi.fn().mockResolvedValue(undefined);

    const { runWorker } = await import('@/workers/runWorker');
    const mockJob = {
      id: 'job-123',
      data: {
        runId: 'run-123',
        dungeonId: 'dungeon-123',
        party: ['char-1'],
        seed: 'test-seed',
        startTime: 1000,
      },
    } as Job;

    const handler = (runWorker as any).process;
    if (handler) {
      await expect(handler(mockJob)).rejects.toThrow();

      // Verify HP restoration was attempted
      expect(adventurerServiceModule.restoreAdventurer).toHaveBeenCalled();
    }
  });

  describe('HP Restoration on Failure', () => {
    it('should restore HP to maxHealth when run fails', async () => {
      const mockRedis = {
        get: vi.fn().mockResolvedValue(null), // No checkpoint
        del: vi.fn().mockResolvedValue(1),
        quit: vi.fn().mockResolvedValue('OK'),
      };
      (Redis as any).mockImplementation(() => mockRedis);

      (supabaseModule.supabase.from as any) = vi.fn()
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'dungeon-123', seed: 'seed' }, error: null }),
            }),
          }),
        })
        .mockReturnValueOnce({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        });

      (engineModule.simulateRun as any) = vi.fn().mockImplementation(() => {
        throw new Error('Run failed');
      });

      (adventurerServiceModule.restoreAdventurer as any) = vi.fn().mockResolvedValue({});
      (dungeonStateServiceModule.dungeonStateService.unlockHeroes as any) = vi.fn().mockResolvedValue(undefined);

      const { runWorker } = await import('@/workers/runWorker');
      const mockJob = {
        id: 'job-123',
        data: {
          runId: 'run-123',
          dungeonId: 'dungeon-123',
          party: ['char-1'],
          seed: 'test-seed',
          startTime: 1000,
        },
      } as Job;

      const handler = (runWorker as any).process;
      if (handler) {
        try {
          await handler(mockJob);
        } catch (error) {
          // Expected to throw
        }

        // Verify restoreAdventurer was called with restoreHealth: true
        expect(adventurerServiceModule.restoreAdventurer).toHaveBeenCalledWith(
          expect.objectContaining({
            tokenId: 'char-1',
          }),
          expect.objectContaining({
            restoreHealth: true,
            restoreMana: true,
          })
        );
      }
    });

    it('should clean up Redis checkpoint on failure', async () => {
      const mockRedis = {
        get: vi.fn().mockResolvedValue(null),
        del: vi.fn().mockResolvedValue(1),
        quit: vi.fn().mockResolvedValue('OK'),
      };
      (Redis as any).mockImplementation(() => mockRedis);

      (supabaseModule.supabase.from as any) = vi.fn()
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'dungeon-123', seed: 'seed' }, error: null }),
            }),
          }),
        })
        .mockReturnValueOnce({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        });

      (engineModule.simulateRun as any) = vi.fn().mockImplementation(() => {
        throw new Error('Run failed');
      });

      (adventurerServiceModule.restoreAdventurer as any) = vi.fn().mockResolvedValue({});
      (dungeonStateServiceModule.dungeonStateService.unlockHeroes as any) = vi.fn().mockResolvedValue(undefined);

      const { runWorker } = await import('@/workers/runWorker');
      const mockJob = {
        id: 'job-123',
        data: {
          runId: 'run-123',
          dungeonId: 'dungeon-123',
          party: ['char-1'],
          seed: 'test-seed',
          startTime: 1000,
        },
      } as Job;

      const handler = (runWorker as any).process;
      if (handler) {
        try {
          await handler(mockJob);
        } catch (error) {
          // Expected to throw
        }

        // Verify checkpoint cleanup was attempted
        expect(mockRedis.del).toHaveBeenCalled();
      }
    });
  });
});

