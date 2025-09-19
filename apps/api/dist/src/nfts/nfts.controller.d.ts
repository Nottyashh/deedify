import { z } from 'zod';
import { NftsService } from './nfts.service';
import { PaginationDto } from '../common/dto/pagination.dto';
declare const MintCollectionDto: z.ZodObject<{
    listingId: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    attributes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        trait_type: z.ZodString;
        value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, "strip", z.ZodTypeAny, {
        value?: string | number;
        trait_type?: string;
    }, {
        value?: string | number;
        trait_type?: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    description?: string;
    listingId?: string;
    image?: string;
    attributes?: {
        value?: string | number;
        trait_type?: string;
    }[];
}, {
    name?: string;
    description?: string;
    listingId?: string;
    image?: string;
    attributes?: {
        value?: string | number;
        trait_type?: string;
    }[];
}>;
declare const MintFractionsDto: z.ZodObject<{
    listingId: z.ZodString;
    totalShares: z.ZodNumber;
    baseName: z.ZodString;
    baseDescription: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    attributes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        trait_type: z.ZodString;
        value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, "strip", z.ZodTypeAny, {
        value?: string | number;
        trait_type?: string;
    }, {
        value?: string | number;
        trait_type?: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    totalShares?: number;
    listingId?: string;
    image?: string;
    attributes?: {
        value?: string | number;
        trait_type?: string;
    }[];
    baseName?: string;
    baseDescription?: string;
}, {
    totalShares?: number;
    listingId?: string;
    image?: string;
    attributes?: {
        value?: string | number;
        trait_type?: string;
    }[];
    baseName?: string;
    baseDescription?: string;
}>;
type MintCollectionDto = z.infer<typeof MintCollectionDto>;
type MintFractionsDto = z.infer<typeof MintFractionsDto>;
export declare class NftsController {
    private readonly nftsService;
    constructor(nftsService: NftsService);
    mintCollection(req: any, mintCollectionDto: MintCollectionDto): Promise<{
        listingId: string;
        collectionMint: any;
        metadataPda: any;
        metadata: {
            name: string;
            description: string;
            image: string;
            attributes: ({
                trait_type: string;
                value: string | number;
            } | {
                trait_type: string;
                value: import("@prisma/client/runtime/library").Decimal;
            })[];
            parcelSize: import("@prisma/client/runtime/library").Decimal;
            coordinatePolicy: boolean;
            coordinatePolicyNote: string;
            listingId: string;
        };
    }>;
    mintFractions(req: any, mintFractionsDto: MintFractionsDto): Promise<{
        listingId: string;
        totalShares: any;
        shareTokens: {
            id: any;
            mintAddress: any;
            indexNumber: any;
            metadataUri: any;
        }[];
    }>;
    getCollection(listingId: string): Promise<{
        listing: {
            id: string;
            title: string;
        };
        collection: {
            mint: string;
            metadata: any;
        };
    }>;
    getFractions(listingId: string, query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
    getMetadata(mintAddress: string): Promise<any>;
    getOwnedNfts(walletAddress: string, query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
    verifyCollection(listingId: string): Promise<{
        listing: {
            id: string;
            title: string;
        };
        collection: {
            mint: string;
            verified: any;
        };
    }>;
    getStats(listingId: string): Promise<{
        listing: {
            id: string;
            title: string;
        };
        stats: {
            totalShares: number;
            mintedShares: any;
            pendingShares: number;
            totalOrders: any;
            hasCollection: boolean;
        };
    }>;
}
export {};
