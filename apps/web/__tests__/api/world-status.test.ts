import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/world/status/route';
import { NextRequest } from 'next/server';
import * as supabaseModule from '@/lib/supabase';

vi.mock('@/lib/supabase');

describe('GET /api/world/status', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  it('should return initialized false when Supabase config is missing', async () => {
    // Clear all Supabase env vars
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_PROJECT_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_API_KEY;

    const request = new NextRequest('http://localhost/api/world/status');
    const response = await GET(request);
    const data = await response.json();

    // Restore env vars
    if (originalUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    if (originalKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;

    expect(response.status).toBe(200);
    expect(data.initialized).toBe(false);
    expect(data.hasWorld).toBe(false);
    expect(data.hasDungeons).toBe(false);
    // The error message may vary, just check that there's an error
    expect(data.errors.worldError).toBeDefined();
  });

  it('should return initialized true when world content exists', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

    (supabaseModule.supabase.from as any) = vi.fn()
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ id: 'world-1' }],
              error: null,
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [
              { id: 'dungeon-1', seed: 'test-seed', map: JSON.stringify({ name: 'Test Dungeon', depth: 5 }), created_at: new Date().toISOString() },
            ],
            error: null,
          }),
        }),
      });

    const request = new NextRequest('http://localhost/api/world/status');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.initialized).toBe(true);
    expect(data.hasWorld).toBe(true);
    expect(data.hasDungeons).toBe(true);
    expect(data.dungeonCount).toBe(1);
  });

  it('should handle database timeout gracefully', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          limit: vi.fn().mockImplementation(() => new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 6000)
          )),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/world/status');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.errors.worldError).toBeDefined();
  });

  it('should sort dungeons correctly (test dungeons last)', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

    const now = new Date();
    const oldDate = new Date(now.getTime() - 10000);

    (supabaseModule.supabase.from as any) = vi.fn()
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ id: 'world-1' }],
              error: null,
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [
              { id: 'dungeon-1', seed: 'abandoned-cellar', map: '{}', created_at: now.toISOString() },
              { id: 'dungeon-2', seed: 'normal-dungeon', map: '{}', created_at: oldDate.toISOString() },
            ],
            error: null,
          }),
        }),
      });

    const request = new NextRequest('http://localhost/api/world/status');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.dungeons[0].seed).toBe('normal-dungeon');
    expect(data.dungeons[1].seed).toBe('abandoned-cellar');
  });

  // Note: Error handling is tested via timeout test above
  // The route has complex error handling with Promise.race that's difficult to mock
});

