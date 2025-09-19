import { Module } from '@nestjs/common';
import { HoldingsController } from './holdings.controller';
import { HoldingsService } from './holdings.service';
import { HoldingsRepository } from './holdings.repository';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HoldingsController],
  providers: [HoldingsService, HoldingsRepository],
  exports: [HoldingsService, HoldingsRepository],
})
export class HoldingsModule {}