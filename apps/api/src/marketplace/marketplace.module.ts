import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceRepository } from './marketplace.repository';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AppConfigService } from '../common/config/config.service';

@Module({
  imports: [PrismaModule],
  controllers: [MarketplaceController],
  providers: [
    MarketplaceService,
    MarketplaceRepository,
    {
      provide: 'SOLANA_SERVICE',
      useFactory: (configService: AppConfigService) => {
        const { createSolanaService } = require('../common/utils/solana');
        return createSolanaService(configService);
      },
      inject: [AppConfigService],
    },
  ],
  exports: [MarketplaceService, MarketplaceRepository],
})
export class MarketplaceModule {}