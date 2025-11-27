import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { data: dungeon, error } = await supabase
      .from<{ id: string; seed: string; map: unknown;[key: string]: unknown }>('dungeons')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !dungeon) {
      return NextResponse.json(
        { error: 'Dungeon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: dungeon.id,
      seed: dungeon.seed,
      map: dungeon.map,
    });
  } catch (error) {
    console.error('Error fetching dungeon map:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dungeon map' },
      { status: 500 }
    );
  }
}

