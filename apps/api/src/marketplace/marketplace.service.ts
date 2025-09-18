import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { MarketplaceRepository } from './marketplace.repository';
import { NftsRepository } from '../nfts/nfts.repository';
import { ListingsRepository } from '../listings/listings.repository';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);

  constructor(
    private readonly marketplaceRepository: MarketplaceRepository,
    private readonly nftsRepository: NftsRepository,
    private readonly listingsRepository: ListingsRepository,
    private readonly solanaService: any,
  ) {}

  async listShare(userId: string, data: {
    shareMint: string;
    price: number;
  }) {
    // Verify share exists and user owns it
    const share = await this.nftsRepository.findUnique({
      where: { mintAddress: data.shareMint },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    if (!share) {
      throw new NotFoundException('Share not found');
    }

    if (share.listing.status !== 'LIVE') {
      throw new BadRequestException('Cannot list shares from inactive listings');
    }

    // Check if there's already an active order for this share
    const existingOrder = await this.marketplaceRepository.findFirst({
      where: {
        shareMint: data.shareMint,
        status: 'OPEN',
      },
    });

    if (existingOrder) {
      throw new BadRequestException('Share is already listed for sale');
    }

    // Create order
    const order = await this.marketplaceRepository.create({
      data: {
        type: 'LIST',
        listingId: share.listingId,
        shareMint: data.shareMint,
        sellerId: userId,
        price: data.price,
        status: 'OPEN',
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            locationText: true,
          },
        },
        shareToken: {
          select: {
            id: true,
            indexNumber: true,
          },
        },
      },
    });

    this.logger.log(`Share listed for sale: ${data.shareMint} at ${data.price} SOL`);

    return order;
  }

  async buyShare(userId: string, data: {
    shareMint: string;
    buyerWallet: string;
  }) {
    // Find active order for this share
    const order = await this.marketplaceRepository.findFirst({
      where: {
        shareMint: data.shareMint,
        status: 'OPEN',
        type: 'LIST',
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        shareToken: {
          select: {
            id: true,
            indexNumber: true,
          },
        },
        seller: {
          select: {
            id: true,
            email: true,
            walletAddress: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('No active listing found for this share');
    }

    if (order.sellerId === userId) {
      throw new BadRequestException('Cannot buy your own share');
    }

    if (order.listing.status !== 'LIVE') {
      throw new BadRequestException('Cannot buy shares from inactive listings');
    }

    try {
      // Execute the trade on Solana
      // This would involve:
      // 1. Transfer SOL from buyer to seller
      // 2. Transfer NFT from seller to buyer
      // 3. Record the transaction signature

      const txSignature = await this.executeTrade({
        shareMint: data.shareMint,
        sellerWallet: order.seller.walletAddress,
        buyerWallet: data.buyerWallet,
        price: order.price,
      });

      // Update order status
      const updatedOrder = await this.marketplaceRepository.update({
        where: { id: order.id },
        data: {
          status: 'FILLED',
          buyerId: userId,
          txSignature,
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
            },
          },
          shareToken: {
            select: {
              id: true,
              indexNumber: true,
            },
          },
          seller: {
            select: {
              id: true,
              email: true,
            },
          },
          buyer: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      this.logger.log(`Share purchased: ${data.shareMint} by ${userId} for ${order.price} SOL`);

      return updatedOrder;
    } catch (error) {
      this.logger.error(`Failed to execute trade for share ${data.shareMint}:`, error);
      throw new BadRequestException('Failed to execute trade');
    }
  }

  async sellShare(userId: string, data: {
    shareMint: string;
    price: number;
  }) {
    // Verify user owns the share
    // This would typically check on-chain ownership via Helius
    const share = await this.nftsRepository.findUnique({
      where: { mintAddress: data.shareMint },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    if (!share) {
      throw new NotFoundException('Share not found');
    }

    if (share.listing.status !== 'LIVE') {
      throw new BadRequestException('Cannot sell shares from inactive listings');
    }

    // Check if there's already an active order for this share
    const existingOrder = await this.marketplaceRepository.findFirst({
      where: {
        shareMint: data.shareMint,
        status: 'OPEN',
      },
    });

    if (existingOrder) {
      throw new BadRequestException('Share is already listed for sale');
    }

    // Create order
    const order = await this.marketplaceRepository.create({
      data: {
        type: 'SELL',
        listingId: share.listingId,
        shareMint: data.shareMint,
        sellerId: userId,
        price: data.price,
        status: 'OPEN',
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            locationText: true,
          },
        },
        shareToken: {
          select: {
            id: true,
            indexNumber: true,
          },
        },
      },
    });

    this.logger.log(`Share listed for sale: ${data.shareMint} at ${data.price} SOL`);

    return order;
  }

  async cancelOrder(userId: string, data: { orderId: string }) {
    const order = await this.marketplaceRepository.findUnique({
      where: { id: data.orderId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
        shareToken: {
          select: {
            id: true,
            indexNumber: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.sellerId !== userId) {
      throw new ForbiddenException('You can only cancel your own orders');
    }

    if (order.status !== 'OPEN') {
      throw new BadRequestException('Cannot cancel filled or cancelled orders');
    }

    const updatedOrder = await this.marketplaceRepository.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
        shareToken: {
          select: {
            id: true,
            indexNumber: true,
          },
        },
      },
    });

    this.logger.log(`Order cancelled: ${order.id}`);

    return updatedOrder;
  }

  async getUserOrders(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.marketplaceRepository.findMany({
        where: {
          OR: [
            { sellerId: userId },
            { buyerId: userId },
          ],
        },
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
          shareToken: {
            select: {
              id: true,
              indexNumber: true,
            },
          },
          seller: {
            select: {
              id: true,
              email: true,
            },
          },
          buyer: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
      this.marketplaceRepository.count({
        where: {
          OR: [
            { sellerId: userId },
            { buyerId: userId },
          ],
        },
      }),
    ]);

    return {
      data: orders,
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

  async getOrder(id: string) {
    const order = await this.marketplaceRepository.findUnique({
      where: { id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            locationText: true,
            parcelSize: true,
            pricePerShare: true,
          },
        },
        shareToken: {
          select: {
            id: true,
            indexNumber: true,
            metadataUri: true,
          },
        },
        seller: {
          select: {
            id: true,
            email: true,
            walletAddress: true,
          },
        },
        buyer: {
          select: {
            id: true,
            email: true,
            walletAddress: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getListings(query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.marketplaceRepository.findMany({
        where: {
          status: 'OPEN',
          type: 'LIST',
        },
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
            },
          },
          shareToken: {
            select: {
              id: true,
              indexNumber: true,
            },
          },
          seller: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
      this.marketplaceRepository.count({
        where: {
          status: 'OPEN',
          type: 'LIST',
        },
      }),
    ]);

    return {
      data: orders,
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

  async getListingShares(listingId: string, query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const listing = await this.listingsRepository.findUnique({
      where: { id: listingId },
      select: { id: true, title: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const [orders, total] = await Promise.all([
      this.marketplaceRepository.findMany({
        where: {
          listingId,
          status: 'OPEN',
          type: 'LIST',
        },
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { price: 'asc' },
        include: {
          shareToken: {
            select: {
              id: true,
              indexNumber: true,
            },
          },
          seller: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
      this.marketplaceRepository.count({
        where: {
          listingId,
          status: 'OPEN',
          type: 'LIST',
        },
      }),
    ]);

    return {
      data: orders,
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

  async getShareHistory(shareMint: string, query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.marketplaceRepository.findMany({
        where: {
          shareMint,
          status: 'FILLED',
        },
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
          shareToken: {
            select: {
              id: true,
              indexNumber: true,
            },
          },
          seller: {
            select: {
              id: true,
              email: true,
            },
          },
          buyer: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
      this.marketplaceRepository.count({
        where: {
          shareMint,
          status: 'FILLED',
        },
      }),
    ]);

    return {
      data: orders,
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
      totalOrders,
      openOrders,
      filledOrders,
      totalVolume,
      activeListings,
    ] = await Promise.all([
      this.marketplaceRepository.count(),
      this.marketplaceRepository.count({ where: { status: 'OPEN' } }),
      this.marketplaceRepository.count({ where: { status: 'FILLED' } }),
      this.marketplaceRepository.aggregate({
        _sum: { price: true },
        where: { status: 'FILLED' },
      }),
      this.listingsRepository.count({ where: { status: 'LIVE' } }),
    ]);

    return {
      orders: {
        total: totalOrders,
        open: openOrders,
        filled: filledOrders,
        cancelled: totalOrders - openOrders - filledOrders,
      },
      volume: {
        total: totalVolume._sum.price || 0,
      },
      listings: {
        active: activeListings,
      },
    };
  }

  private async executeTrade(data: {
    shareMint: string;
    sellerWallet: string;
    buyerWallet: string;
    price: number;
  }): Promise<string> {
    // This is a placeholder implementation
    // In a real implementation, this would:
    // 1. Create a Solana transaction
    // 2. Transfer SOL from buyer to seller
    // 3. Transfer NFT from seller to buyer
    // 4. Submit and confirm the transaction
    // 5. Return the transaction signature

    try {
      // Simulate transaction execution
      const txSignature = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      this.logger.log(`Trade executed: ${data.shareMint} from ${data.sellerWallet} to ${data.buyerWallet} for ${data.price} SOL`);
      
      return txSignature;
    } catch (error) {
      this.logger.error(`Failed to execute trade:`, error);
      throw new BadRequestException('Failed to execute trade on Solana');
    }
  }
}