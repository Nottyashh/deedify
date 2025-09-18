#!/usr/bin/env tsx

import { createSolanaService } from '../apps/api/src/common/utils/solana';
import { AppConfigService } from '../apps/api/src/common/config/config.service';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function verifyAuctionHouse() {
  try {
    console.log('🎯 Verifying Auction House configuration...');

    // Initialize services
    const configService = new AppConfigService();
    const solanaService = createSolanaService(configService);

    console.log('\n📋 Configuration Check:');
    console.log(`  🌐 Solana Cluster: ${configService.solanaCluster}`);
    console.log(`  🔗 Helius RPC: ${configService.heliusRpcUrl ? '✅ Configured' : '❌ Missing'}`);
    console.log(`  🔑 Mint Authority: ${configService.mintAuthSecret ? '✅ Configured' : '❌ Missing'}`);
    console.log(`  🏛️ Metaplex Authority: ${configService.metaplexAuthority ? '✅ Configured' : '❌ Missing'}`);

    // Test Solana connection
    console.log('\n🔌 Testing Solana Connection:');
    try {
      const connection = solanaService.getConnection();
      const version = await connection.getVersion();
      console.log(`  ✅ Connected to Solana ${version['solana-core']}`);
    } catch (error) {
      console.log(`  ❌ Failed to connect to Solana: ${error.message}`);
    }

    // Test mint authority
    console.log('\n🔑 Testing Mint Authority:');
    try {
      const mintAuthority = solanaService.getMintAuthority();
      const balance = await solanaService.getBalance(mintAuthority.publicKey);
      console.log(`  ✅ Mint Authority: ${mintAuthority.publicKey.toString()}`);
      console.log(`  💰 Balance: ${balance / 1e9} SOL`);
    } catch (error) {
      console.log(`  ❌ Failed to get mint authority: ${error.message}`);
    }

    // Test Metaplex authority
    console.log('\n🏛️ Testing Metaplex Authority:');
    try {
      const authorityPublicKey = solanaService.getAuthorityPublicKey();
      const balance = await solanaService.getBalance(authorityPublicKey);
      console.log(`  ✅ Metaplex Authority: ${authorityPublicKey.toString()}`);
      console.log(`  💰 Balance: ${balance / 1e9} SOL`);
    } catch (error) {
      console.log(`  ❌ Failed to get Metaplex authority: ${error.message}`);
    }

    console.log('\n🎉 Auction House verification completed!');
    console.log('\n💡 Next Steps:');
    console.log('  1. Ensure you have sufficient SOL in both authority wallets');
    console.log('  2. Test minting a collection NFT with: pnpm mint:collection --listing <LISTING_ID>');
    console.log('  3. Test minting fractional NFTs with: pnpm mint:fractions --listing <LISTING_ID> --count 100');

  } catch (error) {
    console.error('❌ Auction House verification failed:', error.message);
    process.exit(1);
  }
}

verifyAuctionHouse();