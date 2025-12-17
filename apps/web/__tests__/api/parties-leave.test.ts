import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/parties/[id]/leave/route';
import { NextRequest } from 'next/server';
import * as supabaseModule from '@/lib/supabase';

vi.mock('@/lib/supabase');

describe('POST /api/parties/[id]/leave', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when partyId is missing', async () => {
    const request = new NextRequest('http://localhost/api/parties/leave', {
      method: 'POST',
      body: JSON.stringify({ heroTokenId: '123' }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: '' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should return 400 when heroTokenId is missing', async () => {
    const request = new NextRequest('http://localhost/api/parties/party-123/leave', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request, { params: Promise.resolve({ id: 'party-123' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should successfully remove member from party', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: null,
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/parties/party-123/leave', {
      method: 'POST',
      body: JSON.stringify({ heroTokenId: 'hero-123' }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: 'party-123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should handle database errors', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: { message: 'Database error' },
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/parties/party-123/leave', {
      method: 'POST',
      body: JSON.stringify({ heroTokenId: 'hero-123' }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: 'party-123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Database error');
  });

  it('should handle JSON parsing errors', async () => {
    const request = new NextRequest('http://localhost/api/parties/party-123/leave', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request, { params: Promise.resolve({ id: 'party-123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
  });
});

