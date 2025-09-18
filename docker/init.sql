-- Initialize Deedify database
-- This script runs when the PostgreSQL container starts

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create read views for public listing pages
CREATE OR REPLACE VIEW public_listings AS
SELECT 
    l.id,
    l.title,
    l.description,
    l.location_text,
    l.parcel_size,
    l.coordinate_policy,
    l.coordinate_policy_note,
    l.total_shares,
    l.price_per_share,
    l.status,
    l.collection_mint,
    l.created_at,
    l.updated_at,
    u.email as owner_email,
    u.role as owner_role,
    COUNT(st.id) as minted_shares,
    COUNT(o.id) as active_orders
FROM listings l
JOIN users u ON l.owner_id = u.id
LEFT JOIN share_tokens st ON l.id = st.listing_id
LEFT JOIN orders o ON l.id = o.listing_id AND o.status = 'OPEN'
WHERE l.status = 'LIVE'
GROUP BY l.id, u.email, u.role;

-- Create materialized view for marketplace aggregates
CREATE MATERIALIZED VIEW marketplace_stats AS
SELECT 
    COUNT(DISTINCT l.id) as total_listings,
    COUNT(DISTINCT st.id) as total_shares,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(CASE WHEN o.status = 'FILLED' THEN o.price ELSE 0 END) as total_volume,
    AVG(l.price_per_share) as avg_price_per_share,
    AVG(l.parcel_size) as avg_parcel_size,
    COUNT(DISTINCT p.id) as total_proposals,
    COUNT(DISTINCT v.id) as total_votes
FROM listings l
LEFT JOIN share_tokens st ON l.id = st.listing_id
LEFT JOIN orders o ON l.id = o.listing_id
LEFT JOIN proposals p ON l.id = p.listing_id
LEFT JOIN votes v ON p.id = v.proposal_id;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_share_mint ON orders(share_mint);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_votes_proposal_id ON votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_share_tokens_listing_id ON share_tokens(listing_id);
CREATE INDEX IF NOT EXISTS idx_share_tokens_mint_address ON share_tokens(mint_address);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_marketplace_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW marketplace_stats;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user voting power
CREATE OR REPLACE FUNCTION get_user_voting_power(user_id TEXT, listing_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    voting_power DECIMAL := 0;
BEGIN
    -- In a real implementation, this would query on-chain data
    -- For now, return a mock value
    SELECT COALESCE(SUM(1), 0) INTO voting_power
    FROM share_tokens st
    WHERE st.listing_id = get_user_voting_power.listing_id;
    
    RETURN voting_power;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate listing valuation
CREATE OR REPLACE FUNCTION calculate_listing_valuation(listing_id TEXT)
RETURNS TABLE(
    fair_price_per_share DECIMAL,
    confidence DECIMAL,
    methodology TEXT
) AS $$
BEGIN
    -- In a real implementation, this would call the valuation service
    -- For now, return mock values
    RETURN QUERY
    SELECT 
        l.price_per_share * (1 + (RANDOM() - 0.5) * 0.2) as fair_price_per_share,
        0.7 + (RANDOM() * 0.3) as confidence,
        'mock_calculation' as methodology
    FROM listings l
    WHERE l.id = calculate_listing_valuation.listing_id;
END;
$$ LANGUAGE plpgsql;