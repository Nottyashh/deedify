export const mockData = {
  users: [
    {
      email: 'john.doe@example.com',
      role: 'INVESTOR' as const,
      walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      kycStatus: 'VERIFIED' as const,
    },
    {
      email: 'jane.smith@example.com',
      role: 'LISTER' as const,
      walletAddress: '5Q544fKrFoe6tsEbD5S8W4xZxLDjZVv6AoSp44x4LDJ6',
      kycStatus: 'VERIFIED' as const,
    },
    {
      email: 'bob.wilson@example.com',
      role: 'INVESTOR' as const,
      walletAddress: '3QJmV3qfvL9SuYo34YihAf3sRCW3qSiny9qM4kMTqef9',
      kycStatus: 'PENDING' as const,
    },
    {
      email: 'alice.brown@example.com',
      role: 'ADMIN' as const,
      walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      kycStatus: 'VERIFIED' as const,
    },
    {
      email: 'charlie.davis@example.com',
      role: 'INVESTOR' as const,
      walletAddress: '2QdY1qX2p3qR4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h',
      kycStatus: 'VERIFIED' as const,
    },
  ],

  listings: [
    {
      title: 'Beautiful Mountain View Property',
      description: 'Stunning 50-acre property with panoramic mountain views, perfect for development or conservation. Features include mature forests, a small creek, and excellent road access.',
      locationText: 'Aspen, Colorado, United States',
      geoJson: {
        type: 'Polygon',
        coordinates: [[
          [-106.8, 39.2],
          [-106.7, 39.2],
          [-106.7, 39.3],
          [-106.8, 39.3],
          [-106.8, 39.2]
        ]]
      },
      parcelSize: 50.0,
      coordinatePolicy: true,
      coordinatePolicyNote: 'Buyers own a fractional share of this 50-acre parcel without exact coordinates',
      totalShares: 100,
      pricePerShare: 0.25,
      status: 'LIVE' as const,
      collectionMint: 'collection_mint_1',
    },
    {
      title: 'Riverside Farmland',
      description: 'Prime agricultural land along the river with rich soil and water rights. Ideal for farming, ranching, or conservation. Includes irrigation infrastructure.',
      locationText: 'Napa Valley, California, United States',
      geoJson: {
        type: 'Polygon',
        coordinates: [[
          [-122.3, 38.3],
          [-122.2, 38.3],
          [-122.2, 38.4],
          [-122.3, 38.4],
          [-122.3, 38.3]
        ]]
      },
      parcelSize: 120.0,
      coordinatePolicy: true,
      coordinatePolicyNote: 'Buyers own a fractional share of this 120-acre parcel without exact coordinates',
      totalShares: 200,
      pricePerShare: 0.15,
      status: 'LIVE' as const,
      collectionMint: 'collection_mint_2',
    },
    {
      title: 'Desert Oasis Property',
      description: 'Unique desert property with natural springs and diverse wildlife. Perfect for eco-tourism or conservation. Features include ancient rock formations and rare plant species.',
      locationText: 'Sedona, Arizona, United States',
      geoJson: {
        type: 'Polygon',
        coordinates: [[
          [-111.8, 34.8],
          [-111.7, 34.8],
          [-111.7, 34.9],
          [-111.8, 34.9],
          [-111.8, 34.8]
        ]]
      },
      parcelSize: 75.0,
      coordinatePolicy: true,
      coordinatePolicyNote: 'Buyers own a fractional share of this 75-acre parcel without exact coordinates',
      totalShares: 150,
      pricePerShare: 0.18,
      status: 'PENDING' as const,
    },
    {
      title: 'Coastal Forest Reserve',
      description: 'Protected coastal forest with old-growth trees and diverse ecosystem. Ideal for conservation and research. Features include hiking trails and wildlife viewing areas.',
      locationText: 'Big Sur, California, United States',
      geoJson: {
        type: 'Polygon',
        coordinates: [[
          [-121.4, 36.2],
          [-121.3, 36.2],
          [-121.3, 36.3],
          [-121.4, 36.3],
          [-121.4, 36.2]
        ]]
      },
      parcelSize: 200.0,
      coordinatePolicy: true,
      coordinatePolicyNote: 'Buyers own a fractional share of this 200-acre parcel without exact coordinates',
      totalShares: 300,
      pricePerShare: 0.12,
      status: 'LIVE' as const,
      collectionMint: 'collection_mint_3',
    },
    {
      title: 'Prairie Grassland',
      description: 'Vast prairie grassland perfect for grazing or conservation. Features include native grasses, wildflowers, and abundant wildlife. Excellent for sustainable agriculture.',
      locationText: 'Kansas City, Kansas, United States',
      geoJson: {
        type: 'Polygon',
        coordinates: [[
          [-94.6, 39.1],
          [-94.5, 39.1],
          [-94.5, 39.2],
          [-94.6, 39.2],
          [-94.6, 39.1]
        ]]
      },
      parcelSize: 300.0,
      coordinatePolicy: true,
      coordinatePolicyNote: 'Buyers own a fractional share of this 300-acre parcel without exact coordinates',
      totalShares: 500,
      pricePerShare: 0.08,
      status: 'LIVE' as const,
      collectionMint: 'collection_mint_4',
    },
  ],
};