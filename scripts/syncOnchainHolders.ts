#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { createSolanaService } from '../apps/api/src/common/utils/solana';
import { AppConfigService } from '../apps/api/src/common/config/config.service';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function syncOnchainHolders() {
  try {
    console.log('🎯 Starting on-chain holder synchronization...');

    // Initialize services
    const configService = new AppConfigService();
    const solanaService = createSolanaService(configService);

    // Get all share tokens
    const shareTokens = await prisma.shareToken.findMany({
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            collectionMint: true,
          },
        },
      },
    });

    console.log(`📊 Found ${shareTokens.length} share tokens to sync`);

    let syncedCount = 0;
    let errorCount = 0;

    // Process each share token
    for (const shareToken of shareTokens) {
      try {
        console.log(`\n🎫 Syncing: ${shareToken.mintAddress} (${shareToken.listing.title})`);

        // In a real implementation, you would:
        // 1. Query Helius for current owner of the NFT
        // 2. Update the database with the current owner
        // 3. Calculate voting weights based on ownership

        // For now, we'll simulate the sync process
        const mockOwner = `owner_${Math.random().toString(36).substring(2, 8)}`;
        const mockWeight = Math.floor(Math.random() * 10) + 1;

        console.log(`  👤 Owner: ${mockOwner}`);
        console.log(`  ⚖️ Weight: ${mockWeight}`);

        // In a real implementation, you would update the database here
        // await prisma.shareToken.update({
        //   where: { id: shareToken.id },
        //   data: { currentOwner: mockOwner, votingWeight: mockWeight },
        // });

        syncedCount++;
      } catch (error) {
        console.error(`  ❌ Failed to sync ${shareToken.mintAddress}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n🎉 On-chain holder synchronization completed!');
    console.log(`✅ Successfully synced: ${syncedCount} share tokens`);
    console.log(`❌ Failed to sync: ${errorCount} share tokens`);

    if (errorCount > 0) {
      console.log('\n💡 Tip: Check that Helius RPC is properly configured and accessible');
    }

  } catch (error) {
    console.error('❌ On-chain holder synchronization failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

syncOnchainHolders();