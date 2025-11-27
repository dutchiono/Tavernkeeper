import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, sceneType } = body;

    // Generate dynamic PNG using @vercel/og
    // In production, this would render actual game state
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            background: '#1a1a1a',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFD700',
            fontFamily: 'monospace',
          } as React.CSSProperties}
        >
          <div>TavernKeeper Scene</div>
          <div style={{ fontSize: 20, marginTop: 20 } as React.CSSProperties}>
            {agentId ? `Agent: ${agentId}` : 'Scene Preview'}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating scene image:', error);
    return NextResponse.json(
      { error: 'Failed to generate scene image' },
      { status: 500 }
    );
  }
}

