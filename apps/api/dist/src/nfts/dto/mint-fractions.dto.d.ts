import { z } from 'zod';
export declare const MintFractionsDto: z.ZodObject<{
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
export type MintFractionsDto = z.infer<typeof MintFractionsDto>;
