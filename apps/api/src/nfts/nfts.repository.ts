import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NftsRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(args?: Prisma.ShareTokenFindManyArgs) {
    return this.prisma.shareToken.findMany(args);
  }

  async findUnique(args: Prisma.ShareTokenFindUniqueArgs) {
    return this.prisma.shareToken.findUnique(args);
  }

  async findFirst(args: Prisma.ShareTokenFindFirstArgs) {
    return this.prisma.shareToken.findFirst(args);
  }

  async create(args: Prisma.ShareTokenCreateArgs) {
    return this.prisma.shareToken.create(args);
  }

  async update(args: Prisma.ShareTokenUpdateArgs) {
    return this.prisma.shareToken.update(args);
  }

  async delete(args: Prisma.ShareTokenDeleteArgs) {
    return this.prisma.shareToken.delete(args);
  }

  async count(args?: Prisma.ShareTokenCountArgs) {
    return this.prisma.shareToken.count(args);
  }

  async upsert(args: Prisma.ShareTokenUpsertArgs) {
    return this.prisma.shareToken.upsert(args);
  }
}