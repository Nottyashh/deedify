import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class NftsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findMany(args?: Prisma.ShareTokenFindManyArgs): Promise<{
        id: string;
        mintAddress: string;
        indexNumber: number;
        metadataUri: string | null;
        listingId: string;
    }[]>;
    findUnique(args: Prisma.ShareTokenFindUniqueArgs): Promise<{
        id: string;
        mintAddress: string;
        indexNumber: number;
        metadataUri: string | null;
        listingId: string;
    }>;
    findFirst(args: Prisma.ShareTokenFindFirstArgs): Promise<{
        id: string;
        mintAddress: string;
        indexNumber: number;
        metadataUri: string | null;
        listingId: string;
    }>;
    create(args: Prisma.ShareTokenCreateArgs): Promise<{
        id: string;
        mintAddress: string;
        indexNumber: number;
        metadataUri: string | null;
        listingId: string;
    }>;
    update(args: Prisma.ShareTokenUpdateArgs): Promise<{
        id: string;
        mintAddress: string;
        indexNumber: number;
        metadataUri: string | null;
        listingId: string;
    }>;
    delete(args: Prisma.ShareTokenDeleteArgs): Promise<{
        id: string;
        mintAddress: string;
        indexNumber: number;
        metadataUri: string | null;
        listingId: string;
    }>;
    count(args?: Prisma.ShareTokenCountArgs): Promise<number>;
    upsert(args: Prisma.ShareTokenUpsertArgs): Promise<{
        id: string;
        mintAddress: string;
        indexNumber: number;
        metadataUri: string | null;
        listingId: string;
    }>;
}
