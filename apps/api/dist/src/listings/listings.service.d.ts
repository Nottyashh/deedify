import { ListingsRepository } from './listings.repository';
import { ValuationService } from '../valuation/valuation.service';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
export declare class ListingsService {
    private readonly listingsRepository;
    private readonly valuationService;
    private readonly logger;
    constructor(listingsRepository: ListingsRepository, valuationService: ValuationService);
    create(ownerId: string, data: {
        title: string;
        description: string;
        locationText: string;
        geoJson?: any;
        parcelSize: number;
        coordinatePolicy: boolean;
        coordinatePolicyNote?: string;
        totalShares: number;
        pricePerShare: number;
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
    findAll(query: PaginationDto & {
        search?: string;
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        minSize?: number;
        maxSize?: number;
        status?: 'PENDING' | 'LIVE' | 'PAUSED' | 'CLOSED';
    }): Promise<PaginatedResponse<any>>;
    findPublic(query: PaginationDto & {
        search?: string;
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        minSize?: number;
        maxSize?: number;
    }): Promise<PaginatedResponse<any>>;
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
    update(id: string, userId: string, data: {
        title?: string;
        description?: string;
        locationText?: string;
        geoJson?: any;
        parcelSize?: number;
        coordinatePolicy?: boolean;
        coordinatePolicyNote?: string;
        totalShares?: number;
        pricePerShare?: number;
        status?: 'PENDING' | 'LIVE' | 'PAUSED' | 'CLOSED';
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
    updateStatus(id: string, status: 'PENDING' | 'LIVE' | 'PAUSED' | 'CLOSED'): Promise<{
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
