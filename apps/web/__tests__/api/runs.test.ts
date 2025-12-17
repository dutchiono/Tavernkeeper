import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/runs/route';
import { NextRequest } from 'next/server';
import * as queueModule from '@/lib/queue';
import * as supabaseModule from '@/lib/supabase';

vi.mock('@/lib/queue');
vi.mock('@/lib/supabase');

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
        party: ['char-1'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});

