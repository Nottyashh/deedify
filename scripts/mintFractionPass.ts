#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { createSolanaService } from '../apps/api/src/common/utils/solana';
import { createNftService } from '../apps/api/src/common/utils/nft';
import { AppConfigService } from '../apps/api/src/common/config/config.service';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function mintFractionPass(listingId: string, count: number) {
  try {
    console.log(`🎯 Minting ${count} fractional NFTs for listing: ${listingId}`);

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
        totalShares: true,
      },
    });

    if (!listing) {
      throw new Error(`Listing not found: ${listingId}`);
    }

    if (!listing.collectionMint) {
      throw new Error(`Collection NFT must be minted first for listing: ${listingId}`);
    }

    if (count !== listing.totalShares) {
      throw new Error(`Count must match listing total shares: ${listing.totalShares}`);
    }

    // Check if fractions already exist
    const existingFractions = await prisma.shareToken.count({
      where: { listingId: listing.id },
    });

    if (existingFractions > 0) {
      throw new Error(`Fractional NFTs already exist for listing: ${listingId}`);
    }

    // Initialize services
    const configService = new AppConfigService();
    const solanaService = createSolanaService(configService);
    const nftService = createNftService(configService, solanaService.getMintAuthority());

    // Create base metadata for fractions
    const baseMetadata = {
      name: `${listing.title} - Share`,
      description: listing.description,
      image: `https://api.deedify.com/images/listings/${listing.id}.jpg`,
      attributes: [
        { trait_type: 'Parcel Size (acres)', value: listing.parcelSize },
        { trait_type: 'Location', value: listing.locationText },
        { trait_type: 'Coordinate Policy', value: listing.coordinatePolicy ? 'Fractional' : 'Exact' },
        { trait_type: 'Policy Note', value: listing.coordinatePolicyNote },
        { trait_type: 'Listing ID', value: listing.id },
        { trait_type: 'Total Shares', value: listing.totalShares },
      ],
      parcelSize: listing.parcelSize,
      coordinatePolicy: listing.coordinatePolicy,
      coordinatePolicyNote: listing.coordinatePolicyNote,
      listingId: listing.id,
      totalShares: listing.totalShares,
    };

    // Mint fractional NFTs
    const fractions = await nftService.createFractionalNfts(
      listing.id,
      new (require('@solana/web3.js').PublicKey)(listing.collectionMint),
      count,
      baseMetadata
    );

    // Store fraction data in database
    const shareTokens = await Promise.all(
      fractions.map((fraction, index) =>
        prisma.shareToken.create({
          data: {
            listingId: listing.id,
            mintAddress: fraction.mint.toString(),
            indexNumber: fraction.index,
            metadataUri: `https://api.deedify.com/metadata/${fraction.mint.toString()}`,
          },
        })
      )
    );

    console.log('✅ Fractional NFTs minted successfully!');
    console.log(`🎫 Total Shares: ${fractions.length}`);
    console.log(`📦 Collection Mint: ${listing.collectionMint}`);
    console.log(`🔗 View Collection on Solana Explorer: https://explorer.solana.com/address/${listing.collectionMint}`);

    // Show first few mint addresses
    console.log('\n📋 First 5 Share Mints:');
    fractions.slice(0, 5).forEach((fraction, index) => {
      console.log(`  ${index + 1}. ${fraction.mint.toString()}`);
    });

    if (fractions.length > 5) {
      console.log(`  ... and ${fractions.length - 5} more`);

    }

  } catch (error) {
    console.error('❌ Failed to mint fractional NFTs:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const listingId = args[0];
const count = parseInt(args[1]) || 100;

if (!listingId) {
  console.error('❌ Usage: pnpm mint:fractions --listing <LISTING_ID> --count <COUNT>');
  process.exit(1);
}

mintFractionPass(listingId, count);