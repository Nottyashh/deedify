import { z } from 'zod';
export declare const SellDto: z.ZodObject<{
    shareMint: z.ZodString;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    price?: number;
    shareMint?: string;
}, {
    price?: number;
    shareMint?: string;
}>;
export type SellDto = z.infer<typeof SellDto>;
