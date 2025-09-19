import { z } from 'zod';
export declare const TriggerPayoutDto: z.ZodObject<{
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
export type TriggerPayoutDto = z.infer<typeof TriggerPayoutDto>;
