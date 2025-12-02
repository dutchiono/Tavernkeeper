import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/dungeons/[id]/map/route';
import { NextRequest } from 'next/server';
import * as supabaseModule from '@/lib/supabase';

vi.mock('@/lib/supabase');

describe('GET /api/dungeons/[id]/map', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return dungeon map data', async () => {
    const mockDungeon = {
      id: 'dungeon-123',
      seed: 'dungeon-seed',
      map: {
        rooms: [{ id: 'room-1', x: 0, y: 0 }],
        tiles: [[1, 1, 1]],
      },
    };

    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockDungeon, error: null }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/dungeons/dungeon-123/map');
    const response = await GET(request, { params: { id: 'dungeon-123' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('dungeon-123');
    expect(data.seed).toBe('dungeon-seed');
    expect(data.map).toEqual(mockDungeon.map);
  });

  it('should return 404 if dungeon not found', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/dungeons/invalid-id/map');
    const response = await GET(request, { params: { id: 'invalid-id' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Dungeon not found');
  });

  it('should handle errors gracefully', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockImplementation(() => {
      throw new Error('Database error');
    });

    const request = new NextRequest('http://localhost/api/dungeons/dungeon-123/map');
    const response = await GET(request, { params: { id: 'dungeon-123' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch dungeon map');
  });
});

