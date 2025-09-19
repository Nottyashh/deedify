import { z } from 'zod';
export declare const ListDto: z.ZodObject<{
    shareMint: z.ZodString;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    price?: number;
    shareMint?: string;
}, {
    price?: number;
    shareMint?: string;
}>;
export type ListDto = z.infer<typeof ListDto>;
