import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buttonIndex, inputText, state } = body;

    // Handle Farcaster frame action
    // In production, this would:
    // 1. Validate Farcaster signature
    // 2. Process the action (button click or input)
    // 3. Update game state
    // 4. Return next frame state

    return NextResponse.json({
      success: true,
      message: 'Frame action processed',
      buttonIndex,
      inputText,
      nextFrame: {
        image: '/api/frames/scene.png',
        buttons: [
          { label: 'Start Run', action: 'post' },
          { label: 'View Party', action: 'post' },
        ],
      },
    });
  } catch (error) {
    console.error('Error processing frame action:', error);
    return NextResponse.json(
      { error: 'Failed to process frame action' },
      { status: 500 }
    );
  }
}

