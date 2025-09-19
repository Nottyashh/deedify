import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class UsersRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findMany(args?: Prisma.UserFindManyArgs): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findUnique(args: Prisma.UserFindUniqueArgs): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findFirst(args: Prisma.UserFindFirstArgs): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(args: Prisma.UserCreateArgs): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(args: Prisma.UserUpdateArgs): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(args: Prisma.UserDeleteArgs): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    count(args?: Prisma.UserCountArgs): Promise<number>;
    upsert(args: Prisma.UserUpsertArgs): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
