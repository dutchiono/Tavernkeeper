-- Marketplace & Inventory System Migration
-- Adds tables for loot claims and marketplace listings

-- Loot claims (off-chain until claimed)
CREATE TABLE IF NOT EXISTS loot_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES runs(id) ON DELETE CASCADE NOT NULL,
  adventurer_id VARCHAR NOT NULL,
  adventurer_contract VARCHAR NOT NULL,
  adventurer_token_id VARCHAR NOT NULL,
  items JSONB NOT NULL, -- Array of item data
  claimed BOOLEAN DEFAULT FALSE,
  claim_tx_hash VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  claimed_at TIMESTAMPTZ
);

-- Marketplace listings
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_address VARCHAR NOT NULL,
  asset_type VARCHAR NOT NULL, -- 'item', 'adventurer', 'tavernkeeper'
  asset_id VARCHAR NOT NULL, -- Token ID or item ID
  asset_contract VARCHAR NOT NULL,
  includes_inventory BOOLEAN DEFAULT FALSE,
  price_erc20 VARCHAR NOT NULL, -- Price in ERC-20 tokens (wei)
  pseudoswap_pool_address VARCHAR,
  status VARCHAR DEFAULT 'active', -- 'active', 'sold', 'cancelled'
  metadata JSONB, -- Additional asset metadata (name, image, stats, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sold_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_loot_claims_run_id ON loot_claims(run_id);
CREATE INDEX IF NOT EXISTS idx_loot_claims_adventurer_id ON loot_claims(adventurer_id);
CREATE INDEX IF NOT EXISTS idx_loot_claims_claimed ON loot_claims(claimed);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_seller ON marketplace_listings(seller_address);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_asset_type ON marketplace_listings(asset_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_created_at ON marketplace_listings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE loot_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Basic policies (allow all for now - adjust for production)
CREATE POLICY "Allow all on loot_claims" ON loot_claims FOR ALL USING (true);
CREATE POLICY "Allow all on marketplace_listings" ON marketplace_listings FOR ALL USING (true);

