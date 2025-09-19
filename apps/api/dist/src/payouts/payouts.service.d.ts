import { PayoutsRepository } from './payouts.repository';
import { ListingsRepository } from '../listings/listings.repository';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
export declare class PayoutsService {
    private readonly payoutsRepository;
    private readonly listingsRepository;
    private readonly logger;
    constructor(payoutsRepository: PayoutsRepository, listingsRepository: ListingsRepository);
    triggerPayout(data: {
        listingId: string;
        reason: 'DIVIDEND' | 'BUYOUT';
        amount?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        listingId: string;
        txSignature: string | null;
        userId: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        reason: import("@prisma/client").$Enums.PayoutReason;
    }>;
    getPayouts(query: PaginationDto): Promise<PaginatedResponse<any>>;
    getListingPayouts(listingId: string, query: PaginationDto): Promise<PaginatedResponse<any>>;
    getUserPayouts(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>>;
    getStats(): Promise<{
        total: {
            payouts: number;
            amount: number | import("@prisma/client/runtime/library").Decimal;
        };
        byType: {
            dividends: number;
            buyouts: number;
        };
    }>;
}
