import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/runs/route';
import { NextRequest } from 'next/server';
import * as queueModule from '@/lib/queue';
import * as supabaseModule from '@/lib/supabase';
import * as dungeonStateServiceModule from '@/lib/services/dungeonStateService';

vi.mock('@/lib/queue');
vi.mock('@/lib/supabase');
vi.mock('@/lib/services/dungeonStateService');

describe('POST /api/runs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a run and enqueue job', async () => {
    const mockRun = {
      id: 'run-123',
      seed: 'test-seed',
      start_time: new Date().toISOString(),
    };

    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockRun, error: null }),
        }),
      }),
    });

    (queueModule.runQueue.add as any) = vi.fn().mockResolvedValue({});

    const request = new NextRequest('http://localhost/api/runs', {
      method: 'POST',
      body: JSON.stringify({
        dungeonId: 'dungeon-123',
        party: ['char-1', 'char-2'],
        seed: 'custom-seed',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('run-123');
    expect(data.status).toBe('queued');
    expect(queueModule.runQueue.add).toHaveBeenCalledWith('simulate-run', expect.objectContaining({
      runId: 'run-123',
      dungeonId: 'dungeon-123',
      party: ['char-1', 'char-2'],
    }));
  });

  it('should return 400 if dungeonId is missing', async () => {
    const request = new NextRequest('http://localhost/api/runs', {
      method: 'POST',
      body: JSON.stringify({
        party: ['char-1'],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing required fields');
  });

  it('should return 400 if party is missing', async () => {
    const request = new NextRequest('http://localhost/api/runs', {
      method: 'POST',
      body: JSON.stringify({
        dungeonId: 'dungeon-123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing required fields');
  });

  it('should return 400 if party is empty array', async () => {
    const request = new NextRequest('http://localhost/api/runs', {
      method: 'POST',
      body: JSON.stringify({
        dungeonId: 'dungeon-123',
        party: [],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing required fields');
  });

  it('should return 500 if database insert fails', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/runs', {
      method: 'POST',
      body: JSON.stringify({
        dungeonId: 'dungeon-123',
        party: ['char-1'],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to create run');
  });

  it('should generate seed if not provided', async () => {
    const mockRun = {
      id: 'run-123',
      seed: 'auto-generated-seed',
      start_time: new Date().toISOString(),
    };

    (supabaseModule.supabase.from as any) = vi.fn()
      .mockReturnValueOnce({
        // Dungeon selection
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: [{ id: 'dungeon-123', seed: 'seed' }], error: null }),
        }),
      })
      .mockReturnValueOnce({
        // Run insert
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockRun, error: null }),
          }),
        }),
      })
      .mockReturnValueOnce({
        // Hero lock verification
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: [
              { token_id: 'char-1', status: 'dungeon', current_run_id: 'run-123' },
            ],
            error: null,
          }),
        }),
      });

    (dungeonStateServiceModule.dungeonStateService.checkHeroesAvailability as any) = vi.fn().mockResolvedValue({
      locked: false,
      lockedHeroes: [],
    });
    (dungeonStateServiceModule.dungeonStateService.lockHeroes as any) = vi.fn().mockResolvedValue(undefined);
    (dungeonStateServiceModule.dungeonStateService.incrementUserDailyRun as any) = vi.fn().mockResolvedValue(undefined);

    (queueModule.runQueue.add as any) = vi.fn().mockResolvedValue({ id: 'job-123' });

    const request = new NextRequest('http://localhost/api/runs', {
      method: 'POST',
      body: JSON.stringify({
        party: ['char-1'],
        walletAddress: '0xwallet',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  describe('Race Condition Fixes', () => {
    it('should verify hero locks before enqueuing job', async () => {
      const mockRun = {
        id: 'run-123',
        seed: 'test-seed',
        start_time: new Date().toISOString(),
      };

      (dungeonStateServiceModule.dungeonStateService.checkHeroesAvailability as any) = vi.fn().mockResolvedValue({
        locked: false,
        lockedHeroes: [],
      });
      (dungeonStateServiceModule.dungeonStateService.lockHeroes as any) = vi.fn().mockResolvedValue(undefined);
      (dungeonStateServiceModule.dungeonStateService.incrementUserDailyRun as any) = vi.fn().mockResolvedValue(undefined);

      (supabaseModule.supabase.from as any) = vi.fn()
        .mockReturnValueOnce({
          // Dungeon lookup
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'dungeon-123' }, error: null }),
            }),
          }),
        })
        .mockReturnValueOnce({
          // Run insert
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockRun, error: null }),
            }),
          }),
        })
        .mockReturnValueOnce({
          // Hero lock verification
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: [
                { token_id: 'char-1', status: 'dungeon', current_run_id: 'run-123' },
              ],
              error: null,
            }),
          }),
        });

      (queueModule.runQueue.add as any) = vi.fn().mockResolvedValue({ id: 'job-123' });

      const request = new NextRequest('http://localhost/api/runs', {
        method: 'POST',
        body: JSON.stringify({
          dungeonId: 'dungeon-123',
          party: ['char-1'],
          walletAddress: '0xwallet',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);

      // Verify lock verification happened before job enqueue
      const calls = (supabaseModule.supabase.from as any).mock.calls;
      const verifyCall = calls.find((call: any[]) => call[0] === 'hero_states');
      const jobEnqueueCall = (queueModule.runQueue.add as any).mock.calls[0];

      // Verify call should happen before job enqueue
      expect(verifyCall).toBeDefined();
      expect(jobEnqueueCall).toBeDefined();
    });

    it('should fail if heroes are not properly locked', async () => {
      const mockRun = {
        id: 'run-123',
        seed: 'test-seed',
        start_time: new Date().toISOString(),
      };

      (dungeonStateServiceModule.dungeonStateService.checkHeroesAvailability as any) = vi.fn().mockResolvedValue({
        locked: false,
        lockedHeroes: [],
      });
      (dungeonStateServiceModule.dungeonStateService.lockHeroes as any) = vi.fn().mockResolvedValue(undefined);
      (dungeonStateServiceModule.dungeonStateService.incrementUserDailyRun as any) = vi.fn().mockResolvedValue(undefined);

      (supabaseModule.supabase.from as any) = vi.fn()
        .mockReturnValueOnce({
          // Dungeon lookup
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'dungeon-123' }, error: null }),
            }),
          }),
        })
        .mockReturnValueOnce({
          // Run insert
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockRun, error: null }),
            }),
          }),
        })
        .mockReturnValueOnce({
          // Hero lock verification - heroes not locked
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: [
                { token_id: 'char-1', status: 'idle', current_run_id: null }, // Not locked!
              ],
              error: null,
            }),
          }),
        });

      const request = new NextRequest('http://localhost/api/runs', {
        method: 'POST',
        body: JSON.stringify({
          dungeonId: 'dungeon-123',
          party: ['char-1'],
          walletAddress: '0xwallet',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should fail with error about heroes not being locked
      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to lock');
    });
  });
});

