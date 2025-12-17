import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/world/progress/route';
import { NextRequest } from 'next/server';

describe('GET /api/world/progress', () => {
  it('should return status ok', async () => {
    const request = new NextRequest('http://localhost/api/world/progress');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.message).toContain('API is responding');
    expect(data.timestamp).toBeDefined();
  });

  it('should include timestamp in response', async () => {
    const request = new NextRequest('http://localhost/api/world/progress');
    const response = await GET(request);
    const data = await response.json();

    expect(data.timestamp).toBeDefined();
    expect(new Date(data.timestamp).getTime()).toBeGreaterThan(0);
  });
});

