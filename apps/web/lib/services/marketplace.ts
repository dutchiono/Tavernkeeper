/**
 * Marketplace Service
 * High-level marketplace operations using Pseudoswap
 */

import { type Address, type PublicClient, type WalletClient } from 'viem';
import { supabase } from '../supabase';
import { getAdventurerTBA, getTavernKeeperTBA, fetchInventoryFromTBA } from '../inventory';
import { createPool, buyFromPool, removeLiquidity, type PseudoswapPool } from './pseudoswap';

export interface MarketplaceListing {
  id: string;
  sellerAddress: Address;
  assetType: 'item' | 'adventurer' | 'tavernkeeper';
  assetId: string;
  assetContract: Address;
  includesInventory: boolean;
  priceErc20: string; // Price in ERC-20 tokens (wei)
  pseudoswapPoolAddress?: Address;
  status: 'active' | 'sold' | 'cancelled';
  metadata?: Record<string, unknown>;
  createdAt: string;
  soldAt?: string;
}

export interface ListItemParams {
  assetType: 'item' | 'adventurer' | 'tavernkeeper';
  assetId: string;
  assetContract: Address;
  priceErc20: string; // Price in ERC-20 tokens (wei)
  includesInventory: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * List an item for sale on the marketplace
 */
export async function listItem(
  params: ListItemParams,
  sellerAddress: Address,
  chainId: number,
  erc20Token: Address,
  inventoryContract: Address,
  publicClient: PublicClient,
  walletClient: WalletClient
): Promise<{ listingId: string; poolAddress: Address; txHash: `0x${string}` }> {
  const { assetType, assetId, assetContract, priceErc20, includesInventory, metadata } = params;

  // Create Pseudoswap pool
  const { poolAddress, txHash } = await createPool(
    {
      nftContract: assetContract,
      tokenId: assetType !== 'item' ? BigInt(assetId) : undefined,
      erc20Token,
      initialPrice: BigInt(priceErc20),
      includesInventory,
    },
    publicClient,
    walletClient
  );

  // Create listing record in database
  const { data: listing, error } = await supabase
    .from('marketplace_listings')
    .insert({
      seller_address: sellerAddress,
      asset_type: assetType,
      asset_id: assetId,
      asset_contract: assetContract,
      includes_inventory: includesInventory,
      price_erc20: priceErc20,
      pseudoswap_pool_address: poolAddress,
      status: 'active',
      metadata: metadata || {},
    })
    .select()
    .single();

  if (error || !listing) {
    throw new Error(`Failed to create listing: ${error?.message || 'Unknown error'}`);
  }

  return {
    listingId: (listing as any).id,
    poolAddress,
    txHash,
  };
}

/**
 * Buy an item from the marketplace
 */
export async function buyItem(
  listingId: string,
  buyerAddress: Address,
  chainId: number,
  publicClient: PublicClient,
  walletClient: WalletClient
): Promise<{ txHash: `0x${string}` }> {
  // Fetch listing
  const { data, error } = await (supabase
    .from('marketplace_listings')
    .select('*') as any)
    .eq('id', listingId)
    .eq('status', 'active')
    .single();

  const listing = data as any;

  if (error || !listing) {
    throw new Error('Listing not found or not active');
  }

  if (!listing.pseudoswap_pool_address) {
    throw new Error('Listing has no pool address');
  }

  // Execute purchase through Pseudoswap
  const { txHash } = await buyFromPool(
    listing.pseudoswap_pool_address as Address,
    1n, // Buy 1 unit (for NFTs) or specified amount (for items)
    BigInt(listing.price_erc20), // Max price
    publicClient,
    walletClient
  );

  // Update listing status
  await supabase
    .from('marketplace_listings')
    .update({
      status: 'sold',
      sold_at: new Date().toISOString(),
    })
    .eq('id', listingId);

  return { txHash };
}

/**
 * Cancel a listing
 */
export async function cancelListing(
  listingId: string,
  sellerAddress: Address,
  publicClient: PublicClient,
  walletClient: WalletClient
): Promise<{ txHash: `0x${string}` }> {
  // Fetch listing
  const { data, error } = await (supabase
    .from('marketplace_listings')
    .select('*') as any)
    .eq('id', listingId)
    .eq('seller_address', sellerAddress)
    .eq('status', 'active')
    .single();

  const listing = data as any;

  if (error || !listing) {
    throw new Error('Listing not found or not active');
  }

  if (!listing.pseudoswap_pool_address) {
    throw new Error('Listing has no pool address');
  }

  // Remove liquidity from pool
  const { txHash } = await removeLiquidity(
    listing.pseudoswap_pool_address as Address,
    publicClient,
    walletClient
  );

  // Update listing status
  await supabase
    .from('marketplace_listings')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', listingId);

  return { txHash };
}

/**
 * Get active marketplace listings
 */
export async function getListings(
  filters?: {
    assetType?: 'item' | 'adventurer' | 'tavernkeeper';
    sellerAddress?: Address;
    minPrice?: string;
    maxPrice?: string;
  }
): Promise<MarketplaceListing[]> {
  let query = (supabase
    .from('marketplace_listings')
    .select('*') as any)
    .eq('status', 'active');

  if (filters?.assetType) {
    query = query.eq('asset_type', filters.assetType);
  }

  if (filters?.sellerAddress) {
    query = query.eq('seller_address', filters.sellerAddress);
  }

  if (filters?.minPrice) {
    query = query.gte('price_erc20', filters.minPrice);
  }

  if (filters?.maxPrice) {
    query = query.lte('price_erc20', filters.maxPrice);
  }

  // Apply ordering last
  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch listings: ${error.message}`);
  }

  return (data || []).map((listing: any) => ({
    id: listing.id,
    sellerAddress: listing.seller_address as Address,
    assetType: listing.asset_type as 'item' | 'adventurer' | 'tavernkeeper',
    assetId: listing.asset_id,
    assetContract: listing.asset_contract as Address,
    includesInventory: listing.includes_inventory,
    priceErc20: listing.price_erc20,
    pseudoswapPoolAddress: listing.pseudoswap_pool_address as Address | undefined,
    status: listing.status as 'active' | 'sold' | 'cancelled',
    metadata: listing.metadata as Record<string, unknown> | undefined,
    createdAt: listing.created_at,
    soldAt: listing.sold_at || undefined,
  }));
}

/**
 * Get a single listing by ID
 */
export async function getListing(listingId: string): Promise<MarketplaceListing | null> {
  const { data, error } = await supabase
    .from('marketplace_listings')
    .select('*')
    .eq('id', listingId)
    .single();

  if (error || !data) {
    return null;
  }

  const listingData = data as any;

  return {
    id: listingData.id,
    sellerAddress: listingData.seller_address as Address,
    assetType: listingData.asset_type as 'item' | 'adventurer' | 'tavernkeeper',
    assetId: listingData.asset_id,
    assetContract: listingData.asset_contract as Address,
    includesInventory: listingData.includes_inventory,
    priceErc20: listingData.price_erc20,
    pseudoswapPoolAddress: listingData.pseudoswap_pool_address as Address | undefined,
    status: listingData.status as 'active' | 'sold' | 'cancelled',
    metadata: listingData.metadata as Record<string, unknown> | undefined,
    createdAt: listingData.created_at,
    soldAt: listingData.sold_at || undefined,
  };
}

