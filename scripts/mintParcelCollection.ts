#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { createSolanaService } from '../apps/api/src/common/utils/solana';
import { createNftService } from '../apps/api/src/common/utils/nft';
import { AppConfigService } from '../apps/api/src/common/config/config.service';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function mintParcelCollection(listingId: string) {
  try {
    console.log(`🎯 Minting collection NFT for listing: ${listingId}`);

    // Get listing details
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        title: true,
        description: true,
        locationText: true,
        parcelSize: true,
        coordinatePolicy: true,
        coordinatePolicyNote: true,
        collectionMint: true,
      },
    });

    if (!listing) {
      throw new Error(`Listing not found: ${listingId}`);
    }

    if (listing.collectionMint) {
      throw new Error(`Collection already exists for listing: ${listing.collectionMint}`);
    }

    // Initialize services
    const configService = new AppConfigService();
    const solanaService = createSolanaService(configService);
    const nftService = createNftService(configService, solanaService.getMintAuthority());

    // Create collection metadata
    const metadata = {
      name: `${listing.title} - Collection`,
      description: listing.description,
      image: `https://api.deedify.com/images/collections/${listing.id}.jpg`,
      attributes: [
        { trait_type: 'Parcel Size (acres)', value: listing.parcelSize },
        { trait_type: 'Location', value: listing.locationText },
        { trait_type: 'Coordinate Policy', value: listing.coordinatePolicy ? 'Fractional' : 'Exact' },
        { trait_type: 'Policy Note', value: listing.coordinatePolicyNote },
        { trait_type: 'Listing ID', value: listing.id },
      ],
      parcelSize: listing.parcelSize,
      coordinatePolicy: listing.coordinatePolicy,
      coordinatePolicyNote: listing.coordinatePolicyNote,
      listingId: listing.id,
    };

    // Mint collection NFT
    const { mint, metadataPda } = await nftService.createCollectionNft(
      listing.id,
      metadata
    );

    // Update listing with collection mint
    await prisma.listing.update({
      where: { id: listing.id },
      data: { collectionMint: mint.toString() },
    });

    console.log('✅ Collection NFT minted successfully!');
    console.log(`📦 Collection Mint: ${mint.toString()}`);
    console.log(`📄 Metadata PDA: ${metadataPda.toString()}`);
    console.log(`🔗 View on Solana Explorer: https://explorer.solana.com/address/${mint.toString()}`);

  } catch (error) {
    console.error('❌ Failed to mint collection NFT:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const listingId = args[0];

if (!listingId) {
  console.error('❌ Usage: pnpm mint:collection --listing <LISTING_ID>');
  process.exit(1);
}

mintParcelCollection(listingId);