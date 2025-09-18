#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { AppConfigService } from '../apps/api/src/common/config/config.service';
import { ValuationService } from '../apps/api/src/valuation/valuation.service';
import { ListingsRepository } from '../apps/api/src/listings/listings.repository';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function backfillValuations() {
  try {
    console.log('🎯 Starting valuation backfill...');

    // Initialize services
    const configService = new AppConfigService();
    const listingsRepository = new ListingsRepository(prisma);
    const valuationService = new ValuationService(
      listingsRepository,
      configService.get('VALUATION_SERVICE_URL', 'http://localhost:3001')
    );

    // Get all active listings
    const listings = await prisma.listing.findMany({
      where: {
        status: 'LIVE',
      },
      select: {
        id: true,
        title: true,
        locationText: true,
        parcelSize: true,
        geoJson: true,
        pricePerShare: true,
      },
    });

    console.log(`📊 Found ${listings.length} active listings to process`);

    let successCount = 0;
    let errorCount = 0;

    // Process each listing
    for (const listing of listings) {
      try {
        console.log(`\n🏞️ Processing: ${listing.title}`);

        const request = {
          location: listing.locationText,
          parcelSize: Number(listing.parcelSize),
          geoJson: listing.geoJson,
        };

        const valuation = await valuationService.estimateValue(request);

        console.log(`  💰 Current Price: ${listing.pricePerShare} SOL`);
        console.log(`  📈 Fair Price: ${valuation.fairPricePerShare} SOL`);
        console.log(`  🎯 Confidence: ${valuation.confidence}%`);
        console.log(`  🔧 Features: ${valuation.featuresUsed.join(', ')}`);

        // Calculate price difference
        const priceDiff = ((valuation.fairPricePerShare - Number(listing.pricePerShare)) / Number(listing.pricePerShare)) * 100;
        console.log(`  📊 Price Difference: ${priceDiff > 0 ? '+' : ''}${priceDiff.toFixed(2)}%`);

        successCount++;
      } catch (error) {
        console.error(`  ❌ Failed to process ${listing.title}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n🎉 Valuation backfill completed!');
    console.log(`✅ Successfully processed: ${successCount} listings`);
    console.log(`❌ Failed to process: ${errorCount} listings`);

    if (errorCount > 0) {
      console.log('\n💡 Tip: Check that the valuation microservice is running on port 3001');
    }

  } catch (error) {
    console.error('❌ Valuation backfill failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backfillValuations();