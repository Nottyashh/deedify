# Deedify API Documentation

## Overview

The Deedify API provides a comprehensive backend for tokenized raw-land fractional ownership. Built with NestJS, it offers RESTful endpoints for managing land listings, NFT collections, marketplace operations, governance voting, and more.

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Health & Monitoring

- `GET /health` - Health check
- `GET /health/version` - API version information
- `GET /health/database` - Database health check
- `GET /health/ready` - Readiness check

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile
- `POST /auth/profile` - Update user profile
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - Logout user

### Users

- `GET /users` - Get all users (Admin only)
- `GET /users/me` - Get current user
- `GET /users/:id` - Get user by ID
- `POST /users/:id` - Update user (Admin only)
- `POST /users/:id/kyc` - Update KYC status (Admin only)
- `GET /users/:id/listings` - Get user listings
- `GET /users/:id/orders` - Get user orders
- `GET /users/:id/votes` - Get user votes

### Listings

- `POST /listings` - Create listing (Lister/Admin)
- `GET /listings` - Get all listings with filters
- `GET /listings/public` - Get public listings
- `GET /listings/:id` - Get listing by ID
- `PATCH /listings/:id` - Update listing
- `POST /listings/:id/status` - Update listing status (Admin)
- `GET /listings/:id/shares` - Get listing share tokens
- `GET /listings/:id/valuation` - Get listing valuation
- `POST /listings/:id/valuation` - Update valuation (Admin)

### NFTs

- `POST /nfts/collection` - Mint collection NFT (Lister/Admin)
- `POST /nfts/fractions` - Mint fractional NFTs (Lister/Admin)
- `GET /nfts/collection/:listingId` - Get collection NFT
- `GET /nfts/fractions/:listingId` - Get fractional NFTs
- `GET /nfts/metadata/:mintAddress` - Get NFT metadata
- `GET /nfts/owner/:walletAddress` - Get owned NFTs
- `POST /nfts/verify/:listingId` - Verify collection (Admin)
- `GET /nfts/stats/:listingId` - Get NFT statistics

### Marketplace

- `POST /marketplace/list` - List share for sale
- `POST /marketplace/buy` - Buy share
- `POST /marketplace/sell` - Sell share
- `POST /marketplace/cancel` - Cancel order
- `GET /marketplace/orders` - Get user orders
- `GET /marketplace/orders/:id` - Get order by ID
- `GET /marketplace/listings` - Get active listings
- `GET /marketplace/listings/:listingId/shares` - Get listing shares
- `GET /marketplace/history/:shareMint` - Get share trading history
- `GET /marketplace/stats` - Get marketplace statistics

### Governance & Voting

- `POST /votes/proposals` - Create proposal (Lister/Admin)
- `GET /votes/proposals` - Get all proposals
- `GET /votes/proposals/:id` - Get proposal by ID
- `GET /votes/proposals/:id/results` - Get proposal results
- `POST /votes/vote` - Cast vote
- `GET /votes/my-votes` - Get user votes
- `GET /votes/proposals/:id/my-vote` - Get user vote for proposal
- `POST /votes/proposals/:id/close` - Close proposal (Admin)
- `GET /votes/stats` - Get voting statistics

### Payouts

- `POST /payouts/trigger` - Trigger payout (Admin)
- `GET /payouts` - Get payouts
- `GET /payouts/listing/:listingId` - Get listing payouts
- `GET /payouts/user/:userId` - Get user payouts
- `GET /payouts/stats` - Get payout statistics

### KYC

- `POST /kyc/initiate` - Initiate KYC verification
- `GET /kyc/status/:userId` - Get KYC status
- `GET /kyc/my-status` - Get current user KYC status
- `POST /kyc/callback` - Handle KYC provider callback

### Valuation

- `POST /valuation/estimate` - Estimate property value
- `GET /valuation/listing/:listingId` - Get listing valuation
- `POST /valuation/refresh/:listingId` - Refresh valuation (Admin)
- `GET /valuation/stats` - Get valuation statistics

