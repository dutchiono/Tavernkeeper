import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/frames/validate/route';
import { NextRequest } from 'next/server';

describe('POST /api/frames/validate', () => {
  it('should validate frame signature', async () => {
    const request = new NextRequest('http://localhost/api/frames/validate', {
      method: 'POST',
      body: JSON.stringify({
        signature: 'test-signature',
        message: 'test-message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.valid).toBe(true);
  });

  it('should return 400 if signature is missing', async () => {
    const request = new NextRequest('http://localhost/api/frames/validate', {
      method: 'POST',
      body: JSON.stringify({
        message: 'test-message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing signature');
  });

  it('should return 400 if message is missing', async () => {
    const request = new NextRequest('http://localhost/api/frames/validate', {
      method: 'POST',
      body: JSON.stringify({
        signature: 'test-signature',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing signature or message');
  });

  it('should handle errors gracefully', async () => {
    const request = new NextRequest('http://localhost/api/frames/validate', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to validate signature');
  });
});

