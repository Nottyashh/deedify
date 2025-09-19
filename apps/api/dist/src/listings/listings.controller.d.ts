import { z } from 'zod';
import { ListingsService } from './listings.service';
declare const CreateListingDto: z.ZodObject<{
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
declare const UpdateListingDto: z.ZodObject<{
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
declare const SearchListingsDto: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    minSize: z.ZodOptional<z.ZodNumber>;
    maxSize: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "LIVE", "PAUSED", "CLOSED"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "PENDING" | "LIVE" | "PAUSED" | "CLOSED";
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
}, {
    status?: "PENDING" | "LIVE" | "PAUSED" | "CLOSED";
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
}>;
type CreateListingDto = z.infer<typeof CreateListingDto>;
type UpdateListingDto = z.infer<typeof UpdateListingDto>;
type SearchListingsDto = z.infer<typeof SearchListingsDto>;
export declare class ListingsController {
    private readonly listingsService;
    constructor(listingsService: ListingsService);
    create(req: any, createListingDto: CreateListingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        locationText: string;
        geoJson: import("@prisma/client/runtime/library").JsonValue | null;
        parcelSize: import("@prisma/client/runtime/library").Decimal;
        coordinatePolicy: boolean;
        coordinatePolicyNote: string | null;
        totalShares: number;
        pricePerShare: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.ListingStatus;
        collectionMint: string | null;
        ownerId: string;
    }>;
    findAll(query: SearchListingsDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
    findPublic(query: SearchListingsDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        locationText: string;
        geoJson: import("@prisma/client/runtime/library").JsonValue | null;
        parcelSize: import("@prisma/client/runtime/library").Decimal;
        coordinatePolicy: boolean;
        coordinatePolicyNote: string | null;
        totalShares: number;
        pricePerShare: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.ListingStatus;
        collectionMint: string | null;
        ownerId: string;
    }>;
    update(id: string, req: any, updateListingDto: UpdateListingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        locationText: string;
        geoJson: import("@prisma/client/runtime/library").JsonValue | null;
        parcelSize: import("@prisma/client/runtime/library").Decimal;
        coordinatePolicy: boolean;
        coordinatePolicyNote: string | null;
        totalShares: number;
        pricePerShare: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.ListingStatus;
        collectionMint: string | null;
        ownerId: string;
    }>;
    updateStatus(id: string, body: {
        status: 'PENDING' | 'LIVE' | 'PAUSED' | 'CLOSED';
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        locationText: string;
        geoJson: import("@prisma/client/runtime/library").JsonValue | null;
        parcelSize: import("@prisma/client/runtime/library").Decimal;
        coordinatePolicy: boolean;
        coordinatePolicyNote: string | null;
        totalShares: number;
        pricePerShare: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.ListingStatus;
        collectionMint: string | null;
        ownerId: string;
    }>;
    getShares(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        locationText: string;
        geoJson: import("@prisma/client/runtime/library").JsonValue | null;
        parcelSize: import("@prisma/client/runtime/library").Decimal;
        coordinatePolicy: boolean;
        coordinatePolicyNote: string | null;
        totalShares: number;
        pricePerShare: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.ListingStatus;
        collectionMint: string | null;
        ownerId: string;
    }>;
    getValuation(id: string): Promise<{
        listing: {
            id: string;
            title: string;
            currentPrice: import("@prisma/client/runtime/library").Decimal;
        };
        valuation: import("../valuation/valuation.service").ValuationResponse;
    }>;
    updateValuation(id: string): Promise<{
        listing: {
            id: string;
            title: string;
        };
        valuation: import("../valuation/valuation.service").ValuationResponse;
    }>;
}
export {};
