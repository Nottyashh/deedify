import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { PrismaModule } from '../common/prisma/prisma.module';
import { ListingsModule } from '../listings/listings.module';
import { HoldingsModule } from '../holdings/holdings.module';

@Module({
  imports: [PrismaModule, ListingsModule, HoldingsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}