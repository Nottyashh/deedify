import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(args?: Prisma.OrderFindManyArgs) {
    return this.prisma.order.findMany(args);
  }

  async findUnique(args: Prisma.OrderFindUniqueArgs) {
    return this.prisma.order.findUnique(args);
  }

  async findFirst(args: Prisma.OrderFindFirstArgs) {
    return this.prisma.order.findFirst(args);
  }

  async create(args: Prisma.OrderCreateArgs) {
    return this.prisma.order.create(args);
  }

  async update(args: Prisma.OrderUpdateArgs) {
    return this.prisma.order.update(args);
  }

  async delete(args: Prisma.OrderDeleteArgs) {
    return this.prisma.order.delete(args);
  }

  async count(args?: Prisma.OrderCountArgs) {
    return this.prisma.order.count(args);
  }

  async upsert(args: Prisma.OrderUpsertArgs) {
    return this.prisma.order.upsert(args);
  }
}