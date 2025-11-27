'use client';

import React, { useState, useEffect } from 'react';
import { PixelBox, PixelButton } from './PixelComponents';
import type { MarketplaceListing } from '../lib/services/marketplace';
import { ShoppingCart, Package, Users, Home } from 'lucide-react';

interface MarketplaceListingsProps {
  onBuy?: (listing: MarketplaceListing) => void;
}

export const MarketplaceListings: React.FC<MarketplaceListingsProps> = ({ onBuy }) => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'item' | 'adventurer' | 'tavernkeeper'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.set('assetType', filter);
      }

      const response = await fetch(`/api/marketplace/listings?${params}`);
      const data = await response.json();

      if (data.error) {
        console.error('Error fetching listings:', data.error);
      } else {
        setListings(data.listings || []);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter((listing) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        listing.assetId.toLowerCase().includes(query) ||
        (listing.metadata?.name as string)?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'item':
        return <Package size={24} />;
      case 'adventurer':
        return <Users size={24} />;
      case 'tavernkeeper':
        return <Home size={24} />;
      default:
        return <Package size={24} />;
    }
  };

  const formatPrice = (priceWei: string) => {
    // Convert wei to readable format
    // TODO: Format with proper token symbol from env
    const price = BigInt(priceWei);
    const eth = Number(price) / 1e18;
    return `${eth.toFixed(4)} TKN`;
  };

  if (loading) {
    return (
      <PixelBox variant="paper" title="Marketplace" className="text-center py-8">
        <p className="text-amber-950">Loading listings...</p>
      </PixelBox>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <PixelBox variant="paper" className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'item', 'adventurer', 'tavernkeeper'] as const).map((f) => (
              <PixelButton
                key={f}
                variant={filter === f ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </PixelButton>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-amber-50 border-2 border-amber-800 px-3 py-2 text-amber-950 placeholder-amber-600"
          />
        </div>
      </PixelBox>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <PixelBox variant="paper" className="text-center py-8">
          <ShoppingCart className="mx-auto mb-2 text-amber-600" size={48} />
          <p className="text-amber-950">No listings found</p>
        </PixelBox>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((listing) => (
            <PixelBox
              key={listing.id}
              variant="paper"
              className="hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="text-amber-600">{getAssetIcon(listing.assetType)}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-amber-950">
                      {listing.metadata?.name ? String(listing.metadata.name) : `${listing.assetType} #${listing.assetId}`}
                    </h3>
                    <p className="text-xs text-amber-700 capitalize">{listing.assetType}</p>
                  </div>
                  {listing.includesInventory && (
                    <span className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded">
                      + Inventory
                    </span>
                  )}
                </div>

                <div className="border-t-2 border-amber-800 pt-2">
                  <p className="text-lg font-bold text-amber-950">{formatPrice(listing.priceErc20)}</p>
                </div>

                <PixelButton
                  variant="success"
                  className="w-full"
                  onClick={() => onBuy?.(listing)}
                >
                  Buy Now
                </PixelButton>
              </div>
            </PixelBox>
          ))}
        </div>
      )}
    </div>
  );
};

