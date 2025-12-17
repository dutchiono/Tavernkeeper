import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/runs/[id]/events/route';
import { NextRequest } from 'next/server';
import * as supabaseModule from '@/lib/supabase';

vi.mock('@/lib/supabase');

describe('GET /api/runs/[id]/events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return events for a run', async () => {
    const mockEvents = [
      {
        id: 'event-1',
        run_id: 'run-123',
        type: 'combat',
        scheduled_delivery_time: new Date(Date.now() - 1000).toISOString(),
        timestamp: new Date().toISOString(),
      },
    ];

    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockEvents,
              error: null,
            }),
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/runs/run-123/events');
    const response = await GET(request, { params: Promise.resolve({ id: 'run-123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.events).toEqual(mockEvents);
  });

  it('should filter events by since parameter', async () => {
    const now = new Date();
    const oldEvent = {
      id: 'event-1',
      run_id: 'run-123',
      scheduled_delivery_time: new Date(now.getTime() - 5000).toISOString(),
      timestamp: new Date(now.getTime() - 5000).toISOString(),
    };
    const newEvent = {
      id: 'event-2',
      run_id: 'run-123',
      scheduled_delivery_time: new Date(now.getTime() - 1000).toISOString(),
      timestamp: new Date(now.getTime() - 1000).toISOString(),
    };

    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: [oldEvent, newEvent],
              error: null,
            }),
          }),
        }),
      }),
    });

    const since = new Date(now.getTime() - 2000).toISOString();
    const request = new NextRequest(`http://localhost/api/runs/run-123/events?since=${since}`);
    const response = await GET(request, { params: Promise.resolve({ id: 'run-123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.events.length).toBe(1);
    expect(data.events[0].id).toBe('event-2');
  });

  it('should only return events ready to deliver', async () => {
    const now = new Date();
    const readyEvent = {
      id: 'event-1',
      run_id: 'run-123',
      scheduled_delivery_time: new Date(now.getTime() - 1000).toISOString(),
      timestamp: new Date().toISOString(),
    };
    const futureEvent = {
      id: 'event-2',
      run_id: 'run-123',
      scheduled_delivery_time: new Date(now.getTime() + 5000).toISOString(),
      timestamp: new Date().toISOString(),
    };

    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: [readyEvent, futureEvent],
              error: null,
            }),
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/runs/run-123/events');
    const response = await GET(request, { params: Promise.resolve({ id: 'run-123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.events.length).toBe(1);
    expect(data.events[0].id).toBe('event-1');
  });

  it('should handle database errors', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/runs/run-123/events');
    const response = await GET(request, { params: Promise.resolve({ id: 'run-123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch events');
  });

  it('should handle exceptions gracefully', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const request = new NextRequest('http://localhost/api/runs/run-123/events');
    const response = await GET(request, { params: Promise.resolve({ id: 'run-123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch run events');
  });
});

