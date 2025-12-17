import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/runs/stats/route';
import { NextRequest } from 'next/server';
import * as dungeonStateServiceModule from '@/lib/services/dungeonStateService';

vi.mock('@/lib/services/dungeonStateService');

describe('GET /api/runs/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when wallet is missing', async () => {
    const request = new NextRequest('http://localhost/api/runs/stats');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Wallet address required');
  });

  it('should return daily stats for a wallet', async () => {
    (dungeonStateServiceModule.dungeonStateService.getUserDailyStats as any) = vi.fn().mockResolvedValue({
      dailyRuns: 1,
      needsReset: false,
    });

    const request = new NextRequest('http://localhost/api/runs/stats?wallet=0xwallet');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.dailyRuns).toBe(1);
    expect(data.freeRunsLimit).toBe(2);
    expect(data.remainingFreeRuns).toBe(1);
  });

  it('should reset daily runs when needsReset is true', async () => {
    (dungeonStateServiceModule.dungeonStateService.getUserDailyStats as any) = vi.fn().mockResolvedValue({
      dailyRuns: 5,
      needsReset: true,
    });

    const request = new NextRequest('http://localhost/api/runs/stats?wallet=0xwallet');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.dailyRuns).toBe(0);
    expect(data.remainingFreeRuns).toBe(2);
  });

  it('should handle errors gracefully', async () => {
    (dungeonStateServiceModule.dungeonStateService.getUserDailyStats as any) = vi.fn().mockRejectedValue(
      new Error('Service error')
    );

    const request = new NextRequest('http://localhost/api/runs/stats?wallet=0xwallet');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch stats');
  });

  it('should calculate remaining free runs correctly', async () => {
    (dungeonStateServiceModule.dungeonStateService.getUserDailyStats as any) = vi.fn().mockResolvedValue({
      dailyRuns: 2,
      needsReset: false,
    });

    const request = new NextRequest('http://localhost/api/runs/stats?wallet=0xwallet');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.remainingFreeRuns).toBe(0);
  });
});

