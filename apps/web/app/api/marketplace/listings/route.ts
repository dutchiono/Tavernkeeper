import { NextRequest, NextResponse } from 'next/server';
import { getListings } from '@/lib/services/marketplace';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assetType = searchParams.get('assetType');
    const sellerAddress = searchParams.get('sellerAddress');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const listings = await getListings({
      assetType: assetType as 'item' | 'adventurer' | 'tavernkeeper' | undefined,
      sellerAddress: sellerAddress as `0x${string}` | undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

