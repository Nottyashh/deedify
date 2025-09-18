import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { ListingsRepository } from './listings.repository';
import { ValuationService } from '../valuation/valuation.service';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class ListingsService {
  private readonly logger = new Logger(ListingsService.name);

  constructor(
    private readonly listingsRepository: ListingsRepository,
    private readonly valuationService: ValuationService,
  ) {}

  async create(ownerId: string, data: {
    title: string;
    description: string;
    locationText: string;
    geoJson?: any;
    parcelSize: number;
    coordinatePolicy: boolean;
    coordinatePolicyNote?: string;
    totalShares: number;
    pricePerShare: number;
  }) {
    // Validate coordinate policy note
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

    // Trigger initial valuation
    try {
      await this.valuationService.estimateValue({
        location: data.locationText,
        parcelSize: data.parcelSize,
        geoJson: data.geoJson,
      });
    } catch (error) {
      this.logger.warn(`Failed to get initial valuation for listing ${listing.id}:`, error.message);
    }

    return listing;
  }

  async findAll(query: PaginationDto & {
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
    status?: 'PENDING' | 'LIVE' | 'PAUSED' | 'CLOSED';
  }): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder, ...filters } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

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
      if (filters.minPrice) where.pricePerShare.gte = filters.minPrice;
      if (filters.maxPrice) where.pricePerShare.lte = filters.maxPrice;
    }

    if (filters.minSize || filters.maxSize) {
      where.parcelSize = {};
      if (filters.minSize) where.parcelSize.gte = filters.minSize;
      if (filters.maxSize) where.parcelSize.lte = filters.maxSize;
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

  async findPublic(query: PaginationDto & {
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
  }): Promise<PaginatedResponse<any>> {
    // Only show LIVE listings for public access
    return this.findAll({
      ...query,
      status: 'LIVE',
    });
  }

  async findOne(id: string) {
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
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  async update(id: string, userId: string, data: {
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
  }) {
    const listing = await this.listingsRepository.findUnique({
      where: { id },
      select: {
        id: true,
        ownerId: true,
        status: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Check ownership or admin access
    if (listing.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    // Prevent certain updates on LIVE listings
    if (listing.status === 'LIVE' && (data.totalShares || data.pricePerShare)) {
      throw new BadRequestException('Cannot modify shares or price on live listings');
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

  async updateStatus(id: string, status: 'PENDING' | 'LIVE' | 'PAUSED' | 'CLOSED') {
    const listing = await this.listingsRepository.findUnique({
      where: { id },
      select: { id: true, title: true, status: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
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

  async getShares(id: string) {
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
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  async getValuation(id: string) {
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
      throw new NotFoundException('Listing not found');
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
    } catch (error) {
      this.logger.error(`Failed to get valuation for listing ${id}:`, error);
      throw new BadRequestException('Failed to get valuation');
    }
  }

  async updateValuation(id: string) {
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
      throw new NotFoundException('Listing not found');
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
    } catch (error) {
      this.logger.error(`Failed to update valuation for listing ${id}:`, error);
      throw new BadRequestException('Failed to update valuation');
    }
  }
}