import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/parties/[id]/status/route';
import { NextRequest } from 'next/server';
import * as partyServiceModule from '@/lib/services/partyService';
import * as supabaseModule from '@/lib/supabase';

vi.mock('@/lib/services/partyService');
vi.mock('@/lib/supabase');

describe('GET /api/parties/[id]/status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 404 when party not found', async () => {
    (partyServiceModule.getParty as any) = vi.fn().mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/parties/party-123/status');
    const response = await GET(request, { params: Promise.resolve({ id: 'party-123' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Party not found');
  });

  it('should return party status with members', async () => {
    const mockParty = {
      id: 'party-123',
      status: 'active',
      max_members: 4,
    };

    const mockMembers = [
      { hero_token_id: 'hero-1' },
      { hero_token_id: 'hero-2' },
    ];

    (partyServiceModule.getParty as any) = vi.fn().mockResolvedValue(mockParty);
    (partyServiceModule.getPartyMembers as any) = vi.fn().mockResolvedValue(mockMembers);

    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        contains: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [],
            }),
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/parties/party-123/status');
    const response = await GET(request, { params: Promise.resolve({ id: 'party-123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('party-123');
    expect(data.members).toEqual(mockMembers);
    expect(data.memberCount).toBe(2);
    expect(data.isFull).toBe(false);
  });

  it('should include runId when party is in progress', async () => {
    const mockParty = {
      id: 'party-123',
      status: 'in_progress',
      max_members: 4,
    };

    const mockMembers = [
      { hero_token_id: 'hero-1' },
    ];

    (partyServiceModule.getParty as any) = vi.fn().mockResolvedValue(mockParty);
    (partyServiceModule.getPartyMembers as any) = vi.fn().mockResolvedValue(mockMembers);

    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        contains: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ id: 'run-123' }],
            }),
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/parties/party-123/status');
    const response = await GET(request, { params: Promise.resolve({ id: 'party-123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.runId).toBe('run-123');
  });

  it('should handle errors gracefully', async () => {
    (partyServiceModule.getParty as any) = vi.fn().mockRejectedValue(new Error('Service error'));

    const request = new NextRequest('http://localhost/api/parties/party-123/status');
    const response = await GET(request, { params: Promise.resolve({ id: 'party-123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch party status');
  });
});

