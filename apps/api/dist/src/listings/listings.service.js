"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ListingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const listings_repository_1 = require("./listings.repository");
const valuation_service_1 = require("../valuation/valuation.service");
let ListingsService = ListingsService_1 = class ListingsService {
    constructor(listingsRepository, valuationService) {
        this.listingsRepository = listingsRepository;
        this.valuationService = valuationService;
        this.logger = new common_1.Logger(ListingsService_1.name);
    }
    async create(ownerId, data) {
        if (data.coordinatePolicy && !data.coordinatePolicyNote) {
            data.coordinatePolicyNote = 'Buyers own a part of the parcel without exact coordinates';
        }
        const listing = await this.listingsRepository.create({
            data: {
                ...data,
                ownerId,
                status: 'PENDING',
                coordinatePolicyNote: data.coordinatePolicyNote || 'Buyers own a part of the parcel without exact coordinates',
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        this.logger.log(`New listing created: ${listing.title} by ${listing.owner.email}`);
        try {
            await this.valuationService.estimateValue({
                location: data.locationText,
                parcelSize: data.parcelSize,
                geoJson: data.geoJson,
            });
        }
        catch (error) {
            this.logger.warn(`Failed to get initial valuation for listing ${listing.id}:`, error.message);
        }
        return listing;
    }
    async findAll(query) {
        const { page, limit, sortBy, sortOrder, ...filters } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { locationText: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        if (filters.location) {
            where.locationText = { contains: filters.location, mode: 'insensitive' };
        }
        if (filters.minPrice || filters.maxPrice) {
            where.pricePerShare = {};
            if (filters.minPrice)
                where.pricePerShare.gte = filters.minPrice;
            if (filters.maxPrice)
                where.pricePerShare.lte = filters.maxPrice;
        }
        if (filters.minSize || filters.maxSize) {
            where.parcelSize = {};
            if (filters.minSize)
                where.parcelSize.gte = filters.minSize;
            if (filters.maxSize)
                where.parcelSize.lte = filters.maxSize;
        }
        if (filters.status) {
            where.status = filters.status;
        }
        const [listings, total] = await Promise.all([
            this.listingsRepository.findMany({
                where,
                skip,
                take: limit,
                orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
                include: {
                    owner: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                    _count: {
                        select: {
                            shareTokens: true,
                            orders: true,
                        },
                    },
                },
            }),
            this.listingsRepository.count({ where }),
        ]);
        return {
            data: listings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            },
        };
    }
    async findPublic(query) {
        return this.findAll({
            ...query,
            status: 'LIVE',
        });
    }
    async findOne(id) {
        const listing = await this.listingsRepository.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                shareTokens: {
                    select: {
                        id: true,
                        mintAddress: true,
                        indexNumber: true,
                        metadataUri: true,
                    },
                },
                _count: {
                    select: {
                        shareTokens: true,
                        orders: true,
                        proposals: true,
                    },
                },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        return listing;
    }
    async update(id, userId, data) {
        const listing = await this.listingsRepository.findUnique({
            where: { id },
            select: {
                id: true,
                ownerId: true,
                status: true,
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own listings');
        }
        if (listing.status === 'LIVE' && (data.totalShares || data.pricePerShare)) {
            throw new common_1.BadRequestException('Cannot modify shares or price on live listings');
        }
        const updatedListing = await this.listingsRepository.update({
            where: { id },
            data,
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        this.logger.log(`Listing updated: ${updatedListing.title}`);
        return updatedListing;
    }
    async updateStatus(id, status) {
        const listing = await this.listingsRepository.findUnique({
            where: { id },
            select: { id: true, title: true, status: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const updatedListing = await this.listingsRepository.update({
            where: { id },
            data: { status },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        this.logger.log(`Listing status updated: ${updatedListing.title} -> ${status}`);
        return updatedListing;
    }
    async getShares(id) {
        const listing = await this.listingsRepository.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                shareTokens: {
                    select: {
                        id: true,
                        mintAddress: true,
                        indexNumber: true,
                        metadataUri: true,
                    },
                    orderBy: { indexNumber: 'asc' },
                },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        return listing;
    }
    async getValuation(id) {
        const listing = await this.listingsRepository.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                locationText: true,
                parcelSize: true,
                geoJson: true,
                pricePerShare: true,
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        try {
            const valuation = await this.valuationService.estimateValue({
                location: listing.locationText,
                parcelSize: listing.parcelSize,
                geoJson: listing.geoJson,
            });
            return {
                listing: {
                    id: listing.id,
                    title: listing.title,
                    currentPrice: listing.pricePerShare,
                },
                valuation,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get valuation for listing ${id}:`, error);
            throw new common_1.BadRequestException('Failed to get valuation');
        }
    }
    async updateValuation(id) {
        const listing = await this.listingsRepository.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                locationText: true,
                parcelSize: true,
                geoJson: true,
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        try {
            const valuation = await this.valuationService.estimateValue({
                location: listing.locationText,
                parcelSize: listing.parcelSize,
                geoJson: listing.geoJson,
            });
            this.logger.log(`Valuation updated for listing ${id}: ${valuation.fairPricePerShare}`);
            return {
                listing: {
                    id: listing.id,
                    title: listing.title,
                },
                valuation,
            };
        }
        catch (error) {
            this.logger.error(`Failed to update valuation for listing ${id}:`, error);
            throw new common_1.BadRequestException('Failed to update valuation');
        }
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = ListingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [listings_repository_1.ListingsRepository,
        valuation_service_1.ValuationService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map