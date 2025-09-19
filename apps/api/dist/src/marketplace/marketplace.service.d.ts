import { MarketplaceRepository } from './marketplace.repository';
import { NftsRepository } from '../nfts/nfts.repository';
import { ListingsRepository } from '../listings/listings.repository';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
export declare class MarketplaceService {
    private readonly marketplaceRepository;
    private readonly nftsRepository;
    private readonly listingsRepository;
    private readonly solanaService;
    private readonly logger;
    constructor(marketplaceRepository: MarketplaceRepository, nftsRepository: NftsRepository, listingsRepository: ListingsRepository, solanaService: any);
    listShare(userId: string, data: {
        shareMint: string;
        price: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        type: import("@prisma/client").$Enums.OrderType;
        listingId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        txSignature: string | null;
        shareMint: string;
        sellerId: string | null;
        buyerId: string | null;
    }>;
    buyShare(userId: string, data: {
        shareMint: string;
        buyerWallet: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        type: import("@prisma/client").$Enums.OrderType;
        listingId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        txSignature: string | null;
        shareMint: string;
        sellerId: string | null;
        buyerId: string | null;
    }>;
    sellShare(userId: string, data: {
        shareMint: string;
        price: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        type: import("@prisma/client").$Enums.OrderType;
        listingId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        txSignature: string | null;
        shareMint: string;
        sellerId: string | null;
        buyerId: string | null;
    }>;
    cancelOrder(userId: string, data: {
        orderId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        type: import("@prisma/client").$Enums.OrderType;
        listingId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        txSignature: string | null;
        shareMint: string;
        sellerId: string | null;
        buyerId: string | null;
    }>;
    getUserOrders(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>>;
    getOrder(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        type: import("@prisma/client").$Enums.OrderType;
        listingId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        txSignature: string | null;
        shareMint: string;
        sellerId: string | null;
        buyerId: string | null;
    }>;
    getListings(query: PaginationDto): Promise<PaginatedResponse<any>>;
    getListingShares(listingId: string, query: PaginationDto): Promise<PaginatedResponse<any>>;
    getShareHistory(shareMint: string, query: PaginationDto): Promise<PaginatedResponse<any>>;
    getStats(): Promise<{
        orders: {
            total: number;
            open: number;
            filled: number;
            cancelled: number;
        };
        volume: {
            total: number | import("@prisma/client/runtime/library").Decimal;
        };
        listings: {
            active: number;
        };
    }>;
    private executeTrade;
}
