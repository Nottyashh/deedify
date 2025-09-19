import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { LoggerModule } from 'nestjs-pino';

import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { NftsModule } from './nfts/nfts.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { VotesModule } from './votes/votes.module';
import { PayoutsModule } from './payouts/payouts.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { KycModule } from './kyc/kyc.module';
import { StorageModule } from './storage/storage.module';
import { ValuationModule } from './valuation/valuation.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Logging
    LoggerModule.forRoot({
      pinoHttp: { 
        transport: { target: 'pino-pretty' } 
      }
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Redis/BullMQ for background jobs
    BullModule.forRoot({
      connection: { 
        url: process.env.REDIS_URL || 'redis://localhost:6379' 
      }
    }),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    HealthModule,
    // ListingsModule,
    // NftsModule,
    // MarketplaceModule,
    // VotesModule,
    // PayoutsModule,
    // WebhooksModule,
    // KycModule,
    // StorageModule,
    // ValuationModule,
  ],
})
export class AppModule {}