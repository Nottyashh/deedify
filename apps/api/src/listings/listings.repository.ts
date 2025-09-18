import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListingsRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(args?: Prisma.ListingFindManyArgs) {
    return this.prisma.listing.findMany(args);
  }

  async findUnique(args: Prisma.ListingFindUniqueArgs) {
    return this.prisma.listing.findUnique(args);
  }

  async findFirst(args: Prisma.ListingFindFirstArgs) {
    return this.prisma.listing.findFirst(args);
  }

  async create(args: Prisma.ListingCreateArgs) {
    return this.prisma.listing.create(args);
  }

  async update(args: Prisma.ListingUpdateArgs) {
    return this.prisma.listing.update(args);
  }

  async delete(args: Prisma.ListingDeleteArgs) {
    return this.prisma.listing.delete(args);
  }

  async count(args?: Prisma.ListingCountArgs) {
    return this.prisma.listing.count(args);
  }

  async upsert(args: Prisma.ListingUpsertArgs) {
    return this.prisma.listing.upsert(args);
  }
}