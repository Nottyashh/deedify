import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KycController],
  providers: [
    KycService,
    {
      provide: 'KYC_PROVIDER',
      useFactory: (configService: ConfigService) => {
        const provider = configService.get('KYC_PROVIDER', 'veriff');
        if (provider === 'veriff') {
          return new (require('./veriff.adapter').VeriffAdapter)(configService);
        }
        throw new Error(`Unsupported KYC provider: ${provider}`);
      },
      inject: [ConfigService],
    },
  ],
  exports: [KycService],
})
export class KycModule {}