import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class PayoutsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findMany(args?: Prisma.PayoutFindManyArgs): Promise<{
        id: string;
        createdAt: Date;
        listingId: string;
        txSignature: string | null;
        userId: string | null;
        amount: Prisma.Decimal;
        reason: import("@prisma/client").$Enums.PayoutReason;
    }[]>;
    findUnique(args: Prisma.PayoutFindUniqueArgs): Promise<{
        id: string;
        createdAt: Date;
        listingId: string;
        txSignature: string | null;
        userId: string | null;
        amount: Prisma.Decimal;
        reason: import("@prisma/client").$Enums.PayoutReason;
    }>;
    findFirst(args: Prisma.PayoutFindFirstArgs): Promise<{
        id: string;
        createdAt: Date;
        listingId: string;
        txSignature: string | null;
        userId: string | null;
        amount: Prisma.Decimal;
        reason: import("@prisma/client").$Enums.PayoutReason;
    }>;
    create(args: Prisma.PayoutCreateArgs): Promise<{
        id: string;
        createdAt: Date;
        listingId: string;
        txSignature: string | null;
        userId: string | null;
        amount: Prisma.Decimal;
        reason: import("@prisma/client").$Enums.PayoutReason;
    }>;
    update(args: Prisma.PayoutUpdateArgs): Promise<{
        id: string;
        createdAt: Date;
        listingId: string;
        txSignature: string | null;
        userId: string | null;
        amount: Prisma.Decimal;
        reason: import("@prisma/client").$Enums.PayoutReason;
    }>;
    delete(args: Prisma.PayoutDeleteArgs): Promise<{
        id: string;
        createdAt: Date;
        listingId: string;
        txSignature: string | null;
        userId: string | null;
        amount: Prisma.Decimal;
        reason: import("@prisma/client").$Enums.PayoutReason;
    }>;
    count(args?: Prisma.PayoutCountArgs): Promise<number>;
    aggregate(args: Prisma.PayoutAggregateArgs): Promise<Prisma.GetPayoutAggregateType<{
        where?: Prisma.PayoutWhereInput;
        orderBy?: Prisma.PayoutOrderByWithRelationInput | Prisma.PayoutOrderByWithRelationInput[];
        cursor?: Prisma.PayoutWhereUniqueInput;
        take?: number;
        skip?: number;
        _count?: true | Prisma.PayoutCountAggregateInputType;
        _avg?: Prisma.PayoutAvgAggregateInputType;
        _sum?: Prisma.PayoutSumAggregateInputType;
        _min?: Prisma.PayoutMinAggregateInputType;
        _max?: Prisma.PayoutMaxAggregateInputType;
    }>>;
    upsert(args: Prisma.PayoutUpsertArgs): Promise<{
        id: string;
        createdAt: Date;
        listingId: string;
        txSignature: string | null;
        userId: string | null;
        amount: Prisma.Decimal;
        reason: import("@prisma/client").$Enums.PayoutReason;
    }>;
}
