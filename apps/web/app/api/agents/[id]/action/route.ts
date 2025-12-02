import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { executeAction, createEngineState } from '@innkeeper/engine';
import type { Action, Entity } from '@innkeeper/lib';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { action } = body as { action: Action };

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    // Verify agent exists
    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // In production, you would:
    // 1. Load current run state
    // 2. Load entities from database
    // 3. Execute action via engine
    // 4. Persist events and state updates
    // 5. Return events

    // For now, return a placeholder
    return NextResponse.json({
      success: true,
      events: [
        {
          type: 'system',
          id: `action-${Date.now()}`,
          timestamp: Date.now(),
          message: `Action ${action.type} executed by agent ${id}`,
        },
      ],
    });
  } catch (error) {
    console.error('Error executing agent action:', error);
    return NextResponse.json(
      { error: 'Failed to execute action' },
      { status: 500 }
    );
  }
}

