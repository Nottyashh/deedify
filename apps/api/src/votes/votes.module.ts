import { Module } from '@nestjs/common';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { VotesRepository } from './votes.repository';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AppConfigService } from '../common/config/config.service';

@Module({
  imports: [PrismaModule],
  controllers: [VotesController],
  providers: [
    VotesService,
    VotesRepository,
    {
      provide: 'SOLANA_SERVICE',
      useFactory: (configService: AppConfigService) => {
        const { createSolanaService } = require('../common/utils/solana');
        return createSolanaService(configService);
      },
      inject: [AppConfigService],
    },
  ],
  exports: [VotesService, VotesRepository],
})
export class VotesModule {}