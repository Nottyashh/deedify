import { z } from 'zod';
export declare const MintCollectionDto: z.ZodObject<{
    listingId: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
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
    name?: string;
    description?: string;
    listingId?: string;
    image?: string;
    attributes?: {
        value?: string | number;
        trait_type?: string;
    }[];
}, {
    name?: string;
    description?: string;
    listingId?: string;
    image?: string;
    attributes?: {
        value?: string | number;
        trait_type?: string;
    }[];
}>;
export type MintCollectionDto = z.infer<typeof MintCollectionDto>;
