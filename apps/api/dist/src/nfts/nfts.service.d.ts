import { NftsRepository } from './nfts.repository';
import { ListingsRepository } from '../listings/listings.repository';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
export declare class NftsService {
    private readonly nftsRepository;
    private readonly listingsRepository;
    private readonly solanaService;
    private readonly nftService;
    private readonly logger;
    constructor(nftsRepository: NftsRepository, listingsRepository: ListingsRepository, solanaService: any, nftService: any);
    mintCollection(ownerId: string, data: {
        listingId: string;
        name: string;
        description: string;
        image?: string;
        attributes?: Array<{
            trait_type: string;
            value: string | number;
        }>;
    }): Promise<{
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
    mintFractions(ownerId: string, data: {
        listingId: string;
        totalShares: number;
        baseName: string;
        baseDescription: string;
        image?: string;
        attributes?: Array<{
            trait_type: string;
            value: string | number;
        }>;
    }): Promise<{
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
    getFractions(listingId: string, query: PaginationDto): Promise<PaginatedResponse<any>>;
    getMetadata(mintAddress: string): Promise<any>;
    getOwnedNfts(walletAddress: string, query: PaginationDto): Promise<PaginatedResponse<any>>;
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
