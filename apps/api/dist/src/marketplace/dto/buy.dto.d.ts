import { z } from 'zod';
export declare const BuyDto: z.ZodObject<{
    shareMint: z.ZodString;
    buyerWallet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    shareMint?: string;
    buyerWallet?: string;
}, {
    shareMint?: string;
    buyerWallet?: string;
}>;
export type BuyDto = z.infer<typeof BuyDto>;
