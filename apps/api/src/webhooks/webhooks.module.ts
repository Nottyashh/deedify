import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AppConfigService } from '../common/config/config.service';

@Module({
  imports: [PrismaModule],
  controllers: [WebhooksController],
  providers: [
    WebhooksService,
    {
      provide: 'SOLANA_SERVICE',
      useFactory: (configService: AppConfigService) => {
        const { createSolanaService } = require('../common/utils/solana');
        return createSolanaService(configService);
      },
      inject: [AppConfigService],
    },
  ],
  exports: [WebhooksService],
})
export class WebhooksModule {}