import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AppConfigService } from '../common/config/config.service';

@Module({
  imports: [PrismaModule],
  controllers: [KycController],
  providers: [
    KycService,
    {
      provide: 'KYC_PROVIDER',
      useFactory: (configService: AppConfigService) => {
        const provider = configService.get('KYC_PROVIDER', 'veriff');
        if (provider === 'veriff') {
          return new (require('./veriff.adapter').VeriffAdapter)(configService);
        }
        throw new Error(`Unsupported KYC provider: ${provider}`);
      },
      inject: [AppConfigService],
    },
  ],
  exports: [KycService],
})
export class KycModule {}