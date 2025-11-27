import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/frames/action/route';
import { NextRequest } from 'next/server';

describe('POST /api/frames/action', () => {
  it('should process frame action', async () => {
    const request = new NextRequest('http://localhost/api/frames/action', {
      method: 'POST',
      body: JSON.stringify({
        buttonIndex: 1,
        inputText: 'test',
        state: { step: 'start' },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.buttonIndex).toBe(1);
    expect(data.inputText).toBe('test');
    expect(data.nextFrame).toBeDefined();
  });

  it('should handle errors gracefully', async () => {
    const request = new NextRequest('http://localhost/api/frames/action', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to process frame action');
  });
});

