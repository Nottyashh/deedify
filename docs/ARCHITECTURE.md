# Deedify Architecture Documentation

## Overview

Deedify is a production-ready backend for tokenized raw-land fractional ownership, built with modern technologies and best practices. The system enables investors to own fractional shares of land parcels through NFTs on the Solana blockchain.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Mobile App    │    │   Admin Panel   │
│   (React/Next)  │    │   (React Native)│    │   (React)       │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      Load Balancer        │
                    │      (Nginx/CloudFlare)   │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      Deedify API          │
                    │      (NestJS)             │
                    └─────────────┬─────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────┴─────────┐    ┌───────┴───────┐    ┌─────────┴─────────┐
│   Supabase        │    │   Redis       │    │   Valuation       │
│   (PostgreSQL +   │    │   (BullMQ)    │    │   Microservice    │
│   Auth + Storage) │    │               │    │   (Express)       │
└───────────────────┘    └───────────────┘    └───────────────────┘
          │
          │
┌─────────┴─────────┐
│   Solana          │
│   (Helius RPC)    │
└───────────────────┘
```

## Technology Stack

### Backend Services

- **NestJS**: Main API framework with TypeScript
- **Prisma**: ORM for database operations
- **Supabase**: Managed PostgreSQL database with Auth
- **Redis**: Caching and background job queue (BullMQ)
- **Solana Web3.js**: Blockchain interactions
- **Metaplex**: NFT creation and management
- **Helius**: Solana RPC and NFT indexing

### Microservices

- **Valuation Service**: AI-powered property valuation (Express.js)
- **Background Jobs**: Webhook processing, valuation updates

### Infrastructure

- **Docker**: Containerization
- **PostgreSQL**: Primary database
- **Redis**: Caching and job queue
- **Nginx**: Reverse proxy and load balancing

## Database Schema

### Core Entities

#### Users
- Authentication and authorization
- KYC status tracking
- Wallet address management

#### Listings
- Land parcel information
- Pricing and share configuration
- Status management (PENDING, LIVE, PAUSED, CLOSED)

#### ShareTokens
- Individual NFT representations
- Mint addresses and metadata
- Index numbers for ordering

#### Orders
- Marketplace transactions
- Buy/sell orders
- Transaction status tracking

#### Proposals & Votes
- Governance system
- Off-chain voting with on-chain verification
- Weighted voting based on share ownership

#### Payouts
- Revenue distribution
- Dividend and buyout tracking
- Transaction signatures

### Database Views

#### Public Listings View
```sql
CREATE VIEW public_listings AS
SELECT 
    l.*,
    u.email as owner_email,
    COUNT(st.id) as minted_shares,
    COUNT(o.id) as active_orders
FROM listings l
JOIN users u ON l.owner_id = u.id
LEFT JOIN share_tokens st ON l.id = st.listing_id
LEFT JOIN orders o ON l.id = o.listing_id AND o.status = 'OPEN'
WHERE l.status = 'LIVE'
GROUP BY l.id, u.email;
```

#### Marketplace Stats View
```sql
CREATE MATERIALIZED VIEW marketplace_stats AS
SELECT 
    COUNT(DISTINCT l.id) as total_listings,
    COUNT(DISTINCT st.id) as total_shares,
    SUM(CASE WHEN o.status = 'FILLED' THEN o.price ELSE 0 END) as total_volume,
    AVG(l.price_per_share) as avg_price_per_share
