import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/agents/[id]/converse/route';
import { NextRequest } from 'next/server';
import * as supabaseModule from '@/lib/supabase';

vi.mock('@/lib/supabase');

describe('POST /api/agents/[id]/converse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update agent persona and memory', async () => {
    const mockAgent = {
      id: 'agent-123',
      persona: { name: 'Test Agent' },
      memory: {},
    };

    const updateMock = vi.fn().mockResolvedValue({ data: null, error: null });

    (supabaseModule.supabase.from as any) = vi.fn()
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAgent, error: null }),
          }),
        }),
      })
      .mockReturnValueOnce({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      });

    const request = new NextRequest('http://localhost/api/agents/agent-123/converse', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello',
        persona: { name: 'Updated Agent', aggression: 0.8 },
        memory: { shortTerm: [] },
      }),
    });

    const response = await POST(request, { params: { id: 'agent-123' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.agentId).toBe('agent-123');
    expect(data.message).toBe('Hello');
  });

  it('should return 404 if agent not found', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost/api/agents/invalid-id/converse', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });

    const response = await POST(request, { params: { id: 'invalid-id' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Agent not found');
  });

  it('should handle errors gracefully', async () => {
    (supabaseModule.supabase.from as any) = vi.fn().mockImplementation(() => {
      throw new Error('Database error');
    });

    const request = new NextRequest('http://localhost/api/agents/agent-123/converse', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });

    const response = await POST(request, { params: { id: 'agent-123' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to process conversation');
  });
});

