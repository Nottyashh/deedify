import { z } from 'zod';
export declare const CreateListingDto: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    locationText: z.ZodString;
    geoJson: z.ZodOptional<z.ZodAny>;
    parcelSize: z.ZodNumber;
    coordinatePolicy: z.ZodDefault<z.ZodBoolean>;
    coordinatePolicyNote: z.ZodOptional<z.ZodString>;
    totalShares: z.ZodDefault<z.ZodNumber>;
    pricePerShare: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    title?: string;
    description?: string;
    locationText?: string;
    geoJson?: any;
    parcelSize?: number;
    coordinatePolicy?: boolean;
    coordinatePolicyNote?: string;
    totalShares?: number;
    pricePerShare?: number;
}, {
    title?: string;
    description?: string;
    locationText?: string;
    geoJson?: any;
    parcelSize?: number;
    coordinatePolicy?: boolean;
    coordinatePolicyNote?: string;
    totalShares?: number;
    pricePerShare?: number;
}>;
export type CreateListingDto = z.infer<typeof CreateListingDto>;
