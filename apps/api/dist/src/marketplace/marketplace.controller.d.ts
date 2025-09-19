import { z } from 'zod';
import { MarketplaceService } from './marketplace.service';
import { PaginationDto } from '../common/dto/pagination.dto';
declare const ListShareDto: z.ZodObject<{
    shareMint: z.ZodString;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    price?: number;
    shareMint?: string;
}, {
    price?: number;
    shareMint?: string;
}>;
declare const BuyShareDto: z.ZodObject<{
    shareMint: z.ZodString;
    buyerWallet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    shareMint?: string;
    buyerWallet?: string;
}, {
    shareMint?: string;
    buyerWallet?: string;
}>;
declare const SellShareDto: z.ZodObject<{
    shareMint: z.ZodString;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    price?: number;
    shareMint?: string;
}, {
    price?: number;
    shareMint?: string;
}>;
declare const CancelOrderDto: z.ZodObject<{
    orderId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orderId?: string;
}, {
    orderId?: string;
}>;
type ListShareDto = z.infer<typeof ListShareDto>;
type BuyShareDto = z.infer<typeof BuyShareDto>;
type SellShareDto = z.infer<typeof SellShareDto>;
type CancelOrderDto = z.infer<typeof CancelOrderDto>;
export declare class MarketplaceController {
    private readonly marketplaceService;
    constructor(marketplaceService: MarketplaceService);
    listShare(req: any, listShareDto: ListShareDto): Promise<{
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
    buyShare(req: any, buyShareDto: BuyShareDto): Promise<{
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
    sellShare(req: any, sellShareDto: SellShareDto): Promise<{
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
    cancelOrder(req: any, cancelOrderDto: CancelOrderDto): Promise<{
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
    getUserOrders(req: any, query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
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
    getListings(query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
    getListingShares(listingId: string, query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
    getShareHistory(shareMint: string, query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
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
}
export {};
