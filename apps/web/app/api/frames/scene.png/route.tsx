import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    // Generate PNG for Farcaster frame
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
          <div>TavernKeeper Frame</div>
          {agentId && (
            <div style={{ fontSize: 24, marginTop: 20 } as React.CSSProperties}>
              Agent: {agentId}
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating frame image:', error);
    return NextResponse.json(
      { error: 'Failed to generate frame image' },
      { status: 500 }
    );
  }
}

