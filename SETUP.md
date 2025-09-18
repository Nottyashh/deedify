# Deedify Setup Guide

## 🚀 Quick Start

This guide will help you set up the Deedify backend for tokenized raw-land fractional ownership.

## Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose
- Git

## 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd deedify

# Install dependencies
pnpm install
```

## 2. Environment Configuration

### Copy Environment File

```bash
cp .env.example .env
```

### Configure Environment Variables

Edit `.env` with your actual values:

```bash
# Supabase / Postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/deedify
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key

# Solana / Helius
SOLANA_CLUSTER=devnet
HELIUS_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY
MINT_AUTH_SECRET=your_ed25519_private_key_base58
METAPLEX_AUTHORITY=your_authority_public_key

# App Configuration
JWT_SECRET=your_jwt_secret_change_me
PORT=3000
REDIS_URL=redis://localhost:6379
NODE_ENV=development

# Optional Services
KYC_PROVIDER=veriff
KYC_API_KEY=your_veriff_api_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
MAPBOX_TOKEN=your_mapbox_token

# Valuation Service
VALUATION_SERVICE_URL=http://localhost:3001
```

## 3. Start Infrastructure Services

### Start Database and Redis

```bash
# Start PostgreSQL and Redis
docker-compose -f docker/docker-compose.yml up -d

# Verify services are running
docker ps
```

### Alternative: Use Supabase

If you prefer to use Supabase instead of local PostgreSQL:

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys
3. Update the `DATABASE_URL` and Supabase keys in `.env`

## 4. Database Setup

### Run Migrations

```bash
# Generate Prisma client
pnpm db:migrate

# Seed the database with sample data
pnpm db:seed
```

### Verify Database

```bash
# Check if tables were created
pnpm prisma studio
```

## 5. Generate Solana Keys

### Create Mint Authority Keypair

```bash
# Generate a new keypair
solana-keygen new --outfile ~/.config/solana/mint-authority.json

# Get the public key
solana-keygen pubkey ~/.config/solana/mint-authority.json

# Convert to base58 for MINT_AUTH_SECRET
cat ~/.config/solana/mint-authority.json | jq -r '.[0:32]' | base58
```

### Create Metaplex Authority Keypair

```bash
# Generate another keypair for Metaplex authority
solana-keygen new --outfile ~/.config/solana/metaplex-authority.json

# Get the public key for METAPLEX_AUTHORITY
solana-keygen pubkey ~/.config/solana/metaplex-authority.json
```

### Fund Your Wallets

```bash
# Fund both wallets with SOL (devnet)
solana airdrop 2 <mint-authority-public-key>
solana airdrop 2 <metaplex-authority-public-key>
```

## 6. Start the Application

### Start All Services

```bash
# Start API and valuation microservice
pnpm dev
```

This will start:
- Deedify API on http://localhost:3000
- Valuation microservice on http://localhost:3001
- Redis for background jobs

### Verify Services

```bash
# Check API health
curl http://localhost:3000/health

# Check valuation service
curl http://localhost:3001/health

# View API documentation
open http://localhost:3000/docs
```

## 7. Test the Setup

### Verify Auction House Configuration

```bash
# Check Solana configuration
pnpm verify:auction
```

### Test NFT Minting

```bash
# First, create a listing via API
curl -X POST http://localhost:3000/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "Test Property",
    "description": "A test property for development",
    "locationText": "Test City, Test State",
    "parcelSize": 10.0,
    "coordinatePolicy": true,
    "totalShares": 100,
    "pricePerShare": 0.1
  }'

# Mint collection NFT
pnpm mint:collection --listing <listing-id>

# Mint fractional NFTs
pnpm mint:fractions --listing <listing-id> --count 100
```

### Test Valuation Service

```bash
# Backfill valuations for existing listings
pnpm valuation:backfill
```

## 8. Development Workflow

### Available Scripts

```bash
# Development
pnpm dev                    # Start all services
pnpm build                  # Build all packages
pnpm test                   # Run tests

