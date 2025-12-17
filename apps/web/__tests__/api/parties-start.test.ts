import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/parties/[id]/start/route';
import { NextRequest } from 'next/server';
import * as partyServiceModule from '@/lib/services/partyService';

vi.mock('@/lib/services/partyService');

describe('POST /api/parties/[id]/start', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when dungeonId is missing', async () => {
    const request = new NextRequest('http://localhost/api/parties/party-123/start', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request, { params: Promise.resolve({ id: 'party-123' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Dungeon ID is required');
  });

  it('should successfully start a run', async () => {
    (partyServiceModule.startRun as any) = vi.fn().mockResolvedValue(true);

    const request = new NextRequest('http://localhost/api/parties/party-123/start', {
      method: 'POST',
      body: JSON.stringify({ dungeonId: 'dungeon-123' }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: 'party-123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(partyServiceModule.startRun).toHaveBeenCalledWith('party-123', 'dungeon-123');
  });

  it('should return 500 when startRun fails', async () => {
    (partyServiceModule.startRun as any) = vi.fn().mockResolvedValue(false);

    const request = new NextRequest('http://localhost/api/parties/party-123/start', {
      method: 'POST',
      body: JSON.stringify({ dungeonId: 'dungeon-123' }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: 'party-123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to start run');
  });

  it('should handle service errors', async () => {
    (partyServiceModule.startRun as any) = vi.fn().mockRejectedValue(new Error('Service error'));

    const request = new NextRequest('http://localhost/api/parties/party-123/start', {
      method: 'POST',
      body: JSON.stringify({ dungeonId: 'dungeon-123' }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: 'party-123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});

