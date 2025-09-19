import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HoldingsRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(args?: Prisma.HoldingFindManyArgs) {
    return this.prisma.holding.findMany(args);
  }

  async findUnique(args: Prisma.HoldingFindUniqueArgs) {
    return this.prisma.holding.findUnique(args);
  }

  async findFirst(args: Prisma.HoldingFindFirstArgs) {
    return this.prisma.holding.findFirst(args);
  }

  async create(args: Prisma.HoldingCreateArgs) {
    return this.prisma.holding.create(args);
  }

  async update(args: Prisma.HoldingUpdateArgs) {
    return this.prisma.holding.update(args);
  }

  async upsert(args: Prisma.HoldingUpsertArgs) {
    return this.prisma.holding.upsert(args);
  }

  async delete(args: Prisma.HoldingDeleteArgs) {
    return this.prisma.holding.delete(args);
  }

  async count(args?: Prisma.HoldingCountArgs) {
    return this.prisma.holding.count(args);
  }
}