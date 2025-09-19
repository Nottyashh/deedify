import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValuationController } from './valuation.controller';
import { ValuationService } from './valuation.service';

@Module({
  controllers: [ValuationController],
  providers: [
    ValuationService,
    {
      provide: 'VALUATION_SERVICE_URL',
      useFactory: (configService: ConfigService) => {
        return configService.get('VALUATION_SERVICE_URL', 'http://localhost:3001');
      },
      inject: [ConfigService],
    },
  ],
  exports: [ValuationService],
})
export class ValuationModule {}