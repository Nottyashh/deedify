import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PayoutsRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(args?: Prisma.PayoutFindManyArgs) {
    return this.prisma.payout.findMany(args);
  }

  async findUnique(args: Prisma.PayoutFindUniqueArgs) {
    return this.prisma.payout.findUnique(args);
  }

  async findFirst(args: Prisma.PayoutFindFirstArgs) {
    return this.prisma.payout.findFirst(args);
  }

  async create(args: Prisma.PayoutCreateArgs) {
    return this.prisma.payout.create(args);
  }

  async update(args: Prisma.PayoutUpdateArgs) {
    return this.prisma.payout.update(args);
  }

  async delete(args: Prisma.PayoutDeleteArgs) {
    return this.prisma.payout.delete(args);
  }

  async count(args?: Prisma.PayoutCountArgs) {
    return this.prisma.payout.count(args);
  }

  async aggregate(args: Prisma.PayoutAggregateArgs) {
    return this.prisma.payout.aggregate(args);
  }

  async upsert(args: Prisma.PayoutUpsertArgs) {
    return this.prisma.payout.upsert(args);
  }
}