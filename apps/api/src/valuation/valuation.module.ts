import { Module } from '@nestjs/common';
import { ValuationController } from './valuation.controller';
import { ValuationService } from './valuation.service';
import { AppConfigService } from '../common/config/config.service';

@Module({
  controllers: [ValuationController],
  providers: [
    ValuationService,
    {
      provide: 'VALUATION_SERVICE_URL',
      useFactory: (configService: AppConfigService) => {
        return configService.get('VALUATION_SERVICE_URL', 'http://localhost:3001');
      },
      inject: [AppConfigService],
    },
  ],
  exports: [ValuationService],
})
export class ValuationModule {}