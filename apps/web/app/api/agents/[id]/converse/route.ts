import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { message, persona, memory } = body;

    // Check if agent exists
    const { data: agent, error: fetchError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Update agent persona and memory if provided
    const updateData: Record<string, unknown> = {};
    if (persona) updateData.persona = persona;
    if (memory) updateData.memory = memory;

    if (Object.keys(updateData).length > 0) {
      await supabase
        .from('agents')
        .update(updateData)
        .eq('id', id);
    }

    // In production, this would call ElizaOS API to process the conversation
    // For now, return a placeholder response
    return NextResponse.json({
      agentId: id,
      response: 'Agent conversation processed (ElizaOS integration pending)',
      message,
    });
  } catch (error) {
    console.error('Error in agent conversation:', error);
    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    );
  }
}

