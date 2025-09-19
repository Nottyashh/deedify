import { z } from 'zod';
export declare const UpdateListingDto: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    locationText: z.ZodOptional<z.ZodString>;
    geoJson: z.ZodOptional<z.ZodAny>;
    parcelSize: z.ZodOptional<z.ZodNumber>;
    coordinatePolicy: z.ZodOptional<z.ZodBoolean>;
    coordinatePolicyNote: z.ZodOptional<z.ZodString>;
    totalShares: z.ZodOptional<z.ZodNumber>;
    pricePerShare: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "LIVE", "PAUSED", "CLOSED"]>>;
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
    status?: "PENDING" | "LIVE" | "PAUSED" | "CLOSED";
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
    status?: "PENDING" | "LIVE" | "PAUSED" | "CLOSED";
}>;
export type UpdateListingDto = z.infer<typeof UpdateListingDto>;