### Webhooks

- `POST /webhooks/helius` - Handle Helius webhooks
- `POST /webhooks/kyc` - Handle KYC webhooks
- `POST /webhooks/stripe` - Handle Stripe webhooks

## Data Models

### User

```typescript
{
  id: string;
  email: string;
  role: 'INVESTOR' | 'LISTER' | 'ADMIN';
  walletAddress?: string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  createdAt: Date;
  updatedAt: Date;
}
```

### Listing

```typescript
{
  id: string;
  title: string;
  description: string;
  locationText: string;
  geoJson?: any;
  parcelSize: number;
  coordinatePolicy: boolean;
  coordinatePolicyNote?: string;
  totalShares: number;
  pricePerShare: number;
  ownerId: string;
  status: 'PENDING' | 'LIVE' | 'PAUSED' | 'CLOSED';
  collectionMint?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### ShareToken

```typescript
{
  id: string;
  listingId: string;
  mintAddress: string;
  indexNumber: number;
  metadataUri?: string;
}
```

### Order

```typescript
{
  id: string;
  type: 'LIST' | 'BUY' | 'SELL';
  listingId: string;
  shareMint: string;
  sellerId?: string;
  buyerId?: string;
  price: number;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
  txSignature?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Proposal

```typescript
{
  id: string;
  listingId: string;
  title: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  status: 'OPEN' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
}
```

### Vote

```typescript
{
  id: string;
  proposalId: string;
  userId: string;
  weightDecimal: number;
  choice: 'YES' | 'NO';
  createdAt: Date;
}
```

## Error Handling

The API uses standard HTTP status codes and returns consistent error responses:

```typescript
{
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  error: string;
  message: string | string[];
}
```

## Rate Limiting

The API implements rate limiting:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Pagination

List endpoints support pagination:

```
GET /listings?page=1&limit=20&sortBy=createdAt&sortOrder=desc
```

Response format:

```typescript
{
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

## Webhooks

### Helius Webhooks

Receive notifications for Solana transactions:

```typescript
{
  type: 'TRANSFER' | 'NFT_SALE' | 'NFT_MINT' | 'NFT_BURN';
  signature: string;
  slot: number;
  timestamp: number;
  data: any;
}
```

### KYC Webhooks

Receive notifications for KYC verification status:

```typescript
{
  event: 'verification_completed' | 'verification_failed';
  verification_id: string;
  status: 'approved' | 'declined';
  user_id: string;
  data: any;
}
```

### Stripe Webhooks

Receive notifications for payment events:

```typescript
{
  type: string;
  data: {
    object: any;
  };
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// Create a listing
const listing = await api.post('/listings', {
  title: 'Beautiful Mountain Property',
  description: 'Stunning 50-acre property with panoramic views',
  locationText: 'Aspen, Colorado, United States',
  parcelSize: 50.0,
  coordinatePolicy: true,
  totalShares: 100,
  pricePerShare: 0.25,
});

// Get listings with filters
const listings = await api.get('/listings', {
  params: {
    search: 'mountain',
    location: 'colorado',
    minPrice: 0.1,
    maxPrice: 0.5,
    page: 1,
    limit: 10,
  },
});
```

### Python

```python
import requests

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json',
}

# Create a listing
response = requests.post(
    'http://localhost:3000/listings',
    json={
        'title': 'Beautiful Mountain Property',
        'description': 'Stunning 50-acre property with panoramic views',
        'locationText': 'Aspen, Colorado, United States',
        'parcelSize': 50.0,
        'coordinatePolicy': True,
        'totalShares': 100,
        'pricePerShare': 0.25,
    },
    headers=headers
)
```

## Testing

Use the provided `rest.http` file with VS Code REST Client extension for testing endpoints.

## Support

For API support and questions, please contact the development team.