import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/runs/[id]/route';
import { NextRequest } from 'next/server';
import * as supabaseModule from '@/lib/supabase';

vi.mock('@/lib/supabase');

describe('GET /api/runs/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return run with logs and events', async () => {
    const mockRun = {
      id: 'run-123',
      dungeon_id: 'dungeon-123',
      party: ['char-1', 'char-2'],
      start_time: new Date().toISOString(),
    };

    const mockRunLogs = [
      { id: 'log-1', run_id: 'run-123', text: 'Event 1', timestamp: new Date().toISOString() },
    ];

    const mockEvents = [
      { id: 'event-1', run_id: 'run-123', type: 'combat', timestamp: new Date().toISOString() },
    ];

    const mockDungeon = {
      id: 'dungeon-123',
      seed: 'dungeon-seed',
      map: { rooms: [] },
    };

    (supabaseModule.supabase.from as any) = vi.fn()
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockRun, error: null }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: mockRunLogs, error: null }),
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: mockEvents, error: null }),
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockDungeon, error: null }),
          }),
        }),
      });

    const request = new NextRequest('http://localhost/api/runs/run-123');
    const response = await GET(request, { params: { id: 'run-123' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('run-123');
    expect(data.runLogs).toEqual(mockRunLogs);
    expect(data.events).toEqual(mockEvents);
    expect(data.dungeon).toEqual(mockDungeon);
  });

  it('should return 404 if run not found', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/runs/invalid-id');
    const response = await GET(request, { params: { id: 'invalid-id' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Run not found');
  });

  it('should handle errors gracefully', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockImplementation(() => {
      throw new Error('Database error');
    });

    const request = new NextRequest('http://localhost/api/runs/run-123');
    const response = await GET(request, { params: { id: 'run-123' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch run');
  });
});

