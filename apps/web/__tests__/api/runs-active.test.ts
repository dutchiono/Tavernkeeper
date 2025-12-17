import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/runs/route';
import { NextRequest } from 'next/server';
import * as supabaseModule from '@/lib/supabase';

vi.mock('@/lib/supabase');

describe('GET /api/runs (active runs)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return active run for wallet', async () => {
    const mockActiveRun = {
      id: 'run-123',
      dungeon_id: 'dungeon-123',
      party: ['char-1', 'char-2'],
      seed: 'test-seed',
      start_time: new Date().toISOString(),
      end_time: null, // Active run has no end_time
      result: null,
      status: 'running',
      wallet_address: '0xwallet123',
    };

    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          is: vi.fn().mockReturnValue({
            not: vi.fn().mockReturnValue({
              not: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({
                    data: [mockActiveRun],
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/runs?wallet=0xwallet123');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.activeRun).toEqual(mockActiveRun);
    expect(data.activeRun.end_time).toBeNull();
  });

  it('should return null if no active run exists', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          is: vi.fn().mockReturnValue({
            not: vi.fn().mockReturnValue({
              not: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({
                    data: [], // No active runs
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/runs?wallet=0xwallet123');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.activeRun).toBeNull();
  });

  it('should return 400 if wallet address is missing', async () => {
    const request = new NextRequest('http://localhost/api/runs');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Wallet address required');
  });

  it('should exclude completed runs', async () => {
    const mockCompletedRun = {
      id: 'run-456',
      end_time: new Date().toISOString(), // Has end_time = completed
      status: 'completed',
    };

    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          is: vi.fn().mockReturnValue({
            not: vi.fn().mockReturnValue({
              not: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({
                    data: [], // Completed runs should be filtered out
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/runs?wallet=0xwallet123');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.activeRun).toBeNull();
  });

  it('should exclude failed runs', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          is: vi.fn().mockReturnValue({
            not: vi.fn().mockReturnValue({
              not: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({
                    data: [], // Failed runs should be filtered out
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/runs?wallet=0xwallet123');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.activeRun).toBeNull();
  });

  it('should return most recent active run if multiple exist', async () => {
    const olderRun = {
      id: 'run-old',
      start_time: new Date('2024-01-01').toISOString(),
      end_time: null,
      status: 'running',
    };

    const newerRun = {
      id: 'run-new',
      start_time: new Date('2024-01-02').toISOString(),
      end_time: null,
      status: 'running',
    };

    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          is: vi.fn().mockReturnValue({
            not: vi.fn().mockReturnValue({
              not: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({
                    data: [newerRun], // Should return most recent (ordered by start_time desc)
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/runs?wallet=0xwallet123');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.activeRun.id).toBe('run-new');
  });

  it('should handle database errors gracefully', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          is: vi.fn().mockReturnValue({
            not: vi.fn().mockReturnValue({
              not: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Database error' },
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/runs?wallet=0xwallet123');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch active runs');
  });
});