FROM listings l
LEFT JOIN share_tokens st ON l.id = st.listing_id
LEFT JOIN orders o ON l.id = o.listing_id;
```

## API Architecture

### Module Structure

```
src/
├── common/                 # Shared utilities and configurations
│   ├── config/            # Configuration management
│   ├── filters/           # Exception filters
│   ├── guards/            # Authentication guards
│   ├── interceptors/      # Response interceptors
│   ├── pipes/             # Validation pipes
│   ├── prisma/            # Database service
│   └── utils/             # Utility functions
├── auth/                  # Authentication module
├── users/                 # User management
├── listings/              # Land listing management
├── nfts/                  # NFT and collection management
├── marketplace/           # Trading operations
├── votes/                 # Governance and voting
├── payouts/               # Revenue distribution
├── webhooks/              # External service webhooks
├── kyc/                   # Know Your Customer verification
├── storage/               # File storage management
├── valuation/             # Property valuation
└── health/                # Health checks and monitoring
```

### Authentication Flow

1. **User Registration**: Supabase Auth handles user creation
2. **JWT Generation**: Custom JWT tokens for API access
3. **Role-Based Access**: Guards enforce user permissions
4. **Webhook Integration**: Supabase webhooks sync user data

### NFT Management

#### Collection Creation
1. Create Metaplex collection NFT
2. Set metadata with parcel information
3. Store collection mint in database
4. Verify collection authority

#### Fractional NFT Minting
1. Mint individual share NFTs
2. Set parent collection reference
3. Store mint addresses in database
4. Upload metadata to IPFS

#### Marketplace Integration
1. List shares for sale via Auction House semantics
2. Execute trades on Solana
3. Update ownership records
4. Process royalty distributions

## Governance System

### Off-Chain Voting with On-Chain Verification

1. **Proposal Creation**: Listers create development proposals
2. **Voting Period**: Shareholders vote during specified timeframe
3. **Weight Calculation**: Real-time share ownership via Helius
4. **Result Tallying**: Off-chain aggregation with on-chain proof
5. **Execution**: Automatic execution of approved proposals

### Voting Weight Calculation

```typescript
async calculateVotingWeight(userId: string, listingId: string): Promise<number> {
  // Query Helius for user's NFT ownership
  const ownedNfts = await heliusService.getOwnedNfts(userWallet);
  
  // Filter for shares of specific listing
  const listingShares = ownedNfts.filter(nft => 
    nft.collection === listingCollectionMint
  );
  
  // Return total share count as voting weight
  return listingShares.length;
}
```

## Valuation System

### AI-Powered Property Valuation

#### Microservice Architecture
- **Rules-Based Model**: Baseline valuation using location and size
- **Linear Regression**: Machine learning model with feature engineering
- **Hybrid Approach**: Weighted combination of both models

#### Features Used
- Location (state/region multipliers)
- Parcel size (logarithmic scaling)
- Comparable sales data
- Soil quality scores
- Infrastructure scores
- Geospatial data (GeoJSON)

#### API Integration
```typescript
POST /valuation/estimate
{
  "location": "Aspen, Colorado",
  "parcelSize": 50.0,
  "comps": [...],
  "soilScore": 85,
  "infraScore": 90
}
```

## Security Considerations

### Authentication & Authorization
- JWT tokens with expiration
- Role-based access control (RBAC)
- Webhook signature verification
- Rate limiting per IP and user

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention via Prisma
- XSS protection with helmet
- CORS configuration

### Blockchain Security
- Private key management
- Transaction signature verification
- Idempotency keys for operations
- Retry logic with exponential backoff

## Scalability & Performance

### Database Optimization
- Indexed queries for common operations
- Materialized views for aggregations
- Connection pooling
- Read replicas for reporting

### Caching Strategy
- Redis for session storage
- API response caching
- Database query caching
- CDN for static assets

### Background Processing
- BullMQ for async operations
- Webhook processing
- Valuation updates
- Email notifications

## Monitoring & Observability

### Health Checks
- Application health endpoint
- Database connectivity
- External service status
- Readiness probes

### Logging
- Structured logging with Pino
- Request/response logging
- Error tracking
- Performance metrics

### Metrics
- API response times
- Database query performance
- Blockchain transaction success rates
- User activity tracking

## Deployment Architecture

### Development Environment
```yaml
services:
  - deedify-api (NestJS)
  - deedify-valuation (Express)
  - postgres (Database)
  - redis (Cache/Queue)
```

### Production Environment
```yaml
services:
  - nginx (Load Balancer)
  - deedify-api-1, deedify-api-2 (API Instances)
  - deedify-valuation (Valuation Service)
  - postgres-primary, postgres-replica (Database)
  - redis-cluster (Cache/Queue)
  - monitoring (Prometheus/Grafana)
```

## API Rate Limiting

### Global Limits
- 100 requests per minute per IP
- 1000 requests per hour per user

### Endpoint-Specific Limits
- Authentication: 5 attempts per minute
- File uploads: 10 per hour per user
- Valuation requests: 50 per hour per user

## Error Handling

### Global Exception Filter
- Consistent error response format
- Proper HTTP status codes
- Error logging and tracking
- Development vs production error details

### Validation
- Zod schema validation
- Input sanitization
- Type safety with TypeScript
- Custom validation pipes

## Testing Strategy

### Unit Tests
- Service layer testing
- Repository pattern testing
- Utility function testing
- Mock external dependencies

### Integration Tests
- API endpoint testing
- Database integration
- External service mocking
- End-to-end workflows

### E2E Tests
- Complete user journeys
- Marketplace operations
- Governance workflows
- Error scenarios

## Future Enhancements

### Planned Features
- Advanced AI valuation models
- Multi-chain support
- Mobile app integration
- Advanced analytics dashboard

### Scalability Improvements
- Microservices architecture
- Event-driven architecture
- CQRS pattern implementation
- Advanced caching strategies

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies with pnpm
3. Start Docker services
4. Run database migrations
5. Start development servers

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Pre-commit hooks

### CI/CD Pipeline
- Automated testing
- Code quality checks
- Security scanning
- Deployment automation

This architecture provides a solid foundation for a production-ready land tokenization platform with room for future growth and enhancement.