# Database
pnpm db:migrate            # Run migrations
pnpm db:seed               # Seed database
pnpm db:reset              # Reset database

# NFT Operations
pnpm mint:collection       # Mint collection NFT
pnpm mint:fractions        # Mint fractional NFTs
pnpm onchain:sync          # Sync on-chain holders
pnpm verify:auction        # Verify auction house setup

# Valuation
pnpm valuation:backfill    # Backfill valuations
```

### API Testing

Use the provided `rest.http` file with VS Code REST Client extension:

1. Install REST Client extension
2. Open `apps/api/rest.http`
3. Update the `@token` variable with your JWT token
4. Run individual requests

## 9. Production Deployment

### Environment Variables for Production

```bash
# Production-specific settings
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret_here
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://user:password@host:port
HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
SOLANA_CLUSTER=mainnet
```

### Docker Deployment

```bash
# Build production images
docker build -t deedify-api ./apps/api
docker build -t deedify-valuation ./apps/valuation

# Run with docker-compose
docker-compose -f docker/docker-compose.prod.yml up -d
```

## 10. Monitoring and Maintenance

### Health Checks

```bash
# API health
curl http://localhost:3000/health

# Database health
curl http://localhost:3000/health/database

# Readiness check
curl http://localhost:3000/health/ready
```

### Logs

```bash
# View API logs
docker logs deedify-api

# View database logs
docker logs deedify-postgres

# View Redis logs
docker logs deedify-redis
```

### Database Maintenance

```bash
# Refresh materialized views
psql $DATABASE_URL -c "SELECT refresh_marketplace_stats();"

# Update statistics
psql $DATABASE_URL -c "ANALYZE;"
```

## 11. Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check connection
psql $DATABASE_URL -c "SELECT 1;"
```

#### Solana Connection Issues

```bash
# Check Solana cluster status
solana cluster-version

# Check wallet balance
solana balance <your-wallet-address>
```

#### Redis Connection Issues

```bash
# Check Redis status
docker logs deedify-redis

# Test Redis connection
redis-cli -h localhost -p 6379 ping
```

### Reset Everything

```bash
# Stop all services
docker-compose -f docker/docker-compose.yml down

# Remove volumes (WARNING: This deletes all data)
docker-compose -f docker/docker-compose.yml down -v

# Start fresh
docker-compose -f docker/docker-compose.yml up -d
pnpm db:migrate
pnpm db:seed
```

## 12. API Documentation

### Swagger UI

Visit http://localhost:3000/docs for interactive API documentation.

### OpenAPI Specification

The complete API specification is available in `docs/OPENAPI.md`.

### Architecture Documentation

Detailed architecture information is in `docs/ARCHITECTURE.md`.

## 13. Security Considerations

### Environment Security

- Never commit `.env` files
- Use strong, unique secrets
- Rotate keys regularly
- Use environment-specific configurations

### Database Security

- Use connection pooling
- Implement proper access controls
- Regular backups
- Monitor for suspicious activity

### Blockchain Security

- Secure private key storage
- Use hardware wallets for production
- Implement proper transaction validation
- Monitor for failed transactions

## 14. Support

### Getting Help

- Check the troubleshooting section above
- Review the architecture documentation
- Check GitHub issues
- Contact the development team

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 15. Next Steps

After successful setup:

1. **Explore the API**: Use the Swagger UI at http://localhost:3000/docs
2. **Test NFT Operations**: Try minting collections and fractions
3. **Set up Frontend**: Connect your React/Next.js frontend
4. **Configure Webhooks**: Set up Helius, KYC, and Stripe webhooks
5. **Deploy to Production**: Follow the production deployment guide

## 🎉 Congratulations!

You now have a fully functional Deedify backend running locally. The system is ready for:

- Land listing management
- NFT collection and fractional ownership
- Marketplace operations
- Governance and voting
- Property valuation
- Revenue distribution

Happy coding! 🚀