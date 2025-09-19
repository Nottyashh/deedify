import { Injectable, Logger } from '@nestjs/common';
import { HoldingsRepository } from './holdings.repository';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class HoldingsService {
  private readonly logger = new Logger(HoldingsService.name);

  constructor(private readonly holdingsRepository: HoldingsRepository) {}

  async getUserHoldings(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const [holdings, total] = await Promise.all([
      this.holdingsRepository.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              locationText: true,
              parcelSize: true,
              pricePerShare: true,
              totalShares: true,
            },
          },
        },
      }),
      this.holdingsRepository.count({ where: { userId } }),
    ]);

    // Calculate current values (for now, use same as invested - in real app, this would be dynamic)
    const enrichedHoldings = holdings.map(holding => ({
      ...holding,
      currentValue: holding.totalInvested, // TODO: Calculate based on current market price
    }));

    return {
      data: enrichedHoldings,
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

  async createOrUpdateHolding(data: {
    userId: string;
    listingId: string;
    shares: number;
    totalInvested: number;
  }) {
    const holding = await this.holdingsRepository.upsert({
      where: {
        userId_listingId: {
          userId: data.userId,
          listingId: data.listingId,
        },
      },
      create: {
        userId: data.userId,
        listingId: data.listingId,
        shares: data.shares,
        totalInvested: data.totalInvested,
      },
      update: {
        shares: {
          increment: data.shares,
        },
        totalInvested: {
          increment: data.totalInvested,
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    this.logger.log(`Holding updated: ${data.shares} shares of ${holding.listing.title} for user ${data.userId}`);

    return holding;
  }

  async getHoldingByUserAndListing(userId: string, listingId: string) {
    return this.holdingsRepository.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            locationText: true,
            pricePerShare: true,
          },
        },
      },
    });
  }
}