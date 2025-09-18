import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PayoutsRepository } from './payouts.repository';
import { ListingsRepository } from '../listings/listings.repository';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class PayoutsService {
  private readonly logger = new Logger(PayoutsService.name);

  constructor(
    private readonly payoutsRepository: PayoutsRepository,
    private readonly listingsRepository: ListingsRepository,
  ) {}

  async triggerPayout(data: {
    listingId: string;
    reason: 'DIVIDEND' | 'BUYOUT';
    amount?: number;
  }) {
    // Verify listing exists
    const listing = await this.listingsRepository.findUnique({
      where: { id: data.listingId },
      select: {
        id: true,
        title: true,
        totalShares: true,
        pricePerShare: true,
        status: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== 'LIVE') {
      throw new BadRequestException('Cannot trigger payouts for inactive listings');
    }

    // Calculate payout amount
    let payoutAmount = data.amount;
    if (!payoutAmount) {
      if (data.reason === 'DIVIDEND') {
        // Calculate dividend based on listing revenue
        payoutAmount = Number(listing.pricePerShare) * 0.1; // 10% of share price as dividend
      } else if (data.reason === 'BUYOUT') {
        // Calculate buyout based on current share price
        payoutAmount = Number(listing.pricePerShare);
      }
    }

    // Create payout record
    const payout = await this.payoutsRepository.create({
      data: {
        listingId: data.listingId,
        amount: payoutAmount,
        reason: data.reason,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            locationText: true,
          },
        },
      },
    });

    this.logger.log(`Payout triggered: ${data.reason} for listing ${listing.title} - ${payoutAmount} SOL`);

    // In a real implementation, you would:
    // 1. Calculate individual payouts for each shareholder
    // 2. Execute transactions on Solana
    // 3. Update payout record with transaction signature

    return payout;
  }

  async getPayouts(query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const [payouts, total] = await Promise.all([
      this.payoutsRepository.findMany({
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              locationText: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
      this.payoutsRepository.count(),
    ]);

    return {
      data: payouts,
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

  async getListingPayouts(listingId: string, query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const listing = await this.listingsRepository.findUnique({
      where: { id: listingId },
      select: { id: true, title: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const [payouts, total] = await Promise.all([
      this.payoutsRepository.findMany({
        where: { listingId },
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
      this.payoutsRepository.count({ where: { listingId } }),
    ]);

    return {
      data: payouts,
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

  async getUserPayouts(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const [payouts, total] = await Promise.all([
      this.payoutsRepository.findMany({
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
            },
          },
        },
      }),
      this.payoutsRepository.count({ where: { userId } }),
    ]);

    return {
      data: payouts,
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

  async getStats() {
    const [
      totalPayouts,
      totalAmount,
      dividendPayouts,
      buyoutPayouts,
    ] = await Promise.all([
      this.payoutsRepository.count(),
      this.payoutsRepository.aggregate({
        _sum: { amount: true },
      }),
      this.payoutsRepository.count({ where: { reason: 'DIVIDEND' } }),
      this.payoutsRepository.count({ where: { reason: 'BUYOUT' } }),
    ]);

    return {
      total: {
        payouts: totalPayouts,
        amount: totalAmount._sum.amount || 0,
      },
      byType: {
        dividends: dividendPayouts,
        buyouts: buyoutPayouts,
      },
    };
  }
}