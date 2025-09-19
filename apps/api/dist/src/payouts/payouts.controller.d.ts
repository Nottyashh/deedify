import { z } from 'zod';
import { PayoutsService } from './payouts.service';
import { PaginationDto } from '../common/dto/pagination.dto';
declare const TriggerPayoutDto: z.ZodObject<{
    listingId: z.ZodString;
    reason: z.ZodEnum<["DIVIDEND", "BUYOUT"]>;
    amount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    listingId?: string;
    amount?: number;
    reason?: "DIVIDEND" | "BUYOUT";
}, {
    listingId?: string;
    amount?: number;
    reason?: "DIVIDEND" | "BUYOUT";
}>;
type TriggerPayoutDto = z.infer<typeof TriggerPayoutDto>;
export declare class PayoutsController {
    private readonly payoutsService;
    constructor(payoutsService: PayoutsService);
    triggerPayout(triggerPayoutDto: TriggerPayoutDto): Promise<{
        id: string;
        createdAt: Date;
        listingId: string;
        txSignature: string | null;
        userId: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        reason: import("@prisma/client").$Enums.PayoutReason;
    }>;
    getPayouts(query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
    getListingPayouts(listingId: string, query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
    getUserPayouts(userId: string, query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
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
export {};
