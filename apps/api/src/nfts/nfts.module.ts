import { Module } from '@nestjs/common';
import { NftsController } from './nfts.controller';
import { NftsService } from './nfts.service';
import { NftsRepository } from './nfts.repository';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AppConfigService } from '../common/config/config.service';

@Module({
  imports: [PrismaModule],
  controllers: [NftsController],
  providers: [
    NftsService,
    NftsRepository,
    {
      provide: 'SOLANA_SERVICE',
      useFactory: (configService: AppConfigService) => {
        const { createSolanaService } = require('../common/utils/solana');
        return createSolanaService(configService);
      },
      inject: [AppConfigService],
    },
    {
      provide: 'NFT_SERVICE',
      useFactory: (configService: AppConfigService, solanaService: any) => {
        const { createNftService } = require('../common/utils/nft');
        return createNftService(configService, solanaService.getMintAuthority());
      },
      inject: [AppConfigService, 'SOLANA_SERVICE'],
    },
  ],
  exports: [NftsService, NftsRepository],
})
export class NftsModule {}