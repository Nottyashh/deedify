import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(args?: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(args);
  }

  async findUnique(args: Prisma.UserFindUniqueArgs) {
    return this.prisma.user.findUnique(args);
  }

  async findFirst(args: Prisma.UserFindFirstArgs) {
    return this.prisma.user.findFirst(args);
  }

  async create(args: Prisma.UserCreateArgs) {
    return this.prisma.user.create(args);
  }

  async update(args: Prisma.UserUpdateArgs) {
    return this.prisma.user.update(args);
  }

  async delete(args: Prisma.UserDeleteArgs) {
    return this.prisma.user.delete(args);
  }

  async count(args?: Prisma.UserCountArgs) {
    return this.prisma.user.count(args);
  }

  async upsert(args: Prisma.UserUpsertArgs) {
    return this.prisma.user.upsert(args);
  }
}