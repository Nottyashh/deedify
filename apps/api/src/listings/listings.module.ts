import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { ListingsRepository } from './listings.repository';
import { PrismaModule } from '../common/prisma/prisma.module';
import { ValuationModule } from '../valuation/valuation.module';

@Module({
  imports: [PrismaModule, ValuationModule],
  controllers: [ListingsController],
  providers: [ListingsService, ListingsRepository],
  exports: [ListingsService, ListingsRepository],
})
export class ListingsModule {}